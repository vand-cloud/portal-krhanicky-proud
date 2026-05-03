import { groq } from "next-sanity";

export const legalPageQuery = groq`
  *[_type == "legalPage" && slug.current == $slug && language == $locale][0] {
    _id,
    title,
    slug,
    language,
    lastUpdated,
    sections[] {
      heading,
      content
    }
  }
`;

export const allLegalPagesQuery = groq`
  *[_type == "legalPage"] {
    _id,
    "slug": slug.current,
    language,
    title
  }
`;
