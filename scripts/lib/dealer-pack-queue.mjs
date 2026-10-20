/** Durable account-wide deployment queue. GitHub Contents SHA is the CAS token.
 * Requests survive replaced/cancelled Actions runs. An in-flight claim NEVER
 * expires automatically: a lost process must reconcile its provider intent.
 */
import {createHash, randomUUID} from 'node:crypto';

export const PACK_DEPLOY_ACCOUNT='cb0007f242077bd759331f096eb75531';
export const PACK_DEPLOY_ZONE='006e99b27c99b7ee85bc0642fa91fa14';
export const PACK_QUEUE_REPOSITORY='darkapoparka/cars';
export const PACK_QUEUE_BRANCH='cars-deploy-queue';
export const PACK_QUEUE_PATH='queue.json';
export const queueCanonical=value=>JSON.stringify(value,(_,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.keys(item).sort().map(key=>[key,item[key]])):item);
export const queueDigest=value=>createHash('sha256').update(typeof value==='string'?value:queueCanonical(value)).digest('hex');
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const hex64=value=>/^[a-f0-9]{64}$/.test(value??'');
const hex40=value=>/^[a-f0-9]{40}$/.test(value??'');
const timestamp=value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
const clone=value=>structuredClone(value);

export function validatePackDeploymentPolicy(policy) {
  assert(policy?.schemaVersion===1&&policy.kind==='cars-owner-authorized-pack-deployment'&&policy.accountId===PACK_DEPLOY_ACCOUNT&&policy.zoneId===PACK_DEPLOY_ZONE,'Explicit account/zone-matching owner deployment policy required');
  assert(policy.workersPlan==='paid'&&policy.allowedScripts===500&&policy.minimumSpareScripts===0&&policy.ownerConfirmedPaid===true&&policy.allowNewPreviews===true&&policy.outreachApproved===false,'M2 requires the owner-confirmed Paid 500, zero-reserve preview policy; outreach remains separate');
  assert(timestamp(policy.authorizedAt)&&typeof policy.authorizationSource==='string'&&policy.authorizationSource.trim().length>=12&&typeof policy.reason==='string'&&policy.reason.trim().length>=20,'Retain the dated owner instruction and concrete zero-reserve reason');
  assert(policy.maximumNewDealers===400&&policy.zoneName==='webpreviews.site','Deployment authorization is bounded to 400 new webpreviews.site dealers');
  return policy;
}

export function createPackDeploymentQueue({policy,baseline,now=new Date().toISOString(),queueId=randomUUID()}) {
  validatePackDeploymentPolicy(policy);
  assert(baseline?.accountId===PACK_DEPLOY_ACCOUNT&&baseline.zoneId===PACK_DEPLOY_ZONE&&timestamp(baseline.observedAt)&&Array.isArray(baseline.workerNames)&&baseline.workerNames.length<=500,'Authenticated baseline inventory required');
  assert(baseline.evidence==='authenticated-cloudflare-api'&&baseline.complete===true&&new Set(baseline.workerNames).size===baseline.workerNames.length,'Baseline must contain every live Worker, with no duplicate names');
  assert(Array.isArray(baseline.routes)&&Array.isArray(baseline.domains),'Baseline routes and Worker domains are required');
  const protectedBaseline=clone(baseline);protectedBaseline.workerNames.sort();
  return {schemaVersion:1,type:'cars-account-deployment-queue',repository:PACK_QUEUE_REPOSITORY,branch:PACK_QUEUE_BRANCH,path:PACK_QUEUE_PATH,accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,queueId,
    policy:clone(policy),policyDigest:queueDigest(policy),baseline:protectedBaseline,baselineDigest:queueDigest(protectedBaseline),generation:0,createdAt:now,updatedAt:now,order:[],requests:{},active:null,receipts:{}};
}

