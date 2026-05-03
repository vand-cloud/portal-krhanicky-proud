import type { CTA } from "./types";
import Link from "next/link";

export function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide uppercase mb-8">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
      {children}
    </div>
  );
}

const ctaSolid =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-brand)] text-[var(--color-bg)] px-6 py-3 text-lg font-medium hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2";

const ctaGhost =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] text-[var(--color-text)] px-6 py-3 text-lg font-medium hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2";

export function HeroCTAs({ primary, secondary }: { primary?: CTA; secondary?: CTA }) {
  if (!primary && !secondary) return null;
  return (
    <div className="mt-10 flex flex-col sm:flex-row gap-4">
      {primary && (
        <Link
          href={primary.href}
          className={ctaSolid}
          {...(primary.external && { target: "_blank", rel: "noopener" })}
        >
          {primary.label}
        </Link>
      )}
      {secondary && (
        <Link
          href={secondary.href}
          className={ctaGhost}
          {...(secondary.external && { target: "_blank", rel: "noopener" })}
        >
          {secondary.label}
        </Link>
      )}
    </div>
  );
}
