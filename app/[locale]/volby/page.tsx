import { setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { siteConfig } from "@/site.config";

export const metadata = { title: "Volby" };

export default async function VolbyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Outside campaign window: redirect to /proud (last election archive may live at /volby/2026 etc.)
  if (!siteConfig.campaign.enabled) {
    redirect("/proud");
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header>
        <p className="eyebrow mb-3">{siteConfig.campaign.name}</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          Kandidujeme do zastupitelstva obce Krhanice
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--color-text-secondary)]">
          Krhanický Proud je sdružení nezávislých občanů. V komunálních volbách 2026 vám představujeme svou kandidátku a program.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
          Kandidátka
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Kompletní listina kandidátů s krátkými profily, fotkami a kontakty bude doplněna podle harmonogramu kampaně.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
          Program
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Konkrétní kroky, které chceme po zvolení udělat. Členěné podle oblastí: rozvoj obce, zeleň a životní prostředí, kultura a sport, doprava, otevřená radnice.
        </p>
      </section>

      <section className="mt-16 rounded-lg border border-[var(--color-border)] p-5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        <p>
          Tento web je provozován sdružením Krhanický Proud. V mezivolebním období slouží jako informační rozcestník pro občany Krhanic, v období voleb se rozšiřuje o tuto sekci.
        </p>
      </section>
    </article>
  );
}
