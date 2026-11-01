import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { previewArticle, setMarkdown, waitForPageReady } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await waitForPageReady(page);
});

test.describe("Markdown rendering", () => {
  test("renders GFM extras: footnotes, task lists, nested lists, autolinks, escapes", async ({ page }) => {
    await setMarkdown(
      page,
      `Visit https://example.com and \\*not italic\\*.

- outer
  - inner
    1. deep

- [ ] open task
- [x] done task

Ref link [docs][d] and a note[^1].

[d]: https://example.org/docs
[^1]: Footnote text.
`,
    );
    const article = previewArticle(page);
    await expect(article.locator('a[href="https://example.com"]')).toBeVisible();
    await expect(article).toContainText("*not italic*");
    await expect(article.locator("ul ul ol li")).toContainText("deep");
    await expect(article.locator('a[href="https://example.org/docs"]')).toContainText("docs");
    await expect(article.locator('input[type="checkbox"]')).toHaveCount(2);

    // Footnote links are in-page anchors that resolve to the footnote.
    const ref = article.locator("a[data-footnote-ref]");
    const href = await ref.getAttribute("href");
    expect(href).toBe("#user-content-fn-1");
    await expect(ref).not.toHaveAttribute("target", "_blank");
    await expect(article.locator("#user-content-fn-1")).toContainText("Footnote text.");
    // React's internal hast node must not leak into the DOM.
    await expect(article.locator("[node]")).toHaveCount(0);
  });

  test("renders frontmatter as a labelled block instead of a heading", async ({ page }) => {
    await setMarkdown(page, "---\ntitle: Hello\ntags: [a, b]\n---\n\n# Body");
    const article = previewArticle(page);
    await expect(article.locator("[data-frontmatter-block]")).toContainText("title: Hello");
    await expect(article.locator("h2")).toHaveCount(0);
    await expect(article.locator("hr")).toHaveCount(0);
    await expect(article.locator("h1")).toHaveText("Body");
  });

  test("highlights fenced code and keeps tables horizontally scrollable", async ({ page }) => {
    const wide = "| " + Array.from({ length: 14 }, (_, i) => `Column ${i}`).join(" | ") + " |\n|" + " --- |".repeat(14) + "\n| " + Array.from({ length: 14 }, () => "value").join(" | ") + " |";
    await setMarkdown(page, "```python\ndef f(x):\n    return x * 2\n```\n\n" + wide);
    const article = previewArticle(page);
    await expect(article.locator("pre code.hljs.language-python .hljs-keyword").first()).toHaveText("def");
    await expect(article.locator("[data-table-wrapper]")).toHaveCSS("overflow-x", "auto");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("toggling a task checkbox in the preview updates the Markdown source", async ({ page }) => {
    await setMarkdown(page, "- [ ] first\n- [ ] second\n\n```\n- [ ] not a task\n```");
    await previewArticle(page).locator('input[type="checkbox"]').nth(1).click();
    await expect(page.locator("textarea")).toHaveValue(
      "- [ ] first\n- [x] second\n\n```\n- [ ] not a task\n```",
    );
    await previewArticle(page).locator('input[type="checkbox"]').nth(1).click();
    await expect(page.locator("textarea")).toHaveValue(/- \[ \] second/);
  });

  test("large documents render in chunks without breaking task toggles or reference links", async ({ page }) => {
    const filler = Array.from(
      { length: 120 },
      (_, i) => `${i % 10 === 0 ? `## Part ${i / 10}\n\n` : ""}Paragraph ${i} ${"lorem ipsum ".repeat(12)}`,
    ).join("\n\n");
    const md = `[ref]: https://example.org/ref

${filler}

- [ ] late task

See [the ref][ref].`;
    expect(md.length).toBeGreaterThan(15000);
    await setMarkdown(page, md);
    const article = previewArticle(page);
    await expect(article.locator("[data-chunk-offset]").first()).toBeAttached();
    await expect(article.locator('a[href="https://example.org/ref"]')).toHaveText("the ref");
    await article.getByRole("checkbox", { name: "Mark task as done" }).click();
    await expect(page.locator("textarea")).toHaveValue(/- \[x\] late task/);
  });

  test("sanitizes raw HTML: keeps safe tags, strips scripts, handlers and unsafe URLs", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __xss: number }).__xss = 0;
    });
    await page.reload();
    await waitForPageReady(page);
    await setMarkdown(
      page,
      `<details><summary>More</summary>Hidden body</details>

Press <kbd>Ctrl</kbd>+<kbd>S</kbd>.

<img src="x" onerror="window.__xss=1">

<script>window.__xss=2</script>

<iframe src="https://example.com"></iframe>

<a href="javascript:window.__xss=3">bad link</a>

[md link](javascript:alert(1))

<div style="position:fixed;inset:0">overlay</div>
`,
    );
    const article = previewArticle(page);
    await expect(article.locator("details summary")).toHaveText("More");
    await expect(article.locator("kbd")).toHaveCount(2);
    await expect(article.locator("script, iframe")).toHaveCount(0);
    await expect(article.locator("[onerror]")).toHaveCount(0);
    await expect(article.locator("[style*='fixed']")).toHaveCount(0);
    for (const href of await article.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""))) {
      expect(href.toLowerCase()).not.toContain("javascript:");
    }
    await article.getByText("bad link").click();
    expect(await page.evaluate(() => (window as unknown as { __xss: number }).__xss)).toBe(0);
  });

  test("does not crash on malformed Markdown", async ({ page }) => {
    await setMarkdown(page, "# Title\n\n```js\nunclosed fence\n\n| a | b\n|---\n[broken](\n<div><span>\n$$\n\\frac{\n");
    const article = previewArticle(page);
    await expect(article.locator("h1")).toHaveText("Title");
    await expect(page.locator("textarea")).toBeEditable();
  });
});

