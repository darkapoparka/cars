import assert from 'node:assert/strict';
import { webkit } from 'playwright';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl(), engine = process.env.SEARCH_ENGINE || 'chromium';
assert(['chromium', 'webkit'].includes(engine), 'Unsupported search browser engine');
const output = `artifacts/mobile-search-viewport-${engine}`;
const suite = await smokeReport(output, base);
const browser = await (engine === 'webkit' ? webkit.launch({ headless: true }) : launchBrowser());
const paint = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));

async function fillsViewport(dialog, panelSelector) {
  const geometry = await dialog.evaluate((element, selector) => {
    const panel = element.querySelector(selector).getBoundingClientRect(), box = element.getBoundingClientRect();
    return { top: box.top, height: box.height, panelTop: panel.top, panelHeight: panel.height,
      viewportTop: visualViewport.offsetTop, viewportHeight: visualViewport.height };
  }, panelSelector);
  for (const top of [geometry.top, geometry.panelTop]) assert(Math.abs(top - geometry.viewportTop) <= 1, JSON.stringify(geometry));
  for (const height of [geometry.height, geometry.panelHeight]) assert(Math.abs(height - geometry.viewportHeight) <= 1, JSON.stringify(geometry));
  return geometry;
}

async function withKeyboard(page, run) {
  const layoutHeight = await page.evaluate(() => innerHeight);
  // Real keyboards can resize and pan the visible viewport without resizing the layout.
  await page.evaluate(() => {
    Object.defineProperty(visualViewport, 'height', { configurable: true, value: 360 });
    Object.defineProperty(visualViewport, 'offsetTop', { configurable: true, value: 32 });
    visualViewport.dispatchEvent(new Event('resize'));
    visualViewport.dispatchEvent(new Event('scroll'));
  });
  try {
    await paint(page);
    assert.equal(await page.evaluate(() => innerHeight), layoutHeight);
    return await run();
  } finally {
    await page.evaluate(() => {
      delete visualViewport.height;
      delete visualViewport.offsetTop;
      visualViewport.dispatchEvent(new Event('resize'));
      visualViewport.dispatchEvent(new Event('scroll'));
    });
    await paint(page);
  }
}

async function reachable(dialog, input, scroller) {
  await input.focus();
  const before = await input.boundingBox();
  await scroller.evaluate(element => { element.scrollTop = element.scrollHeight; });
  const after = await input.boundingBox();
  const geometry = await dialog.evaluate(element => {
    const footer = element.querySelector('footer').getBoundingClientRect();
    const header = element.querySelector('header').getBoundingClientRect();
    const action = element.querySelector('footer button:last-of-type').getBoundingClientRect();
    const close = element.querySelector('header .dn-overlay-close, header .dn-quick-search__close');
    const icon = close.querySelector('svg').getBoundingClientRect();
    const box = close.getBoundingClientRect(), style = getComputedStyle(close);
    return { headerTop: header.top, footerTop: footer.top, footerBottom: footer.bottom,
      actionTop: action.top, actionBottom: action.bottom, activeInput: document.activeElement.matches('input'),
      fontSize: parseFloat(getComputedStyle(document.activeElement).fontSize),
      close: { width: box.width, height: box.height, glyphWidth: icon.width, border: style.borderTopWidth, background: style.backgroundColor } };
  });
  assert(geometry.footerTop >= 32 && geometry.footerBottom <= 393, JSON.stringify(geometry));
  assert(geometry.actionTop >= 32 && geometry.actionBottom <= 393, JSON.stringify(geometry));
  assert(geometry.activeInput, 'Save/Apply remains reachable without dismissing the focused field');
  assert(geometry.fontSize >= 16, 'Mobile text-entry sizes avoid the small-input focus zoom trigger');
  assert(geometry.close.width >= 44 && geometry.close.height >= 44);
  assert.equal(geometry.close.glyphWidth, 24);
  assert.equal(geometry.close.border, '0px');
  assert.equal(geometry.close.background, 'rgba(0, 0, 0, 0)');
  assert(Math.abs(before.y - after.y) <= 1, 'Scrolling choices keeps the search field at the top');
  return geometry;
}

