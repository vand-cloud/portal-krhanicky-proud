import { Container } from "@/components/ui/Container";

export type CaseStudyItem = {
  client: string;
  industry?: string;
  challenge: string;
  solution: string;
  outcome: string;
  metric?: string;
};

export type CaseStudyGridProps = {
  heading?: string;
  subheading?: string;
  items: CaseStudyItem[];
};

export function CaseStudyGrid({
  heading,
  subheading,
  items,
}: CaseStudyGridProps) {
  return (
    <section className="py-[var(--spacing-section)] bg-[var(--color-surface)]">
      <Container>
        {(heading || subheading) && (
          <div className="mb-12 max-w-3xl">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                {subheading}
              </p>
            )}
          </div>
        )}

        <ul className="border-t border-[var(--color-border)]">
          {items.map((item, i) => (
            <li
              key={i}
              className="border-b border-[var(--color-border)] py-10 md:py-14"
            >
              <article className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                <div className="md:col-span-1">
                  <span className="text-2xl md:text-3xl font-light tabular-nums text-[var(--color-text-tertiary)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="md:col-span-4">
                  {item.metric && (
                    <p className="text-2xl md:text-3xl font-bold text-[var(--color-text)] leading-tight mb-4 text-balance">
                      {item.metric}
                    </p>
                  )}
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                    {item.client}
                    {item.industry ? ` · ${item.industry}` : ""}
                  </p>
                </div>

                <div className="md:col-span-7 space-y-3 text-base text-[var(--color-text-secondary)] leading-relaxed">
                  <p>
                    <span className="font-semibold text-[var(--color-text)]">
                      Výchozí stav.
                    </span>{" "}
                    {item.challenge}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--color-text)]">
                      Řešení.
                    </span>{" "}
                    {item.solution}
                  </p>
                  <p className="text-[var(--color-text)]">
                    <span className="font-semibold">Výsledek.</span>{" "}
                    {item.outcome}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
