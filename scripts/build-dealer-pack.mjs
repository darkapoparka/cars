#!/usr/bin/env node
/** Build immutable dealer packs with the existing native provider adapters and
 * six-application composer. All outputs are below runtime/; no provider writes. */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {ROOT, sha256, filesAt, inside, json, writeJson, git} from './lib/workflow.mjs';
import {UK_FAMILY_NODES, UK_NEXT_FAMILIES, artifactInventory, validateFileInventory, copyBuildArtifact, assertCompiledConfig, safeArtifactPath} from './lib/uk-cloudflare-artifacts.mjs';
import {applyCloudflareProvider} from './publishing/cloudflare-provider.mjs';
import {applyCloudflareSvelte, CLOUDFLARE_SVELTE_OUTPUT} from './publishing/cloudflare-svelte.mjs';
import {resolveCloudflareNpmCli} from './publishing/cloudflare-next.mjs';
import {inspectSingleWorkerInputs, packageUkSingleWorker} from './package-uk-single-worker.mjs';
import {prepareSixDesignProviderSource, installDealerDesignSwitcher} from './package-dealer.mjs';
import {baseNativeManifest} from './publishing/app-variant.mjs';
import {assertNativeQualification} from './lib/native-localization.mjs';
import {assertLeadBranding} from './publishing/lead-branding.mjs';
import {assertRetainedDealerLogoSurfaces} from './publishing/logo-surface-bindings.mjs';
import {applyAutoBestCardLayout} from './publishing/auto-best-card-layout.mjs';
import {sealSixVariantBuild} from './publishing/six-variant.mjs';
import {DEALER_PACK_COMPILED_KIND, DEALER_PACK_BUNDLE_KIND, PACK_TARGETS, PACK_IDENTITY_FIELDS, canonicalPackJson, validatePackExecution, validatePackSourceReleases} from './lib/dealer-pack-artifacts.mjs';

export const PROOF_DEALERS = Object.freeze(['za-motors', 'wadishee-used-cars', 'granada-auto-sales']);
export const PACK_TOOLCHAIN = Object.freeze({node: '26.10.0', wrangler: '4.149.0', esbuild: '0.28.2'});
const assert = (condition, message) => { if (!condition) throw Error(message); };
const same = (a, b) => canonicalPackJson(a) === canonicalPackJson(b);
const encoded = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const packModule = () => import('./lib/dealer-pack.mjs');
const assemblyModule = () => import('./assemble-dealer-pack.mjs');
const identityOf = value => Object.fromEntries(PACK_IDENTITY_FIELDS.map(key => [key, value[key]]));

export function parsePackSlugs(value) {
  const slugs = Array.isArray(value) ? value : typeof value === 'string' && value.trim().startsWith('[')
    ? JSON.parse(value) : String(value ?? '').split(/[\s,]+/).filter(Boolean);
  assert(Array.isArray(slugs) && slugs.length > 0 && slugs.length <= 25 &&
    slugs.every(slug => typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 43) &&
    new Set(slugs).size === slugs.length, 'Use 1–25 distinct dealer-pack slugs (43 characters maximum)');
  return slugs;
}

export function packBuildMatrix(slugs) {
  return {include: parsePackSlugs(slugs).flatMap(slug => PACK_TARGETS.map(key => ({slug, key, node: UK_FAMILY_NODES[key]})))};
}

export function packExecution(env = process.env, localId = randomUUID()) {
  return validatePackExecution(env.GITHUB_ACTIONS === 'true'
    ? {kind: 'github-actions', repository: env.GITHUB_REPOSITORY, event: env.GITHUB_EVENT_NAME,
      runId: env.GITHUB_RUN_ID, attempt: env.GITHUB_RUN_ATTEMPT, workflowRef: env.GITHUB_WORKFLOW_REF}
    : {kind: 'local', id: localId});
}

export function sourceFileRows(files) {
  assert(files instanceof Map && files.size > 0, 'Assembly must return the existing source-file Map');
  return [...files].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([name, bytes]) => {
    assert(safeArtifactPath(name) && Buffer.isBuffer(bytes), 'Invalid assembled source member: ' + name);
    return {path: name, bytes: bytes.length, sha256: sha256(bytes)};
  });
}

export function dealerPackToolDigest(root = ROOT) {
  const directory = path.join(root, 'scripts');
  // Bundled resources, including the proposal-introduction WebP assets, are
  // build inputs too; changing one must invalidate shared source and outputs.
  const rows = filesAt(directory, {filter: (name, directory) => directory || !name.endsWith('.test.mjs')})
    .map(name => ({path: name, sha256: sha256(fs.readFileSync(path.join(directory, name)))}));
  return sha256(canonicalPackJson(rows));
}

export function packCacheIdentity({releaseDigest, packDigest, toolDigest, key, platform = process.platform, arch = process.arch}) {
  assert(PACK_TARGETS.includes(key) && [releaseDigest, packDigest, toolDigest].every(value => /^[a-f0-9]{64}$/.test(value ?? '')), 'Invalid dealer-pack cache identity');
  // Downloaded dependencies may be shared across dealers. A compiled output
  // includes dealer facts and therefore must include the pack digest in its key.
  const dependencies = [platform, arch, UK_FAMILY_NODES[key], key, releaseDigest, toolDigest].join('-');
  return {dependencies, compiled: dependencies + '-' + packDigest};
}

