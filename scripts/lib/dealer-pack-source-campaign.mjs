/** Durable preparation intent. This file never creates a qualified deployment request. */
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {PACK_BATCH_FILE,buildPackBatchAssignments} from './dealer-pack-identity.mjs';
import {PACK_QUEUE_REPOSITORY,PACK_QUEUE_BRANCH,PACK_QUEUE_PATH,queueDigest,validatePackQueue} from './dealer-pack-queue.mjs';

export const SOURCE_CAMPAIGN_PATH='source-campaign.json';
export const SOURCE_CAMPAIGN_MAX_BYTES=1024*1024;
export const SOURCE_COHORT_MAX=14;
const api='/repos/'+PACK_QUEUE_REPOSITORY;
const workflow='.github/workflows/dealer-pack-pipeline.yml';
const statuses=new Set(['waiting-inputs','reserved','building','source-finished','retained','held','needs-reconciliation']);
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const hex40=value=>typeof value==='string'&&/^[a-f0-9]{40}$/.test(value);
const hex64=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
const timestamp=value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
const slug=value=>typeof value==='string'&&value.length<=43&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const clone=value=>structuredClone(value);
const gitBlob=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const at=value=>typeof value==='function'?value():value??new Date().toISOString();
const baselineOf=queue=>({queueId:queue.queueId,policyDigest:queue.policyDigest,baselineDigest:queue.baselineDigest,accountId:queue.accountId,zoneId:queue.zoneId});

function assignmentRows(assignment){
  assert(Array.isArray(assignment?.batches),'Canonical committed400 assignment required');
  const ids=assignment.batches.flatMap(row=>row.leadIds??[]),expected=buildPackBatchAssignments({priorityResearchIds:ids});
  assert(isDeepStrictEqual(assignment,expected),'Campaign assignment differs from the canonical400 assignment');
  return assignment.batches.flatMap(batch=>batch.leadIds.map((dealerId,index)=>({dealerId,batch:batch.number,position:batch.firstPosition+index})));
}
function materialMatches(row,{packDigest,buildFingerprint}){return row.packDigest===packDigest&&row.buildFingerprint===buildFingerprint;}
function activeReservation(state,id){
  assert(hex64(id)&&state.activeReservationId===id&&state.reservations[id],'Exact active source reservation required');
  return state.reservations[id];
}
function retained(target){return target.retainedRequestIds.length>0;}
function assertRun(run,reservation){
  assert(Number.isSafeInteger(run?.id)&&run.id>0&&run.path===workflow&&run.repository?.full_name===PACK_QUEUE_REPOSITORY&&run.head_repository?.full_name===PACK_QUEUE_REPOSITORY&&run.head_branch==='main'&&run.event==='workflow_dispatch'&&run.head_sha===reservation.sourceSha&&run.run_attempt===1&&run.display_title==='Cars rollout '+reservation.id,'Authenticated exact original native run/nonce/source binding required');
  assert(['queued','in_progress','completed','waiting','pending','requested'].includes(run.status),'Recognized native run status required');
  assert(run.status==='completed'?['success','failure','cancelled','timed_out','action_required','neutral','skipped','stale','startup_failure'].includes(run.conclusion):run.conclusion===null,'Native run completion state differs');
  if(reservation.run)assert(reservation.run.id===run.id&&reservation.run.head_sha===run.head_sha,'A retained reservation cannot bind another native run');
}
function runProof(run){return {id:run.id,path:run.path,repository:{full_name:run.repository.full_name},head_repository:{full_name:run.head_repository.full_name},head_branch:run.head_branch,event:run.event,head_sha:run.head_sha,run_attempt:run.run_attempt,display_title:run.display_title,status:run.status,conclusion:run.conclusion};}
function assertExternalTerminalRun(run,external){assert(run?.id===external.runId&&run.path===workflow&&run.repository?.full_name===PACK_QUEUE_REPOSITORY&&run.head_repository?.full_name===PACK_QUEUE_REPOSITORY&&run.head_branch==='main'&&run.event==='workflow_dispatch'&&run.head_sha===external.sourceSha&&run.run_attempt===1&&run.status==='completed'&&['success','failure'].includes(run.conclusion),'Authenticated exact external terminal native run proof required');}
function assertFailedMaterial(row,external){assert(row&&slug(row.slug)&&hex64(row.packDigest)&&hex64(row.buildFingerprint)&&row.sourceSha===external.sourceSha&&[row.packTree,row.scriptsTree,row.lockBlob,row.nativeWorkflowBlob].every(hex40)&&typeof row.reason==='string'&&row.reason.trim().length>0&&row.reason.length<=2000,'Exact pinned failed native material/source/tree proof required');assert(row.buildFingerprint===queueDigest({kind:'cars-source-build-material-v1',scriptsTree:row.scriptsTree,lockBlob:row.lockBlob,nativeWorkflowBlob:row.nativeWorkflowBlob}),'Failed native build fingerprint differs from its pinned Git object identities');}
function assertOwnedIntake(state,id,receipt){
  const reservation=state.reservations[id];
  assert(reservation&&hex64(id)&&receipt?.reservationId===id&&receipt.runId===receipt.terminalRun?.id&&receipt.sourceSha===reservation.sourceSha&&timestamp(receipt.completedAt),'Exact owned source intake receipt required');
  assertRun(receipt.terminalRun,reservation);assert(receipt.terminalRun.status==='completed'&&['success','failure'].includes(receipt.terminalRun.conclusion),'Owned intake needs an admissible completed original run');
  if(reservation.run?.status==='completed')assert(isDeepStrictEqual(receipt.terminalRun,reservation.run),'Owned intake cannot replace a retained terminal run proof');
  assert(receipt.contracts?.runId===receipt.runId&&receipt.contracts.sourceCommit===reservation.sourceSha&&receipt.contracts.conclusion==='success','Owned intake shared contracts must match the original run/source');
  assert(Array.isArray(receipt.retained)&&Array.isArray(receipt.failedMaterialProofs)&&receipt.retained.length+receipt.failedMaterialProofs.length===reservation.selections.length,'Every selected owned source member needs retained queue identity or exact failed material');
  const seen=new Set();
  for(const row of receipt.retained){const selected=reservation.selections.find(item=>item.dealerId===row.dealerId&&item.slug===row.slug),target=state.targets[row.dealerId];assert(selected&&!seen.has(row.slug)&&Array.isArray(row.requestIds)&&row.requestIds.length>0&&new Set(row.requestIds).size===row.requestIds.length&&row.requestIds.every(id=>hex64(id)&&target.retainedRequestIds.includes(id)),'Owned intake retained members must reference permanent qualified queue identities');seen.add(row.slug);}
  for(const proof of receipt.failedMaterialProofs){assertFailedMaterial(proof,{sourceSha:reservation.sourceSha});const selected=reservation.selections.find(item=>item.dealerId===proof.dealerId&&item.slug===proof.slug);assert(selected&&materialMatches(selected,proof)&&!seen.has(proof.slug),'Owned intake failed proof differs from the selected exact material');seen.add(proof.slug);}
}

