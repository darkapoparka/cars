import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { packageDealer, planDealerPackage } from './package-dealer.mjs';
import { fingerprint, sha256 } from './lib/workflow.mjs';
import { parseCatalogJson, auditNativeCatalogs, assertNativeAdoption, nativeReleaseReadiness, validateNativeRelease,
  sealNativeAdoption, validateTemplateQualification, sealNativeQualification, assertNativeQualification, NATIVE_CHECKS } from './lib/native-localization.mjs';
import { fixtureReleases, writeTinySingleton } from './test-fixtures/fleet-single-worker.mjs';
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

// Synthetic originals and independent acceptance for tiny tests; never rollout proof.
function cloudflareFixture(t) {
  const f = setup(t), release = f.releases.modern, review = release.qa.nativeLocalization;
  f.manifest.templateSources = {};
  for (const [key, current] of Object.entries(f.releases)) {
    current.repository = 'darkapoparka/cars'; current.snapshotPath = 'templates/' + key;
    current.source = { repository: current.repository, revision: current.commit, path: current.snapshotPath, tree: 'a'.repeat(40), digest: current.digest };
    Object.assign(current.qa.nativeLocalization, { repository: current.repository, sourcePath: current.source.path, sourceTree: current.source.tree });
    f.manifest.templateSources[key] = current.source;
  }
  review.verifiedAt = '2026-10-11T10:02:00Z';
  const sourceReleases = { ...fixtureReleases(), 'auto-best': f.releases['auto-best'].source, modern: release.source };
  const bundle = writeTinySingleton(path.join(f.root, 'tiny-bundle'), { client: f.manifest.slug, sourceReleases });
  const proofRoot = path.join(f.root, 'docs/releases/cloudflare-fixture'); fs.mkdirSync(proofRoot, { recursive: true });
  const pin = (name, value) => {
    const bytes = Buffer.isBuffer(value) ? value : Buffer.from(JSON.stringify(value, null, 2) + '\n');
    fs.writeFileSync(path.join(proofRoot, name), bytes);
    return { reference: 'docs/releases/cloudflare-fixture/' + name, sha256: sha256(bytes) };
  };
  const refs = { artifactManifest: pin('artifact-manifest.json', fs.readFileSync(path.join(bundle.directory, 'artifact-manifest.json'))),
    singleWorkerReceipt: pin('single-worker-receipt.json', fs.readFileSync(path.join(bundle.directory, 'single-worker-receipt.json'))) };
  const common = { ...Object.fromEntries(['accountId','workerName','publicOrigin','sourceCommit','sourceTree','inputDigest','sourceReleases','outputDigest','workerCount','applicationCount'].map(name => [name, bundle.receipt[name]])),
    artifactDigest: bundle.inventory.digest, serviceBindings: [], deploymentId: '11111111-1111-4111-8111-111111111111', versionId: '22222222-2222-4222-8222-222222222222',
    versionTraffic: [{ version_id: '22222222-2222-4222-8222-222222222222', percentage: 100 }], liveBindings: [{ type: 'assets', name: 'ASSETS' }],
    sourcePublication: { repository: 'darkapoparka/cars', commit: bundle.receipt.sourceCommit, sourceTree: bundle.receipt.sourceTree, ref: 'refs/heads/main', publishedAt: '2026-10-11T09:00:00Z', evidence: 'synthetic authenticated source proof', verifiedMainCommit: '9'.repeat(40) } };
  const deployed = { ...structuredClone(common), schemaVersion: 1, type: 'cars-existing-fleet-single-worker-deployment', status: 'deployed', client: f.manifest.slug,
    runId: bundle.receipt.runId, attempt: bundle.receipt.attempt, deployments: 1, hostedVerified: false, ownerAccepted: false, finishedAt: '2026-10-11T10:00:00Z' };
  refs.deploymentReceipt = pin('deployment.json', deployed);
  const acceptance = structuredClone(review); delete acceptance.deployment;
  const hosted = { ...structuredClone(common), schemaVersion: 1, type: 'cars-existing-fleet-single-worker-hosted-acceptance', status: 'passed', client: f.manifest.slug,
    unauthenticated: true, verifiedAt: '2026-10-11T10:03:00Z', ...refs,
    applications: Object.fromEntries(Object.entries(sourceReleases).map(([key, source]) => [key, { status: 'passed', source,
      checks: ['mounted-journeys','public-journeys','assets-preserved'].map(name => ({ name, status: 'passed', evidenceSha256: 'c'.repeat(64) })) }])),
    nativeLocalization: Object.fromEntries(['auto-best','modern','import'].map(key => { const source = sourceReleases[key]; return [key,
      { ...structuredClone(acceptance), repository: source.repository, commit: source.revision, sourcePath: source.path, sourceTree: source.tree, sourceDigest: source.digest }]; })) };
  refs.hostedReceipt = pin('hosted.json', hosted);
  review.deployment = { ...structuredClone(common), provider: 'cloudflare', publicAlias: common.publicOrigin, ...refs }; delete review.deployment.publicOrigin;
  return { ...f, release, review, bundle, deployed, hosted, pin };
}

