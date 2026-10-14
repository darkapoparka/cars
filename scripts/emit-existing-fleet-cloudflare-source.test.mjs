import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {qualifiedFleetLocks,sealNativeSourcePackage} from './emit-existing-fleet-cloudflare-source.mjs';
import {createCloudflareNativeSourceQualification} from './lib/cloudflare-native-source-qualification.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const fixture=()=>fs.mkdtempSync(path.join(os.tmpdir(),'cars-cf-source-seal-'));
const put=(root,name,value)=>{const bytes=Buffer.from(JSON.stringify(value,null,2)+'\n'),file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);return {path:name,bytes:bytes.length,sha256:hash(bytes)};};
test('full source seal keeps the six frozen native locks requirement',t=>{
 const root=fixture(t);put(root,'.cars-cloudflare.json',{provider:'cloudflare',acceptance:{dependencyLocksFrozen:false}});
 assert.throws(()=>sealNativeSourcePackage(root,{manifest:{},sourceCommit:'a'.repeat(40)}),/All six native dependency locks/);
 assert(!fs.existsSync(path.join(root,'.cars-package.json')));
});
test('source package seal uses ordinary payload hashes and reports provisional native evidence',t=>{
 const root=fixture(t),sourceCommit='a'.repeat(40),publicOrigin='https://cars-demo.darkapoparka1.workers.dev',sourceReleases=Object.fromEntries(['auto-best','modern','import','app','mobile','karento-best'].map(key=>[key,{repository:'darkapoparka/cars',path:'templates/'+key,revision:'b'.repeat(40),tree:'c'.repeat(40),digest:'d'.repeat(64)}]));
 const manifest={slug:'demo',repository:'darkapoparka/cars-demo',packaging:{version:'5'},shareIdentity:{publicOrigin},templateSources:sourceReleases};
 put(root,'.cars-cloudflare.json',{provider:'cloudflare',acceptance:{dependencyLocksFrozen:true}});put(root,'dealer.json',manifest);put(root,'auto-best/site.json',{name:'Preserved dealer'});
 const receipt={schemaVersion:1,dealer:'demo',sourceCommit,sourceTree:'e'.repeat(40),inputDigest:'f'.repeat(64),sourceReleases,workerName:'cars-demo',publicOrigin,outputDigest:'1'.repeat(64),runId:'1234',attempt:'1',applicationCount:6,workerCount:1,composition:{inProcess:Object.keys(sourceReleases),serviceBindings:[]},canonicalComposition:{schemaVersion:1,kind:'cars-canonical-origin-wrapper-v2',wrapperVersion:2,providerOrigin:publicOrigin,canonicalOrigin:'https://demo.webpreviews.site',toolRevision:sourceCommit,wrapperSha256:'2'.repeat(64),ukDefault:false,originalWorkerPath:'server/__cars_original_worker.mjs'}};
 const delivery={...receipt,kind:'existing-fleet-cloudflare-single-worker',status:'passed',compiled:true,sourceRepository:'darkapoparka/cars',repository:manifest.repository,accountId:'cb0007f242077bd759331f096eb75531',artifactName:'existing-cf-single-worker-demo-1234-1'};
 const qualification=createCloudflareNativeSourceQualification({receiptBytes:Buffer.from(JSON.stringify(receipt)),deliveryBytes:Buffer.from(JSON.stringify(delivery)),artifactDigest:'3'.repeat(64),manifest});
 const result=sealNativeSourcePackage(root,{manifest,sourceCommit,qualification});
 assert.match(result.digest,/^[a-f0-9]{64}$/);const meta=JSON.parse(fs.readFileSync(path.join(root,'.cars-package.json')));
 assert.deepEqual(meta.qualification,qualification);assert.equal(meta.payload.length,3);assert.equal(meta.assetDelivery.designCount,6);assert.equal(meta.assetDelivery.projectMode,'single-worker');assert.deepEqual(meta.canonicalComposition,receipt.canonicalComposition);
 assert.throws(()=>sealNativeSourcePackage(root,{manifest,sourceCommit:'a'.repeat(40)}),/already sealed/);
});
test('native lock intake rejects any unsealed receipt before packaging',t=>{
 const root=fixture(t),input=path.join(root,'auto-best');fs.mkdirSync(input);const seal=put(input,'receipts/.cars-cloudflare-svelte-locks.json',{'auto-best':{schemaVersion:1}});
 const files=[seal];put(input,'artifact-manifest.json',{schemaVersion:1,files,digest:hash(Buffer.from(JSON.stringify(files))),bytes:seal.bytes});
 fs.appendFileSync(path.join(input,seal.path),' ');
 assert.throws(()=>qualifiedFleetLocks({'auto-best':input}),/Native dependency receipt changed/);
});
test('each of the six native targets supplies its own authenticated frozen lock',t=>{
 const root=fixture(t),inputs={};
 for(const key of ['auto-best','modern','import','app','mobile','karento-best']){
  const directory=path.join(root,key);inputs[key]=directory;
  const next=['modern','app','mobile'].includes(key),name=next?'receipts/.cars-next-'+key+'-frozen-lock.json':'receipts/.cars-cloudflare-svelte-locks.json';
  const files=[put(directory,name,next?{schemaVersion:1,key}:{[key]:{schemaVersion:1}})];put(directory,'artifact-manifest.json',{schemaVersion:1,files,digest:hash(Buffer.from(JSON.stringify(files))),bytes:files[0].bytes});
 }
 const locks=qualifiedFleetLocks(inputs);assert.equal(Object.keys(locks.svelte).length,3);assert.equal(locks.next.length,3);assert.equal(locks.next[0].key,'modern');
});
