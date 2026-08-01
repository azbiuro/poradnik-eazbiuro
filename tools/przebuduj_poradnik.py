#!/usr/bin/env python3
"""Naprawia układ menu i wyszukiwarki poradnik.eazbiuro.pl.

Zmienia wyłącznie:
- breakpoint menu komputer/mobilne,
- położenie i wygląd wyszukiwarki na stronie głównej,
- wersję pliku CSS oraz próg zamykania menu w skrypcie.

Nie zmienia treści, nazw, H1, title, meta description, canonical,
robots, JSON-LD, adresów URL ani sitemap.xml poradników.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

VERSION = "20260801-menu-search-v5"

SEARCH_BLOCK = """<!-- AZ-SEARCH-START -->
<div class="poradnik-hero-search">
  <form class="poradnik-search-form" role="search" data-poradnik-search>
    <label class="sr-only" for="poradnik-search-input">Szukaj w poradniku zakupowym</label>
    <div class="poradnik-search-row">
      <span class="poradnik-search-icon" aria-hidden="true">⌕</span>
      <input id="poradnik-search-input" type="search" placeholder="Znajdź poradnik lub temat" autocomplete="off" spellcheck="false">
      <button type="submit">Znajdź</button>
    </div>
    <span class="poradnik-search-help">Wyszukiwarka przeszukuje działy i opublikowane poradniki.</span>
  </form>
  <div class="poradnik-search-status" data-search-status aria-live="polite"></div>
  <div class="poradnik-search-results" data-search-results hidden></div>
