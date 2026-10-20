import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK_DEPLOY_ACCOUNT, PACK_DEPLOY_ZONE, createPackDeploymentQueue, packDeploymentRequest, queueDigest, queueCanonical, validatePackQueue} from './lib/dealer-pack-queue.mjs';
import {PACK_SNAPSHOT_MAX_AGE_MS, executeQueuedPackDeployment, packOwnershipTags, packHostedReceiptEvidence} from './lib/dealer-pack-deployment.mjs';
import {PACK_BATCH_DISK_FLOOR, PACK_BATCH_MEMORY_FLOOR, migrateIdlePackQueueV2, validatePackBatchQueue, reservePackBatch, assertPackBatchMember,
  beginBatchWorkerCreate, acknowledgeBatchWorkerCreate, finishPackBatchMember, releaseEmptyPackBatch} from './lib/dealer-pack-batch-protocol.mjs';

const base = Date.parse('2026-10-20T20:00:00.000Z'), time = n => new Date(base + n * 1000).toISOString();
const digest = value => queueDigest(value), GiB = 1024 ** 3, MiB = 1024 ** 2;
const policy = {schemaVersion: 1, kind: 'cars-owner-authorized-pack-deployment', accountId: PACK_DEPLOY_ACCOUNT, zoneId: PACK_DEPLOY_ZONE,
  zoneName: 'webpreviews.site', workersPlan: 'paid', allowedScripts: 500, minimumSpareScripts: 0, ownerConfirmedPaid: true, allowNewPreviews: true,
  outreachApproved: false, authorizedAt: time(0), authorizationSource: 'Owner400previewauthorization', reason: 'Owner authorizes400 new previews and protects the retained baseline.', maximumNewDealers: 400};
const request = n => packDeploymentRequest({slug: 'protocol-dealer-' + n, dealerId: 'gb-protocol-dealer-' + n, batch: 1,
  workerName: 'cars-protocol-dealer-' + n, publicOrigin: 'https://protocol-dealer-' + n + '.webpreviews.site', packDigest: digest('pack' + n),
  releaseId: 'cars-six-protocol-release', releaseDigest: digest('release'), outputDigest: digest('output' + n), sourceCommit: 'a'.repeat(40)});
