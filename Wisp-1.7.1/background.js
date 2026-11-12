chrome.runtime.onInstalled.addListener(async d => {
  chrome.declarativeNetRequest.setExtensionActionOptions({ displayActionCountAsBadgeText: true });
  // 1.7.0 : première installation (ou mise à jour sans langue choisie) → page d'accueil pour choisir la langue
  if (d.reason !== "install" && d.reason !== "update") return;
  const { langChosen } = await chrome.storage.local.get("langChosen");
  if (!langChosen) chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") });
});
chrome.storage.session.setAccessLevel?.({ accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" });
chrome.runtime.onMessage.addListener((m, s) => {
  if (!m.wisp || !s.tab) return;
  const k = "c" + s.tab.id;
  chrome.storage.session.get(k).then(r => chrome.storage.session.set({ [k]: (r[k] || 0) + m.n }));
});
chrome.webNavigation.onCommitted.addListener(d => { if (d.frameId === 0) chrome.storage.session.remove("c" + d.tabId); });
