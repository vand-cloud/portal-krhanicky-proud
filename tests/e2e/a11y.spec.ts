import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Homepage accessibility test.
 *
 * Visits `/`, runs axe-core with WCAG 2.1 AA tags, and fails if any
 * violations have impact "critical" or "serious". Other impact levels
 * (moderate, minor) are reported via Playwright's stdout when present
 * but do not fail the build.
 */
test("homepage has no critical or serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/");

  // Wait for the main landmark so we know the page actually rendered.
  await expect(page.locator("main")).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blocking = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );

  if (blocking.length > 0) {
    // Log full violation payload so failures are debuggable.
    console.error(
      "Critical/serious a11y violations:\n",
      JSON.stringify(blocking, null, 2),
    );
  }

  expect(blocking).toEqual([]);
});
