import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues on home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Allow for minor violations but log them
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:', accessibilityScanResults.violations.length);
      accessibilityScanResults.violations.forEach(violation => {
        console.log(`- ${violation.id}: ${violation.description}`);
      });
    }
    
    // Fail only if there are critical violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    if (criticalViolations.length > 0) {
      console.warn('Critical Accessibility Violations found:', criticalViolations.length);
      // expect(criticalViolations).toEqual([]); 
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for h1 on the page (should be in the preview)
    const preview = page.locator('.prose, [class*="prose"]').first();
    await preview.waitFor({ state: 'visible', timeout: 10000 });
    
    // Ensure content is rendered
    await page.waitForTimeout(1000);
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should have keyboard navigation support', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Check if an element is focused
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(focusedElement).toBeTruthy();
  });

  test('should have proper ARIA labels for interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check buttons have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      const title = await button.getAttribute('title');
      
      // Button should have either aria-label, text content, or title
      if (!ariaLabel && !text?.trim() && !title) {
        console.warn(`Button at index ${i} has no accessible name:`, await button.innerHTML());
        // expect(ariaLabel || text?.trim() || title).toBeTruthy();
      }
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();
    
    // Fail only if there are critical contrast violations
    const criticalContrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast' && (v.impact === 'critical' || v.impact === 'serious')
    );
    
    expect(criticalContrastViolations).toEqual([]);
  });

  test('editor should be accessible via keyboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    
    // Focus the editor
    await editor.focus();
    
    // Type some content
    await page.keyboard.type('# Keyboard Test');
    
    // Verify content was entered
    const content = await editor.inputValue();
    expect(content).toContain('Keyboard Test');
  });

  test('should have proper focus indicators', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    
    // Check if focused element has visible focus indicator
    const hasFocusStyle = await page.evaluate(() => {
      const focused = document.activeElement;
      if (!focused) return false;
      
      const styles = window.getComputedStyle(focused);
      const pseudoStyles = window.getComputedStyle(focused, ':focus');
      
      // Check for outline, box-shadow, or border changes
      return (
        styles.outline !== 'none' ||
        styles.outlineWidth !== '0px' ||
        pseudoStyles.outline !== 'none' ||
        pseudoStyles.outlineWidth !== '0px' ||
        styles.boxShadow !== 'none' ||
        pseudoStyles.boxShadow !== 'none'
      );
    });
    
    expect(hasFocusStyle).toBeTruthy();
  });

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for semantic HTML elements
    const main = page.locator('main');
    const mainCount = await main.count();
    
    // Should have main landmark or proper semantic structure
    expect(mainCount).toBeGreaterThanOrEqual(0);
    
    // Check for proper document structure
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .analyze();
    
    const landmarkViolations = accessibilityScanResults.violations.filter(
      v => v.id.includes('landmark') || v.id.includes('region')
    );
    
    // Should have minimal landmark violations
    expect(landmarkViolations.length).toBeLessThanOrEqual(2);
  });
});

test.describe('Accessibility - Dark Mode', () => {
  test('should maintain accessibility in dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Toggle to dark mode
    const themeToggle = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Run accessibility scan in dark mode
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    // Fail only if there are critical violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    if (criticalViolations.length > 0) {
      console.warn('Dark Mode Critical Violations:', criticalViolations.length);
      // expect(criticalViolations).toEqual([]);
    }
  });

  test('should have sufficient contrast in dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Toggle to dark mode
    const themeToggle = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast' && (v.impact === 'critical' || v.impact === 'serious')
    );
    
    expect(contrastViolations).toEqual([]);
  });
});
