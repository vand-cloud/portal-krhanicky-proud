import type { HTMLAttributes } from "react";

export type ImagePlaceholderProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Aspect ratio of the placeholder. Use "fill" to let the parent control
   * height (e.g. inside a stretched flex/grid cell). On mobile, "fill"
   * still falls back to a 16:9 ratio so stacked layouts don't collapse.
   */
  aspect?: "video" | "square" | "portrait" | "wide" | "tall" | "fill";
  /** Optional caption shown in the corner so the client knows what this slot is for. */
  label?: string;
};

const aspectClass: Record<NonNullable<ImagePlaceholderProps["aspect"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[3/1]",
  tall: "aspect-[4/5]",
  fill: "aspect-video lg:aspect-auto lg:h-full",
};

/**
 * Wireframe-phase image placeholder. Renders a neutral surface with a small
 * picture icon and an optional label. Replaced by real <Image> in the
 * designed/sanity phase.
 */
export function ImagePlaceholder({
  aspect = "video",
  label,
  className = "",
  ...props
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label || "Placeholder pro obrázek"}
      className={`${aspectClass[aspect]} relative w-full overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] flex items-center justify-center text-[var(--color-text-tertiary)] ${className}`}
      {...props}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      {label && (
        <span className="absolute bottom-2 left-2 right-2 text-xs uppercase tracking-wide text-[var(--color-text-tertiary)] truncate">
          {label}
        </span>
      )}
    </div>
  );
}
