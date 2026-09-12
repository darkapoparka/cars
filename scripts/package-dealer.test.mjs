import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { stripTypeScriptTypes } from 'node:module';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { packageDealer, planDealerPackage } from './package-dealer.mjs';
import { fixSvelteServiceOutput } from './publishing/fix-svelte-service-output.mjs';

const sourceCommit = 'a'.repeat(40);
const manifestFor = (middle = 'modern') => ({
  schemaVersion: 1, slug: 'fixture-cars', repository: 'darkapoparka/cars-fixture', defaultBranch: 'main',
  variants: [{ key: 'auto-best', entry: '/', base: '' }, { key: middle, entry: middle === 'modern' ? '/variant-2/cars' : '/variant-2/', base: '/variant-2' }, { key: 'carwow', entry: '/variant-3/', base: '/variant-3' }],
  extraAssets: ['assets'], packaging: { version: '1' }, switcher: { language: 'en' },
});
const appHtml = '<!doctype html>\n<html><head><link rel="icon" href="/favicon.ico"></head><body>%sveltekit.body%</body></html>\n';
const svelteConfig = 'const config = {\n\tkit: {\n\t\tadapter: adapter()\n\t}\n};\nexport default config;\n';

async function put(root, relative, content) {
  const file = path.join(root, relative);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}

