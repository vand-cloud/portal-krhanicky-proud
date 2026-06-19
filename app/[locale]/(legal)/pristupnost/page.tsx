import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { siteConfig } from "@/site.config";
import { getLegalPage, getSiteSettings } from "@/lib/sanity/fetch";
import { LegalPageRenderer } from "@/components/legal/LegalPageRenderer";

// Phase 4: body, title and last-updated date come from the Sanity legalPage
// document (slug "pristupnost"). The "Správce webu" block is built
// automatically from siteSettings.

export const metadata: Metadata = {
  title: "Prohlášení o přístupnosti",
  description: `Prohlášení o přístupnosti webu ${siteConfig.brand.domain} dle směrnice (EU) 2016/2102 a zákona č. 99/2019 Sb.`,
};

export default async function PristupnostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [doc, settings] = await Promise.all([
    getLegalPage("pristupnost"),
    getSiteSettings(),
  ]);
  if (!doc) notFound();

  return (
    <LegalPageRenderer
      title={doc.title ?? "Prohlášení o přístupnosti"}
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
