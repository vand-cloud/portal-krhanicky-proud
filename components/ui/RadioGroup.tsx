import { forwardRef, type InputHTMLAttributes } from "react";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        type="radio"
        className={`h-4 w-4 border-[var(--color-border)] text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${className}`}
        {...props}
      />
    );
  }
);
