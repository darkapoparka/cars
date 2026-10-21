/** Deterministic pack-only deployment guards, shared by token and connector transports. */
import {randomUUID} from 'node:crypto';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,queueCanonical,queueDigest,packDeploymentRequest,validatePackQueue,readPackClaim,recordPackEvent,finishPackDeployment,validatePackOwnedCreateResume} from './dealer-pack-queue.mjs';
import {expectedPackHosting,packRegistryCollisions} from './dealer-pack-identity.mjs';
import {PACK_RUNTIME_LIMITS,packRuntimeLimits} from './dealer-pack-cloudflare.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
const uuid=value=>/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value??'');
const timestamp=value=>Number.isFinite(Date.parse(value));
export const PACK_SNAPSHOT_MAX_AGE_MS=30000;

/** Match nested historical hosting identities, including delivery/source-map fields. */
export function registryPackCollisions(registry,request) {
  const expected=expectedPackHosting(request.slug);
  assert(request.workerName===expected.workerName&&request.publicOrigin===expected.publicOrigin,'Deployment request hosting identity differs');
  return packRegistryCollisions({slug:request.slug,dealerId:request.dealerId},registry??[]);
}

export function packOwnershipTags(queue,request) {
  return ['cars-pack-v1','cars-queue-'+queue.queueId,'cars-lead-'+queueDigest(request.dealerId).slice(0,32),'cars-request-'+request.id];
}

export function latestOwnedPackReceipt(queue,request) {
  const history=queue.receipts[request.slug]??[];
  const envelope=[...history].reverse().find(row=>row.receipt.status==='deployed'||row.receipt.status==='rolled-back');
  if(!envelope)return null;
  const value=envelope.receipt;
  assert(envelope.sha256===queueDigest(value)&&value.queueId===queue.queueId&&value.accountId===queue.accountId&&value.zoneId===queue.zoneId&&value.slug===request.slug&&value.dealerId===request.dealerId&&value.workerName===request.workerName&&value.publicOrigin===request.publicOrigin,'Prior deployment receipt does not establish this pack ownership');
  assert(/^[a-f0-9]{32}$/.test(value.workerId??'')&&uuid(value.versionId)&&typeof value.routeId==='string'&&value.routeId.length>0&&value.ownershipTags?.includes('cars-queue-'+queue.queueId)&&value.ownershipTags?.includes('cars-lead-'+queueDigest(request.dealerId).slice(0,32)),'Prior receipt has no exact owned Worker ID/version/route/tag binding');
  return envelope;
}

export function validatePackDeploymentIdentity({request,queue,registry}) {
  assert(packDeploymentRequest(request).id===request.id,'Deployment request was modified after enqueue');validatePackQueue(queue);
  assert(!queue.baseline.workerNames.includes(request.workerName),'Protected live fleet Worker cannot be touched by this path');
  const own=latestOwnedPackReceipt(queue,request),collisions=registryPackCollisions(registry,request);
  // Receipt integration may add this same pack to the registry; all other
  // collisions, including a historical alternate hostingIdentity, remain fatal.
  assert(collisions.every(row=>own&&row.slug===request.slug),'Pack identity collides with an existing registry workerName, publicOrigin, hostingIdentity or dealer');
  assert(!queue.baseline.routes.some(route=>route.pattern===new URL(request.publicOrigin).hostname+'/*'||route.script===request.workerName),'Protected baseline route cannot be changed');
  return {own,mode:own?'update-owned':'create-new'};
}

