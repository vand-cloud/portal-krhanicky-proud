import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { FeaturesAlternatingProps } from "./types";

export default function Alternating({
  heading,
  subheading,
  items,
}: FeaturesAlternatingProps) {
  return (
    <section className="bg-[var(--color-bg)] py-[var(--spacing-section)]">
      <Container>
        {(heading || subheading) && (
          <div className="max-w-2xl mx-auto text-center mb-[var(--spacing-block-gap)]">
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
        <div className="space-y-[var(--spacing-block-gap)]">
          {items.map((feature, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={i}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reversed ? "lg:[&>:first-child]:order-2" : ""}`}
              >
                <div>
                  <h3 className="text-2xl sm:text-3xl font-heading">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                {feature.image && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)]">
                    <Image
                      src={feature.image.src}
                      alt={feature.image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
