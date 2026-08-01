#!/usr/bin/env python3
"""Aktualizuje wspólne elementy poradnik.eazbiuro.pl.

Zakres zmian:
- wspólne menu i stopka na wszystkich stronach,
- wyszukiwarka na stronie głównej,
- usunięcie karty „Lokalne produkty” ze strony głównej,
- strony „Indeks A-Z” i „O projekcie” jako strony w przygotowaniu,
- indeks wyszukiwarki z istniejących poradników.

Skrypt nie zmienia treści poradników, ich nazw, H1, title, meta description,
canonical, robots, JSON-LD, adresów folderów ani sitemap.xml istniejących stron.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

VERSION = "20260801-menu-search-v4"
SEARCH_INDEX_FILE = "assets/poradnik-search-index.json"

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
      <a href="/indeks-a-z/">Indeks A-Z</a>
      <a href="/o-projekcie/">O projekcie</a>
      <a class="az-nav-knowledge" href="https://wiedza.eazbiuro.pl/">Centrum wiedzy</a>
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
      <a href="/indeks-a-z/">Indeks A-Z</a>
      <a href="/o-projekcie/">O projekcie</a>
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

SEARCH_SECTION = """<!-- AZ-SEARCH-START -->
<section class="poradnik-search-section" aria-labelledby="poradnik-search-title">
  <div class="container">
    <div class="poradnik-search-card">
      <span class="eyebrow">Wyszukiwarka poradników</span>
      <h2 id="poradnik-search-title">Czego szukasz?</h2>
      <p>Wpisz produkt, problem lub temat. Wyszukiwarka pokaże właściwy dział albo poradnik zakupowy.</p>
      <form class="poradnik-search-form" role="search" data-poradnik-search>
        <label class="sr-only" for="poradnik-search-input">Szukaj w poradniku zakupowym</label>
        <div class="poradnik-search-row">
          <input id="poradnik-search-input" type="search" placeholder="Np. papier A4, toner, ręczniki papierowe…" autocomplete="off" spellcheck="false">
          <button type="submit">Szukaj</button>
        </div>
        <span class="poradnik-search-help">Wpisz co najmniej 2 znaki.</span>
      </form>
      <div class="poradnik-search-status" data-search-status aria-live="polite"></div>
      <div class="poradnik-search-results" data-search-results hidden></div>
    </div>
  </div>
