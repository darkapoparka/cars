import { appPath, returningPage } from './locale-smoke-fixture.mjs';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
const base = previewUrl();
const output = 'artifacts/desktop-discovery-smoke';
await mkdir(output, { recursive: true });
const browser = await launchBrowser();
const results = [];

async function home(page) {
  const form = page.locator('.dn-discovery');
  const bar = page.locator('.dn-discovery-sticky');
  const submit = form.locator('.dn-discovery__submit');
  assert.equal(await bar.isVisible(), false);
  assert.equal(await submit.innerText(), '');
  assert.equal(await submit.getAttribute('aria-label'), 'Търсете');
  assert.equal((await submit.boundingBox()).width, 48);
  assert.equal(await form.locator('.dn-discovery__filters, .dn-discovery__actions').count(), 0);
  const formHeight = (await form.boundingBox()).height;
  const searchHeight = (await form.locator('.dn-discovery__search').boundingBox()).height;
  assert(formHeight >= searchHeight + 52 && formHeight <= 154);
  assert.equal(await form.locator('.dn-discovery__facets > label').count(), 7);
  const emptyLabels = { type: 'Тип', make: 'Марка', model: 'Модел', body: 'Купе', price_max: 'Бюджет', year_min: 'Година', mileage_max: 'Пробег' };
  for (const label of await form.locator('.dn-discovery__facets > label').all()) {
    const select = label.locator('select');
    assert.equal(await select.locator('option:checked').innerText(), emptyLabels[await select.getAttribute('name')]);
    assert((await label.boundingBox()).height >= 44);
  }
  const widths = await form.locator('.dn-discovery__facets select').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().width));
  assert(Math.max(...widths) - Math.min(...widths) < 1);
  await form.locator('select[name=make]').selectOption('Audi');
  await form.locator('select[name=model]').selectOption({ index: 1 });
  await form.locator('select[name=make]').selectOption('BMW');
  assert.equal(await form.locator('select[name=model]').inputValue(), '');
  await form.locator('select[name=make]').selectOption('Audi');
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  assert.equal(await bar.isVisible(), false, 'Home keeps its existing non-sticky discovery form');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await submit.click();
  await page.waitForURL(url => appPath(url) === '/listing-grid' && url.searchParams.get('make') === 'Audi');
  assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
}

async function listing(page, width) {
  const search = page.locator('.dn-desktop-listing-search');
  const tools = page.locator('.dn-desktop-listing-tools');
  const dialog = page.getByRole('dialog', { name: 'Търсене на автомобили' });
  const opener = search.getByRole('button', { name: 'Марка', exact: true });
  assert.equal(await search.locator('.dn-desktop-listing-search__facets button').count(), 7);
  assert.equal(await page.locator('.dn-discovery-sticky').isVisible(), false);
  const heroHeight = (await page.locator('.dn-listing-stage').boundingBox()).height;
  await opener.click();
  await dialog.waitFor({ state: 'visible' });
  assert.equal(await dialog.getByRole('tab', { name: 'Марка', exact: true }).getAttribute('aria-selected'), 'true');
  await dialog.getByRole('button', { name: 'Audi', exact: true }).click();
  await dialog.getByRole('tab', { name: 'Модел', exact: true }).click();
  await dialog.getByRole('button', { name: 'RS Q8', exact: true }).click();
  await dialog.getByRole('tab', { name: 'Марка', exact: true }).click();
  await dialog.getByRole('button', { name: 'BMW', exact: true }).click();
  assert.equal(await dialog.locator('select[name=model]').inputValue(), '', 'Changing make clears an incompatible model');
  assert.equal(await dialog.getByRole('button', { name: 'Покажете 2 автомобила', exact: true }).filter({ visible: true }).count(), 1);
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Марка');
  assert.equal(new URL(page.url()).search, '', 'Cancel discards the draft');
  await opener.click();
  assert.equal(await dialog.locator('select[name=make]').inputValue(), '');
  await dialog.getByRole('tab', { name: 'Бюджет', exact: true }).click();
  await dialog.getByRole('spinbutton', { name: /Цена от/ }).fill('100000');
  await dialog.getByRole('spinbutton', { name: /Цена до/ }).fill('50000');
  assert.equal(await dialog.locator('.dn-listing-filter__dialog-submit').isEnabled(), false);
  assert(await dialog.getByRole('alert').isVisible());
  await dialog.getByRole('button', { name: 'Изчисти', exact: true }).filter({ visible: true }).click();
  await dialog.getByRole('tab', { name: 'Бюджет', exact: true }).press('ArrowUp');
  assert.equal(await dialog.getByRole('tab', { name: 'Купе', exact: true }).getAttribute('aria-selected'), 'true');
  await dialog.getByRole('tab', { name: 'Марка', exact: true }).click();
  await dialog.getByRole('button', { name: 'BMW', exact: true }).click();
  await dialog.locator('.dn-listing-filter__dialog-submit').click();
  await page.waitForURL(url => url.searchParams.get('make') === 'BMW');
  assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
  assert.equal((await page.locator('.dn-listing-stage').boundingBox()).height, heroHeight, 'Applied chips do not expand the hero');
  await tools.locator('summary').click();
  await tools.getByRole('link', { name: 'Цена: висока към ниска', exact: true }).click();
  await page.waitForURL(url => url.searchParams.get('sort') === 'price-desc');
  assert.equal(new URL(page.url()).searchParams.get('make'), 'BMW', 'Sort preserves filters');
  const titles = await page.locator('.dn-listing-results .dn-vehicle-card h2').allTextContents();
  assert.match(titles[0], /xDrive/);
  await page.evaluate(() => window.scrollTo({ top: 650, behavior: 'instant' }));
  assert(Math.abs((await tools.boundingBox()).y - 12) <= 1, 'The same filter/sort controls remain sticky');
  await tools.locator('summary').click();
  await page.keyboard.press('Escape');
  assert.equal(await tools.locator('details').getAttribute('open'), null);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.getByRole('link', { name: 'Премахнете BMW', exact: true }).filter({ visible: true }).click();
  await page.waitForURL(url => !url.searchParams.has('make'));
  assert.equal(new URL(page.url()).searchParams.get('sort'), 'price-desc');
  assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 7);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: `${output}/listing-${width}.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await tools.isVisible(), false, 'Desktop toolbar is absent on mobile');
  assert.equal(await search.isVisible(), false, 'Mobile keeps its original filters');
}

try {
  for (const width of [1024, 1440, 1920]) {
    for (const route of ['/', '/listing-grid']) {
      const page = await returningPage(browser, { viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      if (route === '/') await home(page);
      else await listing(page, width);
      assert.deepEqual(errors, []);
      results.push({ route, width, passed: true });
      console.log(`PASS desktop discovery ${route} ${width}px`);
      await page.close();
    }
  }
} catch (error) {
  results.push({ passed: false, error: error.stack });
  throw error;
} finally {
  await browser.close();
  await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2));
}
