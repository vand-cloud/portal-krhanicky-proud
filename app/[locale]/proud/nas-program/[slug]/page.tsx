import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  type ProudItem,
  findProudItemBySlug,
  proudCategories,
  proudCategoryLabels,
  proudItems,
} from "@/content/proud";
import { findPersonById } from "@/content/people";
import { entries } from "@/content/entries";
import { blogPosts } from "@/content/blog";
import { ProudIndex } from "@/components/sections/Proud/ProudIndex";
import { ProudSearch } from "@/components/sections/Proud/ProudSearch";
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
  return proudItems.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findProudItemBySlug(slug);
  if (!item) return { title: "Stránka nenalezena" };
  return { title: item.title, description: item.description };
}

// Detail route: same /proud/nas-program shell with ProudIndex switched
// into detail mode. Sidebar stays mounted; the right pane shows either
// the candidate's PersonDetail (item.category === "kandidati") or a
// generic post body (manifesto + policy posts).
export default async function NasProgramDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = findProudItemBySlug(slug);
  if (!item) notFound();

  let detailNode: React.ReactNode;
  if (item.category === "kandidati" && item.personId) {
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
    detailNode = <GenericProudPost item={item} />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-12 lg:py-16 lg:px-8">
      {/* Page header (hero + search) hides on mobile in detail mode --
          the user clicked through to read one specific item, the section
          intro is just noise. Sidebar stays mounted on desktop only. */}
      <header className="hidden max-w-3xl lg:block">
        <p className="eyebrow mb-3">Krhanický Proud</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          Náš program
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          Co konkrétně chceme v Krhanicích řešit. Témata řadíme tematicky,
          za každým návrhem stojí někdo z týmu nebo kandidátky.
        </p>
        <div className="mt-7">
          <ProudSearch
            categories={proudCategories}
            items={proudItems}
            placeholder="Hledat téma, kandidáta, nápad…"
          />
        </div>
      </header>

      <div className="lg:mt-12">
        <ProudIndex
          items={proudItems}
          initialCategory={item.category}
          initialSelectedSlug={slug}
          detailNode={detailNode}
        />
      </div>
    </div>
  );
}

// Generic detail view for non-candidate proud items: title, category +
// date + author byline, description, placeholder body. Phase 4 (Sanity)
// replaces the placeholder with a portable text body per post.
function GenericProudPost({ item }: { item: ProudItem }) {
  const author = item.personId ? findPersonById(item.personId) : null;
  return (
    <article>
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {proudCategoryLabels[item.category]}
        {item.date ? (
          <>
            {" · "}
            <time dateTime={item.date}>
              {formatDate.format(new Date(item.date))}
            </time>
          </>
        ) : null}
      </p>
      <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-3xl">
        {item.title}
      </h2>
      {item.description ? (
        <p className="mt-5 text-base leading-relaxed text-[var(--color-text-secondary)]">
          {item.description}
        </p>
      ) : null}
      {author ? (
        <p className="mt-6 text-sm text-[var(--color-text-tertiary)]">
          Za návrhem stojí:{" "}
          <span className="text-[var(--color-text)]">{author.name}</span>
          {author.role ? <span> ({author.role})</span> : null}
        </p>
      ) : null}
      <p className="mt-10 italic text-[var(--color-text-tertiary)]">
        Plný text návrhu připravujeme.
      </p>
    </article>
  );
}
