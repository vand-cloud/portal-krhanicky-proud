import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
const env = Object.fromEntries(
  readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("="))
    .map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,"")];})
);
const client = createClient({projectId:"4nb8kl4e", dataset:"production", apiVersion:"2026-04-27", token: env.SANITY_WRITE_TOKEN, useCdn:false});
const zapisy = await client.fetch('*[_type=="uradPost" && (title match "Zápis*" || title match "*zápis*")]|order(date desc){title,date,"category":category->title,subcategory}');
console.log("ZAPISY count:", zapisy.length);
console.log(JSON.stringify(zapisy.slice(0,10), null, 2));
const usneseni = await client.fetch('*[_type=="uradPost" && title match "*Usnesení*"]|order(date desc){title,date,"category":category->title,subcategory}');
console.log("USNESENI count:", usneseni.length);
console.log(JSON.stringify(usneseni.slice(0,5), null, 2));
const byCat = await client.fetch('*[_type=="uradPost"]{"cat":category->title,subcategory}');
const tally = {};
for (const d of byCat) { const k = d.cat + (d.subcategory ? " / " + d.subcategory : ""); tally[k] = (tally[k]||0)+1; }
console.log("BY CATEGORY:", JSON.stringify(tally, null, 2));
