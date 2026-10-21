import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildPackBatchAssignments,PACK_BATCH_FILE} from './lib/dealer-pack-identity.mjs';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,PACK_QUEUE_BRANCH,PACK_QUEUE_PATH,PACK_QUEUE_REPOSITORY,queueDigest,createPackDeploymentQueue,packDeploymentRequest,enqueuePackDeployments} from './lib/dealer-pack-queue.mjs';
import {SOURCE_CAMPAIGN_PATH,SOURCE_CAMPAIGN_MAX_BYTES,createSourceCampaign,validateSourceCampaign,registerSourceCampaign,mutateSourceCampaign,gitSourceCampaignStore,reserveSourceCohort,bindSourceCohortRun,finishSourceCohort,holdSourceCohort,syncSourceCampaignTargets,hasAttemptedSourceMaterial,observeSourceExternalRuns,completeSourceExternalRunIntake,completeSourceOwnedRunIntake,completeSourceExternalOwnedAlias} from './lib/dealer-pack-source-campaign.mjs';

const now='2026-10-21T00:00:00.000Z',later='2026-10-21T01:00:00.000Z',sha='a'.repeat(40),hash=value=>createHash('sha256').update(value).digest('hex');
const assignment=buildPackBatchAssignments({priorityResearchIds:Array.from({length:400},(_,index)=>'gb-dealer-'+String(index).padStart(3,'0'))});
const policy={schemaVersion:1,kind:'cars-owner-authorized-pack-deployment',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,zoneName:'webpreviews.site',workersPlan:'paid',allowedScripts:500,minimumSpareScripts:0,ownerConfirmedPaid:true,allowNewPreviews:true,outreachApproved:false,authorizedAt:now,authorizationSource:'Owner instructed durable400 source preparation and automatic qualified deployment',reason:'Owner authorized400 new previews while preserving the protected existing fleet and strict source qualification.',maximumNewDealers:400};
function queue(){return createPackDeploymentQueue({policy,now,queueId:'11111111-1111-4111-8111-111111111111',baseline:{accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,evidence:'authenticated-cloudflare-api',complete:true,observedAt:now,workerNames:['cars-protected'],routes:[{id:'old-route',pattern:'protected.webpreviews.site/*',script:'cars-protected'}],domains:[]}});}
function campaign(){return createSourceCampaign({assignment,queue:queue(),sourceSha:sha,now});}
function memoryStore(state=null){let current=structuredClone(state),revision=0,writes=0;return {async read(){await Promise.resolve();return {state:structuredClone(current),revision:String(revision)};},async compareAndSwap(expected,next){await Promise.resolve();if(expected!==String(revision))return false;current=structuredClone(next);revision++;writes++;return String(revision);},get state(){return structuredClone(current);},get writes(){return writes;}};}
const selection=(index=0,extra={})=>({dealerId:assignment.batches[Math.floor(index/100)].leadIds[index%100],slug:'dealer-'+index,packDigest:hash('pack'+index),buildFingerprint:hash('shared-build'),...extra});
function reserved(state=campaign(),extra={}){return reserveSourceCohort(state,{id:hash('nonce'),owner:'github:123',sourceSha:sha,selections:[selection()],now,...extra});}
function run(state,extra={}){const reservation=state.reservations[state.activeReservationId??hash('nonce')];return {id:456,path:'.github/workflows/dealer-pack-pipeline.yml',repository:{full_name:PACK_QUEUE_REPOSITORY},head_repository:{full_name:PACK_QUEUE_REPOSITORY},head_branch:'main',event:'workflow_dispatch',head_sha:reservation.sourceSha,run_attempt:1,display_title:'Cars rollout '+reservation.id,status:'in_progress',conclusion:null,...extra};}
const externalRun=(extra={})=>({id:999,path:'.github/workflows/dealer-pack-pipeline.yml',repository:{full_name:PACK_QUEUE_REPOSITORY},head_repository:{full_name:PACK_QUEUE_REPOSITORY},head_branch:'main',event:'workflow_dispatch',head_sha:sha,run_attempt:1,display_title:'Legacy manual native producer',status:'completed',conclusion:'success',...extra});
const externalIntake=(extra={})=>({runId:999,sourceCommit:sha,completed:true,run:externalRun(),failures:[],failedMaterials:[],...extra});
function failedMaterial(extra={}){const source={scriptsTree:'c'.repeat(40),lockBlob:'d'.repeat(40),nativeWorkflowBlob:'e'.repeat(40)};return {...selection(),sourceSha:sha,packTree:'b'.repeat(40),...source,buildFingerprint:queueDigest({kind:'cars-source-build-material-v1',...source}),reason:'Exact old native source preparation rejected the mark',...extra};}

