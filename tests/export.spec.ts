import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { openExport, setMarkdown, waitForPageReady } from "./helpers";

const DOC = `# Release Notes: v2/beta?

Some **bold** text, math $a^2$ and a table:

| a | b |
| - | - |
| 1 | 2 |

\`\`\`mermaid
flowchart LR
  A --> B
\`\`\`

\`\`\`chartjs
{"type":"bar","data":{"labels":["x","y"],"datasets":[{"label":"n","data":[1,2]}]}}
\`\`\`
`;

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await waitForPageReady(page);
});

test.describe("Import", () => {
  test("opens a Markdown file as a new document and preserves UTF-8", async ({ page }) => {
    await setMarkdown(page, "existing work");
    const content = "# Café ☕ — naïve résumé\n\n日本語のテキスト 🚀\n";
    await page.getByTestId("file-input").setInputFiles({
      name: "notes.md",
      mimeType: "text/markdown",
      buffer: Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(content, "utf-8")]),
    });
    await expect(page.locator('[data-tab-name="notes"]')).toBeVisible();
    await expect(page.locator("textarea")).toHaveValue(content);
    await page.locator('[data-tab-name="Untitled"]').click();
    await expect(page.locator("textarea")).toHaveValue("existing work");
  });

  test("reuses an empty document and accepts .txt files", async ({ page }) => {
    await setMarkdown(page, "");
    await page.getByTestId("file-input").setInputFiles({
      name: "plain.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("just text"),
    });
    await expect(page.locator('[data-tab-name="plain"]')).toBeVisible();
    await expect(page.locator("[data-tab-name]")).toHaveCount(1);
    await expect(page.locator("textarea")).toHaveValue("just text");
  });

  test("rejects unsupported files", async ({ page }) => {
    await page.getByTestId("file-input").setInputFiles({
      name: "photo.png",
      mimeType: "image/png",
      buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    });
    await expect(page.locator("[data-toast]")).toContainText("isn't a Markdown or text file");
  });

  test("supports drag and drop onto the editor", async ({ page }) => {
    await setMarkdown(page, "existing");
    const dataTransfer = await page.evaluateHandle(() => {
      const dt = new DataTransfer();
      dt.items.add(new File(["# Dropped"], "dropped.md", { type: "text/markdown" }));
      return dt;
    });
    await page.locator("textarea").dispatchEvent("drop", { dataTransfer });
    await expect(page.locator('[data-tab-name="dropped"]')).toBeVisible();
    await expect(page.locator("textarea")).toHaveValue("# Dropped");
  });
});

