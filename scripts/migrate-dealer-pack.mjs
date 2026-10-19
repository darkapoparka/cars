#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, sha256, inside, json} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {PACK_KEYS, PACK_LOCK, readPackFiles, encodePackJson, listDealerPacks, loadDealerPack} from './lib/dealer-pack.mjs';
import {canonicalPackSlug, assertPackBatch, expectedPackHosting, readPackBatchAssignments} from './lib/dealer-pack-identity.mjs';
import {getPackReleaseBinding, createStablePackQualification} from './lib/dealer-pack-release.mjs';
import {prepareDealerPackLogo, loadPreparedDealerPack} from './prepare-dealer-pack-logo.mjs';
import {reviewDealerPack} from './review-dealer-pack.mjs';

const assert = (ok, message) => {if (!ok) throw Error(message);};
const inventory = files => [...files].sort(([a], [b]) => a.localeCompare(b, 'en')).map(([name, bytes]) => ({path: name, bytes: bytes.length, sha256: sha256(bytes)}));
const total = files => [...files.values()].reduce((sum, bytes) => sum + bytes.length, 0);

/** Only identity keys, internal pack references and the preview origin are rebound. Business prose stays untouched. */
export function rebindPackJson(value, previousSlug, slug) {
  const nextHost = expectedPackHosting(slug);
  const visit = (item, key = '') => {
    if (Array.isArray(item)) return item.map(value => visit(value));
    if (item && typeof item === 'object') return Object.fromEntries(Object.entries(item).map(([name, value]) => [name, visit(value, name)]));
    if (typeof item !== 'string') return item;
    if (['slug', 'dealer'].includes(key) && item === previousSlug) return slug;
    if (item.startsWith('dealers/' + previousSlug + '/')) return 'dealers/' + slug + '/' + item.slice(('dealers/' + previousSlug + '/').length);
    if (key === 'sourcePath' && item === 'dealers/' + previousSlug) return 'dealers/' + slug;
    if (key === 'publicOrigin' && item === 'https://' + previousSlug + '.webpreviews.site') return nextHost.publicOrigin;
    if (key === 'workerPrefix' && item === 'cars-' + previousSlug) return nextHost.workerName;
    return item;
  };
  return visit(value);
}

