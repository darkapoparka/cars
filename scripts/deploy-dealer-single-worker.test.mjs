import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {sha256,filesAt} from './lib/workflow.mjs';
import {artifactInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {createCanonicalComposition,canonicalCompositionEntry,CANONICAL_ORIGINAL_WORKER_PATH} from './publishing/canonical-origin-wrapper.mjs';
import {validateSingletonGitHubBuild,validateSourcePublication,validateCurrentSingletonTarget,validateAbsentSingletonTarget,validateWranglerAbsentTarget,inspectFleetSingleton,runFleetSingletonDeployment,parseDeploymentArgs,canonicalExposureDigests,validateCanonicalExposureLease,readCanonicalExposureSnapshot,CANONICAL_EXPOSURE_ZONE,CANONICAL_EXPOSURE_KIND} from './deploy-dealer-single-worker.mjs';
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

function creationFixture(t,options){
 const f=fixture(t,options),snapshot={...f.snapshot,publicOrigin:f.publicOrigin,exists:false,workersDev:false,bindings:[],versionId:null,versionTraffic:[],scriptCount:2,
  scriptInventory:{complete:true,endpoint:'/accounts/'+SINGLETON_ACCOUNT+'/workers/scripts',names:['preserved-other','retained-qualification']}};
 f.review.deploymentMode='create-singleton';f.review.providerSnapshot=snapshot;writeFixture(f.reviewFile,f.review);
 return {...f,snapshot,options:{...f.options,mode:'create-singleton'}};
}
function createdSnapshot(f,versionId=newVersion){return {...f.snapshot,exists:true,workersDev:true,versionId,versionTraffic:[{version_id:versionId,percentage:100}],bindings:[{name:'ASSETS',type:'assets'}],deploymentId:'fixture-created-deployment'};}

test('creation requires matching explicit mode and remains read-only during inspection',async t=>{
 const f=creationFixture(t);let snapshots=0,uploads=0;
 const plan=await runFleetSingletonDeployment({...f.options,provider:{snapshot(){snapshots++;},upload(){uploads++;}}});
 assert.equal(plan.deploymentMode,'create-singleton');assert.equal(plan.deployments,0);assert.equal(plan.workerCount,1);assert.equal(plan.applicationCount,6);assert.equal(plan.hostedVerified,false);assert.equal(plan.ownerAccepted,false);
 assert.equal(snapshots,0);assert.equal(uploads,0);assert.equal(fs.existsSync(path.join(f.root,'runtime/dealer-single-worker-deployments')),false);
 await assert.rejects(runFleetSingletonDeployment({...f.options,mode:'update-existing'}),/mode differs/);
 const g=fixture(t);await assert.rejects(runFleetSingletonDeployment({...g.options,mode:'create-singleton'}),/mode differs/);
 assert.equal(parseDeploymentArgs(['--input','review.json','--mode','create-singleton']).mode,'create-singleton');
 assert.throws(()=>parseDeploymentArgs(['--input','review.json','--mode','create-singleton','--mode','update-existing']),/Repeated/);
 assert.throws(()=>parseDeploymentArgs(['--input','review.json','--mode','auto']),/mode/);
});

test('creation absence evidence rejects existing targets, unknown inventories, occupied names and unavailable capacity',t=>{
 const f=creationFixture(t);assert.equal(validateAbsentSingletonTarget(f.snapshot,f.workerName,f.publicOrigin).exists,false);
 for(const change of [{exists:true},{workersDev:true},{accountId:'a'.repeat(32)},{workerName:'cars-another'},{publicOrigin:'https://cars-another.darkapoparka1.workers.dev'},
  {checkedAt:'2020-01-01T00:00:00Z'},{checkedAt:new Date(Date.now()+60000).toISOString()},{evidence:'unverified'},{routes:[{pattern:'foreign/*'}]},{domains:['example.com']},{schedules:['* * * * *']},{tailConsumers:['foreign']},
  {bindings:[{type:'assets',name:'ASSETS'}]},{versionId:oldVersion},{versionTraffic:[{version_id:oldVersion,percentage:100}]},{scriptCount:-1},{scriptCount:NaN},{scriptCount:100},{scriptCount:101},{allowedScripts:101},
  {scriptInventory:{...f.snapshot.scriptInventory,complete:false}},{scriptInventory:{...f.snapshot.scriptInventory,endpoint:'/accounts/foreign/workers/scripts'}},{scriptInventory:{...f.snapshot.scriptInventory,names:['only-one']}},
  {scriptInventory:{...f.snapshot.scriptInventory,names:['duplicate','duplicate']}},{scriptInventory:{...f.snapshot.scriptInventory,names:['preserved-other',f.workerName]}}]){
  assert.throws(()=>validateAbsentSingletonTarget({...f.snapshot,...change},f.workerName,f.publicOrigin),/required|capacity|inventory/);
 }
});

test('live Wrangler absence accepts only the exact authenticated endpoint error, never general failures or empty deployments',()=>{
 const workerName='cars-example',endpoint='/accounts/'+SINGLETON_ACCOUNT+'/workers/scripts/'+workerName+'/deployments';
 const result={status:1,stdout:'',stderr:'A request to the Cloudflare API ('+endpoint+') failed.\nWorker not found [code: 10007]'};
 assert.equal(validateWranglerAbsentTarget(result,SINGLETON_ACCOUNT,workerName).errorCode,10007);
 for(const invalid of [{...result,status:0,stdout:'[]'},{...result,error:Error('network failure')},{...result,signal:'SIGTERM'},{...result,stderr:result.stderr.replace('10007','10000')},
  {...result,stderr:result.stderr.replace(endpoint,endpoint.replace(workerName,'cars-another'))},{...result,stderr:result.stderr+'\nauthentication failed [code: 10000]'},
  {status:1,stderr:'Worker not found'}, {status:1,stderr:'network unavailable'}])assert.throws(()=>validateWranglerAbsentTarget(invalid,SINGLETON_ACCOUNT,workerName),/absence was not established/);
 assert.throws(()=>validateWranglerAbsentTarget(result,'a'.repeat(32),workerName),/absence was not established/);
});

test('one reviewed absent-target creation uploads the sealed singleton and keeps provider evidence distinct from acceptance',async t=>{
 const f=creationFixture(t);let uploads=0,snapshots=0;
 const provider={tool:{version:'4.149.0',authentication:'fixture-no-credentials'},snapshot:async(_review,{versionId}={})=>{snapshots++;return versionId?createdSnapshot(f,versionId):f.snapshot;},
  upload:async()=>{uploads++;return{worker_name:f.workerName,version_id:newVersion,targets:[f.publicOrigin]};}};
 const result=await runFleetSingletonDeployment({...f.options,write:true,provider});
 assert.equal(uploads,1);assert.equal(snapshots,3);assert.equal(result.deploymentMode,'create-singleton');assert.equal(result.deployments,1);assert.equal(result.rollback.exists,false);
 assert.equal(result.versionId,newVersion);assert.deepEqual(result.versionTraffic,[{version_id:newVersion,percentage:100}]);assert.deepEqual(result.liveBindings,[{type:'assets',name:'ASSETS'}]);
 assert.equal(result.creationEvidence.absentBefore,true);assert.equal(result.creationEvidence.expectedScriptCountAfter,3);assert.match(result.creationEvidence.scriptInventorySha256,/^[a-f0-9]{64}$/);
 assert.equal(result.scriptCountSnapshot.count,2);assert.equal(result.scriptCountSnapshot.evidence,'authenticated-cloudflare-connector');assert.equal(result.scriptCountVerifiedAfter,false);
 assert.equal(result.hostedVerified,false);assert.equal(result.ownerAccepted,false);
 await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider}),/earlier deployment/);assert.equal(uploads,1);
});