test.describe("Export", () => {
  test("downloads the original Markdown with a sanitized filename", async ({ page }) => {
    await setMarkdown(page, DOC);
    const download = page.waitForEvent("download");
    await openExport(page, /Download Markdown/);
    const file = await download;
    expect(file.suggestedFilename()).toBe("Release-Notes-v2beta.md");
    expect(await readFile((await file.path())!, "utf-8")).toBe(DOC);
  });

  test("downloads standalone HTML with diagrams inline and charts as images", async ({ page }) => {
    await setMarkdown(page, DOC);
    await expect(page.locator("canvas[data-rendered]")).toHaveCount(1, { timeout: 15000 });
    const download = page.waitForEvent("download");
    await openExport(page, /Download HTML/);
    const file = await download;
    expect(file.suggestedFilename()).toBe("Release-Notes-v2beta.html");
    const html = await readFile((await file.path())!, "utf-8");
    expect(html).toMatch(/^<!DOCTYPE html>/);
    expect(html).toContain("<title>Release Notes: v2/beta?</title>");
    expect(html).toContain("katex.min.css");
    expect(html).toContain("<table>");
    expect(html).toMatch(/<svg[^>]*id="mermaid-/);
    expect(html).toMatch(/<img src="data:image\/png;base64,[^"]+" alt="Chart: bar chart/);
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain("<button");
    await expect(page.locator("[data-toast]").first()).toContainText("Charts are exported as static images");
  });

  test("exports HTML from editor-only layout too", async ({ page }) => {
    await setMarkdown(page, "# Hidden preview\n\n```mermaid\nflowchart LR\n  A --> B\n```");
    await page.getByRole("radio", { name: "Editor only" }).click();
    await expect(page.locator("article.markdown-preview")).toHaveCount(0);
    const download = page.waitForEvent("download");
    await openExport(page, /Download HTML/);
    const html = await readFile((await (await download).path())!, "utf-8");
    expect(html).toContain("Hidden preview");
    expect(html).toMatch(/<svg[^>]*id="mermaid-/);
  });

  test("copies Markdown and rendered HTML to the clipboard", async ({ page }) => {
    await setMarkdown(page, "# Copy me\n\n**bold**");
    await openExport(page, /Copy Markdown/);
    await expect(page.locator("[data-toast]").first()).toContainText("Markdown copied");
    // Windows stores clipboard text with CRLF line endings.
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.replace(/\r\n/g, "\n")).toBe("# Copy me\n\n**bold**");

    await openExport(page, /Copy rendered HTML/);
    await expect(page.locator("[data-toast]").last()).toContainText("Rendered HTML copied");
    const html = await page.evaluate(async () => {
      const items = await navigator.clipboard.read();
      const blob = await items[0].getType("text/html");
      return blob.text();
    });
    expect(html).toContain("<strong>bold</strong>");
  });

  test("reports clipboard failures instead of failing silently", async ({ page }) => {
    await page.evaluate(() => {
      navigator.clipboard.writeText = () => Promise.reject(new DOMException("denied", "NotAllowedError"));
    });
    await openExport(page, /Copy Markdown/);
    await expect(page.locator('[data-toast="error"]')).toContainText("blocked clipboard access");
  });

  test("print opens the browser dialog and says so honestly", async ({ page }) => {
    await setMarkdown(page, "# Printable");
    await openExport(page, /Print \/ Save as PDF/);
    await expect(page.locator("[data-toast]").first()).toContainText('Print dialog opened. Choose "Save as PDF"');
  });
});

test.describe("Publish / Share", () => {
  test("share link requires explicit acknowledgement and round-trips the document", async ({ page, context }) => {
    await setMarkdown(page, "# Shared doc\n\nBody");
    await page.getByRole("button", { name: "Share" }).click();
    const dialog = page.getByRole("dialog", { name: "Publish / Share" });
    await expect(dialog).toContainText("Anyone who has the link can read the document");
    await expect(dialog).toContainText("can't be revoked");
    const create = dialog.getByRole("button", { name: /Create & copy link/ });
    await expect(create).toBeDisabled();
    await dialog.getByRole("checkbox").check();
    await create.click();
    const url = await dialog.getByRole("textbox", { name: "Share link" }).inputValue();
    expect(url).toMatch(/#lz=/);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(url);

    const other = await context.newPage();
    await other.goto(url);
    await waitForPageReady(other);
    await expect(other.locator("textarea")).toHaveValue("# Shared doc\n\nBody");
  });

  test("blocks share links for documents that are too large", async ({ page }) => {
    const random = Array.from({ length: 20000 }, (_, i) => ((i * 7919) % 104729).toString(36)).join(" ");
    await setMarkdown(page, random);
    await page.getByRole("button", { name: "Share" }).click();
    const dialog = page.getByRole("dialog", { name: "Publish / Share" });
    await expect(dialog.getByRole("alert")).toContainText("too large to share as a link");
    await expect(dialog.getByRole("button", { name: /Create & copy link/ })).toHaveCount(0);
  });

  test("blog destination previews exactly what will be copied", async ({ page }) => {
    await setMarkdown(page, "# For my blog\n\nParagraph.");
    await page.getByRole("button", { name: "Share" }).click();
    const dialog = page.getByRole("dialog", { name: "Publish / Share" });
    await dialog.getByRole("tab", { name: /Copy for blog platforms/ }).click();
    const frame = dialog.frameLocator('iframe[title="Preview of content to copy"]');
    await expect(frame.locator("h1")).toHaveText("For my blog");
    await expect(dialog.locator("iframe")).toHaveAttribute("sandbox", "");
    await dialog.getByRole("button", { name: "Copy HTML source" }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("<h1>For my blog</h1>");
  });
});
