import type { ReactNode } from "react";

export type CTA = {
  label: string;
  href: string;
  external?: boolean;
};

type HeroBase = {
  title: string;
  subtitle?: string;
  badge?: string;
  ctaPrimary?: CTA;
  ctaSecondary?: CTA;
};

export type HeroCenteredProps = HeroBase & {
  variant: "centered";
};

export type HeroLeftProps = HeroBase & {
  variant: "left";
};

export type HeroSplitProps = HeroBase & {
  variant: "split";
  /** Real image. When omitted, the wireframe ImagePlaceholder is rendered. */
  image?: { src: string; alt: string };
  /** Optional caption shown on the placeholder during wireframe phase. */
  imageLabel?: string;
  imagePosition?: "left" | "right";
};

export type HeroMinimalProps = HeroBase & {
  variant: "minimal";
};

export type HeroProps =
  | HeroCenteredProps
  | HeroLeftProps
  | HeroSplitProps
  | HeroMinimalProps;