export function createSourceCampaign({assignment,queue,sourceSha,targets=[],now=new Date().toISOString()}={}){
  validatePackQueue(queue);assert(hex40(sourceSha)&&timestamp(now),'Exact initial published source and date required');
  const rows=assignmentRows(assignment),known=new Map();
  assert(Array.isArray(targets)&&targets.length<=400,'Optional known target descriptors must be bounded');
  for(const row of targets){assert(row&&rows.some(value=>value.dealerId===row.dealerId&&value.batch===row.batch)&&!known.has(row.dealerId)&&slug(row.slug),'Known target must match its exact assignment and canonical existing slug');known.set(row.dealerId,row.slug);}
  const state={schemaVersion:1,type:'cars-dealer-pack-source-campaign',repository:PACK_QUEUE_REPOSITORY,branch:PACK_QUEUE_BRANCH,path:SOURCE_CAMPAIGN_PATH,
    assignment:clone(assignment),assignmentDigest:assignment.assignmentDigest,baseline:baselineOf(queue),
    sourceEnvelope:{repository:PACK_QUEUE_REPOSITORY,branch:'main',initialSourceSha:sourceSha,assignmentPath:PACK_BATCH_FILE,assignmentDigest:assignment.assignmentDigest},
    generation:0,createdAt:now,updatedAt:now,order:rows.map(row=>row.dealerId),targets:Object.fromEntries(rows.map(row=>[row.dealerId,{...row,slug:known.get(row.dealerId)??null,status:'waiting-inputs',reason:'Waiting for reviewed factual and branding inputs',materials:[],retainedRequestIds:[],retainedRequests:[]}])) ,reservations:{},activeReservationId:null,externalRuns:{},ownedIntakes:{}};
  return validateSourceCampaign(state,{assignment});
}

