#!/usr/bin/env node
/** Fast, provider-free dealer lanes. Reuse release dependencies and exact pure
 * composition transforms; freshly compile every dealer's six native apps.
 * No source/native archives, cross-dealer compiled cache or runtime rewrite. */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {ROOT, filesAt, inside, json, writeJson, sha256, git} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {assembleDealerPack} from './assemble-dealer-pack.mjs';
import {loadPreparedDealerPack} from './prepare-dealer-pack-logo.mjs';
import {loadDealerPack} from './lib/dealer-pack.mjs';
import {prepareSixDesignProviderSource, installDealerDesignSwitcher} from './package-dealer.mjs';
import {applyAutoBestCardLayout} from './publishing/auto-best-card-layout.mjs';
import {applyCloudflareProvider} from './publishing/cloudflare-provider.mjs';
import {CLOUDFLARE_SVELTE_OUTPUT} from './publishing/cloudflare-svelte.mjs';
import {resolveCloudflareNpmCli, freezeCloudflareNextDependencies} from './publishing/cloudflare-next.mjs';
import {sealSixVariantBuild} from './publishing/six-variant.mjs';
import {UK_FAMILY_NODES, UK_NEXT_FAMILIES, artifactInventory, copyBuildArtifact, assertCompiledConfig} from './lib/uk-cloudflare-artifacts.mjs';
import {PACK_TARGETS, PACK_IDENTITY_FIELDS, DEALER_PACK_COMPILED_KIND, DEALER_PACK_BUNDLE_KIND, canonicalPackJson, createDealerPackComposition, dealerPackCompositionDigest, validatePackSourceReleases} from './lib/dealer-pack-artifacts.mjs';
import {packExecution, sourceFileRows, dealerPackToolDigest, dealerPackBuildEnvironment, inspectPackBudget, PACK_TOOLCHAIN} from './build-dealer-pack.mjs';
import {packageUkSingleWorker, inspectSingleWorkerInputs} from './package-uk-single-worker.mjs';
import {fastWorkspaceKey, assertGeneratedRuntimeDirectory, syncFastWorkspace, verifyFastWorkspaceInputs, cachedCompositionCompiler, settledLanes} from './lib/dealer-pack-fast-workspace.mjs';

const assert = (condition, message) => {if (!condition) throw Error(message);};
const same = (a, b) => canonicalPackJson(a) === canonicalPackJson(b);
const encoded = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const identityOf = value => Object.fromEntries(PACK_IDENTITY_FIELDS.map(key => [key, value[key]]));
const FAST_KIND = 'cars-dealer-pack-fast-build';
const sourceRoots = {router: 'cloudflare', 'auto-best': 'auto-best', import: 'import', 'karento-best': 'karento-best', modern: 'modern/apps/web', app: 'app', mobile: 'mobile'};

export function parseFastSlugs(value) {
  const slugs = Array.isArray(value) ? value : String(value ?? '').trim().startsWith('[') ? JSON.parse(value) : String(value ?? '').split(/[\s,]+/).filter(Boolean);
  assert(Array.isArray(slugs) && slugs.length > 0 && slugs.length <= 100 && new Set(slugs).size === slugs.length && slugs.every(slug => typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 43), 'Use one to 100 distinct canonical pack slugs (43 characters maximum after migration)');
  return slugs;
}

function installedPackage(root, name) {
  const require = createRequire(path.join(root, 'package.json'));
  for (const directory of require.resolve.paths(name) ?? []) {
    const file = path.join(directory, name, 'package.json');
    if (fs.existsSync(file)) {const pkg = json(file);if (pkg.name === name) return {pkg, directory: path.dirname(file)};}
  }
  throw Error('Installed build package missing: ' + name);
}
function installedBin(root, name) {
  const {pkg, directory} = installedPackage(root, name), entry = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.[name];
  assert(entry, 'Installed build package has no expected executable: ' + name);return path.resolve(directory, entry);
}

export async function runFastStage({command = process.execPath, args, cwd, log, cacheRoot, phase, timeoutMs = 40 * 60 * 1000}) {
  const started = Date.now();fs.mkdirSync(path.dirname(log), {recursive: true});
  const fd = fs.openSync(log, 'wx');let result;
  try {
    result = await new Promise((resolve, reject) => {
      const child = spawn(command, args, {cwd, env: dealerPackBuildEnvironment(cacheRoot), stdio: ['ignore', fd, fd], windowsHide: true, detached: process.platform !== 'win32'});
      const timer = setTimeout(() => {
        // npm/frameworks spawn their own descendants. End the whole owned
        // process group when a phase exceeds its limit, not only its wrapper.
        try {if (process.platform !== 'win32' && child.pid) process.kill(-child.pid, 'SIGTERM');else child.kill();} catch (error) {if (error.code !== 'ESRCH') throw error;}
        reject(Error(phase + ' exceeded its build time limit'));
      }, timeoutMs);
      child.once('error', error => {clearTimeout(timer);reject(error);});
      child.once('close', (code, signal) => {clearTimeout(timer);resolve({code, signal});});
    });
  } finally {fs.closeSync(fd);}
  const row = {phase, command: path.basename(command), args, milliseconds: Date.now() - started, exitCode: result.code, signal: result.signal, passed: result.code === 0, log};
  if (!row.passed) {const error = Error(phase + ' failed; see ' + log);error.step = row;throw error;}
  return row;
}

