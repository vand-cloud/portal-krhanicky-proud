# Setup pro Ivana, krhanicky-proud.cz

Ahoj Ivane, máte tu krátký checklist na dvě věci, které potřebujeme dořešit, abych vám mohl předat funkční web:

1. **Sanity token** kvůli automatickému zápisu obsahu z buildu Vercel.
2. **Vercel projekt**, abyste měl hosting plně pod sebou.

Setup vám zabere kolem 10 minut. Pokud by cokoliv vyhodilo error, který vám nedává smysl, napište mi a vyřešíme to spolu.

---

## A) Sanity token (5 minut)

1. Otevřete [sanity.io/manage/project/4nb8kl4e](https://www.sanity.io/manage/project/4nb8kl4e) a přihlaste se svým účtem.
2. V horní liště přejděte na záložku **API**.
3. V sekci **Tokens** klikněte na **Add API token**.
4. Vyplňte:
   - **Name**: `vercel-deploy` (jen popisek, ať víte, k čemu token slouží)
   - **Permissions**: **Editor**
5. Klikněte **Save** a hned poté **zkopírujte token** (zobrazí se jen jednou, pokud ho zavřete bez kopírování, musíte ho vygenerovat znovu).
6. Pošlete mi token přes Signal nebo Telegram. Nikdy ne přes obyčejný e-mail nebo SMS.

---

## B) Vercel projekt (10 minut)

### B1. Import repa

1. Otevřete [vercel.com](https://vercel.com) a přihlaste se (pokud ještě nemáte účet, vytvořte ho přes GitHub login s vaším `vand-cloud` účtem nebo přes osobní GitHub).
2. Klikněte **Add New** → **Project**.
3. V seznamu repozitářů vyberte **`vand-cloud/portal-krhanicky-proud`**. Pokud tam není, klikněte **Adjust GitHub App Permissions** a přidejte org `vand-cloud` do GitHub App.
4. Na stránce **Configure Project** ponechte:
   - **Framework Preset**: Next.js (Vercel to automaticky detekuje)
   - **Root Directory**: `.` (kořen)
   - **Build & Output Settings**: defaults
5. **Ještě nedeployujte!** Nejdřív přidejte env vars, jinak build spadne.

### B2. Environment Variables

Rozklikněte sekci **Environment Variables** a vyplňte tyto **2 položky**:

| Name | Value |
|---|---|
| `SANITY_WRITE_TOKEN` | (token z kroku A) |
| `NEXT_PUBLIC_SITE_URL` | `https://krhanicky-proud.cz` |

U obou ponechte výchozí scope **Production / Preview / Development** (zaškrtnuté všechny tři).

Project ID, dataset a API version jsou hardcoded přímo v kódu (viz `sanity/env.ts`), takže je do Vercelu nepíšete. Resend doplníme až při zapnutí formulářů.

### B3. Deploy

1. Klikněte **Deploy**.
2. Build poběží 1–2 minuty. Sledujte log, jestli neproletí žádný error.
3. Po úspěšném deployi dostanete preview URL ve tvaru `portal-krhanicky-proud-xxxxx.vercel.app`. **Pošlete mi ji.** Od této chvíle můžu pushovat změny a automaticky se vám tam nasazovat.

### B4. Pozvánka pro Simona (volitelné, ale praktické)

Pokud chcete, abych měl přístup do Vercel dashboardu (kvůli sledování build logů, runtime errorů, env vars), pozvěte mě jako collaborator:

1. Otevřete projekt na Vercelu → **Settings** → **Members** (nebo **Collaborators**).
2. Klikněte **Invite Member**, zadejte můj e-mail `simon@anfilov.cz`, role **Member** stačí.
3. Já pak na pozvánce kliknu „Accept" a uvidím dashboard.

Bez tohoto přístupu pořád můžu push-ovat kód a Vercel ho deployne, ale neuvidím log, když se něco rozbije.

---

## Co bude následovat

Až mi pošlete preview URL, dál bude:

1. **Push na produkci pokračuje normálně.** Já píšu kód, commit-uju, push-uju na `main` a Vercel automaticky deployne. Vy uvidíte preview URL u každé verze.
2. **Brand fáze (designed)**: jakmile odsouhlasíme strukturu, web dostane brand barvy a fonty.
3. **Migrace obsahu do Sanity**: po schválení wireframe přejdou texty a fotky z hardcoded souborů do Sanity, kde si je budete moct sám editovat přes vizuální editor.
4. **Produkční doména**: až bude vše hotové, nastavíme `krhanicky-proud.cz` na váš Vercel projekt a web pojede na produkční URL.

Pokud máte cokoliv nejasného, napište. Děkuju.

Simon