function fixture() {
  const workerNames = Array.from({length: 100}, (_, n) => 'cars-protected-' + n);
  const state = createPackDeploymentQueue({policy, baseline: {accountId: PACK_DEPLOY_ACCOUNT, zoneId: PACK_DEPLOY_ZONE, evidence: 'authenticated-cloudflare-api', complete: true,
    observedAt: time(0), workerNames, routes: [], domains: []}, queueId: 'test-protocol-queue-immutable-identity', now: time(0)});
  const requests = [request(1), request(2), request(3)];
  for (const row of requests) {state.order.push(row.id); state.requests[row.id] = {request: row, status: 'queued', queuedAt: time(0), events: []};}
  return {v1: state, requests, state: migrateIdlePackQueueV2(state, {now: time(0), expectedGeneration: 0})};
}
function options(state, {count = 100, at = 1, ...extra} = {}) {
  const challenge = {requestId: 'test-challenge-' + at, stage: 'before-batch-reservation', notBefore: time(at)};
  const scripts = Array.from({length: count}, (_, n) => ({id: n.toString(16).padStart(32, '0'), name: n < 100 ? 'cars-protected-' + n : 'cars-unrelated-' + n}));
  return {owner: 'github:test-protocol-owner', batchToken: 'synthetic-batch-fence-1234567890', now: time(at), challenge,
    snapshot: {kind: 'cars-live-pack-provider-snapshot', evidence: 'authenticated-cloudflare-api', accountId: PACK_DEPLOY_ACCOUNT, zoneId: PACK_DEPLOY_ZONE,
      requestId: challenge.requestId, stage: challenge.stage, startedAt: time(at), observedAt: time(at), complete: true, scriptCount: count, scripts, routes: [], domains: [], target: {exists: false}},
    resources: {observedAt: time(at), diskAvailableBytes: PACK_BATCH_DISK_FLOOR + 2 * GiB, diskFloorBytes: PACK_BATCH_DISK_FLOOR,
      memoryAvailableBytes: PACK_BATCH_MEMORY_FLOOR + 256 * MiB, memoryFloorBytes: PACK_BATCH_MEMORY_FLOOR},
    allocations: Object.fromEntries(state.order.map(id => [id, {diskBytes: GiB, memoryBytes: 128 * MiB}])), ...extra};
}
function open(extra = {}) {const f = fixture(), result = reservePackBatch(f.state, options(f.state, extra)); return {...f, state: result.state, claims: result.value};}
function acknowledge(state, claim, n, at) {
  const started = beginBatchWorkerCreate(state, claim, {intentId: 'synthetic-create-intent-' + n, now: time(at)}).state;
  const row = started.requests[claim.requestId].request;
  return acknowledgeBatchWorkerCreate(started, claim, {workerId: digest('worker' + n).slice(0, 32), workerName: row.workerName,
    ownershipTags: packOwnershipTags(started, row), intentId: started.active.slots[claim.requestId].createIntent.id}, {now: time(at + 1)}).state;
}
function receipt(state, claim, {failed = false} = {}) {
  const row = state.requests[claim.requestId].request, ack = state.active.slots[claim.requestId].acknowledgement;
  const versionId = '11111111-2222-4333-8444-555555555555';
  const hosted = {type: 'cars-dealer-pack-hosted-qa', slug: row.slug, publicOrigin: row.publicOrigin, packDigest: row.packDigest, outputDigest: row.outputDigest,
    versionId, width: 390, language: 'en', success: true, providerWrites: 0, finishedAt: time(8), designs: ['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best'].map(key =>
      ({key, status: 'passed', httpStatus: 200, headStatus: 'passed', headHttpStatus: 200, sixChoices: true, nameVisible: true, logoVisible: true, phoneStatus: 'passed', foreignIdentityCount: 0}))};
  return {schemaVersion: 1, type: 'cars-dealer-pack-deployment', status: 'deployed', queueId: state.queueId, requestId: row.id, accountId: state.accountId, zoneId: state.zoneId,
    ...Object.fromEntries(['slug', 'dealerId', 'batch', 'workerName', 'publicOrigin', 'packDigest', 'releaseId', 'releaseDigest', 'outputDigest', 'sourceCommit'].map(key => [key, row[key]])),
    workerId: ack.workerId, versionId, routeId: 'exact-route-' + row.slug, ownershipTags: ack.ownershipTags, ownerAccepted: false, outreachPerformed: false, finishedAt: time(8),
    hostedVerified: !failed, ...(failed ? {hostedFailure: 'Exact hosted gate refused'} : {hosted: packHostedReceiptEvidence(hosted)})};
}
const accountClaim = claim => ({queueId: claim.queueId, owner: claim.owner, batchToken: claim.batchToken});

test('idle migration preserves all immutable history bytes and rejects active, uncertain or changed generations', () => {
  const f = fixture(), historic = f.v1.requests[f.requests[2].id]; historic.status = 'deployed';
  const history = {slug: historic.request.slug, requestId: historic.request.id, retainedHistoricalField: {must: 'stay verbatim'}};
  f.v1.receipts[historic.request.slug] = [{sha256: digest(history), receipt: history}];
  const before = structuredClone(f.v1), migrated = migrateIdlePackQueueV2(f.v1, {now: time(1), expectedGeneration: 0});
  for (const key of ['queueId', 'policy', 'policyDigest', 'baseline', 'baselineDigest', 'order', 'requests', 'receipts']) assert.deepEqual(migrated[key], before[key]);
  assert.deepEqual(f.v1, before); assert.equal(migrated.batchProtocol.migratedFromSha256, digest(before));
  assert.throws(() => migrateIdlePackQueueV2(f.v1, {expectedGeneration: 1, now: time(1)}), /reviewed idle generation/);
  for (const status of ['active', 'needs-reconciliation']) {
    const changed = structuredClone(f.v1); changed.requests[f.requests[0].id].status = status;
    changed.active = {requestId: f.requests[0].id, owner: 'stopped-or-running', token: 'synthetic-legacy-fence-long', claimedAt: time(0)};
    assert.throws(() => migrateIdlePackQueueV2(changed, {expectedGeneration: 0, now: time(1)}), /idle V1/);
    if (status === 'needs-reconciliation') {changed.active = null; assert.throws(() => migrateIdlePackQueueV2(changed, {expectedGeneration: 0, now: time(1)}), /idle V1/);}
  }
});

