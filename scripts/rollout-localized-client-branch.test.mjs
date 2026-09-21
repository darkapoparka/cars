import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('localized packages preserve registered publication branches and canonical Cars package identities', () => {
  const source = fs.readFileSync(new URL('./rollout-localized-client.mjs', import.meta.url), 'utf8');
  assert.match(source, /manifest\.defaultBranch = oldManifest\.defaultBranch \|\| 'main';/);
  assert.match(source, /return validateManifest\(manifest, \{ allowLegacyPublishingReference: repository === 'darkapoparka\/cars' \}\);/);
  assert.match(source, /const oldManifest = validateManifest\(json\(dealerFile\), \{ allowLegacyPublishingReference: repository === 'darkapoparka\/cars' \}\);/);
});
