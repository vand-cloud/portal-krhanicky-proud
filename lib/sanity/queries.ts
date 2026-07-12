import { groq } from "next-sanity";

// ── Reusable projections ─────────────────────────────────────────────────────
const PERSON_FULL = groq`
  "id": _id, name, shortName, "slug": slug.current, role, bio, affiliations, visibility,
  "photo": photo.asset->url,
  "contactEmail": contact.email,
  "contactPhone": contact.phone,
  "social": {
    "facebook": contact.facebook,
    "instagram": contact.instagram,
    "linkedin": contact.linkedin,
    "youtube": contact.youtube,
    "web": contact.web
  }
`;

// Body projection that resolves fileDownload file assets to a URL + size +
// extension (so the FileDownload bar can show "PDF · 1,2 MB"). All other
// block/object types pass through unchanged.
const BODY = groq`body[]{
  ...,
  _type == "fileDownload" => {
    ...,
    "fileUrl": file.asset->url,
    "fileSize": file.asset->size,
    "fileExtension": file.asset->extension
  }
}`;

// Blog list / related card fields (raw body kept only for reading-time).
const BLOG_CARD = groq`
  "id": _id, title, "slug": slug.current, excerpt, publishedAt,
  "author": author->name,
  "authorShortName": author->shortName,
  "authorSlug": author->slug.current,
  "authorVisibility": author->visibility,
  "categories": categories[]->slug.current,
  "categoryLabels": categories[]->{ "slug": slug.current, "label": title },
  tags,
  "heroImage": coverImage.asset->url,
  body
`;

// ── Singletons ───────────────────────────────────────────────────────────────
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    footerDisclosure, contactName, contactEmail, contactPhone,
    addressStreet, addressCity, ico,
    social,
    "seo": { "defaultDescription": seo.defaultDescription, "ogImage": seo.ogImage.asset->url },
    alertBar
  }
`;

export const programPageQuery = groq`*[_type == "programPage"][0]{ eyebrow, title, subtitle }`;
export const proudPageQuery = groq`*[_type == "proudPage"][0]{
  eyebrow, title, subtitle, pillarsTitle, pillars, highlightsEyebrow, highlightsTitle, highlights
}`;
export const blogPageQuery = groq`*[_type == "blogPage"][0]{ eyebrow, title, intro }`;
export const uradPageQuery = groq`*[_type == "uradPage"][0]{ eyebrow, title, subtitle }`;
export const zapojteSePageQuery = groq`*[_type == "zapojteSePage"][0]{
  eyebrow, title, subtitle, cards, contactBlock
}`;

// ── People ───────────────────────────────────────────────────────────────────
export const candidatesQuery = groq`
  *[_type == "person" && "kandidat-2026" in affiliations] | order(candidateOrder asc, name asc){
    ${PERSON_FULL}
  }
`;
export const councillorsQuery = groq`
  *[_type == "person" && "zastupitel" in affiliations] | order(councilOrder asc, name asc){
    ${PERSON_FULL}
  }
`;
export const personBySlugQuery = groq`
  *[_type == "person" && slug.current == $slug][0]{ ${PERSON_FULL} }
`;

// ── Program ──────────────────────────────────────────────────────────────────
export const proudCategoriesQuery = groq`
  *[_type == "proudCategory"] | order(orderRank){
    "slug": slug.current, "label": name, "description": subtitle
  }
`;
export const proudPostsQuery = groq`
  *[_type == "proudPost"] | order(orderRank){
    "id": _id, title, "slug": slug.current, description,
    "category": category->slug.current, "categoryLabel": category->name,
    "heroImage": coverImage.asset->url,
    "author": author->{ name, shortName, role, "slug": slug.current, visibility }
  }
`;
export const proudPostBySlugQuery = groq`
  *[_type == "proudPost" && slug.current == $slug][0]{
    "id": _id, title, "slug": slug.current, description,
    "category": category->slug.current, "categoryLabel": category->name,
    "heroImage": coverImage.asset->url,
    "author": author->{ name, shortName, role, "slug": slug.current, visibility },
    ${BODY}
  }
`;

// ── Blog ─────────────────────────────────────────────────────────────────────
export const blogCategoriesQuery = groq`
  *[_type == "blogCategory"] | order(orderRank){ "slug": slug.current, "label": title }
`;
export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc){ ${BLOG_CARD} }
`;
export const blogSlugsQuery = groq`*[_type == "blogPost"]{ "slug": slug.current }`;
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0]{
    "id": _id, title, "slug": slug.current, excerpt, publishedAt,
    "author": author->name,
    "authorShortName": author->shortName,
    "authorSlug": author->slug.current,
    "authorVisibility": author->visibility,
    "categories": categories[]->slug.current,
    "categoryLabels": categories[]->{ "slug": slug.current, "label": title },
    tags,
    "heroImage": coverImage.asset->url,
    ${BODY},
    "related": relatedPosts[]->{ ${BLOG_CARD} }
  }
`;

// ── Úřad ─────────────────────────────────────────────────────────────────────
export const uradCategoriesQuery = groq`
  *[_type == "uradCategory"] | order(orderRank){
    "slug": slug.current, "label": title, description,
    "subcategories": subcategories[]{ "slug": slug.current, "label": title, description }
  }
`;
export const uradPostsQuery = groq`
  *[_type == "uradPost"] | order(date desc){
    "id": _id, title, "slug": slug.current, summary, date,
    "category": category->slug.current, subcategory
  }
`;
export const uradSlugsQuery = groq`*[_type == "uradPost"]{ "slug": slug.current }`;
export const uradPostBySlugQuery = groq`
  *[_type == "uradPost" && slug.current == $slug][0]{
    "id": _id, title, "slug": slug.current, summary, date,
    "category": category->slug.current, subcategory, ${BODY}
  }
`;

// ── Legal ────────────────────────────────────────────────────────────────────
export const legalPageQuery = groq`
  *[_type == "legalPage" && slug.current == $slug][0]{
    title, "slug": slug.current, lastUpdated, ${BODY}
  }
`;
export const allLegalPagesQuery = groq`
  *[_type == "legalPage"]{ "slug": slug.current, title }
`;
