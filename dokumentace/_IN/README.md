# _IN, vstupní podklady od klienta

Sem patří všechno, co od klienta dostanete pro tento projekt: brief, brand, fotky, texty, inspirace, sketche. Skripty `/design-wireframe` a `/apply-brand` čtou tuto strukturu, takže její dodržení šetří čas a zlepšuje výsledek.

## Struktura

```
_IN/
├── 00-brief/                  zadání od klienta
│   ├── brief.md               cíle, cílovka, value props, USP
│   └── struktura.md           jaké stránky, jaký obsah
├── 01-inspirace/              reference pro strukturu i estetiku
│   ├── refs.md                seznam URL + poznámky („líbí se mi hero, ne footer")
│   ├── screenshots/           PNG screenshoty z inspirací
│   └── scraped/               (volitelné) markdown z /firecrawl
├── 02-brand/                  brand identita (vstup pro Phase 1)
│   ├── logo/                  SVG, PNG, lockup variants
│   ├── manual.pdf             brand manuál (pokud existuje)
│   ├── colors.md              hex kódy, brand barvy
│   ├── fonts/                 font soubory nebo Google Fonts názvy
│   └── voice.md               tone of voice (pokud klient má)
├── 03-content/                klientovy texty + média
│   ├── texty/                 surové copy (Word, MD, txt)
│   ├── fotky/                 produktové, ambientní, team
│   └── files/                 PDF, dokumenty
└── 04-sketch/                 (volitelné) klientovy wireframe sketches
    ├── sitemap.md
    └── sketches/              PDF, PNG, Figma exporty
```

Číselné prefixy zaručují řazení podle workflow.

## Bezpečnost

Obsah `_IN/` je gitignorován a nikdy se necommituje. Po dokončení projektu lze složku archivovat mimo repo.

## Co sem nedávat

- Hesla, API tokeny → patří do `web/.env.local` nebo password manageru
- Soubory určené pro web → patří přímo do Sanity nebo `web/public/`
