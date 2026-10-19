// Additive input contract for unpublished dealer packs. Existing fleet release
// receipts keep their original meaning and are never manufactured for a pack.
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
