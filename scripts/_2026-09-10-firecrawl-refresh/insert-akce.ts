/* eslint-disable no-console */
// One-off write: inserts new "akce" (event) catalogEntry documents found by
// the Firecrawl research agent (2026-09-10) into Sanity, after resolving
// each entry's category reference and re-checking for duplicates against
// the current catalog. Descriptions were rewritten from raw research facts
// through the /textar Czech copywriting filter (no em dash, spisovná
// čeština, vykání where relevant) -- no facts invented beyond what the
// research agent found.
//
// Idempotent: every document uses a deterministic _id
// (catalogEntry-fc20260910-<slug>) and is written with createOrReplace, so
// re-running this script is safe.
//
// Run: node_modules/.bin/tsx scripts/_2026-09-10-firecrawl-refresh/insert-akce.ts
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
  startedAt: string | null;
  endedAt: string | null;
  hours: string | null;
  price: string | null;
  organizer: string | null;
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
// research `title` string.
const DESCRIPTIONS: Record<string, string> = {
  "Dárcovství kostní dřeně: Fakta a mýty":
    "Beseda s Jiřím Zemanem přiblíží dárcovství kostní dřeně a vyvrátí časté mýty kolem něj. Koná se v předvečer náboru do registru dárců, 14. září 2026 od 18 hodin v zasedací místnosti Obecního úřadu Krhanice. Vstup je zdarma, pořádá spolek Aktivní Krhanice.",
  "Zažít Krhanice jinak... až na dřeň":
    "Sousedské odpoledne v ulici před ZŠ Krhanice nabídne živou hudbu, loutkové a interaktivní anglické divadlo i tržiště místních produktů a dětské tržiště. Návštěvníci si mohou vyzkoušet rytířské souboje, lukostřelbu, házení seker nebo rytířskou zbroj. Součástí akce je i nábor do Českého národního registru dárců dřeně. Koná se 19. září 2026 od 14 do 19 hodin, vstup je zdarma, pořádá Aktivní Krhanice.",
  "Tři sestry Open air Tour 2026":
    "Kapela Tři sestry zahraje v rámci Open Air Tour 2026 v přírodním amfiteátru na Konopišti. Koncert začíná 11. září 2026 v 17 hodin, vstupenky jsou v prodeji na trisestry.cz a GoOut.",
  "50 let skupiny Asonance":
    "Folková skupina Asonance oslaví padesát let své existence jubilejním koncertem v Konopišťském parku. Koná se 12. září 2026 od 15 hodin.",
  "Krausberry v Benešově":
    "Kapela Krausberry zahraje v Benešově v rámci akce „Rockový závěr léta s Krausberry“. Koncert začíná 12. září 2026 v 17 hodin.",
  "Sek a Zula":
    "Liduščino divadlo uvede pro děti představení o sourozencích Sek a Zula a jejich dobrodružstvích v pravěku. Koná se 15. září 2026 od 17 hodin na adrese Tyršova 163 v Benešově, pořádá Kulturní a informační centrum Benešov.",
  "Noc literatury":
    "Projekt Noc literatury představuje současnou evropskou literaturu formou čtení naživo. V benešovské kavárně Kafe Patro vystoupí Literárně dramatický soubor při ZUŠ J. Suka a další účinkující. Akce se koná 16. září 2026 od 18 hodin, vstup je zdarma a rezervace probíhá na telefonu 724 503 281. Pořádá Městská knihovna Benešov.",
  "Dožínky v Poříčí nad Sázavou":
    "Tradiční dožínky se konají 12. září 2026 na nábřeží v ulici V Koutech v Poříčí nad Sázavou. Program začíná v 15.30, v 16 hodin následuje svěcení dožínkového věnce a od 19.30 hraje kapela Dafne Igora Chmely. Akce trvá do 22 hodin, pořádá ji Obecní úřad Poříčí nad Sázavou.",
  "Přednáška pro rodiče: Mluví moje dítě správně?":
    "Klinická logopedka Dominika Petreková povede přednášku pro rodiče o tom, jak správně rozvíjet dětskou řeč. Koná se 22. září 2026 od 17 hodin v prostoru KLENOTY v Poříčí nad Sázavou a trvá přibližně 90 minut.",
  "Koncert Dagmar Třetinové":
    "Hudební večer s Dagmar Třetinovou se koná v Hospůdce V Náklí v Týnci nad Sázavou. Začíná 18. září 2026 v 19 hodin, vstupné je dobrovolné, pořádá Kemp Týnec.",
  "Čtyři z Týnce – živá hudba":
    "Folková a country kapela Čtyři z Týnce zahraje v Hospůdce K Náklí v Týnci nad Sázavou 11. září 2026 od 19 do 22 hodin. Vstupné je dobrovolné, kapacita je ale omezená, proto pořadatel Kemp Týnec doporučuje rezervaci.",
  "Pohádkové odpoledne na hradě":
    "Areál hradu Týnec nad Sázavou nabídne odpoledne plné pohádkových aktivit: fotokoutek, malování erbů, hledání pokladu i pohádkový kvíz. Od 15 hodin zahraje Hrubcovo dřevěné divadlo pohádku O vytrvalém princi. Akce začíná 20. září 2026 ve 14 hodin, vstupné je dobrovolné, pořádá Kulturní centrum Týnec.",
  "Malý princ - recitál":
    "Hudebně-recitační zpracování Malého prince spojuje herce Jana Cinu, zpěvačku Vendulu Příhodovou nebo Kateřinu Bohatovou a smyčcový kvartet Unique Quartet. Koná se 23. září 2026 od 19 hodin v sále kulturního centra Týnec nad Sázavou. Vstupné je 790 až 890 Kč, vstupenky jsou k dostání v Infocentru a na GoOut.",
  "Archeolog Antonín Hejna ve vzpomínkách":
    "PhDr. Václav Bartůšek připomene archeologa Antonína Hejnu a jeho výzkumy v Týnci nad Sázavou a Chvojně. Přednáška se koná 24. září 2026 od 17.30 v zasedací místnosti Městského úřadu Týnec nad Sázavou, vstupné je dobrovolné. Pořádá Vlastivědný spolek Týnce nad Sázavou.",
  "Podzimní bazárek v Náklí":
    "Bleší trh a burza dětského oblečení, obuvi, sportovního vybavení a dětských potřeb probíhá v Hospůdce V Náklí v Týnci nad Sázavou. Věci na prodej lze odevzdávat ve čtvrtek 24. září, samotný bazárek se koná 25. a 26. září 2026. Vstup je zdarma, pořádá Kemp Týnec.",
  "Koncert Kostel žije (Dobrý ročník trio)":
    "V rámci šestého ročníku programu Kostel žije zazpívá vokální skupina Dobrý ročník trio v kostele sv. Kateřiny v Chrástu nad Sázavou. Koncert se koná 24. října 2026 od 14 hodin, vstupné je dobrovolné a výtěžek poputuje na údržbu kostela. Pořádá spolek Karhany.",
  "Vláďa Hron – Narozeninová One Man Show":
    "Vláďa Hron bilancuje šest dekád hudby ve své hudebně-humoristické one man show. Koná se 25. října 2026 v sále kulturního centra Týnec nad Sázavou, sál se otevírá v 18 hodin a program začíná v 19 hodin, trvá 100 minut s přestávkou. Vstupné je 300 Kč, vstupenky jsou v Infocentru a na GoOut.",
  "Josef Klíma: České podsvětí":
    "Novinář Josef Klíma představí svůj podcast České podsvětí a zavzpomíná na investigativní žurnalistiku devadesátých let. Beseda se koná 16. října 2026 od 19 hodin v sále kulturního centra Týnec nad Sázavou, bar je otevřený od 18 hodin. Po besedě následuje prodej knih a autogramiáda, vstupné je 150 Kč.",
  "Beneart nově - prodejní výstava":
    "Umělecké sdružení Beneart vystavuje a prodává svá díla ve velké galerii Městského muzea v Týnci nad Sázavou. Výstava trvá od 4. září do 28. října 2026 v otevírací době muzea, vstupné je v ceně vstupenky do expozic.",
  "Rybářské závody (Netvořice)":
    "Sbor dobrovolných hasičů Netvořice pořádá rybářské závody 12. září 2026 od 6 do 12 hodin. Startovné je 100 Kč, děti startují zdarma a na místě je zajištěné občerstvení.",
  "Přes čtyři zámky (turistický pochod)":
    "Dálkový turistický pochod nabízí trasy od 8 do 50 kilometrů přes Zbořený Kostelec, Pánskou skálu, Konopiště, Kamenici a další místa Posázaví. Start je v Hospůdce K Náklí v Týnci nad Sázavou 12. září 2026 mezi 7. a 10. hodinou, do cíle je třeba dorazit do 19 hodin. Startovné činí 30 Kč, děti od 6 do 16 let platí 10 Kč, pořádá Klub českých turistů, odbor Týnec nad Sázavou.",
  "Svátek sv. Václava na Konopišti - prohlídka věže Václavky":
    "Mimořádná prohlídka věže Václavky na zámku Konopiště vede od suterénu až po krov a doprovázejí ji bandité a šermíři. Koná se 28. září 2026 od 13 do 18 hodin, nutná je předchozí rezervace a vstupné činí 380 Kč. Prohlídka není vhodná pro děti mladší 6 let a osoby se sníženou mobilitou.",
  "Večerní prohlídka „Cesty do tajemných dálek“":
    "Večerní prohlídka zámku Konopiště přibližuje v menších skupinách cestovatelská dobrodružství arcivévody a ukazuje unikátní předměty z jeho cest. Opakuje se ve středy 16. září, 30. září, 14. října, 28. října, 11. listopadu a 25. listopadu 2026, vždy od 20 do 21.30. Vstupné je 380 Kč, vstupenky se prodávají pouze online.",
  "SWAP - výměna oblečení a předmětů (Netvořice)":
    "Swap nabízí výměnu oblečení a předmětů v Netvořicích. Podle plánu akcí obce se koná v sobotu 12. září 2026.",
  "Rodinné odpoledne \"Pouštění létajících draků\" (Netvořice)":
    "Rodinné odpoledne s pouštěním létajících draků se koná v Netvořicích. Podle plánu akcí obce je předběžně naplánováno na čtvrtek 1. října 2026, datum ale obec ještě potvrdí.",
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
    readFileSync(resolve(SCRATCHPAD, "research-akce.json"), "utf8"),
  );
  const categories: CategoryRecord[] = JSON.parse(
    readFileSync(resolve(SCRATCHPAD, "categories.json"), "utf8"),
  );
  const existing: ExistingEntry[] = JSON.parse(
    readFileSync(resolve(SCRATCHPAD, "existing-entries.json"), "utf8"),
  );

  const existingTitles = new Set(existing.map((e) => normalizeForCompare(e.title)));

  // A sourceUrl is only a trustworthy duplicate signal when it's a
  // per-entry deep link. Some sources (e.g. obeckrhanice.cz/pozvanky-na-akce)
  // are a single shared bulletin page reused as the sourceUrl for many
  // distinct existing events -- matching on that URL alone would falsely
  // flag every new event from the same bulletin as a duplicate. Only treat
  // a sourceUrl match as significant when it's unique to one existing entry.
  const sourceUrlCounts = new Map<string, number>();
  for (const e of existing) {
    if (!e.sourceUrl) continue;
    sourceUrlCounts.set(e.sourceUrl, (sourceUrlCounts.get(e.sourceUrl) ?? 0) + 1);
  }
  const existingSourceUrls = new Set(
    [...sourceUrlCounts.entries()].filter(([, count]) => count === 1).map(([url]) => url),
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
    // against an entry of the same entryType.
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
    if (item.startedAt) doc.startedAt = item.startedAt;
    if (item.endedAt) doc.endedAt = item.endedAt;
    if (item.hours) doc.hours = item.hours;
    if (item.price) doc.price = item.price;
    if (item.organizer) doc.organizer = item.organizer;
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

  writeFileSync(resolve(SCRATCHPAD, "manifest-akce.json"), JSON.stringify(manifest, null, 2));

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
