import { PortableText } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import type { LegalPage } from "@/lib/sanity/types";

// Phase 4 renderer for Sanity-driven legal pages. Mirrors the typography
// of /gdpr, /cookies, /pristupnost (which use LegalLayout + raw HTML in
// .legal-content) so when content migrates to Sanity the visual reading
// experience is identical. We deliberately do NOT use Tailwind's `prose`
// plugin here, it brings its own typography that fights our token system.
// The `.legal-content` class (in app/globals.css under @layer components)
// handles paragraph, list, table, and link styling from PortableText
// output. Headings inherit color and font-family from @layer base h1-h6.
export function LegalPageRenderer({ page }: { page: LegalPage }) {
  const updated = new Date(page.lastUpdated).toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-[var(--color-bg)] py-[var(--spacing-section)]">
      <Container size="narrow">
        <header className="mb-[var(--spacing-block-gap)] border-b border-[var(--color-border)] pb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl">{page.title}</h1>
          <p className="mt-4 text-sm text-[var(--color-text-tertiary)]">
            Aktualizováno: {updated}
          </p>
        </header>
        <div className="legal-content space-y-8">
          {page.sections.map((section, i) => (
            <section key={i}>
              <h2>{section.heading}</h2>
              <PortableText value={section.content} />
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}
