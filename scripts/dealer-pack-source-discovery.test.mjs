import test from 'node:test';
import assert from 'node:assert/strict';
import {discoverSourcePipelineRuns} from './lib/dealer-pack-source-discovery.mjs';

const now = Date.parse('2026-10-21T00:00:00Z'), sha = 'a'.repeat(40), nonce = 'b'.repeat(64);
const api = '/repos/darkapoparka/cars', listPath = api + '/actions/workflows/dealer-pack-pipeline.yml/runs';
const reservation = {id: nonce, sourceSha: sha, createdAt: '2026-10-20T23:00:00Z'};
const run = (changes = {}) => ({id: 101, path: '.github/workflows/dealer-pack-pipeline.yml',
  repository: {full_name: 'darkapoparka/cars'}, head_repository: {full_name: 'darkapoparka/cars'},
  head_branch: 'main', event: 'workflow_dispatch', head_sha: sha, run_attempt: 1,
  display_title: 'Cars rollout ' + nonce, status: 'in_progress', conclusion: null,
  created_at: '2026-10-20T23:01:00Z', updated_at: '2026-10-20T23:02:00Z', ...changes});
function reader({queued = [], running = [], recent = [], detail, intercept} = {}) {
  const calls = [];
  const readGithub = async request => {
    calls.push(request); assert.equal(request.method, 'GET'); assert.equal(request.body, undefined);
    if (intercept) {const reply = await intercept(request); if (reply !== undefined) return reply;}
    if (request.path === listPath) {
      assert.equal(request.query.branch, 'main'); assert.equal(request.query.event, 'workflow_dispatch'); assert.equal(request.query.per_page, 100);
      const rows = request.query.status === 'queued' ? queued : request.query.status === 'in_progress' ? running : recent;
      return {status: 200, body: {total_count: rows.length, workflow_runs: rows.slice((request.query.page - 1) * 100, request.query.page * 100)}};
    }
    const match = request.path.match(/\/actions\/runs\/([0-9]+)$/); assert(match);
    const id = Number(match[1]);
    return {status: 200, body: detail ?? recent.find(row => row.id === id) ?? running.find(row => row.id === id) ?? queued.find(row => row.id === id)};
  };
  return {readGithub, calls};
}

test('an empty complete active inventory permits planning without looking for plans or artifacts', async () => {
  const f = reader(), result = await discoverSourcePipelineRuns({...f, now});
  assert.deepEqual(result, {unknownActive: false, activeRuns: [], reservationRun: null, externalRunStatuses: [], needsReconciliation: false, reasons: []});
  assert.equal(f.calls.length, 2); assert(f.calls.every(row => row.path === listPath));
});

test('any untracked queued/running producer defers a new cohort even at an older source', async () => {
  const queued = run({id: 100, status: 'queued', head_sha: 'c'.repeat(40), display_title: 'Owner selected 24 packs'});
  const f = reader({queued: [queued], running: [run({display_title: 'Another owner run'})]});
  const result = await discoverSourcePipelineRuns({...f, now});
  assert.equal(result.unknownActive, true); assert.equal(result.needsReconciliation, false); assert.equal(result.activeRuns.length, 2);
  assert.equal(result.reservationRun, null); assert.equal(f.calls.length, 2);
});

test('exact reservation original run binds only after authenticated detail and stays source-only', async () => {
  const current = run(), f = reader({running: [current], recent: [current]});
  const result = await discoverSourcePipelineRuns({...f, reservation, now});
  assert.equal(result.unknownActive, false); assert.equal(result.needsReconciliation, false);
  assert.deepEqual(result.reservationRun, current); assert.equal(result.reservationRun.qualified, undefined);
  assert.equal(f.calls.length, 4); assert.match(f.calls[2].query.created, /^>=2026-10-20T22:55:00/);
});

test('completed success and failure both reconcile exact source outcomes without qualification', async () => {
  for (const conclusion of ['success', 'failure', 'cancelled']) {
    const current = run({status: 'completed', conclusion}), f = reader({recent: [current]});
    const result = await discoverSourcePipelineRuns({...f, reservation, now});
    assert.equal(result.needsReconciliation, false); assert.equal(result.unknownActive, false); assert.deepEqual(result.activeRuns, []);
    assert.equal(result.reservationRun.conclusion, conclusion); assert.equal(result.reservationRun.hostedVerified, undefined);
  }
});

