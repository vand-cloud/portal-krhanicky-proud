import { Container } from "@/components/ui/Container";
import type { FAQAccordionProps } from "./types";

export default function Accordion({ heading, subheading, items }: FAQAccordionProps) {
  return (
    <section className="bg-[var(--color-bg)] py-[var(--spacing-section)]">
      <Container size="narrow">
        {(heading || subheading) && (
          <div className="text-center mb-[var(--spacing-block-gap)]">
            {heading && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                {subheading}
              </p>
            )}
          </div>
        )}
        <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {items.map((item, i) => (
            <li key={i}>
              <details className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]">
                  <span className="text-lg font-medium pr-8">{item.question}</span>
                  <span className="text-2xl group-open:rotate-45 transition-transform" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[var(--color-text-secondary)] leading-relaxed">
                  {item.answer}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
