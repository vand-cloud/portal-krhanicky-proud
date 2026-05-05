// Project identity is baked in -- this repo is client-specific (Krhanický
// Proud, owned by org `vand-cloud`), so there's no scenario where projectId
// or dataset would change at runtime. Hardcoding them removes two env vars
// from the Vercel checklist (less for Ivan to mess up) and makes the values
// self-documenting for anyone reading the code.
//
// Env var fallback stays for tests (playwright sets
// NEXT_PUBLIC_SANITY_PROJECT_ID="dummy" to avoid hitting real Sanity in CI)
// and for the rare case of pointing dev at a fork project.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4nb8kl4e";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const apiVersion =
  process.env.SANITY_API_VERSION || "2026-04-27";

// Write token must come from env (secret, never baked in). Read-only public
// access works without it.
export const writeToken = process.env.SANITY_WRITE_TOKEN;
