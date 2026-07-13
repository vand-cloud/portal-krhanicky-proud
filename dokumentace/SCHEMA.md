# Schéma a taxonomie — krhanicky-proud

Stav k 2026-05-05. Tento dokument je **závazný zdroj pravdy** pro datovou strukturu Krhanického průvodce. SPEC.md je starší a v části „search_entries" stale (popisuje původní 5-typovou Postgres vizi z brainstormingu 2026-05-03, kterou jsme během wireframe fáze přepsali). Pokud se rozcházejí, platí tento soubor.

---

## 4-úrovňová taxonomie pro Krhanický průvodce

Hierarchie:

```
1. TYP            single, jeden ze 6 (akce / mista / gastro / obchody / sluzby / spolky)
2. KATEGORIE      single, scoped per typ (každý typ má vlastní katalog)
3. PODKATEGORIE   single, scoped per (typ, kategorie); volitelná
4. ŠTÍTKY         multi (AND), tažené ze sdíleného katalogu s applicableForms guardem
```

Single source of truth: `web/content/entries.ts`. Originální specifikace: `_in/krhanicky-pruvodce-taxonomie.md` v1.0.

### 6 typů a počty entries (k 2026-05-05)

| Typ | Plural label | Entries | Detail bucket |
|---|---|---:|---|
| `akce` | Akce | 27 | `/akce/[slug]` |
| `mista` | Místa | 29 | `/mista/[slug]` |
| `gastro` | Gastro | 3 | `/mista/[slug]` |
| `obchody` | Obchody | 12 | `/mista/[slug]` |
| `sluzby` | Služby | 47 | `/sluzby/[slug]` |
| `spolky` | Spolky | 9 | `/sluzby/[slug]` |
| **celkem** |  | **127** |  |

**Detail bucket je důležitý.** 6 typů, ale jen **3 fyzické routy** detailů:
- `akce` → `/akce/[slug]`
- `mista`, `gastro`, `obchody` → `/mista/[slug]` (hmotná místa)
- `sluzby`, `spolky` → `/sluzby/[slug]` (lidé / služby / sdružení)

Důvod: routing fáze 2 wireframe drží ~3 sekce, ne 6 (méně URL prostoru, jednodušší navigace). Při Sanity migraci tohle zachováme.

### Listing route

`/pruvodce` je **jediné browse rozhraní** pro všech 6 typů. Filtry přes query params:

```
/pruvodce?type=<typ>&cat=<kategorie>&sub=<podkategorie>&tags=<a,b,c>
```

`type=vse` (alias `all`) = curated landing pro všechny typy.

### Soubor `entries.ts` exportuje

| Export | Tvar | Účel |
|---|---|---|
| `EntryType` | union 6 string literals | type field |
| `Entry` | interface | celý záznam (id, type, slug, title, description, href, lat/lng, kategorie, podkategorie, štítky, status, trustLevel, …) |
| `NewsItem` | interface | aktuality obce (samostatný feed pro `/obec`) |
| `categoryDefs[]` | `{type, slug, label}` | katalog kategorií, scoped per typ |
| `subcategoryDefs[]` | `{type, category, slug, label}` | katalog podkategorií, scoped per (typ, kategorie) |
| `tagDefs[]` | `{slug, label, group, applicableForms}` | sdílený štítkový katalog s guardem (5 group: audience, accessibility, place-weather, theme, price-entry, gastro) |
| `categoriesForType` | `Record<EntryType, Category[]>` | kategorie pro daný typ (pre-computed z categoryDefs) |
| `subcategoriesFor(type, cat)` | funkce | podkategorie pro (typ, kategorie) |
| `getCategoryLabel`, `getSubcategoryLabel`, `getTagLabel` | funkce | lookup |
| `entries: Entry[]` | concat `[...events, ...directory]` | hlavní pole |
| `news: NewsItem[]` | aktuality | samostatné |
| `KRHANICE_CENTER` | `{lat, lng}` | mapový default |
| `typeLabels`, `typeNavLabels`, `typeOrder` | `Record/Array` | UI labely a pořadí |

### Související content moduly

Vedle `entries.ts` žijí čtyři další content soubory s **vlastní taxonomií** (Krhanický průvodce není jediná sekce webu):

| Soubor | Doc shape | Vlastní taxonomie | Detail bucket |
|---|---|---|---|
| `blog.ts` | `BlogPost` | `BlogCategory` | `/blog/[slug]` |
| `obec.ts` | `ObecItem` | `ObecCategory` + `ObecSubcategory` (úřední deska, zastupitelstvo, dokumenty, …) | `/obec/[slug]` |
| `people.ts` | `Person` (s `Affiliation`, `PersonVisibility`) | per affiliation | `/lide/[slug]` |
| `proud.ts` | `ProudItem` | `ProudCategory` (volební program, hodnoty, …) | `/proud/nas-program/[slug]` |

Tyto moduly **nesdílejí** taxonomii s `entries.ts` (úmyslně — Obec, Proud a Lidé jsou samostatné sub-portály, ne další položky průvodce).

---

## Sanity migrace — co tohle implikuje

### Návrh dokumentových typů

| Sanity doc type | Source content | Cardinality |
|---|---|---|
| `entry` | `Entry` z `entries.ts` | ~127 |
| `newsItem` | `news` z `entries.ts` | ~8 |
| `blogPost` | `blogPosts` z `blog.ts` | ~6 |
| `obecItem` | `obecItems` z `obec.ts` | ~30 |
| `person` | `people` z `people.ts` | ~15 |
| `proudItem` | `proudItems` z `proud.ts` | ~8 |
| `legalPage` | (existuje, GDPR/cookies/přístupnost) | 3 |

