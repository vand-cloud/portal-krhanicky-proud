import type { LucideIcon } from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  icon?: LucideIcon;
  image?: { src: string; alt: string };
};

type FeaturesBase = {
  heading?: string;
  subheading?: string;
  items: Feature[];
};

export type FeaturesGridProps = FeaturesBase & {
  variant: "grid";
  columns?: 2 | 3 | 4;
  /** Heading + items alignment. Default left matches the editorial layout
      used elsewhere on the site; "center" centers heading, items, icons. */
  align?: "left" | "center";
};

export type FeaturesAlternatingProps = FeaturesBase & {
  variant: "alternating";
};

export type FeaturesProps = FeaturesGridProps | FeaturesAlternatingProps;
