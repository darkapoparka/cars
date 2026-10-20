import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {readPackFiles, assertPublicPackFacts, createPackManifest, validPackSlug, PACK_KEYS} from './lib/dealer-pack.mjs';
import {validateManifest, resolveIdentity, sha256} from './lib/workflow.mjs';
import {listDealerPacks} from './lib/dealer-pack-index.mjs';
import {retainPackTemplatePath, bindPackAppBrandingProvenance} from './assemble-dealer-pack.mjs';

const temp = fn => {const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-pack-test-')); try {return fn(directory);} finally {fs.rmSync(directory, {recursive: true, force: true});}};
const stock = () => ({records: [{priceOnRequest: true, priceAmount: null, title: 'Observed vehicle'}]});

test('public facts reject price and CRM fields without blocking empty optional facts', () => {
  assertPublicPackFacts({business: {name: 'Public Motors', email: '', hours: ''}}, stock());
  for (const field of ['priceAmount', 'priceUsd', 'amount']) assert.throws(() => assertPublicPackFacts({}, {records: [{priceOnRequest: true, [field]: 3000}]}), /prices/);
  for (const field of ['outreach', 'private', 'personalPhone', 'contactHistory']) assert.throws(() => assertPublicPackFacts({business: {[field]: 'not publishable'}}, stock()), /Private/);
  assert.throws(() => assertPublicPackFacts({}, {records: [{priceOnRequest: false}]}), /omit/);
});

test('pack reader rejects source copies, linked files and escaping names', () => temp(directory => {
  fs.writeFileSync(path.join(directory, 'business-facts.json'), '{}'); assert.equal(readPackFiles(directory).size, 1);
  fs.mkdirSync(path.join(directory, 'modern')); assert.throws(() => readPackFiles(directory), /Only dealer inputs/); fs.rmdirSync(path.join(directory, 'modern'));
  fs.symlinkSync(path.join(directory, 'business-facts.json'), path.join(directory, 'linked.json')); assert.throws(() => readPackFiles(directory), /unsafe path/);
}));

test('source indexing reserves both pack slug and expansion identity without hosting fiction', () => temp(root => {
  fs.mkdirSync(path.join(root, 'dealers/public-motors'), {recursive: true});
  fs.writeFileSync(path.join(root, 'dealers/public-motors/dealer.json'), JSON.stringify({slug: 'public-motors', dealerId: 'gb-city-public-motors'}));
  const rows = listDealerPacks(root); assert.equal(rows[0].deployment, null);
  assert.equal(resolveIdentity(root, 'publicmotors').exists, true);
  assert.equal(resolveIdentity(root, 'another-slug', 'gb-city-public-motors').exists, true);
  assert.equal(resolveIdentity(root, 'another-slug', 'gb-another').exists, false);
}));

test('pack manifest reuses six-design mounts with explicit limited source opt-in', () => {
  const lock = {templates: Object.fromEntries(PACK_KEYS.map(key => [key, {source: {repository: 'darkapoparka/cars', revision: 'a'.repeat(40), path: 'templates/' + key, tree: 'b'.repeat(40), digest: 'c'.repeat(64)}}]))};
  const manifest = createPackManifest({slug: 'public-motors', dealerId: 'ae-city-public-motors', country: 'AE', lock, observedAt: '2026-10-19T12:00:00Z'});
  assert.equal(manifest.localization.inventoryCurrency, 'AED'); assert.equal(manifest.variants.length, 6);
  assert.equal(manifest.variants[1].entry, '/variant-2/cars'); assert.equal(manifest.variants[5].entry, '/variant-6/');
  assert.throws(() => validateManifest(manifest), /repository identity/);
  assert.equal(validateManifest(manifest, {allowDealerPackSource: true}), manifest);
  assert.throws(() => validateManifest({...manifest, sourcePath: 'clients/public-motors'}, {allowDealerPackSource: true}));
  assert.equal(validPackSlug('../escape'), false); assert.equal(validPackSlug('x'.repeat(44)), false);
});

test('transient assembly excludes copied reports while retaining runtime assets and licenses', () => {
  for (const name of ['docs/qa/screenshot.png', 'apps/web/docs/report.md', 'node_modules/lib/index.js']) assert.equal(retainPackTemplatePath(name), false);
  for (const name of ['static/assets/logo.png', 'src/lib/config/dealer.ts', 'static/assets/fonts/OFL.txt', 'LICENSE']) assert.equal(retainPackTemplatePath(name), true);
});

test('App branding handoff accepts only the exact verified derived-logo transition', () => {
  const profile = 'auto-best/src/lib/data/dealer-profile.json';
  const before = Buffer.from('{"business":{"logo":"/original.png"}}');
  const after = Buffer.from('{"business":{"logo":"/dealer-brand/reviewed.webp"}}');
  const provenance = {profile, profileSha256: sha256(before)};
  const row = {path: profile, beforeSha256: sha256(before), afterSha256: sha256(after), factualFieldsUnchanged: true};
  const files = new Map([[profile, after]]);
  assert.equal(bindPackAppBrandingProvenance(new Map([[profile, before]]), provenance, {}), provenance);
  const sealed = bindPackAppBrandingProvenance(files, provenance, {derivedProfileLogoBindings: [row]});
  assert.equal(sealed.profileSha256, sha256(after));
  assert.deepEqual(sealed.derivedProfileLogoBinding, row);
  for (const rows of [[], [row, row], [{...row, factualFieldsUnchanged: false}], [{...row, beforeSha256: '0'.repeat(64)}], [{...row, afterSha256: '0'.repeat(64)}]]) {
    assert.throws(() => bindPackAppBrandingProvenance(files, provenance, {derivedProfileLogoBindings: rows}), /outside/);
  }
  files.set(profile, Buffer.from('{"business":{"name":"Changed identity"}}'));
  assert.throws(() => bindPackAppBrandingProvenance(files, provenance, {derivedProfileLogoBindings: [row]}), /outside/);
});
