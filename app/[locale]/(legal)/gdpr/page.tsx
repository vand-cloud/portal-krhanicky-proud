import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { client } from "@/lib/sanity/client";
import { legalPageQuery } from "@/lib/sanity/queries";
import { LegalPageRenderer } from "@/components/legal/LegalPageRenderer";
import type { LegalPage } from "@/lib/sanity/types";

// Render on demand — content lives in Sanity, fetched per request.
export const dynamic = "force-dynamic";

export default async function GDPRPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await client.fetch<LegalPage | null>(legalPageQuery, {
    slug: "gdpr",
    locale,
  });

  if (!page) notFound();

  return <LegalPageRenderer page={page} />;
}
