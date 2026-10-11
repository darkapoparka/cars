import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {artifactInventory} from '../lib/uk-cloudflare-artifacts.mjs';
import {filesAt,sha256} from '../lib/workflow.mjs';
import {singleWorkerSource} from '../package-uk-single-worker.mjs';
import {COMPOSITION_KEYS} from '../package-dealer-single-worker.mjs';
import {SINGLETON_KIND,SINGLETON_ACCOUNT,singletonArtifactName} from '../assemble-existing-fleet-single-worker.mjs';

export const writeFixture=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof value==='string'||Buffer.isBuffer(value)?value:JSON.stringify(value,null,2)+'\n');};
export const fixtureReleases=()=>Object.fromEntries(COMPOSITION_KEYS.filter(k=>k!=='router').map(k=>[k,{repository:'darkapoparka/cars',revision:'1'.repeat(40),tree:'2'.repeat(40),digest:'3'.repeat(64),path:'templates/'+k}]));
export const fixtureVariants=(workerName,second='modern')=>[{key:'auto-best',base:'',entry:'/'},{key:second,base:'/variant-2',entry:second==='modern'?'/variant-2/cars':'/variant-2/'},{key:second==='modern'?'import':'modern',base:'/variant-3',entry:'/variant-3/'},{key:'app',base:'/variant-4',entry:'/variant-4/'},{key:'mobile',base:'/variant-5',entry:'/variant-5/'},{key:'karento-best',base:'/variant-6',entry:'/variant-6/'}].map(v=>({...v,binding:'CARS_'+v.key.toUpperCase().replaceAll('-','_'),worker:workerName+'-'+(v.key==='karento-best'?'signature':v.key)}));

export function tinyArea(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-fleet-single-test-'));fs.mkdirSync(path.join(root,'runtime'));t.after(()=>{
 const resolved=fs.realpathSync(root),parent=fs.realpathSync(os.tmpdir()),relative=path.relative(parent,resolved);if(!relative.startsWith('cars-fleet-single-test-')||relative.includes(path.sep)||path.isAbsolute(relative))throw Error('Unsafe fixture cleanup');fs.rmSync(resolved,{recursive:true,force:true});});return root;}

export function writeTinySingleton(directory,{client='navara-car',workerName='cars-navaracar',second='modern',runId='12345',attempt='1',sourceCommit='4'.repeat(40),sourceTree='5'.repeat(40),inputDigest='6'.repeat(64),sourceReleases=fixtureReleases()}={}){
 const publicOrigin='https://'+workerName+'.darkapoparka1.workers.dev',repository='darkapoparka/'+workerName,variants=fixtureVariants(workerName,second);
 const config={name:workerName,main:'server/worker.mjs',base_dir:'server',compatibility_date:'2026-10-10',compatibility_flags:['nodejs_compat'],workers_dev:true,preview_urls:false,no_bundle:true,find_additional_modules:true,rules:[{type:'ESModule',globs:['**/*.js','**/*.mjs'],fallthrough:true},{type:'CompiledWasm',globs:['**/*.wasm'],fallthrough:true}],observability:{enabled:true},assets:{directory:'./public',binding:'ASSETS',run_worker_first:false}};
 writeFixture(path.join(directory,'wrangler.json'),config);writeFixture(path.join(directory,'server/worker.mjs'),singleWorkerSource());writeFixture(path.join(directory,'server/router.mjs'),'export default {fetch(){return new Response("router");}};');
 for(const key of COMPOSITION_KEYS.filter(k=>k!=='router'))writeFixture(path.join(directory,'server',key,['modern','app','mobile'].includes(key)?'index.js':'index.mjs'),'export default {fetch(){return new Response("'+key+'");}};');
 writeFixture(path.join(directory,'public/fixture.txt'),'tiny preserved asset');
 const files=filesAt(directory,{filter:()=>true}).map(p=>{const b=fs.readFileSync(path.join(directory,p));return {path:p,bytes:b.length,sha256:sha256(b)};}),outputDigest=sha256(JSON.stringify(files));
 const artifacts=Object.fromEntries(COMPOSITION_KEYS.map(k=>[k,{digest:'7'.repeat(64),compiledDigest:'8'.repeat(64)}]));
 const receipt={schemaVersion:1,type:'cars-existing-fleet-single-worker-provider-package',dealer:client,sourceCommit,sourceTree,inputDigest,sourceReleases,accountId:SINGLETON_ACCOUNT,runId,attempt,publicOrigin,workerName,workerCount:1,applicationCount:6,composition:{inProcess:COMPOSITION_KEYS.filter(k=>k!=='router'),serviceBindings:[]},frameworkGlobalScopes:['modern','app','mobile'],serverBytes:files.filter(r=>r.path.startsWith('server/')).reduce((s,r)=>s+r.bytes,0),compressedBytes:300,assetFiles:1,esbuildVersion:'0.28.2',files,outputDigest,artifacts,sourceApplicationBytesChanged:false,compiledApplicationBytesChanged:true,hostedVerified:false};
 const composition={schemaVersion:1,type:'cars-dealer-single-worker-composition',inputKind:'existing-fleet',client,repository,sourceRepository:'darkapoparka/cars',sourceCommit,sourceIdentity:{sourceTree,inputDigest,sourceReleases},publicOrigin,workerName,variants,reviewed:true,reviewedAt:'2026-10-11T08:00:00Z',compositionWritten:true,independentSource:false,workerCount:1,applicationCount:6,serviceBindings:[],deployments:0,hostedVerified:false,outputDigest,artifacts:Object.fromEntries(COMPOSITION_KEYS.map(k=>[k,{artifactDigest:artifacts[k].digest,compiledDigest:artifacts[k].compiledDigest,directory:'/fixture/'+k}]))};
 const delivery={schemaVersion:1,kind:SINGLETON_KIND,status:'passed',dealer:client,repository,sourceRepository:'darkapoparka/cars',sourceCommit,sourceTree,inputDigest,sourceReleases,accountId:SINGLETON_ACCOUNT,runId,attempt,publicOrigin,workerName,artifactName:singletonArtifactName(client,runId,attempt),inputs:artifacts,outputDigest,node:'v26.10.0',wranglerVersion:'4.149.0',esbuildVersion:'0.28.2',compiled:true,dryRun:true,credentialsIncluded:false,deploymentPerformed:false,hostedVerified:false,ownerAccepted:false};
 writeFixture(path.join(directory,'single-worker-receipt.json'),receipt);writeFixture(path.join(directory,'dealer-composition-review.json'),composition);writeFixture(path.join(directory,'delivery-receipt.json'),delivery);
 const inventory=artifactInventory(directory,{kind:SINGLETON_KIND,dealer:client,status:'passed'});
 const registry={dealers:[{slug:client,repository,canonicalSourceRepository:'darkapoparka/cars',variants:variants.map(({binding,worker,...v})=>v)}]};
 return {directory,receipt,composition,delivery,config,inventory,registry,client,workerName,publicOrigin,repository};
}

