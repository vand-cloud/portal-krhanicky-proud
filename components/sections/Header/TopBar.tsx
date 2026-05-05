import { AlertTriangle, Megaphone } from "lucide-react";

export type TopBarTone = "alert" | "campaign";

export type TopBarConfig = {
  tone: TopBarTone;
  text: string;
  // When omitted, the bar renders as plain text (no link). Useful for
  // stand-alone notices like "Pozor, nepůjde proud" without a detail page.
  href?: string | null;
};

// Single thin bar above the site header. Two visual tones:
// - alert    : amber background, dark text, triangle icon -- urgent
// - campaign : inverted dark background, light text, megaphone -- marketing
//
// When `href` is present, the whole bar acts as a single link (full-width
// click target). Without `href` it falls back to a plain <div>.
export function TopBar({ config }: { config: TopBarConfig }) {
  const Icon = config.tone === "alert" ? AlertTriangle : Megaphone;

  const toneClass =
    config.tone === "alert"
      ? "bg-[var(--color-warn)] text-[var(--color-warn-ink)]"
      : "bg-[var(--color-brand)] text-[var(--color-text-on-brand)]";

  const inner = (
    <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-xs font-medium sm:text-sm">
      <Icon size={14} aria-hidden className="shrink-0" />
      <span>{config.text}</span>
    </div>
  );

  if (config.href) {
    return (
      <a
        href={config.href}
        className={`block ${toneClass} outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2`}
      >
        {inner}
      </a>
    );
  }

  // Stand-alone notice. Use role="status" so screen readers announce the
  // text on first render but do not interrupt the user mid-action.
  return (
    <div className={toneClass} role="status">
      {inner}
    </div>
  );
}
