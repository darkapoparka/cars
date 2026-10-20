/** Unwired V2 evolution of the maintained account queue. Pure state proposals
 * only: no store, provider, timer, retry, CLI, filesystem or network operation.
 * A future reviewed CAS adapter must persist each returned state before acting.
 * Runtime budgets/allocations must come from checked physical capacity and the
 * authenticated transport inventory. This module does not measure or publish.
 * There is deliberately no uncertain-slot clearing/recovery capability here.
 */
import {randomUUID} from 'node:crypto';
import {validatePackQueue, packDeploymentRequest, queueCanonical, queueDigest} from './dealer-pack-queue.mjs';
import {PACK_SNAPSHOT_MAX_AGE_MS, packOwnershipTags, validatePackProviderSnapshot, validateHostedPackResult} from './dealer-pack-deployment.mjs';

export const PACK_BATCH_MAXIMUM = 2;
export const PACK_BATCH_DISK_FLOOR = 5 * 1024 ** 3;
export const PACK_BATCH_MEMORY_FLOOR = 2 * 1024 ** 3;
const assert = (ok, message) => {if (!ok) throw Error('Pack batch protocol: ' + message);};
const clone = value => structuredClone(value);
const equal = (a, b) => queueCanonical(a) === queueCanonical(b);
const natural = value => Number.isSafeInteger(value) && value >= 0;
const timestamp = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
const token = value => typeof value === 'string' && value.length >= 20 && value.length <= 200;
const hex = value => /^[a-f0-9]{64}$/.test(value ?? '');
const workerId = value => /^[a-f0-9]{32}$/.test(value ?? '');
const uuid = value => /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(value ?? '');
const known = new Set(['deployed', 'failed', 'rolled-back']);
const active = new Set(['active', 'needs-reconciliation']);
const keys = (value, names) => value && typeof value === 'object' && !Array.isArray(value) && equal(Object.keys(value).sort(), [...names].sort());
const related = (a, b) => ['slug', 'dealerId', 'workerName', 'publicOrigin'].some(key => a[key] === b[key]);
const stateIdentity = state => ({queueId: state.queueId, policyDigest: state.policyDigest, baselineDigest: state.baselineDigest});

function validateResources(value) {
  assert(keys(value, ['diskBytes', 'memoryBytes']) && [value.diskBytes, value.memoryBytes].every(natural), 'exact nonnegative resource reservations required');
}

/** Full V2 invariants precede the private immutable-envelope validation view.
 * The view never leaves this function and is never a provider/claim proof. */
