import test from 'node:test';
import assert from 'node:assert/strict';
import { appStateStorageKey, createAppStore } from '../.qa/domain/app-store.mjs';
import { createInitialState, decodeState } from '../.qa/domain/persistence.mjs';

function fixture(saved = null) {
  const values = new Map(saved === null ? [] : [[appStateStorageKey, saved]]);
  let reads = 0;
  let writes = 0;
  let browser = true;
  let denied = false;
  let full = false;
  const storage = {
    getItem(key) {
      reads++;
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      if (full) throw new Error('QuotaExceededError');
      writes++;
      values.set(key, value);
    },
  };
  const store = createAppStore({
    isBrowser: () => browser,
    getStorage() {
      if (denied) throw new Error('SecurityError');
      return storage;
    },
  });
  return {
    store,
    storage,
    values,
    reads: () => reads,
    writes: () => writes,
    browser(value) {
      browser = value;
    },
    denied(value) {
      denied = value;
    },
    full(value) {
      full = value;
    },
  };
}

test('snapshots are stable, side-effect-free, and independent for each store', () => {
  const a = fixture(JSON.stringify({ parked: ['saved-car'] }));
  const b = fixture();
  assert.equal(a.store.getSnapshot(), a.store.getSnapshot());
  assert.equal(a.reads(), 0);
  assert.notEqual(a.store.getSnapshot(), b.store.getSnapshot());
  const server = a.store.getServerSnapshot();
  a.store.hydrate();
  assert.deepEqual(a.store.getSnapshot().parked, ['saved-car']);
  assert.equal(a.store.getServerSnapshot(), server);
  assert.deepEqual(server.parked, []);
  assert.deepEqual(b.store.getSnapshot().parked, []);
});

test('a first route write hydrates before merging and does not discard saved data', () => {
  const f = fixture(JSON.stringify({ parked: ['saved-car'], theme: 'dark' }));
  assert.equal(f.store.patch({ viewed: ['opened-car'] }), true);
  assert.deepEqual(f.store.getSnapshot().parked, ['saved-car']);
  assert.deepEqual(f.store.getSnapshot().viewed, ['opened-car']);
  assert.equal(f.store.getSnapshot().theme, 'dark');
  f.store.hydrate();
  f.store.read();
  assert.equal(f.reads(), 1, 'hydrate only once per browser session');
});

test('server-side calls never read storage or mutate the server snapshot', () => {
  const f = fixture();
  f.browser(false);
  const initial = f.store.getSnapshot();
  assert.equal(f.store.patch({ parked: ['must-not-leak'] }), false);
  f.store.notify('must-not-leak');
  f.store.hydrate();
  assert.equal(f.store.getSnapshot(), initial);
  assert.equal(f.reads(), 0);
  assert.equal(f.writes(), 0);
  f.browser(true);
  assert.equal(f.store.patch({ parked: ['client-only'] }), true);
  assert.deepEqual(f.store.getServerSnapshot().parked, []);
});

test('subscribers receive new snapshots and can unsubscribe cleanly', () => {
  const f = fixture();
  const snapshots = [];
  const unsubscribe = f.store.subscribe(() => snapshots.push(f.store.getSnapshot()));
  f.store.hydrate();
  f.store.patch({ viewed: ['car'] });
  assert.equal(snapshots.length, 2);
  assert.notEqual(snapshots[0], snapshots[1]);
  unsubscribe();
  f.store.notify('no subscriber');
  assert.equal(snapshots.length, 2);
});

test('denied storage preserves a usable in-memory session and reports no persistence', () => {
  const f = fixture();
  f.denied(true);
  f.store.hydrate();
  assert.equal(f.store.patch({ parked: ['car'] }), false);
  assert.deepEqual(f.store.read().parked, ['car']);
  f.store.notify('session only');
  assert.equal(f.store.getSnapshot().toast, 'session only');
  assert.equal(f.writes(), 0);
});

test('quota exhaustion preserves session state; later writes can recover', () => {
  const f = fixture();
  f.full(true);
  assert.equal(f.store.patch({ messageDrafts: { car: 'Keep this draft' } }), false);
  assert.equal(f.store.getSnapshot().messageDrafts.car, 'Keep this draft');
  f.full(false);
  assert.equal(f.store.patch({ viewed: ['car'] }), true);
  assert.equal(JSON.parse(f.values.get(appStateStorageKey)).messageDrafts.car, 'Keep this draft');
});

