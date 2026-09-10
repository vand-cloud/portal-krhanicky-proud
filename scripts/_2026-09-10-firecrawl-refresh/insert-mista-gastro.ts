/* eslint-disable no-console */
// One-off write: inserts new "mista" and "gastro" catalogEntry documents
// found by the Firecrawl research agent (2026-09-10) into Sanity, after
// resolving each entry's category reference and re-checking for duplicates
// against the current catalog. Descriptions were rewritten from raw
// research facts through the /textar Czech copywriting filter (no em dash,
// spisovná čeština, no invented facts beyond what the research agent
// found).
//
// Idempotent: every document uses a deterministic _id
// (catalogEntry-fc20260910-<slug>) and is written with createOrReplace, so
// re-running this script is safe.
//
// Run: node_modules/.bin/tsx scripts/_2026-09-10-firecrawl-refresh/insert-mista-gastro.ts
import { readFileSync, writeFileSync, createReadStream, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const SCRATCHPAD =
  "/private/tmp/claude-501/-Users-simon-Projekty-0-CLAUDE-CODE/1617a7fd-72e6-4160-b9ee-65823f7eb73c/scratchpad/krhanicky-proud-refresh";

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

type ResearchItem = {
  title: string;
  entryType: string;
  categorySlug: string;
  subcategorySlug: string | null;
  descriptionFacts: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  website: string | null;
  sourceUrl: string | null;
  sourceLabel: string | null;
  social: { facebook: string | null; instagram: string | null } | null;
  hours: string | null;
  price: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  imageSourceUrl: string | null;
  imageLocalPath: string | null;
  confidenceNote: string | null;
};

type CategoryRecord = {
  _id: string;
  name: string;
  slug: string;
  type: string;
  subcategories: { slug: string; title: string }[];
};

type ExistingEntry = {
  _id: string;
  title: string;
  entryType: string;
  address: string | null;
  sourceUrl: string | null;
  status: string;
  trustLevel: string;
};

// Descriptions rewritten from research `descriptionFacts` through /textar
// (spisovná čeština, no em dash, no invented facts). Keyed by exact
// research `title` string. Where the research agent's confidenceNote
// flagged a fact as unconfirmed (e.g. estimated cuisine type), that fact
// was left out rather than stated as certain.
const DESCRIPTIONS: Record<string, string> = {
  "Víceúčelové hřiště Krhanice":
    "Víceúčelové hřiště v Krhanicích nabízí plochu pro volejbal a badminton (22×13 m) i samostatné hřiště pro míčové sporty (33×15 m), stolní tenis a pétanque. Otevřeno bylo 29. září 2012 za účasti houslisty Pavla Šporcla, stavbu spolufinancoval Evropský zemědělský fond pro rozvoj venkova. Součástí areálu je klubovna pro čtyřicet osob, kterou si mohou pronajmout spolky i občané Krhanice, vybavená stoly, ping-pongovým stolem a deskovými hrami.",
  "Dětské hřiště u víceúčelového hřiště":
    "Dětské hřiště vedle víceúčelového hřiště v Krhanicích vzniklo v roce 2015 z dotace Ministerstva pro místní rozvoj ČR v rámci programu Podpora obnovy a rozvoje venkova. Je to první dětské hřiště v obci, vybavené prolézačkou se stěnou, vahadlovou i pružinovou houpačkou, skluzavkou, lanovou pyramidou a dvojitou závěsnou houpačkou. K dispozici je také pískoviště, kreslicí tabule, lavičky a odpadkový koš.",
  "Muzeum umění a designu Benešov (MUD*)":
    "Muzeum umění a designu Benešov je jediné muzeum svého druhu ve Středočeském kraji, zaměřené na design. Vzniklo v roce 1990 jako Galerie výtvarného umění, od roku 2015 funguje jako příspěvková organizace města Benešov a spravuje sbírku 13 938 předmětů, malby, grafiky, fotografie, plastiky i design od roku 1900 s těžištěm po roce 1945. Sídlí v rekonstruované secesní budově bývalé Okresní hospodářské záložny na Malém náměstí, kde pořádá výstavy, workshopy, přednášky a degustace. V přízemí je kavárna a čítárna s asi třemi tisíci svazky odborné literatury.",
  "Raisova vyhlídka (Posázavská stezka)":
    "Raisova vyhlídka na Posázavské stezce nese jméno spisovatele Karla Václava Raise, který místo pravidelně navštěvoval. Leží v katastru Pikovic, přibližně kilometr severovýchodně od Třebsína, ve výšce 270 metrů nad mořem. U vyhlídky stojí turistický přístřešek s lavičkami a pod ní se rozkládá trampská osada Údolí Ticha a Třebsínský vodopád.",
  "Tábořiště Týnec (Kemp Týnec)":
    "Tábořiště Týnec leží u řeky Sázavy v areálu Kempu Týnec, hned vedle Hospůdky v Náklí. K dispozici je velká i malá trampolína (80 Kč), dětské hřiště s pískovištěm, ohniště s možností zapůjčení grilu, lehátka a půjčovna společenských her jako pétanque, Kubb nebo ruské kuželky. Občerstvení zajišťuje bistrobus s vodáckou klasikou, grilovaným camembertem a točeným pivem Ferdinand. Kempovné činí 99 Kč na osobu a noc pro dospělé.",
  "Zámecká Pizzerie Lešany":
    "Zámecká Pizzerie Lešany se nachází v Lešanech, místní části Krhanice, přibližně tři kilometry od centra obce. Sídlí ve stejné lokalitě jako Vojenské muzeum Lešany.",
  "Pizzerie Gianni":
    "Pizzerie Gianni sídlí v centru Týnce nad Sázavou, na ulici Pěší. Nabízí pizzu, saláty, masitá jídla i těstoviny.",
  "Restaurace U Vrtišků":
    "Restaurace U Vrtišků v Týnci nad Sázavou nabízí teplá jídla a pořádá soukromé i firemní akce. K dispozici je nekuřácký salónek s kulečníkem a letní terasa.",
  "Café Bar Obývák":
    "Café Bar Obývák v Týnci nad Sázavou funguje jako rodinná kavárna přes den a jako sofistikovaný koktejlový bar večer. Nabízí vlastní praženou kávu, biodynamická vína, prémiové lihoviny, doutníky i tapas.",
  "Café NÁVES (Týnec nad Sázavou)":
    "Café NÁVES sídlí v centru Týnce nad Sázavou, na adrese Týnec nad Sázavou 600. Otevírací doba trvá zhruba do 17 hodin.",
  "Šabatovo zmrzlinářství":
    "Šabatovo zmrzlinářství sídlí na Družstevní ulici v Týnci nad Sázavou. Podnik funguje jako cukrárna a zmrzlinářství.",
  "Cukrárna Sladké Pokušení":
    "Cukrárna Sladké Pokušení sídlí na ulici Pěší v centru Týnce nad Sázavou.",
  "Cukrárna Týnec":
    "Cukrárna Týnec na Farské ulici nabízí cukroví, dezerty, lízátka, cupcakes i makronky. Peče také dorty a na objednávku připravuje sladký bar pro oslavy.",
  "Roj Kebab House":
    "Roj Kebab House v centru Týnce nad Sázavou nabízí kebab v tortile, chlebu nebo boxu, a to i ve vegetariánské verzi. K dispozici jsou také hranolky, smažený sýr a kuřecí nugety.",
  "Hospůdka v Náklí (Hospůdka Týnec)":
    "Hospůdka v Náklí stojí u řeky Sázavy jako součást areálu Kempu Týnec. Nabízí teplá, smažená i grilovaná jídla, pizzy, quesadilly, ovocné knedlíky a guláš, k tomu čepované pivo Bernard a Ferdinand. K dispozici je dětský koutek, venkovní hřiště, stojany na kola a pravidelné hudební večery i turnaje v šipkách, ping-pongu, kubbu nebo pétanque. Provoz běží celoročně, v sezóně od června do září s rozšířenou otevírací dobou.",
  "Café NÁVES (Poříčí nad Sázavou)":
    "Café NÁVES v Poříčí nad Sázavou spojuje kavárnu s cukrárnou. Nabízí domácí zákusky, koláče, buchty a sendviče, dále zmrzlinu, kávu, čaje, horké čokolády a domácí limonády, vše i s sebou.",
  "Restaurace SK Posázavan":
    "Restaurace SK Posázavan sídlí na Sportovní ulici v Poříčí nad Sázavou. Nachází se v areálu stejnojmenného sportovního klubu.",
  "PHO Poříčí":
    "PHO Poříčí je vietnamská restaurace na Pražské ulici v Poříčí nad Sázavou.",
  "Hospoda Na Radnici":
    "Hospoda Na Radnici stojí na Mírovém náměstí v centru Netvořic, přímo u radnice.",
  "Cukrářství Mazzetti":
    "Cukrářství Mazzetti sídlí v Netvořicích. Nabízí dorty, zákusky a cupcakes.",
  "esej cafe":
    "esej cafe v Netvořicích nabízí čerstvé chlebíčky a tradiční i moderní zákusky. Zmrzlinu si vyrábí denně ve více příchutích a kávu praží sama.",
  "Restaurace Stará Myslivna":
    "Restaurace Stará Myslivna má lovecký interiér a sídlí v areálu zámku Konopiště. Nabízí tradiční starobylou českou kuchyni se zvěřinovými specialitami. Pořádá svatby, myslivecké i jiné společenské akce, k dispozici je zahrada a wifi.",
  "Zámecká restaurace Konopiště":
    "Zámecká restaurace Konopiště sídlí přímo v areálu zámku a pořádá skupinové akce, svatby i oslavy narozenin. Nabízí teplá jídla a rauty.",
  "Café Konopiště":
    "Café Konopiště se nachází přímo v areálu zámku Konopiště. Prodává občerstvení a suvenýry.",
  "Café d'Este":
    "Café d'Este sídlí v srdci zámku Konopiště a nabízí širokou škálu kávy a nápojů. K dostání jsou dortíky s drobenkou, perník a další dezerty podle denní nabídky.",
  "Restaurant Corona":
    "Restaurant Corona v Benešově nabízí mezinárodní kuchyni a ve všední dny rozváží jídla firmám. K dispozici je salónek pro menší skupiny a podnik pořádá firemní brunche, srazy i oslavy. Na Firmy.cz získal ocenění TOP FIRMA 2025.",
  "Restaurace La PAUSA ... ciao":
    "Restaurace La PAUSA ... ciao na Masarykově náměstí v Benešově nabízí autentickou neapolskou pizzu. Součástí podniku je cukrárna s dvacetiletou tradicí.",
  "Švejk Restaurant":
    "Švejk Restaurant na Masarykově náměstí v Benešově se zaměřuje na klasickou českou kuchyni. Sezónně nabízí i zvěřinové speciality.",
  "Indická restaurace Gateway Of India":
    "Indická restaurace Gateway Of India sídlí na Masarykově náměstí v Benešově. Na Firmy.cz má hodnocení Fantastické od šedesáti recenzí.",
  "Sakura's restaurace":
    "Sakura's restaurace sídlí na Tyršově ulici v Benešově. Nabízí vietnamskou a asijskou kuchyni.",
  "YAO SHUN":
    "YAO SHUN sídlí v Benešově. Jde o čínskou restauraci.",
  "Italská kavárna a cukrárna Pavel Lípa":
    "Italská kavárna a cukrárna Pavel Lípa v Benešově vyrábí originální zákusky, dorty i svatební dorty z kvalitních surovin. Používá lehké šlehačkové krémy s tvarohem, jogurtem a čerstvým ovocem.",
  "Čas na kávu":
    "Čas na kávu v centru Benešova si kávu praží sama a nabízí dezerty, domácí koblihy, limonády a kávové speciality. Terasa podniku má výhled na Adventure Golf.",
  "Café NÁVES (Benešov)":
    "Café NÁVES na Pražské ulici v Benešově spojuje řemeslnou cukrárnu s kavárnou. Nabízí zákusky a kávu vysoké kvality.",
  "Street 414 Food":
    "Street 414 Food sídlí na Nádražní ulici v Benešově. Nabízí burgery, trhané maso (pulled meat) a wrapy.",
  "BubbleHouse - Bubble tea & Coffee":
    "BubbleHouse sídlí na Tyršově ulici v Benešově. Specializuje se na bubble tea.",
  "Kavárna MUD*":
    "Kavárna MUD* v přízemí Muzea umění a designu Benešov nabízí kávu, čaj, víno i džus. K dispozici je prezenční půjčení knih z muzejní knihovny s asi třemi tisíci svazky a interaktivní art stěna pro děti. Venkovní dvorek kavárny zdobí sochy.",
  "Tůmova Restaurace":
    "Tůmova Restaurace sídlí v centru obce Krňany.",
  "Restaurace Barokní statek Benice":
    "Restaurace Barokní statek Benice sídlí v areálu barokního statku v Benicích, jižně od zámku Konopiště.",
};

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function normalizeForCompare(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function main() {
  const research: ResearchItem[] = JSON.parse(
    readFileSync(resolve(SCRATCHPAD, "research-mista-gastro.json"), "utf8"),
  );
  const categories: CategoryRecord[] = JSON.parse(
    readFileSync(resolve(SCRATCHPAD, "categories.json"), "utf8"),
  );
  const existing: ExistingEntry[] = JSON.parse(
    readFileSync(resolve(SCRATCHPAD, "existing-entries.json"), "utf8"),
  );

  const existingTitles = new Set(existing.map((e) => normalizeForCompare(e.title)));
  const existingSourceUrls = new Set(
    existing.filter((e) => e.sourceUrl).map((e) => e.sourceUrl as string),
  );

  const manifest: Array<{
    _id: string;
    title: string;
    entryType: string;
    sourceUrl: string | null;
    confidenceNote: string | null;
    imageUploaded: boolean;
    skipped: null | "duplicate" | "no matching category";
  }> = [];

  let created = 0;
  let skippedDuplicate = 0;
  let skippedNoCategory = 0;
  let imagesUploaded = 0;

  for (const item of research) {
    const slug = slugify(item.title);
    const _id = `catalogEntry-fc20260910-${slug}`;

    // Duplicate re-check: exact sourceUrl match, or normalized title match
    // against an entry of the same entryType. Note: three "Café NÁVES"
    // branches (Týnec / Poříčí / Benešov) are legitimately three different
    // places and are NOT flagged here since none share a normalized title
    // with an *existing* entry (the three branches are all new, and distinct
    // from each other by construction of this dedup check operating against
    // `existing`, not within this batch).
    const isTitleDup =
      existingTitles.has(normalizeForCompare(item.title)) &&
      existing.some(
        (e) => e.entryType === item.entryType && normalizeForCompare(e.title) === normalizeForCompare(item.title),
      );
    const isSourceDup = !!item.sourceUrl && existingSourceUrls.has(item.sourceUrl);

    if (isTitleDup || isSourceDup) {
      console.log(`SKIP (duplicate): ${item.title}`);
      skippedDuplicate += 1;
      manifest.push({
        _id,
        title: item.title,
        entryType: item.entryType,
        sourceUrl: item.sourceUrl,
        confidenceNote: item.confidenceNote,
        imageUploaded: false,
        skipped: "duplicate",
      });
      continue;
    }

    const category = categories.find(
      (c) => c.type === item.entryType && c.slug === item.categorySlug,
    );
    if (!category) {
      console.log(
        `SKIP (no matching category): ${item.title} [entryType=${item.entryType} categorySlug=${item.categorySlug}]`,
      );
      skippedNoCategory += 1;
      manifest.push({
        _id,
        title: item.title,
        entryType: item.entryType,
        sourceUrl: item.sourceUrl,
        confidenceNote: item.confidenceNote,
        imageUploaded: false,
        skipped: "no matching category",
      });
      continue;
    }

    const subcategory =
      item.subcategorySlug && category.subcategories.some((s) => s.slug === item.subcategorySlug)
        ? item.subcategorySlug
        : undefined;

    const description = DESCRIPTIONS[item.title];
    if (!description) {
      throw new Error(`Missing /textar description for "${item.title}" -- refusing to write undrafted copy.`);
    }

    let heroImage: { _type: "image"; asset: { _type: "reference"; _ref: string }; alt: string } | undefined;
    let imageUploaded = false;
    if (item.imageLocalPath && existsSync(item.imageLocalPath)) {
      const filename = item.imageLocalPath.split("/").pop() ?? `${slug}.jpg`;
      const asset = await client.assets.upload("image", createReadStream(item.imageLocalPath), {
        filename,
      });
      heroImage = {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: item.title,
      };
      imageUploaded = true;
      imagesUploaded += 1;
    }

    const doc: Record<string, unknown> = {
      _id,
      _type: "catalogEntry",
      title: item.title,
      slug: { _type: "slug", current: slug },
      entryType: item.entryType,
      category: { _type: "reference", _ref: category._id },
      description,
      status: "pending",
      trustLevel: "scraped",
    };

    if (subcategory) doc.subcategory = subcategory;
    if (heroImage) doc.heroImage = heroImage;
    if (item.lat != null && item.lng != null) {
      doc.location = { _type: "geopoint", lat: item.lat, lng: item.lng };
    }
    if (item.address) doc.address = item.address;
    if (item.website) doc.website = item.website;
    if (item.sourceUrl) doc.sourceUrl = item.sourceUrl;
    if (item.sourceLabel) doc.sourceLabel = item.sourceLabel;
    if (item.social && (item.social.facebook || item.social.instagram)) {
      doc.social = {
        _type: "object",
        ...(item.social.facebook ? { facebook: item.social.facebook } : {}),
        ...(item.social.instagram ? { instagram: item.social.instagram } : {}),
      };
    }
    if (item.hours) doc.hours = item.hours;
    if (item.price) doc.price = item.price;
    if (item.contactEmail) doc.contactEmail = item.contactEmail;
    if (item.contactPhone) doc.contactPhone = item.contactPhone;

    await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0]);
    console.log(`CREATED: ${item.title} (${_id})`);
    created += 1;

    manifest.push({
      _id,
      title: item.title,
      entryType: item.entryType,
      sourceUrl: item.sourceUrl,
      confidenceNote: item.confidenceNote,
      imageUploaded,
      skipped: null,
    });
  }

  writeFileSync(resolve(SCRATCHPAD, "manifest-mista-gastro.json"), JSON.stringify(manifest, null, 2));

  console.log("---");
  console.log(`created: ${created}`);
  console.log(`skipped (duplicate): ${skippedDuplicate}`);
  console.log(`skipped (no matching category): ${skippedNoCategory}`);
  console.log(`images uploaded: ${imagesUploaded}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
