import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { ROOT, filesAt, git, inside, json, normalized, sha256, writeJson } from './lib/workflow.mjs';
import { verifyTemplate, selectedTemplateSource } from './template-release.mjs';
import { isCarsTemplateSource, materializeTemplateSource } from './lib/template-source.mjs';
import { planSixDesignSelection } from './lib/six-design-release.mjs';
import { applyNativeMounts } from './publishing/native-mounts.mjs';
import { applySixVariantMounts } from './publishing/six-variant.mjs';
import { applyCloudflareNext, freezeCloudflareNextDependencies } from './publishing/cloudflare-next.mjs';
import { applyCloudflareSvelte, inspectCloudflareSvelteOutput } from './publishing/cloudflare-svelte.mjs';

// Build-only qualification of one approved family on an ephemeral Actions runner.
// Dealer generation, adoption, source/package seals and publication stay with the
// existing Cars workflows. These artifacts never claim dealer or hosted approval.
const variants = planSixDesignSelection([
  { key: 'auto-best', base: '', entry: '/' },
  { key: 'modern', base: '/variant-2', entry: '/variant-2/cars' },
  { key: 'carwow', base: '/variant-3', entry: '/variant-3/' },
]).variants;
const familyNodes = Object.freeze({
  'auto-best': '22.23.2', modern: '22.23.2', import: '24.21.0',
  app: '22.23.2', mobile: '22.23.2', 'karento-best': '26.10.0',
});
const nextFamilies = new Set(['modern', 'app', 'mobile']);
const auxiliaryInputs = {
  mobile: ['next.config.js', 'src/app/layout.tsx'],
  'karento-best': ['package.json', 'vite.config.ts', 'src/app.html', 'src/lib/routes.ts'],
};
const workerPrefix = 'cars-ci-qualification';

export function qualificationMatrix(selection) {
  const keys = selection === 'all' ? Object.keys(familyNodes) : [selection];
  if (!keys.length || keys.some(key => !Object.hasOwn(familyNodes, key))) throw Error('Select all or one of the six maintained template families');
  return { include: keys.map(key => ({ key, node: familyNodes[key] })) };
}

export function assertQualificationCI(environment = process.env, platform = process.platform) {
  if (platform !== 'linux' || environment.GITHUB_ACTIONS !== 'true'
    || environment.GITHUB_EVENT_NAME !== 'workflow_dispatch'
    || environment.GITHUB_REPOSITORY !== 'darkapoparka/cars'
    || environment.GITHUB_REF !== 'refs/heads/main'
    || !/^[a-f0-9]{40}$/.test(environment.GITHUB_SHA ?? '')
    || !/^\d+$/.test(environment.GITHUB_RUN_ID ?? '')
    || !/^\d+$/.test(environment.GITHUB_RUN_ATTEMPT ?? '')) {
    throw Error('Qualification builds run only through the manual Cars main workflow on a Linux Actions runner');
  }
}

function approvedSource(key) {
  const release = verifyTemplate(ROOT, key), source = selectedTemplateSource(release);
  if (!isCarsTemplateSource(source)) throw Error(key + ': qualification requires an approved immutable Cars subtree');
  return { release, source };
}
const selectedFiles = (files, key) => new Map([...files].filter(([name]) => name.startsWith(key + '/')));
const encoded = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
function writeFiles(root, files) {
  fs.mkdirSync(root, { recursive: false });
  for (const [name, bytes] of files) {
    const destination = inside(root, name);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, bytes, { flag: 'wx' });
  }
}
function changedInputs(before, after) {
  return [...new Set([...before.keys(), ...after.keys()])].sort().flatMap(name => {
    const from = before.has(name) ? sha256(normalized(before.get(name))) : null;
    const to = after.has(name) ? sha256(normalized(after.get(name))) : null;
    return from === to ? [] : [{ path: name, beforeSha256: from, afterSha256: to }];
  });
}

