"use client";

import { defineConfig } from "sanity";
import type { Template } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { table } from "@sanity/table";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { structure, SINGLETON_TYPES } from "./sanity/structure";

// One initial-value template per catalog form, so "New document" inside a
// filtered list (see sanity/structure.ts "Katalog") pre-fills entryType and
// Ivan never has to pick it manually.
const CATALOG_ENTRY_TEMPLATES: Template[] = [
  { id: "catalogEntry-akce", title: "Akce", schemaType: "catalogEntry" },
  { id: "catalogEntry-mista", title: "Místa", schemaType: "catalogEntry" },
  { id: "catalogEntry-gastro", title: "Gastro", schemaType: "catalogEntry" },
  { id: "catalogEntry-obchody", title: "Obchody", schemaType: "catalogEntry" },
  { id: "catalogEntry-sluzby", title: "Služby", schemaType: "catalogEntry" },
  { id: "catalogEntry-spolky", title: "Spolky", schemaType: "catalogEntry" },
].map((base) => ({
  ...base,
  value: {
    entryType: base.id.replace("catalogEntry-", ""),
    status: "approved",
    trustLevel: "verified",
    inVillage: false,
  },
}));

export default defineConfig({
  name: "default",
  title: "Krhanický Proud",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    table(),
  ],
  schema: {
    types: schemaTypes,
    // Keep singletons out of the global "create new" menu -- they are
    // edited as a single document via the structure.
    templates: (prev) =>
      prev
        .filter((t) => !SINGLETON_TYPES.includes(t.schemaType))
        .concat(CATALOG_ENTRY_TEMPLATES),
  },
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => !SINGLETON_TYPES.includes(item.templateId)),
  },
});
