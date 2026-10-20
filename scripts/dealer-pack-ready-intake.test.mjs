import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {selectReadyPackRunCandidates,intakeReadyPackRuns} from './intake-ready-dealer-pack-runs.mjs';

const now=Date.parse('2026-10-20T20:00:00Z');
const candidate=(id=123,overrides={})=>({id,repository:{full_name:'darkapoparka/cars'},head_repository:{full_name:'darkapoparka/cars'},path:'.github/workflows/dealer-pack-pipeline.yml',event:'workflow_dispatch',head_branch:'main',status:'in_progress',conclusion:null,head_sha:'a'.repeat(40),run_attempt:1,created_at:'2026-10-20T19:00:00Z',...overrides});
const listing=rows=>({total_count:rows.length,workflow_runs:rows});

test('scheduled intake excludes forks, branches, PRs, other workflows, old and terminal runs',()=>{
  const rejected=[{head_repository:{full_name:'someone/fork'}},{repository:{full_name:'someone/fork'}},{head_branch:'astra/review'},{event:'pull_request'},{path:'.github/workflows/other.yml'},{status:'completed',conclusion:'success'},{created_at:'2026-10-01T00:00:00Z'},{created_at:'2026-10-21T00:00:00Z'},{head_sha:'main'},{run_attempt:0}];
  const result=selectReadyPackRunCandidates(listing([candidate(),...rejected.map((row,index)=>candidate(index+200,row))]),{now});
  assert.deepEqual(result.runs.map(row=>row.id),[123]);assert.equal(result.skipped.length,rejected.length);
});

test('scheduler refuses incomplete or duplicated inventories and limits work oldest first',()=>{
  assert.throws(()=>selectReadyPackRunCandidates({total_count:2,workflow_runs:[candidate()]},{now}),/Complete bounded/);
  assert.throws(()=>selectReadyPackRunCandidates(listing([candidate(),candidate()]),{now}),/Distinct/);
  assert.throws(()=>selectReadyPackRunCandidates(listing([]),{now,maximumRuns:400}),/at most eight/);
  const result=selectReadyPackRunCandidates(listing([candidate(3),candidate(1,{created_at:'2026-10-20T18:00:00Z'}),candidate(2)]),{now,maximumRuns:2});
  assert.deepEqual(result.runs.map(row=>row.id),[1,2]);assert.deepEqual(result.deferred,[3]);
});

test('only exact dispatcher-qualified requests reach the maintained queue; pending and held sources continue',async()=>{
  const calls=[],enqueued=[],request={id:'f'.repeat(64),slug:'qualified-dealer'};
  const report=await intakeReadyPackRuns({now,readGithub:async operation=>{calls.push(operation);return {status:200,body:listing([candidate(1),candidate(2),candidate(3)])};},store:{read:async()=>({state:{generation:8}})},registry:{},resolver:{discover:async(id,options)=>{
    assert.equal(options.verifyBundles,false);assert.equal(options.queue.generation,8);
    if(id===1)throw Error('Latest shared contracts have not passed');
    return {runId:id,sourceCommit:'a'.repeat(40),requests:id===3?[request]:[],pending:id===2?[{prefix:'unfinished'}]:[],failures:[],producers:[]};
  }},enqueue:async(_store,requests,options)=>{enqueued.push(...requests);assert.equal(options.collectRejections,true);assert.equal(options.automatic,true);return {value:{added:[request.id],existing:[],rejected:[]}};}});
  assert.equal(calls[0].query.branch,'main');assert.equal(calls[0].query.event,'workflow_dispatch');
  assert.deepEqual(enqueued,[request]);assert.equal(report.queueRequestsAdded,1);assert.equal(report.providerWrites,0);
  assert.deepEqual(report.results.map(row=>row.status),['held','awaiting-qualified-producers','retained']);
});

test('a changed source inspection cannot enqueue and retained request results stay unchanged',async()=>{
  let writes=0;
  const report=await intakeReadyPackRuns({now,readGithub:async()=>({status:200,body:listing([candidate()])}),store:{read:async()=>({state:{}})},registry:{},resolver:{discover:async()=>({runId:123,sourceCommit:'b'.repeat(40),requests:[{id:'f'.repeat(64)}]})},enqueue:async()=>{writes++;}});
  assert.equal(writes,0);assert.equal(report.results[0].status,'held');
  const unchanged=await intakeReadyPackRuns({now,readGithub:async()=>({status:200,body:listing([candidate()])}),store:{read:async()=>({state:{requests:{failed:{status:'failed'}}}})},registry:{},resolver:{discover:async()=>({runId:123,sourceCommit:'a'.repeat(40),requests:[{id:'failed'}]})},enqueue:async()=>({value:{added:[],existing:['failed'],rejected:[]}})});
  assert.equal(unchanged.queueRequestsAdded,0);assert.deepEqual(unchanged.results[0].enqueued.existing,['failed']);
});

test('automatic receiver stays on manual main sources and scheduling preserves the guarded drain',()=>{
  const workflow=fs.readFileSync(new URL('../.github/workflows/dealer-pack-deploy.yml',import.meta.url),'utf8');
  assert.match(workflow,/github\.event\.workflow_run\.head_branch == 'main'/);
  assert.match(workflow,/github\.event\.workflow_run\.event == 'workflow_dispatch'/);
  assert.match(workflow,/node scripts\/intake-ready-dealer-pack-runs\.mjs --report runtime\/dealer-pack-dispatch\/ready-intake\.json/);
  assert.match(workflow,/--max 10/);assert.match(workflow,/reconcile\.conclusion == 'success'/);
  assert.match(workflow,/PACK_ACTION:.*enqueue-and-deploy/);
});
