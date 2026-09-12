import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { launchBrowser, previewUrl, isolateMapProvider } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl(), output = 'artifacts/enquiry-smoke';
const suite = await smokeReport(output, base), browser = await launchBrowser();
const photo = await readFile('static/assets/images/lead/day-night-stock-01.webp');
async function close(page, dialog, trigger) {
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  await page.waitForFunction(() => getComputedStyle(document.body).position !== 'fixed');
  if (trigger) assert(await trigger.evaluate(node => node === document.activeElement));
}
try {
  for (const width of [320, 390, 844, 1440]) await suite.check(`sell/import drafts, photos and browser outcomes ${width}`, async () => {
    const page = await browser.newPage({ viewport: { width, height: width === 844 ? 390 : 900 } });
    await isolateMapProvider(page); page.setDefaultTimeout(10000);
    const errors = [], posts = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.method() === 'POST' && request.frame() === page.mainFrame()) posts.push(request.url()); });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copied = text; } } });
      Object.defineProperty(navigator, 'share', { configurable: true, value: async data => { window.__shared = { text: data.text, files: data.files?.length || 0 }; } });
      Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
    });
    try {
      await page.goto(`${base}/contact?topic=trade-in`, { waitUntil: 'networkidle' });
      const start = page.locator('.dn-tradein-start'), sell = page.locator('.dn-tradein-dialog');
      await start.click(); assert(await sell.evaluate(node => node.matches(':modal')));
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).position), 'fixed');
      await sell.getByRole('button', { name: 'Към снимките', exact: true }).click();
      assert(await sell.locator('[name=make]').evaluate(node => node === document.activeElement));
      for (const [name, value] of Object.entries({ make: 'Audi', model: 'A6 Avant', year: '2020', mileage: '85000', price: '35000' })) await sell.locator(`[name=${name}]`).fill(value);
      await page.screenshot({ path: `${output}/sell-details-${width}.png` });
      await sell.getByRole('button', { name: 'Към снимките', exact: true }).click();
      const files = sell.locator('input[type=file]');
      await files.setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not a photo') });
      assert.match(await sell.locator('[role=alert]').innerText(), /JPG/);
      await files.setInputFiles({ name: 'large.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
      assert.match(await sell.locator('[role=alert]').innerText(), /10 MB/);
      await files.setInputFiles(Array.from({ length: 7 }, (_, index) => ({ name: `car-${index}.webp`, mimeType: 'image/webp', buffer: photo })));
      assert.equal(await sell.locator('.dn-tradein-photo-grid img').count(), 6);
      await sell.locator('.dn-tradein-photo-grid img').first().evaluate(image => image.decode());
      await sell.getByRole('button', { name: 'Премахни car-0.webp', exact: true }).click();
      assert.equal(await sell.locator('.dn-tradein-photo-grid img').count(), 5);
      await sell.locator('textarea').fill('Редовно обслужван.');
      await sell.locator('[autocomplete=name]').fill('Тест');
      await sell.locator('input[type=tel]').fill('+359 (88) 123-45-67');
      await page.screenshot({ path: `${output}/sell-photos-${width}.png` });
      await sell.getByRole('button', { name: 'Прегледай заявката', exact: true }).click();
      assert.match(await sell.locator('.dn-tradein-review-card').innerText(), /Audi A6 Avant/);
      assert.match(await sell.locator('.dn-tradein-review-card').innerText(), /85000/);
      await sell.getByRole('button', { name: 'Копирай текста', exact: true }).click();
      assert.match(await page.evaluate(() => window.__copied), /Audi A6 Avant/);
      await sell.getByRole('button', { name: 'Сподели заявката', exact: true }).click();
      assert.equal(await page.evaluate(() => window.__shared.files), 5);
      await page.screenshot({ path: `${output}/sell-review-${width}.png` });
      await close(page, sell, start); await start.click();
      assert.equal(await sell.locator('.dn-tradein-review-photos img').count(), 5);
      await close(page, sell, start);

      await page.goto(`${base}/contact?topic=import`, { waitUntil: 'networkidle' });
      const link = page.locator('#enquiry-listing-link'), dialog = page.locator('.dn-enquiry');
      for (const value of ['', 'javascript:alert(1)', 'https://user:pass@example.com']) {
        await link.fill(value); await page.getByRole('button', { name: 'Продължи с обявата', exact: true }).click();
        assert(await page.locator('.dn-enquiry-entry [role=alert]').isVisible()); assert(!await dialog.isVisible());
      }
      await link.fill('https://example.com/car?id=12#photos');
      await page.getByRole('button', { name: 'Продължи с обявата', exact: true }).click();
      assert.match(await dialog.locator('.dn-enquiry-selected-link').innerText(), /id=12#photos/);
      await dialog.getByRole('button', { name: 'Продължи', exact: true }).click();
      assert.equal(await dialog.locator('input[type=file]').count(), 0);
      await dialog.locator('textarea').fill('Автоматик, до 40 000 евро.');
      await dialog.getByRole('button', { name: 'Прегледай запитването', exact: true }).click();
      assert.match(await dialog.locator('pre').innerText(), /id=12#photos/);
      await page.screenshot({ path: `${output}/import-review-${width}.png` });
      await close(page, dialog);
      await page.getByRole('button', { name: 'Инфо', exact: true }).click();
      await page.getByRole('button', { name: 'Продължи с описанието', exact: true }).click();
      assert(await page.locator('.dn-enquiry-entry [role=alert]').isVisible()); assert(!await dialog.isVisible());
      await page.locator('#enquiry-import-info').fill('BMW X3, автоматик, от 2020 година');
      await page.getByRole('button', { name: 'Продължи с описанието', exact: true }).click();
      assert.equal(await dialog.locator('.dn-enquiry-selected-link').count(), 0);
      await dialog.getByRole('button', { name: 'Продължи', exact: true }).click();
      await dialog.getByRole('button', { name: 'Прегледай запитването', exact: true }).click();
      assert.match(await dialog.locator('pre').innerText(), /BMW X3/);
      const geometry = await dialog.evaluate(node => ({ overflow: node.scrollWidth - node.clientWidth, height: node.getBoundingClientRect().height, viewport: innerHeight }));
      assert(geometry.overflow <= 1 && geometry.height <= geometry.viewport);
      await page.keyboard.press('Tab'); assert(await dialog.evaluate(node => node.contains(document.activeElement)));
      await close(page, dialog);
      await page.getByRole('button', { name: 'Линк', exact: true }).click();
      await link.fill('https://example.com/another-car');
      await page.getByRole('button', { name: 'Продължи с обявата', exact: true }).click();
      assert.match(await dialog.locator('.dn-enquiry-selected-link').innerText(), /another-car/);
      assert.deepEqual(errors, []); assert.deepEqual(posts, [], 'Drafts are not backend submissions');
      return { width, geometry, pageErrors: errors.length, serverSubmissions: posts.length, uploadedPhotos: 6, sharedPhotos: 5 };
    } finally { await page.close(); }
  });
} finally { await browser.close(); await suite.finish(); }
