// Semantic — pojmenované role (referenced by components)
import { primitives } from "./primitives";

export const semantic = {
  color: {
    bg: primitives.colors.white,
    surface: primitives.colors.neutral[50],
    text: primitives.colors.neutral[900],
    textSecondary: primitives.colors.neutral[600],
    textTertiary: primitives.colors.neutral[500],
    border: primitives.colors.neutral[200],
    brand: primitives.colors.neutral[900],
    accent: primitives.colors.neutral[900],
    accentSubtle: primitives.colors.neutral[100],
  },
} as const;
