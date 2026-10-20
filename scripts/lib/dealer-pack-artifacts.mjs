// Additive input contract for unpublished dealer packs. Existing fleet release
// receipts keep their original meaning and are never manufactured for a pack.
import {createHash} from 'node:crypto';
import {UK_FAMILY_NODES} from './uk-cloudflare-artifacts.mjs';
export const DEALER_PACK_COMPILED_KIND = 'dealer-pack-cloudflare-compiled-candidate';
export const DEALER_PACK_BUNDLE_KIND = 'cars-dealer-pack-single-worker-provider-package';
export const PACK_FAMILIES = Object.freeze(['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best']);
export const PACK_TARGETS = Object.freeze([...PACK_FAMILIES, 'router']);
export const canonicalPackJson = value => JSON.stringify(value, (_key, entry) =>
  entry && typeof entry === 'object' && !Array.isArray(entry)
    ? Object.fromEntries(Object.keys(entry).sort().map(key => [key, entry[key]])) : entry);
const assert = (condition, message) => { if (!condition) throw Error(message); };
const hex40 = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const hex64 = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const same = (a, b) => canonicalPackJson(a) === canonicalPackJson(b);

export function validatePackExecution(execution) {
  assert(execution && typeof execution === 'object', 'Dealer pack execution identity is missing');
  if (execution.kind === 'local') {
    assert(same(Object.keys(execution).sort(), ['id', 'kind']) &&
      /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}$/.test(execution.id ?? ''),
    'Dealer pack local execution identity is invalid');
  } else {
    assert(same(Object.keys(execution).sort(), ['attempt', 'event', 'kind', 'repository', 'runId', 'workflowRef']) &&
      execution.kind === 'github-actions' && execution.repository === 'darkapoparka/cars' &&
      ['pull_request', 'workflow_dispatch', 'push'].includes(execution.event) &&
      /^[1-9][0-9]*$/.test(String(execution.runId ?? '')) &&
      /^[1-9][0-9]*$/.test(String(execution.attempt ?? '')) &&
      typeof execution.workflowRef === 'string' &&
      /^darkapoparka\/cars\/\.github\/workflows\/dealer-pack-pipeline\.yml@refs\//.test(execution.workflowRef),
    'Dealer pack GitHub execution identity is invalid');
  }
  return execution;
}

export function validatePackSourceReleases(releases) {
  assert(releases && same(Object.keys(releases).sort(), [...PACK_FAMILIES].sort()),
    'Dealer pack requires six exact template releases');
  for (const key of PACK_FAMILIES) {
    const value = releases[key];
    assert(value && value.repository === 'darkapoparka/cars' && value.path === 'templates/' + key &&
      hex40(value.revision) && hex40(value.tree) && hex64(value.digest), 'Dealer pack template source is invalid: ' + key);
  }
  return releases;
}

export const PACK_IDENTITY_FIELDS = Object.freeze([
  'sourceCommit', 'sourceDigest', 'sourceReleases', 'packDigest', 'releaseDigest',
  'toolDigest', 'execution', 'publicOrigin', 'providerOrigin', 'capacityPlan', 'qualification',
]);
export const PACK_CONTENT_IDENTITY_FIELDS = Object.freeze(PACK_IDENTITY_FIELDS.filter(field => field !== 'execution'));

/** Every family keeps its original compile event. A new composition event may
 * reuse only artifacts whose entire factual/source/tool identity is identical. */
export function createDealerPackComposition({dealer, execution, inspected}) {
  validatePackExecution(execution);
  assert(typeof dealer === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(dealer) && inspected &&
    same(Object.keys(inspected).sort(), [...PACK_TARGETS].sort()), 'A pack composition requires exactly seven original artifacts');
  const reference = inspected.router.deploy;
  const identity = Object.fromEntries(PACK_CONTENT_IDENTITY_FIELDS.map(field => [field, reference[field]]));
  const members = {};
  for (const key of PACK_TARGETS) {
    const {inventory, deploy, build} = inspected[key];
    assert(inventory?.kind === DEALER_PACK_COMPILED_KIND && inventory.status === 'passed' && inventory.dealer === dealer && inventory.key === key && hex64(inventory.digest) &&
      deploy?.kind === DEALER_PACK_COMPILED_KIND && deploy.dealer === dealer && deploy.key === key && hex64(deploy.compiledDigest) &&
      PACK_CONTENT_IDENTITY_FIELDS.every(field => same(deploy[field], identity[field])), 'Mixed exact dealer-pack composition content: ' + key);
    validatePackExecution(deploy.execution);
    assert(build?.status === 'passed' && same(build.execution, deploy.execution) && /^v\d+\.\d+\.\d+$/.test(build.node ?? ''), 'Missing original native build event: ' + key);
    members[key] = {artifactDigest: inventory.digest, compiledDigest: deploy.compiledDigest, execution: deploy.execution, node: build.node};
  }
  return validateDealerPackComposition(structuredClone({schemaVersion: 1, kind: 'cars-dealer-pack-compiled-composition', dealer, identity, execution, members,
    originalArtifactsChanged: false, providerWrites: false}));
}

