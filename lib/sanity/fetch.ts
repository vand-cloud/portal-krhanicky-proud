// Server-side data layer. Fetches from Sanity and maps documents to the
// view-model shapes in content-types.ts that the page components consume.
// Images are already resolved to URL strings in GROQ (asset->url).
import { client } from "./client";
import { readingTimeFromBody } from "@/lib/reading-time";
import * as Q from "./queries";
import type {
  BlogPostVM,
  CategoryVM,
  LegalPageVM,
  PersonVM,
  ProudItemVM,
  ProudPageVM,
  SimplePageVM,
  SiteSettingsVM,
  UradCategoryVM,
  UradItemVM,
  ZapojteSePageVM,
} from "./content-types";

const AFF_LABELS: Record<string, string> = {
  zastupitel: "Zastupitel",
  "proud-clen": "Člen Krhanického Proudu",
  "kandidat-2026": "Kandidát voleb 2026",
  redaktor: "Redaktor",
};

// The candidate list is a synthetic category in the programme rozcestník:
// its rows are persons tagged kandidat-2026, not proudPost documents.
const KANDIDATI_CATEGORY: CategoryVM = {
  slug: "kandidati",
  label: "Naši kandidáti",
  description:
    "Kdo jde v komunálních volbách 2026 za Krhanický Proud. Kandidátka v pořadí, jak ji uvidíte na hlasovacím lístku.",
};

const fetch = <T>(query: string, params?: Record<string, unknown>) =>
  client.fetch<T>(query, params ?? {}, { next: { revalidate: 60 } });

// ── Person ───────────────────────────────────────────────────────────────────
type RawPerson = {
  id: string;
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  affiliations?: string[];
  visibility?: "public" | "internal";
  photo?: string;
  contactEmail?: string;
  contactPhone?: string;
  social?: PersonVM["social"];
};

function mapPerson(p: RawPerson): PersonVM {
  const affiliations = p.affiliations ?? [];
  const social = p.social
    ? Object.fromEntries(Object.entries(p.social).filter(([, v]) => Boolean(v)))
    : undefined;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    role: p.role,
    bio: p.bio,
    affiliations,
    affiliationLabels: affiliations.map((a) => AFF_LABELS[a] ?? a),
    visibility: p.visibility ?? "public",
    photo: p.photo,
    contactEmail: p.contactEmail,
    contactPhone: p.contactPhone,
    social: social && Object.keys(social).length > 0 ? social : undefined,
  };
}

export async function getCandidates(): Promise<PersonVM[]> {
  const raw = await fetch<RawPerson[]>(Q.candidatesQuery);
  return (raw ?? []).map(mapPerson);
}

export async function getCouncillors(): Promise<PersonVM[]> {
  const raw = await fetch<RawPerson[]>(Q.councillorsQuery);
  return (raw ?? []).map(mapPerson);
}

export async function getPersonBySlug(slug: string): Promise<PersonVM | null> {
  const raw = await fetch<RawPerson | null>(Q.personBySlugQuery, { slug });
  return raw ? mapPerson(raw) : null;
}

// ── Site settings ──────────────────────────────────────────────────────────
export async function getSiteSettings(): Promise<SiteSettingsVM | null> {
  return fetch<SiteSettingsVM | null>(Q.siteSettingsQuery);
}

// ── Proud landing (/proud) ─────────────────────────────────────────────────
export async function getProudPage(): Promise<ProudPageVM | null> {
  return fetch<ProudPageVM | null>(Q.proudPageQuery);
}

// ── Program rozcestník (/proud/nas-program) ────────────────────────────────
type RawProudPost = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  categoryLabel?: string;
  heroImage?: string;
  author?: { name: string; role?: string } | null;
  body?: ProudItemVM["body"];
};

function proudPostToVM(p: RawProudPost): ProudItemVM {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    category: p.category ?? "",
    categoryLabel: p.categoryLabel ?? "",
    href: `/proud/nas-program/${p.slug}`,
    isCandidate: false,
    heroImage: p.heroImage,
    author: p.author ?? null,
    body: p.body,
  };
}

function candidateToVM(person: PersonVM): ProudItemVM {
  return {
    id: person.id,
    title: person.name,
    slug: `kandidat-${person.slug}`,
    description: person.role,
    category: KANDIDATI_CATEGORY.slug,
    categoryLabel: KANDIDATI_CATEGORY.label,
    href: `/proud/nas-program/kandidat-${person.slug}`,
    isCandidate: true,
    personPhoto: person.photo,
  };
}

export async function getProgramData(): Promise<{
  page: SimplePageVM | null;
  categories: CategoryVM[];
  items: ProudItemVM[];
}> {
  const [page, cats, posts, candidates] = await Promise.all([
    fetch<SimplePageVM | null>(Q.programPageQuery),
    fetch<CategoryVM[]>(Q.proudCategoriesQuery),
    fetch<RawProudPost[]>(Q.proudPostsQuery),
    getCandidates(),
  ]);

  // Inject the synthetic "kandidati" category right after "program".
  const categories = [...(cats ?? [])];
  const programIdx = categories.findIndex((c) => c.slug === "program");
  categories.splice(programIdx >= 0 ? programIdx + 1 : 0, 0, KANDIDATI_CATEGORY);

  const items: ProudItemVM[] = [
    ...(posts ?? []).map(proudPostToVM),
    ...candidates.map(candidateToVM),
  ];

  return { page, categories, items };
}

