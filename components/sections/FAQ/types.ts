export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQAccordionProps = {
  variant: "accordion";
  heading?: string;
  subheading?: string;
  items: FAQItem[];
};

export type FAQProps = FAQAccordionProps;
