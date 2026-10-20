import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base = process.env.QA_URL || 'http://127.0.0.1:6426';
const out = process.env.QA_OUTPUT || 'reference/web/overlay-interactions';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const report = [];
const state = (p) =>
  p.evaluate(() => JSON.parse(localStorage.getItem('mobile-reference-v1') || '{}'));
async function go(p, route) {
  await p.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
  await p.locator('[data-hydrated="true"]').waitFor();
}
async function until(fn) {
  for (let i = 0; i < 60; i++) {
    if (await fn()) return;
    await new Promise((r) => setTimeout(r, 50));
  }
  assert(await fn(), 'Expected state did not settle');
}
async function scenario(name, run, width = 427, height = 872) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const p = await ctx.newPage();
  p.setDefaultTimeout(15000);
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  try {
    await run(p);
    assert.deepEqual(errors, []);
    report.push({ name, pass: true });
    console.log('PASS', name);
  } catch (e) {
    report.push({ name, pass: false, error: e.message, errors });
    console.log('FAIL', name, e.message);
    await p.screenshot({ path: out + '/failure-' + report.length + '.png' }).catch(() => {});
  } finally {
    await ctx.close();
    await fs.writeFile(
      out + '/report.json',
      JSON.stringify({ base, at: new Date().toISOString(), report }, null, 2),
    );
  }
}
try {
  await scenario(
    'Long lists keep title and actions fixed; Cancel discards and OK commits',
    async (p) => {
      await go(p, '/search/filters');
      await p.getByRole('button', { name: 'Show all filters', exact: true }).click();
      const opener = p.locator('[data-filter-id="color"]');
      await opener.click();
      const d = p.getByRole('dialog');
      const title = d.getByRole('heading');
      const actions = d.getByRole('button', { name: 'OK', exact: true });
      const before = { title: await title.boundingBox(), actions: await actions.boundingBox() };
      await d.getByRole('checkbox', { name: 'white', exact: true }).check();
      const after = { title: await title.boundingBox(), actions: await actions.boundingBox() };
      assert.equal(after.title.y, before.title.y);
      assert.equal(after.actions.y, before.actions.y);
      await d.getByRole('button', { name: 'Cancel', exact: true }).click();
      assert.equal((await state(p)).filters?.color?.length || 0, 0);
      assert(await opener.evaluate((el) => el === document.activeElement), 'Focus not restored');
      await opener.click();
      await d.getByRole('checkbox', { name: 'white', exact: true }).check();
      await actions.click();
      assert.deepEqual((await state(p)).filters.color, ['white']);
      await opener.click();
      assert(await d.getByRole('checkbox', { name: 'white', exact: true }).isChecked());
      await p.keyboard.press('Escape');
    },
    320,
    568,
  );
  await scenario(
    'Number wheels support keyboard, scrolling, direct input and cancellation',
    async (p) => {
      await go(p, '/search/filters');
      await p.locator('[data-filter-id="price"]').click();
      const d = p.getByRole('dialog', { name: 'Price', exact: true });
      const from = d.getByLabel('Price from', { exact: true });
      const wheel = d.getByRole('listbox', { name: 'Price from picker' });
      await wheel.focus();
      await p.keyboard.press('ArrowDown');
      await until(async () => (await from.inputValue()) === '500');
      await p.waitForTimeout(400);
      assert.equal(await from.inputValue(), '500');
      await wheel.evaluate((el) => {
        el.scrollTop = 180;
      });
      await until(async () => (await from.inputValue()) === '1500');
      await from.fill('12750');
      await p.waitForTimeout(400);
      assert.equal(await from.inputValue(), '12750');
      await d.getByLabel('Price to', { exact: true }).fill('30000');
      await d.getByRole('button', { name: 'OK', exact: true }).click();
      const filters = (await state(p)).filters;
      assert.equal(filters.minPrice, '12750');
      assert.equal(filters.maxPrice, '30000');
      await p.locator('[data-filter-id="price"]').click();
      assert.equal(await from.inputValue(), '12750');
      await from.fill('15000');
      await p.keyboard.press('Escape');
      assert.equal((await state(p)).filters.minPrice, '12750');
    },
  );
  await scenario(
    'Main search range tracks accept taps and drags without scrolling the page',
    async (p) => {
      await go(p, '/search');
      await p.getByRole('button', { name: /^Condition/ }).click();
      const rail = p.locator('[data-range-track="First Registration"]');
      const r = await rail.boundingBox();
      const before = await p.evaluate(() => window.scrollY);
      await p.mouse.click(r.x + r.width * 0.25, r.y + 28);
      await until(async () => Number((await state(p)).filters.minYear) > 1980);
      const first = Number((await state(p)).filters.minYear);
      assert(first < 2010);
      await p.mouse.move(r.x + r.width * 0.7, r.y + 28);
      await p.mouse.down();
      await p.mouse.move(r.x + r.width * 0.9, r.y + 28, { steps: 8 });
      await p.mouse.up();
      const f = (await state(p)).filters;
      assert(Number(f.maxYear) >= 2015);
      assert(Number(f.maxYear) <= 2026);
      assert.equal(await p.evaluate(() => window.scrollY), before);
      await p.getByLabel('First Registration minimum slider', { exact: true }).focus();
      await p.keyboard.press('ArrowRight');
      await until(async () => Number((await state(p)).filters.minYear) > first);
    },
  );
  await scenario(
    'Make exclusion survives make navigation and discards cancelled changes',
    async (p) => {
      await go(p, '/search');
      await p.getByRole('button', { name: 'All Makes', exact: true }).click();
      const d = p.getByRole('dialog');
      const exclude = d.getByRole('switch', { name: 'Exclude make' });
      await exclude.click();
      await d.getByLabel('Search makes', { exact: true }).fill('Audi');
      await d.getByRole('button', { name: 'Audi', exact: true }).click();
      assert.equal(await exclude.getAttribute('aria-checked'), 'true');
      await d.getByRole('button', { name: 'OK', exact: true }).click();
      assert.deepEqual((await state(p)).filters.excludedMakes, ['Audi']);
      await p.getByRole('button', { name: 'Excluded Audi Any', exact: true }).click();
      assert.equal(await exclude.getAttribute('aria-checked'), 'true');
      await d.getByRole('button', { name: 'Cancel', exact: true }).click();
      await p.getByRole('button', { name: '+ Select Make / Model', exact: true }).click();
      await d.getByLabel('Search makes', { exact: true }).fill('BMW');
      await d.getByRole('button', { name: 'BMW', exact: true }).click();
      await d.getByLabel('Search models', { exact: true }).fill('X6');
      await d.getByRole('checkbox', { name: 'X6', exact: true }).check();
      await d.getByRole('button', { name: 'Cancel', exact: true }).click();
      assert.deepEqual((await state(p)).filters.makes, []);
      assert.deepEqual((await state(p)).filters.excludedMakes, ['Audi']);
    },
    320,
    568,
  );
  await scenario(
    'Single choice applies immediately and range units retain real values',
    async (p) => {
      await go(p, '/search/filters');
      await p.locator('[data-filter-id="condition"]').click();
      await p.getByRole('dialog').getByRole('radio', { name: 'Used', exact: true }).click();
      await p.locator('dialog[open]').waitFor({ state: 'hidden' });
      assert.deepEqual((await state(p)).filters.condition, ['Used']);
      await p.locator('[data-filter-id="power"]').click();
      const d = p.getByRole('dialog', { name: 'Power', exact: true });
      await d.getByRole('radio', { name: 'kW', exact: true }).check();
      await d.getByLabel('Power from', { exact: true }).fill('100');
      await d.getByRole('button', { name: 'OK', exact: true }).click();
      assert.equal((await state(p)).filters.minPower, '136');
    },
  );
} finally {
  await browser.close();
}
console.log('OVERLAY_INTERACTIONS', report.filter((r) => r.pass).length + '/' + report.length);
if (report.some((r) => !r.pass)) process.exitCode = 1;
