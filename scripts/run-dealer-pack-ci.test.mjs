import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {planDealerPackCiEnvironment} from './run-dealer-pack-ci.mjs';
import {PACK_CI_MAX_LANES} from './plan-dealer-pack-ci.mjs';
import {buildPackBatchAssignments,PACK_BATCH_FILE} from './lib/dealer-pack-identity.mjs';

const ready=async()=>({success:true,packDigest:'a'.repeat(64),releaseId:'cars-six-'+'b'.repeat(64)});
const area=t=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-pack-orchestration-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root;};
const put=(root,name,value)=>{const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof value==='string'?value:JSON.stringify(value));};
const head='1'.repeat(40);

const workflow=fs.readFileSync(new URL('../.github/workflows/dealer-pack-pipeline.yml',import.meta.url),'utf8').replace(/\r\n/g,'\n');
const workflowJob=name=>{
  const value=workflow.split('\n  '+name+':\n')[1]?.split(/^  [a-z][a-z_-]*:\s*$/m)[0];
  assert.ok(value,'Missing pipeline job: '+name);return value;
};
const workflowCondition=(name,{event='workflow_dispatch',contractsOnly,hasWork='true',message='',cancelled=false}={})=>{
  const expression=workflowJob(name).match(/^    if: \$\{\{ (.+) \}\}$/m)?.[1];
  assert.ok(expression,'Missing explicit pipeline job condition: '+name);
  return Function('github','inputs','needs','contains','cancelled','return ('+expression+');')(
    {event_name:event,event:{head_commit:{message}}},{contracts_only:contractsOnly},{plan:{outputs:{has_work:hasWork}}},
    (value,needle)=>String(value).includes(needle),()=>cancelled);
};

test('workflow native fanout matches the centrally bounded normal lane cap',()=>{
  assert.equal(PACK_CI_MAX_LANES,14);
  assert.equal(Number(workflowJob('lane').match(/^      max-parallel: (\d+)$/m)?.[1]),PACK_CI_MAX_LANES);
  assert.equal((workflow.match(/^  contracts:\s*$/gm)??[]).length,1);
  assert.match(workflowJob('lane'),/needs: plan/);
  assert.match(fs.readFileSync(new URL('./run-dealer-pack-ci.mjs',import.meta.url),'utf8'),/familyConcurrency:1/);
});

test('pipeline contracts-only dispatch skips planning and native lanes while preserving normal triggers',()=>{
  const input=workflow.match(/^      contracts_only:\n((?: {8}.+\n)+)/m)?.[1];
  assert.ok(input,'Missing optional contracts_only workflow input');
  assert.match(input,/^        default: false$/m);assert.match(input,/^        type: boolean$/m);
  assert.doesNotMatch(input,/^        required: true$/m);
  assert.equal(workflowCondition('plan',{contractsOnly:true}),false);
  for(const contractsOnly of [false,undefined])for(const event of ['workflow_dispatch','pull_request'])
    assert.equal(workflowCondition('plan',{contractsOnly,event}),true);
  assert.equal(workflowCondition('plan',{event:'push'}),false);
  assert.equal(workflowCondition('plan',{event:'push',message:'retained [benchmark25] proof'}),true);
  assert.match(workflowJob('lane'),/^    needs: plan$/m);
  assert.equal(workflowCondition('lane',{hasWork:''}),false,'A skipped planner has no native work output');
  assert.equal(workflowCondition('lane',{hasWork:'false'}),false);
  assert.equal(workflowCondition('lane'),true);
  assert.equal(workflowCondition('lane',{cancelled:true}),false);
});

