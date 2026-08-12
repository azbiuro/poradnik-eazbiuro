/**
 * A-Z Biuro — globalne widżety dla poradnik.eazbiuro.pl
 * Plik przeznaczony do katalogu głównego projektu Cloudflare Pages.
 *
 * Działa globalnie dla każdej odpowiedzi HTML bez edycji tysięcy plików.
 * Pozostałe zasoby są serwowane bez zmian przez env.ASSETS.fetch().
 *
 * Wersja: 2026-08-12
 */

const BRAND_RED = "#cd0000";
const BRAND_RED_DARK = "#a90000";
const CONTACT_URL = "https://eazbiuro.pl/pl/page/zapytaj-nas-online";
const SHOP_URL = "https://eazbiuro.pl/";
const PHONE_HREF = "tel:+48327689393";
const PHONE_LABEL = "32 768 93 93";

/*
 * WAŻNE — właściwy kod dostawcy czatu:
 * Nie udało się wiarygodnie odczytać publicznego identyfikatora widżetu czatu
 * używanego na eazbiuro.pl. Nie wpisujemy zgadywanego kodu.
 *
 * Gdy będzie dostępny oryginalny snippet <script>...</script>, można wkleić go
 * do stałej CHAT_VENDOR_HTML poniżej. Worker dołączy go globalnie.
 *
 * Jeżeli snippet ustawia opcjonalne cookies, najlepiej ładować go dopiero po
 * zgodzie „Funkcjonalne”. W obecnej wersji, przy pustej stałej, widoczny jest
 * bezpieczny launcher kontaktowy prowadzący do eazbiuro.pl.
 */
const CHAT_VENDOR_HTML = ``;

