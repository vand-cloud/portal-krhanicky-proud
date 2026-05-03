import type { ReactNode } from "react";

export type TooltipProps = {
  label: string;
  children: ReactNode;
};

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="invisible absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--color-text)] px-2 py-1 text-xs text-[var(--color-bg)] group-hover:visible group-focus-within:visible"
      >
        {label}
      </span>
    </span>
  );
}
