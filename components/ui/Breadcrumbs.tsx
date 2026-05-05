import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

// Drobečková navigace: "Domů > Aktivní stránka". Last item is the
// current page (no href, marked aria-current="page"). Earlier items
// render as links.
export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Drobečková navigace" className={className}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 ? (
                <ChevronRight
                  size={14}
                  className="shrink-0 text-[var(--color-text-tertiary)]"
                  aria-hidden
                />
              ) : null}
              {isLast || !item.href ? (
                <span
                  className={
                    isLast
                      ? "text-sm font-medium text-[var(--color-text)]"
                      : "text-sm text-[var(--color-text-tertiary)]"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="rounded-sm text-sm text-[var(--color-text-tertiary)] outline-none transition-colors hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
