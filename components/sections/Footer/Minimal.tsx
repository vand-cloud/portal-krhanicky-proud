import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { FooterMinimalProps } from "./types";

export default function Minimal({ brand, copyright, legalLinks = [] }: FooterMinimalProps) {
  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)] py-8">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm font-semibold">{brand.name}</p>
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
          {copyright && (
            <p className="text-xs text-[var(--color-text-tertiary)]">{copyright}</p>
          )}
        </div>
      </Container>
    </footer>
  );
}