export function packSourceCacheKey({sourceCommit, packDigest, releaseDigest, toolDigest}) {
  assert(/^[a-f0-9]{40}$/.test(sourceCommit ?? '') && [packDigest, releaseDigest, toolDigest].every(value => /^[a-f0-9]{64}$/.test(value ?? '')), 'Invalid shared source-cache identity');
  return 'dealer-pack-source-v1-' + sha256(canonicalPackJson({sourceCommit, packDigest, releaseDigest, toolDigest}));
}

export async function dealerPackSourceIdentity({root = ROOT, slug, loadPack} = {}) {
  parsePackSlugs([slug]); loadPack ??= (await packModule()).loadDealerPack;
  const pack = await loadPack(root, slug), sourceReleases = validatePackSourceReleases(pack.manifest.templateSources);
  const identity = {sourceCommit: git(root, ['rev-parse', 'HEAD']), packDigest: pack.packDigest, sourceReleases,
    releaseDigest: sha256(canonicalPackJson(sourceReleases)), toolDigest: dealerPackToolDigest(root)};
  return {...identity, cacheKey: packSourceCacheKey(identity)};
}

export function inspectPackBudget(assets, modules, plan = 'paid') {
  assert(['free', 'paid'].includes(plan) && Array.isArray(assets) && Array.isArray(modules) && modules.length > 0 &&
    [...assets, ...modules].every(row => Number.isSafeInteger(row.bytes) && row.bytes >= 0), 'Invalid measured bundle sizes');
  const assetFiles = assets.length, workerBytes = modules.reduce((total, row) => total + row.bytes, 0);
  const largestAsset = assets.reduce((largest, row) => row.bytes > (largest?.bytes ?? -1) ? row : largest, null);
  assert(assetFiles <= (plan === 'paid' ? 100000 : 20000), 'Cloudflare static-asset file limit exceeded');
  assert((largestAsset?.bytes ?? 0) <= 25 * 1024 ** 2, 'Cloudflare per-asset limit exceeded');
  assert(workerBytes <= 64 * 1024 ** 2, 'Cloudflare Worker module size limit exceeded');
  return {plan, assetFiles, assetBytes: assets.reduce((sum, row) => sum + row.bytes, 0), largestAsset,
    workerModules: modules.length, workerBytes,
    workerCompressedBytes: modules.reduce((sum, row) => sum + (row.compressedBytes ?? 0), 0),
    providerPlanVerified: false};
}

function runtimeArea(root, out) {
  fs.mkdirSync(path.join(root, 'runtime'), {recursive: true});
  return inside(path.join(root, 'runtime'), path.relative(path.join(root, 'runtime'), path.resolve(out)));
}

function materializeFiles(directory, files) {
  assert(!fs.existsSync(directory), 'Retain the existing generated package; use its prepare.json to resume');
  fs.mkdirSync(directory, {recursive: true});
  for (const [name, bytes] of files) {
    assert(safeArtifactPath(name), 'Unsafe generated source path');
    const file = path.join(directory, name); fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, bytes, {flag: 'wx'});
  }
}

export async function readDealerPackSource({root = ROOT, slug, directory, loadPack} = {}) {
  parsePackSlugs([slug]); runtimeArea(root, directory);
  // The shared source includes thousands of assets. Validate the inventory
  // once, then hash each member once, retaining the same complete byte seal.
  const inventory = validateFileInventory(json(inside(directory, 'artifact-manifest.json', {mustExist: true})));
  const names = filesAt(directory, {filter: () => true}).filter(name => name !== 'artifact-manifest.json');
  assert(same(names, inventory.files.map(row => row.path).sort()), 'Artifact contains missing or undeclared files.');
  const retained = new Map();
  for (const row of inventory.files) {
    const bytes = fs.readFileSync(inside(directory, row.path, {mustExist: true}));
    assert(bytes.length === row.bytes && sha256(bytes) === row.sha256, 'Artifact receipt bytes differ: ' + row.path);
    retained.set(row.path, bytes);
  }
  const source = JSON.parse(retained.get('source.json'));
  const expected = await dealerPackSourceIdentity({root, slug, loadPack});
  assert(inventory.kind === 'cars-dealer-pack-source' && inventory.dealer === slug &&
    source.schemaVersion === 1 && source.kind === inventory.kind && source.dealer === slug &&
    Object.keys(expected).every(key => same(source[key], expected[key])) && source.providerWrites === false &&
    source.manifest?.slug === slug && source.manifest.packaging?.version === '5' &&
    same(source.manifest.templateSources, expected.sourceReleases), 'Cached dealer-pack source identity changed');
  const sourceRoot = inside(directory, 'source', {mustExist: true});
  const files = new Map([...retained].filter(([name]) => name.startsWith('source/')).map(([name, bytes]) => [name.slice('source/'.length), bytes]));
  const rows = sourceFileRows(files);
  assert(same(rows, source.inputFiles) && source.sourceDigest === sha256(canonicalPackJson(rows)) &&
    same(JSON.parse(files.get('dealer.json')), source.manifest), 'Cached dealer-pack source bytes changed');
  return {...source, files, sourceRoot};
}

