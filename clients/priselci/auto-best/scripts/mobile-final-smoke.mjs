import assert from 'node:assert/strict';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const output = 'artifacts/mobile-final-smoke';
const suite = await smokeReport(output, base);
const browser = await launchBrowser();
try {
  for (const locale of ['en', 'bg']) for (const width of [320, 390, 430]) {
    await suite.check(`${locale} ${width}: enlarged text, motion, focus and image loading`, async () => {
      const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.context().addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
      try {
        await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
        assert.equal(await page.locator('.dn-hero-vehicles__pair img').getAttribute('fetchpriority'), 'high');
        assert.equal(await page.locator('.dn-inventory img[fetchpriority="high"]').count(), 0);
        const requested = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => new URL(entry.name).pathname));
        for (const hiddenArt of ['service-car-v1.webp', 'menu-import-v2.webp', 'menu-leasing-v2.webp']) {
          assert(!requested.some(path => path.endsWith(hiddenArt)), `${hiddenArt}: hidden artwork must not compete with the mobile hero`);
        }
        await page.screenshot({ path: `${output}/${locale}-${width}-home.png` });
        await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
        const cards = await page.locator('.dn-mobile-core-card').evaluateAll(elements => elements.map(card => {
          const box = card.getBoundingClientRect();
          const copy = card.querySelector('.dn-mobile-core-card__copy').getBoundingClientRect();
          const art = card.querySelector('.feature-artwork').getBoundingClientRect();
          return { separated: art.top >= copy.bottom + 7, fits: card.scrollWidth <= card.clientWidth + 1 && art.bottom <= box.bottom };
        }));
        assert(cards.every(card => card.separated && card.fits), '200% service text must not clip or overlap artwork');
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '200% page reflows');
        const nav = await page.locator('.dn-mobile-bottom-nav').evaluate(element => {
          const bounds = element.getBoundingClientRect();
          return [...element.querySelectorAll('a,button')].every(control => {
            const box = control.getBoundingClientRect();
            return control.scrollWidth <= control.clientWidth + 1 && box.bottom <= bounds.bottom && box.height >= 44;
          });
        });
        assert(nav, 'Enlarged navigation labels remain inside their touch targets');
        const compactDock = await page.locator('.dn-mobile-bottom-nav__label').evaluateAll(labels => labels.every(label => {
          const box = label.getBoundingClientRect();
          return box.width === 1 && box.height === 1 && getComputedStyle(label).clipPath !== 'none';
        }));
        assert(compactDock, 'The dock switches to accessible icons when enlarged text would crowd its labels');
        await page.screenshot({ path: `${output}/${locale}-${width}-large-text.png` });
        await page.reload({ waitUntil: 'networkidle' });
        const menu = page.locator('.dn-mobile-bottom-nav button');
        await menu.click();
        await page.keyboard.press('Escape');
        assert(await menu.evaluate(element => document.activeElement === element), 'Menu returns focus');
        await page.locator('#dn-site-footer').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector('.dn-mobile-bottom-nav')?.inert);
        const footerState = await page.locator('.dn-mobile-bottom-nav').evaluate(element => {
          element.querySelector('a').focus();
          return { hidden: getComputedStyle(element).visibility === 'hidden', focused: element.contains(document.activeElement) };
        });
        assert(footerState.hidden && !footerState.focused, 'Hidden dock cannot receive keyboard focus');
        await page.goto(`${base}/${locale}/blog-detail/1`, { waitUntil: 'networkidle' });
        assert(await page.locator('.dn-route-hero__artwork').evaluateAll(images => images.every(image => image.currentSrc.startsWith('data:'))), 'Desktop article artwork is not downloaded on phones');
        assert.deepEqual(errors, []);
        return { cards: cards.length, enlargedText: '200%', hiddenDock: 'inert', reducedMotion: true };
      } finally { await page.close(); }
    });
  }
} finally { await browser.close(); await suite.finish(); }
