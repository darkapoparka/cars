import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,createPackDeploymentQueue,packDeploymentRequest,enqueuePackDeployments,claimPackDeployment,finishPackDeployment,queueDigest,validatePackQueue} from './lib/dealer-pack-queue.mjs';
import {packOwnershipTags} from './lib/dealer-pack-deployment.mjs';

const now='2026-10-20T20:00:00.000Z',time=()=>now,id=value=>createHash('sha256').update(value).digest('hex');
const policy={schemaVersion:1,kind:'cars-owner-authorized-pack-deployment',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,zoneName:'webpreviews.site',workersPlan:'paid',allowedScripts:500,minimumSpareScripts:0,ownerConfirmedPaid:true,allowNewPreviews:true,outreachApproved:false,authorizedAt:now,authorizationSource:'Owner M2 instruction dated20October2026',reason:'Owner approved100 existing plus400 new previews, explicitly accepting no remaining reserve.',maximumNewDealers:400};
// Same clone/revision CAS store used by dealer-pack-deployment.test.mjs.
function memoryStore(state){let current=structuredClone(state),revision=0;return {async read(){await Promise.resolve();return {state:structuredClone(current),revision:String(revision)};},async compareAndSwap(expected,next){await Promise.resolve();if(expected!==String(revision))return false;current=structuredClone(next);revision++;return String(revision);},get state(){return structuredClone(current);}};}
function fixture(){return memoryStore(createPackDeploymentQueue({policy,now,queueId:'11111111-1111-4111-8111-111111111111',baseline:{accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,evidence:'authenticated-cloudflare-api',complete:true,observedAt:now,workerNames:['cars-protected'],routes:[{id:'protected-route',pattern:'protected.webpreviews.site/*',script:'cars-protected'}],domains:[]}}));}
function input({slug='dealer-one',artifactId=7,extra={}}={}){
 const sourceCommit=extra.sourceCommit??'a'.repeat(40),prefix='dealer-pack-transport--123--lane-0';
 return packDeploymentRequest({slug,dealerId:'gb-birmingham-'+slug,batch:1,workerName:'cars-'+slug,publicOrigin:'https://'+slug+'.webpreviews.site',packDigest:id(slug+'pack'),releaseId:'cars-six-'+id('release'),releaseDigest:id('release'),outputDigest:id(slug+'output'),sourceCommit,
  buildArtifact:{runId:123,artifactId,name:prefix+'--manifest',digest:'sha256:'+id('manifest-'+artifactId),bytes:32,sourceCommit,prefix,manifestSha256:id('manifest-content'),shards:[{index:0,id:artifactId+1,name:prefix+'--shard-0',digest:'sha256:'+id('shard-'+artifactId),bytes:64}]},...extra});
}
const automatic={automatic:true,collectRejections:true,now:time};
async function retain(store,request,status){
 await enqueuePackDeployments(store,[request],{now:time});
 if(status==='queued')return;
 const claimed=(await claimPackDeployment(store,{owner:'github:original',requestId:request.id,now:time})).value.claim;
 if(status==='active')return;
 const receipt={...request,status:status==='rolled-back'?'rolled-back':'deployed',requestId:request.id,queueId:store.state.queueId,accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,workerId:'b'.repeat(32),versionId:'22222222-2222-4222-8222-222222222222',routeId:'original-owned-route',ownershipTags:packOwnershipTags(store.state,request),hostedVerified:status!=='failed',deployedAt:now,finishedAt:now};
 await finishPackDeployment(store,claimed,{status,receipt,...(status==='failed'?{error:'Original hosted readiness failure'}:{})},{now:time});
}
function unchanged(store,before){assert.deepEqual(store.state,before);validatePackQueue(store.state);}

test('automatic artifact reruns hold failed and rolled-back owned dealers without replacing receipts',async()=>{
 for(const status of ['failed','rolled-back']){
  const store=fixture(),original=input();await retain(store,original,status);const before=store.state;
  for(const candidate of [input({artifactId:9}),input({artifactId:11,extra:{sourceCommit:'d'.repeat(40),packDigest:id('new-pack'),outputDigest:id('new-output')}})]){
   assert.notEqual(candidate.id,original.id);
   const result=(await enqueuePackDeployments(store,[candidate],automatic)).value;
   assert.deepEqual(result.added,[]);assert.deepEqual(result.existing,[]);assert.equal(result.rejected.length,1);
   assert.equal(result.rejected[0].existingRequestId,original.id);assert.equal(result.rejected[0].existingStatus,status);assert.match(result.rejected[0].reason,/guarded manual/);
   unchanged(store,before);assert.equal(before.receipts[original.slug][0].sha256,queueDigest(before.receipts[original.slug][0].receipt));
  }
 }
});

test('automatic queued, active and deployed semantic duplicates retain the original artifact request',async()=>{
 for(const status of ['queued','active','deployed']){
  const store=fixture(),original=input();await retain(store,original,status);const before=store.state,candidate=input({artifactId:19});
  const result=(await enqueuePackDeployments(store,[candidate],automatic)).value;
  assert.deepEqual(result,{added:[],existing:[original.id],rejected:[]});assert(!store.state.requests[candidate.id]);unchanged(store,before);
 }
});

