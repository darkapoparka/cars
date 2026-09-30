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
      page.setDefaultNavigationTimeout(60000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      let dockNames;
      await page.context().addCookies([{ name: 'cars_locale', value: locale, url: base }, { name: 'cars_prompt', value: 'v1', url: base }]);
      const visit = async path => { await page.goto(base + path, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); };
      const capture = async name => {
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: page overflow`);
        await page.screenshot({ path: `${output}/${locale}-${width}-${name}.png` });
      };
      try {
        await visit('/');
        if (width < 768) {
          const homeCopy = await page.locator('.dn-mobile-core-card strong, .dn-mobile-core-card small, #featured-title').evaluateAll(elements => elements.map(el => {
            const box = el.getBoundingClientRect();
            const range = document.createRange(); range.selectNodeContents(el);
            const text = range.getBoundingClientRect();
            return { text: el.textContent.trim(), height: box.height, lineHeight: parseFloat(getComputedStyle(el).lineHeight),
              fits: text.left >= box.left - 1 && text.right <= box.right + 1 };
          }));
          assert.equal(homeCopy.length, 9);
          assert(homeCopy.every(item => item.fits && item.height <= item.lineHeight + 1),
            `Home service copy and featured heading must fit one line: ${JSON.stringify(homeCopy)}`);
          const homeArt = await page.locator('.dn-mobile-core-card').evaluateAll(cards => cards.map(card => {
            const box = card.getBoundingClientRect();
            const copy = card.querySelector('.dn-mobile-core-card__copy').getBoundingClientRect();
            const art = card.querySelector('.feature-artwork').getBoundingClientRect();
            return art.top >= copy.bottom + 4 && art.bottom <= box.bottom && art.left >= box.left && art.right <= box.right;
          }));
          assert(homeArt.every(Boolean), 'Service artwork stays inside its card and clear of the text');
          await capture('home');
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
          const viewAll = page.locator('.dn-search__mobile-all:visible').first();
          await compactControl(viewAll, { icon: true });
          assert.match(await viewAll.innerText(), /\([1-9]\d*\)/, 'Home action exposes the inventory count');
          await fits(page.locator('.dn-mobile-bottom-nav a, .dn-mobile-bottom-nav button, .dn-mobile-controls a'));
          const dock = page.locator('.dn-mobile-bottom-nav');
          const dockControls = dock.locator('a,button');
          assert.equal(await dockControls.count(), 5);
          dockNames = await dock.locator('.dn-mobile-bottom-nav__label').allTextContents();
          for (const control of await dockControls.all()) {
            const label = (await control.locator('.dn-mobile-bottom-nav__label').textContent()).trim();
            const role = await control.evaluate(el => el.tagName === 'A' ? 'link' : 'button');
            assert(label && await dock.getByRole(role, { name: label, exact: true }).count() === 1,
              'Every dock icon retains its complete accessible name');
          }
          const labelWidths = await dock.locator('.dn-mobile-bottom-nav__label').evaluateAll(labels => labels.map(label => label.getBoundingClientRect().width));
          assert(labelWidths.every(value => value > 1), 'Normal phone widths keep every dock label visible');
          assert.equal(await page.locator('.dn-mobile-bottom-nav [aria-current=page]').evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)', 'Active navigation stays light');
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
          assert.deepEqual(await page.locator('.dn-mobile-bottom-nav__label').allTextContents(), dockNames,
            'Home and inventory retain the same dock destinations and order');
          const titles = await page.locator('.dn-vehicle-card--listing .dn-vehicle-card__name').evaluateAll(elements => elements.map(el => ({
            text: el.textContent.trim(), whiteSpace: getComputedStyle(el).whiteSpace,
            clipped: el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1
          })));
          assert(titles.length > 0);
          assert(titles.every(t => t.text && t.whiteSpace === 'normal' && !t.clipped), 'Mobile list titles remain complete and readable');
          const photos = await page.locator('.dn-vehicle-card--listing').evaluateAll(cards => cards.map(card => {
            const photograph = card.querySelector('img');
            const image = photograph.getBoundingClientRect();
            const content = card.querySelector('.dn-vehicle-card__content').getBoundingClientRect();
            const box = card.getBoundingClientRect();
            const identity = card.querySelector('.dn-vehicle-card__identity').getBoundingClientRect();
            const price = card.querySelector('.dn-vehicle-card__amount').getBoundingClientRect();
            const metadata = card.querySelector('.dn-vehicle-card__mobile-meta').getBoundingClientRect();
            const headingStyle = getComputedStyle(card.querySelector('.dn-vehicle-card__name'));
            const priceStyle = getComputedStyle(card.querySelector('.dn-vehicle-card__amount'));
            const facts = [...card.querySelectorAll('.dn-vehicle-card__fact')];
            const badgesMatch = facts.every(fact => getComputedStyle(fact).backgroundColor === priceStyle.backgroundColor);
            return photograph.complete && photograph.naturalWidth > 0 &&
              Math.abs(image.width / image.height - photograph.naturalWidth / photograph.naturalHeight) <= .01 &&
              image.left >= box.left && image.right <= content.left - 1 && image.bottom <= box.bottom &&
              Math.abs(price.left - identity.left) <= 1 && price.top >= identity.bottom - 1 &&
              metadata.top >= Math.max(image.bottom, content.bottom) &&
              metadata.left >= box.left && metadata.right <= box.right && metadata.bottom <= box.bottom &&
              parseFloat(headingStyle.fontSize) > parseFloat(priceStyle.fontSize) &&
              parseFloat(headingStyle.fontWeight) > parseFloat(priceStyle.fontWeight) &&
              facts.length === 5 && badgesMatch && priceStyle.backgroundColor !== 'rgba(0, 0, 0, 0)';
          }));
          assert(photos.every(Boolean), 'Landscape photos remain whole; the title leads the price badge and all five facts share a badge family');
          assert.equal(await page.locator('.dn-vehicle-card--listing img[fetchpriority="high"]').count(), 1,
            'Only the first inventory photograph gets high fetch priority');
          await capture('inventory');
          const discoveryControls = await page.locator('.dn-listing-filter__mobile-sort,.dn-listing-filter__toggle').evaluateAll(controls => controls.map(control => {
            const box = control.getBoundingClientRect(), style = getComputedStyle(control);
            return { width: box.width, height: box.height, left: box.left, right: box.right, clip: style.backgroundClip,
              paintedHeight: box.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) };
          }));
          assert(discoveryControls.every(control => control.width === 44 && control.height === 44 && control.paintedHeight === 40 && control.clip === 'content-box'),
            'Sort and Filters share a 44px target and 40px painted circle');
          assert(discoveryControls[1].left > discoveryControls[0].right, 'Filters is the rightmost discovery control');
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
        for (const topic of ['import', 'trade-in']) {
          await visit(`/contact?topic=${topic}`);
          if (width < 768) assert.deepEqual(await page.locator('.dn-mobile-bottom-nav__label').allTextContents(), dockNames,
            'Sell and Import retain the same dock destinations and order');
          const action = page.locator('.dn-service-entry__submit');
          await fits(action);
          await fits(page.locator('.dn-service-entry__choices button'));
          assert.equal(await page.locator('.dn-service-process li').count(), 3);
          await fits(page.locator('.dn-service-faq summary'));
          await page.locator('.dn-service-faq summary').first().click();
          assert.equal(await page.locator('.dn-service-faq details[open]').count(), 1);
          await capture(topic);
          if (width < 768) {
            await page.setViewportSize({ width, height: 420 });
            await action.scrollIntoViewIfNeeded();
            const rect = await action.boundingBox();
            assert(rect.y >= 0 && rect.y + rect.height <= 420 - 64, 'Continue remains reachable above mobile navigation in a short viewport');
            await page.setViewportSize({ width, height: 844 });
          }
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
