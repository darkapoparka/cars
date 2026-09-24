import assert from 'node:assert/strict';
import { launchBrowser, previewUrl } from './browser.mjs';
import { returningContext } from './locale-smoke-fixture.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const output = 'artifacts/desktop-routes-smoke';
const suite = await smokeReport(output, base);
const browser = await launchBrowser();
const routes = ['', 'listing-grid', 'about-us', 'blog', 'contact'];

try {
  for (const locale of ['bg', 'en']) {
    for (const width of [390, 992, 1024, 1440, 1920]) {
      const context = await returningContext(browser, { viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      await context.addCookies([{ name: 'cars_locale', value: locale, url: base, httpOnly: true, sameSite: 'Lax' }]);
      const page = await context.newPage();
      for (const route of routes) {
        await suite.check(`${locale}/${route || 'home'} at ${width}`, async () => {
          const errors = [];
          const sceneRequests = [];
          const onError = error => errors.push(error.message);
          const onRequest = request => { if (/auto-best-desktop-.+-v1\.webp/.test(request.url())) sceneRequests.push(request.url()); };
          page.on('pageerror', onError);
          page.on('request', onRequest);
          try {
            // Wait for the page's actual fonts/images below, not idle third-party map/video traffic.
            const response = await page.goto(`${base}/${locale}/${route}`, { waitUntil: 'domcontentloaded' });
            assert.equal(response.status(), 200);
            await page.evaluate(() => document.fonts.ready);
            // Scroll before screenshots so native lazy images are actually requested.
            for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 800) {
              await page.evaluate(y => scrollTo(0, y), y);
              await page.waitForTimeout(40);
            }
            await page.evaluate(async () => {
              await Promise.all([...document.images].filter(i => i.getBoundingClientRect().width).map(i => i.decode().catch(() => {})));
              scrollTo(0, 0);
            });
            const geometry = await page.evaluate(() => {
              const hero = document.querySelector('.dn-route-hero');
              const copy = hero.querySelector('.dn-route-hero__copy');
              const heading = hero.querySelector('h1');
              const lead = copy.querySelector('p');
              const scene = hero.querySelector('.dn-desktop-hero-scene img');
              const rect = e => e?.getBoundingClientRect().toJSON();
              const controls = document.querySelector('.dn-search__desktop-form, .dn-listing-desktop-discovery, .dn-blog-toolbar, .dn-about-hero .dn-about-button, .dn-contact-actions');
              return {
                hero: rect(hero), copy: rect(copy), heading: rect(heading), lead: rect(lead), controls: rect(controls),
                header: rect(document.querySelector('.dn-header-fixed')),
                backgroundImage: getComputedStyle(hero).backgroundImage,
                scene: scene ? { src: scene.currentSrc, ...rect(scene) } : null,
                cutouts: [...hero.querySelectorAll('.dn-hero-vehicles__car img')].map(image => ({ src: image.currentSrc, ...rect(image) })),
                font: getComputedStyle(heading).fontFamily,
                headingSize: getComputedStyle(heading).fontSize,
                leadSize: getComputedStyle(lead).fontSize,
                overflow: document.documentElement.scrollWidth - innerWidth,
                broken: [...document.images].filter(i => i.getBoundingClientRect().width && !i.naturalWidth).map(i => i.currentSrc)
              };
            });
            assert(geometry.overflow <= 1, 'Horizontal page overflow');
            assert.deepEqual(geometry.broken, [], 'Broken visible images');
            assert.deepEqual(errors, [], 'Browser runtime errors');
            const hasScene = route === 'about-us' && width >= 992;
            assert.equal(sceneRequests.length, hasScene ? 1 : 0, 'Only the visible route scene is requested; phones load none');
            if (hasScene) {
              assert(geometry.scene.src.endsWith('auto-best-desktop-about-v1.webp'), 'Only About retains the architectural scene');
              assert.equal(geometry.scene.height, geometry.hero.height - (width < 1200 ? 140 : 0), 'Laptop crop keeps scene edges below navigation');
              assert.equal(geometry.scene.bottom, geometry.hero.bottom, 'Scene meets the banner baseline');
            }
            if (route !== 'about-us') {
              assert.equal(geometry.scene, null, 'Cutout routes omit the full scene element');
              assert.equal(geometry.cutouts.length, 2, 'The original cutout pair is rendered');
              assert(geometry.cutouts.every(image => width >= 1440 ? (!image.width || image.src.startsWith('http')) : image.src.startsWith('data:')), 'Visible wide cutouts load; narrow screens use placeholders');
              if (width >= 1440 && (route === '' || route === 'listing-grid')) {
                assert(geometry.cutouts[0].right <= geometry.controls.x, 'Left car stays clear of search');
                assert(geometry.cutouts[1].x >= geometry.controls.right, 'Right car stays clear of search');
              }
            }
            if (width >= 992) {
              assert.equal(geometry.hero.height, 540, 'Shared desktop hero height');
              if (!hasScene) assert.equal(geometry.backgroundImage, 'none', 'Cutouts use solid neutral surfaces');
              assert.equal(geometry.headingSize, width < 1200 ? '42px' : '48px');
              assert.equal(geometry.leadSize, '18px');
              assert(geometry.copy.y >= geometry.header.bottom + 8, 'Hero text clears navigation');
              assert(geometry.controls.y >= geometry.copy.bottom + 20, 'Hero controls clear copy');
              assert(geometry.controls.bottom <= geometry.hero.bottom + 1, 'Hero controls fit banner');
              assert(geometry.lead.y >= geometry.heading.bottom, 'Title and lead do not overlap');
              if (route === 'listing-grid') assert.equal(await page.locator('.dn-listing-hero__copy p').innerText(), locale === 'bg' ? '8 автомобила' : '8 cars');
              if (route === 'about-us' || route === 'contact') {
                const social = page.locator(route === 'about-us' ? '.dn-about-socials a' : '.dn-contact-actions__social a');
                assert.equal(await social.count(), 3);
                for (const link of await social.all()) {
                  const box = await link.boundingBox();
                  assert.equal(box.width, 56); assert.equal(box.height, 56);
                  assert.equal((await link.locator('svg').boundingBox()).width, 28);
                  assert.equal(await link.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(255, 255, 255)');
                  assert(box.y + box.height <= geometry.hero.bottom, 'Social controls fit within hero');
                }
              }
              const surface = { '': '.dn-inventory', 'listing-grid': '.dn-listing-results', 'about-us': '.dn-about-process', 'blog': '.dn-blog-index' }[route];
              if (surface) assert.equal(await page.locator(surface).evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(244, 245, 247)', 'Desktop routes share a light-grey content canvas');
              if (route === '' || route === 'blog') assert.equal(await page.locator('.dn-route-hero').evaluate(e => getComputedStyle(e).backgroundColor), route === '' ? 'rgb(244, 245, 247)' : 'rgb(255, 255, 255)', 'Home hero is soft grey; Blog hero remains white');
              if (route === '') {
                for (const section of await page.locator('.dn-home-content-section').all()) assert.equal(await section.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(244, 245, 247)', 'Home sections use one canvas');
                for (const card of await page.locator('.dn-vehicle-card').all()) assert.equal(await card.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(255, 255, 255)', 'Vehicle cards remain white');
                for (const card of await page.locator('.dn-body-type, .dn-brand-card').all()) assert.equal(await card.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(255, 255, 255)', 'Discovery tiles retain white surfaces with subtle depth');
              }
              if (route === 'contact') assert((await page.locator('.dn-contact-section--general').evaluate(e => getComputedStyle(e).backgroundImage)).includes('rgb(244, 245, 247)'), 'Contact uses the grey canvas below the hero');
              if (route === 'about-us') {
                assert.equal(await page.locator('.dn-about-showroom').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(244, 245, 247)', 'Map sits on the shared grey canvas');
                for (const card of await page.locator('.dn-about-service-card, .dn-about-showroom__card').all()) assert.equal(await card.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(255, 255, 255)', 'About cards and map panel are white');
                assert.equal(await page.locator('.dn-desktop-hero-scene').evaluate(e => getComputedStyle(e).filter), 'grayscale(1)', 'Architecture uses the neutral palette');
              }
              // Verify actual glyph rendering, including Cyrillic, rather than only the CSS font stack.
              const cdp = await context.newCDPSession(page);
              await cdp.send('DOM.enable');
              await cdp.send('CSS.enable');
              const { root } = await cdp.send('DOM.getDocument');
              const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '.dn-route-hero h1' });
              const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
              assert(fonts.length && fonts.every(font => font.familyName.includes('Onest')), 'Headings render in bundled Onest');
              await cdp.detach();
            }
            if (width === 1440 || width === 390) {
              await page.screenshot({ path: `${output}/${locale}-${width}-${route || 'home'}.png`, fullPage: true });
            }
            if (route === 'blog' && width === 1440) {
              const category = page.locator('.dn-blog-categories a:not(.active)').first();
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
      // Cancel embedded map traffic before disposing the context.
      await page.goto('about:blank');
      await context.close();
    }
  }
} finally {
  await browser.close();
  await suite.finish();
}
