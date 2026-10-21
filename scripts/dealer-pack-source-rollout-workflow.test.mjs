import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const deploy=fs.readFileSync(new URL('../.github/workflows/dealer-pack-deploy.yml',import.meta.url),'utf8');
const native=fs.readFileSync(new URL('../.github/workflows/dealer-pack-pipeline.yml',import.meta.url),'utf8');
const sha='a'.repeat(40),nonce='b'.repeat(64);
const deploySteps=deploy.split(/^      - /m).slice(1);
const step=name=>{const value=deploySteps.find(s=>s.startsWith('name: '+name+'\n'));assert.ok(value,'Missing step '+name);return value;};
const source=step('Advance registered source targets after authenticated native intake');
const expression=value=>{const result=value.match(/^\s+if: \$\{\{ (.+) \}\}$/m)?.[1];assert.ok(result);return result;};
const evaluate=(value,{event='workflow_dispatch',action='queue-all',ref='refs/heads/main',success=true,guard='success',inputs={},sha:actualSha=sha,workflowSha=sha}={})=>{
 const rule=expression(value);return Boolean(Function('github','inputs','steps','success','contains','cancelled','return ('+rule+');')(
  {event_name:event,ref,sha:actualSha,workflow_sha:workflowSha,event:{head_commit:{message:''}}},
  {action,...inputs},{executor_guard:{conclusion:guard}},()=>success,(text,item)=>String(text).includes(item),()=>false));
};
const job=name=>{const value=native.split(new RegExp('^  '+name+':\\r?\\n','m'))[1];assert.ok(value);return value.split(/^  [a-z][\w-]*:/m)[0];};

test('queue-all is an explicit source action and never authorizes a provider drain',()=>{
 const actionChoices=deploy.match(/^\s+options: \[([^\n]+)\]$/m)?.[1].split(',').map(value=>value.trim());
 assert.ok(actionChoices?.includes('queue-all'),'queue-all must remain an explicit workflow action');assert.equal(evaluate(source),true);
 const drain=step('Drain all retained batches through the single account claim');
 assert(!expression(drain).includes("inputs.action == 'queue-all'"));
 assert.equal(evaluate(source,{action:'inspect'}),false);assert.equal(evaluate(source,{action:'recover-and-drain'}),false);
 assert.match(source,/PACK_REGISTER_ALL:.*inputs.action == 'queue-all'/);
 assert.match(source,/--register-all --report runtime\/dealer-pack-dispatch\/source-rollout.json/);
});

test('main source changes and existing service events advance only after executor guards',()=>{
 for(const value of[{event:'push'},{event:'schedule'},{event:'workflow_run'},{action:'drain'}])assert.equal(evaluate(source,value),true);
 assert.equal(evaluate(source,{event:'push',ref:'refs/heads/astra/m2-fast-deploy'}),false);
 for(const guard of['failure','cancelled','skipped'])assert.equal(evaluate(source,{guard}),false);
 assert.equal(evaluate(source,{success:false}),false);
 assert.match(deploy,/branches: \[astra\/m2-fast-deploy, main\]/);assert.match(deploy,/- dealers\/\*\*/);
});

test('terminal and active native intake precede source scheduling, which precedes provider draining',()=>{
 const terminal=deploy.indexOf('name: Intake qualified owner-selected main builds or perform a manual inspection');
 const active=deploy.indexOf('name: Retain qualified completed producers from active main builds');
 const schedule=deploy.indexOf('name: Advance registered source targets after authenticated native intake');
 const drain=deploy.indexOf('name: Drain all retained batches through the single account claim');
 assert(terminal>0&&terminal<schedule&&active<schedule&&schedule<drain);
 assert.match(step('Retain qualified completed producers from active main builds'),/inputs.action == 'queue-all'/);
 assert.match(source,/GITHUB_TOKEN:/);assert.doesNotMatch(source,/CLOUDFLARE_API_TOKEN|--write|--live/);
});

test('ordinary manual, PR and benchmark native runs retain their original gates',()=>{
 for(const event of['workflow_dispatch','pull_request','push'])assert.equal(evaluate(job('contracts'),{event}),true);
 assert.equal(evaluate(job('plan'),{event:'workflow_dispatch'}),true);
 assert.equal(evaluate(job('plan'),{event:'pull_request'}),true);
 assert.equal(evaluate(job('plan'),{inputs:{contracts_only:true}}),false);
 assert.match(native,/max-parallel: 14/);
});

test('a reserved native run requires exact main source before any job steps',()=>{
 const inputs={rollout_request_id:nonce,rollout_source_sha:sha};
 for(const name of['contracts','plan']){
  const body=job(name);assert.equal(evaluate(body,{inputs}),true);
  for(const change of[{sha:'c'.repeat(40)},{workflowSha:'c'.repeat(40)},{ref:'refs/heads/other'},{event:'pull_request'}])assert.equal(evaluate(body,{inputs,...change}),false);
  assert.equal(evaluate(body,{inputs:{rollout_request_id:nonce}}),false);
  assert.equal(evaluate(body,{inputs:{rollout_source_sha:sha}}),false);
 }
 assert.match(native,/run-name:.*format\('Cars rollout \{0\}', inputs.rollout_request_id\)/);
});