export async function prepareDealerPackSource({root = ROOT, slug, out, assemble, loadPack} = {}) {
  const area = runtimeArea(root, out ?? path.join(root, 'runtime/dealer-packs', slug, 'source-work'));
  const artifactRoot = path.join(area, 'artifact');
  if (fs.existsSync(artifactRoot)) {
    const {files, sourceRoot, ...source} = await readDealerPackSource({root, slug, directory: artifactRoot, loadPack});
    return {...source, artifactRoot, cacheHit: true};
  }
  const expected = await dealerPackSourceIdentity({root, slug, loadPack}), started = Date.now();
  assemble ??= (await assemblyModule()).assembleDealerPack;
  const assembled = await assemble({root, slug, out: path.join(area, 'assembly'), materialize: false});
  assert(assembled.packDigest === expected.packDigest && assembled.manifest?.slug === slug &&
    assembled.manifest.packaging?.version === '5' && same(assembled.manifest.templateSources, expected.sourceReleases), 'Dealer pack changed during source assembly');
  const rows = sourceFileRows(assembled.files), sourceDigest = sha256(canonicalPackJson(rows));
  assert(same(expected, await dealerPackSourceIdentity({root, slug, loadPack})), 'Dealer pack or build tools changed during source assembly');
  const source = {schemaVersion: 1, kind: 'cars-dealer-pack-source', dealer: slug, ...expected, sourceDigest,
    manifest: assembled.manifest, inputFiles: rows,
    qualification: {...(assembled.qualification ?? {}), hostedVerified: false, providerWrites: false},
    startedAt: new Date(started).toISOString(), finishedAt: new Date().toISOString(), milliseconds: Date.now() - started,
    providerWrites: false};
  materializeFiles(path.join(artifactRoot, 'source'), assembled.files);
  writeJson(path.join(artifactRoot, 'source.json'), source);
  artifactInventory(artifactRoot, {kind: source.kind, dealer: slug, status: 'passed'});
  return {...source, artifactRoot, cacheHit: false};
}

export async function prepareDealerPackBuild({root = ROOT, slug, key, out, sourceArtifact, toolPackage = process.env.CARS_DEALER_PACK_TOOL_PACKAGE ?? path.join(root, 'runtime/dealer-pack-tools/package.json'), capacityPlan = 'paid', execution = packExecution(), assemble, loadPack} = {}) {
  parsePackSlugs([slug]); assert(PACK_TARGETS.includes(key), 'Unknown dealer-pack build target');
  assert(['free', 'paid'].includes(capacityPlan), 'Select free or paid capacity limits'); validatePackExecution(execution);
  const area = runtimeArea(root, out ?? path.join(root, 'runtime/dealer-packs', slug, 'targets', key));
  assert(!fs.existsSync(path.join(area, 'prepare.json')), 'Prepared input already exists; compile the retained prepare.json');
  const startedAt = new Date().toISOString();
  sourceArtifact ??= (await prepareDealerPackSource({root, slug, out: path.join(area, 'source-work'), assemble, loadPack})).artifactRoot;
  const assembled = await readDealerPackSource({root, slug, directory: sourceArtifact, loadPack});
  let files = assembled.files;
  const manifest = structuredClone(assembled.manifest);
  assert(manifest?.slug === slug && manifest.packaging?.version === '5', 'Assembled pack must use the six-design manifest');
  const sourceReleases = validatePackSourceReleases(assembled.sourceReleases ?? manifest.templateSources);
  const workerName = manifest.cloudflare?.workerPrefix ?? 'cars-' + slug;
  assert(/^[a-z][a-z0-9-]{0,47}$/.test(workerName), 'Dealer Worker name is too long for the maintained router');
  const publicOrigin = manifest.shareIdentity?.publicOrigin, canonical = new URL(publicOrigin);
  assert(canonical.protocol === 'https:' && canonical.origin === publicOrigin && !canonical.username && !canonical.password,
    'Dealer pack must retain its explicit canonical share origin');
  const {sourceDigest, releaseDigest, toolDigest, sourceCommit, packDigest} = assembled;
  const qualification = {...(assembled.qualification ?? {}), hostedVerified: false, providerWrites: false};
  const identity = {sourceCommit, sourceDigest, sourceReleases, packDigest, releaseDigest, toolDigest,
    execution, publicOrigin, providerOrigin: 'https://' + workerName + '.darkapoparka1.workers.dev', capacityPlan, qualification};
  // The original native qualification stays a provisional, exact source
  // receipt. Verify it before mounting or provider transforms change bytes.
  loadPack ??= (await packModule()).loadDealerPack;
  const pack = await loadPack(root, slug);
  assert(pack.packDigest === packDigest, 'Dealer pack changed before provider preparation');
  assertNativeQualification(files, baseNativeManifest(manifest), pack.qualification, {root});
  if (manifest.branding?.required) assertLeadBranding(files, manifest);
  assertRetainedDealerLogoSurfaces(files, manifest);
  const sourceRequire = createRequire(path.resolve(toolPackage)), sharp = sourceRequire('sharp'), typescript = sourceRequire('typescript');
  assert(sharp.versions.sharp === '0.35.5' && typescript.version === '6.0.3', 'Use the exact existing source preparation tools: sharp 0.35.5 and typescript 6.0.3');
  files = await prepareSixDesignProviderSource(files, manifest, {provider: 'cloudflare', shareOptions: {sharp, typescript}});
  applyAutoBestCardLayout(files, manifest);
  await installDealerDesignSwitcher(files, manifest);
  files.set('dealer.json', encoded(manifest));
  const adapted = await applyCloudflareProvider(files, manifest, {workerPrefix: workerName,
    svelteAdapter: (input, data, options) => applyCloudflareSvelte(input, data,
      {...options, serviceKeys: !UK_NEXT_FAMILIES.has(key) && key !== 'router' ? [key] : ['auto-best', 'import', 'karento-best']})});
  adapted.set('scripts/build-cloudflare-svelte.mjs', fs.readFileSync(path.join(root, 'scripts/publishing/cloudflare-svelte.mjs')));
  sealSixVariantBuild(adapted, manifest, {provider: 'cloudflare'});
  const familyRoot = key === 'router' ? 'cloudflare' : key;
  const retained = new Map([...adapted].filter(([name]) => name.startsWith(familyRoot + '/') || name.startsWith('scripts/') || !name.includes('/')));
  const packageRoot = path.join(area, 'source'); materializeFiles(packageRoot, retained);
  const prepared = {schemaVersion: 1, kind: 'cars-dealer-pack-prepared-build', dealer: slug, key, ...identity,
    workerName, node: UK_FAMILY_NODES[key], packageRoot, area, inputFiles: sourceFileRows(retained),
    cache: packCacheIdentity({...identity, key}), startedAt, finishedAt: new Date().toISOString(), providerWrites: false};
  writeJson(path.join(area, 'prepare.json'), prepared); return prepared;
}

