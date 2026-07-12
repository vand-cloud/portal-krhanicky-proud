import { defineType, defineField } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";

// The six catalog "forms" (place/event/business types). Shared across
// catalogCategory.type, catalogEntry.entryType and catalogTag.applicableForms
// so a category/tag can be scoped to the forms it actually applies to.
const CATALOG_FORMS = ["akce", "mista", "gastro", "obchody", "sluzby", "spolky"];

// Tag used to filter/facet catalog entries in the frontend (e.g. "s dětmi",
// "bezbariérové", "venku"). Manually orderable so Ivan controls display
// order within a group.
export const catalogTag = defineType({
  name: "catalogTag",
  title: "Katalogový štítek",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Název", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "group",
      title: "Skupina",
      type: "string",
      options: {
        list: ["audience", "accessibility", "place-weather", "theme", "price-entry", "gastro"],
      },
    }),
    defineField({
      name: "applicableForms",
      title: "Použitelné pro typy",
      type: "array",
      of: [{ type: "string" }],
      options: { list: CATALOG_FORMS, layout: "tags" },
    }),
    orderRankField({ type: "catalogTag" }),
  ],
  preview: { select: { title: "name", subtitle: "group" } },
});

// Category for the catalog. Mirrors uradCategory (title -> slug ->
// description -> subcategories), but categories of the same name can exist
// across multiple forms (e.g. "Restaurace" under gastro vs. under mista), so
// `type` disambiguates which form a category belongs to.
export const catalogCategory = defineType({
  name: "catalogCategory",
  title: "Katalogová kategorie",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Název", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "type",
      title: "Typ",
      type: "string",
      options: { list: CATALOG_FORMS },
      description: "Určuje, ke kterému typu záznamu (akce, místa, gastro...) kategorie patří.",
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
    orderRankField({ type: "catalogCategory" }),
  ],
  preview: { select: { title: "name", subtitle: "type" } },
});

// Single unified entry type covering all six catalog forms (akce, mista,
// gastro, obchody, sluzby, spolky) instead of six separate schemas -- the
// forms share almost every field, and 159+ hand-migrated records need one
// consistent editing surface. `entryType` is the discriminator the frontend
// and the `category` reference filter both key off.
export const catalogEntry = defineType({
  name: "catalogEntry",
  title: "Katalogový záznam",
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
      name: "entryType",
      title: "Typ",
      type: "string",
      options: { list: CATALOG_FORMS },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "reference",
      to: [{ type: "catalogCategory" }],
      // Categories of the same name exist across multiple forms (type), so
      // without this filter Ivan would see all categories from all six
      // forms mixed together -- unusable. Restrict the picker to categories
      // whose `type` matches this entry's own `entryType`.
      options: {
        filter: ({ document }) => ({
          filter: "type == $t",
          params: { t: (document as { entryType?: string }).entryType ?? null },
        }),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Podkategorie (slug)",
      type: "string",
      description: "Slug podkategorie zvolené kategorie (nepovinné).",
    }),
    defineField({
      name: "tags",
      title: "Štítky",
      type: "array",
      of: [{ type: "reference", to: [{ type: "catalogTag" }] }],
    }),
    defineField({
      name: "description",
      title: "Popis",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hlavní obrázek",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternativní text", type: "string" })],
    }),
    defineField({
      name: "location",
      title: "Poloha",
      type: "geopoint",
      description: "Nepovinné, ne všechny záznamy mají souřadnice.",
    }),
    defineField({ name: "address", title: "Adresa", type: "string" }),
    defineField({
      name: "inVillage",
      title: "V Krhanici nebo osadě",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      title: "Doporučujeme (výběr na hlavní stránce)",
      type: "boolean",
    }),
    defineField({ name: "website", title: "Web", type: "url" }),
    defineField({
      name: "social",
      title: "Sociální sítě",
      type: "object",
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "web", title: "Web", type: "url" }),
      ],
    }),
    defineField({
      name: "startedAt",
      title: "Začátek",
      type: "datetime",
    }),
    defineField({
      name: "endedAt",
      title: "Konec",
      type: "datetime",
    }),
    defineField({ name: "hours", title: "Otevírací doba", type: "string" }),
    defineField({ name: "price", title: "Cena", type: "string" }),
    defineField({ name: "parking", title: "Parkování", type: "string" }),
    defineField({ name: "organizer", title: "Pořadatel", type: "string" }),
    defineField({ name: "contactEmail", title: "Kontaktní e-mail", type: "string" }),
    defineField({ name: "contactPhone", title: "Kontaktní telefon", type: "string" }),
    defineField({
      name: "status",
      title: "Stav",
      type: "string",
      options: { list: ["pending", "approved", "archived"] },
      initialValue: "approved",
    }),
    defineField({
      name: "trustLevel",
      title: "Úroveň důvěryhodnosti",
      type: "string",
      options: { list: ["verified", "scraped", "user_submitted"] },
      initialValue: "verified",
    }),
    defineField({
      name: "relatedEntries",
      title: "Související záznamy",
      type: "array",
      description: "Např. jeden subjekt se dvěma záznamy (hrnčířka s obchodem i workshopem).",
      of: [{ type: "reference", to: [{ type: "catalogEntry" }] }],
    }),
  ],
  // No manual orderRank here on purpose -- unlike Úřad, the catalog has
  // 159+ records, so drag-ordering would be unusable. Alphabetical only.
  orderings: [
    {
      title: "Název (A-Z)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "entryType", media: "heroImage" },
  },
});