test('main advancing does not prevent an old reservation source from reconciling', async () => {
  const current = run({status: 'completed', conclusion: 'failure'}), f = reader({recent: [current]});
  const result = await discoverSourcePipelineRuns({...f, reservation, now});
  assert.equal(result.reservationRun.head_sha, reservation.sourceSha);
  assert(f.calls.every(row => !row.path.includes('/git/ref/')));
});

test('wrong source, rerun, foreign repository, path, event, branch or malformed nonce title stays held', async () => {
  for (const changes of [{head_sha: 'c'.repeat(40)}, {run_attempt: 2}, {repository: {full_name: 'foreign/cars'}},
    {head_repository: {full_name: 'foreign/cars'}}, {path: '.github/workflows/other.yml'}, {event: 'push'},
    {head_branch: 'other'}, {display_title: 'Cars rollout ' + nonce + ' extra'}, {conclusion: 'success'}]) {
    const current = run(changes), f = reader({recent: [current]});
    const result = await discoverSourcePipelineRuns({...f, reservation, now});
    assert.equal(result.needsReconciliation, true, JSON.stringify(changes)); assert.equal(result.reservationRun, null);
    assert.equal(f.calls.filter(row => row.path !== listPath).length, 0);
  }
});

test('detail changes or a different retained run ID cannot replace the reserved source run', async () => {
  for (const detail of [run({head_sha: 'c'.repeat(40)}), run({run_attempt: 2}), run({id: 102}), run({display_title: 'Other rollout'})]) {
    const f = reader({recent: [run()], detail}), result = await discoverSourcePipelineRuns({...f, reservation, now});
    assert.equal(result.needsReconciliation, true); assert.equal(result.reservationRun, null);
  }
  const f = reader({recent: [run()]}), result = await discoverSourcePipelineRuns({...f, reservation: {...reservation, run: {id: 102}}, now});
  assert.equal(result.needsReconciliation, true); assert.equal(result.reservationRun, null);
});

test('missing and multiple nonce matches require reconciliation and never imply another dispatch', async () => {
  for (const recent of [[], [run(), run({id: 102})]]) {
    const f = reader({recent}), result = await discoverSourcePipelineRuns({...f, reservation, now});
    assert.equal(result.needsReconciliation, true); assert.equal(result.reservationRun, null);
    assert.equal(f.calls.filter(row => row.path !== listPath).length, 0);
  }
});

test('an exact bound reservation does not exempt unrelated active native work', async () => {
  const f = reader({running: [run(), run({id: 102, display_title: 'Owner work'})], recent: [run()]});
  const result = await discoverSourcePipelineRuns({...f, reservation, now});
  assert.equal(result.reservationRun.id, 101); assert.equal(result.unknownActive, true); assert.equal(result.activeRuns.length, 2);
});

test('bounded complete pagination retains every active producer', async () => {
  const running = Array.from({length: 101}, (_, index) => run({id: index + 1, display_title: 'Untracked ' + index}));
  const f = reader({running}), result = await discoverSourcePipelineRuns({...f, now});
  assert.equal(result.activeRuns.length, 101); assert.equal(result.needsReconciliation, false); assert.equal(result.unknownActive, true);
  assert.equal(f.calls.filter(row => row.query.status === 'in_progress').length, 2);
});

test('truncated, changing, repeated or excessive pagination fails closed rather than reporting empty', async () => {
  for (const body of [{total_count: 1, workflow_runs: []}, {total_count: 501, workflow_runs: []},
    {total_count: 2, workflow_runs: [run(), run()]}, {total_count: 0, workflow_runs: [run()]}]) {
    const f = reader({intercept: request => request.query?.status === 'queued' ? {status: 200, body} : undefined});
    const result = await discoverSourcePipelineRuns({...f, now}); assert.equal(result.unknownActive, true); assert.equal(result.needsReconciliation, true);
  }
  const first = Array.from({length: 100}, (_, index) => run({id: index + 1, status: 'queued'}));
  const f = reader({intercept: request => request.query?.status === 'queued' ? {status: 200,
    body: request.query.page === 1 ? {total_count: 101, workflow_runs: first} : {total_count: 102, workflow_runs: [run({id: 101, status: 'queued'})]}} : undefined});
  assert.equal((await discoverSourcePipelineRuns({...f, now})).needsReconciliation, true);
});

