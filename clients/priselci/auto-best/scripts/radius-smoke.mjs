import assert from 'node:assert/strict';
import { launchBrowser, previewUrl } from './browser.mjs';
import { returningContext } from './locale-smoke-fixture.mjs';
import { smokeReport } from './smoke-report.mjs';
import { radiusMeasurements,radiusViolations } from './card-radius-contract.mjs';
import { inspectCardOverlays,stubCardStateDelivery } from './card-radius-fixture.mjs';

const base = previewUrl();
const previewRadius = process.env.CARD_RADIUS_PREVIEW;
assert(!previewRadius || ['12', '14', '16'].includes(previewRadius), 'Card radius preview must be 12, 14 or 16');
const cardRadius = `${previewRadius || '12'}px`;
const suite = await smokeReport(previewRadius ? `artifacts/radius-smoke-${previewRadius}-preview` : 'artifacts/radius-smoke', base);
const browser = await launchBrowser();
const routes = [
  ['', '.dn-entry-card,.dn-vehicle-card,.dn-body-type,.dn-brand-card,.dn-discovery-toggle,.dn-editorial-item,.dn-mobile-core-card,.dn-mobile-services__card'],
  ['/cars', '.dn-vehicle-card'], ['/cars?q=no-match-xyz', '.dn-listing-empty'],
  ['/about-us', '.dn-entry-card,.dn-about-service-card,.dn-showroom-map'],
  ['/blog', '.dn-entry-card,.dn-blog-card'], ['/blog-detail/1', '.dn-blog-detail__sheet,.dn-blog-widget'],
  ['/contact', '.dn-contact-intent__main,.dn-contact-card,.dn-contact-location__card'],
  ['/contact?topic=trade-in', '.dn-entry-card,.dn-tradein-info-drawer--inline .dn-tradein-info-drawer__peek'],
  ['/contact?topic=import', '.dn-entry-card,.dn-import-info-drawer--inline .dn-import-info-drawer__peek'],
  ['/contact?topic=inspection&vehicle=1', '.dn-contact-intent__main,.dn-contact-card'],
  ['/contact?topic=leasing&vehicle=1', '.dn-contact-vehicle--hero'],
  ['/blog?q=no-match-xyz', '.dn-blog-empty'],
  ['/locale-settings', '.locale-settings'],
  ['/listing-detail-v1/1', '.dn-detail-title-card,.dn-detail-finance-trigger,.dn-detail-location-card,.dn-detail-related-card']
];
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
async function inspectAllCards(page) {
  const measurements = await radiusMeasurements(page);
  assert.deepEqual(radiusViolations(measurements, cardRadius), [], 'Every visible card, fact badge and inset vehicle photo');
  await page.evaluate(() => document.documentElement.style.setProperty('--dn-radius-mobile-card', '17px'));
  await settle(page);
  assert.deepEqual(radiusViolations(await radiusMeasurements(page), '17px'), [], 'Every outer card follows the shared mobile token');
  await page.evaluate(radius => {
    if (radius) document.documentElement.style.setProperty('--dn-radius-mobile-card', radius);
    else document.documentElement.style.removeProperty('--dn-radius-mobile-card');
  }, previewRadius ? cardRadius : null);
  await settle(page);
  return measurements;
}
async function navigate(page, locale, path) {
  await page.goto(`${base}/${locale}${path}`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' });
  await page.evaluate(() => document.fonts.ready);
  if (previewRadius) await page.evaluate(radius => document.documentElement.style.setProperty('--dn-radius-mobile-card', radius), cardRadius);
  await settle(page);
}
try {
  for (const locale of ['bg', 'en']) for (const width of [320, 390, 767]) {
    const context = await returningContext(browser, { locale, viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    await context.addCookies([{ name: 'cars_locale', value: locale, url: base }]);
    await stubCardStateDelivery(context);
    try {
      for (const [route, selector] of routes) await suite.check(`${locale} ${width} ${route || '/'} shared card corners`, async () => {
        const page = await context.newPage();
        try {
          await page.goto(`${base}/${locale}${route}`, { waitUntil: 'domcontentloaded' });
          await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' });
          await page.evaluate(() => document.fonts.ready);
          if (previewRadius) await page.evaluate(radius => document.documentElement.style.setProperty('--dn-radius-mobile-card', radius), cardRadius);
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          const cards = await page.locator(selector).evaluateAll(elements => elements.filter(element => element.checkVisibility()).map(element => {
            const style = getComputedStyle(element);
            return { class: element.className, radius: [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius] };
          }));
          assert(cards.length > 0, 'Every route must inspect a rendered card');
          for (const card of cards) {
            const expected = String(card.class).includes('dn-detail-title-card') ? [cardRadius, cardRadius, '0px', '0px'] : [cardRadius, cardRadius, cardRadius, cardRadius];
            assert.deepEqual(card.radius, expected, card.class);
          }
          const roles = await page.locator('.dn-app-shell').evaluate(shell => {
            const style = getComputedStyle(shell);
            return { control: style.getPropertyValue('--dn-radius-control').trim(), sheet: style.getPropertyValue('--dn-radius-sheet').trim(), card: style.getPropertyValue('--dn-radius-mobile-card').trim(), gutter: getComputedStyle(document.documentElement).scrollbarGutter };
          });
          assert.deepEqual(roles, { control: '12px', sheet: '24px', card: cardRadius, gutter: 'auto' });
          const measurements = await inspectAllCards(page);
          return { cards, roles, measurements };
        } finally { await page.close(); }
      });
      const page = await context.newPage();
      try {
        await inspectCardOverlays(page, { locale, width, navigate, record: async (statePage, stateLocale, stateWidth, name) => {
          await settle(statePage);
          await suite.check(`${stateLocale} ${stateWidth} ${name} all card roles`, () => inspectAllCards(statePage));
        } });
      } finally { await page.close(); }
    } finally { await context.close(); }
  }
} finally { await browser.close(); await suite.finish(); }