test('automatic existing dealers cannot receive materially different source, output, release or identity',async()=>{
 const store=fixture(),original=input();await retain(store,original,'deployed');const before=store.state;
 for(const extra of [{sourceCommit:'d'.repeat(40)},{packDigest:id('changed-pack')},{outputDigest:id('changed-output')},{releaseId:'cars-six-other'},{releaseDigest:id('changed-release')},{batch:2},{dealerId:'gb-london-other-dealer'},{slug:'another-slug',workerName:'cars-another-slug',publicOrigin:'https://another-slug.webpreviews.site'}]){
  const candidate=input({artifactId:29,extra});const result=(await enqueuePackDeployments(store,[candidate],automatic)).value;
  assert.deepEqual(result.added,[]);assert.equal(result.rejected[0].existingRequestId,original.id);assert.match(result.rejected[0].reason,/guarded manual/);unchanged(store,before);
 }
});

test('exact request IDs remain idempotent even after failure or rollback',async()=>{
 for(const status of ['queued','active','deployed','failed','rolled-back']){
  const store=fixture(),original=input();await retain(store,original,status);const before=store.state;
  assert.deepEqual((await enqueuePackDeployments(store,[original],automatic)).value,{added:[],existing:[original.id],rejected:[]});unchanged(store,before);
 }
});

test('an earlier failed dealer history still holds a newly issued semantic duplicate',async()=>{
 const store=fixture(),failed=input(),later=input({artifactId:79,extra:{sourceCommit:'d'.repeat(40),packDigest:id('later-pack')}});
 await retain(store,failed,'failed');await retain(store,later,'deployed');const before=store.state,candidate=input({artifactId:89,extra:{sourceCommit:later.sourceCommit,packDigest:later.packDigest}});
 const result=(await enqueuePackDeployments(store,[candidate],automatic)).value;
 assert.deepEqual(result.added,[]);assert.deepEqual(result.existing,[]);assert.equal(result.rejected[0].existingRequestId,failed.id);assert.equal(result.rejected[0].existingStatus,'failed');unchanged(store,before);
});

test('automatic intake recomputes the dealer hold after a failed CAS races with an owned failure',async()=>{
 const store=fixture(),original=input(),candidate=input({artifactId:39});let reads=0,cas=0,concurrent;
 const racing={read:async()=>{reads++;return store.read();},compareAndSwap:async(revision,next)=>{
  cas++;if(cas===1){await retain(store,original,'failed');concurrent=store.state;}
  return store.compareAndSwap(revision,next);
 }};
 const result=(await enqueuePackDeployments(racing,[candidate],automatic)).value;
 assert.equal(reads,2);assert.equal(cas,1);assert.deepEqual(result.added,[]);assert.equal(result.rejected[0].existingRequestId,original.id);
 assert.equal(result.rejected[0].existingStatus,'failed');assert(!store.state.requests[candidate.id]);unchanged(store,concurrent);
});

test('automatic new-site intake preserves protected baseline and existing claims while retaining unrelated new sites',async()=>{
 const store=fixture(),original=input();await retain(store,original,'active');const before=store.state,newDealer=input({slug:'dealer-two'}),protectedDealer=input({slug:'protected'});
 const result=(await enqueuePackDeployments(store,[input({artifactId:49}),protectedDealer,newDealer],automatic)).value;
 assert.deepEqual(result.added,[newDealer.id]);assert.deepEqual(result.existing,[original.id]);assert.equal(result.rejected.length,1);assert.match(result.rejected[0].reason,/protected baseline/);
 assert.deepEqual(store.state.baseline,before.baseline);assert.equal(store.state.baselineDigest,before.baselineDigest);assert.deepEqual(store.state.policy,before.policy);assert.equal(store.state.policyDigest,before.policyDigest);
 assert.deepEqual(store.state.active,before.active);assert.deepEqual(store.state.requests[original.id],before.requests[original.id]);assert.deepEqual(store.state.receipts,before.receipts);validatePackQueue(store.state);
});

test('manual enqueue retains its existing artifact-rerun and changed-source behavior',async()=>{
 for(const status of ['failed','rolled-back','deployed']){
  const store=fixture(),original=input();await retain(store,original,status);const before=store.state,candidate=input({artifactId:59,extra:{sourceCommit:'d'.repeat(40),packDigest:id('manual-new-pack')}});
  const result=(await enqueuePackDeployments(store,[candidate],{automatic:false,collectRejections:true,now:time})).value;
  assert.deepEqual(result.added,[candidate.id]);assert.deepEqual(result.rejected,[]);assert.deepEqual(store.state.requests[original.id],before.requests[original.id]);assert.deepEqual(store.state.receipts,before.receipts);
 }
});

test('automatic holds throw without collection and unknown-outcome claims remain held',async()=>{
 const store=fixture(),original=input();await enqueuePackDeployments(store,[original],{now:time});const claim=(await claimPackDeployment(store,{owner:'github:original',requestId:original.id,now:time})).value.claim;
 await finishPackDeployment(store,claim,{status:'needs-reconciliation',uncertain:true,error:'Provider outcome unknown'},{now:time});const before=store.state;
 await assert.rejects(enqueuePackDeployments(store,[input({artifactId:69})],{automatic:true}),error=>error.existingRequestId===original.id&&error.existingStatus==='needs-reconciliation');unchanged(store,before);
 await assert.rejects(enqueuePackDeployments(store,[input()],{automatic:'true'}),/explicit boolean/);unchanged(store,before);
});
