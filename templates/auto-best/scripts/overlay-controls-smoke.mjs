import assert from 'node:assert/strict';
import { webkit } from 'playwright';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';
import { fillServiceEntry, serviceEntry, serviceAction } from './service-entry-fixture.mjs';

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
      iconToken: parseFloat(root.getPropertyValue('--dn-control-icon-size')),
      headerIconToken: parseFloat(root.getPropertyValue('--dn-overlay-header-icon-size')),
      headerSizedIcon: innerWidth < 768 && el.matches('dialog header .dn-icon-button'),
      tokenSizedIcon: el.classList.contains('dn-overlay-close'),
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
  assert.equal(geometry.svgWidth, geometry.headerSizedIcon ? geometry.headerIconToken : geometry.tokenSizedIcon ? geometry.iconToken : geometry.intendedWidth,
    'Icons must use their declared component size or the shared overlay token');
  assert.equal(geometry.appearance, 'none');
  assert(geometry.inViewport, 'Close control must remain reachable');
  return geometry;
}
async function mobileHeaderGeometry(header) {
  return header.evaluate(el => {
    const box = el.getBoundingClientRect(), style = getComputedStyle(el);
    const title = el.querySelector('h2')?.getBoundingClientRect();
    const titleStyle = el.querySelector('h2') ? getComputedStyle(el.querySelector('h2')) : null;
    const close = el.querySelector('.dn-overlay-close')?.getBoundingClientRect();
    return {
      shared: el.classList.contains('dn-mobile-overlay-heading') || el.classList.contains('dn-mobile-overlay-header'),
      height: box.height, padding: style.padding, gap: style.gap,
      titleTop: title ? title.top - box.top : null, titleHeight: title?.height,
      titleFont: titleStyle?.fontSize, titleLine: titleStyle?.lineHeight,
      closeTop: close ? close.top - box.top : null, closeRight: close ? box.right - close.right : null,
      closeWidth: close?.width, closeHeight: close?.height
    };
  });
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
      if (width >= 992) {
        const workspace = page.locator('#dn-listing-filter-dialog');
        const close = workspace.locator('.dn-listing-filter__close');
        const geometry = await close.evaluate(el => {
          const box = el.getBoundingClientRect(), icon = el.querySelector('svg').getBoundingClientRect();
          return { width: box.width, height: box.height,
            dx: icon.x + icon.width / 2 - box.x - box.width / 2,
            dy: icon.y + icon.height / 2 - box.y - box.height / 2,
            inViewport: box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight };
        });
        assert(geometry.width >= 44 && geometry.height >= 44 && geometry.inViewport);
        assert(Math.abs(geometry.dx) <= .5 && Math.abs(geometry.dy) <= .5);
        await close.click();
        await page.waitForFunction(el => document.activeElement === el, await trigger.elementHandle());
        await trigger.click();
        await page.keyboard.press('Escape');
        await workspace.waitFor({ state: 'hidden' });
        await page.waitForFunction(el => document.activeElement === el, await trigger.elementHandle());
        return { desktopClose: geometry };
      }
      const close = page.locator('.dn-listing-filter__close');
      const mainHeader = await mobileHeaderGeometry(page.locator(width < 768 ? '#dn-listing-filter-dialog header' : '.dn-listing-filter__dialog-header'));
      const evidence = [await centered(close)];
      await page.screenshot({ path: `${output}/${locale}-${width}-filters.png` });
      if (width < 768) {
        const facet = page.locator('.dn-mobile-filter-fields button[data-field=make]');
        await facet.click();
        const picker = page.locator('#dn-listing-filter-dialog');
        assert.equal(await page.locator('dialog[open]').count(), 1, 'A facet uses the same mobile dialog');
        assert.equal(await page.locator('.dn-mobile-filter-fields').count(), 0, 'The active pane replaces the overview');
        const nestedHeader = await mobileHeaderGeometry(picker.locator('header'));
        assert.equal(mainHeader.shared, true, 'Main mobile overlay must use the shared header primitive');
        assert.equal(nestedHeader.shared, true, 'The choice pane uses the shared header primitive');
        assert.deepEqual(nestedHeader, mainHeader, 'Overview and choice headers must align exactly');
        evidence.push({ headerAlignment: { main: mainHeader, nested: nestedHeader } });
        evidence.push(await centered(close));
        await picker.locator('input[type=search]').fill('Audi');
        evidence.push(await centered(picker.locator('.clear-search')));
        await picker.locator('.clear-search').click();
        assert.equal(await picker.locator('input[type=search]').inputValue(), '');
        await picker.locator('.back').click();
        assert.equal(await page.locator('.dn-mobile-filter-fields button').count(), 12, 'Back returns to all criteria');
        assert.equal(await page.locator('dialog[open]').count(), 1, 'Back retains the open filter sheet');
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
      evidence.push(await centered(page.locator('#dn-quick-search-dialog header .back')));
      await page.locator('#dn-quick-search-dialog header .back').click();
      await page.locator('.dn-quick-search__close').click();
      assert(await trigger.evaluate(el => document.activeElement === el));
      return evidence;
    });
    for (const topic of ['import', 'trade-in']) {
      await check(topic + '-info', '/contact?topic=' + topic, async page => {
        if (width < 768) {
          assert.equal(await page.locator('.dn-service-faq').isVisible(), false);
          const guideTrigger = page.locator(`.dn-service-guide button[aria-controls=${topic === 'import' ? 'import-info-dialog' : 'tradein-info-dialog'}]`);
          await guideTrigger.click();
          const guide = page.locator(topic === 'import' ? '#import-info-dialog' : '#tradein-info-dialog');
          await guide.waitFor({state: 'visible'});
          const close = guide.locator('header .dn-icon-button');
          const geometry = await centered(close);
          await close.click();
          await page.waitForFunction(el => document.activeElement === el, await guideTrigger.elementHandle());
          return { serviceGuide: true, close: geometry };
        }
        const faq = page.locator('.dn-service-faq summary').first();
        await faq.click();
        assert(await page.locator('.dn-service-faq details[open] p').isVisible());
        await faq.click();
        assert.equal(await page.locator('.dn-service-faq details[open]').count(), 0);
        return { inlineFaq: true };
      });
    }
    await check('tradein-form', '/contact?topic=trade-in', async page => {
      await fillServiceEntry(page, {make:'Audi',model:'A6',year:'2020',mileage:'85000'});
      const trigger = serviceAction(page); await trigger.click();
      const evidence = await centered(page.locator('.dn-tradein-close'));
      await page.locator('.dn-tradein-close').click();
      await page.waitForFunction(el => document.activeElement === el, await trigger.elementHandle());
      return evidence;
    });
    await check('import-form', '/contact?topic=import', async page => {
      await fillServiceEntry(page, {link:'https://example.com/vehicle'});
      const trigger = serviceAction(page); await trigger.click();
      const evidence = await centered(page.locator('.dn-enquiry-close'));
      await page.locator('.dn-enquiry-close').click();
      await page.waitForFunction(el => document.activeElement === el, await trigger.elementHandle());
      return evidence;
    });
    if (width < 992) await check('mobile-menu', '', async page => {
      const trigger = page.locator('.dn-mobile-bottom-nav button'); await trigger.click();
      const evidence = await centered(page.locator('.dn-mobile-menu__close'));
      await page.locator('.dn-mobile-menu__close').click();
      await page.waitForFunction(el => document.activeElement === el, await trigger.elementHandle());
      return evidence;
    });
    if (width < 768) await check('finance', '/listing-detail-v1/4', async page => {
      const trigger = page.locator('button[aria-controls=dn-detail-finance-dialog]'); await trigger.click();
      const close = page.locator('.dn-detail-finance-sheet__header button');
      await page.locator('#dn-detail-finance-dialog').waitFor({ state: 'visible' });
      const evidence = await centered(close); await close.click();
      await page.waitForFunction(el => document.activeElement === el, await trigger.elementHandle());
      return evidence;
    });
    await check('preferences', '', async page => {
      const trigger = page.locator(width < 992 ? '.dn-mobile-bottom-nav button' : '.dn-topbar__settings .locale-settings-menu > button');
      await trigger.click();
      await page.locator('[data-locale-selector]:visible').click();
      await page.locator('.cars-locale-dialog').waitFor({ state: 'visible' });
      const evidence = await centered(page.locator('.cars-locale-close'));
      await page.locator('.cars-locale-close').click();
      await page.waitForFunction(el => document.activeElement === el, await trigger.elementHandle());
      return evidence;
    });
    await check('reactive-validation', '/contact?topic=trade-in', async page => {
      const start = serviceAction(page), close = page.locator('.dn-tradein-close');
      await start.click();
      const inlineMake = width < 768 ? page.locator('.dn-service-editor[open] [name=make]') : serviceEntry(page).locator('[name=make]');
      assert.equal(await inlineMake.evaluate(el => el.checkValidity()), false);
      if (width < 768) await fillServiceEntry(page, {reference:'WVWZZZ1JZXW000001'});
      else {
        await page.locator('.dn-service-entry__alternative:visible').click();
        await serviceEntry(page).locator('[name=reference]').fill('WVWZZZ1JZXW000001');
      }
      await start.click();
      await page.locator('.dn-tradein-back').click();
      const make = page.locator('.dn-tradein-dialog [name=make]');
      assert(await make.evaluate(el => !el.required && !el.validity.customError && el.checkValidity()));
      await make.evaluate(el => el.setCustomValidity('Domain validation sentinel'));
      await make.fill('Audi');
      assert.equal(await make.evaluate(el => el.validationMessage), 'Domain validation sentinel');
      await make.evaluate(el => el.setCustomValidity(''));
      await page.locator('.dn-tradein-dialog [name=reference]').fill('');
      await page.locator('.dn-tradein-primary').click();
      const model = page.locator('.dn-tradein-dialog [name=model]');
      assert(await model.evaluate(el => el.required && !el.checkValidity()));
      await close.click(); return { reactiveRequired: true, domainErrorsPreserved: true };

    });
    await context.close();
  }
} finally { await browser.close(); await suite.finish(); assert(suite.report.results.length > 0, 'No matching overlay cases'); }