function clearCompiledOutputs(packageRoot, key) {
  const root = sourceRoots[key], names = key === 'router' ? [root + '/.cars-cloudflare'] : UK_NEXT_FAMILIES.has(key)
    ? [root + '/dist', root + '/.vinext', root + '/.wrangler', root + '/.cloudflare', root + '/.cars-cloudflare']
    : [key + '/.svelte-kit/output', key + '/.svelte-kit/cloudflare', key + '/.svelte-kit/cloudflare-worker', key + '/.cars-cloudflare', key + '/.wrangler'];
  for (const name of names) {
    const file = inside(packageRoot, name);
    if (fs.existsSync(file)) {assert(!fs.lstatSync(file).isSymbolicLink(), 'Linked compiled output refused');fs.rmSync(file, {recursive: true});}
  }
}

/** Runs under the family's exact Node, as in M1. The only skipped phase is
 * dependency installation after the maintained helper verifies its old pins. */
export async function compileFastDealerFamily({preparedFile, run = runFastStage} = {}) {
  const prepared = json(preparedFile), {root, dealer: slug, key, packageRoot, artifact, logRoot, cacheRoot} = prepared;
  assert(prepared.kind === 'cars-dealer-pack-fast-prepared' && PACK_TARGETS.includes(key), 'Invalid fast native preparation');
  assert(process.version === 'v' + UK_FAMILY_NODES[key], key + ' requires Node ' + UK_FAMILY_NODES[key]);
  for (const directory of [packageRoot, artifact, logRoot, cacheRoot]) assertGeneratedRuntimeDirectory(root, directory);
  assert(prepared.workerName === 'cars-' + slug && prepared.publicOrigin === 'https://' + slug + '.webpreviews.site', 'Fast native identity differs from pack slug');
  assert(loadDealerPack(root, slug, {allowBenchmark: prepared.benchmarkOnly === true, batch: prepared.batch}).packDigest === prepared.packDigest, 'Dealer changed after fast preparation');
  verifyFastWorkspaceInputs({directory: packageRoot, files: prepared.inputFiles});
  assert(!fs.existsSync(artifact), 'Retain the previous native attempt; use a fresh output');fs.mkdirSync(artifact, {recursive: true});
  clearCompiledOutputs(packageRoot, key);
  const started = Date.now(), steps = [], result = {schemaVersion: 1, kind: 'cars-dealer-pack-family-build', dealer: slug, key, ...identityOf(prepared), status: 'running', compiled: false, dryRun: false,
    startedAt: new Date(started).toISOString(), node: process.version, platform: process.platform, arch: process.arch, providerWrites: false,
    fastBuild: {mode: 'fresh-native-build-reused-dependencies', workspaceKey: prepared.workspaceKey, dependencyReused: prepared.dependencyReused, frameworkCompiledNow: key !== 'router', routerBundledNow: key === 'router', sourceArchives: 0, nativeArchives: 0}};
  const stage = async (phase, args, cwd = packageRoot) => {
    try {const row = await run({phase, args, cwd, cacheRoot, log: path.join(logRoot, phase + '.log')});steps.push(row);return row;}
    catch (error) {if (error.step) steps.push(error.step);throw error;}
  };
  try {
    let target, bundle;
    if (key === 'router') {
      const cwd = path.join(packageRoot, 'cloudflare'), lockHash = sha256(fs.readFileSync(path.join(cwd, 'package-lock.json'))), proofFile = path.join(packageRoot, '.cars-fast-router-dependencies.json');
      if (prepared.dependencyReused) {
        const proof = json(proofFile);
        assert(proof.lockHash === lockHash && proof.node === process.version && installedPackage(cwd, 'wrangler').pkg.version === PACK_TOOLCHAIN.wrangler, 'Router dependency cache differs from the release');
      } else {
        await stage('router-install', [resolveCloudflareNpmCli(process.execPath, fs, path), 'ci', '--include=dev', '--no-audit', '--no-fund'], cwd);
        assert(installedPackage(cwd, 'wrangler').pkg.version === PACK_TOOLCHAIN.wrangler, 'Router installed version changed');
        writeJson(proofFile, {schemaVersion: 1, lockHash, node: process.version});
      }
      target = {config: 'cloudflare/wrangler.jsonc', main: 'cloudflare/router.mjs', assets: 'cloudflare/public', workerName: prepared.workerName, root: 'cloudflare'};
      bundle = 'cloudflare/.cars-cloudflare/worker';
      await stage('router-dry-run', [installedBin(cwd, 'wrangler'), 'deploy', '--dry-run', '--outdir', path.join(packageRoot, bundle)], cwd);
      for (const name of [target.config, target.main, target.assets, bundle]) copyBuildArtifact(path.join(packageRoot, name), path.join(artifact, 'compiled', name));
    } else if (UK_NEXT_FAMILIES.has(key)) {
      const entry = json(path.join(packageRoot, '.cars-cloudflare-next.json')).targets.find(row => row.key === key), helper = path.join(packageRoot, 'scripts/build-cloudflare-next.mjs');
      assert(entry, 'Missing generated Next target');
      for (const phase of [prepared.dependencyReused ? 'prove' : 'install', 'build', 'freeze']) await stage(key + '-' + phase, [helper, phase, key]);
      target = {...entry, config: entry.generatedConfig};bundle = entry.root + '/.cars-cloudflare/worker';
      await stage(key + '-dry-run', [installedBin(path.join(packageRoot, entry.root), 'wrangler'), 'deploy', '--dry-run', '--config', path.join(packageRoot, target.config), '--outdir', path.join(packageRoot, bundle)], path.join(packageRoot, entry.root));
      for (const name of [entry.root + '/dist', bundle]) copyBuildArtifact(path.join(packageRoot, name), path.join(artifact, 'compiled', name));
      for (const name of ['.cars-next-' + key + '-dependencies.json', '.cars-next-' + key + '-frozen-lock.json']) copyBuildArtifact(path.join(packageRoot, name), path.join(artifact, 'receipts', name));
    } else {
      const helper = path.join(packageRoot, 'scripts/build-cloudflare-svelte.mjs');
      if (key === 'auto-best') await stage('auto-best-locales', [path.join(packageRoot, key, 'scripts/build-locales.mjs')], path.join(packageRoot, key));
      for (const phase of [prepared.dependencyReused ? 'rebind' : 'dependencies', 'build', 'dry-run']) await stage(key + '-' + phase, [helper, key, phase]);
      await stage(key + '-freeze', [helper, 'freeze']);
      target = {root: key, config: key + '/wrangler.json', main: key + '/' + CLOUDFLARE_SVELTE_OUTPUT.main, assets: key + '/' + CLOUDFLARE_SVELTE_OUTPUT.assets, workerName: json(path.join(packageRoot, key, 'wrangler.json')).name};
      bundle = key + '/' + CLOUDFLARE_SVELTE_OUTPUT.bundle;
      for (const name of [target.config, key + '/.svelte-kit/cloudflare', key + '/.svelte-kit/cloudflare-worker', bundle]) copyBuildArtifact(path.join(packageRoot, name), path.join(artifact, 'compiled', name));
      for (const name of ['.cars-cloudflare-svelte-locks.json', '.cars-build-assets/' + key + '.cloudflare-dependencies.json', '.cars-build-assets/' + key + '.cloudflare-build.json']) copyBuildArtifact(path.join(packageRoot, name), path.join(artifact, 'receipts', name));
    }
    const config = json(path.join(packageRoot, target.config));assertCompiledConfig(config, target, {router: key === 'router'});
    const assets = filesAt(path.join(packageRoot, target.assets), {filter: () => true}).filter(name => !name.endsWith('.map') && !['.assetsignore', '_routes.json', '_headers', '_redirects'].includes(name) && !name.startsWith('_worker.js'))
      .map(name => ({path: name, bytes: fs.statSync(path.join(packageRoot, target.assets, name)).size}));
    const modules = filesAt(path.join(packageRoot, bundle), {filter: () => true}).filter(name => !name.endsWith('.map') && !/^README(?:\.|$)/i.test(path.basename(name)))
      .map(name => {const bytes = fs.readFileSync(path.join(packageRoot, bundle, name));return {path: name, bytes: bytes.length, compressedBytes: gzipSync(bytes).length};});
    const output = inspectPackBudget(assets, modules, prepared.capacityPlan), main = UK_NEXT_FAMILIES.has(key) || key === 'router' ? target.main : bundle + '/index.js';
    const upload = {...config, main, assets: {...config.assets, directory: target.assets}, no_bundle: true};delete upload.$schema;
    assert(!upload.build?.command && !upload.route && !upload.routes?.length && !upload.durable_objects?.bindings?.length && !upload.containers?.length, 'Unexpected native deployment resource');
    writeJson(path.join(artifact, 'compiled/deploy.json'), upload);
    const compiledFiles = filesAt(path.join(artifact, 'compiled'), {filter: () => true}).map(name => {const bytes = fs.readFileSync(path.join(artifact, 'compiled', name));return {path: 'compiled/' + name, bytes: bytes.length, sha256: sha256(bytes)};});
    const deploy = {schemaVersion: 1, kind: DEALER_PACK_COMPILED_KIND, dealer: slug, key, provider: 'cloudflare', ...identityOf(prepared), workerName: target.workerName,
      configPath: 'compiled/deploy.json', mainPath: 'compiled/' + main, assetPath: 'compiled/' + target.assets, compiledFiles, compiledDigest: sha256(JSON.stringify(compiledFiles)), output,
      compiled: true, dryRun: true, hosted: false, credentialsIncluded: false, nativeApproval: false};
    assert(loadDealerPack(root, slug, {allowBenchmark: prepared.benchmarkOnly === true, batch: prepared.batch}).packDigest === prepared.packDigest, 'Dealer changed during native compilation');
    writeJson(path.join(artifact, 'deploy.json'), deploy);
    writeJson(path.join(artifact, 'receipts/source.json'), {schemaVersion: 1, kind: 'cars-dealer-pack-build-source', dealer: slug, key, ...identityOf(prepared), originalPackUnchanged: true});
    Object.assign(result, {status: 'passed', compiled: true, dryRun: true, workerName: target.workerName, compiledDigest: deploy.compiledDigest, output});
  } catch (error) {Object.assign(result, {status: 'failed', error: error.message});throw error;}
  finally {
    Object.assign(result, {finishedAt: new Date().toISOString(), milliseconds: Date.now() - started});
    writeJson(path.join(artifact, 'receipts/build.json'), result);writeJson(path.join(artifact, 'receipts/steps.json'), steps);
    writeJson(path.join(path.dirname(preparedFile), key + '-build-report.json'), result);
    artifactInventory(artifact, {kind: DEALER_PACK_COMPILED_KIND, dealer: slug, key, status: result.status});
  }
  return {...result, artifact};
}