export function validateSourceCampaign(state,{assignment}={}){
  assert(state?.schemaVersion===1&&state.type==='cars-dealer-pack-source-campaign'&&state.repository===PACK_QUEUE_REPOSITORY&&state.branch===PACK_QUEUE_BRANCH&&state.path===SOURCE_CAMPAIGN_PATH,'Wrong source campaign identity');
  const rows=assignmentRows(state.assignment);if(assignment)assert(isDeepStrictEqual(state.assignment,assignment),'Campaign is not bound to the selected exact400 assignment');
  assert(state.assignmentDigest===state.assignment.assignmentDigest,'Campaign assignment digest differs');
  const baseline=state.baseline,envelope=state.sourceEnvelope;
  assert(typeof baseline?.queueId==='string'&&baseline.queueId.length>=20&&hex64(baseline.policyDigest)&&hex64(baseline.baselineDigest)&&baseline.accountId==='cb0007f242077bd759331f096eb75531'&&baseline.zoneId==='006e99b27c99b7ee85bc0642fa91fa14','Immutable qualified queue baseline binding required');
  assert(envelope?.repository===PACK_QUEUE_REPOSITORY&&envelope.branch==='main'&&hex40(envelope.initialSourceSha)&&envelope.assignmentPath===PACK_BATCH_FILE&&envelope.assignmentDigest===state.assignmentDigest,'Immutable initial source envelope differs');
  assert(Number.isSafeInteger(state.generation)&&state.generation>=0&&timestamp(state.createdAt)&&timestamp(state.updatedAt),'Campaign generation/dates required');
  assert(isDeepStrictEqual(state.order,rows.map(row=>row.dealerId))&&state.targets&&Object.keys(state.targets).length===400&&state.reservations&&typeof state.reservations==='object'&&!Array.isArray(state.reservations),'Exact400 campaign index required');
  const knownSlugs=rows.map(row=>state.targets[row.dealerId]?.slug).filter(value=>value!==null&&value!==undefined);assert(new Set(knownSlugs).size===knownSlugs.length,'Assigned campaign targets cannot share a canonical slug');
  for(const row of rows){
    const target=state.targets[row.dealerId];assert(target&&target.dealerId===row.dealerId&&target.batch===row.batch&&target.position===row.position&&(target.slug===null||slug(target.slug))&&statuses.has(target.status)&&typeof target.reason==='string'&&target.reason.length<=2000,'Campaign target identity/status differs');
    assert(Array.isArray(target.materials)&&Array.isArray(target.retainedRequestIds)&&Array.isArray(target.retainedRequests)&&new Set(target.retainedRequestIds).size===target.retainedRequestIds.length&&target.retainedRequestIds.every(hex64),'Target material/retained request history required');
    assert(isDeepStrictEqual([...target.retainedRequests.map(item=>item.id)].sort(),[...target.retainedRequestIds].sort())&&target.retainedRequests.every(item=>hex64(item.id)&&item.slug===target.slug&&['queued','active','deployed','failed','needs-reconciliation','rolled-back'].includes(item.status)),'Retained request references differ');
    assert(target.materials.every(item=>{if(!hex64(item.packDigest)||!hex64(item.buildFingerprint)||!hex40(item.sourceSha))return false;if(item.externalRunId!==undefined){const external=state.externalRuns?.[String(item.externalRunId)];return item.reservationId===undefined&&external?.sourceSha===item.sourceSha&&external.failedMaterialProofs?.some(proof=>proof.dealerId===row.dealerId&&proof.slug===target.slug&&isDeepStrictEqual({...proof,externalRunId:item.externalRunId},item));}return hex64(item.reservationId)&&state.reservations[item.reservationId]?.sourceSha===item.sourceSha&&state.reservations[item.reservationId]?.selections.some(selected=>selected.dealerId===row.dealerId&&materialMatches(selected,item));}),'Target material history differs from its exact retained source proof');
    assert(new Set(target.materials.map(item=>item.packDigest+':'+item.buildFingerprint)).size===target.materials.length,'Repeated source material attempt');
    if(retained(target))assert(['retained','held'].includes(target.status),'Retained queue identities cannot become source candidates');
    if(['reserved','building','needs-reconciliation'].includes(target.status))assert(state.activeReservationId&&state.reservations[state.activeReservationId]?.status===target.status&&state.reservations[state.activeReservationId]?.selections.some(selected=>selected.dealerId===row.dealerId),'Active target state requires its exact active reservation');
  }
  const active=[];
  for(const [id,reservation]of Object.entries(state.reservations)){
    assert(hex64(id)&&reservation.id===id&&/^github:[1-9][0-9]*$/.test(reservation.owner??'')&&hex40(reservation.sourceSha)&&timestamp(reservation.createdAt)&&['reserved','building','source-finished','held','needs-reconciliation'].includes(reservation.status)&&reservation.dispatchIntent===true,'Malformed source reservation');
    assert(Array.isArray(reservation.selections)&&reservation.selections.length>=1&&reservation.selections.length<=SOURCE_COHORT_MAX&&new Set(reservation.selections.map(item=>item.dealerId)).size===reservation.selections.length&&new Set(reservation.selections.map(item=>item.slug)).size===reservation.selections.length,'One exact source cohort requires1..14 unique targets');
    for(const selected of reservation.selections){const target=state.targets[selected.dealerId];assert(target&&target.slug===selected.slug&&slug(selected.slug)&&hex64(selected.packDigest)&&hex64(selected.buildFingerprint)&&target.materials.some(item=>item.reservationId===id&&materialMatches(item,selected)),'Reservation selection/material binding differs');}
    if(reservation.run)assertRun(reservation.run,reservation);
    if(['reserved','building','needs-reconciliation'].includes(reservation.status))active.push(id);
    if(reservation.status==='reserved')assert(reservation.run===null,'An undispatched intent cannot claim a bound run');
    if(reservation.status==='building')assert(reservation.run&&reservation.run.status!=='completed','Building reservation requires a live exact run');
    if(['source-finished','held'].includes(reservation.status))assert(reservation.run?.status==='completed'&&timestamp(reservation.finishedAt),'Finished source reservation requires a positive terminal run');
    if(['source-finished','held'].includes(reservation.status))assert((reservation.status==='source-finished')===(reservation.run.conclusion==='success'),'Source terminal state must match its actual run conclusion');
  }
  assert(active.length<=1&&(active.length?state.activeReservationId===active[0]:state.activeReservationId===null),'Only one active/uncertain source cohort is permitted');
  assert(state.externalRuns&&typeof state.externalRuns==='object'&&!Array.isArray(state.externalRuns)&&Object.keys(state.externalRuns).length<=100,'At most100 durable external native run barriers are permitted');
  for(const [id,run]of Object.entries(state.externalRuns)){
    assert(Number.isSafeInteger(run.runId)&&run.runId>0&&String(run.runId)===id&&hex40(run.sourceSha)&&timestamp(run.observedAt)&&typeof run.terminalIntakeComplete==='boolean'&&(run.terminalIntakeComplete?timestamp(run.completedAt):run.completedAt===null),'Exact external source run/intake barrier required');
    if(run.terminalIntakeComplete){assertExternalTerminalRun(run.terminalRun,run);assert(Array.isArray(run.failedMaterialProofs)&&run.failedMaterialProofs.length<=100&&new Set(run.failedMaterialProofs.map(row=>row.slug)).size===run.failedMaterialProofs.length&&Array.isArray(run.failureSlugs)&&isDeepStrictEqual(run.failureSlugs,[...new Set(run.failedMaterialProofs.map(row=>row.slug))].sort()),'Terminal intake failure/material coverage differs');for(const proof of run.failedMaterialProofs){assertFailedMaterial(proof,run);const target=state.targets[proof.dealerId];assert(target?.slug===proof.slug&&hasAttemptedSourceMaterial(state,proof),'Every failed legacy member must retain its exact material attempt');}}
  }
  if(state.ownedIntakes!==undefined){assert(state.ownedIntakes&&typeof state.ownedIntakes==='object'&&!Array.isArray(state.ownedIntakes),'Owned source intake ledger must be a record');for(const [id,receipt]of Object.entries(state.ownedIntakes))assertOwnedIntake(state,id,receipt);}
  assert(Buffer.byteLength(JSON.stringify(state))<=SOURCE_CAMPAIGN_MAX_BYTES,'Source campaign exceeds its1MiB bound');
  return state;
}

