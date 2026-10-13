// Compose passed UK native artifacts without recompiling applications or deploying a provider.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {inflateRawSync} from 'node:zlib';
import {createRequire} from 'node:module';
import {packageUkSingleWorker} from './package-uk-single-worker.mjs';
const keys=['auto-best','modern','import','app','mobile','karento-best','router'];
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const request=read('docs/releases/cloudflare-existing25-20261011/retained-uk-compose-request.json');
assert(request.schemaVersion===1&&request.mode==='compose-passed-native'&&request.dealers.length===5);
assert(new Set(request.dealers.map(x=>x.dealer)).size===5);
for(const row of request.dealers){assert(/^[a-z0-9-]+$/.test(row.dealer));assert(row.run.status==='completed'&&row.run.conclusion==='success'&&row.run.run_attempt===1&&row.run.path==='.github/workflows/build-uk-cloudflare.yml');assert(row.artifacts.length===7&&JSON.stringify(row.artifacts.map(x=>x.key).sort())===JSON.stringify([...keys].sort()));}
if(process.argv[2]==='matrix'){process.stdout.write(JSON.stringify({include:request.dealers.map(x=>({dealer:x.dealer}))}));process.exit(0);}
assert(process.argv[2]==='compose');
const dealer=process.argv[3],row=request.dealers.find(x=>x.dealer===dealer);assert(row);
const apiRoot='https://api.github.com/repos/darkapoparka/cars';
const api=async suffix=>{const r=await fetch(apiRoot+suffix,{headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+process.env.GITHUB_TOKEN,'X-GitHub-Api-Version':'2022-11-28'},signal:AbortSignal.timeout(120000)});assert(r.ok,'Original metadata request failed: '+r.status);return r.json();};
const run=await api('/actions/runs/'+row.run.id);
for(const key of ['id','run_attempt','head_sha','path','status','conclusion'])assert.equal(run[key],row.run[key]);
const originalArtifacts=(await api('/actions/runs/'+row.run.id+'/artifacts?per_page=100')).artifacts;
const root=path.join(process.env.RUNNER_TEMP,'retained-uk-native',dealer);
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const inputs={},received=[];
function extract(zip,destination){
 const end=zip.lastIndexOf(Buffer.from([80,75,5,6]));assert(end>=0);
 const count=zip.readUInt16LE(end+10);let cursor=zip.readUInt32LE(end+16),expanded=0;const seen=new Set();
 assert(count>0&&count<65535);
 for(let i=0;i<count;i++){
  assert(zip.readUInt32LE(cursor)===0x02014b50);
  const n=zip.readUInt16LE(cursor+28),ex=zip.readUInt16LE(cursor+30),co=zip.readUInt16LE(cursor+32),name=zip.subarray(cursor+46,cursor+46+n).toString('utf8'),method=zip.readUInt16LE(cursor+10),compressed=zip.readUInt32LE(cursor+20),bytes=zip.readUInt32LE(cursor+24),local=zip.readUInt32LE(cursor+42),mode=zip.readUInt32LE(cursor+38)>>>16;
  assert(name&&!name.startsWith('/')&&!name.includes('\\')&&!name.includes(':')&&!name.includes('\0')&&!name.split('/').includes('..')&&!seen.has(name)&&[0,8].includes(method)&&(mode&61440)!==40960);
  seen.add(name);assert(bytes<1024**3);expanded+=bytes;assert(expanded<4*1024**3);
  assert(zip.readUInt32LE(local)===0x04034b50);
  const start=local+30+zip.readUInt16LE(local+26)+zip.readUInt16LE(local+28);assert(start+compressed<=zip.length);
  const target=path.resolve(destination,name);assert(target.startsWith(path.resolve(destination)+path.sep));
  if(name.endsWith('/'))fs.mkdirSync(target,{recursive:true});
  else {const body=bytes===0?Buffer.alloc(0):method===0?zip.subarray(start,start+compressed):inflateRawSync(zip.subarray(start,start+compressed),{maxOutputLength:bytes});assert.equal(body.length,bytes);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,body,{flag:'wx'});}
  cursor+=46+n+ex+co;
 }
}
for(const key of keys){
 const expected=row.artifacts.find(x=>x.key===key),actual=originalArtifacts.find(x=>x.id===expected.id);assert(actual&&!actual.expired);
 for(const field of ['id','name','size_in_bytes','digest'])assert.equal(actual[field],expected[field]);
 assert.equal(actual.workflow_run.head_sha,row.run.head_sha);
 assert.equal(actual.name,'uk-cloudflare-compiled-'+dealer+'-'+key+'-'+run.id+'-'+run.run_attempt);
 const response=await fetch(apiRoot+'/actions/artifacts/'+actual.id+'/zip',{headers:{Authorization:'Bearer '+process.env.GITHUB_TOKEN},signal:AbortSignal.timeout(240000)});assert(response.ok,'Original artifact transfer failed: '+response.status);
 const zip=Buffer.from(await response.arrayBuffer());assert.equal(zip.length,actual.size_in_bytes);assert.equal('sha256:'+sha(zip),actual.digest);
 const directory=path.join(root,'original',key);fs.mkdirSync(directory,{recursive:true});extract(zip,directory);inputs[key]=directory;
 received.push({key,id:actual.id,name:actual.name,bytes:actual.size_in_bytes,digest:actual.digest,sourceCommit:run.head_sha});
 console.log(JSON.stringify({received:dealer,key,bytes:actual.size_in_bytes}));
}
const require=createRequire(path.resolve('.tooling/package.json'));
const destination=path.join(root,'single-worker'),receipt=packageUkSingleWorker({inputs,destination,expectedDealer:dealer,esbuild:require('esbuild')});
assert.equal(receipt.sourceCommit,run.head_sha);assert.equal(String(receipt.runId),String(run.id));assert.equal(receipt.workerCount,1);assert.equal(receipt.applicationCount,6);
const proof={schemaVersion:1,type:'retained-uk-native-composition',dealer,originalCompilation:{runId:run.id,attempt:run.run_attempt,sourceCommit:run.head_sha,path:run.path,conclusion:run.conclusion,artifacts:received},composition:{runId:Number(process.env.GITHUB_RUN_ID),attempt:Number(process.env.GITHUB_RUN_ATTEMPT),sourceCommit:process.env.GITHUB_SHA},outputDigest:receipt.outputDigest,sourceBuildRepeated:false,providerWrite:false};
fs.writeFileSync(path.join(destination,'original-composition-proof.json'),JSON.stringify(proof,null,2)+'\n');
if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,'directory='+destination+'\n');
console.log(JSON.stringify({dealer,applicationCount:receipt.applicationCount,workerCount:receipt.workerCount,assetFiles:receipt.assetFiles,serverBytes:receipt.serverBytes,directory:destination,sourceBuildRepeated:false,providerWrite:false}));