try {
  for (const locale of ['bg', 'en']) for (const width of [320, 390, 430]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await context.addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
    for (const mode of ['home', 'listing']) await suite.check(`${locale} ${width} ${mode} keyboard viewport`, async () => {
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.setDefaultNavigationTimeout(60000);
      try {
        await page.goto(`${base}/${locale}${mode === 'listing' ? '/listing-grid' : ''}`, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const evidence = {};
        if (mode === 'home') {
          const trigger = page.locator('.dn-quick-search__trigger'), dialog = page.locator('#dn-quick-search-dialog');
          await trigger.click();
          await page.waitForFunction(() => document.activeElement?.id === 'quick-search-input');
          evidence.normal = await fillsViewport(dialog, '.dn-quick-search__panel');
          evidence.keyboard = await withKeyboard(page, async () => ({
            ...await fillsViewport(dialog, '.dn-quick-search__panel'),
            ...await reachable(dialog, dialog.locator('#quick-search-input'), dialog.locator('.dn-quick-search__filter-rows'))
          }));
          await dialog.locator('.dn-quick-search__close').click();
          assert(await trigger.evaluate(element => element === document.activeElement));
        } else {
          const trigger = page.locator('.dn-listing-filter__mobile-keyword'), dialog = page.locator('#dn-listing-filter-dialog');
          await trigger.click();
          await page.waitForFunction(() => document.activeElement?.id === 'dn-listing-dialog-query');
          evidence.normal = await fillsViewport(dialog, 'form');
          evidence.keyboard = await withKeyboard(page, async () => ({
            ...await fillsViewport(dialog, 'form'),
            ...await reachable(dialog, dialog.locator('#dn-listing-dialog-query'), dialog.locator('.overview'))
          }));
          await dialog.locator('.dn-listing-filter__close').click();
          assert(await trigger.evaluate(element => element === document.activeElement));
          const quick = page.locator('#dn-quick-filter');
          for (const [field, label] of [['make', locale === 'bg' ? 'Марка' : 'Make'], ['price', locale === 'bg' ? 'Бюджет' : 'Budget']]) {
            await page.locator('.dn-listing-filter__quick').getByRole('button', { name: label, exact: true }).click();
            evidence[field] = await fillsViewport(quick, 'form');
            const input = quick.locator(field === 'make' ? 'input[type=search]' : 'input[type=number]').first();
            await input.focus();
            evidence[`${field}Keyboard`] = await withKeyboard(page, async () => {
              const frame = await fillsViewport(quick, 'form');
              const footer = await quick.locator('footer').boundingBox();
              assert(footer.y >= 32 && footer.y + footer.height <= 393, JSON.stringify(footer));
              assert(await input.evaluate(element => element === document.activeElement));
              return { ...frame, footer };
            });
            await quick.locator('header button').click();
          }
          await page.locator('.dn-listing-filter__mobile-sort').click();
          const sort = page.locator('#dn-listing-sort-sheet');
          const panel = await sort.locator('form').boundingBox();
          assert(panel.y > 0 && panel.height < 844 && Math.abs(panel.y + panel.height - 844) <= 1, 'Choice-only Sort remains a short bottom sheet');
          evidence.sort = panel;
          await sort.locator('header button').click();
        }
        assert.deepEqual(errors, []);
        assert.equal(await page.locator('dialog[open]').count(), 0);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        return evidence;
      } catch (error) {
        await page.screenshot({ path: `${output}/${locale}-${width}-${mode}-failure.png` }).catch(() => {});
        throw error;
      } finally { await page.close(); }
    });
    await context.close();
  }
} finally { await browser.close(); await suite.finish(); }
