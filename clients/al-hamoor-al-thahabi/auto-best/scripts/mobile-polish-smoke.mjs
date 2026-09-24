import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const output = 'artifacts/mobile-polish-smoke';
await mkdir(output, { recursive: true });
const suite = await smokeReport(output, base);
const browser = await launchBrowser();
async function fits(locator) {
  const failures = await locator.evaluateAll(elements => elements.filter(el => el.checkVisibility()).flatMap(el => {
    const box = el.getBoundingClientRect();
    const problems = [];
    if (el.scrollWidth > el.clientWidth + 1) problems.push('horizontal clipping');
    if (box.height < 44) problems.push('touch target below 44px');
    const minimumIcon = 15;
    for (const svg of el.querySelectorAll('svg')) if (getComputedStyle(svg).display !== 'none' && svg.getBoundingClientRect().width < minimumIcon) problems.push('collapsed icon');
    return problems.length ? [{ text: el.textContent.trim(), problems }] : [];
  }));
  assert.deepEqual(failures, []);
}
async function compactControl(locator, { icon = false } = {}) {
  const result = await locator.evaluate(el => {
    const box = el.getBoundingClientRect(), style = getComputedStyle(el), pseudo = getComputedStyle(el, '::before');
    const svg = el.querySelector('svg')?.getBoundingClientRect();
    const hasSurface = pseudo.content !== 'none';
    const visibleHeight = hasSurface ? box.height - parseFloat(pseudo.top) - parseFloat(pseudo.bottom) : box.height;
    return { width: box.width, height: box.height, visibleHeight, fontSize: style.fontSize,
      lineHeight: style.lineHeight, gap: style.gap, iconWidth: svg?.width,
      iconDy: svg ? svg.y + svg.height / 2 - box.y - box.height / 2 : null };
  });
  assert.equal(result.height, 44); assert.equal(result.visibleHeight, 40);
  assert.equal(result.fontSize, '16px'); assert.equal(result.lineHeight, '20.8px');
  assert.equal(result.gap, '8px');
  if (icon) { assert.equal(result.iconWidth, 15); assert(Math.abs(result.iconDy) <= .5); }
  return result;
}
try {
  for (const locale of ['bg', 'en']) for (const width of [320, 390, 430, 1440]) {
    await suite.check(`${locale} mobile polish ${width}`, async () => {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.context().addCookies([{ name: 'cars_locale', value: locale, url: base }, { name: 'cars_prompt', value: 'v1', url: base }]);
      const visit = async path => { await page.goto(base + path, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); };
      const capture = async name => {
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: page overflow`);
        await page.screenshot({ path: `${output}/${locale}-${width}-${name}.png` });
      };
      try {
        await visit('/');
        if (width < 768) {
          const search = await page.locator('.dn-quick-search__trigger').evaluate(el => {
            const box = el.getBoundingClientRect();
            return { height: box.height, font: getComputedStyle(el).fontSize, gap: getComputedStyle(el).gap,
              icons: [...el.querySelectorAll('svg')].map(svg => {
                const icon = svg.getBoundingClientRect();
                return { width: icon.width, dy: icon.y + icon.height / 2 - box.y - box.height / 2 };
              }) };
          });
          assert.equal(search.height, 44); assert.equal(search.font, '18px'); assert.equal(search.gap, '11px');
          assert(search.icons.every(icon => icon.width === 18 && Math.abs(icon.dy) <= .5));
          await compactControl(page.locator('.dn-search__mobile-all:visible').first(), { icon: true });
          for (const pill of await page.locator('.dn-search__mobile-shortcuts a').all()) await compactControl(pill);
          const trigger = page.locator('.dn-mobile-bottom-nav button');
          await trigger.click();
          await fits(page.locator('.dn-mobile-menu__contact a'));
          await capture('menu');
          await page.keyboard.press('Escape');
          assert.equal(await trigger.evaluate(el => document.activeElement === el), true);
        }
        await visit('/listing-grid');
        if (width < 768) {
          const titles = await page.locator('.dn-vehicle-card--listing .dn-vehicle-card__name').evaluateAll(elements => elements.map(el => ({
            text: el.textContent.trim(), whiteSpace: getComputedStyle(el).whiteSpace, overflow: getComputedStyle(el).textOverflow,
            height: el.getBoundingClientRect().height, lineHeight: parseFloat(getComputedStyle(el).lineHeight)
          })));
          assert(titles.length > 0);
          assert(titles.every(t => t.text && t.whiteSpace === 'nowrap' && t.overflow === 'ellipsis' && t.height <= t.lineHeight + 1), 'Owner-approved mobile listing titles remain single-line with retained full accessible text');
          await capture('inventory');
          await page.locator('.dn-listing-filter__toggle').click();
          const filter = page.locator('#dn-listing-filter-dialog');
          await filter.locator('input[name=q]').fill('no-match-mobile-polish');
          const submit = filter.locator('.dn-listing-filter__dialog-submit');
          assert.equal(await submit.isDisabled(), true);
          await fits(submit);
          await capture('empty-filter');
          await page.keyboard.press('Escape');
          assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).position), 'fixed');
        } else await capture('inventory');
        for (const [topic, selector] of [['import', '.dn-enquiry-import-go'], ['trade-in', '.dn-tradein-start']]) {
          await visit(`/contact?topic=${topic}`);
          const action = page.locator(selector);
          await fits(action);
          await compactControl(action, { icon: true });
          assert((await action.boundingBox()).height <= 49, 'Entry actions should remain one line');
          await capture(topic);
          await page.locator('.dn-entry-editor-trigger').first().click();
          const editor = page.locator('.dn-entry-editor[open]');
          await editor.waitFor();
          if (width < 768) await page.setViewportSize({ width, height: 420 });
          const save = editor.locator('button[type=submit]');
          const rect = await save.boundingBox();
          assert(rect.y >= 0 && rect.y + rect.height <= (width < 768 ? 420 : 900), 'Editor Save must remain reachable in a short viewport');
          await page.keyboard.press('Escape');
          await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
        }
        await visit('/listing-detail-v1/4');
        await fits(page.locator('.dn-detail-tabs button'));
        if (width < 768) {
          await fits(page.locator('.dn-mobile-detail-bar a'));
          await capture('detail');
          await page.locator('.dn-mobile-detail-bar__secondary').click();
          await page.waitForURL(url => url.pathname.endsWith('/contact'));
          assert.equal(new URL(page.url()).searchParams.get('vehicle'), '4');
          await fits(page.locator('.dn-contact-button--call'));
          const number = page.locator('.dn-contact-call-number');
          assert.equal(await number.evaluate(el => getComputedStyle(el).whiteSpace), 'nowrap');
          await capture('inspection');
        } else await capture('detail');
        await visit('/locale-settings');
        assert((await page.title()).endsWith(' — Auto Best'));
        assert.deepEqual(errors, []);
        return { locale, width, passed: true };
      } finally { await page.close(); }
    });
  }
} finally { await browser.close(); await suite.finish(); }
