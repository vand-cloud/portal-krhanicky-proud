import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { findPersonBySlug, people } from "@/content/people";
import { entries } from "@/content/entries";
import { blogPosts } from "@/content/blog";
import {
  PersonDetail,
  resolvePersonRefs,
} from "@/components/sections/People/PersonDetail";

export async function generateStaticParams() {
  // Only build pages for public profiles. Internal profiles have no page.
  return people
    .filter((p) => p.visibility === "public")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = findPersonBySlug(slug);
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

  const person = findPersonBySlug(slug);
  // Internal profiles 404 on direct URL. Detail pages exist only for
  // people who opted in (visibility = public).
  if (!person || person.visibility !== "public") notFound();

  const { businesses, articles } = resolvePersonRefs(
    person,
    entries,
    blogPosts,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* This page is the standalone, context-less detail. People reached
          from /urad are routed through /urad/[slug] (sidebar kept). The
          link back here is intentionally generic -- /proud is the most
          common origin for direct links. */}
      <a
        href="/proud"
        className="inline-flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] outline-none transition-colors hover:text-[var(--color-text)] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
      >
        <ChevronLeft size={12} aria-hidden />
        Zpět na Krhanický Proud
      </a>

      <article className="mt-6">
        <PersonDetail
          person={person}
          businesses={businesses}
          articles={articles}
        />
      </article>
    </div>
  );
}