export function packDeploymentRequest(input) {
  const request={schemaVersion:1,action:input.action??'deploy',slug:input.slug,dealerId:input.dealerId,batch:Number(input.batch),workerName:input.workerName,publicOrigin:input.publicOrigin,
    packDigest:input.packDigest,releaseId:input.releaseId,releaseDigest:input.releaseDigest,outputDigest:input.outputDigest,sourceCommit:input.sourceCommit,
    sourceRepository:input.sourceRepository??PACK_QUEUE_REPOSITORY,sourcePath:'dealers/'+input.slug,
    ...(input.buildArtifact?{buildArtifact:clone(input.buildArtifact)}:{}),...(input.rollbackTo?{rollbackTo:input.rollbackTo}:{})};
  assert(['deploy','redeploy-owned','rollback'].includes(request.action)&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(request.slug??'')&&request.slug.length<=43,'Exact canonical dealer slug and supported queue action required');
  assert(typeof request.dealerId==='string'&&/^(?:gb|us|ae)-[a-z0-9-]+$/.test(request.dealerId)&&[1,2,3,4].includes(request.batch),'Each request must retain its exact expansion lead and batch');
  assert(request.workerName==='cars-'+request.slug&&request.publicOrigin==='https://'+request.slug+'.webpreviews.site','Queue identity must be cars-<slug> and the canonical HTTPS preview origin');
  assert([request.packDigest,request.releaseDigest,request.outputDigest].every(hex64)&&typeof request.releaseId==='string'&&request.releaseId.length>=8&&request.releaseId.length<=160&&hex40(request.sourceCommit),'Queue requests require exact pack, immutable release, source and output identities');
  assert(request.sourceRepository===PACK_QUEUE_REPOSITORY,'Only the authorized Cars source repository is accepted');
  if(request.buildArtifact){
    const artifact=request.buildArtifact;
    assert(Number.isSafeInteger(artifact.runId)&&artifact.runId>0&&Number.isSafeInteger(artifact.artifactId)&&artifact.artifactId>0&&/^sha256:[a-f0-9]{64}$/.test(artifact.digest??''),'Build artifact locator must identify exact GitHub bytes');
    if(artifact.shards){assert(artifact.sourceCommit===request.sourceCommit&&hex64(artifact.manifestSha256)&&new RegExp('^dealer-pack-transport--'+artifact.runId+'--lane-[0-9]+$').test(artifact.prefix)&&artifact.name===artifact.prefix+'--manifest'&&Number.isSafeInteger(artifact.bytes)&&artifact.bytes>0&&Array.isArray(artifact.shards)&&artifact.shards.length>0&&artifact.shards.length<=8,'Exact source and sharded transport locator required');
      assert(artifact.shards.every((row,index)=>row.index===index&&row.name===artifact.prefix+'--shard-'+index&&Number.isSafeInteger(row.id)&&row.id>0&&Number.isSafeInteger(row.bytes)&&row.bytes>0&&/^sha256:[a-f0-9]{64}$/.test(row.digest??'')),'Transport shard identities differ');}
  }
  if(request.action==='rollback')assert(typeof request.rollbackTo==='string'&&request.rollbackTo.length>0,'Rollback must identify an earlier owned deployment receipt');
  return {...request,id:queueDigest(request)};
}

