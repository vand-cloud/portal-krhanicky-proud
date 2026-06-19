import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getLegalPage, getSiteSettings } from "@/lib/sanity/fetch";
import { LegalPageRenderer } from "@/components/legal/LegalPageRenderer";

// Phase 4: body, title and last-updated date come from the Sanity legalPage
// document (slug "gdpr"). The "Správce webu" block is built automatically
// from siteSettings, so the controller details live in one place.

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů",
  description:
    "Informace o zpracování a ochraně osobních údajů v souladu s GDPR.",
};

export default async function GdprPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [doc, settings] = await Promise.all([
    getLegalPage("gdpr"),
    getSiteSettings(),
  ]);
  if (!doc) notFound();

  return (
    <LegalPageRenderer
      title={doc.title ?? "Zásady ochrany osobních údajů"}
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
