import { defineType, defineField } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";

// Categories for Program, Blog and Úřad. All manually orderable (drag) in
// Studio via orderRank.

export const proudCategory = defineType({
  name: "proudCategory",
  title: "Programová kategorie",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Název (zobrazí se jako eyebrow)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Podtitulek (nepovinný)",
      type: "text",
      rows: 2,
      description: "Když necháte prázdné, podtitulek se nezobrazí.",
    }),
    orderRankField({ type: "proudCategory" }),
  ],
  preview: { select: { title: "name", subtitle: "subtitle" } },
});

export const blogCategory = defineType({
  name: "blogCategory",
  title: "Bloková kategorie",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Název",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    orderRankField({ type: "blogCategory" }),
  ],
  preview: { select: { title: "title" } },
});

export const uradCategory = defineType({
  name: "uradCategory",
  title: "Úřední kategorie",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Název",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Úvodní text kategorie",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "subcategories",
      title: "Podkategorie",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Název", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "slug",
              title: "Slug",
              type: "slug",
              options: { source: "title", maxLength: 96 },
              validation: (r) => r.required(),
            }),
            defineField({ name: "description", title: "Popis", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    orderRankField({ type: "uradCategory" }),
  ],
  preview: { select: { title: "title" } },
});