function installedBin(root, name) {
  const require = createRequire(path.join(root, 'package.json'));
  for (const directory of require.resolve.paths(name) ?? []) {
    const file = path.join(directory, name, 'package.json');
    if (fs.existsSync(file)) { const pkg = json(file); if (pkg.name === name) return path.resolve(path.dirname(file), typeof pkg.bin === 'string' ? pkg.bin : pkg.bin[name]); }
  }
  throw Error('Installed build tool is missing: ' + name);
}

export function dealerPackBuildEnvironment(cacheRoot, inherited = process.env) {
  const env = {...inherited, CI: 'true', NEXT_TELEMETRY_DISABLED: '1', WRANGLER_SEND_METRICS: 'false', WRANGLER_LOG_SANITIZE: 'true',
    CARS_CLOUDFLARE_SVELTE_NPM_CACHE: path.join(cacheRoot, 'npm'),
    npm_config_cache: path.join(cacheRoot, 'npm'), npm_config_store_dir: path.join(cacheRoot, 'pnpm'), XDG_CACHE_HOME: path.join(cacheRoot, 'xdg')};
  for (const name of Object.keys(env)) if (/^(?:CLOUDFLARE|CF)_(?:API_(?:TOKEN|KEY)|TOKEN)$|^WRANGLER_(?:API_TOKEN|TOKEN)$|^(?:GH_TOKEN|GITHUB_TOKEN|NODE_AUTH_TOKEN|NPM_TOKEN)$/.test(name)) delete env[name];
  return env;
}

async function runStage({area, name, args, cwd, cacheRoot, command = process.execPath}) {
  const started = Date.now(), log = path.join(area, 'logs', name + '.log'); fs.mkdirSync(path.dirname(log), {recursive: true});
  const fd = fs.openSync(log, 'wx');
  let result;
  try {
    result = await new Promise((resolve, reject) => {
      const child = spawn(command, args, {cwd, env: dealerPackBuildEnvironment(cacheRoot), stdio: ['ignore', fd, fd], windowsHide: true});
      const timeout = setTimeout(() => { child.kill(); reject(Error(name + ' exceeded 40 minutes')); }, 40 * 60 * 1000);
      child.once('error', error => { clearTimeout(timeout); reject(error); });
      child.once('close', (code, signal) => { clearTimeout(timeout); resolve({code, signal}); });
    });
  } finally { fs.closeSync(fd); }
  const step = {phase: name, command: path.basename(command), args, cwd, milliseconds: Date.now() - started,
    exitCode: result.code, signal: result.signal, passed: result.code === 0, log};
  const history = path.join(area, 'steps.json'), steps = fs.existsSync(history) ? json(history) : []; steps.push(step); writeJson(history, steps);
  assert(step.passed, name + ' failed; see ' + log); return step;
}