function readSharedLocks(workspaces) {
  const svelte = {}, next = {};
  for (const key of PACK_TARGETS.filter(key => key !== 'router')) {
    const directory = path.join(workspaces, key, 'source');
    const file = path.join(directory, UK_NEXT_FAMILIES.has(key) ? '.cars-next-' + key + '-frozen-lock.json' : '.cars-cloudflare-svelte-locks.json');
    if (!fs.existsSync(file)) continue;
    if (UK_NEXT_FAMILIES.has(key)) next[key] = json(file);else svelte[key] = json(file)[key];
  }
  return {svelte, next};
}

function familySource(adapted, key, locks) {
  const familyRoot = key === 'router' ? 'cloudflare' : key;
  const files = new Map([...adapted].filter(([name]) => name.startsWith(familyRoot + '/') || name.startsWith('scripts/') || !name.includes('/')));
  // The maintained Svelte helper verifies/freeze only the family present in
  // this workspace; Next already scopes source verification to its target.
  if (!UK_NEXT_FAMILIES.has(key) && key !== 'router') {
    const value = JSON.parse(files.get('.cars-cloudflare-svelte.json'));
    value.services = value.services.filter(row => row.key === key);files.set('.cars-cloudflare-svelte.json', encoded(value));
  }
  if (UK_NEXT_FAMILIES.has(key)) {
    const value = JSON.parse(files.get('.cars-cloudflare-next.json'));
    value.targets = value.targets.filter(row => row.key === key);files.set('.cars-cloudflare-next.json', encoded(value));
    // The maintained freezer authenticates this family's saved dependency lock.
    // Other families may be missing after a failed dealer and are independent.
    if (locks?.next[key]) return freezeCloudflareNextDependencies(files, [locks.next[key]]);
  }
  return files;
}

