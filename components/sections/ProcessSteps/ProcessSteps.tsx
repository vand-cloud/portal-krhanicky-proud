import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";

export type ProcessStepsProps = {
  heading?: string;
  subheading?: string;
  steps: Array<{ title: string; description: string }>;
};

/**
 * Mobile: vertical stack of rows. Each step renders as a two-column row
 * with the number on the left and title + description on the right.
 *
 * Desktop (lg+): horizontal numbered timeline. Each step is a grid column
 * containing a marker row (number + connecting line filling the rest of
 * the column) and the title + description below. Adjacent line segments
 * butt up against the next column's number for a continuous line.
 *
 * Vertical alignment of the line with the number uses `flex items-center`
 * so the line stays on-axis regardless of font rendering.
 *
 * Number style matches CaseStudyGrid: text-2xl md:text-3xl font-light
 * tabular-nums text-text-tertiary.
 */
export function ProcessSteps({ heading, subheading, steps }: ProcessStepsProps) {
  const lastIndex = steps.length - 1;

  return (
    <section className="py-[var(--spacing-section)] bg-[var(--color-bg)]">
      <Container>
        {(heading || subheading) && (
          <div className="mb-16 max-w-3xl">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-lg text-[var(--color-text-secondary)]">
                {subheading}
              </p>
            )}
          </div>
        )}

        <ol
          className="flex flex-col gap-y-12 lg:grid lg:gap-y-0 lg:gap-x-0"
          style={
            {
              gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
            } as CSSProperties
          }
        >
          {steps.map((step, i) => {
            const isLast = i === lastIndex;
            return (
              <li
                key={i}
                className="flex gap-6 items-start text-left lg:flex-col lg:gap-0"
              >
                <div className="shrink-0 lg:flex lg:items-center lg:w-full">
                  <span className="shrink-0 text-2xl md:text-3xl font-light tabular-nums leading-none text-[var(--color-text-tertiary)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="hidden lg:block flex-1 h-px bg-[var(--color-border)] mx-4"
                    />
                  )}
                </div>

                <div className="flex-1 lg:flex-none lg:w-full lg:mt-6 lg:pr-6">
                  <h3 className="text-base md:text-lg font-[family-name:var(--font-heading)] font-semibold text-[var(--color-text-accent)] text-balance">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
