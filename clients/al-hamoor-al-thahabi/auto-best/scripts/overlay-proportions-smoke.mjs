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

async function entrySurface(locator) {
  const actual = await locator.evaluate(el => {
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, border: style.borderWidth, radius: style.borderRadius,
      surface: style.getPropertyValue('--dn-entry-surface').trim(),
      pillRadius: style.getPropertyValue('--dn-pill').trim() };
  });
  const hex = /^#([a-f\d]{6})$/i.exec(actual.surface);
  assert(hex, 'Entry surface must resolve to the shared palette');
  const channels = hex[1].match(/../g).map(value => parseInt(value, 16));
  assert.equal(actual.background, `rgb(${channels.join(', ')})`, 'Overlay fields must match the existing entry surface');
  assert.equal(actual.border, '0px', 'Entry fields keep the existing borderless treatment');
  assert.equal(actual.radius, actual.pillRadius, 'Overlay single-line fields share the mobile entry pill radius');
}
try {
  for (const locale of ['bg', 'en']) for (const width of [320, 390, 430]) {
    for (const flow of ['home', 'listing', 'service']) await suite.check(`${locale} ${width} ${flow}`, async () => {
      const page = await browser.newPage({
        viewport: { width, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce'
      });
      const errors = [];
      page.setDefaultNavigationTimeout(60000);
      page.on('pageerror', error => errors.push(error.message));
      await page.context().addCookies([
        { name: 'cars_locale', value: locale, url: base },
        { name: 'cars_prompt', value: 'v1', url: base }
      ]);
      const route = flow === 'home' ? '/' : flow === 'listing' ? '/cars' : '/contact?topic=import';
      try {
        const response = await page.goto(base + route, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200, `${flow} must render before visual acceptance`);
        await page.evaluate(() => document.fonts.ready);
        if (flow === 'home') {
          await page.locator('.dn-quick-search__trigger').click();
          await frame(page.locator('.dn-quick-search__input-wrap'), 48);
          await entrySurface(page.locator('.dn-quick-search__input-wrap'));
          assert.equal(await page.locator('#quick-search-input').evaluate(el => getComputedStyle(el).fontSize), '16px');
          await frame(page.locator('.dn-quick-search__filter-row').first(), 48, 16);
          assert.equal(await page.locator('.dn-quick-search__filter-row > span').first().evaluate(el => getComputedStyle(el).fontSize), '14px');
          await frame(page.locator('.dn-quick-search__mobile-footer .dn-mobile-overlay-action'), 44, 14, true);
          await page.screenshot({ path: `${output}/${locale}-${width}-home.png` });
          const clear = page.locator('.dn-quick-search__clear');
          await frame(clear, 44, 14);
          assert.equal(await clear.isDisabled(), true);
          assert.equal(await clear.evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)', 'Clear is a quiet secondary action');
          assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).overflowY), 'hidden');
          await page.locator('#quick-search-input').fill('Audi');
          assert.equal(await clear.isEnabled(), true);
          await clear.click();
          assert.equal(await page.locator('#quick-search-input').inputValue(), '');
          assert.equal(await clear.isDisabled(), true);
          const labelWeight = await page.locator('.dn-quick-search__filter-row strong').first().evaluate(el => getComputedStyle(el).fontWeight);
          assert.equal(labelWeight, '500');
          await page.locator('.dn-quick-search__filter-row').first().click();
          await frame(page.locator('.dn-quick-search__option').first(), 48, 16, true);
          await page.keyboard.press('Escape');
          await page.keyboard.press('Escape');
        } else if (flow === 'listing') {
          await page.locator('.dn-listing-filter__toggle').click();
          await frame(page.locator('#dn-listing-filter-dialog .search-field'), 48);
          await entrySurface(page.locator('#dn-listing-filter-dialog .search-field'));
          assert.equal(await page.locator('#dn-listing-dialog-query').evaluate(el => getComputedStyle(el).fontSize), '16px');
          await frame(page.locator('.dn-mobile-filter-fields button').first(), 48, 16);
          await frame(page.locator('.dn-listing-filter__dialog-submit'), 44, 14, true);
          await page.screenshot({ path: `${output}/${locale}-${width}-listing.png` });
          await page.locator('.dn-mobile-filter-fields button[data-field=make]').click();
          const picker = page.locator('.dn-mobile-filter-editor');
          await frame(picker.locator('.search-field'), 48);
          await frame(picker.locator('.search-field input'), 48, 16);
          await frame(picker.locator('.choice:visible').first(), 48, 16);
          await frame(page.locator('#dn-listing-filter-dialog .dn-mobile-filter-editor-footer button[type=submit]'), 44, 14);
          await page.screenshot({ path: `${output}/${locale}-${width}-picker.png` });
          await page.keyboard.press('Escape');
          await page.keyboard.press('Escape');
          await page.locator('.dn-listing-filter__quick button').filter({ hasText: locale === 'bg' ? /^Марка$/ : /^Make$/ }).click();
          const quick = page.locator('#dn-quick-filter');
          await frame(quick.locator('.choice:visible').first(), 48, 16);
          const alignment = await quick.locator('.choice:visible').first().evaluate(el => ({
            indicator: el.querySelector('.dn-mobile-filter-checkbox').getBoundingClientRect().right,
            label: el.querySelector('.choice-label').getBoundingClientRect().left
          }));
          assert(alignment.indicator < alignment.label, 'Brand indicators align before the label');
          await frame(quick.locator('.clear'), 44, 14);
          await frame(quick.locator('.apply'), 44, 14);
          assert.equal(await quick.locator('.clear').innerText(), locale === 'bg' ? 'Изчисти' : 'Clear');
          assert.match(await quick.locator('.apply').innerText(), locale === 'bg' ? /Приложи/ : /Apply/);
          const actionPaint = await quick.locator('.apply').evaluate(el => {
            const rect = el.getBoundingClientRect(), paint = getComputedStyle(el, '::before');
            return rect.height - parseFloat(paint.top) - parseFloat(paint.bottom);
          });
          assert.equal(actionPaint, 36, 'Compact action paint retains a complete 44px target');
          await page.keyboard.press('Escape');
          await page.locator('.dn-listing-filter__quick button').filter({ hasText: locale === 'bg' ? /^Тип$/ : /^Type$/ }).click();
          const radioAlignment = await quick.locator('.choice:visible').evaluateAll(rows => rows.map(row => ({
            indicator: row.querySelector('input[type=radio]').getBoundingClientRect().right,
            label: row.querySelector('.choice-label').getBoundingClientRect().left
          })));
          assert(radioAlignment.length > 0 && radioAlignment.every(row => row.indicator < row.label), 'Type radios share the leading marker position with make/model checkboxes');
          await page.keyboard.press('Escape');
        } else {
          const entry = page.locator('#import-service-field');
          await frame(entry, 48, 18);
          await frame(page.locator('.dn-service-entry__submit:visible'), 44, 16);
          await entry.click();
          const editor = page.locator('.dn-service-editor[open]');
          await frame(editor.locator('input'), 48, 16);
          await entrySurface(editor.locator('input'));
          await frame(editor.locator('.dn-service-editor__save'), 44, 14);
          await frame(editor.locator('.dn-service-editor__cancel'), 44, 14);
          await page.screenshot({ path: output + '/' + locale + '-' + width + '-entry.png' });
          await page.setViewportSize({ width, height: 420 });
          await page.waitForFunction(() => {
            const save = document.querySelector('.dn-service-editor[open] .dn-service-editor__save');
            if (!save) return false;
            const box = save.getBoundingClientRect();
            return box.top >= 0 && box.bottom <= innerHeight;
          });
          const save = await editor.locator('.dn-service-editor__save').boundingBox();
          assert(save.y >= 0 && save.y + save.height <= 420);
          await page.keyboard.press('Escape');

        }
        assert.equal(await page.locator('dialog[open]').count(), 0);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        return {
          locale, width, flow, fieldFrame: 48, overviewRow: 48,
          fieldFont: 16, optionFont: 16, secondaryFont: 14, actionFont: 14, actionTarget: 44, actionPaint: 36
        };
      } finally { await page.close(); }
    });
  }
} finally {
  await browser.close();
  await suite.finish();
}
