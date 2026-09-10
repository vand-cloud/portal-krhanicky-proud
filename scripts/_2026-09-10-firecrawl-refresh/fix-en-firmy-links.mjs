import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n").filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,"")]; })
);
const client = createClient({ projectId: "4nb8kl4e", dataset: "production", apiVersion: "2026-04-27", token: env.SANITY_WRITE_TOKEN, useCdn: false });

const bad = await client.fetch(`*[_type=="catalogEntry" && sourceUrl match "en.firmy.cz*"]{_id, title, sourceUrl}`);
console.log(`Found ${bad.length} records with en.firmy.cz sourceUrl`);
for (const doc of bad) {
  const fixed = doc.sourceUrl.replace("en.firmy.cz/company/", "www.firmy.cz/detail/");
  console.log(`  ${doc.title}: ${doc.sourceUrl} -> ${fixed}`);
  await client.patch(doc._id).set({ sourceUrl: fixed }).commit();
}
console.log("Done.");
