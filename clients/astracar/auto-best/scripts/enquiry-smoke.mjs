import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';

const base = previewUrl();
const output = 'artifacts/enquiry-smoke';
await mkdir(output, { recursive: true });
const browser = await launchBrowser();
const photo = await readFile('static/assets/images/lead/day-night-stock-01.webp');
const results = [];

try {
  for (const width of [320, 390, 844, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 844 ? 390 : 900 } });
    const errors = [];
    const posts = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (request.method() === 'POST' && request.frame() === page.mainFrame()) posts.push(request.url());
    });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copied = text; } } });
      Object.defineProperty(navigator, 'share', { configurable: true, value: async data => { window.__shared = { text: data.text, files: data.files?.length || 0 }; } });
      Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
    });

    await page.goto(`${base}/contact?topic=trade-in`, { waitUntil: 'networkidle' });
    const start = page.getByRole('button', { name: 'Заяви оценка', exact: true });
    await start.click();
    const trade = page.locator('.dn-tradein-dialog');
    await trade.waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.body).position), 'fixed');
    await trade.getByRole('button', { name: 'Към снимките', exact: true }).click();
    assert.equal(await trade.locator('input[name="make"]').evaluate(input => input === document.activeElement), true);
    await trade.locator('input[name="make"]').fill('Audi');
    await trade.locator('input[name="model"]').fill('A6 Avant');
    await trade.locator('input[name="year"]').fill('2020');
    await trade.locator('input[name="mileage"]').fill('85000');
    await trade.locator('input[name="price"]').fill('35000');
    await page.screenshot({ path: `${output}/sell-details-${width}.png` });
    await trade.getByRole('button', { name: 'Към снимките', exact: true }).click();

    const files = trade.locator('input[type="file"]');
    await files.setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not a photo') });
    assert.match(await trade.locator('[role="alert"]').innerText(), /JPG/);
    await files.setInputFiles({ name: 'large.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
    assert.match(await trade.locator('[role="alert"]').innerText(), /10 MB/);
    await files.setInputFiles(Array.from({ length: 7 }, (_, index) => ({ name: `car-${index}.webp`, mimeType: 'image/webp', buffer: photo })));
    assert.equal(await trade.locator('.dn-tradein-photo-grid img').count(), 6);
    await trade.getByRole('button', { name: 'Премахни car-0.webp', exact: true }).click();
    assert.equal(await trade.locator('.dn-tradein-photo-grid img').count(), 5);
    await trade.locator('textarea').fill('Редовно обслужван.');
    await trade.locator('input[autocomplete="name"]').fill('Тест');
    await trade.locator('input[type="tel"]').fill('+359 (88) 123-45-67');
    await page.screenshot({ path: `${output}/sell-photos-${width}.png` });
    await trade.getByRole('button', { name: 'Прегледай заявката', exact: true }).click();
    const tradeReview = trade.locator('.dn-tradein-review-card');
    assert.match(await tradeReview.innerText(), /Audi A6 Avant/);
    assert.match(await tradeReview.innerText(), /85000/);
    await trade.getByRole('button', { name: 'Копирай текста', exact: true }).click();
    assert.match(await page.evaluate(() => window.__copied), /Audi A6 Avant/);
    await trade.getByRole('button', { name: 'Сподели заявката', exact: true }).click();
    assert.equal(await page.evaluate(() => window.__shared.files), 5);
    await page.screenshot({ path: `${output}/sell-review-${width}.png` });
    await page.keyboard.press('Escape');
    assert.equal(await start.evaluate(button => document.activeElement === button), true);
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).position), 'fixed');
    await start.click();
    assert.match(await tradeReview.innerText(), /Audi A6 Avant/, 'Closing must retain the draft');
    assert.equal(await trade.locator('.dn-tradein-review-photos img').count(), 5);
    await page.keyboard.press('Escape');

    await page.goto(`${base}/contact?topic=import`, { waitUntil: 'networkidle' });
    const entry = page.locator('#enquiry-entry');
    const editor = page.locator('#enquiry-entry-dialog');
    await entry.click();
    await editor.locator('[name="entry-value"]').fill('javascript:alert(1)');
    await editor.getByRole('button', { name: 'Запази', exact: true }).click();
    assert.match(await editor.locator('[role="alert"]').innerText(), /валиден линк/);
    await editor.locator('[name="entry-value"]').fill('https://example.com/car?id=12#photos');
    await editor.getByRole('button', { name: 'Запази', exact: true }).click();
    await editor.waitFor({ state: 'hidden' });
    await page.getByRole('button', { name: 'Заяви внос по обява', exact: true }).click();
    const enquiry = page.locator('.dn-enquiry');
    await enquiry.waitFor({ state: 'visible' });
    assert.match(await enquiry.locator('.dn-enquiry-selected-link').innerText(), /id=12#photos/);
    await enquiry.getByRole('button', { name: 'Продължи', exact: true }).click();
    assert.equal(await enquiry.locator('input[type="file"]').count(), 0, 'Import must not expose selling photos');
    await enquiry.locator('textarea').fill('Автоматик, до 40 000 евро.');
    await enquiry.locator('input[autocomplete="name"]').fill('Тест');
    await enquiry.locator('input[type="tel"]').fill('+359 88 123 4567');
    await enquiry.getByRole('button', { name: 'Прегледай запитването', exact: true }).click();
    const summary = enquiry.locator('.dn-enquiry-summary');
    assert.match(await summary.innerText(), /id=12#photos/);
    assert.match(await summary.innerText(), /Автоматик/);
    await enquiry.getByRole('button', { name: 'Копирай текста', exact: true }).click();
    assert.match(await page.evaluate(() => window.__copied), /id=12#photos/);
    await enquiry.getByRole('button', { name: 'Сподели запитването', exact: true }).click();
    assert.equal(await page.evaluate(() => window.__shared.files), 0);
    await page.screenshot({ path: `${output}/import-link-review-${width}.png` });
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Инфо', exact: true }).click();
    await entry.click();
    await editor.locator('[name="entry-value"]').fill('BMW X5, дизел, 2020+, xDrive');
    await editor.locator('[name="entry-budget"]').fill('40000');
    await editor.getByRole('button', { name: 'Запази', exact: true }).click();
    await page.getByRole('button', { name: 'Заяви внос по описание', exact: true }).click();
    await enquiry.waitFor({ state: 'visible' });
    await enquiry.getByRole('button', { name: 'Продължи', exact: true }).click();
    await enquiry.locator('textarea').fill('Предпочитам автомобил от Германия.');
    await enquiry.getByRole('button', { name: 'Прегледай запитването', exact: true }).click();
    assert.match(await summary.innerText(), /BMW X5/);
    assert.match(await summary.innerText(), /40000/);
    const geometry = await enquiry.evaluate(element => ({
      overflow: element.scrollWidth - element.clientWidth,
      height: element.getBoundingClientRect().height,
      viewport: window.innerHeight
    }));
    assert.ok(geometry.overflow <= 1 && geometry.height <= geometry.viewport);
    await page.keyboard.press('Tab');
    assert.equal(await enquiry.evaluate(element => element.contains(document.activeElement)), true);
    await page.keyboard.press('Escape');

    assert.deepEqual(errors, []);
    assert.deepEqual(posts, [], 'Drafts must not be sent to a server');
    results.push({ width, passed: true, geometry, pageErrors: errors.length, serverSubmissions: posts.length });
    await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2));
    console.log(`PASS sell/import forms, photos, review, share, draft and focus at ${width}px`);
    await page.close();
  }
  await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2));
} catch (error) {
  results.push({ passed: false, error: error.stack });
  throw error;
} finally {
  await browser.close();
  await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2));
}
