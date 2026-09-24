import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fingerprint } from '../lib/workflow.mjs';
import { exportPinnedTemplate, exportPinnedTemplatePair, readPinnedTemplateTree, readRepositoryTreeMap } from './pinned-template-source.mjs';

function runGit(repo, args) {
  return execFileSync('git', ['-C', repo, ...args], {
    encoding: 'utf8',
    env: { ...process.env, GIT_AUTHOR_NAME: 'Cars Test', GIT_AUTHOR_EMAIL: 'cars-test@example.invalid', GIT_COMMITTER_NAME: 'Cars Test', GIT_COMMITTER_EMAIL: 'cars-test@example.invalid' }
  }).trim();
}

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
