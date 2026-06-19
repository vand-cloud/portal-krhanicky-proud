import { setRequestLocale } from "next-intl/server";
import { Mail } from "lucide-react";
import { getZapojteSePage, getSiteSettings } from "@/lib/sanity/fetch";
import { Icon } from "@/components/sections/RichText/IconRender";

export const metadata = { title: "Zapojte se" };

export default async function GetInvolvedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [page, settings] = await Promise.all([
    getZapojteSePage(),
    getSiteSettings(),
  ]);

  const cards = page?.cards ?? [];
  const contactEmail = settings?.contactEmail ?? "ahoj@krhanickyproud.cz";
  const contactTitle = page?.contactBlock?.title ?? "Pište nám";
  const contactText =
    page?.contactBlock?.text ??
    "Strukturované formuláře dorazí ve fázi obsahové migrace do Sanity. Zatím nás zastihnete e-mailem, ozveme se vám zpravidla do dvou pracovních dnů.";
  const contactButtonLabel = page?.contactBlock?.buttonLabel ?? contactEmail;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">{page?.eyebrow ?? "Kontakt"}</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          {page?.title ?? "Zapojte se"}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
          {page?.subtitle ??
            "Tento portál stojí na sousedské spolupráci. Akce, místa a tipy přicházejí často přímo od vás."}
        </p>
      </header>

      {/* Ways to contribute. Two columns on tablet, four on desktop so each
          card has room for the longer body without breaking the rhythm. */}
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <li
            key={card.title ?? i}
            className="flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-5"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-surface)] text-[var(--color-text)]">
              <Icon name={card.icon} size={20} aria-hidden />
            </span>
            <h2 className="mt-3 text-base font-semibold text-[var(--color-text-accent)]">
              {card.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {card.text}
            </p>
          </li>
        ))}
      </ul>

      {/* Contact panel: title on the left, mailto CTA on the right. */}
      <section className="mt-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-[var(--color-text-accent)] sm:text-2xl">
              {contactTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              {contactText}
            </p>
          </div>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-on-brand)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            <Mail size={16} aria-hidden />
            {contactButtonLabel}
          </a>
        </div>
      </section>
    </div>
  );
}
