#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, sha256, inside, args} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {readPackFiles, reviewedPackInputRows, encodePackJson} from './lib/dealer-pack.mjs';
import {loadPreparedDealerPack, readPackBranding} from './prepare-dealer-pack-logo.mjs';
import {validateNewSourceCopyReview} from './prepare-new-dealer-source.mjs';

const assert = (ok, message) => {if (!ok) throw Error(message);};

/** The only automatic transition to reviewed:true records its machine-only scope and exact input bytes. */
export async function reviewDealerPack({root = ROOT, slug, batch, toolPackage, allowBenchmark = false, now = new Date().toISOString()} = {}) {
  assert(Number.isFinite(Date.parse(now)), 'Use a real input-review execution timestamp');
  const pack = await loadPreparedDealerPack(root, slug, {batch, toolPackage, allowBenchmark, allowUnreviewed: true});
  assert(pack.manifest.pack?.schemaVersion === 2, 'Migrate the pack before using automated v2 input review');
  readPackBranding(pack);
  const directory = pack.directory, files = readPackFiles(directory), identity = JSON.parse(files.get('identity-review.json')),
    qualification = JSON.parse(files.get('qualification.json')), copy = JSON.parse(files.get('copy-review.json'));
  const checkedCopy = {...copy, reviewed: true, reviewedAt: now};
  validateNewSourceCopyReview(checkedCopy, {...pack.manifest, inputs: {stock: {sha256: sha256(files.get('stock.json'))}}}, pack.stock);
  const reviewKind = {kind: 'automated', humanReview: false, dealerApproval: false};
  const updates = new Map([
    ['identity-review.json', {...identity, reviewed: true, reviewedAt: now, review: reviewKind,
      method: 'Automated exact registry/pack identity, canonical hosting and batch comparison; retained public source fields were structurally checked, not human-approved.'}],
    ['qualification.json', {...qualification, reviewed: true, reviewedAt: now, review: reviewKind}],
    ['copy-review.json', checkedCopy],
  ].map(([name, value]) => [name, encodePackJson(value)]));
  for (const [name, bytes] of updates) files.set(name, bytes);
  const review = {schemaVersion: 1, kind: 'cars-dealer-pack-input-review', dealer: slug, reviewed: true, reviewedAt: now, review: reviewKind,
    checks: ['canonical-hosting-and-preserved-fleet-collisions', 'assigned-expansion-lead', 'public-fact-schema-and-price-omission', 'personal-contact-screen',
      'retained-stock-media', 'companion-copy-source-binding', 'immutable-template-release-and-native-QA-parent', 'reviewed-artwork-provenance-and-regenerated-logo-hashes'],
    sourceArtworkReview: 'Retained artwork review is separate provenance; this command does not perform visual, Arabic-expert or dealer approval.',
    copyReview: 'Automated structure, stock hash, source text and complete EN/BG rows; no new human translation approval is inferred.',
    contacts: pack.contacts, batch: pack.batch, releaseId: pack.release.releaseId, inputs: reviewedPackInputRows(files),
    nativeApproval: false, hostedApproval: false, providerWrites: 0};
  // Complete every check before changing any flag. An interrupted write cannot pass the input inventory.
  for (const [name, bytes] of updates) fs.writeFileSync(inside(directory, name), bytes);
  fs.writeFileSync(path.join(directory, 'input-review.json'), encodePackJson(review));
  return {dealer: slug, success: true, reviewKind: 'automated', humanReview: false, providerWrites: 0, releaseId: pack.release.releaseId,
    files: files.size + (files.has('input-review.json') ? 0 : 1), report: 'dealers/' + slug + '/input-review.json'};
}

if (isEntrypoint(import.meta.url)) {
  const options = args(process.argv.slice(2), ['slug', 'batch', 'tool-package']);
  reviewDealerPack({slug: options.slug, batch: options.batch, toolPackage: options['tool-package']})
    .then(value => console.log(JSON.stringify(value, null, 2))).catch(error => {console.error(error.message); process.exitCode = 1;});
}
