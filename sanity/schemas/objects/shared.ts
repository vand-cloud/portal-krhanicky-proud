import { defineField } from "sanity";

// Inline link annotation reused by richBody and inlineRichText. Allows
// external URLs plus relative app links, mailto and tel.
export const linkAnnotation = {
  name: "link",
  type: "object" as const,
  title: "Odkaz",
  fields: [
    defineField({
      name: "href",
      type: "url",
      title: "URL",
      validation: (rule) =>
        rule
          .uri({
            allowRelative: true,
            scheme: ["http", "https", "mailto", "tel"],
          })
          .required(),
    }),
  ],
};
