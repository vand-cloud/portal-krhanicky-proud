import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/site.config";
import { Calendar, MapPin, MessageSquare, Vote, Mail } from "lucide-react";

export const metadata = { title: "Zapojte se" };

const WAYS = [
  {
    icon: Calendar,
    title: "Nahlaste akci",
    description:
      "Pořádáte koncert, sokolský turnaj, sousedské setkání? Pošlete nám detail, doplníme to do kalendáře.",
  },
  {
    icon: MapPin,
    title: "Doplňte místo nebo službu",
    description:
      "Chybí na portálu hospoda, řemeslník nebo zajímavost v okolí? Dejte nám tip, prověříme a přidáme.",
  },
  {
    icon: MessageSquare,
    title: "Pošlete poznámku k obsahu",
    description:
      "Něco se vám nezdá, něco chybí, něco je špatně. Krátká zpráva pomáhá portál zlepšit.",
  },
  {
    icon: Vote,
    title: "Kandidujte s námi",
    description:
      "Záleží vám na tom, jak Krhanice fungují? Zvažujete vstup do komunální politiky? Ozvěte se, rádi se s vámi sejdeme a probereme, co byste mohli přinést na kandidátku Krhanického Proudu.",
  },
];

export default async function GetInvolvedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">Kontakt</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          Zapojte se
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
          Tento portál stojí na sousedské spolupráci. Akce, místa a tipy
          přicházejí často přímo od vás.
        </p>
      </header>

      {/* Four ways to contribute. Two columns on tablet, four on desktop
          so each card has room for the longer body of "Kandidujte s námi"
          without breaking the visual rhythm. */}
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WAYS.map((w) => {
          const Icon = w.icon;
          return (
            <li
              key={w.title}
              className="flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-5"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-surface)] text-[var(--color-text)]">
                <Icon size={20} aria-hidden />
              </span>
              <h2 className="mt-3 text-base font-semibold text-[var(--color-text-accent)]">
                {w.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {w.description}
              </p>
            </li>
          );
        })}
      </ul>

      {/* "Pište nám" -- full-width contact panel. Title on the left over
          two lines (intro + secondary line) for visual consistency with
          other split-row sections; mailto CTA on the right. */}
      <section className="mt-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-[var(--color-text-accent)] sm:text-2xl">
              Pište nám
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Strukturované formuláře dorazí ve fázi obsahové migrace do Sanity.
              <br className="hidden sm:block" />
              Zatím nás zastihnete e-mailem, ozveme se vám zpravidla do dvou pracovních dnů.
            </p>
          </div>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-on-brand)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            <Mail size={16} aria-hidden />
            {siteConfig.contact.email}
          </a>
        </div>
      </section>
    </div>
  );
}