test('toasts are transient and are never restored from localStorage', () => {
  const f = fixture();
  f.store.notify('visible only');
  assert.equal(f.writes(), 0);
  f.store.patch({ viewed: ['car'] });
  assert.equal(f.store.getSnapshot().toast, 'visible only');
  assert.equal(JSON.parse(f.values.get(appStateStorageKey)).toast, '');
  assert.equal(fixture(f.values.get(appStateStorageKey)).store.read().toast, '');
});

test('sessionStorage and unrelated-key events cannot clear app state', () => {
  const f = fixture();
  f.store.patch({ parked: ['car'] });
  const before = f.store.getSnapshot();
  assert.equal(f.store.syncStorage({ key: null, storageArea: {} }), false);
  assert.equal(f.store.syncStorage({ key: appStateStorageKey, storageArea: null }), false);
  assert.equal(f.store.syncStorage({ key: 'other-app', storageArea: f.storage }), false);
  assert.equal(f.store.getSnapshot(), before);
});

test('cross-tab updates read current storage instead of replaying stale event payloads', () => {
  const f = fixture();
  f.store.hydrate();
  f.values.set(appStateStorageKey, JSON.stringify({ parked: ['latest-car'] }));
  assert.equal(
    f.store.syncStorage({
      key: appStateStorageKey,
      storageArea: f.storage,
      newValue: JSON.stringify({ parked: ['stale-car'] }),
    }),
    true,
  );
  assert.deepEqual(f.store.getSnapshot().parked, ['latest-car']);
  assert.equal(f.writes(), 0, 'synchronization must not echo writes into other tabs');
});

test('removal and localStorage.clear synchronize to a clean initial state', () => {
  for (const key of [appStateStorageKey, null]) {
    const f = fixture();
    f.store.patch({ parked: ['car'], theme: 'dark' });
    f.values.delete(appStateStorageKey);
    assert.equal(f.store.syncStorage({ key, storageArea: f.storage }), true);
    assert.deepEqual(f.store.getSnapshot(), createInitialState());
  }
});

test('corrupt browser data falls back safely on hydration and synchronization', () => {
  const f = fixture('{invalid-json');
  assert.deepEqual(f.store.read(), createInitialState());
  f.store.patch({ parked: ['car'] });
  f.values.set(appStateStorageKey, 'null');
  f.store.syncStorage({ key: appStateStorageKey, storageArea: f.storage });
  assert.deepEqual(f.store.getSnapshot(), createInitialState());
});

test('storage becoming inaccessible during synchronization does not discard session data', () => {
  const f = fixture();
  f.store.patch({ parked: ['car'] });
  const before = f.store.getSnapshot();
  f.denied(true);
  assert.equal(f.store.syncStorage({ key: appStateStorageKey, storageArea: f.storage }), false);
  assert.equal(f.store.getSnapshot(), before);
});

test('all persisted dictionaries reject reserved, empty, and overlong keys', () => {
  const bad = {
    ['__proto__']: 4,
    constructor: 4,
    prototype: 4,
    '': 4,
    ['x'.repeat(101)]: 4,
    car: 4,
  };
  const text = Object.fromEntries(Object.keys(bad).map((key) => [key, 'text']));
  const contacts = Object.fromEntries(Object.keys(bad).map((key) => [key, { name: 'Example' }]));
  const state = decodeState(
    JSON.stringify({
      parkedAt: bad,
      photoIndexes: bad,
      parkNotes: text,
      messageDrafts: text,
      draft: text,
      showroomContactDetails: contacts,
    }),
  );
  for (const field of [
    'parkedAt',
    'photoIndexes',
    'parkNotes',
    'messageDrafts',
    'draft',
    'showroomContactDetails',
  ])
    assert.deepEqual(Object.keys(state[field]), ['car'], field);
  assert.equal({}.car, undefined);
});

test('duplicate persisted saved-search IDs cannot produce duplicate React keys', () => {
  const saved = [
    { id: 'one', name: 'First' },
    { id: 'one', name: 'Duplicate' },
    { id: 'x'.repeat(101), name: 'Long' },
    { id: 'x'.repeat(100), name: 'Same normalized ID' },
  ];
  const state = decodeState(JSON.stringify({ saved }));
  assert.deepEqual(
    state.saved.map((value) => value.name),
    ['First', 'Long'],
  );
});