/** Validate receipt provenance even when native artifacts are no longer local. */
export function validateDealerPackComposition(proof, {dealer, identity, artifacts} = {}) {
  assert(proof?.schemaVersion === 1 && proof.kind === 'cars-dealer-pack-compiled-composition' &&
    same(Object.keys(proof).sort(), ['schemaVersion', 'kind', 'dealer', 'identity', 'execution', 'members', 'originalArtifactsChanged', 'providerWrites'].sort()) &&
    typeof proof.dealer === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(proof.dealer) && (!dealer || proof.dealer === dealer) &&
    proof.originalArtifactsChanged === false && proof.providerWrites === false, 'Invalid dealer-pack composition provenance');
  const value = proof.identity;
  assert(value && same(Object.keys(value).sort(), [...PACK_CONTENT_IDENTITY_FIELDS].sort()) && hex40(value.sourceCommit) &&
    ['sourceDigest', 'packDigest', 'releaseDigest', 'toolDigest'].every(field => hex64(value[field])) && ['free', 'paid'].includes(value.capacityPlan) &&
    value.qualification?.hostedVerified === false && value.qualification.providerWrites === false &&
    typeof value.publicOrigin === 'string' && typeof value.providerOrigin === 'string', 'Invalid dealer-pack composition content identity');
  validatePackSourceReleases(value.sourceReleases); validatePackExecution(proof.execution);
  assert(proof.members && same(Object.keys(proof.members).sort(), [...PACK_TARGETS].sort()), 'Missing original dealer-pack composition members');
  for (const key of PACK_TARGETS) {
    const member = proof.members[key];
    assert(member && same(Object.keys(member).sort(), ['artifactDigest', 'compiledDigest', 'execution', 'node'].sort()) &&
      hex64(member.artifactDigest) && hex64(member.compiledDigest) && member.node === 'v' + UK_FAMILY_NODES[key], 'Invalid original dealer-pack composition member: ' + key);
    validatePackExecution(member.execution);
  }
  if (identity) assert(PACK_CONTENT_IDENTITY_FIELDS.every(field => same(identity[field], value[field])) && same(identity.execution, proof.execution), 'Dealer-pack composition differs from bundle identity');
  if (artifacts) {
    assert(same(Object.keys(artifacts).sort(), [...PACK_TARGETS].sort()), 'Dealer-pack composition artifact set differs');
    for (const key of PACK_TARGETS) assert(artifacts[key]?.digest === proof.members[key].artifactDigest && artifacts[key]?.compiledDigest === proof.members[key].compiledDigest, 'Dealer-pack composition artifact digest differs: ' + key);
  }
  return proof;
}

export function dealerPackCompositionDigest(proof) {
  validateDealerPackComposition(proof);
  return createHash('sha256').update(canonicalPackJson(proof)).digest('hex');
}

export function assertDealerPackComposition(proof, inspected) {
  assert(proof && same(proof, createDealerPackComposition({dealer: proof.dealer, execution: proof.execution, inspected})),
    'Dealer-pack composition provenance differs from its exact original artifacts');
  return proof;
}

export function validateDealerPackCompiled({deploy, source, build, key, expectedDealer}) {
  assert(deploy?.kind === DEALER_PACK_COMPILED_KIND && deploy.dealer === expectedDealer && deploy.key === key &&
    hex40(deploy.sourceCommit) && ['packDigest', 'releaseDigest', 'sourceDigest', 'toolDigest'].every(field => hex64(deploy[field])) &&
    deploy.hosted === false && deploy.credentialsIncluded === false && deploy.nativeApproval === false &&
    ['free', 'paid'].includes(deploy.capacityPlan) && deploy.qualification &&
    deploy.qualification.hostedVerified === false && deploy.qualification.providerWrites === false &&
    !['sourceTree', 'inputDigest', 'packageTree', 'packageDigest', 'payloadDigest', 'runId', 'attempt'].some(field => Object.hasOwn(deploy, field)),
  'Invalid dealer-pack compiled input: ' + key);
  validatePackExecution(deploy.execution);
  validatePackSourceReleases(deploy.sourceReleases);
  assert(source?.schemaVersion === 1 && source.kind === 'cars-dealer-pack-build-source' &&
    source.dealer === expectedDealer && source.key === key && source.originalPackUnchanged === true &&
    PACK_IDENTITY_FIELDS.every(field => same(source[field], deploy[field])), 'Dealer-pack source receipt differs: ' + key);
  assert(build?.schemaVersion === 1 && build.kind === 'cars-dealer-pack-family-build' &&
    build.status === 'passed' && build.dealer === expectedDealer && build.key === key &&
    build.compiled === true && build.dryRun === true &&
    [...PACK_IDENTITY_FIELDS, 'workerName', 'compiledDigest'].every(field => same(build[field], deploy[field])),
  'Dealer-pack build receipt differs: ' + key);
  return deploy;
}
