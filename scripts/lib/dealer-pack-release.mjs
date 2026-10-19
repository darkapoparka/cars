import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const KEYS = ['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best'];
const assert = (ok, message) => {if (!ok) throw Error(message);};
const sha256 = value => createHash('sha256').update(value).digest('hex');
export const PACK_DATA_ADAPTER_VERSION = 'dealer-pack-data-v2';
const fields = source => ({repository: source.repository, revision: source.revision, path: source.path, tree: source.tree, digest: source.digest});

/** Stable source identity excludes mutable notes, review timestamps and JSON formatting. */
export function getPackReleaseBinding(lock, {adapterVersion = PACK_DATA_ADAPTER_VERSION} = {}) {
  assert(lock?.schemaVersion === 1 && lock.exportPolicy === 'cars-source-v1', 'An exact Cars source lock is required');
  const templates = Object.fromEntries(KEYS.map(key => {
    const release = lock.templates?.[key], source = release?.source;
    assert(source?.repository === 'darkapoparka/cars' && source.path === 'templates/' + key && /^[a-f0-9]{40}$/.test(source.revision ?? '') &&
      /^[a-f0-9]{40}$/.test(source.tree ?? '') && /^[a-f0-9]{64}$/.test(source.digest ?? '') && (!release.commit || release.commit === source.revision) && (!release.digest || release.digest === source.digest), 'Missing or inconsistent immutable source fingerprint: ' + key);
    return [key, fields(source)];
  }));
  const commits = new Set(Object.values(templates).map(row => row.revision));
  assert(commits.size === 1, 'A dealer-pack release must select one exact six-template source commit');
  const binding = {schemaVersion: 1, kind: 'cars-dealer-pack-release', adapterVersion, packagingVersion: '5', exportPolicy: lock.exportPolicy, templates};
  return {...binding, sourceCommit: [...commits][0], releaseId: 'cars-six-' + sha256(JSON.stringify(binding))};
}

export function validatePackSourceReview(root, lock) {
  const binding = getPackReleaseBinding(lock), descriptor = lock.templates['auto-best'].qualification?.sourceDeltaReview;
  assert(descriptor?.reference && !path.isAbsolute(descriptor.reference) && !descriptor.reference.split('/').includes('..'), 'The selected release needs a source-review reference');
  const bytes = fs.readFileSync(path.join(root, descriptor.reference)), review = JSON.parse(bytes);
  assert(review.schemaVersion === 1 && review.kind === 'cars-dealer-pack-source-delta-review' && review.reviewed === true &&
    review.sourceCommit === binding.sourceCommit && Number.isFinite(Date.parse(review.reviewedAt)) &&
    review.nativeApproval === false && review.hostedApproval === false && review.globalReleaseApproval === false &&
    Array.isArray(review.changes) && review.changes.length === KEYS.length, 'The source review must describe this exact candidate without claiming release approval');
  for (const key of KEYS) {
    const changes = review.changes.filter(row => row.key === key), parent = lock.templates[key].qualification?.sourceQA?.approvedRelease?.source;
    assert(changes.length === 1 && JSON.stringify(fields(changes[0].selected ?? {})) === JSON.stringify(binding.templates[key]), 'Source review selects a different immutable template: ' + key);
    if (parent) assert(JSON.stringify(fields(changes[0].previous ?? {})) === JSON.stringify(fields(parent)), 'Source review parent differs from retained native QA: ' + key);
  }
  return {binding, sourceDeltaReview: {reference: descriptor.reference, sha256: sha256(bytes), reviewedAt: review.reviewedAt}};
}

export function createStablePackQualification(root, slug, lock, {reviewed = false, reviewedAt = null} = {}) {
  const {binding} = validatePackSourceReview(root, lock);
  return {schemaVersion: 2, kind: 'cars-dealer-pack-qualification', dealer: slug, releaseId: binding.releaseId, sourceCommit: binding.sourceCommit,
    reviewed, reviewedAt, review: {kind: reviewed ? 'automated' : 'pending', humanReview: false, dealerApproval: false},
    nativeApproval: false, hostedApproval: false, globalReleaseApproval: false};
}

/** Adapt the stable pack reference to the maintained native qualification contract in memory. */
export function resolveStablePackQualification(root, slug, stored, lock, {allowUnreviewed = false} = {}) {
  const {binding, sourceDeltaReview} = validatePackSourceReview(root, lock);
  assert(stored?.schemaVersion === 2 && stored.kind === 'cars-dealer-pack-qualification' && stored.dealer === slug && stored.releaseId === binding.releaseId &&
    stored.sourceCommit === binding.sourceCommit && stored.nativeApproval === false && stored.hostedApproval === false && stored.globalReleaseApproval === false,
    'Dealer pack selects a different stable source release');
  assert(allowUnreviewed || stored.reviewed === true && Number.isFinite(Date.parse(stored.reviewedAt)) && stored.review?.kind === 'automated' && stored.review.humanReview === false, 'Run automated dealer-pack input review before building');
  const resolvedLock = structuredClone(lock);
  for (const key of KEYS) resolvedLock.templates[key].qualification.sourceDeltaReview = sourceDeltaReview;
  const qualification = {schemaVersion: 1, kind: 'cars-native-source-qualification-context', id: lock.templates['auto-best'].qualification.contextId,
    dealer: slug, scope: 'new-dealer-source-proposal', reviewed: true, reviewedAt: sourceDeltaReview.reviewedAt, sourceCommit: binding.sourceCommit,
    nativeApproval: false, hostedApproval: false, globalReleaseApproval: false,
    approvedLockSha256: sha256(fs.readFileSync(path.join(root, 'templates.lock.json'))), candidateLockSha256: sha256(JSON.stringify(resolvedLock)), sourceDeltaReview,
    releaseId: binding.releaseId, review: {kind: 'automated-source-binding', humanReview: false, dealerApproval: false}};
  return {lock: resolvedLock, qualification, release: binding};
}
