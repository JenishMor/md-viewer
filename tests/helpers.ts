import { Page, expect } from '@playwright/test';

/**
 * Common test utilities and helpers
 */

/**
 * Wait for the markdown preview to update after editing
 */
export async function waitForPreviewUpdate(page: Page, timeout = 1000) {
  await page.waitForTimeout(timeout);
}

/**
 * Clear editor and type new markdown content
 */
export async function setMarkdownContent(page: Page, content: string) {
  const editor = page.locator('textarea');
  await editor.clear();
  await editor.fill(content);
  await waitForPreviewUpdate(page, 500);
}

/**
 * Get the current markdown content from editor
 */
export async function getMarkdownContent(page: Page): Promise<string> {
  const editor = page.locator('textarea');
  return await editor.inputValue();
}

/**
 * Get the preview element
 */
export function getPreview(page: Page) {
  return page.locator('.prose, [class*="prose"]').first();
}

/**
 * Get the editor element
 */
export function getEditor(page: Page) {
  return page.locator('textarea');
}

/**
 * Toggle theme (dark/light mode)
 */
export async function toggleTheme(page: Page) {
  const themeToggle = page.locator('button').filter({ has: page.locator('svg') }).first();
  await themeToggle.click();
  await page.waitForTimeout(300);
}

/**
 * Get current theme from HTML element
 */
export async function getCurrentTheme(page: Page): Promise<string | null> {
  const html = page.locator('html');
  return await html.getAttribute('class');
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Wait for page to be fully loaded and interactive
 */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Clear localStorage
 */
export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * Get localStorage item
 */
export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  return await page.evaluate((k) => {
    return localStorage.getItem(k);
  }, key);
}

/**
 * Set localStorage item
 */
export async function setLocalStorageItem(page: Page, key: string, value: string) {
  await page.evaluate(({ k, v }) => {
    localStorage.setItem(k, v);
  }, { k: key, v: value });
}

/**
 * Check if page has horizontal scroll
 */
export async function hasHorizontalScroll(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
}

/**
 * Check if page has vertical scroll
 */
export async function hasVerticalScroll(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return document.documentElement.scrollHeight > document.documentElement.clientHeight;
  });
}

/**
 * Simulate typing with realistic delays
 */
export async function typeWithDelay(page: Page, selector: string, text: string, delay = 50) {
  const element = page.locator(selector);
  await element.type(text, { delay });
}

/**
 * Take a screenshot with a custom name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
}

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Check if element has focus
 */
export async function hasFocus(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    return document.activeElement === element;
  }, selector);
}

/**
 * Get computed style of an element
 */
export async function getComputedStyle(page: Page, selector: string, property: string): Promise<string> {
  return await page.evaluate(({ sel, prop }) => {
    const element = document.querySelector(sel);
    if (!element) return '';
    return window.getComputedStyle(element).getPropertyValue(prop);
  }, { sel: selector, prop: property });
}

/**
 * Scroll to element
 */
export async function scrollToElement(page: Page, selector: string) {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, selector);
}

/**
 * Get viewport size
 */
export async function getViewportSize(page: Page) {
  return await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
}

/**
 * Common markdown samples for testing
 */
export const MARKDOWN_SAMPLES = {
  simple: '# Hello World\n\nThis is a simple test.',
  
  complex: `# Complex Markdown Test

## Headings
### H3
#### H4

## Text Formatting
**Bold text**, *italic text*, ***bold and italic***, ~~strikethrough~~

## Lists
- Item 1
- Item 2
  - Nested item
- Item 3

1. First
2. Second
3. Third

## Code
Inline \`code\` example.

\`\`\`javascript
function test() {
  console.log("Hello");
}
\`\`\`

## Links and Images
[Google](https://google.com)

## Blockquote
> This is a quote
> Multiple lines

## Table
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`,

  large: Array(50).fill(0).map((_, i) => `## Section ${i}\n\nContent for section ${i}\n\n`).join(''),
  
  withMath: `# Math Test

Inline math: $E = mc^2$

Block math:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
`,

  withEmoji: '# Emoji Test 🚀\n\n✅ This is a test with emojis 🎉',
};

/**
 * Assert that preview contains rendered markdown
 */
export async function assertPreviewContains(page: Page, expectedText: string) {
  const preview = getPreview(page);
  await expect(preview).toContainText(expectedText);
}

/**
 * Assert that preview has specific HTML element
 */
export async function assertPreviewHasElement(page: Page, selector: string) {
  const preview = getPreview(page);
  await expect(preview.locator(selector)).toBeVisible();
}
