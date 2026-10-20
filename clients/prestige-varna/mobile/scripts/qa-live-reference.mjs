import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { vehicles } from '../.qa/domain/catalog.mjs';
const base = process.env.QA_URL || 'http://127.0.0.1:6425';
const out = process.env.QA_OUTPUT || 'reference/web/live-final-20260928/content';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const context = await browser.newContext({
  viewport: { width: 427, height: 872 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
page.setDefaultTimeout(20000);
const report = { at: new Date().toISOString(), base, checks: [], errors: [], external: [] };
page.on('pageerror', (e) => report.errors.push(e.message));
page.on('request', (r) => {
  if (/^https?:/.test(r.url()) && new URL(r.url()).origin !== new URL(base).origin)
    report.external.push(r.url());
});
const go = async (r) => {
  const response = await page.goto(base + r, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  await page.locator('[data-hydrated="true"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
};
const test = async (name, fn) => {
  try {
    await fn();
    report.checks.push({ name, passed: true });
    console.log('PASS', name);
  } catch (e) {
    report.checks.push({ name, passed: false, error: e.message });
    await page.screenshot({ path: out + '/failure-' + report.checks.length + '.png' });
    console.log('FAIL', name, e.message);
  }
};
try {
  await test('72 actual gallery images decode across all four captured listings', async () => {
    for (const v of vehicles) {
      await go('/vehicle/' + v.id + '/gallery');
      assert.equal(
        await page.getByRole('button', { name: /^Open vehicle image/ }).count(),
        v.images.length,
      );
      const failed = await page.evaluate(async (sources) => {
        let failed = [];
        for (const src of sources) {
          let image = new Image();
          image.src = src;
          try {
            await image.decode();
          } catch {
            failed.push(src);
          }
        }
        return failed;
      }, v.images);
      assert.deepEqual(failed, []);
      await page.screenshot({ path: out + '/' + v.id + '-gallery.png' });
    }
    assert.equal(
      vehicles.reduce((n, v) => n + v.images.length, 0),
      72,
    );
  });
  await test('Last photo survives gallery close and return to its detail hero', async () => {
    await go('/vehicle/bmw-540/gallery');
    await page.getByRole('button', { name: 'Open vehicle image 32', exact: true }).click();
    assert.equal(await page.getByRole('dialog').getByRole('status').count(), 1);
    await page.keyboard.press('Escape');
    await page.getByRole('link', { name: 'Go back', exact: true }).click();
    await page.waitForURL('**/vehicle/bmw-540');
    assert.ok((await page.locator('main').innerText()).includes('32 / 32'));
  });
  await test('540 detail has captured delivery wording, monthly financing and real technical data', async () => {
    await go('/vehicle/bmw-540');
    assert.ok((await page.locator('main').innerText()).includes('may include delivery costs'));
    assert.ok((await page.locator('main').innerText()).includes('€448'));
    await page.getByRole('button', { name: 'Show more technical data', exact: true }).click();
    const d = page.getByRole('dialog');
    assert.ok((await d.innerText()).includes('11/2024'));
    assert.ok((await d.innerText()).includes('5503-26'));
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Show more features', exact: true }).click();
    assert.equal(await page.getByRole('dialog').getByRole('row').count(), 70);
    await page.keyboard.press('Escape');
  });
  await test('Buying and leasing use distinct captured amounts and preserve the selected route', async () => {
    await go('/results?makes=BMW&models=120&payment=lease');
    await page.getByRole('link', { name: 'View BMW 120', exact: true }).click();
    await page.waitForURL('**/vehicle/bmw-120');
    assert.equal(
      await page.getByRole('tab', { name: 'Leasing', exact: true }).getAttribute('aria-selected'),
      'true',
    );
    assert.ok((await page.locator('main').innerText()).includes('€199.00'));
    await page.screenshot({ path: out + '/120-lease.png' });
    await page.getByRole('tab', { name: 'Buying', exact: true }).click();
    assert.ok((await page.locator('main').innerText()).includes('€27,777'));
    assert.ok((await page.locator('main').innerText()).includes('€295'));
    await page.getByRole('tab', { name: 'Leasing', exact: true }).click();
    await page.getByRole('button', { name: 'Calculate lease rate', exact: true }).click();
    assert.ok((await page.getByRole('dialog').innerText()).includes('24 months'));
    await page.keyboard.press('Escape');
  });
  await test('Native CO2 classification graphics retain full-width table layout', async () => {
    for (const id of ['bmw-x3', 'bmw-120']) {
      await go('/vehicle/' + id);
      await page.getByRole('button', { name: 'Show more technical data', exact: true }).click();
      const figure = page
        .getByRole('dialog')
        .getByRole('img', { name: /captured emissions classification/ });
      await figure.scrollIntoViewIfNeeded();
      const box = await figure.boundingBox();
      assert.ok(box.width > 290 && box.width < 350);
      await page.screenshot({ path: out + '/' + id + '-co2.png' });
      await page.keyboard.press('Escape');
    }
  });
  await test('Home discovery remains independent of search payment and exposes all captured categories', async () => {
    await go('/results?payment=lease');
    await go('/');
    const top = page.getByLabel('Top deals', { exact: true });
    assert.ok((await top.innerText()).includes('BMW 540'));
    assert.ok(!(await top.innerText()).includes('199'));
    assert.equal(
      await page.getByLabel('Vehicle types', { exact: true }).getByRole('link').count(),
      7,
    );
    assert.equal(
      await page.getByLabel('Popular categories', { exact: true }).getByRole('link').count(),
      5,
    );
    await page.getByRole('link', { name: /^Commuter/ }).click();
    await page.waitForURL('**/results?**');
    const url = new URL(page.url());
    assert.equal(url.searchParams.get('minYear'), '2019');
    assert.equal(url.searchParams.get('maxPrice'), '25000');
    assert.match(url.searchParams.get('body'), /Estate/);
  });
  await test('Captured dealer identities replace generic placeholders', async () => {
    for (const [id, name] of [
      ['bmw-540', 'WELLER Performance GmbH & Co. KG'],
      ['bmw-x3', 'Hakvoort GmbH'],
      ['bmw-120', 'May & Olde GmbH'],
    ]) {
      await go('/vehicle/' + id);
      assert.ok((await page.getByLabel('Dealer contact information').innerText()).includes(name));
      assert.equal(
        await page
          .getByLabel('About this dealer')
          .getByRole('button', { name: 'View dealer ratings' })
          .count(),
        1,
      );
    }
  });
  await test('New lease details remain usable at narrow mobile widths', async () => {
    for (const width of [320, 375, 427]) {
      await page.setViewportSize({ width, height: 740 });
      await go('/vehicle/bmw-120');
      await page.getByRole('tab', { name: 'Leasing', exact: true }).click();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.getByRole('button', { name: 'Calculate lease rate', exact: true }).click();
      assert.ok(await page.getByRole('dialog').isVisible());
      await page.keyboard.press('Escape');
    }
  });
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.external, []);
} finally {
  await fs.writeFile(out + '/report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
if (report.checks.some((c) => !c.passed) || report.errors.length || report.external.length)
  process.exitCode = 1;