export function verifyPreparedPackSource(packageRoot, expectedRows) {
  const actualInputs = new Map(filesAt(packageRoot, {filter: () => true}).map(name => [name, fs.readFileSync(inside(packageRoot, name, {mustExist: true}))]));
  assert(same(sourceFileRows(actualInputs), expectedRows), 'Prepared source contains changed, missing or undeclared files');
}

export async function compileDealerPackBuild({root = ROOT, preparedFile, run = runStage, loadPack} = {}) {
  const prepared = json(preparedFile), {dealer: slug, key, packageRoot, area} = prepared;
  assert(prepared.kind === 'cars-dealer-pack-prepared-build' && PACK_TARGETS.includes(key), 'Invalid prepared dealer-pack build');
  assert(runtimeArea(root, area) === path.resolve(area) && inside(area, 'source', {mustExist: true}) === packageRoot, 'Prepared source escaped its generated output');
  assert(prepared.node === UK_FAMILY_NODES[key] && process.version === 'v' + prepared.node, key + ' requires Node ' + UK_FAMILY_NODES[key] + '; use the pipeline workflow or an explicit pinned Node executable');
  assert(git(root, ['rev-parse', 'HEAD']) === prepared.sourceCommit && dealerPackToolDigest(root) === prepared.toolDigest, 'Build tools changed after preparation');
  loadPack ??= (await packModule()).loadDealerPack;
  assert((await loadPack(root, slug)).packDigest === prepared.packDigest, 'Dealer pack changed after preparation');
  verifyPreparedPackSource(packageRoot, prepared.inputFiles);
  const artifact = path.join(area, 'artifact'); assert(!fs.existsSync(artifact), 'Retain the existing build artifact; do not overwrite a completed or failed attempt'); fs.mkdirSync(artifact);
  const startedAt = new Date().toISOString(), started = Date.now(), cacheRoot = path.join(root, 'runtime/dealer-pack-cache', prepared.releaseDigest, key);
  const result = {schemaVersion: 1, kind: 'cars-dealer-pack-family-build', dealer: slug, key, ...identityOf(prepared),
    status: 'running', compiled: false, dryRun: false, startedAt, node: process.version, providerWrites: false};
  const stage = (name, args, cwd = packageRoot) => run({area, name, args, cwd, cacheRoot});
  try {
    let target, bundle;
    if (key === 'router') {
      target = {config: 'cloudflare/wrangler.jsonc', main: 'cloudflare/router.mjs', assets: 'cloudflare/public', workerName: prepared.workerName, root: 'cloudflare'};
      await stage('router-install', [resolveCloudflareNpmCli(process.execPath, fs, path), 'ci', '--include=dev'], path.join(packageRoot, 'cloudflare'));
      bundle = 'cloudflare/.cars-cloudflare/worker';
      await stage('router-dry-run', [installedBin(path.join(packageRoot, 'cloudflare'), 'wrangler'), 'deploy', '--dry-run', '--outdir', path.join(packageRoot, bundle)], path.join(packageRoot, 'cloudflare'));
      for (const name of [target.config, target.main, target.assets, bundle]) copyBuildArtifact(path.join(packageRoot, name), path.join(artifact, 'compiled', name));
    } else if (UK_NEXT_FAMILIES.has(key)) {
      const entry = json(path.join(packageRoot, '.cars-cloudflare-next.json')).targets.find(row => row.key === key);
      assert(entry, 'Missing generated Next target');
      const helper = path.join(packageRoot, 'scripts/build-cloudflare-next.mjs');
      for (const phase of ['install', 'build', 'freeze']) await stage(key + '-' + phase, [helper, phase, key]);
      target = {...entry, config: entry.generatedConfig}; bundle = entry.root + '/.cars-cloudflare/worker';
      await stage(key + '-dry-run', [installedBin(path.join(packageRoot, entry.root), 'wrangler'), 'deploy', '--dry-run', '--config', path.join(packageRoot, target.config), '--outdir', path.join(packageRoot, bundle)], path.join(packageRoot, entry.root));
      for (const name of [entry.root + '/dist', bundle]) copyBuildArtifact(path.join(packageRoot, name), path.join(artifact, 'compiled', name));
      for (const name of ['.cars-next-' + key + '-dependencies.json', '.cars-next-' + key + '-frozen-lock.json']) copyBuildArtifact(path.join(packageRoot, name), path.join(artifact, 'receipts', name));
    } else {
      const helper = path.join(packageRoot, 'scripts/build-cloudflare-svelte.mjs');
      if (key === 'auto-best') await stage('auto-best-locales', [path.join(packageRoot, key, 'scripts/build-locales.mjs')], path.join(packageRoot, key));
      for (const phase of ['dependencies', 'build', 'dry-run']) await stage(key + '-' + phase, [helper, key, phase]);
      await stage(key + '-freeze', [helper, 'freeze']);
      target = {root: key, config: key + '/wrangler.json', main: key + '/' + CLOUDFLARE_SVELTE_OUTPUT.main,
        assets: key + '/' + CLOUDFLARE_SVELTE_OUTPUT.assets, workerName: json(path.join(packageRoot, key, 'wrangler.json')).name};
      bundle = key + '/' + CLOUDFLARE_SVELTE_OUTPUT.bundle;
      for (const name of [target.config, key + '/.svelte-kit/cloudflare', key + '/.svelte-kit/cloudflare-worker', bundle]) copyBuildArtifact(path.join(packageRoot, name), path.join(artifact, 'compiled', name));
      for (const name of ['.cars-cloudflare-svelte-locks.json', '.cars-build-assets/' + key + '.cloudflare-dependencies.json', '.cars-build-assets/' + key + '.cloudflare-build.json']) copyBuildArtifact(path.join(packageRoot, name), path.join(artifact, 'receipts', name));
    }
    const config = json(path.join(packageRoot, target.config)); assertCompiledConfig(config, target, {router: key === 'router'});
    const assets = filesAt(path.join(packageRoot, target.assets), {filter: () => true}).filter(name => !name.endsWith('.map') && !['.assetsignore', '_routes.json', '_headers', '_redirects'].includes(name) && !name.startsWith('_worker.js'))
      .map(name => ({path: name, bytes: fs.statSync(path.join(packageRoot, target.assets, name)).size}));
    const modules = filesAt(path.join(packageRoot, bundle), {filter: () => true}).filter(name => !name.endsWith('.map') && !/^README(?:\.|$)/i.test(path.basename(name)))
      .map(name => { const bytes = fs.readFileSync(path.join(packageRoot, bundle, name)); return {path: name, bytes: bytes.length, compressedBytes: gzipSync(bytes).length}; });
    const output = inspectPackBudget(assets, modules, prepared.capacityPlan), main = UK_NEXT_FAMILIES.has(key) || key === 'router' ? target.main : bundle + '/index.js';
    const upload = {...config, main, assets: {...config.assets, directory: target.assets}, no_bundle: true}; delete upload.$schema;
    assert(!upload.build?.command && !upload.route && !upload.routes?.length && !upload.durable_objects?.bindings?.length && !upload.containers?.length, 'Unexpected deployment-side resource');
    writeJson(path.join(artifact, 'compiled/deploy.json'), upload);
    const compiledFiles = filesAt(path.join(artifact, 'compiled'), {filter: () => true}).map(name => { const bytes = fs.readFileSync(path.join(artifact, 'compiled', name)); return {path: 'compiled/' + name, bytes: bytes.length, sha256: sha256(bytes)}; });
    const deploy = {schemaVersion: 1, kind: DEALER_PACK_COMPILED_KIND, dealer: slug, key, provider: 'cloudflare', ...identityOf(prepared),
      workerName: target.workerName, configPath: 'compiled/deploy.json', mainPath: 'compiled/' + main, assetPath: 'compiled/' + target.assets,
      compiledFiles, compiledDigest: sha256(JSON.stringify(compiledFiles)), output, compiled: true, dryRun: true,
      hosted: false, credentialsIncluded: false, nativeApproval: false};
    assert((await loadPack(root, slug)).packDigest === prepared.packDigest, 'Dealer pack changed during compilation');
    writeJson(path.join(artifact, 'deploy.json'), deploy);
    writeJson(path.join(artifact, 'receipts/source.json'), {schemaVersion: 1, kind: 'cars-dealer-pack-build-source', dealer: slug, key,
      ...identityOf(prepared), originalPackUnchanged: true});
    Object.assign(result, {status: 'passed', compiled: true, dryRun: true, workerName: target.workerName, compiledDigest: deploy.compiledDigest, output});
  } catch (error) { Object.assign(result, {status: 'failed', error: error.message}); throw error; }
  finally {
    Object.assign(result, {finishedAt: new Date().toISOString(), milliseconds: Date.now() - started});
    writeJson(path.join(artifact, 'receipts/build.json'), result); writeJson(path.join(area, 'build-report.json'), result);
    if (fs.existsSync(path.join(area, 'steps.json'))) copyBuildArtifact(path.join(area, 'steps.json'), path.join(artifact, 'receipts/steps.json'));
    artifactInventory(artifact, {kind: DEALER_PACK_COMPILED_KIND, dealer: slug, key, status: result.status});
  }
  return {...result, artifact};
}

