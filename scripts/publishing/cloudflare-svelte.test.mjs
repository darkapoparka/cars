import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { packageDigest } from '../export-dealer.mjs';
import {
  applyCloudflareSvelte, cloudflareSvelteBuildPlan, cloudflareSvelteConfiguration,
  CLOUDFLARE_SVELTE_OUTPUT, inspectCloudflareSvelteOutput, mergeCloudflareAssetsIgnore,
  runCloudflareSvelteBuild
} from './cloudflare-svelte.mjs';

const manifest = (importBase = '/variant-3') => ({ slug: 'uk-broadbent-motors', packaging: { version: '5' }, variants: [
  { key: 'auto-best', base: '' }, { key: 'modern', base: importBase === '/variant-3' ? '/variant-2' : '/variant-3' },
  { key: 'import', base: importBase }, { key: 'app', base: '/variant-4' },
  { key: 'mobile', base: '/variant-5' }, { key: 'karento-best', base: '/variant-6' }
] });
function fixture() {
  const files = new Map();
  for (const key of ['auto-best', 'import', 'karento-best']) {
    const kit = key === 'karento-best' ? '3.0.1' : '2.70.3';
    files.set(key + '/package.json', Buffer.from(JSON.stringify({ name: key, type: 'module', private: true,
      engines: { node: key === 'karento-best' ? '26.10.0' : key === 'import' ? '>=24.12.0 <25' : '^22.12.0' },
      scripts: { build: 'vite build' }, devDependencies: { '@sveltejs/kit': kit, ['@sveltejs/adapter-' + (key === 'karento-best' ? 'node' : 'vercel')]: '6.0.0', svelte: '5.57.2', vite: '8.3.3' } })));
    files.set(key + '/package-lock.json', Buffer.from(JSON.stringify({ lockfileVersion: 3, packages: {
      '': {}, 'node_modules/@sveltejs/kit': { version: kit }, 'node_modules/svelte': { version: '5.57.2' },
      'node_modules/vite': { version: '8.3.3' }, 'node_modules/@sveltejs/vite-plugin-svelte': { version: '7.3.1' }
    } })));
    files.set(key + '/src/routes/+page.server.ts', Buffer.from('export const load = ({ url }) => ({ filter: url.searchParams.get("filter") });\n'));
    files.set(key + '/static/logo.png', Buffer.from('dealer logo'));
  }
  files.set('auto-best/svelte.config.js', Buffer.from(`import adapter from '@sveltejs/adapter-vercel';\nimport { withRetainedPublicAssets } from './scripts/public-asset-retention.mjs';\nexport default { kit: { adapter: withRetainedPublicAssets(adapter(), { root: import.meta.dirname }), alias: { $data: 'src/lib/data' } } };\n`));
  files.set('import/svelte.config.js', Buffer.from(`import adapter from '@sveltejs/adapter-vercel';\nexport default { kit: { paths: { base: process.env.TEMPLATE_BASE_PATH || '', relative: false }, adapter: withRetainedPublicAssets(adapter({ runtime: 'nodejs24.x' }), { root: import.meta.dirname }) } };\n`));
  files.set('karento-best/vite.config.ts', Buffer.from('import adapter from "@sveltejs/adapter-node";\nexport default defineConfig({ plugins: [sveltekit({ adapter: adapter(), paths: { base: "/variant-6", relative: false } })] });\n'));
  files.set('auto-best/src/lib/locale/server.ts', Buffer.from("const state = resolveLocale({url: event.url, cookie: event.request.headers.get('cookie'), acceptLanguage: event.request.headers.get('accept-language'), trustedCountry: process.env.VERCEL ? event.request.headers.get('x-vercel-ip-country') : null});\n"));
  files.set('import/src/hooks.server.ts', Buffer.from("const state = resolveLocale({url: event.url, cookie: event.request.headers.get('cookie'), acceptLanguage: event.request.headers.get('accept-language'), trustedCountry: process.env.VERCEL === '1' ? event.request.headers.get('x-vercel-ip-country') : null});\n"));
  files.set('.cars-signature.json', Buffer.from('original approved source receipt'));
  return files;
}

