import test from 'node:test';
import assert from 'node:assert/strict';
import { validateWorkspaceMap } from './lib/workspace-map.mjs';

function fixture() {
  const repositories = [
    { key: 'cars', path: '.', repository: 'darkapoparka/cars', role: 'integration' },
    { key: 'admin', path: '../cars-admin', repository: 'darkapoparka/cars-admin', role: 'admin-demo' },
  ];
  return {
    config: { schemaVersion: 2, workingBranch: 'main', repositories,
      templates: ['auto-best', 'modern', 'carwow', 'import'].map(key => ({
        key, path: 'templates/' + key, repository: 'darkapoparka/cars', role: 'template-master',
      })),
      scratch: 'runtime/', registry: 'docs/DEPLOYMENT-INVENTORY.json' },
    editor: { folders: repositories.map(({ path }) => ({ path })) },
  };
}

test('four templates share Cars Git ownership through one editor root', () => {
  const f = fixture();
  assert.deepEqual(validateWorkspaceMap(f.config, f.editor),
    { repositories: 2, templates: 4, workingBranch: 'main', editorMatches: true });
});

test('rejects external masters, duplicate templates and a second editor master', () => {
  for (const change of [
    f => { f.config.templates[0].path = '../template-repos/cars-template-auto-best'; },
    f => { f.config.templates[0].repository = 'darkapoparka/cars-template-auto-best'; },
    f => { f.config.templates[0] = f.config.templates[1]; },
    f => { f.editor.folders.push({ path: '../template-repos/cars-template-carwow' }); },
    f => { f.config.templates[0].path = 'J:/cars/templates/auto-best'; },
  ]) {
    const f = fixture(); change(f);
    assert.throws(() => validateWorkspaceMap(f.config, f.editor));
  }
});
