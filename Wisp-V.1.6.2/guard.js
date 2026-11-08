// Wisp 1.5.0 — anti pop-ups / pop-unders / push + leurres anti-détection d'adblock (s'exécute dans la page)
(() => {
  const off = () => document.documentElement.hasAttribute("data-wisp-off");
  const note = () => dispatchEvent(new CustomEvent("wisp-blocked"));
  let last = { t: 0, el: null };
  addEventListener("click", e => {
    if (!e.isTrusted) return;
    const el = e.composedPath().find(n => n.tagName && /^(A|BUTTON|INPUT|SUMMARY|LABEL)$/.test(n.tagName));
    last = { t: performance.now(), el };
  }, true);
  const host = u => { try { return new URL(u, location.href).hostname; } catch { return ""; } };
  const allowed = url => {
    if (off()) return true;
    if (/^(blob|mailto|tel|sms):/i.test(String(url))) return true;
    const h = host(url);
    if (h === location.hostname) return true;
    const fresh = performance.now() - last.t < 1000, el = last.el;
    if (!fresh || !el) return false;
    if (el.tagName === "A") return host(el.href) === h;
    return el.tagName !== "LABEL";
  };

  // ---- window.open
  const wo = window.open;
  window.open = function (url, ...r) {
    if (allowed(url || "about:blank") && (url || off())) return wo.call(this, url, ...r);
    note(); return null;
  };

  // ---- <a>.click() et dispatchEvent(click) synthétiques (pop-unders « a.click() »)
  const trapped = a => (a.target === "_blank" || !a.isConnected) && !a.hasAttribute("download") && !allowed(a.href);
  const ac = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (trapped(this)) { note(); return; }
    return ac.call(this);
  };
  const de = EventTarget.prototype.dispatchEvent;
  EventTarget.prototype.dispatchEvent = function (e) {
    try {
      if (e && e.type === "click" && !e.isTrusted && this instanceof HTMLAnchorElement && trapped(this)) { note(); return false; }
    } catch {}
    return de.call(this, e);
  };

  // ---- notifications / push sans geste de l'utilisateur
  if (window.Notification) {
    const rp = Notification.requestPermission;
    Notification.requestPermission = function (cb) {
      if (!off() && !navigator.userActivation?.isActive) { note(); cb?.("denied"); return Promise.resolve("denied"); }
      return rp.apply(this, arguments);
    };
  }
  if (window.PushManager) {
    const sub = PushManager.prototype.subscribe;
    PushManager.prototype.subscribe = function () {
      if (!off() && !navigator.userActivation?.isActive) { note(); return Promise.reject(new DOMException("Bloqué par Wisp", "NotAllowedError")); }
      return sub.apply(this, arguments);
    };
  }

  // ---- leurres : les scripts de pub bloqués ne doivent pas faire croire à un adblock
  try {
    const chain = new Proxy(function () {}, {
      get: (t, k) => k === Symbol.toPrimitive ? () => "" : (k === "then" ? undefined : chain),
      apply: () => chain, construct: () => chain
    });
    let ab;
    Object.defineProperty(window, "adsbygoogle", {
      configurable: true, enumerable: true,
      get() { if (ab === undefined && !off()) { ab = []; ab.loaded = true; ab.push = () => 0; } return ab; },
      set(v) { ab = v; }
    });
    let gt;
    const makeGt = () => {
      const cmd = []; cmd.push = f => { try { typeof f === "function" && f.call(window); } catch {} return 1; };
      return new Proxy({ cmd, apiReady: true, pubadsReady: true }, {
        get: (t, k) => k in t ? t[k] : (k === "then" ? undefined : chain),
        set: (t, k, v) => { t[k] = v; return true; }
      });
    };
    Object.defineProperty(window, "googletag", {
      configurable: true, enumerable: true,
      get() { if (gt === undefined && !off()) gt = makeGt(); return gt; },
      set(v) { gt = v; }
    });
    window.canRunAds = true;
  } catch {}

  // ---- appâts anti-adblock (div vide « ad-banner », « adsbox »…) : on leur rend une taille non nulle
  const BAIT = /^(ads?|adsbox|ad[-_]?banner|banner[-_]?ads?|bannerad|adbanner|adsbygoogle|ad[-_]?(placement|slot|unit|container|wrapper|box|footer|header|space|block|zone)|pub_\d+x\d+|text[-_]?ads?|textads|doubleclick|advert\w*|sponsor\w*|google[-_]?ads?|carbonads|ad[-_]\w+)$/i;
  const isBait = el => {
    try {
      if (!el || el.nodeType !== 1 || off() || el.firstElementChild || (el.textContent || "").trim()) return false;
      const cn = typeof el.className === "string" ? el.className : "";
      return cn.split(/\s+/).concat(el.id || "").some(t => t && BAIT.test(t));
    } catch { return false; }
  };
  for (const [proto, prop] of [[HTMLElement.prototype, "offsetHeight"], [HTMLElement.prototype, "offsetWidth"],
                               [Element.prototype, "clientHeight"], [Element.prototype, "clientWidth"]]) {
    const d = Object.getOwnPropertyDescriptor(proto, prop);
    if (!d || !d.get) continue;
    Object.defineProperty(proto, prop, { ...d, get() { const v = d.get.call(this); return v === 0 && isBait(this) ? 1 : v; } });
  }
  const op = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetParent");
  if (op && op.get) Object.defineProperty(HTMLElement.prototype, "offsetParent", {
    ...op, get() { const v = op.get.call(this); return v === null && isBait(this) ? document.body : v; }
  });
  const gcs = window.getComputedStyle;
  window.getComputedStyle = function (el, ...r) {
    const cs = gcs.call(this, el, ...r);
    if (!isBait(el)) return cs;
    return new Proxy(cs, {
      get(t, k) {
        if (k === "display") return "block";
        if (k === "visibility") return "visible";
        if (k === "getPropertyValue") return p => p === "display" ? "block" : p === "visibility" ? "visible" : t.getPropertyValue(p);
        const v = Reflect.get(t, k, t);
        return typeof v === "function" ? v.bind(t) : v;
      }
    });
  };
})();
