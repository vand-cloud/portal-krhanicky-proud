import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export type GalleryItem = {
  /** Optional caption shown in the bottom-left corner of the placeholder. */
  label?: string;
  /** Optional aspect override per item; defaults to the row aspect. */
  aspect?: "video" | "square" | "portrait" | "wide" | "tall";
};

export type GalleryProps = {
  heading?: string;
  subheading?: string;
  items: GalleryItem[];
  /** Number of columns at the lg breakpoint. Mobile is always 2 cols. */
  columns?: 3 | 4;
  /** Default aspect ratio applied to all items unless overridden. */
  aspect?: "video" | "square" | "portrait" | "wide" | "tall";
  /** Background variant for the section. */
  background?: "bg" | "surface";
};

const columnsClass: Record<NonNullable<GalleryProps["columns"]>, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const backgroundClass: Record<NonNullable<GalleryProps["background"]>, string> = {
  bg: "bg-[var(--color-bg)]",
  surface: "bg-[var(--color-surface)]",
};

export function Gallery({
  heading,
  subheading,
  items,
  columns = 4,
  aspect = "square",
  background = "bg",
}: GalleryProps) {
  return (
    <section
      className={`py-[var(--spacing-section)] ${backgroundClass[background]}`}
    >
      <Container>
        {(heading || subheading) && (
          <div className="mb-12 max-w-3xl">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-heading mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-lg text-[var(--color-text-secondary)]">
                {subheading}
              </p>
            )}
          </div>
        )}
        <div
          className={`grid grid-cols-2 ${columnsClass[columns]} gap-4 md:gap-6`}
        >
          {items.map((item, i) => (
            <ImagePlaceholder
              key={i}
              aspect={item.aspect ?? aspect}
              label={item.label}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
