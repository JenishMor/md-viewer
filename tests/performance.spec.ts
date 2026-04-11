import { test, expect } from "@playwright/test";
import { waitForPageReady } from "./helpers";

/**
 * Performance smoke tests.
 */
test.describe("Performance smoke", () => {
  test("should become interactive within an acceptable time", async ({
    page,
  }) => {
    const startTime = Date.now();
    await page.goto("/");
    await waitForPageReady(page);
    const interactiveTime = Date.now() - startTime;

    // Generous threshold: covers cold-start on slower CI runners.
    expect(interactiveTime).toBeLessThan(15000);
  });

  test("should render a large markdown document", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);

    const editor = page.locator("textarea");

    let largeContent = "# Large Document Test\n\n";
    for (let i = 0; i < 50; i++) {
      largeContent += `## Section ${i}\n\nParagraph ${i} with **bold** and *italic*.\n\n- a\n- b\n- c\n\n`;
    }

    await editor.clear();
    await editor.fill(largeContent);

    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview.locator("h1")).toContainText("Large Document Test");
    await expect(preview.locator("h2")).toHaveCount(50);
  });

  test("should handle rapid theme switching without breaking", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForPageReady(page);

    const themeToggle = page.locator('[data-testid="theme-toggle"]').first();

    for (let i = 0; i < 6; i++) {
      await themeToggle.click();
    }

    // The page should still be interactive after rapid toggling.
    const editor = page.locator("textarea");
    await expect(editor).toBeVisible();
    await expect(editor).toBeEditable();
  });
});
