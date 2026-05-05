import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs"],
  defaultLocale: "cs",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/pruvodce": "/pruvodce",
    "/obec": "/obec",
    "/obec/uredni-deska": "/obec/uredni-deska",
    "/obec/zastupitelstvo": "/obec/zastupitelstvo",
    "/obec/dokumenty": "/obec/dokumenty",
    "/obec/aktuality": "/obec/aktuality",
    "/proud": "/proud",
    "/volby": "/volby",
    "/blog": "/blog",
    "/zapojte-se": "/zapojte-se",
    "/gdpr": "/gdpr",
    "/cookies": "/cookies",
    "/pristupnost": "/pristupnost",
  },
});

export type Locale = (typeof routing.locales)[number];
