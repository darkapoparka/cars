import assert from 'node:assert/strict';
import { launchBrowser, previewUrl } from './browser.mjs';
import { returningContext, appPath } from './locale-smoke-fixture.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const caseFilter = process.env.DESKTOP_ROUTE_CASE ? new RegExp(process.env.DESKTOP_ROUTE_CASE) : null;
const output = caseFilter ? 'artifacts/desktop-routes-smoke-focused' : 'artifacts/desktop-routes-smoke';
const suite = await smokeReport(output, base);
const browser = await launchBrowser();
const routes = ['', 'listing-grid', 'about-us', 'blog', 'contact'];

const check = (name, run) => !caseFilter || caseFilter.test(name) ? suite.check(name, run) : Promise.resolve();

async function settleHeroFonts(page) {
  // Vite registers imported font-face CSS after the initial HTML is available.
  await page.waitForFunction(() => [...document.fonts].some(font => font.family.includes('Onest')));
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
      hero: rect(hero), copy: rect(copy), heading: rect(heading), lead: rect(lead), controls: rect(controls),
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
  assert.equal(geometry.hero.height, 540, 'Desktop routes share one hero height');
  assert.equal(geometry.copy.y - geometry.hero.y, route === 'about-us' ? 232 : company ? 272 : 200, 'Each hero composition keeps its introduction anchor');
  if (route === 'about-us') {
    assert.equal(geometry.lead.y - geometry.hero.y, 232, 'About starts with its compact location badge');
    assert.equal(geometry.lead.height, 28, 'About uses a compact city badge');
    assert(geometry.lead.width <= 160, 'The About badge does not repeat the full street address');
    assert.equal(geometry.heading.y - geometry.lead.bottom, 12, 'About places its location above the title with a clear gap');
  }
  assert.equal(geometry.heading.y - geometry.hero.y, company ? 272 : 200, 'About and Contact align their titles lower in the photo banners');
  assert.equal(geometry.controls.y - geometry.hero.y, company ? 384 : 340, 'Company actions align; search and service panels keep their anchor');
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
          const onRequest = request => { if (/auto-best-desktop-.+-v[12]\.webp/.test(request.url())) sceneRequests.push(request.url()); };
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
              assert.equal(await page.locator('.dn-blog-search__submit').isVisible(), width < 992, 'The touch search button is visible only on mobile');
              assert.equal(await page.locator('.dn-blog-search__icon--mobile').isVisible(), width < 992, 'Mobile search uses its dedicated icon');
              assert.equal(await page.locator('.dn-blog-search__icon--desktop').isVisible(), width >= 992, 'Desktop retains its search icon');
            }
            const hasScene = width >= 992;
            const imageScene = route === 'about-us' || route === 'contact';
            assert.equal(sceneRequests.length, hasScene && imageScene ? 1 : 0, 'Only About and Contact request campaign raster scenes; phones load none');
            if (hasScene) {
              assert.equal(geometry.scene.artwork, imageScene ? 'image' : 'vehicles', 'Search heroes use cutouts; company heroes use larger car scenes');
              if (imageScene) {
                const scene = route === 'about-us' ? 'home-v2' : 'inventory-v2';
                assert(geometry.scene.src.endsWith(`auto-best-desktop-${scene}.webp`), 'About and Contact reuse the approved larger car banners');
              } else {
                const pair = { '': ['gclass', 'urus'], 'listing-grid': ['golf', 'a45'], blog: ['m5', 'e63'] }[route];
                assert.deepEqual(geometry.cutouts.map(car => car.vehicle), pair, 'Each destination has its own reviewed car pair');
                for (const car of geometry.cutouts) {
                  assert.match(car.src, new RegExp(`day-night-cutout-${car.vehicle}-v1\\.webp`), 'The original cutout source is used without generated props');
                  assert(Math.abs(car.width / car.height - 1000 / 667) < .01, 'Vehicles keep their natural proportions');
                }
              }
              assert.equal(geometry.scene.height, geometry.hero.height - (width < 1200 ? 140 : 0), 'Laptop crop keeps scene edges below navigation');
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
              assert.deepEqual(await page.locator('.dn-nav__list > li > a').evaluateAll(links => links.map(link => new URL(link.href).pathname.replace(/^\/(bg|en)(?=\/|$)/, '').replace(/^\/|\/$/g, ''))), ['', 'listing-grid', 'blog', 'about-us', 'contact'], 'Desktop places Guides before About in DOM and keyboard order');
              assert.equal(geometry.headingSize, width < 1200 ? '42px' : '48px');
              assert.equal(geometry.leadSize, route === '' || route === 'about-us' ? '14px' : '18px', 'Location badges use metadata type; descriptions use lead type');
              if (route !== 'about-us') assert(geometry.lead.y >= geometry.heading.bottom, 'Title and lead do not overlap');
              if (route === 'listing-grid') {
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
              const surface = { '': '.dn-inventory', 'listing-grid': '.dn-listing-results', 'about-us': '.dn-about-process', 'blog': '.dn-blog-index' }[route];
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
                for (const heading of await page.locator('.dn-inventory__heading, .dn-editorial__heading').all()) {
                  assert.equal(await heading.locator('.dn-campaign-vehicles--section').count(), 1, 'Dark section banners reuse the reviewed car artwork');
                  assert.equal(await heading.locator('.dn-vehicle-cutout').count(), 2, 'Each section banner has one vehicle pair');
                }
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
                assert.equal(await showroom.locator('a[href^="tel:"]').count(), 1, 'Showroom has one primary phone action');
                assert.equal(await showroom.locator('iframe').count(), 1, 'Map is mounted on desktop');
                assert.match(await showroom.locator('iframe').getAttribute('src'), /maps\.google\.com\/maps\?q=42\.648551,23\.341905/, 'Map uses the configured showroom coordinates');
                for (const link of await showroom.locator('a[target="_blank"]').all()) assert.match(await link.getAttribute('rel'), /noopener/, 'External links isolate their browsing context');
              }
              if (route === 'about-us') {
                const location = page.locator('.dn-about-hero .dn-hero-location a');
                const fullAddress = new URL(await location.getAttribute('href')).searchParams.get('query');
                assert.equal(await location.getAttribute('title'), fullAddress, 'The compact badge retains the full address on hover');
                assert.equal(await location.getAttribute('aria-label'), fullAddress, 'The compact badge retains the full accessible address');
                assert(fullAddress.includes(await location.innerText()), 'The visible badge identifies the configured city');
                assert.equal(await page.locator('.dn-about-showroom').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(244, 245, 247)', 'Map sits on the shared grey canvas');
                for (const panel of await page.locator('.dn-about-process__panel, .dn-desktop-showroom').all()) assert.equal(await panel.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(255, 255, 255)', 'About services and map have white outer containers');
                assert(!(await page.locator('.dn-about-hero__lead').isVisible()), 'The demo description is replaced by the location badge on desktop');
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
              assert(fonts.length && fonts.every(font => font.familyName.includes('Onest')), `Headings render in bundled Onest: ${JSON.stringify(fonts)}`);
              await cdp.detach();
            }
            if (width < 992) assert.equal(await page.locator('.dn-desktop-showroom iframe').count(), 0, 'Mobile does not request the desktop map');
            if (width === 1440 || width === 390) {
              await page.screenshot({ path: `${output}/${locale}-${width}-${route || 'home'}.png`, fullPage: true });
            }
            if (route === 'blog' && width === 1440) {
              const category = page.locator('.dn-blog-categories a:not(.active)').first();
              assert.equal(await category.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(255, 255, 255)', 'Inactive categories have visible white pill surfaces');
              const selected = await page.locator('.dn-blog-categories .active').evaluate(e => getComputedStyle(e).backgroundColor);
              await category.hover();
              assert.equal(await category.evaluate(e => getComputedStyle(e).backgroundColor), selected, 'Category hover preserves the red surface behind white text');
              const search = page.locator('#dn-blog-search');
              await search.focus();
              assert.equal(await search.evaluate(e => getComputedStyle(e).outlineStyle), 'solid', 'Search has a visible focus outline');
            }
            if (route === 'listing-grid' && width === 1440) {
              const count = page.locator('.dn-listing-hero__copy p');
              await page.locator('.dn-discovery select[name=make]').selectOption('Audi');
              await page.locator('.dn-discovery__submit').click();
              await page.waitForURL(url => url.searchParams.get('make') === 'Audi', { waitUntil: 'domcontentloaded' });
              assert(new URL(page.url()).pathname.startsWith(`/${locale}/`), 'Search preserves the chosen language');
              assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
              assert.equal(await count.innerText(), locale === 'bg' ? '2 автомобила' : '2 cars', 'Hero count agrees with applied results');
              await page.goto(`${base}/${locale}/listing-grid?q=zzzznomatch`, { waitUntil: 'domcontentloaded' });
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
          for (const route of ['listing-grid', 'about-us', 'contact', 'blog', '']) {
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
            if (route === 'listing-grid' || route === '') {
              assert.deepEqual(geometry.controls, initial.controls, 'Home and Inventory share the complete search-panel bounds');
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
            assert(geometry.scene.src.endsWith('auto-best-desktop-inventory-v2.webp'), 'Service entries use the approved Contact banner');
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
