// Wisp 1.6.2 — masque les pubs restantes, supprime les calques piégés et les murs anti-adblock
(() => {
  let host = location.hostname;
  try { if (location.ancestorOrigins?.length) host = new URL(location.ancestorOrigins[location.ancestorOrigins.length - 1]).hostname; } catch {}
  chrome.storage.local.get({ paused: false, allow: [] }).then(({ paused, allow }) => {
    if (paused || allow.includes(host)) return document.documentElement.setAttribute("data-wisp-off", "");
    run();
  });

  function run() {
    // ---------------------------------------------------------------- sélecteurs génériques
    const GENERIC = [
      '.adbox', '.banner_ads', '.adsbox', '.textads', '.adbox.banner_ads.adsbox', '.ad-banner', '.ad-box', '#ad-banner',
      // Google AdSense / Ad Manager / GPT
      'ins.adsbygoogle', '.adsbygoogle', 'ins[data-ad-status]', 'ins[data-adsbygoogle-status]', '[id^="google_ads"]',
      '[id^="div-gpt-ad"]', '[id^="aswift"]', 'iframe[id^="google_ads_iframe"]', 'iframe[name^="google_ads_iframe"]',
      'iframe[src*="googlesyndication"]', 'iframe[src*="doubleclick"]', '[data-google-query-id]', '[data-google-container-id]',
      'div[id^="google_ads_iframe"]', '.google-auto-placed', '.google-ad', '.google-ads', '.googleads', '.GoogleActiveViewElement',
      '.gpt-ad', '.dfp-ad', '.dfp-slot', '[id^="dfp-"]', '[id*="gpt-ad"]', '[class*="dfp-ad"]', '.adsense', '.adsense-block',
      '.adsense_ad', '.AdSense', '.adsensewidget', '#google_image_div', '.google-revocation-link-placeholder',
      'ins[class*="adsbygoogle"]', 'amp-ad', 'amp-embed[type="taboola"]', 'amp-embed[type="outbrain"]', 'amp-sticky-ad',
      'amp-auto-ads', 'amp-connatix-player', '[data-a4a-ad]',
      // identifiants / classes génériques
      '[id^="ad-"]', '[id^="ad_"]', '[id$="-ad"]', '[id$="_ad"]', '[class^="ad-"]', '[class^="ad_"]', '[class~="ad"]',
      '[class~="ads"]', '#ads', '#ad', '#adbox', '#adblock', '#adbanner', '#ad-banner', '#ad_banner', '#adContainer',
      '#ad-container', '#ad_container', '#adWrapper', '#ad-wrapper', '#ad-slot', '#ad_slot', '#top-ad', '#top_ad',
      '#bottom-ad', '#sidebar-ad', '#header-ad', '#footer-ad', '#leaderboard', '#leaderboard-ad', '#banner-ad',
      '#banner_ad', '#bannerad', '#sponsored', '#sponsored-links', '#carbonads', '.carbon-wrap',
      '.carbon-ad', '#BuySellAds', '.bsa_it', '#bsap_aplink', '[class*="adsbox"]', '[class*="advert"]',
      '[class*="ad-banner"]', '[class*="ad-slot"]', '[class*="ad-unit"]', '[class*="ad-container"]', '[class*="ad-wrapper"]',
      '[class*="ad-placeholder"]', '[class*="ad-placement"]', '[class*="ad-leaderboard"]', '[class*="ad-rectangle"]',
      '[class*="ad-sidebar"]', '[class*="ad-label"]', '[class*="banner-ad"]', '[class*="banner_ad"]', '[class*="bannerad"]',
      '[class*="sponsored"]', '[class*="in-page-push"]', '[class*="inpage-push"]', '[class*="interstitial"]',
      '[class*="popunder"]', '[class*="sticky-ad"]', '[class*="stickyad"]', '[class*="floating-ad"]', '[class*="native-ad"]',
      '[class*="nativead"]', '[class*="text-ad"]', '[class*="textad"]', '[class*="adzone"]', '[class*="ad_zone"]',
      '[class*="adslot"]', '[class*="ad_slot"]', '[class*="adunit"]', '[class*="ad_unit"]', '[class*="ad_container"]',
      '[class*="adcontainer"]', '[class*="ad_wrapper"]', '[class*="adwrapper"]', '[class*="ad_box"]', '[class*="adbox"]',
      '[class*="adblock-"]', '[id*="adbox"]', '[id*="ad-slot"]', '[id*="ad_slot"]', '[id*="adslot"]', '[id*="adunit"]',
      '[id*="ad-unit"]', '[id*="ad_unit"]', '[id*="ad-container"]', '[id*="ad_container"]', '[id*="adcontainer"]',
      '[id*="advert"]', '[id*="sponsored"]', '[id*="banner-ad"]', '[id*="banner_ad"]', '[id*="bannerad"]',
      '.ad-space', '.ad-spot', '.adspot', '.ad-box', '.ad-block', '.ad-wrap', '.ad-wrapper', '.adwrapper', '.adbox',
      '.adblock', '.ad-placeholder', '.ad-placement', '.ad-label', '.ad-leaderboard', '.ad-rectangle', '.ad-sidebar',
      '.ad-top', '.ad-bottom', '.ad-header', '.ad-footer', '.ad-inner', '.ad-mobile', '.ad-desktop', '.ad-tag', '.ad-zone',
      '.ad_unit', '.ad-unit', '.adunit', '.ad_slot', '.adslot', '.ad-slot', '.ad_container', '.ad-container',
      '.adcontainer', '.ad_wrapper', '.ad_box', '.adBanner', '.ad_banner', '.ad-banner', '.banner_ad', '.bannerAd',
      '.BannerAd', '.bannerad', '.top-ads', '.top-ad', '.sidebar-ad', '.sidebar-ads', '.sidebar_ad', '.sticky-ad',
      '.stickyad', '.sticky-ads', '.floating-ad', '.fixed-ad', '.footer-ad', '.header-ad', '.inline-ad', '.native-ad',
      '.nativead', '.native_ad', '.ad-native', '.advertisement', '.advertising', '.advertise', '.advert', '.adverts',
      '.advertisment', '.advertorial', '.sponsor-box', '.sponsored-post', '.sponsored-content', '.sponsored-links',
      '.sponsoredlinks', '.sponsored-ad', '.sponsored_ad', '.text-ad', '.textads', '.text-ads', '.promoted-content',
      '.promotedlink', '.promoted-link', '.pub-ad', '.pubad', '.pub_300x250', '.pub_728x90', '.adsbox',
      // contenu recommandé / natif
      '.taboola', '[id^="taboola"]', '[class*="taboola"]', '[id*="outbrain"]', '[class*="outbrain"]', '.OUTBRAIN', '.ob-widget',
      '.ob-widget-section', '.trc_rbox', '.trc_related_container', '.trc-content-sponsored', '[id^="mgid"]', '[class*="mgid"]',
      '[id^="rc-widget"]', '.rc-widget', '.revcontent', '.zergnet', '[id^="zergnet"]', '[id^="adnow"]', '[class*="adnow"]',
      '.dianomi_context', '[id^="dianomi"]', '[class*="plista"]', '[id^="plista"]', '[class*="ligatus"]',
      '.nativo-ad', '[id^="nativo"]', '[class*="infolinks"]', '#in_text_ad', '.infolinks_ad',
      // monétiseurs
      '.mediavine', '.mv-ad-box', '[id^="mv-ad"]', '[class*="mv-ad"]', '.adthrive', '[class*="adthrive"]', '[id^="adthrive"]',
      '[id^="AdThrive"]', '[class*="raptive"]', '[id^="ezoic"]', '.ezoic-ad', '[class*="ezoic-ad"]', '[id*="ezoic"]',
      '[id^="ezmob"]', '.ezmob-footer', '.ad-ezoic', '[id^="snigel"]', '.snigel-ad', '[class*="adpushup"]', '[id*="adpushup"]',
      '[id^="pubguru"]', '[class*="pubguru"]', '[class*="publift"]', '[data-fuse]', '.fuse-ad',
      '[class*="monumetric"]', '[id*="monumetric"]', '[id^="cnx-"]', '[class*="connatix"]', '[id^="connatix"]',
      '[class*="primis"]', '[id*="primis"]', '[class*="vidazoo"]', '[class*="aniview"]',
      // Yandex Direct / RTB / Adfox / RU
      '[id^="yandex_ad"]', '[id^="yandex_rtb"]', '[id*="yandex_ad"]', '[id*="yandex_rtb"]', '[id*="yandex_direct"]',
      '[class*="yandex-ad"]', '[class*="yandex_ad"]', '[class*="yandex-rtb"]', '[class*="yandex_rtb"]', '[class*="yandex_direct"]',
      '[class*="yandex-direct"]', '.ya-ad', '.yandex-rtb', '.yandex_rtb', '.yandex-ads', '.ya-direct',
      '[id^="adfox"]', '[id*="adfox"]', '[class*="adfox"]', '[data-adfox]', '.adfox-banner', '[id^="adriver"]',
      '[class*="adriver"]', '[id^="yandex_ad_"]', '[data-yandex-rtb]', '[data-yandex-ad]', '[data-yandex-ad-block]',
      'iframe[src*="yandex.ru/ads"]', 'iframe[src*="yandex.com/ads"]', 'iframe[src*="an.yandex"]', 'iframe[src*="yandexadexchange"]',
      'iframe[src*="adfox"]', 'iframe[src*="awaps.yandex"]', 'iframe[id^="yandex_ad"]', 'iframe[id^="yandex_rtb"]',
      'iframe[name^="yandex"]', 'ya-ad', '.direct_ad', '.direct-ad', '.yap-ad', '[class*="yap-ad"]',
      '.serp-adv', '.serp-adv__item', '.serp-adv-item', '.serp-adv__found', '.serp-adv__head', '[data-fast-name="direct"]',
      '[data-fast-wzrd="direct"]', 'li.serp-item[data-cid][data-fast-name="direct"]', '.content__left .serp-adv',
      '.content__right .serp-adv', '[id^="begun_block"]', '[id^="begun"]', '.begun', '[class*="begun_"]', 
      '.mailru-ad', '[class*="mrg-"][class*="ad"]', '[id^="mrg-"]', '[id^="smi2"]', '[class*="smi2"]',
      // Bannières par attribut / taille
      '[data-ad]', '[data-ad-slot]', '[data-ad-client]', '[data-ad-unit]', '[data-adunit]', '[data-ad-unit-id]',
      '[data-ad-placeholder]', '[data-adslot]', '[data-ad-position]', '[data-ad-id]', '[data-adzone]', '[data-ad-wrapper]',
      '[data-ad-container]', '[data-advertisement]', '[data-ad-name]', '[data-ad-type]', '[data-ad-region]',
      '[data-testid*="ad-slot"]', '[data-testid="advertisement"]', '[data-test*="ad-slot"]', '[data-cy*="ad-slot"]',
      '[data-component="ad"]', '[data-role="ad"]', '[data-type="ad"]', '[data-widget="ad"]', '[data-track-ad]',
      '[aria-label="Advertisement" i]', '[aria-label="Advertisements" i]', '[aria-label="Publicité" i]', '[aria-label="Sponsored" i]',
      '[aria-label="Anzeige" i]', '[aria-label="Реклама" i]', '[aria-label="Publicidad" i]', '[aria-label="Annonce" i]',
      '[aria-label*="advertisement" i]', '[title="Advertisement" i]', '[title="Publicité" i]',
      'object[data*=".swf"]', 'embed[src*=".swf"]', 'object[type="application/x-shockwave-flash"]',
      'embed[type="application/x-shockwave-flash"]',
      'img[src*="ads_banner"]', 'img[src*="advertising"]', 'img[src*="/ads/"]', 'img[src*="banner_ad"]', 'img[src*="banner-ad"]',
      'img[src*="ad-banner"]', 'img[src*="adbanner"]', 'img[src*="advert"]',
      'img[width="728"][height="90"]', 'img[width="468"][height="60"]', 'img[width="300"][height="250"]',
      'img[width="160"][height="600"]', 'img[width="970"][height="90"]', 'img[width="336"][height="280"]',
      'img[width="120"][height="600"]', 'img[width="320"][height="50"]', 'img[width="300"][height="600"]',
      'img[width="970"][height="250"]', 'img[width="320"][height="100"]', 'img[width="234"][height="60"]',
      'iframe[width="728"][height="90"]', 'iframe[width="300"][height="250"]', 'iframe[width="468"][height="60"]',
      'iframe[width="160"][height="600"]', 'iframe[width="970"][height="250"]', 'iframe[width="320"][height="50"]',
      'iframe[width="300"][height="600"]', 'iframe[width="336"][height="280"]', 'iframe[width="320"][height="100"]',
      'iframe[src*="/ads/"]', 'iframe[src*="adserver"]', 'iframe[src*="/banners/"]', 'iframe[src*="ad_frame"]',
      'iframe[src*="adframe"]', 'iframe[src*="popunder"]', 'iframe[src*="exoclick"]', 'iframe[src*="adsterra"]',
      'iframe[src*="propellerads"]', 'iframe[src*="juicyads"]', 'iframe[src*="trafficjunky"]', 'iframe[src*="taboola"]',
      'iframe[src*="outbrain"]', 'iframe[src*="mgid"]', 'iframe[src*="criteo"]', 'iframe[src*="adnxs"]',
      'iframe[src*="amazon-adsystem"]', 'iframe[src*="adform"]', 'iframe[src*="smartadserver"]',
      'a[href*="doubleclick.net"]', 'a[href*="adsterra"]', 'a[href*="exoclick"]', 'a[href*="propellerads"]',
      'a[href*="googleadservices.com"]', 'a[href*="adclick"]', 'a[href*="/aclk?"]', 'a[href*="clickadu"]',
      'a[href*="hilltopads"]', 'a[href*="popads"]', 'a[href*="juicyads"]', 'a[href*="trafficjunky"]',
      'a[href*="monetag"]', 'a[href*="adcash"]', 'a[href*="mgid.com"]', 'a[href*="taboola.com"]', 'a[href*="outbrain.com"]',
      'a[href*="onclickads"]', 'a[href*="an.yandex.ru"]', 'a[href*="yabs.yandex"]', 'a[href*="adfox"]',
      // vidéo
      '.video-ads', '.videoAdUi', '.ima-ad-container', '[class*="ad-overlay"]', '.preroll', '.pre-roll', '[class*="preroll-ad"]',
      '.vjs-ad-loading', '.vjs-ad-playing', '[class*="video-ad-"]', '.jw-ad-icon',
      // pop-ups, bandeaux collants, push
      '[class*="push-notification-prompt"]', '[id*="push-notification-prompt"]', '[class*="onesignal-slidedown"]',
      '#onesignal-slidedown-container', '#onesignal-popover-container', '.pn-prompt', '[class*="notification-prompt"]',
      '.adhesion-ad', '.ad-adhesion', '[class*="anchor-ad"]', '[id*="anchor-ad"]',
      '[class*="vignette-ad"]', '#ad-vignette', '[class*="ad-lightbox"]', '[id*="ad-lightbox"]', '[class*="ad-takeover"]',
      '[class*="wallpaper-ad"]', '[class*="skin-ad"]', '[class*="adskin"]', '#adskin', '.pushdown-ad',
      // moteurs de recherche
      '#tads', '#tadsb', '#bottomads', '#topads', '#center_col > #tads', '[data-text-ad]', '[data-text-ad="1"]', '.ads-ad',
      '.ads-visurl', '.commercial-unit-desktop-top', '.commercial-unit-desktop-rhs', '.commercial-unit-mobile-top', '#rhs .cu-container',
      '.pla-unit', '.pla-unit-container', '.pla-hovercard-container', '.uEierd', '.cu-container', '#tvcap', '[aria-label="Ads"]',
      'div[data-hveid][data-ved] > div[data-text-ad]', '.mnr-c.pla-unit', '.sh-sr__shop-result-group[data-hveid] [data-sh-ad]',
      'li.b_ad', '.b_ad', '.b_adBottom', '.b_adTop', '.b_adLastChild', '.sb_adTA', '#b_results > li.b_ad', '.b_algospacing .b_ad',
      '.result--ad', '.result--ad--small', '[data-testid="ad"]', '.badge--ad', '.js-sidebar-ads', '#ads', '.ads--header',
      '.ad-result', '.search-ad', '[class*="sponsored-result"]', '[class*="SponsoredResult"]', '.sponsored-listing',
      '[data-component-type="sp-sponsored-result"]', '.AdHolder', '.s-sponsored-label-info-icon',
      '.ec_wise_ad', '#content_left > div[data-tuiguang]', '[data-tuiguang]'
    ];

    // sélecteurs propres à certains sites
    const BY_HOST = [
      [/(^|\.)youtube\.com$|(^|\.)youtube-nocookie\.com$/, [
        'ytd-ad-slot-renderer', 'ytd-in-feed-ad-layout-renderer', 'ytd-display-ad-renderer', 'ytd-promoted-sparkles-web-renderer',
        'ytd-promoted-video-renderer', 'ytd-compact-promoted-video-renderer', 'ytd-banner-promo-renderer', 'ytd-statement-banner-renderer',
        'ytd-primetime-promo-renderer', 'ytd-video-masthead-ad-v3-renderer', 'ytd-brand-video-singleton-renderer',
        'ytd-brand-video-shelf-renderer', 'ytd-search-pyv-renderer', 'ytd-action-companion-ad-renderer', 'ytd-companion-slot-renderer',
        'ytd-player-legacy-desktop-watch-ads-renderer', 'ytd-promoted-sparkles-text-search-renderer', 'ytm-promoted-sparkles-web-renderer',
        'ytm-promoted-video-renderer', 'ytm-companion-ad-renderer', '#masthead-ad', '#player-ads', '#panels > ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
        '.ytp-ad-overlay-container', '.ytp-ad-image-overlay', '.ytp-ad-text-overlay',
        '.video-ads.ytp-ad-module', 'ytd-rich-item-renderer:has(> #content > ytd-ad-slot-renderer)',
        'ytd-rich-section-renderer:has(ytd-statement-banner-renderer)', 'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)',
        '.ytd-ad-slot-renderer', '#shorts-inner-container > .reel-video-in-sequence:has(ytd-ad-slot-renderer)'
      ]],
      [/(^|\.)reddit\.com$/, ['shreddit-ad-post', 'shreddit-comments-page-ad', '.promotedlink', '.promoted', '[data-promoted="true"]',
        'shreddit-post[is-promoted]', 'faceplate-tracker[source="ad"]', '[slot="ad"]', 'div[data-testid="post-container"]:has([data-testid="promoted-tag"])']],
      [/(^|\.)linkedin\.com$/, ['.ad-banner-container', '[data-ad-banner]', '.ads-container', '.feed-shared-ad', '[class*="sponsored-update"]',
        '.feed-shared-update-v2--sponsored', 'iframe[src*="/ads/"]', '.msg-overlay-list-bubble__ad']],
      [/(^|\.)twitch\.tv$/, ['.stream-display-ad', '[data-test-selector="ad-banner-default-text"]', '.video-player__overlay [data-a-target="player-overlay-ad"]',
        '.tw-promoted-tag', '[data-a-target="ad-countdown"]']],
      [/(^|\.)facebook\.com$/, ['a[href*="/ads/about"]', '[aria-label="Sponsored"]', 'div[data-pagelet="RightRail"] [data-pagelet^="Ad"]',
        '[data-pagelet="FeedUnit_0"]:has(a[href*="/ads/about"])']],
      [/(^|\.)yandex\.[a-z.]+$|(^|\.)ya\.ru$/, ['.serp-adv', '.serp-adv__item', '.serp-adv-item', '.serp-adv__found', '[data-fast-name="direct"]',
        '.Direct', '.AdvBanner', '.ya-adv', '[class*="AdvLabel"]', '[class*="DirectAd"]',
        '.main-ad', '.mini-suggest__ad', '.news-feed__ad', '.EmbeddedAdv',
        '.AdvOffer-Item', '.Label_type_advert', '.label_type_advert', '[class*="Label_type_adv"]', '.i-ads']],
      [/(^|\.)mail\.ru$/, ['.ad-block', '.b-ad', '[class*="ad-banner"]', '#banner-top', '.js-banner', '[data-ad]']],
      [/(^|\.)vk\.com$/, ['#ads_left', '.ads_ad_box', '.ads_ads_news_wrap', '#feed_rows > .feed_row:has(.wall_marked_as_ads)', '.wall_marked_as_ads']],
      [/(^|\.)amazon\.[a-z.]+$/, ['[data-component-type="sp-sponsored-result"]', '.AdHolder', '#adplacements', '.s-result-item[data-component-type="s-ads-metrics"]',
        '[cel_widget_id*="sp-sponsored"]', '[data-cel-widget*="MAIN-FEATURED_ASINS"]', '[id^="sp_detail"]', '#sp_detail', '[id^="sp_hqp"]',
        '#sponsoredProducts', '.sbv-product', '[class*="sponsored-products"]', '#desktop-banner', '#gw-desktop-herotator-ad']],
      [/(^|\.)ebay\.[a-z.]+$/, ['.srp-river-results .s-item__ad', '[class*="s-item__ad"]', '.x-sponsored-label', '.s-item--ad', '#gpt-top-ad', '[id^="gpt-"]']],
      [/(^|\.)(cnn|bbc|nytimes|theguardian|washingtonpost|forbes|bloomberg|reuters|lemonde|lefigaro|20minutes|liberation|leparisien|lequipe|bfmtv|ouest-france|francetvinfo)\.[a-z.]+$/, [
        '[class*="ad-"][class*="slot"]', '[class*="ad_"][class*="slot"]', '[data-ad-region]', '[id^="ad-slot"]', '[class*="commercial-unit"]',
        '[class*="outbrain"]', '[class*="paid-content"]', '[class*="native-content"]', '.ad--rectangle', '.ad--leaderboard', '.ad--wallpaper']],
      [/(^|\.)(imdb|rottentomatoes|tripadvisor|booking|weather|accuweather|speedtest|fandom|wikia)\.[a-z.]+$/, ['[class*="ad-slot"]', '[id*="ad-slot"]', '#top_ad', '#bottom_ad', '.ad-wrap']]
    ];

    const extra = BY_HOST.filter(([re]) => re.test(host)).flatMap(([, s]) => s);
    const valid = s => { try { return CSS.supports(`selector(${s})`); } catch { return false; } };
    const SEL_LIST = [...new Set([...GENERIC, ...extra])].filter(valid);
    const SEL = SEL_LIST.join(",");

    // règles séparées : un sélecteur invalide ne casse pas les autres
    const st = document.createElement("style");
    st.id = "wisp-cosmetic";
    const SAFE = /(^|\.)(youtube\.com|youtube-nocookie\.com)$/.test(location.hostname) ? ":not(ytd-masthead):not(ytd-masthead *):not(#masthead-container):not(#masthead-container *):not(yt-searchbox):not(yt-searchbox *):not(ytd-searchbox):not(ytd-searchbox *):not(form[role=search]):not(form[role=search] *)" : "";
    st.textContent = SEL_LIST.map(s => s + SAFE + "{display:none!important}").join("\n");
    (document.head || document.documentElement).append(st);

    // ---------------------------------------------------------------- détection par motifs
    const AD = /doubleclick|googlesyndication|googleadservices|adsterra|exoclick|exosrv|propeller|popads|popcash|taboola|outbrain|monetag|hilltopads|clickadu|juicyads|adcash|mgid|highperformanceformat|effectivegatecpm|profitablecpm|onclickads|realsrv|pushame|a-ads|criteo|adnxs|yandexadexchange|an\.yandex|yabs\.yandex|adfox|yandex\.[a-z]+\/ads|adriver|pubmatic|rubiconproject|openx\.net|amazon-adsystem|smartadserver|teads|revcontent|adskeeper|trafficjunky|trafficstars/i;
    const LABELS = new Set([
      "advertisement", "advertisements", "advertisment", "advertising", "ad", "sponsored", "sponsored content", "sponsored links",
      "promoted", "promoted content", "partner content", "paid content", "advertorial", "ad choices", "adchoices", "ads by google",
      "publicité", "publicités", "sponsorisé", "sponsorisée", "contenu sponsorisé", "liens sponsorisés", "annonce", "annonces",
      "publi-information", "publireportage", "anzeige", "anzeigen", "werbung", "gesponsert", "publicidad", "anuncio", "anuncios",
      "patrocinado", "publicidade", "pubblicità", "sponsorizzato", "annuncio", "advertentie", "gesponsord", "reklam", "reklama", "reklamy",
      "реклама", "рекламное объявление", "яндекс директ", "яндекс.директ", "yandex direct", "промо", "на правах рекламы",
      "広告", "광고", "广告", "廣告", "إعلان"
    ]);
    const AP = /(^|[\/_.-])(ads?|adv|adverts?|advertis\w*|adbanner|adimg|adimage|adview|banner[-_]?ads?|sponsor\w*)([\/_.?-]|\d|$)|(^|\D)(728x90|468x60|300x250|336x280|160x600|120x600|970x90|320x50|300x600)(\D|$)/i;
    const adImg = i => AP.test(i.currentSrc || i.src || "");
    const isYandex = /(^|\.)(yandex\.[a-z.]+|ya\.ru)$/.test(host);
    document.addEventListener("error", e => { const t = e.target; if (t && t.tagName === "IMG" && adImg(t)) hide(t); }, true);

    const seen = new WeakSet(); let n = 0, sent = 0, timer = 0;
    const hide = el => { if (!el || seen.has(el)) return; try { if (el.closest && el.closest("ytd-masthead,#masthead-container,yt-searchbox,ytd-searchbox,form[role=search]")) return; if (el.querySelector && el.querySelector("input[type=search],input[name=search_query]")) return; } catch {} seen.add(el); el.style.setProperty("display", "none", "important"); n++; };

    // murs « désactivez votre bloqueur de publicités »
    const WALL = /ad[\s-]?block|bloqueur de pub|bloqueur de publicit|ad[\s-]?blocker|disable (your |the )?ad|d[ée]sactiv\w+ (votre |le |l['’])?(bloqueur|adblock)|werbeblocker|werbeblock|bloqueador de anuncios|bloqueador de publicidad|блокировщик\w* рекламы|антиблок|отключите.{0,20}блокировщик|reklam engelleyici/i;
    const WALL_SEL = '[id*="adblock" i],[class*="adblock" i],[id*="anti-ad" i],[class*="anti-ad" i],[class*="adb-" i],[id*="adb-" i],[class*="ad-block" i],[id*="ad-block" i],[class*="modal"],[class*="overlay"],[class*="popup"],[class*="paywall"],[role="dialog"],[class*="notice"],[class*="wall"]';
    function unlockScroll() {
      for (const e of [document.documentElement, document.body]) {
        if (!e) continue;
        const cs = getComputedStyle(e);
        if (cs.overflow === "hidden" || cs.overflowY === "hidden") { e.style.setProperty("overflow", "auto", "important"); e.style.setProperty("overflow-y", "auto", "important"); }
        if (e.classList) for (const c of [...e.classList]) if (/^(no-?scroll|modal-open|overflow-hidden|noscroll|locked|scroll-lock|has-modal|disable-scroll)$/i.test(c)) e.classList.remove(c);
      }
    }
    function killWalls() {
      let removed = false;
      document.querySelectorAll(WALL_SEL).forEach(el => {
        if (seen.has(el) || el === document.body || el === document.documentElement) return;
        const t = (el.textContent || "").trim();
        if (!t || t.length > 900 || !WALL.test(t)) return;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const covers = r.width > innerWidth * .5 && r.height > innerHeight * .25;
        if (!/fixed|absolute|sticky/.test(cs.position) && !covers) return;
        if ((+cs.zIndex || 0) < 10 && !covers) return;
        hide(el); el.remove(); removed = true;
      });
      document.querySelectorAll('[id*="adblock" i],[class*="adblock" i],[class*="anti-ad" i],[id*="anti-ad" i]').forEach(el => {
        if (el === document.body || el === document.documentElement || el.querySelector("main,article,form,input")) return;
        if ((el.textContent || "").length < 900 && WALL.test(el.textContent || "")) { hide(el); removed = true; }
      });
      if (removed) unlockScroll();
    }

    function sweep() {
      timer = 0;
      try { SEL && document.querySelectorAll(SEL).forEach(hide); } catch {}
      document.querySelectorAll("img").forEach(i => adImg(i) && hide(i));
      document.querySelectorAll("iframe[src]").forEach(f => AD.test(f.src) && hide(f));
      document.querySelectorAll("a[target=_blank][href]").forEach(a => {
        if (seen.has(a) || !AD.test(a.href)) return;
        const im = a.querySelector("img,iframe,canvas,video");
        if (im) hide(a);
      });
      document.querySelectorAll("div,span,p,small,b,h5,h6,em,i,label").forEach(el => {
        if (el.children.length || seen.has(el)) return;
        const t = el.textContent.trim().toLowerCase();
        if (!t || t.length > 40 || !LABELS.has(t)) return;
        if (isYandex) {
          const c = el.closest(".serp-item,li[data-cid],div[data-cid],.Organic,.organic");
          if (c) return hide(c);
        }
        const p = el.parentElement;
        hide(p && p !== document.body && p.innerText.trim().length <= t.length + 5 ? p : el);
      });
      killWalls();
      // calques invisibles plein écran qui volent les clics
      if (document.body) for (const el of document.body.children) {
        if (seen.has(el) || !/^(DIV|A|SPAN|IFRAME)$/.test(el.tagName)) continue;
        const cs = getComputedStyle(el);
        if (!/fixed|absolute/.test(cs.position) || (+cs.zIndex || 0) < 100) continue;
        const r = el.getBoundingClientRect();
        if (r.width < innerWidth * .8 || r.height < innerHeight * .8) continue;
        if (el.tagName === "IFRAME" ? AD.test(el.src) : !el.innerText.trim() && !el.querySelector("img,video,canvas,svg,input,button")) { hide(el); el.remove(); }
      }
      flush();
    }
    function flush() { if (n > sent) { try { chrome.runtime.sendMessage({ wisp: 1, n: n - sent }); } catch {} sent = n; } }
    addEventListener("wisp-blocked", () => { n++; flush(); });
    const go = () => { if (!timer) timer = setTimeout(sweep, 250); };
    new MutationObserver(go).observe(document.documentElement, { childList: true, subtree: true });
    addEventListener("DOMContentLoaded", go); addEventListener("load", go); go();

    // ---------------------------------------------------------------- YouTube : saute / accélère les pubs vidéo
    if (/(^|\.)youtube\.com$/.test(location.hostname)) {
      let saved = null;
      setInterval(() => {
        const p = document.querySelector(".html5-video-player");
        if (!p) return;
        const v = p.querySelector("video.html5-main-video") || p.querySelector("video");
        const ad = p.classList.contains("ad-showing") || p.classList.contains("ad-interrupting");
        if (ad && v) {
          if (!saved) { saved = { m: v.muted, r: v.playbackRate }; n++; flush(); }
          v.muted = true;
          try { v.playbackRate = 16; } catch {}
          if (isFinite(v.duration) && v.duration > 0 && v.currentTime < v.duration - 0.2) v.currentTime = v.duration - 0.1;
          p.querySelectorAll(".ytp-ad-skip-button,.ytp-ad-skip-button-modern,.ytp-skip-ad-button,.ytp-ad-skip-button-container button").forEach(b => b.click());
        } else if (saved && v) {
          v.muted = saved.m; try { v.playbackRate = saved.r; } catch {}
          saved = null;
        }
        document.querySelectorAll(".ytp-ad-overlay-close-button,.ytp-ad-overlay-close-container").forEach(b => b.click());
      }, 250);
    }
  }
})();
