import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { packageDealer, planDealerPackage } from './package-dealer.mjs';
import { fingerprint } from './lib/workflow.mjs';
import { parseCatalogJson, auditNativeCatalogs, assertNativeAdoption, nativeReleaseReadiness, validateNativeRelease } from './lib/native-localization.mjs';
import { adoptNativeSource, configureObject } from './publishing/native-mounts.mjs';
import { nativeBuildPlan, runNativeBuild } from './publishing/build-native-service.mjs';
import { nativeFixture } from './test-fixtures/native-source.mjs';

const commit = 'd'.repeat(40);
function setup(t, middle = 'modern') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-native-fixture-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, ...nativeFixture(path.join(root, 'source'), middle) };
}
const read = (root, name) => fs.readFileSync(path.join(root, name));
const options = (fixture, destination) => ({ source: fixture.source, destination, manifest: fixture.manifest, sourceCommit: commit, nativeReleases: fixture.releases });

test('catalog JSON rejects escaped duplicate keys, truncation, executable input and blank values', () => {
  for (const text of ['{"title":"A","title":"B"}', '{"title":"A","\\u0074itle":"B"}', '{"a":', '{a:"x"}', '{"a":()=>1}', '{"a":1,}', '[1,]', '{"a":1};globalThis.x=1']) assert.throws(() => parseCatalogJson(text));
  assert.equal(parseCatalogJson('{"title":"Inventory","nested":["ok"]}').title, 'Inventory');
  assert.equal(parseCatalogJson('{"x":"a"} as const', { prefix: true }).value.x, 'a');
});
test('configuration adapter edits only declared values and rejects ambiguous boundaries', () => {
  const input = 'export const config = { name: "a,b", keep: {x: [1, 2]}, enabledLocales: ["bg", "en"] } as const;';
  const output = configureObject(input, 'config', { enabledLocales: 'carsLocale.enabledLocales' });
  assert.equal(output, input.replace('["bg", "en"]', 'carsLocale.enabledLocales'));
  assert.throws(() => configureObject(input, 'config', { missing: 'false' }), /Missing/);
  assert.throws(() => configureObject('export const config = {a: 1, a: 2};', 'config', { a: '3' }), /Duplicate/);
  assert.throws(() => configureObject('export const config = {...override, a: 1};', 'config', { a: '3' }), /Spread/);
});

