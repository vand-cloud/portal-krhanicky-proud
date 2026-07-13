import type { StructureResolver, StructureBuilder } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

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

const CATALOG_TYPES = [
  { type: "akce", title: "Akce" },
  { type: "mista", title: "Místa" },
  { type: "gastro", title: "Gastro" },
  { type: "obchody", title: "Obchody" },
  { type: "sluzby", title: "Služby" },
  { type: "spolky", title: "Spolky" },
];

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
        .id("section-stranky")
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
        .id("section-program")
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
        .id("section-blog")
        .child(
          S.list()
            .title("Blog")
            .items([
              orderableDocumentListDeskItem({ type: "blogCategory", title: "Kategorie", S, context }),
              S.listItem()
                .title("Příspěvky")
                .id("blog-prispevky")
                .child(
                  S.documentTypeList("blogPost")
                    .title("Příspěvky")
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
        .id("section-urad")
        .child(
          S.list()
            .title("Úřad")
            .items([
              orderableDocumentListDeskItem({ type: "uradCategory", title: "Kategorie", S, context }),
              S.listItem()
                .title("Příspěvky")
                .id("urad-prispevky")
                .child(
                  S.documentTypeList("uradPost")
                    .title("Příspěvky")
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
      S.listItem()
        .title("Katalog")
        .id("section-katalog")
        .child(
          S.list()
            .title("Katalog")
            .items([
              ...CATALOG_TYPES.map(({ type, title }) =>
                S.listItem()
                  .title(title)
                  .id(`katalog-${type}`)
                  .child(
                    S.documentList()
                      .id(`katalog-${type}-list`)
                      .title(title)
                      .filter('_type == "catalogEntry" && entryType == $type')
                      .params({ type })
                      .initialValueTemplates([S.initialValueTemplateItem(`catalogEntry-${type}`)]),
                  ),
              ),
              S.divider(),
              S.listItem()
                .title("Ke schválení")
                .id("katalog-pending")
                .child(
                  S.documentList()
                    .id("katalog-pending-list")
                    .title("Ke schválení")
                    .filter('_type == "catalogEntry" && status == "pending"'),
                ),
              S.divider(),
              orderableDocumentListDeskItem({ type: "catalogCategory", title: "Kategorie", S, context }),
              orderableDocumentListDeskItem({ type: "catalogTag", title: "Štítky", S, context }),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("person").title("Lidé"),
      S.divider(),
      S.documentTypeListItem("legalPage").title("Servisní stránky"),
    ]);
};