/** A challenge binds each observation to this call; the adapter issues fresh GETs. */
export function validatePackProviderSnapshot(snapshot,{challenge,request,queue,now=Date.now(),maximumAgeMs=PACK_SNAPSHOT_MAX_AGE_MS}={}) {
  assert(snapshot?.kind==='cars-live-pack-provider-snapshot'&&snapshot.evidence==='authenticated-cloudflare-api'&&snapshot.accountId===PACK_DEPLOY_ACCOUNT&&snapshot.zoneId===PACK_DEPLOY_ZONE&&snapshot.requestId===challenge.requestId&&snapshot.stage===challenge.stage,'Fresh stage-specific authenticated provider inventory required');
  assert(timestamp(snapshot.startedAt)&&timestamp(snapshot.observedAt)&&Date.parse(snapshot.startedAt)>=Date.parse(challenge.notBefore)&&Date.parse(snapshot.observedAt)>=Date.parse(snapshot.startedAt)&&Date.parse(snapshot.observedAt)<=now&&now-Date.parse(snapshot.observedAt)<=maximumAgeMs,'Cached or stale provider snapshot is refused');
  assert(snapshot.complete===true&&Array.isArray(snapshot.scripts)&&Array.isArray(snapshot.routes)&&Array.isArray(snapshot.domains)&&snapshot.scriptCount===snapshot.scripts.length&&snapshot.scripts.length<=10000,'Complete live script, route and domain inventories required');
  const names=snapshot.scripts.map(row=>row.name);assert(names.every(name=>typeof name==='string'&&name.length>0)&&new Set(names).size===names.length,'Duplicate or invalid live Worker names');
  assert(queue.baseline.workerNames.every(name=>names.includes(name)),'A protected baseline Worker disappeared; stop and reconcile account drift');
  const target=snapshot.scripts.find(row=>row.name===request.workerName);
  assert(snapshot.target?.exists===Boolean(target),'Target snapshot and complete script inventory disagree');
  if(target){
    assert(snapshot.target.workerName===request.workerName&&snapshot.target.workerId===target.id&&/^[a-f0-9]{32}$/.test(target.id??'')&&Array.isArray(snapshot.target.tags)&&Array.isArray(snapshot.target.bindings),'Existing target requires an immutable Worker ID and actual bindings/tags');
    assert(snapshot.target.undeployed===true&&snapshot.target.versionId===null&&snapshot.target.versionTraffic?.length===0||uuid(snapshot.target.versionId)&&snapshot.target.versionTraffic?.length===1&&snapshot.target.versionTraffic[0].version_id===snapshot.target.versionId&&snapshot.target.versionTraffic[0].percentage===100,'Existing target requires an exact active version with 100% traffic or an authenticated never-deployed record');
  }
  const pattern=new URL(request.publicOrigin).hostname+'/*';
  const collision=snapshot.routes.filter(route=>route.pattern===pattern||route.script===request.workerName);
  assert(collision.every(route=>route.pattern===pattern&&route.script===request.workerName)&&collision.length<=1,'Canonical preview route belongs to another Worker or this Worker has extra routes');
  assert(!snapshot.domains.some(domain=>domain.hostname===new URL(request.publicOrigin).hostname||domain.service===request.workerName),'Pack target has an unexpected Worker Custom Domain');
  return {snapshot,target,route:collision[0]??null,available:queue.policy.allowedScripts-snapshot.scriptCount-queue.policy.minimumSpareScripts};
}

export function validatePackTargetForWrite(context,{request,queue,own,expectedVersionId,creating=false}={}) {
  const {snapshot,target,route}=context;
  if(creating){
    assert(!own&&!target&&!route,'Create-only target is already occupied; an absent local receipt never authorizes replacement');
    assert(snapshot.scriptCount+1+queue.policy.minimumSpareScripts<=queue.policy.allowedScripts,'Live Worker count leaves no authorized capacity for this create');
    return;
  }
  assert(own&&target,'An existing Worker requires its own durable queue receipt');
  const receipt=own.receipt;
  assert(snapshot.target.workerId===receipt.workerId,'Immutable owned Worker ID changed');
  assert(snapshot.target.versionId===(expectedVersionId??receipt.versionId),'Owned Worker advanced outside its recorded deployment; refusing overwrite');
  assert(receipt.ownershipTags.every(tag=>snapshot.target.tags.includes(tag)),'Live Worker tags do not match the exact prior deployment receipt');
  assert(route&&route.id===receipt.routeId&&route.script===request.workerName,'Owned route differs from its durable receipt');
  assert(snapshot.target.bindings.length===1&&snapshot.target.bindings[0].type==='assets'&&snapshot.target.bindings[0].name==='ASSETS','Owned Worker acquired unexpected bindings');
}