for (const middle of ['modern', 'import']) test(`native ${middle} trio packages independently, idempotently and preserves source/assets`, async t => {
  const fixture = setup(t, middle), before = fingerprint(fixture.source).digest;
  const first = path.join(fixture.root, 'first'), second = path.join(fixture.root, 'second');
  const planned = await planDealerPackage(options(fixture, first));
  const result = await packageDealer(options(fixture, first));
  assert.equal(result.packagingVersion, '2'); assert.equal(result.digest, planned.digest);
  assert.equal(fingerprint(fixture.source).digest, before);
  const secondResult = await packageDealer({ source: first, destination: second, manifest: fixture.manifest, sourceCommit: commit });
  assert.equal(secondResult.digest, result.digest, 'native re-packaging must not accumulate prefixes or imports');
  for (const [name, bytes] of fixture.files) {
    if (/\.(?:webp|png)$/.test(name) || /(?:next|svelte)\.config|\/proxy\.ts$|\/paths\.ts$/.test(name)) assert.deepEqual(read(first, name), bytes, name);
  }
  const contract = JSON.parse(read(first, 'localization/contract.json'));
  assert.deepEqual(contract, fixture.manifest.localization);
  assert.equal(contract.defaultLocale, 'en'); assert.equal(contract.dealerCountry, 'AE'); assert.equal(contract.inventoryCurrency, 'AED');
  const vercel = JSON.parse(read(first, 'vercel.json'));
  assert.ok(vercel.services[middle === 'import' ? 'importer' : 'modern'].buildCommand.includes('build-native-service.mjs'));
  assert.ok(!result.files.some(name => name.endsWith('/preview-paths.ts')));
  assert.equal(JSON.parse(read(first, '.cars-package.json')).sourceCommit, commit);
});
test('catalog acceptance checks all keys, nested values and interpolation, not a count badge', t => {
  const f = setup(t), descriptors = f.releases.modern.qa.nativeLocalization.catalogs;
  assert.equal(auditNativeCatalogs(f.files, 'modern', descriptors).catalogs[0].keys, 3);
  for (const bad of [{ title: 'Автомобили' }, { title: ' ', detail: 'Вижте {vehicle}', contact: { title: 'Бартер' } }, { title: 'Автомобили', detail: 'Вижте {wrong}', contact: { title: 'Бартер' } }]) {
    const files = new Map(f.files); files.set('modern/localization/bg.json', Buffer.from(JSON.stringify(bad)));
    assert.throws(() => auditNativeCatalogs(files, 'modern', descriptors));
  }
  const pair = new Map([['modern/catalog.ts', Buffer.from('export const en = {"title":"Inventory"} as const;\nexport const bg = {"title":"Автомобили"} as const;')]]);
  assert.equal(auditNativeCatalogs(pair, 'modern', [{ format: 'esm-json-pair', path: 'catalog.ts' }]).catalogs[0].keys, 1);
});
test('adoption fails atomically on native incompatibility and never mutates supplied source', t => {
  const f = setup(t, 'import'), input = new Map(f.files);
  input.set('import/src/lib/locale/core.ts', Buffer.from('export const localeConfiguration = {defaultLocale: "bg"};'));
  const before = [...input].map(([p, b]) => [p, b.toString('hex')]);
  assert.throws(() => adoptNativeSource(input, f.manifest, f.releases), /dealerId/);
  assert.deepEqual([...input].map(([p, b]) => [p, b.toString('hex')]), before);
});
test('adoption binds full native source and rejects changes after review', t => {
  const f = setup(t), adopted = adoptNativeSource(f.files, f.manifest, f.releases);
  assertNativeAdoption(adopted, f.manifest);
  assert.ok(!f.files.has('localization/adoption.json'));
  const tampered = new Map(adopted);
  tampered.set('modern/apps/web/proxy.ts', Buffer.from('export const unsafe = true;'));
  assert.throws(() => assertNativeAdoption(tampered, f.manifest), /changed after adoption/);
  const stale = structuredClone(f.manifest); stale.templateRevisions.modern = '9'.repeat(40);
  assert.throws(() => assertNativeAdoption(adopted, stale), /stale/);
});
test('release promotion needs exact reviewed source, tests, deployment and public alias', t => {
  const f = setup(t);
  assert.equal(nativeReleaseReadiness(f.manifest.variants, f.releases).ready, true);
  for (const mutate of [
    r => { r.qa.nativeLocalization.checks[0].status = 'failed'; },
    r => { r.qa.nativeLocalization.checks.pop(); },
    r => { r.qa.nativeLocalization.checks[0].evidenceSha256 = ''; },
    r => { r.qa.nativeLocalization.commit = '0'.repeat(40); },
    r => { r.qa.nativeLocalization.locales.push('ar'); },
    r => { r.qa.nativeLocalization.deployment.sourceCommit = '0'.repeat(40); },
    r => { r.qa.nativeLocalization.deployment.state = 'BUILDING'; },
    r => { r.qa.nativeLocalization.deployment.publicAlias = 'https://fixture.example/?token=secret'; },
    r => { delete r.qa.nativeLocalization; }
  ]) {
    const release = structuredClone(f.releases.modern); mutate(release);
    assert.throws(() => validateNativeRelease('modern', release));
  }
});
test('native v2 is not an escape from legacy source protection or missing adoption', async t => {
  const f = setup(t);
  await assert.rejects(packageDealer({ ...options(f, path.join(f.root, 'absent')), nativeReleases: undefined }), /Missing native source/);
  const legacy = { ...f.manifest, packaging: { version: '1' } };
  await assert.rejects(packageDealer({ ...options(f, path.join(f.root, 'legacy')), manifest: legacy }), /reviewed compatible packager/);
  assert.ok(!fs.existsSync(path.join(f.root, 'legacy')));
  const invalid = new Map(f.files); invalid.set('../escape.txt', Buffer.from('forbidden'));
  await assert.rejects(packageDealer({ ...options(f, path.join(f.root, 'unsafe')), canonicalFiles: invalid }), /Invalid retained file/);
  assert.ok(!fs.existsSync(path.join(f.root, 'escape.txt')));
});
test('source and destination races fail before installation without losing the competing writer', async t => {
  const f = setup(t), target = path.join(f.root, 'source-race');
  await assert.rejects(packageDealer({ ...options(f, target), beforeInstall: () => fs.appendFileSync(path.join(f.source, 'modern/apps/web/proxy.ts'), '// owner edit\n') }), /source changed/);
  assert.ok(!fs.existsSync(target));
  const collision = path.join(f.root, 'collision');
  await assert.rejects(packageDealer({ ...options(f, collision), beforeInstall: () => { fs.mkdirSync(collision); fs.writeFileSync(path.join(collision, 'owner.txt'), 'preserve'); } }), /EEXIST/);
  assert.equal(read(collision, 'owner.txt').toString(), 'preserve');
});
test('native build plan uses each framework mount and propagates a build failure', t => {
  const f = setup(t), calls = [];
  assert.deepEqual(nativeBuildPlan('modern').environment, { NEXT_PUBLIC_BASE_PATH: '/variant-2' });
  assert.deepEqual(nativeBuildPlan('import').environment, { TEMPLATE_BASE_PATH: '/variant-2' });
  assert.deepEqual(nativeBuildPlan('carwow').environment, { DAY_LOCALE_BASE: '/variant-3' });
  assert.deepEqual(nativeBuildPlan('auto-best').steps.slice(0, 3), [
    ['npm', 'ci', '--include=dev'],
    ['node', 'scripts/build-locales.mjs'],
    ['npm', 'run', 'build']
  ]);
  assert.deepEqual(nativeBuildPlan('carwow').steps.slice(0, 3), [
    ['npm', 'ci', '--include=dev'],
    ['node', 'scripts/build-locales.mjs'],
    ['npm', 'run', 'build']
  ]);
  assert.deepEqual(nativeBuildPlan('import').steps.slice(0, 2), [
    ['npm', 'ci', '--include=dev'],
    ['npm', 'run', 'build']
  ]);
  assert.throws(() => nativeBuildPlan('modern && publish'), /Unknown/);
  runNativeBuild('modern', { packageRoot: f.source, run: (...args) => { calls.push(args); return { status: 0 }; } });
  assert.equal(calls[0][2].env.NEXT_PUBLIC_BASE_PATH, '/variant-2');
  assert.equal(calls[0][2].cwd, path.join(f.source, 'modern'));
  assert.throws(() => runNativeBuild('modern', { packageRoot: f.source, run: () => ({ status: 1 }) }), /build failed/);
});
test('native FAB keeps the explicit URL locale across all three designs and labels Admin honestly', async t => {
  const f = setup(t), target = path.join(f.root, 'fab'); await packageDealer(options(f, target));
  const source = read(target, 'auto-best/static/preview-switcher.js').toString();
  const script = source.slice(source.indexOf('  const config = '), source.indexOf('  const index = ')) + '\nglobalThis.state = {config, choices};';
  for (const locale of ['en', 'bg']) {
    const context = { location: { pathname: `/variant-2/${locale}/cars` }, document: { documentElement: { lang: locale === 'en' ? 'bg' : 'en' } } };
    vm.runInNewContext(script, context, { timeout: 1000 });
    assert.deepEqual(Array.from(context.state.choices, c => c.entry), [`/${locale}`, `/variant-2/${locale}/cars`, `/variant-3/${locale}`]);
    assert.equal(context.state.config.language, locale); assert.match(context.state.config.labels.admin, /English|английски/);
  }
});

