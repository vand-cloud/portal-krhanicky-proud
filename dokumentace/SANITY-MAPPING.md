# Sanity napojení — krhanicky-proud (Fáze 3) — IMPLEMENTAČNÍ BRIEF

> **Tento soubor je samostatný zdroj pravdy pro autonomní napojení webu na Sanity.**
> Simon odsouhlasil, že propojení se schématem provedu **autonomně až do konce** (build + ověření).
> Schéma zrcadlí skutečnou strukturu webu. Vše rozhodnuto níže; žádné blokující otázky.

## 0. Prostředí a pravidla

- **Projekt Sanity:** `4nb8kl4e`, dataset `production`. Kostra už stojí: Studio na `/studio`, `next-sanity`, `lib/sanity/client.ts`, `lib/sanity/queries.ts`, `sanity/schemas/` (zatím jen `legalPage`). Embedded Studio: `app/studio/[[...tool]]`.
- **Jazyk: pouze CZ.** Internationalization plugin NEPOUŽÍVAT.
- **Český outward text → skill `/textar`** (bez em dash, vykání). UI → `/frontend-design`. **Token-first** (jen `var(--color-*)` + theme utility; hlídá `tools/token-lint.mjs`).
- **Dev:** `npm run dev --webpack`. **Build před závěrem.** **NEPUSHOVAT** bez explicitního pokynu (push = prezentace klientovi); commit lokálně OK, ale na konci se zeptat „půjde to ke klientovi?".
- **Seed obsahu:** přes **Sanity MCP** (`mcp__plugin_sanity_Sanity`) — vytvořit dokumenty z dnešního obsahu `content/*.ts`. Obrázky: nahrát existující `public/blog/*`, `public/people/*` jako Sanity assety.
- **Git autor (per CLAUDE.md):** `Simon Anfilov <simon@anfilov.cz>` (lokálně).

## 1. ROZSAH TÉTO VLNY

**IN:** Program (`/proud/nas-program` + detail), `/proud` landing, Blog, Úřad (`/urad`), Zapojte se, Singleton `siteSettings`, Právní stránky (gdpr/cookies/přístupnost), sdílené typy `person` + `richBody`.

**OUT (pozdější vlna):** **Katalog / Průvodce** (akce/místa/gastro/obchody/služby/spolky, 127 záznamů, 4-úrovňová taxonomie — viz `SCHEMA.md`). Homepage hledání + mapa zatím zůstává na `content/entries.ts`. NEŘEŠIT teď.

## 2. SDÍLENÉ STAVEBNÍ BLOKY

### 2a. `richBody` (sdílený rich-text, Portable Text) — JEDEN editor pro vše
Použít v: `proudPost.body`, `blogPost.body`, `uradPost.body`, `legalPage.body`.
- **Bloky/styly:** normální odstavec, **H2, H3, H4**, citace (blockquote).
- **Marks/dekorátory:** tučné (strong), kurzíva (em).
- **Seznamy:** odrážkový (bullet), číslovaný (number).
- **Anotace:** odkaz (`link`) — externí URL i interní (zatím URL pole; interní ref doplníme později).
- **Inline/objektové bloky:**
  - `image` — obrázek s popiskem (`alt` + `caption`).
  - `table` — tabulka (plugin `@sanity/table`).
  - `youtube` — custom objekt `{ url }`, render přes iframe (embed).
  - `fileDownload` — custom objekt `{ file, name, fileType? }` (velikost auto z asset metadata). Render = komponenta **FileDownload** (download lišta, staví/postavil paralelní agent, viz §6).

### 2b. `person` (SDÍLENÝ typ pro celý web)
Jeden člověk = může být kandidát + autor + zastupitel + provozovatel (katalog) zároveň.
- `name` (string, req)
- `slug` (slug, z name)
- `role` (string) — krátká funkce do seznamu („Starosta", „Lídryně kandidátky")
- `affiliations` (array of string, enum): `zastupitel`, `clen-proudu` („Člen Krhanického Proudu"), `kandidat-2026` („Kandidát voleb 2026"), `redaktor`. (mapuje na stávající `people.ts`)
- `bio` (text) — delší popis
- `photo` (image)
- `contact` (object, co nejbohatší, zobrazí se jen vyplněné): `email`, `phone`, `web`, `facebook`, `instagram` (příp. `linkedin`, `youtube`)
- `candidateOrder` (number, nepovinné) — ruční pořadí v seznamu kandidátů (jen když má `kandidat-2026`)
- `councilOrder` (number, nepovinné) — ruční pořadí v seznamu zastupitelů (jen když má `zastupitel`)
- (pozn.: dvě číselná pole pořadí, protože tentýž `person` se řadí nezávisle ve dvou kontextech; orderable-document-list dává jen jedno globální pořadí na typ, proto explicitní čísla)

