import type { StructureResolver, StructureBuilder } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

// Singleton document types: edited as a single document, never listed and
// never offered in the "create new" menu.
export const SINGLETON_TYPES = [
  "siteSettings",
  "programPage",
  "proudPage",
  "blogPage",
  "uradPage",
  "zapojteSePage",
];

function singleton(S: StructureBuilder, type: string, title: string) {
  return S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title));
}

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Obsah")
    .items([
      singleton(S, "siteSettings", "Nastavení webu"),
      S.divider(),
      S.listItem()
        .title("Stránky")
        .child(
          S.list()
            .title("Stránky")
            .items([
              singleton(S, "programPage", "Program"),
              singleton(S, "proudPage", "Proud"),
              singleton(S, "blogPage", "Blog"),
              singleton(S, "uradPage", "Úřad"),
              singleton(S, "zapojteSePage", "Zapojte se"),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Program")
        .child(
          S.list()
            .title("Program")
            .items([
              orderableDocumentListDeskItem({
                type: "proudCategory",
                title: "Kategorie",
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "proudPost",
                title: "Příspěvky",
                S,
                context,
              }),
            ]),
        ),
      S.listItem()
        .title("Blog")
        .child(
          S.list()
            .title("Blog")
            .items([
              orderableDocumentListDeskItem({
                type: "blogCategory",
                title: "Kategorie",
                S,
                context,
              }),
              S.documentTypeListItem("blogPost").title("Příspěvky"),
            ]),
        ),
      S.listItem()
        .title("Úřad")
        .child(
          S.list()
            .title("Úřad")
            .items([
              orderableDocumentListDeskItem({
                type: "uradCategory",
                title: "Kategorie",
                S,
                context,
              }),
              S.documentTypeListItem("uradPost").title("Příspěvky"),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("person").title("Lidé"),
      S.divider(),
      S.documentTypeListItem("legalPage").title("Servisní stránky"),
    ]);
