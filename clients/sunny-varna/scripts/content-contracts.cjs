'use strict';
/**
 * Isolated tests of three real Carwow TypeScript modules with explicit fixtures.
 * No server, external requests, Svelte compilation, application typecheck or
 * browser verification is performed. This is not an application readiness gate.
 * Run after installing Carwow's retained dependencies:
 *   node scripts/content-contracts.cjs
 * An optional argument selects another Carwow root. TYPESCRIPT_PATH can select
 * an already-installed compiler; the script never installs or upgrades packages.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');

const root = path.resolve(process.argv[2] || path.join(__dirname, '../carwow'));
const localRequire = createRequire(path.join(root, 'package.json'));
let ts;
try {
  ts = process.env.TYPESCRIPT_PATH ? require(process.env.TYPESCRIPT_PATH) : localRequire('typescript');
} catch {
  console.error('TypeScript is unavailable. Install the retained Carwow lockfile or set TYPESCRIPT_PATH to an installed compiler.');
  process.exit(2);
}
const files = {
  site: 'src/lib/data/daynight-site.ts',
  routes: 'src/lib/server/public-routes.ts',
  seo: 'src/lib/server/daynight-seo.ts',
};
const compiled = {};
const blobs = {};
for (const [key, relative] of Object.entries(files)) {
  const bytes = fs.readFileSync(path.join(root, relative));
  blobs[relative] = crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  const result = ts.transpileModule(bytes.toString('utf8'), {
    fileName: relative,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, `${relative}: ${errors.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n')}`);
  compiled[key] = result.outputText;
}
function load(key, dependencies) {
  const module = { exports: {} };
  vm.runInNewContext(compiled[key], {
    module, exports: module.exports, Intl,
    require: name => {
      assert.ok(Object.hasOwn(dependencies, name), `Unexpected import: ${name}`);
      return dependencies[name];
    },
  }, { filename: files[key], timeout: 1000 });
  return module.exports;
}
const expectedRoutes = [
  ['', true], ['inventory', true], ['inventory/map', true], ['services', true],
  ['sell-your-car', true], ['sell-your-car/request', true], ['sell-car', false],
  ['sell-car/request', false], ['about', true], ['about/daynight-auto-plovdiv', true],
  ['contact', true], ['financing', true], ['reviews', true], ['calculator', false],
  ['compare', false], ['team', true], ['team/prodazhbi-daynight-auto', true],
  ['blog', true], ['blog/kak-da-kupim-upotrebyavan-avtomobil', false], ['faq', true], ['terms', true],
];
// Names and phone inputs exercise localization; the remaining values are test
// fixtures, not newly researched facts or a validation of actual dealer stock.
const fixtures = [
  ['sunny-varna', 'СЪНИ', '+359898644464'],
  ['rqs-auto-team', 'R.Q.S. Auto – Team', '+359876997791'],
  ['evrocar-varna-09', 'ЕВРОКАР ВАРНА 09', '+359897002225'],
  ['sprint-auto-varna', 'Спринт ауто', '+359888006224'],
  ['europa-varna', 'Европа', '+359887600565'],
];
const results = [];
function check(id, callback) {
  try { callback(); results.push({ id, passed: true }); }
  catch (error) { results.push({ id, passed: false, error: error.message }); }
}
for (const [slug, name, phoneE164] of fixtures) {
  const dealer = {
    slug, name, shortName: name, phoneE164, phone: phoneE164,
    phoneHref: `tel:${phoneE164}`, city: 'Варна', country: 'България',
    address: 'TEST ADDRESS', hours: 'TEST HOURS',
    sourceUrl: 'https://example.invalid/listings', stockNotice: 'TEST: dated sample, not live inventory.',
    logo: '/brand/logo.svg', logoDark: '/brand/logo-dark.svg', tagline: 'TEST TAGLINE',
  };
  const site = load('site', {
    './dealer': { dealer, stock: Array(8).fill({ fixture: true }), mapsEmbedUrl: 'https://example.invalid/embed', mapsUrl: 'https://example.invalid/map' },
    './daynight-reviews': { daynightReviewCount: 0, daynightReviewCountLabel: 'TEST', daynightReviewLinkLabel: 'TEST' },
  }).daynightSite;
  const routes = load('routes', { '$lib/data/dealer': { dealer } });
  const seo = load('seo', { '$lib/data/dealer': { dealer }, './public-routes': routes });
  check(`${slug}: phone and imported identity`, () => {
    assert.match(site.phone, /^0\d{9}$/);
    assert.equal(`tel:+359${site.phone.slice(1)}`, dealer.phoneHref);
    assert.equal(site.phoneHref, dealer.phoneHref);
    assert.equal(site.name, name);
    assert.equal(site.inventoryCount, 8);
    assert.equal(site.logoLight, dealer.logo);
  });
  check(`${slug}: 21 routes, aliases and metadata`, () => {
    const actual = JSON.parse(JSON.stringify(routes.PUBLIC_STATIC_ROUTES.map(r => [r.path, r.sitemap])));
    assert.deepEqual(actual, expectedRoutes);
    assert.equal(routes.PUBLIC_SITEMAP_ROUTES.length, expectedRoutes.filter(r => r[1]).length);
    for (const route of routes.PUBLIC_STATIC_ROUTES) {
      assert.ok(route.title.includes(name), route.path);
      assert.ok(route.description.includes(name), route.path);
      assert.doesNotMatch(route.title + route.description, /Day\s*(?:&\s*)?Night|София|Пловдив/i);
      assert.equal(seo.routeSeo(`/${route.path}/`).title, route.title);
    }
    assert.equal(seo.routeSeo('/unlisted-route/').title, routes.DAY_SITE_TITLE);
  });
  check(`${slug}: numeric EUR price and unavailable-price handling`, () => {
    const vehicle = { title: 'TEST VEHICLE', price: 1699, priceEur: 'DISPLAY TEXT MUST NOT BE PARSED', mileage: '230 000 км', fuel: 'Бензин', transmission: 'Ръчна' };
    for (const price of [1699, 10000, 1.99]) {
      const description = seo.vehicleSeo({ ...vehicle, price }).description;
      assert.ok(description.includes(new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'EUR' }).format(price)));
      assert.ok(description.includes(name));
      assert.ok(description.includes(vehicle.mileage));
      assert.ok(!description.includes('Цена при запитване'));
      assert.ok(!description.includes(vehicle.priceEur));
      assert.doesNotMatch(description, /Проверен автомобил|директен лизинг|гарантиран/i);
    }
    for (const price of [null, undefined, NaN, Infinity, 0, -1, '1699']) {
      const description = seo.vehicleSeo({ ...vehicle, price }).description;
      assert.ok(description.includes('Цена при запитване'));
      assert.ok(!description.includes('0,00'));
    }
  });
}
const report = {
  scope: 'isolated transpiled-module tests with explicit fixtures; NOT application build/typecheck/browser QA',
  node: process.version, typescript: ts.version,
  sourceGitBlobShas: blobs,
  passed: results.filter(r => r.passed).length,
  failed: results.filter(r => !r.passed).length,
  results,
};
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.failed ? 1 : 0;
