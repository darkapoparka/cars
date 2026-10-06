import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { webkit } from 'playwright';
import { launchBrowser, previewUrl } from './browser.mjs';
import { appPath, returningContext } from './locale-smoke-fixture.mjs';

export async function verifyHomeBrowse(page, locale = 'bg') {
  const form = page.locator('.dn-home-browse');
  const field = name => form.locator(`[data-field="${name}"]`);
  const menu = page.locator('.dn-home-browse-picker');
  const save = () => menu.getByRole('button', { name: locale === 'bg' ? 'Запазете' : 'Save', exact: true }).click();
  const clear = () => menu.getByRole('button', { name: locale === 'bg' ? 'Изчисти' : 'Clear', exact: true }).click();
  const choice = value => menu.getByRole('checkbox', { name: value, exact: true });
  const values = name => form.locator(`input[type=hidden][name="${name}"]`).evaluateAll(inputs => inputs.map(input => input.value));
  const open = async name => {
    await field(name).click();
    await menu.waitFor({ state: 'visible' });
    const frame = await menu.boundingBox();
    const viewport = page.viewportSize();
    assert(frame.x >= 15 && frame.y >= 15 && frame.x + frame.width <= viewport.width - 15 && frame.y + frame.height <= viewport.height - 15, 'A selector and its footer must fit inside the viewport');
  };
  const dismiss = async name => {
    await menu.getByRole('searchbox').press('Escape');
    await menu.waitFor({ state: 'hidden' });
    await page.waitForFunction(name => document.querySelector(`.dn-home-browse [data-field="${name}"]`) === document.activeElement, name);
  };

  await open('make');
  assert.equal(await menu.getByRole('searchbox').evaluate(input => input === document.activeElement), true);
  await choice('Audi').check();
  assert.deepEqual(await values('make'), [], 'A selector draft must not change Home before Save');
  await save();
  assert.deepEqual(await values('make'), ['Audi']);
  await open('make');
  await choice('BMW').check();
  await dismiss('make');
  assert.deepEqual(await values('make'), ['Audi'], 'Escape discards a pending make and restores its opener');

  await open('price');
  await menu.locator('input[name=price_max]').fill('65000');
  await open('model');
  assert.equal(await menu.getByRole('searchbox').evaluate(input => input === document.activeElement), true, 'Switching fields gives the new editor focus');
  assert.deepEqual(await values('price_max'), [], 'Switching fields discards the previous editor draft');
  assert.equal(await choice('X6 M Sport').count(), 0, 'Models follow the saved makes');
  await choice('RS 6 Avant').check();
  await save();
  assert.deepEqual(await values('model'), ['RS 6 Avant']);
  await open('make');
  await choice('Audi').uncheck();
  await choice('BMW').check();
  await save();
  assert.deepEqual(await values('model'), [], 'Removing the owning make clears incompatible models');
  await open('make');
  await clear();
  await choice('Audi').check();
  await save();
  await open('model');
  await choice('RS 6 Avant').check();
  await save();

  await open('price');
  const minimum = menu.locator('input[name=price_min]');
  const maximum = menu.locator('input[name=price_max]');
  await maximum.fill('67890');
  await maximum.press('Enter');
  await menu.waitFor({ state: 'hidden' });
  assert.deepEqual(await values('price_max'), ['67890'], 'Budget accepts exact numeric values');
  await open('price');
  await minimum.fill('90000');
  await maximum.fill('80000');
  assert.equal(await menu.getByRole('button', { name: locale === 'bg' ? 'Запазете' : 'Save', exact: true }).isEnabled(), false);
  assert.equal(await menu.getByRole('alert').count(), 1, 'An invalid range is explained before it can be saved');
  await clear();
  await maximum.fill('80000');
  await save();
  assert.deepEqual(await values('price_min'), []);
  assert.deepEqual(await values('price_max'), ['80000']);

  await form.getByRole('button', { name: locale === 'bg' ? 'Търсете' : 'Search', exact: true }).press('Enter');
  await page.waitForURL(url => appPath(url.href) === '/listing-grid');
  const params = new URL(page.url()).searchParams;
  assert.deepEqual(params.getAll('make'), ['Audi']);
  assert.deepEqual(params.getAll('model'), ['RS 6 Avant']);
  assert.equal(params.get('price_max'), '80000');
  assert.equal(params.has('price_min') || params.has('sort') || params.has('q'), false, 'Empty/default criteria stay out of the URL');
  await page.waitForLoadState('networkidle');
  const cards = page.locator('.dn-listing-results .dn-vehicle-card');
  assert.equal(await cards.count(), 1, 'Home search must produce the matching inventory result');
  assert.match(await cards.innerText(), /RS 6 Avant/);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const base = previewUrl();
  const engine = process.env.HOME_BROWSE_ENGINE || 'chromium';
  const casePattern = process.env.HOME_BROWSE_CASE ? new RegExp(process.env.HOME_BROWSE_CASE) : null;
  const output = `artifacts/home-browse-${engine}`;
  await mkdir(output, { recursive: true });
  const browser = engine === 'webkit' ? await webkit.launch({ headless: true }) : await launchBrowser();
  const results = [];
  try {
    for (const locale of ['bg', 'en']) for (const [width, height] of [[768, 900], [992, 900], [1440, 900], [1920, 900], [1280, 500]]) {
      const name = `${locale}-${height === 500 ? 'short' : width}`;
      if (casePattern && !casePattern.test(name)) continue;
      const context = await returningContext(browser, { viewport: { width, height }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const form = page.locator('.dn-home-browse');
      const geometry = await form.locator('button').evaluateAll(buttons => buttons.map(button => {
        const rect = button.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }));
      assert.equal(geometry.length, 4);
      for (const button of geometry) {
        assert(button.width >= 44 && button.height >= 44, 'Every part of the bar remains a complete click target');
        assert(Math.abs(button.y - geometry[0].y) < 1, 'Desktop fields and search remain in one row');
      }
      assert.equal(await page.locator('.dn-search__desktop-form select').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await verifyHomeBrowse(page, locale);
      assert.deepEqual(errors, []);
      results.push({ engine, locale, width, height, passed: true });
      await context.close();
      console.log(`PASS ${locale} ${width}: draft, dependent models, budget validation, keyboard, GET and result`);
    }
    await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
}
