import { User } from "lucide-react";

// Small square thumbnail for person rows in listings -- candidates in
// /proud/nas-program and councillors in /urad. People are a deliberately
// photo-led "special element", so their listing row leads with a face,
// not a date. Same square + rounded-corner treatment as the programme
// cover thumbnail (ProudThumb), just 1:1 instead of 4:3, so the module
// stays systematic. Shows the photo when set, else a typed placeholder.
export function PersonThumb({ photoUrl }: { photoUrl?: string }) {
  return (
    <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] sm:w-28">
      {photoUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element -- Sanity asset URL. */
        <img
          src={photoUrl}
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