test('pipeline contracts-only result accepts skipped build jobs but never bypasses failed contracts',()=>{
  const result=workflowJob('result'),script=result.match(/        node --input-type=module <<'NODE'\n([\s\S]+?)        NODE\n/)?.[1]
    .replace(/^        /gm,'').replace(/^import fs from 'node:fs';\n/,'');
  assert.ok(script,'Missing independent pipeline result script');
  for(const name of ['contracts','plan','lane'])assert.match(result,new RegExp('^    - '+name+'$','m'));
  assert.equal(workflowCondition('result'),true);assert.equal(workflowCondition('result',{cancelled:true}),false);
  const evaluate=({contracts='success',plan='skipped',lanes='skipped',rejected='0'}={})=>{
    const process={env:{CONTRACTS_RESULT:contracts,PLAN_RESULT:plan,LANE_RESULT:lanes,REJECTED:rejected,GITHUB_STEP_SUMMARY:'summary'}};
    let summary;
    Function('process','fs',script)(process,{appendFileSync:(file,value)=>{assert.equal(file,'summary');summary=JSON.parse(value);}});
    assert.deepEqual(summary,{contracts,plan,lanes,rejected:Number(rejected)});
    return process.exitCode??0;
  };
  for(const plan of ['success','skipped'])for(const lanes of ['success','skipped'])assert.equal(evaluate({plan,lanes}),0);
  for(const status of ['failure','cancelled','skipped',''])assert.equal(evaluate({contracts:status}),1);
  for(const status of ['failure','cancelled',''])for(const name of ['plan','lanes'])assert.equal(evaluate({[name]:status}),1);
  assert.equal(evaluate({rejected:'1'}),1);
});

test('pipeline sparse checkouts retain the tracked task document required by workflow links',()=>{
  assert.equal((workflow.match(/^        sparse-checkout: \|$/gm)||[]).length,3);
  for(const name of ['contracts','plan','lane']){
    const sparse=workflowJob(name).match(/^        sparse-checkout: \|\n((?: {10}.+\n)+)/m)?.[1];
    assert.ok(sparse,'Missing sparse checkout: '+name);
    assert.ok(sparse.trim().split('\n').map(row=>row.trim()).includes('/tasks.md'),name+' must include tracked /tasks.md');
  }
});

test('final transport uploads retain seven days while auxiliary evidence stays bounded',()=>{
  const uploads=workflow.split(/^    - /m).slice(1).filter(step=>/^(?:uses:|      uses:) actions\/upload-artifact@/m.test(step));
  const transport=uploads.filter(step=>/^        name: dealer-pack-transport--/m.test(step));
  const expected=['Retain final bundle manifest',...Array.from({length:8},(_,index)=>'Retain deduplicated final blob shard '+index)];
  assert.deepEqual(transport.map(step=>step.match(/^name: (.+)$/m)?.[1]),expected);
  for(const step of transport)assert.deepEqual([...step.matchAll(/^        retention-days: (\d+)$/gm)].map(match=>Number(match[1])),[7]);
  for(const [prefix,days] of [['dealer-pack-hosted-browser--',1],['dealer-pack-plan--',3],['dealer-pack-reports--',3]]){
    const matches=uploads.filter(step=>step.includes('        name: '+prefix));
    assert.equal(matches.length,1,'Exactly one auxiliary upload: '+prefix);
    assert.deepEqual([...matches[0].matchAll(/^        retention-days: (\d+)$/gm)].map(match=>Number(match[1])),[days]);
  }
});

test('the workflow always provides HEAD but explicit and benchmark dispatch still select exactly one planner mode',async t=>{
  const root=area(t);
  const benchmark=await planDealerPackCiEnvironment({root,env:{PACK_HEAD:head,PACK_BENCHMARK:'true'},validatePack:ready});
  assert.equal(benchmark.valid.length,25);assert.equal(benchmark.source,'benchmark25');assert.equal(benchmark.base,undefined);
  assert.equal(benchmark.lanes.include.length,7);
  const explicit=await planDealerPackCiEnvironment({root,env:{PACK_HEAD:head,PACK_BASE:'2'.repeat(40),PACK_SLUGS:'ready-one,ready-two'},validatePack:ready});
  assert.deepEqual(explicit.valid,['ready-one','ready-two']);assert.equal(explicit.source,'explicit');assert.equal(explicit.base,undefined);
});

