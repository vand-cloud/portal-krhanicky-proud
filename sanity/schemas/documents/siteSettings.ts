import { defineType, defineField } from "sanity";
import { Settings } from "lucide-react";
import { ICON_OPTIONS } from "@/lib/icons";

// Web-wide singleton: footer disclosure, the single contact identity (who is
// also the site administrator shown on legal pages), social links, SEO
// defaults and the top alert bar.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Nastavení webu",
  type: "document",
  icon: Settings,
  groups: [
    { name: "footer", title: "Patička a kontakt", default: true },
    { name: "social", title: "Sociální sítě" },
    { name: "seo", title: "SEO" },
    { name: "alert", title: "Horní pruh" },
  ],
  fields: [
    defineField({
      name: "footerDisclosure",
      title: "Text v patičce",
      type: "inlineRichText",
      group: "footer",
      description: "Krátké prohlášení v patičce. Můžete vložit odkaz (např. na Program).",
    }),
    defineField({
      name: "contactName",
      title: "Jméno kontaktu / správce",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "contactEmail",
      title: "E-mail",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "contactPhone",
      title: "Telefon",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "addressStreet",
      title: "Ulice a č. p.",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "addressCity",
      title: "PSČ a obec",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "ico",
      title: "IČO",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "social",
      title: "Sociální sítě",
      type: "object",
      group: "social",
      options: { collapsible: false },
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO výchozí hodnoty",
      type: "object",
      group: "seo",
      options: { collapsible: false },
      fields: [
        defineField({
          name: "defaultDescription",
          title: "Výchozí popis",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "ogImage",
          title: "Sdílecí obrázek (OG)",
          type: "image",
        }),
      ],
    }),
    defineField({
      name: "alertBar",
      title: "Horní pruh",
      type: "object",
      group: "alert",
      options: { collapsible: false },
      fields: [
        defineField({
          name: "enabled",
          title: "Zobrazit pruh",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "tone",
          title: "Tón",
          type: "string",
          initialValue: "warning",
          options: {
            list: [
              { value: "warning", title: "Výstraha (oranžová) – děje se něco" },
              { value: "campaign", title: "Kampaň / info (zelená) – např. blíží se volby" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "icon",
          title: "Ikonka",
          type: "string",
          options: { list: [...ICON_OPTIONS] },
        }),
        defineField({
          name: "text",
          title: "Text pruhu",
          type: "inlineRichText",
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Nastavení webu" }),
  },
});
