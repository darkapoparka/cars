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
      assert.equal(await menu.getByRole('checkbox', { name: '320', exact: true }).count(), 0, 'Collapsed families do not mount thousands of checkbox rows');
      assert.match(await menu.locator('[data-model-family="X Series"]').innerText(), /2/);
      const before = await footer().boundingBox();
      const pageScroll = await page.evaluate(() => scrollY);
      await menu.locator('[data-model-family="3 Series"]').press('Enter');
      assert(await menu.locator('[data-model-view="3 Series"]').isVisible(), 'Keyboard opens a focused family');
      assert.equal(await menu.locator('[data-model-family]').count(), 0, 'Only the chosen family is displayed');
      assert.equal(await menu.getByRole('checkbox', { name: '118', exact: true }).count(), 0, 'Other families are not mixed into the model list');
      assert(await menu.locator('.back').evaluate(node => node === document.activeElement), 'Entering a family places keyboard focus on Back');
      assert(await menu.getByRole('checkbox', { name: '320', exact: true }).isEnabled(), 'Zero-stock catalogue models remain selectable');
      const description = await menu.getByRole('checkbox', { name: '320', exact: true }).getAttribute('aria-describedby');
      assert.match(await menu.locator(`[id="${description}"]`).innerText(), /^0 /);
      const after = await footer().boundingBox();
      assert(Math.abs(before.y - after.y) < 1, 'Entering a family keeps the action footer stationary');
      assert.equal((await menu.boundingBox()).height, frame.height, 'Family navigation retains the outer menu height');
      assert.equal(await page.evaluate(() => scrollY), pageScroll, 'Keyboard navigation does not move the page');
      await menu.locator('.back').press('Enter');
      assert(await menu.locator('[data-model-family="3 Series"]').evaluate(node => node === document.activeElement), 'Back restores focus to the originating family');
      assert.equal(await page.evaluate(() => scrollY), pageScroll, 'Going back does not move the page');
      await menu.locator('[data-model-family="3 Series"]').click();
      assert.equal(await page.evaluate(() => scrollY), pageScroll, 'Pointer navigation does not move the page');
      const rows = await menu.locator('input[type=checkbox]').evaluateAll(inputs => inputs.map(input => input.closest('label').getBoundingClientRect()));
      assert(rows.every(row => row.height >= 44 && row.width <= (nested ? frame.width : frame.width / 2)), 'Model targets stay compact and usable');
      await page.screenshot({ path: `${output}/${name}-family.png` });
      await menu.getByRole('checkbox', { name: '320', exact: true }).check();
      await menu.locator('.back').click();
      assert(await menu.locator('[data-model-family="3 Series"]').evaluate(node => node.classList.contains('selected')), 'Families indicate retained selections');
      await menu.locator('[data-model-family="8 Series"]').click();
      assert.equal(await menu.getByRole('checkbox').count(), 2, 'Short families open the same focused view');
      assert.equal((await menu.boundingBox()).height, frame.height, 'A two-choice family does not shrink the menu');
      assert(Math.abs(before.y - (await footer().boundingBox()).y) < 1, 'Short families retain the footer position');
      await menu.locator('.back').click();
      await menu.locator('[data-model-family="1 Series"]').click();
      await menu.getByRole('checkbox', { name: '118', exact: true }).check();
      await menu.locator('.back').click();
      await menu.locator('[data-model-family="3 Series"]').click();
      assert(await menu.getByRole('checkbox', { name: '320', exact: true }).isChecked(), 'Changing families retains selected models');
      await search().fill('118');
      assert.equal(await menu.locator('[data-model-family]').count(), 0, 'Search goes directly to matching model choices');
      await menu.getByRole('checkbox', { name: '118', exact: true }).uncheck();
      await search().fill('');
      assert(await menu.locator('[data-model-view="3 Series"]').isVisible(), 'Clearing search restores the current family');
      assert(Math.abs(before.y - (await footer().boundingBox()).y) < 1, 'Search and Back keep the footer stationary');
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
      assert(await allMenu.getByRole('checkbox').count() < 10, 'All makes does not render the complete leaf catalogue at once');
      await allMenu.locator('[data-model-make="BMW"]').click();
      assert(await allMenu.locator('[data-model-family="1 Series"]').isVisible());
      assert.equal(await allMenu.locator('[data-model-make]').count(), 0, 'Entering BMW replaces the brand list');
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
      results.push({ name, passed: true }); console.log(`PASS ${name}: focused families, Back/focus, fixed frame, retained selections, zero stock, search and legacy GET`);
    } catch (error) {
      await page.screenshot({ path: `${output}/${name}-failure.png` });
      await writeFile(`${output}/${name}-failure.json`, JSON.stringify({ message: error.message, errors }, null, 2));
      throw error;
    } finally { await page.close(); }
  }
  // Browser-only future-catalogue fixture; no reusable model or inventory data is changed.
  for (const locale of ['bg', 'en']) for (const surface of ['home', 'listing', 'nested']) {
    const name = `${locale}-${surface}-large-family`;
    if (pattern && !pattern.test(name)) continue;
    const page = await browser.newPage({ viewport: { width: 1024, height: 600 }, locale, reducedMotion: 'reduce' });
    await page.context().addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const additions = Array.from({ length: 80 }, (_, index) => `320 QA variant ${String(index + 1).padStart(2, '0')}`);
    let fixtureApplied = false;
    await page.route('**/src/lib/data/model-catalogue-data.ts*', async route => {
      const response = await route.fetch({ maxRetries: 2 });
      const source = await response.text();
      const body = source.replace(/(["']?name["']?:\s*"3 Series",\s*["']?children["']?:\s*\[)([\s\S]*?)(\])/, (_, start, choices, end) => `${start}${choices},${additions.map(value => JSON.stringify(value)).join(',')}${end}`);
      assert.notEqual(body, source, 'The development-only fixture extends BMW 3 Series');
      fixtureApplied = true;
      await route.fulfill({ response, body });
    });
    const home = surface === 'home', nested = surface === 'nested';
    const menu = page.locator(home ? '.dn-home-browse-picker[data-state=open]' : nested ? '.dn-filter-picker' : '#dn-listing-filter-dialog');
    try {
      await page.goto(`${base}/${locale}${home ? '' : '/listing-grid?make=BMW'}`, { waitUntil: 'networkidle' });
      assert(fixtureApplied);
      if (home) {
        await page.locator('.dn-home-browse [data-field=make]').click();
        await menu.getByRole('checkbox', { name: 'BMW', exact: true }).check();
        await page.locator('.dn-home-browse-picker__save').click();
        await page.locator('.dn-home-browse [data-field=model]').click();
      } else if (nested) {
        await page.locator('.dn-listing-results__filters').click();
        await page.locator('#dn-listing-filter-dialog [data-field=model] button').click();
      } else await page.locator('[data-facet=model]').click();
      const frame = await menu.boundingBox();
      const footer = page.locator(home ? '.dn-home-browse-picker__footer' : nested ? '.dn-listing-filter__dialog-footer' : '.dn-search-footer');
      const footerBefore = await footer.boundingBox();
      const pageScroll = await page.evaluate(() => scrollY);
      await menu.locator('[data-model-family="3 Series"]').click();
      assert.equal(await menu.locator('input[type=checkbox]').count(), 99, 'Only the 99 choices belonging to the active family are mounted');
      await menu.getByRole('checkbox', { name: additions.at(-1), exact: true }).check();
      assert(await menu.locator('.back').isVisible(), 'Back stays visible after scrolling to the last of 99 models');
      const backBox = await menu.locator('.back').boundingBox();
      assert(backBox.y >= frame.y && backBox.y + backBox.height <= frame.y + frame.height, JSON.stringify(await menu.locator('.back').evaluate(node => {
        const ancestors = []; for (let parent = node; parent && ancestors.length < 7; parent = parent.parentElement) { const style = getComputedStyle(parent); ancestors.push({ class: parent.className, position: style.position, top: style.top, overflow: style.overflowY, height: parent.clientHeight, scrollHeight: parent.scrollHeight, scrollTop: parent.scrollTop, y: parent.getBoundingClientRect().y }); } return ancestors;
      })));
      assert.equal((await menu.boundingBox()).height, frame.height, '99 models do not grow the outer dropdown');
      assert.equal((await footer.boundingBox()).y, footerBefore.y, 'Large model lists keep Save stationary');
      assert.equal(await page.evaluate(() => scrollY), pageScroll, 'Model scrolling is contained');
      for (const label of [additions[39], '315']) {
        await menu.getByRole('checkbox', { name: label, exact: true }).focus();
        const focused = await menu.getByRole('checkbox', { name: label, exact: true }).boundingBox();
        const back = await menu.locator('.back').boundingBox();
        assert(focused.y >= back.y + back.height && focused.y + focused.height <= (await footer.boundingBox()).y, 'Keyboard focus remains visible below the sticky navigation');
      }
      await menu.locator('.back').click();
      assert(await menu.locator('[data-model-family="3 Series"]').evaluate(node => node === document.activeElement), 'Back returns focus after a long scroll');
      await menu.locator('[data-model-family="3 Series"]').click();
      assert(await menu.getByRole('checkbox', { name: additions.at(-1), exact: true }).isChecked(), 'The long-list selection survives returning to its family');
      await menu.getByRole('searchbox').fill(additions.at(-1));
      assert.equal(await menu.getByRole('checkbox').count(), 1, 'Exact search finds the last model without browsing 99 rows');
      assert(await menu.getByRole('checkbox', { name: additions.at(-1), exact: true }).isChecked());
      await page.screenshot({ path: `${output}/${name}.png` });
      assert.deepEqual(errors, []);
      results.push({ name, passed: true, familyChoices: 99 });
      console.log(`PASS ${name}: 99 model choices, direct search, retained selection, sticky Back and fixed menu/footer`);
    } catch (error) {
      await page.screenshot({ path: `${output}/${name}-failure.png` });
      await writeFile(`${output}/${name}-failure.json`, JSON.stringify({ message: error.message, errors }, null, 2));
      throw error;
    } finally { await page.close(); }
  }
  assert(results.length > 0);
} finally { await browser.close(); await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2)); }
