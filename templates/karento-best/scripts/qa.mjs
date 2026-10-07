import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { siteRoutes } from '../src/lib/server/site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reference = path.resolve(root, '../karento');
const base = process.env.KARENTO_BEST_QA_URL || 'http://127.0.0.1:6466';
const pages = JSON.parse(await readFile(path.join(reference, 'src/lib/server/pages.json'), 'utf8'));
const capture = JSON.parse(await readFile(path.join(reference, 'provenance/capture.json'), 'utf8'));
const expectedMenu = ['Home', 'Vehicles', 'Services', 'Shop', 'Explore', 'Plans', 'Contact'];
const selectedRoutes = new Set(Object.keys(siteRoutes).map(route => '/' + route));
const results = [];
const home2 = load(await readFile(path.join(reference, 'src/lib/server/pages/index-2.html'), 'utf8'));
const home3 = load(await readFile(path.join(reference, 'src/lib/server/pages/index-3.html'), 'utf8'));

async function verify(route, sourceKey) {
  const response = await fetch(base + route);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  const $ = load(html);
  const original = load(await readFile(path.join(reference, 'src/lib/server/pages', sourceKey + '.html'), 'utf8'));
  assert.equal($('header.header').length, 1, `${route}: one website header`);
  assert.equal($('header.header').attr('class'), home3('header.header').attr('class'), `${route}: Home 3 header composition`);
  assert.equal($('header .top-bar,header .text-header-info').length, 0, `${route}: alternate header strip removed`);
  assert.equal($('header .change-mode').length, 0, `${route}: unused theme switch removed`);
  assert.equal($('header .karento-menu-toggle[aria-controls="karento-account-drawer"]').length, 1, `${route}: shared drawer opener`);
  assert.equal($('header .karento-header-cta[data-demo-account-link]').text().trim(), 'Account', `${route}: direct account entry`);
  assert.equal($('.karento-account-drawer[role="dialog"][inert] .sidebar-canvas-container').length, 1, `${route}: retained account drawer`);
  assert.equal($('.karento-drawer-account .karento-demo-signout').length, 1, `${route}: drawer sign-out entry`);
  assert.equal($('header .karento-header-actions .karento-demo-signout').length, 0, `${route}: sign-out is inside the account menu`);
  assert.deepEqual($('.main-menu > li > a').map((_, element) => $(element).text()).get(), expectedMenu, `${route}: desktop menu`);
  assert.deepEqual($('.mobile-menu > li > a').map((_, element) => $(element).text()).get(), expectedMenu, `${route}: mobile menu`);
  let expectedHeadings = original('main').find('h1,h2,h3,h4,h5,h6').length;
  let expectedImages = original('main img').length;
  if (sourceKey === 'login') expectedImages -= original('.form-login img').length;
  if (sourceKey === 'pricing') expectedImages -= original('.section-pricing-1 img[src$="/pricing-1/check-primary.svg"]').length;
  if (sourceKey === 'contact') expectedImages += 4;
  if (sourceKey === 'index-3') {
    const previous = original('.section-cta-6').add(original('.box-author-testimonials').closest('section'));
    const replacements = home2('.section-cta-4').add(home2('.block-testimonials').closest('section'));
    expectedHeadings += replacements.find('h1,h2,h3,h4,h5,h6').length - previous.find('h1,h2,h3,h4,h5,h6').length;
    expectedImages += replacements.find('img').length - previous.find('img').length;
    expectedImages += 4 - original('.box-why-book-22 img').length;
    expectedImages += 9 - original('.box-list-brand-car img').length;
    assert.equal($('.karento-home-brands[data-brand-source="index"] .karento-brand-logo').length, 9, `${route}: Home 1 brand logos`);
    assert.equal($('.karento-home-brands .carouselTicker,.karento-home-brands .item-brand-2').length, 0, `${route}: repeated ticker cards removed`);
    assert.equal($('.karento-how-it-works').length, 1, `${route}: photographic process section`);
    assert.equal($('.karento-process-step').length, 4, `${route}: four process steps`);
    assert.equal($('.karento-process-grid svg,.box-why-book-22').length, 0, `${route}: old icon diagram removed`);
    assert.equal($('.section-cta-4[data-home-section-source="index-2"]').length, 1, `${route}: Home 2 system`);
    assert.equal($('.section-cta-4 .karento-system-stats.border .karento-static-count').length, 5, `${route}: five static bordered stats inside system`);
    assert.equal($('.section-static-1,.section-cta-6').length, 0, `${route}: no duplicate original sections`);
    assert.equal($('.block-testimonials .card-testimonial').length, home2('.block-testimonials .card-testimonial').length, `${route}: Home 2 testimonials`);
  }
  assert.equal($('main').find('h1,h2,h3,h4,h5,h6').length, expectedHeadings, `${route}: retained selected content sections`);
  assert.equal($('main img').length, expectedImages, `${route}: retained selected artwork`);
  const destinations = $('[data-site-navigation] a[href]').map((_, element) => $(element).attr('href')).get();
  assert(destinations.includes('/shop'), `${route}: shop grid reachable`);
  assert.equal($('footer a[href="/dashboard"],footer a[href="/account"]').length, 0, `${route}: account access does not live in footer`);
  assert.equal($('.karento-mobile-account [data-demo-account-link]').length, 1, `${route}: mobile sign-in/dashboard entry reachable`);
  if (sourceKey === 'login') {
    assert.equal($('[data-demo-signin] option[value="owner"]').length, 1, `${route}: owner sign-in destination`);
    assert.equal($('[data-demo-signin] option[value="member"]').length, 1, `${route}: member sign-in destination`);
    assert.equal($('[data-demo-signin] input[type="password"]').length, 0, `${route}: preview does not solicit credentials`);
  }
  assert.equal($('.wow,.hover-up,.odometer,#preloader-active').length, 0, `${route}: immediate content without decorative motion`);
  const ownerPage = sourceKey.startsWith('agent-dashboard-');
  assert.equal($('.header-right a[href="/dashboard/add-listing"]').length, 0, `${route}: Add Listing lives inside the owner dashboard`);
  if (ownerPage) {
    assert.equal($('.dashboard-sidebar-menu a[href="/dashboard/earnings"]').length, 1, `${route}: owner pages remain inside dashboard`);
    assert.equal($('.dashboard-sidebar-menu a[aria-current="page"]').length, 1, `${route}: current dashboard page identified`);
  }
  for (const href of destinations) if (href !== '#') assert(selectedRoutes.has(href), `${route}: valid website menu route ${href}`);
  const referenceLinks = $('a[href]').map((_, element) => $(element).attr('href')).get();
  assert(!referenceLinks.includes('/destination.html') && !referenceLinks.includes('/privacy.html'), `${route}: absent reference destinations removed`);
  assert(!referenceLinks.some(href => /^\/(?:cars-list-[134]|cars-details-[124]|index(?:-[23])?)\.html/.test(href)), `${route}: selected layout destinations`);
  assert(!$('main').text().includes('@@current-page'), `${route}: resolved breadcrumb`);
  if (sourceKey === 'index-3') assert.match($('main h1').first().text(), /Discover your next car today/);
  if (sourceKey === 'dealer-listing') assert.equal($('main .page-header h2').text(), 'Import Sources');
  results.push({ route, sourceKey, status: response.status, bytes: Buffer.byteLength(html) });
}

