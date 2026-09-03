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
  // Baseline security headers (fleet security audit 2026-09, Vlna 3).
  // Kept here, not in vercel.json, so dev and start behave like production.
  // No form-action: Chrome applies it to post-submit redirects too.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
