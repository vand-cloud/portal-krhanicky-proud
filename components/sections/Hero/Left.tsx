import { Container } from "@/components/ui/Container";
import { HeroBadge, HeroCTAs } from "./_shared";
import type { HeroLeftProps } from "./types";

/**
 * Left-aligned hero. No image split, no second column. The right side of
 * the section stays open as negative space — a contextual visual (subtle
 * background, decorative element) can be layered behind during the
 * designed phase without rebuilding the layout.
 */
export default function Left({
  title,
  subtitle,
  badge,
  ctaPrimary,
  ctaSecondary,
}: HeroLeftProps) {
  return (
    <section className="relative bg-[var(--color-bg)] py-[var(--spacing-section-hero)]">
      <Container>
        <div className="max-w-4xl">
          {badge && <HeroBadge>{badge}</HeroBadge>}
          <h1 className="text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl font-heading">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg sm:text-xl text-[var(--color-text-secondary)] leading-relaxed font-[family-name:var(--font-body)] text-balance max-w-3xl">
              {subtitle}
            </p>
          )}
          <HeroCTAs primary={ctaPrimary} secondary={ctaSecondary} />
        </div>
      </Container>
    </section>
  );
}
