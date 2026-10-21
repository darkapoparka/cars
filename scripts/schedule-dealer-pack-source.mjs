/** Source preparation scheduler. Native qualification and provider ownership stay
 * in the existing pipeline, automatic intake and deployment queue. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash, randomBytes} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {ROOT} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {readPackFiles, listDealerPacks, validPackSlug} from './lib/dealer-pack.mjs';
import {readPackBatchAssignments} from './lib/dealer-pack-identity.mjs';
import {PACK_QUEUE_REPOSITORY, githubPackQueueStore, validatePackQueue, queueDigest} from './lib/dealer-pack-queue.mjs';
import {registerSourceCampaign, validateSourceCampaign, mutateSourceCampaign, gitSourceCampaignStore,
  reserveSourceCohort, bindSourceCohortRun, finishSourceCohort, holdSourceCohort, syncSourceCampaignTargets,
  hasAttemptedSourceMaterial, observeSourceExternalRuns, completeSourceExternalRunIntake, completeSourceOwnedRunIntake, SOURCE_COHORT_MAX} from './lib/dealer-pack-source-campaign.mjs';
import {discoverSourcePipelineRuns} from './lib/dealer-pack-source-discovery.mjs';
import {checkDealerPackInputs} from './check-dealer-pack-inputs.mjs';
import {githubPackTransport} from './deploy-dealer-packs.mjs';

const api = '/repos/' + PACK_QUEUE_REPOSITORY;
const assert = (ok, message) => {if (!ok) throw Error(message);};
const hex = (value, length) => typeof value === 'string' && new RegExp('^[a-f0-9]{' + length + '}$').test(value);
const hash = value => createHash('sha256').update(value).digest('hex');
const blob = bytes => createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex');
const clock = value => typeof value === 'function' ? value() : value ?? Date.now();
const dated = value => new Date(clock(value)).toISOString();
const readGit = (root, args) => {
  const result = spawnSync('git', ['-C', root, ...args], {encoding: 'utf8', maxBuffer: 4 * 1024 ** 2, timeout: 30000,
    windowsHide: true, env: {...process.env, GIT_NO_LAZY_FETCH: '1', GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never'}});
  assert(result.status === 0 && !result.signal && typeof result.stdout === 'string', 'Exact committed source metadata is unavailable; no implicit source download is allowed');
  return result.stdout;
};

/** Material changes, rather than unrelated main commits, permit another attempt. */
export function dealerPackSourceBuildMaterial({root = ROOT, sourceSha, git = readGit} = {}) {
  assert(hex(sourceSha, 40), 'Exact published source SHA required');
  const paths = ['scripts', 'templates.lock.json', '.github/workflows/dealer-pack-pipeline.yml'];
  const objects = git(root, ['rev-parse', ...paths.map(name => sourceSha + ':' + name)]).trim().split(/\r?\n/);
  assert(objects.length === paths.length && objects.every(value => hex(value, 40)), 'Exact shared build source objects required');
  const [scriptsTree, lockBlob, nativeWorkflowBlob] = objects;
  return {scriptsTree, lockBlob, nativeWorkflowBlob,
    buildFingerprint: queueDigest({kind: 'cars-source-build-material-v1', scriptsTree, lockBlob, nativeWorkflowBlob})};
}
export const dealerPackSourceBuildFingerprint = options => dealerPackSourceBuildMaterial(options).buildFingerprint;

export function inspectSourcePackMaterial({root = ROOT, slug, dealerId, sourceSha, git = readGit} = {}) {
  assert(validPackSlug(slug) && hex(sourceSha, 40), 'Exact source pack path and commit required');
  const files = readPackFiles(path.join(root, 'dealers', slug)), manifest = JSON.parse(files.get('dealer.json'));
  assert(manifest.slug === slug && manifest.dealerId === dealerId && manifest.pack?.benchmarkOnly !== true, 'Source pack identity differs from its assigned target');
  const prefix = 'dealers/' + slug + '/', entries = git(root, ['ls-tree', '-r', '--full-tree', '-z', sourceSha, '--', prefix]).split('\0').filter(Boolean);
  assert(entries.length === files.size, 'Physical source pack differs from the published file inventory');
  const seen = new Set();
  for (const entry of entries) {
    const match = /^(100644|100755) blob ([a-f0-9]{40})\t(.+)$/.exec(entry);
    assert(match && match[3].startsWith(prefix), 'Published pack has a non-regular or foreign member');
    const relative = match[3].slice(prefix.length), bytes = files.get(relative);
    assert(bytes && !seen.has(relative) && blob(bytes) === match[2], 'Physical pack bytes differ from their exact published source'); seen.add(relative);
  }
  const rows = [...files].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([name, bytes]) => ({path: name, sha256: hash(bytes)}));
  return {packDigest: hash(JSON.stringify(rows))};
}

