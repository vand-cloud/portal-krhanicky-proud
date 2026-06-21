import { defineType, defineArrayMember, defineField } from "sanity";
import { linkAnnotation } from "./shared";

// The single shared rich-text body used by proudPost, blogPost, uradPost
// and legalPage. One editor for everything (per brief §2a): headings
// H2/H3/H4, quote, bold/italic, bullet + numbered lists, link annotation,
// captioned image, table, YouTube embed and a download bar.
export const richBody = defineType({
  name: "richBody",
  title: "Obsah",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Odstavec", value: "normal" },
        { title: "Nadpis 2", value: "h2" },
        { title: "Nadpis 3", value: "h3" },
        { title: "Nadpis 4", value: "h4" },
        { title: "Nadpis 5", value: "h5" },
        { title: "Citace", value: "blockquote" },
      ],
      lists: [
        { title: "Odrážky", value: "bullet" },
        { title: "Číslovaný seznam", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Tučně", value: "strong" },
          { title: "Kurzíva", value: "em" },
        ],
        annotations: [linkAnnotation],
      },
    }),
    defineArrayMember({
      type: "image",
      title: "Obrázek",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternativní text",
          description: "Popis obrázku pro čtečky a SEO.",
        }),
        defineField({
          name: "caption",
          type: "string",
          title: "Popisek pod obrázkem",
        }),
      ],
    }),
    defineArrayMember({ type: "table", title: "Tabulka" }),
    defineArrayMember({ type: "youtube" }),
    defineArrayMember({ type: "fileDownload" }),
  ],
});

// Minimal single-paragraph rich text for the alert bar text and the footer
// disclosure: only normal paragraphs, bold/italic and an inline link
// (so the operator can link the word "Program" or a notice page).
export const inlineRichText = defineType({
  name: "inlineRichText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Odstavec", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Tučně", value: "strong" },
          { title: "Kurzíva", value: "em" },
        ],
        annotations: [linkAnnotation],
      },
    }),
  ],
});
