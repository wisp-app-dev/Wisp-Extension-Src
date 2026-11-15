(async () => {
  let lang = await wispLang();
  const box = document.getElementById("langs");
  const render = () => {
    wispApply(lang);
    box.querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", String(b.dataset.c === lang)));
  };
  for (const { c, n } of WISP_LANGS) {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "radio"); b.dataset.c = c; b.textContent = n; b.lang = c;
    b.onclick = () => { lang = c; chrome.storage.local.set({ lang }); render(); };
    box.appendChild(b);
  }
  render();
  document.getElementById("go").onclick = async () => {
    await chrome.storage.local.set({ lang, langChosen: true });
    document.getElementById("pick").hidden = true;
    document.getElementById("done").hidden = false;
  };
})();
