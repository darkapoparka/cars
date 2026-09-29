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
        assert(formHeight >= 148 && formHeight <= 154, `Home discovery panel must remain compact, got ${formHeight}px`);
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
      assert.equal(await form.locator('.dn-discovery__facets > label').count(), 6);
      const facetWidths = await form.locator('.dn-discovery__facets select').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().width));
      assert.ok(Math.max(...facetWidths) - Math.min(...facetWidths) < 1);
      if (width === 1440 && route === '/listing-grid') await form.screenshot({ path: `${output}/cars-search-panel.png` });
      await form.locator('select[name=make]').selectOption('Audi');
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
        assert.equal(await dialog.locator('select[name=make]').inputValue(), 'Audi');
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
