import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { normalizeDealerLocale, readDealerLocale, requestedLocaleEntries, planDealerLocale, nativeLocaleSources, assertLegacyLocaleCompatible, LocalePackagingError } from './lib/dealer-locale.mjs';

const config = (overrides = {}) => ({ schemaVersion: 1, dealerId: 'fixture-cars', defaultLocale: 'en', enabledLocales: ['en', 'bg'], dealerCountry: 'AE', inventoryCurrency: 'AED', ...overrides });
const variants = [{ key: 'auto-best', base: '', entry: '/' }, { key: 'modern', base: '/variant-2', entry: '/variant-2/cars' }, { key: 'carwow', base: '/variant-3', entry: '/variant-3/' }];
const manifest = () => ({ slug: 'fixture-cars', variants: structuredClone(variants) });
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-locale-input-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

test('dealer country, formatting language and stock currency are independent explicit inputs', () => {
  for (const facts of [{ dealerCountry: 'BG', inventoryCurrency: 'EUR', defaultLocale: 'en' }, { dealerCountry: 'AE', inventoryCurrency: 'AED', defaultLocale: 'bg' }, { dealerCountry: 'GB', inventoryCurrency: 'USD', enabledLocales: ['en'] }]) {
    const input = config(facts), before = structuredClone(input);
    const result = normalizeDealerLocale(input, 'fixture-cars');
    assert.deepEqual(result, before); assert.deepEqual(input, before);
    assert.notEqual(result.enabledLocales, input.enabledLocales);
    assert.ok(Object.isFrozen(result)); assert.ok(Object.isFrozen(result.enabledLocales));
  }
});

for (const [label, input] of [
  ['array', []], ['null', null], ['wrong schema', config({ schemaVersion: 2 })],
  ['foreign identity', config({ dealerId: 'another-dealer' })], ['unknown field', config({ currency: 'EUR' })],
  ['Arabic', config({ enabledLocales: ['en', 'ar'] })], ['regional alias', config({ enabledLocales: ['en-US'] })],
  ['empty languages', config({ enabledLocales: [] })], ['duplicate languages', config({ enabledLocales: ['en', 'en'] })],
  ['missing default', config({ defaultLocale: undefined })], ['disabled default', config({ enabledLocales: ['bg'] })],
  ['unknown country', config({ dealerCountry: 'ZZ' })], ['implicit country', config({ dealerCountry: undefined })],
  ['lowercase country', config({ dealerCountry: 'ae' })], ['unknown currency', config({ inventoryCurrency: 'ZZZ' })],
  ['implicit currency', config({ inventoryCurrency: undefined })], ['RTL override', config({ direction: 'rtl' })]
]) test('rejects invalid locale configuration: ' + label, () => assert.throws(() => normalizeDealerLocale(input, 'fixture-cars')));

test('country selection never enables another language and input mutation cannot change a contract', () => {
  const input = config({ enabledLocales: ['en'], dealerCountry: 'BG' });
  const contract = normalizeDealerLocale(input, 'fixture-cars'); input.enabledLocales.push('ar');
  assert.deepEqual(contract.enabledLocales, ['en']); assert.equal(contract.defaultLocale, 'en');
});

test('requested mounted routes retain queries and anchors without changing legacy routes', () => {
  const routes = [{ key: 'auto-best', base: '', entry: '/contact?topic=trade-in#form' }, { key: 'modern', base: '/variant-2', entry: '/variant-2/en/cars?make=BMW#results' }, { key: 'carwow', base: '/variant-3', entry: '/variant-3/en?lang=en#top' }];
  const before = structuredClone(routes), result = requestedLocaleEntries(routes, 'bg');
  assert.deepEqual(result.map(x => x.requestedEntry), ['/bg/contact?topic=trade-in#form', '/variant-2/bg/cars?make=BMW#results', '/variant-3/bg?lang=en#top']);
  assert.deepEqual(routes, before);
  assert.deepEqual(requestedLocaleEntries(result.map((x, i) => ({ ...routes[i], entry: x.requestedEntry })), 'bg').map(x => x.requestedEntry), result.map(x => x.requestedEntry));
});

test('a requested locale plan reports a blocked release, never enabled or installed behavior', () => {
  const input = config(), m = manifest(), before = structuredClone(m);
  const result = planDealerLocale(input, m);
  assert.equal(result.status, 'blocked-unreleased-native-adapter');
  assert.deepEqual(result.appliedChanges, []); assert.equal(result.blockers.length, 2);
  assert.deepEqual(result.requestedRoutes.bg.map(x => x.requestedEntry), ['/bg', '/variant-2/bg/cars', '/variant-3/bg']);
  assert.deepEqual(m, before);
});

for (const entry of ['https://outside.example/', '//outside.example/', '/\\outside', '/contact\u0000']) test('rejects non-internal variant entry ' + JSON.stringify(entry), () => {
  assert.throws(() => requestedLocaleEntries([{ key: 'auto-best', base: '', entry }], 'bg'));
});

test('bounded JSON reader accepts UTF-8/BOM and rejects oversize, corrupt, and malformed input', t => {
  const directory = fixture(t), file = path.join(directory, 'locale.json');
  fs.writeFileSync(file, '\uFEFF' + JSON.stringify(config()));
  assert.deepEqual(readDealerLocale(file, 'fixture-cars'), config());
  for (const bytes of [' '.repeat(16385), '{broken', Buffer.from([0xff, 0xfe, 0xff]), JSON.stringify(config({ enabledLocales: ['ar'] }))]) {
    fs.writeFileSync(file, bytes); assert.throws(() => readDealerLocale(file, 'fixture-cars'));
  }
  assert.throws(() => readDealerLocale(directory, 'fixture-cars'));
});

for (const name of ['localization/core.ts', 'localization/contract.json', 'localization/generated-manifest.json', 'auto-best/src/lib/locale/core.ts', 'carwow/src/lib/locale/core.ts', 'modern/packages/internationalization/core.ts']) {
  test('legacy packaging refuses native locale file map: ' + name, () => {
    const files = new Map([[name, Buffer.from('// native source')]]);
    assert.deepEqual(nativeLocaleSources(files), [name]);
    assert.throws(() => assertLegacyLocaleCompatible({ manifest: manifest(), files }), error => error instanceof LocalePackagingError && error.code === 'NATIVE_LOCALE_PACKAGER_REQUIRED');
  });
}

test('legacy packaging detects native source even when a retained map omits it', t => {
  const directory = fixture(t); fs.mkdirSync(path.join(directory, 'localization'));
  fs.writeFileSync(path.join(directory, 'localization/core.ts'), '// preserve native locale source');
  assert.throws(() => assertLegacyLocaleCompatible({ manifest: manifest(), source: directory, files: new Map() }), LocalePackagingError);
  assert.equal(fs.readFileSync(path.join(directory, 'localization/core.ts'), 'utf8'), '// preserve native locale source');
});

test('a locale declaration cannot opt into a missing native adapter; legacy labels remain compatible', () => {
  for (const value of [config(), false, null, {}]) assert.throws(() => assertLegacyLocaleCompatible({ manifest: { ...manifest(), localization: value } }), LocalePackagingError);
  assert.throws(() => assertLegacyLocaleCompatible({ manifest: { ...manifest(), localeContract: config() } }), LocalePackagingError);
  assert.doesNotThrow(() => assertLegacyLocaleCompatible({ manifest: { ...manifest(), language: 'en', switcher: { language: 'bg' } } }));
});
