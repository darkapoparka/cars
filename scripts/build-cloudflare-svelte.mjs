import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Provider transform for generated, already mounted Cars sources. The source
// release/adoption checks remain in the existing package-dealer workflow.
export const CLOUDFLARE_SVELTE_VERSIONS = Object.freeze({
  kit2Adapter: '7.2.9', kit3Adapter: '8.0.0', wrangler: '4.118.0'
});
export const CLOUDFLARE_SVELTE_OUTPUT = Object.freeze({
  main: '.svelte-kit/cloudflare-worker/index.js',
  assets: '.svelte-kit/cloudflare', bundle: '.cars-cloudflare/worker'
});
const FAMILY = Object.freeze({
  'auto-best': { bases: [''], node: '22.23.2', kitMajor: 2, environment: {} },
  import: { bases: ['/variant-2', '/variant-3'], node: '24.21.0', kitMajor: 2, environment: { TEMPLATE_BASE_PATH: null } },
  'karento-best': { bases: ['/variant-6'], node: '26.10.0', kitMajor: 3, environment: { CARS_SIGNATURE_BASE_PATH: null } }
});
const digest = value => createHash('sha256').update(value).digest('hex');
const normalized = value => Buffer.from(Buffer.from(value).toString('utf8').replace(/\r\n/g, '\n'));
const json = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const read = (files, name) => {
  if (!files.has(name)) throw Error('Missing Cloudflare Svelte input: ' + name);
  return normalized(files.get(name)).toString('utf8');
};
const checkedFamily = (key, base) => {
  const family = FAMILY[key];
  if (!family || !family.bases.includes(base)) throw Error('Unsupported Cloudflare Svelte mount: ' + key);
  return family;
};
const workerName = (prefix, key) => {
  const name = prefix + '-' + (key === 'karento-best' ? 'signature' : key);
  if (!/^[a-z][a-z0-9-]{0,62}$/.test(name) || name.endsWith('-')) throw Error('Invalid Cloudflare Worker prefix');
  return name;
};
function replaceOnce(text, pattern, replacement, label) {
  if ([...text.matchAll(new RegExp(pattern.source, 'g'))].length !== 1) throw Error(label + ' changed; review the provider boundary');
  return text.replace(pattern, replacement);
}

export function cloudflareSvelteConfiguration(key, base, { workerPrefix, compatibilityDate = '2026-10-10' } = {}) {
  checkedFamily(key, base);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(compatibilityDate) || Number.isNaN(Date.parse(compatibilityDate))) throw Error('Invalid compatibility date');
  return {
    $schema: './node_modules/wrangler/config-schema.json',
    name: workerName(workerPrefix, key), main: CLOUDFLARE_SVELTE_OUTPUT.main,
    compatibility_date: compatibilityDate, compatibility_flags: ['nodejs_compat'],
    workers_dev: false, preview_urls: false,
    // Static files already contain the native mount. Keep the public URL intact
    // when a front Worker delegates to this service binding.
    assets: { directory: CLOUDFLARE_SVELTE_OUTPUT.assets, binding: 'ASSETS', run_worker_first: false },
    observability: { enabled: true }
  };
}

