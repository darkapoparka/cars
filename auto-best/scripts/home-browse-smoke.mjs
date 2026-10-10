import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { webkit } from 'playwright';
import { launchBrowser, previewUrl } from './browser.mjs';
import { appPath, returningContext } from './locale-smoke-fixture.mjs';

export async function verifyHomeBrowse(page, locale = 'bg') {
  const form = page.locator('.dn-home-browse');
  const field = name => form.locator(`[data-field="${name}"]`);
  const menu = page.locator('.dn-home-browse-picker[data-state=open]');
  const save = () => menu.locator('.dn-home-browse-picker__save').click();
  const clear = () => menu.getByRole('button', { name: locale === 'bg' ? 'Изчисти' : 'Clear', exact: true }).click();
  const choice = value => menu.getByRole('checkbox', { name: value, exact: true });
  const chooseModel = async value => {
    if (page.viewportSize().width >= 992) await menu.getByRole('searchbox').fill(value);
    await choice(value).check();
  };
  const values = name => form.locator(`input[type=hidden][name="${name}"]`).evaluateAll(inputs => inputs.map(input => input.value));
  const open = async name => {
    await field(name).click();
    await menu.waitFor({ state: 'visible' });
    await page.waitForFunction(() => document.activeElement === document.querySelector('.dn-home-browse-picker[data-state=open]'));
    await page.waitForFunction(() => {
      const picker = document.querySelector('.dn-home-browse-picker[data-state=open]');
      if (!picker) return false;
      const box = picker.getBoundingClientRect();
      return box.width > 0 && box.x >= 15 && box.y >= 15 && box.right <= innerWidth - 15 && box.bottom <= innerHeight - 15;
    }, undefined, { timeout: 5000 });
    assert.notEqual(await field(name).evaluate(button => getComputedStyle(button).backgroundColor), 'rgba(0, 0, 0, 0)', 'An open selector retains its rounded surface');
    const frame = await menu.boundingBox();
    const viewport = page.viewportSize();
    assert(frame.x >= 15 && frame.y >= 15 && frame.x + frame.width <= viewport.width - 15 && frame.y + frame.height <= viewport.height - 15, 'A selector and its footer must fit inside the viewport');
    if (viewport.width >= 992) {
      const bar = await form.boundingBox();
      const gap = (await menu.getAttribute('data-side')) === 'top'
        ? bar.y - frame.y - frame.height : frame.y - bar.y - bar.height;
      assert(Math.abs(gap - 8) <= 1, 'Desktop selectors have an 8px visible gap from the complete search bar, including collision flips');
      assert.equal(frame.width, name === 'make' ? bar.width : name === 'model' ? 640 : 480, 'Make follows the full Buy bar; selected-brand models and other facets retain their compact widths');
      assert.equal(await menu.getAttribute('data-desktop-panel'), 'true');
      assert(await menu.locator('.dn-home-browse-picker__count').isVisible(), 'Every selector shows the pending result count');
      const tiles = await menu.locator('.dn-desktop-choice').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width));
      assert(tiles.every(width => width <= frame.width / 2), 'All and filtered choices retain compact tiles');
      if (name === 'make') {
        const logoTiles = await menu.locator('.dn-desktop-choice--portrait').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()));
        assert.equal(logoTiles.length, tiles.length, 'Every make, including All makes, uses the logo grid');
        assert(logoTiles.every(box => box.width <= frame.width / 6 && box.height >= 112), 'Six-column brand tiles retain room for logos, labels and stock counts');
        await page.waitForFunction(() => [...document.querySelectorAll('.dn-home-browse-picker[data-state=open] .dn-make-logo img')].every(img => img.complete && img.naturalWidth > 0));
      }
      if (await menu.getByRole('searchbox').count()) {
        const heading = await menu.getByRole('heading').boundingBox();
        const search = await menu.getByRole('searchbox').boundingBox();
        const close = await menu.locator('.dn-picker-close').boundingBox();
        assert(heading.width <= 1 || heading.width === 44 && await menu.locator('.back').count() === 1, 'Only the Back icon can occupy the title area beside search');
        assert(search.width >= (name === 'make' ? 680 : name === 'model' ? 480 : 340), 'Search retains room without a competing visible title');
        assert(Math.abs(search.y + search.height / 2 - close.y - close.height / 2) < 1, 'Search and close are vertically aligned');
      }
    }
  };
  const dismiss = async name => {
    await menu.getByRole('searchbox').press('Escape');
    await menu.waitFor({ state: 'hidden' });
    await page.waitForFunction(name => document.querySelector(`.dn-home-browse [data-field="${name}"]`) === document.activeElement, name);
  };

  await open('make');
  assert.equal(await menu.evaluate(node => node === document.activeElement), true, 'Pointer opening leaves the search input neutral');
  await page.keyboard.press('Escape');
  await menu.waitFor({ state: 'hidden' });
  await field('make').press('Enter');
  await menu.waitFor({ state: 'visible' });
  await page.waitForFunction(() => document.activeElement === document.querySelector('.dn-home-browse-picker[data-state=open] input[type=search]'));
  assert.equal(await menu.getByRole('searchbox').evaluate(input => input === document.activeElement), true, 'Keyboard opening enters search');
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
  assert.equal(await menu.evaluate(node => node === document.activeElement), true, 'Pointer switching keeps the new input neutral');
  assert.deepEqual(await values('price_max'), [], 'Switching fields discards the previous editor draft');
  assert.equal(await choice('X6 M Sport').count(), 0, 'Models follow the saved makes');
  await chooseModel('RS 6 Avant');
  if (page.viewportSize().width >= 992) assert.equal((await menu.locator('.dn-home-browse-picker__save').innerText()).replace(/\s+/g, ' ').trim(), locale === 'bg' ? 'Запазете (1)' : 'Save (1)', 'The compact Home label follows the pending model before Save');
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
  await chooseModel('RS 6 Avant');
  await save();

  await open('body');
  await menu.locator('input[type=radio][name=body][value=SUV]').check();
  assert.deepEqual(await values('body'), [], 'Body style stays pending until Save');
  await dismiss('body');
  assert.deepEqual(await values('body'), [], 'Escape discards a pending body style');
  await open('body');
  await menu.locator('input[type=radio][name=body][value=Wagon]').check();
  await save();
  assert.deepEqual(await values('body'), ['Wagon']);
  await open('body');
  await clear();
  await save();
  assert.deepEqual(await values('body'), [], 'Clear restores every body style');
  await open('body');
  await menu.locator('input[type=radio][name=body][value=Wagon]').check();
  await save();
  const savedBodySummary = await field('body').locator('.dn-home-browse__value').innerText();

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
  assert.equal(await menu.locator('.dn-home-browse-picker__save').isEnabled(), false);
  assert.equal(await menu.getByRole('alert').count(), 1, 'An invalid range is explained before it can be saved');
  await clear();
  await maximum.fill('80000');
  await save();
  assert.deepEqual(await values('price_min'), []);
  assert.deepEqual(await values('price_max'), ['80000']);
  assert.equal(await field('body').locator('.dn-home-browse__value').innerText(), savedBodySummary, 'Saving Budget preserves the Body style label');

  await form.getByRole('button', { name: locale === 'bg' ? 'Търсете' : 'Search', exact: true }).press('Enter');
  await page.waitForURL(url => appPath(url.href) === '/cars');
  const params = new URL(page.url()).searchParams;
  assert.deepEqual(params.getAll('make'), ['Audi']);
  assert.deepEqual(params.getAll('model'), ['RS 6 Avant']);
  assert.equal(params.get('body'), 'Wagon');
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
      assert.equal(geometry.length, 5);
      for (const button of geometry) {
        assert(button.width >= 44 && button.height >= 44, 'Every part of the bar remains a complete click target');
        assert(Math.abs(button.y - geometry[0].y) < 1, 'Desktop fields and search remain in one row');
      }
      assert.equal(await page.locator('.dn-search__desktop-form select').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      const fields = form.locator('[data-field]');
      assert.deepEqual(await fields.evaluateAll(buttons => buttons.map(button => getComputedStyle(button).backgroundColor)), Array(4).fill('rgba(0, 0, 0, 0)'), 'The resting bar is one white surface');
      await fields.first().hover();
      assert.notEqual(await fields.first().evaluate(button => getComputedStyle(button).backgroundColor), 'rgba(0, 0, 0, 0)', 'Hover reveals the rounded field surface');
      await page.mouse.move(0, 0);
      if (width >= 992) {
        const cars = await page.locator('.dn-hero .dn-campaign-vehicles__car').evaluateAll(elements => elements.map(car => {
          const style = getComputedStyle(car), box = car.getBoundingClientRect();
          const scale = box.height / parseFloat(style.getPropertyValue('--art-height-ratio'));
          return { height: scale * parseFloat(style.getPropertyValue('--art-body-height-ratio')), bottom: box.y + scale * parseFloat(style.getPropertyValue('--art-bottom-ratio')) };
        }));
        assert(Math.abs(cars[0].height - cars[1].height) < 1, 'Home cars have balanced painted heights');
        assert(Math.abs(cars[0].bottom - cars[1].bottom) < 1, 'Home tyres share one baseline');
      }
      await verifyHomeBrowse(page, locale);
      assert.deepEqual(errors, []);
      results.push({ engine, locale, width, height, passed: true });
      await context.close();
      console.log(`PASS ${locale} ${width}: make/model/body drafts, budget validation, surfaces, hero, keyboard, GET and result`);
    }
    await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
}
