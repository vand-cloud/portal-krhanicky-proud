import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/lib/sanity/image";
import { FileDownload } from "./FileDownload";

// Renders a Sanity richBody onto the same typography as the wireframe
// ArticleBodyDemo: H2/H3/H4, paragraphs, bullet + numbered lists, captioned
// images, tables, YouTube embeds and the FileDownload bar.

function formatBytes(bytes?: number): string | undefined {
  if (!bytes || bytes <= 0) return undefined;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1).replace(".", ",")} MB`;
  const kb = Math.max(1, Math.round(bytes / 1024));
  return `${kb} kB`;
}

function youtubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-3 text-xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-2 text-lg font-bold leading-snug tracking-tight text-[var(--color-text-accent)]">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-base font-semibold text-[var(--color-text-accent)]">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-[var(--color-accent)] pl-4 text-base italic leading-relaxed text-[var(--color-text-secondary)]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)] marker:text-[var(--color-text-tertiary)]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)] marker:text-[var(--color-text-tertiary)]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[var(--color-text)]">
        {children}
      </strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-medium text-[var(--color-accent)] underline underline-offset-2 outline-none transition-colors hover:text-[var(--color-brand)] focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1600).fit("max").auto("format").url();
      return (
        <figure className="my-8">
          <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- Sanity asset, sized via image-url. */}
            <img
              src={src}
              alt={value.alt ?? ""}
              className="block h-auto w-full"
            />
          </div>
          {value.caption ? (
            <figcaption className="mt-2 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    youtube: ({ value }) => {
      const id = value?.url ? youtubeId(value.url) : null;
      if (!id) return null;
      return (
        <div className="my-8 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title="YouTube video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      );
    },
    table: ({ value }) => {
      const rows: { cells: string[] }[] = value?.rows ?? [];
      if (rows.length === 0) return null;
      const [head, ...body] = rows;
      return (
        <div className="my-8 overflow-x-auto rounded-lg border border-[var(--color-border)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--color-bg-elev)]">
                {head.cells.map((cell, i) => (
                  <th
                    key={i}
                    className="border-b border-[var(--color-border)] px-3 py-2 text-left font-semibold text-[var(--color-text-accent)]"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, r) => (
                <tr key={r} className="border-b border-[var(--color-border)] last:border-0">
                  {row.cells.map((cell, c) => (
                    <td
                      key={c}
                      className="px-3 py-2 align-top text-[var(--color-text-secondary)]"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    fileDownload: ({ value }) => {
      if (!value?.fileUrl) return null;
      const ext = (value.fileExtension as string | undefined)?.toUpperCase();
      return (
        <div className="my-6">
          <FileDownload
            name={value.name ?? "Dokument ke stažení"}
            href={value.fileUrl}
            size={formatBytes(value.fileSize)}
            fileType={value.fileType ?? ext}
          />
        </div>
      );
    },
  },
};

export function PortableBody({
  value,
  className = "mt-10",
}: {
  value?: PortableTextBlock[];
  className?: string;
}) {
  if (!value || value.length === 0) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
