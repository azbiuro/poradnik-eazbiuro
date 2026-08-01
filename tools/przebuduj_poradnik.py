#!/usr/bin/env python3
"""Ujednolica nagłówek i stopkę całego poradnik.eazbiuro.pl.

Skrypt modyfikuje wyłącznie pierwszy nagłówek <header>, pierwszą stopkę
<footer>, wersję odwołania do assets/style.css oraz wspólny skrypt menu.
Nie zmienia treści artykułów, title, meta description, canonical, robots,
JSON-LD, adresów folderów ani sitemap.xml.
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path

VERSION = "20260801-poradnik-wspolny-wyglad"
MARKER = "data-az-navigation"

HEADER = """<header class="site-header az-header" data-header>
  <div class="container az-header-inner">
    <a class="az-brand" href="/" aria-label="Poradnik zakupowy A-Z Biuro — strona główna">
      <img class="az-brand-logo" src="/assets/logo-eazbiuro.png" alt="A-Z Biuro" width="335" height="90" decoding="async">
      <span class="az-brand-divider" aria-hidden="true"></span>
      <span class="az-brand-label">Poradnik zakupowy</span>
    </a>
    <button class="az-nav-toggle" type="button" aria-expanded="false" aria-controls="az-main-nav" aria-label="Otwórz menu">
      <span></span><span></span><span></span>
    </button>
    <div class="az-menu-backdrop" data-az-menu-backdrop aria-hidden="true"></div>
    <nav class="az-nav" id="az-main-nav" aria-label="Nawigacja główna">
      <a href="/#dzialy">Działy</a>
      <a href="/#poradniki">Poradniki</a>
      <a href="/lokalne-produkty/">Lokalne produkty</a>
      <a href="https://eazbiuro.pl/pl/page/faq">FAQ</a>
      <a href="https://eazbiuro.pl/pl/page/kontakt">Kontakt</a>
      <a class="az-nav-cta" href="https://eazbiuro.pl/pl/shop">Przejdź do sklepu</a>
    </nav>
  </div>
</header>"""

FOOTER = """<footer class="footer az-footer">
  <div class="container az-footer-grid">
    <div class="az-footer-brand">
      <a class="az-footer-logo-link" href="/" aria-label="Poradnik zakupowy A-Z Biuro — strona główna">
        <img class="az-footer-logo" src="/assets/logo-eazbiuro.png" alt="A-Z Biuro" width="250" height="68" loading="lazy" decoding="async">
      </a>
      <p>Praktyczna wiedza zakupowa dla firm, szkół, instytucji, gastronomii i klientów indywidualnych.</p>
    </div>
    <div class="az-footer-column">
      <h2>Poradnik zakupowy</h2>
      <a href="/">Strona główna</a>
      <a href="/#dzialy">Wszystkie działy</a>
      <a href="/#poradniki">Popularne poradniki</a>
      <a href="/lokalne-produkty/">Lokalne produkty</a>
    </div>
    <div class="az-footer-column">
      <h2>Serwisy A-Z Biuro</h2>
      <a href="https://eazbiuro.pl/pl/shop">Sklep internetowy</a>
      <a href="https://wiedza.eazbiuro.pl/">Centrum Wiedzy</a>
      <a href="https://poradnik.eazbiuro.pl/">Poradnik zakupowy</a>
    </div>
    <div class="az-footer-column">
      <h2>Obsługa klienta</h2>
      <a href="https://eazbiuro.pl/pl/page/kontakt">Kontakt</a>
      <a href="https://eazbiuro.pl/pl/page/faq">FAQ</a>
      <a href="https://eazbiuro.pl/pl/page/zwroty-i-reklamacje">Zwroty i reklamacje</a>
    </div>
  </div>
  <div class="container az-footer-disclaimer" role="note"><strong>Poradnik zakupowy jest częścią serwisu A-Z Biuro.</strong> Informacje produktowe, ceny i dostępność zawsze sprawdzaj na aktualnej stronie produktu.</div>
  <div class="container az-footer-bottom">
    <span>© <span data-year>2026</span> A-Z Biuro</span>
    <span>poradnik.eazbiuro.pl — praktyczna pomoc przed zakupem</span>
  </div>
