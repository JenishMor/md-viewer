import { test, expect } from "@playwright/test";

const ORIGIN = "https://www.mdviewer.in";

// Every indexable route. Keep in sync with ROUTES in src/lib/site.ts.
const ROUTES = [
  "/",
  "/markdown-to-html",
  "/markdown-tutorial",
  "/guides",
  "/guides/editor-features",
  "/guides/readme-best-practices",
  "/guides/github-flavored-markdown",
  "/guides/markdown-vs-rich-text",
  "/guides/technical-documentation",
  "/guides/markdown-for-bloggers",
  "/guides/markdown-tables-guide",
  "/guides/common-markdown-mistakes",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
];

// Metadata is static HTML, so fetch it rather than driving a browser per page.
test.describe("SEO metadata", () => {
  // These checks don't depend on the browser, so run them in one project only.
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "page-independent checks run once");
  });

  for (const route of ROUTES) {
    test(`${route} has self-referencing canonical, unique title and social tags`, async ({ request }) => {
      const res = await request.get(route);
      expect(res.status()).toBe(200);
      const html = await res.text();
      const attr = (re: RegExp) => html.match(re)?.[1];

      const expected = route === "/" ? ORIGIN : `${ORIGIN}${route}`;
      expect(attr(/<link rel="canonical" href="([^"]+)"/)).toBe(expected);
      expect(attr(/<meta property="og:url" content="([^"]+)"/)).toBe(expected);
      expect(attr(/<meta property="og:image" content="([^"]+)"/)).toMatch(/^https:\/\/www\.mdviewer\.in\/opengraph-image/);

      const title = attr(/<title>([^<]+)<\/title>/)!.replace(/&amp;/g, "&");
      expect(title.length).toBeLessThanOrEqual(62);
      expect(title).not.toMatch(/MDViewer.*\| MDViewer$/);
      const description = attr(/<meta name="description" content="([^"]+)"/)!;
      expect(description.length).toBeGreaterThan(70);
      expect(description.length).toBeLessThanOrEqual(170);

      expect(html).not.toContain('name="keywords"');
      expect(html).not.toMatch(/https:\/\/mdviewer\.in/);
      expect(html.match(/<h1[\s>]/g) ?? []).toHaveLength(1);

      for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        expect(() => JSON.parse(json)).not.toThrow();
      }
    });
  }

  test("titles and descriptions are unique across pages", async ({ request }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const route of ROUTES) {
      const html = await (await request.get(route)).text();
      titles.add(html.match(/<title>([^<]+)<\/title>/)![1]);
      descriptions.add(html.match(/<meta name="description" content="([^"]+)"/)![1]);
    }
    expect(titles.size).toBe(ROUTES.length);
    expect(descriptions.size).toBe(ROUTES.length);
  });

  test("sitemap lists every route on the canonical host", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.sort()).toEqual(ROUTES.map((r) => (r === "/" ? ORIGIN : `${ORIGIN}${r}`)).sort());
  });

  test("robots.txt allows crawling and points at the sitemap", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toMatch(/Allow: \//);
    expect(txt).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });

  test("unknown pages return 404 and are not indexable", async ({ request }) => {
    const res = await request.get("/this-page-does-not-exist");
    expect(res.status()).toBe(404);
    const html = await res.text();
    expect(html).toMatch(/<meta name="robots" content="noindex/);
    expect(html).not.toContain('content="index, follow"');
    expect(html).not.toContain('rel="canonical"');
  });

  test("Open Graph image is a 1200x630 PNG", async ({ request }) => {
    const res = await request.get("/opengraph-image");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
    const png = await res.body();
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });
});

test.describe("Markdown to HTML converter", () => {
  test.beforeEach(async ({ page, context, browserName }) => {
    if (browserName === "chromium") await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/markdown-to-html");
  });

  test("converts GFM to HTML without stray whitespace", async ({ page }) => {
    const output = page.getByLabel("HTML output");
    await expect(output).toHaveValue(/<h1>Release notes<\/h1>/);
    await page.locator("#md-input").fill("- [x] done\n\n| a | b |\n| - | - |\n| 1 | 2 |\n\n```js\nlet x;\n```");
    await expect(output).toHaveValue(
      '<ul class="contains-task-list">\n<li class="task-list-item"><input type="checkbox" checked disabled> done</li>\n</ul>\n' +
        "<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>\n" +
        '<pre><code class="language-js">let x;\n</code></pre>',
    );
  });

  test("sanitizes raw HTML and drops frontmatter", async ({ page }) => {
    await page.locator("#md-input").fill(
      '---\ntitle: secret\n---\n\n<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n<details><summary>More</summary>ok</details>\n\n[x](javascript:alert(1))',
    );
    const output = page.getByLabel("HTML output");
    await expect(output).toHaveValue(/<details><summary>More<\/summary>ok<\/details>/);
    const value = await output.inputValue();
    expect(value).not.toMatch(/<script|onerror|javascript:|title: secret/);
  });

  test("wraps a full document, previews, copies and downloads", async ({ page, browserName }) => {
    await page.getByLabel("Full HTML document").check();
    await expect(page.getByLabel("HTML output")).toHaveValue(/^<!DOCTYPE html>[\s\S]*<h1>Release notes<\/h1>[\s\S]*<\/html>/);

    await page.getByRole("tab", { name: "Preview" }).click();
    await expect(page.locator(".prose h1")).toHaveText("Release notes");

    if (browserName === "chromium") {
      await page.getByRole("button", { name: "Copy HTML" }).click();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("<!DOCTYPE html>");
    }
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    expect((await download).suggestedFilename()).toBe("document.html");
  });
});
