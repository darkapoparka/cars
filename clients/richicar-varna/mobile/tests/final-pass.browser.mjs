import assert from 'node:assert/strict';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, webkit } from 'playwright';

await import('../scripts/prepare-domain-tests.mjs');
const { vehicles } = await import('../.qa/domain/catalog.mjs');
const { localeMoney } = await import('../.qa/domain/locale.mjs');
const { defaultPaymentEstimate } = await import('../.qa/domain/search.mjs');
const base = process.env.QA_URL || 'http://127.0.0.1:6474';
const output = path.resolve(process.env.QA_OUTPUT || '../../runtime/mobile-final-pass');
const engines = Object.entries({ chromium, webkit }).filter(
  ([name]) => !process.env.QA_ENGINE || name === process.env.QA_ENGINE,
);
assert.ok(engines.length, 'Unknown QA_ENGINE');
await mkdir(output, { recursive: true });
const files = await readdir(new URL('../src/app/', import.meta.url), { recursive: true });
const routes = files
  .filter((file) => path.basename(file) === 'page.tsx')
  .map((file) =>
    ('/' + path.dirname(file).replaceAll('\\', '/').replace(/^\.$/, '')).replaceAll(
      '[id]',
      vehicles[0].id,
    ),
  );
const primary = [
  '/',
  '/services',
  '/services?tab=import',
  '/services?tab=sell',
  '/services?tab=financing',
  '/services?tab=parts',
  '/contact',
  '/car-park',
  '/settings',
  '/vehicle/' + vehicles[0].id,
];
const report = {
  at: new Date().toISOString(),
  base,
  renders: [],
  checks: [],
  errors: [],
  submissions: [],
};

