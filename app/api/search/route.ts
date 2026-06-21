import { NextResponse, type NextRequest } from "next/server";
import { searchScope, type SearchScope } from "@/lib/sanity/search";

// Scoped fulltext search endpoint: /api/search?scope=urad|program|blog&q=…
// Each scope searches only its own content. Returns at most a handful of
// ranked hits with an excerpt of the matched text.
const SCOPES = new Set<SearchScope>(["urad", "program", "blog"]);

export async function GET(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get("scope") ?? "";
  const q = req.nextUrl.searchParams.get("q") ?? "";

  if (!SCOPES.has(scope as SearchScope)) {
    return NextResponse.json({ results: [] }, { status: 400 });
  }

  const results = await searchScope(scope as SearchScope, q);
  return NextResponse.json({ results });
}
