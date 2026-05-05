// Primitives -- raw values, source of truth for token values.
//
// Mirrors `app/globals.css` `@theme` block. Tailwind v4 reads tokens directly
// from the CSS layer, so this TypeScript shadow is for code that needs to
// reference token values programmatically (e.g. dynamic inline SVG, color
// pickers, generated chart palettes). When `globals.css` changes, this file
// must change too -- they are intentional duplicates.
export const primitives = {
  colors: {
    black: "#000000",
    white: "#ffffff",
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },
    // Krhanický Proud brand palette. Restrained mostly-blue, anchored by
    // navy + sky blue + warm paper neutrals.
    kp: {
      navy: "#00257b",       // primary -- logo, headings, key UI
      navyHover: "#001f66",  // navy -8% L
      navyPress: "#001a52",  // navy -12% L
      blue: "#0077c0",       // secondary -- links, accents, focus
      blueMid: "#5ba0ce",    // supporting -- quiet illustrative
      blueSky: "#a9cce3",    // tertiary -- backgrounds, dividers
      blueMist: "#d4e5f2",   // surface tint -- cards, hover bg
      paper: "#f8f7f3",      // warm off-white (page background default)
      paperCool: "#f2f5f9",  // gray-blue paper tint
      sand: "#e8e2d5",       // section bg, tinted bands
      stone: "#5c5c5c",      // body text on light
      ink: "#1a1a1a",        // strongest text
      borderWarm: "#e1ddd2",
      borderCool: "#dce6ef",
      success: "#3b7a4b",
      warn: "#f2c94c",
      warnInk: "#5c3a00",
      danger: "#9b2c2c",
    },
  },
  spacing: {
    section: "6rem",
    sectionHero: "8rem",
    block: "3rem",
    grid: "2rem",
  },
  fontFamily: {
    // Designed phase: Sora (display), Inter (body), JetBrains Mono (eyebrow).
    body: "var(--font-sans), system-ui, -apple-system, sans-serif",
    heading: "var(--font-display), system-ui, -apple-system, sans-serif",
    eyebrow: 'var(--font-mono), ui-monospace, "SF Mono", Menlo, monospace',
  },
  radius: {
    none: "0",
    xs: "0.25rem",   // 4 -- inputs
    sm: "0.375rem",  // 6
    md: "0.5rem",    // 8 -- buttons, cards
    lg: "0.75rem",   // 12 -- large surfaces
    xl: "1rem",      // 16
    full: "9999px",
  },
  shadow: {
    sm: "0 1px 2px rgba(0, 37, 123, 0.06)",
    md: "0 4px 12px rgba(0, 37, 123, 0.08)",
    lg: "0 12px 32px rgba(0, 37, 123, 0.10)",
    focus: "0 0 0 3px rgba(0, 119, 192, 0.35)",
  },
} as const;
