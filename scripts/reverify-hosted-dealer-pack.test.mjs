import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {reverifyHostedDealerPack,selectHostedRecheckReceipt,hostedRecheckReadTransport,parseHostedRecheckArgs,runHostedRecheckCli} from './reverify-hosted-dealer-pack.mjs';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,createPackDeploymentQueue,packDeploymentRequest,queueDigest} from './lib/dealer-pack-queue.mjs';
import {packOwnershipTags} from './lib/dealer-pack-deployment.mjs';

const at='2026-10-21T06:00:00.000Z',sourceCommit='a'.repeat(40),workerId='b'.repeat(32),versionId='11111111-1111-4111-8111-111111111111';
const policy={schemaVersion:1,kind:'cars-owner-authorized-pack-deployment',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,zoneName:'webpreviews.site',workersPlan:'paid',allowedScripts:500,minimumSpareScripts:0,ownerConfirmedPaid:true,allowNewPreviews:true,outreachApproved:false,authorizedAt:at,authorizationSource:'Owner M2 instruction dated 20 October 2026',reason:'Owner approved 100 existing plus 400 new previews with no remaining reserve.',maximumNewDealers:400};
function fixture(){
  const state=createPackDeploymentQueue({policy,now:at,queueId:'22222222-2222-4222-8222-222222222222',baseline:{accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,evidence:'authenticated-cloudflare-api',complete:true,observedAt:at,workerNames:['cars-protected'],routes:[],domains:[]}});
  const request=packDeploymentRequest({slug:'car-avenue-llc',dealerId:'ae-dubai-car-avenue-llc',batch:3,workerName:'cars-car-avenue-llc',publicOrigin:'https://car-avenue-llc.webpreviews.site',packDigest:queueDigest('pack'),releaseId:'cars-six-current',releaseDigest:queueDigest('release'),outputDigest:queueDigest('output'),sourceCommit});
  const sourceProof={verified:true,repository:request.sourceRepository,commit:sourceCommit,path:request.sourcePath};
  const receipt={schemaVersion:1,type:'cars-dealer-pack-deployment',status:'deployed',queueId:state.queueId,requestId:request.id,accountId:state.accountId,zoneId:state.zoneId,
    slug:request.slug,dealerId:request.dealerId,batch:request.batch,workerName:request.workerName,publicOrigin:request.publicOrigin,
    packDigest:request.packDigest,releaseId:request.releaseId,releaseDigest:request.releaseDigest,outputDigest:request.outputDigest,sourceCommit,sourceProof,
    workerId,versionId,routeId:'route-id',ownershipTags:packOwnershipTags(state,request),deployedAt:'2026-10-20T22:00:00.000Z',hostedVerified:false,hostedFailure:'Auto Best locale-readiness timeout'};
  const envelope={receipt,sha256:queueDigest(receipt)};
  state.order=[request.id];state.requests[request.id]={request,status:'failed',events:[{kind:'worker-create-observed',workerName:request.workerName,workerId}],receiptSha256:envelope.sha256};state.receipts[request.slug]=[envelope];
  const candidate={verified:true,slug:request.slug,packDigest:request.packDigest,releaseId:request.releaseId,releaseDigest:request.releaseDigest,outputDigest:request.outputDigest,sourceCommit,sourceProof,
    qa:{success:true,packDigest:request.packDigest,outputDigest:request.outputDigest,releaseDigest:request.releaseDigest},root:path.resolve('fixture-source'),directory:path.resolve('fixture-bundle'),pack:{manifest:{slug:request.slug},packDigest:request.packDigest}};
  const target={exists:true,workerName:request.workerName,workerId,versionId,versionTraffic:[{version_id:versionId,percentage:100}],undeployed:false,tags:receipt.ownershipTags,
    bindings:[{name:'ASSETS',type:'assets'}],subdomain:{enabled:false,previews_enabled:false},limits:{cpu_ms:30000}};
  const calls=[],now=()=>Date.parse(at),store={read:async()=>{calls.push('queue-read');return {revision:'c'.repeat(40),state:structuredClone(state)};},compareAndSwap:()=>assert.fail('Cannot write queue')};
  const provider={snapshot:async({challenge})=>{calls.push(challenge.stage);return {kind:'cars-live-pack-provider-snapshot',evidence:'authenticated-cloudflare-api',accountId:state.accountId,zoneId:state.zoneId,requestId:challenge.requestId,stage:challenge.stage,startedAt:at,observedAt:at,complete:true,
    scripts:[{name:'cars-protected',id:'d'.repeat(32)},{name:request.workerName,id:workerId}],scriptCount:2,routes:[{id:receipt.routeId,pattern:new URL(request.publicOrigin).hostname+'/*',script:request.workerName}],domains:[],target:structuredClone(target)};},
    createWorker:()=>assert.fail('Cannot create'),prepareAssets:()=>assert.fail('Cannot upload assets'),upload:()=>assert.fail('Cannot upload'),activateVersion:()=>assert.fail('Cannot activate'),disableSubdomain:()=>assert.fail('Cannot mutate exposure'),createRoute:()=>assert.fail('Cannot route'),rollbackVersion:()=>assert.fail('Cannot roll back')};
  const hosted={schemaVersion:1,type:'cars-dealer-pack-hosted-qa',slug:request.slug,publicOrigin:request.publicOrigin,packDigest:request.packDigest,outputDigest:request.outputDigest,versionId,width:390,success:true,providerWrites:0,startedAt:at,finishedAt:at,
    designs:['auto-best','modern','import','app','mobile','karento-best'].map(key=>({key,status:'passed',httpStatus:200,headStatus:'passed',headHttpStatus:200,sixChoices:true,nameVisible:true,logoVisible:true,phoneStatus:'passed',foreignIdentityCount:0,fabInteraction:true}))};
  const materialize=async(r,q)=>{calls.push('materialize');assert.equal(r.id,request.id);assert.equal(q.queueId,state.queueId);return structuredClone(candidate);};
  const verifyHosted=async options=>{calls.push('hosted');assert.equal(options.root,candidate.root);assert.equal(options.receipt.versionId,versionId);assert.equal(options.pack.packDigest,request.packDigest);return structuredClone(hosted);};
  return {slug:request.slug,state,request,receipt,envelope,candidate,target,hosted,calls,now,store,provider,materialize,verifyHosted};
}
const reseal=f=>{f.envelope.sha256=queueDigest(f.receipt);f.state.requests[f.request.id].receiptSha256=f.envelope.sha256;};

