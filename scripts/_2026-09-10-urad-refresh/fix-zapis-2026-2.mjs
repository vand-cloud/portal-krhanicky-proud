import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
const env = Object.fromEntries(
  readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("="))
    .map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,"")];})
);
const client = createClient({projectId:"4nb8kl4e", dataset:"production", apiVersion:"2026-04-27", token: env.SANITY_WRITE_TOKEN, useCdn:false});
const docId = "uradPost-zapis-2026-2-zasedani-8-6-2026";
const doc = await client.fetch('*[_id==$id][0]{body}', {id: docId});
const b231 = doc.body[231];
const b241 = doc.body[241];
console.log("block231 key:", b231._key, "childKey:", b231.children[0]._key);
console.log("block241 key:", b241._key, "childKey:", b241.children[0]._key);

const fixed231 = b231.children[0].text.replace(
  "služebnosti č. IV-12-6033714/1 na pozemcích",
  "služebnosti č. IV-12-6033714/1 Krhanice na pozemcích"
);
const fixed241 = b241.children[0].text.replace("1000,- Kč/m².", "1000,- Kč/1 m².");

if (fixed231 === b231.children[0].text) throw new Error("block231 replace did not match!");
if (fixed241 === b241.children[0].text) throw new Error("block241 replace did not match!");

await client
  .patch(docId)
  .set({
    [`body[_key=="${b231._key}"].children[_key=="${b231.children[0]._key}"].text`]: fixed231,
    [`body[_key=="${b241._key}"].children[_key=="${b241.children[0]._key}"].text`]: fixed241,
  })
  .commit();

console.log("PATCHED.");
console.log("231 ->", fixed231);
console.log("241 ->", fixed241);
