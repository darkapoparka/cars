/** Read-only native-source discovery. A run result is never bundle qualification. */
import {PACK_QUEUE_REPOSITORY} from './dealer-pack-queue.mjs';

const workflow = '.github/workflows/dealer-pack-pipeline.yml';
const api = '/repos/' + PACK_QUEUE_REPOSITORY;
const listPath = api + '/actions/workflows/dealer-pack-pipeline.yml/runs';
const hex = (value, size) => typeof value === 'string' && new RegExp('^[a-f0-9]{' + size + '}$').test(value);
const positiveId = value => Number.isSafeInteger(value) && value > 0;
const activeStatuses = new Set(['queued', 'in_progress', 'waiting', 'pending', 'requested']);
const conclusions = new Set(['success', 'failure', 'cancelled', 'timed_out', 'action_required', 'neutral', 'skipped', 'stale', 'startup_failure']);
const assert = (ok, message) => {if (!ok) throw Error(message);};

function exactNativeRun(run, now, {original = false} = {}) {
  return positiveId(run?.id) && run.path === workflow &&
    run.repository?.full_name === PACK_QUEUE_REPOSITORY && run.head_repository?.full_name === PACK_QUEUE_REPOSITORY &&
    run.head_branch === 'main' && run.event === 'workflow_dispatch' && hex(run.head_sha, 40) &&
    Number.isSafeInteger(run.run_attempt) && run.run_attempt >= 1 && run.run_attempt <= 100 && (!original || run.run_attempt === 1) &&
    typeof run.display_title === 'string' && run.display_title.length <= 256 &&
    Number.isFinite(Date.parse(run.created_at)) && Date.parse(run.created_at) <= now + 300000 &&
    (activeStatuses.has(run.status) && run.conclusion === null || run.status === 'completed' && conclusions.has(run.conclusion));
}

/** Preserve only actual API identity fields needed by campaign binding. */
function proof(run) {
  return {id: run.id, path: run.path, repository: {full_name: run.repository.full_name},
    head_repository: {full_name: run.head_repository.full_name}, head_branch: run.head_branch, event: run.event,
    head_sha: run.head_sha, run_attempt: run.run_attempt, display_title: run.display_title,
    status: run.status, conclusion: run.conclusion, created_at: run.created_at,
    ...(typeof run.updated_at === 'string' ? {updated_at: run.updated_at} : {})};
}

