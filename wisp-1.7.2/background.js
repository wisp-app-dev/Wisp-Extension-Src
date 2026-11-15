// Les jeux de règles activés par l'utilisateur sont réappliqués après une mise à jour (Chrome les remet aux valeurs du manifest)
async function syncRulesets() {
  const { paused, strict } = await chrome.storage.local.get({ paused: false, strict: false });
  const want = paused ? [] : strict ? ["wisp", "wisp_strict"] : ["wisp"];
  const all = ["wisp", "wisp_strict"], cur = await chrome.declarativeNetRequest.getEnabledRulesets();
  const enableRulesetIds = want.filter(i => !cur.includes(i)), disableRulesetIds = all.filter(i => !want.includes(i) && cur.includes(i));
  if (enableRulesetIds.length || disableRulesetIds.length) await chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds, disableRulesetIds });
}
chrome.runtime.onStartup.addListener(syncRulesets);
chrome.runtime.onInstalled.addListener(async d => {
  syncRulesets();
  chrome.declarativeNetRequest.setExtensionActionOptions({ displayActionCountAsBadgeText: false });  // 1.7.2 : badge calculé ci-dessous (la règle Sec-GPC fausserait le compteur natif)
  // 1.7.0 : première installation (ou mise à jour sans langue choisie) → page d'accueil pour choisir la langue
  if (d.reason !== "install" && d.reason !== "update") return;
  const { langChosen } = await chrome.storage.local.get("langChosen");
  if (!langChosen) chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") });
});
chrome.storage.session.setAccessLevel?.({ accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" });
chrome.runtime.onMessage.addListener((m, s) => {
  if (!m.wisp || !s.tab) return;
  const k = "c" + s.tab.id;
  chrome.storage.session.get(k).then(r => chrome.storage.session.set({ [k]: (r[k] || 0) + m.n })).then(() => updateBadge(s.tab.id));
});
chrome.webNavigation.onCommitted.addListener(d => { if (d.frameId === 0) chrome.storage.session.remove(["c" + d.tabId, "b" + d.tabId]); });

// ---- badge : requêtes bloquées (hors en-tête Sec-GPC et nettoyage d'URL) + éléments masqués
const NOT_BLOCKS = id => id === 3002 || (id >= 3010 && id < 3100);
async function updateBadge(tabId) {
  try {
    const { rulesMatchedInfo } = await chrome.declarativeNetRequest.getMatchedRules({ tabId });
    const c = (await chrome.storage.session.get("c" + tabId))["c" + tabId] || 0;
    const n = rulesMatchedInfo.filter(m => !NOT_BLOCKS(m.rule.ruleId)).length + c;
    chrome.action.setBadgeText({ tabId, text: n ? (n > 999 ? "999+" : String(n)) : "" });
  } catch {}
}
chrome.webNavigation.onCommitted.addListener(d => { if (d.frameId === 0) chrome.action.setBadgeText({ tabId: d.tabId, text: "" }); });
chrome.webNavigation.onCompleted.addListener(d => { if (d.frameId === 0) { updateBadge(d.tabId); setTimeout(() => updateBadge(d.tabId), 1500); } });

// ---- journal des blocages : domaines bloqués par onglet (lecture seule, aucun blocage ici)
let logQueue = Promise.resolve();
chrome.webRequest.onErrorOccurred.addListener(d => {
  if (d.error !== "net::ERR_BLOCKED_BY_CLIENT" || d.tabId < 0) return;
  let h; try { h = new URL(d.url).hostname; } catch { return; }
  const k = "b" + d.tabId;
  logQueue = logQueue.then(async () => {
    const o = (await chrome.storage.session.get(k))[k] || {};
    o[h] = (o[h] || 0) + 1;
    await chrome.storage.session.set({ [k]: o });
  }).catch(() => {});
}, { urls: ["<all_urls>"] });

// ---- pause temporaire d'un site (1 h) : retire la règle d'exception à l'échéance
async function expirePauses() {
  const { pauses = {} } = await chrome.storage.local.get("pauses"); let changed = false;
  for (const [h, t] of Object.entries(pauses)) {
    if (t > Date.now()) { chrome.alarms.create("wisp-pause:" + h, { when: t }); continue; }
    const cur = (await chrome.declarativeNetRequest.getDynamicRules()).find(r => r.condition.urlFilter === `||${h}^` || r.condition.urlFilter === `||${h}/`);
    if (cur) await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [cur.id] });
    const { allow = [] } = await chrome.storage.local.get("allow");
    await chrome.storage.local.set({ allow: allow.filter(x => x !== h) });
    delete pauses[h]; changed = true;
  }
  if (changed) await chrome.storage.local.set({ pauses });
}
chrome.alarms.onAlarm.addListener(a => { if (a.name.startsWith("wisp-pause:")) expirePauses(); });
expirePauses();
