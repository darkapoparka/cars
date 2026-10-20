import test from 'node:test';
import assert from 'node:assert/strict';
import {
  defineShowroom,
  showroom,
  showroomMetadata,
  showroomTitle,
  storageKeysFor,
} from '../.qa/domain/showroom-config.mjs';
import { createAppStore } from '../.qa/domain/app-store.mjs';
import { createLocaleStore } from '../.qa/domain/locale-store.mjs';
import { serializeServiceRequest, parseServiceRequest } from '../.qa/domain/service-requests.mjs';

const keys = (namespace) => {
  const { serviceRequests, ...other } = storageKeysFor(namespace);
  return [...Object.values(other), ...Object.values(serviceRequests)];
};
const dealer = (overrides = {}) => ({
  ...showroom,
  name: 'Example Motors',
  storageNamespace: 'example-motors',
  contactPreview: false,
  ...overrides,
});

test('standalone storage retains every original key without migrating existing data', () => {
  assert.deepEqual(
    keys(null).sort(),
    [
      'mobile-reference-v1',
      'cars-mobile-language',
      'cars-mobile-service-request-v1:import',
      'cars-mobile-service-request-v1:sell',
      'cars-mobile-inventory-context',
      'cars-mobile-restore-inventory',
    ].sort(),
  );
});

test('all browser records are distinct across dealers and stable across release updates', () => {
  const a = keys('dealer-a');
  const b = keys('dealer-b');
  const original = keys(null);
  assert.equal(new Set([...a, ...b, ...original]).size, 18);
  assert.deepEqual(keys('dealer-a'), a);
  assert.deepEqual(keys('x'.repeat(80)), keys('x'.repeat(80)));
});

test('ambiguous namespaces cannot silently alias another dealer or the standalone template', () => {
  for (const value of [
    '',
    'Dealer',
    ' dealer',
    'dealer ',
    '../dealer',
    'dealer:a',
    'a--b',
    'a_',
    'x'.repeat(81),
  ])
    assert.throws(() => storageKeysFor(value), /storageNamespace/, value);
});

test("two dealers on one origin cannot hydrate or synchronize each other's saves and enquiry drafts", () => {
  const aKeys = storageKeysFor('dealer-a');
  const bKeys = storageKeysFor('dealer-b');
  const values = new Map([
    [
      'mobile-reference-v1',
      JSON.stringify({ messageDrafts: { contact: 'Private template draft' } }),
    ],
  ]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const env = { isBrowser: () => true, getStorage: () => storage };
  const a = createAppStore(env, aKeys.appState);
  const b = createAppStore(env, bKeys.appState);
  assert.deepEqual(a.read().messageDrafts, {});
  a.patch({ parked: ['same-car-id'], messageDrafts: { contact: 'Dealer A private draft' } });
  assert.equal(b.syncStorage({ key: aKeys.appState, storageArea: storage }), false);
  assert.deepEqual(b.read().parked, []);
  assert.deepEqual(b.read().messageDrafts, {});
  b.patch({ messageDrafts: { contact: 'Dealer B private draft' } });
  assert.equal(a.syncStorage({ key: bKeys.appState, storageArea: storage }), false);
  assert.equal(
    createAppStore(env, aKeys.appState).read().messageDrafts.contact,
    'Dealer A private draft',
  );
  assert.equal(
    createAppStore(env, bKeys.appState).read().messageDrafts.contact,
    'Dealer B private draft',
  );
  assert.equal(
    JSON.parse(values.get('mobile-reference-v1')).messageDrafts.contact,
    'Private template draft',
  );
});

test("same-origin language, service forms and browsing records use only their dealer's keys", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const env = { isBrowser: () => true, getStorage: () => storage, getSearch: () => '' };
  const a = storageKeysFor('dealer-a');
  const b = storageKeysFor('dealer-b');
  const languageA = createLocaleStore(env, a.language);
  const languageB = createLocaleStore(env, b.language);
  languageA.set('en');
  assert.equal(languageB.syncStorage({ key: a.language, storageArea: storage }), false);
  languageB.hydrate();
  assert.equal(languageB.getSnapshot(), 'bg');
  storage.setItem(
    a.serviceRequests.import,
    serializeServiceRequest('import', { make: 'BMW', model: 'X3', name: 'Private A' }),
  );
  assert.equal(parseServiceRequest('import', storage.getItem(b.serviceRequests.import)).name, '');
  storage.setItem(a.inventoryContext, JSON.stringify({ href: '/?query=BMW', scrollY: 240 }));
  assert.equal(storage.getItem(b.inventoryContext), null);
  assert.equal(storage.getItem(b.restoreInventory), null);
});

test('personalization is valid with a stable identity and disabled example contacts', () => {
  const config = dealer({
    phone: '+359 888 123 456',
    email: 'hello@example.com',
    address: 'Verified dealer address',
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=dealer',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=verified',
    socialLinks: [{ label: 'Website', href: 'https://example.com' }],
  });
  assert.equal(defineShowroom(config), config);
  assert.throws(() => defineShowroom(dealer({ storageNamespace: null })), /storageNamespace/);
  assert.throws(
    () => defineShowroom({ ...showroom, phone: '+359 888 123 456' }),
    /storageNamespace/,
  );
  assert.throws(() => defineShowroom(dealer({ contactPreview: true })), /contactPreview/);
  assert.throws(() => defineShowroom(dealer({ name: ' ' })), /showroom name/);
});

test('configured contact and logo actions reject executable, incomplete and credential-bearing URLs', () => {
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,test',
    '//example.com',
    'example.com',
    'http://example.com',
    'https://user:password@example.com',
  ]) {
    for (const field of ['directionsUrl', 'mapEmbedUrl'])
      assert.throws(() => defineShowroom(dealer({ [field]: value })), new RegExp(field));
    assert.throws(
      () => defineShowroom(dealer({ socialLinks: [{ label: 'Website', href: value }] })),
      /Social links/,
    );
  }
  assert.throws(() => defineShowroom(dealer({ logo: 'javascript:alert(1)' })), /logo/);
  assert.throws(
    () => defineShowroom(dealer({ email: 'hello@example.com?subject=unexpected' })),
    /email/,
  );
  assert.throws(() => defineShowroom(dealer({ phone: 'tel:unexpected' })), /phone/);
  for (const phone of ['      ', '+000 000 000', '+1234567890123456'])
    assert.throws(() => defineShowroom(dealer({ phone })), /phone/);
  assert.throws(
    () => defineShowroom(dealer({ socialLinks: [{ label: ' ', href: 'https://example.com' }] })),
    /Social links/,
  );
});

test('personalized metadata and browser titles use the configured dealer in both languages', () => {
  assert.equal(showroomTitle('Cars', 'bg'), 'Коли — Вашият автосалон');
  assert.equal(showroomTitle('Cars', 'en'), 'Cars — Your showroom');
  assert.equal(showroomTitle('Contact', 'bg', 'Example Motors'), 'Контакт — Example Motors');
  assert.equal(showroomTitle('BMW X6', 'en', 'Example Motors'), 'BMW X6 — Example Motors');
  const metadata = showroomMetadata('Example Motors');
  assert.equal(metadata.title.default, 'Коли — Example Motors');
  assert.equal(metadata.title.template, '%s — Example Motors');
  assert.equal(metadata.applicationName, 'Example Motors');
  assert.deepEqual(metadata.robots, { index: false, follow: false });
});
