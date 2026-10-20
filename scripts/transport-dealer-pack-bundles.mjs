#!/usr/bin/env node
/** Exact compiled bytes and QA evidence only; deduplicate and shard without rebuilding. */
import fs from 'node:fs';
import path from 'node:path';
import {sha256, filesAt} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {validPackSlug} from './lib/dealer-pack.mjs';
import {canonicalPackJson} from './lib/dealer-pack-artifacts.mjs';
import {safeArtifactPath} from './lib/uk-cloudflare-artifacts.mjs';
import {parseCatalogJson} from './lib/native-localization.mjs';
import {inspectDealerPackBundle} from './verify-dealer-pack.mjs';
import {SIX_DESIGN_KEYS} from './lib/six-design-release.mjs';

export const DEALER_PACK_TRANSPORT_SHARD_BYTES = 350 * 1024 ** 2;
export const DEALER_PACK_TRANSPORT_MAX_SHARDS = 8;
const KIND = 'cars-dealer-pack-bundle-transport';
const MAX_MANIFEST_BYTES = 64 * 1024 ** 2;
const gates = ['bundle-integrity', 'cloudflare-limits', 'fleet-contact-coverage', 'logo-assets', 'rendered-routes', 'screenshots', 'bundle-unchanged'];
const assert = (ok, message) => {if (!ok) throw Error('Pack transport: ' + message);};
const hex = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const natural = value => Number.isSafeInteger(value) && value >= 0;
const same = (a, b) => canonicalPackJson(a) === canonicalPackJson(b);
const digest = value => sha256(canonicalPackJson(value));
const exactKeys = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && same(Object.keys(value).sort(), [...keys].sort());
const manifestBody = value => Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'contentDigest'));
const relativeChild = (base, directory) => {const relative = path.relative(base, directory); return !relative || relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);};

function physicalDirectory(directory) {
  const resolved = path.resolve(directory);
  assert(fs.existsSync(resolved) && fs.lstatSync(resolved).isDirectory() && !fs.lstatSync(resolved).isSymbolicLink() && fs.realpathSync(resolved) === resolved, 'directory must be physical: ' + resolved);
  return resolved;
}
function readPhysical(root, name, {maximum = DEALER_PACK_TRANSPORT_SHARD_BYTES} = {}) {
  assert(safeArtifactPath(name), 'unsafe file path: ' + name);
  let current = root;
  for (const part of name.split('/')) {current = path.join(current, part); assert(!fs.lstatSync(current).isSymbolicLink(), 'linked file or directory: ' + name);}
  const stat = fs.statSync(current); assert(stat.isFile() && stat.size <= maximum, 'nonregular or oversized file: ' + name);
  const fd = fs.openSync(current, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0));
  try {const value = fs.readFileSync(fd); assert(value.length === stat.size, 'file changed while reading: ' + name); return value;} finally {fs.closeSync(fd);}
}
const readJson = (root, name, maximum = MAX_MANIFEST_BYTES) => parseCatalogJson(new TextDecoder('utf-8', {fatal: true}).decode(readPhysical(root, name, {maximum})));
function pathPresent(file) {
  try {fs.lstatSync(file); return true;} catch (error) {if (error.code === 'ENOENT') return false; throw error;}
}
function freshDirectory(directory, forbidden) {
  const resolved = path.resolve(directory);
  assert(!pathPresent(resolved), 'retain an existing destination; use a fresh output');
  assert(!relativeChild(forbidden, resolved) && !relativeChild(resolved, forbidden), 'input and output directories must be separate');
  let parent = path.dirname(resolved); while (!pathPresent(parent)) parent = path.dirname(parent);
  physicalDirectory(parent); fs.mkdirSync(path.dirname(resolved), {recursive: true}); physicalDirectory(path.dirname(resolved));
  // Exclusive mkdir is the no-replace commit: it also refuses a destination
  // created after the lstat guard, including an empty directory or broken link.
  fs.mkdirSync(resolved);
  return resolved;
}
function evidenceShape(qa, slug, receipt) {
  const bound = value => value && value.slug === slug && ['packDigest', 'releaseDigest', 'outputDigest', 'packCompositionDigest'].every(key => value[key] === receipt[key]) && same(value.execution, receipt.execution);
  assert(bound(qa) && qa.type === 'cars-dealer-pack-qa' && qa.success === true && Array.isArray(qa.checks) && qa.checks.every(row => row.status === 'passed'), 'successful exact local QA is required: ' + slug);
  assert(gates.every(id => qa.checks.filter(row => row.id === id && row.status === 'passed').length === 1), 'local QA gates are incomplete: ' + slug);
  const images = qa.proof?.screenshots;
  assert(Array.isArray(images) && images.length === 18 && new Set(images.map(row => row.path)).size === 18 && new Set(images.map(row => row.key + ':' + row.width)).size === 18 &&
    images.every(row => SIX_DESIGN_KEYS.includes(row.key) && [320, 390, 1280].includes(row.width) && safeArtifactPath(row.path) && /^screenshots\/[^/]+\.png$/.test(row.path) && hex(row.sha256)), 'exact18 local screenshot files are required: ' + slug);
  return {bound, images};
}

