import assert from 'node:assert/strict';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const output = 'artifacts/overlay-proportions-smoke';
const suite = await smokeReport(output, base);
const browser = await launchBrowser();

async function frame(locator, expectedHeight, font, allowWrap = false) {
  const actual = await locator.evaluate(el => ({
    height: el.getBoundingClientRect().height,
    font: getComputedStyle(el).fontSize,
    minHeight: getComputedStyle(el).minHeight,
    fits: el.scrollWidth <= el.clientWidth && el.scrollHeight <= el.clientHeight
  }));
  const expected = `${expectedHeight}px`;
  if (allowWrap) {
    assert.equal(actual.minHeight, expected);
    assert(actual.height >= expectedHeight && actual.fits,
      `Long option labels may wrap, but never clip or shrink below ${expected}`);
  } else assert.equal(actual.height, expectedHeight, `Control must use the ${expected} frame`);
  if (font) assert.equal(actual.font, `${font}px`, 'Typography must match the overlay control role');
}
try {
  for (const locale of ['bg', 'en']) for (const width of [320, 390, 430]) {
    for (const flow of ['home', 'listing', 'editor']) await suite.check(`${locale} ${width} ${flow}`, async () => {
      const page = await browser.newPage({
        viewport: { width, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce'
      });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.context().addCookies([
        { name: 'cars_locale', value: locale, url: base },
        { name: 'cars_prompt', value: 'v1', url: base }
      ]);
      const route = flow === 'home' ? '/' : flow === 'listing' ? '/listing-grid' : '/contact?topic=import';
      try {
        const response = await page.goto(base + route, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200, `${flow} must render before visual acceptance`);
        await page.evaluate(() => document.fonts.ready);
        if (flow === 'home') {
          await page.locator('.dn-quick-search__trigger').click();
          await frame(page.locator('.dn-quick-search__input-wrap'), 48, 18);
          assert.equal(await page.locator('#quick-search-input').evaluate(el => getComputedStyle(el).fontSize), '18px');
          await frame(page.locator('.dn-quick-search__filter-row').first(), 44, 16);
          assert.equal(await page.locator('.dn-quick-search__filter-row > span').first().evaluate(el => getComputedStyle(el).fontSize), '16px');
          await frame(page.locator('.dn-quick-search__mobile-footer button'), 44, 18);
          await page.screenshot({ path: `${output}/${locale}-${width}-home.png` });
          await page.locator('.dn-quick-search__filter-row').first().click();
          await frame(page.locator('.dn-quick-search__option').first(), 44, 16, true);
          await page.keyboard.press('Escape');
          await page.keyboard.press('Escape');
        } else if (flow === 'listing') {
          await page.locator('.dn-listing-filter__toggle').click();
          await frame(page.locator('.dn-listing-filter__dialog-search'), 44);
          assert.equal(await page.locator('.dn-listing-filter__dialog-search input').evaluate(el => getComputedStyle(el).fontSize), '18px');
          await frame(page.locator('.dn-mobile-filter-fields button').first(), 44, 16);
          await frame(page.locator('.dn-listing-filter__dialog-submit'), 44, 18);
          await page.screenshot({ path: `${output}/${locale}-${width}-listing.png` });
          await page.locator('.dn-mobile-filter-fields button').first().click();
          const picker = page.locator('#dn-dialog-choice');
          await frame(picker.locator('.search-field'), 44);
          await frame(picker.locator('.search-field input'), 44, 18);
          await frame(picker.locator('.choice:visible').first(), 44, 16);
          await frame(picker.locator('.clear'), 44, 16);
          await frame(picker.locator('.apply'), 44, 18);
          await page.screenshot({ path: `${output}/${locale}-${width}-picker.png` });
          await page.keyboard.press('Escape');
          await page.keyboard.press('Escape');
        } else {
          await page.locator('.dn-entry-editor-trigger').first().click();
          const editor = page.locator('.dn-entry-editor[open]');
          await frame(editor.locator('input').first(), 48, 18);
          await frame(editor.locator('.dn-entry-editor-cancel'), 44, 16);
          await frame(editor.locator('.dn-entry-editor-save'), 44, 18);
          await page.screenshot({ path: `${output}/${locale}-${width}-editor.png` });
          await page.setViewportSize({ width, height: 420 });
          const save = await editor.locator('.dn-entry-editor-save').boundingBox();
          assert(save.y >= 0 && save.y + save.height <= 420);
          await page.keyboard.press('Escape');
        }
        assert.equal(await page.locator('dialog[open]').count(), 0);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        return {
          locale, width, flow, overlayFrame: 44, homeAndEditorField: 48,
          fieldFont: 18, optionFont: 16, actionFont: 18
        };
      } finally { await page.close(); }
    });
  }
} finally {
  await browser.close();
  await suite.finish();
}