export function validatePackBatchQueue(state) {
  assert(state?.schemaVersion === 2 && keys(state.batchProtocol, ['kind', 'maximum', 'migratedFromSha256', 'capacityFloor']) &&
    state.batchProtocol.kind === 'cars-account-batch-protocol-v2' && state.batchProtocol.maximum === PACK_BATCH_MAXIMUM &&
    hex(state.batchProtocol.migratedFromSha256) && natural(state.batchProtocol.capacityFloor) && Array.isArray(state.baseline?.workerNames) &&
    state.batchProtocol.capacityFloor >= state.baseline.workerNames.length, 'reviewed V2 queue wrapper required');
  assert(state.requests && Array.isArray(state.order), 'request index required');
  const running = state.order.filter(id => active.has(state.requests[id]?.status));
  const batch = state.active;
  if (batch === null) assert(running.length === 0, 'idle V2 queue cannot hide active or uncertain requests');
  else {
    assert(keys(batch, ['kind', 'owner', 'token', 'claimedAt', 'memberIds', 'slots', 'settled', 'held', 'createInFlight', 'capacity', 'resources']) &&
      batch.kind === 'cars-account-owned-batch-v2' && typeof batch.owner === 'string' && batch.owner.length >= 3 && batch.owner.length <= 300 &&
      token(batch.token) && timestamp(batch.claimedAt) && typeof batch.held === 'boolean', 'invalid account batch fence');
    assert(Array.isArray(batch.memberIds) && batch.memberIds.length > 0 && batch.memberIds.length <= PACK_BATCH_MAXIMUM &&
      new Set(batch.memberIds).size === batch.memberIds.length && batch.memberIds.every(id => state.requests[id]), 'one or two exact batch members required');
    assert(batch.slots && batch.settled && equal([...Object.keys(batch.slots), ...Object.keys(batch.settled)].sort(), [...batch.memberIds].sort()) &&
      equal(Object.keys(batch.slots).sort(), running.sort()), 'slot/settled/request status coverage differs');
    for (const id of batch.memberIds) {
      const request = state.requests[id].request;
      assert(request.action === 'deploy' && batch.memberIds.every(other => id === other || !related(request, state.requests[other].request)), 'batch requires independent create-only dealer identities');
    }
    const fences = [];
    for (const [id, slot] of Object.entries(batch.slots)) {
      assert(keys(slot, ['requestId', 'token', 'claimedAt', 'status', 'resources', 'createIntent', 'acknowledgement']) && slot.requestId === id &&
        token(slot.token) && slot.token !== batch.token && timestamp(slot.claimedAt) && active.has(slot.status) && slot.status === state.requests[id].status, 'invalid request-specific fence');
      fences.push(slot.token); validateResources(slot.resources);
      assert(slot.createIntent === null || keys(slot.createIntent, ['id', 'at']) && token(slot.createIntent.id) && timestamp(slot.createIntent.at), 'invalid create intent');
      const ack = slot.acknowledgement;
      assert(ack === null || keys(ack, ['workerId', 'workerName', 'ownershipTags', 'intentId', 'at']) && workerId(ack.workerId) &&
        ack.workerName === state.requests[id].request.workerName && equal(ack.ownershipTags, packOwnershipTags(state, state.requests[id].request)) &&
        ack.intentId === slot.createIntent?.id && timestamp(ack.at), 'create acknowledgement is not bound to its member');
    }
    assert(new Set(fences).size === fences.length, 'member fences must differ');
    for (const [id, settled] of Object.entries(batch.settled)) assert(keys(settled, ['status', 'receiptSha256']) && known.has(settled.status) &&
      state.requests[id].status === settled.status && (settled.receiptSha256 === null || hex(settled.receiptSha256)) &&
      (state.requests[id].receiptSha256 ?? null) === settled.receiptSha256, 'settled member binding differs');
    const capacity = batch.capacity;
    assert(keys(capacity, ['snapshotSha256', 'observedAt', 'observedScripts', 'allowedScripts', 'minimumSpareScripts', 'reserved', 'created']) &&
      hex(capacity.snapshotSha256) && timestamp(capacity.observedAt) && natural(capacity.observedScripts) &&
      capacity.allowedScripts === state.policy?.allowedScripts && capacity.minimumSpareScripts === state.policy?.minimumSpareScripts &&
      Array.isArray(capacity.reserved) && new Set(capacity.reserved).size === capacity.reserved.length && capacity.created, 'invalid capacity reservation ledger');
    assert(equal([...capacity.reserved].sort(), Object.keys(batch.slots).filter(id => batch.slots[id].acknowledgement === null).sort()), 'unacknowledged capacity reservation was lost');
    assert(equal(Object.keys(capacity.created).sort(), batch.memberIds.filter(id => state.requests[id].events.some(row => row.kind === 'worker-create-observed')).sort()), 'acknowledged Worker capacity cannot be forgotten');
    for (const [id, acknowledgement] of Object.entries(capacity.created)) assert(batch.memberIds.includes(id) &&
      keys(acknowledgement, ['workerId', 'workerName', 'ownershipTags', 'intentId', 'at']) && token(acknowledgement.intentId) && timestamp(acknowledgement.at) && workerId(acknowledgement.workerId) &&
      acknowledgement.workerName === state.requests[id].request.workerName && equal(acknowledgement.ownershipTags, packOwnershipTags(state, state.requests[id].request)) &&
      state.requests[id].events.filter(row => row.kind === 'worker-create-observed' && row.workerId === acknowledgement.workerId && row.workerName === acknowledgement.workerName && equal(row.ownershipTags, acknowledgement.ownershipTags)).length === 1 &&
      (batch.slots[id] ? equal(batch.slots[id].acknowledgement, acknowledgement) : true), 'created Worker accounting differs');
    assert(new Set(Object.values(capacity.created).map(row => row.workerId)).size === Object.keys(capacity.created).length &&
      Object.keys(batch.slots).every(id => batch.slots[id].acknowledgement === null || capacity.created[id]) &&
      capacity.observedScripts + Object.keys(capacity.created).length + capacity.reserved.length + capacity.minimumSpareScripts <= capacity.allowedScripts, 'capacity reservations oversubscribe the account');
    assert(batch.createInFlight === null || batch.slots[batch.createInFlight]?.createIntent && !batch.slots[batch.createInFlight].acknowledgement, 'invalid serial create gate');
    assert(Object.values(batch.slots).every(slot => !slot.createIntent || slot.acknowledgement || batch.createInFlight === slot.requestId), 'unacknowledged create escaped its gate');
    assert(!Object.values(batch.slots).some(slot => slot.status === 'needs-reconciliation') || batch.held, 'uncertain member must retain the account hold');
    const budget = batch.resources;
    assert(keys(budget, ['observedAt', 'diskAvailableBytes', 'diskFloorBytes', 'memoryAvailableBytes', 'memoryFloorBytes']) && timestamp(budget.observedAt) &&
      Object.entries(budget).filter(([key]) => key !== 'observedAt').every(([, value]) => natural(value)) &&
      budget.diskFloorBytes >= PACK_BATCH_DISK_FLOOR && budget.memoryFloorBytes >= PACK_BATCH_MEMORY_FLOOR, 'checked disk/RAM budget required');
    const reserved = Object.values(batch.slots).reduce((sum, slot) => ({diskBytes: sum.diskBytes + slot.resources.diskBytes, memoryBytes: sum.memoryBytes + slot.resources.memoryBytes}), {diskBytes: 0, memoryBytes: 0});
    assert(reserved.diskBytes + budget.diskFloorBytes <= budget.diskAvailableBytes && reserved.memoryBytes + budget.memoryFloorBytes <= budget.memoryAvailableBytes, 'resource reservations oversubscribe the runtime');
  }
  // Immutable V1 envelopes are reused only after all V2 fences/reservations pass.
  validatePackQueue({...state, schemaVersion: 1, active: null});
  return state;
}

