import { User } from "lucide-react";
import { findPersonById } from "@/content/people";

// Small square thumbnail for person rows in listings -- candidates in
// /proud/nas-program and councillors in /urad. People are a deliberately
// photo-led "special element", so their listing row leads with a face,
// not a date. Same square + rounded-corner treatment as the programme
// cover thumbnail (ProudThumb), just 1:1 instead of 4:3, so the module
// stays systematic. Shows the person's photo when set, else a typed
// placeholder until the operator adds one (Sanity asset, Phase 4).
export function PersonThumb({ personId }: { personId?: string }) {
  const person = personId ? findPersonById(personId) : null;
  return (
    <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] sm:w-28">
      {person?.photo ? (
        /* eslint-disable-next-line @next/next/no-img-element -- Phase 2 wireframe; next/image comes in Phase 4 with Sanity assets. */
        <img
          src={person.photo}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-[var(--color-text-tertiary)]"
          aria-hidden
        >
          <User size={24} />
        </div>
      )}
    </div>
  );
}