const GLOBAL_STYLE = String.raw`
<style id="az-global-widget-style">
  :root { --az-widget-red: ${BRAND_RED}; --az-widget-red-dark: ${BRAND_RED_DARK}; }

  .az-contact-tab,
  .az-cookie-tab,
  .az-chat-launcher,
  .az-chat-card,
  .az-cookie-banner,
  .az-cookie-modal,
  .az-cookie-backdrop {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    box-sizing: border-box;
  }
  .az-contact-tab *, .az-cookie-tab *, .az-chat-launcher *, .az-chat-card *,
  .az-cookie-banner *, .az-cookie-modal * { box-sizing: border-box; }

  .az-contact-tab {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2147482000;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 150px;
    padding: 16px 10px;
    border-radius: 12px 0 0 12px;
    background: var(--az-widget-red);
    color: #fff !important;
    text-decoration: none !important;
    font-size: 14px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: .02em;
    box-shadow: 0 10px 30px rgba(0,0,0,.22);
    writing-mode: vertical-rl;
    transform-origin: right center;
  }
  .az-contact-tab:hover { background: var(--az-widget-red-dark); color:#fff !important; }
  .az-contact-tab:focus-visible,
  .az-cookie-tab:focus-visible,
  .az-chat-launcher:focus-visible,
  .az-widget-btn:focus-visible,
  .az-modal-close:focus-visible {
    outline: 3px solid #fff;
    outline-offset: 3px;
    box-shadow: 0 0 0 6px rgba(205,0,0,.38);
  }

  .az-cookie-tab {
    position: fixed;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2147482000;
    min-height: 112px;
    padding: 14px 9px;
    border: 0;
    border-radius: 0 12px 12px 0;
    background: #fff;
    color: #1f2937;
    font: inherit;
    font-size: 12px;
    font-weight: 800;
    line-height: 1;
    writing-mode: vertical-rl;
    cursor: pointer;
    box-shadow: 0 8px 28px rgba(17,24,39,.18);
  }
  .az-cookie-tab:hover { color: var(--az-widget-red); }

  .az-chat-launcher {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 2147482100;
    width: 62px;
    height: 62px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: var(--az-widget-red);
    color: #fff;
    cursor: pointer;
    box-shadow: 0 12px 34px rgba(205,0,0,.34);
  }
  .az-chat-launcher:hover { background: var(--az-widget-red-dark); }
  .az-chat-launcher svg { width: 28px; height: 28px; fill: currentColor; }

  .az-chat-card {
    position: fixed;
    right: 24px;
    bottom: 98px;
    z-index: 2147482090;
    width: min(360px, calc(100vw - 32px));
    overflow: hidden;
    border: 1px solid rgba(31,41,55,.12);
    border-radius: 18px;
    background: #fff;
    color: #1f2937;
    box-shadow: 0 22px 60px rgba(17,24,39,.24);
  }
  .az-chat-card[hidden] { display:none !important; }
  .az-chat-head { padding: 17px 19px; background: var(--az-widget-red); color:#fff; }
  .az-chat-head strong { display:block; font-size:16px; }
  .az-chat-head small { display:block; margin-top:4px; opacity:.9; }
  .az-chat-body { padding: 18px; }
  .az-chat-body p { margin:0 0 14px; font-size:14px; line-height:1.55; color:#4b5563; }
  .az-chat-actions { display:grid; gap:9px; }

  .az-widget-btn {
    min-height: 44px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    padding: 11px 16px;
    border: 1px solid transparent;
    border-radius: 9px;
    background: var(--az-widget-red);
    color:#fff !important;
    text-decoration:none !important;
    font: inherit;
    font-size:14px;
    font-weight:800;
    cursor:pointer;
  }
  .az-widget-btn:hover { background:var(--az-widget-red-dark); color:#fff !important; }
  .az-widget-btn-secondary { background:#fff; color:#1f2937 !important; border-color:#d1d5db; }
  .az-widget-btn-secondary:hover { background:#f8fafc; color:var(--az-widget-red) !important; border-color:#c7cdd4; }
  .az-widget-btn-ghost { background:transparent; color:#374151 !important; border-color:#d1d5db; }
  .az-widget-btn-ghost:hover { background:#f8fafc; color:#111827 !important; }

  .az-cookie-banner {
    position: fixed;
    left: 18px;
    right: 18px;
    bottom: 18px;
    z-index: 2147483000;
    max-width: 980px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid rgba(31,41,55,.14);
    border-radius: 16px;
    background: #fff;
    color:#1f2937;
    box-shadow: 0 24px 70px rgba(17,24,39,.28);
  }
  .az-cookie-banner[hidden] { display:none !important; }
  .az-cookie-banner-grid { display:grid; grid-template-columns: 1fr auto; gap:20px; align-items:center; }
  .az-cookie-banner h2 { margin:0 0 7px; font-size:18px; line-height:1.25; color:#111827; }
  .az-cookie-banner p { margin:0; max-width:720px; font-size:13px; line-height:1.55; color:#4b5563; }
  .az-cookie-buttons { display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-end; }

  .az-cookie-backdrop {
    position: fixed;
    inset:0;
    z-index:2147483100;
    background:rgba(17,24,39,.52);
    backdrop-filter: blur(2px);
  }
  .az-cookie-backdrop[hidden] { display:none !important; }
  .az-cookie-modal {
    position:fixed;
    left:50%;
    top:50%;
    z-index:2147483200;
    width:min(620px, calc(100vw - 32px));
    max-height:min(760px, calc(100vh - 32px));
    overflow:auto;
    transform:translate(-50%,-50%);
    border-radius:18px;
    background:#fff;
    color:#1f2937;
    box-shadow:0 28px 90px rgba(0,0,0,.36);
  }
  .az-cookie-modal[hidden] { display:none !important; }
  .az-modal-head { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; padding:22px 22px 15px; border-bottom:1px solid #e5e7eb; }
  .az-modal-head h2 { margin:0; font-size:20px; line-height:1.25; }
  .az-modal-head p { margin:6px 0 0; font-size:13px; line-height:1.5; color:#6b7280; }
  .az-modal-close { flex:0 0 auto; width:38px; height:38px; border:0; border-radius:50%; background:#f3f4f6; color:#111827; font-size:22px; cursor:pointer; }
  .az-modal-body { padding:18px 22px 22px; }
  .az-consent-row { display:grid; grid-template-columns: 1fr auto; gap:18px; padding:15px 0; border-bottom:1px solid #edf0f2; }
  .az-consent-row:last-of-type { border-bottom:0; }
  .az-consent-row strong { display:block; font-size:14px; }
  .az-consent-row p { margin:4px 0 0; font-size:12px; line-height:1.5; color:#6b7280; }
  .az-consent-row input { width:20px; height:20px; accent-color:var(--az-widget-red); }
  .az-consent-required { color:#6b7280; font-size:12px; font-weight:800; }
  .az-modal-actions { display:flex; flex-wrap:wrap; gap:9px; margin-top:20px; }

  @media (max-width: 720px) {
    .az-contact-tab { top:auto; bottom:104px; min-height:0; padding:12px 9px; font-size:11px; }
    .az-cookie-tab { top:auto; bottom:20px; min-height:0; padding:12px 9px; font-size:10px; }
    .az-chat-launcher { right:16px; bottom:16px; width:56px; height:56px; }
    .az-chat-card { right:16px; bottom:82px; }
    .az-cookie-banner { left:10px; right:10px; bottom:10px; padding:16px; }
    .az-cookie-banner-grid { grid-template-columns:1fr; gap:14px; }
    .az-cookie-buttons { justify-content:stretch; }
    .az-cookie-buttons .az-widget-btn { flex:1 1 150px; }
    .az-modal-actions .az-widget-btn { flex:1 1 160px; }
  }

  @media print {
    .az-contact-tab,.az-cookie-tab,.az-chat-launcher,.az-chat-card,.az-cookie-banner,
    .az-cookie-backdrop,.az-cookie-modal { display:none !important; }
  }
</style>`;

