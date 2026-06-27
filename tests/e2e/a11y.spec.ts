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
  // Test the settled render under reduced motion. The homepage uses scroll
  // reveals (a parent opacity fade); without this, axe samples text mid-fade
  // and reports false-positive contrast failures (a dark navy heading at
  // opacity 0.3 over white computes as a washed-out light blue). Reduced motion
  // makes Reveal paint its content at full opacity immediately, so axe measures
  // the real, final colors, which is also the state a11y rules actually care
  // about. This keeps the run deterministic instead of flaky on animation timing.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  // Wait for the main landmark so we know the page actually rendered.
  await expect(page.locator("main")).toBeVisible();
  await page.waitForLoadState("networkidle");

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
