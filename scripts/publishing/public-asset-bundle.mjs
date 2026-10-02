import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const hash = value => createHash('sha256').update(value).digest('hex');
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const mediaExtensions = new Set(['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'ico', 'woff', 'woff2', 'ttf', 'otf', 'mp4', 'webm']);
const controls = new Set(['_headers', '_redirects']);
const privateParts = new Set(['.git', 'node_modules', '.wrangler', '.auth', '_worker.js']);
function safePath(value) {
  if (typeof value !== 'string' || !value || !/^[a-zA-Z0-9_@./~+-]+$/.test(value)
    || value.startsWith('/') || value.split('/').some(p => !p || p === '.' || p === '..' || /[.]$/.test(p)
      || privateParts.has(p) || p.startsWith('.env') || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p))) {
    throw new Error('Unsafe public asset path: ' + value);
  }
  return value;
}
function within(parent, child) {
  const relative = path.relative(parent, child);
  return !relative || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}
async function digestFile(file) {
  const digest = createHash('sha256'); let bytes = 0;
  for await (const chunk of createReadStream(file)) { digest.update(chunk); bytes += chunk.length; }
  return { bytes, sha256: digest.digest('hex') };
}
async function plainDirectory(directory) {
  if (!path.isAbsolute(directory)) throw new Error('An absolute directory is required');
  const resolved = path.resolve(directory);
  const stat = await fs.lstat(resolved);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Directory must not be a symlink or junction');
  if ((await fs.realpath(resolved)).toLowerCase() !== resolved.toLowerCase()) throw new Error('Directory has a linked ancestor');
  return resolved;
}
/** Hash the existing public build, without following links or modifying its files. */
export async function scanPublicAssets(directory) {
  const root = await plainDirectory(directory); const entries = [];
  async function walk(relative = '') {
    for (const item of (await fs.readdir(path.join(root, relative), { withFileTypes: true })).sort((a, b) => compare(a.name, b.name))) {
      const name = safePath(relative ? relative + '/' + item.name : item.name);
      if (item.isSymbolicLink()) throw new Error('Asset symlink is not allowed: ' + name);
      if (item.isDirectory()) await walk(name);
      else if (item.isFile()) entries.push({ path: name, ...await digestFile(path.join(root, name)) });
      else throw new Error('Unsupported asset entry: ' + name);
    }
  }
  await walk(); return entries;
}
function sourceDigest(entries) {
  return hash(JSON.stringify([...entries].sort((a, b) => compare(a.path, b.path))));
}
const ownerFor = (assetPath, variants) => [...variants].sort((a, b) => b.base.length - a.base.length)
  .find(v => !v.base || assetPath.startsWith(v.base.slice(1) + '/'))?.key ?? 'shared';
/** Provider-neutral, count-independent asset plan. This does not approve a new template family. */
export function planPublicAssets({ dealer, variants, entries, exclusions = [], maxFiles = 20000, maxAliases = 1900, maxFileBytes = 25 * 1024 * 1024 }) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(dealer ?? '')) throw new Error('Invalid dealer identity');
  if (!Array.isArray(variants) || !variants.length || variants.some(v => !/^[a-z0-9-]+$/.test(v.key)
    || !/^(?:|\/variant-[2-9][0-9]*)$/.test(v.base))) throw new Error('Invalid variant asset mounts');
  if (new Set(variants.map(v => v.key)).size !== variants.length || new Set(variants.map(v => v.base)).size !== variants.length)
    throw new Error('Duplicate design key or mount');
  if (!Array.isArray(entries) || !Array.isArray(exclusions)) throw new Error('Entries and exclusions must be arrays');
  for (const limit of [maxFiles, maxAliases, maxFileBytes]) if (!Number.isSafeInteger(limit) || limit < 1) throw new Error('Invalid asset limit');
  const removed = new Map();
  for (const entry of exclusions) {
    safePath(entry.path);
    if (removed.has(entry.path) || !/^[a-f0-9]{64}$/.test(entry.sha256 ?? '') || typeof entry.reason !== 'string' || entry.reason.trim().length < 12)
      throw new Error('Exclusions require an exact hash and concrete review reason');
    if (controls.has(entry.path)) throw new Error('Hosting controls cannot be excluded');
    removed.set(entry.path, entry);
  }
  const mediaCounts = new Map();
  for (const entry of entries) {
    const ext = entry.path.split('.').at(-1).toLowerCase();
    if (!removed.has(entry.path) && mediaExtensions.has(ext)) {
      const key = entry.sha256 + '.' + (ext === 'jpeg' ? 'jpg' : ext);
      mediaCounts.set(key, (mediaCounts.get(key) ?? 0) + 1);
    }
  }
  const seen = new Set(), outputs = new Map(), aliases = [], excluded = [], byVariant = {};
  const namespace = '_cars/media/' + dealer + '/';
  for (const entry of [...entries].sort((a, b) => compare(a.path, b.path))) {
    safePath(entry.path);
    if (entry.path.startsWith('_cars/')) throw new Error('Input already contains the reserved media namespace');
    if (seen.has(entry.path.toLowerCase())) throw new Error('Case-insensitive asset collision: ' + entry.path);
    seen.add(entry.path.toLowerCase());
    if (!/^[a-f0-9]{64}$/.test(entry.sha256) || !Number.isSafeInteger(entry.bytes) || entry.bytes < 0 || entry.bytes > maxFileBytes)
      throw new Error('Invalid hash/size or oversized asset: ' + entry.path);
    const removal = removed.get(entry.path);
    if (removal) {
      if (removal.sha256 !== entry.sha256) throw new Error('Reviewed exclusion changed: ' + entry.path);
      excluded.push({ ...entry, reason: removal.reason }); removed.delete(entry.path); continue;
    }
    if (controls.has(entry.path)) continue;
    const mount = entry.path.match(/^variant-[0-9]+(?=\/|$)/)?.[0];
    if (mount && !variants.some(v => v.base === '/' + mount)) throw new Error('Undeclared variant assets: ' + mount);
    if (/prompt[^/]*\.md$/i.test(entry.path)) throw new Error('Generation prompts require an explicit exclusion review: ' + entry.path);
    const owner = ownerFor(entry.path, variants);
    byVariant[owner] ??= { files: 0, bytes: 0 }; byVariant[owner].files++; byVariant[owner].bytes += entry.bytes;
    const extension = entry.path.split('.').at(-1).toLowerCase();
    // Keep JS/CSS and SVG at their original URLs: they may contain relative references.
    const mediaKey = entry.sha256 + '.' + (extension === 'jpeg' ? 'jpg' : extension);
    // Unique artwork needs no compatibility rewrite. Pool only genuinely shared bytes.
    const target = mediaExtensions.has(extension) && mediaCounts.get(mediaKey) > 1 ? namespace + mediaKey : entry.path;
    const existing = outputs.get(target);
    if (existing && (existing.sha256 !== entry.sha256 || existing.bytes !== entry.bytes)) throw new Error('Content-address collision');
    if (!existing) outputs.set(target, { path: target, from: entry.path, sha256: entry.sha256, bytes: entry.bytes });
    if (target !== entry.path) aliases.push({ source: '/' + entry.path, destination: '/' + target, sha256: entry.sha256, bytes: entry.bytes });
  }
  if (removed.size) throw new Error('Reviewed exclusion is absent: ' + [...removed.keys()][0]);
  if (aliases.length > maxAliases) throw new Error('Asset alias budget exceeded; use direct media URLs or reviewed sharding');
  if (outputs.size + 2 > maxFiles) throw new Error('Static asset file budget exceeded');
  const inputBytes = entries.filter(e => !controls.has(e.path)).reduce((n, e) => n + e.bytes, 0);
  const outputBytes = [...outputs.values()].reduce((n, e) => n + e.bytes, 0);
  return { schemaVersion: 1, dealer, variants: variants.map(({ key, base }) => ({ key, base })), sourceDigest: sourceDigest(entries), policy: 'shared-binary-only-v1',
    namespace: '/' + namespace, objects: [...outputs.values()], aliases, excluded, byVariant,
    summary: { inputFiles: entries.length, outputFiles: outputs.size, aliasCount: aliases.length, inputBytes, outputBytes,
      excludedBytes: excluded.reduce((n, e) => n + e.bytes, 0), savedBytes: inputBytes - outputBytes },
    limits: { maxFiles, maxAliases, maxFileBytes }, runtimeRenderingChanged: false };
}
export function cloudflareAssetControls(plan, { headers = '', redirects = '' } = {}) {
  const prior = redirects.split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'));
  let staticCount = plan.aliases.length, dynamicCount = 0;
  for (const line of prior) {
    const [source, destination, code = '302', ...extra] = line.split(/\s+/);
    if (!source?.startsWith('/') || !destination || extra.length || !['200', '301', '302', '303', '307', '308'].includes(code))
      throw new Error('Unreviewed redirect syntax: ' + line);
    const dynamic = /[*:]/.test(source);
    dynamic ? dynamicCount++ : staticCount++;
    const pattern = new RegExp('^' + source.split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:[a-zA-Z][a-zA-Z0-9_]*/g, '[^/]+')).join('.*') + '$');
    if (plan.aliases.some(a => pattern.test(a.source) || pattern.test(a.destination))) throw new Error('Existing redirect conflicts with media: ' + source);
  }
  if (staticCount > 2000 || dynamicCount > 100 || prior.length + plan.aliases.length > 2100) throw new Error('Cloudflare redirect limits exceeded');
  const generated = plan.aliases.map(a => a.source + ' ' + a.destination + ' 200');
  if ([...prior, ...generated].some(s => s.length > 1000)) throw new Error('Cloudflare redirect line is too long');
  const rules = headers.split(/\r?\n/).filter(s => s && !/^\s|#/.test(s));
  if (rules.length + 1 > 100 || headers.split(/\r?\n/).some(s => s.length > 2000)) throw new Error('Cloudflare header limits exceeded');
  return {
    redirects: '# Cars media aliases: exact static rewrites; no framework renderer.\n' + generated.join('\n') + '\n' + redirects,
    headers: headers.trimEnd() + '\n\n' + plan.namespace + '*\n  Cache-Control: public, max-age=31536000, immutable\n',
    staticRules: staticCount, dynamicRules: dynamicCount,
  };
}
/** Build into a fresh task output only. Canonical files and old artifacts are never pruned. */
export async function packagePublicAssets({ input, output, dealer, variants, exclusions = [], write = false, beforeWrite, ...limits }) {
  input = await plainDirectory(input);
  if (!path.isAbsolute(output)) throw new Error('Output must be absolute');
  output = path.resolve(output);
  if (within(input, output) || within(output, input)) throw new Error('Input and output must be separate');
  const parent = await plainDirectory(path.dirname(output));
  if (await fs.lstat(output).then(() => true, e => { if (e.code === 'ENOENT') return false; throw e; })) throw new Error('Output already exists');
  const entries = await scanPublicAssets(input);
  const plan = planPublicAssets({ dealer, variants, entries, exclusions, ...limits });
  const readControl = async name => entries.some(e => e.path === name) ? fs.readFile(path.join(input, name), 'utf8') : '';
  const rules = cloudflareAssetControls(plan, { headers: await readControl('_headers'), redirects: await readControl('_redirects') });
  const controlHashes = { _headers: hash(rules.headers), _redirects: hash(rules.redirects) };
  const report = { ...plan, controlHashes, mode: write ? 'write' : 'dry-run', controlRules: { static: rules.staticRules, dynamic: rules.dynamicRules } };
  if (!write) return report;
  if (beforeWrite) await beforeWrite();
  if (sourceDigest(await scanPublicAssets(input)) !== plan.sourceDigest) throw new Error('Public build changed during preparation');
  await plainDirectory(parent);
  await fs.mkdir(output); // Exclusive creation: never accept stale output from an earlier build.
  try {
    const publicRoot = path.join(output, 'public'); await fs.mkdir(publicRoot);
    for (const asset of plan.objects) {
      const target = path.join(publicRoot, asset.path); await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.copyFile(path.join(input, asset.from), target);
      const actual = await digestFile(target);
      if (actual.sha256 !== asset.sha256 || actual.bytes !== asset.bytes) throw new Error('Asset changed while copying: ' + asset.from);
    }
    await fs.writeFile(path.join(publicRoot, '_headers'), rules.headers);
    await fs.writeFile(path.join(publicRoot, '_redirects'), rules.redirects);
    if (sourceDigest(await scanPublicAssets(input)) !== plan.sourceDigest) throw new Error('Public build changed during installation');
    await fs.writeFile(path.join(output, 'receipt.json'), JSON.stringify(report, null, 2) + '\n');
    return report;
  } catch (error) {
    await fs.rename(output, output + '.failed-' + process.pid + '-' + Date.now()).catch(() => {});
    throw error;
  }
}

