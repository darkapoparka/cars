#!/usr/bin/env node
/** Recheck an existing exact deployed version without changing provider or queue state. */
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {queueDigest,validatePackQueue} from './lib/dealer-pack-queue.mjs';
import {validatePackDeploymentIdentity,validatePackProviderSnapshot,validatePackTargetForWrite,validateHostedPackResult,packHostedReceiptEvidence} from './lib/dealer-pack-deployment.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const assert=(ok,message)=>{if(!ok)throw Error('Hosted recheck: '+message);};
const stamp=now=>new Date(now()).toISOString();
const slugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const clone=value=>structuredClone(value);

/** This boundary is used even though the maintained snapshot adapter only reads. */
export function hostedRecheckReadTransport(transport) {
  assert(typeof transport==='function','an authenticated read transport is required');
  return operation=>{
    assert(operation?.method==='GET','only authenticated GET operations are permitted');
    return transport(operation);
  };
}

export function selectHostedRecheckReceipt({queue,slug,registry=[]}={}) {
  validatePackQueue(queue);
  assert(typeof slug==='string'&&slugPattern.test(slug)&&slug.length<=43,'an exact canonical slug is required');
  const related=Object.values(queue.requests).filter(row=>row.request.slug===slug);
  assert(!related.some(row=>['queued','active','needs-reconciliation'].includes(row.status)),'selected dealer has queued, active or uncertain publication work');
  assert(!queue.active||queue.requests[queue.active.requestId].request.slug!==slug,'selected dealer holds the account claim');
  const envelope=queue.receipts[slug]?.at(-1),receipt=envelope?.receipt;
  assert(receipt&&receipt.status==='deployed','no latest retained deployed receipt exists');
  const row=queue.requests[receipt.requestId],request=row?.request;
  assert(request&&['deployed','failed'].includes(row.status)&&row.receiptSha256===envelope.sha256&&envelope.sha256===queueDigest(receipt),'latest receipt is not bound to its terminal exact request');
  const {own}=validatePackDeploymentIdentity({request,queue,registry});
  assert(own?.sha256===envelope.sha256,'selected receipt is not the latest owned deployment');
  for(const key of ['requestId','slug','dealerId','batch','workerName','publicOrigin','packDigest','releaseId','releaseDigest','outputDigest','sourceCommit']){
    assert(receipt[key]===(key==='requestId'?request.id:request[key]),'receipt '+key+' differs from the exact request');
  }
  assert(receipt.sourceProof?.verified===true&&receipt.sourceProof.repository===request.sourceRepository&&receipt.sourceProof.commit===request.sourceCommit&&receipt.sourceProof.path===request.sourcePath,'receipt source proof differs from the exact published source');
  assert(Number.isFinite(Date.parse(receipt.deployedAt)),'receipt has no dated deployment evidence');
  return {request:clone(request),envelope:clone(envelope),requestStatus:row.status};
}

function validateCandidate(candidate,request) {
  assert(candidate?.verified===true,'restored candidate is not verified');
  for(const key of ['slug','packDigest','releaseId','releaseDigest','outputDigest','sourceCommit'])assert(candidate[key]===request[key],'restored candidate '+key+' differs from the exact request');
  assert(candidate.sourceProof?.verified===true&&candidate.sourceProof.repository===request.sourceRepository&&candidate.sourceProof.commit===request.sourceCommit&&candidate.sourceProof.path===request.sourcePath,'restored candidate source proof differs');
  assert(candidate.qa?.success===true&&candidate.qa.packDigest===request.packDigest&&candidate.qa.outputDigest===request.outputDigest&&candidate.qa.releaseDigest===request.releaseDigest,'restored candidate has no exact passing local QA');
  assert(candidate.pack?.manifest?.slug===request.slug&&candidate.pack.packDigest===request.packDigest&&candidate.pack.manifest.pack?.benchmarkOnly!==true&&candidate.benchmarkOnly!==true,'restored dealer pack differs or is benchmark-only');
  assert(path.isAbsolute(candidate.root??'')&&path.isAbsolute(candidate.directory??''),'exact source and sealed bundle directories are required');
}

