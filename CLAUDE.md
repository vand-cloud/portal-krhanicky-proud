# Pracuj pozorně. Mysli poctivě. Buď v tom, co děláš.

Tato úvodní pasáž nastavuje tón. Konkrétní pravidla projektu
mění chování. Obojí má smysl. Nezaměňuj jedno za druhé.

Nejsi tady jen plnit úkoly. Jsi tady přemýšlet poctivě
a hledat to nejlepší, co dnes můžeš nabídnout.

Máš čas. Máš prostor. Nejsi pod tlakem.
Pracuj s pozorností, ne s napětím.

Hledej, co je opravdu důležité, ne jen co je rychlé.
Když nevíš, řekni to. Když víš, řekni to jasně.
A když najdeš něco dobrého, na chvíli buď u toho.

---

## Identita projektu

Tohle je klientský web pro **{{CLIENT_NAME}}** ({{CLIENT_DOMAIN}}), postavený na ANFILOV Studio template. Repo žije pod GitHub org `ANFILOV-Studio`, hosting běží na studio Vercel Pro teamu, obsah spravuje klient v Sanity Studiu jako Administrator (Free plán) nebo Editor (placený plán).

- Klient: `{{CLIENT_NAME}}`
- Doména: `{{CLIENT_DOMAIN}}`
- GitHub username klienta (pro lokální git config): `{{CLIENT_GITHUB_USER}}`
- E-mail klienta (pro lokální git config): `{{CLIENT_EMAIL}}`

Tento `CLAUDE.md` je **self-contained**, neodvozuje pravidla z parent monorepa. Vše, co Claude potřebuje pro práci na tomto projektu, je tady.


## Tech stack

- Next.js 16 (App Router, React 19)
- TypeScript strict
- Tailwind v4 (CSS-first via `@theme` v `app/globals.css`, žádný `tailwind.config.ts`)
- Sanity v5 (CMS, dataset `production`)
- next-intl 4 (`cs` default, `en` optional, pathnames per locale)
- Vercel hosting (studio Pro team `Anfilov Studio`)
- Resend (transakční e-maily, doména klienta verifikovaná pod studio Pro účtem)
- Tests: Vitest (unit) + Playwright + axe-core (e2e a11y)


## ⛔ Hard rules (non-negotiable)

### Skill `/textar` je povinný pro VEŠKERÝ český text určený lidem
Web copy, wireframe texty (Phase 0 / `content/*.ts`), právní stránky (`/gdpr`, `/cookies`, `/pristupnost`), Sanity dokumenty, error messages, validační hlášky, button labels, formulářové štítky, e-maily, OG popisky, schema.org JSON-LD. **Bez výjimek.** Skill se NEAKTIVUJE pouze pro anglický kód a komentáře, git commit messages a interní dev poznámky (CLAUDE.md, README pro Claude).

### Žádný em dash. Nikdy.
En dash (–) max 2–3× na článek. Místo toho čárka, dvojtečka, závorka, samostatná věta. Toto pravidlo platí i pro mikrocopy (button labels, error hlášky, meta description).

### Vykání pro outward texty
Konzistentně, napříč celým webem a transakčními e-maily. V chatu se Simonem se tyká, ale to je výhradně interní komunikace.

### Skill `/frontend-design` se aktivuje při jakékoli UI práci
Před výrobou nového bloku, sekce, layoutu, nebo úprav komponent vždy projít skillem `/frontend-design`. Default Next.js + Tailwind aesthetics jsou zakázané, výstup musí mít vlastní brand naladění.

### WCAG 2.1 AA je default, ne aspirace
10 pravidel viz sekce níže. Žádné PR nemá projít, pokud porušuje některé z nich.