export async function getProudPostBySlug(
  slug: string,
): Promise<ProudItemVM | null> {
  const raw = await fetch<RawProudPost | null>(Q.proudPostBySlugQuery, { slug });
  return raw ? proudPostToVM(raw) : null;
}

// ── Blog ─────────────────────────────────────────────────────────────────────
type RawBlogPost = Omit<BlogPostVM, "href" | "readingTime" | "related"> & {
  related?: RawBlogPost[];
};

function blogToVM(p: RawBlogPost): BlogPostVM {
  return {
    ...p,
    categories: p.categories ?? [],
    categoryLabels: p.categoryLabels ?? [],
    tags: p.tags ?? [],
    href: `/blog/${p.slug}`,
    readingTime: readingTimeFromBody(p.body),
    related: p.related?.map(blogToVM),
  };
}

export async function getBlogData(): Promise<{
  page: SimplePageVM | null;
  categories: CategoryVM[];
  posts: BlogPostVM[];
}> {
  const [page, categories, raw] = await Promise.all([
    fetch<SimplePageVM | null>(Q.blogPageQuery),
    fetch<CategoryVM[]>(Q.blogCategoriesQuery),
    fetch<RawBlogPost[]>(Q.blogPostsQuery),
  ]);
  return {
    page,
    categories: categories ?? [],
    posts: (raw ?? []).map(blogToVM),
  };
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostVM | null> {
  const raw = await fetch<RawBlogPost | null>(Q.blogPostBySlugQuery, { slug });
  return raw ? blogToVM(raw) : null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await fetch<{ slug: string }[]>(Q.blogSlugsQuery);
  return (posts ?? []).map((p) => p.slug);
}

// ── Úřad ─────────────────────────────────────────────────────────────────────
type RawUradPost = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  date?: string;
  category?: string;
  subcategory?: string;
  body?: UradItemVM["body"];
};

function uradPostToVM(p: RawUradPost): UradItemVM {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.summary,
    date: p.date,
    category: p.category ?? "",
    subcategory: p.subcategory,
    href: `/urad/${p.slug}`,
    isPerson: false,
    body: p.body,
  };
}

function councillorToUradVM(person: PersonVM): UradItemVM {
  return {
    id: person.id,
    title: person.name,
    slug: `zastupitel-${person.slug}`,
    description: person.role,
    category: "zastupitelstvo",
    subcategory: "zastupitele",
    href: `/urad/zastupitel-${person.slug}`,
    isPerson: true,
    personPhoto: person.photo,
  };
}

export async function getUradData(): Promise<{
  page: SimplePageVM | null;
  categories: UradCategoryVM[];
  items: UradItemVM[];
}> {
  const [page, categories, posts, councillors] = await Promise.all([
    fetch<SimplePageVM | null>(Q.uradPageQuery),
    fetch<UradCategoryVM[]>(Q.uradCategoriesQuery),
    fetch<RawUradPost[]>(Q.uradPostsQuery),
    getCouncillors(),
  ]);
  const items: UradItemVM[] = [
    ...(posts ?? []).map(uradPostToVM),
    ...councillors.map(councillorToUradVM),
  ];
  // GROQ returns null (not []) for an absent subcategories array; normalize
  // so consumers can safely .map/.length over it.
  const normalizedCategories = (categories ?? []).map((c) => ({
    ...c,
    subcategories: c.subcategories ?? [],
  }));
  return { page, categories: normalizedCategories, items };
}

export async function getUradPostBySlug(
  slug: string,
): Promise<UradItemVM | null> {
  const raw = await fetch<RawUradPost | null>(Q.uradPostBySlugQuery, { slug });
  return raw ? uradPostToVM(raw) : null;
}

export async function getAllUradSlugs(): Promise<string[]> {
  const posts = await fetch<{ slug: string }[]>(Q.uradSlugsQuery);
  const councillors = await getCouncillors();
  return [
    ...(posts ?? []).map((p) => p.slug),
    ...councillors.map((c) => `zastupitel-${c.slug}`),
  ];
}

// ── Zapojte se ───────────────────────────────────────────────────────────────
export async function getZapojteSePage(): Promise<ZapojteSePageVM | null> {
  return fetch<ZapojteSePageVM | null>(Q.zapojteSePageQuery);
}

// ── Legal ────────────────────────────────────────────────────────────────────
export async function getLegalPage(slug: string): Promise<LegalPageVM | null> {
  return fetch<LegalPageVM | null>(Q.legalPageQuery, { slug });
}

export async function getAllLegalSlugs(): Promise<string[]> {
  const pages = await fetch<{ slug: string }[]>(Q.allLegalPagesQuery);
  return (pages ?? []).map((p) => p.slug);
}
