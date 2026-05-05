import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/site.config";
import { CookieConsentBanner } from "@/components/consent/CookieConsent";
import { SiteHeader } from "@/components/sections/Header";
import { TopBar, type TopBarConfig } from "@/components/sections/Header/TopBar";
import { SiteFooter } from "@/components/sections/Footer/SiteFooter";
import "../globals.css";

// Resolve which top-bar slot to show, if any. ALERT overrides CAMPAIGN
// when both are enabled -- urgent notices win over marketing.
function resolveTopBar(): TopBarConfig | null {
  const { alert, campaign } = siteConfig.topBar;
  if (alert.enabled) {
    return { tone: "alert", text: alert.text, href: alert.href };
  }
  if (campaign.enabled) {
    return { tone: "campaign", text: campaign.text, href: campaign.href };
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
    "Krhanický Proud — místní portál pro občany Krhanic. Akce, místa, služby a aktuality v okolí.",
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

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <ChromeWrapper>{children}</ChromeWrapper>
          <CookieConsentBanner />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

function ChromeWrapper({ children }: { children: React.ReactNode }) {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  // The "guide" entry was dropped: the Krhanický průvodce IS the
  // homepage now, so the brand logo (top-left) already covers that
  // navigation. Keeping a redundant nav item would only add noise.
  const navItems = [
    { label: tNav("village"), href: "/obec" },
    {
      label: tNav("proud"),
      href: "/proud",
      children: [
        { label: tNav("programme"), href: "/proud/nas-program" },
      ],
    },
    { label: tNav("blog"), href: "/blog" },
    { label: tNav("getInvolved"), href: "/zapojte-se" },
  ];

  const legalLinks = [
    { label: tFooter("gdpr"), href: "/gdpr" },
    { label: tFooter("cookies"), href: "/cookies" },
    { label: tFooter("accessibility"), href: "/pristupnost" },
  ];

  const topBar = resolveTopBar();

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
        disclosure={tFooter("disclosure")}
        legalLinks={legalLinks}
        copyright={tFooter("copyright", {
          year: new Date().getFullYear(),
          brand: siteConfig.brand.name,
        })}
      />
    </>
  );
}
