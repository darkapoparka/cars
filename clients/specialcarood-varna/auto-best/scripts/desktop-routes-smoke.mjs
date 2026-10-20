import assert from 'node:assert/strict';
import { launchBrowser, previewUrl } from './browser.mjs';
import { returningContext, appPath } from './locale-smoke-fixture.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const caseFilter = process.env.DESKTOP_ROUTE_CASE ? new RegExp(process.env.DESKTOP_ROUTE_CASE) : null;
const output = caseFilter ? 'artifacts/desktop-routes-smoke-focused' : 'artifacts/desktop-routes-smoke';
const suite = await smokeReport(output, base);
const browser = await launchBrowser();
const routes = ['', 'cars', 'about-us', 'blog', 'contact'];

const check = (name, run) => !caseFilter || caseFilter.test(name) ? suite.check(name, run) : Promise.resolve();

async function settleHeroFonts(page) {
  // Vite registers imported font-face CSS after the initial HTML is available.
  await page.waitForFunction(() => [...document.fonts].some(font => font.family.includes('Inter') && font.status === 'loaded'));
  await page.evaluate(async () => {
    const heading = document.querySelector('.dn-route-hero h1');
    // Load the actual heading glyphs before sampling CDP font usage after route changes.
    await document.fonts.load(getComputedStyle(heading).font, heading.textContent);
    await document.fonts.ready;
  });
}

async function heroGeometry(page) {
  return page.evaluate(() => {
    const hero = document.querySelector('.dn-route-hero');
    const copy = hero.querySelector('.dn-route-hero__copy');
    const heading = hero.querySelector('h1');
    const lead = copy.querySelector('p');
    const scene = hero.querySelector('.dn-desktop-hero-scene');
    const sceneImage = scene?.querySelector(':scope > picture > img');
    const rect = e => e?.getBoundingClientRect().toJSON();
    const controls = document.querySelector('.dn-search, .dn-listing-filter, .dn-blog-toolbar, .dn-about-hero .dn-about-button, .dn-contact-hero__desktop-actions, .dn-contact-hero__action');
    return {
      hero: rect(hero), copy: rect(copy), heading: rect(heading), lead: rect(lead), leadVisible: lead.checkVisibility(), controls: rect(controls),
      eyebrow: rect(copy.querySelector('.dn-company-hero__eyebrow')),
      header: rect(document.querySelector('.dn-header-fixed')),
      logo: rect(document.querySelector('.dn-logo img')),
      navigation: rect(document.querySelector('.dn-nav')),
      backgroundImage: getComputedStyle(hero).backgroundImage,
      scene: scene ? { src: sceneImage?.currentSrc ?? null, artwork: scene.dataset.artwork, ...rect(scene) } : null,
      cutouts: [...hero.querySelectorAll('.dn-campaign-vehicles__car')].filter(car => car.getBoundingClientRect().width).map(car => ({ vehicle: car.dataset.vehicle, src: car.querySelector('img').currentSrc, ...rect(car.querySelector('img')) })),
      font: getComputedStyle(heading).fontFamily,
      headingSize: getComputedStyle(heading).fontSize,
      leadSize: getComputedStyle(lead).fontSize,
      overflow: document.documentElement.scrollWidth - innerWidth,
      broken: [...document.images].filter(i => i.getBoundingClientRect().width && !i.naturalWidth).map(i => i.currentSrc)
    };
  });
}

function assertDesktopFrame(geometry, route = '') {
  const company = route === 'about-us' || route === 'contact';
  const search = ['', 'cars', 'blog'].includes(route);
  assert.equal(geometry.hero.height, 540, 'Desktop routes share one hero height');
  if (!search) assert.equal(geometry.copy.y - geometry.hero.y, 200, 'Company and service heroes keep their introduction anchor');
  if (route === 'about-us') {
    assert.equal(geometry.lead.y - geometry.heading.bottom, 8, 'About places its plain location subtitle directly below the title');
  }
  if (company) {
    assert(geometry.eyebrow.height >= 20, 'Company heroes keep their page label above the headline');
    assert.equal(geometry.heading.y - geometry.eyebrow.bottom, 12, 'Company page labels clear the headline');
    assert(geometry.heading.height >= parseFloat(geometry.headingSize) * 2, 'Company introductions have a substantial two-line headline');
    assert.equal(geometry.controls.y - geometry.copy.bottom, 24, 'Company actions flow below the complete introduction');
  } else {
    if (search) {
      assert(Math.abs(geometry.controls.y - geometry.heading.bottom - 28) < 1, 'Search titles sit 28px above their panel without an empty subtitle row');
      assert.equal(geometry.leadVisible, false, 'Search heroes omit their supplementary desktop line');
    } else {
      assert.equal(geometry.heading.y - geometry.hero.y, 200, 'Service titles keep their introduction anchor');
    }
    assert.equal(geometry.controls.y - geometry.hero.y, 340, 'Search and service panels keep their shared anchor');
  }
  assert(geometry.copy.y >= geometry.header.bottom + 60, 'Hero titles have at least 60px of breathing room below navigation');
  assert(geometry.controls.y >= geometry.copy.bottom + 20, 'Hero controls clear copy');
  assert(geometry.controls.bottom <= geometry.hero.bottom + 1, 'Hero controls fit banner');
}

