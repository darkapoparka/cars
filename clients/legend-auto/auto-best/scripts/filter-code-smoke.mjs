import { chooseListingOption, listingFormValue } from './filter-choice-fixture.mjs';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { webkit } from 'playwright';
import { launchBrowser, previewUrl } from './browser.mjs';

const base = previewUrl();
const engine = process.env.FILTER_ENGINE || 'chromium';
if (!['chromium', 'webkit'].includes(engine)) throw new Error(`Unsupported filter engine: ${engine}`);
const output = `artifacts/filter-code-${engine}`;
await mkdir(output, { recursive: true });
const browser = await (engine === 'webkit' ? webkit.launch() : launchBrowser());
const results = [];
const applied = 'make=bmw&model=x6+m+sport&sort=price-asc&equipment=4x4';
const copy = JSON.parse(await readFile('localization/common.json', 'utf8'));

async function assertIdentity(scope, field, label) {
  const values = scope.locator('input[type=checkbox]');
  assert.equal(await values.evaluateAll((inputs, requested) => inputs.filter(input => input.value.toLowerCase() === requested.toLowerCase()).length, label), 1, `${field}: one option for the applied identity`);
  assert(await scope.locator(`input[value="${label}"]`).isChecked(), `${field}: canonical option reflects the applied filter`);
}

async function assertFocus(page, selector) {
  try {
    await page.waitForFunction(selector => document.activeElement === document.querySelector(selector), selector);
  } catch (cause) {
    const state = await page.evaluate(selector => ({ expected: selector,
      active: document.activeElement && { tag: document.activeElement.tagName,
        id: document.activeElement.id, class: document.activeElement.className,
        label: document.activeElement.getAttribute('aria-label') },
      openDialogs: document.querySelectorAll('dialog[open]').length,
      openPickers: document.querySelectorAll('.dn-filter-picker').length
    }), selector);
    throw new Error(`Focus did not reach its owner: ${JSON.stringify(state)}`, { cause });
  }
}