test('the actual V1 executor rejects V2 before any provider call or store write', async () => {
  const f = open(); let calls = 0, writes = 0;
  assert.throws(() => validatePackQueue(f.state), /Wrong durable/);
  const provider = Object.fromEntries(['snapshot', 'createWorker', 'prepareAssets', 'upload', 'activateVersion', 'disableSubdomain', 'createRoute', 'rollbackVersion'].map(key => [key, async () => {calls++; throw Error('must never run');}]));
  await assert.rejects(executeQueuedPackDeployment({store: {async read() {return {state: f.state, revision: 'fake'};}, async compareAndSwap() {writes++;}},
    claim: f.claims[0], provider, inspectCandidate: async () => {calls++;}, verifyHosted: async () => {calls++;}}), /Wrong durable/);
  assert.equal(calls, 0); assert.equal(writes, 0);
});

test('default admission reserves exactly two independent members, rejects a third and never steals an existing batch', () => {
  const f = fixture(), before = structuredClone(f.state), result = reservePackBatch(f.state, options(f.state));
  assert.equal(result.value.length, 2); assert.equal(Object.keys(result.state.active.slots).length, 2); assert.deepEqual(f.state, before);
  assert.equal(result.state.requests[f.requests[2].id].status, 'queued');
  assert.throws(() => reservePackBatch(f.state, options(f.state, {maximum: 3})), /maximum/);
  assert.throws(() => reservePackBatch(f.state, options(f.state, {requestIds: f.state.order})), /bounded member/);
  assert.throws(() => reservePackBatch(result.state, options(result.state, {at: 100000})), /already owned/);
  assert.throws(() => releaseEmptyPackBatch(result.state, accountClaim(result.value[0]), {now: time(2)}), /fully settled/);
});

test('capacity and resource reservations refuse oversubscription or stale/foreign observations', () => {
  const f = fixture();
  for (const count of [499, 500]) assert.throws(() => reservePackBatch(f.state, options(f.state, {count})), /insufficient fresh capacity/);
  const single = reservePackBatch(f.state, options(f.state, {count: 499, maximum: 1})); assert.equal(single.value.length, 1);
  for (const [field, value] of [['diskAvailableBytes', PACK_BATCH_DISK_FLOOR + 2 * GiB - 1], ['memoryAvailableBytes', PACK_BATCH_MEMORY_FLOOR + 256 * MiB - 1], ['diskFloorBytes', PACK_BATCH_DISK_FLOOR - 1]]) {
    const opts = options(f.state); opts.resources[field] = value; assert.throws(() => reservePackBatch(f.state, opts), /resource|budget/);
  }
  const foreign = options(f.state); foreign.snapshot.accountId = 'other-account'; assert.throws(() => reservePackBatch(f.state, foreign), /authenticated provider/);
  const stale = options(f.state); stale.snapshot.observedAt = time(0); assert.throws(() => reservePackBatch(f.state, stale), /stale/);
  const occupied = options(f.state); occupied.snapshot.scripts[0].name = f.requests[1].workerName; assert.throws(() => reservePackBatch(f.state, occupied), /baseline|already exists/);
});

test('runtime resources share the current provider window and exact admission freshness limit', () => {
  const f = fixture();
  const oldChallenge = options(f.state, {at: 86400});
  oldChallenge.challenge.notBefore = time(1); oldChallenge.resources.observedAt = time(1);
  assert.throws(() => reservePackBatch(f.state, oldChallenge), /fresh checked runtime resources/);
  const boundary = options(f.state, {at: 1 + PACK_SNAPSHOT_MAX_AGE_MS / 1000});
  boundary.challenge.notBefore = time(1); boundary.snapshot.startedAt = time(1); boundary.resources.observedAt = time(1);
  assert.equal(reservePackBatch(f.state, boundary).value.length, 2);
  const expired = structuredClone(boundary); expired.now = new Date(Date.parse(boundary.now) + 1).toISOString();
  assert.throws(() => reservePackBatch(f.state, expired), /fresh checked runtime resources/);
  const beforeWindow = options(f.state, {at: 31}); beforeWindow.challenge.notBefore = time(1); beforeWindow.resources.observedAt = time(30);
  assert.throws(() => reservePackBatch(f.state, beforeWindow), /fresh checked runtime resources/);
  const future = options(f.state, {at: 31}); future.resources.observedAt = time(32);
  assert.throws(() => reservePackBatch(f.state, future), /fresh checked runtime resources/);
});

