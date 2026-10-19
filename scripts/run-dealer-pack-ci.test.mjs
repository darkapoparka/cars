import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {planDealerPackCiEnvironment} from './run-dealer-pack-ci.mjs';
import {buildPackBatchAssignments,PACK_BATCH_FILE} from './lib/dealer-pack-identity.mjs';

const ready=async()=>({success:true,packDigest:'a'.repeat(64),releaseId:'cars-six-'+'b'.repeat(64)});
const area=t=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-pack-orchestration-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root;};
const put=(root,name,value)=>{const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof value==='string'?value:JSON.stringify(value));};
const head='1'.repeat(40);

test('the workflow always provides HEAD but explicit and benchmark dispatch still select exactly one planner mode',async t=>{
  const root=area(t);
  const benchmark=await planDealerPackCiEnvironment({root,env:{PACK_HEAD:head,PACK_BENCHMARK:'true'},validatePack:ready});
  assert.equal(benchmark.valid.length,25);assert.equal(benchmark.source,'benchmark25');assert.equal(benchmark.base,undefined);
  const explicit=await planDealerPackCiEnvironment({root,env:{PACK_HEAD:head,PACK_BASE:'2'.repeat(40),PACK_SLUGS:'ready-one,ready-two'},validatePack:ready});
  assert.deepEqual(explicit.valid,['ready-one','ready-two']);assert.equal(explicit.source,'explicit');assert.equal(explicit.base,undefined);
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
