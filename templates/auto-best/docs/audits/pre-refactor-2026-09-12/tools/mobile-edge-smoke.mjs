import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';
const base = previewUrl();
const engine = process.env.PLAYWRIGHT_ENGINE || 'chromium';
const out = `artifacts/mobile-edge-${engine}`;
await mkdir(out, { recursive: true });
const suite = await smokeReport(out, base);
const browser = await launchBrowser();
try {
  for (const [width, height] of [[320, 568], [390, 400], [700, 390]]) {
    await suite.check(`short viewport ${width}x${height}`, async () => {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      try {
        for (const [route, trigger, selector] of [['/', '.dn-quick-search__trigger', '#dn-quick-search-dialog'], ['/listing-grid', '.dn-listing-filter__toggle', '#dn-listing-filter-dialog'], ['/contact?topic=trade-in', '.dn-enquiry-entry-field:visible, .dn-enquiry-desktop-start.dn-enquiry-primary:visible', '.dn-enquiry'], ['/listing-detail-v1/1', '.dn-financing button', '.dn-finance-dialog']]) {
          await page.goto(base + route, { waitUntil: 'networkidle' });
          await page.locator(trigger).click();
          const dialog = page.locator(selector);
          await page.locator(`${selector}[open]`).waitFor();
          assert(await dialog.evaluate(node => node.matches(':modal')));
          const rect = await dialog.boundingBox();
          assert(rect.y >= -1 && rect.y + rect.height <= height + 1);
          assert(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth + 1));
          await page.screenshot({ path: `${out}/${width}-${selector.replace(/[^a-z0-9]/gi, '_')}.png` });
          await page.keyboard.press('Escape');
        }
      } finally { await page.close(); }
    });
  }
  await suite.check('clipboard denial and sharing cancellation', async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const posts = [];
    page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied'); } } });
      Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('Cancelled', 'AbortError'); } });
    });
    try {
      await page.goto(`${base}/contact?topic=import`, { waitUntil: 'networkidle' });
      if (await page.getByRole('tab', { name: 'Информация', exact: true }).isVisible()) await page.getByRole('tab', { name: 'Информация', exact: true }).click();
    await page.getByRole('button', { name: 'Опиши автомобила', exact: true }).click();
      const dialog = page.locator('.dn-enquiry');
      await page.locator('.dn-enquiry[open]').waitFor();
      await dialog.locator('input[name=make]').fill('Audi');
      await dialog.locator('input[name=model]').fill('A6');
      await dialog.getByRole('button', { name: 'Продължи', exact: true }).click();
      await dialog.getByRole('button', { name: 'Прегледай запитването', exact: true }).click();
      await dialog.getByRole('button', { name: 'Копирай текста', exact: true }).click();
      assert.match(await dialog.locator('[role=status]').innerText(), /не е достъпно/);
      await dialog.getByRole('button', { name: 'Сподели запитването', exact: true }).click();
      assert(await dialog.locator('pre').isVisible());
      assert.equal(await dialog.locator('[role=status]').count(), 0);
      assert.deepEqual(posts, []);
    } finally { await page.close(); }
  });
  await suite.check('offline map fallback', async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    try {
      await page.goto(`${base}/contact`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.dn-showroom-map iframe').count(), 0);
      await context.setOffline(true);
      await page.getByText('Картата изисква интернет връзка.', { exact: true }).waitFor();
      assert(await page.locator('.dn-showroom-map__link').getAttribute('href'));
      await page.locator('.dn-showroom-map').screenshot({ path: `${out}/offline-map.png` });
    } finally { await context.close(); }
  });
  await suite.check('vehicle details survive a failed photo', async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    try {
      await page.route('**/*', route => route.request().url().includes('day-night-stock') ? route.abort() : route.continue());
      await page.goto(`${base}/listing-detail-v1/1`, { waitUntil: 'networkidle' });
      assert(await page.locator('#vehicle-title').isVisible());
      assert(await page.locator('.dn-detail-summary__price').isVisible());
      assert(await page.locator('.dn-mobile-detail-bar a[href^="tel:"]').isVisible());
      assert(await page.locator('.dn-detail-gallery img').getAttribute('alt'));
      await page.screenshot({ path: `${out}/failed-photo.png` });
    } finally { await page.close(); }
  });
  await suite.check('200% text enlargement stress', async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const measurements = [];
    try {
      for (const route of ['/', '/listing-grid', '/listing-detail-v1/1', '/contact?topic=trade-in', '/contact?topic=import', '/blog-detail/1']) {
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => {
          const nodes = [...document.querySelectorAll('*')].map(node => ({ node, size: parseFloat(getComputedStyle(node).fontSize), leading: getComputedStyle(node).lineHeight }));
          for (const { node, size, leading } of nodes) {
            if (node instanceof HTMLElement) { node.style.fontSize = `${size * 2}px`; if (leading !== 'normal') node.style.lineHeight = `${parseFloat(leading) * 2}px`; }
          }
        });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        measurements.push({ route, overflow });
        await page.screenshot({ path: `${out}/text-200-${route.replace(/[^a-z0-9]/gi, '_')}.png`, fullPage: true });
        assert(overflow <= 1, `${route}: enlarged text causes document overflow`);
      }
      return { method: 'Double computed font sizes and line heights; retain layout. Stress simulation, not physical-device zoom certification.', measurements };
    } finally { await page.close(); }
  });
} finally { await browser.close(); await suite.finish(); }