test('request fences and the serial create gate prevent cross-member writes and unacknowledged capacity release', () => {
  const f = open(), [first, second] = f.claims;
  assert.throws(() => assertPackBatchMember(f.state, {...first, token: second.token}), /fence/);
  assert.throws(() => assertPackBatchMember(f.state, {...first, batchToken: 'synthetic-wrong-batch-fence'}), /fence/);
  const started = beginBatchWorkerCreate(f.state, first, {now: time(2)}).state;
  assert.throws(() => beginBatchWorkerCreate(started, second, {now: time(3)}), /create gate/);
  assert.throws(() => finishPackBatchMember(started, first, {status: 'failed', now: time(3)}), /must remain reserved/);
  const uncertain = finishPackBatchMember(started, first, {status: 'needs-reconciliation', error: 'unknown create response', now: time(3)}).state;
  assert.deepEqual(uncertain.active.capacity.reserved, started.active.capacity.reserved); assert.deepEqual(uncertain.active.slots[first.requestId].resources, started.active.slots[first.requestId].resources);
  assert.equal(uncertain.active.createInFlight, first.requestId); assert.equal(uncertain.active.held, true);
  assert.throws(() => beginBatchWorkerCreate(uncertain, second, {now: time(4)}), /create gate/);
  assert.throws(() => finishPackBatchMember(uncertain, first, {status: 'failed', now: time(1000000)}), /positive reconciliation/);
});

test('positive acknowledgements bind exact worker IDs/tags and cannot be duplicated or forget capacity', () => {
  const f = open(), [first] = f.claims;
  const started = beginBatchWorkerCreate(f.state, first, {now: time(2)}).state, row = started.requests[first.requestId].request;
  const ack = {workerId: '1'.repeat(32), workerName: row.workerName, ownershipTags: packOwnershipTags(started, row), intentId: started.active.slots[first.requestId].createIntent.id};
  for (const value of [{...ack, workerName: f.requests[1].workerName}, {...ack, ownershipTags: []}, {...ack, intentId: 'different-intent'}]) assert.throws(() => acknowledgeBatchWorkerCreate(started, first, value, {now: time(3)}), /exact Worker/);
  const state = acknowledgeBatchWorkerCreate(started, first, ack, {now: time(3)}).state;
  assert.equal(state.active.capacity.reserved.length, 1); assert.equal(Object.keys(state.active.capacity.created).length, 1);
  assert.throws(() => acknowledgeBatchWorkerCreate(state, first, ack, {now: time(4)}), /exact Worker/);
  const forged = structuredClone(state); delete forged.active.capacity.created[first.requestId]; assert.throws(() => validatePackBatchQueue(forged), /cannot be forgotten/);
});

test('an uncertain member retains the account hold while an independently qualified sibling finishes byte-exact', () => {
  const f = open(), [first, second] = f.claims;
  let state = acknowledge(acknowledge(f.state, first, 1, 2), second, 2, 4);
  state = finishPackBatchMember(state, first, {status: 'needs-reconciliation', error: 'unknown upload response', now: time(6)}).state;
  const heldSlot = queueCanonical(state.active.slots[first.requestId]), heldRequest = queueCanonical(state.requests[first.requestId]), heldCapacity = queueCanonical(state.active.capacity.created[first.requestId]);
  state = finishPackBatchMember(state, second, {status: 'deployed', receipt: receipt(state, second), now: time(8)}).state;
  assert.equal(queueCanonical(state.active.slots[first.requestId]), heldSlot); assert.equal(queueCanonical(state.requests[first.requestId]), heldRequest);
  assert.equal(queueCanonical(state.active.capacity.created[first.requestId]), heldCapacity); assert.equal(state.active.held, true);
  assert.equal(state.requests[second.requestId].status, 'deployed'); assert.equal(state.receipts[f.requests[1].slug].length, 1);
  assert.throws(() => releaseEmptyPackBatch(state, accountClaim(first), {now: time(9)}), /fully settled/);
  assert.throws(() => reservePackBatch(state, options(state, {at: 1000000})), /already owned/);
});