test('exact400 registration is idempotent and never manufactures qualified deployment requests',async()=>{
 const store=memoryStore(),q=queue(),before=structuredClone(q);
 const first=await mutateSourceCampaign(store,state=>registerSourceCampaign(state,{assignment,queue:q,sourceSha:sha,now}),{now});
 assert.equal(first.state.generation,0);assert.equal(first.state.order.length,400);assert.equal(store.writes,1);
 assert.deepEqual(first.state.order,assignment.batches.flatMap(row=>row.leadIds));assert(first.state.order.every(id=>first.state.targets[id].status==='waiting-inputs'));
 assert.equal(first.state.sourceEnvelope.assignmentPath,PACK_BATCH_FILE);assert.equal(first.state.sourceEnvelope.initialSourceSha,sha);assert(!Object.hasOwn(first.state,'requests'));assert.deepEqual(q,before);
 await mutateSourceCampaign(store,state=>registerSourceCampaign(state,{assignment,queue:q,sourceSha:'b'.repeat(40),now:later}),{now:later});
 assert.equal(store.writes,1);assert.equal(store.state.sourceEnvelope.initialSourceSha,sha);
 const invalid=structuredClone(assignment);invalid.batches[0].leadIds.reverse();assert.throws(()=>createSourceCampaign({assignment:invalid,queue:q,sourceSha:sha,now}),/canonical400/);
});

test('campaign validation binds exact assignment, baseline, source envelope and1MiB state cap',()=>{
 const state=campaign();assert.equal(validateSourceCampaign(state,{assignment}),state);
 for(const change of [next=>next.order.pop(),next=>next.targets[state.order[0]].batch=2,next=>next.sourceEnvelope.assignmentPath='other.json',next=>next.assignmentDigest=hash('other'),next=>next.baseline.accountId='f'.repeat(32)]){const next=structuredClone(state);change(next);assert.throws(()=>validateSourceCampaign(next));}
 const oversized=structuredClone(state);oversized.extra='x'.repeat(SOURCE_CAMPAIGN_MAX_BYTES);assert.throws(()=>validateSourceCampaign(oversized),/1MiB/);
 assert.throws(()=>createSourceCampaign({assignment,queue:queue(),sourceSha:sha,targets:[{dealerId:state.order[0],batch:2,slug:'wrong-batch'}],now}),/exact assignment/);
 assert.throws(()=>createSourceCampaign({assignment,queue:queue(),sourceSha:sha,targets:[{dealerId:state.order[0],batch:1,slug:'same-site'},{dealerId:state.order[1],batch:1,slug:'same-site'}],now}),/share a canonical slug/);
 const dangling=structuredClone(state);dangling.targets[state.order[0]].status='reserved';assert.throws(()=>validateSourceCampaign(dangling),/exact active reservation/);
});

test('one prePOST cohort holds at most14 exact material targets and never expires or steals',()=>{
 const original=campaign(),state=reserved(original,{selections:Array.from({length:14},(_,index)=>selection(index))});
 assert.equal(original.activeReservationId,null);assert.equal(state.generation,0);assert.equal(state.reservations[state.activeReservationId].dispatchIntent,true);assert.equal(state.reservations[state.activeReservationId].selections.length,14);
 assert.throws(()=>reserved(original,{selections:Array.from({length:15},(_,index)=>selection(index))}),/1..14/);
 assert.throws(()=>reserved(state,{id:hash('later'),now:'2030-01-01T00:00:00Z'}),/active or uncertain/);
 assert.throws(()=>reserved(original,{selections:[selection(0),selection(0)]}),/distinct/);
 assert.throws(()=>reserved(original,{selections:[selection(0,{dealerId:'gb-not-assigned'})]}),/assigned/);
});

test('only a successful freshCAS returns dispatch authority; racing schedulers retain one cohort',async()=>{
 const store=memoryStore(campaign());
 const reserve=id=>mutateSourceCampaign(store,state=>({state:reserved(state,{id:hash(id)}),value:{reserved:true}}),{now});
 const results=await Promise.allSettled([reserve('scheduler-one'),reserve('scheduler-two')]);
 assert.equal(results.filter(row=>row.status==='fulfilled'&&row.value.value.reserved).length,1);assert.equal(results.filter(row=>row.status==='rejected').length,1);assert.equal(store.writes,1);assert.equal(store.state.generation,1);assert.equal(Object.keys(store.state.reservations).length,1);
});

