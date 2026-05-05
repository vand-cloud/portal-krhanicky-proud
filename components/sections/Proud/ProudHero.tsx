import { ArrowRight, User } from "lucide-react";
import { type Person, peopleByAffiliation } from "@/content/people";
import { proudItems } from "@/content/proud";

interface Value {
  title: string;
  description: string;
}

// Contact CTA target. /zapojte-se has four blocks that already cover
// "kandidujte s námi". The programme CTA used to live under the values
// column too, but with the nav dropdown + "Celý program" link in the
// ProudHighlights strip below, three entry points are noise -- one was
// removed.
const CONTACT_CTA_HREF = "/zapojte-se";

// Resolve candidate cards by joining proudItems (preserves ballot order
// + supplies the /proud/[slug] href + role caption) with the Person
// record (photo + name details). Filter to public profiles only.
function getCandidateCards() {
  const candidatePeople = peopleByAffiliation("kandidat-2026").filter(
    (p) => p.visibility === "public",
  );
  return proudItems
    .filter((item) => item.category === "kandidati" && item.personId)
    .map((item) => {
      const person = candidatePeople.find((p) => p.id === item.personId);
      if (!person) return null;
      return { item, person };
    })
    .filter((c): c is { item: typeof proudItems[number]; person: Person } =>
      Boolean(c),
    );
}

// Two-column block sitting between the hero copy and the policy section.
//   left  (lg 5/12): values cards (2-col grid) + "Náš program" CTA
//   right (lg 7/12): candidates (3-col grid)         + "Zapojte se" CTA
// On mobile both blocks stack and their internal grids collapse.
export function ProudHero({ values }: { values: Value[] }) {
  const candidates = getCandidateCards();

  return (
    <section className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* ── Values + program CTA ───────────────────────────────────── */}
      <div className="lg:col-span-5">
        <h2 className="section-eyebrow">
          Hodnoty, které sdílíme
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <li
              key={v.title}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-5"
            >
              <h3 className="text-base font-semibold text-[var(--color-text-accent)]">
                {v.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {v.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Candidates + contact CTA ───────────────────────────────── */}
      <div className="lg:col-span-7">
        <h2 className="section-eyebrow">
          Kandidáti do voleb 2026
        </h2>
        {candidates.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-[var(--color-border)] px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">
            Kandidátku představíme v průběhu jara.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map(({ item, person }) => (
              <li key={item.id}>
                <a
                  // Goes to the candidate's detail under the programme
                  // page (sidebar stays mounted there). No anchor hack
                  // needed -- /proud/nas-program/[slug] is its own page,
                  // hero is only the programme intro.
                  href={item.href}
                  className="group flex h-full flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5 outline-none transition-colors hover:border-[var(--color-text-tertiary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  {/* Avatar -- typed placeholder when no photo is set
                      yet. Square aspect, soft surface so it reads as
                      "profile" without dominating the card. */}
                  <div
                    className="relative aspect-square w-16 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]"
                    aria-hidden
                  >
                    {person.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element -- Phase 2 wireframe; next/image comes in Phase 4 with Sanity assets. */
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[var(--color-text-tertiary)]">
                        <User size={22} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug text-[var(--color-text)] group-hover:underline group-hover:underline-offset-4">
                      {person.name}
                    </p>
                    {item.description ? (
                      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
        <a
          href={CONTACT_CTA_HREF}
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-elev)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          Zapojte se
          <ArrowRight size={16} aria-hidden />
        </a>
      </div>
    </section>
  );
}
