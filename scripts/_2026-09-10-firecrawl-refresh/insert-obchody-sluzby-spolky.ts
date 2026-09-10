/* eslint-disable no-console */
// One-off write: inserts new "obchody" / "sluzby" / "spolky" catalogEntry
// documents found by the Firecrawl research agent (2026-09-10) into Sanity,
// after resolving each entry's category reference and re-checking for
// duplicates against the current catalog. Descriptions were rewritten from
// raw research facts through the /textar Czech copywriting filter (no em
// dash, spisovná čeština, matter-of-fact directory tone matching the rest
// of the catalog) -- no facts invented beyond what the research agent
// found; several one-fact entries stay a single sentence on purpose rather
// than padded to a length.
//
// Two special cases called out by the research agent are handled
// explicitly (see EXCLUDE_TITLES and the confidenceNote augmentation
// below):
//   - "Honební společenstvo Netvořice" is excluded -- it's an
//     administrative association of landowners exercising hunting rights,
//     not a public-facing spolek.
//   - "Lékárna U mostu" is inserted but flagged: it may be a duplicate of
//     the existing "Lékárna Alba" entry under a different name and needs a
//     manual check before approval.
//   - "TJ Sokol Netvořice" is inserted from the town's directory listing
//     only, since the club's own site returned no content to Firecrawl.
//
// Idempotent: every document uses a deterministic _id
// (catalogEntry-fc20260910-<slug>) and is written with createOrReplace, so
// re-running this script is safe. Writes are paced with a short pause
// between requests to stay well under Sanity API rate limits.
//
// Run: node_modules/.bin/tsx scripts/_2026-09-10-firecrawl-refresh/insert-obchody-sluzby-spolky.ts
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
  entryType: "obchody" | "sluzby" | "spolky";
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

// Titles excluded outright -- not written to Sanity at all.
const EXCLUDE_TITLES: Record<string, string> = {
  "Honební společenstvo Netvořice":
    "Administrativní honební společenstvo (vlastníci honebních pozemků), ne spolek s činností pro veřejnost -- podle vlastního doporučení výzkumného agenta vynecháno z katalogu.",
};

// Extra manifest notes for the two other flagged cases (entry IS inserted,
// but the control agent must not approve it without checking).
const MANUAL_CHECK_NOTES: Record<string, string> = {
  "Lékárna U mostu":
    "NEPUBLIKOVAT BEZ RUČNÍHO OVĚŘENÍ: možná duplicita existujícího záznamu katalogEntry-pl-lekarna-alba (\"Lékárna Alba\", Týnec nad Sázavou, bez adresy) pod jiným názvem -- porovnat adresu/IČO a buď sloučit, nebo jeden ze dvou archivovat.",
  "TJ Sokol Netvořice":
    "OVĚŘIT PŘED SCHVÁLENÍM: vlastní web spolku (sokolnetvorice.raketovyraj.cz) se Firecrawlem nepodařilo stáhnout (prázdný obsah), záznam je potvrzen jen ze stránky Městyse Netvořice -- adresu a kontakt zatím nemá.",
};

