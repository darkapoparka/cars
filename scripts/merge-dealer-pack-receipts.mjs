/** Produce a reviewable registry update from authenticated per-pack queue receipts.
 * Four pack branches never edit a shared inventory. One coordinator merges this
 * output later; existing fleet rows and their histories are preserved exactly.
 */
import fs from 'node:fs';
import path from 'node:path';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {ROOT,json} from './lib/workflow.mjs';
import {validatePackQueue,queueDigest,githubPackQueueStore} from './lib/dealer-pack-queue.mjs';
import {validatePackDeploymentIdentity} from './lib/dealer-pack-deployment.mjs';
import {githubPackTransport} from './deploy-dealer-packs.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};

export function mergePackDeploymentReceipts({registry,queue,readPack,now=new Date().toISOString()}={}) {
  assert(Array.isArray(registry?.dealers)&&typeof readPack==='function','Current registry and retained pack reader required');validatePackQueue(queue);
  const result=structuredClone(registry),changes=[];
  for(const [slug,history] of Object.entries(queue.receipts).sort(([a],[b])=>a.localeCompare(b,'en'))){
    const envelope=[...history].reverse().find(row=>['deployed','rolled-back'].includes(row.receipt.status));if(!envelope)continue;
    const receipt=envelope.receipt;assert(envelope.sha256===queueDigest(receipt),'Receipt bytes differ');
    const queued=queue.requests[receipt.requestId];assert(queued,'Receipt has no durable request');
    validatePackDeploymentIdentity({request:queued.request,queue,registry:result});
    const {manifest,facts}=readPack(slug);assert(manifest.slug===slug&&manifest.dealerId===receipt.dealerId&&manifest.pack?.benchmarkOnly!==true,'Receipt pack identity differs');
    const existingIndex=result.dealers.findIndex(row=>row.slug===slug),previous=existingIndex<0?null:result.dealers[existingIndex];
    if(previous){assert(previous.sourceFormat==='dealer-pack'&&previous.newPackDeployment?.queueId===queue.queueId,'Cannot replace an existing fleet inventory row');if(previous.newPackDeployment.receiptSha256===envelope.sha256)continue;}
    const business=facts.business??facts;
    const record={...(previous??{}),slug,id:manifest.dealerId,name:business.name,sourceFormat:'dealer-pack',localPath:'dealers/'+slug,localPresent:true,repository:'darkapoparka/cars',canonicalSourceRepository:'darkapoparka/cars',canonicalSourceCommit:receipt.sourceCommit,
      packagingVersion:'5',variants:manifest.variants.map(variant=>({...variant,publicUrl:new URL(variant.entry,receipt.publicOrigin).href,state:receipt.hostedVerified?'live-verified':'deployed-unverified',qaRecorded:receipt.hostedVerified,templateSource:manifest.templateSources[variant.key]})),
      delivery:{provider:'cloudflare',state:receipt.hostedVerified?'live-verified':'deployed-unverified',workerName:receipt.workerName,workerId:receipt.workerId,versionId:receipt.versionId,routeId:receipt.routeId,configuredPublicOrigin:receipt.publicOrigin,url:receipt.publicOrigin+'/',checkedAt:receipt.finishedAt},
      evidence:{source:{state:'committed',repository:receipt.sourceProof.repository,commit:receipt.sourceCommit,remoteVerified:receipt.sourceProof.verified},build:{state:'passed',outputDigest:receipt.outputDigest,packDigest:receipt.packDigest,releaseId:receipt.releaseId},deployment:{state:'deployed',workerId:receipt.workerId,versionId:receipt.versionId,receiptSha256:envelope.sha256},browser:{state:receipt.hostedVerified?'passed':'not-verified',reportSha256:receipt.hosted?.sha256??null,widths:[390],locales:[receipt.hosted?.report?.language??'en']},ownerReview:{state:'not-claimed',note:'Owner authorized preview deployment; this receipt does not claim dealer identity or visual approval.'}},
      newPackDeployment:{queueId:queue.queueId,queueBranch:queue.branch,requestId:receipt.requestId,receiptSha256:envelope.sha256,batch:receipt.batch,recordedAt:now},
      ...(previous?{deploymentHistory:[...(previous.deploymentHistory??[]),{recordedAt:now,previousDelivery:previous.delivery,previousReceiptSha256:previous.newPackDeployment.receiptSha256,reason:'Guarded same-pack version update'}]}:{})};
    if(previous)result.dealers[existingIndex]=record;else result.dealers.push(record);
    changes.push({slug,action:previous?'updated-own-pack':'added',receiptSha256:envelope.sha256,hostedVerified:receipt.hostedVerified});
  }
  if(changes.length)result.updatedAt=now;
  return {registry:result,changes,unchangedExistingRows:registry.dealers.filter(row=>!changes.some(change=>change.slug===row.slug)).length,providerWrites:0};
}

if(isEntrypoint(import.meta.url)){
  const args=process.argv.slice(2);
  if(args.includes('--help'))console.log('Usage: merge-dealer-pack-receipts.mjs --out PROPOSED_INVENTORY.json [--queue-state LOCAL_SNAPSHOT.json]\nDefault reads the authenticated durable GitHub queue. --queue-state produces an offline review proposal only. Never edits batch branches or writes Cloudflare. Review and integrate the generated registry in one coordinator PR.');
  else (async()=>{const options={};for(let i=0;i<args.length;i+=2){assert(['--out','--queue-state'].includes(args[i])&&args[i+1]&&!options[args[i]],'Invalid receipt integration arguments');options[args[i]]=args[i+1];}assert(options['--out'],'Use an explicit proposed inventory output path');
    const queue=options['--queue-state']?json(options['--queue-state']):(await githubPackQueueStore({request:githubPackTransport()}).read()).state;
    const result=mergePackDeploymentReceipts({registry:json(path.join(ROOT,'docs/DEPLOYMENT-INVENTORY.json')),queue,readPack:slug=>({manifest:json(path.join(ROOT,'dealers',slug,'dealer.json')),facts:json(path.join(ROOT,'dealers',slug,'business-facts.json'))})});
    const out=path.resolve(options['--out']);assert(out!==path.join(ROOT,'docs/DEPLOYMENT-INVENTORY.json'),'Write a reviewable proposed inventory; integrate it in the coordinator change');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result.registry,null,2)+'\n');console.log(JSON.stringify({output:out,changes:result.changes,unchangedExistingRows:result.unchangedExistingRows,queueAuthenticated:!options['--queue-state'],providerWrites:0},null,2));
  })().catch(error=>{console.error(error.message);process.exitCode=1;});
}
