/* eslint-disable no-console */
// Applies catalogue provenance after the 2026-07-13 verification pass:
//  - sets sourceUrl + sourceLabel on every entry that has a verifiable source
//    (98 backfilled from existing website/harvest data + 59 found by the
//    verification agents),
//  - archives the 2 entries no source could be found for (fabricated demo:
//    "Hasičský ples pod hvězdami", "Tank pro děti") by flipping status to
//    "archived" (reversible; the read query only serves status=="approved"),
//  - strips a fabricated sentence (fake pub "U Hraběte") from the otherwise
//    real "Anenská zábava" event description.
// Idempotent: pure patch .set() calls. Source data lives in the scratchpad
// JSONs produced by the verification run.
//
// Run: node_modules/.bin/tsx scripts/apply-sources-2026-07-13.ts
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SP = __dirname; // JSONs live next to this script (committed for audit)

const env = Object.fromEntries(
  readFileSync(resolve(process.cwd(), ".env.local"), "utf8")
    .split("\n").filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,"")]; }),
);
const client = createClient({ projectId: "4nb8kl4e", dataset: "production", apiVersion: "2026-04-27", token: env.SANITY_WRITE_TOKEN, useCdn: false });

type Src = { id: string; sourceUrl: string; sourceLabel: string };

const backfill: Src[] = JSON.parse(readFileSync(`${SP}/catalog-sources-backfill-2026-07-13.json`, "utf8"));
const verify: Array<{ id: string; sourceUrl: string | null; sourceLabel: string | null; confidence: string }>
  = JSON.parse(readFileSync(`${SP}/catalog-sources-verified-2026-07-13.json`, "utf8"));

// Overrides for the 3 dead / wrong URLs the check turned up (NXDOMAIN own
// sites replaced with working registry/catalogue/portal pages).
const OVERRIDE: Record<string, { sourceUrl: string; sourceLabel: string }> = {
  "catalogEntry-sv-antelek": {
    sourceUrl: "https://najisto.centrum.cz/elektronika/audiovizualni-technika/anteny-a-satelitni-technika/region/stredocesky/benesov/",
    sourceLabel: "Najisto.cz (antény Benešovsko)",
  },
  "catalogEntry-sv-denny-rose": {
    sourceUrl: "https://rejstrik.penize.cz/29191726-dero-s-r-o",
    sourceLabel: "Obchodní rejstřík (Dero s.r.o.)",
  },
  "catalogEntry-pl-mlyn-brejlov": {
    sourceUrl: "https://tynec.posazavi.com/cz/Service/Service.aspx?Id=1187",
    sourceLabel: "Posázaví (turistický portál)",
  },
};

// Build id -> {sourceUrl, sourceLabel}
const sourceMap = new Map<string, { sourceUrl: string; sourceLabel: string }>();
for (const b of backfill) sourceMap.set(b.id, { sourceUrl: b.sourceUrl, sourceLabel: b.sourceLabel });
for (const v of verify) {
  if (v.sourceUrl) sourceMap.set(v.id, { sourceUrl: v.sourceUrl, sourceLabel: v.sourceLabel || "Zdroj" });
}
for (const [id, o] of Object.entries(OVERRIDE)) sourceMap.set(id, o);

// Entries with no source found -> archive.
const archiveIds = verify.filter((v) => !v.sourceUrl).map((v) => v.id);

// Description fixes (fabricated detail removed).
const DESCRIPTION_FIX: Record<string, string> = {
  "catalogEntry-evt-anenska-zabava-2026":
    "Letní zábava na sokolském hřišti. Živá hudba do pozdních hodin, taneční parket pod širým nebem, klasická česká kuchyně, čepované pivo a domácí limonády.",
};

async function run() {
  const t = client.transaction();
  for (const [id, s] of sourceMap) {
    t.patch(id, (p) => p.set({ sourceUrl: s.sourceUrl, sourceLabel: s.sourceLabel }));
  }
  for (const id of archiveIds) {
    t.patch(id, (p) => p.set({ status: "archived" }));
  }
  for (const [id, desc] of Object.entries(DESCRIPTION_FIX)) {
    t.patch(id, (p) => p.set({ description: desc }));
  }
  await t.commit();
  console.log(`OK: ${sourceMap.size} sources set, ${archiveIds.length} archived (${archiveIds.join(", ")}), ${Object.keys(DESCRIPTION_FIX).length} descriptions cleaned.`);
}
run().catch((e) => { console.error(e); process.exit(1); });
