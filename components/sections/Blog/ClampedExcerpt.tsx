"use client";

import { useLayoutEffect, useRef } from "react";

// BlogCard titles run 1-3 lines depending on length, but the grid row
// stretches every card in it to match the tallest one -- so a short title
// leaves the excerpt more room than a fixed line-clamp ever uses, ending
// with an ellipsis while blank space sits below it. This measures the
// height the flex layout actually leaves for the excerpt and clamps to
// exactly that many lines instead, so shorter titles show more excerpt.
export function ClampedExcerpt({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const recalc = () => {
      // Measure as a plain block first -- flex-grow still sizes it to the
      // leftover column space even without the line-clamp box mode, and
      // this avoids measuring a box whose height the clamp already fixed.
      el.style.display = "block";
      el.style.webkitLineClamp = "unset";
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const available = el.getBoundingClientRect().height;
      const lines =
        lineHeight > 0 ? Math.max(1, Math.floor(available / lineHeight)) : 3;
      el.style.display = "-webkit-box";
      el.style.webkitBoxOrient = "vertical";
      el.style.webkitLineClamp = String(lines);
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  return (
    <p
      ref={ref}
      className="line-clamp-3 mt-2 flex-1 overflow-hidden text-sm text-[var(--color-text-secondary)]"
    >
      {text}
    </p>
  );
}
