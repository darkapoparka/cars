import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {scheduleDealerPackSource, dispatchDealerPackSource, dealerPackSourceBuildFingerprint, inspectSourcePackMaterial, createDealerPackTerminalIntake, runDealerPackSourceScheduler} from './schedule-dealer-pack-source.mjs';
import {buildPackBatchAssignments} from './lib/dealer-pack-identity.mjs';
import {PACK_QUEUE_REPOSITORY, PACK_DEPLOY_ACCOUNT, PACK_DEPLOY_ZONE, createPackDeploymentQueue, packDeploymentRequest, queueDigest} from './lib/dealer-pack-queue.mjs';

const at = '2026-10-21T00:00:00.000Z', sourceSha = 'a'.repeat(40), buildFingerprint = queueDigest('shared-source');
const assignment = buildPackBatchAssignments({priorityResearchIds: Array.from({length: 400}, (_, n) => 'gb-dealer-' + String(n).padStart(3, '0'))});
const ids = assignment.batches.flatMap(row => row.leadIds), packDigest = n => queueDigest('pack-' + n);
const policy = {schemaVersion: 1, kind: 'cars-owner-authorized-pack-deployment', accountId: PACK_DEPLOY_ACCOUNT, zoneId: PACK_DEPLOY_ZONE,
  zoneName: 'webpreviews.site', workersPlan: 'paid', allowedScripts: 500, minimumSpareScripts: 0, ownerConfirmedPaid: true, allowNewPreviews: true,
  outreachApproved: false, authorizedAt: at, authorizationSource: 'Owner authorized canonical400 source preparation and qualified previews',
  reason: 'Preserve the100 protected fleet and all strict per-dealer source/provider/hosted gates.', maximumNewDealers: 400};
function memoryStore() {
  let state = null, revision = 0, writes = 0;
  return {async read() {await Promise.resolve(); return {state: structuredClone(state), revision: String(revision)};},
    async compareAndSwap(expected, next) {await Promise.resolve(); if (expected !== String(revision)) return false; state = structuredClone(next); writes++; return String(++revision);},
    get state() {return structuredClone(state);}, get writes() {return writes;}};
}
function nativeRun(reservation, {id = 456, status = 'in_progress', conclusion = null} = {}) {
  return {id, path: '.github/workflows/dealer-pack-pipeline.yml', repository: {full_name: PACK_QUEUE_REPOSITORY}, head_repository: {full_name: PACK_QUEUE_REPOSITORY},
    head_branch: 'main', event: 'workflow_dispatch', head_sha: reservation.sourceSha, run_attempt: 1, display_title: 'Cars rollout ' + reservation.id,
    created_at: at, status, conclusion};
}
function fixture({available = 20, retained = 0} = {}) {
  const store = memoryStore(), checked = [], posts = [], state = {main: sourceSha, visible: true, runStatus: 'in_progress', conclusion: null, active: [], externalCompleted: false, externalConclusion: 'success'};
  const queue = createPackDeploymentQueue({policy, now: at, queueId: '11111111-1111-4111-8111-111111111111', baseline: {
    accountId: PACK_DEPLOY_ACCOUNT, zoneId: PACK_DEPLOY_ZONE, evidence: 'authenticated-cloudflare-api', complete: true, observedAt: at,
    workerNames: ['cars-protected'], routes: [], domains: []}});
  const add = (n, status = 'queued') => {const slug = 'dealer-' + n, request = packDeploymentRequest({slug, dealerId: ids[n], batch: Math.floor(n / 100) + 1,
    workerName: 'cars-' + slug, publicOrigin: 'https://' + slug + '.webpreviews.site', packDigest: packDigest(n), releaseId: 'cars-six-test',
    releaseDigest: queueDigest('release'), outputDigest: queueDigest('output-' + n), sourceCommit: sourceSha});
    queue.order.push(request.id); queue.requests[request.id] = {request, status, queuedAt: at, events: []};};
  for (let n = 0; n < retained; n++) add(n);
  let nextNonce = 0;
  const options = {root: 'J:/unused-scheduler-fixture', assignment, sourceSha, buildFingerprint, store, queueStore: {async read() {return {state: structuredClone(queue)};}},
    owner: 'github:123', now: () => Date.parse(at), nonce: () => queueDigest('nonce-' + ++nextNonce),
    readGithub: async operation => {assert.equal(operation.method, 'GET'); assert.equal(operation.path, '/repos/' + PACK_QUEUE_REPOSITORY + '/git/ref/heads/main');
      return {status: 200, body: {ref: 'refs/heads/main', object: {type: 'commit', sha: state.main}}};},
    listPacks: () => Array.from({length: available}, (_, n) => ({slug: 'dealer-' + n, dealerId: ids[n], valid: true})),
    readQualification: () => ({reviewed: true}), inspectMaterial: ({slug}) => ({packDigest: packDigest(Number(slug.slice(7)))}),
    validateReadyPack: async ({slug}) => {checked.push(slug); return {success: true, packDigest: packDigest(Number(slug.slice(7))), benchmarkOnly: false};},
    discover: async ({reservation, externalRuns = []}) => ({unknownActive: state.active.length > 0, activeRuns: state.active,
      needsReconciliation: Boolean(reservation && !state.visible), reservationRun: reservation && state.visible ? nativeRun(reservation, {
        id: 456 + Object.keys(store.state.reservations).indexOf(reservation.id), status: state.runStatus, conclusion: state.conclusion}) : null,
      externalRunStatuses: externalRuns.map(row => ({...row, needsReconciliation: false, run: {...nativeRun({id: queueDigest('external'), sourceSha: row.sourceSha},
        {id: row.runId, status: state.externalCompleted ? 'completed' : 'in_progress', conclusion: state.externalCompleted ? state.externalConclusion : null}), display_title: 'Legacy owner-selected source'}})), reasons: []}),
    dispatch: async value => {assert.equal(store.state.activeReservationId, value.rolloutRequestId); assert.equal(store.state.reservations[value.rolloutRequestId].dispatchIntent, true);
      posts.push(value); return {httpStatus: 204};}};
  return {options, store, checked, posts, state, queue, add};
}

