/** Integrate authenticated pack receipts without rescanning or rewriting the fleet.
 * Names and declared designs come from each deployment's immutable Git inputs,
 * even when the current checkout already contains later research or revisions.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {ROOT,json,sha256,validateManifest} from './lib/workflow.mjs';
import {PACK_QUEUE_REPOSITORY,validatePackQueue,queueDigest} from './lib/dealer-pack-queue.mjs';
import {gitPackQueueStore} from './lib/dealer-pack-queue-git.mjs';
import {validatePackDeploymentIdentity} from './lib/dealer-pack-deployment.mjs';
import {validateRegistry,writeRegistryViews} from './index-deployments.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
const hex40=value=>/^[a-f0-9]{40}$/.test(value??'');
const hex64=value=>/^[a-f0-9]{64}$/.test(value??'');
const sourcePath=slug=>'dealers/'+slug;
const sourceRemote='https://github.com/'+PACK_QUEUE_REPOSITORY+'.git';
const safePath=name=>typeof name==='string'&&/^[A-Za-z0-9._/-]+$/.test(name)&&!name.startsWith('/')&&name.split('/').every(part=>part&&!['.','..'].includes(part));
const gitBlobHash=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const sortedInputRows=files=>[...files].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([name,data])=>({path:name,sha256:sha256(data)}));
export const PACK_RECEIPT_REGISTRY_FILES=Object.freeze(['docs/DEPLOYMENT-INVENTORY.json','docs/DEPLOYMENTS.md','clients/README.md','clients/index.json']);

function gitRead(root,args,{env=process.env,maxBuffer=26*1024**2}={}) {
  const result=spawnSync('git',['-C',root,...args],{env,maxBuffer,timeout:120000,windowsHide:true});
  if(result.status!==0||result.signal||!Buffer.isBuffer(result.stdout)){
    const error=Error('Exact published pack Git objects are unavailable; fetch the receipt sourceCommit from '+PACK_QUEUE_REPOSITORY+'. Git output and credentials were suppressed.');error.code='PACK_RECEIPT_SOURCE_UNAVAILABLE';throw error;
  }
  return result.stdout;
}

function validatePublicationProof(receipt) {
  const proof=receipt?.sourceProof;
  assert(hex40(receipt?.sourceCommit)&&proof?.verified===true&&proof.repository==='darkapoparka/cars'&&proof.commit===receipt.sourceCommit&&proof.path===sourcePath(receipt.slug)&&
    proof.evidence==='authenticated-github-commit-and-exact-git-blob-bytes'&&hex40(proof.sourceTree)&&hex64(proof.sourceTreeSha256)&&Number.isSafeInteger(proof.inputFiles)&&proof.inputFiles>0&&proof.inputFiles<=512,
    'Receipt lacks its exact authenticated published pack source proof');
  return proof;
}

/** Read the recorded commit, never dealer.json or facts from the current checkout.
 * No checkout, research migration, logo hydration, source edit or Git ref update.
 */
export function readPackReceiptSource({root=ROOT,receipt,readGit}={}) {
  const proof=validatePublicationProof(receipt),prefix=proof.path+'/',read=readGit??(args=>gitRead(root,args,{env:{...process.env,GIT_NO_LAZY_FETCH:'1'}}));
  const commit=read(['rev-parse','--verify',receipt.sourceCommit+'^{commit}']).toString('utf8').trim();assert(commit===receipt.sourceCommit,'Receipt source commit differs from the immutable Git commit');
  const tree=read(['rev-parse',receipt.sourceCommit+':'+proof.path]).toString('utf8').trim();assert(tree===proof.sourceTree,'Receipt published pack subtree differs');
  const rows=read(['ls-tree','-r','-z',receipt.sourceCommit,'--',proof.path]).toString('utf8').split('\0').filter(Boolean).map(line=>{
    const match=/^(100644|100755) blob ([a-f0-9]{40})\t(.+)$/.exec(line);assert(match&&match[3].startsWith(prefix),'Receipt source contains an unsafe non-file Git entry');
    const relative=match[3].slice(prefix.length);assert(safePath(relative),'Receipt source path is unsafe');return {path:relative,mode:match[1],sha:match[2]};
  });
  assert(rows.length===proof.inputFiles&&queueDigest(rows)===proof.sourceTreeSha256,'Receipt committed source inventory differs');
  const files=new Map();let total=0;
  for(const row of rows){const bytes=read(['cat-file','blob',row.sha]);assert(Buffer.isBuffer(bytes)&&bytes.length<=25*1024**2&&gitBlobHash(bytes)===row.sha,'Receipt source blob differs');total+=bytes.length;assert(total<=256*1024**2,'Receipt source exceeds the retained pack input budget');files.set(row.path,bytes);}
  return {sourceCommit:commit,sourceTree:tree,sourceTreeRows:rows,files,localPresent:fs.existsSync(path.join(root,proof.path))};
}