### 2c. Ruční řazení (orderable)
Plugin **`@sanity/orderable-document-list`** (drag pořadí ve Studiu) pro typy: `proudCategory`, `blogCategory`, `uradCategory`, `proudPost` (globální drag; v kategorii se zachová relativní pořadí). Pořadí kandidátů/zastupitelů → přes číselná pole na `person` (§2b).

### 2d. „Icon picker" (sdílený enum ikon, lucide)
Použít pro `siteSettings.alertBar.icon` a `zapojteSePage.cards[].icon`. Sada (FINÁLNÍ):
`triangle-alert` (výstraha), `info` (informace), `circle-alert` (vykřičník), `megaphone` (promo), `vote` (volby), `calendar-clock` (termín). Render přes mapu name→lucide komponenta.

## 3. DOKUMENTOVÉ TYPY

### Singletony (po jednom; ve Studiu jako jediný editovatelný dokument)
- **`siteSettings`** (web-wide):
  - `footerDisclosure` (richBody-lite nebo text s odkazem na Program) — text „Krhanický Proud je nezávislé sdružení…"
  - **Kontakt = TÉŽ správce webu (jedna identita):** `contactName` („Ivan Dvořák"), `contactEmail` = **`ahoj@krhanickyproud.cz`** (dohromady, bez pomlčky; NAHRAZUJE `krhanicky.proud@gmail.com` všude), `contactPhone` („+420 714 177"), `address` (ulice+č.p., PSČ+obec — zatím placeholder), příp. `ico`.
  - `social`: `facebook`, `instagram` (ikony do patičky).
  - `seo`: `defaultDescription`, `ogImage`.
  - **`alertBar`** (horní pruh, JEDEN pruh + výběr tónu):
    - `enabled` (bool)
    - `tone` (enum): `warning` (oranžová = děje se něco) | `campaign` (světlejší zelená = promo/info, např. blíží se volby). Mapuje na `--color-warn*` / zelenou; navazuje na stávající tóny v `components/sections/Header/TopBar.tsx`.
    - `icon` (icon picker, §2d)
    - `text` (minimální Portable Text: jeden odstavec + anotace odkaz na stránku/URL)
    - NAHRAZUJE dnešní dvouslotový `topBar` (alert+campaign) v `site.config.ts`; `TopBar` číst z `siteSettings`.
