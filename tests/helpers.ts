import { Page } from "@playwright/test";

/**
 * Wait for the page to be loaded and interactive.
 *
 * NOTE: We deliberately do NOT use `waitForLoadState('networkidle')` here.
 * The app embeds Vercel Analytics + SpeedInsights which keep the network
 * active and cause `networkidle` to time out (it was the root cause of
 * several flaky test failures). Waiting for the editor textarea to be
 * visible is a much more deterministic signal that the page is interactive.
 */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page
    .locator("textarea")
    .first()
    .waitFor({ state: "visible", timeout: 15000 });
}
