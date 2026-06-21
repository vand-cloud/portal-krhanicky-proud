/* eslint-disable no-console */
// Downloads every usnesení PDF from usneseni-manifest.json into
// scripts/zapisy-pdf/usneseni-<rok>-<cislo>.pdf. Idempotent.
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "zapisy-pdf");
const BASE = "https://www.obeckrhanice.cz/file.php?nid=714&oid=";

type Entry = { cislo: string; rok: string; oid: string };

async function run() {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
  const manifest: Entry[] = JSON.parse(readFileSync(resolve(__dirname, "usneseni-manifest.json"), "utf8"));
  for (const e of manifest) {
    const file = resolve(OUT, `usneseni-${e.rok}-${e.cislo}.pdf`);
    if (existsSync(file) && statSync(file).size > 1000) {
      console.log("skip ", `usneseni-${e.rok}-${e.cislo}.pdf`, `${statSync(file).size}B`);
      continue;
    }
    const res = await fetch(`${BASE}${e.oid}`);
    if (!res.ok) {
      console.error("FAIL", `usneseni-${e.rok}-${e.cislo}`, res.status);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(file, buf);
    console.log("saved", `usneseni-${e.rok}-${e.cislo}.pdf`, `${buf.length}B`);
  }
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
