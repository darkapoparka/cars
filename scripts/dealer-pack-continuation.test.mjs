import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {continuePackQueue,dispatchPackContinuation} from './continue-dealer-pack-queue.mjs';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,createPackDeploymentQueue,packDeploymentRequest,queueDigest,validatePackQueue} from './lib/dealer-pack-queue.mjs';

const sha='a'.repeat(40),at='2026-10-21T00:00:00.000Z',repository='darkapoparka/cars',workflow='.github/workflows/dealer-pack-deploy.yml';
const policy={schemaVersion:1,kind:'cars-owner-authorized-pack-deployment',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,zoneName:'webpreviews.site',workersPlan:'paid',allowedScripts:500,minimumSpareScripts:0,ownerConfirmedPaid:true,allowNewPreviews:true,outreachApproved:false,authorizedAt:at,authorizationSource:'Owner M2 instruction dated 20 October 2026',reason:'Owner approved 100 existing plus 400 new previews with no remaining reserve.',maximumNewDealers:400};
function fixture(){
  const state=createPackDeploymentQueue({policy,now:at,queueId:'11111111-1111-4111-8111-111111111111',baseline:{accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,evidence:'authenticated-cloudflare-api',complete:true,observedAt:at,workerNames:[],routes:[],domains:[]}});
  const make=slug=>packDeploymentRequest({slug,dealerId:'gb-leicester-'+slug,batch:1,workerName:'cars-'+slug,publicOrigin:'https://'+slug+'.webpreviews.site',packDigest:queueDigest(slug),releaseId:'cars-six-current',releaseDigest:queueDigest('release'),outputDigest:queueDigest('output'),sourceCommit:sha});
  const done=make('done'),pending=make('pending'),failed=make('failed'),failedTwo=make('failed-two');
  const receipt={status:'deployed',hostedVerified:true,queueId:state.queueId,requestId:done.id,slug:done.slug};
  state.order=[done.id,pending.id,failed.id,failedTwo.id];
  state.requests[done.id]={request:done,status:'deployed',events:[{kind:'claimed',owner:'github:123'}],receiptSha256:queueDigest(receipt)};
  state.requests[pending.id]={request:pending,status:'queued',events:[]};
  state.requests[failed.id]={request:failed,status:'failed',events:[]};
  state.requests[failedTwo.id]={request:failedTwo,status:'failed',events:[]};
  state.receipts.done=[{receipt,sha256:queueDigest(receipt)}];
  const drain={status:'completed',results:[{status:'deployed',receipt:structuredClone(receipt)}]};
  const env={GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'1',GITHUB_REPOSITORY:repository,GITHUB_REF:'refs/heads/main',GITHUB_WORKFLOW_REF:repository+'/'+workflow+'@refs/heads/main',GITHUB_SHA:sha,GITHUB_WORKFLOW_SHA:sha,PACK_EXECUTOR_SHA:sha,GITHUB_EVENT_NAME:'workflow_dispatch',PACK_ACTION:'drain'};
  const run={id:123,run_attempt:1,repository:{full_name:repository},head_repository:{full_name:repository},path:workflow,head_branch:'main',head_sha:sha,event:env.GITHUB_EVENT_NAME,status:'in_progress',conclusion:null};
  const calls=[];
  const readGithub=async operation=>{
    calls.push(operation);
    assert.equal(operation.method,'GET');
    if(operation.path.endsWith('/actions/runs/123'))return {status:200,body:run};
    assert.equal(operation.path,'/repos/'+repository+'/git/ref/heads/main');
    return {status:200,body:{ref:'refs/heads/main',object:{type:'commit',sha}}};
  };
  const store={read:async()=>{calls.push({method:'QUEUE_READ'});return {revision:'b'.repeat(40),state:structuredClone(state)};},compareAndSwap:()=>assert.fail('Continuation cannot mutate the queue')};
  const dispatch=async value=>{calls.push({method:'DISPATCH',...value});};
  return {state,drain,env,run,calls,readGithub,store,dispatch,pending,failed};
}

test('a successful normal drain hands off exactly once without changing queued or failed rows',async()=>{
  const f=fixture(),before=JSON.stringify(f.state),report=await continuePackQueue(f);
  assert.equal(report.status,'dispatched');assert.equal(report.dispatches,1);assert.equal(report.pending,1);
  assert.equal(report.providerWrites,0);assert.equal(report.queueWrites,0);assert.equal(JSON.stringify(f.state),before);
  assert.deepEqual(f.calls.map(row=>row.method),['GET','GET','QUEUE_READ','DISPATCH']);
  assert.deepEqual(f.calls.at(-1),{method:'DISPATCH',sourceSha:sha});
});