for (const [route, sourceKey] of Object.entries(siteRoutes)) await verify('/' + route, sourceKey);
for (const sourceKey of Object.keys(pages)) {
  await verify('/' + sourceKey, sourceKey);
  await verify('/' + sourceKey + '.html', sourceKey);
}
for (const missingRoute of ['/this-page-does-not-exist', '/news/missing-article', '/toString']) {
  const missingResponse = await fetch(base + missingRoute);
  assert.equal(missingResponse.status, 404, `${missingRoute}: real missing-page status`);
  const missingPage = load(await missingResponse.text());
  assert.equal(missingPage('main h1').text(), '404', `${missingRoute}: designed error screen`);
  assert.equal(missingPage('header.header').attr('data-header-source'), 'index-3', `${missingRoute}: shared website header`);
  assert(missingPage('main a[href="/"]').length >= 1, `${missingRoute}: recovery link`);
}
assert.equal((await fetch(base + '/dealer-site.css')).status, 200);
assert.equal((await fetch(base + '/dealer-ui.js')).status, 200);
for (const step of ['choose', 'talk', 'view', 'collect']) {
  const filename = `${step}-20261006${step === 'view' ? '-v2' : ''}.webp`;
  const response = await fetch(`${base}/assets/karento-best/how-it-works/${filename}`);
  assert.equal(response.status, 200, filename);
  assert.equal(response.headers.get('content-type'), 'image/webp', filename);
  const local = await readFile(path.join(root, 'src/lib/server/assets/how-it-works', filename));
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), local, `${filename}: production serves the generated asset intact`);
}
assert.equal((await fetch(base + '/assets/karento-best/how-it-works/not-an-image.webp')).status, 404);
assert.equal((await fetch(base + '/assets/karento-best/how-it-works/toString')).status, 404);
for (const portrait of ['01', '02', '03', '04']) {
  const filename = `portrait-${portrait}-20261007.webp`;
  const response = await fetch(`${base}/assets/karento-best/contact-avatars/${filename}`);
  assert.equal(response.status, 200, filename);
  assert.equal(response.headers.get('content-type'), 'image/webp', filename);
  const local = await readFile(path.join(root, 'src/lib/server/assets/contact-avatars', filename));
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), local, `${filename}: production serves the generated portrait intact`);
}
assert.equal((await fetch(base + '/assets/karento-best/contact-avatars/not-an-image.webp')).status, 404);
assert.equal((await fetch(base + '/assets/karento-best/contact-avatars/toString')).status, 404);
const assets = capture.files.filter(file => file.path);
for (let start = 0; start < assets.length; start += 12) {
  await Promise.all(assets.slice(start, start + 12).map(async file => {
    const response = await fetch(base + '/' + file.path.replace(/^static\//, ''), { method: 'HEAD' });
    assert.equal(response.status, 200, file.path);
  }));
}
// The original remains independently usable, including its Home 2 default.
const referenceResponse = await fetch('http://127.0.0.1:6462/');
assert.equal(referenceResponse.status, 200);
assert((await referenceResponse.text()).includes('box-banner-home7'), 'Original Karento root remains Home 2');
const report = { checkedAt: new Date().toISOString(), base, referenceBase: 'http://127.0.0.1:6462',
  selectedPages: { home: 'index-3', list: 'cars-list-2', details: 'cars-details-3' },
  routes: results, assetsChecked: assets.length, generatedAssetsChecked: 8, menu: expectedMenu,
  scope: 'HTTP routes, complete menu destinations, retained sections/artwork, chosen layout links and reference preservation. Browser interaction evidence is recorded separately.' };
const destination = path.resolve(root, '../../docs/karento');
await mkdir(destination, { recursive: true });
await writeFile(path.join(destination, 'best-http-qa.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`${results.length} routes, ${assets.length} reference assets and 8 generated assets, desktop/mobile menus and preserved reference checks passed`);
