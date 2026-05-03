// site.config.ts
export type Phase = "wireframe" | "designed" | "sanity";
export type Locale = "cs" | "en";

export const siteConfig = {
  phase: "wireframe" as Phase,

  brand: {
    name: "Studio Template",
    domain: "example.cz",
    primaryColor: "#0A0A0A",
    secondaryColor: "#525252",
    accentColor: "#3D2817",
    // Wireframe phase: Inter only. Designer overrides display in designed phase.
    fontFamily: {
      display: "Inter",
      body: "Inter",
    },
  },

  i18n: {
    defaultLocale: "cs" as Locale,
    locales: ["cs"] as Locale[],          // single-locale by default
    localePrefix: "as-needed" as const,
  },

  concept: {
    layout: "boxed" as "boxed" | "wide" | "fluid",
    density: "comfortable" as "compact" | "comfortable" | "spacious",
    contrast: "balanced" as "soft" | "balanced" | "strong",
    motion: "minimal" as "minimal" | "expressive" | "playful",
    mode: "light" as "light" | "dark" | "auto",
  },

  componentDefaults: {
    radius: "soft" as "sharp" | "soft" | "round",
    shadows: "subtle" as "none" | "subtle" | "elevated",
    cardStyle: "outlined" as "flat" | "outlined" | "elevated",
    hover: "lift" as "scale" | "glow" | "lift" | "none",
  },

  storybook: {
    enabled: false,
  },

  contact: {
    email: "info@example.cz",
  },
} as const;

export type SiteConfig = typeof siteConfig;