const GLOBAL_WIDGETS = String.raw`
<a class="az-contact-tab" href="${CONTACT_URL}" target="_blank" rel="noopener" aria-label="Napisz do nas — otwórz formularz kontaktowy A-Z Biuro">Napisz do nas</a>

<button class="az-cookie-tab" id="azCookieSettings" type="button" aria-label="Otwórz ustawienia cookies">Cookies</button>

<button class="az-chat-launcher" id="azChatLauncher" type="button" aria-expanded="false" aria-controls="azChatCard" aria-label="Kontakt z A-Z Biuro">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5.2 3.7A.5.5 0 0 1 3 21.3V18a2 2 0 0 1-1-1.73V5a2 2 0 0 1 2-2Zm1 4v2h14V7H5Zm0 4v2h10v-2H5Z"/></svg>
</button>

<section class="az-chat-card" id="azChatCard" hidden aria-label="Kontakt z A-Z Biuro">
  <div class="az-chat-head">
    <strong>A-Z Biuro</strong>
    <small>Jak możemy pomóc?</small>
  </div>
  <div class="az-chat-body">
    <p>Skontaktuj się z naszym Biurem Obsługi Klienta. Formularz otworzy się na eazbiuro.pl.</p>
    <div class="az-chat-actions">
      <a class="az-widget-btn" href="${CONTACT_URL}" target="_blank" rel="noopener">Napisz do nas</a>
      <a class="az-widget-btn az-widget-btn-secondary" href="${PHONE_HREF}">Zadzwoń: ${PHONE_LABEL}</a>
      <a class="az-widget-btn az-widget-btn-ghost" href="${SHOP_URL}" target="_blank" rel="noopener">Przejdź do eazbiuro.pl</a>
    </div>
  </div>
</section>

<section class="az-cookie-banner" id="azCookieBanner" hidden aria-label="Informacja o cookies">
  <div class="az-cookie-banner-grid">
    <div>
      <h2>Ustawienia cookies</h2>
      <p>Używamy niezbędnych plików cookies do działania serwisu. Dodatkowe kategorie mogą być wykorzystywane po Twojej zgodzie. Wybór możesz zmienić w dowolnym momencie przyciskiem „Cookies” po lewej stronie.</p>
    </div>
    <div class="az-cookie-buttons">
      <button class="az-widget-btn az-widget-btn-ghost" type="button" data-az-cookie="essential">Tylko niezbędne</button>
      <button class="az-widget-btn az-widget-btn-secondary" type="button" data-az-cookie="settings">Ustawienia</button>
      <button class="az-widget-btn" type="button" data-az-cookie="all">Akceptuję wszystkie</button>
    </div>
  </div>
</section>

<div class="az-cookie-backdrop" id="azCookieBackdrop" hidden></div>
<section class="az-cookie-modal" id="azCookieModal" hidden role="dialog" aria-modal="true" aria-labelledby="azCookieModalTitle">
  <div class="az-modal-head">
    <div>
      <h2 id="azCookieModalTitle">Preferencje cookies</h2>
      <p>Zdecyduj, na jakie opcjonalne kategorie wyrażasz zgodę.</p>
    </div>
    <button class="az-modal-close" id="azCookieClose" type="button" aria-label="Zamknij ustawienia cookies">×</button>
  </div>
  <div class="az-modal-body">
    <div class="az-consent-row">
      <div><strong>Niezbędne</strong><p>Potrzebne do podstawowego działania strony i zapisania Twoich preferencji.</p></div>
      <span class="az-consent-required">Zawsze aktywne</span>
    </div>
    <label class="az-consent-row">
      <div><strong>Funkcjonalne</strong><p>Umożliwiają dodatkowe funkcje, np. zewnętrzny czat, jeśli zostanie podłączony.</p></div>
      <input id="azConsentFunctional" type="checkbox">
    </label>
    <label class="az-consent-row">
      <div><strong>Analityczne</strong><p>Pomagają mierzyć korzystanie z poradnika, jeśli takie narzędzia zostaną podłączone.</p></div>
      <input id="azConsentAnalytics" type="checkbox">
    </label>
    <label class="az-consent-row">
      <div><strong>Marketingowe</strong><p>Mogą służyć do personalizacji reklam i pomiaru kampanii, jeśli takie narzędzia zostaną podłączone.</p></div>
      <input id="azConsentMarketing" type="checkbox">
    </label>
    <div class="az-modal-actions">
      <button class="az-widget-btn az-widget-btn-ghost" type="button" data-az-cookie="essential">Tylko niezbędne</button>
      <button class="az-widget-btn az-widget-btn-secondary" type="button" data-az-cookie="save">Zapisz wybór</button>
      <button class="az-widget-btn" type="button" data-az-cookie="all">Akceptuję wszystkie</button>
    </div>
  </div>
</section>

<script id="az-global-widget-script">
(() => {
  if (window.__AZ_GLOBAL_WIDGETS__) return;
  window.__AZ_GLOBAL_WIDGETS__ = true;

  const KEY = 'azbiuro_cookie_consent_v1';
  const COOKIE = 'azbiuro_consent';
  const banner = document.getElementById('azCookieBanner');
  const modal = document.getElementById('azCookieModal');
  const backdrop = document.getElementById('azCookieBackdrop');
  const settingsBtn = document.getElementById('azCookieSettings');
  const closeBtn = document.getElementById('azCookieClose');
  const launcher = document.getElementById('azChatLauncher');
  const chatCard = document.getElementById('azChatCard');
  const functional = document.getElementById('azConsentFunctional');
  const analytics = document.getElementById('azConsentAnalytics');
  const marketing = document.getElementById('azConsentMarketing');

  const emptyConsent = () => ({ essential:true, functional:false, analytics:false, marketing:false, version:1 });

  function readConsent() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!value || value.version !== 1) return null;
      return value;
    } catch (_) { return null; }
  }

  function cookieValue(consent) {
    const enabled = ['essential'];
    if (consent.functional) enabled.push('functional');
    if (consent.analytics) enabled.push('analytics');
    if (consent.marketing) enabled.push('marketing');
    return 'v1:' + enabled.join(',');
  }

  function saveConsent(consent) {
    const normalized = { ...emptyConsent(), ...consent, essential:true, version:1 };
    try { localStorage.setItem(KEY, JSON.stringify(normalized)); } catch (_) {}
    document.cookie = COOKIE + '=' + encodeURIComponent(cookieValue(normalized)) + '; Max-Age=31536000; Path=/; SameSite=Lax; Secure';
    document.documentElement.dataset.azConsentFunctional = normalized.functional ? '1' : '0';
    document.documentElement.dataset.azConsentAnalytics = normalized.analytics ? '1' : '0';
    document.documentElement.dataset.azConsentMarketing = normalized.marketing ? '1' : '0';
    activateConsentScripts(normalized);
    hideBanner();
    closeModal();
    return normalized;
  }

  function activateConsentScripts(consent) {
    document.querySelectorAll('script[type="text/plain"][data-az-consent]').forEach((placeholder) => {
      const category = placeholder.dataset.azConsent;
      if (!consent[category] || placeholder.dataset.azActivated === '1') return;
      const script = document.createElement('script');
      for (const attr of placeholder.attributes) {
        if (attr.name === 'type' || attr.name === 'data-az-consent' || attr.name === 'data-az-activated') continue;
        script.setAttribute(attr.name, attr.value);
      }
      script.text = placeholder.textContent || '';
      placeholder.dataset.azActivated = '1';
      placeholder.after(script);
    });
  }

  function fillModal(consent) {
    const c = consent || emptyConsent();
    functional.checked = !!c.functional;
    analytics.checked = !!c.analytics;
    marketing.checked = !!c.marketing;
  }

  function showBanner() { if (banner) banner.hidden = false; }
  function hideBanner() { if (banner) banner.hidden = true; }
  function openModal() {
    fillModal(readConsent());
    if (backdrop) backdrop.hidden = false;
    if (modal) modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    closeBtn?.focus();
  }
  function closeModal() {
    if (backdrop) backdrop.hidden = true;
    if (modal) modal.hidden = true;
    document.documentElement.style.overflow = '';
  }

  document.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-az-cookie]');
    if (!actionEl) return;
    const action = actionEl.dataset.azCookie;
    if (action === 'settings') return openModal();
    if (action === 'all') return saveConsent({ essential:true, functional:true, analytics:true, marketing:true, version:1 });
    if (action === 'essential') return saveConsent(emptyConsent());
    if (action === 'save') return saveConsent({
      essential:true,
      functional:!!functional.checked,
      analytics:!!analytics.checked,
      marketing:!!marketing.checked,
      version:1
    });
  });

  settingsBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  launcher?.addEventListener('click', () => {
    const willOpen = chatCard.hidden;
    chatCard.hidden = !willOpen;
    launcher.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });

  const existing = readConsent();
  if (existing) {
    activateConsentScripts(existing);
    document.documentElement.dataset.azConsentFunctional = existing.functional ? '1' : '0';
    document.documentElement.dataset.azConsentAnalytics = existing.analytics ? '1' : '0';
    document.documentElement.dataset.azConsentMarketing = existing.marketing ? '1' : '0';
  } else {
    showBanner();
  }
})();
</script>`;

class HeadInjector {
  element(element) {
    element.append(GLOBAL_STYLE, { html: true });
  }
}

class BodyInjector {
  element(element) {
    element.append(GLOBAL_WIDGETS, { html: true });
    if (CHAT_VENDOR_HTML.trim()) {
      element.append(CHAT_VENDOR_HTML, { html: true });
    }
  }
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (request.method !== 'GET') return response;
    if (!response.ok) return response;

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('text/html')) return response;

    return new HTMLRewriter()
      .on('head', new HeadInjector())
      .on('body', new BodyInjector())
      .transform(response);
  },
};
