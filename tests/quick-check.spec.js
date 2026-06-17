const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8765';

test('desktop - all pages load with nav and footer', async ({ page }) => {
  const pages = ['/', '/apps/', '/blog/', '/about/', '/contact/', '/resources/', '/privacy/', '/terms/', '/patterns/'];
  for (const path of pages) {
    await page.setViewportSize({ width: 1280, height: 800 });
    const resp = await page.goto(BASE + path);
    expect(resp.status()).toBe(200);
    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.locator('.site-footer')).toBeVisible();
  }
});

test('mobile - all pages load with hamburger', async ({ page }) => {
  const pages = ['/', '/apps/', '/blog/', '/about/', '/contact/', '/resources/', '/privacy/', '/terms/', '/patterns/'];
  for (const path of pages) {
    await page.setViewportSize({ width: 375, height: 812 });
    const resp = await page.goto(BASE + path);
    expect(resp.status()).toBe(200);
    await expect(page.locator('.nav-toggle')).toBeVisible();
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollW).toBeLessThanOrEqual(380);
  }
});

test('mobile hamburger works', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(BASE + '/');
  await page.locator('.nav-toggle').click();
  await expect(page.locator('.nav-links a')).toHaveCount(7);
  await expect(page.locator('.nav-links a').first()).toBeVisible();
  await page.locator('.nav-links a').first().click();
  await expect(page.locator('body')).not.toHaveClass(/nav-open/);
});
