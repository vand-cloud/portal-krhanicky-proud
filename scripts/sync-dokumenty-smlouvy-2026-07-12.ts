/* eslint-disable no-console */
// Third pass of the 2026-07-12 Urad refresh: full mirror of "Dokumenty dle
// 250/2000 Sb." (rozpocet/zaverecny ucet documents for the obec + BENE-BUS,
// Tynecko-svazek obcí, Spolecna voda d.s.o., MS Krhanice, ZS Krhanice) and
// "Verejnopravni smlouvy" (SDH/TJ Sokol/Posazavi dotace, 2015-2026) from
// obeckrhanice.cz. Summary field follows the established minimal convention
// for this category (issuing/counterparty authority only, no invented
// content -- PDFs were not read).
//
// Run: node_modules/.bin/tsx scripts/sync-dokumenty-smlouvy-2026-07-12.ts
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

type Item = { slug: string; title: string; summary: string; date: string };

const dokumenty: Item[] = [
  { slug: "dokumenty-obce-krhanice-oznameni-o-vyveseni-2017", title: "Oznámení o vyvěšení dokumentů dle zákona č. 250/2000 Sb.", summary: "Obec Krhanice.", date: "2017-05-25" },
  { slug: "priloha-rozpoctu-obce-krhanice-2026", title: "Příloha rozpočtu obce Krhanice na rok 2026", summary: "Obec Krhanice.", date: "2025-12-18" },
  { slug: "rozpocet-fondu-vodovodu-krhanice-prosecnice-2026", title: "Rozpočet Fondu financování obnovy vodovodů obce Krhanice a Prosečnice na rok 2026", summary: "Obec Krhanice.", date: "2025-12-18" },
  { slug: "strednedoby-vyhled-rozpoctu-obce-krhanice-2025-2028", title: "Střednědobý výhled rozpočtu obce Krhanice na období 2025 až 2028", summary: "Obec Krhanice.", date: "2025-12-18" },
  { slug: "rozpoctove-opatreni-c-1-2026-obec", title: "Rozpočtové opatření obce Krhanice č. 1/2026", summary: "Obec Krhanice.", date: "2026-03-11" },
  { slug: "zaverecny-ucet-obce-krhanice-2025", title: "Závěrečný účet obce Krhanice za rok 2025", summary: "Obec Krhanice, včetně sedmi příloh.", date: "2026-06-10" },
  { slug: "rozpoctove-opatreni-c-2-2026-obec", title: "Rozpočtové opatření obce Krhanice č. 2/2026", summary: "Obec Krhanice.", date: "2026-06-11" },
  { slug: "bene-bus-rozpocet-2026", title: "BENE-BUS: rozpočet na rok 2026", summary: "BENE-BUS, dobrovolný svazek obcí, Masarykovo náměstí 100, Benešov.", date: "2025-12-15" },
  { slug: "bene-bus-strednedoby-vyhled-2027-2029", title: "BENE-BUS: střednědobý výhled rozpočtu 2027 až 2029", summary: "BENE-BUS, dobrovolný svazek obcí.", date: "2025-12-15" },
  { slug: "bene-bus-oznameni-zverejneni-dokumentu-2025", title: "BENE-BUS: oznámení o zveřejnění návrhů a schválených dokumentů", summary: "BENE-BUS, dobrovolný svazek obcí.", date: "2025-12-15" },
  { slug: "bene-bus-navrh-zaverecneho-uctu-2025", title: "BENE-BUS: návrh závěrečného účtu za rok 2025", summary: "BENE-BUS, dobrovolný svazek obcí. Včetně zprávy o výsledku přezkoumání hospodaření.", date: "2026-05-18" },
  { slug: "bene-bus-rozpoctove-opatreni-1-2026", title: "BENE-BUS: rozpočtové opatření č. 1/2026", summary: "BENE-BUS, dobrovolný svazek obcí.", date: "2026-06-02" },
  { slug: "bene-bus-oznameni-zverejneni-dokumentu-2026", title: "BENE-BUS: oznámení o zveřejnění návrhů a schválených dokumentů 2026", summary: "BENE-BUS, dobrovolný svazek obcí.", date: "2026-06-15" },
  { slug: "tynecko-navrh-zaverecneho-uctu-2024", title: "Týnecko, svazek obcí: návrh závěrečného účtu za rok 2024", summary: "Týnecko, svazek obcí, K Náklí 404, Týnec nad Sázavou.", date: "2025-03-31" },
  { slug: "tynecko-oznameni-rozpocet-2026", title: "Týnecko, svazek obcí: oznámení o zveřejnění rozpočtu 2026 a střednědobého výhledu 2027 až 2028", summary: "Týnecko, svazek obcí.", date: "2026-01-19" },
  { slug: "tynecko-navrh-zaverecneho-uctu-2025", title: "Týnecko, svazek obcí: návrh závěrečného účtu za rok 2025", summary: "Týnecko, svazek obcí. Včetně zprávy o výsledku přezkoumání hospodaření.", date: "2026-03-25" },
  { slug: "spolecna-voda-strednedoby-vyhled-2027-2029", title: "Společná voda d.s.o.: střednědobý výhled rozpočtu 2027 až 2029", summary: "Společná voda d.s.o., Černoleská 1600, Benešov.", date: "2025-12-16" },
  { slug: "spolecna-voda-rozpocet-2026", title: "Společná voda d.s.o.: rozpočet na rok 2026", summary: "Společná voda d.s.o.", date: "2025-12-16" },
  { slug: "spolecna-voda-rozpoctove-opatreni-1-2026", title: "Společná voda d.s.o.: rozpočtové opatření č. 1/2026", summary: "Společná voda d.s.o.", date: "2026-06-05" },
  { slug: "spolecna-voda-rozpoctove-opatreni-2-2026", title: "Společná voda d.s.o.: rozpočtové opatření č. 2/2026", summary: "Společná voda d.s.o.", date: "2026-06-05" },
  { slug: "spolecna-voda-zaverecny-ucet-2025", title: "Společná voda d.s.o.: závěrečný účet za rok 2025", summary: "Společná voda d.s.o. Včetně závěrečného účtu Vodovodního přivaděče Javorník-Benešov d.s.o.", date: "2026-06-24" },
  { slug: "spolecna-voda-rozpoctove-opatreni-3-2026", title: "Společná voda d.s.o.: rozpočtové opatření č. 3/2026", summary: "Společná voda d.s.o.", date: "2026-07-10" },
  { slug: "ms-krhanice-rozpocet-2026", title: "Mateřská škola Krhanice: rozpočet na rok 2026", summary: "Mateřská škola Krhanice, okres Benešov.", date: "2025-12-18" },
  { slug: "ms-krhanice-strednedoby-vyhled-2025-2028", title: "Mateřská škola Krhanice: střednědobý výhled rozpočtu 2025 až 2028", summary: "Mateřská škola Krhanice, okres Benešov.", date: "2025-12-18" },
  { slug: "ms-krhanice-1-uprava-rozpoctu-2026", title: "Mateřská škola Krhanice: 1. úprava rozpočtu 2026", summary: "Mateřská škola Krhanice, okres Benešov.", date: "2026-06-15" },
  { slug: "zs-krhanice-rozpocet-2026", title: "Základní škola Krhanice: rozpočet na rok 2026", summary: "Základní škola Krhanice, okres Benešov.", date: "2025-12-18" },
  { slug: "zs-krhanice-strednedoby-vyhled-2025-2028", title: "Základní škola Krhanice: střednědobý výhled rozpočtu 2025 až 2028", summary: "Základní škola Krhanice, okres Benešov.", date: "2025-12-18" },
  { slug: "zs-krhanice-1-uprava-rozpoctu-2026", title: "Základní škola Krhanice: 1. úprava rozpočtu 2026", summary: "Základní škola Krhanice, okres Benešov.", date: "2026-03-12" },
  { slug: "zs-krhanice-2-uprava-rozpoctu-2026", title: "Základní škola Krhanice: 2. úprava rozpočtu 2026", summary: "Základní škola Krhanice, okres Benešov.", date: "2026-06-15" },
];