export function validatePackQueue(state) {
  assert(state?.schemaVersion===1&&state.type==='cars-account-deployment-queue'&&state.repository===PACK_QUEUE_REPOSITORY&&state.branch===PACK_QUEUE_BRANCH&&state.path===PACK_QUEUE_PATH&&state.accountId===PACK_DEPLOY_ACCOUNT&&state.zoneId===PACK_DEPLOY_ZONE,'Wrong durable deployment queue identity');
  validatePackDeploymentPolicy(state.policy);
  assert(state.policyDigest===queueDigest(state.policy)&&state.baselineDigest===queueDigest(state.baseline)&&Array.isArray(state.baseline.workerNames),'Queue policy or protected baseline changed without a matching envelope');
  assert(typeof state.queueId==='string'&&state.queueId.length>=20&&Number.isSafeInteger(state.generation)&&state.generation>=0&&Array.isArray(state.order)&&state.order.length<=10000&&state.requests&&state.receipts,'Malformed or oversized durable queue');
  assert(new Set(state.order).size===state.order.length&&Object.keys(state.requests).length===state.order.length,'Queue request index differs');
  for(const id of state.order){const row=state.requests[id];assert(row&&packDeploymentRequest(row.request).id===id&&row.request.id===id&&['queued','active','deployed','failed','needs-reconciliation','rolled-back'].includes(row.status)&&Array.isArray(row.events),'Queue request identity/status differs');}
  if(state.active)assert(state.requests[state.active.requestId]&&['active','needs-reconciliation'].includes(state.requests[state.active.requestId].status)&&typeof state.active.token==='string'&&state.active.token.length>=20&&typeof state.active.owner==='string'&&timestamp(state.active.claimedAt),'Active account claim is invalid');
  for(const [slug,history] of Object.entries(state.receipts)){
    assert(Array.isArray(history)&&history.length<=1000,'Receipt history is invalid');
    for(const row of history)assert(row.receipt?.slug===slug&&row.sha256===queueDigest(row.receipt)&&state.requests[row.receipt.requestId],'Durable receipt was changed or has no queued request');
  }
  return state;
}

/** The store must implement atomic conditional writes, not read-then-force-push. */
export async function mutatePackQueue(store,mutate,{attempts=20,now=()=>new Date().toISOString()}={}) {
  assert(store&&typeof store.read==='function'&&typeof store.compareAndSwap==='function','A durable CAS queue store is required');
  for(let attempt=0;attempt<attempts;attempt++){
    const {state,revision}=await store.read();validatePackQueue(state);const next=clone(state);
    const value=await mutate(next);
    if(value?.unchanged)return {state,revision,value:value.value};
    assert(queueDigest(next.policy)===state.policyDigest&&queueDigest(next.baseline)===state.baselineDigest&&next.queueId===state.queueId,'Ordinary queue mutations cannot alter authorization or protected baseline');
    next.generation=state.generation+1;next.updatedAt=now();validatePackQueue(next);
    const result=await store.compareAndSwap(revision,next);
    if(result)return {state:next,revision:typeof result==='string'?result:null,value};
  }
  throw Error('Deployment queue CAS contention; requests are retained, retry enqueue/drain');
}

export async function enqueuePackDeployments(store,inputs,options={}) {
  assert(Array.isArray(inputs)&&inputs.length>0&&inputs.length<=400,'Enqueue between 1 and 400 exact deployment requests');
  const requests=[],invalid=[];
  for(const input of inputs)try{requests.push(packDeploymentRequest(input));}catch(error){if(!options.collectRejections)throw error;invalid.push({slug:typeof input?.slug==='string'?input.slug:null,reason:error.message});}
  return mutatePackQueue(store,state=>{
    const added=[],existing=[],rejected=[...invalid],dealerIds=new Set(Object.values(state.requests).map(row=>row.request.dealerId));
    for(const request of requests)try{
      assert(!state.baseline.workerNames.includes(request.workerName),'Refusing a protected baseline Worker');
      const prior=state.requests[request.id];if(prior){assert(queueCanonical(prior.request)===queueCanonical(request),'Duplicate request ID content differs');existing.push(request.id);continue;}
      // Names and lead ownership cannot be taken by another pack across batches.
      for(const row of Object.values(state.requests))assert(row.request.slug===request.slug&&row.request.dealerId===request.dealerId||row.request.workerName!==request.workerName&&row.request.publicOrigin!==request.publicOrigin&&row.request.dealerId!==request.dealerId,'Queue contains a conflicting dealer/name/origin assignment');
      assert(dealerIds.has(request.dealerId)||dealerIds.size<state.policy.maximumNewDealers,'Queue exceeds the 400 authorized new dealers');
      state.order.push(request.id);state.requests[request.id]={request,status:'queued',queuedAt:options.now?.()??new Date().toISOString(),events:[]};added.push(request.id);
      dealerIds.add(request.dealerId);
    }catch(error){if(!options.collectRejections)throw error;rejected.push({slug:request.slug,requestId:request.id,reason:error.message});}
    const value={added,existing,...(options.collectRejections?{rejected}:{})};
    return added.length?value:{unchanged:true,value};
  },options);
}

