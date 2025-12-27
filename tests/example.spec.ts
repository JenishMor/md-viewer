import { test, expect } from '@playwright/test';
import {
  waitForPageReady,
  setMarkdownContent,
  getMarkdownContent,
  getPreview,
  getEditor,
  toggleTheme,
  getCurrentTheme,
  clearLocalStorage,
  MARKDOWN_SAMPLES,
  assertPreviewContains,
  assertPreviewHasElement,
} from './helpers';

/**
 * Example tests demonstrating the use of test helpers
 * These tests show best practices for writing maintainable tests
 */

test.describe('Example Tests Using Helpers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
  });

  test('should set and get markdown content using helpers', async ({ page }) => {
    await setMarkdownContent(page, MARKDOWN_SAMPLES.simple);
    
    const content = await getMarkdownContent(page);
    expect(content).toContain('Hello World');
    
    await assertPreviewContains(page, 'Hello World');
    await assertPreviewHasElement(page, 'h1');
  });

  test('should toggle theme using helper', async ({ page }) => {
    const initialTheme = await getCurrentTheme(page);
    
    await toggleTheme(page);
    
    const newTheme = await getCurrentTheme(page);
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should render complex markdown using sample', async ({ page }) => {
    await setMarkdownContent(page, MARKDOWN_SAMPLES.complex);
    
    // Wait longer for complex content to render
    await page.waitForTimeout(5000);
    
    const preview = getPreview(page);
    
    // Check various elements
    await expect(preview.locator('h1')).toContainText('Complex Markdown Test');
    await expect(preview.locator('h2')).toHaveCount(7);
    await expect(preview.locator('strong').first()).toBeVisible();
    await expect(preview.locator('code').first()).toBeVisible();
    await expect(preview.locator('table').first()).toBeVisible();
    await expect(preview.locator('blockquote').first()).toBeVisible();
  });

  test('should clear localStorage and verify content reset', async ({ page }) => {
    // Set custom content
    await setMarkdownContent(page, '# Custom Content');
    
    // Clear localStorage
    await clearLocalStorage(page);
    
    // Reload page
    await page.reload();
    await waitForPageReady(page);
    
    // Should show default content (not custom content)
    const content = await getMarkdownContent(page);
    expect(content).not.toContain('Custom Content');
    expect(content).toContain('MD Viewer'); // Default content
  });

  test('should handle large content using sample', async ({ page }) => {
    await setMarkdownContent(page, MARKDOWN_SAMPLES.large);
    
    const preview = getPreview(page);
    await expect(preview).toBeVisible();
    
    // Should have many sections
    const h2Count = await preview.locator('h2').count();
    expect(h2Count).toBeGreaterThan(40);
  });

  test('should work with emoji content', async ({ page }) => {
    await setMarkdownContent(page, MARKDOWN_SAMPLES.withEmoji);
    
    await assertPreviewContains(page, '🚀');
    await assertPreviewContains(page, '✅');
    await assertPreviewContains(page, '🎉');
  });

  test('should verify editor and preview are accessible', async ({ page }) => {
    const editor = getEditor(page);
    const preview = getPreview(page);
    
    await expect(editor).toBeVisible();
    await expect(preview).toBeVisible();
    
    // Both should be editable/interactive
    await expect(editor).toBeEditable();
  });
});

test.describe('Example Tests - Advanced Usage', () => {
  test('should test multiple theme switches', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const themes: (string | null)[] = [];
    
    // Collect theme states
    for (let i = 0; i < 4; i++) {
      themes.push(await getCurrentTheme(page));
      await toggleTheme(page);
    }
    
    // Should alternate between themes
    expect(themes[0]).toBe(themes[2]);
    expect(themes[1]).toBe(themes[3]);
    expect(themes[0]).not.toBe(themes[1]);
  });

  test('should test content persistence workflow', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const testContent = '# Persistence Test\n\nThis content should persist.';
    
    // Set content
    await setMarkdownContent(page, testContent);
    
    // Verify it's set
    let content = await getMarkdownContent(page);
    expect(content).toBe(testContent);
    
    // Reload page
    await page.reload();
    await waitForPageReady(page);
    
    // Verify persistence
    content = await getMarkdownContent(page);
    expect(content).toBe(testContent);
    
    // Clean up
    await clearLocalStorage(page);
  });

  test('should test rapid content changes', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const samples = [
      MARKDOWN_SAMPLES.simple,
      MARKDOWN_SAMPLES.withEmoji,
      MARKDOWN_SAMPLES.complex,
    ];
    
    for (const sample of samples) {
      await setMarkdownContent(page, sample);
      
      const preview = getPreview(page);
      await expect(preview).toBeVisible();
      
      // Verify preview updated
      const previewText = await preview.textContent();
      expect(previewText).toBeTruthy();
    }
  });
});
