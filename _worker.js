/**
 * poradnik.eazbiuro.pl
 * Globalne elementy jak na eazbiuro.pl:
 * - "Napisz do nas" po prawej
 * - Smartsupp po prawej na dole
 * - ustawienia cookies w LEWYM DOLNYM ROGU (nie w bocznej listwie)
 *
 * 2026-08-12
 */

const SMARTSUPP_KEY = "2ad39f1c368fcebf6bed7b4dc7e4ce7eb234e225";
const CONTACT_URL = "https://eazbiuro.pl/pl/page/zapytaj-nas-online";

const HEAD = `
<meta name="format-detection" content="telephone=no">
<link rel="dns-prefetch" href="//www.smartsuppchat.com">
<link rel="preconnect" href="https://www.smartsuppchat.com" crossorigin>

<style id="az-eazbiuro-widgets-css">
  :root {
    --az-red:#cd0000;
    --az-red-dark:#a90000;
  }

  /* ===== NAPISZ DO NAS – prawa krawędź ===== */
  html body #az-write-to-us {
    position:fixed !important;
    right:0 !important;
    left:auto !important;
    top:50% !important;
    bottom:auto !important;
    transform:translateY(-50%) !important;
    z-index:2147483600 !important;

    display:flex !important;
    align-items:center !important;
    justify-content:center !important;

    width:42px !important;
    min-width:42px !important;
    height:156px !important;
    min-height:156px !important;
    margin:0 !important;
    padding:10px 0 !important;

    background:var(--az-red) !important;
    color:#fff !important;
    border:0 !important;
    border-radius:9px 0 0 9px !important;
    box-shadow:0 5px 18px rgba(0,0,0,.25) !important;

    text-decoration:none !important;
    font-family:Arial,Helvetica,sans-serif !important;
    font-size:14px !important;
    line-height:1 !important;
    font-weight:700 !important;
    letter-spacing:.01em !important;
    white-space:nowrap !important;

    writing-mode:vertical-rl !important;
    text-orientation:mixed !important;
  }

  html body #az-write-to-us:hover {
    background:var(--az-red-dark) !important;
    color:#fff !important;
  }

  /* ===== COOKIES – wyłącznie lewy dolny róg ===== */
  html body #az-cookie-button {
    position:fixed !important;
    left:16px !important;
    right:auto !important;
    bottom:16px !important;
    top:auto !important;
    transform:none !important;
    z-index:2147483500 !important;

    width:48px !important;
    height:48px !important;
    min-width:48px !important;
    min-height:48px !important;
    margin:0 !important;
    padding:0 !important;

    display:flex !important;
    align-items:center !important;
    justify-content:center !important;

    border:0 !important;
    border-radius:50% !important;
    background:var(--az-red) !important;
    color:#fff !important;
    box-shadow:0 5px 18px rgba(0,0,0,.23) !important;
    cursor:pointer !important;
  }

  html body #az-cookie-button:hover {
    background:var(--az-red-dark) !important;
  }

  #az-cookie-button svg {
    width:25px !important;
    height:25px !important;
    fill:none !important;
    stroke:#fff !important;
    stroke-width:2 !important;
    border-radius:0 !important;
  }

  html body #az-cookie-notice {
    position:fixed !important;
    left:16px !important;
    right:auto !important;
    bottom:76px !important;
    top:auto !important;
    transform:none !important;
    z-index:2147483550 !important;

    width:min(430px,calc(100vw - 32px)) !important;
    margin:0 !important;
    padding:18px !important;
    box-sizing:border-box !important;

    background:#fff !important;
    color:#222 !important;
    border:1px solid #e2e2e2 !important;
    border-radius:9px !important;
    box-shadow:0 12px 38px rgba(0,0,0,.24) !important;

    font-family:Arial,Helvetica,sans-serif !important;
    font-size:14px !important;
    line-height:1.45 !important;
  }

  #az-cookie-notice[hidden],
  #az-cookie-modal[hidden],
  #az-cookie-overlay[hidden] {
    display:none !important;
  }

  #az-cookie-notice strong {
    display:block !important;
    margin:0 0 6px !important;
    font-size:17px !important;
  }

  #az-cookie-notice p {
    margin:0 0 13px !important;
    color:#4b4b4b !important;
  }

  .az-cookie-actions {
    display:flex !important;
    flex-wrap:wrap !important;
    gap:8px !important;
  }

  .az-cookie-action {
    min-height:40px !important;
    padding:9px 13px !important;
    border:1px solid var(--az-red) !important;
    border-radius:8px !important;
    background:#fff !important;
    color:var(--az-red) !important;
    cursor:pointer !important;
    font-family:Arial,Helvetica,sans-serif !important;
    font-size:13px !important;
    font-weight:700 !important;
  }

  .az-cookie-action.az-main {
    background:var(--az-red) !important;
    color:#fff !important;
  }

  html body #az-cookie-overlay {
    position:fixed !important;
    inset:0 !important;
    z-index:2147483560 !important;
    background:rgba(0,0,0,.42) !important;
  }

  html body #az-cookie-modal {
    position:fixed !important;
    left:50% !important;
    top:50% !important;
    right:auto !important;
    bottom:auto !important;
    transform:translate(-50%,-50%) !important;
    z-index:2147483570 !important;

    width:min(560px,calc(100vw - 30px)) !important;
    max-height:calc(100vh - 30px) !important;
    overflow:auto !important;
    box-sizing:border-box !important;
    margin:0 !important;
    padding:22px !important;

    border:0 !important;
    border-radius:10px !important;
    background:#fff !important;
    color:#222 !important;
    box-shadow:0 20px 70px rgba(0,0,0,.34) !important;
    font-family:Arial,Helvetica,sans-serif !important;
  }

  #az-cookie-modal h2 {
    margin:0 0 8px !important;
    font-size:20px !important;
  }

  #az-cookie-modal > p {
    margin:0 0 12px !important;
    color:#555 !important;
  }

  .az-consent-row {
    display:flex !important;
    align-items:center !important;
    justify-content:space-between !important;
    gap:15px !important;
    padding:14px 0 !important;
    border-top:1px solid #eee !important;
  }

  .az-consent-row strong {
    display:block !important;
    margin-bottom:3px !important;
  }

  .az-consent-row small {
    color:#666 !important;
  }

  .az-switch {
    position:relative !important;
    width:46px !important;
    height:26px !important;
    flex:0 0 46px !important;
  }

  .az-switch input {
    opacity:0 !important;
    width:0 !important;
    height:0 !important;
  }

  .az-slider {
    position:absolute !important;
    inset:0 !important;
    border-radius:99px !important;
    background:#bbb !important;
    cursor:pointer !important;
  }

  .az-slider:before {
    content:"" !important;
    position:absolute !important;
    width:20px !important;
    height:20px !important;
    left:3px !important;
    top:3px !important;
    border-radius:50% !important;
    background:#fff !important;
    box-shadow:0 1px 4px rgba(0,0,0,.25) !important;
    transition:.18s !important;
  }

  .az-switch input:checked + .az-slider {
    background:var(--az-red) !important;
  }

  .az-switch input:checked + .az-slider:before {
    transform:translateX(20px) !important;
  }

  .az-switch input:disabled + .az-slider {
    opacity:.55 !important;
    cursor:default !important;
  }

  @media (max-width:640px) {
    html body #az-write-to-us {
      width:38px !important;
      min-width:38px !important;
      height:132px !important;
      min-height:132px !important;
      font-size:12px !important;
    }

    html body #az-cookie-button {
      left:10px !important;
      bottom:10px !important;
      width:44px !important;
      height:44px !important;
      min-width:44px !important;
      min-height:44px !important;
    }

    html body #az-cookie-notice {
      left:10px !important;
      bottom:64px !important;
      width:calc(100vw - 20px) !important;
    }
  }
</style>

<!-- Smartsupp – NIE jest połączony z ustawieniami cookies -->
<script id="az-smartsupp-global">
  var _smartsupp = _smartsupp || {};
  _smartsupp.key = '${SMARTSUPP_KEY}';

  window.smartsupp || (function(d) {
    var s,c,o = smartsupp = function(){ o._.push(arguments) };
    o._ = [];
    s = d.getElementsByTagName('script')[0];
    c = d.createElement('script');
    c.type = 'text/javascript';
    c.charset = 'utf-8';
    c.async = true;
    c.src = 'https://www.smartsuppchat.com/loader.js';
    s.parentNode.insertBefore(c,s);
  })(document);
</script>
`;

