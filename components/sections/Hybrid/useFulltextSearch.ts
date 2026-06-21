"use client";

import { useEffect, useState } from "react";
import type { SearchHit } from "@/lib/sanity/content-types";
import type { SearchScope } from "@/lib/sanity/search";

// Debounced client hook that queries the scoped server fulltext endpoint
// (/api/search). Searches the document bodies (transcripts) which the
// in-memory title/summary filters cannot see. Cancels stale requests so the
// last keystroke always wins.
export function useFulltextSearch(scope: SearchScope, query: string) {
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);

  const q = query.trim();

  useEffect(() => {
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?scope=${scope}&q=${encodeURIComponent(q)}`,
        );
        const data = (await res.json()) as { results?: SearchHit[] };
        if (active) setResults(data.results ?? []);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [scope, q]);

  return { results, loading };
}