try {
  for (const locale of ['bg', 'en']) {
    for (const width of [320, 390, 1440]) {
      if (process.env.FILTER_CASE && !new RegExp(process.env.FILTER_CASE).test(`${locale}-${width}`)) continue;
      const page = await browser.newPage({ viewport: { width, height: width === 320 ? 677 : 900 }, locale, reducedMotion: 'reduce' });
      page.setDefaultTimeout(10000);
      page.setDefaultNavigationTimeout(60000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.context().addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
      await page.goto(`${base}/${locale}/cars?${applied}`, { waitUntil: 'networkidle' });
      const main = page.locator('#dn-listing-filter-dialog');
      const shortcut = field => page.locator('.dn-listing-filter__quick').getByRole('button', { name: copy[`inventory.facet.${field}`][locale], exact: true });
      if (width < 768) {
        await main.locator('.dn-mobile-filter-fields').waitFor({ state: 'attached' });
        const trigger = page.locator('.dn-listing-filter__toggle');
        await trigger.click();
        for (const [field, label] of [['make', 'BMW'], ['model', 'X6 M Sport']]) {
          await main.locator(`.dn-mobile-filter-fields [data-field="${field}"]`).click();
          await assertIdentity(main.locator('.dn-mobile-filter-editor'), field, label);
          await main.locator('.back').click();
        }
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => document.activeElement === document.querySelector('.dn-listing-filter__toggle'));

        const quick = page.locator('#dn-quick-filter');
        for (const [field, label] of [['make', 'BMW'], ['model', 'X6 M Sport']]) {
          await shortcut(field).click();
          await assertIdentity(quick, field, label);
          // Hiding a selected suggestion must not erase it from GET submission.
          await quick.getByRole('searchbox').fill('no matching stock');
          await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), quick.locator('.apply').click()]);
          assert.equal(new URL(page.url()).searchParams.getAll(field).length, 1);
          assert.equal(new URL(page.url()).searchParams.get(field).toLowerCase(), label.toLowerCase());
        }
        await shortcut('price').click();
        await quick.locator('input[name=price_max]').fill('8e4');
        assert(await quick.locator('input[name=price_max]').evaluate(input => input.validity.valid));
        await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), quick.locator('.apply').click()]);
        assert.equal(new URL(page.url()).searchParams.get('price_max'), '80000', 'Quick picker submits the exact native numeric value');
        await trigger.click();
        await main.locator('.dn-mobile-filter-fields [data-field="price"]').click();
        await main.locator('input[type=number][name=price_max]').fill('7e4');
        await main.locator('.dn-mobile-filter-editor-footer button[type=submit]').click();
        await main.locator('.overview').waitFor({ state: 'visible' });
        await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), main.locator('.dn-listing-filter__dialog-submit').click()]);
        assert.equal(new URL(page.url()).searchParams.get('price_max'), '70000', 'Main draft and its GET values use the same numeric interpretation');
      } else {
        await page.locator('.dn-discovery__facet-buttons').waitFor({ state: 'visible' });
        const trigger = page.locator('.dn-discovery__keyword');
        await trigger.click();
        for (const [field, label] of [['make', 'BMW'], ['model', 'X6 M Sport']]) {
          const identityTrigger = main.locator(`[data-field="${field}"] button`);
          await identityTrigger.click();
          await assertFocus(page, '.dn-filter-picker');
          await page.keyboard.press('Tab');
          await assertFocus(page, field === 'model' ? '.dn-filter-picker .back' : '.dn-filter-picker .dn-picker-close');
          await assertIdentity(page.locator('.dn-filter-picker'), field, label);
          await page.keyboard.press('Escape');
          assert(await main.isVisible(), 'Escape dismisses the nested picker before the native dialog');
          await assertFocus(page, `#dn-listing-filter-dialog [data-field="${field}"] button`);
        }
        await main.locator('[data-field=make] button').click();
        await main.locator('[data-field=model] button').click();
        await assertIdentity(page.locator('.dn-filter-picker'), 'model', 'X6 M Sport');
        await assertFocus(page, '.dn-filter-picker');
        await page.keyboard.press('Escape');
        await assertFocus(page, '#dn-listing-filter-dialog [data-field=model] button');
        await main.locator('[data-field=make] button').click();
        await main.locator('input[name=q]').click();
        await page.locator('.dn-filter-picker').waitFor({ state: 'hidden' });
        await assertFocus(page, '#dn-listing-filter-dialog input[name=q]');
        // Home and listing share the shared styled scalar menus.
        const scalarChoices = { type: 'car', body: 'SUV', condition: 'used', price_min: '5000', price_max: '90000', year_min: '2019', year_max: '2024', mileage_max: '100000', fuel: 'Дизел', transmission: 'Автоматик', version: 'M Sport' };
        for (const [field, value] of Object.entries(scalarChoices)) {
          await chooseListingOption(page, main, field, value);
          assert(await main.isVisible(), 'A field choice keeps the form open');
          assert.equal(await listingFormValue(main, field), value);
        }
        assert.equal(await main.locator('select').count(), 0, 'Every field uses the shared styled menu');
        const pageScroll = await page.evaluate(() => scrollY);
        await main.locator('[data-field=price_max] button').click();
        const selectedPreset = await page.locator('.dn-filter-picker').evaluate(menu => {
          const list = menu.querySelector('.dn-picker-options').getBoundingClientRect();
          const row = menu.querySelector('input:checked').closest('label').getBoundingClientRect();
          return { top: row.top, bottom: row.bottom, listTop: list.top, listBottom: list.bottom };
        });
        assert(selectedPreset.top >= selectedPreset.listTop - 1 && selectedPreset.bottom <= selectedPreset.listBottom + 1, 'Reopening a long preset list reveals its current choice');
        assert.equal(await page.evaluate(() => scrollY), pageScroll, 'Revealing a choice does not scroll the underlying page');
        await page.keyboard.press('Escape');
        const fuelTrigger = main.locator('[data-field=fuel] button');
        const picker = page.locator('.dn-filter-picker');
        await fuelTrigger.press('Enter');
        await assertFocus(page, '.dn-filter-picker input[value="Дизел"]');
        await page.keyboard.press('ArrowUp');
        assert(await picker.locator('input[value="Бензин"]').isChecked(), 'Radio arrows browse without closing');
        assert.equal(await listingFormValue(main, 'fuel'), 'Дизел', 'Browsing does not change the pending filter');
        await page.keyboard.press('Escape');
        await picker.waitFor({ state: 'hidden' });
        await assertFocus(page, '#dn-listing-filter-dialog [data-field=fuel] button');
        await fuelTrigger.press('Enter');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('Enter');
        await picker.waitFor({ state: 'hidden' });
        assert.equal(await listingFormValue(main, 'fuel'), 'Бензин', 'Enter commits the browsed choice');
        await fuelTrigger.press('Space');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Space');
        await picker.waitFor({ state: 'hidden' });
        assert.equal(await listingFormValue(main, 'fuel'), 'Дизел', 'Space commits the browsed choice');
        await chooseListingOption(page, main, 'fuel', 'Дизел');
        const equipment = main.locator('input[type=checkbox][name=equipment][value="360° камера"]');
        await equipment.check();
        const submitted = await main.locator('form').evaluate(form => [...new FormData(form)]);
        const params = new URLSearchParams(submitted);
        for (const [field, value] of Object.entries(scalarChoices)) assert.deepEqual(params.getAll(field), [value], 'GET contains one canonical scalar value');
        assert.deepEqual(params.getAll('equipment').sort(), ['360° камера', '4x4'].sort(), 'GET retains each selected checkbox exactly once');
        assert.equal(params.getAll('make').length, 1);
        assert.equal(params.getAll('model').length, 1);
        assert(![...params.keys()].some(key => key.includes('choice') || key.startsWith('draft-')), 'Picker controls do not leak into GET');
        assert.equal(new URL(page.url()).searchParams.get('body'), null, 'Keyword choices remain local until Apply');
        await page.keyboard.press('Escape');
        await main.waitFor({ state: 'hidden' });
        await page.waitForFunction(() => document.activeElement === document.querySelector('.dn-discovery__keyword'));
        await trigger.click();
        assert.equal(await listingFormValue(main, 'body'), '', 'Cancel discards the scalar draft');
        assert.equal(await main.locator('input[type=checkbox][name=equipment][value="360° камера"]').isChecked(), false, 'Cancel discards the equipment draft');
        await page.keyboard.press('Escape');
        await main.waitFor({ state: 'hidden' });
        await page.locator('.dn-listing-results__filters').click();
        assert.equal(await main.evaluate(node => node.tagName), 'DIALOG', 'The main listing action opens the same native form as Home');
        assert.equal(await main.getByRole('tab').count(), 0, 'The rejected category workspace is no longer an entry path');
        for (const [field, label] of [['make', 'BMW'], ['model', 'X6 M Sport']]) {
          await main.locator(`[data-field="${field}"] button`).click();
          await assertIdentity(page.locator('.dn-filter-picker'), field, label);
          await page.keyboard.press('Escape');
          assert(await main.isVisible());
        }
        await chooseListingOption(page, main, 'fuel', 'Дизел');
        assert(await main.isVisible(), 'A field choice stays in the shared draft');
        assert.equal(await main.locator('form').evaluate(form => new FormData(form).get('fuel')), 'Дизел');
        assert.equal(new URL(page.url()).searchParams.get('fuel'), null, 'A local field choice remains an unapplied draft');
        await page.keyboard.press('Escape');
        await main.waitFor({ state: 'hidden' });
        await assertFocus(page, '.dn-listing-results__filters');
        await page.locator('[data-facet=make]').click();
        await assertIdentity(main, 'make', 'BMW');
        await assertFocus(page, '.dn-search-popover');
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => document.activeElement === document.querySelector('[data-facet=make]'));
        await page.locator('[data-facet=make]').press('Enter');
        await assertFocus(page, '.dn-search-popover input[role=searchbox]');
        await page.keyboard.press('Escape');
        await main.waitFor({ state: 'hidden' });
        await page.locator('[data-facet=price]').click();
        await assertFocus(page, '.dn-search-popover');
        await page.keyboard.press('Escape');
        await main.waitFor({ state: 'hidden' });
        await page.locator('[data-facet=price]').press('Space');
        await assertFocus(page, '.dn-search-popover input[type=number]');
        await page.keyboard.press('Escape');
        await main.waitFor({ state: 'hidden' });
        const sort = page.locator('.dn-listing-sort [data-field=sort] button');
        await sort.press('Enter');
        await page.keyboard.press('ArrowDown');
        assert(await page.locator('.dn-filter-picker').isVisible(), 'Sorting remains open while browsing');
        await page.keyboard.press('Escape');
        assert.equal(new URL(page.url()).searchParams.get('sort'), 'price-asc', 'Cancelling a sort does not navigate');
        assert.match(await sort.innerText(), new RegExp(locale === 'bg' ? 'Най-ниска цена' : 'Lowest price'), 'Cancelled sorting retains the applied label');
        await sort.click();
        await page.locator('.dn-filter-picker input[value="price-desc"]').click();
        await page.waitForURL(url => url.searchParams.get('sort') === 'price-desc');
        assert.equal(new URL(page.url()).searchParams.get('equipment'), '4x4', 'Sorting preserves repeated filter fields');
        await sort.click();
        await page.locator('.dn-filter-picker input[value="price-asc"]').click();
        await page.waitForURL(url => url.searchParams.get('sort') === 'price-asc');
      }
      const params = new URL(page.url()).searchParams;
      assert.equal(params.getAll('make').length, 1);
      assert.equal(params.getAll('model').length, 1);
      assert.equal(params.get('sort'), 'price-asc');
      assert.equal(params.get('equipment'), '4x4');
      assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 1);
      assert.deepEqual(errors, []);
      results.push({ locale, width, passed: true });
      await page.close();
    }
  }
  assert(results.length > 0, 'No filter regression cases matched');
  console.log(`Filter code regression: ${results.length} ${engine} cases passed.`);
} finally {
  await browser.close();
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
}
