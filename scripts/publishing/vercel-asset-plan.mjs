import { createHash } from 'node:crypto';
import { planAssetRetention } from './public-asset-retention.mjs';

export const PUBLIC_ROOTS = Object.freeze({
  'auto-best': 'auto-best/static/', modern: 'modern/apps/web/public/',
  carwow: 'carwow/static/', import: 'import/static/', app: 'app/public/',
  mobile: 'mobile/public/', 'karento-best': 'karento-best/static/'
});
export const SERVICE_NAMES = Object.freeze({ 'auto-best': 'autobest', modern: 'modern', carwow: 'carwow', import: 'importer', app: 'app', mobile: 'mobile', 'karento-best': 'signature' });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const binaryMedia = /\.(?:png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|mp4|webm)$/i;
const text = /\.(?:svelte|[cm]?[jt]sx?|json|css|scss|html|svg|webmanifest)$/i;
const ignored = /(?:^|\/)(?:node_modules|\.git|\.next[^/]*|\.svelte-kit|docs|tests|scripts|provenance|artifacts|reference)(?:\/|$)|\.(?:test|spec)\.[^.]+$/i;
const escape = value => value.replace(/[.*+?^${}()|[\]\\:]/g, '\\$&');
const parse = (files, name) => JSON.parse(files.get(name)?.toString() || 'null');
const json = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
function identity(manifest) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest?.slug || '') || !Array.isArray(manifest.variants)) throw Error('Invalid dealer asset identity');
  for (const v of manifest.variants) if (!PUBLIC_ROOTS[v.key] || !/^(?:|\/variant-[2-9][0-9]*)$/.test(v.base)) throw Error('Unsupported Vercel asset family/mount');
  if (new Set(manifest.variants.map(v => v.key)).size !== manifest.variants.length || new Set(manifest.variants.map(v => v.base)).size !== manifest.variants.length) throw Error('Duplicate asset family/mount');
}
export function familyRetention(files, key) {
  const prefix = PUBLIC_ROOTS[key], policy = parse(files, `${key}/public-assets.policy.json`);
  if (!prefix || !policy) return { omitted: [], retained: [] };
  const consumers = [...files].filter(([name]) => name.startsWith(key + '/') && text.test(name) && !ignored.test(name.slice(key.length + 1)) && name !== `${key}/public-assets.policy.json`)
    .map(([name, bytes]) => ({ path: name, text: bytes.toString('utf8') }));
  const assets = new Map([...files].filter(([name]) => name.startsWith(prefix)).map(([name, bytes]) => [name.slice(prefix.length), bytes]));
  return planAssetRetention({ assets, consumers, policy });
}


/** Service destination.path selects routing, but does not change the runtime URL.
 * Change only exact sealed shared object lookup paths, preserving mounts and
 * external media routing. No wildcard or user-controlled path is admitted. */
