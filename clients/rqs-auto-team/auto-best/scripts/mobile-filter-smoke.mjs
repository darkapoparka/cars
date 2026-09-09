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
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/listing-grid?sort=price-asc`, { waitUntil: 'networkidle' });
    const main = page.locator('#dn-listing-filter-dialog');
    const picker = page.locator('#dn-dialog-choice');
    const trigger = page.locator('.dn-listing-filter__toggle');
    await trigger.click();
    await main.waitFor({ state: 'visible' });
    const bounds = await main.boundingBox();
    assert.deepEqual(bounds, { x: 0, y: 0, width, height }, 'Main filters must fill the viewport');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).overflowY), 'hidden', 'Only modal content should scroll');
    assert.equal(await main.locator('select:visible').count(), 0, 'Mobile must use picker rows, not native dropdowns');
    const query = main.locator('input[name=q]');
    await query.fill('123');
    const submit = main.locator('.dn-listing-filter__dialog-submit');
    assert.equal(await submit.isDisabled(), true);
    assert.match(await submit.innerText(), /Покажи 0/);
    assert.equal(await main.locator('.dn-listing-filter__clear').innerText(), 'Изчисти');
    const textHeight = await submit.locator('span').evaluate(el => el.getBoundingClientRect().height);
    assert(textHeight <= 25, 'Zero-results action must stay on one line');
    await page.screenshot({ path: `${output}/zero-${width}.png` });
    await query.fill('');

    for (const title of ['Марка', 'Модел', 'Купе', 'Бюджет', 'Година', 'Гориво', 'Пробег', 'Скорости', 'Версия', 'Състояние', 'Екстри']) {
      const row = main.locator('.dn-mobile-filter-fields button').filter({ has: page.getByText(title, { exact: true }) });
      await row.click();
      await picker.waitFor({ state: 'visible' });
      assert.equal(await picker.locator('h2').innerText(), title);
      assert.deepEqual(await picker.boundingBox(), { x: 0, y: 0, width, height });
      assert.equal(await picker.locator('select').count(), 0);
      await page.keyboard.press('Escape');
      await picker.waitFor({ state: 'hidden' });
      assert.equal(await main.isVisible(), true);
      assert.equal(await row.evaluate(el => el === document.activeElement), true);
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).position), 'fixed');
    }
    const row = title => main.locator('.dn-mobile-filter-fields button').filter({ has: page.getByText(title, { exact: true }) });
    await row('Марка').click();
    await picker.getByRole('searchbox', { name: 'Търси марка', exact: true }).fill('audi');
    await picker.getByRole('radio', { name: 'Audi', exact: true }).check();
    await picker.getByRole('button', { name: 'Приложи', exact: true }).click();
    await picker.waitFor({ state: 'hidden' });
    assert.equal(new URL(page.url()).searchParams.has('make'), false, 'Picker apply must only update the draft');
    assert.match(await row('Марка').innerText(), /Audi/);
    await row('Модел').click();
    assert.equal(await picker.getByRole('radio').count(), 3, 'Models must use the draft make');
    await picker.getByRole('radio', { name: 'RS Q8', exact: true }).check();
    await picker.getByRole('button', { name: 'Приложи', exact: true }).click();
    await row('Марка').click();
    await picker.getByRole('radio', { name: 'BMW', exact: true }).check();
    await picker.getByRole('button', { name: 'Затвори избора', exact: true }).click();
    assert.match(await row('Марка').innerText(), /Audi/, 'Cancel must retain the previous draft');
    assert.match(await row('Модел').innerText(), /RS Q8/);
    await row('Бюджет').click();
    await picker.locator('input[name=price_min]').fill('55001');
    await picker.locator('input[name=price_max]').fill('90001');
    await picker.getByRole('button', { name: 'Приложи', exact: true }).click();
    assert.equal(await main.locator('select[name=price_min]').inputValue(), '55001');
    await row('Година').click();
    await picker.locator('input[name=year_min]').fill('2019');
    await picker.locator('input[name=year_max]').fill('2024');
    await picker.getByRole('button', { name: 'Приложи', exact: true }).click();
    await row('Екстри').click();
    await picker.getByRole('checkbox', { name: '4x4', exact: true }).check();
    await picker.getByRole('button', { name: 'Приложи', exact: true }).click();
    assert.equal(await main.locator('input[name=equipment][value="4x4"]').isChecked(), true);
    await page.screenshot({ path: `${output}/draft-${width}.png` });
    assert.equal(await submit.isEnabled(), true);
    await submit.click();
    await page.waitForURL(url => url.searchParams.get('model') === 'RS Q8');
    const params = new URL(page.url()).searchParams;
    assert.equal(params.get('make'), 'Audi');
    assert.equal(params.get('price_min'), '55001');
    assert.equal(params.get('price_max'), '90001');
    assert.equal(params.get('year_min'), '2019');
    assert.equal(params.get('year_max'), '2024');
    assert.equal(params.get('equipment'), '4x4');
    assert.equal(params.get('sort'), 'price-asc');
    assert.deepEqual(errors, []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);
    results.push({ width, height, passed: true });
    await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2));
    console.log(`PASS full-screen mobile filters, nested choices, draft and URL at ${width}x${height}`);
    await page.close();
  }
} catch (error) {
  results.push({ passed: false, error: error.stack });
  throw error;
} finally {
  await browser.close();
  await writeFile(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
}
