import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Read-only contract tests. These tests do not edit or execute a workflow.
const workflow = fs.readFileSync(new URL('../.github/workflows/publish-champion-package.yml', import.meta.url), 'utf8');
const allowed = 'clients/champion-auto-pro/**';
const assertAllowedPaths = paths => assert.deepEqual(paths, [allowed]);

test('automatic publication stays dealer-specific and manual publication remains available', () => {
  assert.match(workflow, /^  workflow_dispatch:/m);
  const push = workflow.split('  push:\n')[1]?.split('  workflow_dispatch:')[0];
  assert.ok(push);
  const paths = push.split('    paths:\n')[1]?.split('\n').map(line => line.trim()).filter(line => line.startsWith('- ')).map(line => line.slice(2));
  assertAllowedPaths(paths);
});

for (const paths of [[], ['clients/**'], [allowed, 'scripts/package-dealer.mjs'], [allowed, 'catalog.json'], [allowed, 'templates.lock.json'], [allowed, '.github/workflows/publish-champion-package.yml']]) {
  test('shared or unscoped publication paths are rejected: ' + JSON.stringify(paths), () => {
    assert.throws(() => assertAllowedPaths(paths));
  });
}
