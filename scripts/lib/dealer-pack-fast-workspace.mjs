/** Generated build workspaces. Dependencies may be reused; application outputs
 * are always freshly compiled and are never copied between dealer identities. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {safeArtifactPath} from './uk-cloudflare-artifacts.mjs';

const assert = (value, message) => {if (!value) throw Error(message);};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const canonical = value => JSON.stringify(value, (_, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);

export function fastWorkspaceKey({releaseDigest, toolDigest, nodes, platform = process.platform, arch = process.arch}) {
  assert([releaseDigest, toolDigest].every(value => /^[a-f0-9]{64}$/.test(value ?? '')) && nodes && Object.values(nodes).every(value => /^\d+\.\d+\.\d+$/.test(value)), 'Fast workspace requires immutable release, build tools and Node pins');
  return 'cars-native-workspace-v1-' + hash(canonical({releaseDigest, toolDigest, nodes, platform, arch}));
}

export function assertGeneratedRuntimeDirectory(root, directory) {
  const runtime = path.resolve(root, 'runtime'), target = path.resolve(directory);
  assert(target.startsWith(runtime + path.sep), 'Fast build outputs must remain beneath runtime/');
  let parent = target;
  while (!fs.existsSync(parent)) parent = path.dirname(parent);
  const real = path.resolve(fs.realpathSync(parent), path.relative(parent, target));
  assert(real.startsWith(fs.realpathSync(root) + path.sep + 'runtime' + path.sep), 'Fast build output resolves outside runtime/');
  return target;
}

function targetFile(directory, name) {
  assert(safeArtifactPath(name), 'Unsafe generated workspace member: ' + name);
  const file = path.join(directory, name);
  for (let cursor = file; cursor !== directory; cursor = path.dirname(cursor)) {
    if (fs.existsSync(cursor)) assert(!fs.lstatSync(cursor).isSymbolicLink(), 'Linked generated workspace member: ' + name);
  }
  return file;
}

/** Only paths from the previous exact input manifest may be removed. Framework
 * dependencies and generated outputs are outside this input manifest. */
export function syncFastWorkspace({directory, files, workspaceKey, family}) {
  assert(files instanceof Map && files.size > 0 && typeof workspaceKey === 'string' && workspaceKey.startsWith('cars-native-workspace-v1-'), 'Invalid fast workspace inputs');
  const marker = path.join(directory, '.cars-fast-inputs.json');
  fs.mkdirSync(directory, {recursive: true});
  let previous = null;
  if (fs.existsSync(marker)) {
    assert(!fs.lstatSync(marker).isSymbolicLink(), 'Linked fast workspace inventory');
    previous = JSON.parse(fs.readFileSync(marker, 'utf8'));
    assert(previous.kind === 'cars-fast-workspace-inputs' && previous.workspaceKey === workspaceKey && previous.family === family && Array.isArray(previous.files), 'Foreign or changed release workspace');
  } else assert(fs.readdirSync(directory).length === 0, 'Existing unowned workspace refused');
  const rows = [...files].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([name, bytes]) => {
    assert(Buffer.isBuffer(bytes), 'Generated source must retain exact bytes: ' + name);
    targetFile(directory, name);
    return {path: name, bytes: bytes.length, sha256: hash(bytes)};
  });
  const names = new Set(rows.map(row => row.path));
  let removed = 0, written = 0, unchanged = 0, writtenBytes = 0;
  for (const row of previous?.files ?? []) {
    assert(safeArtifactPath(row.path), 'Unsafe previous workspace manifest');
    if (!names.has(row.path)) {
      const file = targetFile(directory, row.path);
      if (fs.existsSync(file)) {assert(fs.lstatSync(file).isFile(), 'Non-file stale source refused');fs.unlinkSync(file);removed++;}
    }
  }
  for (const row of rows) {
    const file = targetFile(directory, row.path), bytes = files.get(row.path);
    if (fs.existsSync(file) && fs.lstatSync(file).isFile() && fs.statSync(file).size === bytes.length && fs.readFileSync(file).equals(bytes)) {unchanged++;continue;}
    fs.mkdirSync(path.dirname(file), {recursive: true});
    // Atomic replacement avoids mutating any retained artifact through a hard link.
    const temporary = file + '.cars-fast-new';
    assert(!fs.existsSync(temporary), 'Occupied generated atomic-write path');
    fs.writeFileSync(temporary, bytes, {flag: 'wx'});fs.renameSync(temporary, file);
    written++;writtenBytes += bytes.length;
  }
  fs.writeFileSync(marker, JSON.stringify({schemaVersion: 1, kind: 'cars-fast-workspace-inputs', workspaceKey, family, files: rows}, null, 2) + '\n');
  return {workspaceKey, family, reusedWorkspace: Boolean(previous), files: rows, sourceDigest: hash(canonical(rows)), written, writtenBytes, unchanged, removed};
}

