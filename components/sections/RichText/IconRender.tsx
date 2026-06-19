import {
  TriangleAlert,
  Info,
  CircleAlert,
  Megaphone,
  Vote,
  CalendarClock,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import type { IconName } from "@/lib/icons";

// Maps the icon-picker value (lib/icons.ts ICON_OPTIONS) to a lucide
// component. Keep in sync with that list.
const MAP: Record<IconName, ComponentType<LucideProps>> = {
  "triangle-alert": TriangleAlert,
  info: Info,
  "circle-alert": CircleAlert,
  megaphone: Megaphone,
  vote: Vote,
  "calendar-clock": CalendarClock,
};

// Renders the chosen icon, or nothing when the name is empty/unknown.
export function Icon({
  name,
  ...props
}: { name?: string | null } & LucideProps) {
  const Cmp = name && name in MAP ? MAP[name as IconName] : null;
  if (!Cmp) return null;
  return <Cmp {...props} />;
}