function nextState(state, now, operation) {
  validatePackBatchQueue(state); assert(timestamp(now) && Date.parse(now) >= Date.parse(state.updatedAt), 'dated monotonic transition required');
  const next = clone(state), identity = stateIdentity(state), value = operation(next);
  assert(equal(identity, stateIdentity(next)), 'transition changed policy, baseline or queue identity');
  next.generation++; next.updatedAt = now; validatePackBatchQueue(next); return {state: next, value};
}

export function migrateIdlePackQueueV2(state, {now = new Date().toISOString(), expectedGeneration} = {}) {
  validatePackQueue(state);
  assert(state.active === null && !state.order.some(id => active.has(state.requests[id].status)), 'migration requires idle V1 with no active or uncertain member');
  assert(timestamp(now) && Date.parse(now) >= Date.parse(state.updatedAt) && expectedGeneration === state.generation, 'migration requires the exact reviewed idle generation');
  const next = clone(state); next.schemaVersion = 2;
  next.batchProtocol = {kind: 'cars-account-batch-protocol-v2', maximum: PACK_BATCH_MAXIMUM, migratedFromSha256: queueDigest(state), capacityFloor: state.baseline.workerNames.length};
  next.generation++; next.updatedAt = now; validatePackBatchQueue(next); return next;
}