test('unchanged registration or an already persisted reservation cannot manufacture dispatch authority',async()=>{
 for(const initial of [campaign(),reserved()]){const store=memoryStore(initial);await assert.rejects(mutateSourceCampaign(store,state=>({state,value:{reserved:true}}),{now}),/fresh reservation committed byCAS/);assert.equal(store.writes,0);assert.deepEqual(store.state,initial);}
});

test('uncertainPOST stays reserved until positive exact nonce/source proof; no blind retry',()=>{
 const initial=reserved(),id=initial.activeReservationId,held=holdSourceCohort(initial,{reservationId:id,reason:'POST timed out; acceptance unknown',now:later});
 assert.equal(held.activeReservationId,id);assert.equal(held.reservations[id].status,'needs-reconciliation');assert.throws(()=>reserved(held,{id:hash('retry')}),/active or uncertain/);
 for(const extra of [{head_sha:'b'.repeat(40)},{run_attempt:2},{display_title:'Cars rollout '+hash('another')},{head_branch:'other'},{event:'push'},{head_repository:{full_name:'other/cars'}},{path:'.github/workflows/other.yml'}])assert.throws(()=>bindSourceCohortRun(held,{reservationId:id,run:run(held,extra),now:later}),/exact original/);
 const bound=bindSourceCohortRun(held,{reservationId:id,run:run(held),now:later});assert.equal(bound.reservations[id].status,'building');assert.equal(bound.activeReservationId,id);
 assert.throws(()=>bindSourceCohortRun(bound,{reservationId:id,run:run(bound,{id:789}),now:later}),/another native run/);
 assert.throws(()=>finishSourceCohort(bound,{reservationId:id,run:run(bound),now:later}),/positively completed/);
});

test('terminal source proofs never imply qualification or retry identical pack/sharedmaterial after unrelated main advances',()=>{
 for(const conclusion of ['success','failure','cancelled']){
  const initial=reserved(),id=initial.activeReservationId,finished=finishSourceCohort(initial,{reservationId:id,run:run(initial,{status:'completed',conclusion}),now:later});
  assert.equal(finished.activeReservationId,null);assert.equal(finished.targets[selection().dealerId].status,conclusion==='success'?'source-finished':'held');assert.equal(finished.reservations[id].run.conclusion,conclusion);assert(!Object.hasOwn(finished,'requests'));
  assert(hasAttemptedSourceMaterial(finished,selection()));assert.throws(()=>reserved(finished,{id:hash('new-main'),sourceSha:'b'.repeat(40)}),/already has a retained source attempt/);
  for(const changed of [{packDigest:hash('corrected-pack')},{buildFingerprint:hash('corrected-tooling')}]){const next=reserved(finished,{id:hash(JSON.stringify(changed)),sourceSha:'b'.repeat(40),selections:[selection(0,changed)]});assert.equal(next.targets[selection().dealerId].materials.length,2);}
 }
});

test('every retained qualified queue status excludes source work and preserves the protected provider baseline',async()=>{
 for(const status of ['queued','active','deployed','failed','needs-reconciliation','rolled-back']){
  const qStore=memoryStore(queue()),s=selection(),request=packDeploymentRequest({...s,batch:1,workerName:'cars-'+s.slug,publicOrigin:'https://'+s.slug+'.webpreviews.site',releaseId:'cars-six-'+hash('release'),releaseDigest:hash('release'),outputDigest:hash('output'),sourceCommit:sha});
  await enqueuePackDeployments(qStore,[request]);const qualified=qStore.state;qualified.requests[request.id].status=status;const old=structuredClone(qualified),state=syncSourceCampaignTargets(campaign(),{queue:qualified,now});
  const target=state.targets[s.dealerId];assert.deepEqual(target.retainedRequestIds,[request.id]);assert.equal(target.status,['failed','needs-reconciliation','rolled-back'].includes(status)?'held':'retained');assert.throws(()=>reserved(state,{selections:[selection(0,{packDigest:hash('changed')})]}),/qualified queue identity/);assert.deepEqual(qualified,old);
  const waiting=syncSourceCampaignTargets(state,{queue:qualified,observations:[{dealerId:s.dealerId,reason:'Ready now'}],now:later});assert.equal(waiting.targets[s.dealerId].status,target.status);
 }
});

test('factual readiness observations keep all targets pending and cannot erase material or retained history',async()=>{
 const store=memoryStore(campaign()),first=store.state.order[0];const observed=syncSourceCampaignTargets(store.state,{queue:queue(),observations:[{dealerId:first,slug:'dealer-0',reason:'Missing dated public email evidence'}],now});assert.equal(observed.targets[first].status,'waiting-inputs');assert.equal(observed.targets[first].reason,'Missing dated public email evidence');assert.equal(observed.order.length,400);
 for(const key of ['assignment','baseline','sourceEnvelope']){await assert.rejects(mutateSourceCampaign(store,state=>{state[key]={};return state;},{now}));}
 await mutateSourceCampaign(store,state=>reserved(state),{now});await assert.rejects(mutateSourceCampaign(store,state=>{state.targets[first].materials=[];return state;},{now}),/history|binding/);
 await assert.rejects(mutateSourceCampaign(store,state=>{state.generation++;return state;},{now}),/must not increment/);assert.equal(store.state.generation,1);
});

