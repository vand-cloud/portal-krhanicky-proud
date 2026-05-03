import type { HTMLAttributes } from "react";

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
};

const toneStyles: Record<NonNullable<AlertProps["tone"]>, string> = {
  info: "bg-sky-50 border-sky-200 text-sky-900",
  success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  danger: "bg-rose-50 border-rose-200 text-rose-900",
};

export function Alert({
  tone = "info",
  title,
  className = "",
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-[var(--radius-md)] border p-4 ${toneStyles[tone]} ${className}`}
      {...props}
    >
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? "mt-1" : ""}>{children}</div>}
    </div>
  );
}