test('canonical400 registers once, keeps unreviewed/missing targets, and never manufactures deployment requests', async () => {
  const f = fixture({available: 2}), before = structuredClone(f.queue); f.options.readQualification = () => ({reviewed: false});
  const first = await scheduleDealerPackSource(f.options), writes = f.store.writes;
  assert.equal(first.targets, 400); assert.equal(first.status, 'waiting-inputs'); assert.equal(f.store.state.order.length, 400);
  assert.deepEqual(f.store.state.order, ids); assert.equal(f.posts.length, 0); assert.equal(f.checked.length, 0); assert.deepEqual(f.queue, before);
  await scheduleDealerPackSource(f.options); assert.equal(f.store.writes, writes); assert.equal(f.store.state.sourceEnvelope.initialSourceSha, sourceSha);
});

test('an explicit active source hold overrides stale reviewed flags before material checks while ready siblings continue', async () => {
  for (const heldQualification of [
    {reviewed: true, sourceHold: {active: true, reason: 'Required artwork is explicitly held after pixel review'}},
    {reviewed: false, sourceHold: {active: true, reason: 'Required artwork is explicitly held after pixel review'}},
    {reviewed: true, sourceHold: {active: 'true', reason: 'Malformed active flag'}},
    {reviewed: true, sourceHold: {active: 'false', reason: 'Malformed inactive flag'}},
    {reviewed: true, sourceHold: {active: true, reason: '   '}},
    {reviewed: true, sourceHold: null},
    {reviewed: true, sourceHold: []},
  ]) {
    const f = fixture({available: 2}), inspected = [];
    f.options.readQualification = ({slug}) => slug === 'dealer-0' ? heldQualification : {reviewed: true};
    f.options.inspectMaterial = ({slug}) => {inspected.push(slug); return {packDigest: packDigest(Number(slug.slice(7)))};};
    const result = await scheduleDealerPackSource(f.options);
    assert.equal(result.dispatches, 1); assert.deepEqual(f.posts[0].slugs, ['dealer-1']);
    assert.deepEqual(inspected, ['dealer-1']); assert.deepEqual(f.checked, ['dealer-1']);
    assert.equal(result.selected.some(row => row.slug === 'dealer-0'), false);
    assert(result.observations.some(row => row.dealerId === ids[0] && /Explicit source hold is active|verification is held/.test(row.reason)));
    assert.equal(f.store.state.targets[ids[0]].materials.length, 0);
  }
  const resolved = fixture({available: 1});
  resolved.options.readQualification = () => ({reviewed: true, sourceHold: {active: false, reason: 'Explicitly resolved in reviewed source'}});
  assert.equal((await scheduleDealerPackSource(resolved.options)).dispatches, 1); assert.deepEqual(resolved.posts[0].slugs, ['dealer-0']);
});