test('the workflow environment uses fourteen normal lanes without overriding the benchmark default',async t=>{
  const slugs=Array.from({length:14},(_,index)=>'ready-pack-'+index),plan=await planDealerPackCiEnvironment({root:area(t),
    env:{PACK_HEAD:head,PACK_SLUGS:JSON.stringify(slugs)},validatePack:ready});
  assert.equal(plan.source,'explicit');assert.deepEqual(plan.lanes.include.map(row=>row.slugs),slugs.map(slug=>[slug]));
});

test('explicit slugs plus a batch validate every selected slug against that batch without changing selection mode',async t=>{
  const checked=[],plan=await planDealerPackCiEnvironment({root:area(t),env:{PACK_HEAD:head,PACK_SLUGS:'owned-pack,foreign-pack',PACK_BATCH:'2'},
    validatePack:async options=>{checked.push({slug:options.slug,batch:options.batch});if(options.slug==='foreign-pack')throw Error('Pack is outside batch2');return ready();}});
  assert.deepEqual(checked,[{slug:'owned-pack',batch:'2'},{slug:'foreign-pack',batch:'2'}]);assert.deepEqual(plan.valid,['owned-pack']);
  assert.equal(plan.rejected.length,1);assert.equal(plan.status,'partial-failure');
});

test('batch dispatch ignores incidental HEAD and selects exactly the assigned research identities',async t=>{
  const root=area(t),manifest={priorityResearchIds:Array.from({length:400},(_,index)=>'gb-lead-'+index)};
  put(root,'leads/expansion-2026-10-18/manifest.json',manifest);put(root,PACK_BATCH_FILE,buildPackBatchAssignments(manifest));
  put(root,'dealers/assigned-pack/dealer.json',{slug:'assigned-pack',dealerId:'gb-lead-100'});
  const plan=await planDealerPackCiEnvironment({root,env:{PACK_HEAD:head,PACK_BATCH:'2'},validatePack:ready});
  assert.equal(plan.source,'batch-2');assert.deepEqual(plan.valid,['assigned-pack']);assert.equal(plan.rejected.length,99);
});

test('PR environment forwards exact base and head to Git diff and skips unrelated pipeline changes',async t=>{
  const root=area(t),base='2'.repeat(40),calls=[],readGit=(directory,args)=>{assert.equal(directory,root);calls.push(args);return 'dealers/templates.lock.json\0';};
  const empty=await planDealerPackCiEnvironment({root,env:{PACK_BASE:base,PACK_HEAD:head},readGit,validatePack:()=>{throw Error('No proof fallback permitted');}});
  assert.equal(empty.status,'skipped');assert.equal(empty.requested.length,0);
  assert.deepEqual(calls,[['diff','--name-only','-z',base+'..'+head,'--','dealers/']]);
  put(root,'dealers/changed-pack/dealer.json',{slug:'changed-pack'});
  const changed=await planDealerPackCiEnvironment({root,env:{PACK_BASE:base,PACK_HEAD:head},readGit:()=> 'dealers/changed-pack/dealer.json\0dealers/templates.lock.json\0',validatePack:ready});
  assert.deepEqual(changed.valid,['changed-pack']);assert.equal(changed.source,'pr-changed-packs');
});

test('ambiguous benchmark requests and invalid batch scope fail clearly before any pack is checked',async t=>{
  for(const env of [{PACK_BENCHMARK:'true',PACK_BATCH:'1'},{PACK_BENCHMARK:'true',PACK_SLUGS:'one-pack'},{PACK_SLUGS:'one-pack',PACK_BATCH:'9'}])
    await assert.rejects(planDealerPackCiEnvironment({root:area(t),env,validatePack:()=>{throw Error('Must not read');}}),/Benchmark planning|assigned batch/);
});
