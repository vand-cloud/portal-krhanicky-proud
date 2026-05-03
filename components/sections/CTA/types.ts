import type { CTA as CTAAction } from "../Hero/types";

type CTABase = {
  heading: string;
  subheading?: string;
  ctaPrimary: CTAAction;
  ctaSecondary?: CTAAction;
};

export type CTABannerProps = CTABase & {
  variant: "banner";
  /** Heading + buttons alignment. Default left matches the editorial layout. */
  align?: "left" | "center";
};
export type CTASplitProps = CTABase & {
  variant: "split";
  image: { src: string; alt: string };
};

export type CTAProps = CTABannerProps | CTASplitProps;
