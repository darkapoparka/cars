import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { planSixDesignSelection } from './lib/six-design-release.mjs';
import { vercelConfiguration, packageRetainsPath } from './package-dealer.mjs';
import { LEGACY_DETAIL_FILE, buildLegacyDetailRouteMap, mapLegacyCarwowDetails, legacyDetailArtifact, legacyDetailRedirects, assertRetainedLegacyDetailTargets } from './publishing/legacy-detail-routes.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const fixture=JSON.parse(fs.readFileSync(path.join(root,'scripts/fixtures/legacy-detail-promosale.json')));
const oldManifest=fixture.manifest, profile=fixture.profile;
// Historical Carwow inputs are compact test evidence, independent of mutable live dealer source.
const dealerRoot=fs.mkdtempSync(path.join(os.tmpdir(),'cars-legacy-route-test-'));
const historicalData=path.join(dealerRoot,'carwow/src/lib/data');
fs.mkdirSync(historicalData,{recursive:true});
const source={inventoryBytes:Buffer.from(fixture.inventory),vehicleBytes:Buffer.from(fixture.vehicles)};
fs.writeFileSync(path.join(historicalData,'daynight-current-inventory.ts'),source.inventoryBytes);
fs.writeFileSync(path.join(historicalData,'daynight-vehicles.ts'),source.vehicleBytes);
test.after(()=>{assert(path.isAbsolute(dealerRoot)&&path.dirname(dealerRoot)===os.tmpdir()&&path.basename(dealerRoot).startsWith('cars-legacy-route-test-'));fs.rmSync(dealerRoot,{recursive:true,force:true});});
const {legacyDetailRoutes:retainedLegacyDetailRoutes,...legacyFixtureManifest}=oldManifest;
const manifest=family=>({...legacyFixtureManifest,packaging:{version:'5'},variants:planSixDesignSelection(oldManifest.variants.map(variant=>variant.base==='/variant-2'?{...variant,key:family==='modern'?'import':'modern',entry:family==='modern'?'/variant-2/':'/variant-2/cars'}:variant)).variants});

test('retained source identities select different Modern PDPs for old dealer vehicle links', () => {
  const result = buildLegacyDetailRouteMap({ dealerRoot, profile, manifest: manifest('modern') });
  assert.equal(result.artifact.entries.length, profile.listings.length);
  assert.equal(result.artifact.retired.length, 0);
  const [first, second] = result.artifact.entries;
  assert.equal(first.slug, 'mercedes-benz-eqe-552939');
  assert.notEqual(first.targetId, second.targetId);
  const rules = legacyDetailRedirects(manifest('modern'), result.artifact);
  assert.equal(rules.length, result.artifact.entries.length * 5 + 5);
  for (const entry of result.artifact.entries) {
    assert.equal(rules.find(rule => rule.source.endsWith('/' + entry.slug) && rule.has?.[0]?.value === 'en').destination,
      '/variant-3/en/listing/' + entry.targetId);
    assert.equal(rules.find(rule => rule.source === '/variant-3/inventory/' + entry.slug && !rule.has).destination,
      '/variant-3/bg/listing/' + entry.targetId);
    assert.equal(rules.find(rule => rule.source === '/variant-3/en/inventory/' + entry.slug).destination,
      '/variant-3/en/listing/' + entry.targetId);
  }
  assert.ok(rules.every(rule => !rule.source.includes('*') && rule.permanent === false));
});

test('Import replacement preserves the exact full source ID and query locale', () => {
  const result = mapLegacyCarwowDetails({ ...source, profile, manifest: manifest('import') });
  const rules = legacyDetailRedirects(manifest('import'), result.artifact);
  for (const entry of result.artifact.entries) {
    assert.equal(entry.targetId, entry.sourceId);
    assert.equal(rules.find(rule => rule.source.endsWith('/' + entry.slug) && rule.has?.[0]?.value === 'en').destination,
      `/variant-3/inventory/${entry.sourceId}?lang=en`);
  }
});

test('retired stock never redirects to the first remaining vehicle', () => {
  const remaining = { ...profile, listings: profile.listings.slice(1) };
  const result = mapLegacyCarwowDetails({ ...source, profile: remaining, manifest: manifest('modern') });
  assert.equal(result.artifact.retired.length, 1);
  assert.equal(result.artifact.retired[0].sourceId, profile.listings[0].sourceId);
  assert.ok(legacyDetailRedirects(manifest('modern'), result.artifact)
    .every(rule => !rule.source.endsWith('/' + result.artifact.retired[0].slug)));
});

test('unknown slug factories and ambiguous stock IDs fail before package generation', () => {
  assert.throws(() => mapLegacyCarwowDetails({ ...source, vehicleBytes: Buffer.from(source.vehicleBytes.toString().replace('listing.id.slice(-6)', 'listing.id.slice(-5)')), profile, manifest: manifest('modern') }), /Unreviewed/);
  assert.throws(() => mapLegacyCarwowDetails({ ...source, profile: { ...profile, listings: [...profile.listings, profile.listings[0]] }, manifest: manifest('modern') }), /Duplicate current/);
  const changed = { ...profile, listings: profile.listings.map((row, i) => i ? row : { ...row, sourceUrl: 'https://example.test/wrong-stock' }) };
  assert.throws(() => mapLegacyCarwowDetails({ ...source, profile: changed, manifest: manifest('modern') }), /source URL mismatch/);
});