/** Inspection is independent of source checkout; deployment still authenticates published source and queue ownership. */
export function inspectDealerPackTransportSource({root, slug} = {}) {
  assert(validPackSlug(slug), 'exact canonical dealer required'); root = physicalDirectory(root);
  const directory = physicalDirectory(path.join(root, slug)), bundle = physicalDirectory(path.join(directory, 'bundle'));
  const context = inspectDealerPackBundle({bundleRoot: bundle, slug, plan: 'paid'}), receipt = context.receipt;
  assert(context.capacity.status === 'passed' && receipt.fastBuild?.benchmarkOnly !== true && !slug.startsWith('m2-bench-'), 'benchmark or over-budget candidate cannot enter deployment transport');
  const qa = readJson(directory, 'qa-report.json'), build = readJson(directory, 'build-report.json'), {bound, images} = evidenceShape(qa, slug, receipt);
  assert(bound(build) && build.status === 'passed' && build.benchmarkOnly !== true && build.fastBuild?.benchmarkOnly !== true, 'successful exact build evidence is required: ' + slug);
  const names = [...filesAt(bundle, {filter: () => true}).map(name => 'bundle/' + name), 'build-report.json', 'qa-report.json', ...images.map(row => row.path)].sort();
  const files = names.map(name => {const bytes = readPhysical(directory, name), sha = sha256(bytes), image = images.find(row => row.path === name);
    if (image) assert(sha === image.sha256, 'screenshot bytes changed: ' + name);
    return {path: slug + '/' + name, bytes: bytes.length, sha256: sha};});
  return {slug, sourceCommit: receipt.sourceCommit, packDigest: receipt.packDigest, releaseDigest: receipt.releaseDigest, outputDigest: receipt.outputDigest,
    artifactDigest: context.envelope.digest, fileCount: files.length, bytes: files.reduce((sum, row) => sum + row.bytes, 0), files};
}

