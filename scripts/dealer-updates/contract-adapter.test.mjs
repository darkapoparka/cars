import assert from 'node:assert/strict';
import test from 'node:test';
import { contractForTemplate, DEALER_CONTENT_CONTRACT_VERSION } from './dealer-content-contract.mjs';

test('every design maps identity, inventory and localized content to typed modules', () => {
  for (const key of ['auto-best', 'modern', 'carwow', 'import']) {
    const contract = contractForTemplate(key);
    assert.match(contract.identity.path, /\.(?:ts|tsx)$/);
    assert.match(contract.inventory.path, /\.(?:ts|json)$/);
    assert.ok(Object.values(contract.locale).some(value => typeof value === 'string' || typeof value?.path === 'string'));
    assert.equal(typeof contract.facts, 'string');
    assert.equal(typeof contract.stock, 'string');
    assert.equal(DEALER_CONTENT_CONTRACT_VERSION, 1);
  }
});