async function mainSource(readGithub) {
  const reply = await readGithub({method: 'GET', path: api + '/git/ref/heads/main'});
  assert(reply?.status === 200 && reply.body?.ref === 'refs/heads/main' && reply.body.object?.type === 'commit' && hex(reply.body.object.sha, 40), 'Authenticated published main source is unavailable');
  return reply.body.object.sha;
}

/** One POST only. A lost response never authorizes a second dispatch. */
export async function dispatchDealerPackSource({sourceSha, rolloutRequestId, slugs, token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN, fetchImpl = fetch} = {}) {
  assert(hex(sourceSha, 40) && hex(rolloutRequestId, 64) && Array.isArray(slugs) && slugs.length > 0 && slugs.length <= SOURCE_COHORT_MAX &&
    new Set(slugs).size === slugs.length && slugs.every(validPackSlug) && typeof token === 'string' && token.length > 10, 'Authenticated bounded exact-source native dispatch required');
  const response = await fetchImpl('https://api.github.com' + api + '/actions/workflows/dealer-pack-pipeline.yml/dispatches', {
    method: 'POST', redirect: 'error', headers: {Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'},
    body: JSON.stringify({ref: 'main', inputs: {slugs: JSON.stringify(slugs), rollout_request_id: rolloutRequestId, rollout_source_sha: sourceSha}}), signal: AbortSignal.timeout(30000),
  });
  if (response.status === 204) return {httpStatus: 204};
  if (response.status === 200) {
    const body = await response.json(), id = body?.workflow_run_id;
    assert(Number.isSafeInteger(id) && id > 0 && body.run_url === 'https://api.github.com' + api + '/actions/runs/' + id &&
      body.html_url === 'https://github.com/' + PACK_QUEUE_REPOSITORY + '/actions/runs/' + id, 'Native dispatch acknowledgement has no exact authenticated run locator');
    return {httpStatus: 200, runId: id};
  }
  throw Error('Native dispatch outcome is unacknowledged (HTTP ' + response.status + '); retained intent must be reconciled, never retried');
}

/** Reuse the maintained resolver's already authenticated pinned source. Failed
 * materials are observations, never replacement qualified deployment requests. */
export function createDealerPackTerminalIntake({root = ROOT, resolver: suppliedResolver, runDispatcher, git = readGit} = {}) {
  let resolver = suppliedResolver;
  return async ({runId, slugs}) => {
    assert(Number.isSafeInteger(runId) && runId > 0, 'Exact terminal source run ID required');
    let slugArguments = [];
    if (slugs !== undefined) {
      assert(Array.isArray(slugs) && slugs.length > 0 && slugs.length <= SOURCE_COHORT_MAX && new Set(slugs).size === slugs.length && slugs.every(validPackSlug), 'Exact bounded owned source selection required');
      const file = path.join(root, 'runtime/dealer-pack-source/intake-' + runId + '-slugs.json');
      fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, JSON.stringify(slugs) + '\n');
      slugArguments = ['--slugs', file];
    }
    const commands = runDispatcher ? null : await import('./dispatch-dealer-pack-queue.mjs');
    resolver ??= commands.packArtifactResolver({root});
    const exitCode = process.exitCode; let intake;
    try {intake = await (runDispatcher ?? commands.runPackQueueDispatcher)(['enqueue', '--run', String(runId), '--automatic', ...slugArguments, '--report',
      path.join(root, 'runtime/dealer-pack-source/intake-' + runId + '.json')], {root, resolver});}
    finally {process.exitCode = exitCode;}
    assert(intake?.runId === runId && hex(intake.sourceCommit, 40) && Array.isArray(intake.failures), 'Exact maintained terminal intake report required');
    const failedMaterials = [];
    if (intake.failures.length) {
      assert(intake.failures.every(row => validPackSlug(row.slug)), 'Global or artifact-level intake failure needs exact source reconciliation');
      const sourceRoot = await resolver.source(intake.sourceCommit), shared = dealerPackSourceBuildMaterial({root: sourceRoot, sourceSha: intake.sourceCommit, git});
      for (const failure of new Map(intake.failures.map(row => [row.slug, row])).values()) {
        assert(validPackSlug(failure.slug), 'Global or artifact-level intake failure needs exact source reconciliation');
        const manifest = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'dealers', failure.slug, 'dealer.json'), 'utf8'));
        const material = inspectSourcePackMaterial({root: sourceRoot, slug: failure.slug, dealerId: manifest.dealerId, sourceSha: intake.sourceCommit, git});
        const packTree = git(sourceRoot, ['rev-parse', intake.sourceCommit + ':dealers/' + failure.slug]).trim();
        assert(hex(packTree, 40), 'Exact historical failed pack tree required');
        failedMaterials.push({dealerId: manifest.dealerId, slug: failure.slug, packDigest: material.packDigest, ...shared,
          sourceSha: intake.sourceCommit, packTree, reason: String(failure.reason ?? 'Maintained automatic source intake held this exact material').slice(0, 2000)});
      }
    }
    return {...intake, failedMaterials};
  };
}

