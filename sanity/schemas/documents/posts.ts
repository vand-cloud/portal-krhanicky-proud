import { defineType, defineField } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";

// Programme post: a policy idea / manifesto entry. Manually orderable
// (drag); listed under its category. Detail order: category eyebrow ->
// title -> big lead (description) -> cover -> author byline -> body.
export const proudPost = defineType({
  name: "proudPost",
  title: "Programový příspěvek",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titulek", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Náhledový obrázek",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternativní text", type: "string" })],
    }),
    defineField({
      name: "description",
      title: "Popis / perex",
      type: "text",
      rows: 3,
      description: "Zobrazí se v seznamu i jako perex v detailu.",
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "reference",
      to: [{ type: "proudCategory" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Autor / za návrhem stojí",
      type: "reference",
      to: [{ type: "person" }],
    }),
    defineField({ name: "body", title: "Tělo", type: "richBody" }),
    orderRankField({ type: "proudPost" }),
  ],
  preview: {
    select: { title: "title", subtitle: "category.name", media: "coverImage" },
  },
});

// Blog post: standard article. Listed newest-first by publishedAt (no manual
// order). readingTime is computed at render time from the body length.
export const blogPost = defineType({
  name: "blogPost",
  title: "Blogový příspěvek",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titulek", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Náhledový obrázek",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternativní text", type: "string" })],
    }),
    defineField({ name: "excerpt", title: "Perex", type: "text", rows: 3 }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "person" }],
    }),
    defineField({
      name: "categories",
      title: "Kategorie",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blogCategory" }] }],
    }),
    defineField({
      name: "tags",
      title: "Štítky",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Volně psané štítky.",
    }),
    defineField({
      name: "publishedAt",
      title: "Datum publikace",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "relatedPosts",
      title: "Související články (max 3)",
      type: "array",
      validation: (rule) => rule.max(3),
      of: [{ type: "reference", to: [{ type: "blogPost" }] }],
    }),
    defineField({ name: "body", title: "Tělo", type: "richBody" }),
  ],
  orderings: [
    {
      title: "Datum publikace (nejnovější)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "coverImage" },
  },
});

// Úřední novinka / dokument: dated, no cover, no author. Documents to
// download are uradPosts with a fileDownload block in the body.
export const uradPost = defineType({
  name: "uradPost",
  title: "Úřední příspěvek",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titulek", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Datum",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Krátký popis (do seznamu)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "reference",
      to: [{ type: "uradCategory" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Podkategorie (slug)",
      type: "string",
      description: "Slug podkategorie zvolené kategorie (nepovinné).",
    }),
    defineField({ name: "body", title: "Tělo", type: "richBody" }),
  ],
  orderings: [
    {
      title: "Datum (nejnovější)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "date" },
  },
});