async function ownedIntakeFixture({partial=true,terminal=true}={}){
 const failed=failedMaterial({...selection(1),buildFingerprint:failedMaterial().buildFingerprint}),selections=[selection(),...(partial?[failed]:[])];
 const initial=reserved(campaign(),{selections}),reservationId=initial.activeReservationId,terminalRun=run(initial,{status:'completed',conclusion:partial?'failure':'success'}),s=selections[0];
 const request=packDeploymentRequest({...s,batch:1,workerName:'cars-'+s.slug,publicOrigin:'https://'+s.slug+'.webpreviews.site',releaseId:'cars-six-'+hash('release'),releaseDigest:hash('release'),outputDigest:hash('output'),sourceCommit:sha});
 const qStore=memoryStore(queue());await enqueuePackDeployments(qStore,[request]);
 const synced=syncSourceCampaignTargets(initial,{queue:qStore.state,now:later}),state=terminal?finishSourceCohort(synced,{reservationId,run:terminalRun,now:later}):synced;
 const intake={completed:true,runId:terminalRun.id,sourceCommit:sha,contracts:{runId:terminalRun.id,sourceCommit:sha,conclusion:'success'},pending:[],requests:[request],failures:partial?[{slug:failed.slug,reason:failed.reason}]:[],failedMaterials:partial?[failed]:[]};
 return {state,initial,reservationId,run:terminalRun,intake,request,failed,queue:qStore.state};
}

test('owned terminal intake has an additive permanent receipt without rewriting terminal attempts',async()=>{
 for(const partial of[false,true]){
  const f=await ownedIntakeFixture({partial}),before=structuredClone(f.state),next=completeSourceOwnedRunIntake(f.state,{...f,now:later}),receipt=next.ownedIntakes[f.reservationId];
  assert.deepEqual(f.state,before);assert.deepEqual(next.reservations,before.reservations);assert.deepEqual(next.baseline,before.baseline);assert(!Object.hasOwn(next,'requests'));
  assert.deepEqual(receipt.retained,[{dealerId:selection().dealerId,slug:selection().slug,requestIds:[f.request.id]}]);assert.equal(receipt.failedMaterialProofs.length,partial?1:0);
  assert.deepEqual(completeSourceOwnedRunIntake(next,{...f,now:'2026-11-01T00:00:00.000Z'}),next);
  assert.equal(next.targets[selection().dealerId].status,'retained');if(partial)assert(hasAttemptedSourceMaterial(next,f.failed));
 }
});

test('owned intake refuses incomplete, global, unbound and unretained member outcomes',async()=>{
 const f=await ownedIntakeFixture(),complete=(intake=f.intake,run=f.run,state=f.state)=>completeSourceOwnedRunIntake(state,{reservationId:f.reservationId,run,intake,now:later});
 assert.throws(()=>complete(f.intake,f.run,f.initial),/permanent qualified queue/);
 for(const change of[{completed:false},{sourceCommit:'f'.repeat(40)},{runId:999},{contracts:{...f.intake.contracts,conclusion:'failure'}},{pending:[{slug:f.failed.slug}]},{requests:undefined},{failedMaterials:[]},{failures:[{reason:'Artifact inventory unavailable'}]},{failedMaterials:[{...f.failed,packDigest:hash('unbound')}]},{failedMaterials:[{...f.failed,packTree:'unknown'}]},{failedMaterials:[{...f.failed,buildFingerprint:hash('unbound')}]},{failedMaterials:[{...f.failed,sourceSha:'f'.repeat(40)}]}])assert.throws(()=>complete({...f.intake,...change}));
 for(const change of[{id:999},{run_attempt:2},{head_sha:'f'.repeat(40)},{conclusion:'cancelled'},{status:'in_progress',conclusion:null}])assert.throws(()=>complete(f.intake,{...f.run,...change}));
 const cancelled=finishSourceCohort(syncSourceCampaignTargets(f.initial,{queue:f.queue,now:later}),{reservationId:f.reservationId,run:{...f.run,conclusion:'cancelled'},now:later});
 assert.throws(()=>complete(f.intake,f.run,cancelled),/terminal run proof/);
});

