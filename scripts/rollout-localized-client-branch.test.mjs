import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('localized packages preserve the registered publication branch', () => {
  const source = fs.readFileSync(new URL('./rollout-localized-client.mjs', import.meta.url), 'utf8');
  assert.match(source, /manifest\.defaultBranch = oldManifest\.defaultBranch \|\| 'main';/);
});