test('keeps mounted paths, SSR loaders, asset bytes and source receipts while choosing compatible adapters', () => {
  const original = fixture(), output = applyCloudflareSvelte(original, manifest());
  for (const key of ['auto-best', 'import', 'karento-best']) {
    assert.equal(output.get(key + '/src/routes/+page.server.ts'), original.get(key + '/src/routes/+page.server.ts'));
    assert.equal(output.get(key + '/static/logo.png'), original.get(key + '/static/logo.png'));
    assert.equal(output.get(key + '/package-lock.json'), original.get(key + '/package-lock.json'));
    assert.ok(original.get(key + '/package.json').toString().includes('adapter-'));
    const pkg = JSON.parse(output.get(key + '/package.json'));
    assert.equal(pkg.devDependencies['@sveltejs/adapter-cloudflare'], key === 'karento-best' ? '8.0.0' : '7.2.9');
    assert.equal(pkg.devDependencies.wrangler, '4.118.0');
    assert.equal(pkg.devDependencies['@sveltejs/adapter-vercel'], undefined);
    assert.equal(pkg.devDependencies['@sveltejs/adapter-node'], undefined);
    const config = JSON.parse(output.get(key + '/wrangler.json'));
    assert.equal(config.workers_dev, false);
    assert.equal(config.assets.run_worker_first, false);
    assert.ok(!config.main.startsWith(config.assets.directory + '/'));
    assert.equal(config.assets.not_found_handling, undefined);
  }
  assert.equal(output.get('.cars-signature.json'), original.get('.cars-signature.json'));
  assert.match(output.get('auto-best/svelte.config.js').toString(), /withRetainedPublicAssets\(adapter\(\)/);
  assert.match(output.get('import/svelte.config.js').toString(), /TEMPLATE_BASE_PATH/);
  assert.match(output.get('karento-best/vite.config.ts').toString(), /base: "\/variant-6", relative: false/);
  const receipt = JSON.parse(output.get('.cars-cloudflare-svelte.json'));
  assert.equal(receipt.services.length, 3);
  assert.deepEqual(receipt.qualification, { built: false, hosted: false, freeRuntimeQualified: false });
  assert.ok(receipt.services.every(service => service.dependencyLockStatus === 'requires-materialization' && service.buildStatus === 'unverified'));
});

test('trusted Cloudflare country changes only the hint input and keeps explicit locale preferences', () => {
  const original = fixture(), output = applyCloudflareSvelte(original, manifest());
  for (const name of ['auto-best/src/lib/locale/server.ts', 'import/src/hooks.server.ts']) {
    const text = output.get(name).toString();
    assert.match(text, /platform as \{ cf\?: \{ country\?: string \} \} \| undefined/);
    assert.match(text, /\?\.cf\?\.country \?\? event.request.headers.get\('x-cars-country'\)/);
    assert.ok(!text.includes('x-vercel-ip-country'));
    assert.match(text, /url: event.url, cookie: event.request.headers.get\('cookie'\), acceptLanguage:/);
  }
});

test('both existing Import mounts have native build environments', () => {
  for (const base of ['/variant-2', '/variant-3']) {
    const files = applyCloudflareSvelte(fixture(), manifest(base));
    const receipt = JSON.parse(files.get('.cars-cloudflare-svelte.json'));
    assert.equal(receipt.services.find(service => service.key === 'import').base, base);
    assert.deepEqual(cloudflareSvelteBuildPlan('import', base).environment, { TEMPLATE_BASE_PATH: base });
  }
  assert.equal(cloudflareSvelteBuildPlan('auto-best', '').node, '22.23.2');
  assert.equal(cloudflareSvelteBuildPlan('karento-best', '/variant-6').node, '26.10.0');
  assert.ok(cloudflareSvelteBuildPlan('import', '/variant-3').dryRun.flat().includes('--dry-run'));
});

test('provider locks are frozen only against their exact template and transformed package inputs', () => {
  const input = fixture(), candidate = applyCloudflareSvelte(input, manifest());
  const receipt = JSON.parse(candidate.get('.cars-cloudflare-svelte.json')), dependencyLocks = {};
  for (const service of receipt.services) {
    const lock = JSON.parse(input.get(service.key + '/package-lock.json'));
    const pkg = JSON.parse(candidate.get(service.key + '/package.json'));
    for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) if (pkg[field]) lock.packages[''][field] = { ...pkg[field] };
    for (const [name, version] of Object.entries(service.dependencies)) lock.packages['node_modules/' + name] = { version };
    dependencyLocks[service.key] = { schemaVersion: 1, input: service.input, packageSha256: service.packageSha256, lock };
  }
  const frozen = applyCloudflareSvelte(input, manifest(), { dependencyLocks });
  const output = JSON.parse(frozen.get('.cars-cloudflare-svelte.json'));
  assert.ok(output.services.every(service => service.dependencyLockStatus === 'frozen' && /^[a-f0-9]{64}$/.test(service.lockSha256)));
  assert.equal(output.services.find(service => service.key === 'karento-best').workerName, 'cars-uk-broadbent-motors-signature');
  const changed = structuredClone(dependencyLocks); changed.import.packageSha256 = '0'.repeat(64);
  assert.throws(() => applyCloudflareSvelte(input, manifest(), { dependencyLocks: changed }), /inputs changed/);
  const framework = structuredClone(dependencyLocks); framework.import.lock.packages['node_modules/vite'].version = '8.4.0';
  assert.throws(() => applyCloudflareSvelte(input, manifest(), { dependencyLocks: framework }), /frozen framework/);
  const unpinned = structuredClone(dependencyLocks); unpinned.import.lock.packages['node_modules/wrangler'].version = '4.119.0';
  assert.throws(() => applyCloudflareSvelte(input, manifest(), { dependencyLocks: unpinned }), /exact provider/);
  for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    const wrongRoot = structuredClone(dependencyLocks);
    wrongRoot.import.lock.packages[''][field] = { ...(wrongRoot.import.lock.packages[''][field] ?? {}), svelte: '0.0.0' };
    assert.throws(() => applyCloudflareSvelte(input, manifest(), { dependencyLocks: wrongRoot }), /lock root differs/);
  }
  const reordered = structuredClone(dependencyLocks);
  for (const service of Object.values(reordered)) service.lock.packages[''].devDependencies = Object.fromEntries(Object.entries(service.lock.packages[''].devDependencies).reverse());
  assert.ok(JSON.parse(applyCloudflareSvelte(input, manifest(), { dependencyLocks: reordered }).get('.cars-cloudflare-svelte.json')).services.every(service => service.dependencyLockStatus === 'frozen'));
});

function ownedTemporaryRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-cloudflare-source-test-'));
  t.after(() => {
    const exact = fs.realpathSync(root), parent = fs.realpathSync(os.tmpdir());
    assert.equal(path.dirname(exact).toLowerCase(), parent.toLowerCase());
    assert.ok(path.basename(exact).startsWith('cars-cloudflare-source-test-'));
    fs.rmSync(exact, { recursive: true });
  });
  return root;
}
function generatedBuildFixture(t, { sealed = false } = {}) {
  const root = ownedTemporaryRoot(t), input = fixture(), selected = manifest();
  const candidate = applyCloudflareSvelte(input, selected, { serviceKeys: ['auto-best'] });
  const entry = JSON.parse(candidate.get('.cars-cloudflare-svelte.json')).services[0];
  const pkg = JSON.parse(candidate.get('auto-best/package.json'));
  const lock = JSON.parse(input.get('auto-best/package-lock.json'));
  lock.packages[''].devDependencies = pkg.devDependencies;
  for (const [name, version] of Object.entries(entry.dependencies)) lock.packages['node_modules/' + name] = { version };
  const files = applyCloudflareSvelte(input, selected, { serviceKeys: ['auto-best'], dependencyLocks: {
    'auto-best': { schemaVersion: 1, input: entry.input, packageSha256: entry.packageSha256, lock }
  } });
  files.set('dealer.json', Buffer.from(JSON.stringify(selected)));
  files.set('auto-best/localization/en.json', Buffer.from('{"title":"Dealer"}'));
  if (!sealed) {
    files.set('auto-best/static/build/photo.png', Buffer.from([0, 255, 128, 10]));
    files.set('auto-best/static/dist/photo.webp', Buffer.from([0, 254, 129, 13]));
  }
  for (const [name, bytes] of files) { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes); }
  for (const [name, value] of Object.entries(lock.packages).filter(([name]) => name.startsWith('node_modules/'))) {
    const file = path.join(root, 'auto-best', name, 'package.json'); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify({ name: name.slice('node_modules/'.length), version: value.version }));
  }
  if (sealed) {
    fs.writeFileSync(path.join(root, '.cars-cloudflare.json'), JSON.stringify({ provider: 'cloudflare', acceptance: { dependencyLocksFrozen: true } }));
    const payload = packageDigest(root).files;
    fs.writeFileSync(path.join(root, '.cars-package.json'), JSON.stringify({ schemaVersion: 1, manifest: selected,
      assetDelivery: { provider: 'cloudflare' }, payload, payloadDigest: createHash('sha256').update(JSON.stringify(payload)).digest('hex') }));
  }
  const calls = [], run = (...args) => { calls.push(args); return { status: 0 }; };
  const execute = phase => runCloudflareSvelteBuild('auto-best', { packageRoot: root, phase, run });
  execute('dependencies'); calls.length = 0;
  return { root, calls, execute, write: (name, content) => fs.writeFileSync(path.join(root, 'auto-best', name), content) };
}

