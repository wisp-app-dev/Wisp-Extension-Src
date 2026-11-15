// Wisp 1.7.2 — sélecteur d'éléments : masquer à la main un élément d'une page, mémorisé par site (page principale uniquement)
(() => {
  const host = location.hostname;
  let style;
  const apply = sels => {
    if (!style) { style = document.createElement("style"); style.setAttribute("data-wisp-picked", ""); (document.head || document.documentElement).append(style); }
    style.textContent = sels.length ? sels.join(",\n") + "{display:none!important}" : "";
  };
  const load = () => chrome.storage.local.get({ paused: false, allow: [], hidden: {} }).then(({ paused, allow, hidden }) => {
    if (paused || allow.includes(host)) return apply([]);
    apply(hidden[host] || []);
  });
  load();
  chrome.storage.onChanged.addListener((c, area) => { if (area === "local" && (c.hidden || c.allow || c.paused)) load(); });

  async function save(fn) {
    const { hidden = {} } = await chrome.storage.local.get("hidden");
    const list = fn(hidden[host] || []);
    if (list.length) hidden[host] = list; else delete hidden[host];
    await chrome.storage.local.set({ hidden });
  }

  const esc = s => CSS.escape(s);
  function selectorFor(el) {
    const parts = [];
    for (; el && el.nodeType === 1 && el !== document.documentElement && el !== document.body; el = el.parentElement) {
      if (el.id && !/\d{4,}/.test(el.id) && document.querySelectorAll("#" + esc(el.id)).length === 1) { parts.unshift("#" + esc(el.id)); break; }
      let s = el.tagName.toLowerCase();
      const cls = [...el.classList].filter(c => !/\d{3,}/.test(c)).slice(0, 2);
      s += cls.map(c => "." + esc(c)).join("");
      const sib = [...el.parentElement.children].filter(x => x.tagName === el.tagName);
      if (!cls.length || (sib.length > 1 && document.querySelectorAll(s).length > 1)) s += `:nth-of-type(${sib.indexOf(el) + 1})`;
      parts.unshift(s);
      if (document.querySelectorAll(parts.join(" > ")).length === 1) break;
    }
    return parts.join(" > ");
  }

  let stop = null;
  function startPicking(t) {
    if (stop) stop();
    const box = document.createElement("div"), bar = document.createElement("div");
    box.style.cssText = "all:initial;position:fixed;z-index:2147483647;pointer-events:none;outline:2px solid #8b7cff;background:rgba(139,124,255,.22);border-radius:3px;display:none";
    bar.style.cssText = "all:initial;position:fixed;z-index:2147483647;left:50%;top:12px;transform:translateX(-50%);background:#221b4a;color:#f3f0ff;font:14px system-ui,sans-serif;padding:9px 14px;border-radius:12px;box-shadow:0 4px 24px #0008;pointer-events:none";
    bar.textContent = t.hint; document.documentElement.append(box, bar);
    let cur = null;
    const over = e => {
      const el = e.target; if (!el || el === box || el === bar || el === document.documentElement || el === document.body) { box.style.display = "none"; cur = null; return; }
      cur = el; const r = el.getBoundingClientRect();
      Object.assign(box.style, { display: "block", left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
    };
    const eat = e => { e.preventDefault(); e.stopImmediatePropagation(); };
    const click = async e => {
      eat(e); if (!cur) return;
      const sel = selectorFor(cur); finish();
      if (!sel) return;
      await save(l => [...new Set([...l, sel])]);
      toast(t.done, t.undo, () => save(l => l.filter(x => x !== sel)));
    };
    const key = e => { if (e.key === "Escape") { eat(e); finish(); } };
    function finish() { stop = null; box.remove(); bar.remove(); removeEventListener("mouseover", over, true); removeEventListener("click", click, true); removeEventListener("mousedown", eat, true); removeEventListener("mouseup", eat, true); removeEventListener("keydown", key, true); }
    addEventListener("mouseover", over, true); addEventListener("click", click, true); addEventListener("mousedown", eat, true); addEventListener("mouseup", eat, true); addEventListener("keydown", key, true);
    stop = finish;
  }
  function toast(text, undo, onUndo) {
    const d = document.createElement("div"), b = document.createElement("button");
    d.style.cssText = "all:initial;position:fixed;z-index:2147483647;right:16px;bottom:16px;background:#221b4a;color:#f3f0ff;font:14px system-ui,sans-serif;padding:10px 14px;border-radius:12px;box-shadow:0 4px 24px #0008;display:flex;gap:12px;align-items:center";
    b.style.cssText = "all:initial;font:600 13px system-ui,sans-serif;color:#fff;background:#8b7cff;border-radius:8px;padding:5px 10px;cursor:pointer";
    b.textContent = undo; d.append(text, b); document.documentElement.append(d);
    const t = setTimeout(() => d.remove(), 6000);
    b.onclick = () => { clearTimeout(t); d.remove(); onUndo(); };
  }
  if (window === top) chrome.runtime.onMessage.addListener(m => { if (m && m.wispPick) startPicking(m.t); });
})();
