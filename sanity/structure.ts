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

type Cat = { _id: string; title: string };

// Fetch all categories upfront so the structure is built synchronously —
// orderableDocumentListDeskItem requires a synchronous call context.
export const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({ apiVersion: "2024-01-01" });
  const [proudCats, blogCats, uradCats] = await Promise.all([
    client.fetch<Cat[]>(`*[_type == "proudCategory"] | order(orderRank) { _id, "title": name }`),
    client.fetch<Cat[]>(`*[_type == "blogCategory"] | order(orderRank) { _id, title }`),
    client.fetch<Cat[]>(`*[_type == "uradCategory"] | order(orderRank) { _id, title }`),
  ]);

  return S.list()
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
              orderableDocumentListDeskItem({ type: "proudCategory", title: "Kategorie", S, context }),
              orderableDocumentListDeskItem({ type: "proudPost", title: "Příspěvky", S, context }),
              ...proudCats.map((cat) =>
                S.listItem()
                  .title(`  › ${cat.title}`)
                  .id(`proud-cat-${cat._id}`)
                  .child(
                    S.documentList()
                      .id(`proud-list-${cat._id}`)
                      .title(cat.title)
                      .filter('_type == "proudPost" && category._ref == $catId')
                      .params({ catId: cat._id })
                      .defaultOrdering([{ field: "orderRank", direction: "asc" }]),
                  ),
              ),
            ]),
        ),
      S.listItem()
        .title("Blog")
        .child(
          S.list()
            .title("Blog")
            .items([
              orderableDocumentListDeskItem({ type: "blogCategory", title: "Kategorie", S, context }),
              S.listItem()
                .title("Příspěvky")
                .id("blog-posts-all")
                .child(
                  S.documentList()
                    .id("blog-list-all")
                    .title("Příspěvky")
                    .filter('_type == "blogPost"')
                    .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                ),
              ...blogCats.map((cat) =>
                S.listItem()
                  .title(`  › ${cat.title}`)
                  .id(`blog-cat-${cat._id}`)
                  .child(
                    S.documentList()
                      .id(`blog-list-${cat._id}`)
                      .title(cat.title)
                      .filter('_type == "blogPost" && $catId in categories[]._ref')
                      .params({ catId: cat._id })
                      .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                  ),
              ),
            ]),
        ),
      S.listItem()
        .title("Úřad")
        .child(
          S.list()
            .title("Úřad")
            .items([
              orderableDocumentListDeskItem({ type: "uradCategory", title: "Kategorie", S, context }),
              S.listItem()
                .title("Příspěvky")
                .id("urad-posts-all")
                .child(
                  S.documentList()
                    .id("urad-list-all")
                    .title("Příspěvky")
                    .filter('_type == "uradPost"')
                    .defaultOrdering([{ field: "date", direction: "desc" }]),
                ),
              ...uradCats.map((cat) =>
                S.listItem()
                  .title(`  › ${cat.title}`)
                  .id(`urad-cat-${cat._id}`)
                  .child(
                    S.documentList()
                      .id(`urad-list-${cat._id}`)
                      .title(cat.title)
                      .filter('_type == "uradPost" && category._ref == $catId')
                      .params({ catId: cat._id })
                      .defaultOrdering([{ field: "date", direction: "desc" }]),
                  ),
              ),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("person").title("Lidé"),
      S.divider(),
      S.documentTypeListItem("legalPage").title("Servisní stránky"),
    ]);
};