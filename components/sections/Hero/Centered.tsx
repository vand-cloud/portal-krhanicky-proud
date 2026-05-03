import { Container } from "@/components/ui/Container";
import { HeroBadge, HeroCTAs } from "./_shared";
import type { HeroCenteredProps } from "./types";

export default function Centered({
  title,
  subtitle,
  badge,
  ctaPrimary,
  ctaSecondary,
}: HeroCenteredProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface)] py-[var(--spacing-section-hero)]">
      <Container className="relative text-center">
        {badge && <HeroBadge>{badge}</HeroBadge>}
        <h1 className="text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[5.5rem] max-w-5xl mx-auto font-[family-name:var(--font-heading)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-7 text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed font-[family-name:var(--font-body)] text-balance">
            {subtitle}
          </p>
        )}
        <div className="flex justify-center">
          <HeroCTAs primary={ctaPrimary} secondary={ctaSecondary} />
        </div>
      </Container>
    </section>
  );
}