const BODY = `
<a id="az-write-to-us"
   href="${CONTACT_URL}"
   target="_blank"
   rel="noopener"
   aria-label="Napisz do nas">Napisz do nas</a>

<button id="az-cookie-button"
        type="button"
        aria-label="Ustawienia cookies"
        title="Ustawienia cookies">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.5 12.8A8.5 8.5 0 1 1 11.2 3.5a4 4 0 0 0 5.3 5.3 4 4 0 0 0 4 4z"></path>
    <circle cx="8" cy="9" r="1"></circle>
    <circle cx="8.5" cy="15" r="1"></circle>
    <circle cx="14" cy="15.5" r="1"></circle>
  </svg>
</button>

<div id="az-cookie-notice" hidden>
  <strong>Pliki cookies</strong>
  <p>
    Korzystamy z plików cookies niezbędnych do działania serwisu.
    Możesz również wyrazić zgodę na cookies analityczne i marketingowe.
  </p>
  <div class="az-cookie-actions">
    <button class="az-cookie-action az-main" id="az-cookie-all" type="button">Akceptuję</button>
    <button class="az-cookie-action" id="az-cookie-only-required" type="button">Tylko niezbędne</button>
    <button class="az-cookie-action" id="az-cookie-settings" type="button">Ustawienia</button>
  </div>
</div>

<div id="az-cookie-overlay" hidden></div>

<div id="az-cookie-modal" hidden role="dialog" aria-modal="true" aria-labelledby="az-cookie-title">
  <h2 id="az-cookie-title">Ustawienia plików cookies</h2>
  <p>Wybierz opcjonalne kategorie. Komunikator Smartsupp działa niezależnie od tych ustawień.</p>

  <div class="az-consent-row">
    <div>
      <strong>Niezbędne</strong>
      <small>Potrzebne do prawidłowego działania serwisu.</small>
    </div>
    <label class="az-switch">
      <input type="checkbox" checked disabled>
      <span class="az-slider"></span>
    </label>
  </div>

  <div class="az-consent-row">
    <div>
      <strong>Analityczne</strong>
      <small>Pomagają analizować sposób korzystania ze strony.</small>
    </div>
    <label class="az-switch">
      <input id="az-analytics" type="checkbox">
      <span class="az-slider"></span>
    </label>
  </div>

  <div class="az-consent-row">
    <div>
      <strong>Marketingowe</strong>
      <small>Służą do pomiaru i dopasowania działań marketingowych.</small>
    </div>
    <label class="az-switch">
      <input id="az-marketing" type="checkbox">
      <span class="az-slider"></span>
    </label>
  </div>

  <div class="az-cookie-actions" style="margin-top:14px">
    <button class="az-cookie-action az-main" id="az-cookie-save" type="button">Zapisz</button>
    <button class="az-cookie-action" id="az-cookie-close" type="button">Zamknij</button>
  </div>
</div>

<script id="az-eazbiuro-cookie-manager">
(function(){
  var COOKIE_NAME = "azbiuro_cookie_preferences";
  var COOKIE_DAYS = 180;

  function readPreferences(){
    var prefix = COOKIE_NAME + "=";
    var parts = document.cookie ? document.cookie.split(";") : [];
    for(var i=0;i<parts.length;i++){
      var item = parts[i].trim();
      if(item.indexOf(prefix) === 0){
        try {
          return JSON.parse(decodeURIComponent(item.substring(prefix.length)));
        } catch(e) {}
      }
    }
    return null;
  }

  function savePreferences(prefs){
    prefs.necessary = true;
    prefs.updated = Date.now();
    var expires = new Date(Date.now() + COOKIE_DAYS * 86400000).toUTCString();
    document.cookie =
      COOKIE_NAME + "=" + encodeURIComponent(JSON.stringify(prefs)) +
      "; expires=" + expires +
      "; path=/; SameSite=Lax; Secure";
    return prefs;
  }

  function updateGoogleConsent(prefs){
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    window.gtag("consent","update",{
      analytics_storage: prefs.analytics ? "granted" : "denied",
      ad_storage: prefs.marketing ? "granted" : "denied",
      ad_user_data: prefs.marketing ? "granted" : "denied",
      ad_personalization: prefs.marketing ? "granted" : "denied"
    });
  }

  var notice = document.getElementById("az-cookie-notice");
  var overlay = document.getElementById("az-cookie-overlay");
  var modal = document.getElementById("az-cookie-modal");
  var analytics = document.getElementById("az-analytics");
  var marketing = document.getElementById("az-marketing");

  function openSettings(){
    var prefs = readPreferences() || {analytics:false,marketing:false};
    analytics.checked = !!prefs.analytics;
    marketing.checked = !!prefs.marketing;
    notice.hidden = true;
    overlay.hidden = false;
    modal.hidden = false;
  }

  function closeSettings(){
    overlay.hidden = true;
    modal.hidden = true;
  }

  function accept(prefs){
    prefs = savePreferences(prefs);
    updateGoogleConsent(prefs);
    notice.hidden = true;
    closeSettings();
  }

  document.getElementById("az-cookie-button").addEventListener("click",openSettings);
  document.getElementById("az-cookie-settings").addEventListener("click",openSettings);
  document.getElementById("az-cookie-close").addEventListener("click",closeSettings);
  overlay.addEventListener("click",closeSettings);

  document.getElementById("az-cookie-all").addEventListener("click",function(){
    accept({analytics:true,marketing:true});
  });

  document.getElementById("az-cookie-only-required").addEventListener("click",function(){
    accept({analytics:false,marketing:false});
  });

  document.getElementById("az-cookie-save").addEventListener("click",function(){
    accept({
      analytics:!!analytics.checked,
      marketing:!!marketing.checked
    });
  });

  var prefs = readPreferences();
  if(prefs){
    updateGoogleConsent(prefs);
  } else {
    notice.hidden = false;
  }
})();
</script>
`;

function injectBefore(html, tag, value) {
  const lower = html.toLowerCase();
  const pos = lower.lastIndexOf(tag);
  if (pos === -1) return html + value;
  return html.slice(0,pos) + value + html.slice(pos);
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return response;
    }

    const type = response.headers.get("content-type") || "";
    if (!type.toLowerCase().includes("text/html")) {
      return response;
    }

    let html = await response.text();

    if (!html.includes('id="az-eazbiuro-widgets-css"')) {
      html = injectBefore(html, "</head>", HEAD);
    }

    if (!html.includes('id="az-write-to-us"')) {
      html = injectBefore(html, "</body>", BODY);
    }

    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.delete("content-encoding");
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

    return new Response(request.method === "HEAD" ? null : html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
