import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { launchBrowser, previewUrl, isolateMapProvider } from './browser.mjs';

const base = previewUrl();
const engine = process.env.PLAYWRIGHT_ENGINE || 'chromium';
const out = `artifacts/mobile-quality-${engine}`;
const axePath = process.env.AXE_PATH || path.resolve('node_modules/axe-core/axe.min.js');
await mkdir(out, { recursive: true });
const browser = await launchBrowser();
const results = [];
const save = () => writeFile(`${out}/report.json`, JSON.stringify({ mapProvider: 'fixture; live rendering checked separately', generatedAt: new Date().toISOString(), base, results }, null, 2));
async function check(name, run) {
  try { results.push({ name, passed: true, evidence: await run() }); console.log(`PASS ${name}`); }
  catch (error) { results.push({ name, passed: false, error: error.stack }); console.error(`FAIL ${name}: ${error.message}`); }
  await save();
}
async function audit(page, name, modal) {
  if (modal) assert(await page.locator(modal).evaluate(node => node.matches(':modal')), 'The intended dialog must actually be open');
  await page.evaluate(await readFile(axePath, 'utf8'));
  const result = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] }, iframes: false }));
  await writeFile(`${out}/${name}.json`, JSON.stringify({ violations: result.violations, incomplete: result.incomplete }, null, 2));
  await page.screenshot({ path: `${out}/${name}.png` });
  assert.equal(result.violations.length, 0, result.violations.map(item => `${item.id}: ${item.nodes.map(node => node.target).join(', ')}`).join('; '));
  return { violations: result.violations.length, manualReviewRules: result.incomplete.length };
}