async function fixture(t, middle = 'modern') {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'cars-package-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const source = path.join(directory, 'source');
  const shared = {
    'AGENTS.md': '# Portable dealer instructions\n',
    'LICENSE': 'Retained source license\n',
    'PROVENANCE.md': 'Retained asset provenance\n',
    'assets/reference.jpg': Buffer.from([0, 1, 255, 128]),
    'assets/.env': 'PRIVATE_TOKEN=do-not-copy\n',
    'auto-best/package.json': '{"type":"module","scripts":{"build":"vite build"}}\n',
    'auto-best/package-lock.json': '{"lockfileVersion":3}\r\n',
    'auto-best/src/app.html': appHtml,
    'auto-best/node_modules/ignored.js': 'ignored',
    'auto-best/.git/config': 'nested git',
    'auto-best/.env.production': 'SECRET=private',
    'auto-best/.vercel/project.json': '{"projectId":"private"}',
    'auto-best/AGENTS.md': 'old absolute instructions',
    'auto-best/.client/project.json': '{"id":"preserve"}',
    'auto-best/.client/private-notes.md': 'not public',
    'carwow/package.json': '{"type":"module","engines":{"node":"24.x"}}\n',
    'carwow/package-lock.json': '{"lockfileVersion":3}\r\n',
    'carwow/svelte.config.js': svelteConfig,
    'carwow/src/app.html': appHtml,
    'carwow/src/routes/+layout.svelte': `<script lang="ts">
\timport '$lib/styles/desktop-controls.css';
\tconst routeBodyClasses = $derived(getRouteBodyClasses(page.url.pathname));
\tconst chrome = $derived(routeManagesOwnChrome(page.url.pathname));
\tconst admin = $derived(page.url.pathname.startsWith('/admin'));
\tconst favorites = $derived(page.url.pathname.startsWith('/favorites'));
\tconst presentation = $derived(page.url.pathname.startsWith('/presentation'));
</script>
<SiteHeader pathname={page.url.pathname} />
`,
    'carwow/src/hooks.server.ts': 'const classes = getRouteBodyClasses(event.url.pathname);\n',
    'carwow/src/lib/server/daynight-template-renderer.ts': `function normalizeAssetUrls(html: string) { return html.replaceAll('./assets/', '/assets/'); }
export function render() { return injectLocalBehavior(withSharedHeader, templateFile); }
`,
    'carwow/src/lib/component.svelte': `<script lang="ts">
import { resolve } from '$app/paths';
const image = '/assets/car.webp';
const stock = fetch('/api/cars');
const localRoute = '/contact';
redirect(302, '/contact');
</script>
<a href="/contact">Contact</a><a href={resolve('/inventory')}>Stock</a>
<style>.car { background: url(/assets/bg.webp); }</style>
`,
    'carwow/src/lib/generated-html.ts': 'const html = `<a href="/inventory">Stock</a><img src="/dealer/car.webp">`;\n',
    'carwow/static/css/app.css': '@font-face{src:url("/fonts/main.woff2")}\n',
    'carwow/.template-ref/contact.html': '<a href="contact.html">Retain raw template</a>\n',
  };
  for (const [name, content] of Object.entries(shared)) await put(source, name, content);
  if (middle === 'import') {
    const entries = {
      'import/package.json': '{"type":"module"}\n',
      'import/package-lock.json': '{"lockfileVersion":3}\n',
      'import/svelte.config.js': svelteConfig,
      'import/src/app.html': appHtml,
      'import/src/routes/+layout.svelte': `<script lang="ts">
\timport { page } from '$app/state';
\tlet isInventoryDetailPage = $derived(/^\\/inventory\\/[^/]+\\/?$/.test(page.url.pathname));
\tlet isDashboardArea = $derived(/^\\/(?:account|admin)(?:\\/|$)/.test(page.url.pathname));
\tlet allowsBottomNavInDashboard = $derived(page.url.pathname === '/account/favorites');
</script>
<SiteHeader variant={page.url.pathname === '/' ? 'home' : 'light'} pathname={page.url.pathname} />
<MobileBottomNav pathname={page.url.pathname} />
`,
      'import/src/lib/server/auxero-template.ts': `function normalizeAssetUrls(html: string) { return html.replaceAll('./assets/', '/assets/'); }
function render() { return injectLocalBehavior(withAccessibilityLabels, templateFile, options); }
const response = { location: canonicalRoute, };
`,
      'import/src/lib/home.svelte': `<script lang="ts">
import { resolve } from '$app/paths';
type SectionCtaHref = '/blog' | '/inventory';
const detail = '/inventory';
const data = fetch('/api/cars');
redirect(303, '/account');
</script>
<HomeSectionCta href="/inventory" label="Stock" />
<a href="/">Home</a><form action="/contact"></form>
<img src="/dealer/car.webp"><link href="/fonts/site.css">
<style>.hero{background:url(/assets/hero.webp)}</style>
`,
    };
    for (const [name, content] of Object.entries(entries)) await put(source, name, content);
  } else {
    const entries = {
      'modern/package.json': '{"packageManager":"pnpm@11.4.0"}\n',
      'modern/pnpm-lock.yaml': 'lockfileVersion: 9.0\r\n',
      'modern/apps/web/package.json': '{"name":"web","engines":{"node":"22.x"}}\n',
      'modern/apps/web/next.config.ts': 'let nextConfig: NextConfig = config;\nnextConfig.images = nextConfig.images ?? {};\nexport default nextConfig;\n',
      'modern/packages/next-config/index.ts': 'import { resolve } from "node:path";\nconst config = { outputFileTracingRoot: monorepoRoot, };\n',
      'modern/apps/web/env.ts': 'if (leadSite.staticDemoMode) {\n  process.env.NEXT_PUBLIC_WEB_URL ??= "http://localhost:3001";\n}\nassertRuntimeEnvironmentContract({});\n',
      'modern/apps/web/app/[locale]/layout.tsx': 'export default function Layout() { return <html><head></head><body /></html>; }\n',
      'modern/packages/marketplace-ui/components/marketplace-locale-switch-link.tsx': 'const links = <><a href={href} /><a href={targetPath} /></>;\n',
      'modern/apps/web/proxy.ts': 'const publicProxy: NextProxy = async (request, event) => {\n  const headersResponse = await securityHeaders();\n  return composedMiddleware(request, event);\n};\n',
      'modern/apps/web/app/component.tsx': 'const image="/assets/car.webp", lead="/lead-logo.png"; const route="/cars";\n',
      'modern/apps/web/app/globals.css': '.hero{background:url(/images/hero.webp)}\n',
      'modern/apps/web/.next/route.json': '{}',
      'modern/packages/database/package.json': '{"name":"@repo/database"}\n',
    };
    for (const [name, content] of Object.entries(entries)) await put(source, name, content);
  }
  return { directory, source, destination: path.join(directory, 'out'), manifest: manifestFor(middle), sourceCommit };
}

