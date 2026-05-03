// Primitives — raw values, source of truth for token values
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
  },
  spacing: {
    section: "6rem",
    sectionHero: "8rem",
    block: "3rem",
    grid: "2rem",
  },
  fontFamily: {
    body: '"Inter", system-ui, -apple-system, sans-serif',
    heading: '"Fraunces", Georgia, serif',
  },
  radius: {
    none: "0",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
} as const;
