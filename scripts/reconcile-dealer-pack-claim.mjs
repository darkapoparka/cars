#!/usr/bin/env node
/** Reconcile a stopped executor's positively acknowledged Worker creation.
 * This command performs only authenticated provider reads and an optional
 * durable queue CAS. The ordinary guarded drainer performs all later writes.
 */
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {ROOT} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {PACK_QUEUE_REPOSITORY,queueDigest,queueCanonical,validatePackQueue,validatePackOwnedCreateResume,recoverPackClaim} from './lib/dealer-pack-queue.mjs';
import {gitPackQueueStore} from './lib/dealer-pack-queue-git.mjs';
import {githubPackTransport} from './deploy-dealer-packs.mjs';
import {cloudflarePackProvider,tokenCloudflareTransport} from './lib/dealer-pack-cloudflare.mjs';
import {packOwnershipTags,validatePackDeploymentIdentity,validatePackProviderSnapshot,validateResumedPackTargetForWrite} from './lib/dealer-pack-deployment.mjs';

const assert=(ok,message)=>{if(!ok)throw Error('Pack reconciliation: '+message);};
const hex64=value=>/^[a-f0-9]{64}$/.test(value??'');
const time=now=>new Date(now()).toISOString();

/** A caller cannot select another run or merely assert that a lease is old.
 * Connector recovery requires a maintained process-identity verifier; there is
 * deliberately no --force, PID-only, or operator-authored proof-file option.
 */
export async function observeStoppedPackExecutor({claim,readGithub,verifyStoppedConnector,now=Date.now}={}) {
  const match=/^github:([1-9][0-9]{0,14})$/.exec(claim?.owner??'');
  if(match){
    assert(typeof readGithub==='function','authenticated GitHub run reads are required');
    const reply=await readGithub({method:'GET',path:'/repos/'+PACK_QUEUE_REPOSITORY+'/actions/runs/'+match[1]});
    const run=reply?.body;
    assert(reply?.status===200&&run?.id===Number(match[1])&&run.repository?.full_name===PACK_QUEUE_REPOSITORY&&run.status==='completed'&&typeof run.conclusion==='string'&&run.conclusion.length>0,'the exact previous GitHub executor is not confirmed completed');
    return {verified:true,owner:claim.owner,kind:'completed-github-run',runId:run.id,conclusion:run.conclusion,evidence:'Authenticated GitHub Actions API reports this exact executor run completed',observedAt:time(now)};
  }
  assert(typeof claim?.owner==='string'&&claim.owner.startsWith('connector:')&&typeof verifyStoppedConnector==='function','connector recovery requires its maintained stopped-process identity verifier');
  const challenge={id:randomUUID(),owner:claim.owner,claimedAt:claim.claimedAt,notBefore:time(now)},proof=await verifyStoppedConnector({claim:structuredClone(claim),challenge});
  assert(proof?.verified===true&&proof.kind==='stopped-connector-executor'&&proof.owner===claim.owner&&proof.challengeId===challenge.id&&typeof proof.evidence==='string'&&proof.evidence.length>=10&&Number.isFinite(Date.parse(proof.observedAt))&&Date.parse(proof.observedAt)>=Date.parse(challenge.notBefore)&&Date.parse(proof.observedAt)<=now(),'connector process identity or stopped-state evidence is not verified');
  return proof;
}

async function observeOwnedCreation({queue,claim,request,events,provider,registry,now}) {
  assert(queue.active?.requestId===request.id&&queue.active.owner===claim.owner&&queue.active.token===claim.token,'the retained account claim changed');
  assert(request.action==='deploy'&&!validatePackDeploymentIdentity({request,queue,registry}).own,'this recovery path only continues an incomplete initial creation');
  const created=events.filter(event=>event.kind==='worker-create-observed');
  assert(created.length===1&&/^[a-f0-9]{32}$/.test(created[0].workerId??''),'no unique acknowledged immutable Worker ID is saved; an unacknowledged create remains blocked');
  const challenge={requestId:randomUUID(),stage:'owned-create-reconciliation',notBefore:time(now)};
  const context=validatePackProviderSnapshot(await provider.snapshot({request,challenge}),{challenge,request,queue,now:now()});
  const resume={schemaVersion:1,kind:'cars-pack-owned-create-resume',queueId:queue.queueId,requestId:request.id,slug:request.slug,dealerId:request.dealerId,workerName:request.workerName,publicOrigin:request.publicOrigin,
    workerId:created[0].workerId,ownershipTags:packOwnershipTags(queue,request),versionId:context.snapshot.target.versionId??null,route:context.route,
    createEventSha256:queueDigest(created[0]),snapshotSha256:queueDigest(context.snapshot),observedAt:context.snapshot.observedAt};
  validatePackOwnedCreateResume(resume,{queue,request,events});
  validateResumedPackTargetForWrite(context,{request,resume});
  return {verified:true,evidence:'authenticated-cloudflare-api',requestId:request.id,outcome:'owned-create-pending',observedAt:resume.observedAt,resume,
    scriptCount:context.snapshot.scriptCount,providerWrites:0};
}

