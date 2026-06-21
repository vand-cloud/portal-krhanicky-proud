// View-model types returned by the server fetchers in lib/sanity/fetch.ts.
// They mirror the shapes the (originally content/*.ts-driven) components
// expect, but with Sanity images already resolved to URL strings and a
// PortableText `body` added for detail pages. Categories are plain
// {slug,label} pairs (no hardcoded enums) so the editor can rename/add/reorder.
import type { PortableTextBlock } from "@portabletext/types";

export type RichBody = PortableTextBlock[];

export interface CategoryVM {
  slug: string;
  label: string;
  description?: string;
}

export interface UradCategoryVM extends CategoryVM {
  subcategories: { slug: string; label: string; description?: string }[];
}

export interface PersonVM {
  id: string;
  slug: string;
  name: string;
  role?: string;
  bio?: string;
  affiliations: string[];
  affiliationLabels: string[];
  visibility: "public" | "internal";
  photo?: string;
  contactEmail?: string;
  contactPhone?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    web?: string;
  };
}

// One row in the programme rozcestník: either a policy/manifesto post or a
// candidate card (isCandidate).
export interface ProudItemVM {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category: string;
  categoryLabel: string;
  href: string;
  isCandidate: boolean;
  personPhoto?: string;
  heroImage?: string;
  author?: { name: string; role?: string } | null;
  body?: RichBody;
}

export interface BlogPostVM {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  author?: string;
  categories: string[];
  categoryLabels: { slug: string; label: string }[];
  tags: string[];
  href: string;
  heroImage?: string;
  body?: RichBody;
  related?: BlogPostVM[];
}

// Úřad listing row: a dated úřední post, or a councillor (person) shown under
// Zastupitelstvo → Zastupitelé.
export interface UradItemVM {
  id: string;
  slug: string;
  title: string;
  description?: string;
  date?: string;
  category: string;
  subcategory?: string;
  href: string;
  isPerson: boolean;
  personPhoto?: string;
  body?: RichBody;
}

// A single fulltext search result (scoped server search over title + lead +
// the document body). `snippet` is an excerpt of the original text around the
// match (or the lead when the match was only in title/lead).
export interface SearchHit {
  id: string;
  title: string;
  href: string;
  meta: string;
  snippet?: string;
}

export interface SiteSettingsVM {
  footerDisclosure?: RichBody;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  addressStreet?: string;
  addressCity?: string;
  ico?: string;
  social?: { facebook?: string; instagram?: string };
  seo?: { defaultDescription?: string; ogImage?: string };
  alertBar?: {
    enabled?: boolean;
    tone?: "warning" | "campaign";
    icon?: string;
    text?: RichBody;
  };
}

export interface ProudPageVM {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  pillarsTitle?: string;
  pillars?: { title?: string; text?: string }[];
  highlightsEyebrow?: string;
  highlightsTitle?: string;
  highlights?: { title?: string; text?: string }[];
}

export interface SimplePageVM {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  intro?: string;
}

export interface ZapojteSePageVM {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  cards?: { icon?: string; title?: string; text?: string }[];
  contactBlock?: { title?: string; text?: string; buttonLabel?: string };
}

export interface LegalPageVM {
  title: string;
  slug: string;
  lastUpdated: string;
  body?: RichBody;
}
