export type FooterLink = { label: string; href: string };
export type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

type FooterBase = {
  brand: { name: string; tagline?: string };
  columns?: FooterColumn[];
  copyright?: string;
  legalLinks?: FooterLink[];
};

export type FooterDefaultProps = FooterBase & { variant: "default" };
export type FooterMinimalProps = FooterBase & { variant: "minimal" };

export type FooterProps = FooterDefaultProps | FooterMinimalProps;
