import { Page } from "@playwright/test";

/**
 * Wait for the page to be loaded and interactive.
 */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page
    .locator("textarea")
    .first()
    .waitFor({ state: "visible", timeout: 15000 });
}
