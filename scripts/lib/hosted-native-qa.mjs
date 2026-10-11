import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { validateFileInventory, verifyInventoryBytes } from './uk-cloudflare-artifacts.mjs';
import { validateCurrentSingletonTarget } from '../deploy-dealer-single-worker.mjs';
import { parseCatalogJson } from './native-localization.mjs';

export const HOSTED_QA_PROFILE = 'cars-priselci-native-readonly';
export const HOSTED_QA_ORIGIN = 'https://cars-priselci.darkapoparka1.workers.dev';
export const HOSTED_QA_ACCOUNT = 'cb0007f242077bd759331f096eb75531';
export const TEMPLATE_REVISION = '32ac4ebcbafff38df6306e9919ce6113b2d10503';
export const REQUEST_DIRECTORY = 'docs/releases/cloudflare-existing25-20261011/hosted-native-qa';
export const REQUEST_BASENAME = 'priselci-request.json';
export const FAMILIES = Object.freeze({ 'auto-best': '', modern: '/variant-2', import: '/variant-3' });
export const APPLICATIONS = Object.freeze(['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best']);
export const IMPORT_GREP = '^(preferences save dismiss reload and focus (320|390|1440)|stale save cannot navigate after close and reopen|no JavaScript preferences and contact are native forms|explicit URL works with blocked storage and conflicting preferences|language/country and cookies cannot leak between requests)$';
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const canonical = value => JSON.stringify(value, (_, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const commit = value => /^[a-f0-9]{40}$/.test(value ?? '');
const hash = value => /^[a-f0-9]{64}$/.test(value ?? '');
const uuid = value => /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(value ?? '');
const positive = value => Number.isSafeInteger(value) && value > 0;
const same = (left, right, label) => assert.equal(canonical(left), canonical(right), label);

export function physicalFile(root, relative, maxBytes = 8 * 1024 ** 2) {
  assert(typeof relative === 'string' && relative && !path.isAbsolute(relative) && !relative.includes('\\') &&
    relative.split('/').every(part => part && part !== '.' && part !== '..'), 'Unsafe proof path');
  const canonicalRoot = fs.realpathSync(root), file = path.resolve(canonicalRoot, relative), within = path.relative(canonicalRoot, file);
  assert(within && !within.startsWith('..') && !path.isAbsolute(within), 'Proof escaped its root');
  assert.equal(fs.realpathSync(file), file, 'Proof must be physical without links');
  const stat = fs.statSync(file);
  assert(stat.isFile() && stat.size > 0 && stat.size <= maxBytes, 'Proof exceeds its bounded file limit');
  return file;
}

export function validateRequest(request) {
  const fields = ['schemaVersion', 'type', 'client', 'workerName', 'publicOrigin', 'accountId', 'sourceCommit', 'sourceTree',
    'inputDigest', 'sourceReleases', 'artifactDigest', 'outputDigest', 'buildRunId', 'buildAttempt', 'artifactId',
    'artifactArchiveDigest', 'versionId', 'deploymentId', 'proofs'];
  same(Object.keys(request ?? {}).sort(), fields.sort(), 'Unexpected or missing QA request fields');
  assert(request.schemaVersion === 1 && request.type === 'cars-existing-fleet-hosted-native-qa-request', 'Unsupported QA request');
  assert(request.client === 'priselci' && request.workerName === 'cars-priselci' && request.publicOrigin === HOSTED_QA_ORIGIN,
    'Only the reviewed Priselci origin and Worker are authorized');
  assert(request.accountId === HOSTED_QA_ACCOUNT && commit(request.sourceCommit) && commit(request.sourceTree), 'Invalid immutable source/account pins');
  assert(['inputDigest', 'artifactDigest', 'outputDigest', 'artifactArchiveDigest'].every(key => hash(request[key])), 'Missing immutable digest pins');
  assert(['buildRunId', 'buildAttempt', 'artifactId'].every(key => positive(request[key])) && uuid(request.versionId) && uuid(request.deploymentId), 'Invalid run or active version pins');
  same(Object.keys(request.sourceReleases ?? {}).sort(), [...APPLICATIONS].sort(), 'All six source releases are required');
  for (const key of APPLICATIONS) {
    const source = request.sourceReleases[key];
    same(Object.keys(source ?? {}).sort(), ['digest', 'path', 'repository', 'revision', 'tree'], 'Invalid source locator fields');
    assert(source.repository === 'darkapoparka/cars' && source.path === 'templates/' + key && source.revision === TEMPLATE_REVISION &&
      commit(source.tree) && hash(source.digest), 'The reviewed S1 template release must remain immutable');
  }
  const names = ['artifactManifest', 'singleWorkerReceipt', 'deploymentReceipt', 'providerSnapshot'];
  same(Object.keys(request.proofs ?? {}).sort(), [...names].sort(), 'Four original input proofs are required');
  const refs = names.map(name => request.proofs[name]);
  assert(new Set(refs.map(ref => ref?.reference)).size === names.length, 'Proof references must be distinct');
  for (const ref of refs) {
    same(Object.keys(ref ?? {}).sort(), ['reference', 'sha256'], 'Invalid proof reference fields');
    assert(typeof ref.reference === 'string' && ref.reference.startsWith('docs/releases/') && ref.reference.endsWith('.json') && hash(ref.sha256), 'Invalid hashed release proof');
  }
  return request;
}

export function readRequest(root, basename, expectedSha256) {
  assert.equal(basename, REQUEST_BASENAME, 'Only the reviewed request basename is accepted');
  assert(hash(expectedSha256), 'Expected request SHA256 is required');
  const file = physicalFile(root, REQUEST_DIRECTORY + '/' + basename, 64 * 1024), bytes = fs.readFileSync(file);
  assert.equal(sha256(bytes), expectedSha256, 'QA request bytes changed');
  return { file, bytes, request: validateRequest(parseCatalogJson(bytes.toString('utf8'))) };
}

export function validateOriginalProofs(root, request, { fresh = true } = {}) {
  validateRequest(request);
  const proofs = Object.fromEntries(Object.entries(request.proofs).map(([name, ref]) => {
    const file = physicalFile(root, ref.reference), bytes = fs.readFileSync(file);
    assert.equal(sha256(bytes), ref.sha256, 'Original proof bytes changed: ' + name);
    return [name, { file, bytes, value: parseCatalogJson(bytes.toString('utf8')) }];
  }));
  const inventory = proofs.artifactManifest.value, composer = proofs.singleWorkerReceipt.value,
    deployed = proofs.deploymentReceipt.value, snapshot = proofs.providerSnapshot.value;
  validateFileInventory(inventory);
  assert(inventory.kind === 'existing-fleet-cloudflare-single-worker' && inventory.status === 'passed' &&
    inventory.dealer === request.client && inventory.digest === request.artifactDigest, 'Original artifact inventory differs');
  verifyInventoryBytes(inventory, 'single-worker-receipt.json', proofs.singleWorkerReceipt.bytes);
  assert(composer.schemaVersion === 1 && composer.type === 'cars-existing-fleet-single-worker-provider-package' &&
    composer.dealer === request.client && composer.hostedVerified === false && composer.sourceApplicationBytesChanged === false &&
    composer.compiledApplicationBytesChanged === true && composer.workerCount === 1 && composer.applicationCount === 6, 'Invalid original composer receipt');
  same(composer.composition, { inProcess: APPLICATIONS, serviceBindings: [] }, 'Singleton composition differs');
  same(composer.frameworkGlobalScopes, ['modern', 'app', 'mobile'], 'Framework scopes differ');
  same(Object.keys(composer.artifacts ?? {}).sort(), [...APPLICATIONS, 'router'].sort(), 'Seven compiled input pins required');
  assert(Object.values(composer.artifacts).every(pin => hash(pin.digest) && hash(pin.compiledDigest)), 'Invalid compiled input digest');
  assert(Array.isArray(composer.files) && sha256(JSON.stringify(composer.files)) === request.outputDigest, 'Composer output digest differs');
  same(inventory.files.filter(row => !['single-worker-receipt.json', 'dealer-composition-review.json', 'delivery-receipt.json'].includes(row.path)), composer.files, 'Composer payload inventory differs');
  assert(composer.files.every(row => row.path === 'wrangler.json' || row.path.startsWith('server/') || row.path.startsWith('public/')), 'Unexpected payload scope');
  assert(deployed.schemaVersion === 1 && deployed.type === 'cars-existing-fleet-single-worker-deployment' && deployed.status === 'deployed' &&
    deployed.client === request.client && deployed.deployments === 1 && deployed.workerCount === 1 && deployed.applicationCount === 6 &&
    deployed.hostedVerified === false && deployed.ownerAccepted === false && deployed.deploymentMode === 'update-existing' &&
    Number.isFinite(Date.parse(deployed.finishedAt)) && deployed.rollback?.versionId !== deployed.versionId, 'Original deployment completion differs');
  const common = ['accountId', 'workerName', 'publicOrigin', 'sourceCommit', 'sourceTree', 'inputDigest', 'sourceReleases', 'outputDigest'];
  for (const original of [composer, deployed]) for (const name of common) same(original[name], request[name], 'Original identity differs: ' + name);
  for (const name of ['artifactDigest', 'versionId', 'deploymentId']) same(deployed[name], request[name], 'Active deployment pin differs: ' + name);
  for (const original of [composer, deployed]) {
    assert(Number(original.runId) === request.buildRunId && Number(original.attempt) === request.buildAttempt, 'Build attempt differs');
    same(original.serviceBindings ?? original.composition?.serviceBindings, [], 'Service bindings are prohibited');
  }
  const publication = deployed.sourcePublication;
  assert(publication?.repository === 'darkapoparka/cars' && publication.commit === request.sourceCommit && publication.sourceTree === request.sourceTree &&
    publication.ref === 'refs/heads/main' && commit(publication.verifiedMainCommit) && Number.isFinite(Date.parse(publication.publishedAt)), 'Source publication differs');
  if (fresh) validateCurrentSingletonTarget(snapshot, request.workerName, { after: true, versionId: request.versionId });
  assert(snapshot.evidence === 'authenticated-cloudflare-connector' && Number.isFinite(Date.parse(snapshot.checkedAt)) &&
    Date.parse(snapshot.checkedAt) >= Date.parse(deployed.finishedAt) && Date.parse(snapshot.checkedAt) <= Date.now(), 'Authenticated post-deployment snapshot required');
  for (const name of ['accountId', 'deploymentId']) same(snapshot[name], request[name], 'Provider identity differs: ' + name);
  same(snapshot.versionTraffic, [{ version_id: request.versionId, percentage: 100 }], 'Active version must have all traffic');
  same(snapshot.bindings, [{ type: 'assets', name: 'ASSETS' }], 'Only ASSETS is permitted');
  same(deployed.versionTraffic, snapshot.versionTraffic, 'Deployment traffic differs');
  same(deployed.liveBindings, snapshot.bindings, 'Deployment bindings differ');
  return proofs;
}

export function validateProviderAfter(request, before, after, qaFinishedAt) {
  assert(after?.evidence === 'authenticated-cloudflare-connector' && Date.parse(after.checkedAt) >= Date.parse(qaFinishedAt) &&
    Number.isFinite(Date.parse(qaFinishedAt)) && Date.parse(after.checkedAt) <= Date.now(), 'Authenticated snapshot after QA is required');
  validateCurrentSingletonTarget(after, request.workerName, { after: true, versionId: request.versionId });
  for (const name of ['accountId', 'deploymentId', 'versionTraffic', 'bindings']) same(after[name], before[name], 'Provider changed during QA: ' + name);
  return true;
}

export function readHostedProfile(family, env = process.env) {
  if (!env.CARS_HOSTED_QA_PROFILE) return null;
  assert.equal(env.CARS_HOSTED_QA_PROFILE, HOSTED_QA_PROFILE, 'Unknown hosted QA profile');
  assert(Object.hasOwn(FAMILIES, family) && path.isAbsolute(env.CARS_HOSTED_QA_PIN_FILE ?? '') && hash(env.CARS_HOSTED_QA_PIN_SHA256), 'Hashed runtime pin required');
  const file = path.resolve(env.CARS_HOSTED_QA_PIN_FILE), bytes = fs.readFileSync(file);
  assert(bytes.length > 0 && bytes.length <= 64 * 1024 && sha256(bytes) === env.CARS_HOSTED_QA_PIN_SHA256 && fs.realpathSync(file) === file, 'Runtime pin bytes or physical path differ');
  const pin = JSON.parse(bytes.toString('utf8'));
  assert(pin.schemaVersion === 1 && pin.type === 'cars-hosted-native-qa-runtime-pin' && pin.profile === HOSTED_QA_PROFILE &&
    pin.publicOrigin === HOSTED_QA_ORIGIN && pin.client === 'priselci' && pin.workerName === 'cars-priselci' && commit(pin.sourceCommit) &&
    commit(pin.sourceTree) && uuid(pin.versionId) && hash(pin.requestSha256) && hash(pin.artifactDigest) && hash(pin.outputDigest), 'Invalid validated runtime identity');
  assert(path.isAbsolute(pin.outputRoot ?? '') && fs.realpathSync(pin.outputRoot) === path.resolve(pin.outputRoot), 'Physical QA output root required');
  const relative = path.relative(pin.outputRoot, file);
  assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'Runtime pin escaped output root');
  return { ...pin, family, mount: FAMILIES[family], output: path.join(pin.outputRoot, family) };
}

export function validateHelperTarget(pin, origin, mount, output) {
  if (!pin) return;
  assert.equal(new URL(origin).href, pin.publicOrigin + '/', 'Helper origin differs from validated pin');
  assert.equal(mount, pin.mount, 'Helper mount differs from validated pin');
  const relative = path.relative(pin.output, path.resolve(output));
  assert(!relative.startsWith('..') && !path.isAbsolute(relative), 'Helper output escaped family root');
}

export function requestDecision(method, target, pin, { preferences = true } = {}) {
  const url = new URL(target);
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return 'read';
  if (preferences && method === 'POST' && url.origin === pin.publicOrigin && url.pathname === pin.mount + '/api/preferences' && !url.search) return 'preference';
  if (method === 'POST' && url.hostname === 'maps.googleapis.com' && url.pathname.endsWith('/GetViewportInfo')) return 'blocked-third-party-read-rpc';
  return 'blocked-business-or-other-write';
}

export async function guardHostedContext(context, pin, { preferences = true } = {}) {
  const blocked = [];
  fs.mkdirSync(pin.output, { recursive: true });
  assert.equal(fs.realpathSync(pin.output), path.resolve(pin.output), 'Boundary output must be physical without links');
  const file = path.join(pin.output, 'network-boundary.jsonl');
  if (fs.existsSync(file)) assert(fs.lstatSync(file).isFile() && fs.realpathSync(file) === file, 'Unsafe boundary evidence file');
  await context.route('**/*', route => {
    const request = route.request(), decision = requestDecision(request.method(), request.url(), pin, { preferences });
    if (decision.startsWith('blocked-')) {
      const url = new URL(request.url()), entry = { method: request.method(), url: url.origin + url.pathname, decision };
      blocked.push(entry); fs.appendFileSync(file, JSON.stringify(entry) + '\n');
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });
  return blocked;
}

export function assertBoundary(blocked) {
  assert.deepEqual(blocked.filter(entry => entry.decision !== 'blocked-third-party-read-rpc'), [], 'A prohibited write was attempted and blocked');
}

export function parseHelperResults(kind, value) {
  if (kind === 'import') {
    assert(!value.errors?.length, 'Playwright runner reported an error');
    const specs = [];
    const walk = suite => { for (const spec of suite.specs ?? []) specs.push(spec); for (const child of suite.suites ?? []) walk(child); };
    for (const suite of value.suites ?? []) walk(suite);
    assert(specs.length === 7 && new Set(specs.map(spec => spec.title)).size === 7 && specs.every(spec => new RegExp(IMPORT_GREP).test(spec.title)), 'Missing or unexpected Import test selection');
    return specs.map(spec => {
      assert(spec.tests?.length === 1 && spec.tests[0].results?.length === 1, 'Retries or duplicate projects are prohibited');
      const test = spec.tests[0], result = test.results[0];
      return { name: spec.title, passed: spec.ok === true && test.status === 'expected' && result.status === 'passed', status: result.status, errors: result.errors ?? [], durationMs: result.duration };
    });
  }
  assert(Array.isArray(value.results), 'Original helper results missing');
  const count = kind === 'auto-best-storage' ? 18 : kind === 'auto-best-races' ? 8 : kind === 'modern' ? 22 : 0;
  assert(count && value.results.length === count, 'Required helper cases missing');
  const entries = value.results.map(entry => ({ ...entry, passed: kind === 'modern' ? entry.ok === true && !entry.skipped : entry.pass === true }));
  const names = entries.map(entry => kind === 'modern' ? `${entry.name}/${entry.locale}/${entry.width}` : entry.name);
  assert(new Set(names).size === count, 'Duplicate helper cases cannot replace required coverage');
  if (kind === 'auto-best-storage') for (const locale of ['en', 'bg']) for (const width of [320,390,1440]) for (const mode of ['storage-unavailable', 'cookies-and-storage-unavailable', 'no-javascript'])
    assert(names.includes(`auto-best ${locale} ${width} ${mode}`), 'Required Auto Best mode/locale/width missing');
  if (kind === 'auto-best-races') for (const locale of ['en', 'bg']) for (const scenario of ['cancel-pending-save', 'immediate-dismiss', 'reject-external-destination', 'reopen-pending-dismiss'])
    assert(names.includes(`auto-best ${locale} ${scenario}`), 'Required Auto Best race missing');
  if (kind === 'modern') {
    for (const locale of ['en', 'bg']) for (const width of [320,390,1440]) for (const name of ['client preference save, reload, manual reopen and keyboard', 'dismissal never accepts an unsaved locale or country', 'rapid close/reopen cancels stale save and clears busy state'])
      assert(names.includes(`${name}/${locale}/${width}`), 'Required Modern preference case missing');
    for (const locale of ['en', 'bg']) {
      const noJs = entries.find(entry => entry.name === 'no-JS native preference form preserves the return route' && entry.locale === locale && entry.width === 390);
      assert(noJs, 'Required Modern no-JS case missing');
      if (noJs.passed) assert(noJs.details?.endpoint === 'live preference POST/303; actual native form/navigation without JS' && noJs.details.responses?.some(response => response.status === 303), 'Modern mocked 303 cannot count as live no-JS evidence');
      assert(names.includes(`explicit URLs work with unavailable storage and rejected cookies/${locale}/320`), 'Required Modern storage case missing');
    }
  }
  return entries;
}