test('Cloudflare native proof binds the deployed dealer source separately from all six template pins', t => {
  const f = cloudflareFixture(t);
  assert.notEqual(f.review.deployment.sourceCommit, f.release.commit);
  assert.equal(validateNativeRelease('modern', f.release, { root: f.root }), f.review);
  assert.equal(nativeReleaseReadiness([{key:'modern'}], f.releases, { root: f.root }).ready, true);
  assert.equal(f.deployed.hostedVerified, false);
  assert.equal(f.deployed.ownerAccepted, false);
});

test('Cloudflare rejects altered metadata, incomplete traffic/bindings and unsafe proof references', t => {
  const f = cloudflareFixture(t);
  const mutations = [
    d => { d.provider = 'unknown'; }, d => { d.state = 'READY'; }, d => { d.versionId = 'not-a-version'; },
    d => { d.accountId = 'f'.repeat(32); }, d => { d.workerName = 'another-worker'; },
    d => { d.publicAlias = 'https://another.example/'; }, d => { d.sourceCommit = f.release.commit; },
    d => { d.sourceTree = 'e'.repeat(40); }, d => { d.sourcePublication.commit = f.release.commit; },
    d => { d.sourcePublication.verifiedMainCommit = ''; }, d => { d.inputDigest = 'e'.repeat(64); },
    d => { d.artifactDigest = 'e'.repeat(64); }, d => { d.outputDigest = 'e'.repeat(64); },
    d => { d.applicationCount = 5; }, d => { d.workerCount = 7; }, d => { d.serviceBindings.push('CARS_APP'); },
    d => { d.versionTraffic[0].percentage = 99; }, d => { d.versionTraffic[0].version_id = d.deploymentId; },
    d => { d.versionTraffic.push({...d.versionTraffic[0]}); }, d => { d.liveBindings.push({type:'service',name:'APP'}); },
    d => { d.liveBindings[0].type = 'service'; }, d => { d.liveBindings[0].name = 'OTHER'; },
    d => { d.liveBindings[0].entrypoint = 'fetch'; }, d => { delete d.sourceReleases.mobile; },
    ...['repository','revision','path','tree','digest'].map(field => d => { d.sourceReleases.modern[field] = field === 'path' ? 'templates/import' : 'e'.repeat(field === 'digest' ? 64 : 40); }),
    d => { d.sourceReleases.app.digest = 'e'.repeat(64); },
    d => { d.hostedReceipt.sha256 = 'e'.repeat(64); }, d => { delete d.deploymentReceipt; },
    ...['../escape.json','docs/releases/../escape.json','/absolute.json','C:/absolute.json','runtime/proof.json','docs/releases\\proof.json'].map(reference => d => { d.hostedReceipt.reference = reference; })
  ];
  for (const mutate of mutations) {
    const release = structuredClone(f.release); mutate(release.qa.nativeLocalization.deployment);
    assert.throws(() => validateNativeRelease('modern', release, { root: f.root }));
  }
  assert.throws(() => validateNativeRelease('import', f.release, { root: f.root }), /invalid selected release/);
});

