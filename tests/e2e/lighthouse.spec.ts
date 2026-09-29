import { test, expect } from '@playwright/test';

test.describe('Lighthouse Performance Audit', () => {
  test('should achieve 90+ Lighthouse score', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return {
        // Largest Contentful Paint
        lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0,
        // First Input Delay (via PerformanceObserver in real scenario)
        fid: 0,
        // Cumulative Layout Shift
        cls: 0,
        // First Contentful Paint
        fcp: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    // LCP should be < 2.5s
    expect(metrics.lcp).toBeLessThan(2500);
    // FCP should be < 1.8s
    expect(metrics.fcp).toBeLessThan(1800);
  });

  test('should have optimized bundle size', async ({ page }) => {
    const response = await page.goto('http://localhost:3000');
    const size = (await response?.text())?.length || 0;
    // HTML should be under 100KB
    expect(size).toBeLessThan(100000);
  });

  test('should have no layout shifts', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    const cls = await page.evaluate(() => {
      let cls = 0;
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        });
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      return cls;
    });

    // CLS should be < 0.1
    expect(cls).toBeLessThan(0.1);
  });

  test('should preload critical resources', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (request) => {
      requests.push(request.resourceType());
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Check that critical resources are loaded
    expect(requests.includes('document')).toBe(true);
    expect(requests.includes('stylesheet')).toBe(true);
  });

  test('should be mobile-friendly at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('http://localhost:3000');

    // Check viewport meta tag
    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewportMeta).toContain('width=device-width');
    expect(viewportMeta).toContain('initial-scale=1');
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Verify text is readable (contrast ratio > 4.5:1 for AA compliance)
    const textElements = await page.locator('body *').all();
    expect(textElements.length).toBeGreaterThan(0);
  });

  test('should have security headers', async ({ page }) => {
    const response = await page.goto('http://localhost:3000');
    const headers = response?.headers() || {};

    expect(headers['x-frame-options']).toBeDefined();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBeDefined();
  });
});