export function packInputDirectories(inputRoot, slug) {
  const result = {};
  for (const name of fs.readdirSync(inputRoot)) {
    const directory = path.join(inputRoot, name), manifest = path.join(directory, 'artifact-manifest.json');
    if (!fs.statSync(directory).isDirectory() || !fs.existsSync(manifest)) continue;
    const inventory = json(manifest);
    assert(inventory.dealer === slug && inventory.kind === DEALER_PACK_COMPILED_KIND && PACK_TARGETS.includes(inventory.key) && !result[inventory.key], 'Duplicate or foreign compiled artifact');
    result[inventory.key] = directory;
  }
  assert(same(Object.keys(result).sort(), [...PACK_TARGETS].sort()), 'Exactly seven dealer-pack compiled artifacts are required'); return result;
}

export function assertCompilerToolDirectory(area, expectedPackage, lockBytes) {
  const packageFile = path.join(area, 'package.json'), lockFile = path.join(area, 'package-lock.json');
  assert(!fs.existsSync(packageFile) || same(json(packageFile), expectedPackage), 'Existing tool directory contains other dependencies; use a separate compiler directory');
  assert(!fs.existsSync(lockFile) || fs.readFileSync(lockFile).equals(lockBytes), 'Existing compiler dependency lock differs; retain it and use a fresh compiler directory');
}