/** Preparation owns large source maps in a short-lived process. Exiting this
 * phase releases them before any native compiler starts; it does not rely on
 * garbage-collector timing on the same 8 GB runner as a framework compiler. */
export async function prepareFastDealerPack({requestFile} = {}) {
  const request = json(requestFile), {root, slug, area, workspaces, cacheBase, workspaceKey, toolPackage, benchmarkOnly, batch} = request;
  assert(request.kind === 'cars-dealer-pack-fast-preparation-request' && process.version === 'v' + PACK_TOOLCHAIN.node, 'Invalid fast source preparation');
  parseFastSlugs([slug]);
  for (const directory of [area, workspaces, cacheBase]) assertGeneratedRuntimeDirectory(root, directory);
  assert(!fs.existsSync(path.join(area, 'preparation-report.json')), 'Previous source preparation is retained');
  const started = Date.now(), pack = await loadPreparedDealerPack(root, slug, {toolPackage, allowBenchmark: benchmarkOnly, batch});
  assert(pack.packDigest === request.packDigest && pack.release.releaseId === request.releaseId && same(pack.manifest.templateSources, request.sourceReleases), 'Pack changed before fast source preparation');
  assert(workspaceKey === fastWorkspaceKey({releaseDigest: request.releaseDigest, toolDigest: request.toolDigest, nodes: UK_FAMILY_NODES}), 'Fast preparation workspace differs from the requested release');
  assert(Boolean(pack.manifest.pack?.benchmarkOnly) === benchmarkOnly, 'Benchmark source preparation requires its explicit marker');
  const assemblyRoot = path.join(area, 'assembly');
  const assembled = await assembleDealerPack({root, slug, out: assemblyRoot, materialize: false, toolPackage, allowBenchmark: benchmarkOnly, batch});
  assert(assembled.packDigest === pack.packDigest, 'Pack changed during fast assembly');
  const sourceDigest = sha256(canonicalPackJson(sourceFileRows(assembled.files))), manifest = structuredClone(assembled.manifest);
  const identity = {sourceCommit: request.sourceCommit, sourceDigest, sourceReleases: request.sourceReleases, packDigest: pack.packDigest, releaseDigest: request.releaseDigest, toolDigest: request.toolDigest,
    execution: request.execution, publicOrigin: manifest.shareIdentity.publicOrigin, providerOrigin: 'https://cars-' + slug + '.darkapoparka1.workers.dev', capacityPlan: 'paid',
    qualification: {...(assembled.qualification ?? {}), hostedVerified: false, providerWrites: false}};
  const require = createRequire(path.resolve(toolPackage)), sharp = require('sharp'), typescript = require('typescript');
  assert(sharp.versions.sharp === '0.35.5' && typescript.version === '6.0.3', 'Use exact source tools sharp 0.35.5 and TypeScript 6.0.3');
  let files = await prepareSixDesignProviderSource(assembled.files, manifest, {provider: 'cloudflare', shareOptions: {sharp, typescript}});
  applyAutoBestCardLayout(files, manifest);await installDealerDesignSwitcher(files, manifest);files.set('dealer.json', encoded(manifest));
  const locks = readSharedLocks(workspaces);
  files = await applyCloudflareProvider(files, manifest, {workerPrefix: 'cars-' + slug, dependencyLocks: {svelte: locks.svelte}});
  files.set('scripts/build-cloudflare-svelte.mjs', fs.readFileSync(path.join(root, 'scripts/publishing/cloudflare-svelte.mjs')));sealSixVariantBuild(files, manifest, {provider: 'cloudflare'});
  const inputs = {}, prepared = {};
  for (const key of PACK_TARGETS) {
    const packageRoot = path.join(workspaces, key, 'source'), familyFiles = familySource(files, key, locks);
    const sync = syncFastWorkspace({directory: packageRoot, files: familyFiles, workspaceKey, family: key});
    const proofFile = path.join(packageRoot, key === 'router' ? '.cars-fast-router-dependencies.json' : UK_NEXT_FAMILIES.has(key) ? '.cars-next-' + key + '-dependencies.json' : '.cars-build-assets/' + key + '.cloudflare-dependencies.json');
    const frozenAvailable = key === 'router' || Boolean(UK_NEXT_FAMILIES.has(key) ? locks.next[key] : locks.svelte[key]);
    inputs[key] = path.join(area, 'native', key);
    prepared[key] = {schemaVersion: 1, kind: 'cars-dealer-pack-fast-prepared', root, dealer: slug, key, ...identity, workerName: 'cars-' + slug, benchmarkOnly, batch,
      workspaceKey, packageRoot, artifact: inputs[key], inputFiles: sync.files, dependencyReused: sync.reusedWorkspace && frozenAvailable && fs.existsSync(proofFile),
      logRoot: path.join(area, 'logs', key), cacheRoot: path.join(cacheBase, key), sourceSynchronization: {...sync, files: undefined}};
    writeJson(path.join(area, 'prepared', key + '.json'), prepared[key]);
  }
  fs.copyFileSync(path.join(assemblyRoot, 'assembly-report.json'), path.join(area, 'assembly-report.json'));
  if (!request.retainIntermediates) fs.rmSync(assemblyRoot, {recursive: true, maxRetries: 5, retryDelay: 100});
  const report = {schemaVersion: 1, kind: 'cars-dealer-pack-fast-preparation', slug, ...identity, workspaceKey, inputs,
    sourceAssemblyMs: assembled.milliseconds, providerPreparationMs: Date.now() - started - assembled.milliseconds,
    sourceSynchronization: Object.fromEntries(PACK_TARGETS.map(key => [key, prepared[key].sourceSynchronization])),
    preparationProcess: {milliseconds: Date.now() - started, maxRSSKiB: process.resourceUsage().maxRSS, exitsBeforeNativeCompilers: true},
    providerWrites: false};
  writeJson(path.join(area, 'preparation-report.json'), report);return report;
}