/** Missing historical inputs are fetched into an isolated bare object cache.
 * This reads only the authorized repository and does not update any batch ref.
 * Tokens remain in the child environment, never command arguments or reports.
 */
export function packReceiptSourceReader({root=ROOT,fetchMissing=false,token=process.env.GH_TOKEN??process.env.GITHUB_TOKEN,cacheDirectory=path.join(root,'runtime/dealer-pack-receipt-source.git')}={}) {
  let cacheReady=false;const fetched=new Set();
  const env={...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never',GIT_NO_LAZY_FETCH:'0'};
  if(token){env.GIT_CONFIG_COUNT='1';env.GIT_CONFIG_KEY_0='http.https://github.com/.extraheader';env.GIT_CONFIG_VALUE_0='AUTHORIZATION: basic '+Buffer.from('x-access-token:'+token).toString('base64');}
  const cachedRead=args=>gitRead(cacheDirectory,args,{env});
  return (slug,{receipt})=>{
    assert(slug===receipt.slug,'Receipt source reader slug differs');
    try{return readPackReceiptSource({root,receipt});}catch(error){if(!fetchMissing||error.code!=='PACK_RECEIPT_SOURCE_UNAVAILABLE')throw error;}
    assert(path.isAbsolute(cacheDirectory),'Receipt Git object cache needs an absolute generated directory');
    if(!cacheReady){
      fs.mkdirSync(cacheDirectory,{recursive:true,mode:0o700});
      if(!fs.existsSync(path.join(cacheDirectory,'HEAD'))){cachedRead(['init','--bare','--quiet']);cachedRead(['config','remote.origin.url',sourceRemote]);cachedRead(['config','remote.origin.promisor','true']);cachedRead(['config','remote.origin.partialclonefilter','blob:none']);}
      assert(cachedRead(['config','--get','remote.origin.url']).toString('utf8').trim()===sourceRemote,'Receipt source cache points to another repository');cacheReady=true;
    }
    if(!fetched.has(receipt.sourceCommit)){cachedRead(['fetch','--quiet','--no-tags','--no-write-fetch-head','--depth=1','--filter=blob:none','origin',receipt.sourceCommit]);fetched.add(receipt.sourceCommit);}
    return readPackReceiptSource({root,receipt,readGit:cachedRead});
  };
}

function latestReceipts(queue) {
  validatePackQueue(queue);
  return Object.entries(queue.receipts).sort(([a],[b])=>a.localeCompare(b,'en')).flatMap(([slug,history])=>{
    const envelope=[...history].reverse().find(row=>['deployed','rolled-back'].includes(row.receipt.status));return envelope?[{slug,envelope,history}]:[];
  });
}

function validateReceiptSource(queue,envelope,history,pack) {
  const receipt=envelope.receipt,request=queue.requests[receipt.requestId]?.request;validatePublicationProof(receipt);
  assert(request&&receipt.queueId===queue.queueId&&receipt.accountId===queue.accountId&&receipt.zoneId===queue.zoneId&&['slug','dealerId','workerName','publicOrigin','batch'].every(key=>receipt[key]===request[key]),'Receipt deployment identity differs from its durable request');
  let source=request;
  if(receipt.status==='rolled-back'){
    const target=history.find(row=>row.sha256===receipt.rollbackReceiptSha256);
    assert(request.action==='rollback'&&request.rollbackTo===receipt.rollbackReceiptSha256&&target&&history.indexOf(target)<history.indexOf(envelope)&&target.receipt.hostedVerified===true,'Rollback receipt lost its earlier hosted source binding');source=target.receipt;
  }
  assert(['packDigest','sourceCommit','releaseId','releaseDigest','outputDigest'].every(key=>receipt[key]===source[key]),'Receipt source/output differs from its durable deployment request');
  const files=pack?.sourceFiles??pack?.files;
  assert(pack?.sourceCommit===receipt.sourceCommit&&pack.sourceTree===receipt.sourceProof.sourceTree&&files instanceof Map&&files.size===receipt.sourceProof.inputFiles&&queueDigest(pack.sourceTreeRows)===receipt.sourceProof.sourceTreeSha256,'Receipt reader returned a different committed pack source');
  assert(pack.sourceTreeRows.every(row=>safePath(row.path)&&['100644','100755'].includes(row.mode)&&Buffer.isBuffer(files.get(row.path))&&gitBlobHash(files.get(row.path))===row.sha),'Receipt physical inputs differ from their published Git blobs');
  assert(sha256(JSON.stringify(sortedInputRows(files)))===receipt.packDigest,'Receipt physical pack digest differs from the deployed inputs');
  const read=name=>{assert(files.has(name),'Receipt pack input missing: '+name);return JSON.parse(files.get(name).toString('utf8'));};
  const manifest=validateManifest(read('dealer.json'),{allowDealerPackSource:true}),facts=read('business-facts.json');
  assert(manifest.slug===receipt.slug&&manifest.dealerId===receipt.dealerId&&manifest.sourceFormat==='dealer-pack'&&manifest.sourcePath===sourcePath(receipt.slug)&&manifest.pack?.benchmarkOnly!==true&&manifest.packaging?.version==='5','Receipt pack manifest identity differs');
  assert(typeof facts.business?.name==='string'&&facts.business.name.trim().length>0&&manifest.variants.every(variant=>manifest.templateSources?.[variant.key]),'Receipt pack lacks its published business name or template sources');
  return {manifest,facts,localPresent:pack.localPresent===true};
}

export function mergePackDeploymentReceipts({registry,queue,readPack,now=new Date().toISOString()}={}) {
  assert(Array.isArray(registry?.dealers)&&typeof readPack==='function','Current registry and retained pack reader required');
  const result=structuredClone(registry),changes=[];
  for(const {slug,envelope,history} of latestReceipts(queue)){
    const receipt=envelope.receipt;assert(envelope.sha256===queueDigest(receipt),'Receipt bytes differ');
    const queued=queue.requests[receipt.requestId];assert(queued,'Receipt has no durable request');
    validatePackDeploymentIdentity({request:queued.request,queue,registry:result});
    const {manifest,facts,localPresent}=validateReceiptSource(queue,envelope,history,readPack(slug,{receipt,request:queued.request}));
    const existingIndex=result.dealers.findIndex(row=>row.slug===slug),previous=existingIndex<0?null:result.dealers[existingIndex];
    if(previous){
      const prior=history.find(row=>row.sha256===previous.newPackDeployment?.receiptSha256);
      assert(previous.sourceFormat==='dealer-pack'&&previous.newPackDeployment?.queueId===queue.queueId&&prior&&prior.receipt.workerId===receipt.workerId&&previous.delivery?.workerId===prior.receipt.workerId&&previous.delivery?.versionId===prior.receipt.versionId&&previous.delivery?.routeId===prior.receipt.routeId&&previous.canonicalSourceCommit===prior.receipt.sourceCommit,'Cannot replace an existing fleet row or an unbound prior pack inventory row');
      if(previous.newPackDeployment.receiptSha256===envelope.sha256)continue;
    }
    const record={...(previous??{}),slug,id:manifest.dealerId,name:facts.business.name,sourceFormat:'dealer-pack',sourceOwnership:'cars-repository',sourcePath:sourcePath(slug),localPath:sourcePath(slug),localPresent,repository:PACK_QUEUE_REPOSITORY,canonicalSourceRepository:PACK_QUEUE_REPOSITORY,canonicalSourceRef:receipt.sourceCommit,canonicalSourceCommit:receipt.sourceCommit,canonicalSourceTree:receipt.sourceProof.sourceTree,
      packagingVersion:'5',variants:manifest.variants.map(variant=>({...variant,publicUrl:new URL(variant.entry,receipt.publicOrigin).href,state:receipt.hostedVerified?'live-verified':'deployed-unverified',qaRecorded:receipt.hostedVerified,templateSource:manifest.templateSources[variant.key]})),
      delivery:{provider:'cloudflare',state:receipt.hostedVerified?'live-verified':'deployed-unverified',workerName:receipt.workerName,workerId:receipt.workerId,versionId:receipt.versionId,routeId:receipt.routeId,configuredPublicOrigin:receipt.publicOrigin,url:receipt.publicOrigin+'/',checkedAt:receipt.finishedAt},
      evidence:{source:{state:'committed',repository:PACK_QUEUE_REPOSITORY,commit:receipt.sourceCommit,path:sourcePath(slug),tree:receipt.sourceProof.sourceTree,inputFiles:receipt.sourceProof.inputFiles,remoteVerified:true},build:{state:'passed',outputDigest:receipt.outputDigest,packDigest:receipt.packDigest,releaseId:receipt.releaseId},deployment:{state:'deployed',workerId:receipt.workerId,versionId:receipt.versionId,receiptSha256:envelope.sha256},browser:{state:receipt.hostedVerified?'passed':'not-verified',reportSha256:receipt.hosted?.sha256??null,widths:[390],locales:[receipt.hosted?.report?.language??'en']},ownerReview:{state:'not-claimed',note:'Owner authorized preview deployment; this receipt does not claim dealer identity or visual approval.'}},
      newPackDeployment:{queueId:queue.queueId,queueBranch:queue.branch,requestId:receipt.requestId,receiptSha256:envelope.sha256,batch:receipt.batch,recordedAt:now},
      ...(previous?{deploymentHistory:[...(previous.deploymentHistory??[]),{recordedAt:now,previousDelivery:previous.delivery,previousSourceCommit:previous.canonicalSourceCommit,previousReceiptSha256:previous.newPackDeployment.receiptSha256,reason:'Guarded same-pack version update'}]}:{})};
    if(previous)result.dealers[existingIndex]=record;else result.dealers.push(record);
    changes.push({slug,action:previous?'updated-own-pack':'added',sourceCommit:receipt.sourceCommit,receiptSha256:envelope.sha256,hostedVerified:receipt.hostedVerified});
  }
  if(changes.length)result.updatedAt=now;
  return {registry:result,changes,unchangedExistingRows:registry.dealers.filter(row=>!changes.some(change=>change.slug===row.slug)).length,sourceFilesScanned:'receipt-commits-only',providerWrites:0};
}

function retainedFile(file) {if(!fs.existsSync(file))return null;assert(fs.lstatSync(file).isFile()&&!fs.lstatSync(file).isSymbolicLink(),'Registry integration target must be a regular file');return fs.readFileSync(file);}
function sameFile(a,b){return a===null?b===null:b!==null&&a.equals(b);}

/** Explicit local integration is staged with the existing views-only generator.
 * A changed registry/view aborts before replacement. A write failure restores
 * the prior four files; none of the existing dealer source folders are scanned.
 */
export function integratePackDeploymentReceipts({root=ROOT,queue,queueAuthenticated=false,readPack=packReceiptSourceReader({root}),out,write=false,now=new Date().toISOString()}={}) {
  assert(!write||queueAuthenticated===true,'--write requires an authenticated durable queue; --queue-state is an offline proposal only');
  assert(write||out,'Choose a proposed inventory --out, or explicit --write integration');
  const paths=PACK_RECEIPT_REGISTRY_FILES.map(relative=>path.join(root,relative)),before=paths.map(retainedFile);assert(before[0],'Saved deployment inventory is missing');
  const destination=out?path.resolve(out):null;assert(!destination||!paths.includes(destination),'Proposed output cannot overwrite the registry or one of its generated views');
  const registry=JSON.parse(before[0].toString('utf8')),result=mergePackDeploymentReceipts({registry,queue,readPack,now}),preservedSourceWarnings=[];validateRegistry(result.registry,null,{preserveSourceRecords:registry.dealers,onPreservedSourceWarning:warning=>preservedSourceWarnings.push(warning)});
  const encoded=result.changes.length?Buffer.from(JSON.stringify(result.registry,null,2)+'\n'):before[0];
  const report={changes:result.changes,unchangedExistingRows:result.unchangedExistingRows,queueAuthenticated,sourceFilesScanned:result.sourceFilesScanned,preservedSourceWarnings,providerWrites:0,branchWrites:0,mode:write?'integrated':'proposal',filesWritten:[],...(destination?{output:destination}:{})};
  if(write){
    const staging=path.join(root,'runtime/dealer-pack-receipt-integration-'+randomUUID()),changed=[];
    try{
      fs.mkdirSync(path.join(staging,'docs'),{recursive:true});fs.mkdirSync(path.join(staging,'clients'),{recursive:true});fs.writeFileSync(path.join(staging,PACK_RECEIPT_REGISTRY_FILES[0]),encoded);writeRegistryViews(staging,{preserveSourceRecords:registry.dealers});
      const next=PACK_RECEIPT_REGISTRY_FILES.map(relative=>fs.readFileSync(path.join(staging,relative)));
      assert(paths.every((file,index)=>sameFile(before[index],retainedFile(file))),'Registry or generated views changed during receipt verification; retry against the new saved files');
      for(let index=0;index<paths.length;index++)if(!sameFile(before[index],next[index])){
        const temporary=paths[index]+'.receipt-'+randomUUID()+'.tmp';
        try{fs.writeFileSync(temporary,next[index],{flag:'wx',mode:before[index]===null?0o644:fs.statSync(paths[index]).mode&0o777});fs.renameSync(temporary,paths[index]);changed.push(index);report.filesWritten.push(PACK_RECEIPT_REGISTRY_FILES[index]);}finally{fs.rmSync(temporary,{force:true});}
      }
    }catch(error){for(const index of changed.reverse()){if(before[index]===null)fs.rmSync(paths[index],{force:true});else fs.writeFileSync(paths[index],before[index]);}throw error;}
    finally{fs.rmSync(staging,{recursive:true,force:true});}
  }
  if(destination){fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,encoded);}
  return {...result,report};
}