export async function claimPackDeployment(store,{owner,now=()=>new Date().toISOString(),token=randomUUID(),requestId}={}) {
  assert(typeof owner==='string'&&owner.length>=3&&owner.length<=300,'Use an identifiable executor/run owner');
  return mutatePackQueue(store,state=>{
    if(state.active)return {unchanged:true,value:{claimed:false,active:clone(state.active)}};
    const id=requestId??state.order.find(key=>state.requests[key].status==='queued');
    if(!id)return {unchanged:true,value:{claimed:false,empty:true}};
    const row=state.requests[id];assert(row?.status==='queued','Requested queue item is not pending');
    state.active={requestId:id,owner,token,claimedAt:now()};row.status='active';row.events.push({kind:'claimed',at:now(),owner});
    return {claimed:true,claim:clone(state.active),request:clone(row.request)};
  },{now});
}

export function assertPackClaim(state,claim) {
  validatePackQueue(state);
  assert(state.active&&state.active.requestId===claim?.requestId&&state.active.owner===claim.owner&&state.active.token===claim.token,'Account deployment claim was lost or belongs to another executor');
  assert(state.requests[claim.requestId].status==='active','Deployment requires an active reconciled claim');
  return state.requests[claim.requestId];
}

export async function readPackClaim(store,claim) {const result=await store.read();assertPackClaim(result.state,claim);return result;}

export async function recordPackEvent(store,claim,event,{now=()=>new Date().toISOString()}={}) {
  assert(event&&typeof event.kind==='string'&&!/token|secret|jwt/i.test(Object.keys(event).join(' ')),'Queue events must not include credentials');
  return mutatePackQueue(store,state=>{const row=assertPackClaim(state,claim);row.events.push({...clone(event),at:now()});return row.events.length;},{now});
}

export async function finishPackDeployment(store,claim,{status,receipt,error,uncertain=false},{now=()=>new Date().toISOString()}={}) {
  assert(['deployed','failed','needs-reconciliation','rolled-back'].includes(status),'Invalid deployment terminal state');
  assert((status==='needs-reconciliation')===uncertain,'Unknown provider outcomes must retain the account claim');
  return mutatePackQueue(store,state=>{
    const row=assertPackClaim(state,claim);row.status=status;row.finishedAt=now();if(error)row.error=String(error).slice(0,2000);
    if(receipt){assert(receipt.slug===row.request.slug&&receipt.requestId===row.request.id&&receipt.queueId===state.queueId,'Receipt is not bound to this account claim');const envelope={sha256:queueDigest(receipt),receipt:clone(receipt)};(state.receipts[receipt.slug]??=[]).push(envelope);row.receiptSha256=envelope.sha256;}
    row.events.push({kind:status,at:now(),...(error?{error:String(error).slice(0,2000)}:{})});if(!uncertain)state.active=null;
    return {status,receiptSha256:row.receiptSha256??null,claimRetained:uncertain};
  },{now});
}

/** Recovery requires positive authenticated outcome evidence and a stopped owner.
 * No TTL or force-unlock option exists. The caller must check the old Actions run
 * is terminal, or explicitly prove the connector process has stopped.
 */