export function writeTinyNativeInputs(inputRoot,options={}){
 const {client='navara-car',workerName='cars-navaracar',runId='12345',attempt='1',sourceCommit='4'.repeat(40),sourceTree='5'.repeat(40),inputDigest='6'.repeat(64),sourceReleases=fixtureReleases()}=options;
 const publicOrigin='https://'+workerName+'.darkapoparka1.workers.dev',inputs={};
 for(const key of COMPOSITION_KEYS){const directory=path.join(inputRoot,'existing-cf-'+client+'-'+key+'-'+runId+'-'+attempt);inputs[key]=directory;
  const mainPath=key==='router'?'compiled/cloudflare/router.mjs':['modern','app','mobile'].includes(key)?'compiled/'+key+'/dist/server/index.js':'compiled/'+key+'/.cars-cloudflare/worker/index.js',assetPath='compiled/'+key+'/public';
  writeFixture(path.join(directory,mainPath),key==='router'?'export default createDealerRouter('+JSON.stringify({variants:fixtureVariants(workerName),redirects:[]})+');\n':'export default {fetch(){return new Response("tiny");}};');
  writeFixture(path.join(directory,'compiled/deploy.json'),{name:key==='router'?workerName:workerName+'-'+(key==='karento-best'?'signature':key)});writeFixture(path.join(directory,assetPath,'fixture.txt'),'tiny '+key);
  const compiledFiles=filesAt(path.join(directory,'compiled'),{filter:()=>true}).map(p=>{const b=fs.readFileSync(path.join(directory,'compiled',p));return {path:'compiled/'+p,bytes:b.length,sha256:sha256(b)};});
  const deploy={schemaVersion:1,kind:'existing-fleet-cloudflare-compiled-candidate',dealer:client,key,provider:'cloudflare',accountId:SINGLETON_ACCOUNT,workerName:key==='router'?workerName:workerName+'-'+(key==='karento-best'?'signature':key),publicOrigin,sourceCommit,sourceTree,inputDigest,sourceReleases,configPath:'compiled/deploy.json',mainPath,assetPath,compiledFiles,compiledDigest:sha256(JSON.stringify(compiledFiles)),runId,attempt,compiled:true,dryRun:true,hosted:false,credentialsIncluded:false,nativeApproval:false};
  writeFixture(path.join(directory,'deploy.json'),deploy);writeFixture(path.join(directory,'receipts/source.json'),{...deploy,originalSourceUnchanged:true});writeFixture(path.join(directory,'receipts/build.json'),{...deploy,status:'passed'});artifactInventory(directory,{kind:deploy.kind,dealer:client,key,status:'passed'});
 }return inputs;
}

/** Minimal stored ZIP for tiny fixtures, including correct CRCs; no archive utility or build. */
export function tinyZip(directory){const parts=[],central=[];let offset=0;for(const name of filesAt(directory,{filter:()=>true})){
 const data=fs.readFileSync(path.join(directory,name)),filename=Buffer.from(name);let crc=0xffffffff;for(const byte of data){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}crc=(crc^0xffffffff)>>>0;
 const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(20,4);local.writeUInt32LE(crc,14);local.writeUInt32LE(data.length,18);local.writeUInt32LE(data.length,22);local.writeUInt16LE(filename.length,26);
 const row=Buffer.alloc(46);row.writeUInt32LE(0x02014b50,0);row.writeUInt16LE(20,4);row.writeUInt16LE(20,6);row.writeUInt32LE(crc,16);row.writeUInt32LE(data.length,20);row.writeUInt32LE(data.length,24);row.writeUInt16LE(filename.length,28);row.writeUInt32LE(offset,42);
 parts.push(local,filename,data);central.push(row,filename);offset+=local.length+filename.length+data.length;
 }const directoryBytes=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(central.length/2,8);end.writeUInt16LE(central.length/2,10);end.writeUInt32LE(directoryBytes.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...parts,directoryBytes,end]);}