export function sharedMediaRuntimeRoutes(plan) {
  if (plan?.schemaVersion !== 1 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(plan.dealer || '')
    || !Array.isArray(plan.objects) || !Array.isArray(plan.aliases) || !Array.isArray(plan.removals)
    || plan.objects.length > 1500) throw Error('Invalid sealed shared media routing plan');
  const destinations = new Map();
  for (const object of plan.objects) {
    const destination = object.publicPath?.slice('auto-best/static'.length);
    const pattern = new RegExp('^/_cars/media/' + plan.dealer + '/([a-f0-9]{64})\\.(png|jpg|webp|avif|gif|ico|woff2?|ttf|otf|mp4|webm)$');
    const matched = typeof destination === 'string' && destination.match(pattern);
    if (!matched || !object.publicPath.startsWith('auto-best/static/')
      || matched[1] !== object.sha256 || object.path !== '.cars-media' + destination.slice('/_cars/media'.length)
      || !Number.isSafeInteger(object.bytes) || object.bytes <= 0 || destinations.has(destination))
      throw Error('Unknown or unsafe sealed shared media destination');
    destinations.set(destination, object);
  }
  const expected = plan.removals.filter(row => row.reason === 'shared-local')
    .map(row => ({ source: escape(row.sourceUrlPath), destination: { service: 'autobest', path: row.destination } }));
  if (JSON.stringify(plan.aliases) !== JSON.stringify(expected)
    || plan.aliases.some(row => row.destination?.service !== 'autobest' || !destinations.has(row.destination.path))
    || [...destinations.keys()].some(destination => !plan.aliases.some(row => row.destination.path === destination)))
    throw Error('Shared media aliases differ from sealed objects');
  return [...destinations.keys()].map(destination => {
    // Services preserves the original URL for runtimes. Admit only exact
    // sealed original aliases and the exact shared lookup path in either
    // route-evaluation form; keep one bounded rule for each sealed object.
    const sources = [...new Set([escape(destination), ...plan.aliases
      .filter(row => row.destination.path === destination).map(row => row.source)])];
    const src = '^(?:' + sources.join('|') + ')$';
    if (sources.length > 101 || src.length > 8192) throw Error('Shared media exact route group exceeded bounded size');
    return { src, dest: destination, transforms: [{ type: 'request.path', op: 'set', args: destination }] };
  });
}

