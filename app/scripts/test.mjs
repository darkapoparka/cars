import {spawnSync} from 'node:child_process';
import {existsSync, lstatSync, realpathSync, readdirSync, rmSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, 'runtime/unit-tests');
function removeOutput() {
  if (!existsSync(output)) return;
  if (lstatSync(output).isSymbolicLink() || path.relative(realpathSync(root), realpathSync(output)) !== path.join('runtime', 'unit-tests')) {
    throw new Error('Refusing to remove test output outside the exact canonical runtime/unit-tests directory.');
  }
  rmSync(output, {recursive: true, force: true});
}
function run(args) {
  const child = spawnSync(process.execPath, args, {cwd: root, stdio: 'inherit'});
  if (child.error) throw child.error;
  if (child.status !== 0) throw new Error('Regression checks failed (exit ' + child.status + ').');
}
try {
  removeOutput();
  run([require.resolve('typescript/bin/tsc'), '--project', 'tsconfig.tests.json']);
  const tests = readdirSync(path.join(output, 'tests'), {recursive: true}).filter(file => file.endsWith('.test.js')).map(file => path.join(output, 'tests', file));
  if (!tests.length) throw new Error('No regression tests found.');
  run(['--experimental-strip-types', '--test', ...tests, 'tests/architecture.test.mjs', 'scripts/test-reference-loan.mjs']);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  removeOutput();
}
