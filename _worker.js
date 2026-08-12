const SMARTSUPP_KEY = "2ad39f1c368fcebf6bed7b4dc7e4ce7eb234e225";

const HEAD_INJECT = `
<!-- A-Z Biuro: Smartsupp + cookies -->
<meta name="format-detection" content="telephone=no">
<link rel="dns-prefetch" href="//www.smartsuppchat.com">
<link rel="preconnect" href="https://www.smartsuppchat.com" crossorigin>
<style id="az-cookie-style">
  :root { --az-red:#cd0000; --az-red-dark:#a90000; }

  #az-cookie-tab {
    position:fixed;
    left:0;
    top:72%;
    transform:translateY(-50%);
    z-index:2147483000;
    border:0;
    border-radius:0 8px 8px 0;
    padding:12px 9px;
    background:var(--az-red);
    color:#fff;
    font:700 13px/1.1 Arial,sans-serif;
    cursor:pointer;
    box-shadow:0 4px 16px rgba(0,0,0,.20);
    writing-mode:vertical-rl;
  }
  #az-cookie-tab:hover { background:var(--az-red-dark); }

  #az-cookie-banner,
  #az-cookie-panel {
    position:fixed;
    left:18px;
    bottom:18px;
    z-index:2147483001;
    width:min(390px,calc(100vw - 36px));
    box-sizing:border-box;
    background:#fff;
    color:#222;
    border:1px solid #e3e3e3;
    border-radius:8px;
    box-shadow:0 12px 38px rgba(0,0,0,.24);
    padding:18px;
    font:14px/1.45 Arial,sans-serif;
  }

  #az-cookie-banner[hidden],
  #az-cookie-panel[hidden] { display:none !important; }

  .az-cookie-title {
    margin:0 0 8px;
    font-size:18px;
    line-height:1.2;
    font-weight:700;
  }

  .az-cookie-text {
    margin:0 0 14px;
    color:#444;
  }

  .az-cookie-actions {
    display:flex;
    flex-wrap:wrap;
    gap:8px;
  }

  .az-cookie-btn {
    appearance:none;
    border:1px solid var(--az-red);
    border-radius:8px;
    padding:10px 12px;
    background:#fff;
    color:var(--az-red);
    font:700 13px/1 Arial,sans-serif;
    cursor:pointer;
  }

  .az-cookie-btn.az-primary {
    background:var(--az-red);
    color:#fff;
  }

  .az-cookie-btn:hover { filter:brightness(.96); }

  .az-cookie-row {
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    margin:12px 0;
    padding:11px 0;
    border-top:1px solid #eee;
  }

  .az-cookie-row strong {
    display:block;
    margin-bottom:2px;
  }

  .az-cookie-small {
    color:#666;
    font-size:12px;
  }

  .az-switch {
    position:relative;
    width:46px;
    height:26px;
    flex:0 0 46px;
  }

  .az-switch input {
    opacity:0;
    width:0;
    height:0;
  }

  .az-slider {
    position:absolute;
    inset:0;
    border-radius:999px;
    background:#bbb;
    cursor:pointer;
    transition:.2s;
  }

  .az-slider:before {
    content:"";
    position:absolute;
    width:20px;
    height:20px;
    left:3px;
    top:3px;
    border-radius:50%;
    background:#fff;
    transition:.2s;
    box-shadow:0 1px 3px rgba(0,0,0,.25);
  }

  .az-switch input:checked + .az-slider {
    background:var(--az-red);
  }

  .az-switch input:checked + .az-slider:before {
    transform:translateX(20px);
  }

  .az-switch input:disabled + .az-slider {
    opacity:.55;
    cursor:not-allowed;
  }

  @media (max-width:640px) {
    #az-cookie-tab {
      top:auto;
      bottom:92px;
      transform:none;
    }
    #az-cookie-banner,
    #az-cookie-panel {
      left:10px;
      bottom:10px;
      width:calc(100vw - 20px);
      max-height:80vh;
      overflow:auto;
    }
  }
</style>
`;

