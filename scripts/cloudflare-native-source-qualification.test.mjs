import test from 'node:test';
import assert from 'node:assert/strict';
import {createCloudflareNativeSourceQualification,assertCloudflareNativeSourceExport} from './lib/cloudflare-native-source-qualification.mjs';
import {assertVercelQualificationExport} from './export-dealer.mjs';
function fixture({slug='demo',repository='darkapoparka/cars-demo',worker='cars-demo'}={}){
 const sourceCommit='a'.repeat(40),publicOrigin='https://'+worker+'.darkapoparka1.workers.dev';
 const sources=Object.fromEntries(['auto-best','modern','import','app','mobile','karento-best'].map(key=>[key,{repository:'darkapoparka/cars',path:'templates/'+key,revision:'b'.repeat(40),tree:'c'.repeat(40),digest:'d'.repeat(64)}]));
 const manifest={slug,repository,shareIdentity:{publicOrigin},templateSources:sources};
 const receipt={schemaVersion:1,dealer:slug,sourceCommit,sourceTree:'e'.repeat(40),inputDigest:'f'.repeat(64),sourceReleases:sources,workerName:worker,publicOrigin,outputDigest:'1'.repeat(64),runId:'1234',attempt:'1',applicationCount:6,workerCount:1,composition:{inProcess:Object.keys(sources),serviceBindings:[]},canonicalComposition:{schemaVersion:1,kind:'cars-canonical-origin-wrapper-v2',wrapperVersion:2,providerOrigin:publicOrigin,canonicalOrigin:'https://'+slug+'.webpreviews.site',toolRevision:sourceCommit,wrapperSha256:'2'.repeat(64),ukDefault:false,originalWorkerPath:'server/__cars_original_worker.mjs'}};
 const delivery={...receipt,kind:'existing-fleet-cloudflare-single-worker',status:'passed',compiled:true,sourceRepository:'darkapoparka/cars',repository,accountId:'cb0007f242077bd759331f096eb75531',artifactName:'existing-cf-single-worker-'+slug+'-1234-1'};
 const qualification=createCloudflareNativeSourceQualification({receiptBytes:Buffer.from(JSON.stringify(receipt)),deliveryBytes:Buffer.from(JSON.stringify(delivery)),artifactDigest:'3'.repeat(64),manifest});
 return {manifest,meta:{sourceCommit,qualification,assetDelivery:{provider:'cloudflare',projectMode:'single-worker',designCount:6,workerCount:1}}};
}
test('actual six-application singleton proof admits only existing private MAIN source',()=>{
 const {meta,manifest}=fixture();assertVercelQualificationExport(meta,{branch:'main',manifest});
 assert.equal(assertCloudflareNativeSourceExport(meta,{branch:'main',manifest}).nativeApproval,false);
 assert.throws(()=>assertVercelQualificationExport(meta,{branch:'codex/preview',manifest}));
});
test('registered repository and Worker names bind independently through actual delivery evidence',()=>{
 const {meta,manifest}=fixture({slug:'dm-auto-varna',repository:'darkapoparka/cars-dmautovarna',worker:'cars-dm-auto-varna'});
 assertVercelQualificationExport(meta,{branch:'main',manifest});
 meta.qualification.repository='darkapoparka/cars-foreign';manifest.repository=meta.qualification.repository;
 assert.throws(()=>assertVercelQualificationExport(meta,{branch:'main',manifest}));
});
test('cross-dealer, modified raw receipt and false runtime architecture are refused',()=>{
 for(const mutate of [f=>{f.manifest.slug='another';},f=>{f.meta.qualification.originalReceipt.content+=' ';},f=>{f.meta.assetDelivery.workerCount=7;},f=>{f.meta.qualification.sourceTree='0'.repeat(40);},f=>{f.meta.qualification.hostedApproval=true;}]){
  const f=fixture();mutate(f);assert.throws(()=>assertVercelQualificationExport(f.meta,{branch:'main',manifest:f.manifest}));
 }
});
test('ordinary Vercel provisional MAIN export remains refused',()=>{
 const {manifest}=fixture();const meta={sourceCommit:'a'.repeat(40),assetDelivery:{provider:'vercel'},qualification:{schemaVersion:1,kind:'cars-vercel-native-source-qualification',provider:'vercel',production:false,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,sourceCommit:'a'.repeat(40),dealer:'demo',repository:manifest.repository,publicOrigin:manifest.shareIdentity.publicOrigin,targetBranch:'codex/preview'}};
 assert.throws(()=>assertVercelQualificationExport(meta,{branch:'main',manifest}),/preview branch/);
});