test('schedule, producer completion and manual normal drains use the same guarded handoff',async()=>{
  for(const [event,action] of [['schedule',''],['workflow_run',''],['workflow_dispatch','enqueue-and-deploy']]){
    const f=fixture();f.env.GITHUB_EVENT_NAME=event;f.env.PACK_ACTION=action;f.run.event=event;
    assert.equal((await continuePackQueue(f)).status,'dispatched');
  }
});

test('empty, partial, failed, uncertain and rollback drains cannot dispatch',async()=>{
  for(const change of [f=>f.drain.results=[],f=>f.drain.status='queued',f=>f.drain.status='completed-with-failures',f=>f.drain.results[0].status='failed',f=>f.drain.results[0].status='rolled-back',f=>f.drain.results[0].claimRetained=true,f=>f.drain.results[0].error='failure',f=>f.drain.results=Array.from({length:11},()=>f.drain.results[0])]){
    const f=fixture();change(f);assert.equal((await continuePackQueue(f)).status,'skipped');assert.equal(f.calls.length,0);
  }
});

test('inspection, recovery, rerun and non-main source contexts cannot continue',async()=>{
  for(const patch of [{PACK_ACTION:'inspect'},{PACK_ACTION:'recover-inspect'},{PACK_ACTION:'recover-and-drain'},{GITHUB_EVENT_NAME:'push'},{GITHUB_RUN_ATTEMPT:'2'},{GITHUB_REF:'refs/heads/other'},{GITHUB_WORKFLOW_REF:repository+'/'+workflow+'@refs/heads/other'},{GITHUB_REPOSITORY:'someone/fork'},{GITHUB_SHA:'c'.repeat(40)},{GITHUB_WORKFLOW_SHA:'c'.repeat(40)},{PACK_EXECUTOR_SHA:'main'}]){
    const f=fixture();Object.assign(f.env,patch);assert.equal((await continuePackQueue(f)).status,'skipped');assert.equal(f.calls.length,0);
  }
});

test('authenticated run/source drift or missing source proof blocks a dispatch',async()=>{
  for(const patch of [{head_sha:'c'.repeat(40)},{head_branch:'other'},{path:'.github/workflows/other.yml'},{run_attempt:2},{status:'completed',conclusion:'success'},{event:'push'},{head_repository:{full_name:'someone/fork'}}]){
    const f=fixture();Object.assign(f.run,patch);assert.equal((await continuePackQueue(f)).status,'skipped');assert.ok(!f.calls.some(row=>row.method==='DISPATCH'));
  }
  for(const response of [{status:404},{status:200,body:{ref:'refs/heads/other',object:{type:'commit',sha}}},{status:200,body:{ref:'refs/heads/main',object:{type:'tag',sha}}},{status:200,body:{ref:'refs/heads/main',object:{type:'commit',sha:'main'}}}]){
    const f=fixture(),read=f.readGithub;
    f.readGithub=async operation=>operation.path.endsWith('/git/ref/heads/main')?response:read(operation);
    assert.equal((await continuePackQueue(f)).status,'skipped');assert.ok(!f.calls.some(row=>row.method==='QUEUE_READ'));
  }
});

test('accepted main advances hand off to its exact authenticated commit without changing parent proof',async()=>{
  const f=fixture(),read=f.readGithub,target='c'.repeat(40);
  f.readGithub=async operation=>operation.path.endsWith('/git/ref/heads/main')?{status:200,body:{ref:'refs/heads/main',object:{type:'commit',sha:target}}}:read(operation);
  const report=await continuePackQueue(f);
  assert.equal(report.status,'dispatched');assert.equal(report.sourceSha,sha);assert.equal(report.continuationSourceSha,target);
  assert.equal(report.dispatches,1);assert.deepEqual(f.calls.at(-1),{method:'DISPATCH',sourceSha:target});
});

test('a fresh active or uncertain claim blocks continuation even after successful receipts',async()=>{
  for(const status of ['active','needs-reconciliation']){
    const f=fixture();f.state.requests[f.pending.id].status=status;
    f.state.active={requestId:f.pending.id,owner:'github:456',token:'private-claim-token-not-output',claimedAt:at};
    validatePackQueue(f.state);const report=await continuePackQueue(f);
    assert.equal(report.status,'skipped');assert.ok(!JSON.stringify(report).includes('private-claim-token'));
    assert.ok(!f.calls.some(row=>row.method==='DISPATCH'));
  }
  const f=fixture();f.state.requests[f.pending.id].status='needs-reconciliation';
  assert.equal((await continuePackQueue(f)).status,'skipped');
});

test('only fresh queued rows count; terminal failures cannot create an empty dispatch loop',async()=>{
  const f=fixture();f.state.requests[f.pending.id].status='failed';
  const report=await continuePackQueue(f);assert.equal(report.status,'skipped');assert.equal(report.pending,0);
  assert.ok(!f.calls.some(row=>row.method==='DISPATCH'));
});

