import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5173';
const outputRoot = path.resolve('artifacts/sveltekit-smoke');
const routes = [
  ['home', '/'],
  ['inventory', '/listing-grid'],
  ['vehicle-detail', '/listing-detail-v1/1'],
  ['about', '/about-us'],
  ['blog-index', '/blog?category=%D0%9E%D0%B3%D0%BB%D0%B5%D0%B4&q=%D0%BE%D0%B3%D0%BB%D0%B5%D0%B4'],
  ['blog-detail', '/blog-detail/1'],
  ['contact', '/contact?topic=leasing']
];
const viewports = [
  [1024, 768],
  [1280, 800],
  [1440, 900],
  [1920, 1080]
];

await mkdir(outputRoot, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {})
});
const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  checks: [],
  summary: { total: 0, failed: 0, warnings: 0 }
};

const waitForRouteReady = async (page) => {
  await page.waitForLoadState('networkidle');
  const ready = await page.waitForFunction(() =>
    document.readyState !== 'loading' &&
    Boolean(document.querySelector('.dn-app-shell main > :first-child')) &&
    (!document.fonts || document.fonts.status === 'loaded'),
  { timeout: 12_000 }).then(() => true).catch(() => false);

  if (ready) {
    await page.evaluate(() => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));
  }

  return ready;
};

const snapshot = (page) => page.evaluate(() => {
  const round = (value) => Math.round(value * 100) / 100;
  const rect = (element) => {
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return { x: round(box.x), y: round(box.y), width: round(box.width), height: round(box.height) };
  };
  const visible = (element) => {
    if (!element || element.hidden) return false;
    const styles = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return styles.display !== 'none' && styles.visibility !== 'hidden' && Number(styles.opacity) !== 0 && box.width > 0 && box.height > 0;
  };
  const ids = [...document.querySelectorAll('[id]')].map((element) => element.id).filter(Boolean);
  const h1 = document.querySelector('h1');
  const h1Styles = h1 ? getComputedStyle(h1) : null;
  const header = document.querySelector('.dn-header');
  const headerStyles = header ? getComputedStyle(header) : null;
  const headerInner = document.querySelector('.dn-header__inner');
  const topbar = document.querySelector('.dn-topbar');
  const homeHero = document.querySelector('.dn-hero');
  const homeHeroStyles = homeHero ? getComputedStyle(homeHero) : null;
  const routeHero = document.querySelector('.dn-route-hero');
  const routeHeroStyles = routeHero ? getComputedStyle(routeHero) : null;
  const routeHeroHeading = routeHero?.querySelector('h1');
  const routeHeroLead = routeHero?.querySelector('.dn-route-hero__copy p');
  const routeHeroControl = document.querySelector('.dn-search, .dn-listing-filter') || (matchMedia('(min-width: 992px)').matches && document.querySelector('.dn-about-hero-panel, .dn-contact-hero-panel')) || routeHero?.querySelector('.dn-route-hero__control');
  const routeHeroOverlay = routeHero?.querySelector('.dn-hero__overlay, .dn-listing-hero__overlay, .dn-about-hero__overlay, .dn-contact-hero__overlay, .dn-blog-hero__overlay');
  const firstVehicleMedia = document.querySelector('.dn-vehicle-card .dn-vehicle-card__image');
  const actionRadiusSelectors = [
    '.dn-header-action',
    '.dn-mobile-toggle',
    '.dn-mobile-menu__close',
    '.dn-mobile-menu__cta',
    '.dn-search__grid button',
    '.dn-quick-search__trigger',
    '.dn-quick-search__close',
    '.dn-listing-filter__submit',
    '.dn-listing-filter__toggle',
    '.dn-listing-filter__close',
    '.dn-listing-filter__dialog-submit',
    '.dn-about-button',
    '.dn-about-service-card > a',
    '.dn-about-team-card__actions a',
    '.dn-contact-button',
    '.dn-contact-card__actions a',
    '.dn-blog-empty > a',
    '.dn-blog-detail__back',
    '.dn-blog-widget__primary',
    '.dn-blog-widget__secondary',
    '.dn-detail-button',
    '.dn-finance-calculator > a',
    '.dn-brand-hero__cta',
    '.dn-editorial__cta',
    '.dn-trust-card__action',
    '.dn-showroom-map__link'
  ];
  return {
    htmlClass: document.documentElement.className,
    bodyClass: document.body.className,
    header: rect(header),
    headerInner: rect(headerInner),
    topbar: rect(topbar),
    topbarDisplay: topbar ? getComputedStyle(topbar).display : null,
    headerRadius: headerStyles ? Number.parseFloat(headerStyles.borderTopLeftRadius) : null,
    routeHero: rect(routeHero),
    routeHeroHeading: rect(routeHeroHeading),
    routeHeroLead: rect(routeHeroLead),
    routeHeroControl: rect(routeHeroControl),
    routeHeroHeadingTextAlign: routeHeroHeading ? getComputedStyle(routeHeroHeading).textAlign : null,
    routeHeroHeadingFontSize: routeHeroHeading ? Number.parseFloat(getComputedStyle(routeHeroHeading).fontSize) : null,
    routeHeroHeadingWeight: routeHeroHeading ? Number.parseInt(getComputedStyle(routeHeroHeading).fontWeight, 10) : null,
    routeHeroOverlayColor: routeHeroOverlay ? getComputedStyle(routeHeroOverlay).backgroundColor : null,
    routeHeroRadius: routeHeroStyles ? Number.parseFloat(routeHeroStyles.borderTopLeftRadius) : null,
    routeHeroBottomRadius: routeHeroStyles ? Number.parseFloat(routeHeroStyles.borderBottomLeftRadius) : null,
    hero: rect(homeHero),
    heroRadius: homeHeroStyles ? Number.parseFloat(homeHeroStyles.borderTopLeftRadius) : null,
    heroBottomRadius: homeHeroStyles ? Number.parseFloat(homeHeroStyles.borderBottomLeftRadius) : null,
    h1FontSize: h1Styles ? Number.parseFloat(h1Styles.fontSize) : null,
    h1Weight: h1Styles ? Number.parseInt(h1Styles.fontWeight, 10) : null,
    horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
    duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
    homeSearchFieldCount: document.querySelectorAll('.dn-search .dn-discovery__facets select').length,
    homeQuickSearchVisible: visible(document.querySelector('.dn-discovery__keyword')),
    homeConditionControlCount: document.querySelectorAll('.dn-search__conditions').length,
    redundantHomeSectionCtaCount: [...document.querySelectorAll('.editorial-all')].filter(visible).length,
    homeSectionHeaders: [...document.querySelectorAll('.dn-home-section-heading')].map((element) => {
      const heading = element.querySelector('h2');
      const action = element.querySelector('a');
      const titleBox = heading.getBoundingClientRect();
      const actionBox = action.getBoundingClientRect();
      return {
        titleSize: getComputedStyle(heading).fontSize,
        actionHeight: actionBox.height,
        actionBackground: getComputedStyle(action).backgroundColor,
        alignmentDelta: Math.abs(titleBox.top + titleBox.height / 2 - actionBox.top - actionBox.height / 2)
      };
    }),
    inventoryCtaVisible: visible(document.querySelector('.dn-inventory__all')),
    inventoryTabsCount: document.querySelectorAll('.dn-inventory-tabs').length,
    bodyTypeCount: document.querySelectorAll('.dn-body-type').length,
    bodyTypeImages: [...document.querySelectorAll('.dn-body-type img')].map((image) => image.getAttribute('src')),
    bodyTypesTitle: rect(document.querySelector('#body-types-title')),
    homeVehicleCardCount: document.querySelectorAll('.dn-inventory .dn-vehicle-card').length,
    homeVehiclePriceCount: document.querySelectorAll('.dn-inventory .dn-vehicle-card__amount').length,
    homeVehiclePrices: [...document.querySelectorAll('.dn-inventory .dn-vehicle-card__amount')].map((element) => element.textContent?.trim()),
    listingVehicleCardCount: document.querySelectorAll('.dn-listing-results .dn-vehicle-card').length,
    firstVehicleMedia: rect(firstVehicleMedia),
    actionRadii: actionRadiusSelectors.flatMap((selector) => [...document.querySelectorAll(selector)].map((element) => ({
      selector,
      radius: Number.parseFloat(getComputedStyle(element).borderTopLeftRadius)
    }))),
    listingSort: rect(document.querySelector('.dn-listing-sort')),
    detailGalleryVisible: visible(document.querySelector('.dn-detail-gallery')),
    detailSummaryVisible: visible(document.querySelector('.dn-detail-summary')),
    detailRecommendationsVisible: visible(document.querySelector('.dn-detail-related__list')),
    aboutHeroVisible: visible(document.querySelector('.dn-about-hero')),
    aboutServicesVisible: visible(document.querySelector('.dn-about-services')),
    aboutShowroomVisible: visible(document.querySelector('.dn-about-showroom')),
    blogHeroVisible: visible(document.querySelector('.dn-blog-hero')),
    blogToolbarVisible: visible(document.querySelector('.dn-blog-toolbar')),
    blogGridVisible: visible(document.querySelector('.dn-blog-grid')),
    articleHeroVisible: visible(document.querySelector('.dn-blog-detail__hero')),
    articleGuideVisible: visible(document.querySelector('.dn-blog-detail__article-sections')),
    articleRelatedVisible: visible(document.querySelector('.dn-blog-widget__related-list')),
    contactHeroVisible: visible(document.querySelector('.dn-contact-hero')),
    contactIntentVisible: visible(document.querySelector('.dn-contact-intent')),
    contactMapVisible: visible(document.querySelector('.dn-contact-location .dn-showroom-map')),
    footerActionCount: document.querySelectorAll('.dn-footer-actions__grid > a').length
  };
});

const maxGeometryShift = (before, after) => {
  if (!before || !after) return 0;
  return Math.max(
    Math.abs(before.x - after.x),
    Math.abs(before.y - after.y),
    Math.abs(before.width - after.width),
    Math.abs(before.height - after.height)
  );
};

const assertVehicleMediaRatio = (box, failures, context) => {
  if (!box?.width || !box?.height) {
    failures.push(`${context} vehicle media is missing`);
    return;
  }
  const ratio = box.width / box.height;
  if (Math.abs(ratio - 1.5) > 0.04) failures.push(`${context} vehicle media ratio drifted from 3:2 (${ratio.toFixed(3)})`);
};

