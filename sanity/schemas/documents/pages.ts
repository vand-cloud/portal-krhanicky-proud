import { defineType, defineField } from "sanity";
import { FileText } from "lucide-react";
import { ICON_OPTIONS } from "@/lib/icons";

// Header/intro singletons for the main sections. Each is a single editable
// document (no "create new").

export const programPage = defineType({
  name: "programPage",
  title: "Stránka: Program",
  type: "document",
  icon: FileText,
  fields: [
    defineField({ name: "eyebrow", title: "Nadřazený nadpis (eyebrow)", type: "string" }),
    defineField({ name: "title", title: "Titulek", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Podtitulek", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "Stránka: Program" }) },
});

export const proudPage = defineType({
  name: "proudPage",
  title: "Stránka: Proud",
  type: "document",
  icon: FileText,
  fields: [
    defineField({ name: "eyebrow", title: "Nadřazený nadpis (eyebrow)", type: "string" }),
    defineField({ name: "title", title: "Titulek", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Podtitulek", type: "text", rows: 3 }),
    defineField({ name: "pillarsTitle", title: "Hodnoty: nadpis", type: "string" }),
    defineField({
      name: "pillars",
      title: "Hodnoty / pilíře (max 4)",
      type: "array",
      validation: (rule) => rule.max(4),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Titulek", type: "string" }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        },
      ],
    }),
    defineField({ name: "highlightsEyebrow", title: "Střípky: eyebrow", type: "string" }),
    defineField({ name: "highlightsTitle", title: "Střípky: titulek", type: "string" }),
    defineField({
      name: "highlights",
      title: "Střípky z programu (max 4)",
      type: "array",
      validation: (rule) => rule.max(4),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Titulek", type: "string" }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Stránka: Proud" }) },
});

export const blogPage = defineType({
  name: "blogPage",
  title: "Stránka: Blog",
  type: "document",
  icon: FileText,
  fields: [
    defineField({ name: "eyebrow", title: "Nadřazený nadpis (eyebrow)", type: "string" }),
    defineField({ name: "title", title: "Titulek", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", title: "Úvodní text", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "Stránka: Blog" }) },
});

export const uradPage = defineType({
  name: "uradPage",
  title: "Stránka: Úřad",
  type: "document",
  icon: FileText,
  fields: [
    defineField({ name: "eyebrow", title: "Nadřazený nadpis (eyebrow)", type: "string" }),
    defineField({ name: "title", title: "Titulek", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Podtitulek", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "Stránka: Úřad" }) },
});

export const zapojteSePage = defineType({
  name: "zapojteSePage",
  title: "Stránka: Zapojte se",
  type: "document",
  icon: FileText,
  fields: [
    defineField({ name: "eyebrow", title: "Nadřazený nadpis (eyebrow)", type: "string" }),
    defineField({ name: "title", title: "Titulek", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Podtitulek", type: "text", rows: 3 }),
    defineField({
      name: "cards",
      title: "Karty (4)",
      type: "array",
      validation: (rule) => rule.max(4),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Ikonka",
              type: "string",
              options: { list: [...ICON_OPTIONS] },
            }),
            defineField({ name: "title", title: "Titulek", type: "string" }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        },
      ],
    }),
    defineField({
      name: "contactBlock",
      title: "Blok „Pište nám“",
      type: "object",
      options: { collapsible: false },
      fields: [
        defineField({ name: "title", title: "Titulek", type: "string" }),
        defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
        defineField({ name: "buttonLabel", title: "Text tlačítka", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Stránka: Zapojte se" }) },
});
