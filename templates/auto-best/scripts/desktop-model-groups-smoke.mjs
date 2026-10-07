import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { webkit } from 'playwright';
import { launchBrowser, previewUrl } from './browser.mjs';
import { chooseListingOption } from './filter-choice-fixture.mjs';

const base = previewUrl();
const engine = process.env.MODEL_ENGINE || 'chromium';
const output = process.env.MODEL_EVIDENCE_DIR || `artifacts/desktop-model-groups-${engine}`;
const pattern = process.env.MODEL_CASE ? new RegExp(process.env.MODEL_CASE) : null;
await mkdir(output, { recursive: true });
const browser = engine === 'webkit' ? await webkit.launch({ headless: true }) : await launchBrowser();
const results = [];
try {
  for (const locale of ['bg', 'en']) for (const surface of ['home', 'listing', 'nested']) for (const [width, height] of [[992, 600], [1440, 900]]) {
    const name = `${locale}-${surface}-${width}`;
    if (pattern && !pattern.test(name)) continue;
    const page = await browser.newPage({ viewport: { width, height }, locale, reducedMotion: process.env.MODEL_MOTION === 'no-preference' ? 'no-preference' : 'reduce' });
    await page.context().addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const home = surface === 'home', nested = surface === 'nested';
    await page.goto(`${base}/${locale}${home ? '' : '/listing-grid?make=BMW'}`, { waitUntil: 'networkidle' });
    const parent = page.locator('#dn-listing-filter-dialog');
    const menu = page.locator(home ? '.dn-home-browse-picker[data-state=open]' : nested ? '.dn-filter-picker' : '#dn-listing-filter-dialog');
    const opener = page.locator(home ? '.dn-home-browse [data-field=model]' : nested ? '#dn-listing-filter-dialog [data-field=model] button' : '[data-facet=model]');
    const footer = () => page.locator(home ? '.dn-home-browse-picker__footer' : nested ? '.dn-listing-filter__dialog-footer' : '.dn-search-footer');
    const apply = () => page.locator(home ? '.dn-home-browse-picker__save' : nested ? '.dn-listing-filter__dialog-submit' : '.dn-search-apply').click();
    const search = () => menu.getByRole('searchbox');
    try {
      if (home) {
        await page.locator('.dn-home-browse [data-field=make]').click();
        await menu.getByRole('checkbox', { name: 'BMW', exact: true }).check();
        await apply();
      } else if (nested) await page.locator('.dn-listing-results__filters').click();
      await opener.click(); await menu.waitFor({ state: 'visible' });
      const frame = await menu.boundingBox();
      assert.equal(frame.width, nested ? 380 : 640, 'Grouping preserves the approved picker widths');
      assert(frame.x >= 15 && frame.y >= 15 && frame.x + frame.width <= width - 15 && frame.y + frame.height <= height - 15, 'The grouped editor fits short desktop windows');
      assert.deepEqual((await menu.locator('[data-model-family]').evaluateAll(nodes => nodes.map(node => node.dataset.modelFamily))).slice(0, 8), Array.from({ length: 8 }, (_, i) => `${i + 1} Series`));
      assert.equal(await menu.locator('[data-model-family="3 Series"] button').getAttribute('aria-expanded'), 'false');
      assert.equal(await menu.getByRole('checkbox', { name: '320', exact: true }).count(), 0, 'Collapsed families do not mount thousands of checkbox rows');
      assert.match(await menu.locator('[data-model-family="X Series"] button').innerText(), /2/);
      const before = await footer().boundingBox();
      const pageScroll = await page.evaluate(() => scrollY);
      await menu.locator('[data-model-family="3 Series"] button').press('Enter');
      assert.equal(await menu.locator('[data-model-family="3 Series"] button').getAttribute('aria-expanded'), 'true', 'Keyboard opens a family');
      assert(await menu.getByRole('checkbox', { name: '320', exact: true }).isEnabled(), 'Zero-stock catalogue models remain selectable');
      const description = await menu.getByRole('checkbox', { name: '320', exact: true }).getAttribute('aria-describedby');
      assert.match(await menu.locator(`[id="${description}"]`).innerText(), /^0 /);
      const after = await footer().boundingBox();
      assert(Math.abs(before.y - after.y) < 1, 'Expanding a family keeps the action footer stationary');
      assert.equal(await page.evaluate(() => scrollY), pageScroll, 'Keyboard expansion does not move the page');
      await menu.locator('[data-model-family="3 Series"] button').click();
      assert.equal(await page.evaluate(() => scrollY), pageScroll, 'Pointer collapse does not move the page');
      await menu.locator('[data-model-family="3 Series"] button').click();
      assert.equal(await page.evaluate(() => scrollY), pageScroll, 'Pointer expansion does not move the page');
      const rows = await menu.locator('input[type=checkbox]').evaluateAll(inputs => inputs.map(input => input.closest('label').getBoundingClientRect()));
      assert(rows.every(row => row.height >= 44 && row.width <= (nested ? frame.width : frame.width / 2)), 'Model targets stay compact and usable');
      await page.screenshot({ path: `${output}/${name}-family.png` });
      await menu.getByRole('checkbox', { name: '320', exact: true }).check();
      if (nested) { await page.keyboard.press('Escape'); assert(await parent.isVisible(), 'Nested Escape retains the full draft'); }
      await apply();
      if (home) {
        assert.deepEqual(await page.locator('.dn-home-browse input[type=hidden][name=model]').evaluateAll(inputs => inputs.map(input => input.value)), ['BMW 320']);
        await page.locator('.dn-home-browse button[type=submit]').click();
      }
      await page.waitForURL(url => url.searchParams.get('model') === 'BMW 320');
      assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 0, 'Zero stock produces a truthful empty result');

      // Search a stock model inside the same editor without changing the applied keyword.
      const listingOpener = nested ? page.locator('.dn-listing-results__filters') : page.locator('[data-facet=model]');
      await listingOpener.click();
      if (nested) await parent.locator('[data-field=model] button').click();
      const listingMenu = page.locator(nested ? '.dn-filter-picker' : '#dn-listing-filter-dialog');
      await listingMenu.getByRole('searchbox').fill('x6 m sport');
      await listingMenu.getByRole('checkbox', { name: 'X6 M Sport', exact: true }).check();
      assert.equal(new URL(page.url()).searchParams.get('model'), 'BMW 320', 'Search and checkboxes only edit a pending draft');
      await listingMenu.getByRole('searchbox').fill('no-such-model');
      assert(await listingMenu.getByRole('status').isVisible());
      await page.keyboard.press('Escape');
      if (nested) await page.keyboard.press('Escape');
      assert.equal(new URL(page.url()).searchParams.get('model'), 'BMW 320', 'Cancel preserves the applied zero-stock selection');

      if (nested) {
        await page.locator('.dn-listing-results__filters').click();
        await chooseListingOption(page, parent, 'make', '');
        await parent.locator('[data-field=model] button').click();
      } else {
        await page.locator('[data-facet=make]').click();
        await parent.getByRole('checkbox', { name: locale === 'bg' ? 'Всички марки' : 'All makes', exact: true }).check();
        await parent.locator('.dn-search-apply').click();
        await page.waitForURL(url => !url.searchParams.has('make'));
        await page.locator('[data-facet=model]').click();
      }
      const allMenu = page.locator(nested ? '.dn-filter-picker' : '#dn-listing-filter-dialog');
      assert.equal(await allMenu.locator('[data-model-make="BMW"] > button').getAttribute('aria-expanded'), 'false', 'All makes starts with compact brand disclosures');
      assert(await allMenu.getByRole('checkbox').count() < 10, 'All makes does not render the complete leaf catalogue at once');
      await allMenu.locator('[data-model-make="BMW"] > button').click();
      assert(await allMenu.locator('[data-model-family="1 Series"] button').isVisible());
      await allMenu.getByRole('searchbox').fill('Mercedes GT Coupé');
      assert(await allMenu.getByRole('checkbox', { name: 'Mercedes-AMG GT Coupé', exact: true }).isVisible(), 'Search crosses brands and opens the relevant family');
      await allMenu.getByRole('checkbox', { name: 'Mercedes-AMG GT Coupé', exact: true }).check();
      await allMenu.getByRole('searchbox').fill('');
      if (nested) { await page.keyboard.press('Escape'); await parent.locator('.dn-listing-filter__dialog-submit').click(); }
      else await parent.locator('.dn-search-apply').click();
      await page.waitForURL(url => url.searchParams.get('model') === 'Mercedes-AMG GT Coupé');
      assert.equal(new URL(page.url()).searchParams.has('q'), false);
      assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 1, 'Existing stock values still select the exact car');
      assert.deepEqual(errors, []);
      results.push({ name, passed: true }); console.log(`PASS ${name}: model families, keyboard, counts, zero stock, search and legacy GET`);
    } catch (error) {
      await page.screenshot({ path: `${output}/${name}-failure.png` });
      await writeFile(`${output}/${name}-failure.json`, JSON.stringify({ message: error.message, errors }, null, 2));
      throw error;
    } finally { await page.close(); }
  }
  assert(results.length > 0);
} finally { await browser.close(); await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2)); }
