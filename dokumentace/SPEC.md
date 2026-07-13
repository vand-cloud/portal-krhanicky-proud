# Krhanický Proud — projektový spec

**Slug:** `krhanicky-proud`
**Datum brainstormingu:** 2026-05-03
**Aktuální fáze:** Phase 2 wireframe (live na `https://portal-krhanicky-proud.vercel.app`)

> ⚠️ **Sekce „Search index — schema" a popis Postgres jako primary store jsou stale.** Datová struktura se během Phase 2 evolovala na 6-typovou taxonomii (akce / mista / gastro / obchody / sluzby / spolky) se 4-úrovňovou hierarchií (TYP → KATEGORIE → PODKATEGORIE → ŠTÍTKY) a Sanity je nyní zamýšlený primary store, ne jen blog. Závazný popis taxonomie + Sanity migrační plán: viz [SCHEMA.md](./SCHEMA.md). Ostatní části tohoto SPEC.md (mise, mapa, kampaňový režim, členství, Source-of-Sources scrape) zůstávají platné.

---

## Mise a cíl

Webový portál pro občany obce **Krhanice** (okres Benešov, ~1200 obyvatel). Dvojí účel:

1. **Dlouhodobě** — kulturní a informační rozcestník pro občany. Akce, místa, služby, obecní informace v okolí 15 km.
2. **Periodicky** — 1× za 4 roky akviziční stránka pro kandidaturu sdružení Krhanický Proud do komunálních voleb.

Provozovatel: sdružení **Krhanický Proud**. Stávající provizorní web: `krhanickyproud.cz`.

Honest framing: portál je ~80 % rozcestník + ~20 % volební nástroj. Tato strategická upřímnost ovlivňuje notifikační logiku a transparency.

---

## Stav rozhodnutí (output brainstormingu 2026-05-03)

| Oblast | Volba | Klíčový důvod |
|---|---|---|
| Architektura | **A + F** — Postgres unified search, Sanity webhook, Postgres FTS | Pro tisíce záznamů žádný 3rd-party search engine |
| Trust | **C** — moderátorská fronta (`status: pending → approved → archived`) | Pro lokální komunitu trust > coverage |
| Primární UI | **G** — mapa + timeline hybrid, mobile split, MapLibre + OSM tiles | Geografická komunita, ale i timeline pro občany kteří „vědí kde" |
| IA | **2 + 5** — záložky-prefiltry pro akce/služby/místa, Obec jako sub-portál | Mapa je homepage, sekce jsou prefiltry té samé komponenty |
| Kampaň | `/volby` subpath + diskrétní bar + disclosure + archiv 2026/, 2030/ … | Subdoména by zbytečně rozdělila SEO; subpath drží identitu |
| Členství | **H (Tease & Pull)** — magic link e-mail, 180 dní cookie, notifikace = teaser, web = plný obsah + volební prostor | Maximalizuje engagement na webu, kde žije volební obsah |

---

## Architektura

### Datové vrstvy

```
Sanity (blog, dlouhý obsah)
    │
    │ webhook on publish
    ▼
Neon Postgres ◄─── User accounts, members, preferences
    │             ◄─── Firecrawl scrape pipelines
    │             ◄─── Občanské tipy z formulářů
    ▼
Frontend Next.js (App Router)
   ├── Mapa + Timeline (homepage)
   ├── /akce, /sluzby, /mista (prefiltry)
   ├── /obec (sub-portál)
   ├── /proud + /volby (campaign)
   ├── /blog (Sanity content)
   └── /ucet (členství)
```

### Search backend

- **Žádná Algolia/Meilisearch** — pro <5 000 záznamů zbytečné.
- **Postgres FTS** s `unaccent` extension a vlastní `cs` text search configuration (akcent-insensitive, žádný stemming pro fázi 1).
- Sanity articles synchronizovány do Postgresu přes webhook při publish. Frontend hledá vždy v Postgresu, nikdy přímo v Sanity.

### Mapa

- **MapLibre GL JS** s OpenStreetMap tiles (free navždy, kontrola nad stylem)
- PostGIS pro geo dotazy (radius, bbox, distance ranking)
- Default homepage state: vrstva „dnes / +7 dní" + všechny kategorie aktivní
- Per-uživatel persistent preference vrstev po loginu

---

## Search index — schema

