const $ = id => document.getElementById(id), dnr = chrome.declarativeNetRequest;
const NOT_BLOCKS = id => id === 3002 || (id >= 3010 && id < 3100);
const TYPES = ["sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "media", "websocket", "other"];
// exception « débloquer ce domaine sur ce site » : un domaine de requête + un site d'origine, priorité au-dessus des règles de blocage
// exception de site : `||host^` (accepte aussi un port) ; les anciennes règles `||host/` restent reconnues
// 1.7.3 : une exception sur `exemple.com` couvre aussi `www.exemple.com` (même logique que cosmetic.js / picker.js)
const ruleHost = r => r.action.type === "allowAllRequests" && /^\|\|[^^/]+[\^/]$/.test(r.condition.urlFilter || "") ? r.condition.urlFilter.slice(2, -1) : null;
const siteRule = (r, h) => { const rh = ruleHost(r); return !!h && !!rh && (h === rh || h.endsWith("." + rh)); };
const isUnblock = r => r.action.type === "allow" && r.condition.requestDomains?.length === 1 && r.condition.initiatorDomains?.length === 1;

(async () => {
  const L = await wispLang(); wispApply(L);
  const sel = $("lang");
  WISP_LANGS.forEach(({ c, n }) => sel.add(new Option(n, c, false, c === L)));
  sel.onchange = async () => { await chrome.storage.local.set({ lang: sel.value, langChosen: true }); location.reload(); };
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let host = ""; try { const u = new URL(tab.url); if (u.protocol.startsWith("http")) host = u.hostname; } catch {}
  $("host").textContent = host || wispT(L, "page");
  $("ver").textContent = "v" + chrome.runtime.getManifest().version;
  const enabled = await dnr.getEnabledRulesets(), on = enabled.includes("wisp");
  $("global").checked = on;
  $("strict").checked = enabled.includes("wisp_strict"); $("strict").disabled = !on;
  const dyn = await dnr.getDynamicRules();
  const allowed = dyn.find(r => siteRule(r, host));
  const siteBox = $("site"); siteBox.checked = !allowed; siteBox.disabled = !host || !on;
  let { pauses = {} } = await chrome.storage.local.get("pauses");
  const pausedUntil = () => (pauses[host] > Date.now() ? pauses[host] : 0);
  const fmtTime = t => new Date(t).toLocaleTimeString(L, { hour: "2-digit", minute: "2-digit" });
  const state = () => {
    $("siteState").textContent = pausedUntil() ? wispT(L, "pausedUntil").replace("{t}", fmtTime(pausedUntil()))
      : wispT(L, !host ? "siteNA" : !on ? "paused" : siteBox.checked ? "siteOn" : "siteOff");
    $("pause").textContent = wispT(L, pausedUntil() ? "resume" : "pause1h");
  };
  state();
  $("pause").disabled = !host || !on || (!siteBox.checked && !pausedUntil());

  // ---- compteurs
  let a = 0, t = 0;
  try { const { rulesMatchedInfo } = await dnr.getMatchedRules({ tabId: tab.id });
    rulesMatchedInfo.filter(m => !NOT_BLOCKS(m.rule.ruleId)).forEach(m => (m.rule.rulesetId === "wisp_strict" || m.rule.ruleId === 2 || (m.rule.ruleId >= 500 && m.rule.ruleId < 700)) ? t++ : a++); } catch {}
  a += (await chrome.storage.session.get('c' + tab.id))['c' + tab.id] || 0;
  $("ads").textContent = a; $("trk").textContent = t;
  const total = a + t, start = performance.now();
  (function tick(n) { const k = Math.min(1, (n - start) / 600); $("count").textContent = Math.round(total * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(tick); })(start);
  $("label").textContent = wispBlocked(L, total);

  // ---- réglage par site (la pause d'1 h utilise la même exception, avec une échéance)
  async function setSite(enableProtection) {
    const covering = (await dnr.getDynamicRules()).filter(r => siteRule(r, host));
    if (enableProtection && covering.length) await dnr.updateDynamicRules({ removeRuleIds: covering.map(r => r.id) });
    if (!enableProtection && !covering.length) await dnr.updateDynamicRules({ addRules: [{ id: Date.now() % 1e9, priority: 2, action: { type: "allowAllRequests" }, condition: { urlFilter: `||${host}^`, resourceTypes: ["main_frame"] } }] });
    const { allow = [] } = await chrome.storage.local.get('allow');
    await chrome.storage.local.set({ allow: enableProtection ? allow.filter(h => !(host === h || host.endsWith("." + h))) : (allow.some(h => host === h || host.endsWith("." + h)) ? allow : [...allow, host]) });
  }
  siteBox.onchange = async () => {
    await setSite(siteBox.checked);
    if (siteBox.checked && pauses[host]) { delete pauses[host]; await chrome.storage.local.set({ pauses }); chrome.alarms.clear("wisp-pause:" + host); }
    state(); chrome.tabs.reload(tab.id);
  };
  $("pause").onclick = async () => {
    if (pausedUntil()) { siteBox.checked = true; return siteBox.onchange(); }
    await setSite(false);
    pauses = { ...pauses, [host]: Date.now() + 3600e3 };
    await chrome.storage.local.set({ pauses });
    chrome.alarms.create("wisp-pause:" + host, { when: pauses[host] });
    siteBox.checked = false; state(); chrome.tabs.reload(tab.id); window.close();
  };
  $("strict").onchange = async e => {
    await chrome.storage.local.set({ strict: e.target.checked });
    await dnr.updateEnabledRulesets(e.target.checked ? { enableRulesetIds: ["wisp_strict"] } : { disableRulesetIds: ["wisp_strict"] });
    chrome.tabs.reload(tab.id); window.close();
  };
  $("global").onchange = async e => {
    const { strict } = await chrome.storage.local.get("strict");
    await chrome.storage.local.set({ paused: !e.target.checked });
    await dnr.updateEnabledRulesets(e.target.checked
      ? { enableRulesetIds: strict ? ["wisp", "wisp_strict"] : ["wisp"] }
      : { disableRulesetIds: ["wisp", "wisp_strict"] });
    chrome.tabs.reload(tab.id); window.close();
  };

  // ---- journal des blocages : domaines bloqués sur cette page, déblocage d'un seul domaine
  const blocked = (await chrome.storage.session.get("b" + tab.id))["b" + tab.id] || {};
  const unblocked = host ? (await dnr.getDynamicRules()).filter(r => isUnblock(r) && r.condition.initiatorDomains[0] === host) : [];
  const li = (name, extra, label, onclick) => {
    const e = document.createElement("li"), s = document.createElement("span"), b = document.createElement("button");
    s.textContent = name; s.title = name; b.type = "button"; b.textContent = label; b.onclick = onclick;
    e.append(s);
    if (extra) { const i = document.createElement("i"); i.textContent = extra; e.append(i); }
    e.append(b); return e;
  };
  const reloadAfter = async fn => { await fn(); chrome.tabs.reload(tab.id); window.close(); };
  const entries = Object.entries(blocked).sort((x, y) => y[1] - x[1]);
  $("logN").textContent = entries.length;
  if (!entries.length) { const e = document.createElement("li"); e.className = "empty"; e.textContent = wispT(L, "logEmpty"); $("logList").append(e); }
  entries.forEach(([d, n]) => $("logList").append(li(d, "×" + n, wispT(L, "unblock"), () => reloadAfter(async () => {
    const used = new Set((await dnr.getDynamicRules()).map(r => r.id)); let id = 1500000000; while (used.has(id)) id++;
    await dnr.updateDynamicRules({ addRules: [{ id, priority: 3, action: { type: "allow" }, condition: { requestDomains: [d], initiatorDomains: [host], resourceTypes: TYPES } }] });
  }))));
  $("unTitle").hidden = !unblocked.length;
  unblocked.forEach(r => $("unList").append(li(r.condition.requestDomains[0], "", wispT(L, "reblock"), () => reloadAfter(() => dnr.updateDynamicRules({ removeRuleIds: [r.id] })))));
  // éléments masqués à la main (picker.js) : liste + réaffichage, et lancement du sélecteur
  const { hidden = {} } = await chrome.storage.local.get("hidden");
  const mine = host ? hidden[host] || [] : [];
  $("hidTitle").hidden = !mine.length;
  mine.forEach(sl => $("hidList").append(li(sl, "", wispT(L, "show"), async () => {
    hidden[host] = mine.filter(x => x !== sl); if (!hidden[host].length) delete hidden[host];
    await chrome.storage.local.set({ hidden }); window.close();
  })));
  $("pick").disabled = !host || !on || !siteBox.checked;
  $("pick").onclick = async () => {
    try { await chrome.tabs.sendMessage(tab.id, { wispPick: true, t: { hint: wispT(L, "pickHint"), done: wispT(L, "pickDone"), undo: wispT(L, "pickUndo") } }); } catch {}
    window.close();
  };
  if (!host) { $("log").hidden = true; }
  $("report").disabled = !host;
  $("report").onclick = async () => {
    const { strict } = await chrome.storage.local.get("strict");
    const txt = [
      "Wisp " + chrome.runtime.getManifest().version + " — " + (strict ? "Strict" : "Standard"),
      "Site: " + host, "Chrome: " + (navigator.userAgent.match(/Chrome\/[\d.]+/) || ["?"])[0],
      "Blocked: " + (entries.map(([d, n]) => d + " ×" + n).join(", ") || "-"),
      "Unblocked here: " + (unblocked.map(r => r.condition.requestDomains[0]).join(", ") || "-")
    ].join("\n");
    try { await navigator.clipboard.writeText(txt); $("report").textContent = wispT(L, "copied"); } catch { $("report").textContent = "✗"; }
    setTimeout(() => { $("report").textContent = wispT(L, "reportBtn"); }, 1800);
  };
})();