</section>
<!-- AZ-SEARCH-END -->"""

NAV_AND_SEARCH_SCRIPT = """<script data-az-navigation>
(function(){
  var header=document.querySelector('.az-header');
  var button=document.querySelector('.az-nav-toggle');
  var nav=document.getElementById('az-main-nav');
  var backdrop=document.querySelector('[data-az-menu-backdrop]');
  function closeMenu(){
    if(!button||!nav){return;}
    button.setAttribute('aria-expanded','false');
    nav.classList.remove('is-open');
    if(backdrop){backdrop.classList.remove('is-open');backdrop.setAttribute('aria-hidden','true');}
    document.body.classList.remove('az-menu-open');
  }
  if(header&&button&&nav){
    button.addEventListener('click',function(){
      if(button.getAttribute('aria-expanded')==='true'){closeMenu();return;}
      button.setAttribute('aria-expanded','true');
      nav.classList.add('is-open');
      if(backdrop){backdrop.classList.add('is-open');backdrop.setAttribute('aria-hidden','false');}
      document.body.classList.add('az-menu-open');
    });
    if(backdrop){backdrop.addEventListener('click',closeMenu);}
    nav.addEventListener('click',function(event){if(event.target.closest('a')){closeMenu();}});
    document.addEventListener('keydown',function(event){if(event.key==='Escape'){closeMenu();}});
    window.addEventListener('resize',function(){if(window.innerWidth>1450){closeMenu();}});
    window.addEventListener('scroll',function(){header.classList.toggle('is-scrolled',window.scrollY>8);},{passive:true});
  }
  document.querySelectorAll('[data-year]').forEach(function(node){node.textContent=String(new Date().getFullYear());});

  var form=document.querySelector('[data-poradnik-search]');
  if(!form){return;}
  var input=form.querySelector('input');
  var results=document.querySelector('[data-search-results]');
  var status=document.querySelector('[data-search-status]');
  var searchIndex=[];
  function normalize(value){
    return String(value||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  }
  function score(item,query,words){
    var title=normalize(item.title), text=normalize(item.title+' '+(item.description||''));
    var points=0;
    if(title===query){points+=100;}
    if(title.indexOf(query)===0){points+=55;}
    if(title.indexOf(query)>-1){points+=35;}
    if(text.indexOf(query)>-1){points+=15;}
    words.forEach(function(word){if(title.indexOf(word)>-1){points+=10;}else if(text.indexOf(word)>-1){points+=3;}});
    return points;
  }
  function render(){
    var query=normalize(input.value);
    results.replaceChildren();
    if(query.length<2){results.hidden=true;status.textContent='Wpisz co najmniej 2 znaki.';return;}
    var words=query.split(/\\s+/).filter(Boolean);
    var matches=searchIndex.map(function(item){return {item:item,points:score(item,query,words)};})
      .filter(function(row){return row.points>0;})
      .sort(function(a,b){return b.points-a.points||a.item.title.localeCompare(b.item.title,'pl');})
      .slice(0,10);
    results.hidden=false;
    status.textContent=matches.length?'Znaleziono '+matches.length+' najlepiej dopasowanych wyników.':'Brak wyników.';
    if(!matches.length){var empty=document.createElement('p');empty.className='poradnik-search-empty';empty.textContent='Nie znaleziono pasującego poradnika. Spróbuj krótszej lub innej frazy.';results.appendChild(empty);return;}
    var list=document.createElement('ul');
    matches.forEach(function(row){
      var li=document.createElement('li'),link=document.createElement('a'),strong=document.createElement('strong'),small=document.createElement('span');
      link.href=row.item.url;strong.textContent=row.item.title;small.textContent=row.item.description||'Przejdź do poradnika';
      link.appendChild(strong);link.appendChild(small);li.appendChild(link);list.appendChild(li);
    });
    results.appendChild(list);
  }
  fetch('/__SEARCH_INDEX_FILE__?v=__VERSION__',{credentials:'same-origin'})
    .then(function(response){if(!response.ok){throw new Error('search index');}return response.json();})
    .then(function(data){searchIndex=Array.isArray(data)?data:[];})
    .catch(function(){status.textContent='Wyszukiwarka jest chwilowo niedostępna.';});
  form.addEventListener('submit',function(event){event.preventDefault();render();});
  input.addEventListener('input',render);
})();
</script>""".replace("__SEARCH_INDEX_FILE__", SEARCH_INDEX_FILE).replace("__VERSION__", VERSION)

CUSTOM_CSS = """/* AZ-SEARCH-START */
.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
.az-header .az-nav .az-nav-knowledge{color:#105fa6}
.az-header .az-nav .az-nav-knowledge:hover,.az-header .az-nav .az-nav-knowledge:focus-visible{color:#cd0000}
.poradnik-search-section{padding:44px 0 20px;background:linear-gradient(135deg,#fff 0%,#f4f8fc 58%,#fff4f4 100%)}
.poradnik-search-card{max-width:980px;margin:auto;padding:34px clamp(22px,4vw,48px);background:#fff;border:1px solid #dfe4e8;border-radius:24px;box-shadow:0 18px 48px rgba(22,34,51,.08)}
.poradnik-search-card h2{margin:.15em 0 .3em}
.poradnik-search-card>p{color:#5f6b76;margin-top:0}
.poradnik-search-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px}
.poradnik-search-row input{min-width:0;min-height:58px;padding:14px 18px;border:2px solid #dfe4e8;border-radius:10px;background:#fff;color:#1f2937;font:inherit}
.poradnik-search-row input:focus{border-color:#105fa6;outline:0;box-shadow:0 0 0 4px rgba(16,95,166,.12)}
.poradnik-search-row button{min-height:58px;padding:13px 27px;border:0;border-radius:10px;background:#cd0000;color:#fff;font:inherit;font-weight:800;cursor:pointer}
.poradnik-search-row button:hover,.poradnik-search-row button:focus-visible{background:#a90000}
.poradnik-search-help,.poradnik-search-status{display:block;margin-top:9px;color:#7b848d;font-size:.84rem}
.poradnik-search-status{min-height:1.4em;font-weight:700}
.poradnik-search-results{margin-top:12px;border:1px solid #dfe4e8;border-radius:14px;background:#fff;overflow:hidden}
.poradnik-search-results ul{list-style:none;margin:0;padding:0}
.poradnik-search-results li+li{border-top:1px solid #dfe4e8}
.poradnik-search-results a{display:flex;flex-direction:column;gap:3px;padding:14px 17px;color:#1f2937;text-decoration:none}
.poradnik-search-results a:hover,.poradnik-search-results a:focus-visible{background:#f1f7fc;color:#cd0000}
.poradnik-search-results a span{color:#5f6b76;font-size:.86rem;font-weight:400}
.poradnik-search-empty{margin:0;padding:17px;color:#5f6b76}
.coming-soon-shell{padding:38px 0 76px}
.coming-soon-card{max-width:860px;margin:auto;padding:clamp(28px,5vw,54px);background:#fff;border:1px solid #dfe4e8;border-radius:22px;box-shadow:0 18px 48px rgba(22,34,51,.08);text-align:center}
.coming-soon-card h1{font-size:clamp(2rem,4vw,3.4rem);margin:.3em auto}
.coming-soon-card p{max-width:680px;margin:0 auto 24px;color:#5f6b76}
@media(max-width:620px){.poradnik-search-section{padding:24px 0 8px}.poradnik-search-card{padding:24px 18px}.poradnik-search-row{grid-template-columns:1fr}.poradnik-search-row button{width:100%}}
/* AZ-SEARCH-END */"""

HEADER_RE = re.compile(r"<header\b[^>]*>.*?</header>", re.IGNORECASE | re.DOTALL)
FOOTER_RE = re.compile(r"<footer\b[^>]*>.*?</footer>", re.IGNORECASE | re.DOTALL)
NAV_SCRIPT_RE = re.compile(r"\s*<script\b[^>]*data-az-navigation[^>]*>.*?</script>\s*", re.IGNORECASE | re.DOTALL)
STYLE_RE = re.compile(r"""href=(?P<q>["'])(?P<url>[^"']*assets/style\.css)(?:\?[^"']*)?(?P=q)""", re.IGNORECASE)
SEARCH_BLOCK_RE = re.compile(r"\s*<!-- AZ-SEARCH-START -->.*?<!-- AZ-SEARCH-END -->\s*", re.IGNORECASE | re.DOTALL)
CUSTOM_CSS_RE = re.compile(r"/\* AZ-SEARCH-START \*/.*?/\* AZ-SEARCH-END \*/", re.DOTALL)
LOCAL_CARD_RE = re.compile(r"<div\s+class=[\"']area-local-wrap[\"']>.*?</a>\s*</div>\s*</div>", re.IGNORECASE | re.DOTALL)
LOCAL_TILE_RE = re.compile(r"<div\s+class=[\"']visual-tile[\"']>\s*<b>50</b>\s*<span>miast w ofercie lokalnej</span>\s*</div>", re.IGNORECASE | re.DOTALL)
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)
H1_RE = re.compile(r"<h1\b[^>]*>(.*?)</h1>", re.IGNORECASE | re.DOTALL)
META_RE = re.compile(r"<meta\b(?=[^>]*\bname=[\"']description[\"'])[^>]*\bcontent=[\"'](.*?)[\"'][^>]*>", re.IGNORECASE | re.DOTALL)
TAG_RE = re.compile(r"<[^>]+>")


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(TAG_RE.sub(" ", value))).strip()


def url_for(path: Path, root: Path) -> str:
    relative = path.relative_to(root).as_posix()
    if relative == "index.html":
        return "/"
    if relative.endswith("/index.html"):
        relative = relative[: -len("index.html")]
    return "/" + quote(relative, safe="/-._~")


def build_search_index(root: Path) -> int:
    entries: list[dict[str, str]] = []
    seen: set[str] = set()
    for path in sorted(root.rglob("*.html")):
        if ".git" in path.parts or "lokalne-produkty" in path.parts:
            continue
        if path.name in {"404.html", "FRAGMENT_DO_HEAD.html"}:
            continue
        relative = path.relative_to(root).as_posix()
        if relative in {"indeks-a-z/index.html", "o-projekcie/index.html"}:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        title_match = TITLE_RE.search(text)
        h1_match = H1_RE.search(text)
        meta_match = META_RE.search(text)
        title = clean_text(h1_match.group(1) if h1_match else (title_match.group(1) if title_match else ""))
        if not title:
            continue
        description = clean_text(meta_match.group(1)) if meta_match else ""
        url = url_for(path, root)
        if url in seen:
            continue
        seen.add(url)
        entries.append({"title": title, "description": description, "url": url})
    target = root / SEARCH_INDEX_FILE
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(entries, ensure_ascii=False, separators=(",", ":")), encoding="utf-8", newline="\n")
    return len(entries)


def preparation_page(*, title: str, description: str, heading: str, message: str, canonical: str) -> str:
    return f"""<!doctype html>
<html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(description, quote=True)}">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="{html.escape(canonical, quote=True)}">
<link rel="stylesheet" href="/assets/style.css?v={VERSION}">
</head><body><a class="skip-link" href="#tresc">Przejdź do treści</a>
{HEADER}
<main id="tresc">
  <div class="container breadcrumbs"><a href="/">Strona główna</a><span class="crumb-sep">›</span><span>{html.escape(heading)}</span></div>
  <section class="coming-soon-shell"><div class="container"><div class="coming-soon-card">
    <span class="eyebrow">Strona w przygotowaniu</span>
    <h1>{html.escape(heading)}</h1>
    <p>{html.escape(message)}</p>
    <div class="btns" style="justify-content:center"><a class="btn btn-primary" href="/#dzialy">Przejdź do działów</a><a class="btn btn-secondary" href="/#poradniki">Zobacz poradniki</a></div>
  </div></div></section>
</main>
{FOOTER}
{NAV_AND_SEARCH_SCRIPT}
</body></html>"""


def create_preparation_pages(root: Path) -> None:
    pages = {
        "indeks-a-z/index.html": preparation_page(
            title="Indeks A-Z poradników – strona w przygotowaniu | A-Z Biuro",
            description="Indeks A-Z poradników zakupowych A-Z Biuro jest w przygotowaniu. Skorzystaj z wyszukiwarki, listy działów i polecanych materiałów.",
            heading="Indeks A-Z poradników zakupowych",
            message="Porządkujemy wszystkie działy i poradniki alfabetycznie. Do czasu uruchomienia pełnego indeksu skorzystaj z wyszukiwarki na stronie głównej.",
            canonical="https://poradnik.eazbiuro.pl/indeks-a-z/",
        ),
        "o-projekcie/index.html": preparation_page(
            title="O projekcie Poradnik zakupowy A-Z Biuro – w przygotowaniu",
            description="Strona o projekcie Poradnik zakupowy A-Z Biuro jest w przygotowaniu. Poznaj dostępne działy i praktyczne materiały zakupowe.",
            heading="O projekcie Poradnik zakupowy A-Z Biuro",
            message="Przygotowujemy informacje o celu projektu, zasadach tworzenia treści i powiązaniu poradnika ze sklepem oraz Centrum Wiedzy.",
            canonical="https://poradnik.eazbiuro.pl/o-projekcie/",
        ),
    }
    for relative, content in pages.items():
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8", newline="\n")


def update_homepage(root: Path) -> None:
    path = root / "index.html"
    if not path.exists():
        raise FileNotFoundError("Brak pliku index.html w katalogu głównym")
    text = path.read_text(encoding="utf-8")
    text = SEARCH_BLOCK_RE.sub("\n", text)
    text = LOCAL_CARD_RE.sub("", text, count=1)
    text = LOCAL_TILE_RE.sub('<div class="visual-tile"><b>A–Z</b><span>tematy i poradniki zakupowe</span></div>', text, count=1)
    main_open = re.search(r"<main\b[^>]*\bid=[\"']tresc[\"'][^>]*>", text, re.IGNORECASE)
    if not main_open:
        raise ValueError("Nie znaleziono <main id=\"tresc\"> na stronie głównej")
    text = text[: main_open.end()] + "\n" + SEARCH_SECTION + "\n" + text[main_open.end() :]
    path.write_text(text, encoding="utf-8", newline="\n")


def update_css(root: Path) -> None:
    path = root / "assets/style.css"
    if not path.exists():
        raise FileNotFoundError("Brak assets/style.css")
    text = path.read_text(encoding="utf-8")
    text = CUSTOM_CSS_RE.sub("", text).rstrip()
    text = text.replace("@media (max-width:1100px)", "@media (max-width:1450px)")
    text = text.replace("@media(max-width:1100px)", "@media(max-width:1450px)")
    path.write_text(text + "\n\n" + CUSTOM_CSS + "\n", encoding="utf-8", newline="\n")


def update_html(path: Path) -> tuple[bool, str | None]:
    try:
        original = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return False, "pominięto: plik nie jest zapisany w UTF-8"
    text = original
    if not HEADER_RE.search(text) or not FOOTER_RE.search(text):
        return False, "pominięto: brak pełnego nagłówka lub stopki"
    text = HEADER_RE.sub(HEADER, text, count=1)
    text = FOOTER_RE.sub(FOOTER, text, count=1)

    def version_style(match: re.Match[str]) -> str:
        return f'href={match.group("q")}{match.group("url")}?v={VERSION}{match.group("q")}'

    text = STYLE_RE.sub(version_style, text)
    text = NAV_SCRIPT_RE.sub("\n", text)
    body_close = re.search(r"</body\s*>", text, flags=re.IGNORECASE)
    if body_close:
        text = text[: body_close.start()].rstrip() + "\n" + NAV_AND_SEARCH_SCRIPT + "\n" + text[body_close.start() :].lstrip()
    else:
        text = text.rstrip() + "\n" + NAV_AND_SEARCH_SCRIPT + "\n"
    if text == original:
        return False, None
    path.write_text(text, encoding="utf-8", newline="\n")
    return True, None


def main() -> int:
    parser = argparse.ArgumentParser(description="Menu i wyszukiwarka poradnik.eazbiuro.pl")
    parser.add_argument("--root", default=".", help="Główny katalog repozytorium")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    if not root.exists():
        print(f"BŁĄD: katalog nie istnieje: {root}", file=sys.stderr)
        return 2

    create_preparation_pages(root)
    update_homepage(root)
    update_css(root)

    html_files = sorted(path for path in root.rglob("*.html") if ".git" not in path.parts)
    changed = 0
    skipped: list[tuple[Path, str]] = []
    for path in html_files:
        if path.name in {"404.html", "FRAGMENT_DO_HEAD.html"}:
            continue
        did_change, warning = update_html(path)
        if did_change:
            changed += 1
        elif warning:
            skipped.append((path, warning))

    indexed = build_search_index(root)
    print(f"Sprawdzono plików HTML: {len(html_files)}")
    print(f"Zmieniono plików HTML: {changed}")
    print(f"Wpisów w wyszukiwarce: {indexed}")
    print(f"Ostrzeżeń: {len(skipped)}")
    for path, warning in skipped[:30]:
        print(f"UWAGA: {path.relative_to(root)} — {warning}")
    if skipped:
        return 4
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