export function registerSourceCampaign(state,options){
  if(state===null)return createSourceCampaign(options);
  validateSourceCampaign(state,{assignment:options.assignment});validatePackQueue(options.queue);assert(isDeepStrictEqual(state.baseline,baselineOf(options.queue))&&hex40(options.sourceSha),'Registered campaign baseline/source differs');
  return clone(state); // initialSourceSha is historical, not the latest scheduler commit.
}

export function hasAttemptedSourceMaterial(state,{dealerId,packDigest,buildFingerprint}){
  return Boolean(state.targets[dealerId]?.materials.some(item=>materialMatches(item,{packDigest,buildFingerprint})));
}

export function reserveSourceCohort(state,{id,owner,sourceSha,selections,now=new Date().toISOString()}={}){
  validateSourceCampaign(state);assert(!state.activeReservationId,'An active or uncertain source reservation is already retained');
  assert(Object.values(state.externalRuns).every(run=>run.terminalIntakeComplete),'An observed external native run still awaits exact terminal intake');
  assert(hex64(id)&&!state.reservations[id]&&/^github:[1-9][0-9]*$/.test(owner??'')&&hex40(sourceSha)&&timestamp(now),'A fresh source dispatch intent/nonce and owner are required');
  assert(Array.isArray(selections)&&selections.length>=1&&selections.length<=SOURCE_COHORT_MAX&&new Set(selections.map(row=>row.dealerId)).size===selections.length&&new Set(selections.map(row=>row.slug)).size===selections.length,'Reserve1..14 distinct source targets');
  const next=clone(state),selected=selections.map(row=>({dealerId:row.dealerId,slug:row.slug,packDigest:row.packDigest,buildFingerprint:row.buildFingerprint}));
  for(const row of selected){const target=next.targets[row.dealerId];assert(target&&slug(row.slug)&&hex64(row.packDigest)&&hex64(row.buildFingerprint)&&(!target.slug||target.slug===row.slug),'Source target must match an assigned existing canonical pack');assert(!retained(target),'An existing qualified queue identity remains held/retained');assert(!hasAttemptedSourceMaterial(state,row),'This exact pack/build fingerprint already has a retained source attempt');assert(!Object.values(next.targets).some(other=>other.dealerId!==row.dealerId&&other.slug===row.slug),'Another assigned target owns this slug');target.slug=row.slug;target.status='reserved';target.reason='One-shot native dispatch intent persisted before POST';target.materials.push({packDigest:row.packDigest,buildFingerprint:row.buildFingerprint,reservationId:id,sourceSha});}
  next.reservations[id]={id,owner,sourceSha,selections:selected,createdAt:now,status:'reserved',dispatchIntent:true,run:null};next.activeReservationId=id;
  return validateSourceCampaign(next);
}