### Git user pro klientský repo (model A): Simon Anfilov s GitHub-verified e-mailem
Lokální `git config user.name` a `user.email` se nastaví na `Simon Anfilov` a `simon@anfilov.cz` (Simonův primary verified e-mail na GitHub účtu `Anfilov`, který je owner Vercel teamu `simon-anfilovs-projects`). Vercel Pro blokuje auto-deploy od commit autorů, jejichž e-mail není verified v GitHubu nebo není member Vercel teamu — bez toho každý push vrátí error `COMMIT_AUTHOR_REQUIRED` a build se ani nespustí. `kontakt@anfilov.cz` (studio info e-mail) verified není, proto se sem nepoužívá.

```bash
git config user.name "Simon Anfilov"
git config user.email "simon@anfilov.cz"
```

Globální git config Simona zůstává nedotčený, nastavení je jen lokální (per-repo). Onboard skript `02-clone-repo.mjs` to dělá automaticky.

**Pro hosting model B** (klient má vlastní Vercel Hobby): commit autor musí být klient, ne Simon. Tehdy se nastaví `{{CLIENT_GITHUB_USER}}` a `{{CLIENT_EMAIL}}`. Edge case, řeší se per-projekt.

### `npm run dev` používá `--webpack`
Default v této složce kvůli mezerám v cestě `0 CLAUDE CODE/`, kde Turbopack v Next.js 16 nedokáže resolvovat `tailwindcss`. `package.json` má v `dev` scriptu vždy:

```json
"dev": "next dev --webpack"
```

Build (`next build`) zůstává Turbopack, Vercel má vlastní pipeline. Webpack je jen pro lokální dev.

### Cloudflare DNS pro Vercel projekty = DNS-only mode (šedý mráček)
Nikdy Proxied (oranžový), interferuje s Vercel SSL validací, cache managementem a edge networkem. Při auditu DNS recordů u domény `{{CLIENT_DOMAIN}}` flagni jakýkoliv oranžový mráček mířící na Vercel.

### Secrets nikdy do repa
`.env.local` je gitignored. Pravdivý zdroj přístupů je **Vercel Environment Variables** pro daný projekt. Lokálně se vytváří `.env.local` ze vzoru `.env.local.example`. Claude nikdy necituje hodnoty tokenů do markdown výstupů, commit messages, ani PR popisů, jen názvy proměnných a paths.

### 3-fázový workflow
1. **wireframe**: hardcoded `content/*.ts`, žádné brand barvy, šedá paleta z primitives, fokus na strukturu a hierarchii. **Inter only** (žádný display font), nadpisy přes `font-weight: 700`.
2. **designed**: `siteConfig.phase = "designed"`, brand barvy aplikované přes semantic tokens, display font reintrodukován v `layout.tsx` + `globals.css` + `site.config.ts`, hotová vizuální identita.
3. **sanity**: po schválení obsahu klientem migrace dat do Sanity, schéma reflektuje **skutečnou strukturu**, ne hypotetickou.

Sanity přichází POSLEDNÍ. Žádné předčasné modelování contentu, dokud klient neschválil hotový designed web.

### Šíření designových změn z klienta zpátky do template starteru
Když Claude na konkrétním klientovi vylepší design komponenty/sekce/karty, na konci úpravy se ptá: **„Propsat tuhle změnu i do `templates/starter-client-web/`?"**. Tři možnosti:
1. **Ano, jak je** — mirror-kopie do template repa.
2. **Ano, ale ucistit pro generic použití** — odstranit client-specific values před kopií.
3. **Ne, jen pro tento projekt** — change zůstane jen u klienta.

Pravidlo se týká: `components/sections/**`, `components/ui/**`, `components/legal/**`, `components/consent/**`, `app/globals.css` (struktura tokenů, ne brand override), `lib/tokens/**`. Netýká se: `content/*.ts`, `site.config.ts`, pages, `i18n/routing.ts`, `messages/*.json`, bug fixů specifických pro projekt.

Cílem je, aby knihovna komponent v templatu rostla s každým klientem a další onboarding začínal z lepšího výchozího stavu.

### Push u klientského projektu = veřejná prezentace klientovi

Push na `main` triggeruje Vercel auto-deploy → klient vidí preview URL. Push není automatika, je deliberativní akt prezentace. Konkrétně:

- **Wireframe a designed phase ladíme lokálně** přes `npm run dev` (port 3001). Iterace, fix, refactor, copy úpravy žijí na localhostu.
- **Commit klidně často** (snapshot práce). Commit ≠ push.
- **Push až je celá iterace hotová a Simon explicitně potvrdí.** Před každým `git push origin main` se Claude ptá: **„Půjde to ke klientovi?"**
- **Výjimka:** Simon explicitně napsal „pushni" / „pošli to klientovi" / „nasaď to" v aktuální zprávě. Pak push proveď bez další otázky.
- **Drobné úpravy nepushuj jednotlivě.** 5 commitů → 1 push, ne 5 pushů.

**Proč:** Klient by viděl rozpracovanou verzi nebo dostal „Failed Deployment" maily z Vercelu při každém build erroru. Push checkpoint je explicitní milestone, ne každodenní snapshot.


## WCAG 2.1 AA, 10 non-negotiable rules

1. Každá interaktivní komponenta má `focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2`.
2. Color contrast: text 4.5:1, UI komponenty 3:1. Ověř přes Lighthouse / axe.
3. Žádný `outline: none` bez nahrazení vlastním focus state.
4. Každý `<img>` má `alt` (i když prázdný `alt=""` u dekorativních).
5. Každý `<button>` a `<a>` má textový popis (ne jen ikonu, pak `aria-label`).
6. Form fields mají `<label>` (vizuální nebo `aria-label`).
7. Heading hierarchy: jeden `<h1>` per stránka, `<h2>` pod ním, žádné skoky.
8. Klávesnicová navigace: tab přes všechny interaktivní prvky v logickém pořadí, žádné `tabindex` > 0.
9. Žádné spoléhání na barvu jako jedinou indikaci (error = červená + ikona + text).
10. `prefers-reduced-motion` respektován u všech animací.


## Token systém (krátká orientace)

Pět vrstev. Při přidávání nového stylu vždy rozhodni, do které vrstvy patří. **Nikdy nehardcoduj barvu v komponentě.**

- **Primitives** (`app/globals.css` `@theme`): barvy, spacing, font sizes, radius. Surové hodnoty. Nikdy v komponentách.
- **Semantic** (`app/globals.css` `:root`): `--color-bg`, `--color-text`, `--color-accent`, `--color-brand`, `--color-border`. Komponenty používají VŽDY tyto.
- **Component** (`lib/tokens/component.ts`): tokeny per UI primitiva (Button, Card, Input).
- **Concept** (`lib/tokens/concept.ts`): vysokoúrovňové režimy (`layout: boxed/wide/fluid`, `density: compact/comfortable/spacious`, `contrast: soft/balanced/strong`, `motion: minimal/expressive/playful`).
- **Mode** (`lib/tokens/mode.ts`): light/dark přes `data-theme`.

Workflow při novém stylu:
1. Je to surová hodnota (např. nová barva v paletě)? → primitive
2. Je to sémantická role (např. text na hover)? → semantic
3. Je to specifické pro jednu komponentu? → component
4. Mění to globální charakter webu? → concept


## Soubory, které se musí číst před prací

- `site.config.ts`: phase, brand (název, doména, barvy, fonty), i18n, concept, contact.
- `i18n/routing.ts`: locales a pathnames per locale (`cs` vs. `en`).
- `app/globals.css`: primitives (`@theme`) a semantic (`:root`).
- `lib/tokens/`: component, concept, mode token soubory.
- `sanity/schemas/`: co je v Sanity (až ve fázi 3).
- `messages/cs.json` a `messages/en.json`: překlady pro next-intl.


## Skill orchestrace (kdy co)