export function validateHostedPackResult(result,request,versionId) {
  assert(result?.type==='cars-dealer-pack-hosted-qa'&&result.slug===request.slug&&result.publicOrigin===request.publicOrigin&&result.outputDigest===request.outputDigest&&result.packDigest===request.packDigest&&result.success===true&&result.width===390,'Hosted QA must pass on this exact pack/output at 390px');
  const required=['auto-best','modern','import','app','mobile','karento-best'];
  assert(Array.isArray(result.designs)&&result.designs.length===6&&required.every(key=>result.designs.filter(row=>row.key===key).length===1)&&result.designs.every(row=>row.status==='passed'&&row.httpStatus===200&&row.sixChoices===true&&row.nameVisible===true&&row.logoVisible===true&&['passed','not-provided'].includes(row.phoneStatus)&&row.foreignIdentityCount===0),'All six hosted designs, business identity, FAB and leak checks are required');
  assert(result.designs.every(row=>row.headStatus==='passed'&&row.headHttpStatus===200),'All six hosted designs require passing HEAD checks with HTTP 200');
  if(versionId)assert(result.versionId===versionId,'Hosted verification does not identify the deployed version');
  assert(result.providerWrites===0&&timestamp(result.finishedAt),'Hosted verification must be read-only and dated');
  return result;
}

/** Keep queue state bounded as hundreds of reports accumulate. The outer
 * sha256 identifies the unchanged full per-dealer report artifact; report is
 * explicitly a compact acceptance summary with its own independent digest.
 */
export function packHostedReceiptEvidence(result) {
  const keys=['type','slug','publicOrigin','packDigest','outputDigest','versionId','width','language','success','providerWrites','finishedAt'];
  const report=Object.fromEntries(keys.filter(key=>result[key]!==undefined).map(key=>[key,result[key]]));
  const fields=['key','status','httpStatus','headStatus','headHttpStatus','sixChoices','nameVisible','logoVisible','phoneStatus','foreignIdentityCount','fabInteraction'];
  report.designs=result.designs.map(row=>Object.fromEntries(fields.filter(key=>row[key]!==undefined).map(key=>[key,row[key]])));
  if(result.identityCoverage){
    const coverage=result.identityCoverage,countKeys=['registryDealers','totalIdentities','packDealers','withName','withBusinessFacts','withPublicIdentityEvidence','withPhone'];
    report.identityCoverage={...Object.fromEntries(countKeys.filter(key=>Number.isSafeInteger(coverage[key])&&coverage[key]>=0).map(key=>[key,coverage[key]])),
      missingBusinessFactsCount:coverage.missingBusinessFacts?.length??0,missingPublicPhoneCount:coverage.missingPublicPhone?.length??0,packFactsDiagnosticCount:coverage.packFactsDiagnostics?.length??0,
      sha256:queueDigest(coverage)};
  }
  return {sha256:queueDigest(result),reportScope:'compact-acceptance-summary',summarySha256:queueDigest(report),report};
}

