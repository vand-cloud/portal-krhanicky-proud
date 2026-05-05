import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs"],
  defaultLocale: "cs",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/obec": "/obec",
    "/obec/uredni-deska": "/obec/uredni-deska",
    "/obec/zastupitelstvo": "/obec/zastupitelstvo",
    "/obec/dokumenty": "/obec/dokumenty",
    "/obec/aktuality": "/obec/aktuality",
    "/proud": "/proud",
    "/volby": "/volby",
    "/blog": "/blog",
    "/zapojte-se": "/zapojte-se",
    // /rozcestnik is intentionally hidden from site navigation. It holds
    // the original curated 3-column homepage pending a pre-launch
    // decision (delete vs. promote vs. repurpose). See HANDOVER.md.
    "/rozcestnik": "/rozcestnik",
    "/gdpr": "/gdpr",
    "/cookies": "/cookies",
    "/pristupnost": "/pristupnost",
  },
});

export type Locale = (typeof routing.locales)[number];
