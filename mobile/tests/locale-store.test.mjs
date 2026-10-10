import test from 'node:test';
import assert from 'node:assert/strict';
import { createLocaleStore } from '../.qa/domain/locale-store.mjs';
import { storageKeys } from '../.qa/domain/showroom-config.mjs';

function fixture(saved, query = '') {
  const values = new Map(saved === undefined ? [] : [[storageKeys.language, saved]]);
  let writes = 0;
  let reads = 0;
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
  const store = createLocaleStore({
    isBrowser: () => browser,
    getSearch: () => query,
    getStorage() {
      if (denied) throw new Error('SecurityError');
      return storage;
    },
  });
  return {
    store,
    storage,
    values,
    writes: () => writes,
    reads: () => reads,
    browser: (value) => {
      browser = value;
    },
    denied: (value) => {
      denied = value;
    },
    full: (value) => {
      full = value;
    },
    query: (value) => {
      query = value;
    },
  };
}

test('locale snapshots never access storage or mutate the server language', () => {
  const f = fixture('en');
  assert.equal(f.store.getSnapshot(), 'bg');
  assert.equal(f.reads(), 0);
  f.browser(false);
  f.store.hydrate();
  assert.equal(f.store.set('en'), false);
  assert.equal(f.store.syncStorage({ key: storageKeys.language, storageArea: f.storage }), false);
  assert.equal(f.store.getSnapshot(), 'bg');
  assert.equal(f.reads(), 0);
  f.browser(true);
  f.store.hydrate();
  assert.equal(f.store.getSnapshot(), 'en');
  assert.equal(f.store.getServerSnapshot(), 'bg');
});

test('a valid shared-link locale wins over saved preference and persists for later visits', () => {
  const f = fixture('bg', '?lang=en');
  f.store.hydrate();
  assert.equal(f.store.getSnapshot(), 'en');
  assert.equal(f.values.get(storageKeys.language), 'en');
  f.query('');
  f.store.hydrate();
  assert.equal(f.store.getSnapshot(), 'en');
});

test('invalid query and stored locales fall back to the saved valid locale or Bulgarian', () => {
  const f = fixture('en', '?lang=de');
  f.store.hydrate();
  assert.equal(f.store.getSnapshot(), 'en');
  f.values.set(storageKeys.language, 'invalid');
  f.store.hydrate();
  assert.equal(f.store.getSnapshot(), 'bg');
  assert.equal(f.writes(), 0);
});

test('unrelated records, sessionStorage and other storage areas cannot rewrite language', () => {
  const f = fixture('bg', '?lang=en');
  f.store.hydrate();
  const writes = f.writes();
  f.values.set(storageKeys.language, 'bg');
  for (const event of [
    { key: storageKeys.appState, storageArea: f.storage },
    { key: storageKeys.language, storageArea: null },
    { key: null, storageArea: {} },
  ])
    assert.equal(f.store.syncStorage(event), false);
  assert.equal(f.store.getSnapshot(), 'en');
  assert.equal(f.writes(), writes);
});

test('cross-tab locale synchronization reads the latest record and never echoes a write', () => {
  const f = fixture('bg');
  f.store.hydrate();
  f.values.set(storageKeys.language, 'en');
  assert.equal(
    f.store.syncStorage({ key: storageKeys.language, storageArea: f.storage, newValue: 'bg' }),
    true,
  );
  assert.equal(f.store.getSnapshot(), 'en');
  assert.equal(f.writes(), 0);
  f.query('?lang=bg');
  f.store.syncStorage({ key: storageKeys.language, storageArea: f.storage });
  assert.equal(f.store.getSnapshot(), 'bg', 'explicit shared links retain their language');
  assert.equal(
    f.values.get(storageKeys.language),
    'en',
    'synchronization does not rewrite storage',
  );
});

test('locale deletion and clear restore the default when there is no shared-link override', () => {
  for (const key of [storageKeys.language, null]) {
    const f = fixture('en');
    f.store.hydrate();
    f.values.delete(storageKeys.language);
    assert.equal(f.store.syncStorage({ key, storageArea: f.storage }), true);
    assert.equal(f.store.getSnapshot(), 'bg');
    assert.equal(f.writes(), 0);
  }
});

test('denied storage and quota failures retain the current session and recover on retry', () => {
  const f = fixture();
  f.denied(true);
  f.store.hydrate();
  assert.equal(f.store.set('en'), false);
  assert.equal(f.store.getSnapshot(), 'en');
  assert.equal(f.store.syncStorage({ key: null, storageArea: f.storage }), false);
  assert.equal(f.store.getSnapshot(), 'en');
  f.denied(false);
  f.full(true);
  assert.equal(f.store.set('bg'), false);
  assert.equal(f.store.getSnapshot(), 'bg');
  f.full(false);
  assert.equal(f.store.set('en'), true);
  assert.equal(f.values.get(storageKeys.language), 'en');
});

test('locale changes notify subscribers once and unsubscribe without leaking listeners', () => {
  const f = fixture();
  const observed = [];
  const off = f.store.subscribe(() => observed.push(f.store.getSnapshot()));
  f.store.set('en');
  f.store.set('en');
  assert.deepEqual(observed, ['en']);
  off();
  f.store.set('bg');
  assert.deepEqual(observed, ['en']);
});
