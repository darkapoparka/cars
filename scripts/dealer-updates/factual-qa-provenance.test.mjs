import assert from 'node:assert/strict';
import test from 'node:test';
import { collectFactualTargetConsumers, assertFactualRefreshCandidate, assertFactualRefreshReplay } from './update-dealer-template.mjs';
import { planThreeWayUpgrade } from './three-way-upgrade.mjs';

const qa = [
  'import/docs/desktop-hero-content-2026-10-02/charcoal-2026-10-03/after-matrix.json',
  'import/docs/desktop-hero-content-2026-10-02/charcoal-2026-10-03/before-matrix.json',
  'import/docs/desktop-home-entry-2026-10-03/after-matrix.json',
  'import/docs/desktop-home-entry-2026-10-03/before-matrix.json'
];
const keys = ['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best'];
const bytes = text => Buffer.from(text + '\n');

test('historical Import matrices keep dealer provenance while current docs and runtime consumers stay strict', () => {
  const before = new Map(qa.map(name => [name, bytes('original QA')]));
  const after = new Map(qa.map(name => [name, bytes('personalized target QA')]));
  for (const name of ['import/docs/current-contacts.json', 'import/src/lib/config/dealer.ts', 'import/docs/desktop-home-entry-2026-10-03/after-matrix.json.backup']) {
    before.set(name, bytes('before'));
    after.set(name, bytes('after'));
  }
  assert.deepEqual(collectFactualTargetConsumers(before, after), [
    'import/docs/current-contacts.json',
    'import/docs/desktop-home-entry-2026-10-03/after-matrix.json.backup',
    'import/src/lib/config/dealer.ts'
  ]);
  const relative = new Map(qa.map(name => [name.slice('import/'.length), bytes('old')]));
  const changed = new Map([...relative].map(([name]) => [name, bytes('new')]));
  assert.deepEqual(collectFactualTargetConsumers(relative, changed, 'import/'), []);
});

test('the historical provenance exception cannot hide any removed file', () => {
  for (const name of [...qa, 'import/src/lib/config/dealer.ts']) {
    assert.throws(() => collectFactualTargetConsumers(new Map([[name, bytes('original')]]), new Map()), /unexpectedly removed/);
  }
});

test('preserving all historical matrices still seals six factual families and rejects stale runtime facts', () => {
  const oldBase = new Map(), newBase = new Map(), dealer = new Map();
  for (const key of keys) {
    const name = key + '/src/current-facts.json';
    oldBase.set(name, bytes('old sample'));
    newBase.set(name, bytes('current dealer facts'));
    dealer.set(name, bytes('old sample'));
  }
  for (const name of qa) {
    oldBase.set(name, bytes('old template QA'));
    newBase.set(name, bytes('personalized target QA'));
    dealer.set(name, bytes('original dealer QA'));
  }
  const resolutions = Object.fromEntries(qa.map(name => [name, 'dealer']));
  const plan = planThreeWayUpgrade({ oldBase, newBase, dealer, resolutions });
  assert.equal(plan.ready, true);
  for (const name of qa) assert(plan.candidate.get(name).equals(dealer.get(name)));
  const consumerPaths = collectFactualTargetConsumers(oldBase, newBase);
  assert.deepEqual(consumerPaths, keys.map(key => key + '/src/current-facts.json').sort());
  const newBases = Object.fromEntries(keys.map(key => [key, new Map([...newBase].filter(([name]) => name.startsWith(key + '/')).map(([name, value]) => [name.slice(key.length + 1), value]))]));
  const proof = { schemaVersion: 1, stage: 'preservation-merge-before-native-catalogs-and-branding', mode: 'current-facts-from-pinned-six-targets', dealer: 'reviewed', profileSha256: 'a'.repeat(64), targetSources: Object.fromEntries(keys.map(key => [key, { repository: 'darkapoparka/cars', revision: 'b'.repeat(40), path: 'templates/' + key, tree: 'c'.repeat(40), digest: 'd'.repeat(64) }])), consumerPaths };
  const sealed = assertFactualRefreshCandidate({ candidate: plan.candidate, newBases, proof });
  assert.equal(sealed.consumerHashes.length, 6);
  assertFactualRefreshReplay({ proof, metadata: { selection: { refreshFacts: true }, factualRefresh: sealed }, newBases });
  const stale = new Map(plan.candidate);
  stale.set('import/src/current-facts.json', bytes('stale dealer facts'));
  assert.throws(() => assertFactualRefreshCandidate({ candidate: stale, newBases, proof }), /differs after preservation/);
});
