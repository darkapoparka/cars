import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { launchBrowser, previewUrl } from './browser.mjs';
import { returningPage } from './locale-smoke-fixture.mjs';

const base = previewUrl();
const before = process.argv.includes('--before');
const journeysOnly = process.argv.includes('--journeys-only');
const phase = before ? 'before' : 'after';
const output = process.env.CAR_CARD_QA_OUT || path.resolve('artifacts/car-cards-route-smoke');
await mkdir(output, { recursive: true });
const baseline = before || journeysOnly ? null : JSON.parse(await readFile('docs/mobile-car-card-strip-2026-10-09/desktop-baseline.json', 'utf8'));
const browser = await launchBrowser();
const results = [];
try {
  if (!journeysOnly) for (const locale of ['en', 'bg'].filter(locale => !process.env.CAR_CARD_LOCALE || locale === process.env.CAR_CARD_LOCALE)) for (const width of [320, 373, 390, 430, 767, 768, 992, 1280, 1440].filter(width => !process.env.CAR_CARD_WIDTH || width === Number(process.env.CAR_CARD_WIDTH))) {
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 884 : 900 }, reducedMotion: 'reduce' });
    await context.addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const surface of ['grid', 'home']) {
      const route = surface === 'grid' ? (before ? '/listing-grid' : '/cars') : '';
      const response = await page.goto(`${base}/${locale}${route}`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      // Isolate card preservation from the separate shared scrollbar-gutter edit.
      const desktopBaselineGutter = !before && width >= 768 && width < 992;
      if (desktopBaselineGutter) await page.addStyleTag({ content: 'html { scrollbar-gutter: auto; }' });
      const selector = surface === 'grid' ? '.dn-listing-results__grid' : '.dn-inventory__grid';
      await page.locator(selector).evaluate(element => scrollTo(0, scrollY + element.getBoundingClientRect().top - 160));
      await page.locator(`${selector} img`).first().evaluate(image => image.decode());
      const state = await page.locator(selector).evaluate((grid, width) => {
        const cards = [...grid.querySelectorAll('.dn-vehicle-card')];
        const first = cards[0];
        const rect = element => {
          const box = element.getBoundingClientRect(), root = first.getBoundingClientRect();
          return { x: +(box.x - root.x).toFixed(2), y: +(box.y - root.y).toFixed(2), width: +box.width.toFixed(2), height: +box.height.toFixed(2) };
        };
        const roles = ['visual', 'content', 'make', 'name', 'amount', 'specs', 'mobile-meta'];
        const geometry = Object.fromEntries(roles.map(role => {
          const node = first.querySelector('.dn-vehicle-card__' + role);
          return [role, node?.checkVisibility() ? rect(node) : null];
        }));
        const facts = cards.map(card => {
          const photo = card.querySelector('.dn-vehicle-card__visual').getBoundingClientRect();
          const group = card.querySelector('.dn-vehicle-card__mobile-meta');
          const badges = [...card.querySelectorAll('.dn-vehicle-card__fact')];
          const strip = group?.getBoundingClientRect();
          const content = card.querySelector('.dn-vehicle-card__content').getBoundingClientRect();
          const photoBadges = [...card.querySelectorAll('.dn-vehicle-card__badge')].filter(badge => badge.checkVisibility());
          const boxes = badges.map(badge => badge.getBoundingClientRect());
          const factRows = boxes.map(box => box.top);
          const gaps = boxes.slice(1).map((box, index) => box.left - boxes[index].right);
          const nameStyle = getComputedStyle(card.querySelector('.dn-vehicle-card__name'));
          const price = card.querySelector('.dn-vehicle-card__amount');
          const priceStyle = getComputedStyle(price);
          const identity = card.querySelector('.dn-vehicle-card__identity').getBoundingClientRect();
          return {
            photoBadgeCount: photoBadges.length,
            belowPhoto: strip?.top >= photo.bottom,
            afterDetails: strip?.top >= content.bottom - 1,
            fillsWidth: Math.abs(badges[0].getBoundingClientRect().left - strip.left) <= 1 && Math.abs(badges.at(-1).getBoundingClientRect().right - strip.right) <= 1,
            completeMileage: badges[1]?.textContent === card.querySelector('.dn-vehicle-card__badge--mileage').textContent,
            completeYear: badges[0]?.textContent === card.querySelector('.dn-vehicle-card__badge--year').textContent,
            balancedListing: photo.width <= 157 && photo.height <= 130 && Math.abs(photo.height - content.height) <= 1,
            evenGaps: Math.max(...gaps) - Math.min(...gaps) <= 1,
            priceEmphasis: parseFloat(priceStyle.fontSize) / parseFloat(nameStyle.fontSize),
            priceGap: price.getBoundingClientRect().top - identity.bottom,
            oneRow: Math.max(...factRows) - Math.min(...factRows) <= 1,
            duplicateSpecsHidden: !card.querySelector('.dn-vehicle-card__specs').checkVisibility(),
            visible: !!group?.checkVisibility(),
            badges: badges.map(badge => {
              const value = badge.querySelector('span:not(.dn-sr-only)'), style = getComputedStyle(badge), box = badge.getBoundingClientRect();
              return { text: value.textContent.trim(), whiteSpace: style.whiteSpace, fits: value.scrollWidth <= value.clientWidth + 1,
                singleLine: box.height <= parseFloat(style.lineHeight) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + 1 };
            })
          };
        });
        return { width, overflow: document.documentElement.scrollWidth - innerWidth, geometry, firstCard: rect(first), facts };
      }, width);
      assert(state.overflow <= 1, `${locale} ${width} ${surface}: page overflow`);
      assert.deepEqual(errors, [], `${locale} ${width} ${surface}: browser errors`);
      if (!before && width >= 768) {
        const original = baseline.find(row => row.locale === locale && row.width === width && row.surface === surface);
        assert.deepEqual(state.geometry, original.state.geometry, `${locale} ${width} ${surface}: original desktop card geometry restored`);
        assert.deepEqual(state.firstCard, original.state.firstCard, `${locale} ${width} ${surface}: original desktop card size restored`);
        assert(state.facts.every(card => !card.visible && card.photoBadgeCount === 2 && !card.duplicateSpecsHidden), 'Desktop retains original photo badges and specifications');
      }
      if (!before && width < 768) {
        assert(state.facts.every(card => card.visible && card.photoBadgeCount === 0 && card.oneRow && card.duplicateSpecsHidden && card.belowPhoto && card.afterDetails && card.fillsWidth && card.evenGaps && card.badges.length === (surface === 'grid' ? 5 : 3) && card.completeMileage && card.completeYear), `${locale} ${width} ${surface}: the evenly spaced facts follow photo and details, with fewer facts on Home`);
        assert(state.facts.every(card => card.priceEmphasis >= 1.45 && card.priceGap >= 7.5), `${locale} ${width} ${surface}: price is larger and clearly separated from the model title`);
        assert(state.facts.every(card => card.badges.every(badge => badge.whiteSpace === 'nowrap' && badge.singleLine && badge.fits)), `${locale} ${width} ${surface}: stock facts remain readable on one line: ${JSON.stringify(state.facts.filter(card => card.badges.some(badge => !badge.fits || !badge.singleLine)).map(card => card.badges))}`);
        if (surface === 'grid') assert(state.facts.every(card => card.balancedListing), `${locale} ${width}: wider mobile layouts keep photos and details balanced`);
      }
      if (!before && surface === 'home') {
        const action = page.locator('.dn-inventory__mobile-all');
        assert.equal(await action.isVisible(), width < 768, 'The compact banner action is mobile only');
        if (width < 768) {
          assert.equal(await action.getAttribute('href'), `/${locale}/cars`);
          const homeLayout = await page.evaluate(() => {
            const action = document.querySelector('.dn-inventory__mobile-all');
            const box = action.getBoundingClientRect();
            const banner = document.querySelector('.dn-inventory__heading').getBoundingClientRect();
            const title = document.querySelector('#featured-title').getBoundingClientRect();
            const guides = document.querySelector('.dn-editorial').getBoundingClientRect();
            const services = document.querySelector('.dn-mobile-services').getBoundingClientRect();
            return { buttonFits: box.top >= title.bottom && box.bottom <= banner.bottom && box.height >= 44 && action.scrollWidth <= action.clientWidth + 1,
              insideBanner: action.parentElement.classList.contains('dn-inventory__heading'),
              noFooter: !document.querySelector('.dn-inventory__mobile-footer'),
              servicesAfterGuides: services.top >= guides.bottom - 1 };
          });
          assert(homeLayout.buttonFits && homeLayout.insideBanner && homeLayout.noFooter && homeLayout.servicesAfterGuides, `Featured CTA fits inside its banner and All services follows Buying guides: ${JSON.stringify(homeLayout)}`);
          state.homeLayout = homeLayout;
        }
      }
      if ([320, 390, 1280, 1440].includes(width)) {
        await page.screenshot({ path: path.join(output, `${phase}-${surface}-${locale}-${width}.png`) });
      }
      if (!before && surface === 'home' && width < 768) {
        await page.locator('.dn-inventory__mobile-all').click();
        await page.waitForURL(url => url.pathname === `/${locale}/cars`);
        assert.deepEqual(errors, [], 'Featured banner action opens Cars without browser errors');
      }
      results.push({ locale, width, surface, desktopBaselineGutter, state, pass: true });
    }
    await context.close();
  }

  if (!before) {
    const query = '?make=BMW&equipment=4x4&equipment=Навигация&sort=price-asc';
    for (const locale of ['en', 'bg']) for (const alias of ['/listing-grid', '/listing-grid2', '/listing-list', '/listing-grid-map', '/listing-list-map']) {
      const response = await fetch(`${base}/${locale}${alias}${query}`, { redirect: 'manual' });
      assert.equal(response.status, 308);
      const destination = new URL(response.headers.get('location'), base);
      assert.equal(destination.pathname, `/${locale}/cars`);
      assert.equal(destination.search, new URL(base + query).search);
      const target = await fetch(destination);
      assert.equal(target.status, 200);
      results.push({ locale, alias, destination: destination.href, pass: true });
    }
    const sitemap = await (await fetch(base + '/sitemap.xml')).text();
    assert(sitemap.includes('/en/cars</loc>') && sitemap.includes('/bg/cars</loc>'));
    assert(!sitemap.includes('listing-grid'));
    const page = await returningPage(browser, { viewport: { width: 390, height: 884 } });
    await page.goto(`${base}/en/cars?make=BMW&sort=price-asc`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.dn-vehicle-card--listing').count(), 2);
    const firstLink = page.locator('.dn-vehicle-card--listing a').first();
    const detailHref = await firstLink.getAttribute('href');
    const returnTo = new URL(detailHref, base).searchParams.get('return');
    assert.match(returnTo, /^\/en\/cars\?make=BMW&sort=price-asc#vehicle-\d+$/);
    await firstLink.click();
    await page.waitForURL(/\/en\/listing-detail-v1\//);
    assert(await page.locator('a').filter({ hasText: /Back to cars/ }).count() || await page.locator(`a[href="${returnTo}"]`).count());
    await page.goto(`${base}/en/listing-detail-v1/4?return=${encodeURIComponent('/en/listing-grid?make=BMW&sort=price-asc#vehicle-4')}`, { waitUntil: 'networkidle' });
    const back = page.locator('a[href="/en/cars?make=BMW&sort=price-asc#vehicle-4"]:visible');
    assert(await back.count(), 'Saved legacy detail returns map to the new route, keeping query and anchor');
    await back.first().click();
    await page.waitForURL(url => url.pathname === '/en/cars' && url.hash === '#vehicle-4');
    const active = await page.locator('.dn-mobile-bottom-nav a[href="/en/cars"]').getAttribute('aria-current');
    assert.equal(active, 'page');
    const oldLinks = await page.locator('a[href*="listing-grid"],form[action*="listing-grid"]').count();
    assert.equal(oldLinks, 0, 'Visible navigation and forms use the canonical route');
    results.push({ name: 'filtered card, legacy detail return, anchor, active dock and sitemap', pass: true });
    await page.close();
  }
  await writeFile(path.join(output, phase + (journeysOnly ? '-journeys' : '') + '.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ phase, passed: results.length, output }));
} finally { await browser.close(); }