export function bindSourceCohortRun(state,{reservationId,run,now=new Date().toISOString()}={}){
  validateSourceCampaign(state);assert(timestamp(now),'Binding observation date required');const next=clone(state),reservation=activeReservation(next,reservationId);assertRun(run,reservation);
  assert(!Object.values(next.reservations).some(other=>other.id!==reservationId&&other.run?.id===run.id),'Another source reservation already owns this run');
  assert(run.status!=='completed','Bind live runs; finish positively completed runs through finishSourceCohort');
  reservation.run=runProof(run);reservation.status='building';reservation.boundAt??=now;reservation.observedAt=now;
  for(const selected of reservation.selections){const target=next.targets[selected.dealerId];if(!retained(target)){target.status='building';target.reason='Exact original nonce/source native run is building';}}
  return validateSourceCampaign(next);
}

export function finishSourceCohort(state,{reservationId,run,now=new Date().toISOString()}={}){
  validateSourceCampaign(state);assert(timestamp(now),'Completion observation date required');const next=clone(state),reservation=activeReservation(next,reservationId);assertRun(run,reservation);assert(run.status==='completed','Only a positively completed exact native run may finish source work');
  assert(!Object.values(next.reservations).some(other=>other.id!==reservationId&&other.run?.id===run.id),'Another source reservation already owns this run');
  reservation.run=runProof(run);reservation.status=run.conclusion==='success'?'source-finished':'held';reservation.finishedAt=now;next.activeReservationId=null;
  for(const selected of reservation.selections){const target=next.targets[selected.dealerId];if(!retained(target)){target.status=reservation.status;target.reason=run.conclusion==='success'?'Native source run finished; authenticated artifact intake remains mandatory':'Native source run ended '+run.conclusion+'; exact material stays held';}}
  return validateSourceCampaign(next);
}

/** Additive acknowledgement: terminal reservation history stays unchanged, and
 * failed members never require repeated reads of eventually expired artifacts. */
export function completeSourceOwnedRunIntake(state,{reservationId,run,intake,now=new Date().toISOString()}={}){
  validateSourceCampaign(state);const next=clone(state),reservation=next.reservations[reservationId];
  assert(reservation&&timestamp(now),'Exact retained owned reservation and completion date required');assertRun(run,reservation);
  assert(run.status==='completed'&&['success','failure'].includes(run.conclusion)&&intake?.completed===true&&intake.runId===run.id&&intake.sourceCommit===reservation.sourceSha,'Owned terminal intake must positively match the original completed run/source');
  assert(Array.isArray(intake.requests)&&Array.isArray(intake.pending)&&intake.pending.length===0&&Array.isArray(intake.failures)&&Array.isArray(intake.failedMaterials),'Owned intake must finish every source member without pending or global ambiguity');
  const failureSlugs=intake.failures.map(row=>{assert(slug(row?.slug),'Global or unbound owned intake failures remain held');return row.slug;});
  assert(new Set(failureSlugs).size===failureSlugs.length&&new Set(intake.failedMaterials.map(row=>row.slug)).size===intake.failedMaterials.length&&isDeepStrictEqual([...failureSlugs].sort(),intake.failedMaterials.map(row=>row.slug).sort()),'Every owned intake failure needs one exact material proof');
  const failed=new Set(failureSlugs),retained=reservation.selections.filter(row=>!failed.has(row.slug)).map(row=>({dealerId:row.dealerId,slug:row.slug,requestIds:[...next.targets[row.dealerId].retainedRequestIds].sort()}));
  const receipt={reservationId,runId:run.id,sourceSha:reservation.sourceSha,completedAt:next.ownedIntakes?.[reservationId]?.completedAt??now,terminalRun:runProof(run),contracts:{runId:intake.contracts?.runId,sourceCommit:intake.contracts?.sourceCommit,conclusion:intake.contracts?.conclusion},retained,
    failedMaterialProofs:intake.failedMaterials.map(row=>({dealerId:row.dealerId,slug:row.slug,packDigest:row.packDigest,buildFingerprint:row.buildFingerprint,sourceSha:row.sourceSha,packTree:row.packTree,scriptsTree:row.scriptsTree,lockBlob:row.lockBlob,nativeWorkflowBlob:row.nativeWorkflowBlob,reason:row.reason})).sort((a,b)=>a.slug.localeCompare(b.slug,'en'))};
  assertOwnedIntake(next,reservationId,receipt);next.ownedIntakes??={};
  if(next.ownedIntakes[reservationId])assert(isDeepStrictEqual(next.ownedIntakes[reservationId],receipt),'Completed owned intake proof cannot be replaced');else next.ownedIntakes[reservationId]=receipt;
  return validateSourceCampaign(next);
}

