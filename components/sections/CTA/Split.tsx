import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { CTASplitProps } from "./types";

export default function Split({ heading, subheading, ctaPrimary, ctaSecondary, image }: CTASplitProps) {
  return (
    <section className="bg-[var(--color-bg)] py-[var(--spacing-section)]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-[family-name:var(--font-heading)]">
              {heading}
            </h2>
            {subheading && (
              <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                {subheading}
              </p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={ctaPrimary.href}
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)] text-[var(--color-bg)] px-6 py-3 text-lg font-medium hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                {ctaPrimary.label}
              </Link>
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text)] px-6 py-3 text-lg font-medium hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