export function packDealerPackTransport({root, out, shardBytes = DEALER_PACK_TRANSPORT_SHARD_BYTES, now = new Date().toISOString()} = {}) {
  root = physicalDirectory(root);
  assert(Number.isSafeInteger(shardBytes) && shardBytes > 0 && shardBytes <= DEALER_PACK_TRANSPORT_SHARD_BYTES, 'shards must be bounded at350MiB raw bytes');
  const requested = fs.readdirSync(root, {withFileTypes: true}).filter(row => row.isDirectory() || row.isSymbolicLink()).map(row => row.name).filter(validPackSlug).sort();
  assert(requested.length > 0 && requested.length <= 100, 'select one to100 dealer output directories');
  const dealers = [], rejected = [];
  for (const slug of requested) try {dealers.push(inspectDealerPackTransportSource({root, slug}));} catch (error) {rejected.push({slug, reason: error.message});}
  const files = dealers.flatMap(row => row.files).sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  const unique = new Map();
  for (const row of files) {const previous = unique.get(row.sha256); assert(!previous || previous.bytes === row.bytes, 'same content address has inconsistent length'); if (!previous) unique.set(row.sha256, {...row});}
  const shards = [], blobs = [];
  for (const row of [...unique.values()].sort((a, b) => a.sha256.localeCompare(b.sha256, 'en'))) {
    assert(row.bytes <= shardBytes, 'one file exceeds the chosen shard limit: ' + row.path);
    let shard = shards.at(-1);
    if (!shard || shard.bytes + row.bytes > shardBytes) {assert(shards.length < DEALER_PACK_TRANSPORT_MAX_SHARDS, 'unique bytes exceed eight bounded shards; split the requested lane'); shard = {index: shards.length, path: 'shard-' + shards.length, bytes: 0, blobs: []}; shards.push(shard);}
    shard.bytes += row.bytes; shard.blobs.push({sha256: row.sha256, bytes: row.bytes}); blobs.push({sha256: row.sha256, bytes: row.bytes, shard: shard.index});
  }
  const lookup = new Map(blobs.map(row => [row.sha256, row]));
  const manifest = {schemaVersion: 1, kind: KIND, createdAt: now, requested, valid: dealers.map(row => row.slug), rejected,
    status: rejected.length ? dealers.length ? 'partial-failure' : 'failed' : 'passed',
    dealers: dealers.map(({files: _files, ...row}) => row), files: files.map(row => ({...row, shard: lookup.get(row.sha256).shard})), blobs,
    shards: shards.map(row => ({index: row.index, path: row.path, bytes: row.bytes, blobCount: row.blobs.length, digest: digest(row.blobs)})),
    shardBytesLimit: shardBytes, logicalBytes: files.reduce((sum, row) => sum + row.bytes, 0), uniqueBytes: blobs.reduce((sum, row) => sum + row.bytes, 0),
    providerWrites: 0, sourceIncluded: false, nativeIntermediatesIncluded: false, benchmarkOnly: false};
  manifest.deduplicatedBytes = manifest.logicalBytes - manifest.uniqueBytes; manifest.contentDigest = digest(manifest);
  validateDealerPackTransportManifest(manifest);
  const output = freshDirectory(out, root);
  for (const shard of shards) fs.mkdirSync(path.join(output, shard.path, 'blobs'), {recursive: true});
  const written = new Set();
  for (const row of manifest.files) {
    const bytes = readPhysical(root, row.path); assert(bytes.length === row.bytes && sha256(bytes) === row.sha256, 'source changed after envelope inspection: ' + row.path);
    if (!written.has(row.sha256)) {fs.writeFileSync(path.join(output, 'shard-' + row.shard, 'blobs', row.sha256), bytes, {flag: 'wx'}); written.add(row.sha256);}
  }
  const bytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n'); assert(bytes.length <= MAX_MANIFEST_BYTES, 'manifest exceeds bounded size');
  fs.writeFileSync(path.join(output, 'manifest.json'), bytes, {flag: 'wx'});
  return {...manifest, output, manifestSha256: sha256(bytes)};
}