async function prepare(key, area, reports) {
  const selected = approvedSource(key);
  const sourceDirectory = path.join(area, 'source', key);
  const materialized = await materializeTemplateSource({
    root: ROOT, key, ...selected, destination: sourceDirectory,
  });
  const original = new Map(filesAt(sourceDirectory).map(name =>
    [key + '/' + name, fs.readFileSync(path.join(sourceDirectory, name))]));
  const slug = 'cloudflare-qualification-' + key;
  const manifest = {
    schemaVersion: 1, slug, dealerId: slug, packaging: { version: '5' },
    variants: variants.filter(variant => variant.key === key),
    templateRevisions: { [key]: selected.source.revision },
    templateSources: { [key]: selected.source },
    localization: { schemaVersion: 1, dealerId: slug, defaultLocale: 'en',
      enabledLocales: ['en', 'bg'], dealerCountry: 'GB', inventoryCurrency: 'GBP' },
    qualification: { purpose: 'framework-build-only', dealerAdoption: false, publishingReady: false },
  };
  let mounted;
  const auxiliarySources = [];
  if (['auto-best', 'modern', 'import'].includes(key)) {
    mounted = applyNativeMounts(original, { ...manifest, packaging: { version: '2' } });
  } else {
    // The existing six-design adapter also visits Mobile and Signature. Supply
    // only their real approved boundary files when they are not this job's family.
    // Auxiliary results are discarded; no second source tree is materialized.
    const inputs = new Map(original);
    for (const [auxKey, names] of Object.entries(auxiliaryInputs)) {
      if (auxKey === key) continue;
      const auxiliary = approvedSource(auxKey);
      const files = names.map(name => {
        const bytes = git(ROOT, ['show', auxiliary.source.revision + ':' + auxiliary.source.path + '/' + name], { encoding: null });
        inputs.set(auxKey + '/' + name, bytes);
        return { path: name, sha256: sha256(normalized(bytes)) };
      });
      auxiliarySources.push({ key: auxKey, source: auxiliary.source, files, resultRetained: false });
    }
    mounted = selectedFiles(applySixVariantMounts(inputs, { ...manifest, variants }, { provider: 'cloudflare' }), key);
  }
  const isNext = nextFamilies.has(key);
  const generated = isNext
    ? applyCloudflareNext(mounted, manifest, { workerPrefix })
    : applyCloudflareSvelte(mounted, manifest, { workerPrefix, serviceKeys: [key] });
  const providerReceipt = jsonBytes(generated.get(isNext ? '.cars-cloudflare-next.json' : '.cars-cloudflare-svelte.json'));
  const declaredNode = isNext ? providerReceipt.targets[0].node : providerReceipt.services[0].node;
  if (declaredNode !== familyNodes[key] || process.version !== 'v' + declaredNode) throw Error('Qualification Node differs from the existing provider build contract');
  generated.set('dealer.json', encoded(manifest));
  if (!isNext) generated.set('scripts/build-cloudflare-svelte.mjs',
    fs.readFileSync(path.join(ROOT, 'scripts/publishing/cloudflare-svelte.mjs')));
  const packageRoot = path.join(area, 'package');
  writeFiles(packageRoot, generated);
  const helpers = ['scripts/qualify-cloudflare-template.mjs', 'scripts/lib/template-source.mjs',
    'scripts/template-release.mjs', 'scripts/publishing/native-mounts.mjs',
    'scripts/publishing/six-variant.mjs', 'scripts/publishing/cloudflare-next.mjs',
    'scripts/publishing/cloudflare-svelte.mjs', '.github/workflows/qualify-cloudflare-templates.yml'];
  writeJson(path.join(reports, 'source.json'), {
    schemaVersion: 1, key, release: selected.release, source: selected.source, materialized,
    sourceManifest: json(path.join(sourceDirectory, '.template/source-manifest.json')),
    auxiliarySources, adaptations: changedInputs(original, generated),
    helpers: helpers.map(name => ({ path: name, sha256: sha256(normalized(fs.readFileSync(path.join(ROOT, name)))) })),
    dealerAdoption: false, publishingReady: false,
  });
  return { key, packageRoot, mounted, generated, manifest, isNext, providerReceipt };
}
function jsonBytes(bytes) { return JSON.parse(Buffer.from(bytes).toString('utf8')); }

function runPhase(packageRoot, reports, args, steps) {
  const name = args.slice(1).join('-');
  const log = path.join(reports, name + '.log');
  const fd = fs.openSync(log, 'wx'), started = Date.now();
  console.log('Cloudflare qualification phase: ' + name);
  let result;
  try {
    result = spawnSync(process.execPath, args, {
      cwd: packageRoot, env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false', NEXT_TELEMETRY_DISABLED: '1' },
      stdio: ['ignore', fd, fd], timeout: 30 * 60 * 1000,
    });
  } finally { fs.closeSync(fd); }
  const passed = !result.error && result.status === 0;
  steps.push({ phase: name, status: passed ? 'passed' : 'failed', milliseconds: Date.now() - started, log: name + '.log' });
  writeJson(path.join(reports, 'steps.json'), steps);
  if (!passed) {
    const bytes = fs.readFileSync(log);
    console.error(bytes.subarray(Math.max(0, bytes.length - 16000)).toString('utf8'));
    throw Error('Qualification phase failed: ' + name + ' (' + (result.error?.message ?? result.status) + ')');
  }
}