test('changed route, binary asset and locale source cannot reuse dependency proof for builds', t => {
  for (const [name, bytes] of [['src/routes/+page.server.ts', 'export const load = () => ({ edited: true });'],
    ['static/build/photo.png', Buffer.from([0, 255, 129, 10])], ['static/dist/photo.webp', Buffer.from([0, 253, 129, 13])],
    ['localization/en.json', '{"title":"Changed"}']]) {
    const area = generatedBuildFixture(t);
    area.write(name, bytes);
    assert.throws(() => area.execute('build'), /family source changed/);
    assert.throws(() => area.execute('dry-run'), /family source changed/);
    assert.equal(area.calls.length, 0);
  }
});

test('source-only prove keeps exact installed dependencies and does not certify stale outputs', t => {
  const area = generatedBuildFixture(t);
  area.write('src/routes/+page.server.ts', 'export const load = () => ({ reviewed: true });');
  const proof = area.execute('prove');
  assert.equal(proof.installed, false);
  assert.equal(proof.buildVerified, false);
  assert.equal(proof.packageMode, 'unsealed-qualification');
  assert.equal(area.calls.length, 0);
  assert.throws(() => area.execute('dry-run'), /matching artifact proof/);
  const installed = path.join(area.root, 'auto-best/node_modules/wrangler/package.json');
  fs.writeFileSync(installed, JSON.stringify({ name: 'wrangler', version: '4.119.0' }));
  assert.throws(() => area.execute('prove'), /Installed Cloudflare dependency version differs/);
});