function assertExactPackCandidate(candidate,request) {
  assert(candidate?.verified===true&&candidate.slug===request.slug&&candidate.packDigest===request.packDigest&&candidate.outputDigest===request.outputDigest&&candidate.releaseDigest===request.releaseDigest&&candidate.releaseId===request.releaseId&&candidate.sourceCommit===request.sourceCommit,'Candidate changed or was not verified against the queued exact bytes');
  assert(candidate.sourceProof?.verified===true&&candidate.sourceProof.repository===request.sourceRepository&&candidate.sourceProof.commit===request.sourceCommit&&candidate.sourceProof.path===request.sourcePath,'Pack source has no authenticated exact published commit proof');
  assert(candidate.qa?.success===true&&candidate.qa.packDigest===request.packDigest&&candidate.qa.outputDigest===request.outputDigest&&candidate.qa.releaseDigest===request.releaseDigest,'Missing bound local QA');
  assert(candidate.benchmarkOnly!==true&&candidate.manifest?.pack?.benchmarkOnly!==true,'Benchmark-only packs can never be deployed');
}

/** A resume is narrower than an ordinary owned deployment: only the same
 * request's positively acknowledged create can supply the immutable target.
 * Every continuation authenticates the saved observation again before writing.
 */
export function ownedPackCreateResume(queue,request) {
  const row=queue.requests[request.id],envelope=row?.resume;if(!envelope)return null;
  assert(envelope.sha256===queueDigest(envelope.resume)&&row.events.some(event=>event.kind==='reconciled'&&event.proof?.outcome==='owned-create-pending'&&queueDigest(event.proof.resume)===envelope.sha256&&event.ownerStopped?.verified===true),'Resume has no exact durable reconciliation evidence');
  return validatePackOwnedCreateResume(envelope.resume,{queue,request,events:row.events});
}
export function validateResumedPackTargetForWrite(context,{request,resume}={}) {
  const {snapshot,target,route}=context;
  assert(target&&snapshot.target.workerId===resume.workerId&&snapshot.target.workerName===request.workerName,'Resumed Worker immutable identity changed');
  assert(snapshot.target.versionId===resume.versionId&&snapshot.target.undeployed===(resume.versionId===null),'Resumed Worker version changed after reconciliation');
  assert(resume.ownershipTags.every(tag=>snapshot.target.tags.includes(tag)),'Resumed Worker ownership tags changed');
  assert(snapshot.target.subdomain?.enabled===false&&snapshot.target.subdomain?.previews_enabled===false,'Resumed Worker acquired secondary exposure');
  assert(resume.versionId===null?snapshot.target.bindings.length===0:snapshot.target.bindings.length===1&&snapshot.target.bindings[0].name==='ASSETS'&&snapshot.target.bindings[0].type==='assets','Resumed Worker acquired unexpected bindings');
  assert(resume.route===null?!route:route?.id===resume.route.id&&route.pattern===resume.route.pattern&&route.script===resume.route.script,'Resumed canonical route changed');
}

/** No provider mutation can occur unless a durable claim and local candidate
 * proof are present. A transport only executes the bounded operations below.
 */
