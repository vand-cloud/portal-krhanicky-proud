/* eslint-disable no-console */
// Fourth pass of the Úřad refresh (2026-09-10), same minimal convention as
// sync-uredni-deska-2026-07-12.ts and sync-dokumenty-smlouvy-2026-07-12.ts:
// title + date + issuing-authority-only summary, no invented content (PDFs
// were not read for these lightweight index entries -- the full-transcript
// treatment is reserved for zápisy/usnesení, see scripts/zapisy/).
// Source: obeckrhanice.cz /aktuality, /podsekce-uredni-deska,
// /podsekce-dokumenty-dle-2502000-sb, checked against the live catalog on
// 2026-09-10 (nothing new found in /vyhlasky or /verejnopravni-smlouvy).
//
// Run: node_modules/.bin/tsx scripts/_2026-09-10-urad-refresh/sync-urad-2026-09-10.ts
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");

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

type Item = { slug: string; title: string; summary: string; date: string; categoryId: string; subcategory?: string };

const items: Item[] = [
  // Aktuality
  { slug: "uzavirka-zeleznicniho-prejezdu-u-lomu-krhanice-2026-09", title: "Uzavírka železničního přejezdu u lomu v Krhanicích", summary: "Obec Krhanice. Od pátku 11. 9. 2026, 14:30 hod., do úterý 15. 9. 2026.", date: "2026-09-07", categoryId: "uradCategory-aktuality" },
  { slug: "uzavirka-silnice-iii-1066-krhanice-2026-09", title: "Úplná uzavírka silnice III/1066 v Krhanicích", summary: "Obec Krhanice. Od 21. 9. do 24. 9. 2026.", date: "2026-08-24", categoryId: "uradCategory-aktuality" },
  { slug: "uzavirka-silnice-kamenny-privoz-2026", title: "Uzavírka silnice přes Kamenný Přívoz", summary: "Obec Krhanice. Od 17. 8. 2026 do 12. 6. 2027.", date: "2026-08-13", categoryId: "uradCategory-aktuality" },
  { slug: "kanalizace-a-cov-i-etapa-dalsi-informace-2026-08", title: "Krhanice – kanalizace a ČOV I. etapa: další informace", summary: "Obec Krhanice.", date: "2026-08-06", categoryId: "uradCategory-aktuality" },
  { slug: "dopravni-uzavirka-kamenny-privoz-most-2026-07", title: "Dopravní uzavírka: Kamenný Přívoz, most přes řeku Sázavu", summary: "Obec Krhanice.", date: "2026-07-30", categoryId: "uradCategory-aktuality" },
  // Úřední deska
  { slug: "svolani-prvniho-zasedani-okrskove-volebni-komise-2026", title: "Svolání prvního zasedání okrskové volební komise", summary: "Volební komise, volby do Zastupitelstva obce Krhanice 2026. Zasedání 16. 9. 2026.", date: "2026-09-10", categoryId: "uradCategory-uredni-deska" },
  { slug: "rozhodnuti-povoleni-uzavirky-obec-krhanice-2026-09", title: "Rozhodnutí o povolení uzavírky přes obec Krhanice", summary: "Obecní úřad Krhanice. Uzavírka 21. 9. až 24. 9. 2026.", date: "2026-08-24", categoryId: "uradCategory-uredni-deska" },
  { slug: "informace-o-poctu-a-sidle-volebnich-okrsku-2026", title: "Informace o počtu a sídle volebních okrsků", summary: "Volební komise, volby do Zastupitelstva obce Krhanice 2026.", date: "2026-08-12", categoryId: "uradCategory-uredni-deska" },
  { slug: "pozvanka-ke-zkousce-znalosti-hub-2026-10", title: "Pozvánka ke zkoušce znalosti hub", summary: "Krajská hygienická stanice. Zkouška 15. 10. 2026.", date: "2026-07-15", categoryId: "uradCategory-uredni-deska" },
  // Dokumenty / rozpočet
  { slug: "rozpoctove-opatreni-c-3-2026-obec-krhanice", title: "Rozpočtové opatření obce Krhanice č. 3/2026", summary: "Obec Krhanice.", date: "2026-07-24", categoryId: "uradCategory-dokumenty", subcategory: "rozpocet" },
  { slug: "rozpoctove-opatreni-c-4-2026-obec-krhanice", title: "Rozpočtové opatření obce Krhanice č. 4/2026", summary: "Obec Krhanice.", date: "2026-09-07", categoryId: "uradCategory-dokumenty", subcategory: "rozpocet" },
  { slug: "spolecna-voda-rozpoctove-opatreni-4-2026", title: "Společná voda d.s.o.: rozpočtové opatření č. 4/2026", summary: "Společná voda d.s.o.", date: "2026-08-24", categoryId: "uradCategory-dokumenty", subcategory: "rozpocet" },
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
      category: { _type: "reference", _ref: i.categoryId },
      ...(i.subcategory ? { subcategory: i.subcategory } : {}),
      body: [para(i.summary)],
    });
  });
  await t.commit();
  console.log(`OK: ${items.length} úřad items published.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
