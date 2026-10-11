import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {sha256} from './lib/workflow.mjs';
import {validateSingletonGitHubBuild,validateSourcePublication,validateCurrentSingletonTarget,inspectFleetSingleton,runFleetSingletonDeployment,parseDeploymentArgs} from './deploy-dealer-single-worker.mjs';
import {SINGLETON_ACCOUNT} from './assemble-existing-fleet-single-worker.mjs';
import {tinyArea,writeTinySingleton,writeFixture,tinyZip} from './test-fixtures/fleet-single-worker.mjs';
const oldVersion='11111111-1111-4111-8111-111111111111',newVersion='22222222-2222-4222-8222-222222222222';

function fixture(t,{reviewed=true}={}){
 const root=tinyArea(t),f=writeTinySingleton(path.join(root,'runtime/output')),archive=path.join(root,'fixture.zip'),zip=tinyZip(f.directory);writeFixture(archive,zip);
 const sourcePublication={repository:'darkapoparka/cars',commit:f.receipt.sourceCommit,ref:'refs/heads/main',sourceTree:f.receipt.sourceTree,publishedAt:new Date().toISOString(),evidence:'authenticated GitHub source proof'};
 const review={schemaVersion:1,client:f.client,repository:f.repository,sourceRepository:'darkapoparka/cars',reviewed,reviewedAt:reviewed?new Date().toISOString():null,accountId:SINGLETON_ACCOUNT,workerName:f.workerName,publicOrigin:f.publicOrigin,
  sourceCommit:f.receipt.sourceCommit,sourceTree:f.receipt.sourceTree,inputDigest:f.receipt.inputDigest,sourceReleases:f.receipt.sourceReleases,outputDigest:f.receipt.outputDigest,artifactDigest:f.inventory.digest,
  runId:f.receipt.runId,attempt:f.receipt.attempt,artifactId:45678,artifactName:f.delivery.artifactName,archiveDigest:'sha256:'+sha256(zip),archiveBytes:zip.length,archive,directory:f.directory,sourcePublication};
 const remote={run:{id:12345,run_attempt:1,event:'push',head_branch:'main',head_sha:review.sourceCommit,path:'.github/workflows/existing-fleet-cloudflare.yml',repository:{full_name:'darkapoparka/cars'},head_repository:{full_name:'darkapoparka/cars'},status:'completed',conclusion:'success'},
  artifact:{id:review.artifactId,name:review.artifactName,digest:review.archiveDigest,size_in_bytes:review.archiveBytes,expired:false,workflow_run:{id:12345,head_sha:review.sourceCommit}},
  sourceProof:{repository:sourcePublication.repository,commit:sourcePublication.commit,sourceTree:sourcePublication.sourceTree,ref:'refs/heads/main',mainCommit:'9'.repeat(40),mainReachable:true}};
 const snapshot={accountId:SINGLETON_ACCOUNT,workerName:f.workerName,exists:true,workersDev:true,checkedAt:new Date().toISOString(),routes:[],domains:[],schedules:[],tailConsumers:[],bindings:[{name:'ASSETS',type:'assets'},{name:'CARS_APP',type:'service',service:f.workerName+'-app'}],scriptCount:101,allowedScripts:100,versionId:oldVersion,versionTraffic:[{version_id:oldVersion,percentage:100}],evidence:'authenticated-cloudflare-connector'};
 review.providerSnapshot=snapshot;const reviewFile=path.join(root,'review.json');writeFixture(reviewFile,review);
 return {...f,root,archive,reviewFile,review,remote,snapshot,options:{reviewFile,root,registry:f.registry,readMetadata:async()=>remote}};
}

