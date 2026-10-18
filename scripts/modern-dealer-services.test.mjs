import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { modernDealerServiceFlags, personalizeModernDealerServices } from './lib/modern-dealer-services.mjs';
import { refreshAdapterInternals } from './lib/client-refresh-adapters.mjs';
import { refreshNormalizeInternals } from './lib/client-refresh-normalize.mjs';
import { readCatalogLiteral } from './lib/catalog-literal.mjs';

const root = path.resolve(import.meta.dirname, '..');
const profile = services => ({ business: { services } });
const evidenced = id => ({ id, sourceUrl: 'https://dealer.example/advertised-services' });
const flagsFrom = source => {
  const match = source.match(/^  services:\s*/m);
  assert.ok(match);
  return { ...readCatalogLiteral(source, match.index + match[0].length).value };
};
const fixture = '// LEAD_SITE_CONFIG_START\nexport const leadSite = {\n  slug: "fixture",\n  socialLinks: {},\n  staticDemoMode: true,\n};\n// LEAD_SITE_CONFIG_END\n';

test('unknown, inherited labels and unsourced booleans cannot enable Modern service claims', () => {
  for (const services of [undefined, [], {}, ['Imports', 'In-house finance'], [{ id: 'imports' }], [{ id: 'finance', verified: true }], [{ id: 'leasing', sourceUrl: 'javascript:alert(1)' }], [{ id: 'imports', sourceUrl: 'https://user:password@dealer.example/' }]]) {
    assert.deepEqual(modernDealerServiceFlags(profile(services)), { imports: false, lease: false });
  }
});
test('explicit sourced import and finance enquiries are independent capabilities', () => {
  for (const countryCode of ['BG', 'GB', 'US', 'AE']) {
    for (const [services, expected] of [
      [[evidenced('imports')], { imports: true, lease: false }],
      [[evidenced('leasing')], { imports: false, lease: true }],
      [[evidenced('finance')], { imports: false, lease: true }],
      [[evidenced('imports'), evidenced('finance')], { imports: true, lease: true }],
      [[{ ...evidenced('imports'), enabled: false }, { ...evidenced('finance'), verified: false }], { imports: false, lease: false }]
    ]) assert.deepEqual(modernDealerServiceFlags({ business: { services, countryCode } }), expected);
  }
});
test('generated capability personalization is idempotent and preserves unrelated explicit configuration', () => {
  const input = fixture.replace('  socialLinks:', '  services: { buy: false, editorial: false, imports: true, lease: true },\n  socialLinks:');
  const before = profile([evidenced('imports')]), original = structuredClone(before);
  const after = personalizeModernDealerServices(input, before);
  assert.deepEqual(flagsFrom(after), { buy: false, editorial: false, imports: true, lease: false });
  assert.equal(personalizeModernDealerServices(after, before), after);
  assert.deepEqual(before, original);
  assert.match(after, /socialLinks: \{\},\n  staticDemoMode:/, 'Existing social writer boundary is preserved');
  for (const bad of [input.replace('buy: false', 'buy: chooseService()'), input.replace('buy: false', 'buy: false, buy: true'), input.replace('// LEAD_SITE_CONFIG_END', '')]) {
    assert.throws(() => personalizeModernDealerServices(bad, before));
  }
});
test('actual patchModern writes explicit disabled services for a generated dealer with no evidence', t => {
  const owner = path.join(root, 'runtime', 'modern-service-tests');
  fs.mkdirSync(owner, { recursive: true });
  const candidate = fs.mkdtempSync(path.join(owner, 'candidate-'));
  t.after(() => {
    const target = fs.realpathSync(candidate);
    assert.ok(target.startsWith(fs.realpathSync(owner) + path.sep));
    fs.rmSync(target, { recursive: true, force: true });
  });
  for (const name of ['packages/marketplace/lead-site.ts', 'packages/marketplace-domain/testing/mock-data.ts']) {
    const file = path.join(candidate, name); fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.copyFileSync(path.join(root, 'templates/modern', name), file);
  }
  fs.mkdirSync(path.join(candidate, 'apps/web/public/brand'), { recursive: true });
  fs.writeFileSync(path.join(candidate, 'apps/web/public/brand/logo.png'), 'bounded asset path fixture');
  const business = refreshNormalizeInternals.normalizeBusiness(candidate, 'service-fixture', {
    name: 'Service Fixture', countryCode: 'US', city: 'Test city', currency: 'USD', logo: '/brand/logo.png',
    phone: '+12025550123', stockUrl: 'https://dealer.example/stock', observedAt: '2026-10-18', services: []
  });
  const listing = refreshNormalizeInternals.normalizeListing({ id: 'source-car', make: 'Audi', model: 'Test', year: 2020, priceAmount: 12345, currency: 'USD', mileageValue: 60000, mileageUnit: 'mi', transmission: 'Automatic', images: ['/source-car.webp'], sourceUrl: 'https://dealer.example/stock/car', description: 'Dated listing samples; confirm price and availability directly with the dealership.' }, 0, business);
  refreshAdapterInternals.patchModern({ candidate, oldVariant: candidate, profile: { business, listings: [listing] } });
  const output = fs.readFileSync(path.join(candidate, 'packages/marketplace/lead-site.ts'), 'utf8');
  assert.deepEqual(flagsFrom(output), { imports: false, lease: false });
  assert.match(output, /name: "Service Fixture"/);
  assert.doesNotMatch(output, /tagline: "[^"\n]*(?:in-house|собствен лизинг)/i);
});