const summary = state => ({campaignGeneration: state.generation, targets: state.order.length,
  retained: state.order.filter(id => state.targets[id].retainedRequestIds.length > 0).length,
  targetStates: Object.fromEntries([...new Set(state.order.map(id => state.targets[id].status))].map(status => [status, state.order.filter(id => state.targets[id].status === status).length]))});

export async function scheduleDealerPackSource({root = ROOT, assignment = readPackBatchAssignments(root), sourceSha, buildFingerprint,
  store, queueStore, readGithub = githubPackTransport(), discover = discoverSourcePipelineRuns, validateReadyPack = checkDealerPackInputs,
  dispatch = dispatchDealerPackSource, owner, now = Date.now, registerAll = true, nonce = () => randomBytes(32).toString('hex'),
  listPacks = listDealerPacks, inspectMaterial = inspectSourcePackMaterial, ensureTerminalIntake,
  readQualification = ({slug}) => JSON.parse(fs.readFileSync(path.join(root, 'dealers', slug, 'qualification.json'), 'utf8')),
  toolPackage = process.env.CARS_DEALER_PACK_TOOL_PACKAGE || path.join(root, 'runtime/dealer-pack-tools/package.json')} = {}) {
  assert(hex(sourceSha, 40) && hex(buildFingerprint, 64) && /^github:[1-9][0-9]*$/.test(owner ?? '') && typeof registerAll === 'boolean', 'Exact reviewed scheduler source, material and Actions owner required');
  store ??= gitSourceCampaignStore({request: readGithub}); queueStore ??= githubPackQueueStore({request: readGithub});
  const report = {schemaVersion: 1, type: 'cars-dealer-pack-source-scheduler', status: 'waiting', sourceSha, buildFingerprint,
    dispatches: 0, providerWrites: 0, directQueueWrites: 0, terminalIntakeCalls: 0, selected: [], observations: [], sourceCompletion: null};
  const time = () => dated(now), mutate = fn => mutateSourceCampaign(store, fn, {now: time});
  const queue = async () => {const result = await queueStore.read(); return validatePackQueue(result.state);};
  let current = await store.read();
  if (current.state === null) {
    if (!registerAll) return {...report, status: 'not-registered', targets: 0,
      reason: 'The canonical400 source campaign awaits an explicit --register-all request'};
    assert(await mainSource(readGithub) === sourceSha, 'Scheduler checkout differs from exact published main; no campaign or dispatch created');
  }
  const initialQueue = await queue();
  current = await mutate(state => registerSourceCampaign(state, {assignment, queue: initialQueue, sourceSha, now: time()}));
  current = await mutate(state => syncSourceCampaignTargets(state, {queue: initialQueue, now: time()}));
  const finishReport = (status, reason) => ({...report, status, ...(reason ? {reason} : {}), ...summary(current.state)});
  const hold = async (id, reason) => {current = await mutate(state => holdSourceCohort(state, {reservationId: id, reason, now: time()})); return finishReport('needs-reconciliation', reason);};
  const rememberExternalRuns = async (runs, reservationRunId) => {
    if (!runs.length) return;
    current = await mutate(state => {
      const owned = new Set(Object.values(state.reservations).map(row => row.run?.id).filter(Boolean));
      if (reservationRunId) owned.add(reservationRunId);
      const external = runs.filter(run => !owned.has(run.id)).map(run => ({runId: run.id, sourceSha: run.head_sha}));
      return external.length ? observeSourceExternalRuns(state, {runs: external, now: time()}) : state;
    });
  };
  const discoverRuns = async options => {
    const found = await discover(options);
    await rememberExternalRuns(found.activeRuns, found.reservationRun?.id);
    return found;
  };
  const retainedRuns = new Set();
  const retainOwnCompleted = async (reservation, run, {finish = false} = {}) => {
    assert(run?.path === '.github/workflows/dealer-pack-pipeline.yml' && run.repository?.full_name === PACK_QUEUE_REPOSITORY &&
      run.head_repository?.full_name === PACK_QUEUE_REPOSITORY && run.head_branch === 'main' && run.event === 'workflow_dispatch' &&
      run.head_sha === reservation.sourceSha && run.run_attempt === 1 && run.display_title === 'Cars rollout ' + reservation.id &&
      run.status === 'completed' && ['success', 'failure'].includes(run.conclusion) && (!reservation.run || reservation.run.id === run.id), 'Authenticated exact owned terminal run required');
    assert(typeof ensureTerminalIntake === 'function', 'Maintained terminal intake is required');
    report.terminalIntakeCalls++;
    const selected = new Map(reservation.selections.map(row => [row.slug, row])), intake = await ensureTerminalIntake({runId: run.id, slugs: [...selected.keys()]});
    assert(intake?.runId === run.id && intake.sourceCommit === reservation.sourceSha && Array.isArray(intake.requests) && Array.isArray(intake.failures) &&
      (!intake.pending || Array.isArray(intake.pending) && intake.pending.length === 0) && Array.isArray(intake.failedMaterials) &&
      intake.contracts?.runId === run.id && intake.contracts.sourceCommit === reservation.sourceSha && intake.contracts.conclusion === 'success', 'Exact completed source intake proof required');
    assert(intake.requests.every(row => selected.get(row.slug)?.dealerId === row.dealerId && row.sourceCommit === reservation.sourceSha) &&
      intake.failures.every(row => selected.has(row.slug) && typeof row.reason === 'string' && row.reason.trim()) &&
      intake.failedMaterials.length === new Set(intake.failures.map(row => row.slug)).size &&
      new Set(intake.failedMaterials.map(row => row.slug)).size === intake.failedMaterials.length && intake.failedMaterials.every(row => {
        const member = selected.get(row.slug);
        return member && intake.failures.some(failure => failure.slug === row.slug) && row.dealerId === member.dealerId && row.packDigest === member.packDigest &&
          row.buildFingerprint === member.buildFingerprint && row.sourceSha === reservation.sourceSha;
      }), 'Completed source intake contains a global, unbound or different material outcome');
    // Retain successful outputs before releasing source ownership. A lost
    // callback/CAS response can safely repeat exact automatic intake; it
    // never authorizes another source POST or drops the original intent.
    current = await mutate(async state => {
      const fresh = await queue();
      assert(reservation.selections.every(member => intake.failures.some(row => row.slug === member.slug) ||
        Object.values(fresh.requests).some(row => row.request.dealerId === member.dealerId && row.request.slug === member.slug)), 'Every completed member needs retained qualified queue identity or its exact held outcome');
      const retained = syncSourceCampaignTargets(state, {queue: fresh, now: time()});
      const completed = completeSourceOwnedRunIntake(retained, {reservationId: reservation.id, run, intake: {...intake, completed: true}, now: time()});
      return finish ? finishSourceCohort(completed, {reservationId: reservation.id, run, now: time()}) : completed;
    });
    retainedRuns.add(run.id);
    (report.sourceIntakes ??= []).push({runId: run.id, sourceSha: reservation.sourceSha, members: reservation.selections.length});
  };
  const reconcile = async (reservation, acknowledgement) => {
    // A legacy producer can finish while our own run is still building. Retain
    // its exact identity now, so disappearing from active listings cannot erase
    // the terminal-intake and failed-material barrier on the next continuation.
    const found = await discoverRuns({readGithub, reservation: {...reservation, ...(acknowledgement?.runId ? {runId: acknowledgement.runId} : {})}, now: clock(now)});
    if (found.needsReconciliation || !found.reservationRun) return hold(reservation.id, 'Retained native dispatch needs one positive exact nonce/source/run observation; no POST will be retried');
    const run = found.reservationRun;
    if (run.status === 'completed') {
      if (['success', 'failure'].includes(run.conclusion)) {
        try {
          await retainOwnCompleted(reservation, run, {finish: true});
        } catch {
          current = await store.read();
          const reason = 'Exact completed source intake or fresh qualified-queue retention is incomplete; original reservation remains held before any new source dispatch';
          return current.state.activeReservationId === reservation.id ? hold(reservation.id, reason) : finishReport('needs-reconciliation', reason);
        }
      } else if (run.conclusion === 'cancelled') {
        current = await mutate(state => finishSourceCohort(state, {reservationId: reservation.id, run, now: time()}));
      } else return hold(reservation.id, 'Completed native run has no admissible terminal intake conclusion; retain its exact source reservation for reconciliation');
      report.sourceCompletion = {reservationId: reservation.id, runId: run.id, conclusion: run.conclusion, status: current.state.reservations[reservation.id].status,
        qualification: 'Source run finished; exact artifact intake and per-dealer native/hosted outcomes remain separate'};
      return null;
    }
    current = await mutate(state => bindSourceCohortRun(state, {reservationId: reservation.id, run, now: time()}));
    return finishReport('building', 'Exact retained source run is active; no second dispatch');
  };
  if (current.state.activeReservationId) {
    const result = await reconcile(current.state.reservations[current.state.activeReservationId]); if (result) return result;
  }
  // Older executors may have released an owned terminal run before its
  // qualified outputs entered queue.json. Recover that handoff from immutable
  // reservation history without reopening or rewriting the terminal record.
  for (const reservation of Object.values(current.state.reservations)) {
    if (!['source-finished', 'held'].includes(reservation.status) || !['success', 'failure'].includes(reservation.run?.conclusion) ||
      current.state.ownedIntakes?.[reservation.id] || retainedRuns.has(reservation.run.id) || reservation.selections.every(row => current.state.targets[row.dealerId].retainedRequestIds.length)) continue;
    try {
      const found = await discoverRuns({readGithub, reservation, now: clock(now)}), run = found.reservationRun;
      assert(!found.needsReconciliation && run?.status === 'completed' && run.id === reservation.run.id && ['success', 'failure'].includes(run.conclusion), 'Exact historical terminal source proof required');
      await retainOwnCompleted(reservation, run);
    } catch {
      return finishReport('needs-reconciliation', 'Retained historical source outputs require exact terminal intake and fresh queue retention before any source replan');
    }
  }
  let discovery = await discoverRuns({readGithub, externalRuns: Object.values(current.state.externalRuns).filter(row => !row.terminalIntakeComplete), now: clock(now)});
  if (Object.values(current.state.externalRuns).some(row => !row.terminalIntakeComplete)) {
    discovery = await discoverRuns({readGithub, externalRuns: Object.values(current.state.externalRuns).filter(row => !row.terminalIntakeComplete), now: clock(now)});
    for (const row of discovery.externalRunStatuses ?? []) {
      if (row.needsReconciliation || !row.run || row.run.status !== 'completed') continue;
      if (!ensureTerminalIntake) return finishReport('waiting-external-intake', 'An exact prior native run requires maintained automatic terminal intake before new source');
      report.terminalIntakeCalls++;
      const intake = await ensureTerminalIntake({runId: row.runId});
      assert(intake?.runId === row.runId && intake.sourceCommit === row.sourceSha && Array.isArray(intake.requests) && Array.isArray(intake.failures) &&
        Array.isArray(intake.failedMaterials) && intake.failedMaterials.length === new Set(intake.failures.map(failure => failure.slug)).size &&
        intake.contracts?.runId === row.runId && intake.contracts.sourceCommit === row.sourceSha && intake.contracts.conclusion === 'success', 'Prior source intake did not positively finish exact authenticated shared-contract inspection');
      current = await mutate(state => completeSourceExternalRunIntake(state, {runId: row.runId, sourceSha: row.sourceSha,
        intake: {runId: intake.runId, sourceCommit: intake.sourceCommit, run: row.run, completed: true,
          failures: intake.failures, failedMaterials: intake.failedMaterials}, now: time()}));
    }
    current = await mutate(async state => syncSourceCampaignTargets(state, {queue: await queue(), now: time()}));
    if (Object.values(current.state.externalRuns).some(row => !row.terminalIntakeComplete)) return finishReport('waiting-external-source', 'Existing native runs remain active, unknown or awaiting exact terminal intake; their source is not rebuilt');
    discovery = await discoverRuns({readGithub, now: clock(now)});
  }
  if (discovery.unknownActive || discovery.needsReconciliation) return finishReport('waiting-external-source', 'Untracked or incomplete native-run evidence defers all new source work');
  if (await mainSource(readGithub) !== sourceSha) return finishReport('waiting-source', 'Published main advanced; a scheduler at its exact new source must continue');
  current = await mutate(async state => syncSourceCampaignTargets(state, {queue: await queue(), now: time()}));
  const packs = listPacks(root), byId = new Map();
  for (const pack of packs) if (current.state.targets[pack.dealerId]) {const matches = byId.get(pack.dealerId) ?? []; matches.push(pack); byId.set(pack.dealerId, matches);}
  const selections = [];
  for (const dealerId of current.state.order) {
    if (selections.length === SOURCE_COHORT_MAX) break;
    const target = current.state.targets[dealerId]; if (target.retainedRequestIds.length) continue;
    const matches = byId.get(dealerId) ?? [], source = matches[0];
    const observe = reason => report.observations.push({dealerId, reason});
    if (matches.length !== 1 || source.valid !== true || source.benchmarkOnly || !validPackSlug(source.slug) || target.slug && target.slug !== source.slug) {observe('Waiting for one exact existing assigned pack identity'); continue;}
    try {
      const qualification = readQualification({root, slug: source.slug});
      if (Object.hasOwn(qualification, 'sourceHold')) {
        const hold = qualification.sourceHold;
        assert(hold && typeof hold === 'object' && !Array.isArray(hold) && typeof hold.active === 'boolean' &&
          (!hold.active || typeof hold.reason === 'string' && hold.reason.trim()), 'Explicit source hold metadata requires a boolean active flag and a nonempty active reason');
      }
      if (qualification.sourceHold?.active === true) {observe('Explicit source hold is active; waiting for its reviewed resolution'); continue;}
      if (qualification.reviewed !== true) {observe('Waiting for reviewed factual and branding inputs'); continue;}
      const material = await inspectMaterial({root, slug: source.slug, dealerId, sourceSha}), selection = {dealerId, slug: source.slug, packDigest: material.packDigest, buildFingerprint};
      assert(hex(selection.packDigest, 64), 'Source material has no exact input digest');
      if (hasAttemptedSourceMaterial(current.state, selection)) {observe('This exact pack/build material already has a retained source attempt'); continue;}
      const checked = await validateReadyPack({root, slug: source.slug, batch: target.batch, toolPackage});
      assert(checked?.success === true && checked.packDigest === selection.packDigest && checked.benchmarkOnly !== true, 'Maintained input check did not verify the exact selected source material');
      selections.push(selection);
    } catch {observe('Maintained exact source/identity/branding/input verification is held; no build was requested');}
  }
  if (report.observations.length) current = await mutate(async state => syncSourceCampaignTargets(state, {queue: await queue(), observations: report.observations, now: time()}));
  if (!selections.length) return finishReport('waiting-inputs', 'All400 targets remain tracked; no new reviewed unprocessed material is ready');
  // Recheck mutable run/main/qualified-queue state after potentially slow raster checks.
  discovery = await discoverRuns({readGithub, now: clock(now)});
  if (discovery.unknownActive || discovery.needsReconciliation || await mainSource(readGithub) !== sourceSha) return finishReport('waiting-source', 'Native work or published source changed during input checks; no reservation or POST');
  const id = nonce(); assert(hex(id, 64), 'Fresh public rollout nonce required');
  try {
    current = await mutate(async state => ({state: reserveSourceCohort(syncSourceCampaignTargets(state, {queue: await queue(), now: time()}),
      {id, owner, sourceSha, selections, now: time()}), value: {reserved: true}}));
  } catch {current = await store.read(); validateSourceCampaign(current.state); return finishReport('waiting-reservation', 'Another CAS owner or retained source/queue material prevented this dispatch');}
  assert(current.value?.reserved === true, 'Only the fresh persisted reservation owner can dispatch');
  report.selected = selections; report.reservationId = id;
  let acknowledgement;
  report.dispatches = 1;
  try {acknowledgement = await dispatch({sourceSha, rolloutRequestId: id, slugs: selections.map(row => row.slug)});
    assert([200, 204].includes(acknowledgement?.httpStatus), 'Native dispatch has no positive acknowledgement');
  } catch {return hold(id, 'Native dispatch response is unknown or refused; intent remains held and the POST is never retried');}
  report.acknowledgement = {httpStatus: acknowledgement.httpStatus, ...(acknowledgement.runId ? {runId: acknowledgement.runId} : {})};
  const result = await reconcile(current.state.reservations[id], acknowledgement);
  return result ?? finishReport(current.state.reservations[id].status, 'Positively bound source run completed; qualification remains with maintained artifact intake');
}