test('sealed source changes and removal of its package seal cannot be refreshed by prove', t => {
  const area = generatedBuildFixture(t, { sealed: true });
  area.write('src/routes/+page.server.ts', 'export const load = () => ({ changed: true });');
  assert.throws(() => area.execute('prove'), /Sealed Cloudflare package payload changed/);
  assert.throws(() => area.execute('build'), /Sealed Cloudflare package payload changed/);
  fs.unlinkSync(path.join(area.root, '.cars-package.json'));
  assert.throws(() => area.execute('prove'), /cannot become an unsealed/);
  assert.equal(area.calls.length, 0);
});

test('an extra nested static output-looking source directory cannot bypass a sealed payload', t => {
  const area = generatedBuildFixture(t, { sealed: true });
  fs.mkdirSync(path.join(area.root, 'auto-best/static/build'));
  area.write('static/build/private.js', 'export const unexpected = true;');
  assert.throws(() => area.execute('prove'), /Unsealed source exists/);
  assert.equal(area.calls.length, 0);
});

test('source edits during a build are refused before creating build evidence', t => {
  const area = generatedBuildFixture(t);
  assert.throws(() => runCloudflareSvelteBuild('auto-best', { packageRoot: area.root, phase: 'build', run: () => {
    area.write('src/routes/+page.server.ts', 'export const load = () => ({ changedDuringBuild: true });');
    return { status: 0 };
  } }), /source changed during build/);
  assert.equal(fs.existsSync(path.join(area.root, '.cars-build-assets/auto-best.cloudflare-build.json')), false);
});

test('build proof binds compiled bytes to source and dry-run refuses edited or stale artifacts', t => {
  const area = generatedBuildFixture(t), service = path.join(area.root, 'auto-best');
  const assets = path.join(service, CLOUDFLARE_SVELTE_OUTPUT.assets), entry = path.join(service, CLOUDFLARE_SVELTE_OUTPUT.main);
  fs.mkdirSync(assets, { recursive: true }); fs.mkdirSync(path.dirname(entry), { recursive: true });
  fs.writeFileSync(entry, 'export default {};'); fs.writeFileSync(path.join(assets, 'logo.svg'), '<svg/>');
  area.execute('build');
  area.calls.length = 0;
  area.execute('dry-run');
  assert.equal(area.calls.length, 1);
  area.calls.length = 0;
  fs.writeFileSync(entry, 'export default {changed:true};');
  assert.throws(() => area.execute('dry-run'), /matching artifact proof/);
  assert.equal(area.calls.length, 0);
  area.write('localization/en.json', '{"title":"New source"}');
  area.execute('prove');
  assert.throws(() => area.execute('dry-run'), /matching artifact proof/);
});

test('a single-family qualification cannot masquerade as a complete six-design build', () => {
  const output = applyCloudflareSvelte(fixture(), manifest(), { serviceKeys: ['auto-best'] });
  const receipt = JSON.parse(output.get('.cars-cloudflare-svelte.json'));
  assert.deepEqual(receipt.services.map(service => service.key), ['auto-best']);
  assert.equal(output.get('import/wrangler.json'), undefined);
  assert.equal(receipt.qualification.hosted, false);
  assert.throws(() => applyCloudflareSvelte(fixture(), manifest(), { serviceKeys: ['auto-best', 'auto-best'] }), /selection/);
});

