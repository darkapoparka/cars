import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Cars commits must not automatically publish dealer mirrors. The dealer's
// own Git-to-Vercel connection remains its single deployment trigger.
const directory = new URL('../.github/workflows/', import.meta.url);
const publishers = [
  'build-isauto-varna.yml', 'deploy-localized-fleet.yml',
  'fix-isauto-modern-logo-contrast.yml', 'generate-navara-localized-package.yml',
  'localize-isauto-varna.yml', 'patch-isauto-repair-script.yml',
  'patch-isauto-social-normalizer.yml', 'patch-refresh-css-boundary.yml',
  'promote-localization-boundaries.yml', 'publish-champion-package.yml',
  'wire-isauto-logo-contrast-guard.yml',
];

for (const name of publishers) {
  test(`${name} requires an explicit manual publishing run`, () => {
    const workflow = fs.readFileSync(new URL(name, directory), 'utf8');
    assert.match(workflow, /^  workflow_dispatch:/m);
    assert.doesNotMatch(workflow, /^  (?:push|pull_request|pull_request_target|schedule|workflow_run):/m);
    assert.match(workflow, /^jobs:/m);
  });
}