export async function runDealerPackSourceScheduler(argv = process.argv.slice(2), {root = ROOT, env = process.env, ...dependencies} = {}) {
  if (argv.includes('--help')) {console.log('Usage: schedule-dealer-pack-source.mjs [--register-all] [--report runtime/PATH.json]\nTracks the canonical400 once, skips retained deployments, validates up to14 reviewed source packs, persists one-shot intent before a native dispatch, and reconciles exact nonce/source runs without POST retries. No Cloudflare operations or qualified-deployment fabrication.'); return;}
  let reportFile; const seen = new Set();
  for (let i = 0; i < argv.length; i++) {const option = argv[i]; assert(!seen.has(option), 'Repeated scheduler option'); seen.add(option);
    if (option === '--register-all') continue;
    assert(option === '--report' && argv[i + 1] && !argv[i + 1].startsWith('--'), 'Unknown or incomplete scheduler option'); reportFile = path.resolve(argv[++i]);
    assert(reportFile.startsWith(path.join(path.resolve(root), 'runtime') + path.sep), 'Source scheduler reports belong in owned runtime output');
  }
  const sourceSha = dependencies.sourceSha ?? readGit(root, ['rev-parse', 'HEAD']).trim();
  const buildFingerprint = dependencies.buildFingerprint ?? dealerPackSourceBuildFingerprint({root, sourceSha});
  const ensureTerminalIntake = createDealerPackTerminalIntake({root});
  const report = await scheduleDealerPackSource({root, sourceSha, buildFingerprint, owner: 'github:' + env.GITHUB_RUN_ID, ensureTerminalIntake,
    ...dependencies, registerAll: argv.includes('--register-all')});
  if (reportFile) {fs.mkdirSync(path.dirname(reportFile), {recursive: true}); fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');}
  console.log(JSON.stringify(report, null, 2)); return report;
}

if (isEntrypoint(import.meta.url)) runDealerPackSourceScheduler().catch(() => {console.error('Source scheduler blocked; retained campaign/queue ownership is unchanged. Inspect exact source/runtime evidence before continuing.'); process.exitCode = 1;});
