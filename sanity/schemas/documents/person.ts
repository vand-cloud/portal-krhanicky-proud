import { defineType, defineField } from "sanity";

// One shared person for the whole site: the same record can be a councillor,
// a Proud member, a 2026 candidate and an author at once (affiliations is an
// array). Candidate and council listings are ordered independently via two
// numeric fields, because one person can appear in both ordered contexts and
// a single drag-rank cannot serve both.
export const person = defineType({
  name: "person",
  title: "Člověk",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Jméno",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Funkce / role",
      type: "string",
      description: "Krátký popis do seznamu, např. „Starosta“ nebo „Lídryně kandidátky“.",
    }),
    defineField({
      name: "affiliations",
      title: "Štítky",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { value: "zastupitel", title: "Zastupitel" },
          { value: "proud-clen", title: "Člen Krhanického Proudu" },
          { value: "kandidat-2026", title: "Kandidát voleb 2026" },
          { value: "redaktor", title: "Redaktor" },
        ],
      },
    }),
    defineField({
      name: "bio",
      title: "Medailonek",
      type: "text",
      rows: 4,
      description: "Delší popis na detailové stránce.",
    }),
    defineField({
      name: "photo",
      title: "Fotografie",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "contact",
      title: "Kontakt",
      type: "personContact",
    }),
    defineField({
      name: "visibility",
      title: "Viditelnost profilu",
      type: "string",
      initialValue: "public",
      options: {
        list: [
          { value: "public", title: "Veřejný (s odkazem na profil)" },
          { value: "internal", title: "Jen jako kontakt (bez profilu)" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "candidateOrder",
      title: "Pořadí na kandidátce",
      type: "number",
      description: "Vyplňte jen u kandidátů 2026. Nižší číslo = výš v seznamu.",
      hidden: ({ parent }) =>
        !(parent?.affiliations as string[] | undefined)?.includes("kandidat-2026"),
    }),
    defineField({
      name: "councilOrder",
      title: "Pořadí mezi zastupiteli",
      type: "number",
      description: "Vyplňte jen u zastupitelů. Nižší číslo = výš v seznamu.",
      hidden: ({ parent }) =>
        !(parent?.affiliations as string[] | undefined)?.includes("zastupitel"),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