export async function executeQueuedPackDeployment({store,claim,provider,inspectCandidate,registry,verifyHosted,now=()=>Date.now()}={}) {
  assert(provider&&['snapshot','createWorker','prepareAssets','upload','activateVersion','disableSubdomain','createRoute','rollbackVersion'].every(key=>typeof provider[key]==='function'),'A guarded Cloudflare adapter is required');
  assert(typeof inspectCandidate==='function'&&typeof verifyHosted==='function','Exact candidate and hosted verification callbacks are required');
  const claimed=await readPackClaim(store,claim),queue=claimed.state,request=queue.requests[claim.requestId].request;
  let providerWriteStarted=false,providerOutcomeKnown=true,ownershipEstablished=false,workerCreated=false,versionActivated=false;
  const time=()=>new Date(now()).toISOString();
  const snapshot=async stage=>{
    await readPackClaim(store,claim);
    const challenge={requestId:randomUUID(),stage,notBefore:time()};
    const value=await provider.snapshot({request,challenge});
    return validatePackProviderSnapshot(value,{challenge,request,queue,now:now()});
  };
  const intent=async(kind,details={})=>{await readPackClaim(store,claim);await recordPackEvent(store,claim,{kind:kind+'-intent',...details},{now:time});};
  const writeCall=async operation=>{providerWriteStarted=true;providerOutcomeKnown=false;try{return await operation();}catch(error){if(error.providerOutcomeKnown===true)providerOutcomeKnown=true;throw error;}};
  const observed=async(kind,details={})=>{await recordPackEvent(store,claim,{kind:kind+'-observed',...details},{now:time});providerOutcomeKnown=true;};
  try{
    const {own,mode:initialMode}=validatePackDeploymentIdentity({request,queue,registry}),resume=ownedPackCreateResume(queue,request);
    assert(!resume||!own&&request.action==='deploy','Creation resume cannot bypass an existing deployment receipt or change action');
    const mode=resume?'resume-owned-create':initialMode;
    if(request.action==='redeploy-owned')assert(own,'Explicit redeployment is only allowed for an earlier queue-owned Worker');
    if(request.action==='rollback')return await executeRollback({store,claim,provider,request,queue,own,snapshot,intent,observed,writeCall,time,verifyHosted,inspectCandidate,markActivated:()=>{versionActivated=true;},markEstablished:()=>{ownershipEstablished=true;}});
    const candidate=await inspectCandidate(request);
    assertExactPackCandidate(candidate,request);
    const requestedCpuLimitMs=packRuntimeLimits(candidate.config).cpu_ms,requestedCpuLimitSource=candidate.config?.limits?.cpu_ms===undefined?'documented-paid-default':'sealed-worker-configuration';
    const ownershipTags=own?.receipt.ownershipTags??resume?.ownershipTags??packOwnershipTags(queue,request);
    let before=await snapshot('before-assets');if(resume)validateResumedPackTargetForWrite(before,{request,resume});else validatePackTargetForWrite(before,{request,queue,own,creating:mode==='create-new'});
    let workerId=own?.receipt.workerId??resume?.workerId;if(resume)workerCreated=true;
    if(mode==='create-new'){
      await intent('worker-create',{workerName:request.workerName,ownershipTags});
      before=await snapshot('immediately-before-worker-create');validatePackTargetForWrite(before,{request,queue,own,creating:true});
      // POST is create-only: the provider rejects an occupied name with409.
      // An immutable ID is then used for all version uploads.
      const created=await writeCall(()=>provider.createWorker({request,ownershipTags}));
      assert(created?.name===request.workerName&&/^[a-f0-9]{32}$/.test(created.id??'')&&ownershipTags.every(tag=>created.tags?.includes(tag)),'Create-only API did not return the exact new Worker ID/tags');
      workerId=created.id;workerCreated=true;
      await observed('worker-create',{workerName:request.workerName,workerId,ownershipTags});
      const reserved=await snapshot('after-worker-create');
      assert(reserved.snapshot.target.workerId===workerId&&reserved.snapshot.target.undeployed===true&&reserved.snapshot.scriptCount===before.snapshot.scriptCount+1,'New Worker reservation or live count differs');
    }
    await intent('assets',{workerName:request.workerName,outputDigest:request.outputDigest});
    const assets=await writeCall(()=>provider.prepareAssets({candidate,request,beforeWrite:()=>readPackClaim(store,claim)}));
    await observed('assets',{manifestDigest:assets.manifestDigest,assetFiles:assets.assetFiles,uploadedFiles:assets.uploadedFiles});
    await intent('worker-upload',{workerName:request.workerName,workerId,outputDigest:request.outputDigest,ownershipTags,previousVersionId:own?.receipt.versionId??resume?.versionId??null,deploy:false,requestedCpuLimitMs,requestedCpuLimitSource});
    // This complete inventory is deliberately after potentially slow asset work
    // and after persisting intent, immediately before the version POST.
    const preUpload=await snapshot('immediately-before-worker-upload');
    if(resume)validateResumedPackTargetForWrite(preUpload,{request,resume});
    else if(own)validatePackTargetForWrite(preUpload,{request,queue,own});
    else assert(preUpload.snapshot.target.workerId===workerId&&preUpload.snapshot.target.undeployed===true&&ownershipTags.every(tag=>preUpload.snapshot.target.tags.includes(tag))&&!preUpload.route,'Newly reserved Worker changed before upload');
    const uploaded=await writeCall(()=>provider.upload({candidate,request,workerId,assets,ownershipTags}));
    assert(uuid(uploaded?.versionId)&&uploaded.workerName===request.workerName&&uploaded.workerId===workerId,'Worker upload did not return the exact immutable target and version');
    await observed('worker-upload',{versionId:uploaded.versionId,workerName:request.workerName,workerId,...(Number.isFinite(uploaded.startupTimeMs)?{startupTimeMs:uploaded.startupTimeMs}:{}),
      ...(Number.isFinite(uploaded.cpuLimitMs)?{cpuLimitMs:uploaded.cpuLimitMs}:{}),requestedCpuLimitMs,...(typeof uploaded.cpuLimitSource==='string'?{cpuLimitSource:uploaded.cpuLimitSource}:{})});
    assert(Number.isFinite(uploaded.startupTimeMs)&&uploaded.startupTimeMs>=0&&uploaded.startupTimeMs<=PACK_RUNTIME_LIMITS.startupMs,'Measured Worker startup must be available and within the 1000 ms limit before activation');
    assert(uploaded.requestedCpuLimitMs===requestedCpuLimitMs&&uploaded.cpuLimitMs===requestedCpuLimitMs&&['provider-version-response','successful-explicit-upload-request'].includes(uploaded.cpuLimitSource),'Provider Worker CPU limit differs from its explicit upload request; activation refused');
    await intent('activate-version',{workerId,workerName:request.workerName,versionId:uploaded.versionId});
    await writeCall(()=>provider.activateVersion({request,workerId,versionId:uploaded.versionId}));versionActivated=true;await observed('activate-version',{versionId:uploaded.versionId,workerId});
    const afterUpload=await snapshot('after-worker-upload');
    assert(afterUpload.target&&afterUpload.snapshot.target.versionId===uploaded.versionId&&ownershipTags.every(tag=>afterUpload.snapshot.target.tags.includes(tag)),'Uploaded version/tags could not be authenticated');
    assert(afterUpload.snapshot.scriptCount===before.snapshot.scriptCount+(mode==='create-new'?1:0),'Live Worker count changed unexpectedly during upload');
    await intent('disable-subdomain',{workerName:request.workerName,versionId:uploaded.versionId});
    await writeCall(()=>provider.disableSubdomain({request}));await observed('disable-subdomain',{enabled:false,previewsEnabled:false});
    let route=afterUpload.route;
    if(!route){
      await intent('create-route',{pattern:new URL(request.publicOrigin).hostname+'/*',script:request.workerName,versionId:uploaded.versionId});
      const immediate=await snapshot('immediately-before-route-create');
      assert(!immediate.route&&immediate.snapshot.target.versionId===uploaded.versionId&&ownershipTags.every(tag=>immediate.snapshot.target.tags.includes(tag)),'Route/Worker changed before canonical route creation');
      route=await writeCall(()=>provider.createRoute({request}));assert(route?.pattern===new URL(request.publicOrigin).hostname+'/*'&&route.script===request.workerName&&typeof route.id==='string','Route create returned another identity');
      await observed('create-route',{routeId:route.id,pattern:route.pattern,script:route.script});
    }
    const after=await snapshot('after-deploy');
    assert(after.route?.id===route.id&&after.snapshot.target.versionId===uploaded.versionId&&ownershipTags.every(tag=>after.snapshot.target.tags.includes(tag)),'Post-deploy Worker/route identity changed');
    assert(after.snapshot.target.subdomain?.enabled===false&&after.snapshot.target.subdomain?.previews_enabled===false,'Unexpected workers.dev or preview URL exposure remains');
    assert(after.snapshot.target.bindings.length===1&&after.snapshot.target.bindings[0].name==='ASSETS'&&after.snapshot.target.bindings[0].type==='assets','Deployed Worker is not ASSETS-only');
    const observedCpuLimitMs=after.snapshot.target.limits?.cpu_ms;
    assert(observedCpuLimitMs===undefined||observedCpuLimitMs===requestedCpuLimitMs,'Active Worker CPU limit differs from its explicit upload request');
    const baseReceipt={schemaVersion:1,type:'cars-dealer-pack-deployment',status:'deployed',queueId:queue.queueId,requestId:request.id,accountId:queue.accountId,zoneId:queue.zoneId,
      slug:request.slug,dealerId:request.dealerId,batch:request.batch,workerName:request.workerName,publicOrigin:request.publicOrigin,
      packDigest:request.packDigest,releaseId:request.releaseId,releaseDigest:request.releaseDigest,outputDigest:request.outputDigest,sourceCommit:request.sourceCommit,sourceProof:candidate.sourceProof,
      workerId,versionId:uploaded.versionId,routeId:route.id,ownershipTags,mode,previousReceiptSha256:own?.sha256??null,previousVersionId:own?.receipt.versionId??resume?.versionId??null,
      ...(resume?{resumedCreation:{sha256:queueDigest(resume),workerId:resume.workerId,versionId:resume.versionId,observedAt:resume.observedAt}}:{}),
      counts:{before:before.snapshot.scriptCount,after:after.snapshot.scriptCount,allowed:queue.policy.allowedScripts,minimumSpareScripts:queue.policy.minimumSpareScripts,beforeObservedAt:before.snapshot.observedAt,afterObservedAt:after.snapshot.observedAt},
      capacityEvidence:{basis:'owner-confirmed-workers-paid',policyDigest:queue.policyDigest,subscriptionReadVerified:false},
      resources:{bindings:after.snapshot.target.bindings,subdomain:after.snapshot.target.subdomain,route},
      runtime:{startupTimeMs:uploaded.startupTimeMs,startupLimitMs:PACK_RUNTIME_LIMITS.startupMs,startupWithinLimit:true,cpuLimitMs:uploaded.cpuLimitMs,requestedCpuLimitMs,requestedCpuLimitSource,
        cpuLimitSource:observedCpuLimitMs===undefined?uploaded.cpuLimitSource:'provider-active-version-readback',cpu:'not-measured-by-upload',memory:'not-measured-by-upload'},
      deployedAt:time(),hostedVerified:false,ownerAccepted:false,outreachPerformed:false};
    // Record recoverable complete ownership before browser work starts.
    await recordPackEvent(store,claim,{kind:'deployment-established',receipt:baseReceipt},{now:time});
    ownershipEstablished=true;
    let hosted;try{hosted=validateHostedPackResult(await verifyHosted({request,candidate,receipt:baseReceipt}),request,baseReceipt.versionId);}catch(error){
      const receipt={...baseReceipt,hostedVerified:false,hostedFailure:error.message,finishedAt:time()};
      // Known owned deployment remains recorded. A QA failure does not lose the
      // receipt, rewrite another Worker, or stop independent queued packs.
      await finishPackDeployment(store,claim,{status:'failed',receipt,error:'Hosted verification failed: '+error.message},{now:time});return {status:'failed',requestId:request.id,receipt,error:error.message};
    }
    const receipt={...baseReceipt,hostedVerified:true,hosted:packHostedReceiptEvidence(hosted),finishedAt:time()};
    await finishPackDeployment(store,claim,{status:'deployed',receipt},{now:time});return {status:'deployed',receipt};
  }catch(error){
    const uncertain=providerWriteStarted&&(!(providerOutcomeKnown||error.providerOutcomeKnown===true)||(workerCreated||versionActivated)&&!ownershipEstablished);
    try{await finishPackDeployment(store,claim,{status:uncertain?'needs-reconciliation':'failed',error:error.message,uncertain},{now:time});}catch{}
    return {status:uncertain?'needs-reconciliation':'failed',requestId:request.id,slug:request.slug,error:error.message,claimRetained:uncertain};
  }
}