test('API denial, timeout, malformed active fields and incomplete nonce history hold conservatively', async () => {
  for (const intercept of [request => request.query?.status === 'queued' ? {status: 403, body: {secret: 'never retained'}} : undefined,
    request => {if (request.query?.status === 'queued') throw Error('private transport details');},
    request => !request.query?.status ? {status: 200, body: {total_count: 1, workflow_runs: []}} : undefined]) {
    const f = reader({intercept}), result = await discoverSourcePipelineRuns({...f, reservation, now});
    assert.equal(result.unknownActive, true); assert.equal(result.needsReconciliation, true);
    assert(!JSON.stringify(result).includes('secret')); assert(!JSON.stringify(result).includes('private transport'));
  }
  const f = reader({running: [run({repository: {full_name: 'foreign/cars'}})]});
  assert.equal((await discoverSourcePipelineRuns({...f, now})).unknownActive, true);
});

test('retained legacy run IDs survive an empty active inventory and report exact terminal statuses without clearing intake', async () => {
  for (const conclusion of ['success', 'failure', 'cancelled']) {
    const current = run({id: 88, run_attempt: 2, display_title: 'Earlier owner source', status: 'completed', conclusion});
    const f = reader({detail: current}), binding = {runId: 88, sourceSha: sha, terminalIntakeComplete: false};
    const result = await discoverSourcePipelineRuns({...f, externalRuns: [binding], now});
    assert.equal(result.needsReconciliation, false); assert.equal(result.unknownActive, false);
    assert.deepEqual(result.externalRunStatuses, [{runId: 88, sourceSha: sha, run: current, needsReconciliation: false}]);
    assert.equal(binding.terminalIntakeComplete, false); assert.equal(result.externalRunStatuses[0].terminalIntakeComplete, undefined);
    assert.deepEqual(result.activeRuns, []); assert.equal(f.calls.length, 3);
  }
});

test('retained external active runs remain globally blocking and keep exact IDs and source SHA', async () => {
  const current = run({id: 88, head_sha: 'd'.repeat(40), run_attempt: 2, display_title: 'Earlier owner source'}), f = reader({detail: current});
  const result = await discoverSourcePipelineRuns({...f, externalRuns: [{runId: 88, sourceSha: current.head_sha}], now});
  assert.equal(result.unknownActive, true); assert.equal(result.needsReconciliation, false);
  assert.deepEqual(result.activeRuns, [current]); assert.equal(result.externalRunStatuses[0].run.head_sha, current.head_sha);
});

test('missing or changed external run detail holds the exact durable barrier instead of permitting a new build', async () => {
  for (const detail of [undefined, run({id: 89}), run({id: 88, head_sha: 'e'.repeat(40)}),
    run({id: 88, head_repository: {full_name: 'foreign/cars'}}), run({id: 88, event: 'push'}), run({id: 88, path: '.github/workflows/other.yml'})]) {
    const f = reader({detail}), result = await discoverSourcePipelineRuns({...f, externalRuns: [{runId: 88, sourceSha: sha}], now});
    assert.equal(result.unknownActive, true); assert.equal(result.needsReconciliation, true);
    assert.equal(result.externalRunStatuses[0].runId, 88); assert.equal(result.externalRunStatuses[0].run, null);
    assert.equal(result.externalRunStatuses[0].needsReconciliation, true);
  }
});

test('invalid retained input is refused without making any read', async () => {
  const f = reader();
  for (const options of [{reservation: {id: 'short', sourceSha: sha}}, {reservation: {...reservation, runId: 0}},
    {reservation: {...reservation, runId: 1, run: {id: 2}}}, {maximumPages: 6}, {now: NaN},
    {externalRuns: [{runId: 0, sourceSha: sha}]}, {externalRuns: [{runId: 1, sourceSha: 'bad'}]},
    {externalRuns: [{runId: 1, sourceSha: sha}, {runId: 1, sourceSha: sha}]},
    {externalRuns: Array.from({length: 101}, (_, index) => ({runId: index + 1, sourceSha: sha}))}]) {
    await assert.rejects(discoverSourcePipelineRuns({...f, now, ...options}));
  }
  assert.equal(f.calls.length, 0);
});