if(isEntrypoint(import.meta.url)){
  const args=process.argv.slice(2);
  if(args.includes('--help'))console.log('Usage: merge-dealer-pack-receipts.mjs --out PROPOSED_INVENTORY.json [--queue-state LOCAL_SNAPSHOT.json]\n       merge-dealer-pack-receipts.mjs --write [--out PROPOSED_INVENTORY.json]\nDefault reads the authenticated durable GitHub queue. --queue-state is proposal-only. --write integrates verified receipts into docs/DEPLOYMENT-INVENTORY.json and regenerates docs/DEPLOYMENTS.md, clients/README.md and clients/index.json with the existing views-only generator. Source is read at each receipt sourceCommit; missing Git objects are fetched from darkapoparka/cars into a generated bare cache. No provider writes, batch branch edits or messages.');
  else (async()=>{
    const options={};for(let i=0;i<args.length;i++){const key=args[i];assert(['--out','--queue-state','--write'].includes(key)&&options[key]===undefined,'Invalid receipt integration arguments');if(key==='--write')options[key]=true;else{assert(args[i+1]&&!args[i+1].startsWith('--'),'Missing receipt integration argument');options[key]=args[++i];}}
    assert(options['--write']||options['--out'],'Use --out for a proposal or --write for explicit integration');assert(!(options['--write']&&options['--queue-state']),'--write requires an authenticated durable queue; --queue-state is proposal-only');
    const queueAuthenticated=!options['--queue-state'],queue=options['--queue-state']?json(options['--queue-state']):(await gitPackQueueStore({directory:path.join(ROOT,'runtime/dealer-pack-deploy-cache/queue.git')}).read()).state;
    const result=integratePackDeploymentReceipts({queue,queueAuthenticated,out:options['--out'],write:options['--write']===true,readPack:packReceiptSourceReader({root:ROOT,fetchMissing:queueAuthenticated})});console.log(JSON.stringify(result.report,null,2));
  })().catch(error=>{console.error(error.message);process.exitCode=1;});
}