/** Exhaustive file-level proof. Browser/runtime acceptance remains a separate release gate. */
export async function verifyPublicAssetBundle(directory) {
  const root = await plainDirectory(directory);
  const receipt = JSON.parse(await fs.readFile(path.join(root, 'receipt.json'), 'utf8'));
  if (receipt.schemaVersion !== 1 || !Array.isArray(receipt.objects) || !Array.isArray(receipt.aliases)) throw new Error('Invalid asset receipt');
  const entries = await scanPublicAssets(path.join(root, 'public'));
  const actual = new Map(entries.map(e => [e.path, e]));
  if (actual.size !== receipt.objects.length + 2) throw new Error('Unexpected or missing public output');
  for (const name of controls) {
    if (actual.get(name)?.sha256 !== receipt.controlHashes?.[name]) throw new Error('Hosting control changed: ' + name);
  }
  for (const object of receipt.objects) {
    const found = actual.get(safePath(object.path));
    if (!found || found.sha256 !== object.sha256 || found.bytes !== object.bytes) throw new Error('Public object differs: ' + object.path);
  }
  for (const alias of receipt.aliases) {
    const found = actual.get(alias.destination.slice(1));
    if (!found || found.sha256 !== alias.sha256 || found.bytes !== alias.bytes) throw new Error('Alias has no exact object: ' + alias.source);
  }
  return { passed: true, checkedObjects: receipt.objects.length, checkedAliases: receipt.aliases.length };
}