test('independent acceptance preserves the failed historical receipt and binds exact source/version before and after',async()=>{
  const f=fixture(),original=JSON.stringify(f.state),report=await reverifyHostedDealerPack(f);
  assert.equal(report.status,'passed');assert.equal(report.hostedVerified,true);assert.equal(report.historicalHostedVerified,false);assert.equal(report.historicalRequestStatus,'failed');
  assert.equal(report.sourceReceiptSha256,f.envelope.sha256);assert.equal(report.sourceCommit,sourceCommit);assert.equal(report.versionId,versionId);assert.equal(report.outputDigest,f.request.outputDigest);
  assert.equal(report.providerWrites,0);assert.equal(report.queueWrites,0);assert.equal(report.hosted.sha256,queueDigest(f.hosted));assert.equal(JSON.stringify(f.state),original);
  assert.deepEqual(f.calls,['queue-read','materialize','queue-read','before-hosted-recheck','hosted','queue-read','after-hosted-recheck','queue-read']);
  assert.equal(report.providerBefore.targetSha256,report.providerAfter.targetSha256);assert.equal(report.account.actualWorkers,2);assert.deepEqual(report.account.unaccountedWorkers,[]);
});

test('missing, tampered, detached and source-mismatched receipts fail before artifacts or provider reads',async()=>{
  for(const mutate of [f=>delete f.state.receipts[f.slug],f=>f.envelope.sha256='f'.repeat(64),f=>f.state.requests[f.request.id].receiptSha256='f'.repeat(64),f=>{f.receipt.sourceCommit='f'.repeat(40);reseal(f);},f=>{f.receipt.sourceProof.commit='f'.repeat(40);reseal(f);},f=>{f.receipt.outputDigest='f'.repeat(64);reseal(f);},f=>{f.receipt.status='rolled-back';reseal(f);}]){
    const f=fixture();mutate(f);await assert.rejects(()=>reverifyHostedDealerPack(f));assert.deepEqual(f.calls,['queue-read']);
  }
});