/** Plan only: source bytes and App/native source seals are never changed. */
export function planVercelAssets(files, { maxPublicBytes = 384 * 1024 * 1024, maxRoutes = 1500 } = {}) {
  const manifest = parse(files, 'dealer.json'); identity(manifest);
  if (!Number.isSafeInteger(maxPublicBytes) || maxPublicBytes <= 0 || !Number.isSafeInteger(maxRoutes) || maxRoutes < 1) throw Error('Invalid Vercel asset budgets');
  const external = parse(files, '.cars-shared-media.json');
  if (external && (external.schemaVersion !== 1 || external.dealer !== manifest.slug)) throw Error('Shared media belongs to another dealer');
  const externalPaths = new Map((external?.entries || []).map(e => [PUBLIC_ROOTS[e.service] + e.relative, e]));
  const entries = [], removals = [], family = {};
  for (const v of manifest.variants) {
    const prefix = PUBLIC_ROOTS[v.key], retention = familyRetention(files, v.key);
    const omitted = new Map(retention.omitted.map(e => [e.path, e]));
    family[v.key] = { inputFiles: 0, inputBytes: 0, unusedFiles: 0, unusedBytes: 0, externalBytes: 0, pooledCopies: 0 };
    for (const [name, bytes] of files) {
      if (!name.startsWith(prefix)) continue;
      const relative = name.slice(prefix.length), digest = hash(bytes), ext = externalPaths.get(name);
      if (!relative || relative.split('/').some(s => !s || s === '..' || s === '.') || /[\\\u0000]/.test(relative)) throw Error('Unsafe public asset');
      if (relative.startsWith('_cars/')) throw Error('Input already has generated media; regenerate from source');
      family[v.key].inputFiles++; family[v.key].inputBytes += bytes.length;
      const entry = { service: v.key, relative, sourcePath: name, sha256: digest, bytes: bytes.length, sourceUrlPath: v.base + '/' + relative };
      if (ext) {
        if (ext.sha256 !== digest || ext.bytes !== bytes.length) throw Error('External media source changed: ' + name);
        family[v.key].externalBytes += bytes.length; continue;
      }
      if (omitted.has(relative)) {
        removals.push({ ...entry, reason: 'reviewed-unused' });
        family[v.key].unusedFiles++; family[v.key].unusedBytes += bytes.length; continue;
      }
      entries.push(entry);
    }
  }
  const groups = new Map(), objects = [], aliases = [];
  for (const e of entries) {
    if (!binaryMedia.test(e.relative) || /[^a-zA-Z0-9/_.@-]/.test(e.relative)) continue;
    const key = e.sha256 + '.' + e.relative.split('.').at(-1).toLowerCase().replace(/^jpeg$/, 'jpg');
    if (!groups.has(key)) groups.set(key, []); groups.get(key).push(e);
  }
  for (const [key, group] of groups) {
    if (group.length < 2) continue;
    const destination = '/_cars/media/' + manifest.slug + '/' + key;
    objects.push({ path: '.cars-media/' + manifest.slug + '/' + key, publicPath: 'auto-best/static' + destination, from: group[0].sourcePath, sha256: group[0].sha256, bytes: group[0].bytes });
    for (const e of group) {
      removals.push({ ...e, reason: 'shared-local', destination });
      aliases.push({ source: escape(e.sourceUrlPath), destination: { service: 'autobest', path: destination } });
      family[e.service].pooledCopies++;
    }
  }
  if (objects.length && !manifest.variants.some(v => v.key === 'auto-best' && v.base === '')) throw Error('Shared local media requires the existing root Auto Best service');
  const pooled = new Set(removals.filter(e => e.reason === 'shared-local').map(e => e.sourcePath));
  const outputBytes = entries.filter(e => !pooled.has(e.sourcePath)).reduce((n, e) => n + e.bytes, 0) + objects.reduce((n, e) => n + e.bytes, 0);
  if (outputBytes > maxPublicBytes) throw Error(`Public asset budget exceeded: ${outputBytes} > ${maxPublicBytes}. Optimize or externalize; never silently drop media.`);
  const config = parse(files, 'vercel.json');
  if (!config?.services || !Array.isArray(config.rewrites)) throw Error('Expected Vercel Services configuration');
  const routes = objects.length + aliases.length + config.rewrites.length + (config.headers?.length || 0) + (config.redirects?.length || 0) + 1;
  if (routes > maxRoutes) throw Error('Vercel route budget exceeded');
  const inputBytes = Object.values(family).reduce((n, f) => n + f.inputBytes, 0);
  const externalReferenceBytes = Object.values(family).reduce((n, f) => n + f.externalBytes, 0);
  const unusedBytes = removals.filter(e => e.reason === 'reviewed-unused').reduce((n,e) => n + e.bytes, 0);
  const localDuplicateBytesAvoided = removals.filter(e => e.reason === 'shared-local').reduce((n,e) => n + e.bytes, 0) - objects.reduce((n,e) => n + e.bytes, 0);
  if (outputBytes + externalReferenceBytes + unusedBytes + localDuplicateBytesAvoided !== inputBytes) throw Error('Asset storage accounting does not balance');
  return { schemaVersion: 1, dealer: manifest.slug, variants: manifest.variants, family, removals, objects, aliases, runtimePathTransforms: true,
    limits: { maxPublicBytes, maxRoutes }, summary: { inputBytes, outputBytes, externalReferenceBytes, unusedBytes, localDuplicateBytesAvoided, accounting: 'Public source assets only; excludes compiled client code, Functions, remote storage billing and deployment history.', excludedOrExternalBytes: inputBytes - outputBytes, pooledObjects: objects.length, pooledCopies: pooled.size, unusedFiles: removals.filter(e => e.reason === 'reviewed-unused').length, routes } };
}