test('the actual CLI requires explicit register-all once and an absent normal drain performs no CAS or dispatch', async t => {
  t.mock.method(console, 'log', () => {});
  const f = fixture({available: 1}), dependencies = {...f.options, env: {GITHUB_RUN_ID: '123'}};
  const absent = await runDealerPackSourceScheduler([], dependencies);
  assert.equal(absent.status, 'not-registered'); assert.equal(f.store.writes, 0); assert.equal(f.posts.length, 0); assert.equal(f.checked.length, 0);
  const registered = await runDealerPackSourceScheduler(['--register-all'], dependencies);
  assert.equal(registered.targets, 400); assert.equal(f.posts.length, 1);
  const continued = await runDealerPackSourceScheduler([], dependencies); assert.equal(continued.status, 'building'); assert.equal(f.posts.length, 1);
});

test('production readiness uses the deploy workflow stable tool package environment', async t => {
  const previous = process.env.CARS_DEALER_PACK_TOOL_PACKAGE;
  t.after(() => {if (previous === undefined) delete process.env.CARS_DEALER_PACK_TOOL_PACKAGE; else process.env.CARS_DEALER_PACK_TOOL_PACKAGE = previous;});
  const toolPackage = 'J:/reviewed-source/runtime/dealer-pack-deploy-tools/package.json'; process.env.CARS_DEALER_PACK_TOOL_PACKAGE = toolPackage;
  const f = fixture({available: 1}); f.options.validateReadyPack = async options => {assert.equal(options.toolPackage, toolPackage); return {success: true, packDigest: packDigest(0)};};
  const result = await scheduleDealerPackSource(f.options); assert.equal(result.dispatches, 1); assert.equal(result.status, 'building');
});

test('at most14 exact reviewed inputs dispatch once only after their reservation is durably persisted', async () => {
  const f = fixture(), result = await scheduleDealerPackSource(f.options);
  assert.equal(result.dispatches, 1); assert.equal(result.status, 'building'); assert.equal(result.selected.length, 14);
  assert.deepEqual(f.checked, Array.from({length: 14}, (_, n) => 'dealer-' + n));
  assert.deepEqual(f.posts[0].slugs, f.checked); assert.equal(f.posts[0].sourceSha, sourceSha);
  const again = await scheduleDealerPackSource(f.options); assert.equal(again.dispatches, 0); assert.equal(f.posts.length, 1);
});

test('two scheduler CAS racers cannot dispatch the same or a second source cohort', async () => {
  const f = fixture(), results = await Promise.all([scheduleDealerPackSource(f.options), scheduleDealerPackSource({...f.options, owner: 'github:124'})]);
  assert.equal(f.posts.length, 1); assert.equal(results.reduce((sum, row) => sum + row.dispatches, 0), 1);
  assert.equal(Object.keys(f.store.state.reservations).length, 1); assert.equal(f.store.state.reservations[f.store.state.activeReservationId].selections.length, 14);
});

test('unknown POST and empty204 visibility preserve one intent and never retry before positive nonce reconciliation', async () => {
  const f = fixture({available: 1}); f.state.visible = false; f.options.dispatch = async value => {f.posts.push(value); throw Error('Lost response after POST');};
  assert.equal((await scheduleDealerPackSource(f.options)).status, 'needs-reconciliation');
  const id = f.store.state.activeReservationId; assert.equal(f.store.state.reservations[id].dispatchIntent, true);
  await scheduleDealerPackSource(f.options); assert.equal(f.posts.length, 1);
  f.state.visible = true; assert.equal((await scheduleDealerPackSource(f.options)).status, 'building'); assert.equal(f.posts.length, 1);
  const g = fixture({available: 1}); g.state.visible = false;
  assert.equal((await scheduleDealerPackSource(g.options)).status, 'needs-reconciliation'); await scheduleDealerPackSource(g.options); assert.equal(g.posts.length, 1);
});