```sql
CREATE TYPE entry_type AS ENUM ('event', 'place', 'service', 'article', 'news');
CREATE TYPE entry_status AS ENUM ('pending', 'approved', 'archived');
CREATE TYPE trust_level AS ENUM ('verified', 'scraped', 'user_submitted');
CREATE TYPE entry_category AS ENUM (
  'kultura', 'deti', 'sport', 'zabava', 'priroda',
  'sluzby', 'obec', 'doprava', 'zdravi'
);

CREATE TABLE search_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            entry_type NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  description     TEXT,
  url             TEXT NOT NULL,                  -- detail na portálu
  external_url    TEXT,                           -- původní zdroj
  lat             DOUBLE PRECISION,
  lng             DOUBLE PRECISION,
  geom            GEOMETRY(Point, 4326),          -- generated z lat/lng
  started_at      TIMESTAMPTZ,                    -- akce: od; článek: published_at
  ended_at        TIMESTAMPTZ,                    -- akce: do
  categories      entry_category[] NOT NULL DEFAULT '{}',
  tags            TEXT[] NOT NULL DEFAULT '{}',   -- volné štítky
  status          entry_status NOT NULL DEFAULT 'pending',
  trust_level     trust_level NOT NULL DEFAULT 'scraped',
  hero_image      TEXT,
  search_text     TEXT GENERATED ALWAYS AS (
    coalesce(title, '') || ' ' ||
    coalesce(description, '') || ' ' ||
    array_to_string(tags, ' ')
  ) STORED,
  ts              TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('cs', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('cs', array_to_string(categories::text[], ' ') || ' ' || array_to_string(tags, ' ')), 'B') ||
    setweight(to_tsvector('cs', coalesce(description, '')), 'C')
  ) STORED,
  payload         JSONB NOT NULL DEFAULT '{}',    -- type-specific data
  source_id       TEXT,                           -- ID v původním systému
  source_keys     TEXT[] NOT NULL DEFAULT '{}',   -- pro dedup hash
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_search_ts ON search_entries USING GIN (ts);
CREATE INDEX idx_search_categories ON search_entries USING GIN (categories);
CREATE INDEX idx_search_tags ON search_entries USING GIN (tags);
CREATE INDEX idx_search_geom ON search_entries USING GIST (geom);
CREATE INDEX idx_search_time ON search_entries (started_at, ended_at);
CREATE INDEX idx_search_status_type ON search_entries (status, type);
```

### Czech FTS setup

```sql
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TEXT SEARCH CONFIGURATION cs (COPY = simple);
ALTER TEXT SEARCH CONFIGURATION cs
  ALTER MAPPING FOR hword, hword_part, word
  WITH unaccent, simple;
```

Žádný hunspell, žádný custom dict. Pro <5000 záznamů stačí. Stemming přidáme později, pokud uvidíme, že lidé hledají „koncerty" a nedostávají „koncert".

### Lifecycle pravidla

- **Akce po `ended_at + 1 den` → `status: archived`** (hard hide z public search)
- **Soft delete only** — nikdy neHard-deletovat ze `search_entries`, jen status na `archived`
- **Sanity webhook** musí být idempotent: upsert s `last_modified_at` check
- **Dedup hash** = `lower(unaccent(title)) + date(started_at) + lat/lng_grid_100m` — kolize = stejná akce, sloučí se. Pole `source_keys[]` zachová odkud akce přišla.

---

## Source-of-Sources — scrape architektura

### Klíčový princip

Místo natvrdo zakódovaného seznamu zdrojů máš **databázovou tabulku zdrojů**. Tři pipelines běží nezávisle.

