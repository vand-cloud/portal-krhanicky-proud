"use client";

import { useMemo, useState } from "react";
import { Folder, FileText, User } from "lucide-react";
import {
  type ObecCategoryDef,
  type ObecItem,
  obecCategoryLabels,
  obecSubcategoryLabels,
} from "@/content/obec";
import { unaccent } from "@/content/entries";
import { SearchBar } from "@/components/sections/Hybrid/SearchBar";

// Sections cap: keep the dropdown skimmable. The user said the search
// should reach categories, people and documents -- three short groups
// beat one long mixed list, so each group has its own slice limit.
const CATEGORY_LIMIT = 4;
const PEOPLE_LIMIT = 4;
const ITEM_LIMIT = 6;

// Result row shape -- normalised so the dropdown renders identical
// markup regardless of which group a row came from.
interface SearchHit {
  id: string;
  href: string;
  title: string;
  meta: string;
  description?: string;
}

function buildCategoryHref(catSlug: string, subSlug?: string): string {
  const params = new URLSearchParams({ kat: catSlug });
  if (subSlug) params.set("pod", subSlug);
  return `/obec?${params.toString()}`;
}

// Category + subcategory hits. Matching against label + description so
// that "zastupitelé" finds the subcategory but "úřední" also finds the
// top-level category through its description text.
function findCategoryHits(
  categories: ObecCategoryDef[],
  q: string,
): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const cat of categories) {
    const haystack = unaccent(`${cat.label} ${cat.description ?? ""}`);
    if (haystack.includes(q)) {
      hits.push({
        id: `cat-${cat.slug}`,
        href: buildCategoryHref(cat.slug),
        title: cat.label,
        meta: "Sekce",
        description: cat.description,
      });
    }
    for (const sub of cat.subcategories ?? []) {
      const subHaystack = unaccent(`${sub.label} ${sub.description ?? ""}`);
      if (subHaystack.includes(q)) {
        hits.push({
          id: `cat-${cat.slug}-${sub.slug}`,
          href: buildCategoryHref(cat.slug, sub.slug),
          title: sub.label,
          meta: `Sekce · ${cat.label}`,
          description: sub.description,
        });
      }
    }
  }
  return hits;
}

// Item hits split into people (council members with personId) and the
// rest (documents, meetings, notices). People get their own group so
// "Petr Svoboda" lands above generic document matches.
function findItemHits(items: ObecItem[], q: string) {
  const matched = items.filter((item) =>
    unaccent(`${item.title} ${item.description ?? ""}`).includes(q),
  );

  const people: SearchHit[] = [];
  const docs: SearchHit[] = [];

  for (const item of matched) {
    const meta = item.subcategory
      ? `${obecCategoryLabels[item.category]} · ${obecSubcategoryLabels[item.subcategory]}`
      : obecCategoryLabels[item.category];
    const hit: SearchHit = {
      id: item.id,
      href: item.href,
      title: item.title,
      meta,
      description: item.description,
    };
    if (item.personId) {
      people.push(hit);
    } else {
      docs.push(hit);
    }
  }

  return { people, docs };
}

// Search box for the /obec context. Looks across:
//  1. Categories + subcategories (e.g. "Zastupitelé") -- jumps to the
//     category hub at /obec?kat=...&pod=...
//  2. People (council members) -- jumps to /obec/[slug] keeping sidebar
//  3. Documents, meetings, notices -- jumps to /obec/[slug]
// The empty state hides the dropdown -- typing reveals it. Same
// interaction model as HomeSearch for consistency.
export function ObecSearch({
  categories,
  items,
  placeholder,
}: {
  categories: ObecCategoryDef[];
  items: ObecItem[];
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const hits = useMemo(() => {
    if (!trimmed) {
      return { categories: [] as SearchHit[], people: [] as SearchHit[], docs: [] as SearchHit[] };
    }
    const q = unaccent(trimmed);
    const cats = findCategoryHits(categories, q).slice(0, CATEGORY_LIMIT);
    const { people, docs } = findItemHits(items, q);
    return {
      categories: cats,
      people: people.slice(0, PEOPLE_LIMIT),
      docs: docs.slice(0, ITEM_LIMIT),
    };
  }, [categories, items, trimmed]);

  const showDropdown = trimmed.length > 0;
  const totalResults =
    hits.categories.length + hits.people.length + hits.docs.length;

  return (
    <div className="relative">
      <SearchBar
        query={query}
        onChange={setQuery}
        placeholder={placeholder}
        size="large"
        ariaLabel="Hledat v sekci Obec"
      />

      {showDropdown ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
          {totalResults === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[var(--color-text-secondary)]">
              Pro „{query}“ jsme v sekci Obec nic nenašli. Zkuste jiný výraz.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {hits.categories.map((hit) => (
                <ResultRow key={hit.id} hit={hit} icon="folder" />
              ))}
              {hits.people.map((hit) => (
                <ResultRow key={hit.id} hit={hit} icon="user" />
              ))}
              {hits.docs.map((hit) => (
                <ResultRow key={hit.id} hit={hit} icon="file" />
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ResultRow({
  hit,
  icon,
}: {
  hit: SearchHit;
  icon: "folder" | "user" | "file";
}) {
  const Icon = icon === "folder" ? Folder : icon === "user" ? User : FileText;
  return (
    <li>
      <a
        href={hit.href}
        className="block px-4 py-3 outline-none hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          <Icon size={12} aria-hidden />
          {hit.meta}
        </div>
        <div className="mt-0.5 text-sm font-medium leading-snug text-[var(--color-text)]">
          {hit.title}
        </div>
        {hit.description ? (
          <div className="mt-0.5 line-clamp-1 text-xs text-[var(--color-text-secondary)]">
            {hit.description}
          </div>
        ) : null}
      </a>
    </li>
  );
}
