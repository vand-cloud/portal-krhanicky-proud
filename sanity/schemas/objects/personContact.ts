import { defineType, defineField } from "sanity";

// Contact block on a person. As rich as needed -- only filled fields render.
export const personContact = defineType({
  name: "personContact",
  title: "Kontakt",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "web", title: "Web", type: "url" }),
    defineField({ name: "facebook", title: "Facebook", type: "url" }),
    defineField({ name: "instagram", title: "Instagram", type: "url" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
    defineField({ name: "youtube", title: "YouTube", type: "url" }),
  ],
});
