// Wisp 1.7.3 — traductions (popup + page d'accueil). Langues : fr en es de it pt ru tr ar zh
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
    pickBtn: "Masquer un élément", pickHint: "Cliquez sur l'élément à masquer (Échap pour annuler)", pickDone: "Élément masqué", pickUndo: "Annuler", hiddenTitle: "Masqués à la main", show: "Réafficher",
    logTitle: "Journal des blocages", logEmpty: "Rien de bloqué sur cette page", unblock: "Débloquer", reblock: "Rebloquer", unblockedTitle: "Débloqués sur ce site", pause1h: "Pause 1 h sur ce site", pausedUntil: "En pause jusqu'à {t}", resume: "Reprendre", reportBtn: "Copier un rapport de site cassé", copied: "Copié !",
    strictTitle: "Mode strict", strictSub: "Bloque aussi bannières de cookies, chats et formulaires e-mail (peut casser des sites)",
    blocked: { one: "élément bloqué sur cette page", other: "éléments bloqués sur cette page" },
    wTitle: "Bienvenue dans Wisp", wPick: "Choisissez votre langue", wHint: "Vous pourrez la changer à tout moment dans le popup de Wisp.",
    wGo: "Continuer", wDone: "Wisp est prêt !", wDoneSub: "Épinglez l'icône Wisp dans la barre d'outils pour voir ce qui est bloqué. Vous pouvez fermer cet onglet."
  },
  en: {
    siteTitle: "Protection on this site", siteOn: "Wisp is watching over this site", siteOff: "Protection turned off here", siteNA: "Unavailable here",
    paused: "Paused everywhere", globalTitle: "Wisp active everywhere", globalSub: "Pause all sites",
    ads: "ads", trk: "trackers", page: "browser page", lang: "Language",
    pickBtn: "Hide an element", pickHint: "Click the element to hide (Esc to cancel)", pickDone: "Element hidden", pickUndo: "Undo", hiddenTitle: "Hidden by hand", show: "Show again",
    logTitle: "Block log", logEmpty: "Nothing blocked on this page", unblock: "Unblock", reblock: "Block again", unblockedTitle: "Unblocked on this site", pause1h: "Pause 1 h on this site", pausedUntil: "Paused until {t}", resume: "Resume", reportBtn: "Copy a broken-site report", copied: "Copied!",
    strictTitle: "Strict mode", strictSub: "Also blocks cookie banners, chat widgets and email-form services (may break sites)",
    blocked: { one: "item blocked on this page", other: "items blocked on this page" },
    wTitle: "Welcome to Wisp", wPick: "Choose your language", wHint: "You can change it anytime from the Wisp popup.",
    wGo: "Continue", wDone: "Wisp is ready!", wDoneSub: "Pin the Wisp icon to your toolbar to see what gets blocked. You can close this tab."
  },
  es: {
    siteTitle: "Protección en este sitio", siteOn: "Wisp protege este sitio", siteOff: "Protección desactivada aquí", siteNA: "No disponible aquí",
    paused: "En pausa en todas partes", globalTitle: "Wisp activo en todas partes", globalSub: "Pausar todos los sitios",
    ads: "anuncios", trk: "rastreadores", page: "página del navegador", lang: "Idioma",
    pickBtn: "Ocultar un elemento", pickHint: "Haz clic en el elemento que quieres ocultar (Esc para cancelar)", pickDone: "Elemento oculto", pickUndo: "Deshacer", hiddenTitle: "Ocultados a mano", show: "Mostrar de nuevo",
    logTitle: "Registro de bloqueos", logEmpty: "Nada bloqueado en esta página", unblock: "Desbloquear", reblock: "Volver a bloquear", unblockedTitle: "Desbloqueados en este sitio", pause1h: "Pausa de 1 h en este sitio", pausedUntil: "En pausa hasta las {t}", resume: "Reanudar", reportBtn: "Copiar informe de sitio roto", copied: "¡Copiado!",
    strictTitle: "Modo estricto", strictSub: "Bloquea también avisos de cookies, chats y formularios de correo (puede romper sitios)",
    blocked: { one: "elemento bloqueado en esta página", other: "elementos bloqueados en esta página" },
    wTitle: "Bienvenido a Wisp", wPick: "Elige tu idioma", wHint: "Podrás cambiarlo en cualquier momento desde la ventana de Wisp.",
    wGo: "Continuar", wDone: "¡Wisp está listo!", wDoneSub: "Fija el icono de Wisp en la barra de herramientas para ver lo que se bloquea. Puedes cerrar esta pestaña."
  },
  de: {
    siteTitle: "Schutz auf dieser Website", siteOn: "Wisp schützt diese Website", siteOff: "Schutz hier deaktiviert", siteNA: "Hier nicht verfügbar",
    paused: "Überall pausiert", globalTitle: "Wisp überall aktiv", globalSub: "Alle Websites pausieren",
    ads: "Werbung", trk: "Tracker", page: "Browserseite", lang: "Sprache",
    pickBtn: "Element ausblenden", pickHint: "Klicke auf das Element, das ausgeblendet werden soll (Esc zum Abbrechen)", pickDone: "Element ausgeblendet", pickUndo: "Rückgängig", hiddenTitle: "Manuell ausgeblendet", show: "Wieder anzeigen",
    logTitle: "Blockierprotokoll", logEmpty: "Auf dieser Seite wurde nichts blockiert", unblock: "Freigeben", reblock: "Wieder blockieren", unblockedTitle: "Auf dieser Website freigegeben", pause1h: "1 Std. auf dieser Website pausieren", pausedUntil: "Pausiert bis {t}", resume: "Fortsetzen", reportBtn: "Bericht zur defekten Website kopieren", copied: "Kopiert!",
    strictTitle: "Strenger Modus", strictSub: "Blockiert zusätzlich Cookie-Banner, Chats und E-Mail-Formulare (kann Seiten beeinträchtigen)",
    blocked: { one: "Element auf dieser Seite blockiert", other: "Elemente auf dieser Seite blockiert" },
    wTitle: "Willkommen bei Wisp", wPick: "Wähle deine Sprache", wHint: "Du kannst sie jederzeit im Wisp-Popup ändern.",
    wGo: "Weiter", wDone: "Wisp ist bereit!", wDoneSub: "Hefte das Wisp-Symbol an die Symbolleiste, um zu sehen, was blockiert wird. Du kannst diesen Tab schließen."
  },
  it: {
    siteTitle: "Protezione su questo sito", siteOn: "Wisp protegge questo sito", siteOff: "Protezione disattivata qui", siteNA: "Non disponibile qui",
    paused: "In pausa ovunque", globalTitle: "Wisp attivo ovunque", globalSub: "Metti in pausa tutti i siti",
    ads: "pubblicità", trk: "tracker", page: "pagina del browser", lang: "Lingua",
    pickBtn: "Nascondi un elemento", pickHint: "Fai clic sull'elemento da nascondere (Esc per annullare)", pickDone: "Elemento nascosto", pickUndo: "Annulla", hiddenTitle: "Nascosti a mano", show: "Mostra di nuovo",
    logTitle: "Registro dei blocchi", logEmpty: "Nessun blocco su questa pagina", unblock: "Sblocca", reblock: "Blocca di nuovo", unblockedTitle: "Sbloccati su questo sito", pause1h: "Pausa di 1 ora su questo sito", pausedUntil: "In pausa fino alle {t}", resume: "Riprendi", reportBtn: "Copia rapporto sito non funzionante", copied: "Copiato!",
    strictTitle: "Modalità rigorosa", strictSub: "Blocca anche banner cookie, chat e moduli e-mail (può compromettere i siti)",
    blocked: { one: "elemento bloccato in questa pagina", other: "elementi bloccati in questa pagina" },
    wTitle: "Benvenuto in Wisp", wPick: "Scegli la tua lingua", wHint: "Potrai cambiarla in qualsiasi momento dal popup di Wisp.",
    wGo: "Continua", wDone: "Wisp è pronto!", wDoneSub: "Fissa l'icona di Wisp sulla barra degli strumenti per vedere cosa viene bloccato. Puoi chiudere questa scheda."
  },
  pt: {
    siteTitle: "Proteção neste site", siteOn: "O Wisp está protegendo este site", siteOff: "Proteção desativada aqui", siteNA: "Indisponível aqui",
    paused: "Pausado em todos os sites", globalTitle: "Wisp ativo em todos os sites", globalSub: "Pausar todos os sites",
    ads: "anúncios", trk: "rastreadores", page: "página do navegador", lang: "Idioma",
    pickBtn: "Ocultar um elemento", pickHint: "Clique no elemento a ocultar (Esc para cancelar)", pickDone: "Elemento oculto", pickUndo: "Desfazer", hiddenTitle: "Ocultados manualmente", show: "Mostrar novamente",
    logTitle: "Registro de bloqueios", logEmpty: "Nada bloqueado nesta página", unblock: "Desbloquear", reblock: "Bloquear novamente", unblockedTitle: "Desbloqueados neste site", pause1h: "Pausar 1 h neste site", pausedUntil: "Pausado até {t}", resume: "Retomar", reportBtn: "Copiar relatório de site quebrado", copied: "Copiado!",
    strictTitle: "Modo estrito", strictSub: "Bloqueia também avisos de cookies, chats e formulários de e-mail (pode quebrar sites)",
    blocked: { one: "item bloqueado nesta página", other: "itens bloqueados nesta página" },
    wTitle: "Bem-vindo ao Wisp", wPick: "Escolha seu idioma", wHint: "Você pode alterá-lo a qualquer momento no popup do Wisp.",
    wGo: "Continuar", wDone: "O Wisp está pronto!", wDoneSub: "Fixe o ícone do Wisp na barra de ferramentas para ver o que é bloqueado. Você pode fechar esta guia."
  },
  ru: {
    siteTitle: "Защита на этом сайте", siteOn: "Wisp защищает этот сайт", siteOff: "Защита здесь отключена", siteNA: "Здесь недоступно",
    paused: "Везде приостановлено", globalTitle: "Wisp включён везде", globalSub: "Приостановить на всех сайтах",
    ads: "реклама", trk: "трекеры", page: "страница браузера", lang: "Язык",
    pickBtn: "Скрыть элемент", pickHint: "Нажмите на элемент, который нужно скрыть (Esc — отмена)", pickDone: "Элемент скрыт", pickUndo: "Отменить", hiddenTitle: "Скрыто вручную", show: "Показать снова",
    logTitle: "Журнал блокировок", logEmpty: "На этой странице ничего не заблокировано", unblock: "Разблокировать", reblock: "Заблокировать снова", unblockedTitle: "Разблокировано на этом сайте", pause1h: "Пауза на 1 ч на этом сайте", pausedUntil: "Пауза до {t}", resume: "Возобновить", reportBtn: "Скопировать отчёт о неработающем сайте", copied: "Скопировано!",
    strictTitle: "Строгий режим", strictSub: "Блокирует также баннеры cookie, чаты и формы рассылок (может нарушить работу сайтов)",
    blocked: { one: "элемент заблокирован на этой странице", few: "элемента заблокировано на этой странице", many: "элементов заблокировано на этой странице", other: "элементов заблокировано на этой странице" },
    wTitle: "Добро пожаловать в Wisp", wPick: "Выберите язык", wHint: "Его можно изменить в любой момент во всплывающем окне Wisp.",
    wGo: "Продолжить", wDone: "Wisp готов!", wDoneSub: "Закрепите значок Wisp на панели инструментов, чтобы видеть, что блокируется. Эту вкладку можно закрыть."
  },
  tr: {
    siteTitle: "Bu sitede koruma", siteOn: "Wisp bu siteyi koruyor", siteOff: "Koruma burada kapalı", siteNA: "Burada kullanılamıyor",
    paused: "Her yerde duraklatıldı", globalTitle: "Wisp her yerde etkin", globalSub: "Tüm siteleri duraklat",
    ads: "reklam", trk: "izleyici", page: "tarayıcı sayfası", lang: "Dil",
    pickBtn: "Bir öğeyi gizle", pickHint: "Gizlemek istediğiniz öğeye tıklayın (iptal için Esc)", pickDone: "Öğe gizlendi", pickUndo: "Geri al", hiddenTitle: "Elle gizlenenler", show: "Yeniden göster",
    logTitle: "Engelleme günlüğü", logEmpty: "Bu sayfada hiçbir şey engellenmedi", unblock: "Engeli kaldır", reblock: "Yeniden engelle", unblockedTitle: "Bu sitede engeli kaldırılanlar", pause1h: "Bu sitede 1 saat duraklat", pausedUntil: "{t} saatine kadar duraklatıldı", resume: "Devam et", reportBtn: "Bozuk site raporunu kopyala", copied: "Kopyalandı!",
    strictTitle: "Sıkı mod", strictSub: "Çerez bannerlarını, sohbet pencerelerini ve e-posta formlarını da engeller (siteleri bozabilir)",
    blocked: { one: "öğe bu sayfada engellendi", other: "öğe bu sayfada engellendi" },
    wTitle: "Wisp'e hoş geldiniz", wPick: "Dilinizi seçin", wHint: "İstediğiniz zaman Wisp açılır penceresinden değiştirebilirsiniz.",
    wGo: "Devam", wDone: "Wisp hazır!", wDoneSub: "Nelerin engellendiğini görmek için Wisp simgesini araç çubuğuna sabitleyin. Bu sekmeyi kapatabilirsiniz."
  },
  ar: {
    siteTitle: "الحماية على هذا الموقع", siteOn: "Wisp يحمي هذا الموقع", siteOff: "الحماية متوقفة هنا", siteNA: "غير متاح هنا",
    paused: "متوقف مؤقتًا في كل مكان", globalTitle: "Wisp نشط في كل مكان", globalSub: "إيقاف جميع المواقع مؤقتًا",
    ads: "إعلانات", trk: "متتبعات", page: "صفحة المتصفح", lang: "اللغة",
    pickBtn: "إخفاء عنصر", pickHint: "انقر على العنصر المراد إخفاؤه (Esc للإلغاء)", pickDone: "تم إخفاء العنصر", pickUndo: "تراجع", hiddenTitle: "مخفية يدويًا", show: "إظهار مجددًا",
    logTitle: "سجل الحظر", logEmpty: "لم يتم حظر أي شيء في هذه الصفحة", unblock: "إلغاء الحظر", reblock: "إعادة الحظر", unblockedTitle: "تم إلغاء حظرها على هذا الموقع", pause1h: "إيقاف مؤقت لساعة على هذا الموقع", pausedUntil: "متوقف مؤقتًا حتى {t}", resume: "استئناف", reportBtn: "نسخ تقرير عن موقع معطّل", copied: "تم النسخ!",
    strictTitle: "الوضع الصارم", strictSub: "يحظر أيضًا لافتات ملفات تعريف الارتباط والدردشة ونماذج البريد (قد يعطّل بعض المواقع)",
    blocked: { zero: "عنصر محظور في هذه الصفحة", one: "عنصر محظور في هذه الصفحة", two: "عنصران محظوران في هذه الصفحة", few: "عناصر محظورة في هذه الصفحة", many: "عنصرًا محظورًا في هذه الصفحة", other: "عنصر محظور في هذه الصفحة" },
    wTitle: "مرحبًا بك في Wisp", wPick: "اختر لغتك", wHint: "يمكنك تغييرها في أي وقت من نافذة Wisp.",
    wGo: "متابعة", wDone: "Wisp جاهز!", wDoneSub: "ثبّت أيقونة Wisp في شريط الأدوات لمعرفة ما يتم حظره. يمكنك إغلاق هذا التبويب."
  },
  zh: {
    siteTitle: "此网站的保护", siteOn: "Wisp 正在保护此网站", siteOff: "此处已关闭保护", siteNA: "此处不可用",
    paused: "已全部暂停", globalTitle: "Wisp 全局启用", globalSub: "暂停所有网站",
    ads: "广告", trk: "跟踪器", page: "浏览器页面", lang: "语言",
    pickBtn: "隐藏元素", pickHint: "点击要隐藏的元素（按 Esc 取消）", pickDone: "元素已隐藏", pickUndo: "撤销", hiddenTitle: "手动隐藏", show: "重新显示",
    logTitle: "拦截记录", logEmpty: "此页面没有拦截任何内容", unblock: "取消拦截", reblock: "重新拦截", unblockedTitle: "此网站已取消拦截", pause1h: "在此网站暂停 1 小时", pausedUntil: "已暂停至 {t}", resume: "恢复", reportBtn: "复制网站异常报告", copied: "已复制！",
    strictTitle: "严格模式", strictSub: "同时拦截 Cookie 横幅、在线聊天和邮件表单服务（可能导致网站异常）",
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
