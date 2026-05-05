import { User } from "lucide-react";
import { type Person, affiliationLabels } from "@/content/people";
import type { Entry } from "@/content/entries";
import type { BlogPost } from "@/content/blog";

const formatDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// PersonDetail renders a person profile WITHOUT an outer page container
// or back link. The host is responsible for those:
// - /lide/[slug] wraps it in a max-w-3xl page with a generic Zpět link
// - /obec/[slug] embeds it inside ObecIndex's right pane (sidebar kept)
//
// Both contexts resolve the person + related businesses + articles and
// pass them in as props -- the component itself does no fetching.
export function PersonDetail({
  person,
  businesses,
  articles,
}: {
  person: Person;
  businesses: Entry[];
  articles: BlogPost[];
}) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-[8rem_1fr] sm:gap-8">
        {/* Photo or typed placeholder. Square aspect, soft surface so it
            reads as "profile" without an image. */}
        <div
          className="relative aspect-square w-32 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
          aria-hidden
        >
          {person.photo ? (
            /* eslint-disable-next-line @next/next/no-img-element -- Phase 2 wireframe; next/image comes in Phase 4 with Sanity assets. */
            <img
              src={person.photo}
              alt={person.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--color-text-tertiary)]">
              <User size={36} />
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-3xl">
            {person.name}
          </h1>
          {person.role ? (
            <p className="mt-1 text-base text-[var(--color-text-secondary)]">
              {person.role}
            </p>
          ) : null}

          {person.affiliations.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {person.affiliations.map((aff) => (
                <span
                  key={aff}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]"
                >
                  {affiliationLabels[aff]}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {person.bio ? (
        <p className="mt-8 text-base leading-relaxed text-[var(--color-text)]">
          {person.bio}
        </p>
      ) : null}

      {person.contactEmail || person.contactPhone || person.social ? (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Kontakt
          </h2>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            {person.contactEmail ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
                  E-mail
                </dt>
                <dd className="mt-0.5 text-sm text-[var(--color-text)]">
                  <a
                    href={`mailto:${person.contactEmail}`}
                    className="outline-none hover:underline focus-visible:underline"
                  >
                    {person.contactEmail}
                  </a>
                </dd>
              </div>
            ) : null}
            {person.contactPhone ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
                  Telefon
                </dt>
                <dd className="mt-0.5 text-sm text-[var(--color-text)]">
                  <a
                    href={`tel:${person.contactPhone.replace(/\s/g, "")}`}
                    className="outline-none hover:underline focus-visible:underline"
                  >
                    {person.contactPhone}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {businesses.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Provozuje
          </h2>
          <ul className="mt-3 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {businesses.map((b) => (
              <li key={b.id}>
                <a
                  href={b.href}
                  className="flex items-baseline justify-between gap-4 py-3 outline-none transition-colors hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    {b.title}
                  </span>
                  {b.address ? (
                    <span className="shrink-0 text-xs text-[var(--color-text-tertiary)]">
                      {b.address}
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {articles.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Publikované články
          </h2>
          <ul className="mt-3 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {articles.map((a) => (
              <li key={a.id}>
                <a
                  href={a.href}
                  className="flex items-baseline justify-between gap-4 py-3 outline-none transition-colors hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    {a.title}
                  </span>
                  <time
                    dateTime={a.publishedAt}
                    className="shrink-0 text-xs text-[var(--color-text-tertiary)]"
                  >
                    {formatDate.format(new Date(a.publishedAt))}
                  </time>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

// Helper used by both /lide/[slug] and /obec/[slug] to resolve refs.
export function resolvePersonRefs(
  person: Person,
  entries: Entry[],
  blogPosts: BlogPost[],
): { businesses: Entry[]; articles: BlogPost[] } {
  const businesses = (person.businesses ?? [])
    .map((id) => entries.find((e) => e.id === id))
    .filter((e): e is Entry => Boolean(e));
  const articles = (person.articles ?? [])
    .map((id) => blogPosts.find((p) => p.id === id))
    .filter((p): p is BlogPost => Boolean(p));
  return { businesses, articles };
}
