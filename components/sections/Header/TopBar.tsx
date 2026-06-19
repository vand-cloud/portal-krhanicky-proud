import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Icon } from "@/components/sections/RichText/IconRender";

export type TopBarTone = "warning" | "campaign";

export type TopBarConfig = {
  tone: TopBarTone;
  // Optional icon-picker value (lib/icons.ts). Renders nothing when unset.
  icon?: string;
  // Rich text rendered inline on a single line; may carry an inline link.
  text: PortableTextBlock[];
};

// Single thin bar above the site header. Two visual tones:
// - warning  : amber background, dark text -- urgent notice
// - campaign : green background, light text -- marketing / call to action
//
// The bar is a plain <div role="status"> so screen readers announce the
// notice on first render without interrupting the user. Any link lives
// inside the rich text, not on the whole bar.
export function TopBar({ config }: { config: TopBarConfig }) {
  const toneClass =
    config.tone === "campaign"
      ? "bg-[var(--color-success)] text-[var(--color-bg)]"
      : "bg-[var(--color-warn)] text-[var(--color-warn-ink)]";

  // Minimal inline rendering: normal blocks become spans (no paragraph
  // margins) so the bar stays a single thin line; links inherit the tone
  // text color and gain an underline + focus ring.
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <span>{children}</span>,
    },
    marks: {
      link: ({ children, value }) => {
        const href: string = value?.href ?? "#";
        const external = /^https?:\/\//.test(href);
        return (
          <a
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className={toneClass} role="status">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-xs font-medium sm:text-sm">
        <Icon name={config.icon} size={14} aria-hidden className="shrink-0" />
        <PortableText value={config.text} components={components} />
      </div>
    </div>
  );
}
