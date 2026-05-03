import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { routing } from "@/i18n/routing";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { ConsentGatedGA4 } from "@/components/consent/Analytics";
import "../globals.css";

// Wireframe phase: Inter only. Display font (Fraunces, etc.) gets added in
// designed phase via the same loader pattern, mapped to --font-heading.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio Template",
  description: "ANFILOV Studio template for client websites",
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
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          {children}
          <CookieBanner />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
        {/* Optional: Google Analytics 4 (consent-gated). Uncomment + set NEXT_PUBLIC_GA_ID env to enable. */}
        {/* <ConsentGatedGA4 gaId={process.env.NEXT_PUBLIC_GA_ID} /> */}
      </body>
    </html>
  );
}