test('creation rechecks reviewed absent identity and capacity under the lock before upload',async t=>{
 for(const phase of ['before','locked'])for(const change of ['existing','inventory']){
  const f=creationFixture(t);let reads=0,uploads=0;
  const changed=change==='existing'?createdSnapshot(f):{...f.snapshot,scriptCount:3,scriptInventory:{...f.snapshot.scriptInventory,names:[...f.snapshot.scriptInventory.names,'another-new-worker']}};
  const provider={tool:{version:'4.149.0'},snapshot:async()=>++reads===(phase==='before'?1:2)?changed:f.snapshot,upload:async()=>{uploads++;throw Error('must not upload');}};
  await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider}),/absent Worker|capacity changed/);assert.equal(uploads,0);
  if(phase==='locked'){
   const reports=path.join(f.root,'runtime/dealer-single-worker-deployments'),dir=fs.readdirSync(reports).find(n=>n.startsWith(f.client));
   assert.equal(fs.existsSync(path.join(reports,dir,'needs-reconciliation.json')),true);
   await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider}),/earlier deployment/);
  }
 }
});

test('creation retains reconciliation evidence for uncertain upload, wrong origin or non-singleton active result',async t=>{
 for(const mode of ['error','wrong-worker','wrong-origin','extra-target','split-traffic','service']){
  const f=creationFixture(t);let uploads=0;
  const provider={tool:{version:'4.149.0'},snapshot:async(_review,{versionId}={})=>{
   if(!versionId)return f.snapshot;const snapshot=createdSnapshot(f,versionId);
   if(mode==='split-traffic')snapshot.versionTraffic=[{version_id:versionId,percentage:50}];
   if(mode==='service')snapshot.bindings.push({name:'CARS_APP',type:'service',service:f.workerName+'-app'});return snapshot;
  },upload:async()=>{uploads++;if(mode==='error')throw Error('uncertain fixture creation');return{worker_name:mode==='wrong-worker'?'cars-other':f.workerName,version_id:newVersion,
   targets:mode==='wrong-origin'?['https://cars-other.darkapoparka1.workers.dev']:mode==='extra-target'?[f.publicOrigin,'example.com/*']:[f.publicOrigin]};}};
  await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider}),/uncertain|another Worker|another target|active|service/);
  const reports=path.join(f.root,'runtime/dealer-single-worker-deployments'),dir=fs.readdirSync(reports).find(n=>n.startsWith(f.client));
  assert.equal(fs.existsSync(path.join(reports,dir,'needs-reconciliation.json')),true);assert.equal(fs.existsSync(path.join(reports,dir,'deployment.json')),false);
  await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider}),/earlier deployment/);assert.equal(uploads,1);
 }
});

