import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {notifyPackSourceComplete,runPackSourceCompletionCli} from './notify-dealer-pack-source-complete.mjs';

const sourceSha='a'.repeat(40),nonce='b'.repeat(64),token='test-actions-token-never-retain';
const env={GITHUB_TOKEN:token,GITHUB_REPOSITORY:'darkapoparka/cars',GITHUB_REF:'refs/heads/main',GITHUB_EVENT_NAME:'workflow_dispatch',GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'1',GITHUB_SHA:sourceSha,GITHUB_WORKFLOW_SHA:sourceSha,GITHUB_WORKFLOW_REF:'darkapoparka/cars/.github/workflows/dealer-pack-pipeline.yml@refs/heads/main',ROLLOUT_REQUEST_ID:nonce,ROLLOUT_SOURCE_SHA:sourceSha,CONTRACTS_RESULT:'success',PLAN_RESULT:'success',LANE_RESULT:'success',HAS_WORK:'true',BENCHMARK:'false'};
const run={id:123,repository:{full_name:'darkapoparka/cars'},head_repository:{full_name:'darkapoparka/cars'},head_branch:'main',head_sha:sourceSha,path:'.github/workflows/dealer-pack-pipeline.yml',event:'workflow_dispatch',run_attempt:1,display_title:'Cars rollout '+nonce,status:'in_progress',conclusion:null};
function fixture(t){const directory=fs.mkdtempSync(path.join(os.tmpdir(),'cars-native-complete-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));return {directory,reportFile:path.join(directory,'runtime/dealer-pack-source/notify-complete.json')};}
const json=value=>new Response(JSON.stringify(value),{status:200,headers:{'Content-Type':'application/json'}});

test('native completion persists intent then sends exactly one authenticated strict automatic intake dispatch',async t=>{
  const {reportFile}=fixture(t),calls=[];
  const fetchImpl=async(url,options)=>{calls.push({url,options});assert.equal(options.headers.Authorization,'Bearer '+token);assert.equal(options.redirect,'error');
    if(options.method==='GET'){assert.equal(url,'https://api.github.com/repos/darkapoparka/cars/actions/runs/123');assert.equal(fs.existsSync(reportFile),false);return json(run);}
    const retained=JSON.parse(fs.readFileSync(reportFile));assert.equal(retained.status,'dispatch-intent');assert.equal(retained.dispatchIntent.maximumAttempts,1);assert.equal(retained.sourceSha,sourceSha);assert.equal(retained.reservationId,nonce);assert.equal(JSON.stringify(retained).includes(token),false);
    assert.deepEqual(JSON.parse(options.body),{ref:'main',inputs:{action:'enqueue-and-deploy',source_run_id:'123',automatic_intake:'true',batch:'auto'}});assert.deepEqual(retained.dispatchIntent.body,JSON.parse(options.body));
    return new Response(null,{status:204});};
  const report=await notifyPackSourceComplete({env,reportFile,fetchImpl});assert.equal(report.status,'dispatched');assert.equal(report.dispatches,1);assert.equal(calls.filter(r=>r.options.method==='POST').length,1);assert.equal(calls.length,2);assert.equal(report.providerWrites,0);assert.equal(report.queueWrites,0);assert.deepEqual(JSON.parse(fs.readFileSync(reportFile)),report);assert.equal(fs.readFileSync(reportFile,'utf8').includes(token),false);
});

test('native completion admits independently failed lanes only after the shared contracts and plan gates',async t=>{
  const {reportFile}=fixture(t);let posts=0;
  const report=await notifyPackSourceComplete({env:{...env,LANE_RESULT:'failure'},reportFile,fetchImpl:async(_url,options)=>options.method==='GET'?json(run):(posts++,new Response(null,{status:204}))});
  assert.equal(report.status,'dispatched');assert.equal(report.laneResult,'failure');assert.equal(posts,1);assert.match(report.qualification,/receiver inspection/);
});

test('native completion cannot call back for PR, fork, other branch, rerun, benchmark, failed contracts, cancelled or no work',async t=>{
  const {directory}=fixture(t),changes=[{GITHUB_EVENT_NAME:'pull_request'},{GITHUB_EVENT_NAME:'push'},{GITHUB_REPOSITORY:'attacker/cars'},{GITHUB_REF:'refs/heads/other'},{GITHUB_RUN_ATTEMPT:'2'},{PACK_CANCELLED:'true'},{LANE_RESULT:'cancelled'},{LANE_RESULT:'skipped'},{BENCHMARK:'true'},{BENCHMARK:''},{HAS_WORK:'false'},{CONTRACTS_RESULT:'failure'},{PLAN_RESULT:'failure'},{PLAN_RESULT:'skipped'},{ROLLOUT_REQUEST_ID:''},{ROLLOUT_REQUEST_ID:'b'.repeat(63)},{ROLLOUT_SOURCE_SHA:''},{ROLLOUT_SOURCE_SHA:'c'.repeat(40)},{GITHUB_SHA:'c'.repeat(40)},{GITHUB_WORKFLOW_SHA:'c'.repeat(40)},{GITHUB_WORKFLOW_REF:env.GITHUB_WORKFLOW_REF.replace('main','other')},{GITHUB_RUN_ID:'0'},{GITHUB_RUN_ID:'9007199254740992'}];
  for(const [i,change]of changes.entries()){const report=await notifyPackSourceComplete({env:{...env,...change},reportFile:path.join(directory,'runtime','skip-'+i+'.json'),fetchImpl:async()=>assert.fail('Guarded context must make no HTTP call')});assert.equal(report.status,'skipped',JSON.stringify(change));assert.equal(report.dispatches,0);}
});

test('native completion requires authenticated same-source original run and exact scheduler nonce proof',async t=>{
  const {directory}=fixture(t),changes=[{id:124},{repository:{full_name:'attacker/cars'}},{head_repository:{full_name:'attacker/cars'}},{head_branch:'other'},{head_sha:'c'.repeat(40)},{path:'.github/workflows/other.yml'},{event:'pull_request'},{run_attempt:2},{display_title:'Cars rollout '+'c'.repeat(64)},{status:'completed',conclusion:'success'},{status:'completed',conclusion:'cancelled'},{conclusion:'failure'}];
  for(const [i,change]of changes.entries()){let reads=0;const report=await notifyPackSourceComplete({env,reportFile:path.join(directory,'runtime','blocked-'+i+'.json'),fetchImpl:async(_url,options)=>{assert.equal(options.method,'GET');reads++;return json({...run,...change});}});assert.equal(report.status,'blocked',JSON.stringify(change));assert.equal(reads,1);assert.equal(report.dispatches,0);}
});

test('native completion records unavailable authentication and run proof without any POST',async t=>{
  const {directory}=fixture(t);const absent=await notifyPackSourceComplete({env:{...env,GITHUB_TOKEN:''},reportFile:path.join(directory,'runtime/absent.json'),fetchImpl:async()=>assert.fail('No credential must make no call')});assert.equal(absent.status,'blocked');
  const failures=[async()=>new Response(null,{status:403}),async()=>{throw Error('Untrusted read failure '+token);},async()=>new Response('not json',{status:200})];
  for(const [i,fetchImpl]of failures.entries()){const file=path.join(directory,'runtime/failure-'+i+'.json'),report=await notifyPackSourceComplete({env,reportFile:file,fetchImpl});assert.equal(report.status,'blocked');assert.equal(fs.readFileSync(file,'utf8').includes(token),false);}
});

test('native completion retains ambiguous dispatches and never repeats a persisted attempt',async t=>{
  const {directory}=fixture(t),failures=[async()=>{throw Error('Timeout after possible acceptance '+token);},async()=>new Response(null,{status:502}),async()=>new Response(null,{status:302}),async()=>json({workflow_run_id:456,run_url:'https://attacker.example/runs/456',html_url:'https://github.com/darkapoparka/cars/actions/runs/456'}),async()=>new Response('invalid json',{status:200})];
  for(const [i,dispatch]of failures.entries()){const reportFile=path.join(directory,'runtime/uncertain-'+i+'.json');let posts=0;
    const report=await notifyPackSourceComplete({env,reportFile,fetchImpl:async(_url,options)=>options.method==='GET'?json(run):(posts++,dispatch())});assert.equal(report.status,'needs-reconciliation');assert.equal(report.dispatches,null);assert.equal(posts,1);assert.equal(fs.readFileSync(reportFile,'utf8').includes(token),false);const retained=fs.readFileSync(reportFile);
    const again=await notifyPackSourceComplete({env,reportFile,fetchImpl:async()=>assert.fail('Persisted attempt must never call HTTP again')});assert.equal(again.status,'needs-reconciliation');assert.deepEqual(fs.readFileSync(reportFile),retained);
  }
});

test('native completion accepts only an exact positively identified 200 dispatch acknowledgement',async t=>{
  const {reportFile}=fixture(t);let posts=0;
  const report=await notifyPackSourceComplete({env,reportFile,fetchImpl:async(_url,options)=>options.method==='GET'?json(run):(posts++,json({workflow_run_id:456,run_url:'https://api.github.com/repos/darkapoparka/cars/actions/runs/456',html_url:'https://github.com/darkapoparka/cars/actions/runs/456'}))});assert.equal(report.status,'dispatched');assert.equal(report.childRunId,456);assert.equal(posts,1);
});

test('native completion exclusive intent prevents concurrent callers from both dispatching',async t=>{
  const {reportFile}=fixture(t);let reads=0,posts=0,release;const gate=new Promise(resolve=>{release=resolve;});
  const fetchImpl=async(_url,options)=>{if(options.method==='GET'){reads++;if(reads===2)release();await gate;return json(run);}posts++;return new Response(null,{status:204});};
  const results=await Promise.all([notifyPackSourceComplete({env,reportFile,fetchImpl}),notifyPackSourceComplete({env,reportFile,fetchImpl})]);assert.equal(posts,1);assert.equal(results.filter(r=>r.status==='dispatched').length,1);assert.equal(results.filter(r=>r.status==='needs-reconciliation').length,1);
});

test('native completion cannot dispatch before intent persistence or after losing acknowledgement persistence',async t=>{
  const {directory,reportFile}=fixture(t),parentFile=path.join(directory,'not-a-directory');fs.writeFileSync(parentFile,'retained');
  await assert.rejects(()=>notifyPackSourceComplete({env,reportFile:path.join(parentFile,'report.json'),fetchImpl:async(_url,options)=>{assert.equal(options.method,'GET');return json(run);}}));
  fs.mkdirSync(path.dirname(reportFile),{recursive:true});fs.writeFileSync(reportFile+'.next','retained unrelated unfinished report');let posts=0;
  const report=await notifyPackSourceComplete({env,reportFile,fetchImpl:async(_url,options)=>options.method==='GET'?json(run):(posts++,new Response(null,{status:204}))});assert.equal(report.status,'needs-reconciliation');assert.equal(posts,1);assert.equal(JSON.parse(fs.readFileSync(reportFile)).status,'dispatch-intent');assert.equal(fs.readFileSync(reportFile+'.next','utf8'),'retained unrelated unfinished report');
});

test('native completion CLI confines reports to runtime and fails ambiguous acknowledgement without a retry',async t=>{
  t.mock.method(console,'log',()=>{});
  const {directory}=fixture(t);const originalExitCode=process.exitCode;t.after(()=>{process.exitCode=originalExitCode;});
  await assert.rejects(()=>runPackSourceCompletionCli(['--report','outside.json'],{root:directory,env,fetchImpl:async()=>assert.fail('Path rejection precedes HTTP')}),/generated runtime/);
  await assert.rejects(()=>runPackSourceCompletionCli(['--unexpected','runtime/report.json'],{root:directory,env}),/Use --report/);
  let posts=0;const report=await runPackSourceCompletionCli(['--report','runtime/dealer-pack-source/notify-complete.json'],{root:directory,env,fetchImpl:async(_url,options)=>options.method==='GET'?json(run):(posts++,new Response(null,{status:503}))});assert.equal(report.status,'needs-reconciliation');assert.equal(process.exitCode,1);assert.equal(posts,1);
});

test('native completion actual CLI loads with only its two sparse-checkout modules',t=>{
  const {directory}=fixture(t),scripts=path.join(directory,'scripts');fs.mkdirSync(path.join(scripts,'lib'),{recursive:true});
  for(const file of ['notify-dealer-pack-source-complete.mjs','lib/cli-entrypoint.mjs'])fs.copyFileSync(path.join(import.meta.dirname,file),path.join(scripts,file));
  const result=spawnSync(process.execPath,[path.join(scripts,'notify-dealer-pack-source-complete.mjs'),'--report','runtime/dealer-pack-source/notify-complete.json'],{cwd:directory,env:{...process.env,...env,GITHUB_EVENT_NAME:'pull_request'},encoding:'utf8',timeout:10000,windowsHide:true});
  assert.equal(result.status,0,result.stderr);assert.equal(result.signal,null);assert.equal(JSON.parse(result.stdout).status,'skipped');assert.equal(JSON.parse(fs.readFileSync(path.join(directory,'runtime/dealer-pack-source/notify-complete.json'))).dispatches,0);assert.deepEqual(fs.readdirSync(scripts).sort(),['lib','notify-dealer-pack-source-complete.mjs']);
});