// Descriptions rewritten from research `descriptionFacts` through /textar
// (spisovná čeština, no em dash, directory-entry third-person tone matching
// the rest of the catalog) -- no facts invented beyond what the research
// agent found. Keyed by exact research `title` string.
const DESCRIPTIONS: Record<string, string> = {
  "Český svaz chovatelů, ZO Týnec nad Sázavou":
    "Základní organizace Českého svazu chovatelů v Týnci nad Sázavou. Pořádá každoroční výstavu drobného zvířectva v chovatelském areálu u městského úřadu během Týneckého posvícení na konci října.",
  "Český svaz včelařů, ZO Týnec nad Sázavou":
    "Základní organizace včelařů v Týnci nad Sázavou sdružující místní chovatele včel.",
  "Český zahrádkářský svaz - Týnec":
    "Zahrádkářský spolek s cca 75 členy (2024). Pořádá pravidelnou zahrádkářskou výstavu o týneckém posvícení, přednáškovou činnost a zájezdy, pečuje o veřejný prostor.",
  "FK Týnec nad Sázavou":
    "Fotbalový klub založený roku 1932, klubové barvy modrá a bílá. Domácí zápasy na městském stadionu V Náklí (kapacita cca 2000 diváků), kolem 150 aktivních hráčů včetně mládeže.",
  "Jednotka sboru dobrovolných hasičů Týnec nad Sázavou - Pecerady (JPO 3)":
    "Dobrovolní hasiči zasahující kromě požárů i u dopravních nehod, úniku nebezpečných látek, povodní a dalších mimořádných událostí. Hasičská zbrojnice Pecerady. Město zřizuje a financuje jednotky SDH.",
  "Judo Týnec nad Sázavou, z.s.":
    "Klub olympijského sportu judo pro děti i dospělé, rozvíjející fyzickou i psychickou kondici. Tréninky v tělocvičně Základní školy Benešovská. Záštita programu Judo do škol.",
  "Klub českých turistů - Týnec":
    "Klub sdružující zájemce o turistiku a pobyt v přírodě, pořádá turistické akce pro členy i veřejnost.",
  "Letní tenisový klub Chrást nad Sázavou, z.s.":
    "Tenisový klub disponující dvěma venkovními antukovými kurty v Chrástu nad Sázavou (místní část Týnce nad Sázavou).",
  "Mateřské centrum Motýlek Týnec nad Sázavou":
    "Občanské sdružení vytvářející otevřené prostředí pro maminky s předškolními dětmi i další rodinné příslušníky, založené na svépomoci a dobrovolné práci. Sídlí v suterénu domu s pečovatelskou službou.",
  "Myslivecký spolek Háj Pecerady":
    "Myslivecký spolek s více jak 50letou tradicí, uživatel honitby Pecerady o výměře cca 1100 ha. V roce 2023 měl 26 členů. Zaměřuje se na myslivost, hospodaření a ochranu přírody.",
  "Myslivecký spolek Krusičany":
    "Nově vzniklý myslivecký spolek (7 členů v 2023), obhospodařuje honitbu o výměře 570 ha.",
  "Nadšenci z Posázaví":
    "Amatérský sportovní spolek pořádající závody a turnaje pro veřejnost: kola, běžky, pochody, volejbalový turnaj, míčový pětiboj dvojic.",
  "Netopýr - divadelní spolek": "Ochotnický divadelní spolek hrající pohádky a divadlo pro děti i dospělé.",
  "Studio 3 - nejen divadlo, z.s.":
    "Divadelní, hudební a poetický spolek se dvěma sekcemi: divadlo pro dospělé a pěvecký a dramatický kroužek pro děti.",
  "Skauti Týnec - TYSAN":
    "Skautské oddíly v Týnci nad Sázavou (mladší oddíl JUTY, starší oddíl MEANDR). Skautská klubovna je na konci cesty za Společenským centrem Týnec.",
  "Šachy TJ Jawa Brodce":
    "Šachový oddíl navazující na téměř 70letou tradici šachu v Týnci nad Sázavou (od roku 1942), založen 1993. Družstva hrají krajskou soutěž a regionální přebor.",
  "Škola Taekwon-do Hwa-Rang, z.s.":
    "Oddíl korejského bojového umění taekwon-do založený 1991, prošlo jím přes 2000 členů, 16 reprezentovalo ČR na ME/MS. Tréninková centra jsou v Týnci nad Sázavou a v Praze 5-Motole.",
  "Spolek zdravotně postižených Týnec nad Sázavou":
    "Spolek organizující relaxační a rekondiční pobyty pro seniory, jednodenní zájezdy, cvičení pro seniory a zdravotní turistické vycházky.",
  "Český rybářský svaz, MO Týnec nad Sázavou":
    "Místní organizace Českého rybářského svazu v Týnci nad Sázavou.",
  "TJ Týnec nad Sázavou, z.s.":
    "Tělovýchovná jednota v Týnci nad Sázavou provozující více sportovních oddílů, s rozvrhem tělocvičen ve škole.",
  "TJ JAWA Pecerady, z.s.":
    "Fotbalový klub v Peceradech (místní část Týnce nad Sázavou) založený 1938, věnuje se hlavně výchově mladých fotbalistů.",
  "Vlastivědný spolek Týnec nad Sázavou":
    "Spolek založený v roce 1955 s cílem vybudovat pamětní síň, výsledkem bylo otevření městského muzea v roce 1959 (obnoveno 1995). Pořádá přednášky, výstavy, shromažďuje a opatruje památky Týnecka.",
  "Volejbalový klub Týnec": "Volejbalový klub v Týnci nad Sázavou.",
  "Martina Žilková - Švadlenka": "Opravy a úpravy oděvů a textilií.",
  "2M - vodoinstalační a topenářské zboží": "Prodejna vodoinstalačního a topenářského zboží.",
  "Alena Šafandová - oční optika": "Provozovna oční optiky v Týnci nad Sázavou.",
  "BD studio - kosmetika, masáže, nehty, pedikúra":
    "Studio nabízející kosmetiku, masáže, nehtovou modeláž a pedikúru.",
  "Botoservis - oprava obuvi a kožedělná výroba":
    "Oprava obuvi a kožedělná výroba, také výroba opasků.",
  "CYKLOSPORT Týnec": "Prodej a oprava jízdních kol.",
  "Česká pojišťovna - pobočka Týnec nad Sázavou": "Pojišťovací služby v Týnci nad Sázavou.",
  "DANCING CRACKERS - street dance kurzy":
    "Kurzy street dance, vede Jaroslav Havelka. Výuka v tělocvičně základní školy v ulici Benešovská.",
  "EKOSERVIS - prodej a servis domovních ČOV":
    "Prodej a servis domovních čistíren odpadních vod (ČOV), Ing. Jaroslav Vejvoda.",
  "Elektro Jan Rak": "Elektroinstalatérské práce.",
  "Elektro-služby Bohumil Harvan": "Elektroinstalatérské služby.",
  "Elektroslužby Smetana Pavel": "Revizní technik, montáž a opravy elektroinstalací.",
  "FAZE, s.r.o.": "Prodej a instalace anténní techniky, elektroniky, Hi-Fi techniky a kamerových systémů.",
  "Fomiko - okenní fólie, těsnění": "Prodej a montáž okenních fólií a těsnění.",
  "Fyzioterapie - masáže Mgr. Lenka Novotná": "Fyzioterapeutické a masérské služby.",
  "Fyzioterapie a masáže Květa Plachtová":
    "Fyzioterapeutické a masérské služby, provozovna v domě s pečovatelskou službou.",
  "GET READY - vzdělávací centrum, výuka angličtiny":
    "Vzdělávací centrum pro děti od 4 do 15 let nabízí výuku angličtiny, IT workshopy, vzdělávání lektorů a příměstské tábory. Vede ho Zuzana Švestková.",
  "Hodinářství klenotnictví Vlastimil Vanžura": "Hodinářské a klenotnické služby.",
  "Hruška, spol. s r.o. - obchodní dům": "Obchodní dům se širokým sortimentem zboží.",
  "Ing. Olga Kohútová - výuka jazyků": "Výuka anglického, německého a francouzského jazyka.",
  "Ing. Pavel Minář - EKOSTEP": "Stavební projekty, energetické výpočty a poradenství, dozory na stavbách.",
  "Ing. Roman Moravec - projekty pozemních staveb": "Projektování pozemních staveb.",
  "Ivana Novotná - pedikúra, modeláž nehtů": "Pedikúra a modeláž nehtů.",
  "Jana Vašíčková - vedení účetnictví": "Vedení účetnictví a daňové evidence.",
  "Jazyková škola Evy Camrdové": "Jazyková škola, kontaktní osoba Václav Pícha.",
  "Jazykové a vzdělávací Studio Espiral":
    "Výuka angličtiny, němčiny, španělštiny a francouzštiny. Vedou Jana Urbanová, Lenka Picková a Eva Hrubá.",
  "Jóga s Margit": "Lekce jógy, konají se ve čtvrtek v tělocvičně ZŠ Týnec nad Sázavou.",
  "JUDr. Blanka Dalibová - advokátní služby": "Advokátní kancelář.",
  "Kadeřnictví - Lucie Pochová": "Dámské, pánské i dětské kadeřnictví.",
  "Kadeřnictví a solárium Michaela Vycpálková": "Kadeřnické služby a solárium.",
  "Kadeřnictví Lenka a Věra": "Kadeřnické služby.",
  "Klempo - výroba střešních oken": "Výroba a montáž střešních oken.",
  "Kosmetické poradenství a prodej kosmetiky Mary Kay - Markéta Krupařová":
    "Kosmetické poradenství a prodej kosmetiky Mary Kay.",
  "Kosmetika Mary Kay, LR, Eurona, Green Ways - Alena Součková":
    "Prodej a poradenství v oblasti kosmetiky více značek.",
  "Květiny Iveta": "Květinářství, provozuje Iveta Uhlířová.",
  "Květiny, dárková služba - Zdena Kaprálková": "Květinářství a dárková služba.",
  "Lékárna U mostu": "Lékárna, provozuje Mgr. Jozef Hendel.",
  "Martin Kazda - autobusová doprava": "Autobusová doprava.",
  "Maso - uzeniny Pavel Šubrt": "Prodejna masa a uzenin.",
  "Maso - uzeniny TÝNA - Jiří Šebek": "Prodejna masa a uzenin.",
  "Mateřská škola a základní škola GAIA Týnec nad Sázavou":
    "Soukromá mateřská a základní škola GAIA v Týnci nad Sázavou.",
  "Mgr. Martin Kadrnožka - správa nemovitostí": "Správa nemovitostí.",
  "MP KOVO Salátek s.r.o.": "Zámečnické a kovářské práce, vede Robert Salátek.",
  "MUDr. Alice Čečilová - praktická lékařka": "Ordinace praktického lékaře pro dospělé.",
  "MUDr. Antonín Obr - gynekologie a porodnictví": "Gynekologicko-porodnická ordinace.",
  "MUDr. Dagmar Bumbálková - praktický zubní lékař": "Zubní ordinace.",
  "MUDr. František Kroužek - privátní gynekolog": "Privátní gynekologická ordinace.",
  "MUDr. Jana Mravcová - ORL": "Ušní, nosní, krční ordinace (ORL).",
  "MUDr. Josef Fuchs - oční lékař": "Oční ordinace.",
  "MUDr. Josef Zemánek - dětský lékař": "Ordinace dětského lékaře.",
  "MUDr. Marta Hudecová - praktický zubní lékař": "Zubní ordinace.",
  "MUDr. Miloslava Fumferová - praktická lékařka": "Ordinace praktického lékaře pro dospělé.",
  "MUDr. Tereza Dvořáková - praktická lékařka": "Ordinace praktického lékaře pro dospělé.",
  "MUDr. Vlasta Hvězdová - praktická lékařka pro děti a dorost":
    "Ordinace praktické lékařky pro děti a dorost.",
  "Obuv a galanterie - Milena Vondráková": "Prodejna obuvi a galanterie.",
  "Otta s.r.o. - stavební firma": "Stavební firma.",
  "P bus tour - autobusová doprava": "Autobusová doprava.",
  "PC Computer servis s.r.o.": "Komplexní služby v oblasti výpočetní techniky.",
  "PERKAM - kamenická spol. (Roman Lutz)": "Kamenicko-restaurátorské práce s licencí Ministerstva kultury ČR.",
  "Pneu Týnec, s.r.o.": "Pneuservis, provozuje Petr Vrkoslav.",
  "Počítače - Jan Školník": "IT služby, prodej a servis PC, správa sítě.",
  "Podlahy Smolák": "Montáž a prodej podlahových krytin.",
  "Poradna osobního rozvoje - Mgr. Eva Korbelová":
    "Poradenská a konzultační činnost, poradna osobního rozvoje.",
  "Potraviny Vlasák": "Samoobsluha s potravinami.",
  "Prodys - Mgr. Světlana Drábová, speciální pedagog":
    "Nápravy a diagnostika specifických poruch učení, vede speciální pedagog.",
  "Reha studio - masáže, kosmetika (Adriana Bursová)": "Masáže a kosmetické služby.",
  "Rekonstrukce koupelen a bytů - Martin Šíma": "Rekonstrukce koupelen a bytů.",
  "SKI & SPORT (Ing. Michael Turek)": "Prodej sportovního vybavení.",
  "Sklenářství, rámování, výroba klíčů - Pavel Macháček":
    "Sklenářské práce, rámování obrazů a výroba klíčů.",
  "Stavebniny Vladimír Kiša": "Prodejna stavebnin.",
  "Střechy Bárta - pokrývačské a klempířské práce": "Pokrývačské a klempířské práce.",
  "Sypos-stavby, s.r.o.": "Stavební firma, jednatel Ing. Jindřich Petrášek.",
  "Textil NYKA": "Prodejna textilu a oděvů, provozuje Jidřiška Kazdová.",
  "Tomáš Vašíček - autodoprava": "Autodoprava.",
  "TopKovo s.r.o.": "Zámečnické a kovářské práce.",
  "Truhlářství Pavel Padevět": "Truhlářské práce.",
  "Urbex elektro - Václav Urbanec": "Elektroinstalatérské práce.",
  "Vedení účetnictví a daňové poradenství - Martina Kotlár Mojdlová":
    "Vedení účetnictví a daňové poradenství.",
  "Veterinární ordinace Týnec nad Sázavou s.r.o.":
    "Veterinární ordinace, MVDr. Daniela Mustafa Ali a MVDr. Martina Jůzová.",
  "Zdravá výživa - Jana Kalfasová": "Prodejna zdravé výživy.",
  "ZOO - prodejna krmiv pro drobná zvířata": "Prodejna krmiv a potřeb pro drobná zvířata.",
  "Základní umělecká škola v Týnci nad Sázavou":
    "Odloučené pracoviště Základní umělecké školy J. Suka v Benešově, výuka hudebních oborů (přípravná hudební výchova, I. a II. stupeň).",
  "Český svaz včelařů, ZO Netvořice":
    "Základní organizace včelařů v Netvořicích, navazuje na Včelařský spolek pro Netvořice a okolí založený 1921 (s výjimkou nucené přestávky v letech 1942–45).",
  "Spolek rodáků a přátel muzea v Netvořicích":
    "Občanská apolitická organizace založená v roce 1904. Cíle: podpora prosperity Netvořicka, uchování Netvořického muzea, výchova k hrdosti na rodný kraj, ochrana krajiny a publikační/sběratelská činnost o historii Netvořicka.",
  "Sbor dobrovolných hasičů Netvořice": "Sbor dobrovolných hasičů v Netvořicích.",
  "TJ Sokol Netvořice": "Tělovýchovná jednota Sokol v Netvořicích.",
  "Sbor dobrovolných hasičů Poříčí nad Sázavou": "Sbor dobrovolných hasičů v Poříčí nad Sázavou.",
  "Myslivecký spolek POSÁZAVÍ Poříčí nad Sázavou": "Myslivecký spolek v Poříčí nad Sázavou.",
  "Bike Trans Poříčí":
    "Pořadatel závodů horských kol pro všechny věkové a výkonnostní kategorie, start na závodišti Homolka. Koná se každoročně v květnu.",
  "Automotoklub Poříčí nad Sázavou": "Automotoklub v Poříčí nad Sázavou.",
  "Fit klub Poříčí nad Sázavou, z.s.":
    "Cvičební klub nabízí zdravotní cvičení a cvičení pro zvýšení kondice pro ženy (středa 19:30–20:30) a všestranný pohybový rozvoj pro děti (pondělí 17:30–18:30). Cvičí se od října do dubna v tělocvičně základní školy v Poříčí nad Sázavou.",
  "Nohejbal TJ Sokol Poříčí nad Sázavou": "Nohejbalový tým mužů hrající okresní přebor, noví zájemci vítáni.",
  "SK Posázavan Poříčí nad Sázavou": "Sportovní klub provozující fotbal, futsal, atletiku a pohybové hry.",
  "Tělocvičná jednota Sokol Poříčí nad Sázavou":
    "Sokolská tělocvičná jednota nabízí nohejbal, stolní tenis, taneční sport a cvičení pro děti.",
  "Sbor dobrovolných hasičů Samechov": "Sbor dobrovolných hasičů v Samechově (místní část obce Chocerady).",
  "SK Chocerady": "Fotbalový klub v Choceradech, v roce 2026 slaví 100 let od založení.",
  "Občanská a vzdělávací jednota Komenský":
    "Ochotnický divadelní spolek v Choceradech, sdružení a spolky patří k historii obce od roku 1904, sídlí v prostorách sokolovny.",
  "TJ Sokol Chocerady":
    "Tělocvičná jednota Sokol v Choceradech, sokolovna v obci slavila v roce 2022 100 let od otevření.",
  "Mažoretky Smetanky": "Mažoretkový soubor v Choceradech.",
  "Jiskra Růženín": "Spolek v Růženíně, místní části obce Chocerady.",
  "Myslivecký spolek Ostříž": "Myslivecký spolek působící v okolí Chocerad.",
  "Sdružení rodičů a přátel školy Chocerady":
    "Sdružení rodičů a přátel Základní školy a Mateřské školy Chocerady.",
  "Les psích duší, z.s.":
    "Spolek zabývající se záchranou a péčí o opuštěné psy v oblasti Chocerad a okolí.",
};

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function normalizeForCompare(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const research: ResearchItem[] = JSON.parse(
    readFileSync(resolve(SCRATCHPAD, "research-obchody-sluzby-spolky.json"), "utf8"),
  );
  const categories: CategoryRecord[] = JSON.parse(readFileSync(resolve(SCRATCHPAD, "categories.json"), "utf8"));
  const existing: ExistingEntry[] = JSON.parse(readFileSync(resolve(SCRATCHPAD, "existing-entries.json"), "utf8"));

  const existingSourceUrls = new Set(existing.filter((e) => e.sourceUrl).map((e) => e.sourceUrl as string));

  const manifest: Array<{
    _id: string;
    title: string;
    entryType: string;
    sourceUrl: string | null;
    confidenceNote: string | null;
    imageUploaded: boolean;
    skipped: null | "duplicate" | "no matching category" | "excluded";
  }> = [];

  let created = 0;
  let skippedDuplicate = 0;
  let skippedNoCategory = 0;
  let skippedExcluded = 0;
  let imagesUploaded = 0;

  for (const item of research) {
    const slug = slugify(item.title);
    const _id = `catalogEntry-fc20260910-${slug}`;

    if (item.title in EXCLUDE_TITLES) {
      console.log(`SKIP (excluded): ${item.title}`);
      skippedExcluded += 1;
      manifest.push({
        _id,
        title: item.title,
        entryType: item.entryType,
        sourceUrl: item.sourceUrl,
        confidenceNote: `${item.confidenceNote ?? ""} ${EXCLUDE_TITLES[item.title]}`.trim(),
        imageUploaded: false,
        skipped: "excluded",
      });
      continue;
    }

    // Duplicate re-check: exact sourceUrl match, or normalized title match
    // against an entry of the same entryType.
    const nt = normalizeForCompare(item.title);
    const isTitleDup = existing.some(
      (e) => e.entryType === item.entryType && normalizeForCompare(e.title) === nt,
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

    const category = categories.find((c) => c.type === item.entryType && c.slug === item.categorySlug);
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
      const asset = await client.assets.upload("image", createReadStream(item.imageLocalPath), { filename });
      heroImage = { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt: item.title };
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
    if (item.organizer) doc.organizer = item.organizer;
    if (item.contactEmail) doc.contactEmail = item.contactEmail;
    if (item.contactPhone) doc.contactPhone = item.contactPhone;

    await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0]);
    console.log(`CREATED: ${item.title} (${_id})`);
    created += 1;

    const note = MANUAL_CHECK_NOTES[item.title]
      ? `${item.confidenceNote ?? ""} ${MANUAL_CHECK_NOTES[item.title]}`.trim()
      : item.confidenceNote;

    manifest.push({
      _id,
      title: item.title,
      entryType: item.entryType,
      sourceUrl: item.sourceUrl,
      confidenceNote: note,
      imageUploaded,
      skipped: null,
    });

    // Small pause between writes -- 126 sequential createOrReplace + some
    // asset uploads is well within Sanity's rate limits, but no need to
    // hammer the API back to back.
    await sleep(250);
  }

  writeFileSync(
    resolve(SCRATCHPAD, "manifest-obchody-sluzby-spolky.json"),
    JSON.stringify(manifest, null, 2),
  );

  console.log("---");
  console.log(`created: ${created}`);
  console.log(`skipped (duplicate): ${skippedDuplicate}`);
  console.log(`skipped (no matching category): ${skippedNoCategory}`);
  console.log(`skipped (excluded): ${skippedExcluded}`);
  console.log(`images uploaded: ${imagesUploaded}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