export function reservePackBatch(state, {owner, batchToken = randomUUID(), requestIds, maximum = 2, slotTokens = {}, snapshot, challenge, resources, allocations, now = new Date().toISOString()} = {}) {
  return nextState(state, now, next => {
    assert(next.active === null, 'account batch already owned; no expiry or stealing');
    assert(Number.isInteger(maximum) && maximum > 0 && maximum <= PACK_BATCH_MAXIMUM && token(batchToken), 'batch maximum is one or two');
    const ids = requestIds ?? next.order.filter(id => next.requests[id].status === 'queued').slice(0, maximum);
    assert(Array.isArray(ids) && ids.length > 0 && ids.length <= maximum && new Set(ids).size === ids.length, 'exact bounded member list required');
    const requests = ids.map(id => {assert(next.requests[id]?.status === 'queued', 'only queued requests may be admitted'); return next.requests[id].request;});
    for (const request of requests) {
      assert(packDeploymentRequest(request).id === request.id && request.action === 'deploy' && !next.baseline.workerNames.includes(request.workerName), 'only canonical new deployments may enter a batch');
      assert(!(next.receipts[request.slug]?.length) && !Object.values(next.requests).some(row => row.request.id !== request.id && related(row.request, request) &&
        ['failed', 'rolled-back', 'needs-reconciliation', 'active', 'deployed'].includes(row.status)), 'failed, owned or uncertain dealer cannot be automatically retried');
    }
    assert(challenge?.stage === 'before-batch-reservation' && timestamp(challenge.notBefore) && Date.parse(challenge.notBefore) >= Date.parse(next.updatedAt), 'fresh batch-reservation challenge required');
    // This maintained pure validator receives the actual V2 queue, never a V1 view.
    const capacity = validatePackProviderSnapshot(snapshot, {challenge, request: requests[0], queue: next, now: Date.parse(now)});
    assert(capacity.snapshot.scriptCount >= next.batchProtocol.capacityFloor && capacity.available >= ids.length, 'insufficient fresh capacity for the whole batch');
    for (const request of requests) assert(!snapshot.scripts.some(row => row.name === request.workerName) &&
      !snapshot.routes.some(row => row.pattern === new URL(request.publicOrigin).hostname + '/*' || row.script === request.workerName) &&
      !snapshot.domains.some(row => row.hostname === new URL(request.publicOrigin).hostname || row.service === request.workerName), 'batch target already exists or has a route/domain');
    // The future allocator must measure physical resources during/after this
    // authenticated provider-read window, using its same admission-age limit.
    const resourceObservedAt = Date.parse(resources?.observedAt), admissionAt = Date.parse(now);
    assert(resources && timestamp(resources.observedAt) && resourceObservedAt >= Date.parse(challenge.notBefore) &&
      resourceObservedAt >= Date.parse(snapshot.startedAt) && resourceObservedAt <= admissionAt &&
      admissionAt - resourceObservedAt <= PACK_SNAPSHOT_MAX_AGE_MS, 'fresh checked runtime resources required');
    const slots = {};
    for (const id of ids) {validateResources(allocations?.[id]); slots[id] = {requestId: id, token: slotTokens[id] ?? randomUUID(), claimedAt: now, status: 'active', resources: clone(allocations[id]), createIntent: null, acknowledgement: null};
      const row = next.requests[id]; row.status = 'active'; row.events.push({kind: 'batch-claimed', at: now, owner});}
    next.active = {kind: 'cars-account-owned-batch-v2', owner, token: batchToken, claimedAt: now, memberIds: [...ids], slots, settled: {}, held: false, createInFlight: null,
      capacity: {snapshotSha256: queueDigest(snapshot), observedAt: snapshot.observedAt, observedScripts: snapshot.scriptCount, allowedScripts: next.policy.allowedScripts, minimumSpareScripts: next.policy.minimumSpareScripts, reserved: [...ids], created: {}}, resources: clone(resources)};
    next.batchProtocol.capacityFloor = Math.max(next.batchProtocol.capacityFloor, snapshot.scriptCount);
    return ids.map(id => ({queueId: next.queueId, owner, batchToken, requestId: id, token: slots[id].token}));
  });
}

export function assertPackBatchMember(state, claim) {
  validatePackBatchQueue(state); const batch = state.active, slot = batch?.slots[claim?.requestId];
  assert(batch && state.queueId === claim.queueId && batch.owner === claim.owner && batch.token === claim.batchToken && slot?.token === claim.token, 'account or member fence was lost');
  assert(slot.status === 'active', 'uncertain member requires positive reconciliation'); return slot;
}

export function beginBatchWorkerCreate(state, claim, {intentId = randomUUID(), now = new Date().toISOString()} = {}) {
  assertPackBatchMember(state, claim);
  return nextState(state, now, next => {
    const batch = next.active, slot = batch.slots[claim.requestId];
    assert(!batch.held && batch.createInFlight === null && slot.createIntent === null && slot.acknowledgement === null && token(intentId), 'create gate is held or member already attempted creation');
    slot.createIntent = {id: intentId, at: now}; batch.createInFlight = claim.requestId;
    next.requests[claim.requestId].events.push({kind: 'worker-create-intent', at: now, workerName: next.requests[claim.requestId].request.workerName}); return clone(slot.createIntent);
  });
}

export function acknowledgeBatchWorkerCreate(state, claim, acknowledgement, {now = new Date().toISOString()} = {}) {
  assertPackBatchMember(state, claim);
  return nextState(state, now, next => {
    const batch = next.active, slot = batch.slots[claim.requestId], request = next.requests[claim.requestId].request;
    assert(batch.createInFlight === claim.requestId && slot.createIntent && !slot.acknowledgement && workerId(acknowledgement?.workerId) &&
      acknowledgement.workerName === request.workerName && acknowledgement.intentId === slot.createIntent.id && equal(acknowledgement.ownershipTags, packOwnershipTags(next, request)), 'positive exact Worker acknowledgement required');
    const ack = {...clone(acknowledgement), at: now}; slot.acknowledgement = ack; batch.capacity.created[claim.requestId] = clone(ack);
    batch.capacity.reserved = batch.capacity.reserved.filter(id => id !== claim.requestId); batch.createInFlight = null;
    next.requests[claim.requestId].events.push({kind: 'worker-create-observed', at: now, workerId: ack.workerId, workerName: ack.workerName, ownershipTags: clone(ack.ownershipTags)}); return clone(ack);
  });
}

