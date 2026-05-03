// Concept — global dimensions (consumed by components based on site.config.ts)
export const conceptOptions = {
  layout: ["boxed", "wide", "fluid"] as const,
  density: ["compact", "comfortable", "spacious"] as const,
  contrast: ["soft", "balanced", "strong"] as const,
  motion: ["minimal", "expressive", "playful"] as const,
  mode: ["light", "dark", "auto"] as const,
} as const;

export type Concept = {
  layout: typeof conceptOptions.layout[number];
  density: typeof conceptOptions.density[number];
  contrast: typeof conceptOptions.contrast[number];
  motion: typeof conceptOptions.motion[number];
  mode: typeof conceptOptions.mode[number];
};
