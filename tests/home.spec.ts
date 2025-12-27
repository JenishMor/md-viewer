import { test, expect } from '@playwright/test';

test.describe('Home Page - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/MDViewer/i);
  });

  test('should display editor and preview panels', async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check for editor (textarea)
    const editor = page.locator('textarea');
    await expect(editor).toBeVisible();
    
    // Check for preview content
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview).toBeVisible();
  });

  test('should have default markdown content', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    const content = await editor.inputValue();
    
    expect(content).toContain('MD Viewer');
    expect(content).toContain('Live Markdown Preview');
  });

  test('should update preview when typing in editor', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    
    // Clear existing content
    await editor.clear();
    
    // Type new content
    const testContent = '# Test Heading\n\nThis is a **test** paragraph.';
    await editor.fill(testContent);
    
    // Wait a bit for the preview to update
    await page.waitForTimeout(500);
    
    // Check if preview contains the rendered content
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview.locator('h1')).toContainText('Test Heading');
    await expect(preview.locator('strong')).toContainText('test');
  });

  test('should persist content in localStorage', async ({ page, context }) => {
    await page.waitForLoadState('networkidle');
    
    const editor = page.locator('textarea');
    const testContent = '# Persistent Content Test';
    
    await editor.clear();
    await editor.fill(testContent);
    
    // Wait for localStorage to update
    await page.waitForTimeout(500);
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if content persists
    const editorAfterReload = page.locator('textarea');
    const contentAfterReload = await editorAfterReload.inputValue();
    expect(contentAfterReload).toContain('Persistent Content Test');
  });
});

test.describe('Home Page - Markdown Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should render headings correctly', async ({ page }) => {
    const editor = page.locator('textarea');
    await editor.clear();
    await editor.fill('# H1\n## H2\n### H3');
    
    await page.waitForTimeout(500);
    
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview.locator('h1')).toContainText('H1');
    await expect(preview.locator('h2')).toContainText('H2');
    await expect(preview.locator('h3')).toContainText('H3');
  });

  test('should render lists correctly', async ({ page }) => {
    const editor = page.locator('textarea');
    const listMarkdown = `
- Item 1
- Item 2
  - Nested item
- Item 3

1. First
2. Second
3. Third
`;
    await editor.clear();
    await editor.fill(listMarkdown);
    
    await page.waitForTimeout(1000);
    
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview.locator('ul').first()).toBeVisible();
    await expect(preview.locator('ol').first()).toBeVisible();
  });

  test('should render code blocks with syntax highlighting', async ({ page }) => {
    const editor = page.locator('textarea');
    const codeMarkdown = `
\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`
`;
    await editor.clear();
    await editor.fill(codeMarkdown);
    
    await page.waitForTimeout(500);
    
    const preview = page.locator('.prose, [class*="prose"]').first();
    const codeBlock = preview.locator('pre code');
    await expect(codeBlock).toBeVisible();
    await expect(codeBlock).toContainText('function hello');
  });

  test('should render inline code', async ({ page }) => {
    const editor = page.locator('textarea');
    await editor.clear();
    await editor.fill('This is `inline code` in a sentence.');
    
    await page.waitForTimeout(500);
    
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview.locator('code')).toContainText('inline code');
  });

  test('should render links correctly', async ({ page }) => {
    const editor = page.locator('textarea');
    await editor.clear();
    await editor.fill('[Google](https://google.com)');
    
    await page.waitForTimeout(500);
    
    const preview = page.locator('.prose, [class*="prose"]').first();
    const link = preview.locator('a[href="https://google.com"]');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Google');
  });

  test('should render blockquotes', async ({ page }) => {
    const editor = page.locator('textarea');
    await editor.clear();
    await editor.fill('> This is a blockquote\n> with multiple lines');
    
    await page.waitForTimeout(500);
    
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview.locator('blockquote')).toBeVisible();
  });

  test('should render tables (GFM)', async ({ page }) => {
    const editor = page.locator('textarea');
    const tableMarkdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`;
    await editor.clear();
    await editor.fill(tableMarkdown);
    
    await page.waitForTimeout(500);
    
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview.locator('table')).toBeVisible();
    await expect(preview.locator('th')).toHaveCount(2);
  });

  test('should render strikethrough (GFM)', async ({ page }) => {
    const editor = page.locator('textarea');
    await editor.clear();
    await editor.fill('~~strikethrough text~~');
    
    await page.waitForTimeout(500);
    
    const preview = page.locator('.prose, [class*="prose"]').first();
    await expect(preview.locator('del, s')).toContainText('strikethrough text');
  });
});

test.describe('Home Page - Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have a theme toggle button', async ({ page }) => {
    // Look for theme toggle button (usually has sun/moon icon)
    const themeToggle = page.locator('button').filter({ hasText: /theme|dark|light/i }).or(
      page.locator('button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i]')
    ).or(
      page.locator('button').filter({ has: page.locator('svg') }).first()
    );
    
    await expect(themeToggle.first()).toBeVisible();
  });

  test('should toggle theme when clicked', async ({ page }) => {
    // Get initial theme
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');
    
    // Find and click theme toggle
    const themeToggle = page.locator('button').filter({ has: page.locator('svg') }).first();
    await themeToggle.click();
    
    // Wait for theme change
    await page.waitForTimeout(300);
    
    // Check if theme changed
    const newClass = await html.getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });
});
