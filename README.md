# Krhanický Proud, web

Repo obsahuje zdrojový kód webu krhanicky-proud.cz. Web postavilo studio ANFILOV na stacku Next.js, Sanity CMS a Vercel hosting. Obsah webu spravujete v Sanity Studiu na adrese `/studio`, kód a deploy zajišťuje studio. Tento dokument je určený vám jako majiteli projektu, případně vašemu budoucímu vývojáři, pokud se rozhodnete projekt převzít.

## Co tady je

- `app/`: stránky a layouty (Next.js App Router)
- `components/`: UI bloky a primitiva
- `sanity/`: schémata pro CMS
- `messages/`: překlady (cs, en)
- `i18n/`: konfigurace jazyků a URL paths
- `lib/`: utility (Sanity client, tokeny, helpers)
- `site.config.ts`: centrální konfigurace (brand, jazyky, koncept)

## Editace obsahu

Texty, obrázky a sekce webu spravujete sami v Sanity Studiu, technické úpravy zajišťuje studio.

- Studio běží na adrese `https://krhanicky-proud.cz/studio`
- Přihlášení funguje přes Google účet, který jste poskytl studiu při onboardingu
- Sami editujete: texty stránek, obrázky, jednotlivé sekce, právní stránky (GDPR, cookies, přístupnost), kontaktní údaje
- Studio řeší: úpravy designu, nové typy bloků a sekcí, technické změny, integrace, deploy
- Změny uložené v Sanity se na webu projeví během několika sekund, není potřeba nic publikovat ručně

Pokud si nejste jistý, zda úprava patří do vaší kompetence, nebo má jít přes studio, napište nám.

## Lokální vývoj

Tato sekce je určená vývojářům. Pro spuštění projektu lokálně potřebujete Node.js 20 a vyšší.

```bash
# 1. Klon repa
git clone https://github.com/ANFILOV-Studio/client-krhanicky-proud-web.git
cd client-krhanicky-proud-web

# 2. Instalace závislostí
npm install

# 3. Příprava env proměnných
cp .env.local.example .env.local
# vyplňte hodnoty (Sanity project ID, dataset, write token, případně Resend API key)

# 4. Dev server
npm run dev
# otevřete http://localhost:3000
```

Dev server používá Webpack mode (`next dev --webpack`), produkční build běží na Turbopacku (default v Next.js 16). Toto rozdělení je záměrné kvůli kompatibilitě s pracovním prostředím studia, není to chyba a nedoporučujeme to měnit.

## Skripty

- `npm run dev`: lokální dev server (Webpack mode)
- `npm run build`: produkční build (Turbopack)
- `npm start`: spuštění produkčního buildu
- `npm run lint`: ESLint
- `npm run typecheck`: kontrola typů přes TypeScript
- `npm test`: unit testy (Vitest)
- `npm run test:e2e`: end-to-end a accessibility testy (Playwright + axe)

## Deploy

- Hosting běží na Ivanově **Vercel Hobby** projektu (org `vand-cloud`)
- Auto-deploy se spustí při každém pushi do větve `main`
- Pull requesty dostávají vlastní preview deploy s unikátní URL pro náhled
- Doména `krhanicky-proud.cz` se připojí přes Cloudflare DNS v režimu DNS-only (šedý mráček), proxy přes Cloudflare se zde nepoužívá kvůli kompatibilitě s Vercel SSL a edge sítí

## CMS

- Sanity verze 5, project ID `4nb8kl4e`, dataset `production` (org `vand-cloud`)
- Studio je mountnuté přímo do webu na cestě `/studio` (Embedded Studio)
- Klient je Administrator, studio Administrator collaborator
- Schémata dokumentů a objektů najdete v `sanity/schemas/`

Jakékoli změny ve schématu (nové typy obsahu, pole, validace) řeší studio. Vy jako Editor pracujete vždy proti aktuálnímu schématu.

## Jazyky

- Default jazyk: čeština (`cs`)
- Volitelně: angličtina (`en`), zapíná se v `site.config.ts` přidáním `"en"` do `i18n.locales`
- URL: čeština bez prefixu (např. `/o-nas`), angličtina s prefixem (např. `/en/about`)
- Překlady UI textů jsou v `messages/cs.json` a `messages/en.json`, překlady obsahu se editují přímo v Sanity

## Podpora

- Studio ANFILOV: `kontakt@anfilov.cz`
- Pokud projekt převezmete vlastním vývojářem, doporučujeme oficiální dokumentaci:
  - [Next.js](https://nextjs.org/docs)
  - [Sanity](https://www.sanity.io/docs)
  - [Tailwind CSS v4](https://tailwindcss.com/docs)

## Licence

- Kód: copyright Krhanický Proud, vyrobeno studiem ANFILOV
- Klient má neomezené právo užívání kódu po dobu placení hosting fee studiu
- Po ukončení vztahu studio převede repo i všechny související projekty (Vercel, Sanity, Resend, doménu) na klienta podle handover protokolu, který je součástí smlouvy