test('queued, active and uncertain same-dealer requests cannot be rechecked',async()=>{
  for(const status of ['queued','active','needs-reconciliation']){
    const f=fixture();f.state.requests[f.request.id].status=status;
    if(status!=='queued')f.state.active={requestId:f.request.id,owner:'github:123',token:'test-claim-token-1234567890',claimedAt:at};
    await assert.rejects(()=>reverifyHostedDealerPack(f),/queued, active or uncertain/);assert.deepEqual(f.calls,['queue-read']);
  }
});

test('artifact materialization errors and mismatched candidates cannot reach the provider',async()=>{
  for(const mutate of [f=>f.candidate.sourceCommit='f'.repeat(40),f=>f.candidate.sourceProof.commit='f'.repeat(40),f=>f.candidate.outputDigest='f'.repeat(64),f=>f.candidate.qa.success=false,f=>f.candidate.pack.packDigest='f'.repeat(64),f=>f.candidate.pack.manifest.pack={benchmarkOnly:true},f=>f.materialize=async()=>{throw Error('Artifact expired');}]){
    const f=fixture();mutate(f);await assert.rejects(()=>reverifyHostedDealerPack(f));assert.ok(!f.calls.includes('before-hosted-recheck'));assert.ok(!f.calls.includes('hosted'));
  }
});

test('changed live Worker, version, tags, route, bindings and exposure refuse hosted acceptance',async()=>{
  for(const mutate of [s=>{s.target.workerId='f'.repeat(32);s.scripts[1].id=s.target.workerId;},s=>{s.target.versionId='33333333-3333-4333-8333-333333333333';s.target.versionTraffic[0].version_id=s.target.versionId;},s=>s.target.tags=[],s=>s.routes[0].id='another-route',s=>s.routes[0].script='cars-another',s=>s.target.bindings.push({name:'EXTRA',type:'kv_namespace'}),s=>s.target.subdomain.enabled=true]){
    const f=fixture(),read=f.provider.snapshot;f.provider.snapshot=async input=>{const snapshot=await read(input);mutate(snapshot);return snapshot;};
    await assert.rejects(()=>reverifyHostedDealerPack(f));assert.ok(!f.calls.includes('hosted'));
  }
});

test('stale observations, missing protected fleet and custom-domain collisions are refused',async()=>{
  for(const mutate of [s=>s.observedAt='2026-10-20T06:00:00.000Z',s=>{s.scripts.shift();s.scriptCount--;},s=>s.domains.push({hostname:'car-avenue-llc.webpreviews.site',service:'cars-car-avenue-llc'})]){
    const f=fixture(),read=f.provider.snapshot;f.provider.snapshot=async input=>{const snapshot=await read(input);mutate(snapshot);return snapshot;};await assert.rejects(()=>reverifyHostedDealerPack(f));assert.ok(!f.calls.includes('hosted'));
  }
});

test('provider target changes during browser verification invalidate a passing browser report',async()=>{
  const f=fixture(),verify=f.verifyHosted;f.verifyHosted=async input=>{const report=await verify(input);f.target.tags=[...f.target.tags,'unexpected-extra'];return report;};
  await assert.rejects(()=>reverifyHostedDealerPack(f),/provider target changed/);assert.ok(f.calls.includes('after-hosted-recheck'));
});

test('a same-dealer publication acquired during hosted verification prevents acceptance',async()=>{
  const f=fixture(),verify=f.verifyHosted;f.verifyHosted=async input=>{const report=await verify(input);f.state.requests[f.request.id].status='needs-reconciliation';f.state.active={requestId:f.request.id,owner:'github:123',token:'test-claim-token-1234567890',claimedAt:at};return report;};
  await assert.rejects(()=>reverifyHostedDealerPack(f),/queued, active or uncertain/);assert.ok(!f.calls.includes('after-hosted-recheck'));
});

test('a changed terminal receipt after browser verification prevents acceptance',async()=>{
  const f=fixture(),verify=f.verifyHosted;f.verifyHosted=async input=>{const report=await verify(input);f.receipt.finishedAt=at;reseal(f);return report;};
  await assert.rejects(()=>reverifyHostedDealerPack(f),/latest exact receipt or terminal state changed/);
});