</div>
<!-- AZ-SEARCH-END -->"""

CUSTOM_CSS = """/* AZ-SEARCH-START */
.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
.az-header .az-nav .az-nav-knowledge{color:#105fa6}
.az-header .az-nav .az-nav-knowledge:hover,.az-header .az-nav .az-nav-knowledge:focus-visible{color:#cd0000}
.poradnik-hero-search{position:relative;z-index:4;max-width:760px;margin:30px 0 0}
.poradnik-search-row{display:grid;grid-template-columns:54px minmax(0,1fr) auto;align-items:center;min-height:74px;padding:7px 9px 7px 12px;background:#fff;border:1px solid #d7e0e8;border-radius:17px;box-shadow:0 16px 38px rgba(22,34,51,.08)}
.poradnik-search-icon{display:grid;place-items:center;color:#7b848d;font-size:2rem;line-height:1}
.poradnik-search-row input{width:100%;min-width:0;min-height:56px;padding:10px 8px;border:0;background:transparent;color:#1f2937;font:inherit;font-size:1.04rem;outline:0}
.poradnik-search-row input::placeholder{color:#7b848d}
.poradnik-search-row:focus-within{border-color:#105fa6;box-shadow:0 0 0 4px rgba(16,95,166,.10),0 16px 38px rgba(22,34,51,.08)}
.poradnik-search-row button{min-width:136px;min-height:58px;padding:13px 24px;border:0;border-radius:12px;background:#cd0000;color:#fff;font:inherit;font-weight:800;cursor:pointer}
.poradnik-search-row button:hover,.poradnik-search-row button:focus-visible{background:#a90000}
.poradnik-search-help,.poradnik-search-status{display:block;margin:10px 5px 0;color:#7b848d;font-size:.84rem}
.poradnik-search-status{min-height:1.4em;font-weight:700}
.poradnik-search-results{position:absolute;left:0;right:0;top:100%;z-index:20;margin-top:10px;border:1px solid #dfe4e8;border-radius:14px;background:#fff;box-shadow:0 18px 48px rgba(22,34,51,.14);overflow:hidden}
.poradnik-search-results ul{max-height:420px;overflow-y:auto;list-style:none;margin:0;padding:0}
.poradnik-search-results li+li{border-top:1px solid #dfe4e8}
.poradnik-search-results a{display:flex;flex-direction:column;gap:3px;padding:14px 17px;color:#1f2937;text-decoration:none}
.poradnik-search-results a:hover,.poradnik-search-results a:focus-visible{background:#f1f7fc;color:#cd0000}
.poradnik-search-results a span{color:#5f6b76;font-size:.86rem;font-weight:400}
.poradnik-search-empty{margin:0;padding:17px;color:#5f6b76}
@media (min-width:1101px) and (max-width:1750px){
  .az-header .az-header-inner{width:calc(100% - 40px);height:100px;gap:12px}
  .az-header .az-brand-logo{width:195px}
  .az-header .az-brand-divider{height:38px;margin:0 10px}
  .az-header .az-brand-label{font-size:16px}
  .az-header .az-nav{gap:13px}
  .az-header .az-nav>a{font-size:13.5px}
  .az-header .az-nav .az-nav-cta{width:165px;height:54px;min-height:54px;padding:10px 14px;font-size:14px}
}
@media(max-width:760px){
  .poradnik-hero-search{margin-top:24px}
  .poradnik-search-row{grid-template-columns:42px minmax(0,1fr);padding:7px 9px}
  .poradnik-search-row button{grid-column:1/-1;width:100%;min-height:52px}
  .poradnik-search-icon{font-size:1.65rem}
}
@media(max-width:420px){
  .poradnik-search-row{grid-template-columns:34px minmax(0,1fr)}
  .poradnik-search-row input{font-size:.94rem}
}
/* AZ-SEARCH-END */"""

SEARCH_RE = re.compile(
    r"\s*<!-- AZ-SEARCH-START -->.*?<!-- AZ-SEARCH-END -->\s*",
    re.IGNORECASE | re.DOTALL,
)
CUSTOM_CSS_RE = re.compile(
    r"/\* AZ-SEARCH-START \*/.*?/\* AZ-SEARCH-END \*/",
    re.DOTALL,
)
STYLE_RE = re.compile(
    r"""href=(?P<q>["'])(?P<url>[^"']*assets/style\.css)(?:\?[^"']*)?(?P=q)""",
    re.IGNORECASE,
)


def update_homepage(root: Path) -> None:
    path = root / "index.html"
    if not path.exists():
        raise FileNotFoundError("Brak pliku index.html w katalogu głównym")

    text = path.read_text(encoding="utf-8")
    text = SEARCH_RE.sub("\n", text)

    hero_lead = re.search(
        r'(<section\b[^>]*class=["\'][^"\']*home-hero[^"\']*["\'][^>]*>.*?'
        r'<p\b[^>]*class=["\'][^"\']*lead[^"\']*["\'][^>]*>.*?</p>)',
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not hero_lead:
        raise ValueError("Nie znaleziono tekstu w sekcji home-hero")

    text = (
        text[: hero_lead.end()]
        + "\n"
        + SEARCH_BLOCK
        + "\n"
        + text[hero_lead.end() :]
    )
    path.write_text(text, encoding="utf-8", newline="\n")


def update_css(root: Path) -> None:
    path = root / "assets/style.css"
    if not path.exists():
        raise FileNotFoundError("Brak assets/style.css")

    text = path.read_text(encoding="utf-8")
    text = CUSTOM_CSS_RE.sub("", text).rstrip()

    # Przywrócenie menu mobilnego dopiero dla tabletów i telefonów.
    text = text.replace("@media (max-width:1450px)", "@media (max-width:1100px)")
    text = text.replace("@media(max-width:1450px)", "@media(max-width:1100px)")

    path.write_text(
        text + "\n\n" + CUSTOM_CSS + "\n",
        encoding="utf-8",
        newline="\n",
    )


def update_html_assets_and_menu(root: Path) -> int:
    changed = 0
    for path in sorted(root.rglob("*.html")):
        if ".git" in path.parts:
            continue
        try:
            original = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue

        def version_style(match: re.Match[str]) -> str:
            return (
                f'href={match.group("q")}{match.group("url")}'
                f'?v={VERSION}{match.group("q")}'
            )

        text = STYLE_RE.sub(version_style, original)
        text = text.replace(
            "if(window.innerWidth>1450){closeMenu();}",
            "if(window.innerWidth>1100){closeMenu();}",
        )

        if text != original:
            path.write_text(text, encoding="utf-8", newline="\n")
            changed += 1
    return changed


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Naprawa menu i położenia wyszukiwarki"
    )
    parser.add_argument("--root", default=".")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        print(f"BŁĄD: katalog nie istnieje: {root}", file=sys.stderr)
        return 2

    update_homepage(root)
    update_css(root)
    changed = update_html_assets_and_menu(root)

    print("Wyszukiwarka została przeniesiona pod tekst strony głównej.")
    print("Menu mobilne będzie uruchamiane dopiero poniżej 1100 px.")
    print(f"Zaktualizowano odwołania w plikach HTML: {changed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
