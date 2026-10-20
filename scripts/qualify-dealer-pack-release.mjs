#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, POLICY, args, sha256, git, writeJson} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {inspectCarsTemplate} from './template-release.mjs';
import {PACK_KEYS, PACK_LOCK} from './lib/dealer-pack.mjs';

/** Cut a candidate lock using the existing immutable release inspector. Exact
 * prior QA is retained as ancestry, never relabeled as approval of new bytes. */
export function qualifyDealerPackRelease({root = ROOT, commit, reviewedAt, write = false} = {}) {
  if (!/^[a-f0-9]{40}$/.test(commit ?? '') || !Number.isFinite(Date.parse(reviewedAt))) throw Error('An exact published commit and dated source review are required');
  const priorBytes = fs.readFileSync(path.join(root, 'templates.lock.json')), prior = JSON.parse(priorBytes);
  const inspected = PACK_KEYS.map(key => inspectCarsTemplate({root, key, commit}));
  const reference = 'docs/releases/dealer-pack-' + reviewedAt.slice(0, 10) + '-source-review.json';
  const changes = PACK_KEYS.map(key => ({key, previous: prior.templates[key].source, selected: inspected.find(row => row.key === key).source,
    paths: git(root, ['diff', '--no-renames', '--name-only', prior.templates[key].commit, commit, '--', 'templates/' + key]).split('\n').filter(Boolean)}));
  const review = {schemaVersion: 1, kind: 'cars-dealer-pack-source-delta-review', reviewed: true, reviewedAt, sourceCommit: commit,
    approvedParentLockSha256: sha256(priorBytes), changes,
    scope: 'Immutable published source selection for local and CI qualification of new dealer packs.',
    findings: ['The approved lock selects the October 15 sources; the selected October 19 subtrees include subsequent data, navigation and runtime fixes.',
      'This candidate reuses the existing adapters and exact approved release evidence as ancestry.',
      'Build, route, identity, logo and size checks are per-dealer CI evidence. Native and hosted template approval are not inferred from those checks.'],
    nativeApproval: false, hostedApproval: false, globalReleaseApproval: false, existingDealerChanges: false};
  const reviewBytes = Buffer.from(JSON.stringify(review, null, 2) + '\n');
  const sourceDeltaReview = {reference, sha256: sha256(reviewBytes), reviewedAt}, id = 'dealer-pack-' + commit.slice(0, 7) + '-' + reviewedAt.slice(0, 10).replaceAll('-', '');
  const lock = {schemaVersion: 1, exportPolicy: POLICY, purpose: 'New dealer-pack source qualification only; existing clients retain templates.lock.json.', templates: {}};
  for (const {key, source} of inspected) {
    const parent = prior.templates[key];
    if (parent.status !== 'approved' || !parent.qa?.evidence) throw Error('Keep an exact approved source QA parent for ' + key);
    const {qa, ...base} = parent;
    lock.templates[key] = {...base, status: 'qualification', repository: source.repository, commit, source, snapshotPath: source.path, digest: source.digest,
      reason: 'Exact source candidate for new dealer packs; approval remains false.',
      qualification: {contextId: id, sourceDeltaReview,
        sourceQA: {approvedRelease: parent, releaseSha256: sha256(JSON.stringify(parent)), reference: qa.evidence, sha256: sha256(fs.readFileSync(path.join(root, qa.evidence))), verifiedAt: qa.verifiedAt},
        catalogs: qa.nativeLocalization?.catalogs ?? []}};
  }
  const lockBytes = Buffer.from(JSON.stringify(lock, null, 2) + '\n');
  const context = {schemaVersion: 1, kind: 'cars-native-source-qualification-context', id, scope: 'new-dealer-source-proposal', reviewed: true, reviewedAt,
    sourceCommit: commit, nativeApproval: false, hostedApproval: false, globalReleaseApproval: false,
    approvedLockSha256: sha256(priorBytes), candidateLockSha256: sha256(lockBytes), sourceDeltaReview};
  if (write) {
    for (const [name, bytes] of [[reference, reviewBytes], [PACK_LOCK, lockBytes]]) {
      const file = path.join(root, name); fs.mkdirSync(path.dirname(file), {recursive: true});
      if (fs.existsSync(file) && !fs.readFileSync(file).equals(bytes)) throw Error('Retain the existing candidate lock/review; use an explicit subsequent review');
      fs.writeFileSync(file, bytes);
    }
  }
  return {lock, context, inspected, write, providerWrites: false};
}

if (isEntrypoint(import.meta.url)) {
  const options = args(process.argv.slice(2), ['commit', 'reviewed-at'], ['write']);
  try {const {lock, ...report} = qualifyDealerPackRelease({commit: options.commit, reviewedAt: options['reviewed-at'], write: Boolean(options.write)}); console.log(JSON.stringify(report, null, 2));}
  catch (error) {console.error(error.stack); process.exitCode = 1;}
}
