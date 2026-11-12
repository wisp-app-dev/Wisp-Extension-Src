// Wisp 1.7.0 — traductions (popup + page d'accueil). Langues : fr en es de it pt ru tr ar zh
const WISP_LANGS = [
  { c: "fr", n: "Français" }, { c: "en", n: "English" }, { c: "es", n: "Español" }, { c: "de", n: "Deutsch" },
  { c: "it", n: "Italiano" }, { c: "pt", n: "Português" }, { c: "ru", n: "Русский" }, { c: "tr", n: "Türkçe" },
  { c: "ar", n: "العربية" }, { c: "zh", n: "中文（简体）" }
];
const WISP_RTL = ["ar"];
const WISP_STR = {
  fr: {
    siteTitle: "Protection sur ce site", siteOn: "Wisp veille sur ce site", siteOff: "Protection désactivée ici", siteNA: "Indisponible ici",
    paused: "En pause partout", globalTitle: "Wisp actif partout", globalSub: "Mettre en pause tous les sites",
    ads: "publicités", trk: "traqueurs", page: "page du navigateur", lang: "Langue",
    blocked: { one: "élément bloqué sur cette page", other: "éléments bloqués sur cette page" },
    wTitle: "Bienvenue dans Wisp", wPick: "Choisissez votre langue", wHint: "Vous pourrez la changer à tout moment dans le popup de Wisp.",
    wGo: "Continuer", wDone: "Wisp est prêt !", wDoneSub: "Épinglez l'icône Wisp dans la barre d'outils pour voir ce qui est bloqué. Vous pouvez fermer cet onglet."
  },
  en: {
    siteTitle: "Protection on this site", siteOn: "Wisp is watching over this site", siteOff: "Protection turned off here", siteNA: "Unavailable here",
    paused: "Paused everywhere", globalTitle: "Wisp active everywhere", globalSub: "Pause all sites",
    ads: "ads", trk: "trackers", page: "browser page", lang: "Language",
    blocked: { one: "item blocked on this page", other: "items blocked on this page" },
    wTitle: "Welcome to Wisp", wPick: "Choose your language", wHint: "You can change it anytime from the Wisp popup.",
    wGo: "Continue", wDone: "Wisp is ready!", wDoneSub: "Pin the Wisp icon to your toolbar to see what gets blocked. You can close this tab."
  },
  es: {
    siteTitle: "Protección en este sitio", siteOn: "Wisp protege este sitio", siteOff: "Protección desactivada aquí", siteNA: "No disponible aquí",
    paused: "En pausa en todas partes", globalTitle: "Wisp activo en todas partes", globalSub: "Pausar todos los sitios",
    ads: "anuncios", trk: "rastreadores", page: "página del navegador", lang: "Idioma",
    blocked: { one: "elemento bloqueado en esta página", other: "elementos bloqueados en esta página" },
    wTitle: "Bienvenido a Wisp", wPick: "Elige tu idioma", wHint: "Podrás cambiarlo en cualquier momento desde la ventana de Wisp.",
    wGo: "Continuar", wDone: "¡Wisp está listo!", wDoneSub: "Fija el icono de Wisp en la barra de herramientas para ver lo que se bloquea. Puedes cerrar esta pestaña."
  },
  de: {
    siteTitle: "Schutz auf dieser Website", siteOn: "Wisp schützt diese Website", siteOff: "Schutz hier deaktiviert", siteNA: "Hier nicht verfügbar",
    paused: "Überall pausiert", globalTitle: "Wisp überall aktiv", globalSub: "Alle Websites pausieren",
    ads: "Werbung", trk: "Tracker", page: "Browserseite", lang: "Sprache",
    blocked: { one: "Element auf dieser Seite blockiert", other: "Elemente auf dieser Seite blockiert" },
    wTitle: "Willkommen bei Wisp", wPick: "Wähle deine Sprache", wHint: "Du kannst sie jederzeit im Wisp-Popup ändern.",
    wGo: "Weiter", wDone: "Wisp ist bereit!", wDoneSub: "Hefte das Wisp-Symbol an die Symbolleiste, um zu sehen, was blockiert wird. Du kannst diesen Tab schließen."
  },
  it: {
    siteTitle: "Protezione su questo sito", siteOn: "Wisp protegge questo sito", siteOff: "Protezione disattivata qui", siteNA: "Non disponibile qui",
    paused: "In pausa ovunque", globalTitle: "Wisp attivo ovunque", globalSub: "Metti in pausa tutti i siti",
    ads: "pubblicità", trk: "tracker", page: "pagina del browser", lang: "Lingua",
    blocked: { one: "elemento bloccato in questa pagina", other: "elementi bloccati in questa pagina" },
    wTitle: "Benvenuto in Wisp", wPick: "Scegli la tua lingua", wHint: "Potrai cambiarla in qualsiasi momento dal popup di Wisp.",
    wGo: "Continua", wDone: "Wisp è pronto!", wDoneSub: "Fissa l'icona di Wisp sulla barra degli strumenti per vedere cosa viene bloccato. Puoi chiudere questa scheda."
  },
  pt: {
    siteTitle: "Proteção neste site", siteOn: "O Wisp está protegendo este site", siteOff: "Proteção desativada aqui", siteNA: "Indisponível aqui",
    paused: "Pausado em todos os sites", globalTitle: "Wisp ativo em todos os sites", globalSub: "Pausar todos os sites",
    ads: "anúncios", trk: "rastreadores", page: "página do navegador", lang: "Idioma",
    blocked: { one: "item bloqueado nesta página", other: "itens bloqueados nesta página" },
    wTitle: "Bem-vindo ao Wisp", wPick: "Escolha seu idioma", wHint: "Você pode alterá-lo a qualquer momento no popup do Wisp.",
    wGo: "Continuar", wDone: "O Wisp está pronto!", wDoneSub: "Fixe o ícone do Wisp na barra de ferramentas para ver o que é bloqueado. Você pode fechar esta guia."
  },
  ru: {
    siteTitle: "Защита на этом сайте", siteOn: "Wisp защищает этот сайт", siteOff: "Защита здесь отключена", siteNA: "Здесь недоступно",
    paused: "Везде приостановлено", globalTitle: "Wisp включён везде", globalSub: "Приостановить на всех сайтах",
    ads: "реклама", trk: "трекеры", page: "страница браузера", lang: "Язык",
    blocked: { one: "элемент заблокирован на этой странице", few: "элемента заблокировано на этой странице", many: "элементов заблокировано на этой странице", other: "элементов заблокировано на этой странице" },
    wTitle: "Добро пожаловать в Wisp", wPick: "Выберите язык", wHint: "Его можно изменить в любой момент во всплывающем окне Wisp.",
    wGo: "Продолжить", wDone: "Wisp готов!", wDoneSub: "Закрепите значок Wisp на панели инструментов, чтобы видеть, что блокируется. Эту вкладку можно закрыть."
  },
  tr: {
    siteTitle: "Bu sitede koruma", siteOn: "Wisp bu siteyi koruyor", siteOff: "Koruma burada kapalı", siteNA: "Burada kullanılamıyor",
    paused: "Her yerde duraklatıldı", globalTitle: "Wisp her yerde etkin", globalSub: "Tüm siteleri duraklat",
    ads: "reklam", trk: "izleyici", page: "tarayıcı sayfası", lang: "Dil",
    blocked: { one: "öğe bu sayfada engellendi", other: "öğe bu sayfada engellendi" },
    wTitle: "Wisp'e hoş geldiniz", wPick: "Dilinizi seçin", wHint: "İstediğiniz zaman Wisp açılır penceresinden değiştirebilirsiniz.",
    wGo: "Devam", wDone: "Wisp hazır!", wDoneSub: "Nelerin engellendiğini görmek için Wisp simgesini araç çubuğuna sabitleyin. Bu sekmeyi kapatabilirsiniz."
  },
  ar: {
    siteTitle: "الحماية على هذا الموقع", siteOn: "Wisp يحمي هذا الموقع", siteOff: "الحماية متوقفة هنا", siteNA: "غير متاح هنا",
    paused: "متوقف مؤقتًا في كل مكان", globalTitle: "Wisp نشط في كل مكان", globalSub: "إيقاف جميع المواقع مؤقتًا",
    ads: "إعلانات", trk: "متتبعات", page: "صفحة المتصفح", lang: "اللغة",
    blocked: { zero: "عنصر محظور في هذه الصفحة", one: "عنصر محظور في هذه الصفحة", two: "عنصران محظوران في هذه الصفحة", few: "عناصر محظورة في هذه الصفحة", many: "عنصرًا محظورًا في هذه الصفحة", other: "عنصر محظور في هذه الصفحة" },
    wTitle: "مرحبًا بك في Wisp", wPick: "اختر لغتك", wHint: "يمكنك تغييرها في أي وقت من نافذة Wisp.",
    wGo: "متابعة", wDone: "Wisp جاهز!", wDoneSub: "ثبّت أيقونة Wisp في شريط الأدوات لمعرفة ما يتم حظره. يمكنك إغلاق هذا التبويب."
  },
  zh: {
    siteTitle: "此网站的保护", siteOn: "Wisp 正在保护此网站", siteOff: "此处已关闭保护", siteNA: "此处不可用",
    paused: "已全部暂停", globalTitle: "Wisp 全局启用", globalSub: "暂停所有网站",
    ads: "广告", trk: "跟踪器", page: "浏览器页面", lang: "语言",
    blocked: { other: "个项目已在此页面被拦截" },
    wTitle: "欢迎使用 Wisp", wPick: "选择你的语言", wHint: "你可以随时在 Wisp 弹出窗口中更改。",
    wGo: "继续", wDone: "Wisp 已就绪！", wDoneSub: "将 Wisp 图标固定到工具栏，即可查看被拦截的内容。你可以关闭此标签页。"
  }
};

// langue enregistrée, sinon langue du navigateur si prise en charge, sinon français
async function wispLang() {
  try { const { lang } = await chrome.storage.local.get("lang"); if (lang && WISP_STR[lang]) return lang; } catch {}
  const n = (navigator.language || "fr").toLowerCase().slice(0, 2);
  return WISP_STR[n] ? n : "fr";
}
function wispT(lang, k) { return (WISP_STR[lang] || WISP_STR.fr)[k] ?? WISP_STR.fr[k]; }
function wispBlocked(lang, n) {
  const f = wispT(lang, "blocked"); let c = "other";
  try { c = new Intl.PluralRules(lang).select(n); } catch {}
  return f[c] || f.other;
}
function wispApply(lang) {
  const h = document.documentElement;
  h.lang = lang; h.dir = WISP_RTL.includes(lang) ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = wispT(lang, el.dataset.i18n); });
}
