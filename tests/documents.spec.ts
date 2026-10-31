import { test, expect } from "@playwright/test";
import LZString from "lz-string";
import { setMarkdown, waitForPageReady, waitForSaved } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await waitForPageReady(page);
});

test.describe("Autosave", () => {
  test("shows save status and restores the draft after a refresh", async ({ page }) => {
    await setMarkdown(page, "# Draft that must survive");
    await expect(page.locator("[data-save-status]")).toHaveAttribute("data-save-status", "saved");
    await waitForSaved(page, "Draft that must survive");
    await page.reload();
    await waitForPageReady(page);
    await expect(page.locator("textarea")).toHaveValue("# Draft that must survive");
  });

  test("flushes pending edits when the page is hidden", async ({ page }) => {
    await setMarkdown(page, "typed just before closing");
    // Simulate tab close before the debounce fires.
    await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
    const stored = await page.evaluate(() => localStorage.getItem("md-viewer-docs"));
    expect(stored).toContain("typed just before closing");
  });

  test("reports a full storage quota without losing the text on screen", async ({ page }) => {
    await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      (window as unknown as { __restoreSetItem: () => void }).__restoreSetItem = () => {
        Storage.prototype.setItem = original;
      };
      Storage.prototype.setItem = function (key: string, value: string) {
        if (key === "md-viewer-docs") throw new DOMException("full", "QuotaExceededError");
        return original.call(this, key, value);
      };
    });
    await setMarkdown(page, "# Too big to store");
    const status = page.locator('[data-save-status="error"]');
    await expect(status).toBeVisible();
    await expect(status).toContainText("storage is full");
    await expect(page.locator("textarea")).toHaveValue("# Too big to store");

    await page.evaluate(() => (window as unknown as { __restoreSetItem: () => void }).__restoreSetItem());
    await setMarkdown(page, "# Stored now");
    await expect(page.locator('[data-save-status="saved"]')).toBeVisible();
  });

  test("keeps working when browser storage is blocked", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new DOMException("blocked", "SecurityError");
        },
      });
    });
    await page.reload();
    await waitForPageReady(page);
    await expect(page.locator('[data-save-status="error"]')).toContainText("blocked");
    await setMarkdown(page, "# Still editable");
    await expect(page.locator("article.markdown-preview h1")).toHaveText("Still editable");
  });
});

test.describe("Multiple local documents", () => {
  test("create, rename, duplicate, delete with confirmation, and restore", async ({ page }) => {
    await setMarkdown(page, "first document body");
    await page.getByRole("button", { name: "New document" }).click();
    await expect(page.locator("textarea")).toHaveValue("");
    await setMarkdown(page, "second document body");

    await page.getByRole("button", { name: /^Documents/ }).click();
    const dialog = page.getByRole("dialog", { name: "Local documents" });
    await expect(dialog).toContainText("not backed up or synced");
    await expect(dialog.locator("[data-doc-row]")).toHaveCount(2);

    // Rename
    await dialog.getByRole("button", { name: "Rename Untitled 2" }).click();
    await dialog.getByRole("textbox", { name: "Document name" }).fill("Meeting notes");
    await page.keyboard.press("Enter");
    await expect(dialog.locator('[data-doc-row="Meeting notes"]')).toBeVisible();

    // Duplicate
    await dialog.getByRole("button", { name: "Duplicate Meeting notes" }).click();
    await expect(dialog.locator('[data-doc-row="Meeting notes (copy)"]')).toBeVisible();

    // Delete asks for confirmation; cancelling keeps the document
    await dialog.getByRole("button", { name: "Delete Meeting notes", exact: true }).click();
    const confirm = page.getByRole("dialog", { name: 'Delete "Meeting notes"?' });
    await expect(confirm).toContainText("Recently deleted");
    await confirm.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog.locator('[data-doc-row="Meeting notes"]')).toBeVisible();

    await dialog.getByRole("button", { name: "Delete Meeting notes", exact: true }).click();
    await page.getByRole("dialog", { name: 'Delete "Meeting notes"?' }).getByRole("button", { name: "Delete" }).click();
    await expect(dialog.locator('[data-doc-row="Meeting notes"]')).toHaveCount(0);
    await expect(dialog.locator('[data-trash-row="Meeting notes"]')).toBeVisible();

    // Restore survives a reload
    await dialog.getByRole("button", { name: "Restore" }).click();
    await expect(dialog.locator('[data-doc-row="Meeting notes"]')).toBeVisible();
    await waitForSaved(page, "Meeting notes");
    await page.reload();
    await waitForPageReady(page);
    await expect(page.locator('[data-tab-name="Meeting notes"]')).toBeVisible();
    await expect(page.locator('[data-tab-name="Meeting notes (copy)"]')).toBeVisible();
  });

  test("deleting from a tab offers undo", async ({ page }) => {
    await page.getByRole("button", { name: "New document" }).click();
    await setMarkdown(page, "short lived");
    await page.getByRole("button", { name: "Delete Untitled 2" }).click();
    await page.getByRole("dialog", { name: /Delete "Untitled 2"/ }).getByRole("button", { name: "Delete" }).click();
    await expect(page.locator('[data-tab-name="Untitled 2"]')).toHaveCount(0);
    await page.locator("[data-toast]").getByRole("button", { name: "Undo" }).click();
    await expect(page.locator('[data-tab-name="Untitled 2"]')).toBeVisible();
    await expect(page.locator("textarea")).toHaveValue("short lived");
  });

  test("clear and reset ask for confirmation and can be undone", async ({ page }) => {
    await setMarkdown(page, "keep me");
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Clear Markdown" }).click();
    await page.getByRole("dialog", { name: "Clear this document?" }).getByRole("button", { name: "Cancel" }).click();
    await expect(page.locator("textarea")).toHaveValue("keep me");
    await page.getByRole("button", { name: "Clear Markdown" }).click();
    await page.getByRole("dialog", { name: "Clear this document?" }).getByRole("button", { name: "Clear" }).click();
    await expect(page.locator("textarea")).toHaveValue("");
    await page.locator("textarea").focus();
    await page.keyboard.press("ControlOrMeta+z");
    await expect(page.locator("textarea")).toHaveValue("keep me");
  });

  test("clearing all local data removes everything after confirmation", async ({ page }) => {
    await setMarkdown(page, "secret notes");
    await waitForSaved(page, "secret notes");
    await page.getByRole("button", { name: /^Documents/ }).click();
    await page.getByRole("button", { name: "Clear all local data" }).click();
    await page.getByRole("dialog", { name: "Clear all local data?" }).getByRole("button", { name: "Delete everything" }).click();
    await expect(page.locator("textarea")).toHaveValue("");
    await page.waitForTimeout(600);
    const stored = await page.evaluate(() => JSON.stringify(localStorage));
    expect(stored).not.toContain("secret notes");
  });
});

