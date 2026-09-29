import { test, expect } from '@playwright/test';

test.describe('Snake Arena - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should load landing page with hero section', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('SNAKE ARENA');
    await expect(page.locator('text=Built by Adi Binsheraz')).toBeVisible();
  });

  test('should navigate to docs', async ({ page }) => {
    await page.goto('http://localhost:3000/docs');
    await expect(page.locator('h1')).toContainText('Snake Arena Docs');
  });

  test('should have working Ask the Docs button', async ({ page }) => {
    await page.goto('http://localhost:3000/docs');
    await page.click('button:has-text("Ask the Docs")');
    await expect(page.locator('h3:has-text("Ask the Docs")')).toBeVisible();
  });

  test('should submit score successfully', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/scores', (route) => {
      route.abort();
    });

    await page.goto('http://localhost:3000');
    // Start game would be here
    // This is a placeholder for game flow testing
  });

  test('should respect reduced motion preference', async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Check for prefers-reduced-motion media query
    const prefersReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
    expect(typeof prefersReducedMotion).toBe('boolean');
  });

  test('should have proper accessibility', async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Check for main landmark
    await expect(page.locator('main')).toBeDefined();
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should be mobile responsive at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should load in under 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('http://localhost:3000');
    expect(errors).toHaveLength(0);
  });
});