test('owned intake can finish atomically with its live reservation and cannot be erased later',async()=>{
 const f=await ownedIntakeFixture({terminal:false}),store=memoryStore(f.state);
 await mutateSourceCampaign(store,state=>finishSourceCohort(completeSourceOwnedRunIntake(state,{...f,now:later}),{reservationId:f.reservationId,run:f.run,now:later}),{now:later});
 assert.equal(store.state.activeReservationId,null);assert(store.state.ownedIntakes[f.reservationId]);
 await assert.rejects(mutateSourceCampaign(store,state=>{delete state.ownedIntakes;return state;},{now:later}),/cannot be removed or rewritten/);
 await assert.rejects(mutateSourceCampaign(store,state=>{state.ownedIntakes[f.reservationId].completedAt='2026-11-01T00:00:00.000Z';return state;},{now:later}),/cannot be removed or rewritten/);
 const old=campaign();delete old.ownedIntakes;assert.equal(validateSourceCampaign(old),old);
});

test('a pre-binding external observation can acknowledge the exact cancelled owned attempt without qualification',()=>{
 const initial=reserved(),reservationId=initial.activeReservationId,terminalRun=run(initial,{status:'completed',conclusion:'cancelled'});
 const observed=observeSourceExternalRuns(initial,{runs:[{runId:terminalRun.id,sourceSha:sha}],now}),finished=finishSourceCohort(observed,{reservationId,run:terminalRun,now:later}),before=structuredClone(finished);
 const args={runId:terminalRun.id,sourceSha:sha,reservationId,run:terminalRun,now:later},next=completeSourceExternalOwnedAlias(finished,args);
 assert.deepEqual(finished,before);assert.deepEqual(next.reservations,before.reservations);assert.deepEqual(next.targets,before.targets);assert.deepEqual(next.ownedIntakes,{});
 assert.equal(next.externalRuns[String(terminalRun.id)].ownedReservationId,reservationId);assert.equal(next.externalRuns[String(terminalRun.id)].terminalIntakeComplete,true);assert.deepEqual(next.externalRuns[String(terminalRun.id)].failedMaterialProofs,[]);
 assert.deepEqual(completeSourceExternalOwnedAlias(next,{...args,now:'2026-11-01T00:00:00.000Z'}),next);
 assert(reserved(next,{id:hash('corrected-shared-source'),selections:[selection(0,{buildFingerprint:hash('corrected-shared-source')})]}).activeReservationId);
 assert.throws(()=>completeSourceExternalRunIntake(finished,{runId:terminalRun.id,sourceSha:sha,intake:externalIntake({runId:terminalRun.id,run:terminalRun}),now:later}),/terminal native run proof/);
});

test('owned external alias refuses foreign, changed, nonterminal and unqualified positive runs',async()=>{
 const initial=reserved(),reservationId=initial.activeReservationId,terminalRun=run(initial,{status:'completed',conclusion:'cancelled'}),observed=observeSourceExternalRuns(initial,{runs:[{runId:terminalRun.id,sourceSha:sha}],now}),finished=finishSourceCohort(observed,{reservationId,run:terminalRun,now:later});
 const args={runId:terminalRun.id,sourceSha:sha,reservationId,run:terminalRun,now:later};
 for(const change of[{reservationId:hash('foreign-reservation')},{sourceSha:'b'.repeat(40)},{run:{...terminalRun,id:999}},{run:{...terminalRun,head_sha:'b'.repeat(40)}},{run:{...terminalRun,conclusion:'failure'}},{run:{...terminalRun,run_attempt:2}},{run:{...terminalRun,display_title:'Unowned cancellation'}}])assert.throws(()=>completeSourceExternalOwnedAlias(finished,{...args,...change}));
 assert.throws(()=>completeSourceExternalOwnedAlias(observed,args),/terminal owned run proof/);
 const f=await ownedIntakeFixture(),pendingAlias=observeSourceExternalRuns(f.initial,{runs:[{runId:f.run.id,sourceSha:sha}],now}),unacknowledged=finishSourceCohort(syncSourceCampaignTargets(pendingAlias,{queue:f.queue,now:later}),{reservationId:f.reservationId,run:f.run,now:later}),positiveArgs={runId:f.run.id,sourceSha:sha,reservationId:f.reservationId,run:f.run,now:later};
 assert.throws(()=>completeSourceExternalOwnedAlias(unacknowledged,positiveArgs),/completed owned intake acknowledgement/);
 const acknowledged=completeSourceOwnedRunIntake(unacknowledged,{...f,now:later}),resolved=completeSourceExternalOwnedAlias(acknowledged,positiveArgs);
 assert.deepEqual(resolved.ownedIntakes,acknowledged.ownedIntakes);assert.equal(resolved.externalRuns[String(f.run.id)].terminalIntakeComplete,true);
});