test.describe("Share links", () => {
  test("opening a shared link adds a document without replacing existing ones", async ({ page }) => {
    await setMarkdown(page, "my private draft");
    await waitForSaved(page, "my private draft");
    const shared = LZString.compressToEncodedURIComponent("# Shared with you");
    await page.goto(`/#lz=${shared}`);
    await waitForPageReady(page);
    await expect(page.locator("textarea")).toHaveValue("# Shared with you");
    await expect(page.locator('[data-tab-name="Shared document"]')).toBeVisible();
    expect(page.url()).not.toContain("#lz=");
    await page.locator('[data-tab-name="Untitled"]').click();
    await expect(page.locator("textarea")).toHaveValue("my private draft");
  });

  test("a damaged share link shows an error and changes nothing", async ({ page }) => {
    await page.goto("/#lz=%%%not-valid");
    await waitForPageReady(page);
    await expect(page.locator("[data-toast]")).toContainText("damaged");
    await expect(page.locator('[data-tab-name="Shared document"]')).toHaveCount(0);
  });
});

test.describe("Privacy", () => {
  test("document content is never sent over the network while editing, exporting or sharing", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const marker = "PRIVATE-MARKER-7f3a9c";
    const leaks: string[] = [];
    page.on("request", (req) => {
      const body = req.postData() ?? "";
      if (req.url().includes(marker) || body.includes(marker) || req.url().includes(LZString.compressToEncodedURIComponent(marker).slice(0, 12))) {
        leaks.push(req.url());
      }
    });
    await setMarkdown(page, `# ${marker}\n\n\`\`\`mermaid\nflowchart LR\n  A[${marker}] --> B\n\`\`\``);
    await page.getByRole("radio", { name: "Visual" }).click();
    await page.locator(".ProseMirror").waitFor();
    await page.getByRole("radio", { name: "Markdown" }).click();
    await page.getByRole("button", { name: "Share" }).click();
    const dialog = page.getByRole("dialog", { name: "Publish / Share" });
    await dialog.getByRole("checkbox").check();
    await dialog.getByRole("button", { name: /Create & copy link/ }).click();
    await expect(dialog.getByRole("textbox", { name: "Share link" })).toHaveValue(/#lz=/);
    await page.waitForTimeout(1500);
    expect(leaks).toEqual([]);
  });

  test("opening a share link does not send the encoded document anywhere", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const token = LZString.compressToEncodedURIComponent("# PRIVATE-SHARED-4b1e");
    const leaks: string[] = [];
    page.on("request", (req) => {
      const text = req.url() + (req.postData() ?? "") + JSON.stringify(req.headers());
      if (text.includes(token.slice(0, 16))) leaks.push(req.url());
    });
    await page.goto(`/#lz=${token}`);
    await waitForPageReady(page);
    await expect(page.locator("textarea")).toHaveValue("# PRIVATE-SHARED-4b1e");
    await page.waitForTimeout(2000);
    expect(leaks).toEqual([]);
    await context.close();
  });
});