test('creation retains exact source, six-release, sealed asset and independent ownership rejection guards',async t=>{
 const cases=[f=>f.review.sourceCommit='a'.repeat(40),f=>f.review.sourceReleases={...f.review.sourceReleases,mobile:{...f.review.sourceReleases.mobile,digest:'b'.repeat(64)}},
  f=>f.remote.sourceProof.mainReachable=false,f=>f.remote.sourceProof.sourceTree='a'.repeat(40),f=>f.review.workerName='cars-another',f=>f.review.accountId='a'.repeat(32),
  f=>f.registry.dealers[0].sourceOwnership='independent-repository',f=>fs.appendFileSync(path.join(f.directory,'public/fixture.txt'),'tampered sealed branding/asset bytes')];
 for(const change of cases){const f=creationFixture(t);change(f);writeFixture(f.reviewFile,f.review);let uploads=0;
  await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider:{tool:{version:'4.149.0'},upload:async()=>{uploads++;}}}),/pin differs|GitHub proof|Worker differs|artifact pins|Independent|bytes differ|Artifact/);
  assert.equal(uploads,0);assert.equal(fs.existsSync(path.join(f.root,'runtime/dealer-single-worker-deployments')),false);
 }
 const f=creationFixture(t,{reviewed:false});assert.equal((await runFleetSingletonDeployment(f.options)).readyToDeploy,false);
 await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider:{}}),/dated review/);
});

