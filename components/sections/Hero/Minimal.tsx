import { Container } from "@/components/ui/Container";
import { HeroCTAs } from "./_shared";
import type { HeroMinimalProps } from "./types";

export default function Minimal({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: HeroMinimalProps) {
  return (
    <section className="bg-[var(--color-bg)] py-[var(--spacing-section)]">
      <Container size="narrow">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed font-[family-name:var(--font-body)] text-balance">
            {subtitle}
          </p>
        )}
        <HeroCTAs primary={ctaPrimary} secondary={ctaSecondary} />
      </Container>
    </section>
  );
}