test.describe("Math (KaTeX)", () => {
  test("renders inline, display, matrices and aligned equations", async ({ page }) => {
    await setMarkdown(
      page,
      `Inline $E = mc^2$ and $\\sqrt{x_1^2 + x_2^2}$.

$$
\\begin{aligned}
a &= \\frac{1}{2} \\\\
M &= \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}
\\end{aligned}
$$
`,
    );
    const article = previewArticle(page);
    await expect(article.locator(".katex")).toHaveCount(3);
    await expect(article.locator(".katex-display")).toHaveCount(1);
    await expect(article.locator(".katex-error")).toHaveCount(0);
    await expect(article.locator("annotation").first()).toHaveText("E = mc^2");
  });

  test("shows invalid expressions as an error without breaking the document", async ({ page }) => {
    await setMarkdown(page, "Before $\\frac{1}{$ after\n\n$$\n\\badcommand{x}\n$$\n\n## Still here");
    const article = previewArticle(page);
    await expect(article.locator(".katex-error").first()).toBeVisible();
    await expect(article.locator("h2")).toHaveText("Still here");
  });

  test("long display equations scroll instead of overflowing the page", async ({ page }) => {
    const long = Array.from({ length: 60 }, (_, i) => `x_{${i}}`).join(" + ");
    await setMarkdown(page, `$$\n${long}\n$$`);
    await expect(previewArticle(page).locator(".katex-display")).toHaveCSS("overflow-x", "auto");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("Mermaid diagrams", () => {
  test("renders common diagram types", async ({ page }) => {
    await setMarkdown(
      page,
      `\`\`\`mermaid
flowchart TD
  A[Start] --> B{Valid?}
  B -->|Yes| C[Continue]
\`\`\`

\`\`\`mermaid
sequenceDiagram
  Alice->>Bob: Hello
\`\`\`

\`\`\`mermaid
pie title Pets
  "Dogs" : 386
  "Cats" : 85
\`\`\`

\`\`\`mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Published
\`\`\`
`,
    );
    // Diagrams render as they scroll into view.
    const blocks = previewArticle(page).locator("[data-mermaid-block]");
    await expect(blocks).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await blocks.nth(i).scrollIntoViewIfNeeded();
      await expect(blocks.nth(i).locator("[data-mermaid-svg] svg")).toHaveCount(1, { timeout: 20000 });
    }
    await expect(blocks.first()).toContainText("Start");
  });

  test("renders diagrams only when they scroll near view, but exports them all", async ({ page }) => {
    const filler = Array.from({ length: 80 }, (_, i) => `Paragraph ${i + 1} of filler text.`).join("\n\n");
    await setMarkdown(page, `# Top\n\n${filler}\n\n\`\`\`mermaid\nflowchart LR\n  Far --> Away\n\`\`\`\n`);
    const block = previewArticle(page).locator("[data-mermaid-block]");
    await expect(block).toHaveCount(1);
    await page.waitForTimeout(1500);
    await expect(block.locator("[data-mermaid-svg] svg")).toHaveCount(0);

    // Export renders it even though it's still off-screen.
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export" }).click();
    await page.getByRole("menuitem", { name: /Download HTML/ }).click();
    const html = await readFile((await (await download).path())!, "utf-8");
    expect(html).toContain("Away");
    expect(html).toMatch(/<svg[\s\S]*Far/);
  });

  test("shows an isolated error for invalid syntax and keeps rendering other content", async ({ page }) => {
    await setMarkdown(
      page,
      "# Before\n\n```mermaid\nflowchart TD\n  A -->\n```\n\n```mermaid\nflowchart LR\n  X --> Y\n```\n\n## After",
    );
    const article = previewArticle(page);
    const error = article.locator('[data-block-error="mermaid"]');
    await expect(error).toBeVisible({ timeout: 20000 });
    await expect(error).toContainText("syntax error");
    await expect(error.locator("pre")).toContainText("A -->");
    await expect(article.locator("[data-mermaid-svg] svg")).toHaveCount(1);
    await expect(article.locator("h1")).toHaveText("Before");
    await expect(article.locator("h2")).toHaveText("After");
  });

  test("provides zoom and copy-source controls", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-specific");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await setMarkdown(page, "```mermaid\nflowchart LR\n  A --> B\n```");
    const block = previewArticle(page).locator("[data-mermaid-block]");
    await expect(block.locator("[data-mermaid-svg] svg")).toBeVisible({ timeout: 20000 });
    await block.getByRole("button", { name: "Zoom in diagram" }).click();
    await expect(block).toContainText("125%");
    await block.getByRole("button", { name: "Copy source" }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("A --> B");
  });
});

test.describe("Chart.js blocks", () => {
  const valid = `\`\`\`chartjs
{
  "type": "line",
  "data": {
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [{ "label": "Visitors", "data": [3, 7, 4] }]
  },
  "options": { "plugins": { "title": { "text": "Traffic" } } }
}
\`\`\``;

  test("renders a valid chart with an accessible description and data table", async ({ page }) => {
    await setMarkdown(page, valid);
    const block = previewArticle(page).locator("[data-chart-block]");
    const canvas = block.locator("canvas[data-chart-canvas]");
    await expect(canvas).toHaveAttribute("data-rendered", "true", { timeout: 15000 });
    await expect(canvas).toHaveAttribute("role", "img");
    await expect(canvas).toHaveAttribute("aria-label", /"Traffic": line chart with 1 data series \(Visitors\)/);
    await expect(block.locator("[data-chart-table] td")).toHaveCount(3);
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(100);
  });

  test("reports invalid JSON and invalid configuration locally", async ({ page }) => {
    await setMarkdown(
      page,
      `# Doc

\`\`\`chartjs
{ "type": "bar", "data": { "labels": ["a"], }
\`\`\`

\`\`\`chartjs
{ "type": "histogram", "data": { "datasets": [{ "data": [1] }] } }
\`\`\`

\`\`\`chartjs
{ "type": "bar", "data": { "datasets": [{ "data": ["1; alert(1)"] }] } }
\`\`\`

${valid}
`,
    );
    const errors = previewArticle(page).locator('[data-block-error="chartjs"]');
    await expect(errors).toHaveCount(3);
    await expect(errors.nth(0)).toContainText("Invalid JSON");
    await expect(errors.nth(1)).toContainText("type must be one of");
    await expect(errors.nth(2)).toContainText("must be a number");
    await expect(previewArticle(page).locator("canvas[data-rendered]")).toHaveCount(1, { timeout: 15000 });
    await expect(previewArticle(page).locator("h1")).toHaveText("Doc");
  });

  test("ignores executable options and unsafe colors", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __chartXss: number }).__chartXss = 0;
    });
    await page.reload();
    await waitForPageReady(page);
    await setMarkdown(
      page,
      `\`\`\`chartjs
{
  "type": "bar",
  "data": { "labels": ["a"], "datasets": [{ "data": [1], "backgroundColor": "url(javascript:alert(1))" }] }
}
\`\`\`

\`\`\`chartjs
{
  "type": "bar",
  "data": { "labels": ["a"], "datasets": [{ "data": [1] }] },
  "options": { "plugins": { "tooltip": { "callbacks": { "label": "function(){window.__chartXss=1}" } } }, "onClick": "window.__chartXss=2" }
}
\`\`\``,
    );
    await expect(previewArticle(page).locator('[data-block-error="chartjs"]')).toContainText("not a supported color");
    const canvas = previewArticle(page).locator("canvas[data-rendered]");
    await expect(canvas).toHaveCount(1, { timeout: 15000 });
    await canvas.click();
    await canvas.hover();
    expect(await page.evaluate(() => (window as unknown as { __chartXss: number }).__chartXss)).toBe(0);
  });
});
