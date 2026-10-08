import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';

const base = previewUrl();
const output = 'artifacts/mobile-filter-smoke';
await mkdir(output, { recursive: true });
const browser = await launchBrowser();
const results = [];
try {
  for (const [width, height] of [[320, 677], [390, 844], [430, 932], [700, 390]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(60000);
    await page.context().addCookies([
      { name: 'cars_prompt', value: 'v1', url: base },
      { name: 'cars_locale', value: 'bg', url: base }
    ]);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/listing-grid?sort=price-asc`, { waitUntil: 'networkidle' });
    const main = page.locator('#dn-listing-filter-dialog');
    const picker = main.locator('.dn-mobile-filter-editor');
    const trigger = page.locator('.dn-listing-filter__toggle');
    const row = field => main.locator(`.dn-mobile-filter-fields button[data-field="${field}"]`);
    const save = main.getByRole('button', { name: 'Запазете', exact: true });
    const back = main.getByRole('button', { name: 'Назад към филтрите', exact: true });
    const overview = main.locator('.overview');
    const submit = main.locator('.dn-listing-filter__dialog-submit');
    const query = main.locator('input[name=q]');
    await trigger.click();
    await main.waitFor({ state: 'visible' });
    const viewportBounds = await page.evaluate(() => ({ x: 0, y: 0, width: document.body.getBoundingClientRect().width, height: innerHeight }));
    assert.deepEqual(await main.boundingBox(), viewportBounds, 'The stationary dialog frame follows the viewport');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).overflowY), 'hidden');
    assert.equal(await main.locator('select:visible').count(), 0);
    assert.equal(await main.locator('.dn-mobile-filter-fields button').count(), 12, 'Every criterion is available without category navigation');
    assert.equal(await main.locator('.dn-mobile-filter-categories').count(), 0);
    assert(await main.locator('.dn-mobile-filter-fields button').evaluateAll(buttons => buttons.every(button => button.getBoundingClientRect().height >= 48)), 'Every filter has a full-height touch target');
    const panel = await main.locator('form').boundingBox();
    assert(Math.abs(panel.y) <= 1 && Math.abs(panel.height - height) <= 1, 'The filter editor fills the mobile viewport from the top');
    if (width === 390 || width === 430) assert(await overview.evaluate(el => el.scrollHeight <= el.clientHeight + 1), 'All criteria fit the normal phone overview');
    assert.equal(await main.locator('.dn-listing-filter__clear').isDisabled(), true);
    await query.fill('Audi');
    await main.locator('.dn-listing-filter__clear').click();
    assert.equal(await main.isVisible(), true);
    assert.equal(await query.inputValue(), '');
    await query.fill('123');
    assert.equal(await submit.isDisabled(), true);
    assert.match(await submit.innerText(), /Покажи \(0\)/);
    assert(await submit.evaluate(el => el.scrollWidth <= el.clientWidth), 'The count must fit inside its action');
    await page.screenshot({ path: `${output}/zero-${width}.png` });
    await query.fill('');

    for (const [field, title] of [['type','Тип'],['make','Марка'],['model','Модел'],['body','Купе'],['price','Бюджет'],['year','Година'],['fuel','Гориво'],['mileage_max','Пробег'],['transmission','Скорости'],['version','Версия'],['condition','Състояние'],['equipment','Екстри']]) {
      await row(field).click();
      await picker.waitFor({ state: 'visible' });
      assert.equal(await main.locator('h2').innerText(), title);
      assert.equal(await page.locator('dialog[open]').count(), 1, 'A facet replaces the overview inside one dialog');
      assert.equal(await main.locator('.overview').count(), 0);
      const header = await main.locator('header').evaluate(el => {
        const title = el.querySelector('h2').getBoundingClientRect();
        const back = el.querySelector('.back').getBoundingClientRect(), close = el.querySelector('.dn-overlay-close').getBoundingClientRect();
        const buttons = [...el.querySelectorAll('button')].map(button => ({ width: button.getBoundingClientRect().width, text: button.textContent.trim() }));
        return { titleClearsControls: title.left >= back.right && title.right <= close.left, buttons };
      });
      assert(header.titleClearsControls, `${field}: the title clears Back and Close`);
      assert(header.buttons.every(button => button.width === 44 && !button.text), 'Back and Close are equal-size icon actions');
      if (!['make','model','price','year','mileage_max','equipment'].includes(field)) assert.equal(await main.locator('footer').count(), 0, 'Single choices need no second Apply step');
      if (['price','year','mileage_max'].includes(field)) {
        assert(await picker.locator('.content').evaluate(el => el.scrollHeight <= el.clientHeight + 1), 'Range controls and every preset fit when the viewport has enough room');
        const preset = picker.locator('.presets button').first();
        await preset.click();
        assert.equal(await preset.getAttribute('aria-pressed'), 'true');
        assert(await picker.locator(`input[name=${field === 'price' ? 'price_max' : field === 'year' ? 'year_min' : 'mileage_max'}]`).inputValue(), 'A preset fills its numeric criterion');
      }
      await page.keyboard.press('Escape');
      await picker.waitFor({ state: 'hidden' });
      assert.equal(await main.isVisible(), true, `Escape from ${field} must return to the overview`);
      await page.waitForFunction(field => document.activeElement?.matches(`.dn-mobile-filter-fields button[data-field="${field}"]`), field);
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).position), 'fixed');
    }
    // Multiple choices stay open until Save, including the All reset choice.
    await row('make').click();
    await picker.getByRole('checkbox', { name: 'Всички', exact: true }).click();
    assert(await picker.isVisible());
    await save.click();
    await picker.waitFor({ state: 'hidden' });
    await row('make').click();
    await picker.getByRole('searchbox', { name: 'Търсете марка', exact: true }).fill('audi');
    await picker.getByRole('checkbox', { name: 'Audi', exact: true }).check();
    assert(await picker.isVisible());
    await save.click();
    await picker.waitFor({ state: 'hidden' });
    assert.equal(new URL(page.url()).searchParams.has('make'), false, 'One tap edits the draft only');
    assert.match(await row('make').innerText(), /Audi/);
    await row('model').click();
    assert.equal(await picker.getByRole('checkbox').count(), 3, 'Models use the draft make');
    await picker.getByRole('checkbox', { name: 'RS Q8', exact: true }).check();
    await save.click();
    await picker.waitFor({ state: 'hidden' });
    await row('make').click();
    await picker.getByRole('searchbox').fill('BMW');
    await picker.getByRole('checkbox', { name: 'BMW', exact: true }).check();
    await back.click();
    assert.match(await row('make').innerText(), /Audi/, 'Back discards an unfinished choice');
    assert.match(await row('model').innerText(), /RS Q8/);
    // Cancel a changed numeric pane, then save exact values without rounding.
    await row('price').click();
    await picker.locator('input[name=price_min]').fill('55001');
    await back.click();
    assert.equal(await main.locator('input[type=hidden][name=price_min]').count(), 0);
    await row('price').click();
    await picker.locator('input[name=price_min]').fill('90001');
    await picker.locator('input[name=price_max]').fill('55001');
    assert.equal(await save.isDisabled(), true);
    await picker.locator('input[name=price_min]').fill('55001');
    await picker.locator('input[name=price_max]').fill('90001');
    await save.click();
    await picker.waitFor({ state: 'hidden' });
    assert.equal(await main.locator('input[type=hidden][name=price_min]').inputValue(), '55001');
    await row('year').click();
    await picker.locator('input[name=year_min]').fill('2019');
    await picker.locator('input[name=year_max]').fill('2024');
    await save.click();
    await picker.waitFor({ state: 'hidden' });
    await row('equipment').click();
    await picker.getByRole('checkbox', { name: '4x4', exact: true }).check();
    await save.click();
    await picker.waitFor({ state: 'hidden' });
    assert.match(await row('equipment').innerText(), /1/);
    assert.match(await row('model').innerText(), /RS Q8/, 'Other panes preserve earlier choices');
    await page.screenshot({ path: `${output}/draft-${width}.png` });
    await submit.click();
    await page.waitForURL(url => url.searchParams.get('model') === 'RS Q8');
    const params = new URL(page.url()).searchParams;
    for (const [key,value] of [['make','Audi'],['price_min','55001'],['price_max','90001'],['year_min','2019'],['year_max','2024'],['equipment','4x4'],['sort','price-asc']]) {
      assert.equal(params.get(key), value);
      assert.equal(params.getAll(key).length, 1, 'GET values must not be duplicated');
    }
    // Closing the entire sheet discards edits; reopening starts from the applied URL.
    await trigger.click();
    await row('make').click();
    await picker.getByRole('checkbox', { name: 'BMW', exact: true }).check();
    await picker.getByRole('checkbox', { name: 'Audi', exact: true }).uncheck();
    await save.click();
    await picker.waitFor({ state: 'hidden' });
    assert.doesNotMatch(await row('model').innerText(), /RS Q8/, 'Changing make clears its dependent model');
    await main.getByRole('button', { name: 'Затворете филтрите', exact: true }).click();
    await trigger.click();
    assert.match(await row('make').innerText(), /Audi/);
    assert.match(await row('model').innerText(), /RS Q8/);
    await page.keyboard.press('Escape');
    await main.waitFor({ state: 'hidden' });
    await page.waitForFunction(() => document.activeElement?.matches('.dn-listing-filter__toggle'));
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).position), 'fixed');
    // Search targets its input directly, and its clear control retains focus.
    const searchTrigger = page.locator('.dn-listing-filter__mobile-keyword');
    await searchTrigger.click();
    await page.waitForFunction(() => document.activeElement?.id === 'dn-listing-dialog-query');
    await query.fill('Audi');
    await main.getByRole('button', { name: 'Изчистете търсенето', exact: true }).click();
    assert.equal(await query.inputValue(), '');
    await page.waitForFunction(() => document.activeElement?.id === 'dn-listing-dialog-query');
    await page.keyboard.press('Escape');
    await main.waitFor({ state: 'hidden' });
    await page.waitForFunction(() => document.activeElement?.matches('.dn-listing-filter__mobile-keyword'));
    // Standalone shortcuts share the editor but apply directly to the URL.
    const shortcuts = page.locator('.dn-listing-filter__quick');
    const quick = page.locator('#dn-quick-filter');
    for (const title of ['Тип','Марка','Модел','Бюджет','Година','Купе','Гориво','Скорости','Пробег','Версия','Състояние','Екстри']) {
      const shortcut = shortcuts.getByRole('button', { name: title, exact: true });
      await shortcut.click();
      await quick.getByRole('heading', { name: title, exact: true }).waitFor({ state: 'visible' });
      assert.equal(await quick.locator('h2').innerText(), title, 'Each shortcut opens its own control directly');
      assert.equal(await page.locator('dialog[open]').count(), 1);
      await page.keyboard.press('Escape');
      await quick.waitFor({ state: 'hidden' });
      await page.waitForFunction(el => document.activeElement === el, await shortcut.elementHandle());
    }
    await shortcuts.getByRole('button', { name: 'Марка', exact: true }).click();
    const openingHeight = await quick.locator('form').evaluate(el => el.getBoundingClientRect().height);
    await quick.getByRole('searchbox').fill('zzzzzz');
    assert.equal(await quick.locator('form').evaluate(el => el.getBoundingClientRect().height), openingHeight, 'Suggestion search retains the opening list space');
    await page.keyboard.press('Escape');
    await quick.waitFor({ state: 'hidden' });
    assert.equal(new URL(page.url()).searchParams.get('make'), 'Audi');
    await shortcuts.getByRole('button', { name: 'Бюджет', exact: true }).click();
    await quick.locator('input[name=price_max]').fill('100001');
    await quick.getByRole('button', { name: 'Приложи', exact: true }).click();
    await page.waitForURL(url => url.searchParams.get('price_max') === '100001');
    const directParams = new URL(page.url()).searchParams;
    for (const [key,value] of [['make','Audi'],['model','RS Q8'],['price_min','55001'],['year_min','2019'],['year_max','2024'],['equipment','4x4'],['sort','price-asc']]) {
      assert.equal(directParams.get(key), value, 'A direct shortcut retains unrelated applied criteria');
      assert.equal(directParams.getAll(key).length, 1);
    }
    // Multiple brands/models persist through application, reopening and individual chip removal.
    await page.goto(`${base}/bg/listing-grid?sort=price-asc`, { waitUntil: 'networkidle' });
    await trigger.click();
    await row('make').click();
    await picker.getByRole('checkbox', { name: 'Audi', exact: true }).check();
    await picker.getByRole('checkbox', { name: 'BMW', exact: true }).check();
    await save.click();
    await row('model').click();
    assert.equal(await picker.getByRole('checkbox').count(), 5, 'Model options combine both selected brands');
    await picker.getByRole('checkbox', { name: 'RS Q8', exact: true }).check();
    await picker.getByRole('checkbox', { name: 'X6 M Sport', exact: true }).check();
    await save.click();
    await submit.click();
    await page.waitForURL(url => url.searchParams.getAll('model').length === 2);
    const multiParams = new URL(page.url()).searchParams;
    assert.deepEqual(multiParams.getAll('make'), ['Audi', 'BMW']);
    assert.deepEqual(multiParams.getAll('model'), ['RS Q8', 'X6 M Sport']);
    assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
    await trigger.click();
    await row('make').click();
    assert(await picker.getByRole('checkbox', { name: 'Audi', exact: true }).isChecked());
    assert(await picker.getByRole('checkbox', { name: 'BMW', exact: true }).isChecked());
    await back.click();
    await row('model').click();
    assert(await picker.getByRole('checkbox', { name: 'RS Q8', exact: true }).isChecked());
    assert(await picker.getByRole('checkbox', { name: 'X6 M Sport', exact: true }).isChecked());
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    const removeAudi = page.locator('.dn-listing-filter__quick a.active').filter({ hasText: /^Audi/ });
    await removeAudi.click();
    await page.waitForURL(url => url.searchParams.getAll('make').length === 1);
    assert.deepEqual(new URL(page.url()).searchParams.getAll('make'), ['BMW']);
    assert.deepEqual(new URL(page.url()).searchParams.getAll('model'), ['X6 M Sport']);
    assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 1);
    // A direct model shortcut also keeps multiple checked values in its GET submission.
    await shortcuts.getByRole('button', { name: 'Модел', exact: true }).click();
    await quick.getByRole('checkbox', { name: 'X6 xDrive', exact: true }).check();
    await quick.getByRole('button', { name: 'Приложи', exact: true }).click();
    await page.waitForURL(url => url.searchParams.getAll('model').length === 2);
    assert.deepEqual(new URL(page.url()).searchParams.getAll('model'), ['X6 M Sport', 'X6 xDrive']);
    assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
    // Home retains its button selectors with an explicit make-to-model step.
    await page.goto(`${base}/bg`, { waitUntil: 'networkidle' });
    const homeTrigger = page.locator('.dn-quick-search__trigger');
    const home = page.locator('#dn-quick-search-dialog');
    const homeRow = view => home.locator(`button[data-view=${view}]`);
    await homeTrigger.click();
    await page.waitForFunction(() => document.activeElement?.id === 'quick-search-input');
    for (const view of ['make','body','price','fuel','mileage','year']) {
      await homeRow(view).click();
      await home.locator('.dn-quick-search__option').first().waitFor({ state: 'visible' });
      assert(await home.locator('.dn-quick-search__option').count(), 'Each Home control opens its own choices');
      await page.keyboard.press('Escape');
      await homeRow(view).waitFor({ state: 'visible' });
      await page.waitForFunction(view => document.activeElement?.matches(`button[data-view=${view}]`), view);
    }
    await homeRow('make').click();
    await home.getByRole('button', { name: 'Audi', exact: true }).click();
    await home.getByRole('button', { name: 'BMW', exact: true }).click();
    assert.equal(await home.getByRole('button', { name: 'Audi', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.equal(await home.getByRole('button', { name: 'BMW', exact: true }).getAttribute('aria-pressed'), 'true');
    await home.locator('.dn-quick-search__mobile-footer .dn-mobile-overlay-action').click();
    assert.equal(await home.locator('h2').innerText(), 'Модел');
    await home.getByRole('button', { name: 'RS Q8', exact: true }).click();
    await home.getByRole('button', { name: 'X6 M Sport', exact: true }).click();
    await home.locator('.dn-quick-search__mobile-footer .dn-mobile-overlay-action').click();
    assert.match(await homeRow('make').innerText(), /Audi, BMW, RS Q8, X6 M Sport/);
    for (const [view, choice] of [['body', /^SUV$/], ['price', /100\s*000/], ['fuel', /^Бензин$/], ['mileage', /100\s*000/], ['year', /2019/]]) {
      await homeRow(view).click();
      await home.locator('.dn-quick-search__option').filter({ hasText: choice }).click();
      await homeRow(view).waitFor({ state: 'visible' });
    }
    await home.locator('#quick-search-input').fill('Audi');
    await home.locator('.dn-quick-search__mobile-footer .dn-mobile-overlay-action').click();
    await page.waitForURL(url => url.searchParams.get('model') === 'RS Q8');
    const homeParams = new URL(page.url()).searchParams;
    for (const [key,value] of [['q','Audi'],['body','SUV'],['price_max','100000'],['fuel','Бензин'],['mileage_max','100000'],['year_min','2019']]) {
      assert.equal(homeParams.get(key), value, 'Home applies the complete selected draft');
      assert.equal(homeParams.getAll(key).length, 1);
    }
    assert.deepEqual(homeParams.getAll('make'), ['Audi', 'BMW']);
    assert.deepEqual(homeParams.getAll('model'), ['RS Q8', 'X6 M Sport']);
    assert.deepEqual(errors, []);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
    results.push({ width, height, passed: true });
    console.log(`PASS mobile inventory/Home filters, direct controls, presets, cancel/save and URL at ${width}x${height}`);
    await page.close();
  }
} catch (error) { results.push({ passed: false, error: error.stack }); throw error; }
finally { await browser.close(); await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2)); }
