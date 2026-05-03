import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  cardStyle?: "flat" | "outlined" | "elevated";
};

const cardStyles: Record<NonNullable<CardProps["cardStyle"]>, string> = {
  flat: "bg-[var(--color-surface)]",
  outlined: "border border-[var(--color-border)]",
  elevated:
    "bg-[var(--color-bg)] shadow-md border border-[var(--color-border)]",
};

export function Card({
  cardStyle = "outlined",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] p-6 ${cardStyles[cardStyle]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
