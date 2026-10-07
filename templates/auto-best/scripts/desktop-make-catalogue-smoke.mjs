import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';

const base = previewUrl();
const output = process.env.FILTER_EVIDENCE_DIR || 'artifacts/desktop-make-catalogue';
const casePattern = process.env.FILTER_CASE ? new RegExp(process.env.FILTER_CASE) : undefined;
await mkdir(output, { recursive: true });
const browser = await launchBrowser();
const results = [];
try {
  for (const locale of ['bg', 'en']) for (const surface of ['home', 'listing']) for (const [width, height] of [[992, 600], [1440, 900]]) {
    const name = `${locale}-${surface}-${width}`;
    if (casePattern && !casePattern.test(name)) continue;
    const page = await browser.newPage({ viewport: { width, height }, locale, reducedMotion: 'reduce' });
    await page.context().addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const home = surface === 'home';
    await page.goto(`${base}/${locale}${home ? '' : '/listing-grid'}`, { waitUntil: 'networkidle' });
    const opener = page.locator(home ? '.dn-home-browse [data-field=make]' : '[data-facet=make]');
    const menu = page.locator(home ? '.dn-home-browse-picker[data-state=open]' : '#dn-listing-filter-dialog');
    const scroller = () => menu.locator(home ? '.content' : '.dn-search-results');
    const footer = () => menu.locator(home ? '.dn-home-browse-picker__footer' : '.dn-search-footer');
    const close = () => menu.locator('.dn-picker-close').click();
    const search = () => menu.getByRole('searchbox');
    const apply = () => menu.locator(home ? '.dn-home-browse-picker__save' : 'button[type=submit]').click();
    const choice = make => menu.getByRole('checkbox', { name: make, exact: true });
    const countText = count => `${count} ${locale === 'bg' ? count === 1 ? 'автомобил' : 'автомобила' : count === 1 ? 'car' : 'cars'}`;
    const stock = async (make, count) => {
      const description = await choice(make).getAttribute('aria-describedby');
      assert(description, 'A stock count is exposed as an accessible description');
      assert.equal(await menu.locator(`[id="${description}"]`).innerText(), countText(count));
    };
    const open = async () => { await opener.click(); await menu.waitFor({ state: 'visible' }); };
    try {
      await open();
      assert.equal(await menu.getByRole('checkbox').count(), 180, 'All makes plus the 179-brand catalogue');
      const options = await menu.locator('input[type=checkbox]').evaluateAll(inputs => inputs.map(input => input.value));
      assert.deepEqual(options.slice(0, 4), ['', 'Audi', 'BMW', 'Mercedes-Benz'], 'In-stock makes lead the catalogue');
      assert.deepEqual(options.slice(4, 10), ['Ford', 'Opel', 'Porsche', 'Skoda', 'Toyota', 'Volkswagen'], 'Familiar brands follow stock');
      const allLabel = locale === 'bg' ? 'Всички марки' : 'All makes';
      await stock(allLabel, 7);
      await stock('Audi', 2); await stock('BMW', 2); await stock('Mercedes-Benz', 3);
      await stock('Volkswagen', 0); await stock('Toyota', 0);
      await page.waitForFunction(selector => [...document.querySelectorAll(`${selector} .dn-make-logo img`)].every(image => image.complete && image.naturalWidth > 0), home ? '.dn-home-browse-picker[data-state=open]' : '#dn-listing-filter-dialog');
      const before = await footer().boundingBox();
      const frame = await menu.boundingBox();
      assert.equal(frame.width, 840);
      assert(frame.x >= 15 && frame.y >= 15 && frame.x + frame.width <= width - 15 && frame.y + frame.height <= height - 15, 'Large catalogues fit short viewports');
      const scroll = await scroller().evaluate(element => ({ client: element.clientHeight, full: element.scrollHeight }));
      assert(scroll.full > scroll.client, 'Only the catalogue body scrolls');

      // Traverse the actual checkbox tab sequence, including off-screen brands.
      await choice(allLabel).press('Tab');
      for (let index = 1; index < options.length - 1; index++) await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.value), options.at(-1));
      assert(await scroller().evaluate(element => element.scrollTop) > 0, 'Keyboard focus scrolls the catalogue');
      const after = await footer().boundingBox();
      assert(Math.abs(before.y - after.y) < 1 && Math.abs(before.height - after.height) < 1, 'The action footer remains stationary');
      await page.keyboard.press('Escape');
      await menu.waitFor({ state: 'hidden' });
      assert(await opener.evaluate(element => element === document.activeElement), 'Escape returns to the Make opener');

      await open();
      await search().fill('citroen');
      assert.equal(await menu.getByRole('checkbox').count(), 1, 'Accent-insensitive catalogue search');
      assert.equal(await choice('Citroën').count(), 1);
      await search().fill('volkswagen');
      assert.equal(await menu.getByRole('checkbox').count(), 1);
      const vw = choice('Volkswagen').locator('..');
      assert.match(await vw.locator('img').getAttribute('src'), /volkswagen-badge-cardog\.svg$/, 'Volkswagen uses its existing reviewed logo');
      const one = await vw.boundingBox();
      assert(one.width <= frame.width / 6, 'Search does not stretch a single result across the menu');
      await choice('Volkswagen').press('Space');
      await close();
      await open();
      assert.equal(await choice('Volkswagen').isChecked(), false, 'Closing discards catalogue drafts');
      await search().fill('toyota');
      await choice('Toyota').check();
      await stock('Toyota', 0);
      assert.match(await footer().innerText(), /0 (cars|автомобила)/, 'A zero-stock choice has an honest pending result count');
      await page.screenshot({ path: `${output}/${name}-zero-stock.png` });
      await apply();
      if (home) {
        assert.deepEqual(await page.locator('.dn-home-browse input[type=hidden][name=make]').evaluateAll(inputs => inputs.map(input => input.value)), ['Toyota']);
        await page.locator('.dn-home-browse button[type=submit]').click();
      }
      await page.waitForURL(/make=Toyota/);
      await page.locator('.dn-listing-results').waitFor({ state: 'visible' });
      assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 0, 'Catalogue choices do not invent inventory');
      const url = new URL(page.url());
      assert.deepEqual(url.searchParams.getAll('make'), ['Toyota']);
      assert.equal(url.searchParams.has('q'), false, 'Suggestion search remains separate from vehicle keywords');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.deepEqual(errors, []);
      results.push({ name, catalogue: 179, keyboard: true, counts: true, cancellation: true, emptyResult: true, passed: true });
      console.log(`PASS ${name}: catalogue, logos, counts, keyboard scroll, short viewport, cancellation and zero-stock GET`);
    } catch (error) {
      await page.screenshot({ path: `${output}/${name}-failure.png` });
      await writeFile(`${output}/${name}-failure.json`, JSON.stringify({ name, errors, url: page.url(), message: error.message }, null, 2));
      throw error;
    } finally { await page.context().close(); }
  }
  for (const locale of ['bg', 'en']) {
    const name = `${locale}-full-filters-992`;
    if (casePattern && !casePattern.test(name)) continue;
    const page = await browser.newPage({ viewport: { width: 992, height: 600 }, locale, reducedMotion: 'reduce' });
    await page.context().addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto(`${base}/${locale}/listing-grid?sort=price-asc`, { waitUntil: 'networkidle' });
      await page.locator('.dn-listing-results__filters').click();
      const form = page.locator('#dn-listing-filter-dialog');
      await form.waitFor({ state: 'visible' });
      const trigger = form.locator('[data-field=make] button');
      await trigger.click();
      const picker = page.locator('.dn-filter-picker');
      await picker.waitFor({ state: 'visible' });
      assert.equal(await picker.getByRole('checkbox').count(), 180, 'Full Filters uses the same make catalogue');
      assert.equal(Math.round((await picker.boundingBox()).width), 380, 'Nested filters retain compact rows');
      assert.equal(await picker.locator('.dn-desktop-choice--portrait').count(), 0);
      const rows = await picker.locator('.dn-desktop-choice').evaluateAll(elements => elements.map(element => ({ height: element.getBoundingClientRect().height, width: element.getBoundingClientRect().width, content: element.scrollWidth })));
      assert(rows.every(row => row.height >= 44 && row.content <= row.width + 1), 'Compact catalogue rows stay usable without clipping');
      await picker.getByRole('searchbox').fill('volkswagen');
      const vw = picker.getByRole('checkbox', { name: 'Volkswagen', exact: true });
      await vw.check();
      await page.keyboard.press('Escape');
      await picker.waitFor({ state: 'hidden' });
      assert(await form.isVisible(), 'Nested Escape retains the full form');
      assert(await trigger.evaluate(element => element === document.activeElement));
      assert.equal(await form.locator('input[type=hidden][name=make]').inputValue(), 'Volkswagen');
      await page.screenshot({ path: `${output}/${name}-zero-stock.png` });
      await form.locator('.dn-listing-filter__dialog-submit').click();
      await page.waitForURL(/make=Volkswagen/);
      await page.locator('.dn-listing-results').waitFor({ state: 'visible' });
      assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 0);
      assert.equal(new URL(page.url()).searchParams.get('sort'), 'price-asc');
      assert.deepEqual(errors, []);
      results.push({ name, catalogue: 179, compactRows: true, nestedFocus: true, emptyResult: true, passed: true });
      console.log(`PASS ${name}: shared catalogue, compact rows, nested focus, zero-stock GET and sorting`);
    } catch (error) {
      await page.screenshot({ path: `${output}/${name}-failure.png` });
      throw error;
    } finally { await page.context().close(); }
  }
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); }
