import { Page, expect } from "@playwright/test";

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

/** Replaces the active document's Markdown through the source editor. */
export async function setMarkdown(page: Page, markdown: string) {
  const editor = page.locator("textarea").first();
  await editor.fill(markdown);
}

export function previewArticle(page: Page) {
  return page.locator("article.markdown-preview").first();
}

/** Waits until the debounced autosave has written the given text. */
export async function waitForSaved(page: Page, text: string) {
  await page.waitForFunction(
    (expected) =>
      localStorage.getItem("md-viewer-docs")?.includes(expected) ?? false,
    text,
  );
}

export async function switchToVisual(page: Page) {
  await page.getByRole("radio", { name: "Visual" }).click();
  await expect(page.locator(".ProseMirror")).toBeVisible();
}

export async function switchToMarkdown(page: Page) {
  await page.getByRole("radio", { name: "Markdown" }).click();
  await expect(page.locator("textarea").first()).toBeVisible();
}

/** Dispatches a synthetic paste with the given clipboard payloads on the focused element. */
export async function pasteInto(
  page: Page,
  selector: string,
  data: { html?: string; text?: string },
) {
  await page.locator(selector).first().evaluate((el, payload) => {
    const dt = new DataTransfer();
    if (payload.html) dt.setData("text/html", payload.html);
    if (payload.text) dt.setData("text/plain", payload.text);
    el.dispatchEvent(
      new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }),
    );
  }, data);
}

export async function openExport(page: Page, item: string | RegExp) {
  await page.getByRole("button", { name: "Export" }).click();
  await page.getByRole("menuitem", { name: item }).click();
}
