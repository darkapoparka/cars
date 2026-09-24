import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { approveCarsTemplate } from './template-release.mjs';
import { fingerprintCommit, git, POLICY, writeJson } from './lib/workflow.mjs';

function fixture(t, { native = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-source-approval-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const prefix = 'templates/auto-best';
  fs.mkdirSync(path.join(root, prefix), { recursive: true });
  fs.writeFileSync(path.join(root, prefix, 'package.json'), '{"name":"fixture"}\n');
  if (native) {
    fs.mkdirSync(path.join(root, prefix, 'src/lib/locale'), { recursive: true });
    fs.writeFileSync(path.join(root, prefix, 'src/lib/locale/core.ts'), 'export const locales = ["en", "bg"];\n');
  }
  git(root, ['init', '-b', 'main']);
  git(root, ['config', 'user.name', 'Cars fixture']);
  git(root, ['config', 'user.email', 'fixture@example.invalid']);
  git(root, ['remote', 'add', 'origin', 'https://github.com/darkapoparka/cars.git']);
  git(root, ['add', 'templates']);
  git(root, ['commit', '-m', 'template']);
  const commit = git(root, ['rev-parse', 'HEAD']);
  git(root, ['update-ref', 'refs/remotes/origin/main', commit]);
  const lockFile = path.join(root, 'templates.lock.json');
  writeJson(lockFile, { templates: { 'auto-best': {
    status: 'approved', repository: 'darkapoparka/cars-template-auto-best', commit: 'a'.repeat(40),
    snapshotPath: prefix, digest: 'b'.repeat(64), exportPolicy: POLICY,
    qa: { evidence: 'docs/releases/previous.json' }
  } } });
  const evidence = path.join(root, 'docs/releases/current.json');
  const qa = { repository: 'darkapoparka/cars', commit, sourcePath: prefix,
    sourceTree: git(root, ['rev-parse', `${commit}:${prefix}`]),
    sourceDigest: fingerprintCommit(root, commit, { prefix }).digest,
    approved: true, verifiedAt: '2026-09-24T18:00:00Z', runtime: { node: '24' },
    checks: [{ name: 'application', status: 'passed' }], standalone: { mobile: true, desktop: true } };
  writeJson(evidence, qa);
  return { root, commit, evidence, qa, lockFile, prefix };
}

test('source approval updates only the lock and retains standalone provenance', t => {
  const f = fixture(t), before = fs.readFileSync(f.lockFile);
  const options = { root: f.root, key: 'auto-best', commit: f.commit, evidence: f.evidence };
  assert.equal(approveCarsTemplate(options).ready, true);
  assert.deepEqual(fs.readFileSync(f.lockFile), before);
  const result = approveCarsTemplate({ ...options, write: true });
  assert.equal(result.release.source.revision, f.commit);
  assert.equal(result.release.legacySource.revision, 'a'.repeat(40));
  assert.equal(result.release.legacySource.evidence, 'docs/releases/previous.json');
  assert.equal(git(f.root, ['diff', '--name-only', '--', f.prefix]), '');
  assert.equal(fs.existsSync(path.join(f.root, 'runtime')), false);
  assert.deepEqual(approveCarsTemplate({ ...options, write: true }).release.legacySource, result.release.legacySource);
});

test('source approval rejects mismatched or failed evidence without changing the lock', t => {
  const f = fixture(t), before = fs.readFileSync(f.lockFile);
  for (const bad of [{ commit: 'f'.repeat(40) }, { sourceTree: 'f'.repeat(40) },
    { sourceDigest: 'f'.repeat(64) }, { sourcePath: 'templates/carwow' },
    { checks: [{ name: 'application', status: 'failed' }] }, { standalone: { desktop: true } }]) {
    writeJson(f.evidence, { ...f.qa, ...bad });
    assert.throws(() => approveCarsTemplate({ root: f.root, key: 'auto-best', commit: f.commit,
      evidence: f.evidence, write: true }), /Evidence must bind/);
    assert.deepEqual(fs.readFileSync(f.lockFile), before);
  }
});

test('native source stays held when its acceptance is missing or belongs to a standalone release', t => {
  const f = fixture(t, { native: true }), before = fs.readFileSync(f.lockFile);
  for (const nativeLocalization of [undefined, { schemaVersion: 1, adapter: 'native-v1',
    repository: 'darkapoparka/cars-template-auto-best', commit: 'a'.repeat(40) }]) {
    writeJson(f.evidence, { ...f.qa, nativeLocalization });
    assert.throws(() => approveCarsTemplate({ root: f.root, key: 'auto-best', commit: f.commit,
      evidence: f.evidence, write: true }), /exact-commit native acceptance/);
    assert.deepEqual(fs.readFileSync(f.lockFile), before);
  }
});

test('unpublished source is not selectable as a dealer release', t => {
  const f = fixture(t);
  git(f.root, ['update-ref', '-d', 'refs/remotes/origin/main']);
  assert.throws(() => approveCarsTemplate({ root: f.root, key: 'auto-best', commit: f.commit }), /not published/);
});