| Situace | Skill |
|---|---|
| Nový blok / sekce / komponenta | `/frontend-design` |
| Český text (web copy, e-mail, mikrocopy) | `/textar` |
| UI quality pass před deployem | `/polish` + `/audit` |
| Responsive / breakpoints | `/adapt` |
| Wireframe diagram architektury | `/excalidraw-diagram` |
| Bitmapový vizuál (logo, hero image) | `/nano-banana` |
| Krátké video (animace loga, hero motion) | `/veo` |
| Kontrola brand identity | `/anfilov-visual-guidelines` |
| Long-form článek (blog) | `/redaktor` |


## Workflow při novém klientovi

Stručný přehled, detaily jsou v `/onboard-web` skillu.

1. **`/onboard-web {client-slug}`**: vytvoří složku v `clients/`, repo na `ANFILOV-Studio` GitHub org, Sanity projekt v org „ANFILOV", Vercel projekt pod studio teamem, DNS skeleton, `.env.local` ze vzoru.
2. **Brand init**: Simon vyplní `site.config.ts` (brand colors, fonty, doména). `phase` zůstává `wireframe`.
3. **Build wireframe**: Claude staví hardcoded `content/*.ts`, žádné brand barvy, šedá paleta z primitives. Fokus na strukturu, hierarchii, copy.
4. **Schvalovací loop**: Simon ukáže klientovi statickou Vercel preview URL. Připomínky se zapracují v `content/`.
5. **`phase: "designed"`**: Simon přepne, Claude aplikuje brand colors přes semantic tokens (`/apply-brand`).
6. **`/elevate-to-sanity`**: po schválení obsahu Claude vygeneruje Sanity schéma podle skutečné struktury, migruje data, klient dostane Administrator přístup přes Google login (Free plán; Editor role až od Growth $15/seat/měsíc).
7. **`/launch-web`**: produkční deploy, doména `{{CLIENT_DOMAIN}}` (DNS-only mode na Cloudflare), monitoring, handoff dokumentace.


## Sanity Studio: tiché pasti při nasazení (povinně)

Sanity Studio je embeddované v Next.js přes `app/studio/[[...index]]/page.tsx`. Tři tiché pasti, které build neodhalí:

### 1. Workspace name vs basePath kolize

`sanity.config.ts` **musí** mít:
```ts
defineConfig({
  name: "default",          // NIKDY "studio" pokud basePath je /studio
  basePath: "/studio",      // VŽDY explicit pro embedded Studio v Next.js
  // ...
});
```

Když je `name === "studio"` a `basePath === "/studio"`, Studio router interpretuje URL segment `/studio` jako workspace name (ne jako Next.js prefix), nenajde tool a zobrazí **„⚠️ Tool not found: studio"**. Header se Structure / Vision / Releases se načte, main content je prázdný.

### 2. Registrace Studia po deployi

Od přelomu 2025/2026 vyžaduje Sanity, aby každé Studio na vlastní doméně bylo registrováno (klik na „Register this studio" při první návštěvě). Bez registrace fetch dat selže permission errorem. **Při `/launch-web` Claude otevře `https://{{CLIENT_DOMAIN}}/studio` a provede registraci.**

### 3. CORS origin pro produkční doménu

Bez whitelistnutého origin Studio dostane „Cross-Origin Request Blocked". **Při `/launch-web` Claude přidá** přes `mcp__plugin_sanity_Sanity__add_cors_origin`:
- `https://{{CLIENT_DOMAIN}}` (apex)
- `https://www.{{CLIENT_DOMAIN}}` (www, pokud používáte)

**Audit checklist před deployem:**
- `app/studio/...` exists? → `sanity.config.ts` musí mít `basePath: "/studio"` a `name !== "studio"`.
- Po deployi: otevři `/studio` → ověř, že není „Tool not found".
- Při `/launch-web`: registrace Studia + CORS origin pro novou doménu.


## Reference, externí dashboards

- Sanity Manage: https://www.sanity.io/manage/project/{{SANITY_PROJECT_ID}}
- Vercel Project: https://vercel.com/anfilov-studio/{{VERCEL_PROJECT_NAME}}
- GitHub Repo: https://github.com/ANFILOV-Studio/{{GITHUB_REPO_NAME}}
- Resend Domain: https://resend.com/domains
