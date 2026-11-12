// Wisp 1.6.3 — anti pop-ups / pop-unders / push + leurres anti-détection d'adblock, GPC/DNT, Privacy Sandbox, bruit canvas/audio/WebGL (s'exécute dans la page)
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

  // ======================================================================== 1.6.3
  const def = (o, k, d) => { try { Object.defineProperty(o, k, { configurable: true, enumerable: true, ...d }); } catch {} };
  const rm = (o, ks) => { if (o) for (const k of ks) { try { if (k in o) delete o[k]; } catch {} } };
  const getter = (o, k) => { try { return Object.getOwnPropertyDescriptor(o, k)?.get; } catch {} };

  // ---- signaux d'opt-out : Global Privacy Control + Do Not Track
  {
    const g = getter(Navigator.prototype, "globalPrivacyControl"), d = getter(Navigator.prototype, "doNotTrack");
    def(Navigator.prototype, "globalPrivacyControl", { get: function globalPrivacyControl() { return off() ? g?.call(this) : true; } });
    def(Navigator.prototype, "doNotTrack", { get: function doNotTrack() { return off() ? (d ? d.call(this) : null) : "1"; } });
  }

  // ---- Privacy Sandbox : Topics, Protected Audience, Shared Storage, Attribution Reporting, jetons privés…
  rm(Navigator.prototype, ["joinAdInterestGroup", "leaveAdInterestGroup", "updateAdInterestGroups", "clearOriginJoinedAdInterestGroups",
    "runAdAuction", "createAuctionNonce", "canLoadAdAuctionFencedFrame", "getInterestGroupAdAuctionData", "adAuctionComponents",
    "deprecatedReplaceInURN", "deprecatedURNToURL", "deprecatedRunAdAuctionEnforcesPrivateOptOut", "protectedAudience", "cookieDeprecationLabel"]);
  rm(Document.prototype, ["browsingTopics", "interestCohort", "hasPrivateToken", "hasRedemptionRecord", "hasTrustToken"]);
  rm(window, ["sharedStorage", "SharedStorage", "WindowSharedStorage", "SharedStorageWorklet", "fence", "Fence", "FencedFrameConfig"]);
  rm(window.XMLHttpRequest?.prototype, ["setAttributionReporting", "setPrivateToken"]);
  for (const C of ["HTMLAnchorElement", "HTMLImageElement", "HTMLScriptElement", "HTMLIFrameElement", "HTMLAreaElement"]) rm(window[C]?.prototype, ["attributionSrc"]);
  rm(window.HTMLIFrameElement?.prototype, ["browsingTopics", "adAuctionHeaders", "sharedStorageWritable"]);
  rm(window.HTMLImageElement?.prototype, ["sharedStorageWritable"]);
  {
    const f = window.fetch, BAD = ["browsingTopics", "attributionReporting", "adAuctionHeaders", "privateToken", "sharedStorageWritable"];
    if (f) window.fetch = function (i, init) {
      try { if (!off() && init && typeof init === "object" && BAD.some(k => k in init)) { init = { ...init }; for (const k of BAD) delete init[k]; } } catch {}
      return f.call(this, i, init);
    };
  }

  // ---- empreinte canvas / WebGL : bruit discret (1 bit sur ~1 pixel/16), seed propre à chaque page ; l'original n'est jamais modifié
  const seed = crypto.getRandomValues(new Uint32Array(1))[0] | 1;
  const hash = i => { let h = Math.imul((i + 1) ^ seed, 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; return (h ^ (h >>> 13)) >>> 0; };
  const farble = (d, n) => { n = Math.min(n, d.length >> 2); for (let i = 0; i < n; i++) { const h = hash(i); if ((h & 15) === 0) d[i * 4 + ((h >>> 4) % 3)] ^= 1; } };
  const okSize = n => n >= 32 && n <= 262144;
  const patch = (proto, name, make) => { try { const o = proto?.[name]; if (typeof o === "function") proto[name] = make(o); } catch {} };

  for (const P of [window.CanvasRenderingContext2D?.prototype, window.OffscreenCanvasRenderingContext2D?.prototype])
    patch(P, "getImageData", o => function (...a) {
      const r = o.apply(this, a);
      try { if (!off() && okSize(r.width * r.height)) farble(r.data, r.width * r.height); } catch {}
      return r;
    });
  const noisyCopy = c => {
    if (off()) return c;
    try {
      const w = c.width, h = c.height;
      if (!okSize(w * h)) return c;
      const t = c instanceof HTMLCanvasElement ? document.createElement("canvas") : new OffscreenCanvas(w, h);
      t.width = w; t.height = h;
      const x = t.getContext("2d"); x.drawImage(c, 0, 0);
      const id = x.getImageData(0, 0, w, h); // le getImageData enveloppé ajoute déjà le bruit
      x.putImageData(id, 0, 0);
      return t;
    } catch { return c; }
  };
  patch(window.HTMLCanvasElement?.prototype, "toDataURL", o => function (...a) { return o.apply(noisyCopy(this), a); });
  patch(window.HTMLCanvasElement?.prototype, "toBlob", o => function (...a) { return o.apply(noisyCopy(this), a); });
  patch(window.OffscreenCanvas?.prototype, "convertToBlob", o => function (...a) { return o.apply(noisyCopy(this), a); });
  for (const P of [window.WebGLRenderingContext?.prototype, window.WebGL2RenderingContext?.prototype])
    patch(P, "readPixels", o => function (x, y, w, h, fmt, type, px, ...r) {
      const res = o.call(this, x, y, w, h, fmt, type, px, ...r);
      try { if (!off() && fmt === 0x1908 && type === 0x1401 && px && okSize(w * h)) farble(px, w * h); } catch {}
      return res;
    });

  // ---- empreinte audio : micro-bruit (≈1e-6 relatif, inaudible) sur les tampons rendus et les analyseurs
  {
    const done = new WeakSet();
    const noisy = a => {
      if (off() || !a || done.has(a) || a.length > 2e6) return;
      done.add(a);
      for (let i = 0; i < a.length; i++) if (a[i] !== 0) a[i] *= 1 + (((hash(i) & 255) - 127.5) / 127.5) * 2e-6;
    };
    patch(window.AudioBuffer?.prototype, "getChannelData", o => function (...a) { const r = o.apply(this, a); try { noisy(r); } catch {} return r; });
    patch(window.AudioBuffer?.prototype, "copyFromChannel", o => function (dest, ...a) {
      const r = o.call(this, dest, ...a);
      try { if (!off() && dest.length <= 2e6) for (let i = 0; i < dest.length; i++) if (dest[i] !== 0) dest[i] *= 1 + (((hash(i) & 255) - 127.5) / 127.5) * 2e-6; } catch {}
      return r;
    });
    for (const k of ["getFloatFrequencyData", "getFloatTimeDomainData"])
      patch(window.AnalyserNode?.prototype, k, o => function (a) {
        const r = o.call(this, a);
        try { if (!off()) for (let i = 0; i < a.length; i++) if (isFinite(a[i])) a[i] += (((hash(i) & 255) - 127.5) / 127.5) * 1e-4; } catch {}
        return r;
      });
    for (const k of ["getByteFrequencyData", "getByteTimeDomainData"])
      patch(window.AnalyserNode?.prototype, k, o => function (a) {
        const r = o.call(this, a);
        try { if (!off()) for (let i = 0; i < a.length; i++) if ((hash(i) & 15) === 0) a[i] ^= 1; } catch {}
        return r;
      });
  }
})();