export async function reconcileOwnedPackCreation({store,provider,requestId,readGithub=githubPackTransport(),verifyStoppedConnector,registry=[],write=false,now=Date.now}={}) {
  assert(hex64(requestId)&&typeof provider?.snapshot==='function','an exact request ID and read-only authenticated provider are required');
  const initial=await store.read();validatePackQueue(initial.state);
  const claim=initial.state.active,row=initial.state.requests[requestId];
  assert(claim?.requestId===requestId&&row&&['active','needs-reconciliation'].includes(row.status),'no matching retained account claim exists');
  const ownerStopped=await observeStoppedPackExecutor({claim,readGithub,verifyStoppedConnector,now});
  if(!write){
    const proof=await observeOwnedCreation({queue:initial.state,claim,request:row.request,events:row.events,provider,registry,now});
    return {schemaVersion:1,type:'cars-pack-creation-reconciliation',status:'ready-to-resume',requestId,slug:row.request.slug,ownerStopped,proof,queueWrites:0,providerWrites:0};
  }
  let proof;
  const result=await recoverPackClaim(store,{requestId,ownerStopped,outcome:'owned-create-pending',now:()=>time(now),readOutcome:async(request,events,{queue,claim:current})=>{
    assert(queueCanonical(current)===queueCanonical(claim),'claim changed after stopped-owner verification');
    return proof=await observeOwnedCreation({queue,claim:current,request,events,provider,registry,now});
  }});
  return {schemaVersion:1,type:'cars-pack-creation-reconciliation',status:result.value.status,requestId,slug:row.request.slug,ownerStopped,proof,queueWrites:1,providerWrites:0,
    continuation:'The ordinary account-serialized drainer can now continue this exact request; creation is skipped and the immutable ID is checked again before upload.'};
}

export async function runPackReconciliationCli(argv=process.argv.slice(2)) {
  if(argv.includes('--help')){console.log('Usage: reconcile-dealer-pack-claim.mjs inspect --request-id SHA256 [--report runtime/FILE.json]\n       reconcile-dealer-pack-claim.mjs resume --request-id SHA256 --write [--report runtime/FILE.json]\nProvider operations are read-only. Resume requeues only a positively matched acknowledged create after authenticating the old executor stopped. Run dispatch-dealer-pack-queue.mjs drain afterwards. Unknown create IDs, unmatched activation/route outcomes, active owners, and arbitrary same-name Workers remain blocked. Connector recovery requires the maintained process-identity callback; no force unlock exists.');return;}
  const [action,...args]=argv,options={};assert(['inspect','resume'].includes(action),'use inspect or resume');
  for(let index=0;index<args.length;index++){const key=args[index];if(key==='--write'){assert(!options.write,'repeated --write');options.write=true;continue;}assert(['--request-id','--report'].includes(key)&&!options[key]&&args[index+1]&&!args[index+1].startsWith('--'),'unknown, repeated or incomplete argument');options[key]=args[++index];}
  assert(options['--request-id']&&(action==='resume'?options.write===true:!options.write),'resume requires --write; inspect is read-only');
  const root=ROOT,readGithub=githubPackTransport(),store=gitPackQueueStore({directory:path.join(root,'runtime/dealer-pack-deploy-cache/queue.git')}),provider=cloudflarePackProvider({api:tokenCloudflareTransport()});
  const registry=JSON.parse(fs.readFileSync(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'),'utf8'));
  const report=await reconcileOwnedPackCreation({store,provider,requestId:options['--request-id'],readGithub,registry,write:action==='resume'});
  if(options['--report']){const file=path.resolve(options['--report']);assert(file.startsWith(path.join(root,'runtime')+path.sep),'reports must remain in generated runtime output');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}
  console.log(JSON.stringify(report,null,2));return report;
}
if(isEntrypoint(import.meta.url))runPackReconciliationCli().catch(error=>{console.error(error.message);process.exitCode=1;});
