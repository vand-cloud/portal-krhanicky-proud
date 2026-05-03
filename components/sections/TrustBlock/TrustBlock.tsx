import { Container } from "@/components/ui/Container";

export type TrustStat = {
  value: string;
  label: string;
};

export type TrustLogo = {
  /** Display name (used as alt text and as label fallback). */
  name: string;
  /** Optional image source. If missing, name is rendered as text badge. */
  src?: string;
};

export type TrustCertification = {
  label: string;
  description?: string;
};

export type TrustBlockProps = {
  heading?: string;
  subheading?: string;
  /** Statistic band: 3-5 numerical credibility points. */
  stats?: TrustStat[];
  /** Client / partner logos. */
  logos?: TrustLogo[];
  logosLabel?: string;
  /** Certifications, accreditations. */
  certifications?: TrustCertification[];
  certificationsLabel?: string;
};

export function TrustBlock({
  heading,
  subheading,
  stats,
  logos,
  logosLabel = "Pracujeme pro",
  certifications,
  certificationsLabel = "Certifikace a akreditace",
}: TrustBlockProps) {
  return (
    <section className="py-[var(--spacing-section)] bg-[var(--color-surface)]">
      <Container>
        {(heading || subheading) && (
          <div className="mb-12 max-w-3xl">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                {subheading}
              </p>
            )}
          </div>
        )}

        {stats && stats.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 pb-12 border-b border-[var(--color-border)]">
            {stats.map((stat, i) => (
              <li key={i}>
                <p className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        )}

        {logos && logos.length > 0 && (
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] mb-5">
              {logosLabel}
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {logos.map((logo, i) => (
                <li
                  key={i}
                  className="aspect-[3/2] flex items-center justify-center p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]"
                >
                  {logo.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain opacity-70"
                    />
                  ) : (
                    <span className="text-sm font-medium text-[var(--color-text-tertiary)] text-center">
                      {logo.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] mb-5">
              {certificationsLabel}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, i) => (
                <li
                  key={i}
                  className="p-5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)]"
                >
                  <p className="text-base font-semibold font-[family-name:var(--font-heading)] mb-1">
                    {cert.label}
                  </p>
                  {cert.description && (
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {cert.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
