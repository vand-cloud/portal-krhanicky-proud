import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { HeroBadge, HeroCTAs } from "./_shared";
import type { HeroSplitProps } from "./types";

export default function Split({
  title,
  subtitle,
  badge,
  ctaPrimary,
  ctaSecondary,
  image,
  imageLabel,
  imagePosition = "right",
}: HeroSplitProps) {
  // Image is first in DOM so mobile (single column) renders image-first,
  // text below — visual hooks before reading copy. On lg+ we swap order
  // when the image should sit on the right.
  const swapOnDesktop = imagePosition === "right";

  const imageWrapperClass = `${swapOnDesktop ? "lg:order-2" : ""}`;
  const textWrapperClass = `${swapOnDesktop ? "lg:order-1" : ""}`;

  return (
    <section className="relative overflow-hidden bg-[var(--color-bg)] py-[var(--spacing-section-hero)]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {image ? (
            <div
              className={`relative aspect-video lg:aspect-auto lg:h-full w-full overflow-hidden rounded-[var(--radius-lg)] ${imageWrapperClass}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className={imageWrapperClass}>
              <ImagePlaceholder aspect="fill" label={imageLabel} />
            </div>
          )}
          <div className={textWrapperClass}>
            {badge && <HeroBadge>{badge}</HeroBadge>}
            <h1 className="text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl font-[family-name:var(--font-heading)]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-6 text-lg text-[var(--color-text-secondary)] leading-relaxed font-[family-name:var(--font-body)] text-balance">
                {subtitle}
              </p>
            )}
            <HeroCTAs primary={ctaPrimary} secondary={ctaSecondary} />
          </div>
        </div>
      </Container>
    </section>
  );
}