export async function preparePackTools({root = ROOT, out = path.join(root, 'runtime/dealer-pack-compiler-tools'), run = runStage} = {}) {
  assert(process.version === 'v' + PACK_TOOLCHAIN.node, 'Singleton compiler requires Node ' + PACK_TOOLCHAIN.node);
  const area = runtimeArea(root, out);
  const lockBytes = fs.readFileSync(path.join(root, 'scripts/publishing/cloudflare-router-lock.json')), lock = JSON.parse(lockBytes);
  assert(lock.packages['node_modules/wrangler'].version === PACK_TOOLCHAIN.wrangler && lock.packages['node_modules/esbuild'].version === PACK_TOOLCHAIN.esbuild, 'Unexpected singleton toolchain lock');
  const definition = {name: lock.name, private: true, devDependencies: lock.packages[''].devDependencies};
  assertCompilerToolDirectory(area, definition, lockBytes);
  if (fs.existsSync(path.join(area, 'package.json')) && fs.existsSync(path.join(area, 'package-lock.json'))) {
    try {
      const require = createRequire(path.join(area, 'package.json'));
      if (require('esbuild').version === PACK_TOOLCHAIN.esbuild && require('wrangler/package.json').version === PACK_TOOLCHAIN.wrangler) return path.join(area, 'package.json');
    } catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
  }
  fs.mkdirSync(area, {recursive: true});
  writeJson(path.join(area, 'package.json'), definition);
  fs.writeFileSync(path.join(area, 'package-lock.json'), lockBytes);
  await run({area, name: 'tools-install-' + randomUUID(), args: [resolveCloudflareNpmCli(process.execPath, fs, path), 'ci', '--include=dev'], cwd: area, cacheRoot: path.join(root, 'runtime/dealer-pack-cache/tools')});
  return path.join(area, 'package.json');
}

export async function composeDealerPackBuild({root = ROOT, slug, inputRoot, out, toolPackage, run = runStage, loadPack} = {}) {
  parsePackSlugs([slug]);
  assert(process.version === 'v' + PACK_TOOLCHAIN.node, 'Singleton compiler requires Node ' + PACK_TOOLCHAIN.node);
  const started = Date.now(), area = runtimeArea(root, out ?? path.join(root, 'runtime/dealer-packs', slug));
  fs.mkdirSync(area, {recursive: true});
  const inputs = packInputDirectories(inputRoot, slug), {identity, inputKind} = inspectSingleWorkerInputs({inputs, expectedDealer: slug});
  assert(inputKind === 'dealer-pack' && identity.toolDigest === dealerPackToolDigest(root), 'Pack composition tools differ from the compiled source');
  loadPack ??= (await packModule()).loadDealerPack; assert((await loadPack(root, slug)).packDigest === identity.packDigest, 'Pack changed after compilation');
  toolPackage ??= await preparePackTools({root});
  const require = createRequire(path.resolve(toolPackage)), esbuild = require('esbuild'), wranglerPath = require.resolve('wrangler/package.json'), wrangler = json(wranglerPath);
  assert(esbuild.version === PACK_TOOLCHAIN.esbuild && wrangler.version === PACK_TOOLCHAIN.wrangler, 'Unreviewed singleton compiler version');
  const bundleRoot = path.join(area, 'bundle'), receipt = packageUkSingleWorker({inputs, destination: bundleRoot, expectedDealer: slug, esbuild});
  await run({area, name: 'singleton-dry-run', args: [path.join(path.dirname(wranglerPath), 'wrangler-dist/cli.js'), 'deploy', '--dry-run', '--no-bundle', '--config', path.join(bundleRoot, 'wrangler.json'), '--outdir', path.join(area, 'dry-run')], cwd: bundleRoot, cacheRoot: path.join(root, 'runtime/dealer-pack-cache/tools')});
  const familyBuilds = Object.fromEntries(PACK_TARGETS.map(key => [key, json(path.join(inputs[key], 'receipts/build.json'))]));
  const report = {schemaVersion: 1, kind: 'cars-dealer-pack-build', slug, status: 'passed', ...identityOf(identity),
    bundleRoot, workerName: receipt.workerName, applicationCount: 6, workerCount: 1, serviceBindings: [],
    outputDigest: receipt.outputDigest, assetFiles: receipt.assetFiles, serverBytes: receipt.serverBytes,
    compressedBytes: receipt.compressedBytes, familyBuilds, milliseconds: Date.now() - started,
    familyMilliseconds: Object.values(familyBuilds).reduce((sum, build) => sum + build.milliseconds, 0),
    startedAt: new Date(started).toISOString(), finishedAt: new Date().toISOString(), compiled: true,
    dryRun: true, providerWrites: false, hostedVerified: false, ownerAccepted: false};
  writeJson(path.join(area, 'build-report.json'), report);
  artifactInventory(bundleRoot, {kind: DEALER_PACK_BUNDLE_KIND, dealer: slug, status: 'passed'});
  return report;
}

