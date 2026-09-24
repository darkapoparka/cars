import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { nativeFixture } from './test-fixtures/native-source.mjs';
import { assertNativeAdoption, sealNativeAdoption } from './lib/native-localization.mjs';
import { fingerprint, fingerprintCommit, git, POLICY, writeJson } from './lib/workflow.mjs';
import { materializeTemplateSource } from './lib/template-source.mjs';
import { releaseStatus, selectedTemplateSource, templateDevelopmentState, verifyTemplate } from './template-release.mjs';

function temp(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-template-source-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

test('Cars lock validates the exact subtree commit, tree and normalized source digest', t => {
  const root = temp(t), template = path.join(root, 'templates/auto-best');
  fs.mkdirSync(template, { recursive: true });
  fs.writeFileSync(path.join(template, 'src.ts'), 'export const source = true;\n');
  git(root, ['init', '-b', 'main']);
  git(root, ['config', 'user.name', 'Cars template fixture']);
  git(root, ['config', 'user.email', 'fixture@example.invalid']);
  git(root, ['add', 'templates/auto-best']);
  git(root, ['commit', '-m', 'fixture template source']);
  const revision = git(root, ['rev-parse', 'HEAD']);
  const digest = fingerprintCommit(root, revision, { prefix: 'templates/auto-best' }).digest;
  const source = { repository: 'darkapoparka/cars', revision, path: 'templates/auto-best',
    tree: git(root, ['rev-parse', `${revision}:templates/auto-best`]), digest };
  writeJson(path.join(root, 'templates.lock.json'), { templates: { 'auto-best': {
    status: 'approved', repository: source.repository, commit: revision, snapshotPath: source.path,
    exportPolicy: POLICY, digest, source
  } } });

  const release = verifyTemplate(root, 'auto-best');
  assert.deepEqual(selectedTemplateSource(release), source);
  fs.writeFileSync(path.join(template, 'src.ts'), 'export const source = false;\n');
  assert.deepEqual(selectedTemplateSource(verifyTemplate(root, 'auto-best')), source);
  assert.equal(releaseStatus(root)[0].working, 'development-changes');
  const laterHead = 'f'.repeat(40);
  assert.equal(templateDevelopmentState(root, 'auto-best', release, laterHead, { readGit: () => source.tree }).updateAvailable, false);
  assert.equal(templateDevelopmentState(root, 'auto-best', release, laterHead, { readGit: () => 'e'.repeat(40) }).updateAvailable, true);
});

test('Cars source materialization exports the approved commit rather than development edits', async t => {
  const root = temp(t), template = path.join(root, 'templates/auto-best');
  fs.mkdirSync(template, { recursive: true }); fs.writeFileSync(path.join(template, 'source.txt'), 'approved\n');
  git(root, ['init', '-b', 'main']); git(root, ['config', 'user.name', 'Fixture']); git(root, ['config', 'user.email', 'fixture@example.invalid']);
  git(root, ['add', 'templates']); git(root, ['commit', '-m', 'approved']);
  const revision = git(root, ['rev-parse', 'HEAD']), pathName = 'templates/auto-best';
  const source = { repository: 'darkapoparka/cars', revision, path: pathName, tree: git(root, ['rev-parse', `${revision}:${pathName}`]), digest: fingerprintCommit(root, revision, { prefix: pathName }).digest };
  const release = { repository: source.repository, commit: revision, snapshotPath: pathName, digest: source.digest, exportPolicy: POLICY, source };
  fs.writeFileSync(path.join(template, 'source.txt'), 'development\n');
  const destination = path.join(root, 'runtime/export');
  await materializeTemplateSource({ root, key: 'auto-best', release, source, destination });
  assert.equal(fs.readFileSync(path.join(destination, 'source.txt'), 'utf8'), 'approved\n');
  assert.equal(fingerprint(destination).digest, source.digest);
});

test('Cars source locators remain bound when native adoption is sealed and rechecked', t => {
  const root = temp(t), f = nativeFixture(root, 'import');
  git(root, ['init', '-b', 'main']);
  git(root, ['config', 'user.name', 'Cars template fixture']);
  git(root, ['config', 'user.email', 'fixture@example.invalid']);
  for (const { key } of f.manifest.variants) {
    const directory = path.join(root, 'templates', key);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, 'source.ts'), `export const template = '${key}';\n`);
  }
  git(root, ['add', 'templates']);
  git(root, ['commit', '-m', 'fixture template sources']);
  const revision = git(root, ['rev-parse', 'HEAD']);
  f.manifest.templateSources = {};
  for (const { key } of f.manifest.variants) {
    const release = f.releases[key], directory = path.join(root, 'templates', key);
    const source = { repository: 'darkapoparka/cars', revision, path: `templates/${key}`,
      tree: git(root, ['rev-parse', `${revision}:templates/${key}`]), digest: release.digest };
    f.manifest.templateRevisions[key] = revision;
    f.manifest.templateSources[key] = source;
    release.repository = source.repository;
    release.commit = revision;
    release.snapshotPath = source.path;
    release.source = source;
    release.qa.nativeLocalization.repository = source.repository;
    release.qa.nativeLocalization.commit = revision;
    release.qa.nativeLocalization.sourcePath = source.path;
    release.qa.nativeLocalization.sourceTree = source.tree;
    release.qa.nativeLocalization.deployment.sourceCommit = revision;
  }

  const receipt = sealNativeAdoption(f.files, f.manifest, f.releases);
  assertNativeAdoption(f.files, f.manifest);
  const stored = JSON.parse(f.files.get('localization/adoption.json').toString('utf8'));
  assert.deepEqual(stored, receipt);
  for (const { key } of f.manifest.variants) {
    assert.deepEqual(stored.releases[key].source, f.manifest.templateSources[key]);
    assert.equal(stored.releases[key].qa.nativeLocalization.sourcePath, `templates/${key}`);
  }
});