export function validateDealerPackTransportManifest(value) {
  assert(exactKeys(value, ['schemaVersion', 'kind', 'createdAt', 'requested', 'valid', 'rejected', 'status', 'dealers', 'files', 'blobs', 'shards', 'shardBytesLimit', 'logicalBytes', 'uniqueBytes', 'providerWrites', 'sourceIncluded', 'nativeIntermediatesIncluded', 'benchmarkOnly', 'deduplicatedBytes', 'contentDigest']), 'exact manifest fields required');
  assert(value.schemaVersion === 1 && value.kind === KIND && value.providerWrites === 0 && value.sourceIncluded === false && value.nativeIntermediatesIncluded === false && value.benchmarkOnly === false && hex(value.contentDigest) && value.contentDigest === digest(manifestBody(value)), 'transport manifest digest or kind differs');
  assert(Array.isArray(value.requested) && value.requested.length >= 1 && value.requested.length <= 100 && new Set(value.requested).size === value.requested.length && value.requested.every(validPackSlug), 'bounded distinct request inventory required');
  assert(Array.isArray(value.valid) && new Set(value.valid).size === value.valid.length && value.valid.every(slug => value.requested.includes(slug)) &&
    Array.isArray(value.rejected) && new Set(value.rejected.map(row => row.slug)).size === value.rejected.length && value.rejected.every(row => exactKeys(row, ['slug', 'reason']) && value.requested.includes(row.slug) && !value.valid.includes(row.slug) && typeof row.reason === 'string') && value.valid.length + value.rejected.length === value.requested.length, 'valid/rejected coverage differs');
  assert(value.status === (value.rejected.length ? value.valid.length ? 'partial-failure' : 'failed' : 'passed'), 'transport status differs from actual selection');
  assert(Number.isSafeInteger(value.shardBytesLimit) && value.shardBytesLimit > 0 && value.shardBytesLimit <= DEALER_PACK_TRANSPORT_SHARD_BYTES && Array.isArray(value.shards) && value.shards.length <= DEALER_PACK_TRANSPORT_MAX_SHARDS, 'bounded shard inventory required');
  assert(Array.isArray(value.files) && value.files.length <= 1000000 && new Set(value.files.map(row => row.path)).size === value.files.length && value.files.every(row => exactKeys(row, ['path', 'bytes', 'sha256', 'shard']) && safeArtifactPath(row.path) && value.valid.includes(row.path.split('/')[0]) && natural(row.bytes) && hex(row.sha256) && Number.isInteger(row.shard) && row.shard >= 0 && row.shard < value.shards.length), 'invalid exact transported file inventory');
  assert(value.files.every(row => {const name = row.path.split('/').slice(1).join('/'); return name === 'build-report.json' || name === 'qa-report.json' || /^screenshots\/[^/]+\.png$/.test(name) || /^bundle\/(?:artifact-manifest\.json|single-worker-receipt\.json|wrangler\.json|(?:public|server)\/.+)$/.test(name);}), 'source or non-evidence file cannot be transported');
  assert(Array.isArray(value.blobs) && new Set(value.blobs.map(row => row.sha256)).size === value.blobs.length && value.blobs.every(row => exactKeys(row, ['sha256', 'bytes', 'shard']) && hex(row.sha256) && natural(row.bytes) && row.bytes <= value.shardBytesLimit && Number.isInteger(row.shard) && row.shard >= 0 && row.shard < value.shards.length), 'invalid unique blob inventory');
  const blobs = new Map(value.blobs.map(row => [row.sha256, row]));
  assert(value.files.every(row => blobs.get(row.sha256)?.bytes === row.bytes && blobs.get(row.sha256)?.shard === row.shard) && new Set(value.files.map(row => row.sha256)).size === blobs.size, 'file/blob coverage differs');
  assert(value.shards.every((row, index) => {const members = value.blobs.filter(blob => blob.shard === index).map(({sha256, bytes}) => ({sha256, bytes}));
    return exactKeys(row, ['index', 'path', 'bytes', 'blobCount', 'digest']) && row.index === index && row.path === 'shard-' + index && natural(row.bytes) && row.bytes <= value.shardBytesLimit && members.length > 0 && row.blobCount === members.length && row.bytes === members.reduce((sum, blob) => sum + blob.bytes, 0) && row.digest === digest(members);
  }), 'shard member inventory differs');
  assert(Array.isArray(value.dealers) && same(value.dealers.map(row => row.slug), value.valid) && value.dealers.every(row => exactKeys(row, ['slug', 'sourceCommit', 'packDigest', 'releaseDigest', 'outputDigest', 'artifactDigest', 'fileCount', 'bytes']) && /^[a-f0-9]{40}$/.test(row.sourceCommit ?? '') && ['packDigest', 'releaseDigest', 'outputDigest', 'artifactDigest'].every(key => hex(row[key])) && row.fileCount === value.files.filter(file => file.path.startsWith(row.slug + '/')).length && row.bytes === value.files.filter(file => file.path.startsWith(row.slug + '/')).reduce((sum, file) => sum + file.bytes, 0)), 'dealer envelope bindings differ');
  assert(natural(value.logicalBytes) && natural(value.uniqueBytes) && natural(value.deduplicatedBytes) && value.logicalBytes === value.files.reduce((sum, row) => sum + row.bytes, 0) && value.uniqueBytes === value.blobs.reduce((sum, row) => sum + row.bytes, 0) && value.deduplicatedBytes === value.logicalBytes - value.uniqueBytes, 'transport byte accounting differs');
  return value;
}