export async function planDealerPackMigration({root = ROOT, slug, batch, toolPackage, allowBenchmark = false, now = new Date().toISOString()} = {}) {
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '') && slug.length <= 140, 'Expected an existing pack directory slug');
  const directory = inside(root, 'dealers/' + slug, {mustExist: true}), original = readPackFiles(directory), inputManifest = JSON.parse(original.get('dealer.json'));
  assert(inputManifest.slug === slug && inputManifest.sourceFormat === 'dealer-pack', 'The source manifest must match its existing pack directory');
  if (original.has('copy-review.json')) assert(JSON.parse(original.get('copy-review.json')).stockSha256 === sha256(original.get('stock.json')), 'Existing companion copy does not bind the original stock input; review it before migration');
  assert(inputManifest.pack?.benchmarkOnly !== true || allowBenchmark, 'Benchmark packs require an explicit local-only migration path');
  const canonicalSlug = canonicalPackSlug(slug, inputManifest.dealerId), lock = json(path.join(root, PACK_LOCK)), release = getPackReleaseBinding(lock);
  for (const key of PACK_KEYS) assert(JSON.stringify(inputManifest.templateSources?.[key]) === JSON.stringify(lock.templates[key].source), 'Mechanical migration cannot change template sources: ' + key);
  assert(canonicalSlug === slug || !fs.existsSync(path.join(root, 'dealers', canonicalSlug)), 'The canonical shortened pack directory already exists');
  const files = new Map([...original].map(([name, bytes]) => [name, canonicalSlug !== slug && name.endsWith('.json') ? encodePackJson(rebindPackJson(JSON.parse(bytes), slug, canonicalSlug)) : bytes]));
  if (canonicalSlug !== slug && files.has('copy-review.json')) {
    const copy = JSON.parse(files.get('copy-review.json')); copy.stockSha256 = sha256(files.get('stock.json')); files.set('copy-review.json', encodePackJson(copy));
  }
  const manifest = JSON.parse(files.get('dealer.json')), expected = expectedPackHosting(canonicalSlug);
  assert(inputManifest.cloudflare?.workerPrefix === 'cars-' + slug && inputManifest.shareIdentity?.publicOrigin === 'https://' + slug + '.webpreviews.site', 'Refuse to migrate an arbitrary hosting identity');
  manifest.cloudflare.workerPrefix = expected.workerName; manifest.shareIdentity.publicOrigin = expected.publicOrigin;
  manifest.pack = {...manifest.pack, schemaVersion: 2, identity: manifest.pack?.identity ?? {requestedSlug: slug, canonicalSlug, dealerId: manifest.dealerId}};
  manifest.pack.batch = assertPackBatch(root, manifest, {batch});
  files.set('dealer.json', encodePackJson(manifest));
  files.set('qualification.json', encodePackJson(createStablePackQualification(root, canonicalSlug, lock)));
  const generated = await prepareDealerPackLogo({root, slug: canonicalSlug, sourceDirectory: directory, persist: false, sourceFiles: files, toolPackage});
  for (const [name, bytes] of generated.generatedFiles) if (name.endsWith('.json')) files.set(name, bytes);
  const source = JSON.parse(files.get('branding/source.json')), protectedArtwork = new Set();
  const collect = value => {if (Array.isArray(value)) value.forEach(collect); else if (value && typeof value === 'object') {if (typeof value.path === 'string') protectedArtwork.add(value.path); Object.values(value).forEach(collect);}};
  collect(source);
  const removed = [];
  for (const output of generated.recipe.outputs) {
    const prior = original.get(output.path), derived = generated.generatedFiles.get(output.path);
    assert(!prior || prior.equals(derived), 'Refuse to remove a non-deterministic or modified logo export: ' + output.path);
    if (prior && !protectedArtwork.has(output.path)) {files.delete(output.path); removed.push(output);}
  }
  let recipe = {...generated.recipe, dealer: canonicalSlug};
  recipe.sourceSha256 = sha256(files.get('branding/source.json')); recipe.contractSha256 = sha256(files.get('branding/logo-contract.json'));
  files.set('branding/logo-recipe.json', encodePackJson(recipe));
  files.delete('input-review.json');
  const preserved = [...original].filter(([name]) => name.startsWith('dealer-stock/') || protectedArtwork.has(name) || canonicalSlug === slug && ['business-facts.json', 'stock.json', 'locale.json', 'branding/source.json', 'source-evidence.json'].includes(name));
  for (const [name, bytes] of preserved) assert(files.get(name)?.equals(bytes), 'Migration would change retained research, artwork or stock media: ' + name);
  const report = {schemaVersion: 1, kind: 'cars-dealer-pack-migration', dealer: canonicalSlug, previousSlug: slug, fromVersion: inputManifest.pack?.schemaVersion ?? 1, toVersion: 2,
    createdAt: now, releaseId: release.releaseId, batch: manifest.pack.batch, before: {files: original.size, bytes: total(original)},
    afterBeforeReview: {files: files.size, bytes: total(files)}, generatedExportsRemoved: removed,
    retainedOriginals: {files: preserved.length, bytes: preserved.reduce((sum, [, bytes]) => sum + bytes.length, 0), inventorySha256: sha256(JSON.stringify(inventory(new Map(preserved)))), byteIdentical: true},
    sizeTargetBytes: 500 * 1024, sizeTargetMet: total(files) <= 500 * 1024, sourceArtworkOrPhotoRecompression: false,
    researchRepeated: false, imageGenerationRepeated: false, providerWrites: 0};
  files.set('migration-report.json', encodePackJson(report));
  return {root, slug, canonicalSlug, directory, original, files, report};
}

export async function migrateDealerPack(options = {}) {
  const plan = await planDealerPackMigration(options);
  if (!options.write) return {...plan.report, write: false, next: 'Use --write to apply this mechanical migration and run automated input review.'};
  const current = readPackFiles(plan.directory);
  assert(JSON.stringify(inventory(current)) === JSON.stringify(inventory(plan.original)), 'Pack changed while migration was being prepared');
  const destination = path.join(options.root ?? ROOT, 'dealers', plan.canonicalSlug);
  if (plan.canonicalSlug !== plan.slug) fs.renameSync(plan.directory, destination);
  for (const [name, bytes] of plan.files) {const target = inside(destination, name); fs.mkdirSync(path.dirname(target), {recursive: true}); if (!plan.original.get(name)?.equals(bytes)) fs.writeFileSync(target, bytes);}
  for (const name of plan.original.keys()) if (!plan.files.has(name)) fs.unlinkSync(inside(destination, name, {mustExist: true}));
  assert(JSON.stringify(inventory(readPackFiles(destination))) === JSON.stringify(inventory(plan.files)), 'Pack migration bytes changed before automated review; retain and inspect the source');
  const review = await reviewDealerPack({...options, slug: plan.canonicalSlug});
  assert(plan.report.generatedExportsRemoved.every(row => !fs.existsSync(path.join(destination, row.path))), 'A removed generated logo export was rematerialized during input review');
  loadDealerPack(options.root ?? ROOT, plan.canonicalSlug, {batch: options.batch, allowBenchmark: options.allowBenchmark});
  const completedFiles = readPackFiles(destination), otherBytes = total(completedFiles) - completedFiles.get('migration-report.json').length;
  const result = {...plan.report, write: true, automatedReview: review, after: {files: completedFiles.size, bytes: 0}};
  // Account for the small report itself, including the decimal size field.
  for (let index = 0; index < 4; index++) result.after.bytes = otherBytes + encodePackJson(result).length;
  fs.writeFileSync(path.join(destination, 'migration-report.json'), encodePackJson(result));
  return result;
}