test('artifact bytes are pinned to the manifest and family; arbitrary redirect destinations are rejected', () => {
  const m = manifest('modern'), result = mapLegacyCarwowDetails({ ...source, profile, manifest: m });
  m.legacyDetailRoutes = result.reference;
  const files = new Map([[LEGACY_DETAIL_FILE, result.bytes]]);
  assert.deepEqual(legacyDetailArtifact(files, m), result.artifact);
  assert.throws(() => legacyDetailArtifact(new Map([[LEGACY_DETAIL_FILE, Buffer.concat([result.bytes, Buffer.from(' ')])]]), m), /differs/);
  assert.throws(() => legacyDetailArtifact(files, manifest('modern')), /Unreferenced/);
  assert.throws(() => legacyDetailRedirects(manifest('import'), result.artifact), /Invalid legacy/);
  assert.throws(() => legacyDetailRedirects(m, { ...result.artifact, entries: [{ ...result.artifact.entries[0], targetId: '../../other-dealer' }] }), /Invalid or duplicate/);
  assert.throws(() => legacyDetailRedirects(m, { ...result.artifact, entries: [...result.artifact.entries, result.artifact.entries[0]] }), /Invalid or duplicate/);
});

test('six-services configuration includes exact legacy redirects before mount routing', () => {
  const m = manifest('modern'), result = mapLegacyCarwowDetails({ ...source, profile, manifest: m });
  const config = vercelConfiguration(m, result.artifact);
  assert.equal(Object.keys(config.services).length, 6);
  const legacy = legacyDetailRedirects(m, result.artifact);
  assert.deepEqual(config.redirects.slice(0, legacy.length), legacy);
  const mounted = config.redirects.slice(legacy.length);
  assert.deepEqual(mounted.filter(rule => !rule.has), m.variants.filter(variant => variant.base && !['mobile','app'].includes(variant.key))
    .map(variant => ({ source: variant.base, destination: variant.entry, permanent: false })));
  const preferred = mounted.filter(rule => rule.has);
  assert.equal(preferred.length, m.localization.enabledLocales.length * 2);
  for (const locale of m.localization.enabledLocales) for (const source of ['/variant-4','/variant-4/']) {
    assert.deepEqual(preferred.find(rule => rule.source === source && rule.destination === '/variant-4/' + locale),
      { source, has: [{ type: 'cookie', key: 'cars-app-locale', value: { eq: locale } }], destination: '/variant-4/' + locale, permanent: false });
  }
  assert.ok(config.redirects.every(rule => rule.source !== rule.destination), 'Bare mounted entries must not redirect to themselves');
  for (const key of ['mobile','app']) {
    const variant = m.variants.find(variant => variant.key === key);
    assert.ok(config.rewrites.some(rule => rule.source === variant.base && rule.destination.service === key && rule.destination.path === variant.base),
      key + ' bare entry is dispatched directly to its native service');
  }
  assert.equal(config.redirects[0].source, '/variant-3/en/inventory');
  assert.equal(config.redirects[0].destination, '/variant-3/en/cars');
  assert.ok(packageRetainsPath(LEGACY_DETAIL_FILE));
});

test('already migrated source retains exact legacy routes without reading retired Carwow files', () => {
  for (const family of ['modern', 'import']) {
    const m=manifest(family), result=mapLegacyCarwowDetails({...source,profile,manifest:m});
    m.legacyDetailRoutes=result.reference;
    const files=new Map([[LEGACY_DETAIL_FILE,result.bytes]]), bytes=files.get(LEGACY_DETAIL_FILE);
    const retained=legacyDetailArtifact(files,m);
    assert.equal(assertRetainedLegacyDetailTargets({artifact:retained,profile,manifest:m}),retained);
    assert.equal(files.get(LEGACY_DETAIL_FILE),bytes);
    assert.deepEqual(legacyDetailRedirects(m,retained),legacyDetailRedirects(m,result.artifact));
  }
});

test('retained legacy route targets fail closed when inventory, locale or PDP identity changes', () => {
  const m=manifest('modern'), {artifact}=mapLegacyCarwowDetails({...source,profile,manifest:m});
  assert.throws(()=>assertRetainedLegacyDetailTargets({artifact,profile:{...profile,listings:profile.listings.slice(1)},manifest:m}),/target changed/);
  assert.throws(()=>assertRetainedLegacyDetailTargets({artifact,profile:{...profile,listings:profile.listings.map((row,i)=>i?row:{...row,slug:'new-pdp-identity'})},manifest:m}),/target changed/);
  assert.throws(()=>assertRetainedLegacyDetailTargets({artifact,profile:{...profile,listings:[...profile.listings,profile.listings[0]]},manifest:m}),/Duplicate current/);
  assert.throws(()=>assertRetainedLegacyDetailTargets({artifact,profile,manifest:{...m,localization:{defaultLocale:artifact.defaultLocale==='en'?'bg':'en'}}}),/locale changed/);
  const smaller={...profile,listings:profile.listings.slice(1)}, retired=mapLegacyCarwowDetails({...source,profile:smaller,manifest:m}).artifact;
  assert.throws(()=>assertRetainedLegacyDetailTargets({artifact:retired,profile,manifest:m}),/inventory was restored/);
});
