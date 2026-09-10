import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,"")]; })
);
const client = createClient({ projectId: "4nb8kl4e", dataset: "production", apiVersion: "2026-04-27", token: env.SANITY_WRITE_TOKEN, useCdn: false });

const total = await client.fetch(`count(*[_type=="catalogEntry"])`);
const approved = await client.fetch(`count(*[_type=="catalogEntry" && status=="approved"])`);
const pending = await client.fetch(`count(*[_type=="catalogEntry" && status=="pending"])`);
const archived = await client.fetch(`count(*[_type=="catalogEntry" && status=="archived"])`);
const newToday = await client.fetch(`count(*[_type=="catalogEntry" && _id match "catalogEntry-fc20260910-*"])`);
const newApproved = await client.fetch(`count(*[_type=="catalogEntry" && _id match "catalogEntry-fc20260910-*" && status=="approved"])`);
const newPending = await client.fetch(`count(*[_type=="catalogEntry" && _id match "catalogEntry-fc20260910-*" && status=="pending"])`);
const upcomingAkce = await client.fetch(`count(*[_type=="catalogEntry" && entryType=="akce" && status=="approved" && startedAt > now()])`);
console.log({ total, approved, pending, archived, newToday, newApproved, newPending, upcomingAkce });
