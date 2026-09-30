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
    return { pageOverflow: document.documentElement.scrollWidth > innerWidth + 1, dialogOverflow: root.tagName === 'DIALOG' && root.scrollWidth > root.clientWidth + 1, clipped, cardHeightSpread };
  }, mode === 'enlarged');
  assert(!geometry.pageOverflow && !geometry.dialogOverflow, JSON.stringify(geometry));
  assert.deepEqual(geometry.clipped, [], `${mode}: visible copy and actions must fit`);
  assert(geometry.cardHeightSpread <= 1, `${mode}: inventory cards retain equal heights`);
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
      for (const route of routes) await suite.check(`${locale} ${width} ${route || '/'} reflow`, async () => {
        const page = await context.newPage();
        try {
          await page.goto(`${base}/${locale}${route}`, { waitUntil: 'networkidle' });
          await page.evaluate(() => document.fonts.ready);
          return await checkReflow(page);
        } finally { await page.close(); }
      });
      for (const name of ['make', 'preferences', 'import', 'sell']) await suite.check(`${locale} ${width} ${name} dialog reflow`, async () => {
        const page = await context.newPage();
        const route = name === 'make' ? '/listing-grid' : name === 'import' ? '/contact?topic=import' : name === 'sell' ? '/contact?topic=trade-in' : '';
        try {
          await page.goto(`${base}/${locale}${route}`, { waitUntil: 'networkidle' });
          if (name === 'make') {
            await page.locator('.dn-listing-filter__toggle').click();
            await page.locator('.dn-mobile-filter-fields button').nth(1).click();
          } else if (name === 'preferences') {
            const trigger = page.locator('.dn-mobile-bottom-nav button');
            await trigger.click();
            await page.locator('.dn-mobile-menu [data-locale-selector]').click();
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
