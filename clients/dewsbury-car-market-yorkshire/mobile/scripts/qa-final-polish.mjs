import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
const base = process.env.QA_URL || 'http://127.0.0.1:6424';
const out = process.env.QA_OUTPUT || 'reference/web/final-polish';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const report = {
  at: new Date().toISOString(),
  base,
  routes: [],
  responsive: [],
  checks: [],
  errors: [],
  external: [],
};
async function context(seed = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 427, height: 872 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  await ctx.addInitScript(
    (value) => localStorage.setItem('mobile-reference-v1', JSON.stringify(value)),
    seed,
  );
  const page = await ctx.newPage();
  page.setDefaultTimeout(30000);
  page.on('pageerror', (error) => report.errors.push(error.message));
  page.on('request', (request) => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(base).origin)
      report.external.push(request.url());
  });
  return { ctx, page };
}
async function go(page, route) {
  const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
  assert.equal(response.status(), 200, route);
  await page.locator('[data-hydrated="true"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  return response;
}
async function dimensions(page) {
  return page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    broken: [...document.images]
      .filter((i) => i.complete && !i.naturalWidth)
      .map((i) => i.currentSrc),
  }));
}
try {
  // Enumerate route files so adding a new page cannot silently reduce coverage.
  const files = await fs.readdir('src/app', { recursive: true });
  const routes = files
    .filter((file) => path.basename(file) === 'page.tsx')
    .flatMap((file) => {
      const route = '/' + path.dirname(file).replaceAll('\\', '/').replace(/^\.$/, '');
      return route.includes('[id]')
        ? ['bmw-x6', 'bmw-540', 'bmw-x3', 'bmw-120'].map((id) => route.replace('[id]', id))
        : [route];
    })
    .sort();
  let { ctx, page } = await context();
  for (const route of routes) {
    await go(page, route);
    const d = await dimensions(page);
    assert.ok(d.scrollWidth <= d.width + 1, `${route}: overflow`);
    assert.deepEqual(d.broken, [], `${route}: broken images`);
    await page.screenshot({ path: `${out}/route-${route.replaceAll('/', '_') || 'home'}.png` });
    report.routes.push({ route, status: 200, ...d });
  }
  await ctx.close();
  ({ ctx, page } = await context());
  for (const width of [320, 375, 390, 427, 768, 1440]) {
    await page.setViewportSize({ width, height: 872 });
    for (const route of [
      '/',
      '/search',
      '/search/filters',
      '/results',
      '/vehicle/bmw-x6',
      '/vehicle/bmw-x6/gallery',
      '/dealer/bmw-x6/information',
      '/profile',
    ]) {
      await go(page, route);
      const d = await dimensions(page);
      assert.ok(d.scrollWidth <= width + 1, `${route}: overflow at ${width}`);
      assert.deepEqual(d.broken, [], `${route}: images at ${width}`);
      report.responsive.push({ route, ...d });
    }
  }
  await ctx.close();
  ({ ctx, page } = await context({ filters: { makes: ['BMW'] } }));
  await go(page, '/search/filters');
  const basic = await page.getByRole('heading', { name: 'Basic Data', exact: true }).boundingBox();
  assert.ok(Math.abs(basic.height - 49) <= 1, 'Native Basic Data heading height');
  const remove = page.getByRole('button', { name: 'Remove BMW', exact: true });
  assert.equal(await remove.locator('circle').count(), 1, 'Circled make-removal icon');
  const logo = page.getByRole('button', { name: 'BMW', exact: true }).locator('img');
  assert.equal((await logo.boundingBox()).width, 40, 'Native 40px selected-make logo');
  report.checks.push('Native advanced-filter section, make logo and circled removal');
  await go(page, '/results?makes=BMW');
  await page.getByRole('button', { name: 'Sort options', exact: true }).click();
  const sortBox = await page.getByRole('dialog').boundingBox();
  assert.ok(Math.abs(sortBox.height - 508) < 3, `Native results sort height: ${sortBox.height}`);
  assert.ok(Math.abs(sortBox.y - 179) < 3, `Native results sort top: ${sortBox.y}`);
  assert.equal(await page.getByRole('radio').count(), 9);
  report.checks.push('Nine-option results sorting matches native dialog bounds');
  await ctx.close();
  ({ ctx, page } = await context({ parked: ['bmw-x6'] }));
  await go(page, '/car-park');
  await page.getByRole('button', { name: 'Sort options', exact: true }).click();
  const parkBox = await page.getByRole('dialog').boundingBox();
  assert.ok(Math.abs(parkBox.y - 498) < 3, `Native Car Park sort top: ${parkBox.y}`);
  const radios = page.getByRole('radio');
  assert.equal(await radios.count(), 6);
  const first = await radios.nth(0).boundingBox();
  const second = await radios.nth(1).boundingBox();
  assert.ok(Math.abs(second.y - first.y - 48) < 1, '48px Car Park sort row pitch');
  report.checks.push('Six-option Car Park sort sheet geometry and radio controls');
  await ctx.close();
  ({ ctx, page } = await context());
  await go(page, '/vehicle/bmw-x6');
  await page.getByRole('button', { name: 'Show more features', exact: true }).click();
  const label = page.getByRole('dialog').getByRole('rowheader').first();
  assert.equal(await label.evaluate((el) => getComputedStyle(el).fontWeight), '500');
  assert.equal(await label.evaluate((el) => getComputedStyle(el).borderBottomWidth), '4px');
  assert.equal(await page.getByRole('dialog').getByRole('row').count(), 70);
  report.checks.push('Native feature-label weight and row spacing preserve all 70 entries');
  await page.keyboard.press('Escape');
  await go(page, '/vehicle/bmw-x6/gallery');
  const photos = page.getByRole('button', { name: /^Open vehicle image/ });
  const a = await photos.nth(0).boundingBox();
  const b = await photos.nth(1).boundingBox();
  // Capture 80 has a 12px ImageView gutter, with artwork inset another 2px.
  assert.equal(a.x, 12);
  assert.equal(b.x - a.x - a.width, 12);
  assert.equal(await photos.first().evaluate(el => getComputedStyle(el).borderLeftWidth), '2px');
  assert.equal(await photos.count(), 20);
  report.checks.push('20-image gallery preserves native 12px ImageView spacing and 2px artwork inset');
  await go(page, '/dealer/bmw-x6/information');
  assert.equal(await page.locator('section p svg, section p span[aria-hidden="true"]').count(), 26);
  for (const name of ['helmet', 'bicycle', 'umbrella', 'category', 'photo', 'arrow', 'truck']) {
    const response = await page.request.get(`${base}/icons/native-vector/${name}.svg`);
    assert.equal(response.status(), 200, name);
    assert.match(await response.text(), /<path /, name);
  }
  report.checks.push('26 dealer-service checkmarks and all added native vector assets');
  await ctx.close();
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.external, []);
  console.log(
    JSON.stringify({
      routes: report.routes.length,
      responsive: report.responsive.length,
      checks: report.checks.length,
      errors: report.errors.length,
      external: report.external.length,
    }),
  );
} catch (error) {
  report.failure = error.stack;
  throw error;
} finally {
  await browser.close();
  await fs.writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
}
