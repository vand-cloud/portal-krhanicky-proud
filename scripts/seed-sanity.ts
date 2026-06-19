/* eslint-disable no-console */
// One-shot seed for the Krhanický Proud Sanity dataset (project 4nb8kl4e).
// Maps the wireframe content/*.ts into Sanity documents, uploads the demo
// images from public/, and creates one richly-formatted post + one úřední
// document with a download bar so the PortableText serializer can be
// verified end to end. Idempotent: uses createOrReplace with deterministic
// _ids, so re-running overwrites cleanly.
//
// Run: node_modules/.bin/tsx scripts/seed-sanity.ts
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

import { people } from "../content/people";
import { proudCategories, proudItems } from "../content/proud";
import { blogPosts, blogCategoryLabels } from "../content/blog";
import { obecCategories, obecItems } from "../content/urad";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── env ──────────────────────────────────────────────────────────────────────
const env = Object.fromEntries(
  readFileSync(resolve(ROOT, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

const client = createClient({
  projectId: "4nb8kl4e",
  dataset: "production",
  apiVersion: "2026-04-27",
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// ── portable text helpers ─────────────────────────────────────────────────────
let _k = 0;
const key = () => `k${_k++}`;
type Block = Record<string, unknown>;

function span(text: string, marks: string[] = []) {
  return { _type: "span", _key: key(), text, marks };
}
function para(text: string): Block {
  return { _type: "block", _key: key(), style: "normal", markDefs: [], children: [span(text)] };
}
function heading(style: "h2" | "h3" | "h4", text: string): Block {
  return { _type: "block", _key: key(), style, markDefs: [], children: [span(text)] };
}
function bullets(items: string[]): Block[] {
  return items.map((t) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [span(t)],
  }));
}
function numbers(items: string[]): Block[] {
  return items.map((t) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "number",
    level: 1,
    markDefs: [],
    children: [span(t)],
  }));
}
function imageBlock(assetId: string, alt: string, caption: string): Block {
  return {
    _type: "image",
    _key: key(),
    asset: { _type: "reference", _ref: assetId },
    alt,
    caption,
  };
}
function tableBlock(rows: string[][]): Block {
  return {
    _type: "table",
    _key: key(),
    rows: rows.map((cells) => ({ _type: "tableRow", _key: key(), cells })),
  };
}
function youtubeBlock(url: string): Block {
  return { _type: "youtube", _key: key(), url };
}
function fileDownloadBlock(assetId: string, name: string, fileType?: string): Block {
  return {
    _type: "fileDownload",
    _key: key(),
    file: { _type: "file", asset: { _type: "reference", _ref: assetId } },
    name,
    ...(fileType ? { fileType } : {}),
  };
}

// ── asset upload (cached by source path) ──────────────────────────────────────
const imageCache = new Map<string, string>();
async function uploadImage(publicPath: string): Promise<string | undefined> {
  if (!publicPath) return undefined;
  if (imageCache.has(publicPath)) return imageCache.get(publicPath);
  const abs = resolve(ROOT, "public", publicPath.replace(/^\//, ""));
  if (!existsSync(abs)) {
    console.warn("  ! missing image", publicPath);
    return undefined;
  }
  const asset = await client.assets.upload("image", readFileSync(abs), {
    filename: publicPath.split("/").pop(),
  });
  imageCache.set(publicPath, asset._id);
  return asset._id;
}

// orderRank: zero-padded so initial lexicographic sort == intended order.
const rank = (i: number) => String(i).padStart(6, "0");

const tx = () => client.transaction();

async function main() {
  console.log("Seeding Sanity dataset production (4nb8kl4e)…");

  // 1) Upload all referenced images up front.
  console.log("· uploading images");
  const imagePaths = new Set<string>();
  for (const p of people) if (p.photo) imagePaths.add(p.photo);
  for (const b of blogPosts) if (b.heroImage) imagePaths.add(b.heroImage);
  for (const i of proudItems) if (i.heroImage) imagePaths.add(i.heroImage);
  for (const path of imagePaths) await uploadImage(path);

  // small placeholder PDF for the download-bar verification
  const pdfPath = resolve(ROOT, "scripts", ".rozpocet-2026.pdf");
  writeFileSync(
    pdfPath,
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
      "2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\n" +
      "trailer<</Root 1 0 R>>\n%%EOF\n" +
      "Rozpocet obce Krhanice 2026 - ukazkovy dokument.\n",
  );
  const pdfAsset = await client.assets.upload("file", readFileSync(pdfPath), {
    filename: "rozpocet-obce-2026.pdf",
  });

  // 2) People
  console.log("· people");
  const candidateOrderIds = people
    .filter((p) => p.affiliations.includes("kandidat-2026"))
    .map((p) => p.id);
  const councilOrderIds = people
    .filter((p) => p.affiliations.includes("zastupitel"))
    .map((p) => p.id);

  let t = tx();
  for (const p of people) {
    const photoId = p.photo ? imageCache.get(p.photo) : undefined;
    const contact: Record<string, string> = {};
    if (p.contactEmail) contact.email = p.contactEmail;
    if (p.contactPhone) contact.phone = p.contactPhone;
    if (p.social?.facebook) contact.facebook = p.social.facebook;
    if (p.social?.instagram) contact.instagram = p.social.instagram;

    t = t.createOrReplace({
      _id: p.id,
      _type: "person",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      ...(p.role ? { role: p.role } : {}),
      ...(p.bio ? { bio: p.bio } : {}),
      affiliations: p.affiliations,
      visibility: p.visibility,
      ...(photoId ? { photo: { _type: "image", asset: { _type: "reference", _ref: photoId } } } : {}),
      ...(Object.keys(contact).length ? { contact: { _type: "personContact", ...contact } } : {}),
      ...(p.affiliations.includes("kandidat-2026")
        ? { candidateOrder: candidateOrderIds.indexOf(p.id) + 1 }
        : {}),
      ...(p.affiliations.includes("zastupitel")
        ? { councilOrder: councilOrderIds.indexOf(p.id) + 1 }
        : {}),
    });
  }
  await t.commit();

  // 3) Categories
  console.log("· categories");
  t = tx();
  proudCategories
    .filter((c) => c.slug !== "kandidati")
    .forEach((c, i) =>
      t.createOrReplace({
        _id: `proudCategory-${c.slug}`,
        _type: "proudCategory",
        name: c.label,
        slug: { _type: "slug", current: c.slug },
        ...(c.description ? { subtitle: c.description } : {}),
        orderRank: rank(i),
      }),
    );
  Object.entries(blogCategoryLabels).forEach(([slug, label], i) =>
    t.createOrReplace({
      _id: `blogCategory-${slug}`,
      _type: "blogCategory",
      title: label,
      slug: { _type: "slug", current: slug },
      orderRank: rank(i),
    }),
  );
  obecCategories.forEach((c, i) =>
    t.createOrReplace({
      _id: `uradCategory-${c.slug}`,
      _type: "uradCategory",
      title: c.label,
      slug: { _type: "slug", current: c.slug },
      ...(c.description ? { description: c.description } : {}),
      ...(c.subcategories
        ? {
            subcategories: c.subcategories.map((s) => ({
              _type: "object",
              _key: key(),
              title: s.label,
              slug: { _type: "slug", current: s.slug },
              ...(s.description ? { description: s.description } : {}),
            })),
          }
        : {}),
      orderRank: rank(i),
    }),
  );
  await t.commit();

  // 4) Programme posts (manifesto + policy; candidates are persons)
  console.log("· proud posts");
  const manifestoBody: Block[] = [
    para(
      "Krhanický Proud je sdružení nezávislých občanů. Tento program shrnuje, co konkrétně chceme v obci prosadit v období 2026 až 2030.",
    ),
    heading("h2", "Sedm priorit pro Krhanice"),
    para(
      "Vycházíme z toho, co od sousedů slýcháme nejčastěji: srozumitelná radnice, bezpečné cesty, péče o zeleň a živá komunita.",
    ),
    ...bullets([
      "Otevřená radnice: zápisy, smlouvy a rozpočet veřejně a srozumitelně.",
      "Bezpečné chodníky podél hlavní silnice.",
      "Péče o zeleň a hospodaření s vodou.",
      "Podpora škol, školky a spolků.",
    ]),
    heading("h3", "Jak to chceme udělat"),
    ...numbers([
      "Do roka zveřejníme všechny smlouvy obce.",
      "Připravíme dvouletý plán chodníků.",
      "Spustíme online přehled rozpočtu.",
    ]),
    imageBlock(
      imageCache.get("/blog/co-se-chysta-na-jaro-2026.webp")!,
      "Náves v Krhanicích",
      "Náves v Krhanicích, kde chceme přidat stromy a lavičky.",
    ),
    heading("h3", "Rozpočtový rámec"),
    para("Orientační rozdělení priorit pro první rok volebního období:"),
    tableBlock([
      ["Oblast", "Rámcová částka"],
      ["Chodníky a doprava", "1,2 mil. Kč"],
      ["Zeleň a voda", "0,8 mil. Kč"],
      ["Školy a spolky", "0,6 mil. Kč"],
    ]),
    heading("h4", "Mluvili jsme o tom i s vámi"),
    para("Záznam z veřejného setkání k programu:"),
    youtubeBlock("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
  ];

  t = tx();
  proudItems
    .filter((i) => i.category !== "kandidati")
    .forEach((i, idx) => {
      const coverId = i.heroImage ? imageCache.get(i.heroImage) : undefined;
      t.createOrReplace({
        _id: `proudPost-${i.slug}`,
        _type: "proudPost",
        title: i.title,
        slug: { _type: "slug", current: i.slug },
        ...(i.description ? { description: i.description } : {}),
        category: { _type: "reference", _ref: `proudCategory-${i.category}` },
        ...(i.personId ? { author: { _type: "reference", _ref: i.personId } } : {}),
        ...(coverId ? { coverImage: { _type: "image", asset: { _type: "reference", _ref: coverId } } } : {}),
        body: i.id === "proud-program-manifesto" ? manifestoBody : [para(i.description ?? "")],
        orderRank: rank(idx),
      });
    });
  await t.commit();

  // 5) Blog posts
  console.log("· blog posts");
  t = tx();
  blogPosts.forEach((b) => {
    const coverId = b.heroImage ? imageCache.get(b.heroImage) : undefined;
    t.createOrReplace({
      _id: `blogPost-${b.slug}`,
      _type: "blogPost",
      title: b.title,
      slug: { _type: "slug", current: b.slug },
      excerpt: b.excerpt,
      publishedAt: b.publishedAt,
      categories: b.categories.map((c) => ({
        _type: "reference",
        _key: key(),
        _ref: `blogCategory-${c}`,
      })),
      ...(b.tags?.length ? { tags: b.tags } : {}),
      ...(coverId ? { coverImage: { _type: "image", asset: { _type: "reference", _ref: coverId } } } : {}),
      body: [para(b.excerpt), para("Plný text článku doplní redakce v Sanity Studiu.")],
    });
  });
  await t.commit();

  // related posts (second pass, ids now exist)
  t = tx();
  blogPosts.forEach((b) => {
    if (!b.relatedPosts?.length) return;
    const related = b.relatedPosts
      .map((id) => blogPosts.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, 3)
      .map((p) => ({
        _type: "reference",
        _key: key(),
        _ref: `blogPost-${(p as (typeof blogPosts)[number]).slug}`,
      }));
    t.patch(`blogPost-${b.slug}`, (patch) => patch.set({ relatedPosts: related }));
  });
  await t.commit();

  // 6) Úřední posts (non-person obec items) + one document with a download bar
  console.log("· urad posts");
  t = tx();
  obecItems
    .filter((i) => !i.personId)
    .forEach((i) => {
      const isBudget = i.slug === "rozpocet-obce-2026";
      const body: Block[] = isBudget
        ? [
            para(i.description ?? ""),
            para("Plné znění dokumentu je k dispozici ke stažení níže."),
            fileDownloadBlock(pdfAsset._id, "Rozpočet obce na rok 2026", "PDF"),
          ]
        : [para(i.description ?? "")];
      t.createOrReplace({
        _id: `uradPost-${i.slug}`,
        _type: "uradPost",
        title: i.title,
        slug: { _type: "slug", current: i.slug },
        ...(i.description ? { summary: i.description } : {}),
        date: i.date ?? "2026-01-01",
        category: { _type: "reference", _ref: `uradCategory-${i.category}` },
        ...(i.subcategory ? { subcategory: i.subcategory } : {}),
        body,
      });
    });
  await t.commit();

  // 7) Legal pages
  console.log("· legal pages");
  await seedLegal();

  // 8) Singletons
  console.log("· singletons");
  await seedSingletons();

  console.log("Done.");
}

async function seedLegal() {
  const t = tx();
  t.createOrReplace({
    _id: "legalPage-gdpr",
    _type: "legalPage",
    title: "Zásady ochrany osobních údajů",
    slug: { _type: "slug", current: "gdpr" },
    lastUpdated: "2026-06-19",
    body: [
      para(
        "Správce osobních údajů tímto informuje subjekty údajů o způsobu a rozsahu zpracování osobních údajů v souladu s nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a se zákonem č. 110/2019 Sb., o zpracování osobních údajů.",
      ),
      heading("h2", "Rozsah zpracovávaných osobních údajů"),
      para("Správce zpracovává zejména tyto osobní údaje:"),
      ...bullets([
        "jméno a příjmení,",
        "e-mailovou adresu,",
        "telefonní číslo (pokud jej dobrovolně uvedete),",
        "obsah zprávy odeslané přes formulář (tip na akci, námět na článek, zpětná vazba).",
      ]),
      heading("h2", "Právní důvody a účely zpracování"),
      para(
        "Osobní údaje jsou zpracovávány na základě plnění smlouvy, oprávněného zájmu správce, plnění právních povinností a v některých případech na základě uděleného souhlasu.",
      ),
      heading("h2", "Doba uchování osobních údajů"),
      para(
        "Osobní údaje uchováváme po dobu nezbytnou k vyřízení podnětu a následné komunikace, u údajů zpracovávaných na základě souhlasu nejdéle po dobu tří let.",
      ),
      heading("h2", "Práva subjektu údajů"),
      ...bullets([
        "na přístup k osobním údajům,",
        "na opravu nebo doplnění,",
        "na výmaz,",
        "na omezení zpracování,",
        "na přenositelnost údajů,",
        "podat stížnost u Úřadu pro ochranu osobních údajů.",
      ]),
    ],
  });
  t.createOrReplace({
    _id: "legalPage-cookies",
    _type: "legalPage",
    title: "Zásady používání cookies",
    slug: { _type: "slug", current: "cookies" },
    lastUpdated: "2026-06-19",
    body: [
      para(
        "Tento web používá soubory cookies, aby fungoval správně a abychom rozuměli tomu, jak se používá. Níže vysvětlujeme, jaké cookies nasazujeme a jak je můžete spravovat.",
      ),
      heading("h2", "Jaké cookies používáme"),
      ...bullets([
        "Nezbytné cookies: zajišťují základní fungování webu, nelze je vypnout.",
        "Analytické cookies: pomáhají nám měřit návštěvnost a zlepšovat obsah, nasazují se jen s vaším souhlasem.",
      ]),
      heading("h2", "Správa souhlasu"),
      para(
        "Souhlas s nasazením nepovinných cookies můžete kdykoli změnit přes odkaz „Nastavení cookies“ v patičce webu.",
      ),
    ],
  });
  t.createOrReplace({
    _id: "legalPage-pristupnost",
    _type: "legalPage",
    title: "Prohlášení o přístupnosti",
    slug: { _type: "slug", current: "pristupnost" },
    lastUpdated: "2026-06-19",
    body: [
      para(
        "Provozovatel tohoto webu usiluje o to, aby byl obsah přístupný co nejširšímu okruhu uživatelů, a to v souladu se zásadami WCAG 2.1 na úrovni AA.",
      ),
      heading("h2", "Stav souladu"),
      para(
        "Web je z velké části v souladu s uvedenými zásadami. Pokud narazíte na obsah, který je pro vás nedostupný, dejte nám prosím vědět.",
      ),
      heading("h2", "Zpětná vazba"),
      para(
        "Nedostatky v přístupnosti nám můžete nahlásit na kontaktní e-mail uvedený níže. Vaše podněty pomáhají web zlepšovat.",
      ),
    ],
  });
  await t.commit();
}

async function seedSingletons() {
  const t = tx();

  t.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    footerDisclosure: [
      {
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs: [{ _key: "lprog", _type: "link", href: "/proud/nas-program" }],
        children: [
          span("Krhanický Proud je nezávislé sdružení občanů. Náš "),
          span("program", ["lprog"]),
          span(" najdete v samostatné sekci."),
        ],
      },
    ],
    contactName: "Ivan Dvořák",
    contactEmail: "ahoj@krhanickyproud.cz",
    contactPhone: "+420 714 177",
    addressStreet: "Krhanice 46",
    addressCity: "257 42 Krhanice",
    social: {
      _type: "object",
      facebook: "https://www.facebook.com/krhanickyproud",
      instagram: "https://www.instagram.com/krhanickyproud",
    },
    seo: {
      _type: "object",
      defaultDescription:
        "Krhanický Proud, místní portál pro občany Krhanic. Akce, místa, služby a aktuality v okolí.",
    },
    alertBar: {
      _type: "object",
      enabled: true,
      tone: "warning",
      icon: "triangle-alert",
      text: [
        {
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [{ _key: "lout", _type: "link", href: "/urad/vypadek-proudu" }],
          children: [
            span("Pozor, ve čtvrtek od 12 do 16 hodin nepůjde proud v ulicích Pod Vrškem a Na Návsi. "),
            span("Více informací", ["lout"]),
            span("."),
          ],
        },
      ],
    },
  });

  t.createOrReplace({
    _id: "programPage",
    _type: "programPage",
    eyebrow: "Krhanický Proud",
    title: "Náš program",
    subtitle:
      "Co konkrétně chceme v Krhanicích řešit. Témata řadíme tematicky, za každým návrhem stojí někdo z týmu nebo kandidátky.",
  });

  t.createOrReplace({
    _id: "proudPage",
    _type: "proudPage",
    eyebrow: "Sdružení nezávislých občanů",
    title: "Krhanický Proud",
    subtitle:
      "Jsme občané, kteří v Krhanicích žijí. Provozujeme tento portál celoročně jako informační rozcestník pro sousedy a návštěvníky obce. V období komunálních voleb vám představujeme i naši kandidátku.",
    pillarsTitle: "Hodnoty, které sdílíme",
    pillars: [
      { _type: "object", _key: key(), title: "Otevřená radnice", text: "Zveřejňujeme zápisy ze zasedání, smlouvy, rozpočet. Kdokoliv má přístup k tomu, kde končí veřejné peníze." },
      { _type: "object", _key: key(), title: "Spravedlivý rozvoj", text: "Stavební rozvoj nesmí jít na úkor zeleně, klidu a charakteru obce. Měníme to, co opravdu chybí, ne co se hodí." },
      { _type: "object", _key: key(), title: "Aktivní život", text: "Podporujeme spolky, kulturu a sport. Krhanice nejsou ulice domů, ale komunita lidí." },
      { _type: "object", _key: key(), title: "Vstřícná obec", text: "Obec slouží občanům, ne naopak. Komunikace musí být srozumitelná, úřad dosažitelný, rozhodnutí dohledatelná." },
    ],
    highlightsEyebrow: "Z našeho programu",
    highlightsTitle: "Střípky z našeho programu",
    highlights: [
      { _type: "object", _key: key(), title: "Bezpečné chodníky", text: "Dvouletý plán, jak doplnit chodníky tam, kde dnes lidé chodí po krajnici." },
      { _type: "object", _key: key(), title: "Třídění bioodpadu", text: "Hnědé popelnice na bioodpad zdarma pro všechny domy." },
      { _type: "object", _key: key(), title: "Nové dětské hřiště", text: "Moderní a bezpečná herní sestava u Sokolovny, přístupná i dětem s omezením." },
      { _type: "object", _key: key(), title: "Otevřené smlouvy", text: "Zveřejníme všechny smlouvy obce do 14 dnů od podpisu, bez ohledu na částku." },
    ],
  });

  t.createOrReplace({
    _id: "blogPage",
    _type: "blogPage",
    eyebrow: "Krhanický blog",
    title: "Obecní příspěvky",
    intro:
      "Delší texty: rozhovory s místními, vysvětlení k radničním rozhodnutím a tipy na výlety po Posázaví.",
  });

  t.createOrReplace({
    _id: "uradPage",
    _type: "uradPage",
    eyebrow: "Vše z úřadu",
    title: "Obecní úřad Krhanice",
    subtitle:
      "Úřední deska, zastupitelstvo, dokumenty a aktuality. Co potřebujete vědět z radnice na jednom místě.",
  });

  t.createOrReplace({
    _id: "zapojteSePage",
    _type: "zapojteSePage",
    eyebrow: "Kontakt",
    title: "Zapojte se",
    subtitle:
      "Tento portál stojí na sousedské spolupráci. Akce, místa a tipy přicházejí často přímo od vás.",
    cards: [
      { _type: "object", _key: key(), icon: "calendar-clock", title: "Nahlaste akci", text: "Pořádáte koncert, sokolský turnaj, sousedské setkání? Pošlete nám detail, doplníme to do kalendáře." },
      { _type: "object", _key: key(), icon: "info", title: "Doplňte místo nebo službu", text: "Chybí na portálu hospoda, řemeslník nebo zajímavost v okolí? Dejte nám tip, prověříme a přidáme." },
      { _type: "object", _key: key(), icon: "megaphone", title: "Pošlete poznámku k obsahu", text: "Něco se vám nezdá, něco chybí, něco je špatně. Krátká zpráva pomáhá portál zlepšit." },
      { _type: "object", _key: key(), icon: "vote", title: "Kandidujte s námi", text: "Záleží vám na tom, jak Krhanice fungují? Ozvěte se, rádi se s vámi sejdeme a probereme, co byste mohli přinést na kandidátku Krhanického Proudu." },
    ],
    contactBlock: {
      _type: "object",
      title: "Pište nám",
      text: "Zatím nás zastihnete e-mailem, ozveme se vám zpravidla do dvou pracovních dnů.",
      buttonLabel: "Napište nám e-mail",
    },
  });

  await t.commit();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
