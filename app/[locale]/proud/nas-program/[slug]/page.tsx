import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import type { ProudItemVM } from "@/lib/sanity/content-types";
import {
  getProgramData,
  getProudPostBySlug,
  getPersonBySlug,
} from "@/lib/sanity/fetch";
import { type Person } from "@/content/people";
import { ProudIndex } from "@/components/sections/Proud/ProudIndex";
import { ProudSearch } from "@/components/sections/Proud/ProudSearch";
import { PersonDetail } from "@/components/sections/People/PersonDetail";
import { PortableBody } from "@/components/sections/RichText/PortableBody";

export async function generateStaticParams() {
  // Prerender every programme item when Sanity is reachable. If it is not
  // (e.g. a CI build with a placeholder project id), return no params so the
  // build succeeds and these routes render on demand instead of crashing
  // the whole build. A production build with real credentials still
  // prerenders the full set.
  try {
    const { items } = await getProgramData();
    return items.map((i) => ({ slug: i.slug }));
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
  if (slug.startsWith("kandidat-")) {
    const person = await getPersonBySlug(slug.replace(/^kandidat-/, ""));
    if (!person) return { title: "Stránka nenalezena" };
    return { title: person.name, description: person.bio };
  }
  const item = await getProudPostBySlug(slug);
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

  const { page, categories, items } = await getProgramData();

  let detailNode: React.ReactNode;
  let initialCategory: string;

  if (slug.startsWith("kandidat-")) {
    const person = await getPersonBySlug(slug.replace(/^kandidat-/, ""));
    if (!person) notFound();
    const person2: Person = {
      id: person.id,
      slug: person.slug,
      name: person.name,
      role: person.role,
      bio: person.bio,
      affiliations: person.affiliations as Person["affiliations"],
      visibility: person.visibility,
      contactEmail: person.contactEmail,
      contactPhone: person.contactPhone,
      social: person.social as Person["social"],
      photo: person.photo,
    };
    detailNode = (
      <PersonDetail person={person2} businesses={[]} articles={[]} />
    );
    initialCategory = "kandidati";
  } else {
    const item = await getProudPostBySlug(slug);
    if (!item) notFound();
    detailNode = <GenericProudPost item={item} />;
    initialCategory = item.category;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-12 lg:py-16 lg:px-8">
      {/* Page header (hero + search) hides on mobile in detail mode --
          the user clicked through to read one specific item, the section
          intro is just noise. Sidebar stays mounted on desktop only. */}
      <header className="hidden max-w-3xl lg:block">
        <p className="eyebrow mb-3">{page?.eyebrow ?? "Krhanický Proud"}</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          {page?.title ?? "Náš program"}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          {page?.subtitle ??
            "Co konkrétně chceme v Krhanicích řešit. Témata řadíme tematicky, za každým návrhem stojí někdo z týmu nebo kandidátky."}
        </p>
        <div className="mt-7">
          <ProudSearch
            categories={categories}
            items={items}
            placeholder="Hledat téma, kandidáta, nápad…"
          />
        </div>
      </header>

      <div className="lg:mt-12">
        <ProudIndex
          categories={categories}
          items={items}
          initialCategory={initialCategory}
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
function GenericProudPost({ item }: { item: ProudItemVM }) {
  const author = item.author ?? null;
  return (
    <article>
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {item.categoryLabel}
      </p>
      <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-3xl">
        {item.title}
      </h2>

      {/* Lead/perex above the cover, like the blog detail excerpt: larger
          type that sets up the piece before the reader hits the image. */}
      {item.description ? (
        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
          {item.description}
        </p>
      ) : null}

      {/* Cover image below the lead, like the blog detail: shown at its
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

      {/* Metadata strip below the cover, like the blog detail: programme
          items carry no date, so just the author byline as a "service"
          detail secondary to the body. */}
      {author ? (
        <p className="mt-6 text-sm text-[var(--color-text-tertiary)]">
          Za návrhem stojí:{" "}
          <span className="text-[var(--color-text)]">{author.name}</span>
          {author.role ? <span> ({author.role})</span> : null}
        </p>
      ) : null}
      <PortableBody value={item.body} />
    </article>
  );
}