export function restoreDealerPackTransport({input, out, manifestSha256, slugs} = {}) {
  input = physicalDirectory(input); const bytes = readPhysical(input, 'manifest.json', {maximum: MAX_MANIFEST_BYTES});
  if (manifestSha256 !== undefined) assert(hex(manifestSha256) && sha256(bytes) === manifestSha256, 'manifest differs from its externally pinned SHA256');
  const manifest = validateDealerPackTransportManifest(parseCatalogJson(new TextDecoder('utf-8', {fatal: true}).decode(bytes)));
  const selected = slugs === undefined ? manifest.valid : Array.isArray(slugs) ? slugs : typeof slugs === 'string' && slugs.trim().startsWith('[') ? parseCatalogJson(slugs) : String(slugs).split(/[\s,]+/).filter(Boolean);
  assert(Array.isArray(selected) && (slugs === undefined || selected.length > 0) && selected.length <= 100 && new Set(selected).size === selected.length && selected.every(slug => validPackSlug(slug) && manifest.valid.includes(slug)), 'restore requires an exact distinct subset of valid manifest dealers');
  const selectedFiles = manifest.files.filter(row => selected.includes(row.path.split('/')[0]));
  const expected = ['manifest.json', ...manifest.blobs.map(row => 'shard-' + row.shard + '/blobs/' + row.sha256)].sort();
  assert(same(filesAt(input, {filter: () => true}), expected), 'transport has missing or undeclared blob files');
  const allowedDirectories = new Set(manifest.shards.flatMap(row => [row.path, row.path + '/blobs']));
  const walk = (directory, prefix = '') => {for (const entry of fs.readdirSync(directory, {withFileTypes: true})) if (entry.isDirectory()) {const relative = prefix + entry.name; assert(allowedDirectories.has(relative), 'undeclared transport directory'); walk(path.join(directory, entry.name), relative + '/');}}; walk(input);
  const output = freshDirectory(out, input), parent = physicalDirectory(path.dirname(output));
  const owned = fs.lstatSync(output); let complete = false;
  const assertOwnedOutput = () => {
    assert(path.isAbsolute(output) && path.dirname(output) === parent && physicalDirectory(parent) === parent, 'restoration escaped its exact output parent');
    const current = fs.lstatSync(output);
    assert(current.isDirectory() && !current.isSymbolicLink() && current.dev === owned.dev && current.ino === owned.ino && physicalDirectory(output) === output, 'restoration ownership changed; retain it for reconciliation');
  };
  try {
    const destinations = new Map();
    for (const row of selectedFiles) {if (!destinations.has(row.sha256)) destinations.set(row.sha256, []); destinations.get(row.sha256).push(row.path);}
    // Authenticate EVERY unique blob, including unselected dealers, exactly once.
    // Fan out this verified Buffer before releasing it; no cross-claim byte cache.
    for (const row of manifest.blobs) {
      const blob = readPhysical(input, 'shard-' + row.shard + '/blobs/' + row.sha256);
      assert(blob.length === row.bytes && sha256(blob) === row.sha256, 'transport blob bytes changed: ' + row.sha256);
      for (const name of destinations.get(row.sha256) ?? []) {
        const file = path.join(output, name); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, blob, {flag: 'wx'});
      }
    }
    assert(same(filesAt(output, {filter: () => true}), selectedFiles.map(row => row.path).sort()), 'reconstructed paths differ');
    for (const row of manifest.dealers.filter(row => selected.includes(row.slug))) {
      const inspected = inspectDealerPackTransportSource({root: output, slug: row.slug}), {files, ...binding} = inspected;
      assert(same(binding, row) && same(files, manifest.files.filter(file => file.path.startsWith(row.slug + '/')).map(({shard, ...file}) => file)), 'reconstructed sealed bundle or evidence differs: ' + row.slug);
    }
    // As in the original restorer, the owned output exists during reconstruction;
    // no caller receives a qualified candidate until every inspection succeeds.
    assertOwnedOutput(); complete = true;
  } finally {
    if (!complete && pathPresent(output)) {assertOwnedOutput(); fs.rmSync(output, {recursive: true, force: false});}
  }
  return {schemaVersion: 1, kind: 'cars-dealer-pack-bundle-transport-restoration', status: manifest.status, output, slugs: selected, rejected: manifest.rejected,
    manifestSha256: sha256(bytes), contentDigest: manifest.contentDigest, restoredFiles: selectedFiles.length, restoredBytes: selectedFiles.reduce((sum, row) => sum + row.bytes, 0), uniqueBytes: manifest.uniqueBytes, providerWrites: 0};
}

