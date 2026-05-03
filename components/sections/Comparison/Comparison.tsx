import { Container } from "@/components/ui/Container";

export type ComparisonRow = {
  axis: string;
  traditional: string;
  drone: string;
};

export type ComparisonProps = {
  heading?: string;
  subheading?: string;
  /** Label for the left/contrast column. Defaults to a generic Czech phrase. */
  traditionalLabel?: string;
  /** Label for the right/highlighted column. Defaults to a generic Czech phrase. */
  droneLabel?: string;
  rows: ComparisonRow[];
};

export function Comparison({
  heading = "Co srovnáváme",
  subheading,
  traditionalLabel = "Tradiční postup",
  droneLabel = "Náš přístup",
  rows,
}: ComparisonProps) {
  return (
    <section className="py-[var(--spacing-section)] bg-[var(--color-bg)]">
      <Container>
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] mb-4">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th
                  scope="col"
                  className="text-left p-4 md:p-5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] w-1/3"
                >
                  Co srovnáváme
                </th>
                <th
                  scope="col"
                  className="text-left p-4 md:p-5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]"
                >
                  {traditionalLabel}
                </th>
                <th
                  scope="col"
                  className="text-left p-4 md:p-5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text)] bg-[var(--color-bg)]"
                >
                  {droneLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--color-border)] last:border-0"
                >
                  <th
                    scope="row"
                    className="text-left p-4 md:p-5 font-semibold align-top text-[var(--color-text)]"
                  >
                    {row.axis}
                  </th>
                  <td className="p-4 md:p-5 text-[var(--color-text-secondary)] align-top">
                    {row.traditional}
                  </td>
                  <td className="p-4 md:p-5 text-[var(--color-text)] align-top font-medium">
                    {row.drone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
