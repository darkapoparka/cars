import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { assertSixDesignSelection } from '../lib/six-design-release.mjs';
import { legacyDetailArtifact, legacyDetailRedirects } from './legacy-detail-routes.mjs';

export const CLOUDFLARE_PUBLISHER_VERSION = '1';
const json = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const ROUTER_LOCK_SHA256 = '43d61c1a6932cc9c6f1d7c653c3ba6789921aa0880ea2e948ac76a408e114f80';
export function cloudflareRoutingPlan(manifest, { workerPrefix = manifest.cloudflare?.workerPrefix ?? 'cars-' + manifest.slug, redirects = [] } = {}) {
  if (manifest.packaging?.version !== '5') throw Error('Cloudflare requires the explicit six-design package');
  assertSixDesignSelection(manifest.variants);
  if (!/^[a-z][a-z0-9-]{0,47}$/.test(workerPrefix)) throw Error('Invalid Cloudflare Worker prefix');
  const variants = manifest.variants.map(v => ({ ...v,
    binding: 'CARS_' + v.key.toUpperCase().replaceAll('-', '_'),
    worker: workerPrefix + '-' + (v.key === 'karento-best' ? 'signature' : v.key) }));
  return { schemaVersion: 1, publisherVersion: CLOUDFLARE_PUBLISHER_VERSION, provider: 'cloudflare',
    dealer: manifest.slug, worker: workerPrefix, workerCount: 7, variants, redirects,
    configuration: { name: workerPrefix, main: 'router.mjs', compatibility_date: '2026-10-10',
      workers_dev: true, observability: { enabled: true, head_sampling_rate: 1 },
      assets: { directory: './public', binding: 'ASSETS', run_worker_first: false },
      services: variants.map(v => ({ binding: v.binding, service: v.worker })) } };
}

/** Provider adaptation of already checked/mounted source; never mutates masters. */
export async function applyCloudflareProvider(input, manifest, { workerPrefix, svelteAdapter, nextAdapter, dependencyLocks } = {}) {
  const files = new Map(input);
  for (const name of ['vercel.json', '.cars-vercel-assets.json', '.cars-shared-media.json', '.cars-cloudflare.json']) {
    if (files.has(name)) throw Error('Cloudflare adaptation requires original input, before provider transforms: ' + name);
  }
  const artifact = legacyDetailArtifact(files, manifest);
  const plan = cloudflareRoutingPlan(manifest, { workerPrefix, redirects: legacyDetailRedirects(manifest, artifact) });
  svelteAdapter ??= (await import('./cloudflare-svelte.mjs')).applyCloudflareSvelte;
  nextAdapter ??= (await import('./cloudflare-next.mjs')).applyCloudflareNext;
  let adapted = await svelteAdapter(files, manifest, { workerPrefix: plan.worker, ...(dependencyLocks?.svelte ? { dependencyLocks: dependencyLocks.svelte } : {}) });
  adapted = await nextAdapter(adapted, manifest, { workerPrefix: plan.worker, ...(dependencyLocks?.next ? { dependencyLocks: dependencyLocks.next } : {}) });
  if (!(adapted instanceof Map)) throw Error('Cloudflare family adapters must return a source Map');
  const switcher = adapted.get('auto-best/static/preview-switcher.js');
  if (!switcher) throw Error('Cloudflare package requires its exact bundled design selector');
  const factory = await readFile(new URL('./cloudflare-router.mjs', import.meta.url), 'utf8');
  adapted.set('cloudflare/router.mjs', Buffer.from(factory + '\nexport default createDealerRouter(' + JSON.stringify({ variants: plan.variants, redirects: plan.redirects }) + ');\n'));
  adapted.set('cloudflare/wrangler.jsonc', json(plan.configuration));
  const routerPackage = { name: 'cars-cloudflare-dealer-router', private: true, type: 'module',
    devDependencies: { wrangler: '4.149.0' }, scripts: { check: 'wrangler deploy --dry-run', deploy: 'wrangler deploy' } };
  const routerLock = await readFile(new URL('./cloudflare-router-lock.json', import.meta.url));
  if (hash(routerLock) !== ROUTER_LOCK_SHA256) throw Error('Frozen Cloudflare router dependency lock changed');
  const routerLockRoot = JSON.parse(routerLock).packages?.[''];
  if (routerLockRoot?.name !== routerPackage.name || JSON.stringify(routerLockRoot?.devDependencies) !== JSON.stringify(routerPackage.devDependencies)) throw Error('Cloudflare router package differs from qualified dependency lock');
  adapted.set('cloudflare/package.json', json(routerPackage));
  adapted.set('cloudflare/package-lock.json', routerLock);
  adapted.set('cloudflare/public/preview-switcher.js', Buffer.from(switcher));
  adapted.set('cloudflare/public/robots.txt', Buffer.from('User-agent: *\nDisallow: /\n'));
  const adapterReceipts = ['.cars-cloudflare-svelte.json', '.cars-cloudflare-next.json'].map(name => ({ path: name, sha256: hash(adapted.get(name) ?? Buffer.alloc(0)) }));
  if (adapterReceipts.some(r => !adapted.has(r.path))) throw Error('Missing exact Cloudflare family adapter receipts');
  const svelte = JSON.parse(adapted.get('.cars-cloudflare-svelte.json'));
  const next = JSON.parse(adapted.get('.cars-cloudflare-next.json'));
  const dependencyLocksFrozen = svelte.services?.length === 3 && svelte.services.every(service => service.dependencyLockStatus === 'frozen')
    && next.targets?.length === 3 && next.dependencyLock === 'frozen';
  adapted.set('.cars-cloudflare.json', json({ ...plan, adapterReceipts,
    routerDependencyLock: { path: 'cloudflare/package-lock.json', sha256: ROUTER_LOCK_SHA256, status: 'frozen' },
    acceptance: { dependencyLocksFrozen, buildVerified: false, hostedVerified: false, freePlanQualified: false },
    assets: { mode: 'family-owned', vercelExternalization: false },
    countryHint: { source: 'request.cf.country', header: 'x-cars-country', ingress: 'router-only', precedence: 'URL, saved preference, browser language, country hint, dealer default' } }));
  return adapted;
}
