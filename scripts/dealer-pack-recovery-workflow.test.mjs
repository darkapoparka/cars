import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const workflow = fs.readFileSync(new URL('../.github/workflows/dealer-pack-deploy.yml', import.meta.url), 'utf8');
const steps = workflow.split(/^      - /m).slice(1);
const step = name => {
  const value = steps.find(row => row.startsWith(`name: ${name}\n`));
  assert.ok(value, `Missing workflow step: ${name}`);
  return value;
};
const recovery = step('Reconcile only an explicitly selected stopped request');
const drain = step('Drain all retained batches through the single account claim');
const intake = step('Intake qualified owner-selected main builds or perform a manual inspection');
const blocked = step('Record an unavailable deployment credential as a blocked write request');
const condition = (value, {event = 'workflow_dispatch', action = 'recover-and-drain', token = 'true', conclusion = 'success', guard = 'success', succeeded = true, cancelled = false} = {}) => {
  const expression = value.match(/^        if: \$\{\{ (.+) \}\}$/m)?.[1];
  assert.ok(expression, 'Expected an explicit step condition');
  if (!/\b(?:success|failure|always|cancelled)\s*\(/.test(expression) && !succeeded) return false;
  return Function('github', 'inputs', 'steps', 'success', 'cancelled', `return (${expression});`)(
    {event_name: event}, {action}, {token: {outputs: {present: token}}, reconcile: {conclusion}, executor_guard: {conclusion: guard}}, () => succeeded, () => cancelled,
  );
};
const script = recovery.match(/          node --input-type=module <<'NODE'\n([\s\S]+?)          NODE\n/)?.[1]
  .replace(/^          /gm, '')
  .replace(/^import \{runPackReconciliationCli\} from '.\/scripts\/reconcile-dealer-pack-claim.mjs';\n/, '');
assert.ok(script, 'Expected the maintained reconciliation CLI in the recovery step');
const runRecovery = async (env, reconcile) => {
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
  await new AsyncFunction('process', 'runPackReconciliationCli', script)({env}, reconcile);
};
const requestId = 'd'.repeat(64);

test('automatic and scheduled runs cannot reconcile or enter manual recovery intake', () => {
  for (const event of ['schedule', 'workflow_run', 'push']) {
    assert.equal(condition(recovery, {event}), false);
  }
  for (const action of ['recover-inspect', 'recover-and-drain', 'drain']) {
    assert.equal(condition(intake, {action}), false);
  }
  assert.equal(condition(intake, {action: 'inspect'}), true);
  assert.equal(condition(intake, {action: 'enqueue-and-deploy'}), true);
  assert.equal(condition(intake, {event: 'workflow_run'}), true);
});

test('read-only recovery cannot drain and write recovery requires successful reconciliation', () => {
  assert.equal(condition(recovery, {action: 'recover-inspect'}), true);
  assert.equal(condition(recovery, {succeeded: false}), false);
  assert.equal(condition(drain, {action: 'recover-inspect'}), false);
  assert.equal(condition(drain), true);
  for (const conclusion of ['failure', 'cancelled', 'skipped', '']) {
    assert.equal(condition(drain, {conclusion}), false);
  }
  assert.equal(condition(drain, {conclusion: 'failure', succeeded: false}), false);
  assert.equal(condition(drain, {cancelled: true}), false);
  assert.equal(condition(drain, {token: 'false'}), false);
});

test('ordinary retained-queue service remains independent of intake inspection', () => {
  for (const action of ['enqueue-and-deploy', 'drain']) {
    assert.equal(condition(drain, {action, succeeded: false}), true);
    assert.equal(condition(drain, {action}), true);
  }
  assert.equal(condition(drain, {event: 'schedule'}), true);
  assert.equal(condition(drain, {event: 'workflow_run'}), true);
  for (const event of ['schedule', 'workflow_run', 'workflow_dispatch']) {
    for (const guard of ['failure', 'skipped', 'cancelled']) assert.equal(condition(drain, {event, guard}), false);
  }
});

test('missing credentials block both recovery actions with a failed result', () => {
  for (const action of ['recover-inspect', 'recover-and-drain', 'verify-hosted']) {
    assert.equal(condition(recovery, {action, token: 'false'}), false);
    assert.equal(condition(blocked, {action, token: 'false'}), true);
    assert.equal(condition(blocked, {action}), false);
  }
  assert.match(blocked, /if\(\['recover-inspect','recover-and-drain','verify-hosted'\]\.includes\(process\.env\.PACK_ACTION\)\)process\.exitCode=1;/);
});

test('an exact request ID is required before any provider reconciliation', async () => {
  for (const value of [undefined, '', 'd'.repeat(63), '../queue.json', 'd'.repeat(64) + '\n', 'D'.repeat(64)]) {
    let calls = 0;
    await assert.rejects(runRecovery({RECOVERY_REQUEST_ID: value, RECOVERY_ACTION: 'recover-and-drain'}, async () => { calls++; }), /Exact recovery request SHA-256 required/);
    assert.equal(calls, 0);
  }
});

test('inspect stays read-only and resume reuses the exact retained request', async () => {
  const calls = [];
  const reconcile = async args => { calls.push(args); };
  await runRecovery({RECOVERY_REQUEST_ID: requestId, RECOVERY_ACTION: 'recover-inspect'}, reconcile);
  assert.deepEqual(calls, [['inspect', '--request-id', requestId, '--report', 'runtime/dealer-pack-dispatch/recovery-inspection.json']]);
  calls.length = 0;
  await runRecovery({RECOVERY_REQUEST_ID: requestId, RECOVERY_ACTION: 'recover-and-drain'}, reconcile);
  assert.deepEqual(calls, [
    ['inspect', '--request-id', requestId, '--report', 'runtime/dealer-pack-dispatch/recovery-inspection.json'],
    ['resume', '--request-id', requestId, '--write', '--report', 'runtime/dealer-pack-dispatch/recovery-resume.json'],
  ]);
});

test('a refused provider observation or resume fails recovery', async () => {
  const calls = [];
  await assert.rejects(runRecovery({RECOVERY_REQUEST_ID: requestId, RECOVERY_ACTION: 'recover-and-drain'}, async args => {
    calls.push(args[0]);
    throw Error('Retained worker identity differs');
  }), /Retained worker identity differs/);
  assert.deepEqual(calls, ['inspect']);
  calls.length = 0;
  await assert.rejects(runRecovery({RECOVERY_REQUEST_ID: requestId, RECOVERY_ACTION: 'recover-and-drain'}, async args => {
    calls.push(args[0]);
    if (args[0] === 'resume') throw Error('The original owner is running');
  }), /original owner is running/);
  assert.deepEqual(calls, ['inspect', 'resume']);
});