**Klíčová otázka:** jeden `entry` typ s `type` enumem, nebo 6 dokumentových typů (`akce`, `misto`, `gastro`, `obchod`, `sluzba`, `spolek`)?

| | Jeden `entry` typ | 6 typů |
|---|---|---|
| Studio sidebar | „Entries" jeden seznam, filtry per type | šest položek, čistá navigace pro Ivana |
| Validace | `applicableForms` jako conditional rules v jednom schématu | duplikuje pravidla, ale každý je jednodušší |
| GROQ dotazy | jeden filter `*[_type == "entry" && type == "akce"]` | per type, čistší |
| Migrace dat | jeden migration script | 6 podobných scriptů |

**Doporučení:** **jeden `entry` typ** s `type` enumem. Důvody: shared `Category`/`Subcategory`/`Tag` validace, jediné conditional logic centrum, lepší pro budoucí přidání nového typu (jen extend enum). Studio UX vyřešíme custom Structure Builder s 6 virtuálními skupinami.

### Taxonomie jako docs vs. inline

| Volba | Pro | Proti |
|---|---|---|
| **A. Inline closed lists** v `entry` schema (categoryDefs jako `list` option, scoped per type přes conditional) | Taxonomie verzovaná v kódu, žádný drift mezi schématem a daty | Když Ivan chce novou kategorii, volá Simona. Změna = code commit + redeploy. |
| **B. Vlastní docs** (`taxonomyType`, `taxonomyCategory`, `taxonomySubcategory`, `taxonomyTag`) s reference fields v `entry` | Ivan edituje taxonomii v Sanity, žádný redeploy | Drift risk (Ivan smaže kategorii, na kterou jsou napojené entries). Reference[] cleanup složitější. |

**Doporučení:** **A (inline closed lists)**. Krhanický průvodce má pevnou strukturu, kterou jsme vědomě navrhli. Ivan není UX/IA designer, neměl by ji editovat přes klikání. Pokud bude chtít přidat kategorii, řešíme to jako change request → kód → redeploy. Klient edituje **obsah, ne strukturu**.

### `applicableForms` guard pro štítky

V Sanity přes `hidden` callback na tag fields, který kontroluje aktuální `type` dokumentu. Štítek se pro nepoužitelný typ vůbec nezobrazí.

```ts
// pseudo
defineField({
  name: "tags",
  type: "array",
  of: [{type: "string", options: {list: TAG_OPTIONS}}],
  hidden: ({document, parent}) => {
    const type = document?.type;
    return !TAG_OPTIONS.some(t => t.applicableForms.includes(type));
  }
})
```

### `relatedEntries`

Reference[] field s filterem na `_type == "entry"`. Slouží pro split-into-two pattern (Hrnčířka prodejna + Hrnčířka workshop).

### `payload` JSONB

V Sanity nepotřebujeme. Type-specific data, která máme dnes v `Entry` interface (lat/lng, hours, price, parking, …), v Sanity prostě budou separátní fields. Conditional `hidden` na základě `type` skryje irelevantní pole (např. `endedAt` se zobrazí jen pro `type === "akce"`).

---

## Etapy migrace

### E1. Schema design (lokálně, 1× sezení)
- `sanity/schemas/entry.ts` (master document)
- `sanity/schemas/objects/` (kontaktBlock, souradnice, mediaBlock)
- `sanity/schemas/newsItem.ts`, `blogPost.ts`, `obecItem.ts`, `person.ts`, `proudItem.ts`
- Custom Structure Builder v `sanity.config.ts` (skupiny v sidebaru per type pro Ivana)
- Schema deploy přes `mcp__plugin_sanity_Sanity__deploy_schema`

### E2. Migrace dat (1× sezení)
- `scripts/migrate-to-sanity.ts` čte `content/*.ts` → transformuje → POST přes write token
- Obrázky: prázdné, čekáme na materiál od Ivana
- Verify: count souhlasí, slug match, žádný orphan reference v `relatedEntries`

### E3. Rewire stránek (1× PR)
- `lib/sanity-fetch.ts` s typovanými GROQ helpery
- Každá `page.tsx` přepnuta z `import { entries }` na `await fetchAllEntries()`
- ISR + tag-based revalidate webhook
- Live preview přes Presentation tool
- `content/*.ts` zůstanou jen pro Playwright testy s `NEXT_PUBLIC_SANITY_PROJECT_ID="dummy"` fallbackem

### E4. Ivanův onboarding do Studia
- Sidebar s 6 virtuálními skupinami pro `entry` (per type)
- Visual editing přes Presentation tool
- Read-only kategorie (drží se v kódu, viz volba A výše)

---

## Stale části SPEC.md, které tento dokument **přepisuje**

| SPEC.md sekce | Stav | Náhrada |
|---|---|---|
| Search index — schema (`CREATE TYPE entry_type AS ENUM ('event', 'place', 'service', 'article', 'news')`) | **stale**, jen 5 typů | 6 typů viz výše |
| Postgres + PostGIS + Czech FTS jako primary store | **stale**, Sanity primary | Postgres přijde až ve Phase 4+ jako search index, ne primary store |
| Sanity drží jen blog (long-form) | **stale**, Sanity drží vše | Sanity = primary store pro entries, news, blog, obec, proud, people |

SPEC.md zůstává platný pro: mise + cíl, architektura ostatní (mapa, kampaňový režim, členství Tease & Pull, Source-of-Sources scrape pipelines, lifecycle pravidla). Postgres + PostGIS migrace zůstává v plánu pro **fázi search/scrape** (po launchi MVP), ale není primárním data store.
