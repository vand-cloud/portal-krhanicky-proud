import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/site.config";
import { getSiteSettings } from "@/lib/sanity/fetch";
import type { SiteSettingsVM } from "@/lib/sanity/content-types";
import { CookieConsentBanner } from "@/components/consent/CookieConsent";
import { SiteHeader } from "@/components/sections/Header";
import { TopBar, type TopBarConfig } from "@/components/sections/Header/TopBar";
import { SiteFooter } from "@/components/sections/Footer/SiteFooter";
import "../globals.css";

// Resolve which top-bar slot to show, if any. Driven by the Sanity
// siteSettings.alertBar: shown only when enabled and carrying text.
function resolveTopBar(settings: SiteSettingsVM | null): TopBarConfig | null {
  const bar = settings?.alertBar;
  if (bar?.enabled && bar.text?.length) {
    return { tone: bar.tone ?? "warning", icon: bar.icon, text: bar.text };
  }
  return null;
}

// Designed phase fonts:
//   Sora           -- display (h1-h4, hero titles, card titles)
//   Inter          -- body / UI (paragraphs, lead, buttons, forms)
//   JetBrains Mono -- eyebrow / meta (kicker above headings, dates, IDs)
// All three loaded with latin-ext for Czech diacritics. Variables map onto
// the --font-display / --font-sans / --font-mono primitives in globals.css.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.brand.name,
    template: `%s | ${siteConfig.brand.name}`,
  },
  description:
    "Krhanický PROUD — místní portál pro občany Krhanic. Akce, místa, služby a aktuality v okolí.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Site settings (alert bar, footer disclosure, contact overrides) are
  // optional chrome: ChromeWrapper falls back to siteConfig for every field
  // when settings is null. If Sanity is unreachable (e.g. CI runs with a
  // placeholder project id, or a transient outage), degrade to those static
  // defaults instead of crashing every page in the layout.
  const settings = await getSiteSettings().catch(() => null);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <ChromeWrapper settings={settings}>{children}</ChromeWrapper>
          <CookieConsentBanner />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

// Inline-only PortableText rendering for the footer disclosure: normal
// blocks become spans (the disclosure already sits inside a styled <p> in
// SiteFooter, so block-level paragraphs would produce invalid <p>-in-<p>).
const footerDisclosureComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <span>{children}</span>,
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-medium text-[var(--color-text)] underline underline-offset-2 outline-none transition-colors hover:text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          {children}
        </a>
      );
    },
  },
};

function ChromeWrapper({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: SiteSettingsVM | null;
}) {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  // The "guide" entry was dropped: the Krhanický průvodce IS the
  // homepage now, so the brand logo (top-left) already covers that
  // navigation. Keeping a redundant nav item would only add noise.
  //
  // Flat top-level nav: Program is its own item (no longer a dropdown
  // child under Proud), and the former "Obec" page is now "Úřad" at /urad.
  const navItems = [
    { label: tNav("proud"), href: "/proud" },
    { label: tNav("programme"), href: "/proud/nas-program" },
    { label: tNav("village"), href: "/urad" },
    { label: tNav("blog"), href: "/blog" },
    { label: tNav("getInvolved"), href: "/zapojte-se" },
  ];

  const legalLinks = [
    { label: tFooter("gdpr"), href: "/gdpr" },
    { label: tFooter("cookies"), href: "/cookies" },
    { label: tFooter("accessibility"), href: "/pristupnost" },
  ];

  const topBar = resolveTopBar(settings);

  // Inline link style shared by the footer disclosure + contact line.
  const footerLink =
    "font-medium text-[var(--color-text)] underline underline-offset-2 outline-none transition-colors hover:text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2";

  // Disclosure from Sanity siteSettings, rendered inline (span-level) so it
  // stays valid inside SiteFooter's <p> wrapper. Falls back to nothing.
  const disclosure = settings?.footerDisclosure?.length ? (
    <PortableText
      value={settings.footerDisclosure}
      components={footerDisclosureComponents}
    />
  ) : null;

  // Contact line built from siteSettings: name plain, phone + e-mail as
  // active tel:/mailto: links. Falls back to siteConfig.contact.
  const contactName = settings?.contactName ?? siteConfig.contact.name;
  const phone = settings?.contactPhone ?? siteConfig.contact.phone;
  const email = settings?.contactEmail ?? siteConfig.contact.email;
  const contact = (
    <>
      Kontakt: {contactName}
      {phone ? (
        <>
          ,{" "}
          <a href={`tel:${phone.replace(/\s/g, "")}`} className={footerLink}>
            {phone}
          </a>
        </>
      ) : null}
      {email ? (
        <>
          ,{" "}
          <a href={`mailto:${email}`} className={footerLink}>
            {email}
          </a>
        </>
      ) : null}
    </>
  );

  return (
    <>
      {topBar ? <TopBar config={topBar} /> : null}
      <SiteHeader
        brandName={siteConfig.brand.name}
        brandHref="/"
        navItems={navItems}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        brandName={siteConfig.brand.name}
        disclosure={disclosure}
        contact={contact}
        legalLinks={legalLinks}
        copyright={tFooter("copyright", {
          year: new Date().getFullYear(),
          brand: siteConfig.brand.name,
        })}
        social={settings?.social}
      />
    </>
  );
}