test('unrelated queue progress is permitted and unaccounted account identities are retained honestly',async()=>{
  const f=fixture(),read=f.provider.snapshot,verify=f.verifyHosted;
  f.provider.snapshot=async input=>{const snapshot=await read(input);snapshot.scripts.push({name:'cars-unaccounted',id:'e'.repeat(32)});snapshot.scriptCount++;return snapshot;};
  f.verifyHosted=async input=>{const report=await verify(input);f.state.generation++;return report;};
  const report=await reverifyHostedDealerPack(f);assert.equal(report.status,'passed');assert.equal(report.finalQueueGeneration,1);assert.equal(report.account.expectedKnownWorkers,2);assert.equal(report.account.actualWorkers,3);assert.deepEqual(report.account.unaccountedWorkers,[{name:'cars-unaccounted',id:'e'.repeat(32)}]);
});

test('failed or incomplete hosted results do not become a current acceptance',async()=>{
  for(const mutate of [f=>f.hosted.success=false,f=>f.hosted.designs[0].headStatus='failed',f=>f.hosted.designs[0].nameVisible=false,f=>f.hosted.versionId='33333333-3333-4333-8333-333333333333',f=>f.hosted.finishedAt='2026-10-21T05:00:00.000Z',f=>f.hosted.startedAt='2026-10-21T05:00:00.000Z']){
    const f=fixture(),original=JSON.stringify(f.state);mutate(f);await assert.rejects(()=>reverifyHostedDealerPack(f));assert.ok(f.calls.includes('after-hosted-recheck'));assert.equal(JSON.stringify(f.state),original);
  }
});

test('a thrown browser failure still obtains an after-check observation and preserves its failure',async()=>{
  const f=fixture();f.verifyHosted=async()=>{throw Error('locale-readiness timeout');};
  await assert.rejects(()=>reverifyHostedDealerPack(f),/locale-readiness timeout/);assert.ok(f.calls.includes('after-hosted-recheck'));
});

test('read transport prevents every non-GET operation before it reaches credentials or transport',async()=>{
  const calls=[],read=hostedRecheckReadTransport(async operation=>{calls.push(operation);return {status:200};});
  assert.deepEqual(await read({method:'GET',path:'/accounts/example'}),{status:200});
  for(const method of ['POST','PUT','PATCH','DELETE','HEAD',undefined])assert.throws(()=>read({method,path:'/accounts/example'}),/only authenticated GET/);
  assert.equal(calls.length,1);
});

test('CLI requires explicit bounded slugs, rejects mutation flags and never permits a saved proof override',()=>{
  assert.deepEqual(parseHostedRecheckArgs(['--slugs','car-avenue-llc,dubuy-auto-cars','--report','runtime/recheck.json']),{slugs:['car-avenue-llc','dubuy-auto-cars'],report:'runtime/recheck.json'});
  for(const args of [[],['--slugs','car-avenue-llc'],['--slugs','car-avenue-llc,car-avenue-llc','--report','runtime/report.json'],['--slugs','../escape','--report','runtime/report.json'],['--slugs','car-avenue-llc','--report','runtime/report.json','--write','true'],['--slugs','car-avenue-llc','--report','runtime/report.json','--queue-state','saved.json']])assert.throws(()=>parseHostedRecheckArgs(args));
});

test('CLI writes only generated new reports, retains failed rows and never relabels queue evidence',async t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-hosted-recheck-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const f=fixture(),original=JSON.stringify(f.state),report=await runHostedRecheckCli(['--slugs',f.slug,'--report','runtime/dealer-pack-dispatch/hosted-recheck.json'],{root,...f,registry:[]});
  assert.equal(report.success,true);assert.equal(JSON.stringify(f.state),original);assert.equal(JSON.parse(fs.readFileSync(path.join(root,'runtime/dealer-pack-dispatch/hosted-recheck.json'),'utf8')).reports[0].sourceReceiptSha256,f.envelope.sha256);
  await assert.rejects(()=>runHostedRecheckCli(['--slugs',f.slug,'--report','../escaped.json'],{root,...f,registry:[]}),/generated runtime/);
  assert.equal(selectHostedRecheckReceipt({queue:f.state,slug:f.slug}).requestStatus,'failed');
});
