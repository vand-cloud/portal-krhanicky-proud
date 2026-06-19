import type { PortableTextBlock } from "@portabletext/types";
import { LegalLayout, type LegalController } from "@/components/legal/LegalLayout";
import { PortableBody } from "@/components/sections/RichText/PortableBody";

// Sanity-driven legal page renderer. Wraps the two-column LegalLayout shell
// (overline + H1 + section nav + auto "Správce webu" from siteSettings) and
// drops the document body into the right column via PortableBody, which
// carries the same .legal-content typography as the wireframe version.
// The "Naposledy aktualizováno" line closes the article.
export function LegalPageRenderer({
  title,
  body,
  lastUpdated,
  controller,
}: {
  title: string;
  body?: PortableTextBlock[];
  lastUpdated?: string;
  controller?: LegalController;
}) {
  const updated = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("cs-CZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <LegalLayout title={title} controller={controller}>
      <PortableBody value={body} className="legal-content" />
      {updated ? (
        <p className="mt-10 text-sm text-[var(--color-text-tertiary)]">
          Naposledy aktualizováno: {updated}.
        </p>
      ) : null}
    </LegalLayout>
  );
}
