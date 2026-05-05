import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Permanent redirect for the legacy /pruvodce URL: the Krhanický
  // průvodce was promoted to the homepage on 2026-05-05, so anything
  // that still points at /pruvodce (bookmarks, half-cached caches,
  // outbound copy that slipped through) bounces cleanly to /. Query
  // params (?type=, ?cat=, ?dist=, etc.) carry through automatically.
  async redirects() {
    return [
      {
        source: "/pruvodce",
        destination: "/",
        permanent: true,
      },
      {
        source: "/pruvodce/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