function memoryFixture(t){const f=fixture(t);const originalArchiveBytes=fs.readFileSync(f.archive);delete f.review.archive;f.review.archiveMode='original-byte-buffer';writeFixture(f.reviewFile,f.review);f.options.originalArchiveBytes=originalArchiveBytes;return f;}
test('original ZIP buffer inspection retains complete source, artifact and extracted-byte verification without an invented archive file',async t=>{const f=memoryFixture(t);const result=await inspectFleetSingleton(f.options);assert.equal(result.plan.archiveMode,'original-byte-buffer');assert.equal(result.review.archive,undefined);assert.equal(result.plan.archiveDigest,f.remote.artifact.digest);assert.equal(result.plan.deployments,0);assert.equal(result.plan.hostedVerified,false);});
test('original ZIP buffer needs explicit mode and rejects missing or substituted bytes before provider resolution',async t=>{const f=memoryFixture(t);await assert.rejects(inspectFleetSingleton({...f.options,originalArchiveBytes:undefined}),/Explicit original ZIP/);const g=fixture(t);await assert.rejects(inspectFleetSingleton({...g.options,originalArchiveBytes:fs.readFileSync(g.archive)}),/Explicit original ZIP/);f.review.archive=f.archive;writeFixture(f.reviewFile,f.review);await assert.rejects(inspectFleetSingleton(f.options),/Explicit original ZIP/);});
test('original ZIP buffer does not waive the immutable whole-archive digest or extracted receipt checks',async t=>{const f=memoryFixture(t);f.options.originalArchiveBytes[0]^=1;await assert.rejects(inspectFleetSingleton(f.options),/archive bytes differ/);const g=memoryFixture(t);g.remote.artifact.expired=true;await assert.rejects(inspectFleetSingleton(g.options),/required|differs/);});
test('successful in-memory archive deployment still records one version, original archive mode and current rollback',async t=>{const f=memoryFixture(t);let uploads=0;const provider={tool:{version:'4.149.0'},snapshot:async(_r,{versionId}={})=>versionId?{...f.snapshot,versionId,versionTraffic:[{version_id:versionId,percentage:100}],bindings:[{name:'ASSETS',type:'assets'}],deploymentId:'memory-test'}:f.snapshot,upload:async()=>{uploads++;return {worker_name:f.workerName,version_id:newVersion};}};const r=await runFleetSingletonDeployment({...f.options,write:true,provider});assert.equal(uploads,1);assert.equal(r.archiveMode,'original-byte-buffer');assert.equal(r.rollback.versionId,oldVersion);assert.equal(r.hostedVerified,false);});
test('changed original ZIP buffer between inspection and upload is refused without a provider mutation',async t=>{const f=memoryFixture(t);let snapshots=0,uploads=0;const provider={tool:{version:'4.149.0'},snapshot:async()=>{if(++snapshots===2)f.options.originalArchiveBytes[0]^=1;return f.snapshot;},upload:async()=>{uploads++;throw Error('must not upload');}};await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider}),/archive bytes changed before upload/);assert.equal(uploads,0);});

import {hashArchive,readZipReceipt} from './deploy-uk-cloudflare.mjs';
test('bounded ZIP parser and whole-byte hash agree between file and memory inputs',async t=>{const f=fixture(t),b=fs.readFileSync(f.archive);assert.deepEqual(await hashArchive(b),await hashArchive(f.archive));for(const n of ['artifact-manifest.json','single-worker-receipt.json','dealer-composition-review.json','delivery-receipt.json','wrangler.json'])assert(readZipReceipt(b,n).equals(readZipReceipt(f.archive,n)));assert.throws(()=>readZipReceipt(b.subarray(0,21),'artifact-manifest.json'),/size|directory|ZIP/);assert.throws(()=>readZipReceipt(b,'../escape.json'),/Unsafe/);});

