// Templates share Cars Git ownership; only real repositories get editor roots.
import path from 'node:path';

export function validateWorkspaceMap(config, editor) {
  if (config?.schemaVersion !== 2 || config.workingBranch !== 'main') {
    throw new Error('Expected workspace schemaVersion 2 and workingBranch main.');
  }
  const expected = new Map([
    ['cars', ['darkapoparka/cars', 'integration']],
    ['admin', ['darkapoparka/cars-admin', 'admin-demo']],
  ]);
  if (!Array.isArray(config.repositories) || config.repositories.length !== expected.size) {
    throw new Error('Expected Cars and shared Admin repositories; templates belong inside Cars.');
  }
  const normalize = value => {
    if (typeof value !== 'string' || !value || path.win32.isAbsolute(value) || path.posix.isAbsolute(value)) {
      throw new Error('Workspace paths must be relative.');
    }
    return path.posix.normalize(value.replaceAll('\\', '/'));
  };
  const keys = new Set();
  const roots = config.repositories.map(item => {
    const identity = expected.get(item.key);
    if (!identity || keys.has(item.key) || item.repository !== identity[0] || item.role !== identity[1]) {
      throw new Error('Duplicate or incorrect repository identity: ' + item.key);
    }
    keys.add(item.key);
    const directory = normalize(item.path);
    const canonical = item.key === 'cars' ? '.' : '../cars-admin';
    if (directory !== canonical) throw new Error('Noncanonical workspace path: ' + item.key);
    return directory;
  });
  const templateKeys = new Set(['auto-best', 'modern', 'carwow', 'import']);
  if (!Array.isArray(config.templates) || config.templates.length !== templateKeys.size) {
    throw new Error('Expected four editable templates inside Cars.');
  }
  for (const item of config.templates) {
    if (!templateKeys.delete(item.key) || item.repository !== 'darkapoparka/cars' ||
        item.role !== 'template-master' || normalize(item.path) !== 'templates/' + item.key) {
      throw new Error('Invalid Cars template source: ' + item.key);
    }
  }
  const folders = editor?.folders?.map(folder => normalize(folder.path));
  if (!folders || JSON.stringify([...folders].sort()) !== JSON.stringify([...roots].sort())) {
    throw new Error('Cars.code-workspace and workspace.json identify different folders.');
  }
  if (config.scratch !== 'runtime/' || config.registry !== 'docs/DEPLOYMENT-INVENTORY.json') {
    throw new Error('Scratch and registry must use the canonical Cars locations.');
  }
  return { repositories: roots.length, templates: config.templates.length, workingBranch: 'main', editorMatches: true };
}
