import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fingerprint, fingerprintCommit } from '../lib/workflow.mjs';
import { exportPinnedTemplate, exportPinnedTemplatePair, readPinnedTemplateTree, readRepositoryTreeMap, prefetchPinnedSourceBlobs } from './pinned-template-source.mjs';
import {appSourceRetainsPath} from '../publishing/app-source.mjs';

function runGit(repo, args) {
  return execFileSync('git', ['-C', repo, ...args], {
    encoding: 'utf8',
    env: { ...process.env, GIT_AUTHOR_NAME: 'Cars Test', GIT_AUTHOR_EMAIL: 'cars-test@example.invalid', GIT_COMMITTER_NAME: 'Cars Test', GIT_COMMITTER_EMAIL: 'cars-test@example.invalid' }
  }).trim();
}

const sourceCiEnv = { CARS_SOURCE_BATCH_PREFETCH: '1', GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'darkapoparka/cars', GITHUB_WORKFLOW: 'Existing dealer reviewed source proposals', GITHUB_REF: 'refs/heads/main', GITHUB_SHA: 'a'.repeat(40), GITHUB_RUN_ID: '123' };
function blobFetchFixture({ count = 2, present = 0, wrongOrigin = false, wrongHead = false, omitted = false, wrongType = false } = {}) {
  const entries = Array.from({ length: count }, (_, i) => ({ blob: (i + 1).toString(16).padStart(40, '0') }));
  const available = new Set(entries.slice(0, present).map(r => r.blob)), calls = [];
  const readGit = (_root, args, options = {}) => {
    calls.push({ args, options });
    if (args[0] === 'remote') return wrongOrigin ? 'https://example.invalid/untrusted.git' : 'https://github.com/darkapoparka/cars.git';
    if (args[0] === 'rev-parse') return wrongHead ? 'b'.repeat(40) : sourceCiEnv.GITHUB_SHA;
    if (args[0] === 'cat-file') {
      assert.equal(options.env.GIT_NO_LAZY_FETCH, '1');
      return options.input.trim().split('\n').map(id => available.has(id) ? id + ' ' + (wrongType ? 'commit' : 'blob') + ' 10' : id + ' missing').join('\n');
    }
    assert.deepEqual(args.slice(0, 4), ['-c', 'gc.auto=0', '-c', 'fetch.negotiationAlgorithm=noop']);
    assert.equal(args[4], 'fetch');
    assert.deepEqual(args.slice(5, 11), ['--no-tags', '--no-write-fetch-head', '--no-auto-maintenance', '--no-recurse-submodules', '--filter=blob:none', 'origin']);
    assert(args.length - 11 <= 256);
    assert.equal(options.env.GIT_TERMINAL_PROMPT, '0');
    if (!omitted) for (const id of args.slice(11)) available.add(id);
    return '';
  };
  return { entries, calls, readGit };
}
test('source prefetch is disabled for ordinary reads without any Git side effects', () => {
  const { entries, calls, readGit } = blobFetchFixture();
  assert.deepEqual(prefetchPinnedSourceBlobs({ repositoryPath: '/unused', entries, env: {}, readGit }), { enabled: false, fetched: 0, bytes: 0 });
  assert.equal(calls.length, 0);
});
test('source prefetch requires exact canonical main CI context and repository identity', () => {
  for (const override of [{ GITHUB_ACTIONS: 'false' }, { GITHUB_REF: 'refs/heads/other' }, { GITHUB_WORKFLOW: 'Unrelated job' }, { GITHUB_SHA: 'main' }, { GITHUB_RUN_ID: '0' }]) {
    const fixture = blobFetchFixture();
    assert.throws(() => prefetchPinnedSourceBlobs({ repositoryPath: '/unused', entries: fixture.entries, env: { ...sourceCiEnv, ...override }, readGit: fixture.readGit }), /restricted/);
    assert.equal(fixture.calls.length, 0);
  }
  for (const option of [{ wrongOrigin: true }, { wrongHead: true }]) {
    const fixture = blobFetchFixture(option);
    assert.throws(() => prefetchPinnedSourceBlobs({ repositoryPath: '/unused', entries: fixture.entries, env: sourceCiEnv, readGit: fixture.readGit }), /identity differs/);
    assert(!fixture.calls.some(c => c.args.includes('fetch')));
  }
});
test('source prefetch fetches only deduplicated missing blob IDs in bounded multi-want batches', () => {
  const fixture = blobFetchFixture({ count: 258, present: 1 });
  const result = prefetchPinnedSourceBlobs({ repositoryPath: '/unused', entries: [...fixture.entries, fixture.entries[0]], env: sourceCiEnv, readGit: fixture.readGit });
  assert.deepEqual(result, { enabled: true, fetched: 257, bytes: 2570 });
  const fetched = fixture.calls.filter(c => c.args.includes('fetch')).flatMap(c => c.args.slice(11));
  assert.deepEqual(fetched, fixture.entries.slice(1).map(r => r.blob));
  assert.equal(fixture.calls.filter(c => c.args.includes('fetch')).length, 2);
});
test('source prefetch never fetches when every requested blob is already local', () => {
  const fixture = blobFetchFixture({ present: 2 });
  assert.deepEqual(prefetchPinnedSourceBlobs({ repositoryPath: '/unused', entries: fixture.entries, env: sourceCiEnv, readGit: fixture.readGit }), { enabled: true, fetched: 0, bytes: 0 });
  assert(!fixture.calls.some(c => c.args.includes('fetch')));
});
test('source prefetch rejects malformed wants, wrong object types and an incomplete fetch without fallback', () => {
  const fixture = blobFetchFixture();
  assert.throws(() => prefetchPinnedSourceBlobs({ repositoryPath: '/unused', entries: [{ blob: '--all' }], env: sourceCiEnv, readGit: fixture.readGit }), /bounded exact Git IDs/);
  for (const option of [{ wrongType: true, present: 2 }, { omitted: true }]) {
    const f = blobFetchFixture(option);
    assert.throws(() => prefetchPinnedSourceBlobs({ repositoryPath: '/unused', entries: f.entries, env: sourceCiEnv, readGit: f.readGit }), /invalid blob|did not supply every/);
    assert(f.calls.filter(c => c.args.includes('fetch')).length <= 1);
  }
});

