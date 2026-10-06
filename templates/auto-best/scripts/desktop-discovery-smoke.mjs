import { appPath, returningContext, returningPage } from './locale-smoke-fixture.mjs';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
import { chooseListingOption, listingFormValue } from './filter-choice-fixture.mjs';
import { verifyHomeBrowse } from './home-browse-smoke.mjs';
const base = previewUrl();
const output = 'artifacts/desktop-discovery-smoke';
await mkdir(output, { recursive: true });
const browser = await launchBrowser();
const results = [];
try {
  for (const width of [1024, 1440, 1920]) {
    for (const route of ['/', '/listing-grid'].filter(route => !process.env.DISCOVERY_ROUTE || route === process.env.DISCOVERY_ROUTE)) {
      const page = await returningPage(browser, { viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      if (route === '/' && await page.locator('.dn-home-browse').isVisible()) {
        await verifyHomeBrowse(page);
        assert.deepEqual(errors, []);
        results.push({ route, width, passed: true });
        console.log(`PASS Home browse box draft, keyboard and filtered results ${width}px`);
        await page.close();
        continue;
      }
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
      assert.equal(await form.locator('.dn-discovery__facets > label, .dn-discovery__facets > .dn-identity-field').count(), 7);
      const emptyLabels = { type: 'Тип', make: 'Марка', model: 'Модел', body: 'Купе', price_max: 'Бюджет', year_min: 'Година', mileage_max: 'Пробег' };
      for (const [field, text] of Object.entries(emptyLabels)) {
        const button = form.locator('[data-field="' + field + '"] button');
        assert.equal(await button.innerText(), text, 'Unset styled filters show their field name');
        assert(await button.getAttribute('aria-labelledby'), 'Every field retains a permanent accessible name');
        assert((await button.boundingBox()).height >= 44, 'Every dropdown retains a full-size target');
      }
      assert.equal(await form.locator('select').count(), 0, 'Home uses the same styled menus for every filter');
      for (const [field, value] of Object.entries({type:'car',body:'Wagon',price_max:'90000',year_min:'2020',mileage_max:'100000'})) {
        await chooseListingOption(page, form, field, value);
        assert.equal(await listingFormValue(form, field), value);
        assert.equal(new URL(page.url()).searchParams.get(field), null, 'Inline changes wait for Search');
        await chooseListingOption(page, form, field, '');
        assert.equal(await listingFormValue(form, field), '', 'All clears the same canonical field');
      }
      const facetWidths = await form.locator('.dn-discovery__facets > label, .dn-discovery__facets > .dn-identity-field').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().width));
      assert.ok(Math.max(...facetWidths) - Math.min(...facetWidths) < 1);
      if (width === 1440 && route === '/listing-grid') await form.screenshot({ path: `${output}/cars-search-panel.png` });
      const identity = async (field, value) => {
        await form.locator(`[data-field=${field}] button`).click();
        await page.locator(`.dn-filter-picker input[value="${value}"]`).click();
        await page.keyboard.press('Escape');
        await page.locator('.dn-filter-picker').waitFor({ state: 'hidden' });
      };
      await identity('make','Audi');
      await identity('model','RS 6 Avant');
      await identity('make','BMW');
      await identity('make','Audi');
      assert.equal(await form.locator('input[name=model]').count(), 0, 'Removing a brand clears incompatible models');
      await identity('make','');
      assert.equal(await form.locator('[data-field=make] button').innerText(), 'Марка', 'Clearing brands restores the field name');
      await identity('make','Audi');
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
        assert.equal(await page.getByRole('dialog').count(), 1, 'Shortcuts use one desktop dialog');
        assert.equal(await dialog.getAttribute('data-compact'), 'true');
        assert.equal(await dialog.getByRole('heading', { name: 'Марка', exact: true }).count(), 1);
        assert.equal(await dialog.getByRole('tab').count(), 0, 'Brand opens its choices directly without category navigation');
        const frame = await dialog.boundingBox();
        const footer = await dialog.locator('.dn-search-footer').boundingBox();
        assert.equal(frame.width, 380);
        assert.equal(await dialog.locator('.dn-search-apply').evaluate(el => getComputedStyle(el).backgroundColor),
          await form.locator('.dn-discovery__submit').evaluate(el => getComputedStyle(el).backgroundColor),
          'Focused selector actions share the neutral black desktop search treatment');
        assert((await dialog.locator('.dn-search-apply').boundingBox()).height >= 44);
        const nativeChoice = (value) => dialog.locator(`.dn-desktop-choice input[value="${value}"]`);
        await nativeChoice('Audi').check();
        assert.equal(await dialog.locator('input[type=hidden][name=make]').inputValue(), 'Audi');
        assert.equal((await dialog.boundingBox()).height, frame.height);
        assert.equal((await dialog.locator('.dn-search-footer').boundingBox()).y, footer.y);
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });
        assert.equal(new URL(page.url()).searchParams.get('make'), null, 'Escape discards the entire draft');
        assert.equal(await form.locator('[data-facet=make]').evaluate(el => el === document.activeElement), true);
        await form.locator('[data-facet=make]').click();
        await nativeChoice('BMW').check();
        await dialog.getByRole('button', { name: 'Затворете избора', exact: true }).click();
        await dialog.waitFor({ state: 'hidden' });
        assert.equal(new URL(page.url()).searchParams.get('make'), null, 'Close discards changes');
        await form.locator('[data-facet=model]').click();
        await dialog.getByRole('searchbox').fill('RS6');
        assert(await nativeChoice('RS 6 Avant').isVisible(), 'Compact model names tolerate spacing');
        await dialog.getByRole('searchbox').fill('coupe');
        assert(await nativeChoice('GLE Coupé').isVisible(), 'Model search tolerates accents');
        await nativeChoice('GLE Coupé').check();
        if (width === 1440) {
          await page.setViewportSize({ width, height: 400 });
          await dialog.waitFor({ state: 'hidden' });
          await form.locator('[data-facet=model]').click();
          await dialog.waitFor({ state: 'visible' });
          await dialog.getByRole('searchbox').fill('coupe');
          await nativeChoice('GLE Coupé').check();
          await dialog.getByRole('searchbox').fill('');
          await page.waitForFunction(() => {
            const frame = document.querySelector('.dn-search-popover').getBoundingClientRect();
            return frame.y >= 15 && frame.bottom <= innerHeight - 15;
          });
          const shortFrame = await dialog.boundingBox();
          assert(shortFrame.y >= 15 && shortFrame.y + shortFrame.height <= 385);
          const shortFooter = await dialog.locator('.dn-search-footer').boundingBox();
          assert(shortFooter.y + shortFooter.height <= 385, 'Apply stays visible in a short window');
          const shortSearch = await dialog.getByRole('searchbox').boundingBox();
          assert(shortSearch.y + shortSearch.height < shortFooter.y, 'The search field cannot overlap the footer');
          assert(await dialog.locator('.dn-search-results').evaluate(el => el.clientHeight >= 44 && el.scrollHeight > el.clientHeight), 'A short menu keeps a usable scrollable choice area');
          await page.setViewportSize({ width, height: 900 });
        }
        await dialog.locator('.dn-search-apply').click();
        await page.waitForURL(url => url.searchParams.get('model') === 'GLE Coupé');
        assert.equal(new URL(page.url()).searchParams.get('make'), null, 'Models chosen under All brands keep other brands available');
        await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
        await form.locator('.dn-discovery__keyword').click();
        assert.equal(await dialog.getAttribute('data-compact'), null, 'Listing search uses Home\'s native search form');
        assert.equal(await dialog.locator('[data-command-input]').count(), 0);
        const keywordFields = await dialog.locator('.dn-listing-filter__core-grid > label, .dn-listing-filter__core-grid > .dn-identity-field').evaluateAll(fields => fields.map(field => ({
          top: field.getBoundingClientRect().top,
          height: field.getBoundingClientRect().height,
          controlHeight: field.querySelector('button, select')?.getBoundingClientRect().height
        })));
        assert.equal(keywordFields.length, 13);
        assert(keywordFields.every(field => field.controlHeight >= 44), 'The restored form keeps every field at the standard control height');
        assert(Math.max(...keywordFields.slice(0, 4).map(field => field.top)) - Math.min(...keywordFields.slice(0, 4).map(field => field.top)) < 1, 'The first keyword row shares its label baseline');
        assert(Math.max(...keywordFields.map(field => field.height)) - Math.min(...keywordFields.map(field => field.height)) < 1, 'All shared pickers align at the same height');
        await dialog.getByRole('searchbox').fill('BMW');
        assert.match(await dialog.locator('.dn-listing-filter__dialog-submit').innerText(), /2/, 'Typing a keyword directly updates its results');
        await dialog.locator('.dn-listing-filter__dialog-submit').click();
        await page.waitForURL(url => url.searchParams.get('q') === 'BMW');
        assert.equal(new URL(page.url()).searchParams.get('make'), null, 'Searching applies the explicit keyword');
        await form.locator('.dn-discovery__keyword').click();
        assert.equal(await dialog.getByRole('searchbox').inputValue(), 'BMW', 'Reopening search keeps its applied keyword');
        await dialog.getByRole('searchbox').fill('Audi');
        await page.keyboard.press('Escape');
        assert.equal(new URL(page.url()).searchParams.get('q'), 'BMW', 'Escape discards the search draft');
        await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
        await form.locator('.dn-discovery__keyword').click();
        const searchIdentity = async (field, value) => {
          await dialog.locator(`[data-field=${field}] button`).click();
          await page.locator(`.dn-filter-picker input[value="${value}"]`).click();
          await page.keyboard.press('Escape');
          await page.locator('.dn-filter-picker').waitFor({ state: 'hidden' });
        };
        await searchIdentity('make','BMW');
        await dialog.locator('[data-field=model] button').click();
        assert.equal(await page.locator('.dn-filter-picker input[value="RS 6 Avant"]').count(), 0, 'Model choices respect the draft brands');
        await page.locator('.dn-filter-picker input[value="X6 M Sport"]').check();
        await page.keyboard.press('Escape');
        await searchIdentity('make','Audi');
        await searchIdentity('make','BMW');
        assert.equal(await dialog.locator('input[name=model]').count(), 0, 'Removing a brand clears incompatible models');
        if (width === 1440) await dialog.screenshot({ path: `${output}/cars-search-menu.png` });
        await dialog.locator('.dn-listing-filter__dialog-submit').click();
        await page.waitForURL(url => appPath(url) === '/listing-grid' && url.searchParams.get('make') === 'Audi');
        assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
        await form.locator('[data-facet=price]').click();
        await dialog.getByRole('spinbutton', { name: 'Цена от · €', exact: true }).fill('90000');
        await dialog.getByRole('spinbutton', { name: 'Цена до · €', exact: true }).fill('50000');
        assert.equal(await dialog.locator('.dn-search-apply').isEnabled(), false);
        await dialog.locator('.dn-search-reset').click();
        assert.equal(await dialog.locator('.dn-search-apply').isEnabled(), true);
        await dialog.locator('.dn-search-apply').click();
        await page.waitForURL(url => appPath(url) === '/listing-grid' && url.searchParams.get('make') === 'Audi');
        assert.equal(new URL(page.url()).searchParams.has('dn-picker-choice'), false);
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
        await page.waitForFunction(() => document.querySelector('#dn-listing-dialog-query') === document.activeElement);
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
      if (width === 1440) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
        const brands = ['Audi','BMW'], models = ['RS Q8','X6 M Sport'];
        if (route === '/') {
          for (const [field, values] of [['make', brands], ['model', models]]) {
            await form.locator(`[data-field=${field}] button`).click();
            for (const value of values) await page.locator(`.dn-filter-picker input[value="${value}"]`).check();
            await page.keyboard.press('Escape');
          }
          await form.locator('.dn-discovery__submit').click();
          await page.waitForURL(url => url.searchParams.getAll('model').length === 2);
        } else {
          for (const [field, values] of [['make', brands], ['model', models]]) {
            await form.locator(`[data-facet=${field}]`).click();
            for (const value of values) await page.locator(`#dn-listing-filter-dialog .dn-desktop-choice input[value="${value}"]`).check();
            await page.locator('#dn-listing-filter-dialog .dn-search-apply').click();
            await page.waitForURL(url => url.searchParams.getAll(field).length === 2);
          }
        }
        assert.deepEqual(new URL(page.url()).searchParams.getAll('make'), brands);
        assert.deepEqual(new URL(page.url()).searchParams.getAll('model'), models);
        assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2, 'Both chosen models reach desktop results');
        await form.locator('.dn-discovery__keyword').click();
        const multiSearch = page.locator('#dn-listing-filter-dialog');
        for (const [field, values] of [['make', brands], ['model', models]]) {
          assert.deepEqual(await multiSearch.locator(`input[type=hidden][name=${field}]`).evaluateAll(inputs => inputs.map(input => input.value)), values, 'Search preserves repeated applied selections');
          await multiSearch.locator(`[data-field=${field}] button`).click();
          for (const value of values) assert(await page.locator(`.dn-filter-picker input[value="${value}"]`).isChecked());
          await page.keyboard.press('Escape');
          assert(await multiSearch.isVisible(), 'Escape closes the nested picker and retains native search');
        }
        await multiSearch.locator('.dn-listing-filter__dialog-submit').click();
        await page.waitForLoadState('networkidle');
        assert.deepEqual(new URL(page.url()).searchParams.getAll('make'), brands);
        assert.deepEqual(new URL(page.url()).searchParams.getAll('model'), models, 'Native search GET preserves both models without duplication');
        assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
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
