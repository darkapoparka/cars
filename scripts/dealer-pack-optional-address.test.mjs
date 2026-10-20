import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {adaptPackOptionalAddress, DEALER_PACK_ADDRESS_SCHEMA_PATH} from './lib/dealer-pack-optional-address.mjs';
import {prepareModernOptionalPhoneSchema} from './publishing/dealer-contact-fallback.mjs';
import {refreshNormalizeInternals} from './lib/client-refresh-normalize.mjs';
import {dealerLocalizedCopy} from './lib/dealer-localized-copy.mjs';

const require = createRequire(process.env.CARS_ESBUILD_RESOLVE_FROM || new URL('../templates/modern/package.json', import.meta.url));
const typescript = require('typescript');
const originalSchema = fs.readFileSync(new URL('../templates/modern/packages/marketplace-domain/site-config.ts', import.meta.url), 'utf8');
const leadPath = 'modern/packages/marketplace/lead-site.ts';
const profile = (countryCode = 'AE', address = '') => ({factPolicy: 'dealer-pack-optional-v1', business: {countryCode, address}});
const sourceMap = (schema = originalSchema, address = '') => new Map([
  [DEALER_PACK_ADDRESS_SCHEMA_PATH, Buffer.from(schema)],
  [leadPath, Buffer.from('export const leadSite = {\n  address: ' + JSON.stringify(address) + ',\n};\n')],
  ['business-facts.json', Buffer.from(JSON.stringify({business: {address, city: 'Sourced City'}}))],
]);
function contactSchema(source) {
  const exports = {};
  const compiled = typescript.transpileModule(source, {compilerOptions: {module: typescript.ModuleKind.CommonJS, target: typescript.ScriptTarget.ES2022}}).outputText;
  new Function('require', 'exports', compiled)(require, exports);
  return exports.publicSiteSchema.shape.contact;
}
const contact = address => ({address, city: 'Sourced City', phoneDisplay: '+971 50 555 0123', phoneHref: 'tel:+971505550123', contactUrl: 'tel:+971505550123', email: '', mapsUrl: 'https://maps.google.com/?q=Sourced+City', mapsEmbedUrl: 'https://maps.google.com/?q=Sourced+City&output=embed', socialLinks: {}});

test('the actual Modern address schema accepts an unpublished street only in explicit pack output', () => {
  const legacy = contactSchema(originalSchema);
  assert.equal(legacy.safeParse(contact('')).success, false);
  for (const country of ['GB', 'AE', 'US']) {
    const files = sourceMap(), facts = files.get('business-facts.json'), lead = files.get(leadPath), input = profile(country), before = structuredClone(input);
    assert.deepEqual(adaptPackOptionalAddress(files, input), [DEALER_PACK_ADDRESS_SCHEMA_PATH]);
    const schema = contactSchema(String(files.get(DEALER_PACK_ADDRESS_SCHEMA_PATH)));
    assert.equal(schema.safeParse(contact('')).success, true);
    assert.equal(schema.safeParse(contact('Published showroom address')).success, true);
    for (const invalid of [null, 123, ' ', 'x'.repeat(301)]) assert.equal(schema.safeParse(contact(invalid)).success, false);
    for (const changed of [{city: ''}, {phoneHref: 'tel:0505550123'}, {mapsUrl: 'http://maps.example/'}]) assert.equal(schema.safeParse({...contact(''), ...changed}).success, false);
    assert.equal(files.get('business-facts.json'), facts); assert.equal(files.get(leadPath), lead); assert.deepEqual(input, before);
    assert.equal(String(files.get(DEALER_PACK_ADDRESS_SCHEMA_PATH)).replace('address: z.union([z.string().trim().min(1).max(300), z.literal("")]),', 'address: z.string().trim().min(1).max(300),'), originalSchema);
  }
});

test('sourced addresses and legacy policies preserve every source byte', () => {
  for (const input of [profile('AE', 'Published address'), {...profile(), factPolicy: undefined}]) {
    const files = sourceMap(), before = new Map(files);
    assert.deepEqual(adaptPackOptionalAddress(files, input), []); assert.deepEqual(files, before);
  }
});

test('address preparation composes with the maintained absent-phone schema exactly once', () => {
  const prepared = prepareModernOptionalPhoneSchema(originalSchema, {address: ''}).source, files = sourceMap(prepared), before = new Map(files);
  assert.deepEqual(adaptPackOptionalAddress(files, profile()), []); assert.deepEqual(files, before);
  assert.equal(contactSchema(prepared).safeParse({...contact(''), phoneDisplay: '', phoneHref: '', contactUrl: 'https://preview.example/variant-2/en/contact'}).success, true);
});

test('a changed schema or factual street fails before any generated file changes', () => {
  for (const files of [sourceMap(originalSchema.replace('address: z.string().trim().min(1).max(300),', 'address: z.any(),')), sourceMap(originalSchema, 'Unreviewed replacement'), sourceMap(originalSchema.replace('      address:', '      address: z.string(),\n      address:'))]) {
    const before = new Map(files);
    assert.throws(() => adaptPackOptionalAddress(files, profile()), /address.*(boundary|fact)/); assert.deepEqual(files, before);
  }
});

test('a sourced city may be displayed without becoming a factual street address', () => {
  const facts = {business: {name: 'Public Motors', countryCode: 'AE', city: 'Sharjah', address: '', phone: '', observedAt: '2026-10-19'}}, before = structuredClone(facts);
  const business = refreshNormalizeInternals.normalizeBusiness('/unused', 'public-motors', facts), copy = dealerLocalizedCopy({business});
  assert.equal(business.address, ''); assert.equal(business.addressLine, ''); assert.deepEqual(facts, before);
  assert.match(JSON.stringify(copy), /Sharjah/); assert.doesNotMatch(business.mapsUrl, /undefined|null/);
});
