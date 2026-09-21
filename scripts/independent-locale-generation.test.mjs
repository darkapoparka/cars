import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createIndependentDealer } from './create-independent-dealer.mjs';
import { fingerprint, POLICY, sha256 } from './lib/workflow.mjs';
import { packageDigest } from './export-dealer.mjs';
import { packageDealer } from './package-dealer.mjs';
import { nativeFixture } from './test-fixtures/native-source.mjs';

const locale = { schemaVersion: 1, dealerId: 'fixture-cars', defaultLocale: 'en', enabledLocales: ['en', 'bg'], dealerCountry: 'AE', inventoryCurrency: 'AED' };
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-independent-locale-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const parent = path.join(root, 'independent'); fs.mkdirSync(parent);
  const put = (name, value) => { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value)); };
  put('workspace.json', { machinePaths: { [process.platform]: root }, independentClientsRoot: { [process.platform]: parent } });
  put('docs/DEPLOYMENT-INVENTORY.json', { aliases: {}, dealers: [] });
  const templates = ['auto-best', 'modern', 'carwow'].map(key => ({ key, path: 'templates/' + key, aliases: [], homes: [{ id: 'home' }] }));
  put('catalog.json', { templates });
  const lock = { templates: {} };
  for (const item of templates) {
    put(item.path + '/package.json', { name: item.key }); put(item.path + '/src/keep.txt', 'Preserve this exact fixture source');
    lock.templates[item.key] = { status: 'approved', repository: 'darkapoparka/cars-template-' + item.key, commit: 'b'.repeat(40), snapshotPath: item.path, exportPolicy: POLICY, digest: fingerprint(path.join(root, item.path)).digest };
  }
  put('templates.lock.json', lock);
  const state = { head: 'a'.repeat(40), remote: 'a'.repeat(40), changed: [], untracked: [] };

  const readGit = (_directory, args) => {
    if (args[0] === 'config') return 'https://github.com/darkapoparka/cars.git';
    if (args[0] === 'branch') return 'main';
    if (args[0] === 'rev-parse') return state.head;
    if (args[0] === 'ls-remote') return (args.includes('origin') ? state.remote : 'b'.repeat(40)) + '\trefs/heads/main';
    if (['diff', 'ls-files'].includes(args[0])) {
      const inputs = args.slice(args.indexOf('--') + 1);
      return state[args[0] === 'diff' ? 'changed' : 'untracked'].filter(name => inputs.some(input => name === input || name.startsWith(input + '/'))).join('\n');
    }
    throw new Error('Unexpected fixture Git command: ' + args.join(' '));
  };
  // Test installation/ownership mechanics with tiny fixtures, not application copies.
  // Real mount transformations and payload integrity are covered in package-dealer.test.mjs.
  const packageFixture = async ({ source, destination, guidance }) => {
    fs.cpSync(source, destination, { recursive: true });
    fs.writeFileSync(path.join(destination, 'AGENTS.md'), guidance);
    const payload = packageDigest(destination).files;
    fs.writeFileSync(path.join(destination, '.cars-package.json'), JSON.stringify({ packagingVersion: '1', payloadDigest: sha256(JSON.stringify(payload)), payload }));
  };
  const run = options => createIndependentDealer({ root, client: 'fixture-cars', repository: 'darkapoparka/cars-fixture', readGit, packageSource: packageFixture, ...options });
  return { root, parent, target: path.join(parent, 'fixture-cars'), put, lock, state, readGit, packageFixture, run };
}

test('locale preflight returns requested routes and blockers without creating any output', async t => {
  const f = fixture(t), result = await f.run({ localeConfig: locale });
  assert.equal(result.localization.status, 'blocked-unreleased-native-adapter');
  assert.equal(result.localization.requestedRoutes.bg[1].requestedEntry, '/variant-2/bg/cars');
  assert.deepEqual(fs.readdirSync(f.parent), []); assert.equal(result.mode, 'dry-run');
});

test('write cannot silently turn a locale request into an unlocalized dealer', async t => {
  const f = fixture(t);
  await assert.rejects(f.run({ localeConfig: locale, write: true }), { code: 'NATIVE_LOCALE_PACKAGER_REQUIRED' });
  assert.deepEqual(fs.readdirSync(f.parent), []);
});

test('ordinary fixture generation retains its source pins and honest personalization state', async t => {
  const f = fixture(t), before = fingerprint(path.join(f.root, 'templates'));
  const result = await f.run({ write: true });
  assert.equal(result.state, 'needs-personalization'); assert.equal(result.localization.status, 'unverified-legacy-defaults');
  const dealer = JSON.parse(fs.readFileSync(path.join(f.target, 'dealer.json')));
  assert.equal(dealer.sourceOwnership, 'independent-repository'); assert.equal(dealer.defaultBranch, 'main');
  assert.deepEqual(Object.values(dealer.templateRevisions), ['b'.repeat(40), 'b'.repeat(40), 'b'.repeat(40)]);
  assert.deepEqual(fingerprint(path.join(f.root, 'templates')), before);
  assert.ok(fs.existsSync(path.join(f.target, 'docs/workflow/INITIAL-PACKAGE.json')));
  assert.equal(fs.existsSync(path.join(f.root, 'clients/fixture-cars')), false);
});

for (const [kind, file] of [['changed', 'scripts/create-independent-dealer.mjs'], ['changed', 'scripts/package-dealer.mjs'], ['changed', 'scripts/publishing/mounts.mjs'], ['untracked', 'scripts/lib/dealer-locale.mjs']]) {
  test('refuses uncommitted independent workflow input: ' + kind + ' ' + file, async t => {
    const f = fixture(t); f.state[kind] = [file];
    await assert.rejects(f.run({ write: true }), /reviewed independent generator\/packaging inputs/);
    assert.deepEqual(fs.readdirSync(f.parent), []);
  });
}

