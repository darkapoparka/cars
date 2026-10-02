import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Maintained here; template-local copies are checked byte-for-byte by repository tests.
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const textExtension = /\.(?:svelte|[cm]?[jt]sx?|json|s?css|sass|less|mdx|html|svg|webmanifest)$/i;
const assetExtension = /\.(?:png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|otf|mp4|webm|md)$/i;
const forbidden = new Set(['.git', 'node_modules', '.env', '..', '.', '']);
function safeRelative(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_@./~+-]+$/.test(value)
    || value.startsWith('/') || value.split('/').some(part => forbidden.has(part) || part.endsWith('.')))
    throw new Error('Unsafe asset policy path: ' + value);
  return value;
}
function beneath(parent, child) {
  const relative = path.relative(parent, child);
  return !relative || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}
function walk(root, relative = '', entries = []) {
  if (!fs.existsSync(path.join(root, relative))) return entries;
  for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
    const name = relative ? relative + '/' + entry.name : entry.name;
    if (entry.isSymbolicLink()) throw new Error('Linked asset/consumer requires review: ' + name);
    if (entry.isDirectory()) walk(root, name, entries);
    else if (entry.isFile()) entries.push(name);
  }
  return entries.sort();
}
function normalizeText(text) {
  return text.replace(/\\\//g, '/').replace(/\\(?:u002[fF]|x2[fF])/g, '/');
}
function indexConsumers(consumers) {
  return consumers.map(consumer => {
    const text = normalizeText(consumer.text), prefixes = [];
    for (const match of text.matchAll(/`([^`]*\$\{[^`]*?)`/g)) {
      if (/\$\{(?:string|number)\}/.test(match[1])) continue;
      const prefix = match[1].split('${')[0].replace(/^\//, '');
      if (prefix) prefixes.push(prefix);
    }
    for (const match of text.matchAll(/['"](\/?[^'"\n]*\/[^'"\n]*)['"]\s*\+/g)) {
      const prefix = match[1].replace(/^\//, '');
      if (prefix) prefixes.push(prefix);
    }
    for (const match of text.matchAll(/['"](\/[^'"\n]+)['"]/g)) {
      const prefix = match[1].slice(1);
      if (prefix.split('/').length >= 3 && !/\.[a-zA-Z0-9]{1,8}$/.test(prefix)) prefixes.push(prefix);
    }
    return { path: consumer.path, text, prefixes };
  });
}
/** Conservative reachability check; explicit candidates only, indexed once per build. */
export function retentionReason(asset, consumers, keepPrefixes = [], index = indexConsumers(consumers)) {
  if (keepPrefixes.some(prefix => asset.startsWith(prefix))) return 'dynamic-asset-prefix';
  const basename = path.posix.basename(asset);
  const stem = basename.slice(0, -path.posix.extname(basename).length);
  for (const consumer of index) {
    if (consumer.text.includes(asset) || consumer.text.includes(basename)) return 'referenced:' + consumer.path;
    if (stem.length >= 4 && consumer.text.includes('/' + stem + '.')) return 'format-variant:' + consumer.path;
    if (consumer.prefixes.some(prefix => asset.startsWith(prefix))) return 'computed:' + consumer.path;
  }
  return null;
}
export function planAssetRetention({ assets, consumers, policy, serverAssets = [] }) {
  if (policy?.schemaVersion !== 1 || !Array.isArray(policy.candidates) || !Array.isArray(consumers))
    throw new Error('Invalid public asset policy');
  const seen = new Set(), omitted = [], retained = [];
  const references = indexConsumers(consumers);
  for (const prefix of policy.keepPrefixes ?? []) safeRelative(prefix.replace(/\/$/, ''));
  const server = new Set(Array.from(serverAssets).map(p => p.replace(/^\//, '')));
  for (const candidate of policy.candidates) {
    safeRelative(candidate.path);
    if (seen.has(candidate.path) || !assetExtension.test(candidate.path)
      || /(?:^|\/)(?:LICEN[CS]E|COPYING|NOTICE)(?:\.|$)/i.test(candidate.path)
      || !/^[a-f0-9]{64}$/.test(candidate.sha256 ?? '') || typeof candidate.reason !== 'string'
      || candidate.reason.trim().length < 12) throw new Error('Invalid reviewed asset candidate');
    seen.add(candidate.path);
    const actual = assets.get(candidate.path);
    if (!actual) { retained.push({ path: candidate.path, reason: 'absent-in-this-dealer' }); continue; }
    const bytes = Buffer.isBuffer(actual) ? actual : actual.bytes;
    if (!Buffer.isBuffer(bytes)) throw new Error('Expected asset bytes');
    const sha256 = digest(bytes);
    const reason = sha256 !== candidate.sha256 ? 'customized-or-updated'
      : server.has(candidate.path) ? 'server-read-dependency'
      : retentionReason(candidate.path, consumers, policy.keepPrefixes, references);
    if (reason) retained.push({ path: candidate.path, reason });
    else omitted.push({ path: candidate.path, sha256, bytes: bytes.length, reason: candidate.reason });
  }
  return { schemaVersion: 1, family: policy.family, omitted, retained,
    omittedBytes: omitted.reduce((sum, item) => sum + item.bytes, 0),
    policyDigest: digest(JSON.stringify(policy)),
    consumerDigest: digest(JSON.stringify(consumers.map(c => [c.path, digest(c.text)]).sort())) };
}
function readConsumers(root, staticRoot) {
  const files = walk(path.join(root, 'src')).map(p => 'src/' + p)
    .filter(p => textExtension.test(p) && !/\.(?:test|spec)\.[^.]+$/.test(p));
  for (const name of ['svelte.config.js', 'vite.config.ts', 'vite.config.js'])
    if (fs.existsSync(path.join(root, name))) files.push(name);
  const consumers = files.map(p => ({ path: p, text: fs.readFileSync(path.join(root, p), 'utf8') }));
  for (const name of walk(staticRoot).filter(p => /\.(?:html|css|svg|json|webmanifest)$/i.test(p)))
    consumers.push({ path: 'public/' + name, text: fs.readFileSync(path.join(staticRoot, name), 'utf8') });
  return consumers;
}
/** Wrap the existing Svelte adapter; never delete anything from static/ or source/. */
export function withRetainedPublicAssets(adapter, { root } = {}) {
  if (!adapter || typeof adapter.adapt !== 'function' || !path.isAbsolute(root ?? ''))
    throw new Error('An existing adapter and absolute template root are required');
  return { ...adapter, name: adapter.name + '+cars-public-assets', async adapt(builder) {
    const policyFile = path.join(root, 'public-assets.policy.json');
    if (!fs.existsSync(policyFile)) return adapter.adapt(builder);
    const policyText = fs.readFileSync(policyFile, 'utf8');
    const policy = JSON.parse(policyText);
    const staticRoot = path.resolve(builder.config.kit.files.assets);
    const assets = new Map();
    for (const candidate of policy.candidates ?? []) {
      safeRelative(candidate.path);
      const file = path.join(staticRoot, candidate.path);
      if (!fs.existsSync(file)) continue;
      const stat = fs.lstatSync(file);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Asset must be a regular file');
      assets.set(candidate.path, fs.readFileSync(file));
    }
    const consumers = readConsumers(root, staticRoot);
    const serverAssets = builder.findServerAssets ? builder.findServerAssets(builder.routes) : [];
    const plan = planAssetRetention({ assets, consumers, policy, serverAssets });
    const copies = [];
    function assertStable() {
      if (fs.readFileSync(policyFile, 'utf8') !== policyText
        || digest(JSON.stringify(readConsumers(root, staticRoot))) !== digest(JSON.stringify(consumers)))
        throw new Error('Template changed during asset publication; rebuild the reviewed source');
    }
    assertStable();
    const facade = Object.create(builder);
    facade.writeClient = destination => {
      const outputRoot = path.resolve(destination);
      if (beneath(staticRoot, outputRoot) || beneath(outputRoot, staticRoot)
        || beneath(path.join(root, 'src'), outputRoot)) throw new Error('Adapter output overlaps source');
      assertStable();
      const copied = builder.writeClient(destination);
      const removed = new Set();
      // Check all copied bytes before any removal. Changes never silently delete new artwork.
      const targets = plan.omitted.map(asset => ({ ...asset, target: path.join(outputRoot, asset.path) }))
        .filter(asset => fs.existsSync(asset.target));
      for (const asset of targets) {
        const stat = fs.lstatSync(asset.target);
        if (!stat.isFile() || stat.isSymbolicLink() || digest(fs.readFileSync(asset.target)) !== asset.sha256)
          throw new Error('Copied public asset differs from review: ' + asset.path);
      }
      for (const asset of targets) { fs.unlinkSync(asset.target); removed.add(asset.path); }
      copies.push({ destination: path.relative(root, outputRoot).replaceAll('\\', '/'),
        omittedFiles: removed.size, omittedBytes: targets.reduce((n, a) => n + a.bytes, 0) });
      return copied.filter(name => !removed.has(name.replaceAll('\\', '/')));
    };
    await adapter.adapt(facade);
    assertStable();
    const reportDir = builder.getBuildDirectory('cars-public-assets');
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, 'retention.json'), JSON.stringify({ ...plan, copies }, null, 2) + '\n');
    builder.log.info(`Cars public assets: ${plan.omitted.length} reviewed unused files omitted; source retained.`);
  } };
}
