import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {capturedRelatedVehicles} from '../lib/captured-related';
import {selectSimilarVehicles} from '../lib/similar-vehicles';

const fortuner = '2024-toyota-fortuner-exr';

describe('similar vehicle inventory ownership', () => {
  it('retains the archived Fortuner comparison only in template mode', () => {
    assert.strictEqual(selectSimilarVehicles(fortuner, [], 'template'), capturedRelatedVehicles);
  });

  it('uses the supplied recommendations for other template vehicles', () => {
    const related = [capturedRelatedVehicles[1]];
    assert.strictEqual(selectSimilarVehicles('another-car', related, 'template'), related);
  });

  it('never falls back to archived cars for a dealer with the same Fortuner slug', () => {
    const related = [{...capturedRelatedVehicles[0], slug: 'dealer-owned-car'}];
    assert.strictEqual(selectSimilarVehicles(fortuner, related, 'dealer'), related);
    assert.deepEqual(selectSimilarVehicles(fortuner, [], 'dealer'), []);
  });

  it('preserves exact dealer mileage and immutable source records', () => {
    const car = Object.freeze({...capturedRelatedVehicles[0], slug: 'dealer-owned-car', mileage: 85999});
    const related = Object.freeze([car]);
    const source = JSON.stringify(related);
    const selected = selectSimilarVehicles(fortuner, related, 'dealer');
    assert.strictEqual(selected, related);
    assert.strictEqual(selected[0], car);
    assert.equal(selected[0].mileage, 85999);
    assert.equal(JSON.stringify(related), source);
  });
});