for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });

  for (const [name, route] of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedLocalResponses = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('response', (response) => {
      try {
        const url = new URL(response.url());
        if (url.origin === new URL(baseUrl).origin && response.status() >= 400) {
          failedLocalResponses.push(`${response.status()} ${url.pathname}`);
        }
      } catch {}
    });

    const startedAt = Date.now();
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    const early = await snapshot(page);
    const ready = await waitForRouteReady(page);
    await page.waitForTimeout(350);
    const settled = await snapshot(page);

    const failures = [];
    const warnings = [];
    if (!ready) failures.push('route readiness state did not settle');
    if (settled.horizontalOverflow > 1) failures.push(`horizontal overflow ${settled.horizontalOverflow}px`);
    if (settled.duplicateIds.length) failures.push(`duplicate ids: ${[...new Set(settled.duplicateIds)].join(', ')}`);
    if (pageErrors.length) failures.push(`page errors: ${pageErrors.join(' | ')}`);
    if (failedLocalResponses.length) failures.push(`failed local responses: ${failedLocalResponses.join(', ')}`);
    if (consoleErrors.length) warnings.push(`console errors: ${consoleErrors.length}`);
    const expectedFooterActionCount = route === '/' ? 0 : 4;
    if (settled.footerActionCount !== expectedFooterActionCount) {
      failures.push(`footer action rail count drifted (${settled.footerActionCount}, expected ${expectedFooterActionCount})`);
    }

    const headerShift = maxGeometryShift(early.header, settled.header);
    if (headerShift > 1) failures.push(`header geometry shifted ${headerShift.toFixed(2)}px after DOMContentLoaded`);
    const actionRadiusDrift = settled.actionRadii.filter(({ selector, radius }) =>
      selector === '.dn-quick-search__trigger' && width >= 992
        ? Math.abs(radius - 14) > 1
        : selector === '.dn-about-service-card > a' && width >= 992
          ? Math.abs(radius - 12) > 1
          : radius < 900
    );
    if (actionRadiusDrift.length) failures.push(`native button actions do not use the shared rounded radius (${JSON.stringify(actionRadiusDrift)})`);
    const compactDetailHeader = route.startsWith('/blog-detail/') || route.startsWith('/listing-detail-v1/');
    if (compactDetailHeader) {
      if (!settled.header || Math.abs(settled.header.x) > 1 || Math.abs(settled.header.y) > 1 || Math.abs(settled.header.width - width) > 1 || Math.abs(settled.header.height - 94) > 1) {
        failures.push(`detail header geometry drifted (${JSON.stringify(settled.header)})`);
      }
      if (Math.abs(settled.headerRadius) > 1) failures.push(`detail header radius drifted (${settled.headerRadius ?? 'missing'}px)`);
      if (settled.topbarDisplay !== 'none') failures.push(`detail header utility bar is visible (${settled.topbarDisplay ?? 'missing'})`);
    } else {
      if (!settled.header || Math.abs(settled.header.x - 10) > 1 || Math.abs(settled.header.y - 10) > 1 || Math.abs(settled.header.width - (width - 20)) > 1) {
        failures.push(`desktop header inset drifted (${JSON.stringify(settled.header)})`);
      }
      if (!settled.headerRadius || Math.abs(settled.headerRadius - 16) > 1) failures.push(`desktop header radius drifted (${settled.headerRadius ?? 'missing'}px)`);
      const expectedHeaderInnerWidth = width - 52;
      if (!settled.headerInner || Math.abs(settled.headerInner.x - 26) > 2 || Math.abs(settled.headerInner.width - expectedHeaderInnerWidth) > 2) {
        failures.push(`desktop header content gutters drifted (${JSON.stringify(settled.headerInner)}, expected x 26 / width ${expectedHeaderInnerWidth})`);
      }
    }
    if (settled.routeHero) {
      if (Math.abs(settled.routeHero.x) > 1 || Math.abs(settled.routeHero.y) > 1 || Math.abs(settled.routeHero.width - width) > 1) {
        failures.push(`route hero does not begin behind the floating header (${JSON.stringify(settled.routeHero)})`);
      }
      if (Math.abs(settled.routeHeroRadius) > 1 || Math.abs(settled.routeHeroBottomRadius) > 1) {
        failures.push(`route hero corner treatment drifted (${settled.routeHeroRadius ?? 'missing'}px top / ${settled.routeHeroBottomRadius ?? 'missing'}px bottom, expected square full-bleed geometry)`);
      }
      if (!settled.routeHeroHeading || !settled.header || settled.routeHeroHeading.y < settled.header.y + settled.header.height - 1) {
        failures.push(`route hero heading collides with the floating header (${JSON.stringify({ header: settled.header, heading: settled.routeHeroHeading })})`);
      }
      const routeHeroHeadingCenter = settled.routeHeroHeading
        ? settled.routeHeroHeading.x + settled.routeHeroHeading.width / 2
        : null;
      if (route === '/' && (routeHeroHeadingCenter === null || Math.abs(routeHeroHeadingCenter - width / 2) > 1 || settled.routeHeroHeadingTextAlign !== 'center')) {
        failures.push(`route hero heading is not centered (${JSON.stringify({ heading: settled.routeHeroHeading, textAlign: settled.routeHeroHeadingTextAlign, viewportWidth: width })})`);
      }
      const routeHeroHeadingY = settled.routeHeroHeading.y - settled.routeHero.y;
      const routeHeroLeadY = settled.routeHeroLead ? settled.routeHeroLead.y - settled.routeHero.y : null;
      const routeHeroControlY = settled.routeHeroControl ? settled.routeHeroControl.y - settled.routeHero.y : null;
      const expectedHeadingSize = Math.min(56, Math.max(36, width * .034));
      const expectedRouteHeroHeadingY = 296 - 24 - 8 - expectedHeadingSize * 1.12;
      if (!settled.routeHeroLead || Math.abs(settled.routeHeroLead.height - 24) > 1 || Math.abs(routeHeroControlY - routeHeroLeadY - settled.routeHeroLead.height - 24) > 1) failures.push('Desktop hero needs one supporting line and24px clearance before its action');
      if (route === '/') {
        if (Math.abs(settled.routeHero.height - 540) > 1 || Math.abs(routeHeroHeadingY - expectedRouteHeroHeadingY) > 1 || Math.abs(routeHeroControlY - 320) > 1 || Math.abs(settled.routeHeroHeadingFontSize - expectedHeadingSize) > .1 || settled.routeHeroHeadingWeight !== 600 || settled.routeHeroOverlayColor !== 'rgba(0, 0, 0, 0)') failures.push('Home hero geometry drifted');
      } else {
        const studio = await page.locator('.dn-route-hero--studio').evaluate((hero) => {
          const art = [...hero.querySelectorAll('.dn-route-hero__artwork')];
          const copy = hero.querySelector('.dn-route-hero__copy').getBoundingClientRect();
          if (hero.classList.contains('dn-contact-hero')) {
            const media = hero.querySelector('.dn-contact-hero__media');
            const bounds = hero.getBoundingClientRect();
            return { background: getComputedStyle(hero).backgroundColor, loaded: media.complete && media.naturalWidth > 0 && media.currentSrc.endsWith('/day-night-contact-detail-v1.webp'), overlap: false, artBottom: bounds.bottom, heroBottom: bounds.bottom };
          }
          if (hero.classList.contains('dn-about-hero')) {
            const media = hero.querySelector('.dn-about-hero__media');
            const rows = [...document.querySelectorAll('.dn-about-service-card')].map(el=>el.getBoundingClientRect());
            const bounds = hero.getBoundingClientRect();
            return { background: getComputedStyle(hero).backgroundColor, loaded: media.complete && media.naturalWidth > 0 && media.currentSrc.endsWith('/day-night-about-detail-v1.webp'), overlap: rows.some((row,i)=>row.height<44 || (i>0 && (row.y<rows[i-1].bottom || row.x!==rows[0].x))), artBottom: Math.max(...rows.map(row=>row.bottom)), heroBottom: bounds.bottom };
          }
          const [left, right] = art.map(image => image.getBoundingClientRect());
          return { background: getComputedStyle(hero).backgroundColor, loaded: art.length === 2 && art.every(image => image.complete && image.naturalWidth > 0), overlap: !left || !right || left.right > copy.left + 1 || right.left < copy.right - 1, artBottom: Math.max(left?.bottom ?? 0, right?.bottom ?? 0), heroBottom: (hero.closest('.dn-listing-stage') ?? hero).getBoundingClientRect().bottom };
        });
        const expectedStudioBackground = route === '/listing-grid' ? 'rgb(169, 15, 28)' : route === '/about-us' ? 'rgb(29, 31, 35)' : route.startsWith('/blog') ? 'rgb(240, 200, 75)' : 'rgb(169, 15, 28)';
        if (settled.routeHeroHeadingTextAlign !== 'center' || Math.abs(routeHeroHeadingCenter - width / 2) > 1 || Math.abs(routeHeroHeadingY - expectedRouteHeroHeadingY) > 1 || Math.abs(settled.routeHeroHeadingFontSize - expectedHeadingSize) > .1 || settled.routeHeroHeadingWeight !== 600 || studio.background !== expectedStudioBackground || !studio.loaded || studio.overlap || studio.artBottom > studio.heroBottom + 1) failures.push('Centered studio hero layout or media drifted: '+JSON.stringify(studio));
        if (routeHeroLeadY !== null && routeHeroLeadY < routeHeroHeadingY + settled.routeHeroHeading.height + 7) failures.push('Studio hero lead collides with heading');
        if (routeHeroControlY === null || routeHeroControlY < routeHeroHeadingY + settled.routeHeroHeading.height + 23) failures.push('Studio hero action collides with heading');
      }
    }

    if (route === '/') {
      if (settled.homeSearchFieldCount !== 6) failures.push(`homepage expected 6 primary search fields, found ${settled.homeSearchFieldCount}`);
      if (!settled.inventoryCtaVisible) failures.push('homepage selected-inventory catalogue CTA is not visible');
      if (settled.inventoryTabsCount > 0) failures.push('homepage selected inventory restored the duplicate brand rail');
      if (settled.bodyTypeCount !== 8) failures.push(`homepage expected 8 body types, found ${settled.bodyTypeCount}`);
      if (settled.bodyTypeImages.some((src) => !src?.startsWith('/assets/images/icon-box/car-list'))) {
        failures.push(`homepage body-type assets drifted from approved silhouettes (${settled.bodyTypeImages.join(', ')})`);
      }
      if (settled.homeVehicleCardCount !== 4) failures.push(`homepage expected 4 selected vehicle cards, found ${settled.homeVehicleCardCount}`);
      if (settled.homeVehiclePriceCount !== 4) failures.push(`homepage expected 4 visible vehicle prices, found ${settled.homeVehiclePriceCount}`);
      const normalizedPrices = settled.homeVehiclePrices.map((price) => price?.replaceAll('\u00a0', ' '));
      if (!normalizedPrices.includes('68 804 €')) failures.push(`homepage first approved price is missing (${settled.homeVehiclePrices.join(', ')})`);
      assertVehicleMediaRatio(settled.firstVehicleMedia, failures, 'homepage');
      if (!settled.hero || Math.abs(settled.hero.x) > 1 || Math.abs(settled.hero.y) > 1 || Math.abs(settled.hero.width - width) > 1 || Math.abs(settled.hero.height - 540) > 1) {
        failures.push(`homepage hero does not fill the canvas behind the floating header (${JSON.stringify(settled.hero)})`);
      }
      const heroToBodyTypesGap = settled.hero && settled.bodyTypesTitle
        ? settled.bodyTypesTitle.y - (settled.hero.y + settled.hero.height)
        : null;
      if (heroToBodyTypesGap === null || heroToBodyTypesGap < 49 || heroToBodyTypesGap > 52) {
        failures.push(`homepage body-type heading is too close to or detached from the hero (${heroToBodyTypesGap ?? 'missing'}px)`);
      }
      if (Math.abs(settled.heroRadius) > 1 || Math.abs(settled.heroBottomRadius) > 1) failures.push(`homepage hero corner treatment drifted (${settled.heroRadius ?? 'missing'}px top / ${settled.heroBottomRadius ?? 'missing'}px bottom, expected square full-bleed geometry)`);
      if (!settled.h1FontSize || settled.h1FontSize < 36 || settled.h1FontSize > 56) failures.push(`homepage h1 size is outside approved baseline (${settled.h1FontSize ?? 'missing'}px)`);
      if (settled.h1Weight && settled.h1Weight > 700) failures.push(`homepage h1 weight is too heavy (${settled.h1Weight})`);
      const homeHeroTitle = await page.locator('#home-hero-title .dn-hero__title-desktop').textContent();
      const homeHeroLocationCount = await page.locator('.dn-hero__location').count();
      const homeHeroTitleMetrics = await page.locator('#home-hero-title').evaluate((element) => {
        const styles = getComputedStyle(element);
        const search = document.querySelector('.dn-search');
        return {
          height: element.getBoundingClientRect().height,
          lineHeight: Number.parseFloat(styles.lineHeight),
          searchGap: search ? search.getBoundingClientRect().top - element.getBoundingClientRect().bottom : null,
          bannerGap: search ? search.getBoundingClientRect().top - element.closest('.dn-hero').getBoundingClientRect().bottom : null
        };
      });
      if (homeHeroTitle?.trim() !== 'Изберете своя автомобил') failures.push(`homepage hero title drifted (${homeHeroTitle?.trim() || 'missing'})`);
      if (homeHeroLocationCount !== 1) failures.push('homepage hero requires one supporting location line');
      if (Math.abs(homeHeroTitleMetrics.height - homeHeroTitleMetrics.lineHeight) > 1) failures.push(`homepage hero title must occupy one line in the compact banner (${JSON.stringify(homeHeroTitleMetrics)})`);
      if (Math.abs((homeHeroTitleMetrics.bannerGap ?? 0) + 220) > 1) failures.push(`homepage search panel must fit inside the compact banner with34px bottom clearance (${JSON.stringify(homeHeroTitleMetrics)})`);
      const homeMedia = await page.locator('.dn-hero__media').evaluate(el => ({ src: new URL(el.currentSrc).pathname, loaded: el.complete && el.naturalWidth > 0, filter: getComputedStyle(el).filter }));
      if (homeMedia.src !== '/assets/images/lead/day-night-home-black-v1.webp' || !homeMedia.loaded || homeMedia.filter !== 'none') failures.push(`homepage silver car failed to load clearly (${JSON.stringify(homeMedia)})`);
      const heroComposition = await page.locator('.dn-hero').evaluate(el => {
        const media = el.querySelector('.dn-hero__media');
        const box = media.getBoundingClientRect(), hero = el.getBoundingClientRect();
        return { background: getComputedStyle(el).backgroundColor, color: getComputedStyle(el.querySelector('h1')).color, mask: getComputedStyle(media).maskImage, fillsHero: Math.abs(box.width-hero.width)<1 && Math.abs(box.height-hero.height)<1 };
      });
      if (heroComposition.background !== 'rgb(16, 17, 20)' || heroComposition.color !== 'rgb(255, 255, 255)' || heroComposition.mask !== 'none' || !heroComposition.fillsHero) failures.push(`homepage black photographic hero drifted (${JSON.stringify(heroComposition)})`);

      const quickFilters = page.locator('.dn-quick-links a');
      if (await quickFilters.count() > 0) failures.push('homepage buy box restored the redundant quick-filter row');
      if (!settled.homeQuickSearchVisible) failures.push('homepage quick-search trigger is not visible');
      if (settled.homeConditionControlCount > 0) failures.push('homepage restored the dead new/used condition control');
      if (settled.redundantHomeSectionCtaCount > 0) failures.push(`homepage restored ${settled.redundantHomeSectionCtaCount} redundant section CTAs`);
      if (settled.homeSectionHeaders.length !== 6 || settled.homeSectionHeaders.some((header) => header.titleSize !== '32px' || Math.abs(header.actionHeight - 44) > 1 || header.actionBackground !== 'rgb(255, 255, 255)' || header.alignmentDelta > 1)) {
        failures.push(`homepage section headings and actions are inconsistent (${JSON.stringify(settled.homeSectionHeaders)})`);
      }
      const quickSearchTrigger = page.locator('.dn-discovery__keyword');
      await page.waitForLoadState('networkidle');
      await quickSearchTrigger.click();
      const quickSearchDialog = page.locator('.dn-listing-filter__dialog');
      await quickSearchDialog.waitFor({ state: 'visible' });
      const quickSearchInput = quickSearchDialog.locator('input[name="q"]');
      await page.waitForFunction(() => document.querySelector('#dn-listing-dialog-query') === document.activeElement);
      if (!await quickSearchDialog.isVisible()) failures.push('homepage shared search dialog did not open');
      if (await page.locator('.dn-quick-search__result').count()) failures.push('homepage search restored inline result cards');
      if (await quickSearchDialog.locator('select').count() !== 12 || await quickSearchDialog.locator('input[name="equipment"]').count() !== 8) failures.push('homepage search does not expose the listing filter set');
      const quickSearchGeometry = await quickSearchDialog.boundingBox();
      if (!quickSearchGeometry || Math.abs(quickSearchGeometry.width - Math.min(1200, width - 48)) > 2 || quickSearchGeometry.height > height - 46) failures.push('homepage shared search dialog geometry drifted');
      if (!await quickSearchInput.evaluate((element) => element === document.activeElement)) failures.push('homepage search input did not receive focus');
      if (await page.evaluate(() => getComputedStyle(document.body).position) !== 'fixed') failures.push('homepage search did not lock background scroll');
      const searchSubmit = quickSearchDialog.locator('.dn-listing-filter__dialog-submit');
      if ((await searchSubmit.innerText()).trim() !== 'Покажи 8 автомобила') failures.push('homepage search initial inventory count drifted');
      await quickSearchInput.fill('Audi');
      if ((await searchSubmit.innerText()).trim() !== 'Покажи 2 автомобила') failures.push('homepage search Audi count drifted');
      const inlineSearchSubmit = quickSearchDialog.locator('.dn-listing-filter__inline-submit');
      if ((await inlineSearchSubmit.innerText()).trim() !== 'Покажи 2') failures.push('homepage inline search action did not expose the Audi result count');
      if ((await inlineSearchSubmit.getAttribute('aria-label')) !== 'Покажи 2 автомобила') failures.push('homepage inline search action accessible label drifted');
      await quickSearchInput.fill('no-such-vehicle');
      if (!await searchSubmit.isDisabled()) failures.push('homepage empty search did not disable submission');
      if (!await inlineSearchSubmit.isDisabled()) failures.push('homepage empty search did not disable the inline action');
      await page.keyboard.press('Escape');
      await quickSearchDialog.waitFor({ state: 'hidden' });
      if (!await quickSearchTrigger.evaluate((element) => element === document.activeElement)) failures.push('homepage search did not restore trigger focus');
      if (await page.evaluate(() => getComputedStyle(document.body).position) === 'fixed') failures.push('homepage search did not release background scroll');
      const fieldLabels = await page.locator('.dn-search .dn-discovery__facets label > span').allTextContents();
      if (fieldLabels.join('|') !== 'Марка|Модел|Купе|Цена до|Година от|Пробег до') failures.push(`homepage labeled fields drifted (${fieldLabels.join(', ')})`);
      const homeMake = page.locator('.dn-search .dn-discovery__facets select[name="make"]');
      const homeModel = page.locator('.dn-search .dn-discovery__facets select[name="model"]');
      await homeMake.selectOption('Audi');
      const homeAudiModels = await homeModel.locator('option').allTextContents();
      if (!homeAudiModels.includes('RS 6 Avant') || homeAudiModels.some((value) => value.includes('GLE') || value.includes('X6'))) failures.push('homepage model options do not follow the selected make');
      await homeModel.selectOption('RS 6 Avant');
      await homeMake.selectOption('BMW');
      if (await homeModel.inputValue() !== '') failures.push('homepage retained an incompatible model after changing make');
      await homeMake.selectOption('');

      const trustIconLocator = page.locator('.dn-trust-actions .dn-trust-card > .dn-trust-card__icon > svg');
      const trustIcons = await trustIconLocator.evaluateAll((icons) => icons.map((icon) => icon.innerHTML.replace(/\s+/g, ' ').trim()));
      const trustIconSizes = await trustIconLocator.evaluateAll((icons) => icons.map((icon) => ({ width: icon.getBoundingClientRect().width, height: icon.getBoundingClientRect().height })));
      if (trustIcons.length !== 4 || new Set(trustIcons).size !== 4 || trustIconSizes.some((icon) => Math.abs(icon.width - 60) > 1 || Math.abs(icon.height - 60) > 1)) {
        failures.push(`homepage trust actions require 4 distinct original 60px icons (${JSON.stringify({ count: trustIcons.length, unique: new Set(trustIcons).size, sizes: trustIconSizes })})`);
      }
      const trustHeading = await page.locator('#trust-title').textContent();
      const trustIntro = await page.locator('.dn-trust-actions .dn-trust-actions__heading p').textContent();
      const trustSectionCta = page.locator('.dn-trust-actions .dn-trust-actions__cta');
      const trustSectionCtaText = await trustSectionCta.textContent();
      const trustSectionCtaHref = await trustSectionCta.getAttribute('href');
      const trustSectionCtaHeight = await trustSectionCta.evaluate((element) => element.getBoundingClientRect().height);
      const expectedTrustCtaHeight = width <= 767 ? 48 : width >= 992 ? 44 : 50;
      const trustTitles = (await page.locator('.dn-trust-actions .dn-trust-card h3').allTextContents()).map((title) => title.trim());
      const trustDestinations = await page.locator('.dn-trust-actions .dn-trust-card .dn-trust-card__action').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      if (trustHeading?.trim() !== 'Как можем да помогнем' || trustIntro?.trim() !== 'Изберете услуга или се свържете директно с екипа.' || trustSectionCtaText?.trim() !== 'Свържете се с нас' || trustSectionCtaHref !== '/contact' || Math.abs(trustSectionCtaHeight - expectedTrustCtaHeight) > 1 || trustTitles.join('|') !== 'Вижте колекцията|Продажба или бартер|Внос по заявка|Собствен лизинг' || trustDestinations.join('|') !== '/listing-grid|/contact?topic=trade-in|/contact?topic=import|/contact?topic=leasing') {
        failures.push(`homepage trust journeys or section CTA drifted (${JSON.stringify({ trustHeading: trustHeading?.trim(), trustIntro: trustIntro?.trim(), trustSectionCtaText: trustSectionCtaText?.trim(), trustSectionCtaHref, trustSectionCtaHeight, trustTitles, trustDestinations })})`);
      }
      const trustCardRhythm = await page.locator('.dn-trust-actions .dn-trust-card').evaluateAll((cards) => cards.map((card) => {
        const heading = card.querySelector('h3');
        const description = card.querySelector('p');
        const headingStyles = getComputedStyle(heading);
        const descriptionStyles = getComputedStyle(description);
        return {
          cardHeight: card.getBoundingClientRect().height,
          headingGap: Number.parseFloat(headingStyles.marginBottom),
          descriptionGap: Number.parseFloat(descriptionStyles.marginBottom),
          descriptionLines: Math.round(description.getBoundingClientRect().height / Number.parseFloat(descriptionStyles.lineHeight))
        };
      }));
      if (trustCardRhythm.some((card) => card.headingGap !== 16 || card.descriptionGap !== 24 || card.descriptionLines !== 2 || (width >= 768 && card.cardHeight > 340))) {
        failures.push(`homepage trust-card spacing or two-line copy rhythm drifted (${JSON.stringify(trustCardRhythm)})`);
      }
      const firstTrustCard = page.locator('.dn-trust-actions .dn-trust-card').first();
      await firstTrustCard.hover();
      const trustTransform = await firstTrustCard.evaluate((element) => getComputedStyle(element).transform);
      if (trustTransform !== 'none') failures.push(`homepage trust action lifts or scales on hover (${trustTransform})`);

      const brandCta = page.locator('.dn-brand-hero__cta');
      await brandCta.scrollIntoViewIfNeeded();
      const brandCtaVisible = await brandCta.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
        return box.width > 0 && box.height > 0 && (hit === element || element.contains(hit));
      }).catch(() => false);
      if (!brandCtaVisible) failures.push('homepage brand CTA is covered or not visible');

      const firstBodyType = page.locator('.dn-body-type').first();
      const bodyTypeDefault = await firstBodyType.evaluate((element) => {
        const styles = getComputedStyle(element);
        return {
          background: styles.backgroundColor,
          radius: Number.parseFloat(styles.borderRadius),
          shadow: styles.boxShadow
        };
      });
      await firstBodyType.hover();
      await page.waitForTimeout(360);
      const bodyTypeMotion = await firstBodyType.evaluate((element) => ({
        card: getComputedStyle(element).transform,
        image: getComputedStyle(element.querySelector('img')).transform,
        imageBorder: Number.parseFloat(getComputedStyle(element.querySelector('.dn-body-type__image')).borderTopWidth),
        background: getComputedStyle(element).backgroundColor,
        shadow: getComputedStyle(element).boxShadow,
        viewportPaddingBottom: Number.parseFloat(getComputedStyle(element.closest('.dn-body-types__viewport')).paddingBottom)
      }));
      const bodyTypeBrandCard = page.locator('.dn-brand-card').first();
      await bodyTypeBrandCard.hover();
      await page.waitForTimeout(360);
      const bodyTypeBrandShadow = await bodyTypeBrandCard.evaluate((element) => getComputedStyle(element).boxShadow);
      if (bodyTypeDefault.background !== 'rgb(243, 244, 246)' || Math.abs(bodyTypeDefault.radius - 16) > 1 || bodyTypeDefault.shadow !== 'none' || bodyTypeMotion.card !== 'none' || bodyTypeMotion.image !== 'none' || bodyTypeMotion.imageBorder !== 0 || bodyTypeMotion.background !== 'rgb(255, 255, 255)' || bodyTypeMotion.shadow !== bodyTypeBrandShadow || Math.abs(bodyTypeMotion.viewportPaddingBottom - 8) > 1) {
        failures.push(`homepage body-type card treatment drifted (${JSON.stringify({ bodyTypeDefault, bodyTypeMotion })})`);
      }

      const inventorySurfaceStyle = await page.locator('.dn-inventory').evaluate((element) => ({ background: getComputedStyle(element).backgroundColor }));
      const inventoryPanelStyle = await page.locator('.dn-inventory-panel').evaluate((element) => {
        const styles = getComputedStyle(element);
        return { background: styles.backgroundColor, radius: Number.parseFloat(styles.borderRadius), padding: Number.parseFloat(styles.paddingTop) };
      });
      const inventoryCta = page.locator('.dn-inventory__all');
      const inventoryCtaStyle = await inventoryCta.evaluate((element) => {
        const styles = getComputedStyle(element);
        return { height: element.getBoundingClientRect().height, background: styles.backgroundColor, color: styles.color };
      });
      const inventoryCtaHref = await inventoryCta.getAttribute('href');
      const expectedInventoryCtaHeight = 44;
      if (inventorySurfaceStyle.background !== 'rgb(255, 255, 255)' || inventoryPanelStyle.background !== 'rgb(241, 243, 245)' || Math.abs(inventoryPanelStyle.radius - 20) > 1 || Math.abs(inventoryPanelStyle.padding - 32) > 1 || Math.abs(inventoryCtaStyle.height - expectedInventoryCtaHeight) > 1 || inventoryCtaStyle.background !== 'rgb(255, 255, 255)' || inventoryCtaStyle.color !== 'rgb(36, 39, 44)' || inventoryCtaHref !== '/listing-grid') {
        failures.push(`homepage inventory panel or catalogue CTA drifted (${JSON.stringify({ inventorySurfaceStyle, inventoryPanelStyle, inventoryCtaStyle, inventoryCtaHref })})`);
      }
      const firstSpecRow = page.locator('.dn-inventory .dn-vehicle-card__specs').first();
      const specIcons = await firstSpecRow.locator('.dn-icon').count();
      const firstSpecStyle = await firstSpecRow.locator('.dn-vehicle-card__spec').first().evaluate((element) => {
        const styles = getComputedStyle(element);
        return { radius: Number.parseFloat(styles.borderRadius), background: styles.backgroundColor };
      });
      if (specIcons !== 2 || Math.abs(firstSpecStyle.radius - 8) > 1 || firstSpecStyle.background !== 'rgb(240, 242, 244)') {
        failures.push(`homepage vehicle spec badges drifted (${JSON.stringify({ specIcons, firstSpecStyle })})`);
      }

      const editorialSection = page.locator('.dn-editorial');
      const editorialBanner = page.locator('.dn-editorial__banner');
      const editorialCards = page.locator('.dn-editorial__cards');
      const firstEditorialCard = page.locator('.dn-editorial-item').first();
      const editorialStyles = await editorialSection.evaluate((element) => ({ background: getComputedStyle(element).backgroundColor }));
      const editorialBannerStyles = await editorialBanner.evaluate((element) => {
        const styles = getComputedStyle(element);
        return { image: styles.backgroundImage, radius: Number.parseFloat(styles.borderRadius), padding: Number.parseFloat(styles.paddingTop), height: element.getBoundingClientRect().height };
      });
      const editorialHeadingColor = await page.locator('.dn-editorial__heading h2').evaluate((element) => getComputedStyle(element).color);
      const editorialIntro = await page.locator('.dn-editorial__heading p').textContent();
      const editorialCta = page.locator('.dn-editorial__cta');
      const editorialCtaText = await editorialCta.textContent();
      const editorialCtaHref = await editorialCta.getAttribute('href');
      await editorialCta.scrollIntoViewIfNeeded();
      const editorialCtaVisible = await editorialCta.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
        return box.width > 0 && box.height > 0 && (hit === element || element.contains(hit));
      }).catch(() => false);
      const editorialCardsOffset = await editorialCards.evaluate((element) => Number.parseFloat(getComputedStyle(element).marginTop));
      const editorialCardsWidth = await editorialCards.evaluate((element) => element.getBoundingClientRect().width);
      const editorialCardStyles = await firstEditorialCard.evaluate((element) => {
        const styles = getComputedStyle(element);
        return { background: styles.backgroundColor, border: Number.parseFloat(styles.borderTopWidth), radius: Number.parseFloat(styles.borderRadius) };
      });
      const trustPanelStyles = await page.locator('.dn-trust-actions__panel').evaluate((element) => {
        const styles = getComputedStyle(element);
        return { background: styles.backgroundColor, radius: Number.parseFloat(styles.borderRadius), padding: Number.parseFloat(styles.paddingTop), width: element.getBoundingClientRect().width };
      });
      const brandPanelWidth = await page.locator('.dn-brand-panel').evaluate((element) => element.getBoundingClientRect().width);
      const brandHeroHeight = await page.locator('.dn-brand-hero').evaluate((element) => element.getBoundingClientRect().height);
      const trustCardStyles = await page.locator('.dn-trust-actions .dn-trust-card').first().evaluate((element) => {
        const styles = getComputedStyle(element);
        return { background: styles.backgroundColor, border: Number.parseFloat(styles.borderTopWidth), radius: Number.parseFloat(styles.borderRadius) };
      });
      if (editorialStyles.background !== 'rgb(255, 255, 255)' || !editorialBannerStyles.image.includes('day-night-editorial-banner-v2.webp') || Math.abs(editorialBannerStyles.radius - 20) > 1 || Math.abs(editorialBannerStyles.padding - 32) > 1 || Math.abs(editorialBannerStyles.height - 184) > 1 || Math.abs(brandHeroHeight - 184) > 1 || editorialHeadingColor !== 'rgb(255, 255, 255)' || editorialIntro?.trim() !== 'Практични насоки за оглед, покупка и внос на автомобил.' || editorialCtaText?.trim() !== 'Вижте всички статии' || editorialCtaHref !== '/blog' || !editorialCtaVisible || Math.abs(editorialCardsOffset + 24) > 1 || Math.abs(editorialCardsWidth - brandPanelWidth) > 1 || editorialCardStyles.background !== 'rgb(255, 255, 255)' || editorialCardStyles.border !== 0 || Math.abs(editorialCardStyles.radius - 16) > 1 || trustPanelStyles.background !== 'rgb(241, 243, 245)' || Math.abs(trustPanelStyles.radius - 20) > 1 || Math.abs(trustPanelStyles.padding - 32) > 1 || Math.abs(trustPanelStyles.width - brandPanelWidth) > 1 || trustCardStyles.background !== 'rgb(255, 255, 255)' || trustCardStyles.border !== 0 || Math.abs(trustCardStyles.radius - 16) > 1) {
        failures.push(`homepage showcase geometry or editorial/action treatment drifted (${JSON.stringify({ section: editorialStyles, banner: editorialBannerStyles, brandHeroHeight, heading: editorialHeadingColor, editorialIntro: editorialIntro?.trim(), editorialCtaText: editorialCtaText?.trim(), editorialCtaHref, editorialCtaVisible, cardsOffset: editorialCardsOffset, editorialCardsWidth, editorialCard: editorialCardStyles, trustPanel: trustPanelStyles, brandPanelWidth, trustCard: trustCardStyles })})`);
      }
      const editorialLinkCoverage = await firstEditorialCard.locator(':scope > .dn-editorial-item__link').evaluate((link) => {
        const card = link.parentElement;
        const linkRect = link.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        return { width: Math.abs(linkRect.width - cardRect.width), height: Math.abs(linkRect.height - cardRect.height) };
      });
      if (editorialLinkCoverage.width > 2.1 || editorialLinkCoverage.height > 2.1) failures.push(`homepage editorial card is not fully clickable (${JSON.stringify(editorialLinkCoverage)})`);
      const firstBrandCard = page.locator('.dn-brand-card').first();
      await firstBrandCard.hover();
      await page.waitForTimeout(360);
      const brandHoverShadow = await firstBrandCard.evaluate((element) => getComputedStyle(element).boxShadow);
      await firstEditorialCard.hover();
      await page.waitForTimeout(360);
      const editorialHover = await firstEditorialCard.evaluate((element) => ({
        image: getComputedStyle(element.querySelector('img')).transform,
        shadow: getComputedStyle(element).boxShadow
      }));
      if (editorialHover.image !== 'none') failures.push(`homepage editorial image moves or scales on hover (${editorialHover.image})`);
      if (editorialHover.shadow !== brandHoverShadow) failures.push(`homepage editorial hover does not match brand cards (${JSON.stringify({ brandHoverShadow, editorialHoverShadow: editorialHover.shadow })})`);

      const firstVehicleCard = page.locator('.dn-inventory .dn-vehicle-card').first();
      if (await firstVehicleCard.isVisible().catch(() => false)) {
        await firstVehicleCard.hover();
        await page.waitForTimeout(220);
        if (await firstVehicleCard.locator('.change-heart, .box-icon').count() > 0) failures.push('homepage vehicle card restored redundant image-overlay actions');
        const vehicleCardLinks = firstVehicleCard.locator('a');
        if (await vehicleCardLinks.count() !== 1) failures.push(`homepage vehicle card expected one whole-card link, found ${await vehicleCardLinks.count()}`);
        const vehicleCardHref = await vehicleCardLinks.first().evaluate(element => new URL(element.href).pathname);
        if (vehicleCardHref !== '/listing-detail-v1/1') failures.push(`homepage vehicle card destination drifted (${vehicleCardHref || 'missing'})`);
        const imageTransform = await firstVehicleCard.locator('.dn-vehicle-card__image img').evaluate((element) => getComputedStyle(element).transform).catch(() => 'missing');
        if (imageTransform !== 'none') failures.push(`homepage vehicle image moves or scales on hover (${imageTransform})`);
      }
    }

    if (route === '/listing-grid') {
      const heroTitle = await page.locator('#listing-title').textContent();
      if (heroTitle?.trim() !== 'Намерете своя автомобил') failures.push(`listing hero title drifted (${heroTitle?.trim() || 'missing'})`);
      const heroCopyCount = await page.locator('.dn-listing-hero p').count();
      if (heroCopyCount !== 1 || !(await page.locator('.dn-listing-hero p').innerText()).match(/^\d+ автомобил(а)? в каталога$/)) failures.push('listing hero requires one inventory-count line');
      if (!settled.routeHero || Math.abs(settled.routeHero.height - 540) > 1) failures.push(`listing hero height drifted (${settled.routeHero?.height ?? 'missing'}px)`);
      const listingTitle = await page.locator('#listing-results-title').textContent();
      if (!listingTitle?.includes('Налични автомобили')) failures.push(`listing results heading drifted (${listingTitle?.trim() || 'missing'})`);
      if (settled.listingVehicleCardCount < 1) failures.push('listing route rendered no vehicle cards');
      assertVehicleMediaRatio(settled.firstVehicleMedia, failures, 'listing');
      if (!settled.listingSort || settled.listingSort.width < 185 || settled.listingSort.width > 195) {
        failures.push(`listing sort control width drifted (${settled.listingSort?.width ?? 'missing'}px)`);
      }
      const visibleSortSubmit = await page.locator('.dn-listing-sort button').evaluateAll((buttons) => buttons.filter((button) => {
        const styles = getComputedStyle(button);
        const box = button.getBoundingClientRect();
        return styles.display !== 'none' && styles.visibility !== 'hidden' && box.width > 4 && box.height > 4;
      }).length);
      if (visibleSortSubmit > 0) failures.push('listing sort exposes a separate visible apply button');

      const listingSearch = page.locator('.dn-discovery__keyword');
      const primaryFacets = page.locator('.dn-discovery__facets select');
      const filterToggle = page.locator('.dn-listing-results__filters');
      const filterDialog = page.locator('#dn-listing-filter-dialog');
      const listingConditionPills = await page.locator('.dn-listing-filter__conditions').count();
      const listingSearchGeometry = await listingSearch.boundingBox();
      const firstPrimaryFacetGeometry = await primaryFacets.first().boundingBox();
      const listingFilterGeometry = await page.locator('.dn-listing-filter').boundingBox();
      const listingStageGeometry = await page.locator('.dn-listing-stage').boundingBox();
      const listingSearchLabel = await listingSearch.getAttribute('aria-label');
      const primaryFacetState = await primaryFacets.evaluateAll((selects) => ({
        names: selects.map((select) => select.getAttribute('name')),
        visible: selects.filter((select) => {
          const styles = getComputedStyle(select);
          const box = select.getBoundingClientRect();
          return styles.display !== 'none' && styles.visibility !== 'hidden' && box.width > 4 && box.height > 4;
        }).length
      }));
      const filterShellStyle = await page.locator('.dn-listing-filter').evaluate((element) => {
        const styles = getComputedStyle(element);
        return { radius: Number.parseFloat(styles.borderRadius), background: styles.backgroundColor };
      });
      const searchButtonRadius = await page.locator('.dn-discovery__submit').evaluate((element) => Number.parseFloat(getComputedStyle(element).borderRadius));
      const filterToggleStyle = await filterToggle.evaluate((element) => {
        const styles = getComputedStyle(element);
        return { background: styles.backgroundColor, color: styles.color };
      });
      if (!listingSearchGeometry || listingSearchGeometry.width < 300 || listingSearchLabel !== 'Търсете марка, модел или ключова дума') {
        failures.push(`listing keyword input is not prominent (${JSON.stringify({ listingSearchGeometry, listingSearchLabel })})`);
      }
      const expectedVisibleFacets = width >= 992 ? 6 : 0;
      if (primaryFacetState.names.join(',') !== 'make,model,body,price_max,year_min,mileage_max' || primaryFacetState.visible !== expectedVisibleFacets) {
        failures.push(`listing primary facets are incomplete (${JSON.stringify({ primaryFacetState, expectedVisibleFacets })})`);
      }
      if (width >= 992 && (!listingSearchGeometry || !firstPrimaryFacetGeometry || firstPrimaryFacetGeometry.y <= listingSearchGeometry.y + listingSearchGeometry.height)) {
        failures.push(`listing keyword search no longer leads the primary facets (${JSON.stringify({ listingSearchGeometry, firstPrimaryFacetGeometry })})`);
      }
      if (width >= 992) {
        await primaryFacets.filter({ has: page.locator('option[value="Audi"]') }).selectOption('Audi');
        const audiModels = await primaryFacets.locator('option').evaluateAll((options) => options.map((option) => option.textContent?.trim()));
        if (!audiModels.some((label) => label?.includes('RS 6 Avant')) || !audiModels.some((label) => label?.includes('RS Q8'))) {
          failures.push(`listing visible model facet did not react to make selection (${JSON.stringify(audiModels)})`);
        }
        await primaryFacets.filter({ has: page.locator('option[value="Audi"]') }).selectOption('');
      }
      if (listingConditionPills > 0) failures.push('listing restored noisy new/used condition pills above the main search');
      if (filterShellStyle.background !== 'rgb(255, 255, 255)' || Math.abs(filterShellStyle.radius - 16) > 1 || searchButtonRadius < 900) {
        failures.push(`listing search surface geometry drifted (${JSON.stringify({ filterShellStyle, searchButtonRadius })})`);
      }
      if (!listingFilterGeometry || !settled.routeHero || !listingStageGeometry || Math.abs(listingFilterGeometry.y - settled.routeHero.y - 320) > 1 || Math.abs(listingStageGeometry.y + listingStageGeometry.height - listingFilterGeometry.y - listingFilterGeometry.height - 34) > 1) {
        failures.push(`listing search panel must fit inside the banner at320px with34px bottom clearance (${JSON.stringify({ listingFilterGeometry, hero: settled.routeHero })})`);
      }
      if (filterToggleStyle.background !== 'rgb(32, 35, 41)' || filterToggleStyle.color !== 'rgb(255, 255, 255)') {
        failures.push(`listing advanced filter trigger lost its high contrast labeled style (${JSON.stringify(filterToggleStyle)})`);
      }
      if (await filterToggle.getAttribute('aria-haspopup') !== 'dialog' || await filterDialog.evaluate((element) => element.open)) {
        failures.push('listing rich-filter dialog is not closed by default');
      }
      const layoutBeforeFilters = await page.evaluate(() => {
        const measure = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width, height: box.height };
        };
        return {
          clientWidth: document.documentElement.clientWidth,
          header: measure('.dn-header'),
          search: measure('.dn-discovery'),
          results: measure('.dn-listing-results')
        };
      });
      await listingSearch.click();
      await filterDialog.locator('input[name="q"]').fill('BMW');
      await filterDialog.locator('input[name="q"]').press('Enter');
      await page.waitForURL('**/listing-grid?q=BMW');
      if (await page.locator('.dn-listing-results__count').textContent() !== '2') failures.push('shared-modal keyword Enter submission did not show two BMW results');
      await page.goto(`${baseUrl}/listing-grid`, { waitUntil: 'networkidle' });
      const toolbarAligned = await filterToggle.evaluate((element) => {
        const filter = element.getBoundingClientRect();
        const sort = document.querySelector('.dn-listing-sort').getBoundingClientRect();
        return element.parentElement.classList.contains('dn-listing-results__tools') && Math.abs(filter.y - sort.y) < 1 && filter.height === sort.height && sort.left - filter.right === 10 && !document.querySelector('.dn-discovery__filters');
      });
      if (!toolbarAligned) failures.push('advanced filter must align beside Sort in the results toolbar');

      await filterToggle.click();
      await filterDialog.waitFor({ state: 'visible', timeout: 1_500 });
      const advancedControls = await filterDialog.locator('select, input[type="text"]').count();
      const equipmentControls = await filterDialog.locator('input[name="equipment"][type="checkbox"]').count();
      const dialogSearchFocused = await filterDialog.locator('.dn-listing-filter__dialog-search input').evaluate((element) => element === document.activeElement);
      const backdropColor = await filterDialog.evaluate((element) => getComputedStyle(element, '::backdrop').backgroundColor);
      const dialogGeometry = await filterDialog.boundingBox();
      await filterDialog.locator('.dn-listing-filter__dialog-search input').fill('Audi');
      const liveAudiSubmit = await filterDialog.locator('.dn-listing-filter__dialog-submit').textContent();
      const headerCountLabels = await filterDialog.locator('.dn-listing-filter__dialog-count').count();
      const redundantGroupHeadings = await filterDialog.locator('#dn-listing-filter-primary-title, #dn-listing-filter-budget-title, #dn-listing-filter-details-title').count();
      const duplicateDialogCards = await filterDialog.locator('.dn-listing-filter__match').count();
      await filterDialog.locator('.dn-listing-filter__dialog-search input').fill('');
      await filterDialog.locator('select[name="mileage_max"]').selectOption('50000');
      const liveMileageSubmit = await filterDialog.locator('.dn-listing-filter__dialog-submit').textContent();
      await filterDialog.locator('select[name="mileage_max"]').selectOption('');
      await filterDialog.locator('input[name="equipment"][value="Адаптивен круиз контрол"]').check();
      const liveEquipmentSubmit = await filterDialog.locator('.dn-listing-filter__dialog-submit').textContent();
      await filterDialog.locator('input[name="equipment"][value="Адаптивен круиз контрол"]').uncheck();
      const layoutWithFilters = await page.evaluate(() => {
        const measure = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width, height: box.height };
        };
        return {
          clientWidth: document.documentElement.clientWidth,
          header: measure('.dn-header'),
          search: measure('.dn-discovery'),
          results: measure('.dn-listing-results')
        };
      });
      const layoutShift = Math.max(
        Math.abs(layoutBeforeFilters.clientWidth - layoutWithFilters.clientWidth),
        maxGeometryShift(layoutBeforeFilters.header, layoutWithFilters.header),
        maxGeometryShift(layoutBeforeFilters.search, layoutWithFilters.search),
        maxGeometryShift(layoutBeforeFilters.results, layoutWithFilters.results)
      );
      if (!await filterDialog.evaluate((element) => element.open) || advancedControls !== 12 || equipmentControls !== 8 || !await filterDialog.locator('select[name="condition"]').isVisible() || !await filterDialog.locator('select[name="price_min"]').isVisible() || !await filterDialog.locator('select[name="year_max"]').isVisible() || !await filterDialog.locator('select[name="version"]').isVisible() || !dialogSearchFocused || liveAudiSubmit?.trim() !== 'Покажи 2 автомобила' || liveMileageSubmit?.trim() !== 'Покажи 1 автомобил' || liveEquipmentSubmit?.trim() !== 'Покажи 3 автомобила' || headerCountLabels !== 0 || redundantGroupHeadings !== 0 || duplicateDialogCards !== 0 || backdropColor === 'rgba(0, 0, 0, 0)' || !dialogGeometry || dialogGeometry.width < Math.min(900, width - 48) || layoutShift > 1) {
        failures.push(`listing rich-filter dialog is incomplete or shifts the page (${JSON.stringify({ advancedControls, equipmentControls, dialogSearchFocused, liveAudiSubmit: liveAudiSubmit?.trim(), liveMileageSubmit: liveMileageSubmit?.trim(), liveEquipmentSubmit: liveEquipmentSubmit?.trim(), headerCountLabels, redundantGroupHeadings, duplicateDialogCards, backdropColor, dialogGeometry, layoutShift, layoutBeforeFilters, layoutWithFilters })})`);
      }
      await page.mouse.move(4, Math.min(height - 4, 700));
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(80);
      const backgroundAfterWheel = await page.evaluate(() => ({
        scrollY: window.scrollY,
        resultsTop: document.querySelector('.dn-listing-results')?.getBoundingClientRect().top ?? null
      }));
      if (backgroundAfterWheel.scrollY !== 0 || backgroundAfterWheel.resultsTop === null || Math.abs(backgroundAfterWheel.resultsTop - layoutWithFilters.results.y) > 1) {
        failures.push(`listing dialog does not lock background scrolling (${JSON.stringify(backgroundAfterWheel)})`);
      }
      await page.keyboard.press('Escape');
      await filterDialog.waitFor({ state: 'hidden', timeout: 1_500 });
      if (!await filterToggle.evaluate((element) => element === document.activeElement)) failures.push('listing filter dialog did not restore trigger focus after Escape');
      await filterToggle.click();
      await filterDialog.waitFor({ state: 'visible', timeout: 1_500 });
      await page.mouse.click(4, 4);
      await filterDialog.waitFor({ state: 'hidden', timeout: 1_500 });
      await filterToggle.click();
      await filterDialog.waitFor({ state: 'visible', timeout: 1_500 });
      await filterDialog.locator('select[name="price_max"]').selectOption('60000');
      await filterDialog.locator('input[name="equipment"][value="Адаптивен круиз контрол"]').check();
      await Promise.all([
        page.waitForURL((url) => url.searchParams.get('price_max') === '60000' && url.searchParams.get('equipment') === 'Адаптивен круиз контрол'),
        filterDialog.locator('.dn-listing-filter__dialog-submit').click()
      ]);
      await page.waitForLoadState('networkidle');
      const submittedCards = await page.locator('.dn-listing-results .dn-vehicle-card').count();
      const submittedEntries = await page.evaluate(() => [...new URL(window.location.href).searchParams.entries()]);
      if (submittedCards !== 2 || submittedEntries.some(([, value]) => !value.trim())) {
        failures.push(`listing rich filters did not submit clean shareable URL state (${JSON.stringify({ submittedCards, submittedEntries })})`);
      }
    }

    if (route.startsWith('/listing-detail-v1/')) {
      if (!settled.detailGalleryVisible) failures.push('vehicle detail gallery is not visible');
      if (!settled.detailSummaryVisible) failures.push('vehicle detail summary is not visible');
      if (!settled.detailRecommendationsVisible) failures.push('vehicle recommendations are not visible');
      const detailTitle = await page.locator('.dn-detail-title-card h1').textContent();
      if (!detailTitle?.trim()) failures.push('vehicle detail title is empty');
      const detailBreadcrumbCount = await page.locator('.dn-detail-breadcrumbs').count();
      if (detailBreadcrumbCount !== 0) failures.push(`vehicle detail breadcrumb strip returned (${detailBreadcrumbCount})`);
      const detailSummaryActionCount = await page.locator('.dn-detail-summary__actions a').count();
      if (detailSummaryActionCount !== 2) failures.push(`vehicle detail summary actions drifted (${detailSummaryActionCount})`);
      const detailImage = await page.locator('.dn-detail-gallery > img').getAttribute('src');
      if (!detailImage?.startsWith('/assets/')) failures.push(`vehicle detail image source is unexpected (${detailImage})`);
      const detailCardCount = await page.locator('.dn-detail-card').count();
      if (detailCardCount !== 7) failures.push(`vehicle detail grouping surfaces drifted (${detailCardCount})`);
      const detailTabs = page.locator('.dn-detail-tabs [role="tab"]');
      const detailTabCount = await detailTabs.count();
      const overviewInitiallyVisible = await page.locator('#detail-panel-overview').isVisible();
      await detailTabs.filter({ hasText: 'Описание' }).click();
      const descriptionVisible = await page.locator('#detail-panel-description').isVisible();
      await detailTabs.filter({ hasText: 'Екстри' }).click();
      const equipmentVisible = await page.locator('#detail-panel-equipment').isVisible();
      const equipmentItemCount = await page.locator('#detail-panel-equipment .dn-detail-equipment li').count();
      await detailTabs.filter({ hasText: 'Данни' }).focus();
      await page.keyboard.press('End');
      const keyboardEquipmentSelected = await detailTabs.filter({ hasText: 'Екстри' }).getAttribute('aria-selected');
      const keyboardFocus = await page.evaluate(() => document.activeElement?.id);
      await page.keyboard.press('Home');
      const overviewRestored = await page.locator('#detail-panel-overview').isVisible();
      await page.waitForTimeout(200);
      const detailTabStyles = await page.evaluate(() => {
        const group = getComputedStyle(document.querySelector('.dn-detail-tabs'));
        const active = document.querySelector('.dn-detail-tabs [aria-selected="true"]');
        const activeStyle = getComputedStyle(active);
        const indicator = getComputedStyle(active, '::after');
        return {
          groupDisplay: group.display,
          groupBorderBottom: group.borderBottom,
          activeBackground: activeStyle.backgroundColor,
          activeColor: activeStyle.color,
          indicatorBackground: indicator.backgroundColor,
          indicatorHeight: indicator.height,
          indicatorOpacity: indicator.opacity
        };
      });
      if (
        detailTabCount !== 3 ||
        !overviewInitiallyVisible ||
        !descriptionVisible ||
        !equipmentVisible ||
        equipmentItemCount < 1 ||
        keyboardEquipmentSelected !== 'true' ||
        keyboardFocus !== 'detail-tab-equipment' ||
        !overviewRestored ||
        detailTabStyles.groupDisplay !== 'flex' ||
        detailTabStyles.groupBorderBottom !== '1px solid rgb(226, 229, 233)' ||
        detailTabStyles.activeBackground !== 'rgba(0, 0, 0, 0)' ||
        detailTabStyles.activeColor !== 'rgb(36, 39, 44)' ||
        detailTabStyles.indicatorBackground !== 'rgb(196, 1, 1)' ||
        detailTabStyles.indicatorHeight !== '3px' ||
        detailTabStyles.indicatorOpacity !== '1'
      ) failures.push(`vehicle detail tabs are not a settled three-part underline control (${JSON.stringify({ detailTabCount, overviewInitiallyVisible, descriptionVisible, equipmentVisible, equipmentItemCount, keyboardEquipmentSelected, keyboardFocus, overviewRestored, detailTabStyles })})`);
      const detailMapCount = await page.locator('.dn-detail-location-card iframe[title^="Карта до"]').count();
      if (detailMapCount !== 1) failures.push(`vehicle detail showroom map drifted (${detailMapCount})`);
      const sidebarCardClasses = await page.locator('.dn-detail-sidebar > .dn-detail-card').evaluateAll((cards) => cards.map((card) => card.className));
      const financeInput = page.locator('.dn-finance-calculator input[type="number"]');
      const financeTerm = page.locator('.dn-finance-calculator select');
      const financeInitialResult = await page.locator('.dn-finance-calculator__result dd').allTextContents();
      await financeInput.fill('10000');
      await financeTerm.selectOption('60');
      const financeUpdatedResult = await page.locator('.dn-finance-calculator__result dd').allTextContents();
      const financeDisclaimer = await page.locator('#finance-disclaimer').textContent();
      const sellerDetailCount = await page.locator('.dn-detail-dealer__details > *').count();
      const sellerActionCount = await page.locator('.dn-detail-dealer__actions a').count();
      const sellerAppointmentCount = await page.locator('.dn-detail-dealer').getByText('Посещения с предварителна уговорка', { exact: true }).count();
      const conversionActionStyles = await page.evaluate(() => {
        const inspection = getComputedStyle(document.querySelector('.dn-detail-summary__actions .dn-detail-button--dark'));
        const seller = getComputedStyle(document.querySelector('.dn-detail-dealer__actions .dn-detail-button--dark'));
        return {
          inspectionBackground: inspection.backgroundColor,
          inspectionColor: inspection.color,
          sellerBackground: seller.backgroundColor,
          sellerColor: seller.color
        };
      });
      if (
        sidebarCardClasses.length !== 3 ||
        !sidebarCardClasses[0]?.includes('dn-detail-summary') ||
        !sidebarCardClasses[1]?.includes('dn-detail-finance-card') ||
        !sidebarCardClasses[2]?.includes('dn-detail-dealer') ||
        financeInitialResult.length !== 2 ||
        financeUpdatedResult.length !== 2 ||
        financeInitialResult.join(' ') === financeUpdatedResult.join(' ') ||
        !financeDisclaimer?.includes('без лихва, такси и застраховки') ||
        sellerDetailCount !== 2 ||
        sellerActionCount !== 1 ||
        sellerAppointmentCount !== 0 ||
        conversionActionStyles.inspectionBackground !== 'rgb(31, 35, 41)' ||
        conversionActionStyles.inspectionColor !== 'rgb(255, 255, 255)' ||
        conversionActionStyles.sellerBackground !== 'rgb(31, 35, 41)' ||
        conversionActionStyles.sellerColor !== 'rgb(255, 255, 255)'
      ) {
        failures.push(`vehicle detail conversion rail is incomplete (${JSON.stringify({ sidebarCardClasses, financeInitialResult, financeUpdatedResult, financeDisclaimer: financeDisclaimer?.trim(), sellerDetailCount, sellerActionCount, sellerAppointmentCount, conversionActionStyles })})`);
      }
      const relatedCardCount = await page.locator('.dn-detail-related-card').count();
      if (relatedCardCount !== 3) failures.push(`vehicle detail recommendations drifted (${relatedCardCount})`);
      const relatedTitle = await page.locator('#related-title').textContent();
      if (relatedTitle?.trim() !== 'Подбрани автомобили') failures.push(`vehicle detail recommendation title drifted (${relatedTitle?.trim() || 'missing'})`);
      if (width === 1440) {
        const detailGeometry = await page.evaluate(() => {
          const box = (selector) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
          };
          return {
            body: box('.dn-detail-body'),
            title: box('.dn-detail-title-card'),
            media: box('.dn-detail-media-card'),
            gallery: box('.dn-detail-gallery'),
            summary: box('.dn-detail-summary'),
            info: box('.dn-detail-info-card'),
            layout: box('.dn-detail-layout'),
            dealer: box('.dn-detail-dealer'),
            finance: box('.dn-detail-finance-card'),
            location: box('#location'),
            map: box('.dn-detail-location-card iframe'),
            related: box('.dn-detail-related'),
            relatedFirst: box('.dn-detail-related-card:first-child'),
            relatedSecond: box('.dn-detail-related-card:nth-child(2)'),
            bodyBackground: getComputedStyle(document.querySelector('.dn-detail-body')).backgroundColor,
            cardStyle: (() => {
              const styles = getComputedStyle(document.querySelector('.dn-detail-summary'));
              return {
                background: styles.backgroundColor,
                border: styles.border,
                radius: styles.borderRadius,
                shadow: styles.boxShadow,
                position: styles.position
              };
            })(),
            relatedStyle: (() => {
              const styles = getComputedStyle(document.querySelector('.dn-detail-related'));
              return {
                background: styles.backgroundColor,
                border: styles.border,
                radius: styles.borderRadius,
                padding: styles.padding,
                shadow: styles.boxShadow
              };
            })(),
            relatedCardStyle: (() => {
              const styles = getComputedStyle(document.querySelector('.dn-detail-related-card'));
              return {
                background: styles.backgroundColor,
                border: styles.border,
                radius: styles.borderRadius,
                shadow: styles.boxShadow
              };
            })(),
            summaryActionColumns: getComputedStyle(document.querySelector('.dn-detail-summary__actions')).gridTemplateColumns,
            dealerHeaderDirection: getComputedStyle(document.querySelector('.dn-detail-dealer__header')).flexDirection,
            dealerHeaderDisplay: getComputedStyle(document.querySelector('.dn-detail-dealer__header')).display,
            dealerHeaderAlignment: getComputedStyle(document.querySelector('.dn-detail-dealer__header')).textAlign
          };
        });
        const buyAreaAligned = detailGeometry.title && detailGeometry.summary && Math.abs(detailGeometry.title.y - detailGeometry.summary.y) <= 1;
        const titleMediaGap = detailGeometry.title && detailGeometry.media ? detailGeometry.media.y - (detailGeometry.title.y + detailGeometry.title.height) : null;
        const infoGap = detailGeometry.media && detailGeometry.info ? detailGeometry.info.y - (detailGeometry.media.y + detailGeometry.media.height) : null;
        const locationGap = detailGeometry.info && detailGeometry.location ? detailGeometry.location.y - (detailGeometry.info.y + detailGeometry.info.height) : null;
        const financeGap = detailGeometry.summary && detailGeometry.finance ? detailGeometry.finance.y - (detailGeometry.summary.y + detailGeometry.summary.height) : null;
        const dealerGap = detailGeometry.finance && detailGeometry.dealer ? detailGeometry.dealer.y - (detailGeometry.finance.y + detailGeometry.finance.height) : null;
        const relatedGap = detailGeometry.layout && detailGeometry.related ? detailGeometry.related.y - (detailGeometry.layout.y + detailGeometry.layout.height) : null;
        const relatedColumnsAligned = detailGeometry.relatedFirst && detailGeometry.relatedSecond &&
          detailGeometry.relatedFirst.width > 350 && Math.abs(detailGeometry.relatedFirst.y - detailGeometry.relatedSecond.y) <= 1;
        if (
          detailGeometry.bodyBackground !== 'rgb(244, 246, 250)' ||
          detailGeometry.cardStyle.background !== 'rgb(255, 255, 255)' ||
          detailGeometry.cardStyle.border !== '1px solid rgb(234, 237, 242)' ||
          detailGeometry.cardStyle.radius !== '16px' ||
          !detailGeometry.cardStyle.shadow.includes('rgba(16, 24, 40, 0.06)') ||
          detailGeometry.cardStyle.position !== 'static' ||
          !detailGeometry.summary || detailGeometry.summary.height > 250 ||
          detailGeometry.summaryActionColumns.split(' ').length !== 2 ||
          !detailGeometry.finance || detailGeometry.finance.height > 500 ||
          !detailGeometry.dealer || detailGeometry.dealer.height > 305 ||
          detailGeometry.dealerHeaderDisplay !== 'grid' ||
          detailGeometry.dealerHeaderAlignment === 'center' ||
          detailGeometry.relatedStyle.background !== 'rgb(255, 255, 255)' ||
          detailGeometry.relatedStyle.border !== '1px solid rgb(234, 237, 242)' ||
          detailGeometry.relatedStyle.radius !== '16px' ||
          detailGeometry.relatedStyle.padding !== '28px' ||
          !detailGeometry.relatedStyle.shadow.includes('rgba(16, 24, 40, 0.06)') ||
          detailGeometry.relatedCardStyle.background !== 'rgb(244, 246, 250)' ||
          !detailGeometry.relatedCardStyle.border.startsWith('0px none') ||
          detailGeometry.relatedCardStyle.radius !== '12px' ||
          detailGeometry.relatedCardStyle.shadow !== 'none' ||
          !buyAreaAligned ||
          Math.abs((titleMediaGap ?? 0) - 20) > 1 ||
          Math.abs((infoGap ?? 0) - 20) > 1 ||
          Math.abs((locationGap ?? 0) - 20) > 1 ||
          Math.abs((dealerGap ?? 0) - 20) > 1 ||
          Math.abs((financeGap ?? 0) - 20) > 1 ||
          !detailGeometry.map || detailGeometry.map.height < 450 ||
          Math.abs((relatedGap ?? 0) - 48) > 1 ||
          !relatedColumnsAligned
        ) {
          failures.push(`vehicle detail clean-container system drifted (${JSON.stringify({ ...detailGeometry, buyAreaAligned, titleMediaGap, infoGap, locationGap, dealerGap, financeGap, relatedGap, relatedColumnsAligned })})`);
        }
      }
    }

    if (route === '/about-us') {
      if (!settled.aboutHeroVisible) failures.push('about hero is not visible');
      if (!settled.aboutServicesVisible) failures.push('about services are not visible');
      if (!settled.aboutShowroomVisible) failures.push('about showroom section is not visible');
      const heroImage = await page.locator('.dn-about-hero__media').getAttribute('src');
      if (heroImage !== '/assets/images/section/bg-12.jpg') failures.push(`about hero asset changed unexpectedly (${heroImage})`);
      const heroLead = await page.locator('.dn-about-hero__lead').textContent();
      if (heroLead?.trim() !== 'Автомобили в София · Внос · Собствен лизинг') failures.push(`about hero reference copy drifted (${heroLead?.trim() || 'missing'})`);
      const aboutHeroAlignment = await page.locator('.dn-about-hero__content').evaluate((element) => {
        const lead = element.querySelector('.dn-about-hero__lead').getBoundingClientRect();
        const action = document.querySelector('.dn-about-hero-panel').getBoundingClientRect();
        return {
          textAlign: getComputedStyle(element.querySelector('.dn-about-hero__copy')).textAlign,
          leadCenter: lead.x + lead.width / 2,
          actionCenter: action.x + action.width / 2
        };
      });
      if (aboutHeroAlignment.textAlign !== 'center' || Math.abs(aboutHeroAlignment.leadCenter - aboutHeroAlignment.actionCenter) > 1 || Math.abs(aboutHeroAlignment.actionCenter - width / 2) > 1) {
        failures.push(`about hero copy/action axis is not centered (${JSON.stringify(aboutHeroAlignment)})`);
      }
      const servicePanel = await page.locator('.dn-about-hero-panel').boundingBox();
      const serviceLinks = page.locator('.dn-about-hero-panel .dn-about-service-card > a');
      if (!servicePanel || servicePanel.y !== 320 || servicePanel.y + servicePanel.height > settled.routeHero.y + settled.routeHero.height - 32 || await serviceLinks.count() !== 4 || await page.locator('.dn-about-hero .dn-about-button').isVisible()) failures.push('About service choices must fill the hero centre once, with four actions and bottom clearance');
      const demoSections = page.locator('[data-demo-content="true"]');
      if (await demoSections.count() !== 2) failures.push(`about route requires 2 explicitly marked demo sections (${await demoSections.count()} found)`);
      for (let index = 0; index < await demoSections.count(); index += 1) {
        if (!await demoSections.nth(index).getByText('Демо съдържание', { exact: true }).count()) {
          failures.push(`about demo section ${index + 1} is missing its visible demo disclosure`);
        }
      }
      const teamCards = await page.locator('.dn-about-team-card').count();
      if (teamCards !== 4) failures.push(`about team requires 4 demo profiles (${teamCards} found)`);
      const partnerLogos = await page.locator('.dn-about-partners__grid img').count();
      if (partnerLogos !== 6) failures.push(`about partners require 6 demo logos (${partnerLogos} found)`);
      const teamImageSources = await page.locator('.dn-about-team-card__media img').evaluateAll((images) => images.map((image) => image.getAttribute('src')));
      if (teamImageSources.some((source) => !source?.startsWith('/assets/images/img-box/team'))) failures.push(`about team image sources are unexpected (${teamImageSources.join(', ')})`);
      const firstTeamCard = page.locator('.dn-about-team-card').first();
      const teamGlassOverlay = firstTeamCard.locator('[data-team-glass-overlay="true"]');
      const teamSocialIconNames = await teamGlassOverlay.locator('[data-team-social-icon]').evaluateAll((icons) => icons.map((icon) => icon.getAttribute('data-team-social-icon')));
      if (teamSocialIconNames.join(',') !== 'facebook,twitter,linkedin,instagram') failures.push(`about team glass overlay icon set drifted (${teamSocialIconNames.join(',')})`);
      if (await teamGlassOverlay.locator('a').count()) failures.push('about team glass overlay contains unverified social destinations');
      const teamGlassResting = await teamGlassOverlay.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          width: style.width,
          height: style.height,
          bottom: style.bottom,
          opacity: style.opacity,
          background: style.backgroundColor,
          backdropFilter: style.backdropFilter
        };
      });
      if (teamGlassResting.width !== '210px' || teamGlassResting.height !== '42px' || teamGlassResting.bottom !== '-20px' || teamGlassResting.opacity !== '0' || teamGlassResting.background !== 'rgba(255, 255, 255, 0.5)' || !teamGlassResting.backdropFilter.includes('blur(4px)')) failures.push(`about team resting glass geometry drifted (${JSON.stringify(teamGlassResting)})`);
      await firstTeamCard.hover();
      await teamGlassOverlay.evaluate(async (element) => {
        await Promise.all(element.getAnimations().map((animation) => animation.finished));
      });
      const teamGlassHover = await firstTeamCard.evaluate((element) => {
        const overlay = element.querySelector('[data-team-glass-overlay="true"]');
        const image = element.querySelector('img');
        return {
          bottom: getComputedStyle(overlay).bottom,
          opacity: getComputedStyle(overlay).opacity,
          imageTransform: getComputedStyle(image).transform
        };
      });
      if (teamGlassHover.bottom !== '20px' || teamGlassHover.opacity !== '1') failures.push(`about team glass overlay does not reveal like the reference (${JSON.stringify(teamGlassHover)})`);
      if (teamGlassHover.imageTransform !== 'none') failures.push(`about team image zoom/lift returned with the glass overlay (${teamGlassHover.imageTransform})`);
      const teamSocialGlyph = teamGlassOverlay.locator('span').first();
      await teamSocialGlyph.hover();
      await page.waitForTimeout(350);
      const teamSocialGlyphHover = await teamSocialGlyph.evaluate((element) => {
        const style = getComputedStyle(element);
        return { color: style.color, cursor: style.cursor };
      });
      if (teamSocialGlyphHover.color !== 'rgb(196, 1, 1)' || teamSocialGlyphHover.cursor !== 'pointer') failures.push(`about team social glyph hover drifted (${JSON.stringify(teamSocialGlyphHover)})`);
      const teamContactAction = firstTeamCard.locator('.dn-about-team-card__actions a').first();
      await teamContactAction.hover();
      await page.waitForTimeout(200);
      const teamContactHover = await teamContactAction.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          color: style.color,
          borderColor: style.borderColor,
          background: style.backgroundColor,
          cursor: style.cursor
        };
      });
      if (teamContactHover.color !== 'rgb(255, 255, 255)' || teamContactHover.borderColor !== 'rgb(196, 1, 1)' || teamContactHover.background !== 'rgb(196, 1, 1)' || teamContactHover.cursor !== 'pointer') failures.push(`about team contact icon hover drifted (${JSON.stringify(teamContactHover)})`);
      if (!settled.routeHero || Math.abs(settled.routeHero.height - 540) > 1) failures.push(`about hero height drifted (${settled.routeHero?.height ?? 'missing'}px)`);
      const serviceIcons = await page.locator('.dn-about-service-card__icon .dn-icon').evaluateAll((icons) => icons.map((icon) => icon.innerHTML.replace(/\s+/g, ' ').trim()));
      const automotiveServiceIcons = await page.locator('.dn-about-service-card__icon [data-icon-family="day-night-services"]').evaluateAll((icons) => icons.map((icon) => ({
        name: icon.getAttribute('data-icon-name'),
        viewBox: icon.getAttribute('viewBox'),
        pathCount: icon.querySelectorAll('path').length,
        pathLength: Array.from(icon.querySelectorAll('path')).reduce((total, path) => total + (path.getAttribute('d')?.length ?? 0), 0)
      })));
      if (serviceIcons.length > 0) failures.push('about services still use the generic shared outline icon set');
      if (automotiveServiceIcons.length !== 4) failures.push(`about services require 4 licensed automotive SVG icons (${automotiveServiceIcons.length} found)`);
      if (automotiveServiceIcons.map((icon) => icon.name).join(',') !== 'inspection,import,leasing,trade-in') failures.push(`about automotive icon mapping drifted (${automotiveServiceIcons.map((icon) => icon.name).join(',')})`);
      if (automotiveServiceIcons.some((icon) => icon.viewBox !== '0 0 50 50' || icon.pathCount < 2 || icon.pathLength < 2_500)) failures.push(`about automotive icon geometry was simplified (${JSON.stringify(automotiveServiceIcons)})`);
      const showroomTitle = await page.locator('#about-showroom-title').textContent();
      if (showroomTitle?.trim() !== 'Шоурум в София') failures.push(`about showroom title drifted (${showroomTitle?.trim() || 'missing'})`);
    }

    if (route.startsWith('/blog?')) {
      if (!settled.blogHeroVisible) failures.push('blog hero is not visible');
      if (!settled.blogToolbarVisible) failures.push('blog search/category toolbar is not visible');
      if (!settled.blogGridVisible) failures.push('blog results grid is not visible');
      const heroImage = await page.locator('.dn-blog-hero__media').getAttribute('src');
      if (heroImage !== '/assets/images/lead/day-night-blog-hero-v2.webp') failures.push(`blog hero asset changed unexpectedly (${heroImage})`);
      const queryValue = await page.locator('#dn-blog-search').inputValue();
      if (queryValue !== 'оглед') failures.push(`blog query was not server-rendered (${queryValue})`);
      const activeCategory = await page.locator('.dn-blog-categories a.active').textContent();
      if (activeCategory?.trim() !== 'Оглед') failures.push(`blog category was not server-rendered (${activeCategory?.trim() || 'missing'})`);
      const cards = await page.locator('.dn-blog-card').count();
      if (cards !== 3) failures.push(`blog filter expected 3 Оглед cards, found ${cards}`);
      if (!settled.routeHero || Math.abs(settled.routeHero.height - 540) > 1) failures.push(`blog hero height drifted (${settled.routeHero?.height ?? 'missing'}px)`);
      const blogToolbarGeometry = await page.evaluate(() => {
        const box = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom };
        };
        return {
          toolbar: box('.dn-blog-toolbar'),
          search: box('.dn-blog-search input'),
          categories: box('.dn-blog-categories'),
          submitCount: document.querySelectorAll('.dn-blog-toolbar button[type="submit"], .dn-blog-toolbar input[type="submit"]').length
        };
      });
      if (!blogToolbarGeometry.search || !blogToolbarGeometry.categories || blogToolbarGeometry.search.bottom > blogToolbarGeometry.categories.y || blogToolbarGeometry.submitCount !== 0) {
        failures.push(`blog buy box no longer matches the 6511 stacked composition (${JSON.stringify(blogToolbarGeometry)})`);
      }
      if (width === 1440 && (Math.abs((blogToolbarGeometry.toolbar?.width ?? 0) - 1360) > 1 || Math.abs((blogToolbarGeometry.toolbar?.height ?? 0) - 146) > 1)) {
        failures.push(`blog buy box 1440 geometry drifted (${JSON.stringify(blogToolbarGeometry.toolbar)})`);
      }
      if (blogToolbarGeometry.toolbar && Math.abs(blogToolbarGeometry.toolbar.x - (width - blogToolbarGeometry.toolbar.width) / 2) > 1) {
        failures.push(`blog buy box is not centered in the hero (${JSON.stringify(blogToolbarGeometry.toolbar)})`);
      }
      const firstBlogCard = page.locator('.dn-blog-card').first();
      const blogLinkCoverage = await firstBlogCard.locator(':scope > .dn-blog-card__link').evaluate((link) => {
        const card = link.parentElement;
        const linkRect = link.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        return { width: Math.abs(linkRect.width - cardRect.width), height: Math.abs(linkRect.height - cardRect.height) };
      });
      if (blogLinkCoverage.width > 2.1 || blogLinkCoverage.height > 2.1) failures.push(`blog card is not fully clickable (${JSON.stringify(blogLinkCoverage)})`);
      await firstBlogCard.hover();
      await page.waitForTimeout(220);
      const blogMotion = await firstBlogCard.evaluate((element) => ({
        card: getComputedStyle(element).transform,
        image: getComputedStyle(element.querySelector('img')).transform
      }));
      if (blogMotion.card !== 'none' || blogMotion.image !== 'none') failures.push(`blog card or image lifts/scales on hover (${JSON.stringify(blogMotion)})`);
    }

    if (route.startsWith('/blog-detail/')) {
      if (!settled.articleHeroVisible) failures.push('editorial detail hero is not visible');
      if (!settled.articleGuideVisible) failures.push('editorial article content is not visible');
      if (!settled.articleRelatedVisible) failures.push('editorial related cards are not visible');
      const articleTitle = await page.locator('.dn-blog-detail__hero h1').textContent();
      if (articleTitle?.trim() !== 'Проверка преди покупка') failures.push(`editorial detail resolved wrong post (${articleTitle?.trim() || 'missing'})`);
      const articleUtilityIconCount = await page.locator('.dn-blog-detail__back .dn-icon, .dn-blog-detail__meta .dn-icon, .dn-blog-widget--search .dn-icon').count();
      if (articleUtilityIconCount !== 3) failures.push(`blog detail utility icons drifted (${articleUtilityIconCount})`);
      const articleMetadata = await page.locator('.dn-blog-detail__meta li').allTextContents();
      if (new Set(articleMetadata.map((text) => text.trim())).size !== articleMetadata.length) failures.push('article metadata contains duplicate labels');
      const articleImage = await page.locator('.dn-blog-detail__hero .dn-route-hero__artwork').first().getAttribute('src');
      if (articleImage !== '/assets/images/lead/day-night-studio-guide-v1.webp') failures.push(`editorial detail image is unexpected (${articleImage})`);
      const lorem = await page.getByText(/Lorem ipsum/i).count();
      if (lorem > 0) failures.push('template lorem ipsum leaked into native editorial detail');
      const articleSectionCount = await page.locator('.dn-blog-detail__article-sections > section').count();
      const genericGuideCount = await page.getByText('Как да използвате тази тема', { exact: true }).count();
      const articleSectionBorders = await page.locator('.dn-blog-detail__article-sections > section').evaluateAll((sections) => sections.map((section) => {
        const style = getComputedStyle(section);
        return { top: style.borderTopWidth, bottom: style.borderBottomWidth };
      }));
      if (articleSectionCount < 2 || genericGuideCount !== 0 || articleSectionBorders.some((border) => border.top !== '0px' || border.bottom !== '0px')) {
        failures.push(`editorial content returned to generic or divider-based scaffolding (${JSON.stringify({ articleSectionCount, genericGuideCount, articleSectionBorders })})`);
      }
      const firstCategoryRow = page.locator('.dn-blog-widget--categories a').first();
      const categoryBackgroundBefore = await firstCategoryRow.evaluate((element) => getComputedStyle(element).backgroundColor);
      await firstCategoryRow.hover();
      await page.waitForTimeout(200);
      const categoryBackgroundAfter = await firstCategoryRow.evaluate((element) => getComputedStyle(element).backgroundColor);
      if (categoryBackgroundAfter === categoryBackgroundBefore || categoryBackgroundAfter === 'rgba(0, 0, 0, 0)') {
        failures.push(`editorial category row has no full-row hover surface (${JSON.stringify({ categoryBackgroundBefore, categoryBackgroundAfter })})`);
      }
      if (width === 1440) {
        const articleGeometry = await page.evaluate(() => {
          const box = (selector) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
          };
          return {
            sheet: box('.dn-blog-detail__sheet'),
            sidebar: box('.dn-blog-detail__sidebar'),
            media: box('.dn-blog-detail__hero .dn-route-hero__artwork'), hero: box('.dn-blog-detail__hero')
          };
        });
        if (Math.abs((articleGeometry.sheet?.width ?? 0) - 856) > 1 || Math.abs((articleGeometry.sidebar?.width ?? 0) - 416) > 1 || Math.abs((articleGeometry.sheet?.y ?? 0) - ((articleGeometry.hero?.y ?? 0) + (articleGeometry.hero?.height ?? 0) + 48)) > 1 || (articleGeometry.media?.width ?? 0) < 300 || (articleGeometry.media?.y ?? 0) + (articleGeometry.media?.height ?? 0) > (articleGeometry.hero?.y ?? 0) + (articleGeometry.hero?.height ?? 0)) {
          failures.push(`editorial detail 6511 geometry drifted (${JSON.stringify(articleGeometry)})`);
        }
      }
    }

    if (route.startsWith('/contact')) {
      if (!settled.contactHeroVisible) failures.push('contact hero is not visible');
      if (!settled.contactIntentVisible) failures.push('contact intent panel is not visible');
      if (!settled.contactMapVisible) failures.push('contact map section is not visible');
      const heroImage = await page.locator('.dn-contact-hero__media').getAttribute('src');
      if (heroImage !== '/assets/images/lead/day-night-contact-hero-v2.webp') failures.push(`contact hero asset changed unexpectedly (${heroImage})`);
      const selectedTopic = await page.locator('.dn-contact-selected h3').textContent();
      if (selectedTopic?.trim() !== 'Собствен лизинг') failures.push(`contact URL topic was not server-rendered (${selectedTopic?.trim() || 'missing'})`);
      const phoneHref = await page.locator('.dn-contact-intent__main > .dn-contact-button').getAttribute('href');
      if (!phoneHref?.startsWith('tel:')) failures.push(`contact primary action is not a direct phone link (${phoneHref})`);
      const topicPills = await page.locator('.dn-contact-topics').count();
      if (topicPills > 0) failures.push('contact route restored the rejected quick-topic pills');
      const socialIcons = await page.locator('[data-social-brand-icon]').evaluateAll((icons) => icons.map((icon) => icon.getAttribute('data-social-brand-icon')));
      if (socialIcons.join(',') !== 'instagram,facebook,youtube') failures.push(`contact social brand icons drifted (${socialIcons.join(',') || 'missing'})`);
      const socialLinks = await page.locator('.dn-contact-social a').evaluateAll(links => links.map(link => link.getAttribute('href')));
      if (JSON.stringify(socialLinks) !== JSON.stringify(['https://www.instagram.com/dayandnight_autogroup/', 'https://www.facebook.com/deninoshtautogroup/', 'https://www.youtube.com/@kristiankirilov1355/videos'])) failures.push('Contact social links differ from the verified business profiles and owner-supplied channel');
      const contactHeroAction = await page.locator('.dn-contact-hero__action').evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        whiteSpace: getComputedStyle(element).whiteSpace,
        iconCount: element.querySelectorAll('.dn-icon').length,
        center: element.getBoundingClientRect().x + element.getBoundingClientRect().width / 2
      }));
      if (contactHeroAction.scrollWidth > contactHeroAction.clientWidth || contactHeroAction.whiteSpace !== 'nowrap' || contactHeroAction.iconCount !== 1 || Math.abs(contactHeroAction.center - width / 2) > 1) {
        failures.push(`contact hero action wraps or lost its icon (${JSON.stringify(contactHeroAction)})`);
      }
      if (!settled.routeHero || Math.abs(settled.routeHero.height - 540) > 1) failures.push(`contact hero height drifted (${settled.routeHero?.height ?? 'missing'}px)`);
      const contactOrder = await page.evaluate(() => ({
        map: document.querySelector('.dn-contact-location')?.getBoundingClientRect().top,
        intentBottom: document.querySelector('.dn-contact-intent')?.getBoundingClientRect().bottom
      }));
      if (contactOrder.map == null || contactOrder.intentBottom == null || contactOrder.map <= contactOrder.intentBottom) {
        failures.push(`contact map must appear beneath the contact cards (${JSON.stringify(contactOrder)})`);
      }
      if (width === 1440) {
        const contactGeometry = await page.evaluate(() => {
          const box = (selector) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom };
          };
          return {
            section: box('.dn-contact-section'),
            intent: box('.dn-contact-intent'),
            main: box('.dn-contact-intent__main'),
            card: box('.dn-contact-card'),
            map: box('.dn-contact-location .dn-showroom-map'),
            heading: box('.dn-contact-intent__heading'),
            selected: box('.dn-contact-selected'),
            mainBackground: getComputedStyle(document.querySelector('.dn-contact-intent__main')).backgroundColor,
            cardBackground: getComputedStyle(document.querySelector('.dn-contact-card')).backgroundColor,
            mainRadius: getComputedStyle(document.querySelector('.dn-contact-intent__main')).borderTopLeftRadius,
            cardRadius: getComputedStyle(document.querySelector('.dn-contact-card')).borderTopLeftRadius,
            gridAlignment: getComputedStyle(document.querySelector('.dn-contact-intent')).alignItems,
            contactLinkCount: document.querySelectorAll('.dn-contact-card__link').length,
            contactLinkHrefs: [...document.querySelectorAll('.dn-contact-card__link')].map((link) => link.getAttribute('href')),
            tooltipLabels: [...document.querySelectorAll('.dn-contact-card__cue [role="tooltip"]')].map((tooltip) => tooltip.textContent?.trim()),
            linkGroupBorderTop: getComputedStyle(document.querySelector('.dn-contact-card__links')).borderTopWidth,
            linkGroupBorderBottom: getComputedStyle(document.querySelector('.dn-contact-card__links')).borderBottomWidth,
            rowBorders: [...document.querySelectorAll('.dn-contact-card__link')].map((link) => {
              const style = getComputedStyle(link);
              return [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth];
            }),
            rowBackground: getComputedStyle(document.querySelector('.dn-contact-card__link')).backgroundColor,
            rowRadius: getComputedStyle(document.querySelector('.dn-contact-card__link')).borderTopLeftRadius,
            routeBackground: getComputedStyle(document.querySelector('.dn-contact-card__route')).backgroundColor,
            routeColor: getComputedStyle(document.querySelector('.dn-contact-card__route')).color
          };
        });
        if (
          Math.abs((contactGeometry.section?.y ?? 0) - (settled.routeHero.height - 140)) > 1 ||
          (contactGeometry.main?.height ?? 0) >= (contactGeometry.card?.height ?? 0) ||
          (contactGeometry.map?.y ?? 0) <= Math.max(contactGeometry.main?.bottom ?? 0, contactGeometry.card?.bottom ?? 0) ||
          Math.abs((contactGeometry.map?.width ?? 0) - 1290) > 1 ||
          Math.abs((contactGeometry.heading?.x ?? 0) - (contactGeometry.selected?.x ?? 0)) > 1 ||
          Math.abs((contactGeometry.card?.x ?? 0) - ((contactGeometry.main?.x ?? 0) + (contactGeometry.main?.width ?? 0)) - 24) > 1 ||
          Math.abs((contactGeometry.intent?.width ?? 0) - 1120) > 1 ||
          contactGeometry.mainBackground !== 'rgb(255, 255, 255)' ||
          contactGeometry.cardBackground !== 'rgb(255, 255, 255)' ||
          contactGeometry.mainRadius !== '16px' ||
          contactGeometry.cardRadius !== '16px' ||
          contactGeometry.gridAlignment !== 'start' ||
          contactGeometry.contactLinkCount !== 3 ||
          !contactGeometry.contactLinkHrefs?.[0]?.includes('google.com/maps') ||
          !contactGeometry.contactLinkHrefs?.[1]?.startsWith('tel:') ||
          !contactGeometry.contactLinkHrefs?.[2]?.startsWith('tel:') ||
          contactGeometry.tooltipLabels?.join(',') !== 'Отвори карта,Уговори посещение,Позвъни сега' ||
          contactGeometry.linkGroupBorderTop !== '0px' ||
          contactGeometry.linkGroupBorderBottom !== '0px' ||
          contactGeometry.rowBorders?.some((borders) => borders.some((width) => width !== '0px')) ||
          contactGeometry.rowBackground !== 'rgba(0, 0, 0, 0)' ||
          contactGeometry.rowRadius !== '0px' ||
          contactGeometry.routeBackground !== 'rgb(32, 35, 41)' ||
          contactGeometry.routeColor !== 'rgb(255, 255, 255)'
        ) {
          failures.push(`contact card/map composition drifted (${JSON.stringify(contactGeometry)})`);
        }
      }
      const submitControls = await page.locator('form button[type="submit"], form input[type="submit"]').count();
      if (submitControls > 0) failures.push('contact route exposes a fake submit control without a lead backend');
    }

    const screenshotPath = path.join(outputRoot, `${name}-${width}x${height}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    report.checks.push({
      route,
      name,
      viewport: { width, height },
      durationMs: Date.now() - startedAt,
      ready,
      early,
      settled,
      headerShift,
      consoleErrors,
      pageErrors,
      failedLocalResponses,
      failures,
      warnings,
      screenshot: path.relative(process.cwd(), screenshotPath)
    });
    report.summary.total += 1;
    if (failures.length) report.summary.failed += 1;
    if (warnings.length) report.summary.warnings += 1;
    console.log(`${failures.length ? 'FAIL' : 'PASS'} ${route} ${width}x${height}${failures.length ? ` — ${failures.join('; ')}` : ''}`);
    await page.close();
  }

  await context.close();
}

const mobileHeroRoutes = [
  ['home-hero-mobile', '/'],
  ['inventory-hero-mobile', '/listing-grid'],
  ['about-hero-mobile', '/about-us'],
  ['contact-hero-mobile', '/contact'],
  ['blog-hero-mobile', '/blog']
];
const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });

for (const [name, route] of mobileHeroRoutes) {
  const page = await mobileContext.newPage();
  const startedAt = Date.now();
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  const ready = await waitForRouteReady(page);
  await page.waitForTimeout(300);
  const geometry = await page.evaluate(() => {
    const box = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    const hero = document.querySelector('.dn-route-hero');
    const header = document.querySelector('.dn-header');
    const heading = hero?.querySelector('h1');
    const lead = hero?.querySelector('.dn-route-hero__copy p');
    const control = document.querySelector('.dn-search, .dn-listing-filter') || hero?.querySelector('.dn-route-hero__control');
    const overlay = hero?.querySelector('.dn-hero__overlay, .dn-listing-hero__overlay, .dn-about-hero__overlay, .dn-contact-hero__overlay, .dn-blog-hero__overlay');
    return {
      header: box(header),
      headerBackground: header ? getComputedStyle(header).backgroundColor : null,
      hero: box(hero),
      heading: box(heading),
      lead: box(lead),
      control: box(control),
      headingAlign: heading ? getComputedStyle(heading).textAlign : null,
      headingText: heading?.innerText.trim() || null,
      headingClip: heading ? getComputedStyle(heading).clipPath : null,
      headingFontSize: heading ? Number.parseFloat(getComputedStyle(heading).fontSize) : null,
      headingWeight: heading ? Number.parseInt(getComputedStyle(heading).fontWeight, 10) : null,
      overlay: overlay ? getComputedStyle(overlay).backgroundColor : null,
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
    };
  });
  const failures = [];
  if (!ready) failures.push('route readiness state did not settle');
  const headingY = geometry.hero && geometry.heading ? geometry.heading.y - geometry.hero.y : null;
  const leadY = geometry.hero && geometry.lead ? geometry.lead.y - geometry.hero.y : null;
  const controlY = geometry.hero && geometry.control ? geometry.control.y - geometry.hero.y : null;
  const headingCenter = geometry.heading ? geometry.heading.x + geometry.heading.width / 2 : null;
  const compactExpectation = route === '/'
    ? { heroHeight: 132, controlY: 80, overlay: 'rgba(0, 0, 0, 0)' }
    : null;
  const compactHeroDrifted = compactExpectation && (
    !geometry.header || Math.abs(geometry.header.height - 66) > 1 ||
    Math.abs(geometry.header.y) > 1 ||
    geometry.headerBackground !== 'rgba(0, 0, 0, 0)' ||
    !geometry.hero || Math.abs(geometry.hero.height - compactExpectation.heroHeight) > 1 ||
    Math.abs(geometry.hero.y) > 1 ||
    !geometry.heading || geometry.heading.width !== 1 || geometry.heading.height !== 1 ||
    geometry.headingClip !== 'inset(50%)' ||
    (geometry.lead !== null && (geometry.lead.width > 0 || geometry.lead.height > 0)) ||
    controlY === null || Math.abs(controlY - compactExpectation.controlY) > 2 ||
    geometry.headingText !== 'Намери автомобил' ||
    geometry.overlay !== compactExpectation.overlay ||
    geometry.overflow > 1
  );
  const inventoryShellDrifted = route === '/listing-grid' && (
    !geometry.header || geometry.header.height > 1 ||
    geometry.headerBackground !== 'rgba(0, 0, 0, 0)' ||
    !geometry.hero || geometry.hero.height > 1 ||
    !geometry.control || Math.abs(geometry.control.y) > 1 ||
    geometry.control.height > 132 ||
    geometry.overflow > 1
  );
  const contactHeroDrifted = route === '/contact' && (
    !geometry.hero || Math.abs(geometry.hero.height - 248) > 1 ||
    geometry.headingText !== 'Контакти' || geometry.headingAlign !== 'center' ||
    geometry.headingFontSize !== 28 || geometry.overflow > 1 ||
    !geometry.control || geometry.control.height < 44
  );
  const sharedHeroDrifted = !compactExpectation && route !== '/listing-grid' && route !== '/contact' && (
    !geometry.hero || Math.abs(geometry.hero.height - (route === '/about-us' ? 300 : 320)) > 1 ||
    headingY === null || headingY < 24 ||
    !geometry.heading || leadY === null || leadY < headingY + geometry.heading.height + 8 ||
    !geometry.lead || controlY === null || controlY < leadY + geometry.lead.height + 16 ||
    !geometry.control || controlY + geometry.control.height > geometry.hero.height - 16 ||
    headingCenter === null || Math.abs(headingCenter - 195) > 1 ||
    geometry.headingAlign !== 'left' ||
    Math.abs((geometry.headingFontSize ?? 0) - 28) > 1 ||
    geometry.headingWeight !== 600 ||
    geometry.overlay !== 'rgba(5, 14, 24, 0.52)' ||
    geometry.overflow > 1
  );
  if (compactHeroDrifted || inventoryShellDrifted || contactHeroDrifted || sharedHeroDrifted) {
    failures.push(`mobile surface geometry drifted (${JSON.stringify({ ...geometry, headingY, leadY, controlY, headingCenter })})`);
  }
  if (route === '/listing-grid') {
    for (const width of [320, 390, 700, 767]) {
      await page.setViewportSize({ width, height: 844 });
      const listing = await page.evaluate(() => {
        const header = document.querySelector('.dn-header');
        const trigger = document.querySelector('.dn-listing-filter__toggle');
        const card = document.querySelector('.dn-listing-results .dn-vehicle-card');
        const label = document.querySelector('.dn-listing-filter__toggle-label');
        const sort = document.querySelector('.dn-listing-filter__mobile-sort');
        return {
          headerHeight: header?.getBoundingClientRect().height,
          triggerWidth: trigger?.getBoundingClientRect().width,
          triggerHeight: trigger?.getBoundingClientRect().height,
          sortY: sort?.getBoundingClientRect().top,
          triggerY: trigger?.getBoundingClientRect().top,
          sortWidth: sort?.getBoundingClientRect().width,
          labelDisplay: label && getComputedStyle(label).display,
          firstCarY: card?.getBoundingClientRect().top,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });
      if (listing.headerHeight !== 0 || listing.triggerWidth !== 44 || listing.triggerHeight !== 44 || listing.labelDisplay !== 'none' || !listing.firstCarY || listing.firstCarY > 124 || listing.overflow > 1) {
        failures.push(`compact mobile listing drifted at ${width}px (${JSON.stringify(listing)})`);
      }
      if (listing.sortWidth !== 44 || listing.sortY !== listing.triggerY) failures.push(`mobile sort must share the top controls row at ${width}px`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/listing-grid?make=Audi&sort=price-asc`, { waitUntil: 'networkidle' });
    await page.locator('.dn-listing-filter__mobile-sort').click();
    if (!await page.locator('#dn-listing-sort-sheet input[value="price-asc"]').isChecked()) failures.push('sort sheet lost the URL-selected order');
    await page.locator('#dn-listing-sort-sheet input[value="price-desc"]').check();
    await page.locator('#dn-listing-sort-sheet button[type="submit"]').click();
    await page.waitForURL((url) => url.searchParams.get('sort') === 'price-desc');
    if (new URL(page.url()).searchParams.get('make') !== 'Audi') failures.push('mobile sorting lost the make filter');
    await page.goto(`${baseUrl}/listing-grid`, { waitUntil: 'networkidle' });
    const bottomMenu = page.locator('.dn-mobile-bottom-nav button');
    await bottomMenu.click();
    await page.locator('#dn-mobile-menu').waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await page.locator('#dn-mobile-menu').waitFor({ state: 'hidden' });
    if (!await bottomMenu.evaluate((element) => element === document.activeElement)) failures.push('listing bottom Menu did not restore focus');
    const makeShortcut = page.getByRole('button', { name: 'Марка', exact: true });
    await makeShortcut.click();
    const listingDialog = page.locator('#dn-quick-filter');
    if (!await listingDialog.isVisible() || await page.locator('#dn-listing-filter-dialog').isVisible()) failures.push('make shortcut must open its own sheet');
    if (await listingDialog.locator('input[type=radio][name=make]').count() !== 5 || await listingDialog.locator('select').count()) failures.push('make sheet must contain only brand choices');
    if (await page.locator('.dn-listing-filter__mobile-count').count()) failures.push('result count must not appear before pills');
    await page.keyboard.press('Escape');
    await listingDialog.waitFor({ state: 'hidden' });
    if (!await makeShortcut.evaluate((element) => element === document.activeElement)) failures.push('listing shortcut did not restore focus');
    for (const [label, field] of [['Модел', 'model'], ['Цена', 'price'], ['Година', 'year'], ['Купе', 'body'], ['Гориво', 'fuel'], ['Скорости', 'transmission'], ['Пробег', 'mileage_max'], ['Версия', 'version'], ['Състояние', 'condition'], ['Екстри', 'equipment']]) {
      const pill = page.getByRole('button', { name: label, exact: true });
      await pill.click();
      if (!await listingDialog.isVisible() || await listingDialog.locator('h2').innerText() !== label) failures.push(`${label} did not open a focused sheet`);
      if (await page.locator('#dn-listing-filter-dialog').isVisible()) failures.push(`${label} opened all filters`);
      const visibleNames = await listingDialog.locator('input:not([type=hidden]):not([type=search])').evaluateAll(inputs => [...new Set(inputs.map(input => input.name))]);
      if (visibleNames.some(name => name !== field && name !== `${field}_min` && name !== `${field}_max`)) failures.push(`${label} contains unrelated fields`);
      await page.keyboard.press('Escape');
      await listingDialog.waitFor({ state: 'hidden' });
      if (!await pill.evaluate(element => element === document.activeElement)) failures.push(`${label} lost focus on dismiss`);
    }
    await page.getByRole('button', { name: 'Марка', exact: true }).click();
    const brandSearch = listingDialog.getByRole('searchbox', { name: 'Търси марка', exact: true });
    await brandSearch.fill('aUdI');
    if (await listingDialog.locator('.choice:visible').count() !== 1) failures.push('brand search did not filter case-insensitively');
    await listingDialog.getByRole('radio', { name: 'Audi', exact: true }).check();
    await brandSearch.fill('no-such-brand');
    if (!await listingDialog.getByRole('status').isVisible() || await listingDialog.locator('.choice:visible').count()) failures.push('brand search empty state is missing');
    await listingDialog.getByRole('button', { name: 'Изчисти търсенето', exact: true }).click();
    if (await listingDialog.locator('.choice:visible').count() !== 5 || !await listingDialog.getByRole('radio', { name: 'Audi', exact: true }).isChecked()) failures.push('clearing picker search lost selection');
    await brandSearch.fill('BMW');
    await brandSearch.press('Enter');
    if (!await listingDialog.isVisible()) failures.push('picker search Enter should not submit filters');
    await listingDialog.getByRole('button', { name: 'Приложи', exact: true }).click();
    await page.waitForURL(url => url.searchParams.get('make') === 'Audi');
    if (new URL(page.url()).searchParams.has('q')) failures.push('picker search leaked into inventory keyword query');
    await page.getByRole('button', { name: 'Модел', exact: true }).click();
    await listingDialog.getByRole('searchbox', { name: 'Търси модел', exact: true }).fill('q8');
    if (await listingDialog.locator('.choice:visible').count() !== 1 || !await listingDialog.getByRole('radio', { name: 'RS Q8', exact: true }).isVisible()) failures.push('model search failed within selected brand');
    await page.keyboard.press('Escape');
    await listingDialog.waitFor({ state: 'hidden' });
    if (!await page.getByRole('button', { name: 'Модел', exact: true }).evaluate(element => element === document.activeElement)) failures.push('searched model picker did not close and restore focus with Escape');
    await page.goto(`${baseUrl}/listing-grid?make=Audi&model=RS+6+Avant&sort=price-asc`);
    await page.getByRole('button', { name: 'Марка', exact: true }).click();
    await listingDialog.getByRole('radio', { name: 'BMW', exact: true }).check();
    await listingDialog.getByRole('button', { name: 'Приложи', exact: true }).click();
    await page.waitForURL(url => url.searchParams.get('make') === 'BMW');
    if (new URL(page.url()).searchParams.has('model') || new URL(page.url()).searchParams.get('sort') !== 'price-asc') failures.push('brand change must clear old model and preserve sort');
    await page.getByRole('button', { name: 'Модел', exact: true }).click();
    if (await listingDialog.getByRole('radio').count() !== 3 || await listingDialog.getByRole('radio', { name: 'RS 6 Avant', exact: true }).count()) failures.push('model sheet is not scoped to selected brand');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Цена', exact: true }).click();
    await listingDialog.locator('input[name=price_min]').fill('80000');
    await listingDialog.locator('input[name=price_max]').fill('50000');
    if (!await listingDialog.getByRole('button', { name: 'Приложи', exact: true }).isDisabled()) failures.push('inverted price range was allowed');
    await listingDialog.locator('input[name=price_min]').fill('50000');
    await listingDialog.locator('input[name=price_max]').fill('100000');
    await listingDialog.getByRole('button', { name: 'Приложи', exact: true }).click();
    await page.waitForURL(url => url.searchParams.get('price_max') === '100000');
    if (new URL(page.url()).searchParams.get('make') !== 'BMW') failures.push('price range lost selected brand');
    await page.getByRole('button', { name: 'Цена', exact: true }).click();
    await listingDialog.getByRole('button', { name: 'Изчисти', exact: true }).click();
    await listingDialog.getByRole('button', { name: 'Приложи', exact: true }).click();
    await page.waitForURL(url => !url.searchParams.has('price_max'));
    if (new URL(page.url()).searchParams.get('make') !== 'BMW' || new URL(page.url()).searchParams.get('sort') !== 'price-asc') failures.push('clearing one filter lost unrelated URL state');
    await page.goto(`${baseUrl}/listing-grid?make=Audi&model=RS+6+Avant&sort=price-asc`);
    await waitForRouteReady(page);
    await page.getByRole('link', { name: 'Премахни RS 6 Avant', exact: true }).click();
    await page.waitForURL('**/listing-grid?make=Audi&sort=price-asc');
    if (await page.locator('.dn-listing-results .dn-vehicle-card').count() !== 2) failures.push('removing model did not preserve make and sort');
    await page.getByRole('link', { name: 'Премахни Audi', exact: true }).click();
    await page.waitForURL('**/listing-grid?sort=price-asc');
    if (await page.locator('.dn-listing-results .dn-vehicle-card').count() !== 8) failures.push('removing make did not restore inventory');
    await page.goto(`${baseUrl}/listing-grid`, { waitUntil: 'networkidle' });
    await waitForRouteReady(page);
  }
  if (route === '/' || route === '/listing-grid') {
    const cardSurface = await page.evaluate((route) => {
      const section = document.querySelector(route === '/' ? '.dn-inventory' : '.dn-listing-results');
      const card = section?.querySelector('.dn-vehicle-card');
      const rail = section?.querySelector('.dn-inventory__grid');
      const cardStyle = card ? getComputedStyle(card) : null;
      return {
        canvas: section ? getComputedStyle(section).backgroundColor : null,
        card: cardStyle?.backgroundColor,
        shadow: cardStyle?.boxShadow,
        border: cardStyle?.borderTopWidth,
        railBottomPadding: rail ? Number.parseFloat(getComputedStyle(rail).paddingBottom) : null
      };
    }, route);
    if (
      cardSurface.canvas !== 'rgb(244, 245, 247)' ||
      cardSurface.card !== 'rgb(255, 255, 255)' ||
      !cardSurface.shadow || cardSurface.shadow === 'none' ||
      cardSurface.border !== '0px' ||
      (route === '/' && (cardSurface.railBottomPadding ?? 0) < 12)
    ) {
      failures.push(`mobile white-card/gray-canvas hierarchy drifted (${JSON.stringify(cardSurface)})`);
    }
  }
  if (route === '/') {
    for (const width of [320, 390, 700, 767]) {
      await page.setViewportSize({ width, height: 844 });
      const mobileDiscovery = await page.evaluate(() => {
        const sectionSelectors = ['.dn-mobile-budget', '.dn-body-types', '.dn-inventory', '.dn-brand-section', '.dn-editorial', '.dn-trust-actions'];
        const tileSelectors = ['.dn-mobile-budget-card', '.dn-body-type', '.dn-vehicle-card', '.dn-brand-card', '.dn-editorial-item', '.dn-trust-card'];
        const colors = (selectors) => selectors.map((selector) => {
          const element = document.querySelector(selector);
          return { selector, background: element ? getComputedStyle(element).backgroundColor : null };
        });
        const search = document.querySelector('.dn-search');
        const searchStyle = search ? getComputedStyle(search) : null;
        return {
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          sections: colors(sectionSelectors),
          tiles: colors(tileSelectors),
          searchBackground: searchStyle?.backgroundColor,
          searchShadow: searchStyle?.boxShadow,
          modeHeights: [...document.querySelectorAll('.dn-search__mobile-modes > *')].map((element) => element.getBoundingClientRect().height)
        };
      });
      if (
        mobileDiscovery.overflow > 1 ||
        mobileDiscovery.sections.some(({ background }) => background !== 'rgb(244, 245, 247)') ||
        mobileDiscovery.tiles.some(({ background }) => background !== 'rgb(255, 255, 255)') ||
        mobileDiscovery.searchBackground !== 'rgb(255, 255, 255)' ||
        !mobileDiscovery.searchShadow || mobileDiscovery.searchShadow === 'none' ||
        mobileDiscovery.modeHeights.some((height) => height < 44)
      ) {
        failures.push(`mobile integrated search or continuous browsing canvas drifted at ${width}px (${JSON.stringify(mobileDiscovery)})`);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    const quickSearchTrigger = page.locator('.dn-quick-search__trigger');
    const quickSearchDialog = page.locator('#dn-quick-search-dialog');
    await quickSearchTrigger.click();
    const mobileFilterTitle = await quickSearchDialog.locator('#quick-search-title').innerText();
    const mobileFilterRows = quickSearchDialog.locator('.dn-quick-search__filter-row');
    const mobileFilterLabels = (await mobileFilterRows.locator('strong').allTextContents()).map((label) => label.trim());
    const mobileFilterRowHeights = await mobileFilterRows.evaluateAll((rows) => rows.map((row) => row.getBoundingClientRect().height));
    if (mobileFilterTitle.trim() !== 'Филтри') failures.push(`homepage mobile filter title drifted (${mobileFilterTitle.trim() || 'missing'})`);
    if (mobileFilterLabels.join('|') !== 'Марка и модел|Купе|Бюджет|Гориво|Пробег|Година') {
      failures.push(`homepage mobile filter decisions drifted (${mobileFilterLabels.join(', ')})`);
    }
    if (mobileFilterRowHeights.some((height) => height < 48)) failures.push(`homepage mobile filter rows are too short (${mobileFilterRowHeights.join(', ')})`);
    const mobileFilterForm = quickSearchDialog.locator('.dn-quick-search__mobile-filters');
    if (await mobileFilterForm.locator('select').count() > 0) failures.push('homepage mobile filter restored native dropdowns');
    await mobileFilterRows.filter({ hasText: 'Марка и модел' }).click();
    const makeMenuTitle = await quickSearchDialog.locator('#quick-search-title').innerText();
    if (makeMenuTitle.trim() !== 'Марка') failures.push(`homepage mobile make menu title drifted (${makeMenuTitle.trim() || 'missing'})`);
    const [backButtonBox, closeButtonBox] = await Promise.all([
      quickSearchDialog.locator('.dn-quick-search__back').boundingBox(),
      quickSearchDialog.locator('.dn-quick-search__close').boundingBox()
    ]);
    if (
      !backButtonBox || !closeButtonBox ||
      backButtonBox.width < 44 || backButtonBox.height < 44 ||
      closeButtonBox.width < 44 || closeButtonBox.height < 44 ||
      Math.abs(backButtonBox.width - closeButtonBox.width) > 1 ||
      Math.abs(backButtonBox.height - closeButtonBox.height) > 1
    ) {
      failures.push(`homepage mobile filter header targets drifted (${JSON.stringify({ backButtonBox, closeButtonBox })})`);
    }
    await mobileFilterForm.getByRole('button', { name: 'Audi', exact: true }).click();
    const modelMenuTitle = await quickSearchDialog.locator('#quick-search-title').innerText();
    if (modelMenuTitle.trim() !== 'Audi') failures.push(`homepage mobile model menu title drifted (${modelMenuTitle.trim() || 'missing'})`);
    await mobileFilterForm.getByRole('button', { name: 'RS 6 Avant', exact: true }).click();
    const filteredCta = await mobileFilterForm.locator('button[type="submit"]').innerText();
    if (filteredCta.trim() !== 'Покажи 1 автомобил') failures.push(`homepage mobile filter count drifted (${filteredCta.trim() || 'missing'})`);
    await mobileFilterRows.filter({ hasText: 'Марка и модел' }).click();
    await page.keyboard.press('Escape');
    const overviewTitle = await quickSearchDialog.locator('#quick-search-title').innerText();
    if (overviewTitle.trim() !== 'Филтри') failures.push(`homepage mobile filter back navigation drifted (${overviewTitle.trim() || 'missing'})`);
    await quickSearchDialog.locator('.dn-quick-search__reset').click();
    const resetCta = await mobileFilterForm.locator('button[type="submit"]').innerText();
    if (resetCta.trim() !== 'Покажи 8 автомобила') failures.push(`homepage mobile filter reset drifted (${resetCta.trim() || 'missing'})`);
    await page.keyboard.press('Escape');
    const quickSearchClosed = await quickSearchDialog.waitFor({ state: 'hidden', timeout: 1_500 }).then(() => true).catch(() => false);
    if (!quickSearchClosed) failures.push('homepage mobile filter dialog did not close with Escape');
    if (!await quickSearchTrigger.evaluate((element) => element === document.activeElement)) failures.push('homepage mobile filter dialog did not restore trigger focus');

    const shortcuts = page.locator('.dn-search__mobile-shortcuts');
    const shortcutLinks = await shortcuts.locator('a').evaluateAll((links) => links.map((link) => ({ label: link.textContent.trim(), href: link.getAttribute('href') })));
    if (shortcutLinks.map(({ label }) => label).join('|') !== 'До 60 000 €|60–70 000 €|Audi|Mercedes|BMW' || shortcutLinks.some(({ href }) => href.includes('body='))) {
      failures.push(`homepage price/brand shortcuts drifted (${JSON.stringify(shortcutLinks)})`);
    }
    const importTab = page.getByRole('tab', { name: 'Внос', exact: true });
    const buyTab = page.getByRole('tab', { name: 'Купи', exact: true });
    const importInput = page.getByRole('textbox', { name: 'Линк към обява за внос', exact: true });
    const importContinue = page.getByRole('button', { name: 'Продължи към контакт', exact: true });
    const buySearchHeight = await page.locator('.dn-search').evaluate((element) => element.getBoundingClientRect().height);
    await importTab.click();
    if (new URL(page.url()).pathname !== '/' || !await importInput.isVisible() || await quickSearchTrigger.isVisible() || !await shortcuts.isVisible()) {
      failures.push('homepage import tab did not replace the search in place');
    }
    const importSearchHeight = await page.locator('.dn-search').evaluate((element) => element.getBoundingClientRect().height);
    if (await page.locator('#home-import-help').count() || await importInput.getAttribute('aria-describedby') || Math.abs(importSearchHeight - buySearchHeight) > 1) {
      failures.push('homepage import restored redundant helper text, stale description references, or extra empty space');
    }
    for (const invalid of ['', 'not-a-url', 'javascript:alert(1)', 'https://user:password@example.com/car']) {
      await importInput.fill(invalid);
      await importContinue.click();
      if (new URL(page.url()).pathname !== '/' || !await page.locator('#home-import-error').isVisible() || await importInput.getAttribute('aria-invalid') !== 'true') {
        failures.push(`homepage import accepted an invalid or unsafe URL (${invalid || 'empty'})`);
      }
    }
    const importListingUrl = 'https://example.com/cars/audi?model=RS%206&source=mobile#photos';
    await importInput.fill(importListingUrl);
    await buyTab.click();
    if (!await quickSearchTrigger.isVisible() || !await shortcuts.isVisible()) failures.push('homepage buy tab did not restore inventory discovery');
    await buyTab.press('ArrowRight');
    if (await importTab.getAttribute('aria-selected') !== 'true' || !await importTab.evaluate((element) => element === document.activeElement) || await importInput.inputValue() !== importListingUrl) {
      failures.push('homepage import draft or keyboard tab navigation was lost');
    }
    await importTab.press('Home');
    await buyTab.press('End');
    if (await importTab.getAttribute('aria-selected') !== 'true') failures.push('homepage mode tabs do not support Home/End');
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      const importGeometry = await importInput.evaluate((element) => ({ height: element.getBoundingClientRect().height, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
      if (importGeometry.height < 44 || importGeometry.overflow > 1) failures.push(`homepage import input overflows or has a small touch target at ${width}px`);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    if (!await page.locator('.dn-discovery__keyword').isVisible() || await importInput.isVisible() || !await page.locator('.dn-search__desktop-form').isVisible()) failures.push('mobile import selection leaked into desktop layout');
    await page.setViewportSize({ width: 390, height: 844 });
    await importContinue.click();
    await page.waitForURL((url) => url.pathname === '/contact');
    const handoffUrl = new URL(page.url());
    if (handoffUrl.searchParams.get('topic') !== 'import' || handoffUrl.searchParams.get('vehicle_url') !== importListingUrl || handoffUrl.hash !== '#contact-intent') failures.push('homepage import URL or contact anchor was lost during handoff');
    await page.reload();
    const importedLink = page.locator('.dn-contact-import > a');
    if (await importedLink.getAttribute('href') !== importListingUrl || !(await page.locator('.dn-contact-import').innerText()).includes('Линкът не е изпратен.')) failures.push('import contact does not retain the link or disclose the unsent state');
    await page.setViewportSize({ width: 320, height: 844 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) failures.push('import contact handoff overflows at 320px');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator('.dn-contact-hero__action').click();
    if (new URL(page.url()).searchParams.get('vehicle_url') !== importListingUrl) failures.push('contact jump link discarded the import context');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/contact?topic=import&vehicle_url=${encodeURIComponent('javascript:alert(1)')}`);
    if (await page.locator('.dn-contact-import').count()) failures.push('contact rendered an unsafe directly supplied import URL');
    await page.goto(`${baseUrl}/`);
  }
  const screenshotPath = path.join(outputRoot, `${name}-390x844.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  report.checks.push({ route, name, viewport: { width: 390, height: 844 }, durationMs: Date.now() - startedAt, geometry, failures, warnings: [], screenshot: path.relative(process.cwd(), screenshotPath) });
  report.summary.total += 1;
  if (failures.length) report.summary.failed += 1;
  console.log(`${failures.length ? 'FAIL' : 'PASS'} ${route} 390x844${failures.length ? ` — ${failures.join('; ')}` : ''}`);
  await page.close();
}

for (const topic of ['trade-in', 'import', 'leasing', 'inspection']) {
  const page = await mobileContext.newPage();
  const route = `/contact?topic=${topic}`;
  const startedAt = Date.now();
  const failures = [];
  page.on('pageerror', (error) => failures.push(error.message));
  for (const width of [320, 360, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseUrl}${route}`);
    await waitForRouteReady(page);
    const state = await page.evaluate(() => {
      const dock = document.querySelector('.dn-mobile-bottom-nav');
      const call = document.querySelector('.dn-contact-intent__main > .dn-contact-button');
      const items = [...dock.querySelectorAll('a, button')];
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        callBottom: call.getBoundingClientRect().bottom,
        dockTop: dock.getBoundingClientRect().top,
        active: dock.querySelector('a[aria-current="page"]')?.getAttribute('href'),
        targets: items.map((item) => ({ width: item.getBoundingClientRect().width, height: item.getBoundingClientRect().height })),
        icons: items.map((item) => item.querySelector('svg').getBoundingClientRect().y),
        iconSizes: items.map((item) => ({ width: item.querySelector('svg').getBoundingClientRect().width, height: item.querySelector('svg').getBoundingClientRect().height })),
        activeIconColor: dock.querySelector('a.active svg') ? getComputedStyle(dock.querySelector('a.active svg')).color : null,
        activeLabelColor: dock.querySelector('a.active') ? getComputedStyle(dock.querySelector('a.active')).color : null,
        preparation: document.querySelector('.dn-contact-preparation, .dn-enquiry-entry')?.getBoundingClientRect().height
      };
    });
    if (state.overflow > 1 || state.callBottom > state.dockTop || !state.preparation) failures.push(`service content or call is inaccessible at ${width}px: ${JSON.stringify(state)}`);
    if (state.targets.some((target) => target.width < 44 || target.height < 44) || Math.max(...state.icons) - Math.min(...state.icons) > 1) failures.push(`dock targets/alignment drifted at ${width}px`);
    if (['trade-in', 'import'].includes(topic) && state.active !== route) failures.push(`dock lost the active ${topic} destination at ${width}px`);
    if (state.iconSizes.some((icon) => icon.width !== 22 || icon.height !== 22)) failures.push(`dock icon sizes drifted at ${width}px`);
    if (['trade-in', 'import'].includes(topic) && (!state.activeIconColor || state.activeIconColor !== state.activeLabelColor)) failures.push(`dock active icon and label colors differ at ${width}px`);
    if (['trade-in', 'import'].includes(topic)) {
      const card = await page.evaluate(() => {
        const hero = document.querySelector('.dn-contact-hero').getBoundingClientRect();
        const main = document.querySelector('.dn-contact-intent__main');
        const bounds = main.getBoundingClientRect();
        const title = document.querySelector('.dn-contact-workflow-title').getBoundingClientRect();
        return { heroHeight: hero.height, overlap: hero.bottom - bounds.top, left: bounds.left, right: bounds.right,
          width: document.documentElement.clientWidth, background: getComputedStyle(main).backgroundColor,
          titleInside: title.top >= bounds.top && title.bottom <= bounds.bottom };
      });
      if (Math.abs(card.heroHeight - 132) > 1 || Math.abs(card.overlap - 52) > 1 || card.left < 11 || card.right > card.width - 11 || card.background !== 'rgb(255, 255, 255)' || !card.titleInside) {
        failures.push(`service action card drifted at ${width}px: ${JSON.stringify(card)}`);
      }
    }
  }
  await page.locator('.dn-mobile-bottom-nav button').click();
  await page.locator('#dn-mobile-menu').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  if (!await page.locator('.dn-mobile-bottom-nav button').evaluate((element) => document.activeElement === element)) failures.push('service menu did not restore focus');
  report.checks.push({ name: `mobile-service-${topic}`, route, durationMs: Date.now() - startedAt, failures, warnings: [] });
  report.summary.total += 1;
  if (failures.length) report.summary.failed += 1;
  console.log(`${failures.length ? 'FAIL' : 'PASS'} ${route} mobile journeys${failures.length ? ` — ${failures.join('; ')}` : ''}`);
  await page.close();
}

await mobileContext.close();

const recordBoundaryCheck = ({ name, route, startedAt, response, failures }) => {
  report.checks.push({
    route,
    name,
    viewport: null,
    durationMs: Date.now() - startedAt,
    response,
    failures,
    warnings: []
  });
  report.summary.total += 1;
  if (failures.length) report.summary.failed += 1;
  console.log(`${failures.length ? 'FAIL' : 'PASS'} ${route}${failures.length ? ` — ${failures.join('; ')}` : ''}`);
};

{
  const route = '/';
  const startedAt = Date.now();
  const failures = [];
  let responseDetails = null;
  const expectedHeaders = {
    'content-security-policy': "default-src 'self'; base-uri 'self'; connect-src 'self' ws: wss:; font-src 'self'; form-action 'self'; frame-ancestors 'self'; frame-src https://maps.google.com https://www.google.com https://www.youtube-nocookie.com; img-src 'self' data: blob:; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    'permissions-policy': 'camera=(), microphone=(), payment=(), usb=()',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'strict-transport-security': 'max-age=31536000',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'SAMEORIGIN',
    'x-xss-protection': '0'
  };

  try {
    const response = await fetch(new URL(route, baseUrl), { redirect: 'manual' });
    responseDetails = {
      status: response.status,
      headers: Object.fromEntries(Object.keys(expectedHeaders).map((header) => [header, response.headers.get(header)]))
    };
    await response.body?.cancel();

    if (response.status !== 200) failures.push(`expected canonical page response 200, received ${response.status}`);
    for (const [header, expectedValue] of Object.entries(expectedHeaders)) {
      const actualValue = response.headers.get(header);
      if (actualValue !== expectedValue) failures.push(`${header} header drifted (${actualValue ?? 'missing'})`);
    }
  } catch (error) {
    failures.push(`security header request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  recordBoundaryCheck({ name: 'security-headers', route, startedAt, response: responseDetails, failures });
}

const redirectFamilies = [
  {
    name: 'retired-home-variant',
    cases: Array.from({ length: 9 }, (_, index) => {
      const variant = String(index + 2).padStart(2, '0');
      return [`/home${variant}?utm_source=legacy&utm_campaign=canonical`, '/?utm_source=legacy&utm_campaign=canonical'];
    })
  },
  {
    name: 'retired-listing-layout',
    cases: ['listing-grid2', 'listing-list', 'listing-grid-map', 'listing-list-map'].map((layout) => [
      `/${layout}?make=Audi&body=SUV&sort=price-asc`,
      '/listing-grid?make=Audi&body=SUV&sort=price-asc'
    ])
  },
  {
    name: 'retired-listing-detail-version',
    cases: [
      ['/listing-detail-v2/1?source=legacy', '/listing-detail-v1/1?source=legacy'],
      ['/listing-detail-v3/3?source=legacy', '/listing-detail-v1/3?source=legacy'],
      ['/listing-detail-v4/5?source=legacy', '/listing-detail-v1/5?source=legacy'],
      ['/listing-detail-v5/8?source=legacy', '/listing-detail-v1/8?source=legacy']
    ]
  },
  {
    name: 'retired-editorial-index',
    cases: [['/blog-grid?category=review&q=audi', '/blog?category=review&q=audi']]
  },
  {
    name: 'retired-faq',
    cases: [['/faq?topic=leasing', '/contact?topic=leasing']]
  }
];

const canonicalRedirects = redirectFamilies.flatMap(({ name, cases }) =>
  cases.map(([route, expectedDestination]) => ({ name, route, expectedDestination }))
);

for (const { name, route, expectedDestination } of canonicalRedirects) {
  const startedAt = Date.now();
  const failures = [];
  let responseDetails = null;

  try {
    const response = await fetch(new URL(route, baseUrl), { redirect: 'manual' });
    const location = response.headers.get('location');
    const destination = location ? new URL(location, baseUrl) : null;
    const actualDestination = destination ? `${destination.pathname}${destination.search}` : null;
    responseDetails = { status: response.status, location, destination: actualDestination };
    await response.body?.cancel();

    if (response.status !== 308) failures.push(`expected exact 308 redirect, received ${response.status}`);
    if (actualDestination !== expectedDestination) {
      failures.push(`expected query-preserving destination ${expectedDestination}, received ${actualDestination ?? 'no location header'}`);
    }
  } catch (error) {
    failures.push(`redirect request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  recordBoundaryCheck({ name: `canonical-redirect:${name}`, route, startedAt, response: responseDetails, failures });
}

const removedLegacyRoutes = [
  '/add-listing',
  '/dashboard',
  '/my-favorite',
  '/dealer-detail/1',
  '/legacy-pages/home02.html'
];

const invalidContentRoutes = [
  '/listing-detail-v1/0',
  '/listing-detail-v1/9',
  '/listing-detail-v1/not-an-id',
  '/blog-detail/0',
  '/blog-detail/10',
  '/blog-detail/not-an-id'
];

for (const route of invalidContentRoutes) {
  const startedAt = Date.now();
  const failures = [];
  let responseDetails = null;

  try {
    const response = await fetch(new URL(route, baseUrl), { redirect: 'manual' });
    responseDetails = { status: response.status };
    await response.body?.cancel();
    if (response.status !== 404) failures.push(`expected invalid content ID to return 404, received ${response.status}`);
  } catch (error) {
    failures.push(`invalid content request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  recordBoundaryCheck({ name: 'invalid-content-id', route, startedAt, response: responseDetails, failures });
}

for (const route of removedLegacyRoutes) {
  const startedAt = Date.now();
  const failures = [];
  let responseDetails = null;

  try {
    const response = await fetch(new URL(route, baseUrl), { redirect: 'manual' });
    responseDetails = { status: response.status };
    await response.body?.cancel();
    if (response.status !== 404) failures.push(`expected removed legacy route to return 404, received ${response.status}`);
  } catch (error) {
    failures.push(`legacy route request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  recordBoundaryCheck({ name: 'removed-legacy-route', route, startedAt, response: responseDetails, failures });
}

const removedLegacyAssets = [
  '/_next/static/css/retired-template.css',
  '/assets/best-home.js',
  '/assets/best-home.css',
  '/assets/day-night-header-bootstrap.js',
  '/assets/day-night-site.js',
  '/assets/day-night-site.css',
  '/assets/day-night-desktop.js',
  '/assets/day-night-desktop.css'
];

for (const route of removedLegacyAssets) {
  const startedAt = Date.now();
  const failures = [];
  let responseDetails = null;

  try {
    const response = await fetch(new URL(route, baseUrl), { method: 'HEAD', redirect: 'manual' });
    responseDetails = { status: response.status };
    if (response.status !== 404) failures.push(`expected removed legacy asset to return 404, received ${response.status}`);
  } catch (error) {
    failures.push(`legacy asset request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  recordBoundaryCheck({ name: 'removed-legacy-asset', route, startedAt, response: responseDetails, failures });
}

await browser.close();
await writeFile(path.join(outputRoot, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`SvelteKit smoke: ${report.summary.total - report.summary.failed}/${report.summary.total} passing, ${report.summary.failed} failing, ${report.summary.warnings} with warnings.`);
process.exitCode = report.summary.failed ? 1 : 0;
