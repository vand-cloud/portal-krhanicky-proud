import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { FooterDefaultProps } from "./types";

export default function Default({
  brand,
  columns = [],
  copyright,
  legalLinks = [],
}: FooterDefaultProps) {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-[var(--spacing-block)]">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <p className="text-lg font-semibold font-heading">
              {brand.name}
            </p>
            {brand.tagline && (
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {brand.tagline}
              </p>
            )}
          </div>
          {columns.map((column, i) => (
            <div key={i}>
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                {column.heading}
              </p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-text)] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {copyright && (
            <p className="text-xs text-[var(--color-text-tertiary)]">{copyright}</p>
          )}
          {legalLinks.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-xs text-[var(--color-text-tertiary)] hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </footer>
  );
}