export async function buildFastDealerPack({root = ROOT, slug, out, workspaceRoot, nodePaths, familyConcurrency = 1, benchmarkOnly = false, batch,
  toolPackage = process.env.CARS_DEALER_PACK_TOOL_PACKAGE ?? path.join(root, 'runtime/dealer-pack-tools/package.json'),
  compilerPackage, compositionCache = new Map(), verify, retainIntermediates = false, run = runFastStage} = {}) {
  parseFastSlugs([slug]);assert(process.version === 'v' + PACK_TOOLCHAIN.node, 'Start fast build lanes with Node ' + PACK_TOOLCHAIN.node);
  assert(nodePaths && PACK_TARGETS.every(key => process.version === 'v' + UK_FAMILY_NODES[key] || typeof nodePaths[UK_FAMILY_NODES[key]] === 'string' && path.isAbsolute(nodePaths[UK_FAMILY_NODES[key]]) && fs.existsSync(nodePaths[UK_FAMILY_NODES[key]])), 'Supply all exact family Node executables with --node-paths');
  assert(Number.isInteger(familyConcurrency) && familyConcurrency >= 1 && familyConcurrency <= 7, 'Use one to seven family compile lanes');
  const started = Date.now(), area = assertGeneratedRuntimeDirectory(root, out ?? path.join(root, 'runtime/dealer-pack-fast', slug));
  assert(!fs.existsSync(area), 'Existing dealer build retained; choose a fresh output or inspect it');fs.mkdirSync(area, {recursive: true});
  const pack = await loadPreparedDealerPack(root, slug, {toolPackage, allowBenchmark: benchmarkOnly, batch}), sourceReleases = validatePackSourceReleases(pack.manifest.templateSources);
  assert(Boolean(pack.manifest.pack?.benchmarkOnly) === benchmarkOnly, 'Use --benchmark-only exclusively for marked temporary measurement packs');
  assert(pack.manifest.cloudflare?.workerPrefix === 'cars-' + slug && pack.manifest.shareIdentity?.publicOrigin === 'https://' + slug + '.webpreviews.site', 'Pack Worker/origin must be canonical before building');
  const releaseDigest = sha256(canonicalPackJson(sourceReleases)), toolDigest = dealerPackToolDigest(root), workspaceKey = fastWorkspaceKey({releaseDigest, toolDigest, nodes: UK_FAMILY_NODES});
  const workspaceBase = assertGeneratedRuntimeDirectory(root, workspaceRoot ?? path.join(path.dirname(area), 'workspaces'));
  const workspaces = path.join(workspaceBase, workspaceKey);fs.mkdirSync(workspaces, {recursive: true});
  // Registry tarballs/content-addressed downloads can survive a publisher
  // implementation change. Installers still verify package integrity and every
  // installed release pin; source/proof workspaces keep the stricter tools key.
  const downloadCacheRoot = assertGeneratedRuntimeDirectory(root, process.env.CARS_DEALER_PACK_DOWNLOAD_CACHE ?? path.join(workspaceBase, 'download-cache'));
  const cacheBase = path.join(downloadCacheRoot, releaseDigest);fs.mkdirSync(cacheBase, {recursive: true});
  const lockFile = path.join(workspaces, '.cars-fast-lane.lock');let lock;
  try {lock = fs.openSync(lockFile, 'wx');fs.writeFileSync(lock, JSON.stringify({pid: process.pid, slug, startedAt: new Date(started).toISOString()}));}
  catch (error) {if (error.code === 'EEXIST') throw Error('Another dealer owns this release workspace; use another lane');throw error;}
  const result = {schemaVersion: 1, kind: FAST_KIND, slug, status: 'running', workspaceKey, releaseId: pack.release.releaseId, releaseDigest, sourceReleases, packDigest: pack.packDigest,
    batch: pack.batch, sourcePackFiles: sourceFileRows(pack.sourceFiles ?? pack.files), sourcePackBytes: pack.bytes,
    sourceCommit: git(root, ['rev-parse', 'HEAD']), startedAt: new Date(started).toISOString(), providerWrites: false, hostedVerified: false, ownerAccepted: false,
    mode: 'fresh-native-builds-shared-dependencies', benchmarkOnly, compileOncePerRelease: false, frameworkCompiles: 6, routerBundles: 1, sourceArchives: 0, nativeArchives: 0};
  try {
    const requestFile = path.join(area, 'preparation-request.json');
    writeJson(requestFile, {schemaVersion: 1, kind: 'cars-dealer-pack-fast-preparation-request', root, slug, area, workspaces, cacheBase, workspaceKey, toolPackage,
      benchmarkOnly, batch, retainIntermediates, packDigest: pack.packDigest, releaseId: pack.release.releaseId, sourceReleases, sourceCommit: result.sourceCommit,
      releaseDigest, toolDigest, execution: packExecution()});
    await run({phase: 'source-preparation', command: process.execPath, args: [path.join(root, 'scripts/build-dealer-pack-fast.mjs'), 'prepare', '--request', requestFile], cwd: root,
      cacheRoot: path.join(cacheBase, 'preparation'), log: path.join(area, 'logs/source-preparation.log')});
    const preparation = json(path.join(area, 'preparation-report.json')), identity = identityOf(preparation), inputs = preparation.inputs;
    assert(preparation.kind === 'cars-dealer-pack-fast-preparation' && preparation.slug === slug && preparation.packDigest === pack.packDigest && preparation.workspaceKey === workspaceKey &&
      preparation.releaseDigest === releaseDigest && preparation.toolDigest === toolDigest && preparation.sourceCommit === result.sourceCommit && same(preparation.sourceReleases, sourceReleases), 'Prepared source identity differs from the requested pack');
    Object.assign(result, identity, {sourceAssemblyMs: preparation.sourceAssemblyMs, providerPreparationMs: preparation.providerPreparationMs,
      sourceSynchronization: preparation.sourceSynchronization, preparationProcess: preparation.preparationProcess});
    const familiesStarted = Date.now();
    const familyResults = await settledLanes(PACK_TARGETS, familyConcurrency, async key => {
      const command = process.version === 'v' + UK_FAMILY_NODES[key] ? process.execPath : nodePaths[UK_FAMILY_NODES[key]];
      await run({phase: 'native-' + key, command, args: [path.join(root, 'scripts/build-dealer-pack-fast.mjs'), 'family', '--prepared', path.join(area, 'prepared', key + '.json')], cwd: root,
        cacheRoot: path.join(cacheBase, key), log: path.join(area, 'logs', key + '-driver.log')});
      return json(path.join(inputs[key], 'receipts/build.json'));
    });
    result.nativeElapsedMs = Date.now() - familiesStarted;result.familyResults = familyResults;
    const failed = familyResults.flatMap((value, index) => value.status === 'rejected' ? [{family: PACK_TARGETS[index], reason: value.reason}] : []);
    assert(!failed.length, 'Native families failed: ' + JSON.stringify(failed));
    result.familyBuilds = Object.fromEntries(familyResults.map((row, index) => [PACK_TARGETS[index], row.value]));
    result.familyMilliseconds = Object.values(result.familyBuilds).reduce((sum, row) => sum + row.milliseconds, 0);
    result.dependencyReuses = Object.values(result.familyBuilds).filter(row => row.fastBuild.dependencyReused).length;
    compilerPackage ??= path.join(workspaces, 'router/source/cloudflare/package.json');
    const compilerRequire = createRequire(path.resolve(compilerPackage)), esbuild = compilerRequire('esbuild');
    assert(esbuild.version === PACK_TOOLCHAIN.esbuild && compilerRequire('wrangler/package.json').version === PACK_TOOLCHAIN.wrangler, 'Unreviewed composition toolchain');
    const compiler = cachedCompositionCompiler(esbuild, compositionCache), composeStarted = Date.now();
    const members = Object.fromEntries(PACK_TARGETS.map(key => [key, {inventory: json(path.join(inputs[key], 'artifact-manifest.json')), deploy: json(path.join(inputs[key], 'deploy.json')), build: result.familyBuilds[key]}]));
    const packComposition = createDealerPackComposition({dealer: slug, execution: identity.execution, inspected: members});
    inspectSingleWorkerInputs({inputs, expectedDealer: slug, packComposition});
    const bundleRoot = path.join(area, 'bundle'), receipt = packageUkSingleWorker({inputs, destination: bundleRoot, expectedDealer: slug, esbuild: compiler, packComposition});
    const fastBuild = {schemaVersion: 1, mode: result.mode, releaseId: pack.release.releaseId, workspaceKey, benchmarkOnly, sourceArchives: 0, nativeArchives: 0,
      frameworkCompiles: 6, routerBundles: 1, dependencyReuses: result.dependencyReuses, sourceSynchronization: result.sourceSynchronization,
      compositionCache: compiler.statistics, originalNativeArtifactsChanged: false};
    receipt.releaseId = pack.release.releaseId;receipt.fastBuild = fastBuild;writeJson(path.join(bundleRoot, 'single-worker-receipt.json'), receipt);
    await run({phase: 'singleton-dry-run', command: process.execPath, args: [path.join(path.dirname(compilerRequire.resolve('wrangler/package.json')), 'wrangler-dist/cli.js'), 'deploy', '--dry-run', '--no-bundle', '--config', path.join(bundleRoot, 'wrangler.json'), '--outdir', path.join(area, 'dry-run')], cwd: bundleRoot,
      cacheRoot: path.join(cacheBase, 'composition'), log: path.join(area, 'logs/singleton-dry-run.log')});
    artifactInventory(bundleRoot, {kind: DEALER_PACK_BUNDLE_KIND, dealer: slug, status: 'passed'});
    Object.assign(result, {bundleRoot, workerName: receipt.workerName, outputDigest: receipt.outputDigest, packComposition, packCompositionDigest: dealerPackCompositionDigest(packComposition),
      applicationCount: 6, workerCount: 1, serviceBindings: [], assetFiles: receipt.assetFiles, serverBytes: receipt.serverBytes, compressedBytes: receipt.compressedBytes,
      compositionMs: Date.now() - composeStarted, fastBuild, compiled: true, dryRun: true, status: 'built-awaiting-qa'});
    writeJson(path.join(area, 'build-report.json'), result);
    if (verify) {
      const qaStarted = Date.now(), qa = await verify({root, slug, bundleRoot, plan: 'paid', pack});result.qaMilliseconds = Date.now() - qaStarted;
      assert(qa?.success === true && qa.outputDigest === receipt.outputDigest && qa.packDigest === pack.packDigest, 'Local QA did not pass for this exact fast bundle');result.qa = {success: true, outputDigest: qa.outputDigest, packDigest: qa.packDigest};
    }
    result.status = 'passed';
    if (!retainIntermediates) {
      // Only this fresh attempt's reproducible scratch intermediates are removed;
      // bundle, reports, logs and screenshots remain, plus release dependencies.
      for (const name of ['assembly', 'native', 'dry-run']) {const generated = inside(area, name);if (fs.existsSync(generated)) fs.rmSync(generated, {recursive: true, maxRetries: 5, retryDelay: 100});}
      result.intermediatesRetained = false;
    } else result.intermediatesRetained = true;
  } catch (error) {result.status = 'failed';result.error = error.message;throw error;}
  finally {
    result.finishedAt = new Date().toISOString();result.milliseconds = Date.now() - started;
    writeJson(path.join(area, 'build-report.json'), result);
    if (lock !== undefined) {fs.closeSync(lock);fs.unlinkSync(lockFile);}
  }
  return result;
}

