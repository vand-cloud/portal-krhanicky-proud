import { ArrowRight } from "lucide-react";

// "Střípky z našeho programu" -- a card strip on /proud homepage teasing
// concrete proposals from the programme rozcestník. Content is now a flat
// list of title + text entries (no cover, category chip, date or per-card
// link); the single "Celý program" link below routes to the full
// rozcestník under /proud/nas-program.
export function ProudHighlights({
  eyebrow,
  title,
  highlights,
}: {
  eyebrow?: string;
  title?: string;
  highlights: { title?: string; text?: string }[];
}) {
  if (highlights.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="proud-highlights">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow">{eyebrow ?? "Z našeho programu"}</p>
          <h2
            id="proud-highlights"
            className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text-accent)] sm:text-3xl"
          >
            {title ?? "Střípky z našeho programu"}
          </h2>
        </div>
        <a
          href="/proud/nas-program"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-brand)] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:inline-flex"
        >
          Celý program
          <ArrowRight size={16} aria-hidden />
        </a>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <li key={item.title}>
            <article className="h-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5">
              <h3 className="text-base font-bold leading-snug tracking-tight text-[var(--color-text-accent)] sm:text-lg">
                {item.title}
              </h3>
              {item.text ? (
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {item.text}
                </p>
              ) : null}
            </article>
          </li>
        ))}
      </ul>

      {/* Mobile-only CTA: header CTA hides under sm breakpoint to keep
          the heading line tidy. */}
      <a
        href="/proud/nas-program"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-brand)] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:hidden"
      >
        Celý program
        <ArrowRight size={16} aria-hidden />
      </a>
    </section>
  );
}
