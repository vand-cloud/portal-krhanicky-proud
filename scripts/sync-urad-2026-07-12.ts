/* eslint-disable no-console */
// One-shot sync of new "Úřad" content found via Firecrawl deep-search on
// 2026-07-12 (obeckrhanice.cz aktuality + vyhlasky, refreshed since the
// stale May cache). Follows the exact uradPost shape from seed-sanity.ts.
// Idempotent: createOrReplace with deterministic _ids.
//
// Run: node_modules/.bin/tsx scripts/sync-urad-2026-07-12.ts
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

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

let _k = 0;
const key = () => `k${_k++}`;
type Block = Record<string, unknown>;
function span(text: string) {
  return { _type: "span", _key: key(), text, marks: [] };
}
function para(text: string): Block {
  return { _type: "block", _key: key(), style: "normal", markDefs: [], children: [span(text)] };
}

const aktuality: Array<{ slug: string; title: string; summary: string; date: string }> = [
  {
    slug: "svoz-nebezpecneho-odpadu-a-elektroodpadu-1352026",
    title: "Svoz nebezpečného odpadu a elektroodpadu",
    summary:
      "Ve středu 13. května 2026 provedly Technické služby Benešov mobilní svoz nebezpečného odpadu a elektroodpadu na třech stanovištích v Krhanicích a Prosečnici.",
    date: "2026-05-07",
  },
  {
    slug: "uzavirka-komunikace-sulice-kamenice-od-115-do-1462026",
    title: "Uzavírka silnice Sulice–Kamenice",
    summary:
      "Od 11. května do 14. června 2026 probíhala oprava silnice II/603 v úseku Sulice–Kamenice s dopravními omezeními a změnami v autobusové dopravě na lince 339.",
    date: "2026-05-07",
  },
  {
    slug: "projekt-fotovoltaika-na-strese-klubovny-zazemi-viceuceloveho-hriste-v-krhanicich",
    title: "Fotovoltaika na střeše klubovny u víceúčelového hřiště",
    summary:
      "Od 3. června 2026 probíhá v klubovně u víceúčelového hřiště instalace fotovoltaiky, do konce září přibude 31 panelů o celkovém výkonu 14,88 kWp. Projekt podpořil Státní fond životního prostředí částkou 303 283 Kč z programu RES+.",
    date: "2026-06-11",
  },
  {
    slug: "uzavirka-dne-2062026-sportovni-akce-cyklisticky-zavod",
    title: "Uzavírka 20. 6. 2026 kvůli cyklistickému závodu",
    summary:
      "V sobotu 20. června 2026 došlo v souvislosti s cyklistickým závodem L'Etape Czech Republic by Tour de France k dopravním omezením a změnám v integrované dopravě Středočeského kraje.",
    date: "2026-06-16",
  },
  {
    slug: "mladsi-zaci-tj-sokol-krhanice-2013-ovladli-soutez-okresniho-fotbaloveho-svazu-benesov",
    title: "Mladší žáci TJ Sokol Krhanice ovládli okresní soutěž",
    summary:
      "Mladší žáci TJ Sokol Krhanice ročníku 2013 vyhráli celkové prvenství v okresní soutěži OFS Benešov 2025/2026. Tým vedli trenéři Jiří Moulík a Martin Kůst.",
    date: "2026-06-22",
  },
  {
    slug: "zahajeni-havarijniho-preruseni-dodavky-pitne-vody-v-obci-krhanice-2962026",
    title: "Havarijní přerušení dodávky pitné vody",
    summary:
      "V pondělí 29. června 2026 začala v Krhanicích havarijní oprava vodovodu s přerušením dodávky pitné vody. Přerušení trvalo přibližně hodinu, oprava probíhala postupně po částech obce.",
    date: "2026-06-29",
  },
  {
    slug: "uzavreni-obecni-knihovny-krhanice",
    title: "Uzavření obecní knihovny Krhanice",
    summary:
      "Obecní knihovna Krhanice bude o letních prázdninách čtyřikrát uzavřená: v pondělí 13. a 27. července a 17. a 24. srpna 2026. Výpůjční doba se o dobu uzavření automaticky prodlužuje.",
    date: "2026-07-01",
  },
];

const vyhlaska = {
  slug: "vyhlaska-c-2-2026-nocni-klid",
  title: "Vyhláška č. 2/2026 o nočním klidu",
  summary:
    "Obecně závazná vyhláška obce Krhanice o nočním klidu č. 2/2026, schválená 8. června 2026 a účinná od 26. června 2026.",
  date: "2026-06-26",
};

async function run() {
  const t = tx();

  aktuality.forEach((a) => {
    t.createOrReplace({
      _id: `uradPost-${a.slug}`,
      _type: "uradPost",
      title: a.title,
      slug: { _type: "slug", current: a.slug },
      summary: a.summary,
      date: a.date,
      category: { _type: "reference", _ref: "uradCategory-aktuality" },
      body: [para(a.summary)],
    });
  });

  t.createOrReplace({
    _id: `uradPost-${vyhlaska.slug}`,
    _type: "uradPost",
    title: vyhlaska.title,
    slug: { _type: "slug", current: vyhlaska.slug },
    summary: vyhlaska.summary,
    date: vyhlaska.date,
    category: { _type: "reference", _ref: "uradCategory-dokumenty" },
    subcategory: "vyhlasky",
    body: [para(vyhlaska.summary)],
  });

  await t.commit();
  console.log(`OK: ${aktuality.length} aktuality + 1 vyhláška published.`);
}

function tx() {
  return client.transaction();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