export async function inspectFastDealerPackBundle({root = ROOT, directory, slug, pack: suppliedPack} = {}) {
  const {inspectDealerPackBundle} = await import('./verify-dealer-pack.mjs'), pack = suppliedPack ?? loadDealerPack(root, slug);
  const context = inspectDealerPackBundle({bundleRoot: directory, slug, packDigest: pack.packDigest, sourceReleases: pack.manifest.templateSources, plan: 'paid'});
  const report = json(path.join(path.dirname(directory), 'build-report.json'));
  assert(report.kind === FAST_KIND && report.status === 'passed' && report.slug === slug && report.outputDigest === context.receipt.outputDigest && report.packDigest === context.receipt.packDigest &&
    report.releaseDigest === context.receipt.releaseDigest && report.releaseId === pack.release.releaseId && context.receipt.releaseId === pack.release.releaseId &&
    same(report.fastBuild, context.receipt.fastBuild) && report.frameworkCompiles === 6 && report.routerBundles === 1 && report.providerWrites === false, 'Fast build evidence is missing or differs from the bundle');
  return {...context, report};
}

export async function buildFastDealerBatch({root = ROOT, slugs, out, nodePaths, familyConcurrency = 1, verify, toolPackage, compilerPackage, retainIntermediates = false, benchmarkOnly = false, batch} = {}) {
  const selected = parseFastSlugs(slugs), directory = assertGeneratedRuntimeDirectory(root, out ?? path.join(root, 'runtime/dealer-pack-fast/lane-' + randomUUID()));
  fs.mkdirSync(directory, {recursive: true});const started = Date.now(), results = [], compositionCache = new Map();
  const report = {schemaVersion: 1, kind: 'cars-dealer-pack-fast-batch', startedAt: new Date(started).toISOString(), requested: selected, batch, results, familyConcurrency, dealerConcurrency: 1,
    measurementScope: 'Actual assembly, maintained native compilation, composition and requested local QA; no deployment or hosted verification.', providerWrites: false};
  for (const slug of selected) {
    try {
      const value = await buildFastDealerPack({root, slug, out: path.join(directory, 'dealers', slug), workspaceRoot: path.join(directory, 'workspaces'), nodePaths, familyConcurrency, verify, toolPackage, compilerPackage, compositionCache, retainIntermediates, benchmarkOnly, batch});
      results.push({slug, status: 'passed', milliseconds: value.milliseconds, nativeElapsedMs: value.nativeElapsedMs, familyMilliseconds: value.familyMilliseconds, sourceAssemblyMs: value.sourceAssemblyMs,
        compositionMs: value.compositionMs, qaMilliseconds: value.qaMilliseconds ?? null, dependencyReuses: value.dependencyReuses, bundleRoot: value.bundleRoot, outputDigest: value.outputDigest,
        packDigest: value.packDigest, sourceCommit: value.sourceCommit, releaseDigest: value.releaseDigest, fastBuild: value.fastBuild});
    } catch (error) {results.push({slug, status: 'failed', reason: error.message});}
    report.finishedAt = new Date().toISOString();report.milliseconds = Date.now() - started;writeJson(path.join(directory, 'batch-report.json'), report);
  }
  report.status = results.every(row => row.status === 'passed') ? 'passed' : 'partial-failure';report.passed = results.filter(row => row.status === 'passed').length;report.failed = selected.length - report.passed;
  writeJson(path.join(directory, 'batch-report.json'), report);return report;
}