try {
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const routes = [...new Set(['/', '/listing-grid', '/contact', '/contact?topic=trade-in', '/contact?topic=import', '/contact?topic=leasing&vehicle=4', '/contact?topic=inspection&vehicle=1', ...[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname)])];
  for (const route of routes) {
    await check(`a11y ${route}`, async () => {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
      await isolateMapProvider(page);
      try {
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        return await audit(page, `route-${route.replace(/[^a-z0-9]/gi, '_')}`);
      } finally { await page.close(); }
    });
  }
  for (const width of [320, 390, 430]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    await isolateMapProvider(page);
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(30000);
    await check(`menu and focus ${width}`, async () => {
      await page.goto(base, { waitUntil: 'networkidle' });
      const trigger = page.getByRole('button', { name: 'Меню', exact: true });
      await trigger.click();
      await page.locator('#dn-mobile-menu[open]').waitFor();
      const result = await audit(page, `menu-${width}`, '#dn-mobile-menu');
      await page.keyboard.press('Escape');
      assert(await trigger.evaluate(node => document.activeElement === node));
      return result;
    });
    await check(`home search scroll lock ${width}`, async () => {
      await page.goto(base, { waitUntil: 'networkidle' });
      const trigger = page.locator('.dn-quick-search__trigger');
      await trigger.click();
      const modal = page.locator('#dn-quick-search-dialog');
      await page.locator('#dn-quick-search-dialog[open]').waitFor();
      const before = await page.evaluate(() => ({ top: document.body.style.top, y: scrollY }));
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(100);
      const after = await page.evaluate(() => ({ top: document.body.style.top, y: scrollY }));
      assert.deepEqual(after, before);
      const result = await audit(page, `home-search-${width}`, '#dn-quick-search-dialog');
      await page.keyboard.press('Escape');
      assert.equal(await modal.getAttribute('open'), null);
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).position), 'static');
      assert(await trigger.evaluate(node => document.activeElement === node));
      return { ...result, backgroundBefore: before, backgroundAfter: after };
    });
    await check(`nested filters ${width}`, async () => {
      await page.goto(`${base}/listing-grid?price_min=60000&price_min_exclusive=1&sort=price-asc`, { waitUntil: 'networkidle' });
      await page.locator('.dn-listing-filter__toggle').click();
      await page.locator('#dn-listing-filter-dialog[open]').waitFor();
      await audit(page, `filters-${width}`, '#dn-listing-filter-dialog');
      await page.locator('.dn-mobile-filter-fields button').filter({ has: page.getByText('Марка', { exact: true }) }).click();
      await page.locator('#dn-dialog-choice[open]').waitFor();
      const result = await audit(page, `nested-${width}`, '#dn-dialog-choice');
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).position), 'fixed');
      assert(await page.locator('#dn-listing-filter-dialog').evaluate(node => node.matches(':modal')));
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => getComputedStyle(document.body).position === 'static');
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).position), 'static');
      return result;
    });
    await check(`sell validation and review ${width}`, async () => {
      await page.goto(`${base}/contact?topic=trade-in`, { waitUntil: 'networkidle' });
      await page.locator('.dn-tradein-start').click();
      const modal = page.locator('.dn-tradein-dialog');
      await page.locator('.dn-tradein-dialog[open]').waitFor();
      await modal.locator('input[name=make]').fill('   ');
      await modal.locator('input[name=model]').fill('   ');
      await modal.getByRole('button', { name: 'Към снимките', exact: true }).click();
      assert(await modal.locator('input[name=make]').isVisible());
      assert.equal(await modal.locator('input[name=make]').getAttribute('aria-invalid'), 'true');
      await modal.locator('input[name=make]').fill(' Audi ');
      await modal.locator('input[name=model]').fill(' A6 ');
      await modal.locator('input[name=year]').fill('2099');
      await modal.getByRole('button', { name: 'Към снимките', exact: true }).click();
      assert.equal(await modal.locator('input[name=year]').getAttribute('aria-invalid'), 'true');
      await audit(page, `sell-error-${width}`, '.dn-tradein-dialog');
      await modal.locator('input[name=year]').fill('2020');
      await modal.locator('input[name=mileage]').fill('85000');
      await modal.getByRole('button', { name: 'Към снимките', exact: true }).click();
      await audit(page, `sell-details-${width}`, '.dn-tradein-dialog');
      await modal.getByRole('button', { name: 'Прегледай заявката', exact: true }).click();
      assert.match(await modal.locator('.dn-tradein-review-card').innerText(), /Audi A6/);
      const result = await audit(page, `sell-review-${width}`, '.dn-tradein-dialog');
      await page.keyboard.press('Escape');
      return result;
    });
    await check(`finance handoff ${width}`, async () => {
      await page.goto(`${base}/listing-detail-v1/1`, { waitUntil: 'networkidle' });
      await page.locator('.dn-detail-finance-trigger').click();
      await page.locator('.dn-detail-finance-dialog[open]').waitFor();
      const result = await audit(page, `finance-${width}`, '.dn-detail-finance-dialog');
      const finance = page.locator('.dn-finance-calculator:visible');
      await finance.locator('input').fill('10000');
      await finance.locator('select').selectOption('24');
      await finance.locator('a').click();
      await page.waitForURL(url => url.pathname === '/contact');
      assert.equal(new URL(page.url()).searchParams.get('down_payment'), '10000');
      assert.equal(new URL(page.url()).searchParams.get('term'), '24');
      assert.equal(new URL(await page.locator('.dn-contact-vehicle').getAttribute('href'), base).searchParams.get('term'), '24');
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).position), 'static');
      return result;
    });
    await page.close();
  }
  for (const dpr of [1, 2]) {
    await check(`cold mobile images DPR ${dpr}`, async () => {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: dpr });
      const page = await context.newPage();
      await isolateMapProvider(page);
      const assets = [];
      page.on('response', response => { if (response.request().resourceType() === 'image' && response.url().startsWith(base)) assets.push(response); });
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const initial = await Promise.all(assets.map(async response => ({ path: new URL(response.url()).pathname, bytes: (await response.body()).byteLength })));
      for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 600) {
        await page.evaluate(y => scrollTo(0, y), y);
        await page.waitForTimeout(40);
      }
      await page.waitForLoadState('networkidle');
      const full = await Promise.all(assets.map(async response => ({ path: new URL(response.url()).pathname, bytes: (await response.body()).byteLength })));
      const initialBytes = initial.reduce((sum, item) => sum + item.bytes, 0);
      const fullBytes = full.reduce((sum, item) => sum + item.bytes, 0);
      assert(initialBytes < 1500000, `Initial image payload ${initialBytes} exceeds the 1.5 MB budget`);
      assert(!initial.some(item => /service-.*\.png|menu-.*\.png/.test(item.path)), 'Original service PNGs must not load on mobile');
      await context.close();
      return { initialBytes, fullBytes, initial, full };
    });
  }
} finally {
  await browser.close();
  await save();
}
if (results.some(result => !result.passed)) process.exitCode = 1;