for (const [name, engine] of engines) {
  const browser = await engine.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  let page;
  const closing = new WeakSet();
  async function go(route, width = 390, locale = 'en') {
    if (page) {
      closing.add(page);
      await page.close();
    }
    page = await context.newPage();
    const current = page;
    await page.setViewportSize({ width, height: width >= 1024 ? 900 : 844 });
    page.setDefaultTimeout(15000);
    page.on('pageerror', (error) => {
      if (!closing.has(current))
        report.errors.push({ engine: name, route, message: error.message });
    });
    page.on('request', (request) => {
      if (
        new URL(request.url()).origin === new URL(base).origin &&
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method())
      )
        report.submissions.push({ engine: name, route, method: request.method() });
    });
    const response = await page.goto(
      base + route + (route.includes('?') ? '&' : '?') + 'lang=' + locale,
      { waitUntil: 'load', timeout: 60000 },
    );
    assert.equal(response.status(), 200, name + ' ' + route);
    await page.locator('[data-hydrated="true"]').waitFor();
    await page.waitForFunction((lang) => document.documentElement.lang === lang, locale);
    await page.evaluate(() => document.fonts.ready);
  }
  async function geometry(route, width, locale) {
    await page.waitForFunction(() =>
      [...document.images]
        .filter((image) => {
          const box = image.getBoundingClientRect();
          return box.width && box.height && box.bottom > 0 && box.top < innerHeight;
        })
        .every((image) => image.complete),
    );
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      broken: [...document.images]
        .filter((image) => image.complete && !image.naturalWidth)
        .map((image) => image.getAttribute('src')),
      headings: [...document.querySelectorAll('h1')]
        .filter((heading) => heading.getClientRects().length)
        .map((heading) => heading.innerText),
    }));
    assert.ok(
      metrics.scrollWidth <= metrics.width + 1,
      name + ' ' + route + ' overflow ' + JSON.stringify(metrics),
    );
    assert.deepEqual(metrics.broken, [], name + ' ' + route + ' broken images');
    assert.equal(metrics.headings.length, 1, name + ' ' + route + ' needs one page heading');
    report.renders.push({ engine: name, route, width, locale, ...metrics });
    if (report.renders.length % 24 === 0)
      console.log(JSON.stringify({ engine: name, renders: report.renders.length }));
  }
  try {
    for (const locale of ['bg', 'en']) {
      for (const width of [320, 390, 1440]) {
        for (const route of primary) {
          await go(route, width, locale);
          await geometry(route, width, locale);
        }
      }
    }
    // Preserve the donor routes and check their actual documents as well as the showroom entries.
    if (name === 'chromium') {
      for (const route of routes.filter((route) => !primary.includes(route))) {
        await go(route);
        await geometry(route, 390, 'en');
      }
    }
    const detail = '/vehicle/' + vehicles[0].id;
    for (const width of [320, 390, 1024, 1440]) {
      await go(detail, width);
      const summary = page.locator(
        width < 700 ? '[data-vehicle-mobile-summary]' : '[data-vehicle-desktop-summary]',
      );
      if (width < 700) {
        assert.equal(
          await summary.locator('h1').innerText(),
          vehicles[0].make + ' ' + vehicles[0].model,
        );
        const targets = await summary
          .locator('a, button')
          .evaluateAll((elements) =>
            elements.map((element) => element.getBoundingClientRect().height),
          );
        assert.ok(
          targets.every((height) => height >= 44),
          'Phone summary controls retain 44px targets',
        );
        const headerState = () =>
          page.locator('[data-vehicle-mobile-header]').getAttribute('data-vehicle-mobile-header');
        assert.equal(await headerState(), 'image', 'Phone header starts over the gallery');
        await page
          .locator('[data-vehicle-hero]')
          .evaluate((element) =>
            window.scrollTo(0, window.scrollY + element.getBoundingClientRect().bottom + 160),
          );
        await page.waitForFunction(
          () =>
            document
              .querySelector('[data-vehicle-mobile-header]')
              ?.getAttribute('data-vehicle-mobile-header') === 'compact',
        );
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForFunction(
          () =>
            document
              .querySelector('[data-vehicle-mobile-header]')
              ?.getAttribute('data-vehicle-mobile-header') === 'image',
        );
      }
      for (const section of ['Features', 'Photos', 'Details']) {
        await page.getByRole('tab', { name: section, exact: true }).click();
        await page.getByRole('tabpanel', { name: section, exact: true }).waitFor();
        await geometry(detail + '#' + section.toLowerCase(), width, 'en');
      }
      const specifications = page.getByRole('button', {
        name: 'Show more technical data',
        exact: true,
      });
      await specifications.click();
      const dialog = page.getByRole('dialog', { name: 'Technical data', exact: true });
      await dialog.waitFor();
      assert.ok((await dialog.locator('tbody tr').count()) >= 6);
      const sheet = await dialog.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return {
          width: box.width,
          left: box.left,
          right: box.right,
          overflow: element.scrollWidth > element.clientWidth + 1,
        };
      });
      assert.ok(sheet.left >= -1 && sheet.right <= width + 1 && !sheet.overflow);
      if (width < 700) assert.ok(sheet.width >= width - 24, 'Technical sheet uses the phone width');
      await dialog.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.ok(await specifications.evaluate((element) => document.activeElement === element));
      const financing = page
        .locator(width < 700 ? '[data-mobile-monthly-payment]' : '[data-vehicle-desktop-summary]')
        .getByRole('button', { name: 'Calculate Financing', exact: true });
      const financeEntry = width < 700 ? page.locator('[data-mobile-monthly-payment]') : financing;
      assert.ok(
        (await financeEntry.innerText()).includes(
          localeMoney(defaultPaymentEstimate(vehicles[0].price), 'en'),
        ),
      );
      await financeEntry.click();
      const calculator = page.getByRole('dialog', { name: 'Calculate Financing', exact: true });
      await calculator.waitFor();
      assert.ok(
        (await calculator.innerText()).includes(
          localeMoney(defaultPaymentEstimate(vehicles[0].price), 'en'),
        ),
      );
      await calculator.press('Escape');
      await calculator.waitFor({ state: 'hidden' });
      report.checks.push({
        engine: name,
        check:
          'Detail sections, complete specifications, Escape/focus and matching finance estimate',
        width,
      });
    }
    const fictional = vehicles.find((vehicle) => vehicle.id.includes('mercedes-amg-gt'));
    await go('/vehicle/' + fictional.id, 320);
    const summary = page.locator('[data-vehicle-mobile-summary]');
    assert.equal(await summary.getByRole('button', { name: 'Price rating details' }).count(), 0);
    assert.ok(!(await summary.innerText()).includes('Net'));
    assert.equal(await summary.locator('h1').innerText(), fictional.make + ' ' + fictional.model);
    assert.ok(
      await summary
        .locator('h1')
        .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
    );
    assert.equal(
      await page.getByText('Owners', { exact: true }).filter({ visible: true }).count(),
      0,
    );
    report.checks.push({
      engine: name,
      check: 'Long title and absent unverified tax, appraisal and owners at 320px',
    });
    await go('/');
    const count = await page.locator('[data-showroom-vehicle]').count();
    await page.getByRole('button', { name: 'Search make or model', exact: true }).click();
    const search = page.getByRole('searchbox', { name: 'Search make or model', exact: true });
    await search.fill('RS6');
    const filters = page.getByRole('dialog');
    await filters.getByRole('button', { name: /^Show \d+ / }).click();
    await filters.waitFor({ state: 'hidden' });
    assert.ok((await page.locator('[data-showroom-vehicle]').count()) < count);
    assert.ok((await page.locator('[data-showroom-vehicle]').count()) > 0);
    assert.ok(
      (await page.locator('[data-showroom-vehicle]').allTextContents()).every((text) =>
        text.includes('RS6'),
      ),
    );
    await page.reload({ waitUntil: 'load' });
    await page.locator('[data-hydrated="true"]').waitFor();
    assert.ok((await page.locator('[data-showroom-vehicle]').count()) > 0);
    assert.ok(
      (await page.locator('[data-showroom-vehicle]').allTextContents()).every((text) =>
        text.includes('RS6'),
      ),
    );
    report.checks.push({
      engine: name,
      check: 'Search applies actual inventory criteria and survives reload',
    });
  } finally {
    await context.close();
    await browser.close();
    await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  }
}
assert.deepEqual(report.errors, [], 'Runtime errors');
assert.deepEqual(report.submissions, [], 'No application submissions during demo browsing');
console.log(
  JSON.stringify({
    renders: report.renders.length,
    checks: report.checks.length,
    errors: report.errors.length,
  }),
);