export function verifyFastWorkspaceInputs({directory, files}) {
  assert(Array.isArray(files) && files.length, 'Missing fast workspace source inventory');
  const names = new Set(files.map(row => row.path));
  const outputs = new Set(['node_modules', '.svelte-kit', '.cars-cloudflare', '.wrangler', '.vinext', '.cloudflare', '.turbo', '.next', 'dist', 'build', '.cars-build-assets']);
  const controls = /^\.cars-(?:fast-inputs\.json|fast-router-dependencies\.json|cloudflare-svelte-locks\.json|next-(?:modern|app|mobile)-(?:dependencies|frozen-lock)\.json)$/;
  const visit = (folder, relative = '') => {
    for (const entry of fs.readdirSync(folder, {withFileTypes: true})) {
      const name = relative ? relative + '/' + entry.name : entry.name;
      if (names.has(name)) continue;
      if (outputs.has(entry.name) || entry.name.startsWith('.next-') || entry.name.endsWith('.tsbuildinfo') || entry.name === 'next-env.d.ts' ||
        name === 'modern/packages/database/generated' || !relative && controls.test(name)) continue;
      assert(!entry.isSymbolicLink(), 'Undeclared linked source: ' + name);
      if (entry.isDirectory()) visit(path.join(folder, entry.name), name);
      else assert(false, 'Undeclared generated source: ' + name);
    }
  };
  visit(directory);
  for (const row of files) {
    const file = targetFile(directory, row.path);
    assert(fs.existsSync(file) && fs.lstatSync(file).isFile(), 'Missing generated input: ' + row.path);
    const bytes = fs.readFileSync(file);
    assert(bytes.length === row.bytes && hash(bytes) === row.sha256, 'Changed generated input: ' + row.path);
  }
}

/** Cache an exact pure esbuild transform, never compiled app identity. A changed
 * byte, import scope, option or esbuild version necessarily misses this cache. */
export function cachedCompositionCompiler(esbuild, cache = new Map()) {
  assert(typeof esbuild?.transformSync === 'function' && typeof esbuild.version === 'string' && cache instanceof Map, 'Exact composition compiler required');
  const statistics = {hits: 0, misses: 0, inputBytes: 0};
  return {version: esbuild.version, statistics, transformSync(source, options) {
    const key = hash(canonical({version: esbuild.version, options}) + '\0' + source), cached = cache.get(key);
    statistics.inputBytes += Buffer.byteLength(source);
    if (cached) {assert(hash(cached.code) === cached.digest, 'Changed pure-transform cache entry');statistics.hits++;return {code: cached.code, warnings: []};}
    const result = esbuild.transformSync(source, options);
    assert(typeof result.code === 'string', 'Composition transform produced no code');
    cache.set(key, {code: result.code, digest: hash(result.code)});statistics.misses++;return result;
  }};
}

export async function settledLanes(items, concurrency, operation) {
  assert(Array.isArray(items) && Number.isInteger(concurrency) && concurrency > 0 && concurrency <= 7 && typeof operation === 'function', 'Use one to seven bounded lanes');
  const results = new Array(items.length);let cursor = 0;
  await Promise.all(Array.from({length: Math.min(concurrency, items.length)}, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      try {results[index] = {status: 'fulfilled', value: await operation(items[index], index)};}
      catch (error) {results[index] = {status: 'rejected', reason: error.message};}
    }
  }));
  return results;
}