test('known failed material is held across unrelated main commits and only changed pack/build material is eligible again', async () => {
  const f = fixture({available: 1}); f.state.runStatus = 'completed'; f.state.conclusion = 'failure';
  await scheduleDealerPackSource(f.options); assert.equal(f.store.state.activeReservationId, null); assert.equal(f.store.state.targets[ids[0]].status, 'held');
  f.state.main = 'b'.repeat(40); f.options.sourceSha = f.state.main;
  await scheduleDealerPackSource(f.options); assert.equal(f.posts.length, 1);
  f.options.inspectMaterial = () => ({packDigest: queueDigest('changed-pack')});
  f.options.validateReadyPack = async () => ({success: true, packDigest: queueDigest('changed-pack')});
  await scheduleDealerPackSource(f.options); assert.equal(f.posts.length, 2);
  f.options.buildFingerprint = queueDigest('changed-build'); await scheduleDealerPackSource(f.options); assert.equal(f.posts.length, 3);
});

test('queue retained statuses are excluded and current24 legacy work blocks every new source until exact terminal intake', async () => {
  const f = fixture({available: 200, retained: 154});
  for (const [n, status] of [[0, 'failed'], [1, 'needs-reconciliation'], [2, 'deployed'], [3, 'active']]) f.queue.requests[f.queue.order[n]].status = status;
  f.state.active = [901, 902, 903, 904].map(id => ({...nativeRun({id: queueDigest('external'), sourceSha}, {id}), display_title: 'Legacy source'}));
  const waiting = await scheduleDealerPackSource(f.options); assert.equal(waiting.retained, 154); assert.equal(f.posts.length, 0); assert.equal(f.checked.length, 0);
  assert.equal(Object.keys(f.store.state.externalRuns).length, 4);
  f.state.active = []; f.state.externalCompleted = true;
  f.options.ensureTerminalIntake = async ({runId}) => {for (let n = 154 + (runId - 901) * 6; n < 160 + (runId - 901) * 6; n++) f.add(n);
    return {runId, sourceCommit: sourceSha, contracts: {runId, sourceCommit: sourceSha, conclusion: 'success'}, requests: [], failures: [], failedMaterials: []};};
  const next = await scheduleDealerPackSource(f.options); assert.equal(next.terminalIntakeCalls, 4); assert.equal(next.retained, 178);
  assert.equal(f.checked.length, 14); assert.deepEqual(f.posts[0].slugs, Array.from({length: 14}, (_, n) => 'dealer-' + (178 + n)));
  assert(Object.values(f.store.state.externalRuns).every(row => row.terminalIntakeComplete));
});

test('every discovery inside external intake persists a newly observed foreign run before another read can lose it', async () => {
  for (const observedOn of [2, 3]) {
    const f = fixture({available: 1}); f.state.active = [{...nativeRun({id: queueDigest('external'), sourceSha}, {id: 901}), display_title: 'Legacy source'}];
    await scheduleDealerPackSource(f.options); f.state.active = []; f.state.externalCompleted = true;
    let discoveries = 0; const discover = f.options.discover;
    f.options.discover = async options => {
      const result = await discover(options);
      if (++discoveries === observedOn) return {...result, unknownActive: true,
        activeRuns: [{...nativeRun({id: queueDigest('second-external'), sourceSha}, {id: 902}), display_title: 'Another legacy source'}]};
      return result;
    };
    f.options.ensureTerminalIntake = async ({runId}) => ({runId, sourceCommit: sourceSha, contracts: {runId, sourceCommit: sourceSha, conclusion: 'success'}, requests: [], failures: [], failedMaterials: []});
    const result = await scheduleDealerPackSource(f.options);
    assert.equal(result.status, 'waiting-external-source'); assert.equal(f.posts.length, 0);
    assert.equal(f.store.state.externalRuns['901'].terminalIntakeComplete, true);
    assert.equal(f.store.state.externalRuns['902'].sourceSha, sourceSha); assert.equal(f.store.state.externalRuns['902'].terminalIntakeComplete, false);
    assert.equal(f.checked.length, 0);
  }
});

test('a global or unauthenticated terminal intake failure leaves the external source barrier held', async () => {
  const f = fixture({available: 1}); f.state.active = [{...nativeRun({id: queueDigest('external'), sourceSha}, {id: 901}), display_title: 'Legacy'}];
  await scheduleDealerPackSource(f.options); f.state.active = []; f.state.externalCompleted = true;
  f.options.ensureTerminalIntake = async () => ({runId: 901, sourceCommit: 'b'.repeat(40), contracts: {}, requests: [], failures: [], failedMaterials: []});
  await assert.rejects(scheduleDealerPackSource(f.options), /exact authenticated/); assert.equal(f.posts.length, 0);
  assert.equal(f.store.state.externalRuns['901'].terminalIntakeComplete, false);
});