export async function discoverSourcePipelineRuns({readGithub, reservation, externalRuns = [], now = Date.now(), maximumPages = 5} = {}) {
  assert(typeof readGithub === 'function' && Number.isFinite(now), 'Authenticated GitHub reader and observation time required');
  assert(Number.isSafeInteger(maximumPages) && maximumPages >= 1 && maximumPages <= 5, 'Use one to five bounded discovery pages below the API search ceiling');
  assert(Array.isArray(externalRuns) && externalRuns.length <= 100 && new Set(externalRuns.map(row => row?.runId)).size === externalRuns.length &&
    externalRuns.every(row => positiveId(row?.runId) && hex(row.sourceSha, 40)), 'Use at most one hundred distinct retained external source run bindings');
  let retainedRunId;
  if (reservation !== undefined && reservation !== null) {
    assert(hex(reservation.id, 64) && hex(reservation.sourceSha, 40), 'Exact retained reservation nonce and source required');
    retainedRunId = reservation.run?.id ?? reservation.runId;
    assert(retainedRunId === undefined || positiveId(retainedRunId), 'Exact retained reservation run identity required');
    assert(reservation.run?.id === undefined || reservation.runId === undefined || reservation.run.id === reservation.runId, 'Retained reservation run identities differ');
    assert(reservation.createdAt === undefined || Number.isFinite(Date.parse(reservation.createdAt)) && Date.parse(reservation.createdAt) <= now + 300000, 'Valid retained reservation time required');
  }
  const reasons = [], active = new Map(), candidates = new Map(), externalRunStatuses = [];
  let incomplete = false, malformed = false, reservationRun = null;
  const title = reservation ? 'Cars rollout ' + reservation.id : null;
  const note = reason => {if (!reasons.includes(reason)) reasons.push(reason);};
  const observeCandidate = run => {
    if (reservation && (run?.display_title?.includes?.(reservation.id) || retainedRunId !== undefined && run?.id === retainedRunId)) candidates.set(run.id, run);
  };
  const list = async (label, query) => {
    const seen = new Set(), rows = []; let total;
    try {
      for (let page = 1; page <= maximumPages; page++) {
        const reply = await readGithub({method: 'GET', path: listPath, query: {...query, per_page: 100, page}});
        assert(reply?.status === 200 && Array.isArray(reply.body?.workflow_runs) && Number.isSafeInteger(reply.body.total_count) && reply.body.total_count >= 0,
          'invalid listing');
        total ??= reply.body.total_count;
        assert(total === reply.body.total_count && total <= maximumPages * 100 && reply.body.workflow_runs.length <= 100, 'incomplete listing');
        for (const run of reply.body.workflow_runs) {
          assert(positiveId(run?.id) && !seen.has(run.id), 'repeated or missing run identity'); seen.add(run.id);
          assert(!query.status || run.status === query.status, 'listing status differs');
          rows.push(run);
        }
        assert(rows.length <= total, 'listing exceeds total');
        if (rows.length === total) return rows;
        assert(reply.body.workflow_runs.length === 100 && page < maximumPages, 'truncated listing');
      }
    } catch {
      incomplete = true; note('Incomplete authenticated ' + label + ' pipeline inventory; no new dispatch is safe');
    }
    return rows;
  };
  // Query queued first so a queued -> running transition can be seen in either
  // inventory. This read is an observation, not a lock on manual workflow starts.
  for (const status of ['queued', 'in_progress']) {
    const rows = await list(status, {branch: 'main', event: 'workflow_dispatch', status});
    for (const run of rows) {
      observeCandidate(run);
      if (!exactNativeRun(run, now)) {malformed = true; note('An active pipeline identity differs from the authenticated native main contract'); continue;}
      active.set(run.id, proof(run));
    }
  }
  if (reservation) {
    // Do not filter source SHA: a nonce dispatched at a wrong source must be held,
    // rather than disappearing from discovery and inviting another POST.
    const since = reservation.createdAt === undefined ? now - 7 * 86400000 : Date.parse(reservation.createdAt) - 300000;
    const rows = await list('reservation', {branch: 'main', event: 'workflow_dispatch', created: '>=' + new Date(since).toISOString()});
    for (const run of rows) {
      observeCandidate(run);
      if (activeStatuses.has(run.status)) {
        if (!exactNativeRun(run, now)) {malformed = true; note('A recent active pipeline identity differs from the native main contract');}
        else active.set(run.id, proof(run));
      }
    }
    if (candidates.size !== 1) note(candidates.size ? 'Multiple native runs refer to the retained rollout nonce; reconciliation required' : 'No native run is bound to the retained rollout nonce; never redispatch an existing reservation');
    else {
      const [id, listed] = [...candidates][0];
      try {
        assert(exactNativeRun(listed, now, {original: true}) && listed.display_title === title && listed.head_sha === reservation.sourceSha &&
          (retainedRunId === undefined || id === retainedRunId), 'inexact listed reservation');
        const reply = await readGithub({method: 'GET', path: api + '/actions/runs/' + id});
        const run = reply?.body;
        assert(reply?.status === 200 && run?.id === id && exactNativeRun(run, now, {original: true}) &&
          run.display_title === title && run.head_sha === reservation.sourceSha && run.created_at === listed.created_at,
          'inexact reservation detail');
        reservationRun = proof(run);
        if (activeStatuses.has(run.status)) active.set(id, reservationRun);
        else active.delete(id);
      } catch {note('The retained rollout run is unavailable, rerun, or differs from its exact nonce/source/native identity');}
    }
  }
  for (const binding of externalRuns) {
    try {
      const reply = await readGithub({method: 'GET', path: api + '/actions/runs/' + binding.runId}), run = reply?.body;
      assert(reply?.status === 200 && run?.id === binding.runId && exactNativeRun(run, now) && run.head_sha === binding.sourceSha,
        'inexact external run');
      const actual = proof(run);
      externalRunStatuses.push({runId: binding.runId, sourceSha: binding.sourceSha, run: actual, needsReconciliation: false});
      if (activeStatuses.has(run.status)) active.set(run.id, actual);
      else active.delete(run.id);
      // Completion is only an observed source status. The campaign barrier must
      // remain until maintained automatic terminal intake and a fresh queue read.
    } catch {
      malformed = true;
      const reason = 'Retained external source run ' + binding.runId + ' is unavailable or differs; its intake barrier remains held';
      note(reason); externalRunStatuses.push({runId: binding.runId, sourceSha: binding.sourceSha, run: null, needsReconciliation: true, reason});
    }
  }
  const activeRuns = [...active.values()].sort((a, b) => a.id - b.id);
  const untracked = activeRuns.filter(run => run.id !== reservationRun?.id);
  const unknownActive = incomplete || malformed || untracked.length > 0;
  if (untracked.length) note('Untracked active native pipelines defer a new source cohort');
  return {unknownActive, activeRuns, reservationRun, externalRunStatuses,
    needsReconciliation: incomplete || malformed || Boolean(reservation && !reservationRun), reasons};
}
