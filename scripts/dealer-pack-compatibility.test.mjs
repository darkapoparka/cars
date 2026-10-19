import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {canonicalPackSlug, expectedPackHosting, assertPackHostingIdentity, packRegistryCollisions, buildPackBatchAssignments, assertPackBatch, PACK_BATCH_FILE} from './lib/dealer-pack-identity.mjs';
import {getPackReleaseBinding, validatePackSourceReview, createStablePackQualification, resolveStablePackQualification} from './lib/dealer-pack-release.mjs';
import {inspectPackContacts} from './lib/dealer-pack-contact-review.mjs';
import {listDealerPacks} from './lib/dealer-pack-index.mjs';
import {resolveIdentity, sha256} from './lib/workflow.mjs';
import {rebindPackJson, parseMigrationArgs} from './migrate-dealer-pack.mjs';

const area = t => {const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-pack-compat-')); t.after(() => fs.rmSync(root, {recursive: true, force: true})); return root;};
const put = (root, name, value) => {const file = path.join(root, name); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');};
const keys = ['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best'];
const source = key => ({repository: 'darkapoparka/cars', revision: 'a'.repeat(40), path: 'templates/' + key, tree: 'b'.repeat(40), digest: 'c'.repeat(64)});
const sourceLock = () => ({schemaVersion: 1, exportPolicy: 'cars-source-v1', templates: Object.fromEntries(keys.map(key => [key, {commit: 'a'.repeat(40), source: source(key), qualification: {contextId: 'test-source-candidate', sourceDeltaReview: {reference: 'docs/review.json', sha256: 'd'.repeat(64), reviewedAt: '2026-10-19T12:00:00Z'}}}]))});
const sourceReview = () => ({schemaVersion: 1, kind: 'cars-dealer-pack-source-delta-review', reviewed: true, reviewedAt: '2026-10-19T12:00:00Z', sourceCommit: 'a'.repeat(40), nativeApproval: false, hostedApproval: false, globalReleaseApproval: false, changes: keys.map(key => ({key, selected: source(key)}))});
const manifest = () => ({slug: 'honest-motors', dealerId: 'gb-city-honest-motors', cloudflare: {workerPrefix: 'cars-honest-motors'}, shareIdentity: {publicOrigin: 'https://honest-motors.webpreviews.site'}});

test('long slugs retain a deterministic research-bound suffix and cannot collide on a truncated prefix', () => {
  const raw = 'a-very-long-dealer-name-with-many-repeated-words-and-a-distinct-town';
  const one = canonicalPackSlug(raw, 'gb-first'), two = canonicalPackSlug(raw, 'gb-second');
  assert(one.length <= 43); assert.match(one, /^[a-z0-9]+(?:-[a-z0-9]+)*$/); assert.equal(one, canonicalPackSlug(raw, 'gb-first')); assert.notEqual(one, two);
  assert.notEqual(canonicalPackSlug(raw, 'gb-first', {reserved: [one]}), one);
  for (const slug of ['za-motors', 'wadishee-used-cars', 'granada-auto-sales']) assert.equal(canonicalPackSlug(slug, 'gb-any'), slug);
});

test('hosting identity is exact and protects registry names, origins and nested hosting identities', () => {
  const pack = manifest(); assert.deepEqual(assertPackHostingIdentity(pack), expectedPackHosting(pack.slug));
  for (const field of ['workerName', 'publicOrigin', 'hostingIdentity']) {
    const value = field === 'workerName' ? 'cars-honest-motors' : 'https://honest-motors.webpreviews.site';
    const registry = [{slug: 'preserved-old-dealer', hosting: {[field]: value}}];
    assert.equal(packRegistryCollisions(pack, registry).length, 1); assert.throws(() => assertPackHostingIdentity(pack, {registry}), /preserved fleet/);
  }
  for (const mutate of [p => p.cloudflare.workerPrefix = 'cars-live-existing', p => p.shareIdentity.publicOrigin = 'https://elsewhere.example', p => p.shareIdentity.publicOrigin += '/']) {
    const changed = manifest(); mutate(changed); assert.throws(() => assertPackHostingIdentity(changed), /require exactly/);
  }
});

test('400 assignments preserve manifest-relative market ordering and enforce an exact batch', t => {
  const ids = [...Array.from({length: 277}, (_, i) => 'ae-lead-' + i), ...Array.from({length: 17}, (_, i) => 'us-lead-' + i), ...Array.from({length: 106}, (_, i) => 'gb-lead-' + i)];
  const original = {priorityResearchIds: ids}, assignment = buildPackBatchAssignments(original);
  assert.deepEqual(assignment.batches.map(row => row.leadIds.length), [100, 100, 100, 100]);
  assert.equal(assignment.batches[0].leadIds[0], 'gb-lead-0'); assert.equal(assignment.batches[1].leadIds[0], 'gb-lead-100');
  assert.equal(assignment.batches[1].leadIds[6], 'us-lead-0'); assert.equal(assignment.batches[1].leadIds[23], 'ae-lead-0');
  const root = area(t); put(root, 'leads/expansion-2026-10-18/manifest.json', original); put(root, PACK_BATCH_FILE, assignment);
  assert.equal(assertPackBatch(root, {slug: 'example', dealerId: 'us-lead-0'}, {batch: 2}).position, 107);
  assert.throws(() => assertPackBatch(root, {slug: 'example', dealerId: 'us-lead-0'}, {batch: 1}), /outside batch/);
  assert.throws(() => assertPackBatch(root, {slug: 'example', dealerId: 'us-unassigned'}, {batch: 2}), /outside the authorized/);
  assignment.batches[0].leadIds.reverse(); put(root, PACK_BATCH_FILE, assignment); assert.throws(() => assertPackBatch(root, {slug: 'example', dealerId: 'gb-lead-0'}), /differ/);
});

test('malformed and merge-conflicted packs report diagnostics and reserve their slugs without breaking old identity lookup', t => {
  const root = area(t); put(root, 'dealers/valid-pack/dealer.json', {slug: 'valid-pack', dealerId: 'gb-valid'});
  put(root, 'dealers/conflicted-pack/dealer.json', '<<<<<<< ours\n{}\n=======\n{}\n>>>>>>> theirs');
  put(root, 'dealers/mismatched-pack/dealer.json', {slug: 'wrong-name', dealerId: 'gb-mismatched'}); put(root, 'dealers/null-pack/dealer.json', 'null');
  fs.mkdirSync(path.join(root, 'dealers/missing-pack'), {recursive: true});
  const diagnostics = [], rows = listDealerPacks(root, {onDiagnostic: row => diagnostics.push(row)});
  assert.equal(rows.length, 5); assert.equal(diagnostics.length, 4); assert.equal(rows.filter(row => row.valid).length, 1);
  assert.equal(resolveIdentity(root, 'validpack').exists, true); assert.equal(resolveIdentity(root, 'conflicted-pack').exists, true);
  assert.equal(resolveIdentity(root, 'unrelated-new-pack').exists, false); assert.equal(resolveIdentity(root, 'another', 'gb-mismatched').exists, true);
});

test('contact screen flags likely individual addresses and accepts exact public-business evidence, without treating mobile phones as inherently personal', () => {
  const facts = {slug: 'honest-motors', business: {name: 'Honest Motors', email: 'alex.smith@gmail.com', phone: '+447700900001'}};
  const screen = inspectPackContacts(facts); assert.deepEqual(screen.blocking, ['business.email']);
  const contactReview = {schemaVersion: 1, kind: 'cars-public-business-contact-review', dealer: facts.slug, checks: [{field: 'business.email', valueSha256: sha256(facts.business.email), classification: 'public-business', reviewed: true, reviewKind: 'source-evidence', sourceUrl: 'https://honest.example/contact', observedAt: '2026-10-19'}]};
  assert.deepEqual(inspectPackContacts(facts, {contactReview}).blocking, []);
  facts.business.email = 'other.person@gmail.com'; assert.deepEqual(inspectPackContacts(facts, {contactReview}).blocking, ['business.email']);
  for (const email of ['sales@gmail.com', 'honestmotors@gmail.com', 'info@honest.example']) assert.deepEqual(inspectPackContacts({...facts, business: {...facts.business, email}}).blocking, []);
});

test('release binding survives mutable metadata but changes with immutable source or adapter version', () => {
  const lock = sourceLock(), first = getPackReleaseBinding(lock);
  lock.purpose = 'Updated explanatory prose'; lock.templates.modern.qualification.sourceDeltaReview.reviewedAt = '2026-10-20T12:00:00Z';
  assert.equal(getPackReleaseBinding(lock).releaseId, first.releaseId);
  assert.notEqual(getPackReleaseBinding(lock, {adapterVersion: 'next-data-adapter'}).releaseId, first.releaseId);
  lock.templates.modern.source.tree = 'e'.repeat(40); assert.notEqual(getPackReleaseBinding(lock).releaseId, first.releaseId);
});

test('stable qualification checks semantic reviewed source and tolerates lock/review formatting or note updates', t => {
  const root = area(t), lock = sourceLock(), review = sourceReview();
  put(root, 'docs/review.json', review); put(root, 'templates.lock.json', {arbitraryMetadata: true});
  const qualification = createStablePackQualification(root, 'honest-motors', lock);
  assert.equal(qualification.reviewed, false); assert.throws(() => resolveStablePackQualification(root, 'honest-motors', qualification, lock), /automated/);
  qualification.reviewed = true; qualification.reviewedAt = '2026-10-19T13:00:00Z'; qualification.review.kind = 'automated';
  const first = resolveStablePackQualification(root, 'honest-motors', qualification, lock);
  review.notes = 'Non-source editorial update'; review.reviewedAt = '2026-10-19T13:01:00Z'; put(root, 'docs/review.json', JSON.stringify(review)); put(root, 'templates.lock.json', {differentMetadata: true});
  const second = resolveStablePackQualification(root, 'honest-motors', qualification, lock);
  assert.equal(first.release.releaseId, second.release.releaseId); assert.notEqual(first.qualification.sourceDeltaReview.sha256, second.qualification.sourceDeltaReview.sha256);
  review.changes[0].selected.tree = 'f'.repeat(40); put(root, 'docs/review.json', review); assert.throws(() => validatePackSourceReview(root, lock), /different immutable/);
});

test('mechanical identity rebinding leaves business prose and research identity intact', () => {
  const input = {slug: 'old-name', dealerId: 'gb-source-old-name', business: {name: 'old-name', description: 'Visit old-name for cars'}, sourcePath: 'dealers/old-name',
    shareIdentity: {publicOrigin: 'https://old-name.webpreviews.site'}, cloudflare: {workerPrefix: 'cars-old-name'}, sourceReference: 'dealers/old-name/branding/original.png'};
  const output = rebindPackJson(input, 'old-name', 'new-name');
  assert.equal(output.slug, 'new-name'); assert.equal(output.dealerId, input.dealerId); assert.deepEqual(output.business, input.business);
  assert.equal(output.sourcePath, 'dealers/new-name'); assert.equal(output.cloudflare.workerPrefix, 'cars-new-name'); assert.match(output.sourceReference, /^dealers\/new-name\//);
  assert.deepEqual(parseMigrationArgs(['--batch', '2', '--write']), {batch: '2', write: true});
  for (const args of [[], ['--write'], ['--slug', 'x', '--force'], ['--slug', 'x', '--write', '--write']]) assert.throws(() => parseMigrationArgs(args));
});