export function holdSourceCohort(state,{reservationId,reason,now=new Date().toISOString()}={}){
  validateSourceCampaign(state);assert(typeof reason==='string'&&reason.trim().length>0&&reason.length<=2000&&timestamp(now),'Concrete bounded reconciliation reason/date required');const next=clone(state),reservation=activeReservation(next,reservationId);reservation.status='needs-reconciliation';reservation.reason=reason;reservation.observedAt=now;
  for(const selected of reservation.selections){const target=next.targets[selected.dealerId];if(!retained(target)){target.status='needs-reconciliation';target.reason=reason;}}
  return validateSourceCampaign(next);
}

export function syncSourceCampaignTargets(state,{queue,observations=[],now=new Date().toISOString()}={}){
  validateSourceCampaign(state);validatePackQueue(queue);assert(isDeepStrictEqual(state.baseline,baselineOf(queue))&&timestamp(now),'Qualified queue bootstrap binding changed');assert(Array.isArray(observations)&&observations.length<=400,'Bounded factual source observations required');
  const next=clone(state);
  for(const row of Object.values(queue.requests)){
    const target=next.targets[row.request.dealerId];if(!target)continue;
    assert(target.batch===row.request.batch&&(!target.slug||target.slug===row.request.slug),'Qualified request conflicts with the assigned target identity');target.slug=row.request.slug;
    if(!target.retainedRequestIds.includes(row.request.id)){target.retainedRequestIds.push(row.request.id);target.retainedRequests.push({id:row.request.id,slug:row.request.slug,status:row.status});}else target.retainedRequests.find(item=>item.id===row.request.id).status=row.status;
    const held=target.retainedRequests.some(item=>['failed','needs-reconciliation','rolled-back'].includes(item.status));target.status=held?'held':'retained';target.reason=held?'Existing qualified queue identity requires its guarded manual recovery; no source redispatch':'Existing qualified queue identity retained; provider outcome belongs only to queue.json';
  }
  const seen=new Set();for(const observation of observations){const target=next.targets[observation?.dealerId];assert(target&&!seen.has(target.dealerId)&&typeof observation.reason==='string'&&observation.reason.length>0&&observation.reason.length<=2000,'Exact unique source observation with concrete reason required');seen.add(target.dealerId);if(observation.slug!==undefined){assert(slug(observation.slug)&&(!target.slug||target.slug===observation.slug)&&!Object.values(next.targets).some(other=>other.dealerId!==target.dealerId&&other.slug===observation.slug),'Observed existing pack slug conflicts');target.slug=observation.slug;}if(!retained(target)&&!['reserved','building','needs-reconciliation'].includes(target.status)&&target.materials.length===0){target.status='waiting-inputs';target.reason=observation.reason;}}
  return validateSourceCampaign(next);
}

/** Observing a legacy producer creates a durable barrier before its terminal event gap. */
export function observeSourceExternalRuns(state,{runs,now=new Date().toISOString()}={}){
  validateSourceCampaign(state);assert(Array.isArray(runs)&&runs.length<=100&&timestamp(now),'Bounded external source observations/date required');const next=clone(state),seen=new Set();
  for(const run of runs){assert(Number.isSafeInteger(run?.runId)&&run.runId>0&&hex40(run.sourceSha)&&!seen.has(run.runId),'Exact distinct external native run/source required');seen.add(run.runId);assert(!Object.values(next.reservations).some(reservation=>reservation.run?.id===run.runId),'A campaign native run cannot become an external legacy producer');const prior=next.externalRuns[String(run.runId)];if(prior)assert(prior.sourceSha===run.sourceSha,'Observed external run source changed');else next.externalRuns[String(run.runId)]={runId:run.runId,sourceSha:run.sourceSha,observedAt:now,terminalIntakeComplete:false,completedAt:null};}
  return validateSourceCampaign(next);
}