// Only explicit compiled directories and receipt files enter the upload. Never
// upload a runner checkout, complete generated package, dependency tree or cache.
function copyArtifact(from, to) {
  if (!fs.existsSync(from)) throw Error('Missing qualification artifact: ' + from);
  const stat = fs.lstatSync(from);
  if (stat.isSymbolicLink()) throw Error('Linked qualification artifact requires review');
  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true });
    for (const name of fs.readdirSync(from).sort()) {
      if (['.git', 'node_modules'].includes(name) || name.startsWith('.env')) throw Error('Unexpected private or dependency file in compiled output');
      copyArtifact(path.join(from, name), path.join(to, name));
    }
  } else if (stat.isFile()) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  } else throw Error('Unsupported qualification artifact');
}
function nextOutput(root, target) {
  const assetRoot = path.join(root, target.assets), moduleRoot = path.dirname(path.join(root, target.main));
  const assets = filesAt(assetRoot, { filter: () => true }).map(name => ({ name, bytes: fs.statSync(path.join(assetRoot, name)).size }));
  const modules = filesAt(moduleRoot, { filter: () => true }).filter(name => !name.endsWith('.map') && name !== 'wrangler.json');
  return {
    assets: { files: assets.length, bytes: assets.reduce((sum, row) => sum + row.bytes, 0),
      largest: assets.reduce((largest, row) => row.bytes > (largest?.bytes ?? -1) ? row : largest, null),
      fileCountWithinFreeLimit: assets.length <= 20000, fileSizesWithinLimit: assets.every(row => row.bytes <= 25 * 1024 * 1024) },
    worker: { modules: modules.length,
      uncompressedBytes: modules.reduce((sum, name) => sum + fs.statSync(path.join(moduleRoot, name)).size, 0),
      compressedBytes: modules.reduce((sum, name) => sum + gzipSync(fs.readFileSync(path.join(moduleRoot, name))).length, 0) },
    runtimeCpu: { measured: false, freeQualified: false },
  };
}
function collect(context, artifact, reports) {
  const { key, packageRoot, mounted, generated, manifest, isNext, providerReceipt } = context;
  const compiled = path.join(artifact, 'compiled');
  const sourceFile = name => path.join(packageRoot, name);
  const receipt = name => copyArtifact(sourceFile(name), path.join(reports, name));
  let output;
  if (isNext) {
    const target = providerReceipt.targets[0];
    for (const required of [target.main, target.generatedConfig]) if (!fs.statSync(sourceFile(required)).isFile()) throw Error('Missing generated Next entry/config');
    const frozen = json(sourceFile('.cars-next-' + key + '-frozen-lock.json'));
    const checked = freezeCloudflareNextDependencies(generated, [frozen]);
    writeJson(path.join(reports, 'frozen-provider.json'), jsonBytes(checked.get('.cars-cloudflare-next.json')));
    for (const name of ['.cars-cloudflare-next.json', '.cars-next-' + key + '-dependencies.json',
      '.cars-next-' + key + '-frozen-lock.json', target.root + '/package.json']) receipt(name);
    copyArtifact(sourceFile(target.root + '/dist'), path.join(compiled, target.root, 'dist'));
    output = nextOutput(packageRoot, target);
  } else {
    const frozen = json(sourceFile('.cars-cloudflare-svelte-locks.json'));
    const checked = applyCloudflareSvelte(mounted, manifest, { workerPrefix, serviceKeys: [key], dependencyLocks: frozen });
    writeJson(path.join(reports, 'frozen-provider.json'), jsonBytes(checked.get('.cars-cloudflare-svelte.json')));
    for (const name of ['.cars-cloudflare-svelte.json', '.cars-cloudflare-svelte-locks.json',
      '.cars-build-assets/' + key + '.cloudflare-dependencies.json',
      '.cars-build-assets/' + key + '.cloudflare-build.json', key + '/package.json']) receipt(name);
    for (const name of ['.svelte-kit/cloudflare', '.svelte-kit/cloudflare-worker', '.cars-cloudflare/worker', 'wrangler.json']) {
      copyArtifact(sourceFile(key + '/' + name), path.join(compiled, key, name));
    }
    output = inspectCloudflareSvelteOutput(sourceFile(key));
  }
  receipt('dealer.json');
  writeJson(path.join(reports, 'output.json'), { key, ...output, compiled: true, hosted: false, publishingReady: false });
  fs.writeFileSync(path.join(artifact, 'README.md'),
    '# Cloudflare template qualification\n\nApproved source and generated framework compilation only. No dealer has been adopted, no Worker has been uploaded, and hosted journeys and Free CPU limits remain unverified.\n\n' +
    'The receipts bind the exact source, adapter changes, dependency locks and compiled file hashes to this workflow run. Preserve the compiled paths when inspecting output. Svelte includes its Wrangler dry-run bundle; no Cloudflare credential was supplied.\n', { flag: 'wx' });
  return output;
}