function templateRepo(t, key = 'auto-best') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-pinned-template-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const repo = path.join(root, 'master');
  fs.mkdirSync(repo);
  execFileSync('git', ['init', '--initial-branch=main', repo], { stdio: 'ignore' });
  runGit(repo, ['remote', 'add', 'origin', `https://github.com/darkapoparka/cars-template-${key}.git`]);
  fs.writeFileSync(path.join(repo, 'package.json'), '{"name":"template"}\n');
  fs.mkdirSync(path.join(repo, 'src'));
  fs.writeFileSync(path.join(repo, 'src/ui.ts'), 'export const title = "v1";\n');
  runGit(repo, ['add', '.']);
  runGit(repo, ['commit', '-m', 'old']);
  const from = runGit(repo, ['rev-parse', 'HEAD']);
  fs.writeFileSync(path.join(repo, 'src/ui.ts'), 'export const title = "v2";\n');
  runGit(repo, ['add', '.']);
  runGit(repo, ['commit', '-m', 'new']);
  const to = runGit(repo, ['rev-parse', 'HEAD']);
  const digest = fingerprint(repo).digest;
  return { root, repo, from, to, digest };
}

test('historical App runtime-only digest is checked against the exact pinned Git source', t=>{
  const fixture=templateRepo(t,'app');
  fs.mkdirSync(path.join(fixture.repo,'app'),{recursive:true});fs.writeFileSync(path.join(fixture.repo,'app/layout.tsx'),'export default "Pinned App";\n');
  fs.mkdirSync(path.join(fixture.repo,'public/reference-assets/catalog'),{recursive:true});fs.writeFileSync(path.join(fixture.repo,'public/reference-assets/catalog/capture.txt'),'Reference evidence excluded by the historical App collector');
  runGit(fixture.repo,['add','.']);runGit(fixture.repo,['commit','-m','App runtime source']);
  const revision=runGit(fixture.repo,['rev-parse','HEAD']),digest=fingerprint(fixture.repo,{filter:appSourceRetainsPath}).digest;
  assert.notEqual(digest,fingerprint(fixture.repo).digest);
  const source={repository:'darkapoparka/cars-template-app',revision,digest};
  const loaded=readPinnedTemplateTree({key:'app',repositoryPath:fixture.repo,source});
  assert.equal(loaded.digest,digest);assert.equal(loaded.tree.get('app/layout.tsx').toString(),'export default "Pinned App";\n');
  assert.throws(()=>readPinnedTemplateTree({key:'app',repositoryPath:fixture.repo,source:{...source,revision:fixture.from}}),/digest mismatch/);
});

