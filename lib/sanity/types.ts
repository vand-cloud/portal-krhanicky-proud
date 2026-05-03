import type { PortableTextBlock } from "@portabletext/types";

export type LegalPageSection = {
  heading: string;
  content: PortableTextBlock[];
};

export type LegalPage = {
  _id: string;
  title: string;
  slug: { current: string };
  language: "cs" | "en";
  lastUpdated: string;
  sections: LegalPageSection[];
};