test('default inspection validates full ZIP/source provenance without resolving an uploader or writing',async t=>{
 const f=fixture(t);let uploads=0;const filesBefore=fs.readdirSync(path.join(f.root,'runtime'));
 const result=await runFleetSingletonDeployment({...f.options,provider:{upload(){uploads++;throw Error('Unexpected upload');}}});
 assert.equal(result.deployments,0);assert.equal(result.readyToDeploy,true);assert.equal(result.workerCount,1);assert.deepEqual(result.serviceBindings,[]);assert.equal(uploads,0);assert.deepEqual(fs.readdirSync(path.join(f.root,'runtime')),filesBefore);
 assert.equal(result.privatePublishingMirror.state,'not-verified-by-this-bridge');assert.equal(result.hostedVerified,false);
 assert.equal(result.privatePublishingMirror.verifiedByBridge,false);
});
test('manual branch artifacts, failed runs, changed attempt and wrong singleton artifact hashes fail closed',t=>{
 const f=fixture(t);for(const update of [r=>r.run.head_branch='other',r=>r.run.event='workflow_dispatch',r=>r.run.conclusion='failure',r=>r.run.run_attempt=2,r=>r.artifact.name='existing-cf-delivery-navara-car-12345',r=>r.artifact.digest='sha256:'+'a'.repeat(64)]){
  const remote=structuredClone(f.remote);update(remote);assert.throws(()=>validateSingletonGitHubBuild(remote,f.review),/required|differs/);
 }
});
test('unreviewed proposals remain inspectable but cannot upload',async t=>{
 const f=fixture(t,{reviewed:false});assert.equal((await runFleetSingletonDeployment(f.options)).readyToDeploy,false);
 await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider:{}}),/dated review/);
 assert.equal(fs.existsSync(path.join(f.root,'runtime/dealer-single-worker-deployments')),false);
});
test('canonical source proof never substitutes for an independent source or private publishing mirror',t=>{
 const f=fixture(t),record=f.registry.dealers[0];assert.equal(validateSourcePublication(f.review.sourcePublication,f.remote.sourceProof,f.receipt,record).verifiedMainCommit,'9'.repeat(40));
 assert.throws(()=>validateSourcePublication(f.review.sourcePublication,{...f.remote.sourceProof,mainReachable:false},f.receipt,record),/GitHub proof/);
 assert.throws(()=>validateSourcePublication(f.review.sourcePublication,f.remote.sourceProof,f.receipt,{...record,sourceOwnership:'independent-repository'}),/publication/);
 assert.throws(()=>validateSourcePublication({...f.review.sourcePublication,sourceTree:'a'.repeat(40)},f.remote.sourceProof,f.receipt,record),/publication/);
});
test('foreign resource bindings, absent targets, stale snapshots and split traffic forbid upload',t=>{
 const f=fixture(t);assert.equal(validateCurrentSingletonTarget(f.snapshot,f.workerName).versionId,oldVersion);
 const production={...f.snapshot,bindings:f.snapshot.bindings.map(b=>b.type==='service'?{...b,environment:'production'}:b)};assert.equal(validateCurrentSingletonTarget(production,f.workerName).versionId,oldVersion);
 assert.throws(()=>validateCurrentSingletonTarget({...production,bindings:[{name:'APP',type:'service',service:f.workerName+'-app',environment:'staging'}]},f.workerName),/resources/);
 assert.throws(()=>validateCurrentSingletonTarget({...production,bindings:[{name:'APP',type:'service',service:f.workerName+'-app',environment:'production',entrypoint:'foreign'}]},f.workerName),/resources/);
 for(const change of [{exists:false},{checkedAt:'2020-01-01T00:00:00Z'},{routes:[{pattern:'example.com/*'}]},{bindings:[{name:'DB',type:'d1',id:'foreign'}]},{bindings:[{name:'CARS_APP',type:'service',service:'foreign-app'}]},{versionTraffic:[{version_id:oldVersion,percentage:50}]}])assert.throws(()=>validateCurrentSingletonTarget({...f.snapshot,...change},f.workerName),/required|resources|active/);
 assert.throws(()=>validateCurrentSingletonTarget(f.snapshot,f.workerName,{after:true,versionId:oldVersion}),/service bindings/);
});
test('one explicit in-place upload records exact version, rollback and zero external services',async t=>{
 const f=fixture(t);let uploads=0;
 const provider={tool:{version:'4.149.0',authentication:'fixture-no-credentials'},snapshot:async(_review,{versionId}={})=>versionId?{...f.snapshot,versionId,versionTraffic:[{version_id:versionId,percentage:100}],bindings:[{name:'ASSETS',type:'assets'}],deploymentId:'fixture-deployment'}:f.snapshot,
  upload:async()=>{uploads++;return {worker_name:f.workerName,version_id:newVersion};}};
 const result=await runFleetSingletonDeployment({...f.options,write:true,provider});
 assert.equal(uploads,1);assert.equal(result.versionId,newVersion);assert.equal(result.rollback.versionId,oldVersion);assert.equal(result.deployments,1);assert.equal(result.hostedVerified,false);assert.equal(result.ownerAccepted,false);assert.equal(result.liveBindings.length,1);
 assert.equal(result.scriptCountSnapshot.count,101);assert.equal(result.scriptCountVerifiedAfter,false);assert.equal(Object.hasOwn(result,'scriptCount'),false);
 await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider}),/earlier deployment/);assert.equal(uploads,1);
});
test('uncertain upload or a surviving service binding retains reconciliation evidence and prevents blind retry',async t=>{
 for(const mode of ['error','service']){
  const f=fixture(t),provider={tool:{version:'4.149.0'},snapshot:async(_r,{versionId}={})=>versionId?{...f.snapshot,versionId,versionTraffic:[{version_id:versionId,percentage:100}]}:f.snapshot,
   upload:async()=>{if(mode==='error')throw Error('uncertain fixture upload');return {worker_name:f.workerName,version_id:newVersion};}};
  await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider}),/uncertain|service/);
  const reports=path.join(f.root,'runtime/dealer-single-worker-deployments'),dir=fs.readdirSync(reports).find(n=>n.startsWith(f.client));assert(fs.existsSync(path.join(reports,dir,'needs-reconciliation.json')));assert(!fs.existsSync(path.join(reports,dir,'deployment.json')));
  await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider}),/earlier deployment/);
 }
});
test('approved archive/output pins and bytes cannot be changed before inspection',async t=>{
 const f=fixture(t);f.review.outputDigest='b'.repeat(64);writeFixture(f.reviewFile,f.review);await assert.rejects(inspectFleetSingleton(f.options),/pin differs/);
 const g=fixture(t);fs.appendFileSync(g.archive,'tampered');await assert.rejects(inspectFleetSingleton(g.options),/archive bytes/);
});
test('CLI remains read-only unless --write is explicitly selected',()=>{
 assert.equal(parseDeploymentArgs(['--input','review.json']).write,false);assert.equal(parseDeploymentArgs(['--input','review.json','--write','--wrangler-package','tool.json']).write,true);
 assert.throws(()=>parseDeploymentArgs(['--input','review.json','--write','--write']),/Repeated/);assert.throws(()=>parseDeploymentArgs(['--delete']),/Use/);
});
test('an unqualified uploader is refused before any deployment output is written',async t=>{
 const f=fixture(t);await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider:{tool:{version:'wrong'}}}),/qualified Wrangler/);
 assert.equal(fs.existsSync(path.join(f.root,'runtime/dealer-single-worker-deployments')),false);
});
