// Shared icon set for the alert bar (siteSettings) and the "Zapojte se"
// cards. `value` is a lucide-react icon id; Studio's icon picker offers
// these by `title`, and components/sections/RichText/IconRender.tsx maps
// the value back to a lucide component. Keep this list and that map in
// sync -- they are the single source for the available icons.
export const ICON_OPTIONS = [
  { value: "triangle-alert", title: "Výstraha (trojúhelník)" },
  { value: "info", title: "Informace" },
  { value: "circle-alert", title: "Vykřičník v kolečku" },
  { value: "megaphone", title: "Megafon (promo)" },
  { value: "vote", title: "Volby" },
  { value: "calendar-clock", title: "Termín" },
] as const;

export type IconName = (typeof ICON_OPTIONS)[number]["value"];