export function validatePackOwnedCreateResume(resume,{queue,request,events}={}) {
  const tags=['cars-pack-v1','cars-queue-'+queue.queueId,'cars-lead-'+queueDigest(request.dealerId).slice(0,32),'cars-request-'+request.id];
  assert(resume?.schemaVersion===1&&resume.kind==='cars-pack-owned-create-resume'&&resume.queueId===queue.queueId&&resume.requestId===request.id&&resume.slug===request.slug&&resume.dealerId===request.dealerId&&resume.workerName===request.workerName&&resume.publicOrigin===request.publicOrigin,'Owned-create resume identity differs from its exact queued pack');
  assert(/^[a-f0-9]{32}$/.test(resume.workerId??'')&&queueCanonical(resume.ownershipTags)===queueCanonical(tags)&&hex64(resume.createEventSha256)&&hex64(resume.snapshotSha256)&&timestamp(resume.observedAt),'Owned-create resume needs the saved immutable Worker ID, complete tags and fresh observation binding');
  const created=events.filter(event=>event.kind==='worker-create-observed');
  assert(created.length===1&&created[0].workerId===resume.workerId&&created[0].workerName===request.workerName&&queueCanonical(created[0].ownershipTags)===queueCanonical(tags)&&queueDigest(created[0])===resume.createEventSha256,'Resume cannot adopt a same-name Worker without the exact saved create acknowledgement');
  assert(resume.versionId===null||/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(resume.versionId??''),'Resume active version is invalid');
  const activation=events.filter(event=>event.kind==='activate-version-intent');
  if(resume.versionId===null)assert(activation.length===0,'A never-deployed read cannot reconcile a possibly in-flight activation');
  else assert(activation.at(-1)?.versionId===resume.versionId&&events.some(event=>event.kind==='worker-upload-observed'&&event.workerId===resume.workerId&&event.versionId===resume.versionId),'Resume active version is not a positively matched uploaded and requested version');
  const routeIntents=events.filter(event=>event.kind==='create-route-intent'),routes=events.filter(event=>event.kind==='create-route-observed');
  if(resume.route===null)assert(routeIntents.length===0&&routes.length===0,'A missing route cannot reconcile a possibly in-flight or removed route');
  else assert(resume.versionId!==null&&typeof resume.route?.id==='string'&&resume.route.id.length>0&&resume.route.pattern===new URL(request.publicOrigin).hostname+'/*'&&resume.route.script===request.workerName&&events.some(event=>event.kind==='worker-upload-observed'&&event.workerId===resume.workerId&&event.versionId===routeIntents.at(-1)?.versionId)&&routeIntents.at(-1)?.pattern===resume.route.pattern&&routeIntents.at(-1)?.script===request.workerName&&routes.every(event=>event.routeId===resume.route.id),'Resume route is not the positively matched own creation request');
  // An uploaded version is harmless to resume only when its original request
  // explicitly disabled automatic deployment. Activation is a separate intent.
  assert(events.filter(event=>event.kind==='worker-upload-intent').every(event=>event.deploy===false),'Unacknowledged legacy version uploads without deploy:false require manual outcome reconciliation');
  return resume;
}

