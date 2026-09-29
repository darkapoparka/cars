import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Read-only contract test. This test does not edit or execute the workflow.
const workflow = fs.readFileSync(new URL('../.github/workflows/publish-champion-package.yml', import.meta.url), 'utf8');
const normalized = workflow.replace(/\r\n/g, '\n');

test('dealer publication is manual-only and scoped to Champion Auto Pro', () => {
  const triggerLines = normalized.split('\n');
  assert.ok(triggerLines.includes('  workflow_dispatch:'));
  assert.equal(triggerLines.includes('  push:'), false);

  const sparseCheckout = normalized
    .split('          sparse-checkout: |\n')[1]
    ?.split('\n\n      - name: Build deterministic package')[0];
  assert.ok(sparseCheckout);

  const entries = sparseCheckout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  assert.ok(entries.includes('clients/champion-auto-pro'));
  assert.equal(entries.filter((entry) => entry.startsWith('clients/')).length, 1);
  assert.equal(sparseCheckout.includes('clients/**'), false);
});