test('completed external owned aliases remain immutable with original history and baseline',async()=>{
 const initial=reserved(),reservationId=initial.activeReservationId,terminalRun=run(initial,{status:'completed',conclusion:'cancelled'}),observed=observeSourceExternalRuns(initial,{runs:[{runId:terminalRun.id,sourceSha:sha}],now}),finished=finishSourceCohort(observed,{reservationId,run:terminalRun,now:later}),store=memoryStore(finished),baseline=structuredClone(finished.baseline);
 await mutateSourceCampaign(store,state=>completeSourceExternalOwnedAlias(state,{runId:terminalRun.id,sourceSha:sha,reservationId,run:terminalRun,now:later}),{now:later});
 assert.deepEqual(store.state.baseline,baseline);assert.deepEqual(store.state.reservations,finished.reservations);
 await assert.rejects(mutateSourceCampaign(store,state=>{delete state.externalRuns[String(terminalRun.id)];return state;},{now:later}),/cannot be removed/);
 await assert.rejects(mutateSourceCampaign(store,state=>{state.externalRuns[String(terminalRun.id)].completedAt='2026-11-01T00:00:00.000Z';return state;},{now:later}),/cannot be removed/);
});

test('legacy native terminal-event gap remains barred until exact positive maintained intake completion',()=>{
 const observed=observeSourceExternalRuns(campaign(),{runs:[{runId:999,sourceSha:sha}],now});assert.equal(observed.externalRuns['999'].terminalIntakeComplete,false);assert.throws(()=>reserved(observed),/awaits exact terminal intake/);
 assert.deepEqual(observeSourceExternalRuns(observed,{runs:[{runId:999,sourceSha:sha}],now:later}),observed);
 assert.throws(()=>observeSourceExternalRuns(observed,{runs:[{runId:999,sourceSha:'b'.repeat(40)}],now}),/source changed/);
 for(const intake of [undefined,{runId:998,sourceCommit:sha,completed:true},{runId:999,sourceCommit:'b'.repeat(40),completed:true},{runId:999,sourceCommit:sha,completed:false}])assert.throws(()=>completeSourceExternalRunIntake(observed,{runId:999,sourceSha:sha,intake,now:later}),/positively completed/);
 const completed=completeSourceExternalRunIntake(observed,{runId:999,sourceSha:sha,intake:externalIntake(),now:later});assert.equal(completed.externalRuns['999'].terminalIntakeComplete,true);assert.equal(completed.externalRuns['999'].completedAt,later);assert(reserved(completed).activeReservationId);
 assert.deepEqual(observeSourceExternalRuns(completed,{runs:[{runId:999,sourceSha:sha}],now:later}),completed);
 const maximum=observeSourceExternalRuns(campaign(),{runs:Array.from({length:100},(_,index)=>({runId:index+1,sourceSha:sha})),now});assert.throws(()=>observeSourceExternalRuns(maximum,{runs:[{runId:101,sourceSha:sha}],now}),/At most100/);
});

test('legacy failure completion needs bound source material for every failure and authenticated exact terminal metadata',()=>{
 const observed=observeSourceExternalRuns(campaign(),{runs:[{runId:999,sourceSha:sha}],now}),material=failedMaterial(),failures=[{slug:material.slug,reason:material.reason}],complete=intake=>completeSourceExternalRunIntake(observed,{runId:999,sourceSha:sha,intake,now:later});
 for(const intake of [externalIntake({failures}),externalIntake({failedMaterials:[material]}),externalIntake({failures:[{reason:'Global artifact inventory unavailable'}],failedMaterials:[material]}),externalIntake({failures:[...failures,{slug:'missing-member',reason:'Second failure'}],failedMaterials:[material]})])assert.throws(()=>complete(intake),/failure|material/);
 for(const change of [{sourceSha:'f'.repeat(40)},{packTree:'not-a-git-object'},{buildFingerprint:hash('unbound-fingerprint')},{nativeWorkflowBlob:'f'.repeat(40)},{dealerId:'gb-unassigned'}])assert.throws(()=>complete(externalIntake({failures,failedMaterials:[{...material,...change}]})),/proof|fingerprint|assigned/);
 for(const change of [{head_sha:'f'.repeat(40)},{run_attempt:2},{repository:{full_name:'other/cars'}},{status:'in_progress',conclusion:null},{id:998}])assert.throws(()=>complete(externalIntake({run:externalRun(change),failures,failedMaterials:[material]})),/terminal native run proof/);
 const completed=complete(externalIntake({run:externalRun({conclusion:'failure'}),failures,failedMaterials:[material]})),target=completed.targets[material.dealerId];assert.equal(completed.externalRuns['999'].terminalIntakeComplete,true);assert.equal(target.status,'held');assert.equal(target.materials[0].externalRunId,999);assert.equal(target.materials[0].packTree,material.packTree);assert.equal(target.materials[0].scriptsTree,material.scriptsTree);assert(hasAttemptedSourceMaterial(completed,material));
 assert.throws(()=>reserved(completed,{sourceSha:'f'.repeat(40),selections:[material]}),/already has a retained source attempt/);
 for(const changed of [{packDigest:hash('real-pack-fix')},{buildFingerprint:hash('real-shared-code-fix')}])assert(reserved(completed,{id:hash(JSON.stringify(changed)),sourceSha:'f'.repeat(40),selections:[{...material,...changed}]}).activeReservationId);
 assert.deepEqual(completeSourceExternalRunIntake(completed,{runId:999,sourceSha:sha,intake:externalIntake({run:externalRun({conclusion:'failure'}),failures,failedMaterials:[material]}),now:later}),completed);
 assert.equal(observed.targets[material.dealerId].materials.length,0);assert.equal(observed.externalRuns['999'].terminalIntakeComplete,false);
});

