import { PortableText } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import type { LegalPage } from "@/lib/sanity/types";

export function LegalPageRenderer({ page }: { page: LegalPage }) {
  const updated = new Date(page.lastUpdated).toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-[var(--color-bg)] py-[var(--spacing-section)]">
      <Container size="narrow">
        <header className="mb-[var(--spacing-block)] border-b border-[var(--color-border)] pb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-[family-name:var(--font-heading)]">
            {page.title}
          </h1>
          <p className="mt-4 text-sm text-[var(--color-text-tertiary)]">
            Aktualizováno: {updated}
          </p>
        </header>
        <div className="space-y-8">
          {page.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl sm:text-2xl font-[family-name:var(--font-heading)] mb-4">
                {section.heading}
              </h2>
              <div className="prose prose-neutral max-w-none text-[var(--color-text)] leading-relaxed">
                <PortableText value={section.content} />
              </div>
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}