test('legacy failed material is retained before its barrier clears while an independent ready sibling can build', async () => {
  const f = fixture({available: 2}), shared = {kind: 'cars-source-build-material-v1', scriptsTree: '1'.repeat(40), lockBlob: '2'.repeat(40), nativeWorkflowBlob: '3'.repeat(40)};
  f.options.buildFingerprint = queueDigest(shared);
  f.state.active = [{...nativeRun({id: queueDigest('external'), sourceSha}, {id: 901}), display_title: 'Legacy'}];
  await scheduleDealerPackSource(f.options); f.state.active = []; f.state.externalCompleted = true; f.state.externalConclusion = 'failure';
  f.options.ensureTerminalIntake = async ({runId}) => ({runId, sourceCommit: sourceSha, contracts: {runId, sourceCommit: sourceSha, conclusion: 'success'},
    requests: [], failures: [{slug: 'dealer-0', reason: 'Exact native logo gate refused'}], failedMaterials: [{dealerId: ids[0], slug: 'dealer-0', packDigest: packDigest(0),
      buildFingerprint: f.options.buildFingerprint, sourceSha, packTree: '4'.repeat(40), scriptsTree: shared.scriptsTree, lockBlob: shared.lockBlob,
      nativeWorkflowBlob: shared.nativeWorkflowBlob, reason: 'Exact native logo gate refused'}]});
  const result = await scheduleDealerPackSource(f.options); assert.equal(result.terminalIntakeCalls, 1);
  assert.equal(f.store.state.externalRuns['901'].terminalIntakeComplete, true); assert.equal(f.store.state.targets[ids[0]].status, 'held');
  assert.equal(f.store.state.targets[ids[0]].materials[0].externalRunId, 901); assert.deepEqual(f.posts[0].slugs, ['dealer-1']);
});

test('foreign source observed during our live campaign remains a terminal-intake and failed-material barrier after disappearing', async () => {
  const f = fixture({available: 16}), shared = {kind: 'cars-source-build-material-v1', scriptsTree: '1'.repeat(40), lockBlob: '2'.repeat(40), nativeWorkflowBlob: '3'.repeat(40)};
  f.options.buildFingerprint = queueDigest(shared);
  await scheduleDealerPackSource(f.options);
  const reservation = f.store.state.reservations[f.store.state.activeReservationId], own = nativeRun(reservation);
  f.state.active = [own, {...nativeRun({id: queueDigest('external'), sourceSha}, {id: 901}), display_title: 'Legacy source'}];
  assert.equal((await scheduleDealerPackSource(f.options)).status, 'building');
  assert.deepEqual(Object.keys(f.store.state.externalRuns), ['901']);
  assert.equal(f.store.state.externalRuns['901'].sourceSha, sourceSha);
  f.state.active = [own]; f.state.externalCompleted = true; f.state.externalConclusion = 'failure';
  assert.equal((await scheduleDealerPackSource(f.options)).status, 'building');
  assert.equal(f.store.state.externalRuns['901'].terminalIntakeComplete, false);
  assert.equal(f.posts.length, 1);
  f.state.active = []; f.state.runStatus = 'completed'; f.state.conclusion = 'success';
  assert.equal((await scheduleDealerPackSource(f.options)).status, 'waiting-external-intake');
  assert.equal(f.store.state.activeReservationId, null); assert.equal(f.posts.length, 1);
  f.options.ensureTerminalIntake = async ({runId}) => ({runId, sourceCommit: sourceSha, contracts: {runId, sourceCommit: sourceSha, conclusion: 'success'},
    requests: [], failures: [{slug: 'dealer-14', reason: 'Exact failed native gate'}], failedMaterials: [{dealerId: ids[14], slug: 'dealer-14', packDigest: packDigest(14),
      buildFingerprint: f.options.buildFingerprint, sourceSha, packTree: '4'.repeat(40), scriptsTree: shared.scriptsTree, lockBlob: shared.lockBlob,
      nativeWorkflowBlob: shared.nativeWorkflowBlob, reason: 'Exact failed native gate'}]});
  const next = await scheduleDealerPackSource(f.options);
  assert.equal(next.terminalIntakeCalls, 1); assert.equal(f.store.state.externalRuns['901'].terminalIntakeComplete, true);
  assert.equal(f.store.state.targets[ids[14]].materials[0].externalRunId, 901);
  assert.equal(f.store.state.targets[ids[14]].status, 'held'); assert.deepEqual(f.posts[1].slugs, ['dealer-15']);
  assert.equal(f.posts.length, 2); assert.equal(f.checked.filter(slug => slug === 'dealer-14').length, 0);
});