function resealCanonicalFixture(f) {
 const files=filesAt(f.directory,{filter:()=>true}).filter(name=>!['artifact-manifest.json','single-worker-receipt.json','dealer-composition-review.json','delivery-receipt.json'].includes(name)).map(name=>{const bytes=fs.readFileSync(path.join(f.directory,name));return {path:name,bytes:bytes.length,sha256:sha256(bytes)};});
 f.receipt.files=files;f.receipt.outputDigest=sha256(JSON.stringify(files));f.receipt.serverBytes=files.filter(row=>row.path.startsWith('server/')).reduce((sum,row)=>sum+row.bytes,0);f.receipt.assetFiles=files.filter(row=>row.path.startsWith('public/')).length;
 f.composition.outputDigest=f.receipt.outputDigest;f.delivery.outputDigest=f.receipt.outputDigest;
 for(const [name,value] of [['single-worker-receipt.json',f.receipt],['dealer-composition-review.json',f.composition],['delivery-receipt.json',f.delivery]])writeFixture(path.join(f.directory,name),value);
 f.inventory=artifactInventory(f.directory,{kind:f.delivery.kind,dealer:f.client,status:'passed'});
 const zip=tinyZip(f.directory);writeFixture(f.archive,zip);Object.assign(f.review,{artifactDigest:f.inventory.digest,outputDigest:f.receipt.outputDigest,archiveDigest:'sha256:'+sha256(zip),archiveBytes:zip.length});
 Object.assign(f.remote.artifact,{digest:f.review.archiveDigest,size_in_bytes:zip.length});writeFixture(f.reviewFile,f.review);
}
function canonicalFixture(t,{wrapped=true}={}) {
 const f=fixture(t),canonicalOrigin='https://navara-car.webpreviews.site';
 if(wrapped){
  const composition=createCanonicalComposition({canonicalOrigin,ukDefault:false},{providerOrigin:f.publicOrigin,toolRevision:f.receipt.sourceCommit,variants:f.composition.variants});
  writeFixture(path.join(f.directory,CANONICAL_ORIGINAL_WORKER_PATH),fs.readFileSync(path.join(f.directory,'server/worker.mjs')));
  writeFixture(path.join(f.directory,'server/worker.mjs'),canonicalCompositionEntry(composition));
  for(const value of [f.receipt,f.composition,f.delivery,f.review])value.canonicalComposition=composition;
  resealCanonicalFixture(f);
 }
 const route={id:'a'.repeat(32),pattern:'navara-car.webpreviews.site/*',script:f.workerName};
 const endpoints={zoneRoutes:'/zones/'+CANONICAL_EXPOSURE_ZONE+'/workers/routes',workerDomains:'/accounts/'+SINGLETON_ACCOUNT+'/workers/domains',scriptSubdomain:'/accounts/'+SINGLETON_ACCOUNT+'/workers/scripts/'+f.workerName+'/subdomain'};
 const sample={kind:'cars-live-canonical-exposure-read',evidence:'authenticated-cloudflare-connector',accountId:SINGLETON_ACCOUNT,workerName:f.workerName,zoneId:CANONICAL_EXPOSURE_ZONE,observedAt:new Date().toISOString(),
  zoneRoutes:{endpoint:endpoints.zoneRoutes,success:true,status:200,complete:true,totalCount:1,result:[route]},
  workerDomains:{endpoint:endpoints.workerDomains,success:true,status:200,complete:true,totalCount:0,result:[]},
  scriptSubdomain:{endpoint:endpoints.scriptSubdomain,success:true,status:200,result:{enabled:true,previews_enabled:false}}};
 const digests=canonicalExposureDigests(sample),lease={schemaVersion:1,kind:CANONICAL_EXPOSURE_KIND,dealer:f.client,reviewed:true,reviewedAt:new Date().toISOString(),accountId:SINGLETON_ACCOUNT,workerName:f.workerName,providerOrigin:f.publicOrigin,canonicalOrigin,zoneId:CANONICAL_EXPOSURE_ZONE,routeId:route.id,proofs:Object.fromEntries(Object.keys(endpoints).map(kind=>[kind,{endpoint:endpoints[kind],sha256:digests[kind]}]))};
 f.snapshot={...f.snapshot,routes:[route],handlers:['fetch'],bindings:[{name:'ASSETS',type:'assets'}]};
 f.review.providerSnapshot=f.snapshot;f.review.canonicalExposure=lease;writeFixture(f.reviewFile,f.review);
 return {...f,lease,sample,route,endpoints};
}
function canonicalProvider(f,{snapshotChange,upload}={}) {
 return {tool:{version:'4.149.0',authentication:'fixture-no-credentials'},snapshot:async(_review,{versionId}={})=>{
  const value=versionId?{...f.snapshot,versionId,versionTraffic:[{version_id:versionId,percentage:100}],deploymentId:'fixture-deployment'}:f.snapshot;
  return snapshotChange?snapshotChange(value,versionId):value;
 },upload:upload??(async()=>({worker_name:f.workerName,version_id:newVersion}))};
}
const freshCanonicalRead=f=>async request=>({...structuredClone(f.sample),requestId:request.requestId,observedAt:new Date().toISOString()});

