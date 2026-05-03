import { Container } from "@/components/ui/Container";
import type { FeaturesGridProps } from "./types";

export default function Grid({
  heading,
  subheading,
  items,
  columns = 3,
  align = "left",
}: FeaturesGridProps) {
  const colClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  const isCentered = align === "center";
  const headerClass = isCentered
    ? "max-w-2xl mx-auto text-center"
    : "max-w-2xl";
  const itemClass = isCentered
    ? "flex flex-col items-center text-center gap-3"
    : "flex flex-col gap-3";

  return (
    <section className="bg-[var(--color-bg)] py-[var(--spacing-section)]">
      <Container>
        {(heading || subheading) && (
          <div className={`${headerClass} mb-[var(--spacing-block)]`}>
            {heading && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-[family-name:var(--font-heading)]">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 text-lg text-[var(--color-text-secondary)] font-[family-name:var(--font-body)]">
                {subheading}
              </p>
            )}
          </div>
        )}
        <ul className={`grid grid-cols-1 ${colClass} gap-[var(--spacing-grid)]`}>
          {items.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <li key={i} className={itemClass}>
                {Icon && (
                  <div
                    aria-hidden="true"
                    className="inline-flex w-10 h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)]"
                  >
                    <Icon className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                )}
                <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