export function completeSourceExternalRunIntake(state,{runId,sourceSha,intake,now=new Date().toISOString()}={}){
  validateSourceCampaign(state);const next=clone(state),run=next.externalRuns[String(runId)];assert(run&&run.runId===runId&&run.sourceSha===sourceSha&&intake?.runId===runId&&intake.sourceCommit===sourceSha&&intake.completed===true&&timestamp(now),'Exact positively completed authenticated terminal intake required');
  assertExternalTerminalRun(intake.run,run);assert(Array.isArray(intake.failures)&&intake.failures.length<=400&&Array.isArray(intake.failedMaterials)&&intake.failedMaterials.length<=100,'Explicit terminal failure and pinned material coverage required');
  const failureSlugs=[...new Set(intake.failures.map(failure=>{assert(slug(failure?.slug),'An unbound/global terminal failure keeps its external intake barrier held');return failure.slug;}))].sort(),proofs=intake.failedMaterials.map(proof=>{assertFailedMaterial(proof,run);const target=next.targets[proof.dealerId];assert(target&&(!target.slug||target.slug===proof.slug),'Failed native member must match an exact400 assigned identity');return {dealerId:proof.dealerId,slug:proof.slug,packDigest:proof.packDigest,buildFingerprint:proof.buildFingerprint,sourceSha:proof.sourceSha,packTree:proof.packTree,scriptsTree:proof.scriptsTree,lockBlob:proof.lockBlob,nativeWorkflowBlob:proof.nativeWorkflowBlob,reason:proof.reason};}).sort((a,b)=>a.slug.localeCompare(b.slug,'en'));
  assert(new Set(proofs.map(proof=>proof.slug)).size===proofs.length&&isDeepStrictEqual(failureSlugs,proofs.map(proof=>proof.slug)),'Every terminal failure needs one exact pinned failed material proof');
  const terminalRun=runProof(intake.run);if(run.terminalIntakeComplete){assert(isDeepStrictEqual(run.failedMaterialProofs,proofs)&&isDeepStrictEqual(run.terminalRun,terminalRun),'Completed terminal intake proof cannot be replaced');return next;}
  run.failedMaterialProofs=proofs;run.failureSlugs=failureSlugs;run.terminalRun=terminalRun;
  for(const proof of proofs){const target=next.targets[proof.dealerId];target.slug=proof.slug;if(!hasAttemptedSourceMaterial(next,proof))target.materials.push({...proof,externalRunId:runId});if(!retained(target)&&!['reserved','building','needs-reconciliation'].includes(target.status)){target.status='held';target.reason='Exact legacy native material held; original failure reason retained with its external run proof';}}
  run.terminalIntakeComplete=true;run.completedAt=now;return validateSourceCampaign(next);
}

function immutable(previous,next){
  for(const key of ['repository','branch','path','assignment','assignmentDigest','baseline','sourceEnvelope','createdAt','order'])assert(isDeepStrictEqual(previous[key],next[key]),'Ordinary source campaign mutation cannot change '+key);
  for(const id of previous.order){const a=previous.targets[id],b=next.targets[id];assert(a.dealerId===b.dealerId&&a.batch===b.batch&&a.position===b.position&&(!a.slug||a.slug===b.slug),'Assigned target identity cannot change');assert(a.materials.every(item=>b.materials.some(value=>isDeepStrictEqual(item,value)))&&a.retainedRequestIds.every(value=>b.retainedRequestIds.includes(value)),'Source attempt/retained identity history cannot be removed');}
  for(const [id,a]of Object.entries(previous.reservations)){const b=next.reservations[id];assert(b&&a.id===b.id&&a.owner===b.owner&&a.sourceSha===b.sourceSha&&a.createdAt===b.createdAt&&isDeepStrictEqual(a.selections,b.selections)&&a.dispatchIntent===b.dispatchIntent&&(!a.run||a.run.id===b.run?.id),'Source reservation/POST intent cannot be rewritten or removed');if(['source-finished','held'].includes(a.status))assert(isDeepStrictEqual(a,b),'Terminal source attempts cannot reopen');}
  for(const [id,a]of Object.entries(previous.externalRuns)){const b=next.externalRuns[id];assert(b&&a.runId===b.runId&&a.sourceSha===b.sourceSha&&a.observedAt===b.observedAt&&(!a.terminalIntakeComplete||isDeepStrictEqual(a,b)),'External native/intake barriers cannot be removed, rebound or reopened');}
  for(const [id,receipt]of Object.entries(previous.ownedIntakes??{}))assert(isDeepStrictEqual(receipt,next.ownedIntakes?.[id]),'Completed owned source intake receipts cannot be removed or rewritten');
}

export async function mutateSourceCampaign(store,mutator,{now=()=>new Date().toISOString(),attempts=20}={}){
  assert(store&&typeof store.read==='function'&&typeof store.compareAndSwap==='function'&&typeof mutator==='function'&&Number.isSafeInteger(attempts)&&attempts>=1&&attempts<=20,'Bounded source campaign CAS store/mutator required');
  for(let attempt=0;attempt<attempts;attempt++){
    const snapshot=await store.read(),previous=snapshot.state;if(previous!==null)validateSourceCampaign(previous);
    const result=await mutator(previous===null?null:clone(previous)),wrapped=result&&Object.hasOwn(result,'state')&&Object.hasOwn(result,'value'),proposed=wrapped?result.state:result,value=wrapped?result.value:undefined;
    validateSourceCampaign(proposed);if(value?.reserved===true){const reservation=proposed.reservations[proposed.activeReservationId];assert(reservation?.status==='reserved'&&reservation.dispatchIntent===true&&!previous?.reservations[reservation.id],'Only a fresh reservation committed byCAS may authorize dispatch');}if(previous!==null){immutable(previous,proposed);assert(proposed.generation===previous.generation,'Pure source transitions must not increment generation');if(isDeepStrictEqual(previous,proposed))return {state:previous,revision:snapshot.revision,value};}else assert(proposed.generation===0,'Initial source campaign generation must be zero');
    const next=clone(proposed);if(previous!==null)next.generation=previous.generation+1;next.updatedAt=at(now);validateSourceCampaign(next);
    const revision=await store.compareAndSwap(snapshot.revision,next);if(revision)return {state:next,revision:typeof revision==='string'?revision:null,value};
  }
  throw Error('Source campaign CAS contention; retained reservations require reconciliation before dispatch');
}

