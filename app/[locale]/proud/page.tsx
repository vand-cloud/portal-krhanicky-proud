import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/site.config";
import { ProudHero } from "@/components/sections/Proud/ProudHero";
import { ProudHighlights } from "@/components/sections/Proud/ProudHighlights";

export const metadata = { title: "Krhanický Proud" };

const VALUES = [
  {
    title: "Otevřená radnice",
    description:
      "Zveřejňujeme zápisy ze zasedání, smlouvy, rozpočet. Kdokoliv má přístup k tomu, kde končí veřejné peníze.",
  },
  {
    title: "Spravedlivý rozvoj",
    description:
      "Stavební rozvoj nesmí jít na úkor zeleně, klidu a charakteru obce. Měníme to, co opravdu chybí, ne co se hodí.",
  },
  {
    title: "Aktivní život",
    description:
      "Podporujeme spolky, kulturu a sport. Krhanice nejsou ulice domů, ale komunita lidí.",
  },
  {
    title: "Vstřícná obec",
    description:
      "Obec slouží občanům, ne naopak. Komunikace musí být srozumitelná, úřad dosažitelný, rozhodnutí dohledatelná.",
  },
];

// /proud is the about-page for the sdružení: who we are, what we
// stand for, who runs in the election. The programme rozcestník --
// hledání + sidebar of policy areas -- lives on the dedicated
// /proud/nas-program child route. Splitting the two means /proud
// stays readable as a single screen, and the programme page gets a
// clean anchor (no scroll choreography from a stacked layout).
export default async function ProudPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">Sdružení nezávislých občanů</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          Krhanický Proud
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          Jsme občané, kteří v Krhanicích žijí. Provozujeme tento portál
          celoročně jako informační rozcestník pro sousedy a návštěvníky obce.
          V období komunálních voleb vám představujeme i naši kandidátku.
        </p>
      </header>

      <ProudHero values={VALUES} />

      <ProudHighlights />

      {siteConfig.campaign.enabled ? (
        <section className="mt-16 rounded-lg border border-[var(--color-brand)] bg-[var(--color-brand)] p-6 text-[var(--color-text-on-brand)]">
          <p className="text-xs uppercase tracking-wider opacity-70">
            {siteConfig.campaign.name}
          </p>
          <h2 className="mt-2 text-xl font-bold text-[var(--color-text-on-brand)]">
            Kandidujeme do zastupitelstva obce Krhanice
          </h2>
          <p className="mt-4 text-sm leading-relaxed opacity-90">
            Naše kandidátka, program a podrobnosti k volbám najdete v sekci /volby.
          </p>
          <a
            href="/volby"
            className="mt-4 inline-block text-sm font-semibold underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-bg)]"
          >
            Otevřít volební sekci
          </a>
        </section>
      ) : null}
    </div>
  );
}