test('real native TypeScript catalog shapes are supported without evaluating source', () => {
  const files = new Map([
    ['import/preferences.ts', Buffer.from("import type {Locale} from './core';\nexport const en = {title: 'Country', greeting: 'Hello {name}',};\nexport const bg: Record<string,string> = {title: 'Държава', greeting: 'Здравей {name}',};")],
    ['import/rows.ts', Buffer.from("export const inventoryCopy = {term0: {en: 'Automatic', bg: 'Автоматик'}} as const;")],
    ['import/source-map.ts', Buffer.from("export const extraEnglish = {Данни: 'Details', 'Вашето име': 'Your name'} as const;")]
  ]);
  const result = auditNativeCatalogs(files, 'import', [
    { format: 'typescript-pair', path: 'preferences.ts', en: 'en', bg: 'bg' },
    { format: 'typescript-rows', path: 'rows.ts', export: 'inventoryCopy' },
    { format: 'typescript-source-map', path: 'source-map.ts', export: 'extraEnglish' }
  ]);
  assert.deepEqual(result.catalogs.map(c => c.keys), [2, 1, 2]);
  for (const text of ["export const en = {title: call()};", "export const en = {...other};", "export const en = {get title() {return 'no'}};", "export const en = {['title']: 'no'};", "export const en = {title: 'x', '\\u0074itle': 'y'};", "export const en = {title: `Hello ${process.exit()}`};"]) {
    const invalid = new Map(files); invalid.set('import/preferences.ts', Buffer.from(text + "\nexport const bg = {title: 'да'};"));
    assert.throws(() => auditNativeCatalogs(invalid, 'import', [{ format: 'typescript-pair', path: 'preferences.ts', en: 'en', bg: 'bg' }]));
  }
});
