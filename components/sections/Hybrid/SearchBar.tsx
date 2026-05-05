"use client";

import { Search, X } from "lucide-react";

export function SearchBar({
  query,
  onChange,
  placeholder,
  size = "default",
  ariaLabel,
}: {
  query: string;
  onChange: (next: string) => void;
  placeholder: string;
  size?: "default" | "large";
  ariaLabel?: string;
}) {
  const heightClasses =
    size === "large"
      ? "py-4 pl-14 pr-12 text-base sm:text-lg"
      : "py-3 pl-12 pr-11 text-base";
  const iconSize = size === "large" ? 22 : 18;
  const iconLeft = size === "large" ? "left-4" : "left-3.5";

  return (
    <div className="relative">
      <Search
        size={iconSize}
        aria-hidden
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] ${iconLeft}`}
      />
      <input
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className={`w-full rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] font-medium text-[var(--color-text)] placeholder:font-normal placeholder:text-[var(--color-text-tertiary)] transition-colors focus:border-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${heightClasses}`}
      />
      {query ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Vymazat hledání"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <X size={16} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
