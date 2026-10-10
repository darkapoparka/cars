import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
await import('./prepare-domain-tests.mjs');
const tests = (await readdir('tests', { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.test.mjs'))
  .map((entry) => `tests/${entry.name}`)
  .sort();
if (!tests.length) throw new Error('No domain tests found');
const result = spawnSync(process.execPath, ['--test', ...process.argv.slice(2), ...tests], {
  cwd: root,
  stdio: 'inherit',
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
