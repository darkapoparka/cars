import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { load } from 'cheerio';
import { siteRoutes } from '../src/lib/server/site.mjs';
import { listingPowerHp } from '../src/lib/server/dealer-profile.mjs';

const base = (process.env.QA_BASE || 'http://127.0.0.1:6691').replace(/\/$/, '');
const profile = JSON.parse(await readFile(new URL('../src/lib/server/dealer-profile.json', import.meta.url), 'utf8'));
const assets = new Set(['/dealer-site.css', '/dealer-ui.js', '/dealer-brand/icon.png']);
const results = [];
assert.equal(listingPowerHp({ powerHp: 245, raw: { power: '370 к.с.' } }), 245);
assert.equal(listingPowerHp({ powerHp: null, raw: { power: '370 к.с.' } }), 370);
assert.equal(listingPowerHp({ raw: { power: '2016 model' } }), null);
assert.equal(listingPowerHp({ raw: { power: '0 hp' } }), null);
assert.equal(listingPowerHp({}), null);
for (const icon of ['mile', 'automatic', 'calendar', 'fuel', 'lightning']) assets.add('/assets/imgs/template/icons/' + icon + '.svg');

async function verify(route, sourceKey, vehicle) {
  const response = await fetch(base + route);
  assert.equal(response.status, 200, route);
  const html = await response.text(), d = load(html);
  assert.match(d('title').text(), /Day & Night Auto Group/, route + ': metadata');
  assert(html.includes(profile.business.slug), route + ': serialized dealer identity');
  assert(d('img[src="/dealer-brand/logo-on-light.webp"]').length, route + ': wheel logo');
  assert.equal(d('a[href^="tel:"]').filter((_, el) => d(el).attr('href') !== profile.business.phoneHref).length, 0, route + ': phone identity');
  const visibleText = d('body').clone();
  visibleText.find('script,style').remove();
  assert.doesNotMatch(visibleText.text(), /support@carento|emily-rose@|1-222-333-4444|The High Roller|Cody Fisher|Darrell Steward|Ronald Richards|Jerome Bell|\+3600/i, route + ': inherited identity');
  assert.equal(d('form:not([data-demo-signin])[action]').length, 0, route + ': no external form action');
  assert.equal(d('form:not([data-demo-signin]) button[type="submit"]').length, 0, route + ': drafts');
  assert(d('footer').text().includes('Vehicle samples dated 24 July 2026'), route + ': sample disclosure');
  const navigation = d('[data-site-navigation] a[href]').map((_, el) => d(el).attr('href')).get();
  for (const href of navigation) if (href !== '#') assert(Object.hasOwn(siteRoutes, href.slice(1)), route + ': navigation ' + href);
  if (sourceKey === 'index-3') {
    assert.equal(d('main h1').first().text(), 'Your next car. Day & Night.');
    assert(d('.box-search-advance a[href="/vehicles"]').text().includes('View vehicles'));
    assert.doesNotMatch(d('.karento-system-stats').text(), /Global|Happy Customers|User Account/);
  }
  if (sourceKey === 'cars-details-3') {
    const selected = vehicle || profile.listings[0];
    assert(d('.tour-title-main').text().includes(selected.make), route + ': listing title');
    assert.equal(d('.banner-slide-activity img').first().attr('src'), selected.image, route + ': listing image');
    assert(d('.booking-form').text().includes('Advertised vehicle price'));
    assert.doesNotMatch(d('main').text(), /Hyundai Accent|Seltos K3|Emily Rose|Free cancellation/);
  }
  if (sourceKey === 'contact') assert.doesNotMatch(d('.card-contact').text(), /New York|Meguro|Sydney|Paris/);
  const badgeCards = d('main .card-journey-small[data-vehicle-id]:has(.card-facitlities)');
  if (['index-3', 'cars-list-2'].includes(sourceKey)) assert.equal(badgeCards.length, d('main .card-journey-small[data-vehicle-id]').length, route + ': all inventory cards have badges');
  for (const card of badgeCards.toArray()) {
    const vehicle = profile.listings.find(item => item.id === d(card).attr('data-vehicle-id'));
    assert(vehicle, route + ': card listing identity');
    assert.equal(d(card).find('.card-location').length, 0, route + ': no repeated showroom location');
    const view = d(card).find('.dealer-card-view');
    // Dashboard inventory has editing controls rather than the public card action.
    if (['index-3', 'cars-list-2'].includes(sourceKey) || d(card).find('.card-button a').length) {
      assert.equal(view.length, 1, route + ': distinct vehicle action');
      assert.equal(view.attr('href'), '/vehicle?id=' + encodeURIComponent(vehicle.id), route + ': matching card action');
      assert.equal(view.text(), 'View', route + ': compact action label');
    }
    const specs = d(card).find('.dealer-spec-list');
    const keys = specs.find('[data-spec]').map((_, el) => d(el).attr('data-spec')).get();
    const power = listingPowerHp(vehicle);
    assert.deepEqual(keys, ['mileage', 'transmission', 'year', 'fuel', ...(power === null ? [] : ['power'])], route + ': spec order');
    assert.equal(specs.find('dt').length, keys.length, route + ': accessible spec labels');
    assert.equal(specs.find('[data-spec="power"] dd').text(), power === null ? '' : new Intl.NumberFormat('en-GB').format(power) + ' hp', route + ': sourced power');
  }
  if (sourceKey === 'login') assert.equal(d('[data-demo-signin] button').attr('type'), 'submit');
  for (const element of d('img[src],script[src],link[href]').toArray()) {
    const path = d(element).attr('src') || d(element).attr('href');
    if (path?.startsWith('/') && !path.startsWith('//')) assets.add(path);
  }
  results.push({ route, sourceKey, status: response.status, bytes: Buffer.byteLength(html) });
}
for (const [route, sourceKey] of Object.entries(siteRoutes)) await verify('/' + route, sourceKey);
for (const vehicle of profile.listings) await verify('/vehicle?id=' + encodeURIComponent(vehicle.id), 'cars-details-3', vehicle);
assert.equal((await fetch(base + '/this-page-does-not-exist')).status, 404);
assert.equal((await fetch(base + '/cars-details-1.html')).status, 404, 'Unselected reference layout is not a public dealer route');
assert.equal((await fetch(base + '/index-2')).status, 404, 'Full library remains an input, not extra public layouts');
for (const path of assets) assert.equal((await fetch(base + path)).status, 200, 'Asset ' + path);
const report = { checkedAt: new Date().toISOString(), base, routes: results, assets: assets.size, inventoryMode: 'dated public listing samples', passed: true };
if (process.env.QA_REPORT) await writeFile(process.env.QA_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(`PASS: ${results.length} route/detail checks, ${assets.size} assets, unknown-route 404, dealer identity, truthful drafts and listing samples.`);
