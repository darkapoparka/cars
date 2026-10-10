import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readServiceDraft,
  saveServiceDraft,
  isServiceDraftStorageEvent,
} from '../.qa/domain/service-draft-storage.mjs';
import {
  emptyServiceRequest,
  parseServiceRequest,
  serviceRequestStorageKey,
} from '../.qa/domain/service-requests.mjs';

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('missing service drafts have a stable empty snapshot', () => {
  const memory = storage();
  assert.equal(
    readServiceDraft('import', () => memory),
    '',
  );
  assert.equal(
    readServiceDraft('sell', () => memory),
    '',
  );
});

test('service draft writes retain the existing versioned format and isolate import from sale', () => {
  const memory = storage();
  const values = { ...emptyServiceRequest(), make: '  BMW  ', model: 'X6', budget: '50000' };
  assert.equal(
    saveServiceDraft('import', values, () => memory),
    true,
  );
  assert.equal(
    parseServiceRequest(
      'import',
      readServiceDraft('import', () => memory),
    ).make,
    'BMW',
  );
  assert.equal(
    readServiceDraft('sell', () => memory),
    '',
  );
  assert.equal(values.make, '  BMW  ', 'Saving must not mutate the form');
});

test('denied storage getters cannot crash reading, writing, or storage event handling', () => {
  const denied = () => {
    throw new Error('Storage denied');
  };
  assert.equal(readServiceDraft('import', denied), '');
  assert.equal(saveServiceDraft('import', emptyServiceRequest(), denied), false);
  assert.equal(
    isServiceDraftStorageEvent('import', { key: null, storageArea: null }, denied),
    false,
  );
});

test('quota failures report failure, preserve the previous draft, and permit a later retry', () => {
  const memory = storage();
  const original = { ...emptyServiceRequest(), make: 'BMW' };
  saveServiceDraft('sell', original, () => memory);
  const before = readServiceDraft('sell', () => memory);
  const full = {
    getItem: memory.getItem,
    setItem() {
      throw new Error('Quota exceeded');
    },
  };
  const changed = { ...original, make: 'Audi' };
  assert.equal(
    saveServiceDraft('sell', changed, () => full),
    false,
  );
  assert.equal(
    readServiceDraft('sell', () => memory),
    before,
  );
  assert.equal(
    saveServiceDraft('sell', changed, () => memory),
    true,
  );
  assert.equal(
    parseServiceRequest(
      'sell',
      readServiceDraft('sell', () => memory),
    ).make,
    'Audi',
  );
});

test('only the matching local-storage record or a local-storage clear notifies a service draft', () => {
  const local = storage();
  const session = storage();
  const event = { key: serviceRequestStorageKey('import'), storageArea: local };
  assert.equal(
    isServiceDraftStorageEvent('import', event, () => local),
    true,
  );
  assert.equal(
    isServiceDraftStorageEvent('sell', event, () => local),
    false,
  );
  assert.equal(
    isServiceDraftStorageEvent('import', { ...event, storageArea: session }, () => local),
    false,
  );
  assert.equal(
    isServiceDraftStorageEvent('import', { ...event, key: 'unrelated' }, () => local),
    false,
  );
  assert.equal(
    isServiceDraftStorageEvent('import', { ...event, key: null }, () => local),
    true,
  );
  assert.equal(
    isServiceDraftStorageEvent('import', { key: null, storageArea: null }, () => local),
    false,
  );
});

test('draft parsing remains responsible for rejecting a malformed stored payload', () => {
  const memory = storage();
  memory.setItem(serviceRequestStorageKey('import'), '{broken');
  const raw = readServiceDraft('import', () => memory);
  assert.equal(raw, '{broken');
  assert.deepEqual(parseServiceRequest('import', raw), emptyServiceRequest());
});