test('original hashed receipts and every hosted family remain mandatory even when references are resealed', t => {
  for (const mutate of [
    h => { h.unauthenticated = false; }, h => { h.versionTraffic[0].percentage = 50; },
    h => { h.sourceReleases.app.digest = 'e'.repeat(64); }, h => { delete h.applications.mobile; },
    h => { h.applications['karento-best'].checks[0].status = 'failed'; },
    h => { h.applications.app.source.tree = 'e'.repeat(40); }, h => { delete h.nativeLocalization.import; },
    h => { h.nativeLocalization['auto-best'].checks.pop(); },
    h => { h.nativeLocalization.import.checks[0].evidenceSha256 = ''; },
    h => { h.nativeLocalization.import.checks[0].status = 'failed'; },
    h => { h.nativeLocalization.import.widths = [390,1440]; },
    h => { h.nativeLocalization.modern.catalogs = []; }, h => { h.verifiedAt = '2026-10-11T09:00:00Z'; }
  ]) {
    const f = cloudflareFixture(t), hosted = structuredClone(f.hosted); mutate(hosted);
    f.review.deployment.hostedReceipt = f.pin('hosted.json', hosted);
    assert.throws(() => validateNativeRelease('modern', f.release, { root: f.root }));
  }
  const f = cloudflareFixture(t), original = fs.readFileSync(path.join(f.root, f.review.deployment.deploymentReceipt.reference));
  fs.appendFileSync(path.join(f.root, f.review.deployment.deploymentReceipt.reference), ' ');
  assert.throws(() => validateNativeRelease('modern', f.release, { root: f.root }), /original proof bytes differ/);
  fs.writeFileSync(path.join(f.root, f.review.deployment.deploymentReceipt.reference), original);
  const duplicate = Buffer.from(JSON.stringify(f.hosted).replace('"schemaVersion":1', '"schemaVersion":1,"schemaVersion":1'));
  f.review.deployment.hostedReceipt = f.pin('hosted.json', duplicate);
  assert.throws(() => validateNativeRelease('modern', f.release, { root: f.root }), /duplicate/i);
});

test('Cloudflare release references cannot link into ignored runtime even inside the repository', t => {
  const f=cloudflareFixture(t),runtime=path.join(f.root,'runtime'),link=path.join(f.root,'docs/releases/runtime-link');
  fs.mkdirSync(runtime);fs.writeFileSync(path.join(runtime,'hosted.json'),fs.readFileSync(path.join(f.root,f.review.deployment.hostedReceipt.reference)));
  fs.symlinkSync(runtime,link,'junction');
  f.review.deployment.hostedReceipt.reference='docs/releases/runtime-link/hosted.json';
  assert.throws(()=>validateNativeRelease('modern',f.release,{root:f.root}),/canonical physical/);
});

test('Cloudflare provider/source/evidence fields survive adoption seals; Vercel bytes remain compatible', t => {
  const f = cloudflareFixture(t);
  const sealed = sealNativeAdoption(f.files, f.manifest, f.releases, { root: f.root });
  assert.deepEqual(sealed.releases.modern.qa.nativeLocalization.deployment, f.review.deployment);
  assertNativeAdoption(f.files, f.manifest, { root: f.root });
  const altered = structuredClone(sealed); altered.releases.modern.qa.nativeLocalization.deployment.sourceReleases.app.tree = 'e'.repeat(40);
  const changed = new Map(f.files); changed.set('localization/adoption.json', Buffer.from(JSON.stringify(altered)));
  assert.throws(() => assertNativeAdoption(changed, f.manifest, { root: f.root }), /identity differs/);
  const legacy = setup(t), first = sealNativeAdoption(legacy.files, legacy.manifest, legacy.releases);
  const before = Buffer.from(legacy.files.get('localization/adoption.json'));
  for (const release of Object.values(legacy.releases)) release.qa.nativeLocalization.deployment.provider = 'vercel';
  sealNativeAdoption(legacy.files, legacy.manifest, legacy.releases);
  assert.deepEqual(legacy.files.get('localization/adoption.json'), before);
  assert.deepEqual(Object.keys(first.releases.modern.qa.nativeLocalization.deployment), ['id','projectId','state','sourceCommit','publicAlias']);
});