test('receipts must be durable, distinct and owned by this exact executor',async()=>{
  for(const change of [f=>f.drain.results.push(f.drain.results[0]),f=>f.drain.results[0].receipt.hostedVerified=false,f=>f.drain.results[0].receipt.slug='forged',f=>f.state.requests[f.drain.results[0].receipt.requestId].events[0].owner='github:456',f=>f.state.receipts.done=[],f=>f.drain.results[0].receipt.queueId='other-queue']){
    const f=fixture();change(f);assert.equal((await continuePackQueue(f)).status,'skipped');assert.ok(!f.calls.some(row=>row.method==='DISPATCH'));
  }
});

test('dispatch uses a single scoped POST and handles the empty 204 response',async()=>{
  const calls=[];
  await dispatchPackContinuation({sourceSha:sha,token:'test-token-never-output',fetchImpl:async(url,options)=>{
    calls.push({url,options});return {status:204,json:()=>assert.fail('204 has no JSON body')};
  }});
  assert.equal(calls.length,1);assert.equal(calls[0].url,'https://api.github.com/repos/'+repository+'/actions/workflows/dealer-pack-deploy.yml/dispatches');
  assert.equal(calls[0].options.method,'POST');
  assert.deepEqual(JSON.parse(calls[0].options.body),{ref:'main',inputs:{action:'drain',batch:'auto',continuation_source_sha:sha}});
  const acknowledged=await dispatchPackContinuation({sourceSha:sha,token:'test-token-never-output',fetchImpl:async()=>({status:200,json:async()=>({workflow_run_id:789,run_url:'https://api.github.com/repos/'+repository+'/actions/runs/789',html_url:'https://github.com/'+repository+'/actions/runs/789'})})});
  assert.deepEqual(acknowledged,{httpStatus:200,runId:789});
  for(const response of [async()=>({status:403}),async()=>({status:500}),async()=>{throw Error('Ambiguous network timeout');}]){
    let count=0;await assert.rejects(dispatchPackContinuation({sourceSha:sha,token:'test-token-never-output',fetchImpl:async()=>{count++;return response();}}));assert.equal(count,1);
  }
});

const workflowText=fs.readFileSync(new URL('../.github/workflows/dealer-pack-deploy.yml',import.meta.url),'utf8');
const continuation=workflowText.split(/^      - /m).find(row=>row.startsWith('name: Continue a successful nonempty normal drain'));
function condition({event='workflow_dispatch',action='drain',succeeded=true,drain='success'}={}){
  const expression=continuation.match(/^        if: \$\{\{ (.+) \}\}$/m)?.[1];assert.ok(expression);
  return Function('github','inputs','steps','success',`return (${expression});`)({event_name:event},{action},{drain:{conclusion:drain}},()=>succeeded);
}
test('workflow continuation requires successful preceding checks and excludes recovery',()=>{
  assert.equal(condition(),true);assert.equal(condition({event:'schedule'}),true);assert.equal(condition({event:'workflow_run'}),true);
  for(const action of ['inspect','recover-inspect','recover-and-drain'])assert.equal(condition({action}),false);
  assert.equal(condition({succeeded:false}),false);
  for(const drain of ['skipped','cancelled','failure'])assert.equal(condition({drain}),false);
  assert.match(workflowText,/id: drain/);assert.match(workflowText,/PACK_EXECUTOR_SHA: \$\{\{ steps\.executor_source\.outputs\.commit \}\}/);
  assert.match(workflowText,/contents: write\n      actions: write/);
  assert.match(workflowText,/--max 10 --report runtime\/dealer-pack-dispatch\/drain\.json/);
  assert.ok(workflowText.indexOf('name: Read startup, sampled CPU')<workflowText.indexOf('name: Continue a successful'));
  assert.equal((workflowText.match(/run: node scripts\/continue-dealer-pack-queue\.mjs/g)??[]).length,1);
});

test('child job refuses the main-branch race before any steps or provider writes',()=>{
  const expression=workflowText.match(/^    if: \$\{\{ (.+continuation_source_sha.+) \}\}$/m)?.[1];assert.ok(expression);
  const evaluate=({source=sha,head=sha,workflowSha=sha,ref='refs/heads/main',action='drain'}={})=>Function('github','inputs',`return (${expression});`)({event_name:'workflow_dispatch',sha:head,workflow_sha:workflowSha,ref},{continuation_source_sha:source,action});
  assert.equal(evaluate(),true);assert.equal(evaluate({source:''}),true);assert.equal(evaluate({source:null}),true);
  assert.equal(evaluate({head:'c'.repeat(40)}),false);assert.equal(evaluate({workflowSha:'c'.repeat(40)}),false);
  assert.equal(evaluate({ref:'refs/heads/other'}),false);assert.equal(evaluate({action:'recover-and-drain'}),false);
});
