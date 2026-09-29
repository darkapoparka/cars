import {readFile, writeFile, mkdir, readdir, stat, open} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';

const root = 'reference/2026-09-26-polish/tests';
await mkdir(root, {recursive: true});
const buildId = (await readFile('.next/BUILD_ID', 'utf8')).trim();
const buildTime = (await stat('.next/BUILD_ID')).mtimeMs;
async function filesIn(directory) {
  const files = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await filesIn(file));
    else if (/\.(tsx?|css|json)$/.test(file)) files.push(file);
  }
  return files;
}
async function sourceHashes() {
  const files = [...(await Promise.all(['app', 'components', 'lib'].map(filesIn))).flat(), 'package.json', 'next.config.js', 'babel.config.js'];
  return Promise.all(files.sort().map(async file => ({path: file, sha256: createHash('sha256').update(await readFile(file)).digest('hex')})));
}
for (const file of (await Promise.all(['app', 'components', 'lib'].map(filesIn))).flat()) {
  if ((await stat(file)).mtimeMs > buildTime) throw Error(`Source newer than preview build: ${file}`);
}
const before = await sourceHashes();
await writeFile(`${root}/source-before.json`, JSON.stringify({buildId, startedAt: new Date().toISOString(), sourceHashes: before}, null, 2));
const results = [];
async function run(name, command, args) {
  const log = await open(`${root}/${name}.log`, 'w');
  const env = {...process.env, PATH: `${path.dirname(process.execPath)};${process.env.PATH}`, QA_REPORT_DIR: `${root}/${name}`};
  console.log(`START ${name}`);
  const exit = await new Promise((resolve, reject) => {
    const child = spawn(command, args, {cwd: process.cwd(), env, stdio: ['ignore', log.fd, log.fd], windowsHide: true});
    child.once('error', reject); child.once('exit', code => resolve(code ?? 1));
  }).finally(() => log.close());
  results.push({name, exit});
  console.log(`EXIT ${name} ${exit}`);
}
await run('lint-types', 'cmd.exe', ['/d', '/c', 'npm.cmd run lint && npm.cmd run typecheck']);
await run('regression', process.execPath, ['scripts/verify-continuation.mjs']);
await run('new-flows', process.execPath, ['scripts/verify-final-pass.mjs']);
await run('vehicle-coverage', process.execPath, ['scripts/verify-captured-detail-coverage.mjs']);
await run('gestures', process.execPath, ['scripts/verify-photo-gestures.mjs']);
await run('loan', process.execPath, ['--experimental-strip-types', '--test', 'scripts/test-reference-loan.mjs']);
const after = await sourceHashes();
if (JSON.stringify(before) !== JSON.stringify(after)) throw Error('Application source changed during verification');
if ((await readFile('.next/BUILD_ID', 'utf8')).trim() !== buildId) throw Error('Preview build changed during verification');
const summary = {createdAt: new Date().toISOString(), buildId, sourceUnchanged: true, results, sourceHashes: after};
await writeFile(`${root}/run.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify({buildId, sourceUnchanged: true, results}));
process.exitCode = results.some(result => result.exit !== 0) ? 1 : 0;