test('wrong or unqualified sibling receipts cannot settle either request', () => {
  const f = open(), [first, second] = f.claims, state = acknowledge(acknowledge(f.state, first, 1, 2), second, 2, 4), valid = receipt(state, first);
  for (const change of [{workerId: 'f'.repeat(32)}, {requestId: second.requestId}, {outputDigest: '0'.repeat(64)}, {hostedVerified: false}, {ownerAccepted: true}])
    assert.throws(() => finishPackBatchMember(state, first, {status: 'deployed', receipt: {...valid, ...change}, now: time(8)}), /receipt|hosted/);
  const changed = structuredClone(valid); changed.hosted.report.designs[0].status = 'failed'; changed.hosted.summarySha256 = digest(changed.hosted.report);
  assert.throws(() => finishPackBatchMember(state, first, {status: 'deployed', receipt: changed, now: time(8)}), /six hosted/);
  assert.equal(state.requests[first.requestId].status, 'active'); assert.equal(state.requests[second.requestId].status, 'active');
});

test('a failed hosted Worker still consumes capacity and ordinary admission never retries its dealer', () => {
  const f = open({count: 498}), [first, second] = f.claims; let state = acknowledge(f.state, first, 1, 2);
  state = finishPackBatchMember(state, first, {status: 'failed', receipt: receipt(state, first, {failed: true}), now: time(8)}).state;
  assert.equal(Object.keys(state.active.capacity.created).length, 1); assert.equal(state.active.capacity.reserved.length, 1);
  state = finishPackBatchMember(state, second, {status: 'failed', error: 'local pre-create refusal', now: time(9)}).state;
  assert.notEqual(state.active, null, 'settlement never implicitly releases the account');
  state = releaseEmptyPackBatch(state, accountClaim(first), {now: time(10)}).state;
  assert.equal(state.active, null); assert.equal(state.batchProtocol.capacityFloor, 499);
  assert.throws(() => reservePackBatch(state, options(state, {count: 498, maximum: 1, at: 11})), /insufficient fresh capacity/);
  assert.throws(() => reservePackBatch(state, options(state, {requestIds: [first.requestId], maximum: 1, at: 11})), /only queued/);
  const admitted = reservePackBatch(state, options(state, {count: 499, maximum: 1, at: 11})); assert.equal(admitted.value.length, 1);
});

test('fully qualified members require explicit empty release and preserve every other member on settlement', () => {
  const f = open(), [first, second] = f.claims; let state = acknowledge(acknowledge(f.state, first, 1, 2), second, 2, 4);
  const sibling = queueCanonical({slot: state.active.slots[second.requestId], row: state.requests[second.requestId], created: state.active.capacity.created[second.requestId]});
  state = finishPackBatchMember(state, first, {status: 'deployed', receipt: receipt(state, first), now: time(8)}).state;
  assert.equal(queueCanonical({slot: state.active.slots[second.requestId], row: state.requests[second.requestId], created: state.active.capacity.created[second.requestId]}), sibling);
  state = finishPackBatchMember(state, second, {status: 'deployed', receipt: receipt(state, second), now: time(9)}).state;
  assert.equal(Object.keys(state.active.slots).length, 0); assert.notEqual(state.active, null);
  assert.throws(() => releaseEmptyPackBatch(state, {...accountClaim(first), owner: 'other-executor'}, {now: time(10)}), /fence/);
  const released = releaseEmptyPackBatch(state, accountClaim(first), {now: time(10)}).state;
  assert.equal(released.active, null); assert.equal(released.batchProtocol.capacityFloor, 102); assert.equal(Object.keys(released.receipts).length, 2);
  assert.deepEqual(released.policy, f.v1.policy); assert.deepEqual(released.baseline, f.v1.baseline); validatePackBatchQueue(released);
});

test('malformed V2 reservations cannot be hidden by the private immutable V1 validation view', () => {
  const f = open();
  for (const mutate of [state => state.active.capacity.reserved.pop(), state => state.active.resources.diskAvailableBytes = PACK_BATCH_DISK_FLOOR,
    state => state.active.slots[f.claims[1].requestId].token = f.claims[0].token, state => delete state.active.slots[f.claims[0].requestId]]) {
    const changed = structuredClone(f.state); mutate(changed); assert.throws(() => validatePackBatchQueue(changed), /reservation|resource|fence|coverage/);
  }
});