```sql
CREATE TYPE source_type AS ENUM ('html', 'rss', 'sitemap', 'api', 'ics', 'aggregator');
CREATE TYPE source_freq AS ENUM ('daily', 'weekly', 'monthly', 'quarterly');
CREATE TYPE source_status AS ENUM ('ok', 'fail', 'blocked', 'stale');

CREATE TABLE sources (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  url             TEXT NOT NULL,
  type            source_type NOT NULL,
  category        TEXT NOT NULL,                  -- 'obec', 'spolek', 'hospoda', 'agregator', ...
  scrape_freq     source_freq NOT NULL DEFAULT 'weekly',
  last_scraped_at TIMESTAMPTZ,
  last_status     source_status,
  geo_centroid    GEOMETRY(Point, 4326),          -- pro filtr „v okolí 15 km"
  trust_weight    INT NOT NULL DEFAULT 3,         -- 1-5, ovlivňuje ranking entries
  notes           TEXT,
  active          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Tři pipelines

**1. Source Discovery** — manuálně spouštěná, 1× měsíčně
- Velký scrape agregátorů (Posázaví, Kudy z nudy, Vikendo) hledá nové entity (nový spolek, nová hospoda, nová školka v okolí 15 km)
- Output: nové řádky v `sources` jako pending → tým schvaluje

**2. Static Refresh** — automatický cron, 1× za 3–6 měsíců
- Scrape entit s nízkou změnou: památky, vyhlídky, kontakty hospod, otevírací doby, adresy podniků
- Updates `search_entries` typu `place` a `service`

**3. Event Pulse** — automatický cron, 1× týdně (víkend večer)
- Scrape všech `sources` se `scrape_freq = weekly`
- Hledá akce s budoucím datem
- Plní `search_entries` jako `status: pending` pro tým review

### Diagnostika zdrojů (test 2026-05-03)

| Zdroj | Stav | Strategie |
|---|---|---|
| `obeckrhanice.cz` | ✅ Antee s.r.o. + IPO CMS, sitemap.xml dostupný (RSS ne) | scrape `/aktuality`, `/pozvanky-na-akce`, `/uredni-deska`, `/spolky-v-obci` weekly |
| `tourist.posazavi.com` | ✅ Apollo CMS, stabilní category IDs (1=výstava … 19=soutěže) | filtrované scrape `Events.aspx?CategoryId=X&RegionId=Tynecko`, dedup s tynec subdoménou |
| `tynec.posazavi.com` | ✅ stejný CMS, dedicated Týnecko microregion | scrape weekly, region filter natural |
| `leader.posazavi.com` | ✅ Apollo CMS, organizace v MAS Posázaví | quarterly discovery (kdo dělá akce) |
| `vikendo.cz` | ✅ sitemap index s 4 sub-sitemapami (events_fresh, events, geolocation) | scrape `/sitemap_events_fresh.xml` weekly pro nové akce |
| `kudyznudy.cz` | ✅ search-and-scrape funguje | search „Krhanice", „Týnec", „Posázaví" weekly |
| Facebook (obec, Sokol, SDH) | ❌ Firecrawl odmítá (ne enterprise) | nescrapovat, spolehnout na agregátory |
| Mapy.cz | ❌ SPA, scraper dostane prázdný shell | použít OSM Overpass API místo toho |

### Munipolis — vyřešená záhada

**Krhanice nepoužívají Munipolis jako CMS.** Hlavní web `obeckrhanice.cz` běží na ANTEE s.r.o. + redakční systém IPO. Munipolis je u nich vedlejší **notifikační služba** (ekvivalent Mobile Rozhlas), nikoliv content backend. Sitemap to potvrzuje: `/informacni-system-munipolis` je samostatná podstránka jako mnoho jiných.

→ **Důsledek:** Žádný Munipolis API integrace není potřeba. Stačí scrape ANTEE webu přes sitemap-driven URLs.

### Odhadované pokrytí 30–50 akcí/měsíc

- obeckrhanice.cz: ~5–10 lokálních akcí
- tourist + tynec.posazavi.com: ~30–50 akcí v okruhu 15 km (✓ jádro)
- vikendo.cz: ~10–20 akcí (overlap)
- kudyznudy.cz: ~5–15 akcí (overlap)

**Posázaví + obeckrhanice = realistické 80 % pokrytí**, FB scrape není potřeba.

---

## UI — mapa + timeline hybrid

### Homepage layout

**Desktop:**
- Header s globálním type-ahead search boxem
- Toggle 🗺️ „Kde" / 📅 „Kdy" v top navigaci (preference se ukládá při loginu)
- Mód „Kde": full-width MapLibre mapa s vrstvami; dolní sticky banner „📢 N nových aktualit obce"
- Mód „Kdy": vertikální timeline „dnes / zítra / víkend / příští týden" s mini-mapou na hover každé položky

**Mobile:**
- Horní 60 %: mapa
- Dolní 40 %: swipeable bottom sheet s listem
- Synchronizace: scroll listu zvýrazňuje pin; pan mapy filtruje list na viewport
- Tap na pin → karta vyjede v sheet

### Vrstvy mapy

Vrstva = kategorie, ne typ obsahu. Občan nepřemýšlí ve „type=event vs type=place".

| Vrstva | Pokrývá |
|---|---|
| Kultura | akce + místa kulturní (kostely, divadla) + relevantní články |
| Děti | akce + hřiště + školy/školky + příměstské tábory |
| Sport | akce + hřiště + klubovny + cyklotrasy |
| Příroda | místa (vyhlídky, stezky) + sezónní akce v přírodě |
| Služby | hospody, řemeslníci, lékař |
| Obec | aktuality obecního úřadu (přes sticky banner, ne pin) |

### Časové okno (default)

- **„od teď do +7 dní"** s přepínačem v rohu pro „příští týden", „tento měsíc"
- Žádný time slider (sexy, ale občan ho nepochopí)
- Akce po `ended_at + 1 den` automaticky mizí (`archived`)

---

## Information architecture

```
Domů                    — homepage, mapa + timeline hybrid
├── /akce               — prefilter homepage na type=event
├── /sluzby             — prefilter na type=service
└── /mista              — prefilter na type=place

