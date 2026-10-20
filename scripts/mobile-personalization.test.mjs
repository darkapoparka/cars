import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';
import { applyExtendedRefreshAdapter } from './lib/client-refresh-six.mjs';

const template = new URL('../templates/mobile/', import.meta.url);
const ts = createRequire(new URL('package.json', template))('typescript');
const fixturePaths = [
  'package.json',
  ...['showroom-config', 'catalog', 'dealers', 'locale', 'search', 'types', 'vehicle-copy']
    .map(name => `src/lib/${name}.ts`),
  ...['NativeDealerCards', 'DealerScreens', 'VehicleCard', 'VehicleSections',
    'DesktopVehicleSummary', 'ShowroomVehicleCard', 'NativeCarPark', 'ShowroomFilterSheet']
    .map(name => `src/components/${name}.tsx`),
];

function fixture(t) {
  const client = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-mobile-personalization-'));
  t.after(() => fs.rmSync(client, { recursive: true, force: true }));
  // These bytes exercise asset retention only; no image decoder or provider is invoked.
  for (const name of ['dealer-brand/light.webp', 'dealer-brand/dark.webp', 'dealer/vehicle.webp']) {
    const file = path.join(client, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.from([82, 73, 70, 70, 0, 1, 2, 3]));
  }
  const profile = {
    slug: 'mobile-fixture', stockKind: 'dated-listing-snapshot',
    business: {
      name: 'Fixture Motors', locale: 'en-GB', countryCode: 'BG', country: 'Bulgaria',
      currency: 'EUR', city: 'Fixture city', phoneE164: '+359888123456',
      phoneHref: 'tel:+359888123456', phoneDisplay: '+359 888 123 456',
      email: 'hello@example.test', address: 'Fixture street 1',
      mapsUrl: 'https://example.test/map', mapsEmbedUrl: 'https://example.test/embed',
      socialLinks: { Website: 'https://example.test/' }, hours: 'Contact before visiting',
      logo: '/dealer-brand/light.webp', logoDark: '/dealer-brand/dark.webp',
      inventoryNotice: 'Dated examples; confirm availability.', observedAt: '2026-10-18',
    },
    listings: [{
      id: 'source-id', title: '2020 Audi A3', make: 'Audi', model: 'A3', trim: '',
      year: 2020, priceAmount: 12500, currency: 'EUR', mileageValue: 75000,
      mileageUnit: 'km', powerHp: null, fuel: 'Diesel', fuelType: 'diesel',
      transmission: 'Manual', transmissionType: 'manual', body: 'Hatchback',
      bodyType: 'hatchback', color: 'Blue', location: 'Fixture city', features: [],
      images: ['/dealer/vehicle.webp'], image: '/dealer/vehicle.webp',
      description: 'Supplied vehicle description. '.repeat(24),
      availability: 'Confirm availability', sourceUrl: 'https://example.test/listing/source-id',
      observedAt: '2026-10-18', raw: { year: 2020, mileageKm: 75000 },
    }],
  };
  const files = new Map(fixturePaths.map(name => [
    'mobile/' + name, fs.readFileSync(new URL(name, template)),
  ]));
  return { client, profile, files };
}

function nodes(root, predicate) {
  const matches = [];
  function visit(node) {
    if (predicate(node)) matches.push(node);
    ts.forEachChild(node, visit);
  }
  visit(root);
  return matches;
}

function initializer(source, name) {
  const declarations = nodes(source, node => ts.isVariableDeclaration(node) &&
    ts.isIdentifier(node.name) && node.name.text === name);
  assert.equal(declarations.length, 1, `one ${name} declaration`);
  assert.ok(declarations[0].initializer, `${name} has an initializer`);
  return declarations[0].initializer;
}