try {
  for (const locale of ['bg', 'en']) {
    for (const width of [320, 390, 992, 1024, 1440, 1920]) {
      const context = await returningContext(browser, { viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      await context.addCookies([{ name: 'cars_locale', value: locale, url: base, httpOnly: true, sameSite: 'Lax' }]);
      const page = await context.newPage();
      for (const route of routes) {
        await check(`${locale}/${route || 'home'} at ${width}`, async () => {
          const errors = [];
          const sceneRequests = [];
          const onError = error => errors.push(error.message);
          const onRequest = request => { if (/auto-best-desktop-.+-v[123]\.webp/.test(request.url())) sceneRequests.push(request.url()); };
          page.on('pageerror', onError);
          page.on('request', onRequest);
          try {
            // Wait for the page's actual fonts/images below, not idle third-party map/video traffic.
            const response = await page.goto(`${base}/${locale}/${route}`, { waitUntil: 'domcontentloaded' });
            assert.equal(response.status(), 200);
            await settleHeroFonts(page);
            // Scroll before screenshots so native lazy images are actually requested.
            for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 800) {
              await page.evaluate(y => scrollTo(0, y), y);
              await page.waitForTimeout(40);
            }
            await page.evaluate(async () => {
              await Promise.all([...document.images].filter(i => i.getBoundingClientRect().width).map(i => i.decode().catch(() => {})));
              scrollTo(0, 0);
            });
            const geometry = await heroGeometry(page);
            assert(geometry.overflow <= 1, 'Horizontal page overflow');
            assert.deepEqual(geometry.broken, [], 'Broken visible images');
            assert.deepEqual(errors, [], 'Browser runtime errors');
            if (route === 'blog') {
              if (width >= 992) {
                assert(await page.locator('.dn-blog-search__submit').isVisible(), 'Desktop article search has an explicit submit action');
                assert(await page.locator('.dn-blog-search__submit-icon--desktop').isVisible(), 'Desktop search uses the same search glyph as Home');
                assert(await page.locator('.dn-blog-search__icon--desktop').isVisible(), 'Desktop retains its search icon');
              } else {
                const trigger = page.locator('.dn-blog-search-trigger');
                assert(await trigger.isVisible(), 'Mobile has its dedicated article search field');
                assert(await trigger.locator('.dn-blog-search-trigger__arrow').isVisible(), 'The touch search field keeps its mobile arrow');
                await trigger.click();
                const dialog = page.locator('.dn-blog-search-dialog');
                await dialog.waitFor({ state: 'visible' });
                assert(await dialog.locator('input[type="search"]').isVisible(), 'Mobile search opens its query editor');
                assert(await dialog.locator('button[type="submit"]').isVisible(), 'The search overlay has an explicit result action');
                await dialog.locator('.dn-overlay-close').click();
                await dialog.waitFor({ state: 'hidden' });
                assert(await trigger.evaluate(element => document.activeElement === element), 'Closing search restores focus to its field');
              }
            }
            const hasScene = width >= 992;
            const imageScene = route === 'about-us' || route === 'contact';
            assert.equal(sceneRequests.length, hasScene && imageScene ? 1 : 0, 'Only About and Contact request campaign raster scenes; phones load none');
            if (hasScene) {
              if (route === 'blog') {
                const cards = await page.locator('.dn-blog-grid > .dn-blog-card').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().toJSON()));
                const firstRow = cards.filter(card => Math.abs(card.y - cards[0].y) < 1);
                assert.equal(firstRow.length, width >= 1360 ? 4 : 2, 'The editorial index uses four wide-desktop columns and two compact-desktop columns');
                assert(cards[0].y >= geometry.hero.bottom + 32 && cards[0].y <= geometry.hero.bottom + 64, 'Article cards follow the hero without an extra empty margin');
              }
              assert.equal(geometry.scene.artwork, imageScene ? 'image' : 'vehicles', 'Search heroes use cutouts; company heroes use larger car scenes');
              if (imageScene) {
                const scene = route === 'about-us' ? 'home-v3' : 'inventory-v3';
                assert(geometry.scene.src.endsWith(`auto-best-desktop-${scene}.webp`), 'About and Contact reuse the approved larger car banners');
              } else {
                const pair = { '': ['gclass', 'urus'], 'cars': ['golf', 'a45'], blog: ['m5', 'e63'] }[route];
                assert.deepEqual(geometry.cutouts.map(car => car.vehicle), pair, 'Each destination has its own reviewed car pair');
                if (route === '' || route === 'cars' || route === 'blog') {
                  const discoveryScene = page.locator('.dn-desktop-hero-scene');
                  assert.equal(await discoveryScene.locator('.dn-campaign-vehicles__dots, .dn-campaign-vehicles__arc').count(), 0, 'Home, Inventory and Advice omit their old native decoration');
                  assert.match(await discoveryScene.evaluate(scene => getComputedStyle(scene).backgroundImage), /home-section-shared-backdrop-v1\.webp/, 'Discovery heroes reuse the shared graphite background');
                }
                for (const car of geometry.cutouts) {
                  assert.match(car.src, new RegExp(`day-night-cutout-${car.vehicle}-v1\\.webp`), 'The original cutout source is used without generated props');
                  assert(Math.abs(car.width / car.height - 1000 / 667) < .01, 'Vehicles keep their natural proportions');
                }
              }
              const sceneInset = geometry.scene.artwork === 'image' ? 0 : width < 1200 ? 140 : 0;
              assert.equal(geometry.scene.height, geometry.hero.height - sceneInset, 'Raster scenes retain their full floor anchor; cutouts keep the laptop navigation inset');
              assert.equal(geometry.scene.bottom, geometry.hero.bottom, 'Scene meets the banner baseline');
            }
            assert.equal(geometry.cutouts.length, hasScene && !imageScene ? 2 : 0, 'Cutouts appear only in their configured desktop scenes');
            assert.equal(await page.locator('.dn-hero-vehicles__car').count(), 0, 'The mobile hero renderer does not add another desktop pair');
            if (!hasScene) {
              for (const image of await page.locator('.dn-campaign-vehicles img').all()) {
                assert((await image.evaluate(image => image.currentSrc)).startsWith('data:image/gif;'), 'Hidden desktop pairs do not load car artwork on mobile');
              }
            }
            if (width >= 992) {
              assertDesktopFrame(geometry, route);
              if (!imageScene && width < 1200) {
                const vehicleBodies = await page.locator('.dn-route-hero .dn-campaign-vehicles__car').evaluateAll(cars => cars.map(car => {
                  const style = getComputedStyle(car);
                  const box = car.getBoundingClientRect();
                  const heightRatio = parseFloat(style.getPropertyValue('--art-height-ratio'));
                  const bottomRatio = parseFloat(style.getPropertyValue('--art-bottom-ratio'));
                  return { bottom: box.top + box.height * bottomRatio / heightRatio };
                }));
                for (const body of vehicleBodies) assert(body.bottom <= geometry.controls.y - 12, 'Laptop search panels leave the painted vehicle bodies visible above their outer corners');
              }
              assert.deepEqual(await page.locator('.dn-nav__list > li > a').evaluateAll(links => links.map(link => new URL(link.href).pathname.replace(/^\/(bg|en)(?=\/|$)/, '').replace(/^\/|\/$/g, ''))), ['', 'cars', 'blog', 'about-us', 'contact'], 'Desktop places Guides before About in DOM and keyboard order');
              assert.equal(geometry.headingSize, imageScene ? (width < 1200 ? '48px' : '56px') : (width < 1200 ? '32px' : '48px'));
              if (!['', 'cars', 'blog'].includes(route)) {
                assert.equal(geometry.leadSize, '18px', 'Company subtitles use lead type');
                assert(geometry.lead.y >= geometry.heading.bottom, 'Title and lead do not overlap');
              }
              if (route === 'blog') {
                const panel = page.locator('.dn-blog-toolbar');
                const panelStyle = await panel.evaluate(e => {
                  const s = getComputedStyle(e);
                  return { background: s.backgroundColor, radius: s.borderRadius, padding: parseFloat(s.paddingLeft) };
                });
                assert.equal(panelStyle.background, 'rgb(255, 255, 255)', 'Search and categories share one white panel');
                assert.equal(panelStyle.radius, '16px', 'The Blog panel uses the Home panel radius');
                for (const selector of ['.dn-blog-search', '.dn-blog-categories']) {
                  const control = await page.locator(selector).boundingBox();
                  assert(control.x >= geometry.controls.x + panelStyle.padding && control.x + control.width <= geometry.controls.right - panelStyle.padding + 1, 'Search and categories share the panel inset');
                  assert(control.y >= geometry.controls.y + panelStyle.padding && control.y + control.height <= geometry.controls.bottom - panelStyle.padding + 1, 'The complete search and category row fit inside the white panel');
                }
              }
              if (route === 'cars') {
                const count = await page.locator('.dn-listing-results .dn-vehicle-card').count();
                assert.equal(await page.locator('.dn-listing-hero__copy p').innerText(), locale === 'bg' ? `${count} автомобила` : `${count} cars`);
                for (const card of await page.locator('.dn-listing-results .dn-vehicle-card').all()) {
                  const title = await card.locator('.dn-vehicle-card__name').getAttribute('title');
                  assert((await card.locator('.dn-vehicle-card__link').getAttribute('aria-label')).includes(title), 'The accessible card label retains the complete vehicle title');
                  const spacing = await card.evaluate(e => {
                    const name = e.querySelector('.dn-vehicle-card__name');
                    const specs = e.querySelector('.dn-vehicle-card__specs');
                    return { titleHeight: name.getBoundingClientRect().height, lineHeight: parseFloat(getComputedStyle(name).lineHeight), gap: specs.getBoundingClientRect().top - name.getBoundingClientRect().bottom };
                  });
                  assert(spacing.titleHeight <= spacing.lineHeight + 1, 'Desktop card models occupy one line while complete titles remain available');
                  assert(spacing.gap >= 8 && spacing.gap <= 16, 'Card specifications follow the title without an empty spacer');
                }
              }
              if (route === 'about-us' || route === 'contact') {
                const social = page.locator('.dn-desktop-socials a');
                assert.equal(await social.count(), 0, 'The master has no borrowed dealer social accounts');
              }
              const surface = { '': '.dn-inventory', 'cars': '.dn-listing-results', 'about-us': '.dn-about-process', 'blog': '.dn-blog-index' }[route];
              if (surface) assert.equal(await page.locator(surface).evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(244, 245, 247)', 'Desktop routes share a light-grey content canvas');
              assert.equal(await page.locator('.dn-route-hero').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(21, 24, 29)', 'Every hero has the same graphite fallback surface');
              assert.equal(await page.locator('.dn-route-hero h1').evaluate(e => getComputedStyle(e).color), 'rgb(255, 255, 255)', 'All desktop hero headings use readable white copy');
              if (route === 'contact') {
                assert.equal(await page.locator('.dn-contact-hero__call').getAttribute('href'), 'tel:+359879824625');
                const showroom = await page.locator('.dn-desktop-showroom').boundingBox();
                assert.equal(showroom.y - geometry.hero.bottom, 32, 'The visit panel follows the complete hero instead of obscuring it');
                await page.locator('.dn-contact-hero__visit').focus();
                assert.equal(await page.locator('.dn-contact-hero__visit').evaluate(e => getComputedStyle(e).outlineStyle), 'solid');
                assert.equal(await page.locator('.dn-contact-hero__visit').evaluate(e => getComputedStyle(e).outlineColor), 'rgb(255, 255, 255)', 'Directions has a visible focus ring against the dark campaign artwork');
                await page.locator('.dn-contact-hero__visit').click();
                assert.equal(new URL(page.url()).hash, '#contact-intent', 'Directions takes the visitor to the visit panel');
                await page.evaluate(() => scrollTo(0, 0));
              }
              if (route === '') {
                const sectionBannerSurfaces = new Set();
                for (const selector of ['.dn-inventory__heading', '.dn-body-types__heading', '.dn-brand-hero__copy', '.dn-editorial__heading']) {
                  const heading = page.locator(selector);
                  assert.equal(await heading.locator('.dn-campaign-vehicles, .dn-vehicle-cutout').count(), 0, 'Home section headers leave vehicle imagery to the cards');
                  const surface = await heading.evaluate(e => ({ image: getComputedStyle(e).backgroundImage, color: getComputedStyle(e).backgroundColor }));
                  assert.match(surface.image, /home-section-shared-backdrop-v1\.webp/, 'Home section banners use the same graphite-dot background');
                  assert.equal(surface.color, 'rgb(21, 24, 29)', 'Home section banners use the shared charcoal surface');
                  sectionBannerSurfaces.add(surface.image);
                }
                assert.equal(sectionBannerSurfaces.size, 1, 'Every Home section banner uses one common background');
                for (const section of await page.locator('.dn-home-content-section').all()) assert.equal(await section.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(244, 245, 247)', 'Home sections use one canvas');
                for (const card of await page.locator('.dn-vehicle-card').all()) assert.equal(await card.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(255, 255, 255)', 'Vehicle cards remain white');
                for (const card of await page.locator('.dn-body-type, .dn-brand-card').filter({ visible: true }).all()) {
                  assert.equal(await card.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(246, 247, 249)', 'Discovery tiles start on the subtle surface');
                  await card.hover();
                  assert.equal(await card.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(255, 255, 255)', 'Hover restores the white tile');
                }
              }
              if (route === 'about-us' || route === 'contact') {
                const showroom = page.locator('.dn-desktop-showroom');
                await showroom.locator('iframe').waitFor({ state: 'attached' });
                assert(await showroom.isVisible(), 'Desktop uses one contact-and-map panel');
                assert.equal(await showroom.locator('a[href^="tel:"]').count(), route === 'contact' ? 1 : 0, 'About keeps directions only; Contact retains its phone action');
                assert.equal(await showroom.locator('iframe').count(), 1, 'Map is mounted on desktop');
                assert.match(await showroom.locator('iframe').getAttribute('src'), /maps\.google\.com\/maps\?q=42\.648551,23\.341905/, 'Map uses the configured showroom coordinates');
                for (const link of await showroom.locator('a[target="_blank"]').all()) assert.match(await link.getAttribute('rel'), /noopener/, 'External links isolate their browsing context');
              }
              if (route === 'about-us') {
                const subtitle = page.locator('.dn-about-hero .dn-hero-location--subtitle');
                const location = subtitle.locator('a');
                const fullAddress = new URL(await location.getAttribute('href')).searchParams.get('query');
                assert.equal(await location.getAttribute('title'), fullAddress, 'The subtitle directions link retains the full address on hover');
                assert((await location.getAttribute('aria-label')).includes(fullAddress), 'Directions has a localized accessible label with the full address');
                for (const part of (await location.innerText()).split(' · ')) assert(fullAddress.includes(part), 'The visible subtitle contains the configured city and street address');
                assert.deepEqual(await subtitle.evaluate(e => {
                  const s = getComputedStyle(e);
                  return { background: s.backgroundColor, radius: s.borderRadius, padding: s.padding };
                }), { background: 'rgba(0, 0, 0, 0)', radius: '0px', padding: '0px' }, 'About presents its location as a plain subtitle without a badge');
                await location.hover();
                assert.equal(await location.evaluate(e => getComputedStyle(e).color), 'rgb(255, 255, 255)', 'The location remains readable on hover');
                await location.focus();
                assert.equal(await location.evaluate(e => getComputedStyle(e).outlineColor), 'rgb(255, 255, 255)', 'Directions has a visible white focus ring on the dark hero');
                assert.equal(await page.locator('.dn-about-showroom').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(244, 245, 247)', 'Map sits on the shared grey canvas');
                for (const panel of await page.locator('.dn-about-process__panel, .dn-desktop-showroom').all()) assert.equal(await panel.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(255, 255, 255)', 'About services and map have white outer containers');
                const services = await page.locator('.dn-about-process__panel').boundingBox();
                const visit = await page.locator('.dn-desktop-showroom').boundingBox();
                assert(Math.abs(visit.y - (services.y + services.height) - 64) <= 1, 'Showroom follows services with the shared 64px section gap');
              }
              // Verify actual glyph rendering, including Cyrillic, rather than only the CSS font stack.
              // The inventory/map scroll pass can leave the heading unpainted when CDP samples it.
              await page.locator('.dn-route-hero h1').screenshot();
              const cdp = await context.newCDPSession(page);
              await cdp.send('DOM.enable');
              await cdp.send('CSS.enable');
              const { root } = await cdp.send('DOM.getDocument');
              const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '.dn-route-hero h1' });
              const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
              assert(fonts.length && fonts.every(font => font.familyName.includes('Inter')), `Headings render in bundled Inter: ${JSON.stringify(fonts)}`);
              await cdp.detach();
            }
            if (width < 992) assert.equal(await page.locator('.dn-desktop-showroom iframe').count(), 0, 'Mobile does not request the desktop map');
            if (width === 1440 || width === 390) {
              await page.screenshot({ path: `${output}/${locale}-${width}-${route || 'home'}.png`, fullPage: true });
            }
            if (route === 'blog' && width === 1440) {
              const category = page.locator('.dn-blog-categories a:not(.active)').first();
              assert.equal(await category.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(246, 247, 249)', 'Inactive categories use pale pill surfaces inside the white panel');
              const selected = await page.locator('.dn-blog-categories .active').evaluate(e => getComputedStyle(e).backgroundColor);
              await category.hover();
              assert.equal(await category.evaluate(e => getComputedStyle(e).backgroundColor), selected, 'Category hover preserves the red surface behind white text');
              const search = page.locator('#dn-blog-search');
              await search.focus();
              assert.equal(await search.evaluate(e => getComputedStyle(e).outlineStyle), 'solid', 'Search has a visible focus outline');
              const submit = page.locator('.dn-blog-search__submit');
              await submit.focus();
              assert.equal(await submit.evaluate(e => getComputedStyle(e).outlineStyle), 'solid', 'The desktop search action has visible keyboard focus');
              const total = await page.locator('.dn-blog-card').count();
              const selectedCategory = new URL(await category.getAttribute('href'), base).searchParams.get('category');
              await category.click();
              await page.waitForURL(url => url.searchParams.get('category') === selectedCategory);
              const query = await page.locator('.dn-blog-card h2').first().innerText();
              await search.fill(query);
              await submit.click();
              await page.waitForURL(url => url.searchParams.get('q') === query);
              assert.equal(new URL(page.url()).pathname, `/${locale}/blog`, 'Article search preserves the chosen language');
              assert.equal(new URL(page.url()).searchParams.get('category'), selectedCategory, 'Article search preserves the selected category');
              assert.equal(await page.locator('.dn-blog-card').count(), 1, 'Native GET search filters the localized article title');
              await search.fill('zzzznomatch');
              await search.press('Enter');
              await page.waitForURL(url => url.searchParams.get('q') === 'zzzznomatch');
              assert(await page.locator('.dn-blog-empty').isVisible(), 'Keyboard submission shows the honest empty result');
              await page.locator('.dn-blog-categories a').first().click();
              await page.waitForURL(url => !url.searchParams.has('category'));
              assert.equal(new URL(page.url()).searchParams.get('q'), 'zzzznomatch', 'Changing category preserves the search query');
              await search.fill('');
              await submit.click();
              await page.waitForURL(url => url.searchParams.get('q') === '');
              assert.equal(await page.locator('.dn-blog-card').count(), total, 'Clearing search restores the complete article list');
            }
            if (route === 'cars' && width === 1440) {
              const count = page.locator('.dn-listing-hero__copy p');
              await page.locator('.dn-discovery [data-facet=make]').click();
              const picker = page.locator('#dn-listing-filter-dialog');
              await picker.getByRole('radio', { name: 'Audi', exact: true }).click();
              await picker.locator('.dn-listing-filter__dialog-submit').click();
              await page.waitForURL(url => url.searchParams.get('make') === 'Audi', { waitUntil: 'domcontentloaded' });
              assert(new URL(page.url()).pathname.startsWith(`/${locale}/`), 'Search preserves the chosen language');
              assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
              assert.equal(await count.innerText(), locale === 'bg' ? '2 автомобила' : '2 cars', 'Hero count agrees with applied results');
              await page.goto(`${base}/${locale}/cars?q=zzzznomatch`, { waitUntil: 'domcontentloaded' });
              assert.equal(await count.innerText(), locale === 'bg' ? '0 автомобила' : '0 cars', 'Zero matches remain explicit');
              assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 0);
            }
            return geometry;
          } finally {
            page.off('pageerror', onError);
            page.off('request', onRequest);
          }
        });
      }
      if (width === 1440) {
        await check(`${locale}/desktop header navigation keeps hero anchors`, async () => {
          await page.goto(`${base}/${locale}/`, { waitUntil: 'networkidle' });
          await settleHeroFonts(page);
          await page.locator('.dn-logo img').evaluate(image => image.decode());
          const guides = page.locator(`.dn-nav__list > li > a[href="/${locale}/blog"]`);
          const about = page.locator(`.dn-nav__list > li > a[href="/${locale}/about-us"]`);
          await guides.focus();
          await page.keyboard.press('Tab');
          assert(await about.evaluate(link => link === document.activeElement), 'Keyboard navigation follows Guides with About');
          const initial = await heroGeometry(page);
          const frames = [];
          for (const route of ['cars', 'about-us', 'contact', 'blog', '']) {
            const links = page.locator('.dn-nav__list > li > a');
            const index = await links.evaluateAll((items, route) => items.findIndex(link =>
              new URL(link.href).pathname.replace(/^\/(bg|en)(?=\/|$)/, '').replace(/^\/|\/$/g, '') === route
            ), route);
            assert(index >= 0, `Header has a destination for ${route || 'home'}`);
            // Hover opens the existing disclosure menu; clicking its title then navigates.
            await links.nth(index).hover();
            if (await links.nth(index).getAttribute('aria-expanded') !== null) {
              await page.waitForFunction(index => document.querySelectorAll('.dn-nav__list > li > a')[index].getAttribute('aria-expanded') === 'true', index);
            }
            await links.nth(index).click();
            await page.waitForURL(url => appPath(url) === (route ? `/${route}` : '/') && !url.search, { waitUntil: 'domcontentloaded' });
            await settleHeroFonts(page);
            await page.evaluate(async () => {
              await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            });
            const geometry = await heroGeometry(page);
            assertDesktopFrame(geometry, route);
            const { src: currentSource, artwork: _currentArtwork, ...currentScene } = geometry.scene;
            const { src: initialSource, artwork: _initialArtwork, ...initialScene } = initial.scene;
            assert.deepEqual(currentScene, initialScene, 'Artwork framing stays fixed through header navigation');
            if (route) assert.notEqual(currentSource ?? geometry.cutouts.map(car => car.vehicle).join(','), initialSource ?? initial.cutouts.map(car => car.vehicle).join(','), 'Main destinations have individual artwork');
            for (const element of ['header', 'logo', 'navigation']) {
              assert.deepEqual(geometry[element], initial[element], `${element} keeps its position and size when switching routes`);
            }
            if (route === 'cars' || route === '') {
              assert.deepEqual(geometry.controls, initial.controls, 'Home and Inventory share the complete search-panel bounds');
            }
            if (route === 'blog') {
              assert.equal(geometry.controls.x, initial.controls.x, 'Blog uses the Home panel alignment');
              assert.equal(geometry.controls.width, initial.controls.width, 'Blog uses the Home panel width');
            }
            frames.push({ route: route || 'home', hero: geometry.hero, heading: geometry.heading, controls: geometry.controls, scene: geometry.scene, logo: geometry.logo });
          }
          return frames;
        });
        for (const topic of ['trade-in', 'import', 'leasing']) {
          await check(`${locale}/contact ${topic} keeps the desktop hero frame`, async () => {
            await page.goto(`${base}/${locale}/contact?topic=${topic}`, { waitUntil: 'domcontentloaded' });
            await settleHeroFonts(page);
            const geometry = await heroGeometry(page);
            assertDesktopFrame(geometry);
            assert.equal(geometry.scene.artwork, 'image', 'Service entries share the larger Contact car scene');
            assert(geometry.scene.src.endsWith('company-contact-studio-v4.webp'), 'Service entries use the Contact studio banner');
            assert.equal(geometry.cutouts.length, 0, 'Service entries have one artwork layer');
            assert.equal(await page.locator('.dn-hero-vehicles__car').count(), 0, 'Service illustrations remain mobile only');
            assert(geometry.overflow <= 1, 'Service route has no horizontal overflow');
            return geometry;
          });
        }
      }
      // Cancel embedded map traffic before disposing the context.
      await page.goto('about:blank');
      await context.close();
    }
  }
} finally {
  await browser.close();
  await suite.finish();
}
