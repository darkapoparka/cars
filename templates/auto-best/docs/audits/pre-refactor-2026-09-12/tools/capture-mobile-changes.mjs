import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
const base = previewUrl(), engine = process.env.PLAYWRIGHT_ENGINE || 'chromium';
const out = `artifacts/mobile-changes-${engine}`;
await mkdir(out, { recursive: true });
const browser = await launchBrowser(), results = [];
const routes = { home: '/', inventory: '/listing-grid', pdp: '/listing-detail-v1/1', sell: '/contact?topic=trade-in', import: '/contact?topic=import', leasing: '/contact?topic=leasing&vehicle=4', contact: '/contact', about: '/about-us', blog: '/blog', article: '/blog-detail/1' };
try {
  for (const width of [320, 390, 430, 767, 768, 992, 1440]) {
    for (const [name, route] of Object.entries(routes)) {
      const page = await browser.newPage({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: 'reduce' });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      try {
        const response = await page.goto(base + route, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 650) {
          await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y); await page.waitForTimeout(30);
        }
        await page.waitForLoadState('networkidle');
        assert.deepEqual(errors, []);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        if (width === 390 || width === 320 || width === 1440) await page.screenshot({ path: `${out}/${name}-${width}.png`, fullPage: true });
        results.push({ name, route, width, status: response.status(), errors, height: await page.evaluate(() => document.documentElement.scrollHeight) });
      } finally { await page.close(); }
    }
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.goto(base + routes.pdp, { waitUntil: 'networkidle' });
  await page.locator('#financing').evaluate(node => node.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${out}/pdp-banners-390.png` });
  await page.locator('.dn-financing button').click();
  await page.locator('.dn-finance-dialog:modal').waitFor();
  await page.screenshot({ path: `${out}/finance-drawer-390.png` });
  await page.goto(base + routes.sell, { waitUntil: 'networkidle' });
  await page.locator('.dn-enquiry-entry-field:visible, .dn-enquiry-desktop-start.dn-enquiry-primary:visible').click();
  await page.locator('.dn-enquiry:modal').waitFor();
  await page.screenshot({ path: `${out}/sell-drawer-390.png` });
  await page.goto(base + routes.import, { waitUntil: 'networkidle' });
  if (await page.getByRole('tab', { name: 'Информация', exact: true }).isVisible()) await page.getByRole('tab', { name: 'Информация', exact: true }).click();
    await page.getByRole('button', { name: 'Опиши автомобила', exact: true }).click();
  await page.locator('.dn-enquiry:modal').waitFor();
  await page.screenshot({ path: `${out}/import-drawer-390.png` });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('.dn-quick-search__trigger').click();
  await page.locator('#dn-quick-search-dialog:modal').waitFor();
  await page.screenshot({ path: `${out}/home-search-390.png` });
  await page.close();
} finally {
  await browser.close();
  await writeFile(`${out}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, engine, results }, null, 2));
}
console.log(`Captured ${results.length} route/viewport checks and five active mobile states.`);
