import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {ROOT} from './lib/workflow.mjs';
import {PACK_PILOT_SLUGS,inspectPackPilot,validatePackPilotInspectionRequest} from './inspect-dealer-pack-pilot.mjs';

const sourceCommit='a'.repeat(40),sourceRunId=123;
const request=()=>({schemaVersion:1,action:'inspect',sourceRunId,sourceCommit,slugs:[...PACK_PILOT_SLUGS]});
const run=()=>({id:sourceRunId,repository:{full_name:'darkapoparka/cars'},head_repository:{full_name:'darkapoparka/cars'},head_sha:sourceCommit,path:'.github/workflows/dealer-pack-pipeline.yml',event:'pull_request',status:'completed',conclusion:'success'});

test('pre-merge pilot request rejects writes, other dealers, duplicate proofs and unbound sources',()=>{
  assert.deepEqual(validatePackPilotInspectionRequest(request()),request());
  for(const mutation of [{action:'enqueue-and-deploy'},{action:'drain'},{write:true},{sourceCommit:'main'},{sourceRunId:'123'},{slugs:['za-motors','za-motors','granada-auto-sales']},{slugs:['za-motors','other-dealer','granada-auto-sales']},{slugs:['za-motors']}])
    assert.throws(()=>validatePackPilotInspectionRequest({...request(),...mutation}));
});

test('pre-merge inspection rejects a mismatched run SHA before dispatch or downloads',async()=>{
  let dispatched=false;
  await assert.rejects(inspectPackPilot({request:request(),readGithub:async()=>({status:200,body:{...run(),head_sha:'b'.repeat(40)}}),dispatch:async()=>{dispatched=true;}}),/source commit differs/);
  assert.equal(dispatched,false);
});

test('absent provider credential completes only a sealed offline dry run, with no queue/write command',async()=>{
  const directory=path.join(ROOT,'runtime/pilot-inspection-test-'+process.pid);
  try{
    let observed;
    const report=await inspectPackPilot({request:request(),reportFile:path.join(directory,'summary.json'),providerTokenPresent:false,readGithub:async()=>({status:200,body:run()}),dispatch:async args=>{
      observed=args;return {success:true,providerWrites:0,bundleVerified:true,sourceCommit,requests:PACK_PILOT_SLUGS.map(slug=>({slug})),liveProviderVerified:false};
    }});
    assert.equal(observed[0],'inspect');assert.ok(!observed.includes('--write')&&!observed.includes('--live'));
    assert.equal(report.status,'blocked-missing-provider-token');assert.equal(report.readyToDeploy,false);assert.equal(report.requiredSecret,'CLOUDFLARE_API_TOKEN');
    assert.deepEqual([report.providerWrites,report.queueWrites,report.deployments],[0,0,0]);
  }finally{fs.rmSync(directory,{recursive:true,force:true});}
});

test('partial or falsely live inspection cannot count as a passing three-proof dry run',async()=>{
  const directory=path.join(ROOT,'runtime/pilot-inspection-reject-test-'+process.pid);
  try{
    for(const changes of [{success:false},{requests:[{slug:'za-motors'}]},{liveProviderVerified:true},{providerWrites:1}])
      await assert.rejects(inspectPackPilot({request:request(),reportFile:path.join(directory,'summary.json'),providerTokenPresent:false,readGithub:async()=>({status:200,body:run()}),dispatch:async()=>({success:true,providerWrites:0,bundleVerified:true,sourceCommit,requests:PACK_PILOT_SLUGS.map(slug=>({slug})),liveProviderVerified:false,...changes})}));
  }finally{fs.rmSync(directory,{recursive:true,force:true});}
});

test('present provider credential adds only live reads to the ordinary inspect command',async()=>{
  const directory=path.join(ROOT,'runtime/pilot-inspection-live-test-'+process.pid);
  try{
    let observed;
    const report=await inspectPackPilot({request:request(),reportFile:path.join(directory,'summary.json'),providerTokenPresent:true,readGithub:async()=>({status:200,body:run()}),dispatch:async args=>{
      observed=args;return {success:true,providerWrites:0,bundleVerified:true,sourceCommit,requests:PACK_PILOT_SLUGS.map(slug=>({slug})),liveProviderVerified:true,providerObservations:PACK_PILOT_SLUGS.map(slug=>({slug,scriptCount:100}))};
    }});
    assert.equal(observed[0],'inspect');assert.ok(observed.includes('--live')&&!observed.includes('--write'));
    assert.equal(report.status,'dry-run-passed');assert.equal(report.requiredSecret,null);assert.equal(report.readyToDeploy,false);
    assert.equal(report.providerObservations.length,3);assert.deepEqual([report.providerWrites,report.queueWrites,report.deployments],[0,0,0]);
  }finally{fs.rmSync(directory,{recursive:true,force:true});}
});

