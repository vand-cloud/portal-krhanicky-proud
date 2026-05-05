import type { SocialLinks } from "@/content/entries";

// Inline brand glyphs -- lucide-react dropped these in v1.x. Simple shapes
// so they read well at small sizes (14-18 px). Use currentColor so wrappers
// can re-color via text-[var(--color-...)].

export function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
  );
}

export function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M21.582 7.169a2.515 2.515 0 0 0-1.768-1.778C18.254 5 12 5 12 5s-6.254 0-7.814.391a2.515 2.515 0 0 0-1.768 1.778C2 8.736 2 12 2 12s0 3.264.418 4.831a2.515 2.515 0 0 0 1.768 1.778C5.746 19 12 19 12 19s6.254 0 7.814-.391a2.515 2.515 0 0 0 1.768-1.778C22 15.264 22 12 22 12s0-3.264-.418-4.831zM10 15V9l5.196 3L10 15z" />
    </svg>
  );
}

// Order in which social icons appear when present. Listings and detail
// meta both render in this order.
export const SOCIAL_ITEMS: Array<{
  key: keyof SocialLinks;
  Icon: (props: { size?: number }) => React.JSX.Element;
  label: string;
}> = [
  { key: "facebook", Icon: FacebookIcon, label: "Facebook" },
  { key: "instagram", Icon: InstagramIcon, label: "Instagram" },
  { key: "linkedin", Icon: LinkedinIcon, label: "LinkedIn" },
  { key: "youtube", Icon: YoutubeIcon, label: "YouTube" },
];

// Strip protocol and trailing slash for display: "https://example.cz/" -> "example.cz".
export function formatWebUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
