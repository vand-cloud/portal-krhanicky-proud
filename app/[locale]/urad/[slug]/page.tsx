import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { findObecItemBySlug, obecCategories, obecItems } from "@/content/urad";
import { entries } from "@/content/entries";
import { findPersonById } from "@/content/people";
import { blogPosts } from "@/content/blog";
import { ObecIndex } from "@/components/sections/Obec/ObecIndex";
import { ObecSearch } from "@/components/sections/Obec/ObecSearch";
import {
  PersonDetail,
  resolvePersonRefs,
} from "@/components/sections/People/PersonDetail";

const formatDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateStaticParams() {
  return obecItems.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findObecItemBySlug(slug);
  if (!item) return { title: "Stránka nenalezena" };
  return { title: item.title, description: item.description };
}

export default async function ObecDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = findObecItemBySlug(slug);
  if (!item) notFound();

  // Two detail content shapes:
  // - council items reference a Person record -> render the person card
  // - everything else (notices, meetings, documents, contact pages) -> a
  //   generic title + date + description block with a placeholder body
  let detailNode: React.ReactNode;

  if (item.personId) {
    const person = findPersonById(item.personId);
    if (!person) notFound();
    const { businesses, articles } = resolvePersonRefs(
      person,
      entries,
      blogPosts,
    );
    detailNode = (
      <PersonDetail
        person={person}
        businesses={businesses}
        articles={articles}
      />
    );
  } else {
    detailNode = <GenericObecDetail item={item} />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-12 lg:py-16 lg:px-8">
      {/* Page header (hero + search) hides on mobile in detail mode --
          the user clicked through to read one specific item, the section
          intro is just noise. Sidebar stays mounted on desktop, where the
          two-column layout still makes sense. */}
      <header className="hidden max-w-3xl lg:block">
        <p className="eyebrow mb-3">Vše z úřadu</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          Obecní úřad Krhanice
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          Úřední deska, zastupitelstvo, dokumenty a aktuality. Co potřebujete
          vědět z radnice na jednom místě.
        </p>
        <div className="mt-7">
          <ObecSearch
            categories={obecCategories}
            items={obecItems}
            placeholder="Hledat sekci, dokument, zastupitele…"
          />
        </div>
      </header>

      <div className="lg:mt-12">
        <ObecIndex
          items={obecItems}
          initialCategory={item.category}
          initialSubcategory={item.subcategory ?? null}
          initialSelectedSlug={slug}
          detailNode={detailNode}
        />
      </div>
    </div>
  );
}

// Generic detail view for non-person obec items: title, date, description
// and a placeholder body. Phase 4 (Sanity) replaces the placeholder with
// a portable text block per item.
function GenericObecDetail({ item }: { item: ReturnType<typeof findObecItemBySlug> }) {
  if (!item) return null;
  return (
    <article>
      <h1 className="text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-3xl">
        {item.title}
      </h1>
      {item.date ? (
        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          <time dateTime={item.date}>
            {formatDate.format(new Date(item.date))}
          </time>
        </p>
      ) : null}
      {item.description ? (
        <p className="mt-5 text-base leading-relaxed text-[var(--color-text-secondary)]">
          {item.description}
        </p>
      ) : null}
      <p className="mt-10 italic text-[var(--color-text-tertiary)]">
        Plný obsah dokumentu připravujeme.
      </p>
    </article>
  );
}