test('unknown config, runtime-dependency layout and unmounted Signature fail closed', () => {
  const cases = [
    files => files.set('auto-best/svelte.config.js', Buffer.from("import adapter from '@sveltejs/adapter-vercel'; export default { kit: { adapter: chooseAdapter() } };")),
    files => files.set('karento-best/vite.config.ts', Buffer.from('import adapter from "@sveltejs/adapter-node"; sveltekit({ adapter: adapter() });')),
    files => files.set('import/src/hooks.server.ts', Buffer.from('const state = resolveLocale({ trustedCountry: userInput });')),
    files => files.set('auto-best/wrangler.toml', Buffer.from('name="existing"')),
    files => { const pkg = JSON.parse(files.get('import/package.json')); pkg.dependencies = { wrangler: '4.0.0' }; files.set('import/package.json', Buffer.from(JSON.stringify(pkg))); },
    files => { const lock = JSON.parse(files.get('auto-best/package-lock.json')); lock.packages['node_modules/@sveltejs/kit'].version = '3.0.1'; files.set('auto-best/package-lock.json', Buffer.from(JSON.stringify(lock))); }
  ];
  for (const change of cases) { const files = fixture(); change(files); assert.throws(() => applyCloudflareSvelte(files, manifest())); }
  assert.throws(() => applyCloudflareSvelte(fixture(), { ...manifest(), packaging: { version: '2' } }), /six-design/);
  assert.throws(() => applyCloudflareSvelte(fixture(), manifest(), { workerPrefix: '../oops' }), /prefix/);
  const duplicate = manifest(); duplicate.variants.push({ key: 'auto-best', base: '' });
  assert.throws(() => applyCloudflareSvelte(fixture(), duplicate), /Expected one/);
  assert.throws(() => cloudflareSvelteConfiguration('import', '/else', { workerPrefix: 'cars-test' }), /mount/);
});

test('asset exclusions preserve adapter and source rules before enforcing private output rules', () => {
  const inherited = '# dealer assets\r\nprivate/**\r\n_headers\r\n_redirects\r\n!**/*.map';
  const merged = mergeCloudflareAssetsIgnore(inherited);
  assert.ok(merged.startsWith(inherited + '\n'));
  assert.equal(merged, inherited + '\n_worker.js\n_worker.js/**\n_routes.json\n_headers\n_redirects\n**/*.map\n');
  assert.match(mergeCloudflareAssetsIgnore(), /^_worker\.js\n/);
});

test('output inspection distinguishes build bytes from CPU and never reports an absent bundle accepted', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-cloudflare-svelte-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const assets = path.join(root, CLOUDFLARE_SVELTE_OUTPUT.assets);
  fs.mkdirSync(path.join(assets, 'variant-3/_app'), { recursive: true });
  fs.writeFileSync(path.join(assets, '.assetsignore'), '_worker.js\n');
  fs.writeFileSync(path.join(assets, '_worker.js'), 'private server');
  fs.writeFileSync(path.join(assets, '_headers'), '/_app/*\n  X-Robots-Tag: noindex\n');
  fs.writeFileSync(path.join(assets, '_redirects'), '/old /new 307\n');
  fs.writeFileSync(path.join(assets, 'variant-3/_app/page.js'), 'browser asset');
  let report = inspectCloudflareSvelteOutput(root);
  assert.equal(report.assets.files, 1);
  assert.equal(report.worker.uncompressedWithinLimit, null);
  assert.equal(report.worker.entryExists, false);
  fs.mkdirSync(path.dirname(path.join(root, CLOUDFLARE_SVELTE_OUTPUT.main)), { recursive: true });
  fs.writeFileSync(path.join(root, CLOUDFLARE_SVELTE_OUTPUT.main), 'worker entry');
  fs.mkdirSync(path.join(root, CLOUDFLARE_SVELTE_OUTPUT.bundle), { recursive: true });
  fs.writeFileSync(path.join(root, CLOUDFLARE_SVELTE_OUTPUT.bundle, 'index.js'), 'export default {fetch(){return new Response("demo")}};');
  fs.writeFileSync(path.join(root, CLOUDFLARE_SVELTE_OUTPUT.bundle, 'index.js.map'), 'map');
  const oversized = path.join(assets, 'oversized.mp4');
  const descriptor = fs.openSync(oversized, 'w'); fs.ftruncateSync(descriptor, 25 * 1024 * 1024 + 1); fs.closeSync(descriptor);
  report = inspectCloudflareSvelteOutput(root);
  assert.equal(report.assets.fileSizesWithinLimit, false);
  assert.equal(report.worker.uncompressedWithinLimit, true);
  assert.equal(report.worker.bundledModules, 1);
  assert.deepEqual(report.runtimeCpu, { measured: false, freeQualified: false });
});