function adapterConfig(text, key) {
  const statement = /import\s+adapter\s+from\s+(['"])@sveltejs\/adapter-(?:vercel|node)\1\s*;/;
  text = replaceOnce(text, statement, "import adapter from '@sveltejs/adapter-cloudflare';", key + ' adapter import');
  if (key === 'karento-best') {
    if (!text.includes('base: "/variant-6"') || !text.includes('relative: false')) throw Error('Signature must be mounted by the native six-design adapter first');
    return replaceOnce(text, /adapter\(\s*(?:\{\s*runtime:\s*['"]nodejs24\.x['"]\s*\}\s*)?\)/,
      'adapter()', 'Signature adapter call');
  }
  if (key === 'import' && (!text.includes('TEMPLATE_BASE_PATH') || !text.includes('relative: false'))) throw Error('Import lacks its native mount configuration');
  return replaceOnce(text, /adapter\(\s*(?:\{\s*runtime:\s*['"]nodejs24\.x['"]\s*\}\s*)?\)/,
    'adapter()', key + ' adapter call');
}

function cloudflareCountryHint(files, key) {
  if (key === 'karento-best') return;
  const name = key === 'auto-best' ? key + '/src/lib/locale/server.ts' : key + '/src/hooks.server.ts';
  const text = read(files, name);
  const original = key === 'auto-best'
    ? "process.env.VERCEL ? event.request.headers.get('x-vercel-ip-country') : null"
    : "process.env.VERCEL === '1' ? event.request.headers.get('x-vercel-ip-country') : null";
  if (text.split(original).length !== 2 || text.includes('x-cars-country')) throw Error(key + ': country hint boundary changed; review the locale policy');
  // These workers have no public workers.dev endpoint. The front Worker strips
  // caller-supplied headers and adds x-cars-country from request.cf.country.
  // Service-binding requests may lack cf, so the internal header is a fallback.
  const hint = "((event.platform as { cf?: { country?: string } } | undefined)?.cf?.country ?? event.request.headers.get('x-cars-country'))";
  files.set(name, Buffer.from(text.replace(original, hint)));
}

/** Pure transform. Existing package locks are retained as input evidence and
 * explicitly materialized in the generated package before npm ci/build. */
export function applyCloudflareSvelte(inputFiles, manifest, { workerPrefix = 'cars-' + manifest.slug, compatibilityDate = '2026-10-10', serviceKeys = Object.keys(FAMILY), dependencyLocks = {} } = {}) {
  if (manifest.packaging?.version !== '5') throw Error('Cloudflare pilot requires native six-design packaging');
  if (!Array.isArray(serviceKeys) || !serviceKeys.length || new Set(serviceKeys).size !== serviceKeys.length || serviceKeys.some(key => !Object.hasOwn(FAMILY, key))) throw Error('Invalid Cloudflare Svelte qualification selection');
  const files = new Map(inputFiles), services = [];
  for (const key of serviceKeys) {
    const variants = manifest.variants?.filter(variant => variant.key === key);
    if (variants?.length !== 1) throw Error('Expected one Cloudflare Svelte family: ' + key);
    const base = variants[0].base, family = checkedFamily(key, base);
    const packageName = key + '/package.json', lockName = key + '/package-lock.json';
    const sourcePackage = read(files, packageName), sourceLock = read(files, lockName);
    const pkg = JSON.parse(sourcePackage), lock = JSON.parse(sourceLock);
    const kit = lock.packages?.['node_modules/@sveltejs/kit']?.version;
    if (!kit || Number(kit.split('.')[0]) !== family.kitMajor) throw Error(key + ': unreviewed SvelteKit major for Cloudflare');
    if (pkg.dependencies?.['@sveltejs/adapter-cloudflare'] || pkg.dependencies?.wrangler) throw Error(key + ': runtime hosting dependencies require review');
    const configName = key + (family.kitMajor === 3 ? '/vite.config.ts' : '/svelte.config.js');
    const config = adapterConfig(read(files, configName), key);
    const adapter = family.kitMajor === 2 ? CLOUDFLARE_SVELTE_VERSIONS.kit2Adapter : CLOUDFLARE_SVELTE_VERSIONS.kit3Adapter;
    const dependencies = { '@sveltejs/adapter-cloudflare': adapter, wrangler: CLOUDFLARE_SVELTE_VERSIONS.wrangler };
    pkg.devDependencies ??= {};
    delete pkg.devDependencies['@sveltejs/adapter-vercel'];
    delete pkg.devDependencies['@sveltejs/adapter-node'];
    Object.assign(pkg.devDependencies, dependencies);
    // Kit3's source runtime is not the Vercel adapter's Node24 override.
    if (key === 'karento-best') pkg.engines = { ...pkg.engines, node: family.node };
    const generatedPackage = json(pkg);
    for (const name of ['wrangler.json', 'wrangler.jsonc', 'wrangler.toml']) if (files.has(key + '/' + name)) throw Error('Occupied Cloudflare configuration: ' + key);
    files.set(packageName, generatedPackage);
    files.set(configName, Buffer.from(config));
    cloudflareCountryHint(files, key);
    files.set(key + '/.node-version', Buffer.from(family.node + '\n'));
    files.set(key + '/wrangler.json', json(cloudflareSvelteConfiguration(key, base, { workerPrefix, compatibilityDate })));
    const input = { packageSha256: digest(normalized(sourcePackage)), lockSha256: digest(normalized(sourceLock)) };
    const frozen = dependencyLocks[key];
    if (frozen) {
      if (frozen.schemaVersion !== 1 || JSON.stringify(frozen.input) !== JSON.stringify(input) || frozen.packageSha256 !== digest(generatedPackage)) throw Error(key + ': frozen Cloudflare dependency inputs changed');
      assertProviderLock(frozen.lock, lock, dependencies, pkg);
      files.set(lockName, json(frozen.lock));
    }
    services.push({ key, base, workerName: workerName(workerPrefix, key), kitVersion: kit, node: family.node, dependencies, input,
      packageSha256: digest(generatedPackage), configSha256: digest(Buffer.from(config)),
      lockSha256: frozen ? digest(json(frozen.lock)) : null,
      output: { ...CLOUDFLARE_SVELTE_OUTPUT }, dependencyLockStatus: frozen ? 'frozen' : 'requires-materialization', buildStatus: 'unverified' });
  }
  files.set('.cars-cloudflare-svelte.json', json({ schemaVersion: 1, provider: 'cloudflare', dealer: manifest.slug,
    workerPrefix, compatibilityDate, services, qualification: { built: false, hosted: false, freeRuntimeQualified: false } }));
  return files;
}

export function cloudflareSvelteBuildPlan(key, base) {
  const family = checkedFamily(key, base);
  return { key, root: key, base, node: family.node,
    environment: Object.fromEntries(Object.keys(family.environment).map(name => [name, base])),
    // These mutations are limited to the generated package. The canonical
    // template lock is untouched, and the materialized lock gets its own proof.
    dependencies: [
      ['npm', 'install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund'],
      ['npm', 'ci', '--include=dev', '--no-audit', '--no-fund']
    ],
    build: [...(key === 'auto-best' ? [['node', 'scripts/build-locales.mjs']] : []), ['npm', 'run', 'build']],
    dryRun: [['node', 'node_modules/wrangler/bin/wrangler.js', 'deploy', '--dry-run', '--outdir', CLOUDFLARE_SVELTE_OUTPUT.bundle]],
    output: { ...CLOUDFLARE_SVELTE_OUTPUT } };
}

export function cloudflareSvelteBuildEnvironment(root, key, base, inherited = process.env) {
  const plan = cloudflareSvelteBuildPlan(key, base);
  const environment = { ...inherited, ...plan.environment };
  const inheritedPath = Object.entries(environment).find(([name]) => name.toLowerCase() === 'path')?.[1] ?? '';
  for (const name of Object.keys(environment)) if (['path', 'npm_config_cache'].includes(name.toLowerCase())) delete environment[name];
  environment[process.platform === 'win32' ? 'Path' : 'PATH'] = path.dirname(process.execPath) + path.delimiter + inheritedPath;
  // Signature's approved .npmrc keeps a local .runtime/npm-cache. Route the
  // generated build's mutable npm cache outside retained family source, without
  // changing that source configuration or excluding any .runtime content.
  environment.npm_config_cache = path.join(root, '.cars-build-assets', key + '.npm-cache');
  return environment;
}

function beneath(parent, child) {
  const relative = path.relative(parent, child);
  return relative && relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
}
function generatedRoot(packageRoot) {
  const root = fs.realpathSync(packageRoot);
  if (!fs.existsSync(path.join(root, '.cars-cloudflare-svelte.json'))) throw Error('Cloudflare build requires a generated provider package');
  for (let dir = root; ; dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'templates.lock.json')) && !beneath(path.join(dir, 'runtime'), root)) throw Error('Never build a canonical template or client checkout with the provider helper');
    if (dir === path.dirname(dir)) return root;
  }
}
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function dependencyIdentity(root, key, node = process.version) {
  const service = path.join(root, key);
  if (fs.lstatSync(service).isSymbolicLink() || !beneath(root, fs.realpathSync(service))) throw Error('Linked Cloudflare service directory');
  for (const name of ['package.json', 'package-lock.json', 'wrangler.json', key === 'karento-best' ? 'vite.config.ts' : 'svelte.config.js']) {
    const stat = fs.lstatSync(path.join(service, name));
    if (!stat.isFile() || stat.isSymbolicLink()) throw Error('Linked Cloudflare dependency/configuration input');
  }
  return { schemaVersion: 1, key, node,
    packageSha256: digest(fs.readFileSync(path.join(service, 'package.json'))),
    lockSha256: digest(fs.readFileSync(path.join(service, 'package-lock.json'))),
    configSha256: digest(fs.readFileSync(path.join(service, key === 'karento-best' ? 'vite.config.ts' : 'svelte.config.js'))),
    wranglerSha256: digest(fs.readFileSync(path.join(service, 'wrangler.json'))) };
}
function coreVersions(lock) {
  const result = {};
  for (const key of ['@sveltejs/kit', 'svelte', 'vite', '@sveltejs/vite-plugin-svelte']) {
    const version = lock.packages?.['node_modules/' + key]?.version;
    if (!version) throw Error('Missing frozen framework dependency: ' + key);
    result[key] = version;
  }
  return result;
}
function assertProviderLock(lock, original, dependencies, pkg) {
  if (lock?.lockfileVersion !== 3 || JSON.stringify(coreVersions(lock)) !== JSON.stringify(coreVersions(original))) throw Error('Provider dependency materialization changed frozen framework versions');
  const sorted = value => JSON.stringify(Object.entries(value ?? {}).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
  for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    if (sorted(lock.packages?.['']?.[field]) !== sorted(pkg[field])) throw Error('Provider dependency lock root differs from the generated package: ' + field);
  }
  for (const [name, version] of Object.entries(dependencies)) if (lock.packages?.['node_modules/' + name]?.version !== version || lock.packages?.['']?.devDependencies?.[name] !== version) throw Error('Cloudflare dependency lock differs from the exact provider versions');
}

function verifyInstalledDependencies(root, key, entry) {
  const service = path.join(root, key), lock = readJson(path.join(service, 'package-lock.json'));
  const pkg = readJson(path.join(service, 'package.json'));
  assertProviderLock(lock, lock, entry.dependencies, pkg);
  if (entry.dependencyLockStatus === 'frozen' && digest(fs.readFileSync(path.join(service, 'package-lock.json'))) !== entry.lockSha256) throw Error('Frozen provider dependency lock changed');
  for (const [name, version] of Object.entries({ ...coreVersions(lock), ...entry.dependencies })) {
    const installed = readJson(path.join(service, 'node_modules', name, 'package.json'));
    if (installed.name !== name || installed.version !== version) throw Error('Installed Cloudflare dependency version differs: ' + name);
  }
}

const FAMILY_OUTPUTS = new Set(['node_modules', '.git', '.svelte-kit', '.wrangler', '.cars-cloudflare', '.cars-build-assets', 'build', 'dist']);
const PACKAGE_OUTPUTS = new Set(['.git', 'node_modules', '.vercel', '.netlify', '.wrangler', '.open-next', '.vinext', '.cloudflare', '.cars-cloudflare', '.cars-build-assets', '.agency-os', '.auth', '.codex', '.claude', '.agents', '.openai', '.template', '.svelte-kit', '.next', '.turbo', '.cache', '.pnpm-store', 'build', 'dist', 'runtime', 'audits', 'artifacts', 'evidence', 'qa', 'qa-final', 'test-results', 'playwright-report', 'coverage']);
function payloadBytes(bytes) {
  if (bytes.includes(0)) return bytes;
  const text = bytes.toString('utf8');
  return Buffer.from(text).equals(bytes) ? Buffer.from(text.replaceAll('\r\n', '\n')) : bytes;
}
function retainedPayload(relative) {
  return !relative.split('/').some(part => PACKAGE_OUTPUTS.has(part)
    || (part.startsWith('.env') && !/^\.env\.(example|sample|template)$/.test(part)) || part.startsWith('.next-'))
    && !/\.(pem|key|pfx|p12|log|pid|tsbuildinfo)$/i.test(relative)
    && (!/(?:credentials|service-account|purchase-code|license-certificate)/i.test(path.basename(relative)) || /\.(?:[cm]?[jt]sx?|svelte|vue|py|sh|ps1)$/i.test(relative))
    && !['.cars-package.json', '.cars-publish.json', '.cars-cloudflare-svelte-locks.json'].includes(relative)
    && !/^\.cars-next-(?:modern|app|mobile)-(?:dependencies|frozen-lock)\.json$/.test(relative);
}
function sourceRows(directory, retain, relative = '', rows = []) {
  for (const entry of fs.readdirSync(path.join(directory, relative), { withFileTypes: true })) {
    const name = relative ? relative + '/' + entry.name : entry.name;
    if (!retain(name)) continue;
    if (entry.isSymbolicLink()) throw Error('Linked generated source requires review: ' + name);
    if (entry.isDirectory()) sourceRows(directory, retain, name, rows);
    else if (entry.isFile()) rows.push({ path: name, sha256: digest(payloadBytes(fs.readFileSync(path.join(directory, name)))) });
    else throw Error('Unsupported generated source entry: ' + name);
  }
  return rows.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
}
const retainedFamilySource = relative => !FAMILY_OUTPUTS.has(relative.split('/')[0]) && !/^[^/]+\.(?:log|tsbuildinfo)$/.test(relative);
function verifySealedPayload(root) {
  const file = path.join(root, '.cars-package.json');
  if (!fs.existsSync(file)) return { packageMode: 'unsealed-qualification', payloadDigest: null };
  if (!fs.lstatSync(file).isFile() || fs.lstatSync(file).isSymbolicLink()) throw Error('Linked generated package seal');
  const meta = readJson(file);
  const rows = sourceRows(root, retainedPayload);
  if (meta.schemaVersion !== 1 || meta.assetDelivery?.provider !== 'cloudflare'
    || JSON.stringify(rows) !== JSON.stringify(meta.payload) || digest(JSON.stringify(rows)) !== meta.payloadDigest) throw Error('Sealed Cloudflare package payload changed; regenerate the approved package');
  for (const key of Object.keys(FAMILY)) {
    if (!fs.existsSync(path.join(root, key))) continue;
    const actual = sourceRows(path.join(root, key), retainedFamilySource).map(row => ({ ...row, path: key + '/' + row.path }));
    const expected = rows.filter(row => row.path.startsWith(key + '/'));
    if (JSON.stringify(actual) !== JSON.stringify(expected)) throw Error('Unsealed source exists inside a sealed Cloudflare family: ' + key);
  }
  return { packageMode: 'sealed-package', payloadDigest: meta.payloadDigest };
}
function familySourceRows(root, key) {
  const rows = sourceRows(path.join(root, key), retainedFamilySource);
  for (const name of ['dealer.json', '.cars-cloudflare-svelte.json', 'scripts/build-cloudflare-svelte.mjs']) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    if (!fs.lstatSync(file).isFile() || fs.lstatSync(file).isSymbolicLink()) throw Error('Linked generated source input: ' + name);
    rows.push({ path: '../' + name, sha256: digest(payloadBytes(fs.readFileSync(file))) });
  }
  return rows.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
}
function familySourceDigest(root, key) {
  return digest(JSON.stringify(familySourceRows(root, key)));
}
export function changedCloudflareSvelteSourceRows(before, after) {
  const original = new Map(before.map(row => [row.path, row.sha256]));
  const current = new Map(after.map(row => [row.path, row.sha256]));
  return [...new Set([...original.keys(), ...current.keys()])].sort().flatMap(name =>
    original.get(name) === current.get(name) ? [] : [{ path: name, before: original.get(name) ?? null, after: current.get(name) ?? null }]);
}
function sourceProof(root, key, identity, seal = verifySealedPayload(root)) {
  return { ...identity, schemaVersion: 2, ...seal, sourceDigest: familySourceDigest(root, key) };
}
function sameDependencyIdentity(proof, identity) {
  return proof && ['key', 'node', 'packageSha256', 'lockSha256', 'configSha256', 'wranglerSha256'].every(field => proof[field] === identity[field]);
}
function buildArtifactDigest(service) {
  const rows = [];
  for (const output of [path.dirname(CLOUDFLARE_SVELTE_OUTPUT.main), CLOUDFLARE_SVELTE_OUTPUT.assets]) {
    if (!fs.existsSync(path.join(service, output))) throw Error('Missing verified Cloudflare build output: ' + output);
    rows.push(...sourceRows(path.join(service, output), () => true).map(row => ({ ...row, path: output + '/' + row.path })));
  }
  return digest(JSON.stringify(rows.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0)));
}
function runSteps(steps, cwd, environment, run, key) {
  for (const [program, ...args] of steps) {
    const windows = process.platform === 'win32' && program === 'npm';
    const npm = path.join(path.dirname(process.execPath), 'npm.cmd');
    const executable = windows ? 'cmd.exe' : program === 'node' ? process.execPath : program;
    const parameters = windows ? ['/d', '/s', '/c', `"${[npm, ...args].map(value => `"${value}"`).join(' ')}"`] : args;
    const result = run(executable, parameters, { cwd, env: environment, stdio: 'inherit', windowsHide: true,
      ...(windows ? { windowsVerbatimArguments: true } : {}) });
    if (result.error || result.status !== 0) throw Error('Cloudflare ' + key + ' phase failed: ' + (result.error?.message ?? result.status));
  }
}

export function mergeCloudflareAssetsIgnore(existing = '') {
  // Preserve adapter/source patterns and append these rules last so a source
  // negation cannot expose Worker code, reserved controls or debug maps.
  const separator = existing && !existing.endsWith('\n') ? '\n' : '';
  return existing + separator + '_worker.js\n_worker.js/**\n_routes.json\n_headers\n_redirects\n**/*.map\n';
}

export function runCloudflareSvelteBuild(key, { packageRoot = path.resolve(import.meta.dirname, '..'), phase = 'build', run = spawnSync } = {}) {
  if (!['dependencies', 'prove', 'build', 'dry-run', 'inspect'].includes(phase)) throw Error('Unknown Cloudflare build phase');
  const root = generatedRoot(packageRoot), manifest = readJson(path.join(root, 'dealer.json'));
  const receipt = readJson(path.join(root, '.cars-cloudflare-svelte.json'));
  const entries = receipt.services?.filter(service => service.key === key), variants = manifest.variants?.filter(variant => variant.key === key);
  if (receipt.schemaVersion !== 1 || receipt.provider !== 'cloudflare' || receipt.dealer !== manifest.slug || entries?.length !== 1 || variants?.length !== 1 || entries[0].base !== variants[0].base) throw Error('Cloudflare service differs from the generated manifest');
  const entry = entries[0], plan = cloudflareSvelteBuildPlan(key, entry.base), cwd = path.join(root, key);
  if (process.version !== 'v' + plan.node) throw Error(key + ' requires declared build Node ' + plan.node + '; got ' + process.version);
  const identity = dependencyIdentity(root, key);
  const seal = verifySealedPayload(root);
  if (identity.packageSha256 !== entry.packageSha256 || identity.configSha256 !== entry.configSha256 || JSON.stringify(readJson(path.join(cwd, 'wrangler.json'))) !== JSON.stringify(cloudflareSvelteConfiguration(key, entry.base, receipt))) throw Error('Generated Cloudflare configuration changed; package it again');
  const proofDirectory = path.join(root, '.cars-build-assets'), proofFile = path.join(proofDirectory, key + '.cloudflare-dependencies.json');
  const buildProofFile = path.join(proofDirectory, key + '.cloudflare-build.json');
  if ((fs.existsSync(proofDirectory) && fs.lstatSync(proofDirectory).isSymbolicLink()) || [proofFile, buildProofFile].some(file => fs.existsSync(file) && fs.lstatSync(file).isSymbolicLink())) throw Error('Linked provider dependency/build proof');
  const storedProof = fs.existsSync(proofFile) ? readJson(proofFile) : null;
  if (storedProof?.packageMode === 'sealed-package' && seal.packageMode !== 'sealed-package') throw Error('Sealed Cloudflare package cannot become an unsealed qualification');
  const environment = cloudflareSvelteBuildEnvironment(root, key, entry.base);
  const cacheDirectory = environment.npm_config_cache;
  if (fs.existsSync(cacheDirectory) && (fs.lstatSync(cacheDirectory).isSymbolicLink() || !fs.lstatSync(cacheDirectory).isDirectory())) throw Error('Linked or invalid generated npm cache');
  if (phase === 'dependencies') {
    if (entry.dependencyLockStatus !== 'frozen' && fs.existsSync(path.join(root, '.cars-package.json'))) throw Error('Materialize or supply frozen provider dependency locks before sealing/exporting a package');
    const before = readJson(path.join(cwd, 'package-lock.json'));
    if (entry.dependencyLockStatus !== 'frozen') runSteps(plan.dependencies.slice(0, 1), cwd, environment, run, key);
    const lock = readJson(path.join(cwd, 'package-lock.json'));
    assertProviderLock(lock, before, entry.dependencies, readJson(path.join(cwd, 'package.json')));
    if (entry.dependencyLockStatus === 'frozen' && digest(fs.readFileSync(path.join(cwd, 'package-lock.json'))) !== entry.lockSha256) throw Error('Frozen provider dependency lock changed');
    const resolvedLockSha256 = digest(fs.readFileSync(path.join(cwd, 'package-lock.json')));
    const installSourceRows = familySourceRows(root, key);
    runSteps(plan.dependencies.slice(1), cwd, environment, run, key);
    const after = dependencyIdentity(root, key);
    if (after.packageSha256 !== identity.packageSha256 || after.configSha256 !== identity.configSha256 || after.wranglerSha256 !== identity.wranglerSha256 || after.lockSha256 !== resolvedLockSha256) throw Error('Generated provider inputs changed during dependency installation');
    const sourceChanges = changedCloudflareSvelteSourceRows(installSourceRows, familySourceRows(root, key));
    if (sourceChanges.length) throw Error('Generated Cloudflare source changed during dependency installation: ' + JSON.stringify(sourceChanges));
    verifyInstalledDependencies(root, key, entry);
    fs.mkdirSync(proofDirectory, { recursive: true });
    const proof = sourceProof(root, key, after);
    if (JSON.stringify({ packageMode: proof.packageMode, payloadDigest: proof.payloadDigest }) !== JSON.stringify(seal)) throw Error('Cloudflare package seal changed during dependency installation');
    fs.writeFileSync(proofFile, json(proof));
    return { key, phase, dependencyLockStatus: 'materialized', proofFile, packageMode: proof.packageMode, sourceDigest: proof.sourceDigest };
  }
  if (!sameDependencyIdentity(storedProof, identity)) throw Error('Verified Cloudflare dependency phase is missing or changed');
  verifyInstalledDependencies(root, key, entry);
  if (phase === 'prove') {
    const verifySourceDigest = familySourceDigest(root, key);
    // Check generated locale source without silently rewriting approved bytes.
    if (key === 'auto-best' && fs.existsSync(path.join(cwd, 'scripts/build-locales.mjs'))) runSteps([['node', 'scripts/build-locales.mjs', '--check']], cwd, environment, run, key);
    const after = dependencyIdentity(root, key);
    if (!sameDependencyIdentity(storedProof, after)) throw Error('Generated provider inputs changed during source verification');
    if (familySourceDigest(root, key) !== verifySourceDigest) throw Error('Generated Cloudflare source changed during source verification');
    const proof = sourceProof(root, key, after);
    if (JSON.stringify({ packageMode: proof.packageMode, payloadDigest: proof.payloadDigest }) !== JSON.stringify(seal)) throw Error('Cloudflare package seal changed during source verification');
    fs.writeFileSync(proofFile, json(proof));
    return { key, phase, proofFile, packageMode: proof.packageMode, sourceDigest: proof.sourceDigest, installed: false, buildVerified: false, hosted: false };
  }
  const currentProof = sourceProof(root, key, identity, seal);
  if (JSON.stringify(storedProof) !== JSON.stringify(currentProof)) throw Error('Generated Cloudflare family source changed; verify approved source with prove before building');
  if (phase === 'build') {
    runSteps(plan.build, cwd, environment, run, key);
    if (JSON.stringify(sourceProof(root, key, dependencyIdentity(root, key))) !== JSON.stringify(currentProof)) throw Error('Generated Cloudflare source changed during build; regenerate the approved package');
    const ignore = path.join(cwd, CLOUDFLARE_SVELTE_OUTPUT.assets, '.assetsignore');
    if (!fs.existsSync(path.dirname(ignore))) throw Error('Cloudflare adapter did not produce assets');
    // Entry code lives outside the public asset tree. Exclude any Pages/debug
    // leftovers too; source maps are not public proposal content.
    fs.writeFileSync(ignore, mergeCloudflareAssetsIgnore(fs.existsSync(ignore) ? fs.readFileSync(ignore, 'utf8') : ''));
    if (!fs.existsSync(path.join(cwd, CLOUDFLARE_SVELTE_OUTPUT.main))) throw Error('Cloudflare adapter did not produce its Worker entry');
    fs.writeFileSync(buildProofFile, json({ schemaVersion: 1, sourceProof: currentProof, artifactDigest: buildArtifactDigest(cwd) }));
    return { key, phase, sourceDigest: currentProof.sourceDigest, buildProofFile, output: inspectCloudflareSvelteOutput(cwd), hosted: false };
  }
  if (phase === 'dry-run') {
    const built = fs.existsSync(buildProofFile) ? readJson(buildProofFile) : null;
    if (built?.schemaVersion !== 1 || JSON.stringify(built.sourceProof) !== JSON.stringify(currentProof)
      || built.artifactDigest !== buildArtifactDigest(cwd)) throw Error('Build the current verified Cloudflare source before dry-run; matching artifact proof is missing or changed');
    runSteps(plan.dryRun, cwd, environment, run, key);
    if (JSON.stringify(sourceProof(root, key, dependencyIdentity(root, key))) !== JSON.stringify(currentProof)) throw Error('Generated Cloudflare source changed during dry-run');
    if (built.artifactDigest !== buildArtifactDigest(cwd)) throw Error('Verified Cloudflare build artifacts changed during dry-run');
  }
  return { key, phase, output: inspectCloudflareSvelteOutput(cwd), hosted: false, freeRuntimeQualified: false };
}

function walkFiles(root, relative = '', output = []) {
  if (!fs.existsSync(path.join(root, relative))) return output;
  for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
    const name = relative ? relative + '/' + entry.name : entry.name;
    if (entry.isSymbolicLink()) throw Error('Linked Cloudflare build artifact: ' + name);
    if (entry.isDirectory()) walkFiles(root, name, output);
    else if (entry.isFile()) output.push({ name, bytes: fs.statSync(path.join(root, name)).size });
  }
  return output.sort((left, right) => left.name.localeCompare(right.name));
}
export function inspectCloudflareSvelteOutput(serviceRoot) {
  const assetsRoot = path.join(serviceRoot, CLOUDFLARE_SVELTE_OUTPUT.assets);
  const reserved = new Set(['.assetsignore', '_routes.json', '_headers', '_redirects']);
  const assets = walkFiles(assetsRoot).filter(file => !reserved.has(file.name) && !file.name.startsWith('_worker.js') && !file.name.endsWith('.map'));
  const bundleRoot = path.join(serviceRoot, CLOUDFLARE_SVELTE_OUTPUT.bundle);
  const modules = walkFiles(bundleRoot).filter(file => !file.name.endsWith('.map') && !/^README(?:\.|$)/i.test(file.name));
  const uncompressedBytes = modules.length ? modules.reduce((total, file) => total + file.bytes, 0) : null;
  const compressedBytes = modules.length ? modules.reduce((total, file) => total + gzipSync(fs.readFileSync(path.join(bundleRoot, file.name))).length, 0) : null;
  return { assets: { files: assets.length, bytes: assets.reduce((total, file) => total + file.bytes, 0),
    largest: assets.reduce((largest, file) => file.bytes > (largest?.bytes ?? -1) ? file : largest, null),
    fileCountWithinFreeLimit: assets.length <= 20000, fileSizesWithinLimit: assets.every(file => file.bytes <= 25 * 1024 * 1024) },
    worker: { entryExists: fs.existsSync(path.join(serviceRoot, CLOUDFLARE_SVELTE_OUTPUT.main)),
      bundledModules: modules.length, uncompressedBytes, compressedBytes,
      uncompressedWithinLimit: uncompressedBytes === null ? null : uncompressedBytes <= 64 * 1024 * 1024 },
    runtimeCpu: { measured: false, freeQualified: false } };
}

export function collectCloudflareSvelteDependencyLocks(packageRoot) {
  const root = generatedRoot(packageRoot), receipt = readJson(path.join(root, '.cars-cloudflare-svelte.json'));
  return Object.fromEntries(receipt.services.map(entry => {
    const proof = path.join(root, '.cars-build-assets', entry.key + '.cloudflare-dependencies.json');
    if (!fs.existsSync(proof) || JSON.stringify(readJson(proof)) !== JSON.stringify(sourceProof(root, entry.key, dependencyIdentity(root, entry.key, 'v' + FAMILY[entry.key]?.node)))) throw Error(entry.key + ': verified provider dependencies or source missing');
    verifyInstalledDependencies(root, entry.key, entry);
    return [entry.key, { schemaVersion: 1, input: entry.input, packageSha256: entry.packageSha256,
      lock: readJson(path.join(root, entry.key, 'package-lock.json')) }];
  }));
}

export function freezeCloudflareSvelteDependencies(packageRoot) {
  const root = generatedRoot(packageRoot), locks = collectCloudflareSvelteDependencyLocks(root);
  const destination = path.join(root, '.cars-cloudflare-svelte-locks.json');
  fs.writeFileSync(destination, json(locks));
  return { schemaVersion: 1, destination, keys: Object.keys(locks), publishingReady: false };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [key, phase = 'build'] = process.argv.slice(2);
    if (!key || process.argv.length > 4) throw Error('Usage: node scripts/build-cloudflare-svelte.mjs auto-best|import|karento-best [dependencies|prove|build|dry-run|inspect] OR freeze');
    const result = key === 'freeze' && process.argv.length === 3
      ? freezeCloudflareSvelteDependencies(path.resolve(import.meta.dirname, '..'))
      : runCloudflareSvelteBuild(key, { phase });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
