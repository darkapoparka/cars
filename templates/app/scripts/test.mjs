import {spawnSync} from 'node:child_process';
import {readdirSync, rmSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'runtime/unit-tests');
function run(args) {
  const child = spawnSync(process.execPath, args, {cwd: root, stdio: 'inherit'});
  if (child.error) throw child.error;
  if (child.status !== 0) throw new Error('Regression checks failed (exit ' + child.status + ').');
}
try {
  rmSync(output, {recursive: true, force: true});
  run([require.resolve('typescript/bin/tsc'), '--project', 'tsconfig.tests.json']);
  const tests = readdirSync(path.join(output, 'tests'), {recursive: true}).filter(file => file.endsWith('.test.js')).map(file => path.join(output, 'tests', file));
  if (!tests.length) throw new Error('No regression tests found.');
  run(['--experimental-strip-types', '--test', ...tests, 'tests/architecture.test.mjs', 'scripts/test-reference-loan.mjs']);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  rmSync(output, {recursive: true, force: true});
}