test('pinned template exports use exact old/new commits and verify the approved target digest', t => {
  const fixture = templateRepo(t), runDirectory = path.join(fixture.root, 'runtime');
  const pinned = readPinnedTemplateTree({
    key: 'auto-best', repositoryPath: fixture.repo,
    source: {
      repository: 'darkapoparka/cars-template-auto-best',
      revision: fixture.to,
      digest: fixture.digest
    }
  });
  assert.equal(pinned.kind, 'standalone');
  assert.equal(pinned.tree.get('src/ui.ts').toString(), 'export const title = "v2";\n');
  const oldTree = readRepositoryTreeMap({ repositoryPath: fixture.repo, revision: fixture.from });
  const newTree = readRepositoryTreeMap({ repositoryPath: fixture.repo, revision: fixture.to, prefix: 'src' });
  assert.equal(oldTree.get('src/ui.ts').toString(), 'export const title = "v1";\n');
  assert.equal(newTree.get('ui.ts').toString(), 'export const title = "v2";\n');
  const pair = exportPinnedTemplatePair({
    key: 'auto-best',
    repositoryPath: fixture.repo,
    runDirectory,
    pin: {
      repository: 'darkapoparka/cars-template-auto-best',
      from: fixture.from,
      to: fixture.to,
      digest: fixture.digest
    }
  });
  assert.equal(pair.oldBase.revision, fixture.from);
  assert.equal(pair.newBase.revision, fixture.to);
  assert.equal(pair.newBase.digest, fixture.digest);
  assert.equal(fs.readFileSync(path.join(pair.oldBase.directory, 'src/ui.ts'), 'utf8'), 'export const title = "v1";\n');
  assert.equal(fs.readFileSync(path.join(pair.newBase.directory, 'src/ui.ts'), 'utf8'), 'export const title = "v2";\n');
});

test('pinned template export rejects a snapshot whose bytes do not match the approved digest', t => {
  const fixture = templateRepo(t), destination = path.join(fixture.root, 'runtime', 'bad-digest');
  assert.throws(() => exportPinnedTemplate({
    repositoryPath: fixture.repo,
    repository: 'darkapoparka/cars-template-auto-best',
    revision: fixture.to,
    destination,
    expectedDigest: 'd'.repeat(64)
  }), /digest mismatch/);
});

test('pinned template export rejects a destination junction that physically points into its source repo', t => {
  const fixture = templateRepo(t);
  const alias = path.join(fixture.root, 'outside-alias');
  fs.symlinkSync(fixture.repo, alias, 'junction');
  const requested = path.join(alias, 'review-export');
  assert.throws(() => exportPinnedTemplate({
    repositoryPath: fixture.repo,
    repository: 'darkapoparka/cars-template-auto-best',
    revision: fixture.to,
    destination: requested
  }), /outside its authoritative repository/);
  assert.equal(fs.existsSync(path.join(fixture.repo, 'review-export')), false);
});

test('pinned Cars monorepo source reads and verifies the exact template subtree', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-monorepo-template-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const repo = path.join(root, 'cars');
  fs.mkdirSync(path.join(repo, 'templates', 'modern'), { recursive: true });
  execFileSync('git', ['init', '--initial-branch=main', repo], { stdio: 'ignore' });
  runGit(repo, ['remote', 'add', 'origin', 'https://github.com/darkapoparka/cars.git']);
  fs.writeFileSync(path.join(repo, 'templates', 'modern', 'package.json'), '{"name":"modern"}\n');
  fs.mkdirSync(path.join(repo, 'templates', 'modern', 'apps', 'web'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'templates', 'modern', 'apps', 'web', 'page.tsx'), 'export default "Cars template";\n');
  fs.writeFileSync(path.join(repo, 'README.md'), 'This root file is outside the template subtree.\n');
  runGit(repo, ['add', '.']);
  runGit(repo, ['commit', '-m', 'Cars-owned Modern template']);
  const revision = runGit(repo, ['rev-parse', 'HEAD']);
  const digest = fingerprint(path.join(repo, 'templates', 'modern')).digest;

  const loaded = readPinnedTemplateTree({
    key: 'modern',
    repositoryPath: repo,
    source: { repository: 'darkapoparka/cars', revision, path: 'templates/modern', digest }
  });
  assert.equal(loaded.kind, 'cars-monorepo');
  assert.equal(loaded.revision, revision);
  assert.equal(loaded.digest, digest);
  assert.equal(loaded.files, 2);
  assert.equal(loaded.tree.get('package.json').toString(), '{"name":"modern"}\n');
  assert.equal(loaded.tree.has('README.md'), false);
  assert.throws(() => readPinnedTemplateTree({
    key: 'modern', repositoryPath: repo,
    source: { repository: 'darkapoparka/cars', revision, path: 'templates/import', digest }
  }), /source must be/);
  assert.throws(() => readPinnedTemplateTree({
    key: 'modern', repositoryPath: repo,
    source: { repository: 'darkapoparka/cars', revision, path: 'templates/modern', digest: '0'.repeat(64) }
  }), /digest mismatch/);
});

