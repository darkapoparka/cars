import assert from 'node:assert/strict';
import { webkit } from 'playwright';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const engine = process.env.OVERLAY_ENGINE || 'chromium';
assert(['chromium', 'webkit'].includes(engine), 'Unsupported overlay browser engine');
const selectedCase = process.env.OVERLAY_CASE;
if (selectedCase) assert(/^[a-z0-9-]+$/.test(selectedCase), 'Invalid case name');
const output = `artifacts/overlay-controls-${engine}${selectedCase ? '-' + selectedCase : ''}`;
const suite = await smokeReport(output, base);
const browser = await (engine === 'webkit' ? webkit.launch({ headless: true }) : launchBrowser());
async function centered(button) {
  const geometry = await button.evaluate(el => {
    const box = el.getBoundingClientRect(), svg = el.querySelector('svg');
    const icon = svg?.getBoundingClientRect(), style = getComputedStyle(el);
    const root = getComputedStyle(document.documentElement);
    const horizontalPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return { label: el.getAttribute('aria-label'), width: box.width, height: box.height,
      appearance: style.appearance, visualWidth: box.width - horizontalPadding,
      hitToken: parseFloat(root.getPropertyValue('--dn-control-hit-height')),
      visualToken: parseFloat(root.getPropertyValue('--dn-compact-control-visual-height')),
      svgWidth: icon?.width, intendedWidth: Number(svg?.getAttribute('width')),
      dx: icon ? icon.x + icon.width / 2 - box.x - box.width / 2 : null,
      dy: icon ? icon.y + icon.height / 2 - box.y - box.height / 2 : null,
      inViewport: box.left >= -1 && box.right <= innerWidth + 1 && box.top >= -1 && box.bottom <= innerHeight + 1 };
  });
  assert(geometry.label?.trim(), 'Icon-only controls require an accessible name');
  assert.equal(geometry.width, geometry.hitToken, JSON.stringify(geometry));
  assert.equal(geometry.height, geometry.hitToken, JSON.stringify(geometry));
  assert.equal(geometry.visualWidth, geometry.visualToken, JSON.stringify(geometry));
  assert(geometry.dx !== null && Math.abs(geometry.dx) <= .5 && Math.abs(geometry.dy) <= .5,
    JSON.stringify(geometry));
  assert.equal(geometry.svgWidth, geometry.intendedWidth, 'Icons must not shrink');
  assert.equal(geometry.appearance, 'none');
  assert(geometry.inViewport, 'Close control must remain reachable');
  return geometry;
}
try {
  for (const locale of ['bg', 'en']) for (const width of [320, 390, 430, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 844 },
      isMobile: width < 768, hasTouch: width < 992, deviceScaleFactor: width < 768 ? 3 : 1, reducedMotion: 'reduce' });
    await context.addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
    async function check(name, route, exercise) {
      if (process.env.OVERLAY_CASE && name !== process.env.OVERLAY_CASE) return;
      await suite.check(`${locale} ${width} ${name}`, async () => {
        const page = await context.newPage(), errors = [];
        page.setDefaultTimeout(10000); page.setDefaultNavigationTimeout(30000);
        page.on('pageerror', error => errors.push(error.message));
        try {
          const response = await page.goto(`${base}/${locale}${route}`, { waitUntil: 'domcontentloaded' });
          assert.equal(response.status(), 200);
          await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' });
          await page.evaluate(() => document.fonts.ready);
          const evidence = await exercise(page);
          assert.deepEqual(errors, []);
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          assert.equal(await page.locator('dialog[open]').count(), 0, 'All opened dialogs must close');
          assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).position), 'fixed');
          return evidence;
        } catch (error) {
          await page.screenshot({ path: `${output}/${locale}-${width}-${name}-failure.png` }).catch(() => {});
          throw error;
        } finally { await page.close(); }
      });
    }
    await check('filters', '/listing-grid', async page => {
      const trigger = page.locator(width < 768 ? '.dn-listing-filter__toggle' : '.dn-listing-results__filters');
      await trigger.click();
      const close = page.locator('.dn-listing-filter__close');
      const evidence = [await centered(close)];
      await page.screenshot({ path: `${output}/${locale}-${width}-filters.png` });
      if (width < 768) {
        const facet = page.locator('.dn-mobile-filter-fields button').first();
        await facet.click();
        const picker = page.locator('#dn-dialog-choice');
        evidence.push(await centered(picker.locator('.close')));
        await picker.locator('input[type=search]').fill('Audi');
        evidence.push(await centered(picker.locator('.clear-search')));
        await picker.locator('.clear-search').click();
        assert.equal(await picker.locator('input[type=search]').inputValue(), '');
        await picker.locator('.close').click();
        assert.equal(await page.locator('dialog[open]').count(), 1, 'Nested Close must retain its parent');
        await page.waitForFunction(el => document.activeElement === el, await facet.elementHandle());
        await page.setViewportSize({ width, height: 420 });
        evidence.push(await centered(close));
      }
      await close.click();
      await page.waitForFunction(el => document.activeElement === el, await trigger.elementHandle());
      await trigger.click(); await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('dialog[open]'));
      return evidence;
    });
    if (width < 768) await check('home-search', '', async page => {
      const trigger = page.locator('.dn-quick-search__trigger');
      await trigger.click();
      const evidence = [await centered(page.locator('.dn-quick-search__close'))];
      await page.locator('.dn-quick-search__filter-row').first().click();
      evidence.push(await centered(page.locator('.dn-quick-search__back')));
      await page.locator('.dn-quick-search__back').click();
      await page.locator('.dn-quick-search__close').click();
      assert(await trigger.evaluate(el => document.activeElement === el));
      return evidence;
    });
    await check('entry-editor', '/contact?topic=import', async page => {
      const trigger = page.locator('.dn-entry-editor-trigger').first();
      const previous = await trigger.innerText();
      await trigger.click();
      const editor = page.locator('.dn-entry-editor[open]');
      const evidence = await centered(editor.locator('.dn-entry-editor-close'));
      await editor.locator('input[name=entry-value]').fill('https://example.com/unsaved');
      if (width < 768) await page.setViewportSize({ width, height: 420 });
      const save = editor.locator('.dn-entry-editor-save');
      const box = await save.boundingBox();
      assert(box.y >= 0 && box.y + box.height <= page.viewportSize().height, 'Save must remain visible');
      await save.focus(); await page.keyboard.press('Tab');
      assert(await editor.evaluate(el => el.contains(document.activeElement)), 'Tab must not escape the modal');
      await editor.locator('.dn-entry-editor-close').click();
      assert.equal(await trigger.innerText(), previous, 'Close must discard unsaved edits');
      assert(await trigger.evaluate(el => document.activeElement === el)); return evidence;
    });
    for (const [topic, stem] of [['import', 'import'], ['trade-in', 'tradein']]) {
      await check(`${stem}-info`, `/contact?topic=${topic}`, async page => {
        const trigger = page.locator(`.dn-${stem}-info-drawer__peek`);
        await trigger.click();
        const close = page.locator(`.dn-${stem}-info-sheet__close`);
        const evidence = await centered(close);
        await close.click();
        assert(await trigger.evaluate(el => document.activeElement === el)); return evidence;
      });
    }
    await check('tradein-form', '/contact?topic=trade-in', async page => {
      const trigger = page.locator('.dn-tradein-start'); await trigger.click();
      const evidence = await centered(page.locator('.dn-tradein-close'));
      await page.locator('.dn-tradein-close').click();
      assert(await trigger.evaluate(el => document.activeElement === el)); return evidence;
    });
    await check('import-form', '/contact?topic=import', async page => {
      await page.locator('.dn-entry-editor-trigger').first().click();
      await page.locator('.dn-entry-editor input[name=entry-value]').fill('https://example.com/vehicle');
      await page.locator('.dn-entry-editor-save').click();
      const trigger = page.locator('.dn-enquiry-import-go'); await trigger.click();
      const evidence = await centered(page.locator('.dn-enquiry-close'));
      await page.locator('.dn-enquiry-close').click();
      assert(await trigger.evaluate(el => document.activeElement === el)); return evidence;
    });
    if (width < 992) await check('mobile-menu', '', async page => {
      const trigger = page.locator('.dn-mobile-bottom-nav button'); await trigger.click();
      const evidence = await centered(page.locator('.dn-mobile-menu__close'));
      await page.locator('.dn-mobile-menu__close').click();
      await page.waitForFunction(el => document.activeElement === el, await trigger.elementHandle());
      return evidence;
    });
    if (width < 768) await check('finance', '/listing-detail-v1/4', async page => {
      const trigger = page.locator('.dn-detail-finance-trigger'); await trigger.click();
      const close = page.locator('.dn-detail-finance-sheet__header button');
      const evidence = await centered(close); await close.click(); return evidence;
    });
    await check('preferences', '', async page => {
      const trigger = page.locator('[data-locale-selector]:visible').last();
      await trigger.click();
      const evidence = await centered(page.locator('.cars-locale-close'));
      await page.locator('.cars-locale-close').click();
      assert(await trigger.evaluate(el => document.activeElement === el)); return evidence;
    });
    await check('reactive-validation', '/contact?topic=trade-in', async page => {
      const start = page.locator('.dn-tradein-start'), close = page.locator('.dn-tradein-close');
      await start.click();
      const make = page.locator('.dn-tradein-dialog input[name=make]');
      assert.equal(await make.evaluate(el => el.checkValidity()), false);
      assert(await make.evaluate(el => el.validity.customError));
      await close.click();
      const editReference = async value => {
        await page.locator('.dn-entry-editor-trigger').first().click();
        await page.locator('.dn-entry-editor input[name=entry-value]').fill(value);
        await page.locator('.dn-entry-editor-save').click();
      };
      await editReference('WVWZZZ1JZXW000001'); await start.click();
      assert(await make.evaluate(el => !el.required && !el.validity.customError && el.checkValidity()));
      await make.evaluate(el => el.setCustomValidity('Domain validation sentinel'));
      await make.fill('Audi');
      assert.equal(await make.evaluate(el => el.validationMessage), 'Domain validation sentinel');
      await make.evaluate(el => el.setCustomValidity('')); await close.click();
      await editReference(''); await start.click();
      const model = page.locator('.dn-tradein-dialog input[name=model]');
      assert(await model.evaluate(el => el.required && !el.checkValidity()));
      await close.click(); return { reactiveRequired: true, domainErrorsPreserved: true };
    });
    await context.close();
  }
} finally { await browser.close(); await suite.finish(); assert(suite.report.results.length > 0, 'No matching overlay cases'); }
