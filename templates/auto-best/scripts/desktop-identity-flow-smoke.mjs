import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { webkit } from 'playwright';
import { launchBrowser, previewUrl } from './browser.mjs';

const base = previewUrl();
const engine = process.env.IDENTITY_ENGINE || 'chromium';
const output = process.env.IDENTITY_EVIDENCE_DIR || `artifacts/desktop-identity-flow-${engine}`;
const pattern = process.env.IDENTITY_CASE ? new RegExp(process.env.IDENTITY_CASE) : null;
await mkdir(output, { recursive: true });
const browser = engine === 'webkit' ? await webkit.launch({ headless: true }) : await launchBrowser();
const results = [];
try {
  for (const locale of ['bg', 'en']) for (const surface of ['home', 'listing']) for (const [width, height] of [[992, 600], [1440, 900]]) {
    const name = `${locale}-${surface}-${width}`;
    if (pattern && !pattern.test(name)) continue;
    const page = await browser.newPage({ viewport: { width, height }, locale, reducedMotion: 'reduce' });
    await page.context().addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const home = surface === 'home';
    const menu = page.locator(home ? '.dn-home-browse-picker[data-state=open]' : '#dn-listing-filter-dialog');
    const opener = field => page.locator(home ? `.dn-home-browse [data-field=${field}]` : `[data-facet=${field}]`);
    const choice = value => menu.getByRole('checkbox', { name: value, exact: true });
    const applied = async field => home
      ? page.locator(`.dn-home-browse input[type=hidden][name=${field}]`).evaluateAll(inputs => inputs.map(input => input.value))
      : new URL(page.url()).searchParams.getAll(field);
    const open = async (field, keyboard = false) => {
      if (keyboard) await opener(field).press('Enter'); else await opener(field).click();
      await menu.waitFor({ state: 'visible' });
      if (keyboard) await page.waitForFunction(selector => document.querySelector(`${selector} input[role=searchbox], ${selector} input[type=search]`) === document.activeElement,
        home ? '.dn-home-browse-picker[data-state=open]' : '#dn-listing-filter-dialog');
    };
    const cancel = async kind => {
      if (kind === 'escape') await page.keyboard.press('Escape');
      else if (kind === 'close') await menu.locator('.dn-picker-close').click();
      else await page.locator(home ? '#home-hero-title' : '.dn-listing-empty h3').click();
      await menu.waitFor({ state: 'hidden' });
    };
    const apply = async () => {
      await menu.locator(home ? '.dn-home-browse-picker__save' : '.dn-search-apply').click();
      if (home) await menu.waitFor({ state: 'hidden' });
      else await page.waitForURL(url => url.searchParams.get('make') === 'BMW');
    };
    try {
      await page.goto(`${base}/${locale}${home ? '' : '/listing-grid'}`, { waitUntil: 'networkidle' });
      await open('make');
      const makes = await menu.locator('input[type=checkbox]').evaluateAll(inputs => inputs.map(input => input.value).filter(Boolean));
      await open('model');
      assert.deepEqual(await menu.locator('[data-model-make]').evaluateAll(nodes => nodes.map(node => node.dataset.modelMake)), makes, 'Model follows the exact Make catalogue and order');
      assert.equal(await menu.locator('.dn-make-logo img').count(), 162, 'Both brand screens reuse every available official logo');
      await page.waitForFunction(selector => [...document.querySelectorAll(`${selector} .dn-make-logo img`)].every(image => image.complete && image.naturalWidth > 0),
        home ? '.dn-home-browse-picker[data-state=open]' : '#dn-listing-filter-dialog');
      const frame = await menu.boundingBox();
      assert.equal(frame.width, 640, 'Brand logos retain the approved Model width');
      const cards = await menu.locator('[data-model-make]').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()));
      assert(cards.every(box => box.height >= 112 && box.width <= frame.width / 4), 'Logo cards use a readable four-column desktop grid');
      assert.equal(await choice('BMW').count(), 0, 'Model brand cards navigate instead of repeating Make checkboxes');
      await page.screenshot({ path: `${output}/${name}-brands.png` });
      await cancel('close');

      // Pointer and keyboard handoffs keep the same pending Make/Model transaction.
      for (const keyboard of [false, true]) {
        await open('make', keyboard);
        await choice('BMW').check();
        await open('model', keyboard);
        assert.equal(await menu.locator('[data-model-make]').count(), 0, 'A single pending make skips brand selection');
        assert((await menu.getByRole('searchbox').getAttribute('placeholder')).endsWith('BMW…'), 'The search prompt immediately follows the pending brand');
        await menu.locator('[data-model-family="3 Series"]').press('Enter');
        await choice('320').check();
        await open('make', keyboard);
        assert(await choice('BMW').isChecked(), 'Switching back keeps the pending make');
        await open('model', keyboard);
        assert(await choice('320').isChecked(), 'Switching back into Model reveals its retained family and choice');
        assert.deepEqual(await applied('make'), [], 'Handoff does not apply the pending make');
        assert.deepEqual(await applied('model'), [], 'Handoff does not apply the pending model');
        await cancel(keyboard ? 'escape' : 'close');
        await open('model');
        assert.equal(await menu.locator('[data-model-make]').count(), 179, 'Cancel discards the complete pending identity transaction');
        await cancel('close');
      }

      await open('make'); await choice('BMW').check();
      await open('price');
      await open('model');
      assert.equal(await menu.locator('[data-model-make]').count(), 179, 'Unrelated shortcuts start a fresh draft rather than retaining an abandoned brand');
      await cancel('close');

      await open('make');
      await choice('BMW').check(); await choice('Audi').check();
      await open('model');
      assert.deepEqual(await menu.locator('[data-model-make]').evaluateAll(nodes => nodes.map(node => node.dataset.modelMake)), ['Audi', 'BMW'], 'Multiple pending makes show only their logo cards');
      assert.equal(await menu.locator('.dn-make-logo img').count(), 2);
      await menu.locator('[data-model-make="BMW"]').click();
      await menu.locator('[data-model-family="3 Series"]').click();
      await choice('320').check();
      await open('make');
      await choice('BMW').uncheck();
      await open('model');
      assert((await menu.getByRole('searchbox').getAttribute('placeholder')).endsWith('Audi…'), 'Removing one make opens the remaining make directly');
      assert.equal(await menu.locator('[data-model-family="3 Series"]').count(), 0, 'Removing a make also removes its pending models');
      await open('make');
      await choice('Audi').uncheck(); await choice('BMW').check();
      await open('model');
      await menu.locator('[data-model-family="3 Series"]').click();
      assert.equal(await choice('320').isChecked(), false, 'Removed incompatible model choices do not return later');
      await choice('320').check();
      await page.screenshot({ path: `${output}/${name}-pending-model.png` });
      await apply();
      assert.deepEqual(await applied('make'), ['BMW'], 'Save/Show applies the pending make and model together');
      assert.deepEqual(await applied('model'), ['BMW 320']);
      if (home) {
        await page.locator('.dn-home-browse button[type=submit]').click();
        await page.waitForURL(url => url.searchParams.get('model') === 'BMW 320');
      }
      assert.equal(new URL(page.url()).searchParams.has('q'), false, 'Suggestion search does not become the inventory keyword');
      assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 0, 'A selected zero-stock model produces truthful inventory results');

      if (!home) {
        await open('make'); await choice('Audi').check(); await open('model');
        await cancel('outside');
        await open('make');
        assert(await choice('BMW').isChecked());
        assert.equal(await choice('Audi').isChecked(), false, 'Outside dismissal preserves applied identity and discards pending additions');
        await cancel('close');
      }
      assert.deepEqual(errors, []);
      results.push({ name, passed: true });
      console.log(`PASS ${name}: shared logos/order, pointer/keyboard handoff, cancel, multi-make, incompatible models and combined GET`);
    } catch (error) {
      await page.screenshot({ path: `${output}/${name}-failure.png` });
      const state = await page.evaluate(() => ({ active: document.activeElement?.outerHTML?.slice(0,1200), menus: [...document.querySelectorAll('[role=dialog]')].map(node => ({ state: node.dataset.state, label: node.getAttribute('aria-labelledby') })) }));
      await writeFile(`${output}/${name}-failure.json`, JSON.stringify({ message: error.message, errors, state }, null, 2));
      throw error;
    } finally { await page.close(); }
  }
} finally {
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  await browser.close();
}
