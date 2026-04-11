import { test, expect } from "@playwright/test";
import { waitForPageReady } from "./helpers";

test.describe("Home Page - Core Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
  });

  test("should load with title, editor, preview and default content", async ({
    page,
  }) => {
    await expect(page).toHaveTitle(/MDViewer/i);

    const editor = page.locator("textarea");
    await expect(editor).toBeVisible();

    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview).toBeVisible();

    const content = await editor.inputValue();
    expect(content).toContain("MD Viewer");
  });

  test("should update preview when typing in editor", async ({ page }) => {
    const editor = page.locator("textarea");
    await editor.clear();
    await editor.fill("# Test Heading\n\nThis is a **test** paragraph.");

    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview.locator("h1")).toContainText("Test Heading");
    await expect(preview.locator("strong")).toContainText("test");
  });

  test("should persist content in localStorage across reloads", async ({
    page,
  }) => {
    const editor = page.locator("textarea");
    const testContent = "# Persistent Content Test";

    await editor.clear();
    await editor.fill(testContent);

    // Wait until localStorage actually contains the new content rather than
    // relying on a fixed timeout.
    await page.waitForFunction(
      (expected) =>
        localStorage.getItem("md-viewer-content")?.includes(expected) ?? false,
      testContent,
    );

    await page.reload();
    await waitForPageReady(page);

    const editorAfterReload = page.locator("textarea");
    await expect(editorAfterReload).toHaveValue(/Persistent Content Test/);
  });
});

test.describe("Home Page - Markdown Rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
  });

  // One consolidated test exercises all GFM/CommonMark features we care
  // about. Each feature was previously its own test, which multiplied the
  // setup cost (page load + textarea fill) without adding coverage.
  test("should render core markdown features (headings, lists, code, links, blockquote, table, strikethrough)", async ({
    page,
  }) => {
    const editor = page.locator("textarea");
    const markdown = `# H1
## H2
### H3

- Item 1
- Item 2

1. First
2. Second

\`\`\`javascript
function hello() { console.log("Hello World"); }
\`\`\`

This is \`inline code\`.

[Google](https://google.com)

> A blockquote line

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

~~strikethrough text~~
`;

    await editor.clear();
    await editor.fill(markdown);

    const preview = page.locator('.prose, [class*="prose"]').first();

    await expect(preview.locator("h1")).toContainText("H1");
    await expect(preview.locator("h2")).toContainText("H2");
    await expect(preview.locator("h3")).toContainText("H3");
    await expect(preview.locator("ul").first()).toBeVisible();
    await expect(preview.locator("ol").first()).toBeVisible();
    await expect(preview.locator("pre code")).toContainText("function hello");
    await expect(preview.locator("code").first()).toBeVisible();
    await expect(preview.locator('a[href="https://google.com"]')).toContainText(
      "Google",
    );
    await expect(preview.locator("blockquote")).toBeVisible();
    await expect(preview.locator("table")).toBeVisible();
    await expect(preview.locator("th")).toHaveCount(2);
    await expect(preview.locator("del, s")).toContainText("strikethrough text");
  });
});

test.describe("Home Page - Theme Toggle", () => {
  test("should toggle theme when clicked", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);

    const html = page.locator("html");
    const initialClass = (await html.getAttribute("class")) ?? "";

    const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();

    // Wait for the html.dark class to flip rather than relying on a sleep.
    if (initialClass.includes("dark")) {
      await page.waitForFunction(
        () => !document.documentElement.classList.contains("dark"),
      );
    } else {
      await page.waitForFunction(() =>
        document.documentElement.classList.contains("dark"),
      );
    }

    const newClass = (await html.getAttribute("class")) ?? "";
    expect(newClass).not.toBe(initialClass);
  });
});
