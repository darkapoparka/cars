import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const workflow=fs.readFileSync(new URL('../.github/workflows/dealer-pack-deploy.yml',import.meta.url),'utf8');
const steps=workflow.split(/^      - /m).slice(1);
const step=name=>{const value=steps.find(row=>row.startsWith('name: '+name+'\n'));assert.ok(value,'Missing step '+name);return value;};
const recheck=step('Recheck exact retained hosted versions without provider or queue writes');
const blocked=step('Record an unavailable deployment credential as a blocked write request');
function condition(value,{event='workflow_dispatch',action='verify-hosted',token='true',guard='success',succeeded=true,cancelled=false}={}){
  const expression=value.match(/^        if: \$\{\{ (.+) \}\}$/m)?.[1];assert.ok(expression);
  if(!/\b(?:success|failure|always|cancelled)\s*\(/.test(expression)&&!succeeded)return false;
  return Function('github','inputs','steps','success','cancelled','return ('+expression+');')(
    {event_name:event,ref:'refs/heads/main'},{action},
    {token:{outputs:{present:token}},executor_guard:{conclusion:guard},reconcile:{conclusion:'success'},source_rollout:{conclusion:'success'},metrics:{conclusion:'success',outputs:{complete:'true'}},drain:{conclusion:'success'}},()=>succeeded,()=>cancelled);
}

test('hosted recheck requires the explicit manual action, successful guards and a credential',()=>{
  assert.equal(condition(recheck),true);
  for(const event of ['schedule','workflow_run','push'])assert.equal(condition(recheck,{event}),false);
  for(const action of ['inspect','enqueue-and-deploy','drain','recover-inspect','recover-and-drain','queue-all'])assert.equal(condition(recheck,{action}),false);
  for(const guard of ['failure','skipped','cancelled'])assert.equal(condition(recheck,{guard}),false);
  assert.equal(condition(recheck,{token:'false'}),false);assert.equal(condition(recheck,{succeeded:false}),false);
});

test('manual hosted recheck cannot intake, schedule, reconcile, drain, read drain metrics or continue publication',()=>{
  for(const name of [
    'Intake qualified owner-selected main builds or perform a manual inspection',
    'Retain qualified completed producers from active main builds',
    'Advance registered source targets after authenticated native intake',
    'Reconcile only an explicitly selected stopped request',
    'Drain all retained batches through the single account claim',
    'Read startup, sampled CPU, memory and error evidence for this drain',
    'Continue authenticated terminal progress on exact current main',
  ])assert.equal(condition(step(name)),false,name);
});

test('hosted recheck sends only explicit slugs and a bounded report path to the read-only CLI',async()=>{
  const body=recheck.match(/          node --input-type=module <<'NODE'\n([\s\S]+?)          NODE\n/)?.[1]
    .replace(/^          /gm,'').replace(/^import \{runHostedRecheckCli\} from '.\/scripts\/reverify-hosted-dealer-pack.mjs';\n/,'');
  assert.ok(body);const AsyncFunction=Object.getPrototypeOf(async()=>{}).constructor,calls=[];
  await new AsyncFunction('process','runHostedRecheckCli',body)({env:{PACK_RECHECK_SLUGS:'car-avenue-llc,dubuy-auto-cars'}},async args=>calls.push(args));
  assert.deepEqual(calls,[['--slugs','car-avenue-llc,dubuy-auto-cars','--report','runtime/dealer-pack-dispatch/hosted-recheck.json']]);
  await assert.rejects(new AsyncFunction('process','runHostedRecheckCli',body)({env:{PACK_RECHECK_SLUGS:''}},async()=>{throw Error('Explicit slugs required');}),/Explicit slugs/);
});

test('missing credentials fail a requested recheck while preserving existing recovery behavior',async()=>{
  assert.equal(condition(blocked,{token:'false'}),true);assert.equal(condition(blocked),false);
  const body=blocked.match(/          node --input-type=module <<'NODE'\n([\s\S]+?)          NODE\n/)?.[1]
    .replace(/^          /gm,'').replace(/^import fs from 'node:fs';\n/,'');assert.ok(body);
  const AsyncFunction=Object.getPrototypeOf(async()=>{}).constructor;
  for(const action of ['verify-hosted','recover-inspect','recover-and-drain']){
    const process={env:{PACK_ACTION:action}},writes=[];
    await new AsyncFunction('process','fs','console',body)(process,{mkdirSync(){},writeFileSync:(...args)=>writes.push(args)},{log(){}});
    assert.equal(process.exitCode,1);assert.equal(writes.length,1);assert.equal(JSON.parse(writes[0][1]).providerWrites,0);
  }
});
