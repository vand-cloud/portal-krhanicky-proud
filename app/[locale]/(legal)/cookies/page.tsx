import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { siteConfig } from "@/site.config";
import { getLegalPage, getSiteSettings } from "@/lib/sanity/fetch";
import { LegalPageRenderer } from "@/components/legal/LegalPageRenderer";

// Phase 4: body, title and last-updated date come from the Sanity legalPage
// document (slug "cookies"). The "Správce webu" block is built automatically
// from siteSettings.

export const metadata: Metadata = {
  title: "Pravidla cookies",
  description: `Informace o používání souborů cookies na ${siteConfig.brand.domain}.`,
};

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [doc, settings] = await Promise.all([
    getLegalPage("cookies"),
    getSiteSettings(),
  ]);
  if (!doc) notFound();

  return (
    <LegalPageRenderer
      title={doc.title ?? "Pravidla cookies"}
      body={doc.body}
      lastUpdated={doc.lastUpdated}
      controller={{
        name: settings?.contactName,
        addressStreet: settings?.addressStreet,
        addressCity: settings?.addressCity,
        email: settings?.contactEmail,
        phone: settings?.contactPhone,
      }}
    />
  );
}