async function tree(directory) {
  const files = {};
  async function walk(relative = '') {
    for (const entry of (await fs.readdir(path.join(directory, relative), { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await walk(name);
      else files[name] = createHash('sha256').update(await fs.readFile(path.join(directory, name))).digest('hex');
    }
  }
  await walk();
  return files;
}

for (const middle of ['modern', 'import']) {
  test(`${middle} trio packages deterministically without changing source`, async (t) => {
    const options = await fixture(t, middle);
    const before = await tree(options.source);
    const plan = await planDealerPackage(options);
    assert.equal(await fs.access(options.destination).then(() => true, () => false), false);
    const first = await packageDealer(options);
    const second = await packageDealer({ ...options, destination: path.join(options.directory, 'second') });
    assert.equal(plan.digest, first.digest);
    assert.equal(first.digest, second.digest);
    assert.deepEqual(await tree(first.destination), await tree(second.destination));
    assert.deepEqual(await tree(options.source), before);
    assert.ok(first.files.includes('LICENSE'));
    assert.ok(first.files.includes('assets/reference.jpg'));
    assert.ok(first.files.includes('carwow/.template-ref/contact.html'));
    assert.ok(first.files.includes('auto-best/.client/project.json'));
    assert.ok(!first.files.some((name) => /node_modules|\.git\/|\.env|\.vercel\/|\.next\/|private-notes/.test(name)));
    assert.ok(!first.files.includes('auto-best/AGENTS.md'));
    assert.deepEqual(await fs.readFile(path.join(first.destination, 'auto-best/package-lock.json')), await fs.readFile(path.join(options.source, 'auto-best/package-lock.json')));
    const identity = JSON.parse(await fs.readFile(path.join(first.destination, '.cars-package.json'), 'utf8'));
    assert.equal(identity.sourceCommit, sourceCommit);
    assert.deepEqual(identity.manifest, options.manifest);
    assert.equal(identity.packagingVersion, '1');
    assert.ok(!identity.payload.some(({ path: name }) => name === '.cars-package.json'));
    assert.equal(identity.payloadDigest, createHash('sha256').update(JSON.stringify(identity.payload)).digest('hex'));
    assert.doesNotMatch(JSON.stringify(identity), /createdAt|[A-Z]:[\\/]/);
    const vercel = JSON.parse(await fs.readFile(path.join(first.destination, 'vercel.json'), 'utf8'));
    assert.deepEqual(vercel.rewrites.map(({ source }) => source), ['/variant-2/(.*)', '/variant-3/(.*)', '/(.*)']);
    assert.equal(vercel.redirects[0].destination, options.manifest.variants[1].entry);
    assert.equal(vercel.services[middle === 'modern' ? 'modern' : 'importer'].root, middle === 'modern' ? 'modern/apps/web' : 'import');
    assert.match(await fs.readFile(path.join(first.destination, 'auto-best/static/preview-switcher.js'), 'utf8'), /"language":"en"/);
    assert.doesNotMatch(await fs.readFile(path.join(first.destination, 'scripts/fix-svelte-service-output.mjs'), 'utf8'), /[A-Z]:[\\/]/);
    await assert.rejects(() => packageDealer(options), /destination already exists/);
    const repeated = await packageDealer({ ...options, source: first.destination, destination: path.join(options.directory, 'already-mounted') });
    assert.equal(first.digest, repeated.digest, 'already-mounted package should remain unchanged');
  });
}

test('mounted paths keep assets, API, CSS, links, route comparisons and raw renderer behavior distinct', async (t) => {
  const options = await fixture(t, 'import');
  await packageDealer(options);
  const component = await fs.readFile(path.join(options.destination, 'import/src/lib/home.svelte'), 'utf8');
  assert.match(component, /fetch\('\/variant-2\/api\/cars'\)/);
  assert.match(component, /redirect\(303, '\/variant-2\/account'\)/);
  assert.match(component, /background:url\(\/variant-2\/assets\/hero\.webp\)/);
  assert.match(component, /href="\/variant-2\/"/);
  assert.match(component, /action="\/variant-2\/contact"/);
  assert.match(component, /<HomeSectionCta href="\/inventory"/);
  assert.match(component, /type SectionCtaHref = '\/blog' \| '\/inventory'/);
  assert.match(component, /const detail = '\/inventory'/);
  assert.match(component, /from '\$lib\/utils\/preview-paths'/);
  const renderer = await fs.readFile(path.join(options.destination, 'import/src/lib/server/auxero-template.ts'), 'utf8');
  assert.match(renderer, /replaceAll\('\.\/assets\/', '\/variant-2\/assets\/'\)/);
  assert.match(renderer, /return previewHtml\(injectLocalBehavior/);
  assert.match(renderer, /location: previewPath\(canonicalRoute\)/);
  const layout = await fs.readFile(path.join(options.destination, 'import/src/routes/+layout.svelte'), 'utf8');
  assert.match(layout, /localPath\(page.url.pathname\) === '\/account\/favorites'/);
  assert.match(layout, /pathname=\{localPath\(page.url.pathname\)\}/);
  assert.match(await fs.readFile(path.join(options.destination, 'carwow/static/css/app.css'), 'utf8'), /\/variant-3\/fonts\/main/);
});

test('Modern keeps the locale loop guard, static-demo-only validation and tracing root', async (t) => {
  const options = await fixture(t);
  await packageDealer(options);
  const proxy = await fs.readFile(path.join(options.destination, 'modern/apps/web/proxy.ts'), 'utf8');
  assert.match(proxy, /if \(leadSite.staticDemoMode\)/);
  assert.match(proxy, /request.headers.get\("x-dealer-locale-rewrite"\) === "1"/);
  assert.match(proxy, /requestHeaders.set\("x-dealer-locale-rewrite", "1"\)/);
  assert.match(proxy, /request.nextUrl.search/);
  const env = await fs.readFile(path.join(options.destination, 'modern/apps/web/env.ts'), 'utf8');
  assert.match(env, /if \(!leadSite.staticDemoMode\) assertRuntimeEnvironmentContract/);
  assert.match(env, /process.env.NEXT_PUBLIC_WEB_URL \?\?= origin/);
  assert.match(await fs.readFile(path.join(options.destination, 'modern/packages/next-config/index.ts'), 'utf8'), /outputFileTracingRoot: resolve\(monorepoRoot, "\.\."\)/);
  assert.match(await fs.readFile(path.join(options.destination, 'modern/packages/marketplace-ui/components/marketplace-locale-switch-link.tsx'), 'utf8'), /href=\{`\/variant-2\$\{targetPath\}`\}/);
  assert.match(await fs.readFile(path.join(options.destination, 'modern/apps/web/app/component.tsx'), 'utf8'), /const route="\/cars"/);
});

test('missing anchors, hybrid mounts, traversal, omitted assets and unsafe output fail before output exists', async (t) => {
  const options = await fixture(t, 'import');
  await assert.rejects(() => packageDealer({ ...options, destination: path.join(options.source, 'new-package') }), /separate from canonical source/);
  await assert.rejects(() => packageDealer({ ...options, manifest: { ...options.manifest, extraAssets: ['../outside'] } }), /Invalid extra asset/);
  await assert.rejects(() => packageDealer({ ...options, manifest: { ...options.manifest, extraAssets: ['.env'] } }), /Protected/);
  await assert.rejects(() => packageDealer({ ...options, manifest: { ...options.manifest, extraAssets: ['missing-assets'] } }), /missing/);
  await put(options.source, 'import/svelte.config.js', "const config = {kit: { paths: { base: '/variant-2', relative: false } }};\n");
  await assert.rejects(() => packageDealer(options), /Unknown hybrid/);
  await put(options.source, 'import/svelte.config.js', svelteConfig);
  await put(options.source, 'carwow/src/hooks.server.ts', 'const unknown = true;\n');
  await assert.rejects(() => packageDealer(options), /Carwow hooks route classification anchor/);
  assert.equal(await fs.access(options.destination).then(() => true, () => false), false);
});

test('portable path wrapper mounts exactly once and preserves external and typed routes', async () => {
  let source = await fs.readFile(new URL('./publishing/preview-paths.ts.txt', import.meta.url), 'utf8');
  source = source.replace("import { base, resolve as kitResolve } from '$app/paths';", "const base = '/variant-3'; const kitResolve = (route: string) => `${base}${route}`;")
    .replace("export * from '$app/paths';", '');
  const code = stripTypeScriptTypes(source);
  const wrapper = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  assert.equal(wrapper.resolve('/inventory'), '/variant-3/inventory');
  assert.equal(wrapper.resolve('/variant-3/inventory'), '/variant-3/inventory');
  assert.equal(wrapper.previewPath('//cdn.example/a.jpg'), '//cdn.example/a.jpg');
  assert.equal(wrapper.previewPath('https://example.com'), 'https://example.com');
  assert.equal(wrapper.localPath('/variant-3/inventory'), '/inventory');
  assert.equal(wrapper.localPath('/variant-30/inventory'), '/variant-30/inventory');
  assert.equal(wrapper.previewHtml('<a href="/contact">Contact</a><img src="/variant-3/assets/a.webp"><i style="background:url(/assets/a.webp)"></i><script src="/preview-switcher.js"></script>'), '<a href="/variant-3/contact">Contact</a><img src="/variant-3/assets/a.webp"><i style="background:url(/variant-3/assets/a.webp)"></i><script src="/preview-switcher.js"></script>');
});

test('Svelte Services output mounts root/static routes once and validates missing or unsafe output', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'cars-service-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const config = { version: 3, routes: [{ src: '^/contact/?$', dest: '/' }, { handle: 'filesystem' }], overrides: { 'offers+new.html': { path: 'variant-3/offers+new' } } };
  await put(directory, 'config.json', JSON.stringify(config));
  await put(directory, 'functions/index.func/.vc-config.json', '{}');
  await put(directory, 'static/variant-3/offers+new.html', '<h1>Offers</h1>');
  await fixSvelteServiceOutput({ output: directory, base: '/variant-3' });
  const once = await fs.readFile(path.join(directory, 'config.json'), 'utf8');
  await fixSvelteServiceOutput({ output: directory, base: '/variant-3' });
  assert.equal(await fs.readFile(path.join(directory, 'config.json'), 'utf8'), once);
  const mounted = JSON.parse(once);
  assert.equal(mounted.routes[1].dest, '/index');
  assert.equal(mounted.routes[1].src, '^/variant-3/contact/?$');
  assert.ok(new RegExp(mounted.routes[0].src).test('/variant-3/offers+new/'));
  assert.ok(!new RegExp(mounted.routes[0].src).test('/variant-3/offersssnew/'));
  await put(directory, 'config.json', JSON.stringify({ routes: [], overrides: { 'missing.html': { path: 'missing' } } }));
  await assert.rejects(() => fixSvelteServiceOutput({ output: directory }), /Missing prerendered/);
  await put(directory, 'config.json', JSON.stringify({ routes: [], overrides: { '../outside': { path: '../outside' } } }));
  await assert.rejects(() => fixSvelteServiceOutput({ output: directory }), /Unsafe prerendered/);
});

test('both packaging CLIs expose portable --help', () => {
  for (const file of ['package-dealer.mjs', 'publishing/fix-svelte-service-output.mjs']) {
    const result = spawnSync(process.execPath, [path.join(import.meta.dirname, file), '--help'], { cwd: os.tmpdir(), encoding: 'utf8', windowsHide: true });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Usage:/);
  }
});