function exactReceipt(state, slot, receipt, deployed) {
  const request = state.requests[slot.requestId].request;
  assert(slot.acknowledgement && receipt?.schemaVersion === 1 && receipt.type === 'cars-dealer-pack-deployment' && receipt.status === 'deployed' && receipt.queueId === state.queueId &&
    receipt.requestId === request.id && receipt.accountId === state.accountId && receipt.zoneId === state.zoneId && timestamp(receipt.finishedAt) &&
    ['slug', 'dealerId', 'batch', 'workerName', 'publicOrigin', 'packDigest', 'releaseId', 'releaseDigest', 'outputDigest', 'sourceCommit'].every(key => receipt[key] === request[key]) &&
    receipt.workerId === slot.acknowledgement?.workerId && uuid(receipt.versionId) && typeof receipt.routeId === 'string' && receipt.routeId.length > 0 &&
    equal(receipt.ownershipTags, slot.acknowledgement.ownershipTags) && receipt.ownerAccepted === false && receipt.outreachPerformed === false, 'receipt differs from its exact acknowledged member');
  if (deployed) {
    assert(receipt.hostedVerified === true && receipt.hosted?.reportScope === 'compact-acceptance-summary' && hex(receipt.hosted.sha256) &&
      receipt.hosted.summarySha256 === queueDigest(receipt.hosted.report), 'qualified hosted receipt evidence required');
    validateHostedPackResult(receipt.hosted.report, request, receipt.versionId);
  } else assert(receipt.hostedVerified === false && typeof receipt.hostedFailure === 'string' && receipt.hostedFailure.length > 0, 'failed owned deployment needs its explicit hosted refusal');
}

export function finishPackBatchMember(state, claim, {status, receipt, error, now = new Date().toISOString()} = {}) {
  assertPackBatchMember(state, claim);
  assert(['deployed', 'failed', 'needs-reconciliation'].includes(status), 'unsupported member finish status');
  return nextState(state, now, next => {
    const batch = next.active, slot = batch.slots[claim.requestId], row = next.requests[claim.requestId];
    if (status === 'needs-reconciliation') {assert(receipt === undefined, 'uncertain receipt cannot claim qualification'); slot.status = row.status = status; batch.held = true;
      row.events.push({kind: status, at: now, ...(error ? {error: String(error).slice(0, 2000)} : {})}); return {status, accountHeld: true};}
    assert(!slot.createIntent || slot.acknowledgement, 'unacknowledged create intent must remain reserved for reconciliation');
    if (status === 'deployed' || slot.acknowledgement) exactReceipt(next, slot, receipt, status === 'deployed');
    else assert(receipt === undefined, 'pre-create failure cannot fabricate an owned receipt');
    row.status = status; row.finishedAt = now; if (error) row.error = String(error).slice(0, 2000);
    if (receipt) {const sha256 = queueDigest(receipt); (next.receipts[row.request.slug] ??= []).push({sha256, receipt: clone(receipt)}); row.receiptSha256 = sha256;}
    row.events.push({kind: status, at: now}); batch.settled[claim.requestId] = {status, receiptSha256: row.receiptSha256 ?? null};
    delete batch.slots[claim.requestId]; batch.capacity.reserved = batch.capacity.reserved.filter(id => id !== claim.requestId);
    return {status, receiptSha256: row.receiptSha256 ?? null, accountHeld: true};
  });
}

export function releaseEmptyPackBatch(state, claim, {now = new Date().toISOString()} = {}) {
  return nextState(state, now, next => {
    const batch = next.active;
    assert(batch && claim?.queueId === next.queueId && claim.owner === batch.owner && claim.batchToken === batch.token, 'account batch fence was lost');
    assert(!batch.held && Object.keys(batch.slots).length === 0 && batch.memberIds.every(id => batch.settled[id]) &&
      batch.createInFlight === null && batch.capacity.reserved.length === 0, 'only an explicitly empty fully settled batch may be released');
    next.batchProtocol.capacityFloor = Math.max(next.batchProtocol.capacityFloor, batch.capacity.observedScripts + Object.keys(batch.capacity.created).length);
    next.active = null; return {released: true};
  });
}