test('an exact old reserved run finishes after main advances without relabelling source completion as qualification', async () => {
  const f = fixture({available: 1}); await scheduleDealerPackSource(f.options);
  f.state.main = 'b'.repeat(40); f.options.sourceSha = f.state.main; f.state.runStatus = 'completed'; f.state.conclusion = 'success';
  const result = await scheduleDealerPackSource(f.options); assert.equal(result.sourceCompletion.status, 'source-finished');
  assert.equal(f.store.state.targets[ids[0]].status, 'source-finished'); assert.equal(f.queue.order.length, 0); assert.equal(f.posts.length, 1);
});

test('bad published source fails before bootstrap, and source advances during input checks prevent POST', async () => {
  const f = fixture(); f.state.main = 'b'.repeat(40); await assert.rejects(scheduleDealerPackSource(f.options), /published main/); assert.equal(f.store.writes, 0);
  const g = fixture({available: 1}); g.options.validateReadyPack = async () => {g.state.main = 'c'.repeat(40); return {success: true, packDigest: packDigest(0)};};
  assert.equal((await scheduleDealerPackSource(g.options)).status, 'waiting-source'); assert.equal(g.posts.length, 0); assert.equal(g.store.state.activeReservationId, null);
});

test('a reviewed flag cannot replace maintained source validation or an exact digest', async () => {
  for (const checked of [{success: false, packDigest: packDigest(0)}, {success: true, packDigest: queueDigest('wrong')}, {success: true, packDigest: packDigest(0), benchmarkOnly: true}]) {
    const f = fixture({available: 1}); f.options.validateReadyPack = async () => checked;
    assert.equal((await scheduleDealerPackSource(f.options)).status, 'waiting-inputs'); assert.equal(f.posts.length, 0);
  }
});