export async function recoverPackClaim(store,{requestId,ownerStopped,outcome,readOutcome,now=()=>new Date().toISOString()}={}) {
  assert(ownerStopped?.verified===true&&['completed-github-run','stopped-connector-executor'].includes(ownerStopped.kind)&&typeof ownerStopped.evidence==='string'&&ownerStopped.evidence.length>=10,'Recovery requires evidence the prior executor cannot still write');
  assert(typeof readOutcome==='function','Recovery requires a fresh authenticated provider reconciliation');
  const initial=await store.read();validatePackQueue(initial.state);assert(initial.state.active?.requestId===requestId,'No matching retained claim');
  const original=clone(initial.state.active),row=initial.state.requests[requestId],eventDigest=queueDigest(row.events),proof=await readOutcome(row.request,row.events,{queue:clone(initial.state),claim:clone(original)});
  assert(proof?.verified===true&&proof.requestId===requestId&&proof.evidence==='authenticated-cloudflare-api'&&timestamp(proof.observedAt),'Provider outcome is not positively reconciled');
  assert(['absent','owned-active','owned-rolled-back','owned-create-pending'].includes(proof.outcome)&&(!outcome||proof.outcome===outcome),'Provider outcome remains uncertain');
  if(proof.outcome==='owned-create-pending'){
    assert(ownerStopped.owner===original.owner&&timestamp(ownerStopped.observedAt),'Owned-create recovery needs exact stopped-executor identity evidence');
    validatePackOwnedCreateResume(proof.resume,{queue:initial.state,request:row.request,events:row.events});
    assert(proof.resume.observedAt===proof.observedAt&&Date.parse(proof.observedAt)<=Date.parse(now())&&Date.parse(now())-Date.parse(proof.observedAt)<=30000,'Owned-create recovery observation is stale');
  }
  if(proof.outcome==='absent'){
    const writes=['worker-create','worker-upload','activate-version','create-route','rollback-version'];
    assert(writes.every(kind=>row.events.filter(event=>event.kind===kind+'-intent').length===row.events.filter(event=>event.kind===kind+'-observed').length),'A negative read cannot reconcile an unacknowledged provider write: it might still complete after that read');
  }
  return mutatePackQueue(store,state=>{
    assert(queueCanonical(state.active)===queueCanonical(original),'Claim changed during reconciliation');
    assert(queueDigest(state.requests[requestId].events)===eventDigest,'Provider intents changed during reconciliation');
    const current=state.requests[requestId];current.events.push({kind:'reconciled',at:now(),ownerStopped:clone(ownerStopped),proof:clone(proof)});
    current.status=['absent','owned-create-pending'].includes(proof.outcome)?'queued':proof.outcome==='owned-rolled-back'?'rolled-back':'deployed';
    if(proof.outcome==='owned-create-pending'){current.resume={sha256:queueDigest(proof.resume),resume:clone(proof.resume)};delete current.finishedAt;delete current.error;}
    if(proof.receipt){assert(proof.receipt.requestId===requestId&&proof.receipt.queueId===state.queueId,'Recovered receipt is not queue-bound');const envelope={receipt:clone(proof.receipt),sha256:queueDigest(proof.receipt)};(state.receipts[current.request.slug]??=[]).push(envelope);current.receiptSha256=envelope.sha256;}
    else assert(['absent','owned-create-pending'].includes(proof.outcome),'An existing recovered Worker needs a complete durable receipt');
    state.active=null;return {status:current.status};
  },{now});
}

export function githubPackQueueStore({request,branch=PACK_QUEUE_BRANCH,repository=PACK_QUEUE_REPOSITORY}={}) {
  assert(typeof request==='function'&&branch===PACK_QUEUE_BRANCH&&repository===PACK_QUEUE_REPOSITORY,'Use the one dedicated account queue branch');
  const endpoint='/repos/'+repository+'/contents/'+PACK_QUEUE_PATH;
  return {
    async read(){
      const response=await request({method:'GET',path:endpoint,query:{ref:branch}});assert(response.status===200&&response.body?.type==='file'&&hex40(response.body.sha)&&response.body.size<=16*1024**2,'Authenticated durable queue read failed');
      let content=response.body;
      // Contents omits inline bytes beyond1MiB. The exact returned blob remains
      // available through Git data, without trusting a mutable raw branch URL.
      if(content.encoding!=='base64'){const blob=await request({method:'GET',path:'/repos/'+repository+'/git/blobs/'+content.sha});assert(blob.status===200&&blob.body?.sha===content.sha&&blob.body.encoding==='base64'&&blob.body.size<=16*1024**2,'Durable queue blob read failed');content=blob.body;}
      const state=JSON.parse(Buffer.from(content.content.replace(/\s/g,''),'base64').toString('utf8'));validatePackQueue(state);return {state,revision:response.body.sha};
    },
    async compareAndSwap(revision,state){assert(hex40(revision),'Queue CAS needs the exact current blob SHA');validatePackQueue(state);const response=await request({method:'PUT',path:endpoint,body:{message:'deploy-queue: generation '+state.generation,branch,sha:revision,content:Buffer.from(JSON.stringify(state,null,2)+'\n').toString('base64')}});if([409,422].includes(response.status))return false;assert(response.status===200&&hex40(response.body?.content?.sha),'Durable queue write failed; reconcile before retry');return response.body.content.sha;},
  };
}
