import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs", "en"],
  defaultLocale: "cs",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/o-nas": {
      cs: "/o-nas",
      en: "/about",
    },
    "/sluzby": {
      cs: "/sluzby",
      en: "/services",
    },
    "/kontakt": {
      cs: "/kontakt",
      en: "/contact",
    },
    "/gdpr": {
      cs: "/gdpr",
      en: "/privacy-policy",
    },
    "/cookies": {
      cs: "/cookies",
      en: "/cookies",
    },
    "/pristupnost": {
      cs: "/pristupnost",
      en: "/accessibility",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