test('physical pack bytes must match the exact published regular-file tree before their digest is used', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-source-scheduler-')); t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const directory = path.join(root, 'dealers/owned-pack'); fs.mkdirSync(directory, {recursive: true});
  const files = new Map([['dealer.json', Buffer.from(JSON.stringify({slug: 'owned-pack', dealerId: ids[0]}))], ['stock.json', Buffer.from('{"records":[]}' )]]);
  for (const [name, bytes] of files) fs.writeFileSync(path.join(directory, name), bytes);
  const git = (location, args) => {assert.equal(location, root); assert.deepEqual(args, ['ls-tree', '-r', '--full-tree', '-z', sourceSha, '--', 'dealers/owned-pack/']);
    return [...files].map(([name, bytes]) => '100644 blob ' + createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex') + '\tdealers/owned-pack/' + name + '\0').join('');};
  const good = inspectSourcePackMaterial({root, slug: 'owned-pack', dealerId: ids[0], sourceSha, git}); assert.match(good.packDigest, /^[a-f0-9]{64}$/);
  fs.writeFileSync(path.join(directory, 'stock.json'), '{"records":["changed"]}');
  assert.throws(() => inspectSourcePackMaterial({root, slug: 'owned-pack', dealerId: ids[0], sourceSha, git}), /exact published source/);
});

test('build fingerprint uses exact shared source objects and survives unrelated main changes', () => {
  const objects = ['1'.repeat(40), '2'.repeat(40), '3'.repeat(40)], git = (_, args) => {assert.deepEqual(args.slice(1).map(value => value.slice(41)), ['scripts', 'templates.lock.json', '.github/workflows/dealer-pack-pipeline.yml']); return objects.join('\n');};
  const options = {root: 'J:/unused', sourceSha, git}, a = dealerPackSourceBuildFingerprint(options);
  assert.equal(a, dealerPackSourceBuildFingerprint({...options, sourceSha: 'b'.repeat(40)}));
  objects[0] = '4'.repeat(40); assert.notEqual(a, dealerPackSourceBuildFingerprint(options));
});

test('terminal intake reuses the pinned resolver source, seals failed bytes and restores dispatcher exit status', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-pinned-source-')); t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const directory = path.join(root, 'dealers/owned-pack'); fs.mkdirSync(directory, {recursive: true});
  const files = new Map([['dealer.json', Buffer.from(JSON.stringify({slug: 'owned-pack', dealerId: ids[0]}))], ['stock.json', Buffer.from('{"records":[]}')]]);
  for (const [name, bytes] of files) fs.writeFileSync(path.join(directory, name), bytes);
  const scriptsTree = '1'.repeat(40), lockBlob = '2'.repeat(40), nativeWorkflowBlob = '3'.repeat(40), packTree = '4'.repeat(40);
  const git = (location, args) => {assert.equal(location, root);
    if (args[0] === 'rev-parse') return args.length === 4 ? [scriptsTree, lockBlob, nativeWorkflowBlob].join('\n') : packTree;
    return [...files].map(([name, bytes]) => '100644 blob ' + createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex') + '\tdealers/owned-pack/' + name + '\0').join('');};
  let sourceReads = 0; const resolver = {async source(sha) {assert.equal(sha, sourceSha); sourceReads++; return root;}};
  const before = process.exitCode, runDispatcher = async (argv, options) => {assert.equal(options.resolver, resolver); assert(argv.includes('--automatic')); process.exitCode = 9;
    return {runId: 901, sourceCommit: sourceSha, requests: [], failures: [{slug: 'owned-pack', reason: 'Exact failed native gate'}]};};
  const intake = createDealerPackTerminalIntake({root, resolver, runDispatcher, git}), result = await intake({runId: 901});
  assert.equal(process.exitCode, before); assert.equal(sourceReads, 1); assert.equal(result.failedMaterials.length, 1);
  assert.deepEqual({...result.failedMaterials[0], packDigest: 'checked separately'}, {dealerId: ids[0], slug: 'owned-pack', packDigest: 'checked separately',
    scriptsTree, lockBlob, nativeWorkflowBlob, buildFingerprint: queueDigest({kind: 'cars-source-build-material-v1', scriptsTree, lockBlob, nativeWorkflowBlob}),
    sourceSha, packTree, reason: 'Exact failed native gate'});
  assert.equal(result.failedMaterials[0].packDigest, inspectSourcePackMaterial({root, slug: 'owned-pack', dealerId: ids[0], sourceSha, git}).packDigest);
  const bad = createDealerPackTerminalIntake({root, resolver, git, runDispatcher: async () => {process.exitCode = 7; return {runId: 901, sourceCommit: sourceSha, failures: [{artifact: 'unbound', reason: 'Global failure'}]};}});
  await assert.rejects(bad({runId: 901}), /Global or artifact/); assert.equal(process.exitCode, before); assert.equal(sourceReads, 1);
});

test('dispatch issues one exact main POST and handles204/200 without accepting foreign run URLs', async () => {
  const options = {sourceSha, rolloutRequestId: queueDigest('public-nonce'), slugs: ['one-pack', 'two-pack'], token: 'synthetic-gh-credential'};
  let calls = 0;
  const fetchImpl = async (url, request) => {calls++; assert.equal(url, 'https://api.github.com/repos/' + PACK_QUEUE_REPOSITORY + '/actions/workflows/dealer-pack-pipeline.yml/dispatches');
    assert.equal(request.method, 'POST'); assert.equal(request.redirect, 'error'); assert.deepEqual(JSON.parse(request.body), {ref: 'main', inputs: {slugs: '["one-pack","two-pack"]', rollout_request_id: options.rolloutRequestId, rollout_source_sha: sourceSha}});
    return {status: 204, json: () => assert.fail('Empty204 must not be parsed')};};
  assert.deepEqual(await dispatchDealerPackSource({...options, fetchImpl}), {httpStatus: 204}); assert.equal(calls, 1);
  const body = {workflow_run_id: 456, run_url: 'https://api.github.com/repos/' + PACK_QUEUE_REPOSITORY + '/actions/runs/456', html_url: 'https://github.com/' + PACK_QUEUE_REPOSITORY + '/actions/runs/456'};
  assert.equal((await dispatchDealerPackSource({...options, fetchImpl: async () => ({status: 200, json: async () => body})})).runId, 456);
  await assert.rejects(dispatchDealerPackSource({...options, fetchImpl: async () => ({status: 200, json: async () => ({...body, run_url: 'https://foreign.test/456'})})}), /authenticated run locator/);
  let attempts = 0; await assert.rejects(dispatchDealerPackSource({...options, fetchImpl: async () => {attempts++; throw Error('Unknown POST');}}), /Unknown POST/); assert.equal(attempts, 1);
});
