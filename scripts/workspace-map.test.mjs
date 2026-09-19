import test from 'node:test';
import assert from 'node:assert/strict';
import { validateWorkspaceMap } from './lib/workspace-map.mjs';

function fixture() {
  const repositories = [
    { key: 'cars', path: '.', repository: 'darkapoparka/cars', role: 'integration' },
    ...['auto-best', 'modern', 'carwow', 'import'].map(key => ({
      key, path: '../template-repos/cars-template-' + key,
      repository: 'darkapoparka/cars-template-' + key, role: 'template-master',
    })),
    { key: 'admin', path: '../cars-admin', repository: 'darkapoparka/cars-admin', role: 'admin-demo' },
  ];
  return {
    config: { schemaVersion: 1, workingBranch: 'main', repositories,
      scratch: 'runtime/', registry: 'docs/DEPLOYMENT-INVENTORY.json' },
    editor: { folders: repositories.map(({ path }) => ({ path })) },
  };
}

test('the canonical six-repository workspace has one matching editor map', () => {
  const f = fixture();
  assert.deepEqual(validateWorkspaceMap(f.config, f.editor),
    { repositories: 6, workingBranch: 'main', editorMatches: true });
});
