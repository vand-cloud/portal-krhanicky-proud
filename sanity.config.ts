"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { table } from "@sanity/table";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { structure, SINGLETON_TYPES } from "./sanity/structure";

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
      prev.filter((t) => !SINGLETON_TYPES.includes(t.schemaType)),
  },
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => !SINGLETON_TYPES.includes(item.templateId)),
  },
});