export function parsePackBuildArgs(argv) {
  const [command, ...rest] = argv, options = {};
  assert(['matrix', 'source-key', 'source', 'prepare', 'compile', 'compose', 'tools', 'build'].includes(command), 'Use matrix, source-key, source, prepare, compile, compose, tools or build');
  for (let i = 0; i < rest.length; i += 2) {
    const name = rest[i]; assert(['--slug', '--slugs', '--family', '--out', '--prepared', '--source', '--inputs', '--tools', '--plan', '--execution', '--node-paths'].includes(name) && rest[i + 1] && !rest[i + 1].startsWith('--') && !Object.hasOwn(options, name.slice(2)), 'Invalid or repeated build option: ' + name);
    options[name.slice(2)] = rest[i + 1];
  }
  return {command, options};
}

export async function runPackBuildCli(argv = process.argv.slice(2)) {
  if (argv.includes('--help')) { console.log('Usage: node scripts/build-dealer-pack.mjs build --slug SLUG [--node-paths runtimes.json]\nCI: matrix --slugs LIST | source-key --slug SLUG | source --slug SLUG --out runtime/SOURCE | prepare --slug SLUG --family KEY --source runtime/SOURCE/artifact --out runtime/AREA | compile --prepared runtime/AREA/prepare.json | compose --slug SLUG --inputs DIRECTORY [--tools PACKAGE_JSON]\nAll commands are provider-free. Build uses pinned Node runtimes; node-paths maps versions to installed Node executables.'); return; }
  const {command, options: o} = parsePackBuildArgs(argv);
  if (command === 'matrix') { console.log(JSON.stringify({matrix: packBuildMatrix(o.slugs ?? PROOF_DEALERS), dealers: parsePackSlugs(o.slugs ?? PROOF_DEALERS)})); return; }
  if (command === 'source-key') return dealerPackSourceIdentity({slug: o.slug});
  if (command === 'source') { const {inputFiles, manifest, ...report} = await prepareDealerPackSource({slug: o.slug, out: o.out}); return report; }
  if (command === 'prepare') return prepareDealerPackBuild({slug: o.slug, key: o.family, out: o.out, sourceArtifact: o.source, ...(o.tools ? {toolPackage: o.tools} : {}), capacityPlan: o.plan ?? 'paid', ...(o.execution ? {execution: JSON.parse(o.execution)} : {})});
  if (command === 'compile') return compileDealerPackBuild({preparedFile: o.prepared});
  if (command === 'compose') return composeDealerPackBuild({slug: o.slug, inputRoot: o.inputs, out: o.out, toolPackage: o.tools});
  if (command === 'tools') return preparePackTools({...(o.out ? {out: o.out} : {})});
  assert(process.version === 'v' + PACK_TOOLCHAIN.node, 'Start the full local build with Node ' + PACK_TOOLCHAIN.node + '; --node-paths supplies the other family runtimes');
  parsePackSlugs([o.slug]);
  const nodePaths = o['node-paths'] ? json(o['node-paths']) : {}, execution = packExecution(), area = runtimeArea(ROOT, o.out ?? path.join(ROOT, 'runtime/dealer-packs', o.slug));
  const inputs = path.join(area, 'inputs'); fs.mkdirSync(inputs, {recursive: true});
  const {artifactRoot: sourceArtifact} = await prepareDealerPackSource({slug: o.slug, out: path.join(area, 'source-work')});
  for (const key of PACK_TARGETS) {
    const prepared = await prepareDealerPackBuild({slug: o.slug, key, out: path.join(area, 'targets', key), sourceArtifact, capacityPlan: o.plan ?? 'paid', execution});
    const node = process.version === 'v' + prepared.node ? process.execPath : nodePaths[prepared.node];
    assert(typeof node === 'string' && path.isAbsolute(node) && fs.existsSync(node), 'Install Node ' + prepared.node + ' and pass its executable in --node-paths; existing artifacts are retained');
    await runStage({area: prepared.area, name: 'compile-family', command: node, args: [path.join(ROOT, 'scripts/build-dealer-pack.mjs'), 'compile', '--prepared', path.join(prepared.area, 'prepare.json')], cwd: ROOT, cacheRoot: path.join(ROOT, 'runtime/dealer-pack-cache', prepared.releaseDigest, key)});
    copyBuildArtifact(path.join(prepared.area, 'artifact'), path.join(inputs, key));
  }
  return composeDealerPackBuild({slug: o.slug, inputRoot: inputs, out: area, toolPackage: o.tools});
}

if (isEntrypoint(import.meta.url)) runPackBuildCli().then(result => { if (result !== undefined) console.log(JSON.stringify(result, null, 2)); }).catch(error => { console.error(error.message); process.exitCode = 1; });
