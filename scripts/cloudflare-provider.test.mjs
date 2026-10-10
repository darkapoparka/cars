import assert from 'node:assert/strict';
import test from 'node:test';
import { createDealerRouter } from './publishing/cloudflare-router.mjs';
import { cloudflareRoutingPlan, applyCloudflareProvider } from './publishing/cloudflare-provider.mjs';
const manifest = { schemaVersion: 1, slug: 'fixture-uk', packaging: { version: '5' }, variants: [
  { key: 'auto-best', base: '', entry: '/' }, { key: 'modern', base: '/variant-2', entry: '/variant-2/cars' },
  { key: 'import', base: '/variant-3', entry: '/variant-3/' }, { key: 'app', base: '/variant-4', entry: '/variant-4/' },
  { key: 'mobile', base: '/variant-5', entry: '/variant-5/' }, { key: 'karento-best', base: '/variant-6', entry: '/variant-6/' } ] };
const setup = redirects => {
  const plan = cloudflareRoutingPlan(manifest, { redirects });
  const calls = [];
  const env = Object.fromEntries(plan.variants.map(v => [v.binding, { async fetch(request) {
    calls.push({ family: v.key, request, body: request.body ? await request.text() : null });
    return new Response(v.key, { headers: { 'Set-Cookie': 'locale=en; Path=/', 'Cache-Control': 'private, no-store' } });
  } }]));
  env.ASSETS = { async fetch(request) { calls.push({ family: 'assets', request }); return new Response('asset'); } };
  return { plan, calls, env, router: createDealerRouter(plan) };
};
test('six routes use exact mount boundaries in both middle-family orders', async () => {
  for (const middle of ['modern', 'import']) {
    const selected = structuredClone(manifest);
    if (middle === 'import') {
      selected.variants[1] = { key: 'import', base: '/variant-2', entry: '/variant-2/' };
      selected.variants[2] = { key: 'modern', base: '/variant-3', entry: '/variant-3/cars' };
    }
    const plan = cloudflareRoutingPlan(selected), router = createDealerRouter(plan);
    for (const variant of plan.variants) {
      const env = { [variant.binding]: { fetch: async () => new Response(variant.key) } };
      assert.equal(await (await router.fetch(new Request('https://demo.example' + variant.entry), env)).text(), variant.key);
    }
  }
  const s = setup();
  await s.router.fetch(new Request('https://demo.example/variant-20/missing'), s.env);
  assert.equal(s.calls[0].family, 'auto-best');
});
test('country hints come only from Cloudflare and body, locale and response privacy survive forwarding', async () => {
  const s = setup();
  const request = new Request('https://demo.example/variant-3/api/preferences?lang=en', { method: 'POST', body: 'locale=en',
    headers: { 'x-cars-country': 'BG', 'x-vercel-ip-country': 'BG', Cookie: 'locale=en', 'Accept-Language': 'en-GB' } });
  Object.defineProperty(request, 'cf', { value: { country: 'GB' } });
  const response = await s.router.fetch(request, s.env);
  assert.equal(s.calls[0].request.url, request.url);
  assert.equal(s.calls[0].request.method, 'POST');
  assert.equal(s.calls[0].body, 'locale=en');
  assert.equal(s.calls[0].request.headers.get('x-cars-country'), 'GB');
  assert.equal(s.calls[0].request.headers.get('x-vercel-ip-country'), null);
  assert.equal(s.calls[0].request.headers.get('cookie'), 'locale=en');
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(response.headers.get('set-cookie'), 'locale=en; Path=/');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  const forged = new Request('https://demo.example/', { headers: { 'x-cars-country': 'BG' } });
  await s.router.fetch(forged, s.env);
  assert.equal(s.calls[1].request.headers.get('x-cars-country'), null);
});
test('bare mounts and exact legacy redirects preserve query state', async () => {
  const s = setup([{ source: '/variant-3/old-car', destination: '/variant-3/en/listing/123', permanent: false }]);
  const response = await s.router.fetch(new Request('https://demo.example/variant-2?lang=en&make=Ford'), s.env);
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('location'), 'https://demo.example/variant-2/cars?lang=en&make=Ford');
  const legacy = await s.router.fetch(new Request('https://demo.example/variant-3/old-car?ref=saved'), s.env);
  assert.equal(legacy.headers.get('location'), 'https://demo.example/variant-3/en/listing/123?ref=saved');
  const repeated = await s.router.fetch(new Request('https://demo.example/variant-2?make=Audi&make=BMW'), s.env);
  assert.deepEqual(new URL(repeated.headers.get('location')).searchParams.getAll('make'), ['Audi', 'BMW']);
  assert.throws(() => createDealerRouter({ ...s.plan, redirects: [{ source: '/', destination: '//evil.example' }] }), /Unsupported/);
});
test('shared assets never enter the application renderer and missing services fail visibly', async () => {
  const s = setup();
  await s.router.fetch(new Request('https://demo.example/preview-switcher.js'), s.env);
  assert.equal(s.calls[0].family, 'assets');
  assert.equal((await s.router.fetch(new Request('https://demo.example/variant-6/'), {})).status, 503);
});
test('provider transformation refuses Vercel output and records unverified acceptance', async () => {
  const original = new Map([['auto-best/static/preview-switcher.js', Buffer.from('selector')]]);
  const adapter = name => files => new Map([...files, [name, Buffer.from('{"buildVerified":false}')]]);
  const result = await applyCloudflareProvider(original, manifest, {
    svelteAdapter: adapter('.cars-cloudflare-svelte.json'), nextAdapter: adapter('.cars-cloudflare-next.json') });
  assert.equal(original.size, 1);
  assert.equal(JSON.parse(result.get('.cars-cloudflare.json')).acceptance.freePlanQualified, false);
  assert.equal(JSON.parse(result.get('cloudflare/wrangler.jsonc')).services.length, 6);
  assert.equal(result.has('vercel.json'), false);
  assert.equal(JSON.parse(result.get('cloudflare/package-lock.json')).packages[''].devDependencies.wrangler, '4.149.0');
  assert.equal(JSON.parse(result.get('.cars-cloudflare.json')).routerDependencyLock.status, 'frozen');
  await assert.rejects(() => applyCloudflareProvider(new Map([...original, ['vercel.json', Buffer.from('{}')]]), manifest), /before provider transforms/);
  assert.throws(() => cloudflareRoutingPlan({ ...manifest, packaging: { version: '1' } }), /explicit six-design/);
});