function verify(x) {
  const before = JSON.stringify(x.profile);
  const result = applyExtendedRefreshAdapter({ ...x, key: 'mobile' });
  assert.equal(JSON.stringify(x.profile), before, 'normalized source profile is not mutated');

  const parsed = new Map();
  for (const [name, bytes] of x.files) {
    if (!/\.tsx?$/.test(name)) continue;
    const source = ts.createSourceFile(name, bytes.toString('utf8'), ts.ScriptTarget.Latest,
      true, name.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    assert.deepEqual(source.parseDiagnostics.map(diagnostic =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')), [], name);
    parsed.set(name, source);
  }
  const configSource = parsed.get('mobile/src/lib/showroom-config.ts');
  const call = initializer(configSource, 'showroom');
  assert.ok(ts.isCallExpression(call) && call.expression.getText(configSource) === 'defineShowroom');
  assert.equal(call.arguments.length, 1);
  const config = JSON.parse(call.arguments[0].getText(configSource));
  const b = x.profile.business;
  assert.deepEqual(config, {
    name: b.name, logo: b.logo, phone: b.phoneE164, email: b.email, address: b.address,
    directionsUrl: b.mapsUrl, mapEmbedUrl: b.mapsEmbedUrl,
    socialLinks: Object.entries(b.socialLinks).map(([label, href]) => ({ label, href })),
    contactPreview: false, hours: [b.hours], storageNamespace: x.profile.slug,
  });

  const inventory = JSON.parse(x.files.get('mobile/src/lib/dealer-inventory.json'));
  assert.equal(inventory.length, 1, 'only supplied inventory enters the generated feed');
  const [vehicle] = inventory, [supplied] = x.profile.listings;
  assert.equal(vehicle.id, supplied.id);
  assert.equal(vehicle.sample, false, 'supplied copy must bypass captured-fixture rewriting');
  assert.equal(vehicle.dealer, b.name);
  assert.deepEqual(vehicle.images, supplied.images);
  assert.equal(vehicle.attributes.description, supplied.description + '\n' + b.inventoryNotice);
  assert.ok(vehicle.attributes.description.length > 600, 'supplied long descriptions can expand');
  assert.equal(vehicle.attributes.source, supplied.sourceUrl);
  assert.equal(vehicle.attributes.observedAt, supplied.observedAt);
  assert.equal(vehicle.rating, 0);
  assert.equal(vehicle.reviews, 0);
  assert.equal(Object.hasOwn(vehicle, 'financeMonthly'), false);
  const catalog = parsed.get('mobile/src/lib/catalog.ts');
  const feed = initializer(catalog, 'vehicles');
  assert.ok(ts.isAsExpression(feed) && feed.expression.getText(catalog) === 'dealerInventory');

  const dealerSource = parsed.get('mobile/src/lib/dealers.ts');
  const dealers = JSON.parse(initializer(dealerSource, 'capturedDealers').getText(dealerSource));
  assert.deepEqual(Object.keys(dealers), [supplied.id]);
  assert.equal(dealers[supplied.id].address, b.address);
  assert.equal(dealers[supplied.id].openingHours, b.hours);
  assert.equal(dealers[supplied.id].logo, b.logo);
  assert.deepEqual(dealers[supplied.id].highlights, []);

  const cards = parsed.get('mobile/src/components/NativeDealerCards.tsx');
  const notes = nodes(cards, node => ts.isJsxElement(node) &&
    node.openingElement.tagName.getText(cards) === 'p' &&
    node.openingElement.attributes.properties.some(attribute => ts.isJsxSpreadAttribute(attribute) &&
      attribute.expression.getText(cards) === 'stylex.props(s.section, s.note)'));
  assert.equal(notes.length, 1, 'the dealer disclosure keeps its existing paragraph');
  const expressions = notes[0].children.filter(ts.isJsxExpression);
  assert.equal(expressions.length, 1);
  assert.ok(expressions[0].expression && ts.isStringLiteral(expressions[0].expression));
  assert.equal(expressions[0].expression.text, b.inventoryNotice, 'JSX displays the exact notice');
  assert.ok(result.contentPaths.includes('mobile/src/components/NativeDealerCards.tsx'));
  for (const asset of [b.logo, b.logoDark, ...supplied.images]) {
    assert.deepEqual(x.files.get('mobile/public' + asset),
      fs.readFileSync(path.join(x.client, asset.slice(1))), 'retained asset bytes are unchanged');
  }
}

for (const token of ['$&', '$`', "$'", '$$']) {
  test(`Mobile dealer configuration preserves literal ${JSON.stringify(token)}`, t => {
    const x = fixture(t), b = x.profile.business;
    b.name = `Motors ${token} "Авто"`;
    b.address = `Street ${token}\nUnit "2"`;
    b.hours = `Contact ${token} before visiting`;
    b.socialLinks = { [`Contact ${token}`]: 'https://example.test/contact' };
    verify(x);
  });
  test(`Mobile inventory disclosure preserves literal ${JSON.stringify(token)}`, t => {
    const x = fixture(t);
    x.profile.business.inventoryNotice = `Dated ${token} examples. "Confirm" availability.\nПример.`;
    x.profile.listings[0].description += ` Literal ${token} supplied copy.`;
    verify(x);
  });
}
