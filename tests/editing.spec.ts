import { test, expect } from "@playwright/test";
import {
  pasteInto,
  previewArticle,
  setMarkdown,
  switchToMarkdown,
  switchToVisual,
  waitForPageReady,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await waitForPageReady(page);
});

const ROUND_TRIP = `---
title: Round trip
---

# Heading

Paragraph with **bold**, *italic*, ~~strike~~, \`code\`, [a link](https://example.com) and $x^2$ math.

<kbd>Ctrl</kbd> raw HTML and a footnote[^1].

- one
- two
  - nested

1. first
2. second

- [ ] todo
- [x] done

> Quote

| Left | Right |
| :--- | ----: |
| a    |     b |

\`\`\`mermaid
flowchart TD
  A --> B
\`\`\`

\`\`\`chartjs
{"type":"bar","data":{"labels":["a"],"datasets":[{"data":[1]}]}}
\`\`\`

$$
\\int_0^1 x\\,dx
$$

<details><summary>More</summary>Body</details>

---

![Logo](https://example.com/logo.png)

[^1]: The footnote.
`;

test.describe("Visual editor", () => {
  test("switching modes without editing leaves the Markdown untouched", async ({ page }) => {
    await setMarkdown(page, ROUND_TRIP);
    await switchToVisual(page);
    await expect(page.locator(".ProseMirror h1")).toHaveText("Heading");
    await switchToMarkdown(page);
    await expect(page.locator("textarea")).toHaveValue(ROUND_TRIP);
  });

  test("editing visually keeps every unsupported block verbatim", async ({ page }) => {
    await setMarkdown(page, ROUND_TRIP);
    await switchToVisual(page);
    await expect(page.getByRole("note")).toContainText("frontmatter, math, raw HTML, footnotes");
    await page.locator(".ProseMirror h1").click();
    await page.keyboard.press("End");
    await page.keyboard.type(" edited");
    await switchToMarkdown(page);
    const value = await page.locator("textarea").inputValue();
    expect(value).toBe(ROUND_TRIP.replace("# Heading", "# Heading edited"));
  });

  test("formats text with the toolbar and reflects the selection state", async ({ page }) => {
    await setMarkdown(page, "plain words here");
    await switchToVisual(page);
    const pm = page.locator(".ProseMirror");
    await pm.locator("p").first().click();
    await expect(pm).toBeFocused();
    await page.keyboard.press("Home");
    await page.keyboard.press("Shift+End");
    await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe("plain words here");
    const bold = page.getByRole("button", { name: "Bold", exact: true });
    await expect(bold).toHaveAttribute("aria-pressed", "false");
    await bold.click();
    await expect(bold).toHaveAttribute("aria-pressed", "true");
    await expect(pm.locator("strong")).toHaveCount(1);

    // ProseMirror picks up caret moves from the DOM's async selectionchange event.
    // Playwright presses keys within microseconds, so give it a beat before Enter,
    // otherwise Enter acts on the stale selection (no human types that fast).
    await page.keyboard.press("End");
    await page.waitForTimeout(100);
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Heading 2" }).click();
    await page.keyboard.type("Section");
    await expect(page.getByRole("button", { name: "Heading 2" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Bulleted list" }).click();
    await expect(page.getByRole("button", { name: "Bulleted list" })).toHaveAttribute("aria-pressed", "true");

    await switchToMarkdown(page);
    const md = await page.locator("textarea").inputValue();
    expect(md).toContain("**plain words here**");
    expect(md).toContain("- Section");
  });

  test("supports undo/redo and keyboard shortcuts", async ({ page }) => {
    await setMarkdown(page, "start");
    await switchToVisual(page);
    const pm = page.locator(".ProseMirror");
    await pm.locator("p").first().click();
    await page.keyboard.press("End");
    await page.keyboard.press("ControlOrMeta+b");
    // One transaction, so it is exactly one undo step regardless of machine speed.
    await page.keyboard.insertText(" strong");
    await expect(pm.locator("strong")).toHaveText("strong");
    await page.keyboard.press("ControlOrMeta+z");
    await expect(pm.locator("strong")).toHaveCount(0);
    await page.keyboard.press("ControlOrMeta+Shift+z");
    await expect(pm.locator("strong")).toHaveText("strong");
  });

  test("inserts tables and task lists that serialize to GFM", async ({ page }) => {
    await setMarkdown(page, "");
    await switchToVisual(page);
    await page.locator(".ProseMirror").click();
    await page.getByRole("button", { name: "Task list" }).click();
    await page.keyboard.type("buy milk");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Insert table" }).click();
    await page.keyboard.type("H1");
    await expect(page.getByRole("button", { name: "Add row below" })).toBeVisible();
    await switchToMarkdown(page);
    const md = await page.locator("textarea").inputValue();
    expect(md).toContain("- [ ] buy milk");
    expect(md).toMatch(/\| H1\s*\|/);
    expect(md).toMatch(/\| -+ \|/);
  });

  test("Ctrl+Shift+M toggles the editing mode", async ({ page }) => {
    await page.locator("textarea").focus();
    await page.keyboard.press("ControlOrMeta+Shift+M");
    await expect(page.locator(".ProseMirror")).toBeVisible();
    await page.keyboard.press("ControlOrMeta+Shift+M");
    await expect(page.locator("textarea")).toBeVisible();
  });
});

const WORD_HTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office"><head><style>p.MsoNormal{margin:0}</style></head><body>
<!--StartFragment-->
<h1 style="mso-style-name:x">Quarterly Report</h1>
<p class=MsoNormal><b>Bold intro</b> and <i>italic</i> text<o:p></o:p></p>
<p class=MsoNormal>&nbsp;<o:p></o:p></p>
<p class=MsoListParagraphCxSpFirst style='mso-list:l0 level1 lfo1'><span style='mso-list:Ignore'>·<span>&nbsp;&nbsp;</span></span>First bullet</p>
<p class=MsoListParagraphCxSpLast style='mso-list:l0 level1 lfo1'><span style='mso-list:Ignore'>·<span>&nbsp;&nbsp;</span></span>Second bullet</p>
<p class=MsoNormal><a href="https://example.com">A link</a> and <a href="javascript:alert(1)">bad</a></p>
<table class=MsoTableGrid><tr><td><p class=MsoNormal><b>Name</b></p></td><td><p class=MsoNormal><b>Value</b></p></td></tr><tr><td><p>alpha</p></td><td><p>1</p></td></tr></table>
<p class=MsoNormal><img src="file:///C:/Users/me/AppData/Local/Temp/image001.png" alt="chart"></p>
<script>window.__pasteXss = 1</script>
<!--EndFragment-->
</body></html>`;

const GDOCS_HTML = `<meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-1234"><h2 dir="ltr"><span style="font-size:16pt;font-weight:400;">Docs Heading</span></h2><p dir="ltr"><span style="font-weight:400;">Normal </span><span style="font-weight:700;">bold</span><span style="font-weight:400;"> and </span><span style="font-style:italic;font-weight:400;">italic</span></p><ul><li dir="ltr"><p dir="ltr"><span style="font-weight:400;">Item A</span></p></li><li dir="ltr"><p dir="ltr"><span style="font-weight:400;">Item B</span></p></li></ul></b>`;

test.describe("Paste from Word and Google Docs", () => {
  test("Word HTML pasted into the visual editor becomes clean structure", async ({ page }) => {
    await setMarkdown(page, "");
    await switchToVisual(page);
    await page.locator(".ProseMirror").click();
    await pasteInto(page, ".ProseMirror", { html: WORD_HTML, text: "Quarterly Report" });
    const pm = page.locator(".ProseMirror");
    await expect(pm.locator("h1")).toHaveText("Quarterly Report");
    await expect(pm.locator("ul li")).toHaveCount(2);
    await expect(pm.locator("table")).toHaveCount(1);
    // TipTap sets its own min-width styles on table/col; nothing pasted may keep styles or classes.
    await expect(pm.locator("p[style], span[style], li[style], td[style], h1[style], [class*=Mso]")).toHaveCount(0);
    await expect(page.locator("[data-toast]")).toContainText("images could not be pasted");
    expect(await page.evaluate(() => (window as unknown as { __pasteXss?: number }).__pasteXss)).toBeUndefined();

    await switchToMarkdown(page);
    const md = await page.locator("textarea").inputValue();
    expect(md).toContain("# Quarterly Report");
    expect(md).toContain("**Bold intro** and *italic* text");
    expect(md).toContain("- First bullet\n- Second bullet");
    expect(md).toContain("[A link](https://example.com)");
    expect(md).not.toContain("javascript:");
    expect(md).toMatch(/\| \*\*Name\*\* \| \*\*Value\*\* \|/);
    expect(md).toContain("[image omitted: chart]");
    expect(md).not.toMatch(/mso|<o:p>|&nbsp;/i);
  });

  test("Google Docs HTML keeps real bold only", async ({ page }) => {
    await setMarkdown(page, "");
    await switchToVisual(page);
    await page.locator(".ProseMirror").click();
    await pasteInto(page, ".ProseMirror", { html: GDOCS_HTML, text: "Docs Heading" });
    await switchToMarkdown(page);
    const md = await page.locator("textarea").inputValue();
    expect(md).toContain("## Docs Heading");
    expect(md).toContain("Normal **bold** and *italic*");
    expect(md).toContain("- Item A\n- Item B");
  });

  test("rich text pasted in Markdown mode is converted; plain text is pasted as-is", async ({ page }) => {
    const ta = page.locator("textarea");
    await setMarkdown(page, "");
    await ta.focus();
    await pasteInto(page, "textarea", { html: GDOCS_HTML, text: "Docs Heading" });
    await expect(ta).toHaveValue(/## Docs Heading/);
    await expect(ta).toHaveValue(/Normal \*\*bold\*\*/);
    await expect(page.locator("[data-toast]")).toContainText("Converted pasted rich text");

    await setMarkdown(page, "");
    await ta.focus();
    // Plain-text paste is handled natively by the browser; our handler must not intercept it.
    const intercepted = await ta.evaluate((el) => {
      const dt = new DataTransfer();
      dt.setData("text/plain", "**literal**");
      dt.setData("text/html", "<p>**literal**</p>");
      const ev = new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true });
      el.dispatchEvent(ev);
      return ev.defaultPrevented;
    });
    expect(intercepted).toBe(false);
  });
});

test.describe("Markdown editor shortcuts", () => {
  test("Ctrl+Shift+K inserts inline code and Ctrl+Shift+Z redoes", async ({ page }) => {
    const ta = page.locator("textarea");
    await setMarkdown(page, "");
    // Edits within 400ms are merged into one undo step; start a fresh one.
    await page.waitForTimeout(500);
    await ta.focus();
    await page.keyboard.press("ControlOrMeta+Shift+K");
    await expect(ta).toHaveValue("`code`");
    await page.keyboard.press("ControlOrMeta+z");
    await expect(ta).toHaveValue("");
    await page.keyboard.press("ControlOrMeta+Shift+Z");
    await expect(ta).toHaveValue("`code`");
  });

  test("keyboard shortcut reference is available", async ({ page }) => {
    await page.getByRole("button", { name: "Keyboard shortcuts" }).click();
    const dialog = page.getByRole("dialog", { name: "Keyboard shortcuts" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Switch Markdown / Visual mode");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

test.describe("Large documents", () => {
  test("a large mixed document stays editable", async ({ page }) => {
    test.setTimeout(90_000);
    const sections = Array.from({ length: 150 }, (_, i) =>
      [
        `## Section ${i}`,
        `Paragraph ${i} with **bold**, *italic* and $a_${i} + b$.`,
        "| a | b |\n| - | - |\n| 1 | 2 |",
        "```js\nconst x = " + i + ";\n```",
        "![img](https://example.com/" + i + ".png)",
      ].join("\n\n"),
    ).join("\n\n");
    const doc = `# Big\n\n\`\`\`mermaid\nflowchart LR\n  A --> B\n\`\`\`\n\n${sections}`;
    await setMarkdown(page, doc);
    await expect(previewArticle(page).locator("h2")).toHaveCount(150, { timeout: 20000 });

    const ta = page.locator("textarea");
    await ta.focus();
    await ta.evaluate((el: HTMLTextAreaElement) => el.setSelectionRange(el.value.length, el.value.length));
    const start = Date.now();
    await page.keyboard.type("typing at the end");
    const elapsed = Date.now() - start;
    console.log(`large document: typed 17 characters in ${elapsed}ms`);
    await expect(ta).toHaveValue(/typing at the end$/);
    // ~0.3–0.8s in isolation; the budget leaves room for parallel CI workers.
    expect(elapsed).toBeLessThan(10000);
  });
});
