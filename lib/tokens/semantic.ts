// Semantic -- pojmenované role (referenced by components).
//
// Mirrors `app/globals.css` `:root` block. Components in CSS reach the
// semantic layer via `var(--color-bg)` etc.; this TS shadow exists for
// code paths that build values programmatically (inline SVG, runtime
// chart colors). Keep in sync with globals.css.
import { primitives } from "./primitives";

export const semantic = {
  color: {
    // Two-tier background semantics: paper page (warm) + elevated surface (white).
    page: primitives.colors.kp.paperCool,
    bg: primitives.colors.white,
    bgElev: primitives.colors.white,
    // Inert backgrounds (image placeholders, skeletons) stay neutral so empty
    // thumbnails do not advertise themselves with brand color.
    surface: primitives.colors.neutral[100],
    surfaceCool: primitives.colors.kp.blueMist,
    surfaceWarm: primitives.colors.kp.sand,
    // Text scale.
    text: primitives.colors.kp.ink,
    textSecondary: primitives.colors.kp.stone,
    textTertiary: "#8a8a8a",
    textAccent: primitives.colors.kp.navy,
    textOnBrand: primitives.colors.white,
    // Borders: warm (default) + cool (where surface mood is gray-blue).
    border: primitives.colors.kp.borderWarm,
    borderCool: primitives.colors.kp.borderCool,
    // Brand identity slots.
    brand: primitives.colors.kp.navy,
    accent: primitives.colors.kp.blue,
    accentSubtle: primitives.colors.kp.blueMist,
    // Semantic states (forms, alerts, badges).
    success: primitives.colors.kp.success,
    warn: primitives.colors.kp.warn,
    warnInk: primitives.colors.kp.warnInk,
    danger: primitives.colors.kp.danger,
  },
  font: {
    body: primitives.fontFamily.body,
    heading: primitives.fontFamily.heading,
    eyebrow: primitives.fontFamily.eyebrow,
  },
  radius: primitives.radius,
  shadow: primitives.shadow,
} as const;
