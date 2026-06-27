import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  getAllUradSlugs,
  getPersonBySlug,
  getUradData,
  getUradPostBySlug,
} from "@/lib/sanity/fetch";
import type { UradItemVM } from "@/lib/sanity/content-types";
import type { Person } from "@/content/people";
import { ObecIndex } from "@/components/sections/Obec/ObecIndex";
import { ObecSearch } from "@/components/sections/Obec/ObecSearch";
import { PersonDetail } from "@/components/sections/People/PersonDetail";
import { PortableBody } from "@/components/sections/RichText/PortableBody";

const formatDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateStaticParams() {
  // Prerender every úřad slug when Sanity is reachable. If it is not (e.g. a
  // CI build with a placeholder project id), return no params so the build
  // succeeds and these routes render on demand instead of crashing the
  // whole build. A production build with real credentials still prerenders
  // the full set.
  try {
    const slugs = await getAllUradSlugs();
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
  if (slug.startsWith("zastupitel-")) {
    const person = await getPersonBySlug(slug.replace(/^zastupitel-/, ""));
    if (!person) return { title: "Stránka nenalezena" };
    return { title: person.name, description: person.bio };
  }
  const item = await getUradPostBySlug(slug);
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

  const { page, categories, items } = await getUradData();

  // Two detail content shapes:
  // - council items (slug "zastupitel-<personSlug>") -> render the person card
  // - everything else (notices, meetings, documents) -> a generic title +
  //   date + description block followed by the PortableText body.
  let detailNode: React.ReactNode;
  let initialCategory: string;
  let initialSubcategory: string | null;

  if (slug.startsWith("zastupitel-")) {
    const person = await getPersonBySlug(slug.replace(/^zastupitel-/, ""));
    if (!person) notFound();
    // Map the PersonVM to the content `Person` shape PersonDetail expects.
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
    initialCategory = "zastupitelstvo";
    initialSubcategory = "zastupitele";
  } else {
    const item = await getUradPostBySlug(slug);
    if (!item) notFound();
    detailNode = <GenericObecDetail item={item} />;
    initialCategory = item.category;
    initialSubcategory = item.subcategory ?? null;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-12 lg:py-16 lg:px-8">
      {/* Page header (hero + search) hides on mobile in detail mode --
          the user clicked through to read one specific item, the section
          intro is just noise. Sidebar stays mounted on desktop, where the
          two-column layout still makes sense. */}
      <header className="hidden max-w-3xl lg:block">
        <p className="eyebrow mb-3">{page?.eyebrow ?? "Vše z úřadu"}</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          {page?.title ?? "Obecní úřad Krhanice"}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          {page?.subtitle ??
            "Úřední deska, zastupitelstvo, dokumenty a aktuality. Co potřebujete vědět z radnice na jednom místě."}
        </p>
        <div className="mt-7">
          <ObecSearch
            categories={categories}
            items={items}
            placeholder="Hledat sekci, dokument, zastupitele…"
          />
        </div>
      </header>

      <div className="lg:mt-12">
        <ObecIndex
          categories={categories}
          items={items}
          initialCategory={initialCategory}
          initialSubcategory={initialSubcategory}
          initialSelectedSlug={slug}
          detailNode={detailNode}
        />
      </div>
    </div>
  );
}

// Generic detail view for non-person obec items: title, date, description
// and the PortableText body rendered from Sanity.
function GenericObecDetail({ item }: { item: UradItemVM }) {
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
      <PortableBody value={item.body} />
    </article>
  );
}
