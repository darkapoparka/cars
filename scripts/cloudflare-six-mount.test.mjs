import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { applySixVariantMounts, sealSixVariantBuild } from './publishing/six-variant.mjs';
import { applyCloudflareSvelte } from './publishing/cloudflare-svelte.mjs';
import { planSixDesignSelection } from './lib/six-design-release.mjs';

const bytes = value => Buffer.from(typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
const sha = value => createHash('sha256').update(value).digest('hex');
function fixture() {
  const pkg = { name: 'signature-fixture', private: true, type: 'module', engines: { node: '26.10.0' },
    devDependencies: { '@sveltejs/adapter-node': '6.0.0', '@sveltejs/kit': '3.0.1', svelte: '5.57.2', vite: '8.3.3' } };
  const lock = { name: 'signature-fixture', lockfileVersion: 3, packages: {
    '': { devDependencies: { ...pkg.devDependencies }, engines: { ...pkg.engines } },
    'node_modules/@sveltejs/kit': { version: '3.0.1' }, 'node_modules/svelte': { version: '5.57.2' },
    'node_modules/vite': { version: '8.3.3' }, 'node_modules/@sveltejs/vite-plugin-svelte': { version: '7.3.1' }
  } };
  const files = new Map([
    ['karento-best/package.json', bytes(pkg)], ['karento-best/package-lock.json', bytes(lock)],
    ['karento-best/.node-version', bytes('26.10.0\n')],
    ['karento-best/vite.config.ts', bytes('import adapter from "@sveltejs/adapter-node"; export default defineConfig({plugins: [sveltekit({ adapter: adapter() })]});')],
    ['karento-best/src/app.html', bytes('<html><head>%sveltekit.head%</head><body>%sveltekit.body%</body></html>')],
    ['karento-best/src/lib/routes.ts', bytes('export type SourceKey = "index"; export function resolveRoute(path: string): SourceKey | null { return path === "/" ? "index" : null; }')],
    ['karento-best/src/lib/components/Navigation.svelte', bytes('<script lang="ts">import { goto } from "$app/navigation"; const active = page.url.pathname === "/vehicles";</script><a href="/vehicles">Cars</a><img src="/brand/logo.webp"/><a href={item.href}>Details</a>')],
    ['karento-best/static/brand/logo.webp', bytes('retained logo bytes')],
    ['mobile/next.config.js', bytes('module.exports = { images: { unoptimized: true } };')],
    ['mobile/src/app/layout.tsx', bytes('export default function Layout(){return <html><body><Children /></body></html>}')],
    ['.cars-app.json', bytes('app source receipt')], ['.cars-mobile.json', bytes('mobile source receipt')],
    ['.cars-signature.json', bytes('signature source receipt')]
  ]);
  const vercelPkg = { ...structuredClone(pkg), engines: { node: '24.x' },
    devDependencies: { ...pkg.devDependencies, '@sveltejs/adapter-vercel': '7.0.0' } };
  const signatureAdapter = { schemaVersion: 1, version: '7.0.0', runtime: 'nodejs24.x',
    input: { packageSha256: sha(files.get('karento-best/package.json')), lockSha256: sha(files.get('karento-best/package-lock.json')) },
    package: vercelPkg, lock: { ...lock, packages: { ...lock.packages, '': { devDependencies: vercelPkg.devDependencies, engines: vercelPkg.engines } } } };
  return { files, signatureAdapter };
}
function manifest() {
  const variants = planSixDesignSelection([
    { key: 'auto-best', base: '', entry: '/' }, { key: 'modern', base: '/variant-2', entry: '/variant-2/cars' },
    { key: 'carwow', base: '/variant-3', entry: '/variant-3/' }
  ]).variants;
  return { schemaVersion: 1, slug: 'neutral-mount-fixture', packaging: { version: '5' }, variants };
}

test('Cloudflare neutral mounting preserves Signature source dependencies/runtime before family adaptation', () => {
  const { files } = fixture(), before = [...files].map(([name, value]) => [name, value.toString('hex')]);
  const output = applySixVariantMounts(files, manifest(), { provider: 'cloudflare' });
  for (const name of ['karento-best/package.json', 'karento-best/package-lock.json', 'karento-best/.node-version', '.cars-signature.json']) {
    assert.equal(output.get(name), files.get(name));
  }
  const config = output.get('karento-best/vite.config.ts').toString();
  assert.match(config, /@sveltejs\/adapter-node/);
  assert.ok(!config.includes('adapter-vercel') && !config.includes('nodejs24.x') && !config.includes('adapter-cloudflare'));
  assert.match(config, /sveltekit\(\{ adapter: adapter\(\), paths: \{ base: "\/variant-6", relative: false \}/);
  assert.match(output.get('karento-best/src/lib/routes.ts').toString(), /path = carsLocalPath\(path\)/);
  assert.match(output.get('karento-best/src/lib/components/Navigation.svelte').toString(), /href="\/variant-6\/vehicles"/);
  assert.match(output.get('karento-best/src/lib/components/Navigation.svelte').toString(), /src="\/variant-6\/brand\/logo.webp"/);
  assert.match(output.get('karento-best/src/lib/components/Navigation.svelte').toString(), /#lib\/cars-navigation.ts/);
  assert.match(output.get('karento-best/src/lib/components/Navigation.svelte').toString(), /carsLocalPath\(page.url.pathname\)/);
  assert.equal(output.get('karento-best/static/brand/logo.webp'), files.get('karento-best/static/brand/logo.webp'));
  assert.deepEqual([...files].map(([name, value]) => [name, value.toString('hex')]), before);
});

test('Cloudflare family adaptation follows neutral mounting without a Vercel dependency detour', () => {
  const { files } = fixture(), mounted = applySixVariantMounts(files, manifest(), { provider: 'cloudflare' });
  const output = applyCloudflareSvelte(mounted, manifest(), { serviceKeys: ['karento-best'] });
  const pkg = JSON.parse(output.get('karento-best/package.json'));
  assert.equal(pkg.engines.node, '26.10.0');
  assert.equal(pkg.devDependencies['@sveltejs/adapter-cloudflare'], '8.0.0');
  assert.equal(pkg.devDependencies['@sveltejs/adapter-vercel'], undefined);
  assert.equal(pkg.devDependencies['@sveltejs/adapter-node'], undefined);
  assert.equal(output.get('karento-best/package-lock.json'), files.get('karento-best/package-lock.json'));
  assert.match(output.get('karento-best/vite.config.ts').toString(), /@sveltejs\/adapter-cloudflare/);
  assert.match(output.get('karento-best/vite.config.ts').toString(), /base: "\/variant-6", relative: false/);
  const receipt = JSON.parse(output.get('.cars-cloudflare-svelte.json'));
  assert.equal(receipt.services[0].workerName, 'cars-neutral-mount-fixture-signature');
  assert.equal(receipt.services[0].dependencyLockStatus, 'requires-materialization');
  assert.equal(receipt.qualification.built, false);
});

test('omitted provider keeps the existing frozen Vercel adapter and Node24 output', () => {
  const { files, signatureAdapter } = fixture();
  const defaultOutput = applySixVariantMounts(files, manifest(), { signatureAdapter });
  const explicitOutput = applySixVariantMounts(files, manifest(), { signatureAdapter, provider: 'vercel' });
  assert.deepEqual([...defaultOutput].map(([name, value]) => [name, value.toString('hex')]), [...explicitOutput].map(([name, value]) => [name, value.toString('hex')]));
  assert.deepEqual(JSON.parse(defaultOutput.get('karento-best/package.json')), signatureAdapter.package);
  assert.deepEqual(JSON.parse(defaultOutput.get('karento-best/package-lock.json')), signatureAdapter.lock);
  assert.equal(defaultOutput.get('karento-best/.node-version').toString(), '24.21.0\n');
  assert.match(defaultOutput.get('karento-best/vite.config.ts').toString(), /adapter-vercel/);
  assert.match(defaultOutput.get('karento-best/vite.config.ts').toString(), /runtime: "nodejs24.x"/);
});

test('Vercel input proof and provider/native mount guards remain enforced', () => {
  const { files, signatureAdapter } = fixture();
  const changedAdapter = structuredClone(signatureAdapter); changedAdapter.input.packageSha256 = '0'.repeat(64);
  assert.throws(() => applySixVariantMounts(files, manifest(), { signatureAdapter: changedAdapter }), /dependency inputs changed/);
  const neutral = applySixVariantMounts(files, manifest(), { provider: 'cloudflare', signatureAdapter: changedAdapter });
  assert.equal(neutral.get('karento-best/package.json'), files.get('karento-best/package.json'));
  assert.throws(() => applySixVariantMounts(files, manifest(), { provider: 'unknown' }), /hosting provider/);
  const remounted = new Map(files); remounted.set('karento-best/vite.config.ts', bytes('import adapter from "@sveltejs/adapter-node"; sveltekit({ adapter: adapter(), paths: {base:"/old"} });'));
  assert.throws(() => applySixVariantMounts(remounted, manifest(), { provider: 'cloudflare' }), /boundary changed/);
});

test('Cloudflare mounting receipt keeps build status unverified and Vercel default receipt unchanged', () => {
  const { files, signatureAdapter } = fixture();
  const cloudflare = applySixVariantMounts(files, manifest(), { provider: 'cloudflare' });
  sealSixVariantBuild(cloudflare, manifest(), { provider: 'cloudflare' });
  const cfReceipt = JSON.parse(cloudflare.get('.cars-six-build.json'));
  assert.equal(cfReceipt.transformation, 'six-design-cloudflare-v1');
  assert.deepEqual(cfReceipt.signature, { provider: 'cloudflare', adapterReceipt: '.cars-cloudflare-svelte.json', buildVerified: false });
  const vercel = applySixVariantMounts(files, manifest(), { signatureAdapter }); sealSixVariantBuild(vercel, manifest());
  const vercelReceipt = JSON.parse(vercel.get('.cars-six-build.json'));
  assert.equal(vercelReceipt.transformation, 'six-design-services-v1');
  assert.deepEqual(vercelReceipt.signature, { adapter: '@sveltejs/adapter-vercel@7.0.0', runtime: 'nodejs24.x' });
  assert.equal(cfReceipt.families['karento-best'].base, '/variant-6');
  assert.equal(cfReceipt.sourceReceipts['.cars-signature.json'], sha(files.get('.cars-signature.json')));
});