test('canonical lease rejects an unwrapped seal and explicit review/lease tuple mismatches before upload',async t=>{
 const raw=canonicalFixture(t,{wrapped:false});await assert.rejects(inspectFleetSingleton(raw.options),/matching sealed canonical wrapper composition/);
 for(const mode of ['missing-review','review-canonical','lease-canonical','unsealed-worker']){
  const f=canonicalFixture(t);
  if(mode==='missing-review')delete f.review.canonicalComposition;
  if(mode==='review-canonical')f.review.canonicalComposition={...f.review.canonicalComposition,canonicalOrigin:'https://other.webpreviews.site'};
  if(mode==='lease-canonical')f.review.canonicalExposure={...f.lease,canonicalOrigin:'https://other.webpreviews.site'};
  if(mode==='unsealed-worker')fs.appendFileSync(path.join(f.directory,'server/worker.mjs'),'// changed');
  writeFixture(f.reviewFile,f.review);let uploads=0;
  await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,readExposure:freshCanonicalRead(f),provider:canonicalProvider(f,{upload:async()=>{uploads++;return {worker_name:f.workerName,version_id:newVersion};}})}),/canonical composition|matching sealed|bytes differ/);
  assert.equal(uploads,0);assert.equal(fs.existsSync(path.join(f.root,'runtime/dealer-single-worker-deployments')),false);
 }
});
test('sealed canonical wrapper remains exact in both original ZIP bytes and extracted directory',async t=>{
 const f=canonicalFixture(t),context=await inspectFleetSingleton(f.options);
 assert.deepEqual(context.plan.canonicalComposition,f.receipt.canonicalComposition);assert.notEqual(context.plan.publicOrigin,context.plan.canonicalComposition.canonicalOrigin);
 fs.appendFileSync(path.join(f.directory,CANONICAL_ORIGINAL_WORKER_PATH),'// changed original');
 await assert.rejects(inspectFleetSingleton(f.options),/bytes differ/);
});


test('canonical hostname updates refuse the default CLI and any missing live exposure reader',async t=>{
 const f=canonicalFixture(t);
 await assert.rejects(runFleetSingletonDeployment(f.options),/live authenticated readExposure callback.*default CLI/);
 await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,provider:canonicalProvider(f)}),/live authenticated readExposure callback/);
 assert.equal(fs.existsSync(path.join(f.root,'runtime/dealer-single-worker-deployments')),false);
});

test('canonical lease is bounded to the exact existing reviewed account, Worker and zone hostname',t=>{
 const f=canonicalFixture(t);assert.equal(validateCanonicalExposureLease(f.lease,f.review).routeId,f.route.id);
 for(const change of [{dealer:'other'},{workerName:'cars-other'},{providerOrigin:'https://other.workers.dev'},{accountId:'b'.repeat(32)},{zoneId:'b'.repeat(32)},{reviewed:false},{reviewedAt:new Date(Date.now()+60000).toISOString()},{routeId:'wrong'},
  {canonicalOrigin:'https://navara-car.webpreviews.site/path'},{canonicalOrigin:'https://user:secret@navara-car.webpreviews.site'},{canonicalOrigin:'http://navara-car.webpreviews.site'},{canonicalOrigin:'https://*.webpreviews.site'},{canonicalOrigin:'https://foreign.example'}]){
  assert.throws(()=>validateCanonicalExposureLease({...f.lease,...change},f.review),/Canonical exposure/);
 }
 const changed=structuredClone(f.lease);changed.proofs.zoneRoutes.endpoint='/zones/foreign/workers/routes';
 assert.throws(()=>validateCanonicalExposureLease(changed,f.review),/endpoint/);
});

