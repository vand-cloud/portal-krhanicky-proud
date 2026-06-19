import { defineType, defineField } from "sanity";

// YouTube embed block for richBody. Stores just the watch/share URL; the
// PortableText serializer extracts the id and renders a responsive iframe.
export const youtube = defineType({
  name: "youtube",
  title: "YouTube video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL videa",
      type: "url",
      description: "Odkaz na YouTube video (např. https://www.youtube.com/watch?v=...).",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { url: "url" },
    prepare: ({ url }) => ({ title: "YouTube video", subtitle: url }),
  },
});
