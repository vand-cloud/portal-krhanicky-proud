import type { PortableTextBlock } from "@portabletext/types";

// Rough Czech reading-time estimate from a PortableText body. We count
// words across all text spans in block-type nodes and assume ~180 wpm.
// Output mirrors the wireframe format ("4 min").
export function readingTimeFromBody(
  body: PortableTextBlock[] | undefined,
): string {
  if (!body || body.length === 0) return "1 min";
  let words = 0;
  for (const block of body) {
    if (block._type !== "block") continue;
    const children = (block as { children?: { text?: string }[] }).children;
    if (!children) continue;
    for (const span of children) {
      if (span.text) words += span.text.trim().split(/\s+/).filter(Boolean).length;
    }
  }
  const minutes = Math.max(1, Math.round(words / 180));
  return `${minutes} min`;
}