test('legacy standalone release locators remain compatible', () => {
  const entry = { repository: 'darkapoparka/cars-template-import', commit: 'a'.repeat(40),
    snapshotPath: 'templates/import', digest: 'b'.repeat(64) };
  assert.deepEqual(selectedTemplateSource(entry), { repository: entry.repository, revision: entry.commit,
    path: '', tree: null, digest: entry.digest });
});

test('malformed Cars locators never fall back to copying working files', async t => {
  const root = temp(t);
  const source = { repository: 'darkapoparka/cars', revision: 'a'.repeat(40),
    path: 'templates/auto-best', tree: 'b'.repeat(40), digest: 'c'.repeat(64) };
  const release = { repository: source.repository, commit: source.revision,
    snapshotPath: source.path, digest: source.digest, exportPolicy: POLICY, source };
  for (const mutation of [
    { tree: null }, { path: 'templates/carwow' }, { revision: 'bad' },
    { repository: 'darkapoparka/cars-template-auto-best', path: '', tree: null },
  ]) {
    let copied = false;
    const destination = path.join(root, 'never-created');
    await assert.rejects(materializeTemplateSource({ root, key: 'auto-best', release,
      source: { ...source, ...mutation }, destination,
      copy: async () => { copied = true; } }), /invalid Cars subtree/);
    assert.equal(copied, false);
    assert.equal(fs.existsSync(destination), false);
  }
});

test('invalid native Cars locators cannot use legacy acceptance as a fallback', t => {
  const root = temp(t), f = nativeFixture(root, 'import');
  for (const { key } of f.manifest.variants) {
    f.releases[key].source = { repository: 'darkapoparka/cars', revision: 'bad',
      path: `templates/${key}`, tree: 'a'.repeat(40), digest: f.releases[key].digest };
  }
  assert.throws(() => sealNativeAdoption(f.files, f.manifest, f.releases), /invalid selected release/);
});
