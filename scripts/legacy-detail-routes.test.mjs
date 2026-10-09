import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDealerProfile } from './lib/client-refresh-normalize.mjs';
import { planSixDesignSelection } from './lib/six-design-release.mjs';
import { vercelConfiguration, packageRetainsPath } from './package-dealer.mjs';
import { LEGACY_DETAIL_FILE, buildLegacyDetailRouteMap, mapLegacyCarwowDetails, legacyDetailArtifact, legacyDetailRedirects } from './publishing/legacy-detail-routes.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dealerRoot = path.join(root, 'clients/promosale-varna');
const oldManifest = JSON.parse(fs.readFileSync(path.join(dealerRoot, 'dealer.json')));
const profile = loadDealerProfile(dealerRoot, oldManifest.slug);
const manifest = family => ({ ...oldManifest, packaging: { version: '5' },
  variants: planSixDesignSelection(oldManifest.variants.map(variant => variant.base === '/variant-2'
    ? { ...variant, key: family === 'modern' ? 'import' : 'modern', entry: family === 'modern' ? '/variant-2/' : '/variant-2/cars' } : variant)).variants });
const source = {
  inventoryBytes: fs.readFileSync(path.join(dealerRoot, 'carwow/src/lib/data/daynight-current-inventory.ts')),
  vehicleBytes: fs.readFileSync(path.join(dealerRoot, 'carwow/src/lib/data/daynight-vehicles.ts'))
};

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
  assert.equal(config.redirects.length, result.artifact.entries.length * 5 + 10);
  assert.equal(config.redirects[0].source, '/variant-3/en/inventory');
  assert.equal(config.redirects[0].destination, '/variant-3/en/cars');
  assert.ok(packageRetainsPath(LEGACY_DETAIL_FILE));
});