test('a concurrent legacy barrier prevents a source reservation afterCAS loss without dispatch authority',async()=>{
 const store=memoryStore(campaign());let raced=false;const racing={read:()=>store.read(),compareAndSwap:async(revision,next)=>{if(!raced){raced=true;await mutateSourceCampaign(store,state=>observeSourceExternalRuns(state,{runs:[{runId:999,sourceSha:sha}],now}),{now});}return store.compareAndSwap(revision,next);}};
 await assert.rejects(mutateSourceCampaign(racing,state=>({state:reserved(state),value:{reserved:true}}),{now}),/awaits exact terminal intake/);assert.equal(Object.keys(store.state.reservations).length,0);assert.equal(store.state.externalRuns['999'].terminalIntakeComplete,false);
 await assert.rejects(mutateSourceCampaign(store,state=>{state.externalRuns={};return state;},{now}),/cannot be removed/);
});

function gitFixture({state=null,race=false,wrongBlob=false,uncertain=false}={}){
 const blobs=new Map(),trees=new Map(),commits=new Map(),calls=[];let serial=1,current='1'.repeat(40),raced=false;
 const id=()=>String(++serial).padStart(40,'0'),blob=bytes=>{const sha1=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');blobs.set(sha1,bytes);return sha1;};
 const queueSha=blob(Buffer.from('protected qualified queue bytes')),otherSha=blob(Buffer.from('bootstrap evidence'));
 const root=[{path:PACK_QUEUE_PATH,mode:'100644',type:'blob',sha:queueSha,size:blobs.get(queueSha).length},{path:'baseline-proof.json',mode:'100644',type:'blob',sha:otherSha,size:blobs.get(otherSha).length}];
 if(state){const bytes=Buffer.from(JSON.stringify(state)+'\n');root.push({path:SOURCE_CAMPAIGN_PATH,mode:'100644',type:'blob',sha:blob(bytes),size:bytes.length});}
 const initialTree=id();trees.set(initialTree,root);commits.set(current,{sha:current,tree:{sha:initialTree},parents:[]});
 const prefix='/repos/'+PACK_QUEUE_REPOSITORY;
 const request=async call=>{calls.push(structuredClone(call));const route=call.path.slice(prefix.length);
  if(call.method==='GET'&&route==='/git/ref/heads/'+PACK_QUEUE_BRANCH)return {status:200,body:{ref:'refs/heads/'+PACK_QUEUE_BRANCH,object:{type:'commit',sha:current}}};
  if(call.method==='GET'&&route.startsWith('/git/commits/'))return {status:200,body:commits.get(route.slice('/git/commits/'.length))};
  if(call.method==='GET'&&route.startsWith('/git/trees/')){const sha1=route.slice('/git/trees/'.length);return {status:200,body:{sha:sha1,truncated:false,tree:trees.get(sha1)}};}
  if(call.method==='GET'&&route.startsWith('/git/blobs/')){const sha1=route.slice('/git/blobs/'.length),bytes=blobs.get(sha1);return {status:200,body:{sha:sha1,size:bytes.length,encoding:'base64',content:(wrongBlob?Buffer.from('wrong'):bytes).toString('base64')}};}
  if(call.method==='POST'&&route==='/git/blobs'){const sha1=blob(Buffer.from(call.body.content,'base64'));return {status:201,body:{sha:sha1}};}
  if(call.method==='POST'&&route==='/git/trees'){const sha1=id(),base=structuredClone(trees.get(call.body.base_tree));for(const entry of call.body.tree){const index=base.findIndex(row=>row.path===entry.path),row={...entry,size:blobs.get(entry.sha).length};if(index<0)base.push(row);else base[index]=row;}trees.set(sha1,base);return {status:201,body:{sha:sha1}};}
  if(call.method==='POST'&&route==='/git/commits'){const sha1=id(),commit={sha:sha1,tree:{sha:call.body.tree},parents:call.body.parents.map(sha=>({sha}))};commits.set(sha1,commit);return {status:201,body:commit};}
  if(call.method==='PATCH'&&route==='/git/refs/heads/'+PACK_QUEUE_BRANCH){assert.equal(call.body.force,false);if(race&&!raced){raced=true;const parent=current,tree=id(),entries=structuredClone(trees.get(commits.get(current).tree.sha)),newBytes=Buffer.from('new durable provider event');entries.find(row=>row.path===PACK_QUEUE_PATH).sha=blob(newBytes);entries.find(row=>row.path===PACK_QUEUE_PATH).size=newBytes.length;trees.set(tree,entries);current=id();commits.set(current,{sha:current,tree:{sha:tree},parents:[{sha:parent}]});}if(commits.get(call.body.sha).parents[0].sha!==current)return {status:422,body:{message:'Not fast forward'}};current=call.body.sha;if(uncertain)throw Error('network outcome unknown');return {status:200,body:{ref:'refs/heads/'+PACK_QUEUE_BRANCH,object:{type:'commit',sha:current}}};}
  throw Error('Unexpected mock Git request '+call.method+' '+route);
 };
 return {request,calls,blobs,trees,commits,get current(){return current;},get entries(){return trees.get(commits.get(current).tree.sha);},queueSha,otherSha};
}

test('GitAPI source campaign CAS writes only its own path preserving qualified queue and bootstrap bytes',async()=>{
 const fixture=gitFixture(),store=gitSourceCampaignStore({request:fixture.request}),snapshot=await store.read();assert.equal(snapshot.state,null);assert.equal(snapshot.revision,'1'.repeat(40));
 const revision=await store.compareAndSwap(snapshot.revision,campaign());assert.equal(revision,fixture.current);const readback=await store.read();assert.deepEqual(readback.state,campaign());
 const treeWrites=fixture.calls.filter(row=>row.method==='POST'&&row.path.endsWith('/git/trees'));assert.equal(treeWrites.length,1);assert.deepEqual(treeWrites[0].body.tree.map(row=>row.path),[SOURCE_CAMPAIGN_PATH]);assert(treeWrites[0].body.base_tree);
 assert.equal(fixture.entries.find(row=>row.path===PACK_QUEUE_PATH).sha,fixture.queueSha);assert.equal(fixture.entries.find(row=>row.path==='baseline-proof.json').sha,fixture.otherSha);
 const commitWrite=fixture.calls.find(row=>row.method==='POST'&&row.path.endsWith('/git/commits'));assert.deepEqual(commitWrite.body.parents,[snapshot.revision]);assert(fixture.calls.every(row=>row.path.startsWith('/repos/'+PACK_QUEUE_REPOSITORY+'/git/')));
});

test('publisher branch race retries against fresh base tree without reverting queue.json',async()=>{
 const fixture=gitFixture({race:true}),store=gitSourceCampaignStore({request:fixture.request});const result=await mutateSourceCampaign(store,state=>registerSourceCampaign(state,{assignment,queue:queue(),sourceSha:sha,now}),{now});
 assert.equal(result.state.generation,0);assert.equal(fixture.calls.filter(row=>row.method==='PATCH').length,2);assert.equal(fixture.blobs.get(fixture.entries.find(row=>row.path===PACK_QUEUE_PATH).sha).toString(),'new durable provider event');assert.equal(fixture.entries.find(row=>row.path==='baseline-proof.json').sha,fixture.otherSha);
});

test('Git blob bytes are authenticated and ambiguous successful ref updates never auto retry',async()=>{
 const corrupted=gitFixture({state:campaign(),wrongBlob:true});await assert.rejects(gitSourceCampaignStore({request:corrupted.request}).read(),/byte identity/);
 const fixture=gitFixture({uncertain:true}),store=gitSourceCampaignStore({request:fixture.request});await assert.rejects(mutateSourceCampaign(store,()=>campaign(),{now}),/outcome unknown/);assert.equal(fixture.calls.filter(row=>row.method==='PATCH').length,1);assert.equal((await store.read()).state.order.length,400);
});
