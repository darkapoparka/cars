import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/workflow.mjs';
import { MANIFEST_PATH, FAMILIES, validateBatch, selectDealers, assertPinnedReleases,
  assertManualCi, assertMutationScope, shareIdentityForDealer } from './build-uk-dealers.mjs';

import { loadDealerProfile } from './lib/client-refresh-normalize.mjs';
import { resolveShareIdentity } from './publishing/dealer-share.mjs';

const batch = JSON.parse(fs.readFileSync(path.join(ROOT, MANIFEST_PATH), 'utf8'));
const clone = value => structuredClone(value);

test('the reviewed batch resolves exactly ten stable identities and all six immutable source descriptors', () => {
  assert.equal(validateBatch(batch), batch);
  assert.equal(selectDealers(batch, 'all').length, 10);
  for (const dealer of batch.dealers) {
    assert.deepEqual(selectDealers(batch, dealer.slug), [dealer]);
    assert.equal(dealer.repository, 'darkapoparka/cars-uk-' + dealer.slug);
  }
  assert.throws(() => selectDealers(batch, 'north-norfolk-car-sales; git push'), /exact reviewed/);
  const repeat = clone(batch); repeat.dealers[1] = {...repeat.dealers[0]};
  assert.throws(() => validateBatch(repeat), /Repeated/);
});

test('a provider change, source-path substitution, missing family or mutable revision is rejected', () => {
  const provider = clone(batch); provider.provider = 'vercel';
  assert.throws(() => validateBatch(provider), /policy/);
  const substituted = clone(batch); substituted.dealers[0].brief += '/../another-dealer';
  assert.throws(() => validateBatch(substituted), /identity/);
  const wrongOrigin = clone(batch); wrongOrigin.dealers[0].publicOrigin = 'https://another.workers.dev';
  assert.throws(() => validateBatch(wrongOrigin), /identity/);
  const incomplete = clone(batch); delete incomplete.sourceReleases.mobile;
  assert.throws(() => validateBatch(incomplete), /six exact/);
  const mutable = clone(batch); mutable.sourceReleases.app.revision = 'main';
  assert.throws(() => validateBatch(mutable), /exact source/);
});

test('the committed lock must select the exact approved SHA, tree, digest and Cars subtree for every family', () => {
  const lock = JSON.parse(fs.readFileSync(path.join(ROOT, 'templates.lock.json'), 'utf8'));
  assert.doesNotThrow(() => assertPinnedReleases(batch, lock));
  for (const key of FAMILIES) {
    for (const field of ['revision', 'tree', 'digest']) {
      const changed = clone(lock); changed.templates[key].source[field] = '0'.repeat(field === 'digest' ? 64 : 40);
      assert.throws(() => assertPinnedReleases(batch, changed), /drifted/);
    }
    const unapproved = clone(lock); unapproved.templates[key].status = 'draft';
    assert.throws(() => assertPinnedReleases(batch, unapproved), /drifted/);
    const foreign = clone(lock); foreign.templates[key].source.repository = 'other/template';
    assert.throws(() => assertPinnedReleases(batch, foreign), /drifted/);
  }
});

test('mutation requires an explicit manual main-only Linux Actions context', () => {
  const authorized = {GITHUB_ACTIONS:'true', GITHUB_REPOSITORY:'darkapoparka/cars',
    GITHUB_REF:'refs/heads/main', GITHUB_EVENT_NAME:'workflow_dispatch'};
  assert.doesNotThrow(() => assertManualCi(authorized, 'linux'));
  for (const [name, value] of [['GITHUB_ACTIONS','false'], ['GITHUB_REPOSITORY','other/cars'],
    ['GITHUB_REF','refs/heads/feature'], ['GITHUB_EVENT_NAME','pull_request']]) {
    assert.throws(() => assertManualCi({...authorized, [name]:value}, 'linux'), /manual Cars main/);
  }
  assert.throws(() => assertManualCi(authorized, 'win32'), /local preflight is read-only/);
  assert.throws(() => assertManualCi({}, 'linux'), /manual Cars main/);
});

test('commit scope refuses other dealers, masters, traversal and an empty staged set', () => {
  const slug = batch.dealers[0].slug, prefix = 'clients/' + slug + '/';
  assert.doesNotThrow(() => assertMutationScope([prefix + 'dealer.json', prefix + 'app/public/dealer-app/icon.png'], slug));
  for (const invalid of [
    [], ['templates/app/package.json'], [prefix + '../other/dealer.json'],
    ['clients/' + slug + '-copy/dealer.json'], [prefix + 'dealer.json', '.github/workflows/build-uk-dealers.yml'],
    [prefix + '/absolute'], [prefix + 'a\\b'], [prefix + 'secret\0name']
  ]) assert.throws(() => assertMutationScope(invalid, slug), /only the selected canonical dealer/);
});


test('share identity binds the real retained pilot logo and icon to the reviewed Cloudflare router origin', () => {
  const dealer = selectDealers(batch,'stockport-broadbent-car-and-servicing')[0];
  const directory = path.join(ROOT,dealer.brief), profile = loadDealerProfile(directory,dealer.slug);
  const identity = shareIdentityForDealer(dealer,profile,directory);
  const files = new Map([identity.logo.sourcePath,identity.logo.faviconSourcePath].map(name => [name,fs.readFileSync(path.join(directory,name))]));
  const resolved = resolveShareIdentity(files,{shareIdentity:identity});
  assert.equal(resolved.publicOrigin,'https://cars-uk-stockport-broadbent-car-and-servicing.darkapoparka1.workers.dev');
  assert.equal(resolved.name,dealer.name);
  assert.match(resolved.description,/Independent design preview/);
  assert.equal(resolved.logo.sha256,profile.logoContract.assets.onLight.sha256);
  assert.equal(resolved.icon.sha256,profile.logoContract.icon.sha256);
  const changedIcon = clone(profile); changedIcon.logoContract.icon.sha256 = '0'.repeat(64);
  assert.throws(() => shareIdentityForDealer(dealer,changedIcon,directory),/favicon source SHA-256 differs/);
  assert.throws(() => shareIdentityForDealer({...dealer,workerName:'cars-'+dealer.slug},profile,directory),/reviewed Cloudflare router/);
});