function accountObservation(snapshot,queue) {
  const expected=new Map(queue.baseline.workerNames.map(name=>[name,null]));
  for(const row of Object.values(queue.requests))for(const event of row.events){
    if(event.kind==='worker-create-observed'&&/^[a-f0-9]{32}$/.test(event.workerId??'')&&event.workerName===row.request.workerName)expected.set(event.workerName,event.workerId);
  }
  for(const history of Object.values(queue.receipts))for(const {receipt} of history){
    if(/^[a-f0-9]{32}$/.test(receipt.workerId??''))expected.set(receipt.workerName,receipt.workerId);
  }
  const actual=new Map(snapshot.scripts.map(worker=>[worker.name,worker.id]));
  return {observedAt:snapshot.observedAt,queueGeneration:queue.generation,baselineWorkers:queue.baseline.workerNames.length,retainedOwnedWorkers:expected.size-queue.baseline.workerNames.length,expectedKnownWorkers:expected.size,actualWorkers:snapshot.scriptCount,
    unaccountedWorkers:snapshot.scripts.filter(worker=>!expected.has(worker.name)).map(({name,id})=>({name,id})),
    missingKnownWorkers:[...expected.keys()].filter(name=>!actual.has(name)),
    changedOwnedIdentities:[...expected].filter(([name,id])=>id&&actual.has(name)&&actual.get(name)!==id).map(([name,id])=>({name,expectedId:id,actualId:actual.get(name)})),
    scope:'Read-only account inventory compared with protected baseline and acknowledged queue ownership; independent publication may advance between these observations.'};
}

export async function reverifyHostedDealerPack({slug,store,provider,materialize,verifyHosted,registry=[],reportFile,screenshotDirectory,now=Date.now}={}) {
  assert(typeof store?.read==='function'&&typeof provider?.snapshot==='function'&&typeof materialize==='function'&&typeof verifyHosted==='function','read store, snapshot provider, exact materializer and hosted verifier are required');
  const startedAt=stamp(now),initial=await store.read(),queue=validatePackQueue(initial.state);
  const selected=selectHostedRecheckReceipt({queue,slug,registry}),{request,envelope}=selected,receipt=envelope.receipt;
  const checkQueue=async()=>{
    const latest=await store.read(),state=validatePackQueue(latest.state),current=selectHostedRecheckReceipt({queue:state,slug,registry});
    assert(state.queueId===queue.queueId&&state.policyDigest===queue.policyDigest&&state.baselineDigest===queue.baselineDigest,'queue ownership or authorization changed during the recheck');
    assert(current.envelope.sha256===envelope.sha256&&current.request.id===request.id&&current.requestStatus===selected.requestStatus,'latest exact receipt or terminal state changed during the recheck');
    return state;
  };
  // Existing materialization authenticates source, artifact expiry/digests and
  // every restored bundle byte. A saved ZIP or current main is not substituted.
  const candidate=await materialize(request,queue,registry);validateCandidate(candidate,request);
  const observe=async(stage,state)=>{
    const challenge={requestId:randomUUID(),stage,notBefore:stamp(now)};
    const context=validatePackProviderSnapshot(await provider.snapshot({request,challenge}),{challenge,request,queue:state,now:now()});
    validatePackTargetForWrite(context,{request,queue:state,own:envelope});
    assert(context.snapshot.target.subdomain?.enabled===false&&context.snapshot.target.subdomain?.previews_enabled===false,'owned Worker acquired secondary exposure');
    assert(context.route.pattern===new URL(request.publicOrigin).hostname+'/*','owned canonical route changed');
    return context;
  };
  const beforeQueue=await checkQueue(),before=await observe('before-hosted-recheck',beforeQueue);
  let hosted,hostedError;
  try{hosted=await verifyHosted({root:candidate.root,request,receipt,candidate,pack:candidate.pack,registry,reportFile,screenshotDirectory});}
  catch(error){hostedError=error;}
  // Always require a second authenticated exact-version observation, including
  // after a failed browser run. Never rewrite the historical failed receipt.
  const afterQueue=await checkQueue(),after=await observe('after-hosted-recheck',afterQueue),finalQueue=await checkQueue();
  const fingerprint=context=>queueDigest({target:context.snapshot.target,route:context.route});
  assert(fingerprint(before)===fingerprint(after),'provider target changed during the hosted recheck');
  if(hostedError)throw hostedError;
  validateHostedPackResult(hosted,request,receipt.versionId);
  assert(Number.isFinite(Date.parse(hosted.startedAt))&&Date.parse(hosted.startedAt)>=Date.parse(startedAt)&&Date.parse(hosted.finishedAt)>=Date.parse(hosted.startedAt)&&Date.parse(hosted.finishedAt)<=now(),'hosted result is not a fresh dated observation of this recheck');
  return {schemaVersion:1,type:'cars-dealer-pack-hosted-recheck',status:'passed',slug,publicOrigin:request.publicOrigin,requestId:request.id,
    queueId:queue.queueId,initialQueueGeneration:queue.generation,finalQueueGeneration:finalQueue.generation,sourceReceiptSha256:envelope.sha256,
    historicalRequestStatus:selected.requestStatus,historicalHostedVerified:receipt.hostedVerified===true,historicalEvidenceUnchanged:true,
    sourceCommit:request.sourceCommit,packDigest:request.packDigest,releaseDigest:request.releaseDigest,outputDigest:request.outputDigest,
    workerId:receipt.workerId,versionId:receipt.versionId,routeId:receipt.routeId,startedAt,finishedAt:stamp(now),providerWrites:0,queueWrites:0,hostedVerified:true,
    providerBefore:{observedAt:before.snapshot.observedAt,snapshotSha256:queueDigest(before.snapshot),targetSha256:fingerprint(before)},
    providerAfter:{observedAt:after.snapshot.observedAt,snapshotSha256:queueDigest(after.snapshot),targetSha256:fingerprint(after)},
    hosted:packHostedReceiptEvidence(hosted),account:accountObservation(after.snapshot,finalQueue),
    scope:'Independent current hosted acceptance of the original exact Worker/version; original queue request, failed hosted result and immutable receipt are unchanged.'};
}