- **`programPage`** (hlavička `/proud/nas-program`): `eyebrow` („Krhanický Proud"), `title` („Náš program"), `subtitle` („Co konkrétně chceme v Krhanicích řešit…").
- **`proudPage`** (`/proud` landing): `eyebrow`, `title`, `subtitle`, `highlightsEyebrow`, `highlightsTitle` („Střípky z našeho programu"), `highlights` = array karet **max 4** `{ title, text }` (statické, BEZ odkazu; nativní drag-sort + add/delete).
- **`blogPage`** (`/blog` seznam): `eyebrow` („Krhanický blog"), `title` („Obecní příspěvky"), `intro` (text).
- **`uradPage`** (`/urad`): `eyebrow`, `title` („Obecní úřad Krhanice"), `subtitle`.
- **`zapojteSePage`** (`/zapojte-se`): `eyebrow`, `title`, `subtitle`, `cards` = **4 karty** `{ icon (picker), title, text }` (BEZ odkazu), `contactBlock` `{ title, text, buttonLabel }` — tlačítko vede na **`mailto:` `siteSettings.contactEmail`**. Text: ponechat stávající z `content/*`; finální copy přes `/textar` při seedu.

### Kategorie (orderable, editor přidává/maže/řadí)
- **`proudCategory`**: `name` (v seznamu jako **eyebrow**), `subtitle` (NEPOVINNÝ, prázdný=skryté), orderRank.
- **`blogCategory`**: `title`, (slug), orderRank.
- **`uradCategory`**: `title`, (slug), **subcategories** = array `{ title, slug }` (ZACHOVAT subkategorie, např. Zastupitelstvo → Zastupitelé / Nadcházející schůze / Archiv schůzí / Kontakt), orderRank.

### Posty
- **`proudPost`**: `title`, `coverImage` (feature), `description` (= popis v seznamu I perex v detailu), `author` → ref `person`, `category` → ref `proudCategory` (single), `body` (richBody), orderRank. Detail pořadí prvků: eyebrow(kategorie) → titulek → **velký perex** → obrázek → „Za návrhem stojí: autor" → tělo. (UŽ HOTOVO v `GenericProudPost`.)
- **`blogPost`**: `title`, `coverImage`, `excerpt` (perex), `author` → ref `person`, `categories` → ref `blogCategory[]`, `tags` (array string, VOLNĚ psané), `publishedAt` (date), `readingTime` (AUTO — počítat z délky `body`, needitovat), `relatedPosts` → ref `blogPost[]` (max 3, ruční výběr), `body` (richBody). Seznam řazen `publishedAt` desc (nejnovější). Detail: titulek → perex → obrázek (v kontejneru, přirozený poměr) → datum+autor → tělo.
- **`uradPost`**: `title`, **BEZ coverImage**, **BEZ autora**, `date` (date, req), `category` → ref `uradCategory`, `subcategory` (string, z kategorie), `body` (richBody). Seznam řazen **`date` desc**; **žádné ruční řazení**. Dokumenty ke stažení = `uradPost` s `fileDownload` blokem v těle.

### `person` — §2b.

### `legalPage` (UPRAVIT existující `sanity/schemas/legalPage.ts`)
- Nahradit `sections[]` za **`body` (richBody)** (nadpisy přes H2 uvnitř). Ponechat `title`, `slug`, `lastUpdated`.
- 3 dokumenty: `gdpr`, `cookies`, `pristupnost`.
- **Blok „Správce webu"** se NEpíše do těla — vykreslí se **automaticky** v renderu právní stránky **ze `siteSettings`** (jméno/adresa/e-mail/telefon), vždy aktuální (rozhodnutí (a)).
- Seed: přenést současný text i s odkazy „tak jak je teď" (zdroj: `app/[locale]/(legal)/*` + `components/legal/LegalPageRenderer.tsx` / dnešní data).

## 4. ZOBRAZOVACÍ PRAVIDLA
- **Kandidáti** (`/proud/nas-program` kat. „Naši kandidáti", a /proud) = `person` kde `affiliations` obsahuje `kandidat-2026`, řazení dle `candidateOrder` (ruční), zleva doprava / shora dolů konzistentně všude.
- **Zastupitelé** (`/urad`) = `person` kde `affiliations` obsahuje `zastupitel`, řazení dle `councilOrder` (ruční).
- **Autor** článku = `person` (typicky `redaktor`/`clen-proudu`).
- Program/Blog/Úřad kategorie = ruční pořadí (orderable). Blog posty = dle data. Úřad posty = dle data. Program posty v kategorii = ruční (orderable).
- Náhledy: program post cover = fix 4:3; blog cover v kartě = fix 16:9; osoba = čtverec rounded (PersonThumb). Detail obrázky = v kontejneru, přirozený poměr (ne do krajů).

## 5. STUDIO STRUKTURA (deska/struktura `sanity.config.ts`)
Skupiny (záložky): **Nastavení** (siteSettings singleton), **Stránky** (programPage, proudPage, blogPage, uradPage, zapojteSePage singletony), **Program** (proudCategory orderable + proudPost orderable), **Blog** (blogCategory orderable + blogPost), **Úřad** (uradCategory orderable + uradPost), **Lidé** (person — orderable), **Servisní stránky** (gdpr/cookies/přístupnost). Singletony = jediný dokument (bez „create new").

## 6. KOMPONENTY (render)
- **FileDownload** (download lišta) — staví paralelní agent (`components/sections/RichText/FileDownload.tsx`): ikona + název + velikost + „Stáhnout", přes celou řádku, token-first. Napojit jako renderer `fileDownload` bloku v PortableText serializeru.
- PortableText serializer (`components/sections/RichText/PortableBody.tsx` nebo dle konvence) mapující richBody → stejnou typografii jako dnešní `ArticleBodyDemo` (H2/H3/H4, seznamy, image+caption, table, youtube, fileDownload). `ArticleBodyDemo` (placeholder) pak nahradit reálným tělem.
- Icon picker render: mapa enum→lucide (§2d) pro alertBar + zapojteSe karty.

## 7. PLUGINY / ZÁVISLOSTI K PŘIDÁNÍ
`@sanity/orderable-document-list`, `@sanity/table`. (Image už `@sanity/image-url`.) YouTube + fileDownload = vlastní objekty (bez pluginu).

## 8. POŘADÍ KROKŮ + OVĚŘOVACÍ BRÁNY (autonomně)
1. **Schéma**: definovat všechny typy (§2-3) v `sanity/schemas/`, zaregistrovat v `schemas/index.ts`. Přidat pluginy. → `npx tsc --noEmit` clean.
2. **Studio struktura** (§5) + singleton chování. → otevřít `/studio`, ověřit že není „Tool not found", typy se zobrazují.
3. **GROQ dotazy** (`lib/sanity/queries.ts`) + TypeGen (`npm run` typegen dle `sanity-typegen.json`) → typy pro fetch.
4. **PortableText serializer + FileDownload + icon render** (§6).
5. **Seed obsahu přes Sanity MCP** z `content/*.ts` (+ upload obrázků z `public/`). Singletony naplnit dnešními texty (programPage/proudPage/blogPage/uradPage/zapojteSePage/siteSettings + alertBar z dnešního `site.config` alertu). Osoby (24) z `people.ts` vč. affiliations + photo + pořadí. Blog (6), proudPosty, uradPosty, kategorie.
6. **Přepojit stránky** z `content/*.ts` na Sanity fetch: `/proud`, `/proud/nas-program` (+detail), `/blog` (+detail), `/urad` (+detail), `/zapojte-se`, patička+TopBar (siteSettings), legal stránky (body + správce blok). Reading-time helper (auto). → `npx tsc --noEmit`, `token-lint`, **`npm run build`** clean.
7. **Render-verify** (dev na volném portu, Playwright, light+dark): /proud, /proud/nas-program + detail, /blog + detail, /urad + detail (vč. dokumentu s download lištou), /zapojte-se, patička, horní pruh (oba tóny), legal stránka se správce blokem.
8. **Commit lokálně** (autor Simon). **Push až na explicitní pokyn** — na konci reportovat a zeptat se „půjde to ke klientovi?".

## 9. STAV ROZHODNUTÍ — vše uzavřeno (žádné blokující otázky)
- E-mail `ahoj@krhanickyproud.cz` (bez pomlčky), nahrazuje gmail. ✅
- Kontakt = správce (jedna identita); adresa placeholder. ✅
- Sociální sítě FB+IG; SEO defaulty; horní pruh = jeden + tón (warning/campaign) + icon picker + text s odkazem. ✅ (sada ikon §2d finální)
- Program: kategorie editor spravuje+řadí; posty ruční pořadí; perex/obrázek/autor pořadí hotové. ✅
- /proud střípky: max 4, statické title+text. ✅
- Blog: kategorie jako program; štítky volné; reading-time auto; related ruční max 3; řazení dle data. ✅
- Úřad: jako program ALE posty bez cover, s datem, řazení dle data, bez ručního řazení, bez autora; subkategorie zachovat; dokumenty = posty s fileDownload v těle; zastupitelé = person+štítek, ruční pořadí. ✅
- Zapojte se: 4 karty (icon+title+text, bez odkazu); Pište nám → mailto kontakt. ✅
- Právní: richBody, předvyplnit, správce blok automaticky ze siteSettings. ✅
- Sdílené: jeden person, jeden richBody (+table/youtube/fileDownload), orderable, icon picker. ✅

## 10. HOTOVO MIMO TENTO BRIEF (z předchozích kroků, neopakovat)
- `GenericProudPost` detail už přeskládán (titulek→perex→obrázek→autor→tělo).
- `FileDownload` komponenta — staví paralelní agent (ověřit existenci před krokem 4/6).
- Demo obsah (blog covery, profilové fotky, program fotky) v `public/` — použít při seedu.
