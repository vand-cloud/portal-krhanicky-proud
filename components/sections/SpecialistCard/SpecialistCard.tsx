import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export type Specialist = {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email: string;
  image?: { src: string; alt: string };
  bio?: string;
};

export type SpecialistCardProps = {
  heading?: string;
  intro?: string;
  specialist: Specialist;
  variant?: "section" | "inline";
};

export function SpecialistCard({
  heading,
  intro,
  specialist,
  variant = "section",
}: SpecialistCardProps) {
  const block = (
    <div className="flex flex-col gap-4">
      <div className="w-24">
        {specialist.image ? (
          <div className="aspect-square overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={specialist.image.src}
              alt={specialist.image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <ImagePlaceholder aspect="square" label={specialist.name} />
        )}
      </div>
      <div>
        <p className="text-xl font-[family-name:var(--font-heading)]">
          {specialist.name}
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
          {specialist.role}
        </p>
      </div>
      {specialist.bio && (
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-md">
          {specialist.bio}
        </p>
      )}
    </div>
  );

  if (variant === "inline") return block;

  return (
    <section className="py-[var(--spacing-section)] bg-[var(--color-bg)]">
      <Container>
        {heading && (
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] mb-4">
            {heading}
          </h2>
        )}
        {intro && (
          <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-3xl">
            {intro}
          </p>
        )}
        {block}
      </Container>
    </section>
  );
}