export function runDealerPackTransportCli(argv = process.argv.slice(2)) {
  if (argv.includes('--help')) {console.log('Usage: transport-dealer-pack-bundles.mjs pack --root runtime/LANE/dealers --out runtime/transport [--shard-bytes N]\n       transport-dealer-pack-bundles.mjs restore --input runtime/transport --out runtime/restored/dealers [--manifest-sha256 HEX] [--slugs CSV_OR_JSON]\nUpload manifest.json and each shard-0 .. shard-7 directory separately. Source and native caches are excluded. Only sealed bundles with exact successful build/QA and18 screenshot files enter transport; failed dealers remain reported. Restore requires a fresh destination and authenticates every transport blob even when only selected exact dealers are materialized.'); return;}
  const [command, ...rest] = argv, options = {}; assert(['pack', 'restore'].includes(command), 'use pack or restore');
  for (let index = 0; index < rest.length; index++) {const key = rest[index]; assert(['--root', '--out', '--shard-bytes', '--input', '--manifest-sha256', '--slugs'].includes(key) && !Object.hasOwn(options, key) && rest[index + 1] && !rest[index + 1].startsWith('--'), 'unknown, repeated or incomplete option: ' + key); options[key] = rest[++index];}
  assert(options['--out'], 'fresh output directory required');
  if (command === 'pack') {assert(options['--root'] && !options['--input'] && !options['--manifest-sha256'] && !options['--slugs'], 'pack requires --root'); const result = packDealerPackTransport({root: options['--root'], out: options['--out'], shardBytes: Number(options['--shard-bytes'] ?? DEALER_PACK_TRANSPORT_SHARD_BYTES)}); return {kind: result.kind, status: result.status, output: result.output, valid: result.valid, rejected: result.rejected, shards: result.shards, logicalBytes: result.logicalBytes, uniqueBytes: result.uniqueBytes, deduplicatedBytes: result.deduplicatedBytes, manifestSha256: result.manifestSha256};}
  assert(options['--input'] && !options['--root'] && !options['--shard-bytes'], 'restore requires --input'); return restoreDealerPackTransport({input: options['--input'], out: options['--out'], manifestSha256: options['--manifest-sha256'], slugs: options['--slugs']});
}
if (isEntrypoint(import.meta.url)) try {const value = runDealerPackTransportCli(); if (value) console.log(JSON.stringify(value, null, 2));} catch (error) {console.error(error.message); process.exitCode = 1;}
