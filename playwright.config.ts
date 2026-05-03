import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the starter-client-web template.
 *
 * Runs e2e tests (currently axe-core a11y) against `next dev --webpack`,
 * spun up automatically by Playwright on an isolated port (3100) to avoid
 * clashing with other dev servers on the default 3000. Placeholder Sanity
 * env vars let the app boot without real CMS credentials.
 */
const PORT = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: "dummy",
      NEXT_PUBLIC_SANITY_DATASET: "production",
    },
  },
});