</footer>"""

NAV_SCRIPT = """<script data-az-navigation>
(function(){
  var header=document.querySelector('.az-header');
  var button=document.querySelector('.az-nav-toggle');
  var nav=document.getElementById('az-main-nav');
  var backdrop=document.querySelector('[data-az-menu-backdrop]');
  if(!header||!button||!nav){return;}
  function closeMenu(){
    button.setAttribute('aria-expanded','false');
    nav.classList.remove('is-open');
    if(backdrop){backdrop.classList.remove('is-open');backdrop.setAttribute('aria-hidden','true');}
    document.body.classList.remove('az-menu-open');
  }
  function openMenu(){
    button.setAttribute('aria-expanded','true');
    nav.classList.add('is-open');
    if(backdrop){backdrop.classList.add('is-open');backdrop.setAttribute('aria-hidden','false');}
    document.body.classList.add('az-menu-open');
  }
  button.addEventListener('click',function(){
    button.getAttribute('aria-expanded')==='true'?closeMenu():openMenu();
  });
  if(backdrop){backdrop.addEventListener('click',closeMenu);}
  nav.addEventListener('click',function(event){if(event.target.closest('a')){closeMenu();}});
  document.addEventListener('keydown',function(event){if(event.key==='Escape'){closeMenu();}});
  window.addEventListener('resize',function(){if(window.innerWidth>1100){closeMenu();}});
  window.addEventListener('scroll',function(){header.classList.toggle('is-scrolled',window.scrollY>8);},{passive:true});
  document.querySelectorAll('[data-year]').forEach(function(node){node.textContent=String(new Date().getFullYear());});
})();
</script>"""

HEADER_RE = re.compile(r"<header\b[^>]*>.*?</header>", re.IGNORECASE | re.DOTALL)
FOOTER_RE = re.compile(r"<footer\b[^>]*>.*?</footer>", re.IGNORECASE | re.DOTALL)
NAV_SCRIPT_RE = re.compile(r"\s*<script\b[^>]*data-az-navigation[^>]*>.*?</script>\s*", re.IGNORECASE | re.DOTALL)
STYLE_RE = re.compile(r"""href=(?P<q>["'])(?P<url>[^"']*assets/style\.css)(?:\?[^"']*)?(?P=q)""", re.IGNORECASE)


def update_html(path: Path) -> tuple[bool, str | None]:
    try:
        original = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return False, "pominięto: plik nie jest zapisany w UTF-8"

    text = original
    header_count = len(HEADER_RE.findall(text))
    footer_count = len(FOOTER_RE.findall(text))
    if header_count < 1 or footer_count < 1:
        return False, f"pominięto: header={header_count}, footer={footer_count}"

    text = HEADER_RE.sub(HEADER, text, count=1)
    text = FOOTER_RE.sub(FOOTER, text, count=1)

    def version_style(match: re.Match[str]) -> str:
        return f'href={match.group("q")}{match.group("url")}?v={VERSION}{match.group("q")}'

    text = STYLE_RE.sub(version_style, text)
    text = NAV_SCRIPT_RE.sub("\n", text)
    body_close = re.search(r"</body\s*>", text, flags=re.IGNORECASE)
    if body_close:
        prefix = text[:body_close.start()].rstrip()
        suffix = text[body_close.start():].lstrip()
        text = prefix + "\n" + NAV_SCRIPT + "\n" + suffix
    else:
        text = text.rstrip() + "\n" + NAV_SCRIPT + "\n"

    if text == original:
        return False, None
    path.write_text(text, encoding="utf-8", newline="\n")
    return True, None


def copy_assets(root: Path, package_root: Path) -> None:
    target = root / "assets"
    target.mkdir(parents=True, exist_ok=True)
    for filename in ("style.css", "logo-eazbiuro.png"):
        source = package_root / "assets" / filename
        destination = target / filename
        if source.resolve() != destination.resolve():
            shutil.copy2(source, destination)


def main() -> int:
    parser = argparse.ArgumentParser(description="Ujednolicenie wyglądu poradnik.eazbiuro.pl")
    parser.add_argument("--root", default=".", help="Główny katalog repozytorium")
    parser.add_argument("--no-copy-assets", action="store_true", help="Nie kopiuj assets/style.css i logo")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    package_root = Path(__file__).resolve().parent.parent
    if not root.exists():
        print(f"BŁĄD: katalog nie istnieje: {root}", file=sys.stderr)
        return 2

    if not args.no_copy_assets:
        copy_assets(root, package_root)

    html_files = sorted(p for p in root.rglob("*.html") if ".git" not in p.parts)
    changed = 0
    skipped: list[tuple[Path, str]] = []
    for path in html_files:
        did_change, warning = update_html(path)
        if did_change:
            changed += 1
        elif warning:
            skipped.append((path, warning))

    print(f"Sprawdzono plików HTML: {len(html_files)}")
    print(f"Zmieniono plików HTML: {changed}")
    print(f"Pominięto plików HTML: {len(skipped)}")
    for path, warning in skipped[:30]:
        print(f"UWAGA: {path.relative_to(root)} — {warning}")
    if len(skipped) > 30:
        print(f"... oraz {len(skipped)-30} dalszych ostrzeżeń")

    if not html_files:
        print("BŁĄD: nie znaleziono plików HTML w repozytorium", file=sys.stderr)
        return 3
    if changed == 0 and skipped:
        return 4
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
