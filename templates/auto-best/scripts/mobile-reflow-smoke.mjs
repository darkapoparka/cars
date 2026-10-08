import assert from 'node:assert/strict';
import { webkit } from 'playwright';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';
import { fillServiceEntry, serviceAction } from './service-entry-fixture.mjs';

const base = previewUrl();
const engine = process.env.REFLOW_ENGINE || 'chromium';
assert(['chromium', 'webkit'].includes(engine), 'Unsupported reflow browser engine');
const output = `artifacts/mobile-reflow-${engine}`;
const suite = await smokeReport(output, base);
const casePattern = process.env.REFLOW_CASE ? new RegExp(process.env.REFLOW_CASE) : null;
const check = (name, run) => casePattern && !casePattern.test(name) ? Promise.resolve() : suite.check(name, run);
const browser = await (engine === 'webkit' ? webkit.launch({ headless: true }) : launchBrowser());
const routes = ['', '/listing-grid', '/listing-detail-v1/1', '/about-us', '/blog', '/contact', '/contact?topic=trade-in', '/contact?topic=import', '/locale-settings'];
const overrides = {
  spacing: '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }',
  enlarged: 'html { font-size: 200% !important; }'
};

async function fits(page, mode) {
  const geometry = await page.evaluate(enlarged => {
    const root = [...document.querySelectorAll('dialog[open]')].at(-1) || document.body;
    const visible = el => {
      const box = el.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[inert]');
    };
    // Native inputs scroll their value; inspect labels/actions and rendered card copy.
    const selector = 'a,button,summary' + (enlarged ? ',.dn-vehicle-card__make,.dn-vehicle-card__name,.dn-vehicle-card__amount,.dn-blog-card h2' : '');
    const clipped = [...root.querySelectorAll(selector)].filter(visible)
      .filter(el => el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2)
      .map(el => ({ text: el.textContent.trim().slice(0, 80), class: String(el.className),
        client: { width: el.clientWidth, height: el.clientHeight }, scroll: { width: el.scrollWidth, height: el.scrollHeight } }));
    const cardHeights = [...root.querySelectorAll('.dn-vehicle-card--listing')].map(card => card.getBoundingClientRect().height);
    const cardHeightSpread = cardHeights.length ? Math.max(...cardHeights) - Math.min(...cardHeights) : 0;
    const homeHeader = root.querySelector('.dn-mobile-overlay-heading, .dn-quick-search__header, .dn-mobile-filter-header');
    let headerFits = true;
    if (homeHeader) {
      const title = homeHeader.querySelector('h2').getBoundingClientRect();
      const buttons = [...homeHeader.querySelectorAll('button')].filter(visible).map(button => button.getBoundingClientRect());
      const header = homeHeader.getBoundingClientRect();
      const centered = Math.abs((title.left + title.right) / 2 - (header.left + header.right) / 2) < 1;
      const controlsFit = buttons.length === 2 ? buttons[0].right <= title.left + 1 && title.right <= buttons[1].left + 1 : title.right <= buttons[0].left + 1;
      const aligned = homeHeader.classList.contains('dn-mobile-overlay-heading') || centered;
      headerFits = aligned && controlsFit && buttons.every(button => button.width >= 43 && button.height >= 43);
    }
    return { pageOverflow: document.documentElement.scrollWidth > innerWidth + 1, dialogOverflow: root.tagName === 'DIALOG' && root.scrollWidth > root.clientWidth + 1, clipped, cardHeightSpread, headerFits };
  }, mode === 'enlarged');
  assert(!geometry.pageOverflow && !geometry.dialogOverflow, JSON.stringify(geometry));
  assert.deepEqual(geometry.clipped, [], `${mode}: visible copy and actions must fit: ${JSON.stringify(geometry.clipped)}`);
  assert(geometry.cardHeightSpread <= 1, `${mode}: inventory cards retain equal heights`);
  assert(geometry.headerFits, `${mode}: Home selector titles must clear Back and Close`);
  return geometry;
}

async function checkReflow(page) {
  // Fonts and responsive container queries must reach paint before geometry is sampled.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const evidence = { normal: await fits(page, 'normal') };
  for (const [mode, content] of Object.entries(overrides)) {
    const style = await page.addStyleTag({ content });
    try {
      // Container queries settle at paint after a root font-size change.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      evidence[mode] = await fits(page, mode);
    }
    finally { await style.evaluate(el => el.remove()); }
  }
  return evidence;
}

try {
  for (const locale of ['en', 'bg']) for (const width of [320, 390, 430]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await context.addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
    try {
      for (const route of routes) await check(`${locale} ${width} ${route || '/'} reflow`, async () => {
        const page = await context.newPage();
        page.setDefaultNavigationTimeout(60000);
        try {
          await page.goto(`${base}/${locale}${route}`, { waitUntil: 'networkidle' });
          await page.evaluate(() => document.fonts.ready);
          return await checkReflow(page);
        } finally { await page.close(); }
      });
      for (const name of ['filters', 'home-make', 'home-model', 'home-price', 'make', 'listing-filters', 'listing-transmission', 'listing-price', 'listing-equipment', 'preferences', 'import', 'sell', 'import-guide', 'sell-guide']) await check(`${locale} ${width} ${name} dialog reflow`, async () => {
        const page = await context.newPage();
        page.setDefaultNavigationTimeout(60000);
        const route = name === 'make' || name.startsWith('listing-') ? '/listing-grid' : name.startsWith('import') ? '/contact?topic=import' : name.startsWith('sell') ? '/contact?topic=trade-in' : '';
        try {
          await page.goto(`${base}/${locale}${route}`, { waitUntil: 'networkidle' });
          if (name === 'filters' || name.startsWith('home-')) {
            await page.locator('.dn-quick-search__trigger').click();
            if (name === 'home-make' || name === 'home-model') await page.locator('.dn-quick-search__filter-row[data-view=make]').click();
            if (name === 'home-model') {
              await page.getByRole('button', { name: 'Mercedes-Benz', exact: true }).click();
              await page.locator('.dn-quick-search__mobile-footer button').click();
            }
            if (name === 'home-price') await page.locator('.dn-quick-search__filter-row[data-view=price]').click();
          } else if (name === 'make' || name.startsWith('listing-')) {
            await page.locator('.dn-listing-filter__toggle').click();
            if (name !== 'listing-filters') {
              const field = name === 'listing-price' ? 'price' : name === 'listing-equipment' ? 'equipment' : name === 'listing-transmission' ? 'transmission' : 'make';
              await page.locator(`.dn-mobile-filter-fields button[data-field=${field}]`).click();
            }
          } else if (name === 'preferences') {
            const trigger = page.locator('.dn-mobile-bottom-nav button');
            await trigger.click();
            await page.locator('.dn-mobile-menu [data-locale-selector]').click();
          } else if (name.endsWith('-guide')) {
            await page.locator('.dn-service-guide button[aria-haspopup=dialog]').click();
          } else {
            const fields = name === 'import' ? { link: 'https://example.com/vehicle' } : { make: 'Audi', model: 'A6', year: '2020', mileage: '85000' };
            await fillServiceEntry(page, fields);
            await serviceAction(page).click();
          }
          await page.locator('dialog[open]').last().waitFor({ state: 'visible' });
          await page.evaluate(() => document.fonts.ready);
          const evidence = await checkReflow(page);
          await page.setViewportSize({ width, height: 420 });
          evidence.short = await fits(page, 'short');
          return evidence;
        } finally { await page.close(); }
      });
    } finally { await context.close(); }
  }
} finally { await browser.close(); await suite.finish(); }
