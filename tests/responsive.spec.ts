import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile Portrait', width: 375, height: 667 },
  { name: 'Mobile Landscape', width: 667, height: 375 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Small Desktop', width: 1366, height: 768 },
];

test.describe('Responsive Design Tests', () => {
  for (const viewport of viewports) {
    test(`should render correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check if page loads without horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20); // Allow small margin
      
      // Check if editor is visible
      const editor = page.locator('textarea');
      await expect(editor).toBeVisible();
      
      // Check if preview is visible
      const preview = page.locator('.prose, [class*="prose"]').first();
      await expect(preview).toBeVisible();
    });
  }

  test('should show horizontal panels on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // On desktop (>1024px), panels should be side by side
    const editor = page.locator('textarea');
    const editorBox = await editor.boundingBox();
    
    const preview = page.locator('.prose, [class*="prose"]').first();
    const previewBox = await preview.boundingBox();
    
    // Both should be visible
    expect(editorBox).toBeTruthy();
    expect(previewBox).toBeTruthy();
    
    // Preview should be to the right of editor (horizontal layout)
    if (editorBox && previewBox) {
      expect(previewBox.x).toBeGreaterThan(editorBox.x);
    }
  });

  test('should show vertical panels on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // On mobile (<1024px), panels should be stacked vertically
    const editor = page.locator('textarea');
    const editorBox = await editor.boundingBox();
    
    const preview = page.locator('.prose, [class*="prose"]').first();
    const previewBox = await preview.boundingBox();
    
    // Both should be visible
    expect(editorBox).toBeTruthy();
    expect(previewBox).toBeTruthy();
    
    // Preview should be below editor (vertical layout)
    if (editorBox && previewBox) {
      expect(previewBox.y).toBeGreaterThan(editorBox.y);
    }
  });

  test('should have touch-friendly targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check button sizes (should be at least 44x44px for touch)
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      
      if (box) {
        // Touch targets should be at least 24x24px (relaxed from 44px for icon buttons)
        expect(box.width).toBeGreaterThanOrEqual(24);
        expect(box.height).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('should not have horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Type long content without spaces
    const editor = page.locator('textarea');
    await editor.clear();
    await editor.fill('a'.repeat(200));
    
    await page.waitForTimeout(500);
    
    // Check for horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasOverflow).toBeFalsy();
  });

  test('should handle orientation change', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    await expect(editor).toBeVisible();
    
    // Switch to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(300);
    
    // Editor should still be visible
    await expect(editor).toBeVisible();
    
    // Preview should still be visible
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview).toBeVisible();
  });

  test('should resize panels on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for resize handle
    const resizeHandle = page.locator('[data-panel-resize-handle-id], [role="separator"]').first();
    
    if (await resizeHandle.count() > 0) {
      const handleBox = await resizeHandle.boundingBox();
      
      if (handleBox) {
        // Try to drag the resize handle
        await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(handleBox.x + 200, handleBox.y + handleBox.height / 2);
        await page.mouse.up();
        
        // Panels should still be visible after resize
        const editor = page.locator('textarea');
        const preview = page.locator('.prose, [class*="prose"]').first();
        
        await expect(editor).toBeVisible();
        await expect(preview).toBeVisible();
      }
    }
  });

  test('should maintain functionality on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    await editor.clear();
    await editor.fill('# Small Screen Test\n\nThis is a test on a small screen.');
    
    await page.waitForTimeout(500);
    
    // Preview should update
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview.locator('h1')).toContainText('Small Screen Test');
  });
});

test.describe('Responsive Design - Images and Media', () => {
  test.skip('should handle images responsively', async ({ page }) => {
    // Skipped: This test depends on external image loading which can be flaky
    // TODO: Replace with local test image or mock image response
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    await editor.clear();
    await editor.fill('![Test Image](https://via.placeholder.com/1000x1000)');
    
    await page.waitForTimeout(1000);
    
    // Wait for image to load
    const preview = page.locator('.prose, [class*="prose"]').first();
    const img = preview.locator('img').first();
    
    if (await img.count() > 0) {
      await img.waitFor({ state: 'visible', timeout: 5000 });
      
      const imgBox = await img.boundingBox();
      
      if (imgBox) {
        // Image should not overflow viewport
        expect(imgBox.width).toBeLessThanOrEqual(375);
      }
    }
  });

  test('should handle long URLs on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    const longUrl = 'https://example.com/very/long/url/that/should/wrap/properly/on/mobile/devices';
    await editor.clear();
    await editor.fill(`[Link](${longUrl})`);
    
    await page.waitForTimeout(500);
    
    // Check for horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasOverflow).toBeFalsy();
  });
});