export async function runFastBuildCli(argv = process.argv.slice(2)) {
  if (argv.includes('--help')) {console.log('Usage: build-dealer-pack-fast.mjs batch --slugs LIST --out runtime/LANE --node-paths runtimes.json [--batch 1|2|3|4] [--family-concurrency 1] [--skip-qa]\n       build --slug SLUG --out runtime/DEALER --workspace runtime/RELEASE-LANE --node-paths runtimes.json\n       inspect --slug SLUG --bundle runtime/DEALER/bundle\nEvery dealer gets fresh native compilation; only dependencies and exact composition transforms are reused. Source preparation exits before compilation. No provider writes.');return;}
  const [command, ...rest] = argv, options = {};
  assert(['batch', 'build', 'prepare', 'family', 'inspect'].includes(command), 'Use batch, build, prepare, family or inspect');
  for (let i = 0; i < rest.length; i++) {
    const name = rest[i];assert(['--slugs', '--slug', '--out', '--node-paths', '--family-concurrency', '--tool-package', '--compiler-package', '--prepared', '--request', '--workspace', '--bundle', '--batch', '--skip-qa', '--retain-intermediates', '--benchmark-only'].includes(name) && !Object.hasOwn(options, name), 'Unknown or repeated fast build option: ' + name);
    if (['--skip-qa', '--retain-intermediates', '--benchmark-only'].includes(name)) options[name] = true;
    else {assert(rest[i + 1] && !rest[i + 1].startsWith('--'), 'Missing fast build option value: ' + name);options[name] = rest[++i];}
  }
  if (command === 'prepare') return prepareFastDealerPack({requestFile: options['--request']});
  if (command === 'family') return compileFastDealerFamily({preparedFile: options['--prepared']});
  if (command === 'inspect') return inspectFastDealerPackBundle({directory: options['--bundle'], slug: options['--slug']}).then(({receipt, report}) => ({slug: receipt.dealer, outputDigest: receipt.outputDigest, status: report.status}));
  const verify = options['--skip-qa'] ? undefined : (await import('./verify-dealer-pack.mjs')).verifyDealerPack;
  assert(options['--batch'] === undefined || /^[1-4]$/.test(options['--batch']), 'Batch must be 1, 2, 3 or 4');
  const common = {out: options['--out'], nodePaths: json(options['--node-paths']), familyConcurrency: Number(options['--family-concurrency'] ?? 1), toolPackage: options['--tool-package'], compilerPackage: options['--compiler-package'], verify, batch: options['--batch'], retainIntermediates: Boolean(options['--retain-intermediates']), benchmarkOnly: Boolean(options['--benchmark-only'])};
  return command === 'batch' ? buildFastDealerBatch({...common, slugs: options['--slugs']}) : buildFastDealerPack({...common, slug: options['--slug'], workspaceRoot: options['--workspace']});
}

if (isEntrypoint(import.meta.url)) runFastBuildCli().then(result => {if (result) {console.log(JSON.stringify(result, null, 2));if (result.status === 'partial-failure') process.exitCode = 1;}}).catch(error => {console.error(error.stack);process.exitCode = 1;});
