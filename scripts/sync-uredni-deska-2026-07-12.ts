/* eslint-disable no-console */
// Second pass of the 2026-07-12 Úřad refresh: 4 new items on the úřední
// deska (§106/1999 Sb.) not yet covered ("Oznámení o nalezené věci" and
// "Vyhláška č.2/2026" are already in Sanity from the previous sync; the
// "netýkavka" OOP is a likely-but-unconfirmed duplicate of an existing
// entry and is deliberately skipped). Summary style follows the existing
// convention for this category: issuing authority only, no invented detail
// (matches "Finanční úřad pro Středočeský kraj." on the daň z nemovitých
// věcí notice) -- these are official notices, PDFs weren't read, so no
// content beyond the title + authority is asserted.
//
// Run: node_modules/.bin/tsx scripts/sync-uredni-deska-2026-07-12.ts
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

const items: Array<{ slug: string; title: string; summary: string; date: string }> = [
  {
    slug: "zamer-obce-krhanice-2026-07",
    title: "Záměr obce Krhanice",
    summary: "Obec Krhanice.",
    date: "2026-07-03",
  },
  {
    slug: "stanoveni-poctu-podpisu-na-peticich-volby-2026",
    title:
      "Stanovení počtu podpisů na peticích na podporu kandidatury nezávislého kandidáta nebo sdružení nezávislých kandidátů pro volby do Zastupitelstva obce Krhanice",
    summary: "Obec Krhanice, registrační úřad pro volby do zastupitelstva.",
    date: "2026-07-02",
  },
  {
    slug: "stanoveni-poctu-clenu-zastupitelstva-2026-2030",
    title: "Stanovení počtu členů Zastupitelstva obce Krhanice na volební období 2026 až 2030",
    summary: "Obec Krhanice.",
    date: "2026-06-23",
  },
  {
    slug: "zprava-o-uplatnovani-uzemniho-planu-krhanice",
    title: "Zpráva o uplatňování územního plánu Krhanice",
    summary: "Obec Krhanice, pořizovatel územního plánu.",
    date: "2026-06-09",
  },
];

async function run() {
  const t = client.transaction();
  items.forEach((i) => {
    t.createOrReplace({
      _id: `uradPost-${i.slug}`,
      _type: "uradPost",
      title: i.title,
      slug: { _type: "slug", current: i.slug },
      summary: i.summary,
      date: i.date,
      category: { _type: "reference", _ref: "uradCategory-uredni-deska" },
      body: [para(i.summary)],
    });
  });
  await t.commit();
  console.log(`OK: ${items.length} uredni deska items published.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
