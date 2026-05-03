export type ContactFormProps = {
  variant: "form";
  heading: string;
  subheading?: string;
  fields?: Array<"name" | "email" | "phone" | "company" | "message">;
  submitLabel?: string;
  action?: string;
};

export type ContactProps = ContactFormProps;