test('a pinned native locale source cannot enter legacy packaging without an explicit locale request', async t => {
  const f = fixture(t); f.put('templates/auto-best/localization/core.ts', '// native locale policy');
  f.lock.templates['auto-best'].digest = fingerprint(path.join(f.root, 'templates/auto-best')).digest; f.put('templates.lock.json', f.lock);
  const plan = await f.run(); assert.equal(plan.localization.status, 'blocked-native-source');
  await assert.rejects(f.run({ write: true }), { code: 'NATIVE_LOCALE_PACKAGER_REQUIRED' });
  assert.deepEqual(fs.readdirSync(f.parent), []);
});

for (const [name, change, expected] of [
  ['main', f => { f.state.head = f.state.remote = 'c'.repeat(40); }, /main changed during preparation/],
  ['workflow input', f => { f.state.changed = ['scripts/package-dealer.mjs']; }, /reviewed independent generator/],
  ['template pin', f => { f.lock.templates.modern.commit = 'c'.repeat(40); f.put('templates.lock.json', f.lock); }, /Template release changed/],
  ['template source', f => f.put('templates/modern/src/keep.txt', 'concurrent edit'), /snapshot drift/],
  ['prepared source', (_f, options) => fs.appendFileSync(path.join(options.source, 'auto-best/src/keep.txt'), 'concurrent edit'), /Prepared template changed/],
  ['dealer identity', f => f.put('docs/DEPLOYMENT-INVENTORY.json', { aliases: {}, dealers: [{ slug: 'fixture-cars' }] }), /Dealer identity appeared/],
  ['publishing repository', f => f.put('docs/DEPLOYMENT-INVENTORY.json', { aliases: {}, dealers: [{ slug: 'different', repository: 'darkapoparka/CARS-FIXTURE' }] }), /repository was registered/]
]) test('concurrent ' + name + ' change cannot install an obsolete fixture', async t => {
  const f = fixture(t);
  await assert.rejects(f.run({ write: true, packageSource: async options => { await f.packageFixture(options); change(f, options); } }), expected);
  assert.equal(fs.existsSync(f.target), false);
});

test('an independently occupied target appearing during preparation is preserved byte-for-byte', async t => {
  const f = fixture(t);
  await assert.rejects(f.run({ write: true, packageSource: async options => {
    await f.packageFixture(options); fs.mkdirSync(f.target); fs.writeFileSync(path.join(f.target, 'owner.txt'), 'other writer');
  } }), /Existing independent dealer checkout/);
  assert.deepEqual(fs.readdirSync(f.target), ['owner.txt']);
  assert.equal(fs.readFileSync(path.join(f.target, 'owner.txt'), 'utf8'), 'other writer');
});

function useNativeTemplates(f, middle = 'modern') {
  const native = nativeFixture(path.join(f.root, 'native-fixture'), middle, 'fixture-cars');
  const templates = native.manifest.variants.map(({ key }) => ({ key, path: `templates/${key}`, aliases: [], homes: [{ id: 'home' }] }));
  f.put('catalog.json', { templates }); f.lock.templates = {};
  for (const { key } of templates) {
    const target = path.join(f.root, 'templates', key);
    fs.rmSync(target, { recursive: true, force: true });
    fs.cpSync(path.join(native.source, key), target, { recursive: true });
    f.lock.templates[key] = { ...native.releases[key], snapshotPath: `templates/${key}`, exportPolicy: POLICY };
  }
  f.put('templates.lock.json', f.lock);
  return native;
}
for (const middle of ['modern', 'import']) test(`independent native ${middle} generation runs the real packager and retains exact source pins`, async t => {
  const f = fixture(t), native = useNativeTemplates(f, middle), before = fingerprint(path.join(f.root, 'templates'));
  const result = await f.run({ preset: middle === 'import' ? 'import' : 'standard', localeConfig: locale, write: true, packageSource: packageDealer });
  assert.equal(result.localization.status, 'native-ready-needs-dealer-qa');
  assert.equal(result.state, 'needs-personalization');
  const manifest = JSON.parse(fs.readFileSync(path.join(f.target, 'dealer.json')));
  assert.equal(manifest.packaging.version, '2'); assert.deepEqual(manifest.localization, locale);
  assert.deepEqual(manifest.templateRevisions, native.manifest.templateRevisions);
  assert.deepEqual(fingerprint(path.join(f.root, 'templates')), before);
  assert.equal(fs.existsSync(path.join(f.root, 'clients/fixture-cars')), false);
  assert.ok(fs.existsSync(path.join(f.target, 'localization/adoption.json')));
  assert.ok(fs.existsSync(path.join(f.target, 'scripts/build-native-service.mjs')));
});
test('native independent generation rejects changed acceptance after preparation', async t => {
  const f = fixture(t); useNativeTemplates(f);
  await assert.rejects(f.run({ localeConfig: locale, write: true, packageSource: async options => {
    await packageDealer(options);
    f.lock.templates.modern.qa.nativeLocalization.checks[0].status = 'failed';
    f.put('templates.lock.json', f.lock);
  } }), /Template release changed/);
  assert.equal(fs.existsSync(f.target), false);
});
test('native independent generation rejects a modified prepared payload', async t => {
  const f = fixture(t); useNativeTemplates(f);
  await assert.rejects(f.run({ localeConfig: locale, write: true, packageSource: async options => {
    await packageDealer(options);
    fs.appendFileSync(path.join(options.destination, 'modern/apps/web/proxy.ts'), '// competing modification\n');
  } }), /Package payload changed/);
  assert.equal(fs.existsSync(f.target), false);
});