/** Git Data API CAS writes exactly one path using the read commit as sole parent. */
export function gitSourceCampaignStore({request}={}){
  assert(typeof request==='function','Authenticated same-repository GitHub request transport required');const trees=new Map();
  const ref=async()=>{const reply=await request({method:'GET',path:api+'/git/ref/heads/'+PACK_QUEUE_BRANCH});assert(reply.status===200&&reply.body?.ref==='refs/heads/'+PACK_QUEUE_BRANCH&&reply.body.object?.type==='commit'&&hex40(reply.body.object.sha),'Authenticated exact source campaign branch reference unavailable');return reply.body.object.sha;};
  const treeFor=async revision=>{if(trees.has(revision))return trees.get(revision);const commit=await request({method:'GET',path:api+'/git/commits/'+revision});assert(commit.status===200&&commit.body?.sha===revision&&hex40(commit.body.tree?.sha),'Exact source campaign parent commit/tree unavailable');trees.set(revision,commit.body.tree.sha);return commit.body.tree.sha;};
  return {
    async read(){
      const revision=await ref(),baseTree=await treeFor(revision),reply=await request({method:'GET',path:api+'/git/trees/'+baseTree});assert(reply.status===200&&reply.body?.sha===baseTree&&reply.body.truncated===false&&Array.isArray(reply.body.tree),'Complete exact source campaign root tree required');
      const entries=reply.body.tree;assert(entries.some(row=>row.path===PACK_QUEUE_PATH&&row.mode==='100644'&&row.type==='blob'&&hex40(row.sha)),'Existing qualified queue branch must be preserved');const matches=entries.filter(row=>row.path===SOURCE_CAMPAIGN_PATH);assert(matches.length<=1,'Duplicate campaign tree member');if(!matches.length)return {state:null,revision};
      const entry=matches[0];assert(entry.mode==='100644'&&entry.type==='blob'&&hex40(entry.sha)&&Number.isSafeInteger(entry.size)&&entry.size>0&&entry.size<=SOURCE_CAMPAIGN_MAX_BYTES,'Bounded regular source campaign blob required');const blob=await request({method:'GET',path:api+'/git/blobs/'+entry.sha});assert(blob.status===200&&blob.body?.sha===entry.sha&&blob.body.encoding==='base64'&&blob.body.size===entry.size&&typeof blob.body.content==='string','Exact campaign Git blob unavailable');const bytes=Buffer.from(blob.body.content.replace(/\s/g,''),'base64');assert(bytes.length===entry.size&&gitBlob(bytes)===entry.sha,'Campaign Git blob byte identity differs');const state=JSON.parse(bytes.toString('utf8'));validateSourceCampaign(state);return {state,revision};
    },
    async compareAndSwap(revision,next){
      assert(hex40(revision),'Campaign CAS requires the exact read branch commit');validateSourceCampaign(next);const bytes=Buffer.from(JSON.stringify(next)+'\n');assert(bytes.length<=SOURCE_CAMPAIGN_MAX_BYTES,'Campaign serialized bytes exceed1MiB');const baseTree=await treeFor(revision);
      const blob=await request({method:'POST',path:api+'/git/blobs',body:{content:bytes.toString('base64'),encoding:'base64'}});assert(blob.status===201&&blob.body?.sha===gitBlob(bytes),'Campaign blob write was not authenticated');
      const tree=await request({method:'POST',path:api+'/git/trees',body:{base_tree:baseTree,tree:[{path:SOURCE_CAMPAIGN_PATH,mode:'100644',type:'blob',sha:blob.body.sha}]}});assert(tree.status===201&&hex40(tree.body?.sha),'Campaign tree write failed');
      const commit=await request({method:'POST',path:api+'/git/commits',body:{message:'source-campaign: generation '+next.generation,tree:tree.body.sha,parents:[revision]}});assert(commit.status===201&&hex40(commit.body?.sha)&&commit.body.tree?.sha===tree.body.sha&&Array.isArray(commit.body.parents)&&commit.body.parents.length===1&&commit.body.parents[0].sha===revision,'Campaign CAS commit must retain its sole exact parent');
      const reply=await request({method:'PATCH',path:api+'/git/refs/heads/'+PACK_QUEUE_BRANCH,body:{sha:commit.body.sha,force:false}});
      if(reply.status===200){assert(reply.body?.ref==='refs/heads/'+PACK_QUEUE_BRANCH&&reply.body.object?.type==='commit'&&reply.body.object.sha===commit.body.sha,'Campaign ref write outcome unknown; reconcile before any dispatch');trees.set(commit.body.sha,tree.body.sha);return commit.body.sha;}
      if([409,422].includes(reply.status)&&await ref()!==revision)return false;
      throw Error('Campaign ref write outcome unknown or refused; reconcile before any dispatch');
    },
  };
}
