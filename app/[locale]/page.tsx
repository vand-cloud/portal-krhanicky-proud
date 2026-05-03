import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeView />;
}

function HomeView() {
  const t = useTranslations("nav");

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-heading)] mb-4">
          {t("home")}
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] font-[family-name:var(--font-body)]">
          ANFILOV Studio scaffold ready. Customize via `site.config.ts`.
        </p>
      </div>
    </main>
  );
}