test('one canonical in-place update authenticates every exposure stage and retains its proof',async t=>{
 const f=canonicalFixture(t),phases=[];let uploads=0;
 const readExposure=async request=>{phases.push(request);assert.deepEqual(request.endpoints,f.endpoints);return {...structuredClone(f.sample),requestId:request.requestId,observedAt:new Date().toISOString()};};
 const result=await runFleetSingletonDeployment({...f.options,write:true,readExposure,provider:canonicalProvider(f,{upload:async()=>{uploads++;return{worker_name:f.workerName,version_id:newVersion};}})});
 assert.equal(uploads,1);assert.deepEqual(phases.map(x=>x.stage),['before','locked','after']);
 assert.equal(new Set(phases.map(x=>x.requestId)).size,3);
 assert.equal(phases[0].expectedVersionId,oldVersion);assert.equal(phases[2].expectedVersionId,newVersion);
 assert.equal(result.versionId,newVersion);assert.equal(result.exposurePreservation.canonicalOrigin,f.lease.canonicalOrigin);
 assert.deepEqual(result.exposurePreservation.before.proofDigests,result.exposurePreservation.after.proofDigests);
 assert.deepEqual(result.rollback.routes,[f.route]);assert.equal(result.hostedVerified,false);assert.equal(result.ownerAccepted,false);
});

test('canonical exposure reader rejects cached observations and incomplete or failed authenticated GETs before upload',async t=>{
 for(const mode of ['cached','replay','future','unverified','wrong-worker','failed','partial','endpoint']){
  const f=canonicalFixture(t);let uploads=0;
  const readExposure=async request=>{const value={...structuredClone(f.sample),requestId:request.requestId,observedAt:new Date().toISOString()};
   if(mode==='cached')value.observedAt=new Date(Date.parse(request.notBefore)-1).toISOString();
   if(mode==='replay')value.requestId='previous-read';
   if(mode==='future')value.observedAt=new Date(Date.now()+60000).toISOString();
   if(mode==='unverified')value.evidence='cached-review';
   if(mode==='wrong-worker')value.workerName='cars-other';
   if(mode==='failed')value.zoneRoutes.success=false;
   if(mode==='partial')value.workerDomains.totalCount=1;
   if(mode==='endpoint')value.zoneRoutes.endpoint='/zones/foreign/workers/routes';return value;};
  await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,readExposure,provider:canonicalProvider(f,{upload:async()=>{uploads++;throw Error('must not upload');}})}),/Canonical exposure/);
  assert.equal(uploads,0);
 }
});

test('canonical route, domain and subdomain drift refuses upload and post-upload drift keeps reconciliation evidence',async t=>{
 for(const phase of ['before','locked','after'])for(const mode of ['route','domain','preview']){
  const f=canonicalFixture(t);let uploads=0;
  const readExposure=async request=>{const value={...structuredClone(f.sample),requestId:request.requestId,observedAt:new Date().toISOString()};
   if(request.stage===phase){
    if(mode==='route')value.zoneRoutes.result[0].script='cars-foreign';
    if(mode==='domain'){value.workerDomains.result=[{id:'b'.repeat(32),hostname:'navara-car.webpreviews.site',service:'cars-foreign',zone_id:CANONICAL_EXPOSURE_ZONE,environment:'production',cert_id:'fixture-cert',enabled:true,previews_enabled:false}];value.workerDomains.totalCount=1;}
    if(mode==='preview')value.scriptSubdomain.result.previews_enabled=true;
   }return value;};
  await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,readExposure,provider:canonicalProvider(f,{upload:async()=>{uploads++;return{worker_name:f.workerName,version_id:newVersion};}})}),/Canonical exposure/);
  assert.equal(uploads,phase==='after'?1:0);
  if(phase!=='before'){const reports=path.join(f.root,'runtime/dealer-single-worker-deployments'),dir=fs.readdirSync(reports).find(n=>n.startsWith(f.client));assert(fs.existsSync(path.join(reports,dir,'needs-reconciliation.json')));assert(!fs.existsSync(path.join(reports,dir,'deployment.json')));}
 }
});

