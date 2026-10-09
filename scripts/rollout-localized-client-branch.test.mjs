import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildLocalizedClient } from './rollout-localized-client.mjs';

test('localized packages preserve registered publication branches and canonical Cars package identities', () => {
  const source = fs.readFileSync(new URL('./rollout-localized-client.mjs', import.meta.url), 'utf8');
  assert.match(source, /manifest\.defaultBranch = oldManifest\.defaultBranch \|\| 'main';/);
  assert.match(source, /return validateManifest\(manifest, \{ allowLegacyPublishingReference: repository === 'darkapoparka\/cars' \}\);/);
  assert.match(source, /const oldManifest = validateManifest\(json\(dealerFile\), \{ allowLegacyPublishingReference: repository === 'darkapoparka\/cars' \}\);/);
});

test('localized package generation leaves an existing destination untouched', async () => {
  const area = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-rollout-output-guard-'));
  const source = path.join(area, 'source');
  const destination = path.join(area, 'package');
  fs.mkdirSync(source);
  fs.mkdirSync(destination);
  const marker = path.join(destination, 'keep.txt');
  fs.writeFileSync(marker, 'preserve existing package');

  try {
    await assert.rejects(
      buildLocalizedClient({ clientRoot: source, slug: 'guard-test', output: destination, repository: 'example/dealer' }),
      /Rollout output already exists/
    );
    assert.equal(fs.readFileSync(marker, 'utf8'), 'preserve existing package');

    await assert.rejects(
      buildLocalizedClient({ clientRoot: source, slug: 'guard-test', output: source, repository: 'example/dealer' }),
      /Rollout output already exists/
    );
    const child = path.join(source, 'child');
    fs.mkdirSync(child);
    await assert.rejects(
      buildLocalizedClient({ clientRoot: source, slug: 'guard-test', output: child, repository: 'example/dealer' }),
      /Rollout output already exists/
    );
  } finally {
    fs.rmSync(area, { recursive: true, force: true });
  }
});