test('the exact scheduled source and provider guards run before source or provider writes',()=>{
 const guards=step('Check executor intake and recovery guards');
 for(const name of['source-campaign','source-discovery','source-scheduler','source-rollout-workflow','provider','upload-members'])assert(guards.includes('scripts/dealer-pack-'+name+'.test.mjs'));
 assert(deploy.indexOf('name: Check executor intake and recovery guards')<deploy.indexOf('name: Advance registered source targets'));
 assert.match(deploy,/permissions:\n\s+contents: write\n\s+actions: write/);
});

test('native composition has the same pinned Svelte parser as shared component checks',()=>{
 const installations=[...native.matchAll(/npm install --prefix runtime\/dealer-pack-(?:test-)?tools[^\n]*(?:\n\s+typescript@[^\n]*)?/g)].map(row=>row[0]);
 assert(installations.some(row=>row.includes('runtime/dealer-pack-tools')&&row.includes('prettier@3.8.1')&&row.includes('svelte@5.57.2')));
 assert(installations.some(row=>row.includes('runtime/dealer-pack-test-tools')&&row.includes('svelte@5.57.2')));
});

test('reserved native completion explicitly dispatches strict intake even after sibling failure',()=>{
 const result=job('result'),steps=result.split(/^    - /m).slice(1);
 const checkout=steps.find(s=>s.startsWith('name: Check out the exact reserved source completion callback\n'));
 const callback=steps.find(s=>s.startsWith('name: Hand qualified native survivors to the existing deployment queue\n'));
 assert(checkout&&callback);assert.match(result,/permissions:\n\s+contents: read\n\s+actions: write/);
 assert.match(checkout,/ref: \$\{\{ github.sha \}\}/);assert.match(checkout,/persist-credentials: false/);
 assert.match(checkout,/\/scripts\/lib\/cli-entrypoint.mjs/);
 assert.match(result,/name: Use the pinned native completion runtime[\s\S]*node-version: 26.10.0/);
 const admit=(body,changes={})=>{
  const github={event_name:'workflow_dispatch',repository:'darkapoparka/cars',ref:'refs/heads/main',run_attempt:1,sha,workflow_sha:sha,...changes.github};
  const inputs={rollout_request_id:nonce,rollout_source_sha:sha,...changes.inputs};
  const needs={contracts:{result:'success'},plan:{result:'success',outputs:{has_work:'true',benchmark:'false'}},lane:{result:'failure'},...changes.needs};
  return Boolean(Function('github','inputs','needs','cancelled','return ('+expression(body)+');')(github,inputs,needs,()=>changes.cancelled??false));
 };
 for(const body of[checkout,callback]){
  assert.equal(admit(body),true);
  for(const change of[{github:{event_name:'pull_request'}},{github:{repository:'someone/cars'}},{github:{ref:'refs/heads/other'}},{github:{run_attempt:2}},{github:{sha:'c'.repeat(40)}},{github:{workflow_sha:'c'.repeat(40)}},{inputs:{rollout_request_id:''}},{inputs:{rollout_source_sha:''}},{needs:{contracts:{result:'failure'}}},{needs:{plan:{result:'failure',outputs:{has_work:'true',benchmark:'false'}}}},{needs:{plan:{result:'success',outputs:{has_work:'false',benchmark:'false'}}}},{needs:{plan:{result:'success',outputs:{has_work:'true',benchmark:'true'}}}},{cancelled:true}])assert.equal(admit(body,change),false);
  assert.match(expression(body),/^!cancelled\(\)/);
 }
 assert(result.indexOf('Report independent outcomes without hiding rejected packs')<result.indexOf('Hand qualified native survivors'));
 assert.match(callback,/run: node scripts\/notify-dealer-pack-source-complete.mjs --report runtime\/dealer-pack-source\/notify-complete.json/);
 for(const name of['CONTRACTS_RESULT','PLAN_RESULT','LANE_RESULT','HAS_WORK','BENCHMARK','ROLLOUT_REQUEST_ID','ROLLOUT_SOURCE_SHA'])assert(callback.includes(name+':'));
 assert.match(result,/name: dealer-pack-source-completion--\$\{\{ github.run_id \}\}/);
});

test('the completion callback uses the same automatic intake and executor guards',()=>{
 assert.match(deploy,/automatic_intake:\n\s+description:[^\n]*\n\s+required: false\n\s+default: false\n\s+type: boolean/);
 const intake=step('Intake qualified owner-selected main builds or perform a manual inspection');
 assert.match(intake,/PACK_AUTOMATIC: \$\{\{ \(github.event_name == 'workflow_run' \|\| inputs.automatic_intake == true\) && 'true' \|\| 'false' \}\}/);
 assert.match(intake,/if\(process.env.PACK_AUTOMATIC==='true'\)args.push\('--automatic'\)/);
 assert.match(step('Check executor intake and recovery guards'),/scripts\/notify-dealer-pack-source-complete.test.mjs/);
 assert.match(native,/scripts\/\*dealer-pack\*\.test\.mjs/);
});
