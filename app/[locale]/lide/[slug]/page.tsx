import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getAllPublicPersonSlugs, getPersonBySlug } from "@/lib/sanity/fetch";
import { type Person } from "@/content/people";
import { PersonDetail } from "@/components/sections/People/PersonDetail";

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublicPersonSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  if (!person || person.visibility !== "public") {
    return { title: "Profil nenalezen" };
  }
  return {
    title: person.name,
    description: person.role ?? person.bio,
  };
}

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const raw = await getPersonBySlug(slug);
  if (!raw || raw.visibility !== "public") notFound();

  const person: Person = {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    role: raw.role,
    bio: raw.bio,
    affiliations: raw.affiliations as Person["affiliations"],
    visibility: raw.visibility,
    contactEmail: raw.contactEmail,
    contactPhone: raw.contactPhone,
    social: raw.social as Person["social"],
    photo: raw.photo,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <a
        href="/"
        className="inline-flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] outline-none transition-colors hover:text-[var(--color-text)] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
      >
        <ChevronLeft size={12} aria-hidden />
        Zpět
      </a>
      <div className="mt-8">
        <PersonDetail person={person} businesses={[]} articles={[]} />
      </div>
    </div>
  );
}