const smlouvy: Item[] = [
  { slug: "smlouva-tj-sokol-dotakce-2026-06", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTAKCE/2026/06", summary: "TJ Sokol Krhanice.", date: "2026-03-20" },
  { slug: "smlouva-tj-sokol-dotcinnost-2026-04", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2026/04", summary: "TJ Sokol Krhanice.", date: "2026-03-20" },
  { slug: "smlouva-tj-sokol-dotcinnost-2026-05", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2026/05", summary: "TJ Sokol Krhanice.", date: "2026-03-16" },
  { slug: "smlouva-sdh-dotakce-2026-05", title: "SDH Krhanice – veřejnoprávní smlouva č. DOTAKCE/2026/05", summary: "SDH Krhanice.", date: "2026-03-17" },
  { slug: "smlouva-sdh-dotakce-2026-04", title: "SDH Krhanice – veřejnoprávní smlouva č. DOTAKCE/2026/04", summary: "SDH Krhanice.", date: "2026-03-17" },
  { slug: "smlouva-sdh-dotakce-2026-03", title: "SDH Krhanice – veřejnoprávní smlouva č. DOTAKCE/2026/03", summary: "SDH Krhanice.", date: "2026-03-17" },
  { slug: "smlouva-sdh-dotcinnost-2026-03", title: "SDH Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2026/03", summary: "SDH Krhanice.", date: "2026-03-17" },
  { slug: "smlouva-sdh-dotcinnost-2025-04", title: "SDH Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2025/04", summary: "SDH Krhanice.", date: "2025-04-29" },
  { slug: "smlouva-sdh-dotakce-2025-04", title: "SDH Krhanice – veřejnoprávní smlouva č. DOTAKCE/2025/04", summary: "SDH Krhanice.", date: "2025-04-29" },
  { slug: "smlouva-sdh-dotakce-2025-05", title: "SDH Krhanice – veřejnoprávní smlouva č. DOTAKCE/2025/05", summary: "SDH Krhanice.", date: "2025-04-29" },
  { slug: "smlouva-tj-sokol-dotcinnost-2025-03", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2025/03", summary: "TJ Sokol Krhanice.", date: "2025-04-01" },
  { slug: "smlouva-tj-sokol-dotakce-2025-03", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTAKCE/2025/03", summary: "TJ Sokol Krhanice.", date: "2025-04-01" },
  { slug: "smlouva-sdh-dotakce-2024-07", title: "SDH Krhanice – veřejnoprávní smlouva č. DOTAKCE/2024/07", summary: "SDH Krhanice.", date: "2024-09-09" },
  { slug: "smlouva-tj-sokol-dotcinnost-2024-07", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2024/07", summary: "TJ Sokol Krhanice.", date: "2024-07-10" },
  { slug: "smlouva-tj-sokol-dotakce-2024-06", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTAKCE/2024/06", summary: "TJ Sokol Krhanice.", date: "2024-07-10" },
  { slug: "smlouva-tj-sokol-dotcinnost-2024-03", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2024/03", summary: "TJ Sokol Krhanice.", date: "2024-01-11" },
  { slug: "smlouva-tj-sokol-brany-hriste-2024", title: "TJ Sokol Krhanice – pořízení 2 ks bran a zapískování hřiště", summary: "TJ Sokol Krhanice.", date: "2024-01-11" },
  { slug: "smlouva-sdh-lavicky-stoly-2024", title: "SDH Krhanice – nákup 10 ks setů laviček a stolů v roce 2024", summary: "SDH Krhanice.", date: "2024-01-05" },
  { slug: "smlouva-sdh-podpora-mladych-hasicu-2024", title: "SDH Krhanice – podpora činnosti mladých hasičů v roce 2024", summary: "SDH Krhanice.", date: "2024-01-05" },
  { slug: "smlouva-tj-sokol-dotakce-2023-06", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTAKCE-2023-06", summary: "TJ Sokol Krhanice.", date: "2023-06-22" },
  { slug: "smlouva-tj-sokol-dotcinnost-2023-03", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2023/03", summary: "TJ Sokol Krhanice.", date: "2023-02-08" },
  { slug: "smlouva-tj-sokol-dotakce-2022-02", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTAKCE/2022/02", summary: "TJ Sokol Krhanice.", date: "2022-07-19" },
  { slug: "smlouva-tj-sokol-dotcinnost-2022-01", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2022/01", summary: "TJ Sokol Krhanice.", date: "2022-01-28" },
  { slug: "smlouva-dodatek-1-navratna-financni-pomoc-2022", title: "Dodatek č. 1 ke Smlouvě o poskytnutí návratné finanční pomoci z rozpočtu obce Krhanice schválené Zastupitelstvem obce Krhanice č. 4/2021 dne 13. 9. 2021", summary: "Obec Krhanice, návratná finanční výpomoc.", date: "2022-11-09" },
  { slug: "smlouva-navratna-financni-vypomoc-2021", title: "Smlouva o poskytnutí návratné finanční výpomoci z rozpočtu obce Krhanice schválené Zastupitelstvem obce Krhanice č. 4/2021 dne 13. 9. 2021", summary: "Obec Krhanice, návratná finanční výpomoc.", date: "2021-09-30" },
  { slug: "smlouva-tj-sokol-dotakce-2021-03", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTAKCE/2021/03", summary: "TJ Sokol Krhanice.", date: "2021-07-16" },
  { slug: "smlouva-tj-sokol-dotcinnost-2021-01", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2021/01", summary: "TJ Sokol Krhanice.", date: "2021-01-27" },
  { slug: "smlouva-tj-sokol-dotakce-2020-04", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTAKCE-2020-04", summary: "TJ Sokol Krhanice.", date: "2020-05-05" },
  { slug: "smlouva-sdh-dotakce-2020-05", title: "SDH Krhanice – veřejnoprávní smlouva č. DOTAKCE-2020-05", summary: "SDH Krhanice.", date: "2020-04-30" },
  { slug: "smlouva-tj-sokol-dotcinnost-2020-01", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2020/01", summary: "TJ Sokol Krhanice.", date: "2020-01-22" },
  { slug: "smlouva-tj-sokol-dotcinnost-2019-01", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2019/01", summary: "TJ Sokol Krhanice.", date: "2019-01-17" },
  { slug: "smlouva-tj-sokol-dotcinnost-2018-01", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2018/01", summary: "TJ Sokol Krhanice.", date: "2018-01-26" },
  { slug: "smlouva-tj-sokol-dotcinnost-2017-01", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2017/01", summary: "TJ Sokol Krhanice.", date: "2017-01-25" },
  { slug: "smlouva-tj-sokol-dotcinnost-2016-05", title: "TJ Sokol Krhanice – veřejnoprávní smlouva č. DOTČINNOST/2016/05", summary: "TJ Sokol Krhanice.", date: "2016-02-22" },
  { slug: "smlouva-posazavi-dotcinnost-2015-03", title: "Posázaví o.p.s. – veřejnoprávní smlouva č. DOTČINNOST/2015/03", summary: "Posázaví o.p.s.", date: "2015-10-01" },
];

async function run() {
  const t = client.transaction();
  dokumenty.forEach((i) => {
    t.createOrReplace({
      _id: `uradPost-${i.slug}`,
      _type: "uradPost",
      title: i.title,
      slug: { _type: "slug", current: i.slug },
      summary: i.summary,
      date: i.date,
      category: { _type: "reference", _ref: "uradCategory-dokumenty" },
      subcategory: "rozpocet",
      body: [para(i.summary)],
    });
  });
  smlouvy.forEach((i) => {
    t.createOrReplace({
      _id: `uradPost-${i.slug}`,
      _type: "uradPost",
      title: i.title,
      slug: { _type: "slug", current: i.slug },
      summary: i.summary,
      date: i.date,
      category: { _type: "reference", _ref: "uradCategory-dokumenty" },
      subcategory: "smlouvy",
      body: [para(i.summary)],
    });
  });
  await t.commit();
  console.log(`OK: ${dokumenty.length} dokumenty + ${smlouvy.length} smlouvy published.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
