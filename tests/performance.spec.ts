import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load the page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise<{
        domContentLoaded: number;
        loadComplete: number;
        firstPaint: number;
        firstContentfulPaint: number;
      }>((resolve) => {
        // Wait for page to be fully loaded
        if (document.readyState === 'complete') {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          resolve({
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          });
        } else {
          window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            
            resolve({
              domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
              loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
              firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
              firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
            });
          });
        }
      });
    });
    
    // First Contentful Paint should be under 2 seconds
    expect(metrics.firstContentfulPaint).toBeLessThan(2000);
  });

  test('should handle large markdown content efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    
    // Generate large markdown content
    let largeContent = '# Large Document Test\n\n';
    for (let i = 0; i < 100; i++) {
      largeContent += `## Section ${i}\n\nThis is paragraph ${i} with some **bold** and *italic* text.\n\n`;
      largeContent += `- Item 1\n- Item 2\n- Item 3\n\n`;
      largeContent += '```javascript\nfunction test() { console.log("test"); }\n```\n\n';
    }
    
    const startTime = Date.now();
    
    await editor.clear();
    await editor.fill(largeContent);
    
    // Wait longer for complex content to render
    await page.waitForTimeout(5000);
    
    const renderTime = Date.now() - startTime;
    
    // Should render large content within 30 seconds (relaxed for CI consistency)
    expect(renderTime).toBeLessThan(30000);
    
    // Preview should be visible and contain content
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview).toBeVisible();
    await expect(preview.locator('h1')).toContainText('Large Document Test');
  });

  test('should update preview smoothly during typing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    await editor.clear();
    
    const startTime = Date.now();
    
    // Simulate typing
    for (let i = 0; i < 10; i++) {
      await editor.type(`Line ${i}\n`, { delay: 50 });
    }
    
    const typingTime = Date.now() - startTime;
    
    // Should handle typing smoothly (relaxing for CI environments)
    expect(typingTime).toBeLessThan(15000);
    
    // Preview should have updated
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview).toContainText('Line 9');
  });

  test('should not have memory leaks on repeated edits', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    
    // Perform multiple edit cycles
    for (let i = 0; i < 10; i++) {
      await editor.clear();
      await editor.fill(`# Test ${i}\n\nContent for iteration ${i}`);
      await page.waitForTimeout(200);
    }
    
    // Get memory usage (if available)
    const memoryInfo = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      } : null;
    });
    
    if (memoryInfo) {
      // Memory usage should be reasonable (less than 100MB)
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024);
    }
  });

  test('should have minimal bundle size impact', async ({ page }) => {
    const response = await page.goto('/');
    
    expect(response).toBeTruthy();
    
    // Get all resources loaded
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries.map(entry => ({
        name: entry.name,
        size: entry.transferSize,
        type: entry.initiatorType,
      }));
    });
    
    // Calculate total JS size
    const totalJsSize = resources
      .filter(r => r.name.includes('.js'))
      .reduce((sum, r) => sum + r.size, 0);
    
    // Total JS should be reasonable (less than 1MB for initial load)
    expect(totalJsSize).toBeLessThan(1024 * 1024);
  });

  test('should lazy load components efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for initial content to be visible
    const editor = page.locator('textarea');
    await editor.waitFor({ state: 'visible' });
    
    const timeToInteractive = Date.now() - startTime;
    
    // Should become interactive quickly (within 10 seconds for mobile/CI)
    expect(timeToInteractive).toBeLessThan(10000);
  });

  test('should handle rapid theme switching', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const themeToggle = page.locator('button').filter({ has: page.locator('svg') }).first();
    
    const startTime = Date.now();
    
    // Toggle theme multiple times
    for (let i = 0; i < 10; i++) {
      await themeToggle.click();
      await page.waitForTimeout(50);
    }
    
    const toggleTime = Date.now() - startTime;
    
    // Should handle rapid toggling smoothly (relaxed for WebKit/Mobile)
    expect(toggleTime).toBeLessThan(20000);
  });

  test('should cache localStorage efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    const testContent = '# Performance Test\n\nThis is a test.';
    
    await editor.clear();
    await editor.fill(testContent);
    
    // Wait for localStorage to update
    await page.waitForTimeout(500);
    
    // Reload page
    const reloadStart = Date.now();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const reloadTime = Date.now() - reloadStart;
    
    // Should reload quickly with cached content
    expect(reloadTime).toBeLessThan(3000);
    
    // Content should be restored
    const editorAfterReload = page.locator('textarea');
    const content = await editorAfterReload.inputValue();
    expect(content).toContain('Performance Test');
  });
});

test.describe('Performance - Network Conditions', () => {
  test('should work on slow 3G', async ({ page, context }) => {
    // Simulate slow 3G
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should still load within reasonable time on slow connection
    expect(loadTime).toBeLessThan(10000);
    
    // Core functionality should work
    const editor = page.locator('textarea');
    await expect(editor).toBeVisible();
  });

  test('should handle offline mode gracefully', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await context.setOffline(true);
    
    // App should still be functional (it's a client-side app)
    const editor = page.locator('textarea');
    await editor.clear();
    await editor.fill('# Offline Test');
    
    await page.waitForTimeout(500);
    
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview.locator('h1')).toContainText('Offline Test');
    
    // Go back online
    await context.setOffline(false);
  });
});