/** The ordinary Vercel publisher installs this plan; it does not modify original app source files. */
export function applyVercelAssets(files, options) {
  if (files.has('.cars-vercel-assets.json')) throw Error('Vercel asset plan already exists; refresh from original reviewed source');
  const plan = planVercelAssets(files, options), config = parse(files, 'vercel.json');
  plan.baseConfiguration = structuredClone(config);
  const pending = new Map();
  for (const object of plan.objects) {
    const bytes = files.get(object.from);
    if (!bytes || hash(bytes) !== object.sha256 || bytes.length !== object.bytes || files.has(object.path)) throw Error('Shared object source changed or destination exists');
    pending.set(object.path, bytes);
  }
  for (const variant of plan.variants) {
    const service = config.services[SERVICE_NAMES[variant.key]];
    if (!service?.buildCommand) throw Error('Missing Vercel build command: ' + variant.key);
    const helper = variant.key === 'modern' ? '../../../scripts/vercel-service-assets.mjs' : '../scripts/vercel-service-assets.mjs';
    service.buildCommand = `node ${helper} before ${variant.key} && ${service.buildCommand} && node ${helper} after ${variant.key}`;
  }
  const runtimeRoutes = sharedMediaRuntimeRoutes(plan);
  if (runtimeRoutes.length) {
    const existing = config.services.autobest.routes;
    if (existing !== undefined && !Array.isArray(existing)) throw Error('Unknown Auto Best service routes');
    config.services.autobest.routes = [...runtimeRoutes, ...(existing || [])];
  }
  config.rewrites.unshift(...plan.aliases);
  config.headers ??= [];
  config.headers.push({ source: '/_cars/media/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] });
  pending.set('vercel.json', json(config)); pending.set('.cars-vercel-assets.json', json(plan));
  for (const [name, bytes] of pending) files.set(name, bytes);
  return plan;
}

/** Re-plan an additive App extension without stacking routing wrappers or media copies. */
export function clearVercelAssetPlan(files) {
  const prior = parse(files, '.cars-vercel-assets.json'); if (!prior) return null;
  if (!prior.baseConfiguration || prior.schemaVersion !== 1) throw Error('Unknown existing Vercel asset plan');
  const config = parse(files, 'vercel.json'), restored = structuredClone(config);
  const runtimeRoutes = sharedMediaRuntimeRoutes(prior), currentRoutes = restored.services.autobest.routes;
  // A maintained additive App extension can receive the previously generated
  // direct shared-path prefix. Recognize only that exact sealed prefix; all
  // remaining configuration, aliases, commands and media still reconcile below.
  const directPathRoutes = runtimeRoutes.map(({ transforms }) => ({
    src: '^' + escape(transforms[0].args) + '$', transforms
  }));
  const previousUnionRoutes = runtimeRoutes.map(({ dest, ...route }) => route);
  const generatedPrefix = Array.isArray(currentRoutes) && [runtimeRoutes, previousUnionRoutes, directPathRoutes]
    .some(routes => JSON.stringify(currentRoutes.slice(0, routes.length)) === JSON.stringify(routes));
  if (runtimeRoutes.length && generatedPrefix) {
    currentRoutes.splice(0, runtimeRoutes.length);
    if (prior.baseConfiguration.services.autobest.routes === undefined && !currentRoutes.length) delete restored.services.autobest.routes;
  } else if (runtimeRoutes.length && prior.runtimePathTransforms === true) throw Error('Generated shared runtime paths changed');
  if (JSON.stringify(restored.rewrites.splice(0, prior.aliases.length)) !== JSON.stringify(prior.aliases)) throw Error('Generated asset routes changed');
  const mediaHeader = { source: '/_cars/media/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] };
  if (JSON.stringify(restored.headers.pop()) !== JSON.stringify(mediaHeader)) throw Error('Generated asset headers changed');
  if (!prior.baseConfiguration.headers && !restored.headers.length) delete restored.headers;
  for (const v of prior.variants) {
    const name = SERVICE_NAMES[v.key], helper = v.key === 'modern' ? '../../../scripts/vercel-service-assets.mjs' : '../scripts/vercel-service-assets.mjs';
    const original = prior.baseConfiguration.services[name].buildCommand;
    if (restored.services[name].buildCommand !== `node ${helper} before ${v.key} && ${original} && node ${helper} after ${v.key}`) throw Error('Generated asset build command changed');
    restored.services[name].buildCommand = original;
  }
  if (JSON.stringify(restored) !== JSON.stringify(prior.baseConfiguration)) throw Error('Vercel configuration drift requires reconciliation');
  for (const object of prior.objects) if (!files.has(object.path) || hash(files.get(object.path)) !== object.sha256) throw Error('Generated media object changed');
  for (const object of prior.objects) files.delete(object.path);
  files.set('vercel.json', json(restored)); files.delete('.cars-vercel-assets.json'); return prior;
}