export function parseHostedRecheckArgs(argv) {
  const options={};
  for(let index=0;index<argv.length;index+=2){
    const key=argv[index],value=argv[index+1];
    assert(['--slugs','--report'].includes(key)&&!options[key]&&typeof value==='string'&&value.length>0&&!value.startsWith('--'),'use only --slugs SLUG[,SLUG] --report runtime/PATH.json');
    options[key]=value;
  }
  assert(options['--slugs']&&options['--report'],'explicit slugs and report path are required');
  const slugs=options['--slugs'].split(',');
  assert(slugs.length>=1&&slugs.length<=10&&new Set(slugs).size===slugs.length&&slugs.every(slug=>slugPattern.test(slug)&&slug.length<=43),'use one to ten distinct exact canonical slugs');
  return {slugs,report:options['--report']};
}

export async function runHostedRecheckCli(argv=process.argv.slice(2),{root=ROOT,store:providedStore,provider:providedProvider,materialize:providedMaterialize,verifyHosted:providedVerify,registry:providedRegistry,now=Date.now}={}) {
  const options=parseHostedRecheckArgs(argv),runtime=path.join(path.resolve(root),'runtime'),out=path.resolve(root,options.report);
  assert(out.startsWith(runtime+path.sep)&&out.endsWith('.json'),'report must remain in generated runtime JSON output');
  let store=providedStore,provider=providedProvider,materialize=providedMaterialize,verifyHosted=providedVerify;
  if(!store||!provider||!materialize||!verifyHosted){
    const [{gitPackQueueStore},{githubPackTransport},{cloudflarePackProvider,tokenCloudflareTransport},{packArtifactResolver},hostedModule]=await Promise.all([
      import('./lib/dealer-pack-queue-git.mjs'),import('./deploy-dealer-packs.mjs'),import('./lib/dealer-pack-cloudflare.mjs'),import('./dispatch-dealer-pack-queue.mjs'),import('./verify-hosted-dealer-pack.mjs'),
    ]);
    const cache=path.join(runtime,'dealer-pack-deploy-cache');
    if(!store){const queueStore=gitPackQueueStore({directory:path.join(cache,'queue.git')});store={read:()=>queueStore.read()};}
    if(!provider){const reader=cloudflarePackProvider({api:hostedRecheckReadTransport(tokenCloudflareTransport())});provider={snapshot:options=>reader.snapshot(options)};}
    if(!materialize){const resolver=packArtifactResolver({root,cache,readGithub:hostedRecheckReadTransport(githubPackTransport())});materialize=(...args)=>resolver.materialize(...args);}
    verifyHosted??=hostedModule.verifyHostedDealerPack;
  }
  const registry=providedRegistry??JSON.parse(fs.readFileSync(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'),'utf8').replace(/^\uFEFF/,''));
  const report={schemaVersion:1,type:'cars-dealer-pack-hosted-recheck-batch',status:'running',success:false,startedAt:stamp(now),providerWrites:0,queueWrites:0,historicalEvidenceUnchanged:true,reports:[]};
  const retain=()=>{fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');};
  for(const slug of options.slugs){
    try{report.reports.push(await reverifyHostedDealerPack({slug,store,provider,materialize,verifyHosted,registry,now,
      reportFile:path.join(runtime,'dealer-pack-hosted',slug,'report.json'),screenshotDirectory:path.join(runtime,'dealer-pack-hosted',slug,'screenshots')}));}
    catch(error){report.reports.push({slug,status:'blocked',reason:error.message,providerWrites:0,queueWrites:0,finishedAt:stamp(now)});}
    retain();
  }
  report.success=report.reports.every(row=>row.status==='passed');report.status=report.success?'completed':'completed-with-failures';report.finishedAt=stamp(now);retain();
  console.log(JSON.stringify({status:report.status,success:report.success,providerWrites:0,queueWrites:0,reports:report.reports.map(({slug,status,reason,versionId})=>({slug,status,reason,versionId})),report:options.report},null,2));
  if(!report.success)process.exitCode=1;return report;
}

if(isEntrypoint(import.meta.url))runHostedRecheckCli().catch(error=>{console.error(error.message);process.exitCode=1;});
