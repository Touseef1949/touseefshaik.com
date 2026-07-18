const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:8765';

test('desktop - all pages load with nav and footer', async ({ page }) => {
  const pages = ['/', '/apps/', '/portfolio/', '/blog/', '/about/', '/contact/', '/resources/', '/privacy/', '/terms/', '/patterns/'];
  for (const path of pages) {
    await page.setViewportSize({ width: 1280, height: 800 });
    const resp = await page.goto(BASE + path);
    expect(resp.status()).toBe(200);
    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.locator('.site-footer')).toBeVisible();
  }
});

test('mobile - all pages load with hamburger', async ({ page }) => {
  const pages = ['/', '/apps/', '/portfolio/', '/blog/', '/about/', '/contact/', '/resources/', '/privacy/', '/terms/', '/patterns/'];
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

test('portfolio surfaces show truthful flagship and runtime status', async ({ page }) => {
  await page.goto(BASE + '/apps/');

  await expect(page.locator('.app-card.flagship')).toHaveCount(3);
  await expect(page.getByText('Unavailable · Quota limit')).toHaveCount(2);
  await expect(page.getByText('Paused · Demo available')).toHaveCount(2);

  const flagshipDestinations = [
    'https://tshaik1990-ba-assistant.hf.space',
    'https://tshaik1990-ba-jira-agent.hf.space',
    'https://tshaik1990-stock-research-assistant.hf.space',
  ];
  for (const href of flagshipDestinations) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
  }

  const flagshipRepositories = [
    'https://github.com/Touseef1949/BA_Assistant',
    'https://github.com/Touseef1949/ba-jira-agent',
    'https://github.com/Touseef1949/stock-research-assistant',
  ];
  for (const href of flagshipRepositories) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
  }

  await page.goto(BASE + '/');
  await expect(page.getByText('Public flagships')).toBeVisible();
  await expect(page.getByText('Live tools')).toHaveCount(0);
});

test('portfolio map classifies all 22 repositories exactly once', async ({ page }) => {
  await page.goto(BASE + '/portfolio/');

  await expect(page.locator('.apps-table tbody tr')).toHaveCount(22);

  const expectedCounts = {
    'Flagship': 3,
    'Portfolio surface': 2,
    'Flagship candidate': 1,
    'Private product': 3,
    'Lab': 7,
    'Archive': 6,
  };

  for (const [classification, count] of Object.entries(expectedCounts)) {
    await expect(
      page.locator('.apps-table tbody td:first-child').filter({ hasText: new RegExp(`^${classification}$`) })
    ).toHaveCount(count);
  }

  await expect(page.getByText('Twenty-two owned repositories')).toBeVisible();
  await expect(page.getByText('AImpactForge', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Baseline v0.1.0' })).toHaveCount(3);
});

test('each flagship surface links to its canonical v0.1.0 release', async ({ page }) => {
  const releaseUrls = [
    'https://github.com/Touseef1949/BA_Assistant/releases/tag/v0.1.1',
    'https://github.com/Touseef1949/ba-jira-agent/releases/tag/v0.1.0',
    'https://github.com/Touseef1949/stock-research-assistant/releases/tag/v0.1.0',
  ];

  await page.goto(BASE + '/apps/');
  for (const href of releaseUrls) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
  }
});