test('pinned template pair exports a standalone old base and a Cars monorepo target subtree', t => {
  const old = templateRepo(t, 'modern');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-pair-monorepo-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const carsRepo = path.join(root, 'cars');
  fs.mkdirSync(path.join(carsRepo, 'templates', 'modern', 'apps', 'web'), { recursive: true });
  execFileSync('git', ['init', '--initial-branch=main', carsRepo], { stdio: 'ignore' });
  runGit(carsRepo, ['remote', 'add', 'origin', 'https://github.com/darkapoparka/cars.git']);
  fs.writeFileSync(path.join(carsRepo, 'templates', 'modern', 'package.json'), '{"name":"modern-v3"}\n');
  fs.writeFileSync(path.join(carsRepo, 'templates', 'modern', 'apps', 'web', 'page.tsx'), 'export default "Cars v3";\n');
  fs.writeFileSync(path.join(carsRepo, 'README.md'), 'Outside the modern template subtree.\n');
  runGit(carsRepo, ['add', '.']);
  runGit(carsRepo, ['commit', '-m', 'Cars-owned Modern template']);
  const revision = runGit(carsRepo, ['rev-parse', 'HEAD']);
  const digest = fingerprint(path.join(carsRepo, 'templates', 'modern')).digest;
  const pair = exportPinnedTemplatePair({
    key: 'modern',
    runDirectory: path.join(root, 'runtime'),
    repositoryPaths: {
      'darkapoparka/cars-template-modern': old.repo,
      'darkapoparka/cars': carsRepo
    },
    pin: {
      repository: 'darkapoparka/cars',
      from: old.from,
      to: revision,
      digest,
      fromSource: { repository: 'darkapoparka/cars-template-modern', revision: old.from, path: '' },
      targetSource: { repository: 'darkapoparka/cars', revision, path: 'templates/modern', digest }
    }
  });
  assert.equal(pair.oldBase.repository, 'darkapoparka/cars-template-modern');
  assert.equal(pair.oldBase.path, '');
  assert.equal(fs.readFileSync(path.join(pair.oldBase.directory, 'src/ui.ts'), 'utf8'), 'export const title = "v1";\n');
  assert.equal(pair.newBase.repository, 'darkapoparka/cars');
  assert.equal(pair.newBase.path, 'templates/modern');
  assert.equal(pair.newBase.digest, digest);
  assert.equal(fs.readFileSync(path.join(pair.newBase.directory, 'package.json'), 'utf8'), '{"name":"modern-v3"}\n');
  assert.equal(fs.readFileSync(path.join(pair.newBase.directory, 'apps/web/page.tsx'), 'utf8'), 'export default "Cars v3";\n');
  assert.equal(fs.existsSync(path.join(pair.newBase.directory, 'README.md')), false);
});


test('selected Cars lock digest uses the canonical workflow fingerprint policy', () => {
  const carsRoot = path.resolve(import.meta.dirname, '../..');
  const lock = JSON.parse(fs.readFileSync(path.join(carsRoot, 'templates.lock.json'), 'utf8'));
  const selected = lock.templates['auto-best'];
  const result = readPinnedTemplateTree({
    key: 'auto-best', repositoryPath: carsRoot, source: selected.source, expectedDigest: selected.digest
  });
  assert.equal(result.digest, selected.digest);
  assert.equal(result.revision, selected.source.revision);
  assert.equal(result.path, 'templates/auto-best');
  assert.ok(result.files > 0);
});


test('batched reads preserve canonical Git ordering and text/binary normalization', t => {
  const fixture=templateRepo(t);
  fs.mkdirSync(path.join(fixture.repo,'many'));
  for(let index=0;index<530;index++)fs.writeFileSync(path.join(fixture.repo,'many',String(index).padStart(4,'0')+'.ts'),'export const value = '+index+';\r\n');
  fs.writeFileSync(path.join(fixture.repo,'many','binary.dat'),Buffer.from([0,13,10,255,10]));
  runGit(fixture.repo,['add','.']);runGit(fixture.repo,['commit','-m','batched canonical evidence']);
  const revision=runGit(fixture.repo,['rev-parse','HEAD']);
  const canonical=fingerprintCommit(fixture.repo,revision);
  const source={repository:'darkapoparka/cars-template-auto-best',revision,digest:canonical.digest};
  const loaded=readPinnedTemplateTree({key:'auto-best',repositoryPath:fixture.repo,source});
  assert.equal(loaded.digest,canonical.digest);assert.equal(loaded.files,canonical.files.length);
  assert.deepEqual(loaded.tree.get('many/binary.dat'),Buffer.from([0,13,10,255,10]));
});
