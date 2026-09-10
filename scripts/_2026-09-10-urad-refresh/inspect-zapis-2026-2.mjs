import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
const env = Object.fromEntries(
  readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("="))
    .map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,"")];})
);
const client = createClient({projectId:"4nb8kl4e", dataset:"production", apiVersion:"2026-04-27", token: env.SANITY_WRITE_TOKEN, useCdn:false});
const doc = await client.fetch('*[_id=="uradPost-zapis-2026-2-zasedani-8-6-2026"][0]{body}');
doc.body.forEach((b, idx) => {
  if (b._type === "block" && b.children) {
    const text = b.children.map(c=>c.text).join("");
    if (text.includes("IV-12-6033714/1") || text.includes("1000,- Kč")) {
      console.log(idx, JSON.stringify(text));
    }
  }
});
