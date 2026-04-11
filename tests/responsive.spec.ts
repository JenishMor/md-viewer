import { test, expect } from "@playwright/test";
import { waitForPageReady } from "./helpers";

/**
 * We only check three representative viewports rather than every device
 * size combination — the layout has two breakpoints (mobile vs desktop at
 * 1024px), so testing one of each plus a tablet is enough.
 */
const viewports = [
  { name: "Mobile", width: 375, height: 667 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Desktop", width: 1920, height: 1080 },
];

test.describe("Responsive Design", () => {
  for (const viewport of viewports) {
    test(`should render without horizontal overflow on ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/");
      await waitForPageReady(page);

      const bodyWidth = await page.evaluate(
        () => document.body.scrollWidth,
      );
      // Allow tiny rounding margin (e.g. scrollbar gutter).
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20);

      await expect(page.locator("textarea")).toBeVisible();
      await expect(
        page.locator('.prose, [class*="prose"]').first(),
      ).toBeVisible();
    });
  }

  test("should lay out editor and preview horizontally on desktop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    await waitForPageReady(page);

    const editorBox = await page.locator("textarea").boundingBox();
    const previewBox = await page
      .locator('.prose, [class*="prose"]')
      .first()
      .boundingBox();

    expect(editorBox).toBeTruthy();
    expect(previewBox).toBeTruthy();
    if (editorBox && previewBox) {
      expect(previewBox.x).toBeGreaterThan(editorBox.x);
    }
  });

  test("should stack editor and preview vertically on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await waitForPageReady(page);

    const editorBox = await page.locator("textarea").boundingBox();
    const previewBox = await page
      .locator('.prose, [class*="prose"]')
      .first()
      .boundingBox();

    expect(editorBox).toBeTruthy();
    expect(previewBox).toBeTruthy();
    if (editorBox && previewBox) {
      expect(previewBox.y).toBeGreaterThan(editorBox.y);
    }
  });

  test("should not overflow when long content is typed on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await waitForPageReady(page);

    const editor = page.locator("textarea");
    await editor.clear();
    await editor.fill("a".repeat(200));

    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasOverflow).toBeFalsy();
  });
});