export async function runQualification(key) {
  qualificationMatrix(key);
  assertQualificationCI();
  const root = fs.realpathSync(ROOT);
  if (fs.realpathSync(process.env.GITHUB_WORKSPACE) !== root || git(root, ['rev-parse', 'HEAD']) !== process.env.GITHUB_SHA
    || git(root, ['remote', 'get-url', 'origin']).replace(/\.git$/, '') !== 'https://github.com/darkapoparka/cars') {
    throw Error('Qualification requires the exact dispatched Cars main checkout');
  }
  if (process.version !== 'v' + familyNodes[key]) throw Error('Use the pinned family Node ' + familyNodes[key]);
  const relative = 'runtime/cloudflare-ci/' + process.env.GITHUB_RUN_ID + '-' + process.env.GITHUB_RUN_ATTEMPT + '/' + key;
  const area = inside(root, relative);
  if (fs.existsSync(area)) throw Error('Qualification output already exists; rerun through a new Actions attempt');
  fs.mkdirSync(path.dirname(area), { recursive: true });
  fs.mkdirSync(area);
  const artifact = path.join(area, 'artifact'), reports = path.join(artifact, 'receipts');
  fs.mkdirSync(reports, { recursive: true });
  const result = { schemaVersion: 1, key, node: process.version, repository: 'darkapoparka/cars',
    commit: process.env.GITHUB_SHA, runId: process.env.GITHUB_RUN_ID, attempt: process.env.GITHUB_RUN_ATTEMPT,
    workflowUrl: 'https://github.com/darkapoparka/cars/actions/runs/' + process.env.GITHUB_RUN_ID,
    startedAt: new Date().toISOString(), status: 'running', steps: [], hosted: false, freeRuntimeQualified: false, publishingReady: false };
  writeJson(path.join(reports, 'qualification.json'), result);
  try {
    const context = await prepare(key, area, reports);
    const helper = path.join(context.packageRoot, 'scripts', 'build-cloudflare-' + (context.isNext ? 'next' : 'svelte') + '.mjs');
    if (context.isNext) {
      for (const phase of ['install', 'build', 'freeze']) runPhase(context.packageRoot, reports, [helper, phase, key], result.steps);
    } else {
      for (const phase of ['dependencies', 'build', 'dry-run']) runPhase(context.packageRoot, reports, [helper, key, phase], result.steps);
      runPhase(context.packageRoot, reports, [helper, 'freeze'], result.steps);
    }
    result.output = collect(context, artifact, reports);
    result.status = 'passed';
  } catch (error) {
    result.status = 'failed'; result.error = error.message;
    throw error;
  } finally {
    result.finishedAt = new Date().toISOString();
    writeJson(path.join(reports, 'qualification.json'), result);
    const files = filesAt(artifact, { filter: () => true }).map(name => {
      const bytes = fs.readFileSync(path.join(artifact, name));
      return { path: name, bytes: bytes.length, sha256: sha256(bytes) };
    });
    writeJson(path.join(artifact, 'artifact-manifest.json'), { schemaVersion: 1, key,
      commit: result.commit, status: result.status, digest: sha256(JSON.stringify(files)),
      bytes: files.reduce((sum, file) => sum + file.bytes, 0), files });
    console.log(JSON.stringify({ key, status: result.status, artifact: relative + '/artifact', hosted: false, publishingReady: false }));
  }
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, selection] = process.argv.slice(2);
  try {
    if (process.argv.length !== 4) throw Error('Usage: node scripts/qualify-cloudflare-template.mjs matrix all|FAMILY OR run FAMILY');
    if (command === 'matrix') console.log('matrix=' + JSON.stringify(qualificationMatrix(selection)));
    else if (command === 'run' && selection !== 'all') await runQualification(selection);
    else throw Error('Use matrix all|FAMILY or run FAMILY');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