Obec                    — sub-portál (vlastní layout, ne mapa)
├── /obec/uredni-deska
├── /obec/zastupitelstvo
├── /obec/dokumenty
└── /obec/aktuality

Proud                   — informační stránka sdružení
└── /volby              — kampaňová sekce (campaignMode flag)
    └── /volby/2026     — archiv po volbách

Blog                    — Sanity content
Zapojte se              — formulář (přejmenováno z „Kontakt")
                         pro nahlášení akce, místa, problému
```

### Navigace v headeru

**5 položek:** Domů | Obec | Proud | Blog | Zapojte se

`/akce`, `/sluzby`, `/mista` existují jako URL pro deep links a chip filtry, ale nejsou v nav.

---

## Členství — Tease & Pull

### Login

- **Magic link e-mail** (žádné SMS, babičky nejsou cílová persona)
- **180 dní cookie session** (vzácná akce, low security risk)
- Při onboardingu: jméno (volitelné), e-mail (povinný), preference kategorií

### Notifikační logika

- **Notifikace = teaser, ne full content**
- Default frekvence: **1× týdně mail v pátek 17:00** „Co se chystá tento víkend"
- Real-time notifikace pouze pro vrstvy, které si uživatel explicitně označí (např. „obec — okamžitě")
- Každá notifikace obsahuje **1 minimální fakt** (akce X / 12.5. 19:00 / U Hraběte) + link na detail
- SMS kanál: fáze 2, opt-in se double opt-in, GDPR-compliant DPA s providerem

### Personalizace homepage

- Anonymní návštěvník: default (všechny vrstvy zapnuté, 7-day window)
- Přihlášený: předfiltrovaná mapa podle preferencí + persistent toggle 🗺️/📅
- Volební bar v `campaignMode=true` viditelný **pouze na webu**, ne v notifikacích

### Account decay

- Po 12 měsících neaktivity automaticky deaktivovat odběr + nabídnout reaktivaci 1 klikem
- GDPR-compliant: nesmíme držet osobní data déle, než je nutné

---

## Kampaňový režim

### Toggle

```ts
// site.config.ts
export const siteConfig = {
  campaignMode: false,  // přepne na true v období voleb 2026
  campaignName: "Volby 2026",
  campaignBarCTA: "Volby 2026 — kandidátka & program",
}
```

### Co se v `campaignMode = true` mění

- **Diskrétní bar** nahoře každé stránky s linkem na `/volby`
- `/volby` je dostupná (mimo kampaň → 404 nebo redirect na `/proud`)
- Disclosure badge na akcích pořádaných sdružením („Pořadatel: Krhanický Proud")
- Disclosure note u blog článků autorů z KP („Autor je členem Krhanického Proudu")

### Po volbách

- `/volby` se přejmenuje na `/volby/2026`
- Archiv „co jsme slibovali, co jsme splnili"
- `campaignMode` zpět na `false`

### Stálá patička (mimo kampaň i v kampani)

> Krhanický Proud je nezávislé sdružení občanů. Provozujeme tento portál celoročně.
> V období voleb naleznete naši kandidátku a program v sekci [/volby](/volby).

---

## Postup implementace

### Fáze 0 — pre-onboard (nyní)
- [x] Brainstorming všech zásadních rozhodnutí
- [x] Diagnostický scrape 5 zdrojů (obeckrhanice, FB, Kudy, Posázaví, Mapy.cz)
- [x] Diagnostika RSS/sitemap dostupnosti
- [x] SPEC.md (tento dokument)

### Fáze 1 — onboard (následuje)
- [ ] `/onboard-web krhanicky-proud --neon` (Neon DB potřeba pro Postgres + PostGIS)
- [ ] Lokální dev na `localhost:3000` (template starter)
- [ ] Konfigurace Sanity org, Vercel project, env vars
- [ ] CLAUDE.md projektu s kontextem ze SPEC.md

### Fáze 2 — wireframe (hardcoded data)
- [ ] Mapa + timeline homepage s 5–10 hardcoded entries
- [ ] Toggle 🗺️/📅
- [ ] Mobile split layout
- [ ] Záložky `/akce`, `/sluzby`, `/mista` jako prefiltry
- [ ] `/obec`, `/proud`, `/volby` (campaignMode toggle)
- [ ] Členská sekce mockup (login form, preference)
- [ ] **Klient (Krhanický Proud) reviewuje wireframe** → úpravy

### Fáze 3 — designed (hardcoded data, ANFILOV brand pro KP)
- [ ] Brand barvy a typografie KP
- [ ] Polished UI s reálnými mapami a komponenty
- [ ] Real MapLibre + OSM tiles
- [ ] **Klient reviewuje design** → úpravy

### Fáze 4 — Sanity + Postgres + scrape
- [ ] Sanity schema (blog only)
- [ ] Postgres schema (search_entries, sources, users, preferences)
- [ ] Czech FTS setup, PostGIS extension
- [ ] Sanity → Postgres webhook
- [ ] Auth: magic link e-mail + 180 dní cookie
- [ ] Source-of-Sources tabulka + 3 pipelines (Discovery / Static / Pulse)
- [ ] Firecrawl integrace, dedup hash logika, admin queue UI
- [ ] Nightly cron scheduling

### Fáze 5 — launch
- [ ] `/launch-web krhanicky-proud`
- [ ] Doména `krhanickyproud.cz` na Vercel (DNS-only mode pokud Cloudflare)
- [ ] Resend domain verification
- [ ] Editor invite pro klienta v Sanity
- [ ] Lighthouse smoke test
- [ ] HANDOVER.md

### Fáze 6 — provoz
- [ ] Týdenní cron Event Pulse
- [ ] Měsíční manuální Source Discovery
- [ ] Tým reviewuje pending queue
- [ ] Občané posílají tipy přes formulář „Zapojte se"

### Fáze 7 — kampaň 2026 (později)
- [ ] `campaignMode: true`
- [ ] `/volby` aktivní s kandidátkou a programem
- [ ] Disclosure badges aktivní
- [ ] Po volbách archiv `/volby/2026`

---

## Otevřené otázky pro pozdější rozhodnutí

1. **OSM Overpass API** vs **Mapy.cz REST API** pro místa/služby — Overpass je zdarma a dostatečné pro statická místa (hospody, hřiště, památky), ale Mapy.cz může mít čerstvější data. Default: **Overpass**.
2. **SMS provider** pro fázi 2 — Twilio vs SMS Manager vs Vonage. Při 200 uživatelích × 4 SMS/měsíc × $0.05 = $40/měs Twilio. Rozhodnutí až ve fázi 2.
3. **Cron scheduling** — Vercel Cron Jobs vs Sanity Functions vs externí (např. cron-job.org). Default: **Vercel Cron Jobs** (zero infrastructure).
4. **Občanský formulář „Nahlas akci"** — kam ukládat? Přímo do `search_entries` jako `pending` + `trust_level: user_submitted`, nebo separátní `submissions` tabulka? Default: **direct do search_entries** s flag.

---

## Referenční materiály

- Diagnostické scrapy: `/.firecrawl-cache/` (gitignored)
- Brainstormingová konverzace: 2026-05-03
- Pravidla studia: viz root `/CLAUDE.md`
- Onboarding skript: `/onboard-web krhanicky-proud --neon`

---

*Tento dokument vznikl jako výstup brainstormingu. Aktualizuj ho při každé změně architekturálního rozhodnutí. Měla by stačit jedna četba, aby budoucí Simon nebo Claude pochopil, **proč** je to takhle, ne jen **co**.*
