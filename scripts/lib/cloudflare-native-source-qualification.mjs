/** Explicit private MAIN admission for an actual compiled Cloudflare singleton. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const oid=value=>/^[a-f0-9]{40}$/.test(value||'');
const digest=value=>/^[a-f0-9]{64}$/.test(value||'');
const keys=['auto-best','modern','import','app','mobile','karento-best'];
const fail='Exact compiled Cloudflare singleton and owner-authorized private MAIN proof required';
export function createCloudflareNativeSourceQualification({receiptBytes,deliveryBytes,artifactDigest,manifest}){
 assert([receiptBytes,deliveryBytes].every(bytes=>Buffer.isBuffer(bytes)&&bytes.length>0&&bytes.length<=8*1024**2),fail);
 const receipt=JSON.parse(receiptBytes);
 const proof={schemaVersion:1,kind:'cars-cloudflare-native-source-qualification',provider:'cloudflare',scope:'owner-authorized-existing-cloudflare-main',ownerAuthorizedMain:true,targetBranch:'main',dealer:receipt.dealer,repository:manifest.repository,sourceCommit:receipt.sourceCommit,sourceTree:receipt.sourceTree,inputDigest:receipt.inputDigest,sourceReleases:receipt.sourceReleases,workerName:receipt.workerName,publicOrigin:receipt.publicOrigin,canonicalComposition:receipt.canonicalComposition,outputDigest:receipt.outputDigest,artifactDigest,runId:receipt.runId,attempt:receipt.attempt,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,originalReceipt:{bytes:receiptBytes.length,sha256:hash(receiptBytes),content:receiptBytes.toString('utf8')},originalDelivery:{bytes:deliveryBytes.length,sha256:hash(deliveryBytes),content:deliveryBytes.toString('utf8')}};
 assert(Buffer.from(proof.originalReceipt.content).equals(receiptBytes),fail);
 assertCloudflareNativeSourceExport({sourceCommit:receipt.sourceCommit,assetDelivery:{provider:'cloudflare',projectMode:'single-worker',designCount:6,workerCount:1},qualification:proof},{branch:'main',manifest});
 return proof;
}
export function assertCloudflareNativeSourceExport(meta,{branch,manifest,productionPilot}={}){
 const p=meta?.qualification;
 assert(p?.schemaVersion===1&&p.kind==='cars-cloudflare-native-source-qualification'&&p.provider==='cloudflare'&&p.scope==='owner-authorized-existing-cloudflare-main'&&p.ownerAuthorizedMain===true&&branch==='main'&&p.targetBranch===branch&&productionPilot===undefined,fail);
 assert(meta.assetDelivery?.provider==='cloudflare'&&meta.assetDelivery.projectMode==='single-worker'&&meta.assetDelivery.designCount===6&&meta.assetDelivery.workerCount===1,fail);
 assert(p.nativeApproval===false&&p.hostedApproval===false&&p.globalReleaseApproval===false&&p.dealer===manifest?.slug&&p.repository===manifest?.repository&&p.sourceCommit===meta.sourceCommit&&oid(p.sourceCommit)&&oid(p.sourceTree)&&digest(p.inputDigest)&&digest(p.outputDigest)&&digest(p.artifactDigest),fail);
 assert(/^darkapoparka\/cars-[a-z0-9-]+$/.test(p.repository)&&/^cars-[a-z0-9-]+$/.test(p.workerName)&&p.publicOrigin==='https://'+p.workerName+'.darkapoparka1.workers.dev'&&manifest.shareIdentity?.publicOrigin===p.publicOrigin,fail);
 assert(Number.isSafeInteger(Number(p.runId))&&Number(p.runId)>0&&Number.isSafeInteger(Number(p.attempt))&&Number(p.attempt)>0,fail);
 assert(p.originalReceipt&&typeof p.originalReceipt.content==='string'&&Number.isSafeInteger(p.originalReceipt.bytes)&&p.originalReceipt.bytes>0&&p.originalReceipt.bytes<=8*1024**2,fail);
 const bytes=Buffer.from(p.originalReceipt.content);assert(bytes.length===p.originalReceipt.bytes&&hash(bytes)===p.originalReceipt.sha256,fail);const receipt=JSON.parse(bytes);
 for(const name of ['dealer','sourceCommit','sourceTree','inputDigest','sourceReleases','workerName','publicOrigin','outputDigest','runId','attempt','canonicalComposition'])assert.deepEqual(receipt[name],p[name],fail+': '+name);
 assert(receipt.schemaVersion===1&&receipt.applicationCount===6&&receipt.workerCount===1&&Array.isArray(receipt.composition?.inProcess)&&JSON.stringify([...receipt.composition.inProcess].sort())===JSON.stringify([...keys].sort())&&Array.isArray(receipt.composition.serviceBindings)&&receipt.composition.serviceBindings.length===0,fail);
 assert(p.originalDelivery&&typeof p.originalDelivery.content==='string'&&Number.isSafeInteger(p.originalDelivery.bytes)&&p.originalDelivery.bytes>0&&p.originalDelivery.bytes<=8*1024**2,fail);
 const deliveryBytes=Buffer.from(p.originalDelivery.content);assert(deliveryBytes.length===p.originalDelivery.bytes&&hash(deliveryBytes)===p.originalDelivery.sha256,fail);const delivery=JSON.parse(deliveryBytes);
 assert(delivery.schemaVersion===1&&delivery.kind==='existing-fleet-cloudflare-single-worker'&&delivery.status==='passed'&&delivery.compiled===true&&delivery.repository===p.repository&&delivery.sourceRepository==='darkapoparka/cars'&&delivery.accountId==='cb0007f242077bd759331f096eb75531',fail);
 for(const name of ['dealer','sourceCommit','sourceTree','inputDigest','sourceReleases','workerName','publicOrigin','outputDigest','canonicalComposition'])assert.deepEqual(delivery[name],p[name],fail+': delivery '+name);
 assert(String(delivery.runId)===String(p.runId)&&String(delivery.attempt)===String(p.attempt)&&delivery.artifactName==='existing-cf-single-worker-'+p.dealer+'-'+p.runId+'-'+p.attempt,fail);
 assert.deepEqual(Object.keys(p.sourceReleases||{}).sort(),[...keys].sort(),fail);assert.deepEqual(p.sourceReleases,manifest.templateSources,fail);
 for(const [key,s]of Object.entries(p.sourceReleases))assert(s.repository==='darkapoparka/cars'&&s.path==='templates/'+key&&oid(s.revision)&&oid(s.tree)&&digest(s.digest),fail);
 const c=p.canonicalComposition;
 assert(c?.schemaVersion===1&&c.kind==='cars-canonical-origin-wrapper-v2'&&c.wrapperVersion===2&&c.providerOrigin===p.publicOrigin&&c.toolRevision===p.sourceCommit&&digest(c.wrapperSha256)&&typeof c.ukDefault==='boolean'&&c.originalWorkerPath==='server/__cars_original_worker.mjs',fail);
 let canonical;try{canonical=new URL(c.canonicalOrigin);}catch{assert.fail(fail);}
 assert(canonical.origin===c.canonicalOrigin&&canonical.protocol==='https:'&&!canonical.username&&!canonical.password&&/^[a-z0-9][a-z0-9-]{0,63}\.webpreviews\.site$/.test(canonical.hostname),fail);
 return p;
}
