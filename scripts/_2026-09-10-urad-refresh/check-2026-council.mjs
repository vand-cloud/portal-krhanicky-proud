import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
const env = Object.fromEntries(
  readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("="))
    .map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,"")];})
);
const client = createClient({projectId:"4nb8kl4e", dataset:"production", apiVersion:"2026-04-27", token: env.SANITY_WRITE_TOKEN, useCdn:false});
const docs = await client.fetch('*[_type=="uradPost" && category._ref=="uradCategory-zastupitelstvo" && subcategory=="archiv-schuzi" && title match "*2026*"]{_id,title,date,"hasFile":count(body[_type=="fileDownload"])>0}|order(date asc)');
console.log(JSON.stringify(docs, null, 2));
// also check aktuality + uredni-deska + dokumenty latest dates
const latestByCategory = await client.fetch(`{
  "aktuality": *[_type=="uradPost" && category._ref=="uradCategory-aktuality"]|order(date desc)[0...3]{title,date},
  "uredniDeska": *[_type=="uradPost" && category._ref=="uradCategory-uredni-deska"]|order(date desc)[0...3]{title,date},
  "dokumentyRozpocet": *[_type=="uradPost" && category._ref=="uradCategory-dokumenty" && subcategory=="rozpocet"]|order(date desc)[0...3]{title,date},
  "dokumentySmlouvy": *[_type=="uradPost" && category._ref=="uradCategory-dokumenty" && subcategory=="smlouvy"]|order(date desc)[0...3]{title,date},
  "dokumentyVyhlasky": *[_type=="uradPost" && category._ref=="uradCategory-dokumenty" && subcategory=="vyhlasky"]|order(date desc)[0...3]{title,date}
}`);
console.log(JSON.stringify(latestByCategory, null, 2));
