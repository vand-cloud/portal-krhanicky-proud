import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { CTABannerProps } from "./types";

export default function Banner({
  heading,
  subheading,
  ctaPrimary,
  ctaSecondary,
  align = "left",
}: CTABannerProps) {
  const isCentered = align === "center";
  const containerClass = isCentered ? "text-center" : "";
  const subheadingClass = isCentered ? "max-w-2xl mx-auto" : "max-w-2xl";
  const buttonsClass = isCentered ? "justify-center" : "justify-start";

  return (
    <section className="bg-[var(--color-brand)] py-[var(--spacing-section)] text-[var(--color-bg)]">
      <Container className={containerClass}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-[family-name:var(--font-heading)]">
          {heading}
        </h2>
        {subheading && (
          <p className={`mt-4 text-lg opacity-80 ${subheadingClass}`}>
            {subheading}
          </p>
        )}
        <div
          className={`mt-8 flex flex-col sm:flex-row gap-4 ${buttonsClass}`}
        >
          <Link
            href={ctaPrimary.href}
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg)] text-[var(--color-brand)] px-6 py-3 text-lg font-medium hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand)]"
          >
            {ctaPrimary.label}
          </Link>
          {ctaSecondary && (
            <Link
              href={ctaSecondary.href}
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-bg)]/30 px-6 py-3 text-lg font-medium hover:bg-[var(--color-bg)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand)]"
            >
              {ctaSecondary.label}
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