const BODY_INJECT = `
<button id="az-cookie-tab" type="button" aria-label="Ustawienia cookies">Cookies</button>

<div id="az-cookie-banner" hidden>
  <div class="az-cookie-title">Ustawienia cookies</div>
  <p class="az-cookie-text">
    Używamy niezbędnych plików cookie do działania strony. Po Twojej zgodzie
    uruchomimy także komunikator Smartsupp.
  </p>
  <div class="az-cookie-actions">
    <button class="az-cookie-btn az-primary" id="az-cookie-all" type="button">Akceptuję wszystkie</button>
    <button class="az-cookie-btn" id="az-cookie-necessary" type="button">Tylko niezbędne</button>
    <button class="az-cookie-btn" id="az-cookie-settings" type="button">Ustawienia</button>
  </div>
</div>

<div id="az-cookie-panel" hidden>
  <div class="az-cookie-title">Preferencje cookies</div>

  <div class="az-cookie-row">
    <div>
      <strong>Niezbędne</strong>
      <div class="az-cookie-small">Potrzebne do podstawowego działania strony.</div>
    </div>
    <label class="az-switch">
      <input type="checkbox" checked disabled>
      <span class="az-slider"></span>
    </label>
  </div>

  <div class="az-cookie-row">
    <div>
      <strong>Komunikator Smartsupp</strong>
      <div class="az-cookie-small">Pozwala uruchomić czat z obsługą A-Z Biuro.</div>
    </div>
    <label class="az-switch">
      <input id="az-cookie-chat" type="checkbox">
      <span class="az-slider"></span>
    </label>
  </div>

  <div class="az-cookie-actions">
    <button class="az-cookie-btn az-primary" id="az-cookie-save" type="button">Zapisz ustawienia</button>
    <button class="az-cookie-btn" id="az-cookie-close" type="button">Anuluj</button>
  </div>
</div>

<script id="az-smartsupp-cookie-script">
(function () {
  var COOKIE_NAME = "azbiuro_cookie_consent";
  var COOKIE_DAYS = 180;
  var SMARTSUPP_KEY = "${SMARTSUPP_KEY}";

  function getConsent() {
    var prefix = COOKIE_NAME + "=";
    var parts = document.cookie ? document.cookie.split(";") : [];
    for (var i = 0; i < parts.length; i++) {
      var item = parts[i].trim();
      if (item.indexOf(prefix) === 0) {
        try {
          return JSON.parse(decodeURIComponent(item.substring(prefix.length)));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  function setConsent(value) {
    var expires = new Date(Date.now() + COOKIE_DAYS * 86400000).toUTCString();
    document.cookie =
      COOKIE_NAME + "=" + encodeURIComponent(JSON.stringify(value)) +
      "; expires=" + expires +
      "; path=/; SameSite=Lax; Secure";
  }

  function loadSmartsupp() {
    if (window.__azSmartsuppLoaded) return;
    window.__azSmartsuppLoaded = true;

    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = SMARTSUPP_KEY;

    if (!window.smartsupp) {
      var d = document;
      var s = d.getElementsByTagName("script")[0];
      var c;
      var o = window.smartsupp = function () { o._.push(arguments); };
      o._ = [];
      c = d.createElement("script");
      c.type = "text/javascript";
      c.charset = "utf-8";
      c.async = true;
      c.src = "https://www.smartsuppchat.com/loader.js";
      s.parentNode.insertBefore(c, s);
    }
  }

  var banner = document.getElementById("az-cookie-banner");
  var panel = document.getElementById("az-cookie-panel");
  var tab = document.getElementById("az-cookie-tab");
  var chat = document.getElementById("az-cookie-chat");

  function openPanel() {
    var consent = getConsent();
    chat.checked = !!(consent && consent.chat);
    banner.hidden = true;
    panel.hidden = false;
  }

  function closePanel() {
    panel.hidden = true;
  }

  function applyConsent(consent) {
    if (consent && consent.chat) loadSmartsupp();
  }

  document.getElementById("az-cookie-all").addEventListener("click", function () {
    var consent = { necessary: true, chat: true, ts: Date.now() };
    setConsent(consent);
    banner.hidden = true;
    panel.hidden = true;
    applyConsent(consent);
  });

  document.getElementById("az-cookie-necessary").addEventListener("click", function () {
    var previous = getConsent();
    setConsent({ necessary: true, chat: false, ts: Date.now() });
    banner.hidden = true;
    panel.hidden = true;
    if (previous && previous.chat && window.__azSmartsuppLoaded) {
      location.reload();
    }
  });

  document.getElementById("az-cookie-settings").addEventListener("click", openPanel);
  document.getElementById("az-cookie-close").addEventListener("click", closePanel);
  tab.addEventListener("click", openPanel);

  document.getElementById("az-cookie-save").addEventListener("click", function () {
    var previous = getConsent();
    var consent = { necessary: true, chat: !!chat.checked, ts: Date.now() };
    setConsent(consent);
    panel.hidden = true;
    applyConsent(consent);

    if (previous && previous.chat && !consent.chat && window.__azSmartsuppLoaded) {
      location.reload();
    }
  });

  var consent = getConsent();
  if (!consent) {
    banner.hidden = false;
  } else {
    applyConsent(consent);
  }
})();
</script>
`;

function injectBefore(html, closingTag, payload) {
  const lower = html.toLowerCase();
  const idx = lower.lastIndexOf(closingTag);
  if (idx === -1) return html + payload;
  return html.slice(0, idx) + payload + html.slice(idx);
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return response;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("text/html")) {
      return response;
    }

    let html = await response.text();

    if (!html.includes('id="az-smartsupp-cookie-script"')) {
      html = injectBefore(html, "</head>", HEAD_INJECT);
      html = injectBefore(html, "</body>", BODY_INJECT);
    }

    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.delete("content-encoding");

    return new Response(request.method === "HEAD" ? null : html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
