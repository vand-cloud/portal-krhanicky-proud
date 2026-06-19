import { defineType, defineField } from "sanity";

// File-to-download block for richBody (e.g. úřední dokument: vyhláška,
// rozpočet). Renders as the full-width FileDownload bar. Size is read from
// the uploaded asset's metadata at query time, so it is not a manual field.
export const fileDownload = defineType({
  name: "fileDownload",
  title: "Soubor ke stažení",
  type: "object",
  fields: [
    defineField({
      name: "file",
      title: "Soubor",
      type: "file",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Název dokumentu",
      type: "string",
      description: "Co se zobrazí v liště, např. „Vyhláška č. 1/2026 o nočním klidu“.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fileType",
      title: "Typ souboru",
      type: "string",
      description: "Nepovinné, např. PDF. Když necháte prázdné, odvodí se z přípony.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "fileType" },
  },
});
