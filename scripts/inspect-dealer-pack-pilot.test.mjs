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
