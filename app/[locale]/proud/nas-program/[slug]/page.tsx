import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { ArticleBodyDemo } from "@/components/sections/ArticleBodyDemo";
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

// Generic detail view for non-candidate proud items, structured like a
// blog post: category label, title, cover image, then text. No date --
// programme items are evergreen, not news. Phase 4 (Sanity) replaces the
// placeholder body with a rich-text body per post.
function GenericProudPost({ item }: { item: ProudItem }) {
  const author = item.personId ? findPersonById(item.personId) : null;
  return (
    <article>
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {proudCategoryLabels[item.category]}
      </p>
      <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-3xl">
        {item.title}
      </h2>

      {/* Cover image below the title, like the blog detail: shown at its
          natural ratio inside the reading column, no fixed-aspect crop.
          Placeholder box until a cover is added (Sanity asset in Phase 4). */}
      {item.heroImage ? (
        <div className="relative mt-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- Phase 2 wireframe; next/image comes in Phase 4 with Sanity assets. */}
          <img
            src={item.heroImage}
            alt={item.title}
            className="block h-auto w-full"
          />
        </div>
      ) : (
        <div className="relative mt-6 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-tertiary)]">
          <ImageIcon size={48} aria-hidden />
        </div>
      )}

      {item.description ? (
        <p className="mt-6 text-base leading-relaxed text-[var(--color-text-secondary)]">
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
      <ArticleBodyDemo />
    </article>
  );
}
