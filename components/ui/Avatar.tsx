import Image from "next/image";

export type AvatarProps = {
  src?: string;
  alt: string;
  size?: number;
  fallback?: string;
};

export function Avatar({ src, alt, size = 40, fallback }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-sm font-medium"
    >
      {fallback ?? alt.charAt(0).toUpperCase()}
    </div>
  );
}
