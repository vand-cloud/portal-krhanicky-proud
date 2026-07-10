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
// - /urad/[slug] embeds it inside ObecIndex's right pane (sidebar kept)
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
        <div className="mt-8 space-y-4 text-base leading-relaxed text-[var(--color-text)]">
          {person.bio.split("\n").filter((p) => p.trim()).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {person.contactEmail || person.contactPhone || person.social ? (
        <section className="mt-8">
          <h2 className="section-eyebrow">
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
          {person.social && Object.values(person.social).some(Boolean) ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {person.social.web ? (
                <a href={person.social.web} target="_blank" rel="noopener noreferrer" aria-label="Web" className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14} aria-hidden><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  Web
                </a>
              ) : null}
              {person.social.facebook ? (
                <a href={person.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
                  <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14} aria-hidden><path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.514c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                  Facebook
                </a>
              ) : null}
              {person.social.instagram ? (
                <a href={person.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
                  <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14} aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </a>
              ) : null}
              {person.social.linkedin ? (
                <a href={person.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
                  <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14} aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              ) : null}
              {person.social.youtube ? (
                <a href={person.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
                  <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14} aria-hidden><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube
                </a>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {businesses.length > 0 ? (
        <section className="mt-10">
          <h2 className="section-eyebrow">
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
          <h2 className="section-eyebrow">
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

// Helper used by both /lide/[slug] and /urad/[slug] to resolve refs.
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