async function executeRollback({store,claim,provider,request,queue,own,snapshot,intent,observed,writeCall,time,verifyHosted,inspectCandidate,markActivated,markEstablished}) {
  assert(own,'Rollback requires a durable receipt for this newly created pack Worker');
  const target=(queue.receipts[request.slug]??[]).find(row=>row.sha256===request.rollbackTo);
  assert(target&&target.sha256===queueDigest(target.receipt)&&target.receipt.queueId===queue.queueId&&target.receipt.dealerId===request.dealerId&&target.receipt.workerName===request.workerName&&uuid(target.receipt.versionId),'Rollback target is not an earlier owned version');
  assert(target.receipt.hostedVerified===true,'Rollback target must have passed its own hosted checks');
  const targetRequest=queue.requests[target.receipt.requestId]?.request;
  assert(targetRequest&&targetRequest.slug===request.slug&&targetRequest.dealerId===request.dealerId&&targetRequest.outputDigest===target.receipt.outputDigest&&targetRequest.packDigest===target.receipt.packDigest,'Rollback target lost its exact source request');
  // A retained old bundle is required before changing the live version. This
  // lets hosted QA compare the rolled-back logo bytes and identity correctly.
  const candidate=await inspectCandidate(targetRequest);assertExactPackCandidate(candidate,targetRequest);
  const before=await snapshot('before-rollback');validatePackTargetForWrite(before,{request,queue,own});
  await intent('rollback-version',{currentVersionId:own.receipt.versionId,targetVersionId:target.receipt.versionId,routeId:own.receipt.routeId});
  const immediately=await snapshot('immediately-before-rollback');validatePackTargetForWrite(immediately,{request,queue,own});
  await writeCall(()=>provider.rollbackVersion({request,workerId:own.receipt.workerId,versionId:target.receipt.versionId}));markActivated();await observed('rollback-version',{versionId:target.receipt.versionId});
  const after=await snapshot('after-rollback');assert(after.snapshot.target.versionId===target.receipt.versionId&&after.route?.id===own.receipt.routeId&&after.snapshot.scriptCount===before.snapshot.scriptCount,'Rollback did not restore the exact owned version and route');
  const receipt={...target.receipt,status:'rolled-back',requestId:request.id,previousVersionId:own.receipt.versionId,previousReceiptSha256:own.sha256,rollbackReceiptSha256:target.sha256,routeId:own.receipt.routeId,
    counts:{before:before.snapshot.scriptCount,after:after.snapshot.scriptCount,allowed:queue.policy.allowedScripts,minimumSpareScripts:queue.policy.minimumSpareScripts,beforeObservedAt:before.snapshot.observedAt,afterObservedAt:after.snapshot.observedAt},hostedVerified:false,deployedAt:time(),finishedAt:time()};
  delete receipt.hosted;
  await recordPackEvent(store,claim,{kind:'deployment-established',receipt},{now:time});markEstablished();
  let hosted;try{hosted=validateHostedPackResult(await verifyHosted({request:targetRequest,candidate,receipt}),targetRequest,receipt.versionId);}catch(error){
    receipt.hostedFailure=error.message;receipt.finishedAt=time();await finishPackDeployment(store,claim,{status:'failed',receipt,error:'Hosted rollback verification failed: '+error.message},{now:time});return {status:'failed',receipt,error:error.message};
  }
  receipt.hostedVerified=true;receipt.hosted=packHostedReceiptEvidence(hosted);receipt.finishedAt=time();
  await finishPackDeployment(store,claim,{status:'rolled-back',receipt},{now:time});return {status:'rolled-back',receipt};
}
