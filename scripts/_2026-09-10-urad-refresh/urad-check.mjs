import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
const env = Object.fromEntries(
  readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("="))
    .map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,"")];})
);
const client = createClient({projectId:"4nb8kl4e", dataset:"production", apiVersion:"2026-04-27", token: env.SANITY_WRITE_TOKEN, useCdn:false});
const cats = await client.fetch('*[_type=="uradCategory"]{_id,title,"slug":slug.current,subcategories[]{title,"slug":slug.current}}');
console.log(JSON.stringify(cats, null, 2));
const count = await client.fetch('count(*[_type=="uradPost"])');
const latest = await client.fetch('*[_type=="uradPost"]|order(date desc)[0...8]{title,date,"category":category->title,subcategory}');
const oldest = await client.fetch('*[_type=="uradPost"]|order(date asc)[0...3]{title,date}');
console.log("count:", count);
console.log("latest:", JSON.stringify(latest, null, 2));
console.log("oldest:", JSON.stringify(oldest, null, 2));
