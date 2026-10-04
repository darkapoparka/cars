import { appPath, returningContext, returningPage } from './locale-smoke-fixture.mjs';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
const base = previewUrl();
const output = 'artifacts/desktop-discovery-smoke';
await mkdir(output, { recursive: true });
const browser = await launchBrowser();
const results = [];
try {
  for (const width of [1024, 1440, 1920]) {
    for (const route of ['/', '/listing-grid']) {
      const page = await returningPage(browser, { viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      const form = page.locator('.dn-discovery');
      const bar = page.locator('.dn-discovery-sticky');
      assert.equal(await bar.isVisible(), false);
      const submit = form.locator('.dn-discovery__submit');
      assert.equal(await submit.innerText(), '');
      assert.equal(await submit.getAttribute('aria-label'), 'Търсете');
      assert.equal((await submit.boundingBox()).width, 48);
      if (route === '/') {
        assert.equal(await form.locator('.dn-discovery__filters, .dn-discovery__actions').count(), 0);
        const formHeight = Math.round((await form.boundingBox()).height);
        const searchHeight = (await form.locator('.dn-discovery__search').boundingBox()).height;
        assert(formHeight >= searchHeight + 44 + 8 && formHeight <= 154, `Home discovery panel must fit its search row, full-size filters and row spacing without excess height, got ${formHeight}px`);
      } else {
        assert.equal(await form.locator('.dn-discovery__filters').count(), 0);
        const resultFilter = page.locator('.dn-listing-results__filters');
        assert.equal(await resultFilter.innerText(), 'Филтри');
        assert.equal(await resultFilter.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(32, 35, 41)');
        assert.equal(await resultFilter.evaluate(el => getComputedStyle(el).color), 'rgb(255, 255, 255)');
        const filterBox = await resultFilter.boundingBox();
        const sortBox = await page.locator('.dn-listing-sort').boundingBox();
        assert.equal(filterBox.height, sortBox.height);
        assert.equal(filterBox.y, sortBox.y);
        const toolbarGap = Number.parseFloat(await page.locator('.dn-listing-results__tools').evaluate(el => getComputedStyle(el).columnGap));
        assert.equal(sortBox.x - filterBox.x - filterBox.width, toolbarGap);
        if (width === 1440) await page.locator('.dn-listing-results__heading').screenshot({ path: `${output}/cars-results-toolbar.png` });
        await resultFilter.click();
        await page.locator('#dn-listing-filter-dialog').waitFor({ state: 'visible' });
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => document.querySelector('.dn-listing-results__filters').getAttribute('aria-expanded') === 'false');
        assert.equal(await resultFilter.evaluate(el => el === document.activeElement), true);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      }
      assert.equal(await form.locator('.dn-discovery__search .dn-discovery__filters').count(), 0);
      assert.equal(await form.locator('.dn-discovery__toolbar select').count(), 0, 'Vehicle type shares the facet row on Home and inventory');
      if (route === '/') {
      assert.equal(await form.locator('.dn-discovery__facets > label').count(), 7);
      const emptyLabels = { type: 'Тип', make: 'Марка', model: 'Модел', body: 'Купе', price_max: 'Бюджет', year_min: 'Година', mileage_max: 'Пробег' };
      for (const label of await form.locator('.dn-discovery__facets > label').all()) {
        const select = label.locator('select');
        const name = await select.getAttribute('name');
        const accessibleName = await label.locator('span').innerText();
        assert.equal(await form.getByRole('combobox', { name: accessibleName, exact: true }).count(), 1, 'Native filters retain permanent accessible names');
        assert.equal(await select.locator('option:checked').innerText(), emptyLabels[name], 'Unset native filters show the field name on one line');
        assert((await label.boundingBox()).height >= 44, 'The wrapping label retains the full filter click target, including its border');
      }
      const facetWidths = await form.locator('.dn-discovery__facets select').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().width));
      assert.ok(Math.max(...facetWidths) - Math.min(...facetWidths) < 1);
      if (width === 1440 && route === '/listing-grid') await form.screenshot({ path: `${output}/cars-search-panel.png` });
      await form.locator('select[name=make]').selectOption('Audi');
      const model = form.locator('select[name=model]');
      await model.selectOption({ index: 1 });
      await form.locator('select[name=make]').selectOption('BMW');
      await page.waitForFunction(() => document.querySelector('.dn-discovery select[name=model]').selectedIndex === 0);
      assert.equal(await model.inputValue(), '');
      assert.equal(await model.locator('option:checked').innerText(), 'Модел', 'Changing make restores a visibly selected model placeholder');
      await form.locator('select[name=make]').selectOption('');
      assert.equal(await form.locator('select[name=make] option:checked').innerText(), 'Марка', 'Resetting make restores its field name');
      await form.locator('select[name=make]').selectOption('Audi');
      } else {
        const buttons = form.locator('.dn-discovery__facet-buttons button');
        assert.equal(await buttons.count(), 7);
        assert.equal(await form.locator('select:visible').count(), 0, 'Inventory desktop facets open focused selection views');
        const widths = await buttons.evaluateAll(elements => elements.map(el => el.getBoundingClientRect().width));
        assert(Math.max(...widths) - Math.min(...widths) < 1);
        for (const button of await buttons.all()) assert((await button.boundingBox()).height >= 44);
        const dialog = page.locator('#dn-listing-filter-dialog');
        await form.locator('[data-facet=make]').click();
        await dialog.waitFor({ state: 'visible' });
        assert.equal(await dialog.locator('select:visible').count(), 0);
        const search = dialog.getByRole('searchbox', { name: 'Търсете марка' });
        assert.equal(await search.evaluate(el => el === document.activeElement), true);
        await search.fill('zzzznomatch');
        assert(await dialog.getByText('Няма съвпадения', { exact: true }).isVisible());
        await search.fill('audi');
        await dialog.getByRole('radio', { name: 'Audi', exact: true }).click();
        assert.equal(await dialog.getByRole('tab', { name: 'Модел', exact: true }).getAttribute('aria-selected'), 'true');
        assert.equal(await dialog.getByRole('radio', { name: 'X6 M Sport', exact: true }).count(), 0);
        await dialog.getByRole('radio', { name: 'RS 6 Avant', exact: true }).click();
        await dialog.getByRole('tab', { name: 'Марка', exact: true }).click();
        await dialog.getByRole('radio', { name: 'BMW', exact: true }).click();
        assert.equal(await dialog.locator('input[type=hidden][name=model]').inputValue(), '', 'Changing make clears its incompatible model');
        await page.keyboard.press('Escape');
        assert.equal(new URL(page.url()).searchParams.get('make'), null, 'Closing the outer window discards the pending choice');
        await form.locator('[data-facet=make]').click();
        await dialog.getByRole('radio', { name: 'Audi', exact: true }).click();
        await dialog.getByRole('button', { name: 'Назад към филтрите', exact: true }).click();
        assert.equal(await dialog.locator('input[type=hidden][name=make]').inputValue(), 'Audi');
        assert.equal(await dialog.locator('[data-desktop-key=make]').evaluate(el => el === document.activeElement), true, 'Back returns focus to the overview field');
        if (width === 1440) await dialog.screenshot({ path: `${output}/cars-search-menu.png` });
        await dialog.locator('.dn-listing-filter__dialog-submit').click();
        await page.waitForURL(url => appPath(url) === '/listing-grid' && url.searchParams.get('make') === 'Audi');
        assert.equal(new URL(page.url()).searchParams.has('dn-picker-choice'), false, 'Picker-only controls never become URL state');
        assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
      }
      if (width === 1440) await page.screenshot({ path: `${output}/${route === '/' ? 'home' : 'cars'}-top.png` });
      if (route === '/') {
        await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
        assert.equal(await bar.isVisible(), false, 'Home discovery intentionally stays in the hero instead of becoming sticky');
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await form.locator('.dn-discovery__submit').click();
        await page.waitForURL(url => appPath(url) === '/listing-grid' && url.searchParams.get('make') === 'Audi');
        assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
      } else {
        await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
        await bar.waitFor({ state: 'visible' });
        if (width === 1440) await bar.screenshot({ path: `${output}/cars-sticky-bar.png` });
        assert.match(await bar.innerText(), /Audi/);
        const box = await bar.boundingBox();
        assert.equal(box.y, 12);
        assert(box.width <= 800 && box.height <= 70 && box.x >= 0 && box.x + box.width <= width);
        if (width === 1440) await page.screenshot({ path: `${output}/cars-sticky.png` });
        const filters = bar.locator('.dn-discovery-sticky__filters');
        await filters.click();
        const dialog = page.locator('#dn-listing-filter-dialog');
        await dialog.waitFor({ state: 'visible' });
        assert.equal(await dialog.locator('input[type=hidden][name=make]').inputValue(), 'Audi');
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => document.querySelector('.dn-discovery-sticky__filters').getAttribute('aria-expanded') === 'false');
        await dialog.waitFor({ state: 'hidden' });
        await bar.waitFor({ state: 'visible' });
        await page.waitForFunction(() => document.querySelector('.dn-discovery-sticky__filters') === document.activeElement);
        await bar.locator('.dn-discovery-sticky__keyword').click();
        await dialog.waitFor({ state: 'visible' });
        await page.waitForFunction(() => document.querySelector('#dn-listing-filter-dialog input[name=q]') === document.activeElement);
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => document.querySelector('.dn-discovery-sticky__filters').getAttribute('aria-expanded') === 'false');
        await page.waitForFunction(() => document.activeElement?.classList.contains('dn-discovery-sticky__keyword'));
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await bar.waitFor({ state: 'hidden' });
        await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
        await bar.waitFor({ state: 'visible' });
        await bar.locator('.dn-discovery-sticky__submit').click();
        await page.waitForURL(url => appPath(url) === '/listing-grid' && url.searchParams.get('make') === 'Audi');
        assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
        await page.setViewportSize({ width: 390, height: 844 });
        await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
        assert.equal(await bar.isVisible(), false, 'Desktop sticky bar must not appear on mobile');
      }
      assert.deepEqual(errors, []);
      results.push({ route, width, passed: true });
      await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2));
      console.log(`PASS desktop icon/visible filters/sticky draft and focus ${route} ${width}px`);
      await page.close();
    }
  }
} catch (error) {
  results.push({ passed: false, error: error.stack });
  throw error;
} finally {
  await browser.close();
  await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
}
