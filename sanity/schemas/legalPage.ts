import { defineType, defineField } from "sanity";
import { Scale } from "lucide-react";

// Servisní (právní) stránka: ochrana osobních údajů, cookies, prohlášení o
// přístupnosti. Single CZ locale -- no language field. The "Správce webu"
// block is NOT written into the body; it is rendered automatically from
// siteSettings so it stays current everywhere.
export const legalPage = defineType({
  name: "legalPage",
  title: "Servisní stránka",
  type: "document",
  icon: Scale,
  fields: [
    defineField({
      name: "title",
      title: "Titulek",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Naposledy aktualizováno",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Obsah",
      type: "richBody",
      description: "Nadpisy řešte přes Nadpis 2. Blok „Správce webu“ se doplní automaticky z Nastavení webu.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
