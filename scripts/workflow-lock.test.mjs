import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectLockIdentities } from './check-workflow.mjs';

const keys = ['auto-best', 'modern', 'carwow', 'import', 'app', 'mobile', 'karento-best'];
function fixture() {
  return { templates: Object.fromEntries(keys.map(key => [key, {
    status: 'approved', repository: 'darkapoparka/cars', commit: 'a'.repeat(40),
    snapshotPath: `templates/${key}`, exportPolicy: 'cars-source-v1', digest: 'b'.repeat(64),
    source: { repository: 'darkapoparka/cars', revision: 'a'.repeat(40), path: `templates/${key}`, tree: 'c'.repeat(40), digest: 'b'.repeat(64) }
  }])) };
}

test('six selected families and preserved Carwow have exact immutable identities', () => {
  assert.deepEqual(inspectLockIdentities(fixture()), []);
});

test('every family rejects malformed or mismatched immutable source descriptors', () => {
  for (const key of keys) for (const mutate of [
    e => { e.commit = 'd'.repeat(40); },
    e => { e.source.repository = 'unrelated/project'; },
    e => { e.source.path = 'templates/other'; },
    e => { e.source.tree = 'not-a-tree'; },
    e => { e.source.digest = 'b'; e.digest = 'b'; },
    e => { e.exportPolicy = 'unreviewed'; },
    e => { e.legacySource = { repository: 'unrelated/history' }; }
  ]) {
    const lock = fixture(); mutate(lock.templates[key]);
    assert.ok(inspectLockIdentities(lock).some(message => message.endsWith(key)), key);
  }
});

test('historical standalone locators remain readable but require full commit, digest and policy', () => {
  const lock = fixture(), entry = lock.templates.import;
  delete entry.source; entry.repository = 'darkapoparka/cars-template-import';
  assert.deepEqual(inspectLockIdentities(lock), []);
  entry.digest = 'invalid';
  assert.deepEqual(inspectLockIdentities(lock), ['Invalid lock identity import']);
});

test('missing historical keys and unknown source families are reported rather than skipped', () => {
  const lock = fixture(); delete lock.templates.modern;
  assert.ok(inspectLockIdentities(lock).includes('Invalid lock identity modern'));
  lock.templates.other = structuredClone(lock.templates.app);
  assert.ok(inspectLockIdentities(lock).includes('Invalid lock identity other'));
});