test('a reviewed exposure hash cannot authorize wildcard, conflicting or foreign ownership',async t=>{
 for(const mode of ['wildcard','foreign','duplicate','domain','disabled']){
  const f=canonicalFixture(t),value=structuredClone(f.sample);
  if(mode==='wildcard')value.zoneRoutes.result[0].pattern='*.webpreviews.site/*';
  if(mode==='foreign')value.zoneRoutes.result[0].script='cars-foreign';
  if(mode==='duplicate'){value.zoneRoutes.result.push({...f.route,id:'b'.repeat(32),script:'cars-foreign'});value.zoneRoutes.totalCount=2;}
  if(mode==='domain'){value.workerDomains.result=[{id:'b'.repeat(32),hostname:'foreign.webpreviews.site',service:f.workerName,zone_id:CANONICAL_EXPOSURE_ZONE,environment:'production',cert_id:'fixture-cert',enabled:true,previews_enabled:false}];value.workerDomains.totalCount=1;}
  if(mode==='disabled')value.scriptSubdomain.result.enabled=false;
  if(mode==='wildcard'){assert.throws(()=>canonicalExposureDigests(value),/unreviewed route/);continue;}
  const digests=canonicalExposureDigests(value);for(const key of Object.keys(digests))f.lease.proofs[key].sha256=digests[key];
  writeFixture(f.reviewFile,f.review);
  await assert.rejects(runFleetSingletonDeployment({...f.options,write:true,readExposure:async request=>({...value,requestId:request.requestId,observedAt:new Date().toISOString()}),provider:canonicalProvider(f)}),/Canonical exposure/);
 }
});

test('canonical snapshots cannot be fabricated or restamped and still require fetch-only ASSETS-only singleton resources',async t=>{
 const f=canonicalFixture(t),snapshot=await readCanonicalExposureSnapshot({snapshot:f.snapshot,review:f.review,readExposure:freshCanonicalRead(f),stage:'before',notBefore:new Date().toISOString()});
 assert.equal(validateCurrentSingletonTarget(snapshot,f.workerName,{canonicalExposure:f.lease}).versionId,oldVersion);
 assert.throws(()=>validateCurrentSingletonTarget({...snapshot,checkedAt:new Date().toISOString()},f.workerName,{canonicalExposure:f.lease}),/unmodified live-reader/);
 for(const change of [{handlers:['fetch','scheduled']},{bindings:[{name:'ASSETS',type:'assets'},{name:'CARS_APP',type:'service',service:f.workerName+'-app'}]},{bindings:[{name:'DB',type:'d1',id:'foreign'}]}]){
  const altered=await readCanonicalExposureSnapshot({snapshot:{...f.snapshot,...change},review:f.review,readExposure:freshCanonicalRead(f),stage:'before',notBefore:new Date().toISOString()});
  assert.throws(()=>validateCurrentSingletonTarget(altered,f.workerName,{canonicalExposure:f.lease}),/fetch-only.*ASSETS-only/);
 }
 assert.throws(()=>validateCurrentSingletonTarget(snapshot,f.workerName),/routes\/resources/);
});

test('canonical lease cannot authorize Worker creation and exposure preservation never waives active-version checks',async t=>{
 const f=canonicalFixture(t);f.review.deploymentMode='create-singleton';writeFixture(f.reviewFile,f.review);
 await assert.rejects(runFleetSingletonDeployment({...f.options,mode:'create-singleton'}),/existing Workers only/);
 const g=canonicalFixture(t);let reads=0,uploads=0;
 const provider=canonicalProvider(g,{snapshotChange:value=>++reads===2?{...value,versionId:newVersion,versionTraffic:[{version_id:newVersion,percentage:100}]}:value,upload:async()=>{uploads++;throw Error('must not upload');}});
 await assert.rejects(runFleetSingletonDeployment({...g.options,write:true,readExposure:freshCanonicalRead(g),provider}),/advanced before upload/);assert.equal(uploads,0);
 const h=canonicalFixture(t);await assert.rejects(runFleetSingletonDeployment({...h.options,write:true,readExposure:freshCanonicalRead(h),provider:canonicalProvider(h,{snapshotChange:value=>({...value,versionTraffic:[{version_id:value.versionId,percentage:50}]})})}),/active/);
});