test('actual workflow events keep manual inspection read-only and automatic intake source-bound',async()=>{
  const workflow=fs.readFileSync(new URL('../.github/workflows/dealer-pack-deploy.yml',import.meta.url),'utf8');
  const section=name=>{const value=workflow.split('      - name: '+name+'\n')[1]?.split('\n      - ')[0];assert.ok(value,'Workflow step missing: '+name);return value;};
  // Evaluate the actual bounded Actions expressions against event fixtures.
  // The expression grammar used here is also valid JavaScript; no provider,
  // repository or artifact operation is performed by this regression.
  const expression=(text,key='if')=>{const match=text.match(new RegExp('^\\s*'+key+': \\$\\{\\{(.+)\\}\\}\\s*$','m'));assert.ok(match,'Workflow expression missing: '+key);return new Function('github','inputs','steps','cancelled','return ('+match[1]+');');};
  const intake=section('Intake qualified owner-selected main builds or perform a manual inspection');
  const gates={job:expression(workflow.split('  deploy:\n')[1]),intake:expression(intake),drain:expression(section('Drain all retained batches through the single account claim')),
    metrics:expression(section('Read startup, sampled CPU, memory and error evidence for this drain')),blocked:expression(section('Record an unavailable deployment credential as a blocked write request'))};
  const action=expression(intake,'PACK_ACTION'),automatic=expression(intake,'PACK_AUTOMATIC');
  const evaluate=(event,input,present,{conclusion='success',repository='darkapoparka/cars',branch='main',sourceEvent='workflow_dispatch',guard='success',cancelled=false}={})=>{
    const github={event_name:event,repository:'darkapoparka/cars',event:{workflow_run:{conclusion,head_branch:branch,event:sourceEvent,head_repository:{full_name:repository}}}},inputs={action:input},steps={token:{outputs:{present:String(present)}},executor_guard:{conclusion:guard},reconcile:{conclusion:'success'}};
    return {gates:Object.fromEntries(Object.entries(gates).map(([key,value])=>[key,Boolean(value(github,inputs,steps,()=>cancelled))])),action:action(github,inputs,steps,()=>cancelled),automatic:automatic(github,inputs,steps,()=>cancelled)};
  };
  for(const present of [false,true]){
    for(const conclusion of ['success','failure'])assert.deepEqual(evaluate('workflow_run',undefined,present,{conclusion}),{gates:{job:true,intake:true,drain:present,metrics:present,blocked:!present},action:'enqueue-and-deploy',automatic:'true'});
    assert.deepEqual(evaluate('workflow_dispatch','inspect',present),{gates:{job:true,intake:true,drain:false,metrics:false,blocked:false},action:'inspect',automatic:'false'});
    for(const input of ['enqueue-and-deploy','drain'])assert.deepEqual(evaluate('workflow_dispatch',input,present),{gates:{job:true,intake:input!=='drain',drain:present,metrics:present,blocked:!present},action:input,automatic:'false'});
    assert.deepEqual(evaluate('schedule',undefined,present).gates,{job:true,intake:false,drain:present,metrics:present,blocked:!present});
    assert.deepEqual(evaluate('push',undefined,present).gates,{job:false,intake:false,drain:false,metrics:false,blocked:false});
    assert.equal(evaluate('workflow_run',undefined,present,{conclusion:'cancelled'}).gates.job,false);
    assert.equal(evaluate('workflow_run',undefined,present,{repository:'someone/fork'}).gates.job,false);
    assert.equal(evaluate('workflow_run',undefined,present,{branch:'astra/review'}).gates.job,false);
    assert.equal(evaluate('workflow_run',undefined,present,{sourceEvent:'pull_request'}).gates.job,false);
    for(const name of ['drain','metrics','blocked'])assert.equal(evaluate('workflow_run',undefined,present,{guard:'failure'}).gates[name],false);
  }
  for(const name of ['drain','metrics','blocked'])assert.equal(evaluate('workflow_dispatch','enqueue-and-deploy',name!=='blocked',{cancelled:true}).gates[name],false);
  const script=intake.match(/node --input-type=module <<'NODE'\n([\s\S]*?)\n\s*NODE/);assert.ok(script,'Workflow intake script missing');
  const execute=new (Object.getPrototypeOf(async function(){}).constructor)('process','fs','runPackQueueDispatcher',script[1].replace(/^\s*import .+;\n/gm,''));
  for(const present of [false,true]){
    let observed;
    const mode=evaluate('workflow_run',undefined,present);
    await execute({env:{PACK_ACTION:mode.action,PACK_AUTOMATIC:mode.automatic,SOURCE_RUN_ID:'123',CLOUDFLARE_API_TOKEN:present?'fixture-token':''}},
      {mkdirSync:()=>assert.fail('Automatic intake must not write a slug-selection file'),writeFileSync:()=>assert.fail('Unexpected intake file write')},async args=>{observed=args;});
    assert.equal(observed[0],'enqueue');assert.ok(observed.includes('--automatic'));assert.ok(!observed.includes('--live')&&!observed.includes('--write'));
    await execute({env:{PACK_ACTION:'inspect',PACK_AUTOMATIC:'false',SOURCE_RUN_ID:'123',CLOUDFLARE_API_TOKEN:present?'fixture-token':''}},
      {mkdirSync:()=>assert.fail('Unexpected inspect file write'),writeFileSync:()=>assert.fail('Unexpected inspect file write')},async args=>{observed=args;});
    assert.equal(observed[0],'inspect');assert.equal(observed.includes('--live'),present);assert.ok(!observed.includes('--automatic')&&!observed.includes('--write'));
  }
});