test('qualification can retain a Cloudflare approved parent without promoting provisional native acceptance', t => {
  const f = cloudflareFixture(t), context = { schemaVersion:1,kind:'cars-native-source-qualification-context',id:'fixture-source',dealer:f.manifest.slug,
    scope:'existing-dealer-pilot',sourceCommit:'7'.repeat(40),reviewed:true,reviewedAt:'2026-10-11T10:04:00Z',nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,
    approvedLockSha256:'a'.repeat(64),candidateLockSha256:'b'.repeat(64),sourceDeltaReview:{reference:'docs/releases/delta.json',sha256:'c'.repeat(64),reviewedAt:'2026-10-11T10:04:00Z'} };
  const parent = structuredClone(f.release); parent.qa.evidence = 'docs/releases/accepted.json'; parent.qa.verifiedAt = f.review.verifiedAt;
  const qualified = { ...structuredClone(f.release), status:'qualification',commit:context.sourceCommit,
    source:{...f.release.source,revision:context.sourceCommit},qa:{},qualification:{contextId:context.id,sourceDeltaReview:context.sourceDeltaReview,
      sourceQA:{approvedRelease:parent,releaseSha256:sha256(JSON.stringify(parent)),reference:parent.qa.evidence,sha256:'d'.repeat(64),verifiedAt:parent.qa.verifiedAt},catalogs:f.review.catalogs} };
  validateTemplateQualification('modern', qualified, context, {root:f.root});
  const releases = {...f.releases,modern:qualified}, manifest = structuredClone(f.manifest);
  manifest.templateRevisions.modern = context.sourceCommit; manifest.templateSources.modern = qualified.source;
  sealNativeQualification(f.files, manifest, releases, context, {root:f.root});
  const receipt = assertNativeQualification(f.files, manifest, context, {root:f.root});
  assert.equal(receipt.nativeApproval, false); assert.deepEqual(receipt.pendingNativeChecks, NATIVE_CHECKS);
  assert.throws(() => assertNativeAdoption(f.files, manifest, {root:f.root}), /Provisional/);
  fs.appendFileSync(path.join(f.root, f.review.deployment.hostedReceipt.reference), ' ');
  assert.throws(() => assertNativeQualification(f.files, manifest, context, {root:f.root}), /original proof bytes differ/);
});

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
  for (const [service, settings] of Object.entries(vercel.services)) {
    assert.match(settings.installCommand, /build-native-service\.mjs install /, service);
    assert.match(settings.buildCommand, /--installed/, service);
    assert.doesNotMatch(settings.buildCommand, /npm ci|pnpm install/, service);
  }
  assert.equal(result.assetDelivery.designCount, 3);
  assert.equal(planned.assetDelivery.outputBytes, result.assetDelivery.outputBytes);
  assert.equal(JSON.parse(read(first, '.cars-package.json')).assetDelivery.outputBytes, result.assetDelivery.outputBytes);
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

test('Cars native source locators accept property reordering and reject changed identity', t => {
  const f=setup(t);f.manifest.templateSources={};
  for(const {key} of f.manifest.variants){
    const release=f.releases[key],source={repository:'darkapoparka/cars',revision:release.commit,path:`templates/${key}`,tree:'a'.repeat(40),digest:release.digest};
    release.repository=source.repository;release.source=source;release.snapshotPath=source.path;
    Object.assign(release.qa.nativeLocalization,{repository:source.repository,sourcePath:source.path,sourceTree:source.tree});
    f.manifest.templateSources[key]=Object.fromEntries(Object.entries(source).reverse());
  }
  const adopted=adoptNativeSource(f.files,f.manifest,f.releases);assertNativeAdoption(adopted,f.manifest);
  const changed=structuredClone(f.manifest);changed.templateSources.modern.tree='b'.repeat(40);
  assert.throws(()=>assertNativeAdoption(adopted,changed),/stale native source locator/);
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
  const script = '(function () {\n' + source.slice(source.indexOf('  const config = '), source.indexOf('  const index = ')) + '\nglobalThis.state = {config, choices};\n})();';
  for (const locale of ['en', 'bg']) {
    const config = JSON.parse(source.match(/const embeddedConfig = (.*);/)[1]);
    const context = { URL, URLSearchParams, __CARS_SWITCHER_CONFIG__: config, location: { origin: 'https://dealer.example', pathname: `/variant-2/${locale}/cars` }, document: { documentElement: { lang: locale === 'en' ? 'bg' : 'en' } } };
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
