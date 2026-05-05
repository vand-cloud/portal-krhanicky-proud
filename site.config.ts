// site.config.ts
export type Phase = "wireframe" | "designed" | "sanity";
export type Locale = "cs" | "en";

export const siteConfig = {
  phase: "designed" as Phase,

  brand: {
    name: "Krhanický Proud",
    domain: "krhanicky-proud.cz",
    // Krhanice Navy + Proud Blue, from Claude Design system bundle.
    primaryColor: "#00257B",
    secondaryColor: "#0077C0",
    accentColor: "#0077C0",
    fontFamily: {
      display: "Sora",
      body: "Inter",
      mono: "JetBrains Mono",
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
    email: "krhanicky.proud@gmail.com",
  },

  // Legal entity (controller) shown in /gdpr, /cookies, /pristupnost as
  // "Správce webu". Wireframe phase ships with [DOPLNIT] placeholders so
  // the launch step can't accidentally go live with leftover data; the
  // visible markers force a real value before /launch-web. Phase 4 moves
  // this onto a Sanity siteSettings singleton.
  legalEntity: {
    name: "[DOPLNIT právní subjekt]",
    addressLine1: "[DOPLNIT ulice + č. p.]",
    addressLine2: "[DOPLNIT PSČ + obec]",
    email: "krhanicky.proud@gmail.com",
    phone: "" as string,
  },

  // Campaign mode for the /volby section. False outside election periods,
  // true during the local election cycle (komunální volby 2026, 2030, …).
  campaign: {
    enabled: false,
    name: "Volby 2026",
    barCta: "Volby 2026: kandidátka a program",
    archivePath: "/volby/2026",
  },

  // ─── Top-bar slots ──────────────────────────────────────────────────────
  // Two banner slots rendered above the site header. ALERT takes priority:
  // when both are enabled, only ALERT shows. The reasoning: alerts are
  // urgent (power cut, road closure) and would lose meaning if buried under
  // a marketing campaign banner.
  //
  // CAMPAIGN: long-running marketing call to action (election period,
  // fundraising, season tagline). Calmer dark style.
  topBar: {
    campaign: {
      enabled: false,
      // Default text mirrors the legacy `campaign.barCta` so flipping
      // `campaign.enabled` works the same way it did before.
      text: "Volby 2026: kandidátka a program",
      href: "/volby" as string | null,
    },
    // ALERT: ad-hoc urgent notice (outage, weather, event change).
    // Stronger amber treatment so it cuts through the page.
    // `href` is optional -- text-only bar is fine for stand-alone notices.
    alert: {
      enabled: true,
      text: "Pozor, ve čtvrtek od 12 do 16 hodin nepůjde proud v ulicích Pod Vrškem a Na Návsi.",
      href: "/obec/aktuality/vypadek-proudu" as string | null,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
