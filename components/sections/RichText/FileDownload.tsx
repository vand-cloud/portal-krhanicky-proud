import { Download, FileText } from "lucide-react";

// Full-width download bar for rich-text bodies (e.g. úřední novinky with an
// attached document). Currently a prop-driven standalone component; later it
// is wired to Sanity file assets (size/fileType come from asset metadata).
//
// The whole element is a single <a download> so the entire bar is one
// keyboard-focusable target. Icons are decorative (aria-hidden); the
// accessible name lives on the anchor via aria-label. Only semantic tokens
// are used, so light/dark inherit automatically.
export function FileDownload({
  name,
  href,
  size,
  fileType,
}: {
  name: string; // document title, e.g. "Zápis ze zastupitelstva 6/2026"
  href: string; // link to the file
  size?: string; // e.g. "1,2 MB" (later from Sanity asset metadata)
  fileType?: string; // e.g. "PDF" (extension / type)
}) {
  // Build the type/size subline from whatever fields are present. A " · "
  // separator joins them; missing fields simply drop out.
  const metaParts = [fileType, size].filter(Boolean) as string[];
  const meta = metaParts.join(" · ");

  return (
    <a
      href={href}
      download
      aria-label={`Stáhnout ${name}${size ? `, ${size}` : ""}`}
      className="group flex w-full items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 no-underline outline-none transition-colors hover:border-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elev)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
    >
      {/* Left: file glyph in a tinted, rounded square. */}
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
        <FileText size={20} aria-hidden />
      </span>

      {/* Middle: document name + (optional) type/size subline. */}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium text-[var(--color-text)]">
          {name}
        </span>
        {meta ? (
          <span className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
            {meta}
          </span>
        ) : null}
      </span>

      {/* Right: download affordance. Label hides on small screens, leaving
          just the icon; the anchor's aria-label still carries the full name. */}
      <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-accent)]">
        <span className="hidden sm:inline">Stáhnout</span>
        <Download size={18} aria-hidden />
      </span>
    </a>
  );
}