export async function migrateDealerPackBatch({root = ROOT, batch, ...options} = {}) {
  assert(/^[1-4]$/.test(String(batch)), 'Use an exact batch number from 1 to 4');
  const assignments = readPackBatchAssignments(root), selected = new Set(assignments.batches.find(row => row.number === Number(batch)).leadIds), rows = listDealerPacks(root), results = [];
  for (const row of rows.filter(row => selected.has(row.dealerId))) {
    if (!row.valid) {results.push({dealer: row.slug, success: false, diagnostics: row.diagnostics}); continue;}
    try {results.push({dealer: row.slug, success: true, result: await migrateDealerPack({root, batch, slug: row.slug, ...options})});}
    catch (error) {results.push({dealer: row.slug, success: false, error: error.message});}
  }
  return {batch: Number(batch), results, success: results.length > 0 && results.every(row => row.success),
    invalidUnassignedPacks: rows.filter(row => !row.valid && !row.dealerId).map(row => ({dealer: row.slug, diagnostics: row.diagnostics})), providerWrites: 0};
}

/** Local benchmark replicas are never deployment candidates and retain the exact source business/research identity. */
export async function cloneBenchmarkDealerPack({root = ROOT, sourceSlug, sourcePackDigest, slug, toolPackage, now = new Date().toISOString()} = {}) {
  assert(/^m2-bench-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '') && slug.length <= 43, 'Benchmark replicas require a bounded m2-bench-* slug');
  const source = await loadPreparedDealerPack(root, sourceSlug, {toolPackage}), directory = inside(root, 'dealers/' + slug);
  assert(sourcePackDigest === undefined || source.packDigest === sourcePackDigest, 'Benchmark source changed after its exact plan');
  assert(source.manifest.pack?.benchmarkOnly !== true, 'A benchmark cannot become another benchmark source');
  assert(!fs.existsSync(directory), 'Benchmark destination already exists; preserve it');
  const original = readPackFiles(source.directory), files = new Map([...original].filter(([name]) => !['input-review.json', 'migration-report.json'].includes(name))
    .map(([name, bytes]) => [name, name.endsWith('.json') ? encodePackJson(rebindPackJson(JSON.parse(bytes), sourceSlug, slug)) : bytes]));
  const manifest = JSON.parse(files.get('dealer.json'));
  manifest.pack = {...manifest.pack, benchmarkOnly: true, identity: {requestedSlug: slug, canonicalSlug: slug, dealerId: manifest.dealerId},
    benchmark: {sourceSlug, sourceDealerId: source.manifest.dealerId, sourcePackDigest: source.packDigest, neverDeploy: true}};
  files.set('dealer.json', encodePackJson(manifest));
  if (files.has('copy-review.json')) {const copy = JSON.parse(files.get('copy-review.json')); copy.stockSha256 = sha256(files.get('stock.json')); files.set('copy-review.json', encodePackJson(copy));}
  fs.mkdirSync(directory);
  try {
    for (const [name, bytes] of files) {const target = inside(directory, name); fs.mkdirSync(path.dirname(target), {recursive: true}); fs.writeFileSync(target, bytes, {flag: 'wx'});}
    const migration = await migrateDealerPack({root, slug, toolPackage, allowBenchmark: true, write: true, now});
    return {slug, sourceSlug, sourceDealerId: source.manifest.dealerId, sourcePackDigest: source.packDigest, benchmarkOnly: true, neverDeploy: true,
      retainedInputBytes: migration.retainedOriginals.bytes, directory, providerWrites: 0, automatedReview: migration.automatedReview};
  } catch (error) {
    // This function exclusively created the temporary benchmark directory above.
    fs.rmSync(directory, {recursive: true, force: true});
    throw error;
  }
}

export function parseMigrationArgs(argv) {
  const out = {}, names = {'--slug': 'slug', '--batch': 'batch', '--tool-package': 'toolPackage'};
  for (let index = 0; index < argv.length; index++) {
    const key = argv[index];
    if (key === '--write') {assert(!out.write, 'Repeated --write'); out.write = true; continue;}
    assert(names[key] && !Object.hasOwn(out, names[key]) && argv[index + 1] && !argv[index + 1].startsWith('--'), 'Unknown, repeated or incomplete migration option: ' + key);
    out[names[key]] = argv[++index];
  }
  assert(out.slug || out.batch, 'Use --slug SLUG or --batch 1|2|3|4 [--write]');
  return out;
}

if (isEntrypoint(import.meta.url)) {
  const options = parseMigrationArgs(process.argv.slice(2));
  (options.slug ? migrateDealerPack(options) : migrateDealerPackBatch(options)).then(value => {console.log(JSON.stringify(value, null, 2)); if (value.success === false) process.exitCode = 1;})
    .catch(error => {console.error(error.message); process.exitCode = 1;});
}
