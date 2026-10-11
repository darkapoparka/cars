import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const base = process.env.QA_URL || 'http://127.0.0.1:6424';
const output = process.env.QA_OUTPUT || 'reference/web/interactions';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const checks = [];
async function until(fn, message = 'Assertion did not become true') {
  const start = Date.now(); let error;
  while (Date.now() - start < 15000) { try { if (await fn()) return; } catch (e) { error = e; } await new Promise(r => setTimeout(r, 120)); }
  throw error || Error(message);
}
async function go(page, route) { const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 }); await page.locator('[data-hydrated="true"]').waitFor(); return response; }
async function snapshot(page, name) { await page.evaluate(() => document.fonts.ready); await sharp(await page.screenshot()).resize({ width: Math.min(600, page.viewportSize().width) }).toFile(output + '/' + name + '.png'); }
async function test(name, fn, options = {}) {
  if (process.env.QA_TEST && !new RegExp(process.env.QA_TEST, 'i').test(name)) return;
  const context = await browser.newContext({ viewport: { width: 427, height: 872 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true, ...options });
  const page = await context.newPage(); page.setDefaultTimeout(20000); const errors = []; const external = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', req => { if (/^https?:/.test(req.url()) && new URL(req.url()).origin !== new URL(base).origin) external.push(req.url()); });
  const start = Date.now();
  try { await fn(page, context); assert.deepEqual(errors, [], 'Uncaught browser errors'); assert.deepEqual(external, [], 'Unexpected external requests'); checks.push({ name, passed: true, durationMs: Date.now() - start }); console.log('PASS', name); }
  catch (error) { await snapshot(page, 'failure-' + checks.length).catch(() => {}); checks.push({ name, passed: false, error: error.message, errors, external }); console.error('FAIL', name, error.message); }
  finally { await context.close(); await writeFile(output + '/report.json', JSON.stringify({ at: new Date().toISOString(), base, checks }, null, 2)); }
}
try {
  await test('Make/model filtering, navigation and edit persistence', async page => {
    await go(page, '/search'); await page.getByRole('button', { name: 'BMW', exact: true }).click();
    await page.getByRole('dialog').getByLabel('Search models', { exact: true }).fill('X6');
    await page.getByRole('dialog').getByLabel('X6', { exact: true }).check();
    await page.getByRole('dialog').getByRole('button', { name: 'OK', exact: true }).click();
    await page.getByRole('link', { name: /1 Offers?$/ }).click(); await page.waitForURL('**/results?**');
    assert.match(page.url(), /models=X6/); await until(async () => await page.locator('article').count() === 1);
    await page.getByRole('link', { name: 'Go back', exact: true }).click();
    await until(async () => await page.getByRole('button', { name: /BMW.*X6/ }).count() > 0);
    await snapshot(page, 'search-selected');
  });
  await test('Nine sorting choices and persisted sort URL', async page => {
    await go(page, '/results'); await page.getByRole('button', { name: 'Sort options' }).click();
    assert.equal(await page.getByRole('dialog').getByRole('radio').count(), 9); await snapshot(page, 'sort');
    await page.getByRole('dialog').getByLabel('Price (lowest first)', { exact: true }).click();
    await until(() => page.url().includes('sort=price-asc')); await page.reload({ waitUntil: 'networkidle' });
    assert.match(await page.locator('article').first().innerText(), /BMW 120/);
    await page.getByRole('button', { name: 'Sort options' }).click();
    await page.getByRole('dialog').getByLabel('Price (highest first)', { exact: true }).click();
    await until(async () => (await page.locator('article').first().innerText()).includes('BMW X6'));
  });
  await test('Native save-search gate, local sign-in and saved-search lifecycle', async page => {
    await go(page, '/results?fuel=Diesel'); await page.getByRole('button', { name: 'Save search', exact: true }).click();
    await page.getByRole('heading', { name: 'Save your Searches' }).waitFor(); await snapshot(page, 'save-search-gate');
    await page.getByRole('link', { name: 'Log in now', exact: true }).click();
    assert.equal(await page.getByLabel('Password', { exact: true }).isDisabled(), true);
    await page.getByRole('button', { name: 'Continue in local demo', exact: true }).click(); await page.waitForURL('**/results?**');
    await page.getByRole('button', { name: 'Save search', exact: true }).click();
    await page.getByLabel('Search name', { exact: true }).fill('Diesel shortlist');
    await page.getByRole('dialog').getByRole('button', { name: 'Save Search', exact: true }).click();
    await go(page, '/my-searches'); await page.getByRole('link', { name: 'Diesel shortlist', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Rename search', exact: true }).click();
    await page.getByRole('dialog').getByLabel('Search name').fill('Weekend cars'); await page.getByRole('dialog').getByRole('button', { name: 'Save', exact: true }).click();
    await page.reload({ waitUntil: 'networkidle' }); await page.getByRole('link', { name: 'Weekend cars', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Delete Weekend cars' }).click(); await page.getByRole('dialog').getByRole('button', { name: 'Delete search', exact: true }).click();
    await until(async () => await page.getByRole('link', { name: 'Weekend cars', exact: true }).count() === 0);
  });
  await test('Parking persists, comparison works and cross-tab storage synchronizes', async (page, context) => {
    await go(page, '/vehicle/bmw-x6'); await page.getByRole('button', { name: 'Park', exact: true }).click();
    await go(page, '/vehicle/bmw-540'); await page.getByRole('button', { name: 'Park', exact: true }).click();
    await go(page, '/car-park'); await page.getByRole('heading', { name: 'Car Park (2)' }).waitFor(); await snapshot(page, 'car-park-populated');
    await page.getByRole('link', { name: 'Compare', exact: true }).click(); await page.getByRole('table').waitFor(); assert.equal(await page.getByRole('columnheader').count(), 3);
    const second = await context.newPage(); await go(second, '/car-park'); await second.getByRole('heading', { name: 'Car Park (2)' }).waitFor();
    await go(page, '/vehicle/bmw-x6'); await page.getByRole('button', { name: 'Unpark', exact: true }).click();
    await second.getByRole('heading', { name: 'Car Park (1)' }).waitFor(); await page.evaluate(() => localStorage.clear());
    await second.getByRole('heading', { name: 'Car Park (0)' }).waitFor(); await second.close();
  });
  await test('Twenty-image gallery, keyboard, swipe, zoom and modal cleanup', async (page, context) => {
    await go(page, '/vehicle/bmw-x6/gallery'); assert.equal(await page.getByRole('button', { name: /^Open vehicle image/ }).count(), 20);
    await page.getByRole('button', { name: 'Open vehicle image 1', exact: true }).click();
    const viewer = page.getByRole('dialog', { name: 'Vehicle photo viewer' }); await viewer.waitFor();
    await viewer.getByRole('button', { name: 'Next photo', exact: true }).click(); await page.keyboard.press('ArrowRight');
    await until(async () => (await viewer.locator('output').innerText()) === '3 / 20');
    await page.keyboard.press('+'); assert.match(await viewer.locator('img').getAttribute('style'), /scale\(1\.5\)/);
    await page.keyboard.press('-'); const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 330, y: 430 }] });
    for (const x of [280, 230, 170, 90]) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: 430 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await until(async () => (await viewer.locator('output').innerText()) === '4 / 20'); await snapshot(page, 'gallery-viewer');
    await page.keyboard.press('Escape'); await until(async () => await viewer.count() === 0);
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  });
  await test('Native technical/features dialogs and sticky vehicle contact panel', async page => {
    await go(page, '/vehicle/bmw-x6'); await page.getByRole('button', { name: 'Show more technical data', exact: true }).click();
    assert.equal(await page.getByRole('dialog').getByRole('row').count(), 26); await snapshot(page, 'technical-dialog');
    await page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }).click();
    await page.getByRole('button', { name: 'Show more features', exact: true }).click(); assert.equal(await page.getByRole('dialog').getByRole('row').count(), 70);
    await page.keyboard.press('Escape'); await page.evaluate(() => window.scrollTo(0, 1700));
    const box = await page.getByRole('region', { name: 'Vehicle price and contact' }).boundingBox(); assert.ok(Math.abs(box.y - 60) < 2, 'Price panel must remain below native header');
    await page.getByRole('button', { name: 'Calculate Financing', exact: false }).click(); await page.getByRole('dialog').getByLabel('Term', { exact: true }).selectOption('24');
    await page.getByRole('dialog').getByLabel('Assumed annual interest rate (%)', { exact: true }).fill('0'); await snapshot(page, 'finance');
    assert.doesNotMatch(await page.getByRole('dialog').innerText(), /NaN|Infinity/); await page.getByRole('button', { name: 'Done', exact: true }).click();
  });
  await test('Contact message drafts are stored without sending requests', async page => {
    await go(page, '/vehicle/bmw-x6'); await page.getByRole('link', { name: 'Message', exact: true }).click(); await page.waitForURL('**/vehicle/bmw-x6/message', {timeout:90000});
    await page.getByLabel('Your message', { exact: true }).fill('Local test draft, not a message to a real seller.');
    await page.getByRole('button', { name: 'Send', exact: true }).click(); await page.getByRole('dialog').getByRole('link', { name: 'View message drafts' }).click();
    await page.waitForURL('**/messages', {timeout:90000});
    await page.getByRole('heading', {name:'Local message drafts',exact:true}).waitFor();
    await page.getByText('Local test draft, not a message to a real seller.', { exact: true }).waitFor();
    await page.reload({ waitUntil: 'networkidle' }); await page.getByRole('heading', { name: 'Local message drafts' }).waitFor();
    await page.getByRole('button', { name: 'Delete draft', exact: true }).click(); await until(async () => await page.getByText('Local test draft, not a message to a real seller.', { exact: true }).count() === 0);
  });
  await test('Dealer following and My Dealers lifecycle', async page => {
    await go(page, '/vehicle/bmw-x6'); await page.getByRole('button', { name: 'Follow this dealer', exact: true }).click();
    await go(page, '/my-searches'); await page.getByRole('button', { name: 'My Dealers', exact: true }).click();
    await page.getByRole('heading', { name: 'Autohaus Hofmann GmbH', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Options for Autohaus Hofmann GmbH' }).click();
    await page.getByRole('button', { name: 'Unfollow dealer', exact: true }).click();
    await page.getByRole('button', { name: 'Yes, unfollow', exact: true }).click(); await page.getByText('You aren’t currently following any dealer.', { exact: true }).waitFor();
  });
  await test('Local selling wizard validates fields and saves a real draft', async page => {
    await go(page, '/sell/create'); await page.getByRole('button', { name: 'Continue in local demo', exact: true }).click();
    await page.getByLabel('Make', { exact: true }).selectOption('BMW'); await page.getByLabel('Model', { exact: true }).selectOption('X6');
    await page.getByLabel('First registration', { exact: true }).selectOption('2024'); await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByLabel('Mileage (km)', { exact: true }).fill('18500'); await page.getByLabel('Fuel', { exact: true }).selectOption('Diesel');
    await page.getByLabel('Transmission', { exact: true }).selectOption('Automatic'); await page.getByLabel('Postal code', { exact: true }).fill('85053');
    await page.getByRole('button', { name: 'Continue', exact: true }).click(); await page.getByLabel('Asking price (€)', { exact: true }).fill('55000');
    await page.getByLabel('Description', { exact: true }).fill('Local demonstration vehicle listing. No publication or seller contact.');
    await page.getByLabel('Photos', { exact: true }).setInputFiles('public/images/x6-gallery-01.webp');
    await page.getByRole('img', { name: 'Draft photo 1' }).waitFor(); await page.getByRole('button', { name: 'Save local draft', exact: true }).click();
    await page.getByRole('heading', { name: 'Draft saved' }).waitFor();
    const draft = await page.evaluate(() => JSON.parse(localStorage.getItem('mobile-reference-v1')).draft); assert.equal(draft.price, '55000'); assert.equal(draft.status, 'saved');
    await page.reload({ waitUntil: 'networkidle' }); assert.equal(await page.getByLabel('Make', { exact: true }).inputValue(), 'BMW');
    await page.getByLabel('Make', { exact: true }).selectOption('Audi'); assert.equal(await page.getByLabel('Model', { exact: true }).inputValue(), '');
  });
  await test('Theme and notification preferences persist', async page => {
    await go(page, '/settings/notifications'); await page.getByRole('button', { name: 'Deactivate in System Settings' }).click(); await page.getByLabel('Dark appearance', { exact: true }).check();
    await page.getByLabel('New offers and price changes', { exact: true }).uncheck(); await page.reload({ waitUntil: 'networkidle' }); await page.getByRole('button', { name: 'Activate in System Settings' }).click();
    assert.equal(await page.getByLabel('Dark appearance', { exact: true }).isChecked(), true); assert.equal(await page.getByLabel('New offers and price changes', { exact: true }).isChecked(), false);
    await snapshot(page, 'dark-preferences');
  });
  await test('Malformed stored state recovers instead of crashing', async (page, context) => {
    await context.addInitScript(() => localStorage.setItem('mobile-reference-v1', '{"filters":{"makes":7,"fuel":null},"parked":{},"saved":[null],"draft":7}'));
    await go(page, '/search'); await page.getByRole('button', { name: 'BMW', exact: true }).waitFor();
    await go(page, '/car-park'); await page.getByRole('heading', { name: 'Car Park (0)' }).waitFor();
  });
  await test('Every page route renders, including every vehicle and gallery', async page => {
    const routes = ['/', '/search', '/search/filters', '/results', '/my-searches', '/car-park', '/sell', '/sell/create', '/sell/direct', '/sell/valuation', '/profile', '/login', '/messages', '/notifications', '/settings/notifications', '/settings/language', '/assistant', '/compare', '/company', '/help', '/legal'];
    for (const id of ['bmw-x6', 'bmw-540', 'bmw-x3', 'bmw-120']) routes.push('/vehicle/' + id, '/vehicle/' + id + '/gallery', '/vehicle/' + id + '/message', '/dealer/' + id);
    const report = [];
    for (const route of routes) {
      const response = await go(page, route); assert.equal(response.status(), 200, route);
      const broken = await page.evaluate(() => [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc)); assert.deepEqual(broken, [], route);
      assert.equal(await page.locator('main').count(), 1, route); report.push({ route, status: response.status() });
    }
    await writeFile(output + '/routes.json', JSON.stringify(report, null, 2));
  });
  await test('Responsive primary routes have no document overflow or broken images', async page => {
    const report = [];
    for (const width of [320, 375, 427, 768, 1440]) {
      await page.setViewportSize({ width, height: 872 });
      for (const route of ['/', '/search', '/results', '/vehicle/bmw-x6', '/sell', '/profile', '/car-park', '/search/filters']) {
        await go(page, route); await page.evaluate(() => document.fonts.ready);
        const measurements = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, broken: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.currentSrc) }));
        report.push({ route, ...measurements }); assert.ok(measurements.scrollWidth <= width + 1, route + ' overflow at ' + width + ': ' + measurements.scrollWidth); assert.deepEqual(measurements.broken, []);
      }
      await go(page, '/'); await snapshot(page, 'home-' + width);
    }
    await writeFile(output + '/responsive.json', JSON.stringify(report, null, 2));
  }, { isMobile: false });
} finally { await browser.close(); }
const failed = checks.filter(c => !c.passed); console.log('INTERACTION_SUMMARY', JSON.stringify({ passed: checks.length - failed.length, failed: failed.length, total: checks.length }));
if (failed.length) process.exitCode = 1;
