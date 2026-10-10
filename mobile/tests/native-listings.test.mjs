import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { capturedVehicles as vehicles } from '../.qa/domain/catalog.mjs';
const byId = (id) => vehicles.find((v) => v.id === id);
test('all four captured vehicle galleries contain the observed complete photo sets', () => {
  const counts = { 'bmw-x6': 20, 'bmw-540': 32, 'bmw-x3': 16, 'bmw-120': 4 };
  for (const [id, count] of Object.entries(counts)) {
    const v = byId(id);
    assert.equal(v.images.length, count, id);
    const hashes = v.images.map((src) =>
      createHash('sha256')
        .update(fs.readFileSync('public' + src))
        .digest('hex'),
    );
    assert.equal(new Set(hashes).size, count, id + ' duplicate photographs');
  }
});
test('live 540 registration owners financing and delivery replace legacy placeholders', () => {
  const v = byId('bmw-540');
  assert.equal(v.registration, '11/2024');
  assert.equal(v.attributes.owners, '2');
  assert.equal(v.financeMonthly, 448);
  assert.equal(v.monthly, undefined);
  assert.equal(v.deliveryPossible, true);
  assert.equal(v.color, 'Grey');
  assert.equal(v.rating, 4);
  assert.equal(v.reviews, 325);
});
test('native X3 dealer and new-vehicle facts are retained', () => {
  const v = byId('bmw-x3');
  assert.equal(v.dealer, 'Hakvoort GmbH');
  assert.equal(v.year, 2025);
  assert.equal(v.attributes.owners, '0');
  assert.equal(v.rating, 4.6);
  assert.equal(v.reviews, 107);
  assert.equal(v.financeMonthly, 612);
  assert.equal(v.monthly, undefined);
});
test('120 lease quote retains purchase amount and separate finance amount', () => {
  const v = byId('bmw-120');
  assert.equal(v.price, 27777);
  assert.equal(v.monthly, 199);
  assert.equal(v.financeMonthly, 295);
  assert.deepEqual(v.leaseTerms, {
    months: 24,
    annualMileage: 5000,
    customer: 'Private',
    deposit: 0,
  });
  assert.equal(v.dealer, 'May & Olde GmbH');
  assert.equal(v.location, '22926 Ahrensburg');
});
test('captured technical tables have valid unique label/value tuples', () => {
  for (const v of vehicles) {
    assert.ok(v.technicalData.length >= 26);
    assert.equal(new Set(v.technicalData.map((r) => r[0])).size, v.technicalData.length);
    for (const row of v.technicalData) {
      assert.equal(row.length, 2);
      assert.ok(
        row.every((x) => typeof x === 'string' && x.trim().length > 0),
        v.id + JSON.stringify(row),
      );
    }
  }
});
test('captured equipment sets remain complete and contain no duplicate rows', () => {
  const counts = { 'bmw-x6': 70, 'bmw-540': 70, 'bmw-x3': 65, 'bmw-120': 17 };
  for (const [id, count] of Object.entries(counts)) {
    const features = byId(id).features;
    assert.equal(features.length, count);
    assert.equal(new Set(features).size, count);
  }
});
test('captured German descriptions are real content rather than repeated titles', () => {
  for (const id of ['bmw-540', 'bmw-120']) {
    const v = byId(id);
    assert.ok(v.attributes.description.length > 1000);
    assert.match(v.attributes.description, /Weitere Ausstattungen/);
  }
});
