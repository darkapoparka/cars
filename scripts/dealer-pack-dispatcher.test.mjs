import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {gitPackQueueStore} from './lib/dealer-pack-queue-git.mjs';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,PACK_QUEUE_BRANCH,createPackDeploymentQueue,packDeploymentRequest,enqueuePackDeployments,claimPackDeployment} from './lib/dealer-pack-queue.mjs';
import {validatePackSourceRun,validatePackActionArtifact,validatePackContractsJobs,readPackContractsGate,downloadPackActionArtifact,extractDeclaredPackArchive} from './dispatch-dealer-pack-queue.mjs';
import {initializePackQueueFile} from './init-dealer-pack-queue.mjs';
import {packMetricsRequest,assessPackMetrics} from './read-dealer-pack-metrics.mjs';

const sha=value=>createHash('sha256').update(value).digest('hex');
const at='2026-10-19T20:00:00.000Z',end='2026-10-19T20:05:00.000Z';
const policy={schemaVersion:1,kind:'cars-owner-authorized-pack-deployment',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,zoneName:'webpreviews.site',workersPlan:'paid',allowedScripts:500,minimumSpareScripts:0,ownerConfirmedPaid:true,allowNewPreviews:true,outreachApproved:false,authorizedAt:at,authorizationSource:'Explicit owner M2 instruction retained for this test.',reason:'The owner explicitly approved 400 new previews and a zero reserve policy for the last slot.',maximumNewDealers:400};
const sourceRun={id:123,repository:{full_name:'darkapoparka/cars'},head_repository:{full_name:'darkapoparka/cars'},head_sha:'a'.repeat(40),path:'.github/workflows/dealer-pack-pipeline.yml',event:'workflow_dispatch',status:'completed',conclusion:'failure',run_attempt:2};
const request=slug=>packDeploymentRequest({slug,dealerId:'gb-birmingham-'+slug,batch:1,workerName:'cars-'+slug,publicOrigin:'https://'+slug+'.webpreviews.site',packDigest:sha(slug+'pack'),releaseId:'cars-six-'+sha('release'),releaseDigest:sha('release'),outputDigest:sha(slug+'output'),sourceCommit:sourceRun.head_sha});
function temporary(t){const directory=fs.mkdtempSync(path.join(os.tmpdir(),'cars-pack-dispatch-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));return directory;}
function git(directory,args){const result=spawnSync('git',['-C',directory,...args],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);assert.equal(result.signal,null);return result.stdout.trim();}
function queueFixture(){return createPackDeploymentQueue({policy,now:at,queueId:'11111111-1111-4111-8111-111111111111',baseline:{accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,evidence:'authenticated-cloudflare-api',complete:true,observedAt:at,workerNames:['cars-protected'],routes:[],domains:[]}});}

test('actual Git CAS preserves all four enqueue batches, rejects a stale revision and keeps unrelated queue files',async t=>{
  const directory=temporary(t),seed=path.join(directory,'seed'),remote=path.join(directory,'queue.git');fs.mkdirSync(seed);fs.mkdirSync(remote);
  git(remote,['init','--bare','-q']);git(seed,['init','-q']);git(seed,['checkout','-qb',PACK_QUEUE_BRANCH]);fs.writeFileSync(path.join(seed,'queue.json'),JSON.stringify(queueFixture()));fs.writeFileSync(path.join(seed,'baseline-evidence.json'),'retained-exact-evidence\n');git(seed,['add','.']);git(seed,['-c','user.name=Queue test','-c','user.email=queue-test@example.invalid','commit','-qm','initial queue']);git(seed,['push','-q',remote,'HEAD:refs/heads/'+PACK_QUEUE_BRANCH]);
  const stores=Array.from({length:4},(_,index)=>gitPackQueueStore({directory:path.join(directory,'cache-'+index),remote,allowLocalTestRemote:true}));
  const stale=await stores[0].read(),groups=stores.map((_,batch)=>Array.from({length:3},(_,row)=>request('dealer-'+batch+'-'+row)));
  await Promise.all(stores.map((store,index)=>enqueuePackDeployments(store,groups[index])));
  const final=await stores[0].read();assert.equal(final.state.order.length,12);assert.equal(final.state.generation,4);
  const duplicate=await enqueuePackDeployments(stores[1],groups[0]);assert.equal(duplicate.value.added.length,0);assert.equal((await stores[1].read()).revision,final.revision);
  stale.state.generation++;assert.equal(await stores[0].compareAndSwap(stale.revision,stale.state),false);
  assert.equal(git(remote,['show',PACK_QUEUE_BRANCH+':baseline-evidence.json']),'retained-exact-evidence');
  const claims=await Promise.all(stores.slice(0,2).map((store,index)=>claimPackDeployment(store,{owner:'github:'+index})));
  assert.equal(claims.filter(row=>row.value.claimed).length,1);assert.equal((await stores[3].read()).state.active.owner,claims.find(row=>row.value.claimed).value.claim.owner);
});

test('queue bootstrap rejects truncated inventories and cannot overwrite an existing queue file',t=>{
  const directory=temporary(t),workers={accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,observedAt:at,count:1,total:1,workers:[{name:'cars-protected',id:'f'.repeat(32)}]},routes={observedAt:at,count:0,routes:[]},domains={accountId:PACK_DEPLOY_ACCOUNT,complete:true,observedAt:at,count:0,domains:[]},out=path.join(directory,'queue.json');
  const queue=initializePackQueueFile({workers,routes,domains,out,now:at});assert.equal(queue.policy.minimumSpareScripts,0);assert.equal(queue.baseline.workerNames.length,1);
  assert.throws(()=>initializePackQueueFile({workers:{...workers,total:100},routes,domains}),/complete authenticated/);assert.throws(()=>initializePackQueueFile({workers,routes,domains:{...domains,complete:false}}),/Custom Domain/);assert.throws(()=>initializePackQueueFile({workers,routes,domains,out}),/EEXIST/);
});

test('artifact metadata requires exact source/run/digest and permits an independently failed lane only after shared contracts',()=>{
  assert.equal(validatePackSourceRun(sourceRun,123),sourceRun);
  for(const altered of [{head_repository:{full_name:'someone/fork'}},{path:'.github/workflows/other.yml'},{status:'in_progress'},{head_sha:'main'}])assert.throws(()=>validatePackSourceRun({...sourceRun,...altered},123),/same-repository/);
  const artifact={id:7,name:'dealer-pack-transport--123--lane-0--manifest',expired:false,digest:'sha256:'+sha('zip'),size_in_bytes:32,workflow_run:{id:123,head_sha:sourceRun.head_sha}};
  assert.equal(validatePackActionArtifact(artifact,{run:sourceRun,name:artifact.name}),artifact);
  assert.throws(()=>validatePackActionArtifact({...artifact,expired:true},{run:sourceRun}),/unexpired/);assert.throws(()=>validatePackActionArtifact({...artifact,workflow_run:{id:124,head_sha:sourceRun.head_sha}},{run:sourceRun}),/same-run/);assert.throws(()=>validatePackActionArtifact(artifact,{run:sourceRun,expected:{id:7,name:artifact.name,digest:'sha256:'+sha('changed'),bytes:32}}),/identity changed/);
  const gate={id:5,name:'contracts',run_id:123,head_sha:sourceRun.head_sha,status:'completed',conclusion:'success'};
  assert.equal(validatePackContractsJobs([gate],{run:sourceRun,attempt:1}).jobId,5);assert.throws(()=>validatePackContractsJobs([{...gate,conclusion:'failure'}],{run:sourceRun,attempt:2}),/contracts/);
});

test('latest actual shared contracts attempt controls reruns; a prior pass cannot hide its new failure',async()=>{
  const gate={id:5,name:'contracts',run_id:123,head_sha:sourceRun.head_sha,status:'completed',conclusion:'success'},calls=[];
  const readGithub=async operation=>{calls.push(operation.path);const jobs=operation.path.includes('/attempts/2/')?[{...gate,name:'lane (2)',conclusion:'failure'}]:[gate];return {status:200,body:{total_count:jobs.length,jobs}};};
  assert.equal((await readPackContractsGate({run:sourceRun,readGithub})).attempt,1);assert.equal(calls.length,2);
  await assert.rejects(()=>readPackContractsGate({run:sourceRun,readGithub:async()=>({status:200,body:{total_count:1,jobs:[{...gate,conclusion:'failure'}]}})}),/contracts/);
});

test('signed artifact redirect receives no GitHub credential and downloaded bytes must match the authenticated digest',async t=>{
  const directory=temporary(t),bytes=Buffer.from('authenticated zip bytes'),artifact={id:44,size_in_bytes:bytes.length,digest:'sha256:'+sha(bytes)},token='test-github-token-never-forward',calls=[];
  const fetchImpl=async(url,options)=>{calls.push({url:String(url),options});return calls.length===1?new Response(null,{status:302,headers:{location:'https://artifact.blob.core.windows.net/archive.zip?sig=test'}}):new Response(bytes,{status:200});};
  const file=await downloadPackActionArtifact({artifact,out:path.join(directory,'archive.zip'),token,fetchImpl});assert.equal(calls[0].options.headers.Authorization,'Bearer '+token);assert.equal(calls[1].options.headers.Authorization,undefined);assert.deepEqual(fs.readFileSync(file),bytes);
  await downloadPackActionArtifact({artifact,out:file,token,fetchImpl:async()=>assert.fail('Verified local ZIP needs no second download')});
  await assert.rejects(()=>downloadPackActionArtifact({artifact:{...artifact,digest:'sha256:'+sha('wrong')},out:path.join(directory,'wrong.zip'),token,fetchImpl:async()=>new Response(bytes,{status:200})}),/authenticated digest/);assert.equal(fs.existsSync(path.join(directory,'wrong.zip.partial')),false);
  await assert.rejects(()=>downloadPackActionArtifact({artifact,out:path.join(directory,'redirect.zip'),token,fetchImpl:async()=>new Response(null,{status:302,headers:{location:'https://attacker.example/archive.zip'}})}),/known HTTPS Actions/);
});

function zip(entries){let offset=0;const chunks=[],directory=[];for(const entry of entries){const name=Buffer.from(entry.name),content=Buffer.from(entry.content),local=Buffer.alloc(30),central=Buffer.alloc(46);local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt32LE(content.length,18);local.writeUInt32LE(content.length,22);local.writeUInt16LE(name.length,26);central.writeUInt32LE(0x02014b50);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);central.writeUInt32LE(content.length,20);central.writeUInt32LE(content.length,24);central.writeUInt16LE(name.length,28);central.writeUInt32LE(offset,42);chunks.push(local,name,content);directory.push(central,name);offset+=local.length+name.length+content.length;}const central=Buffer.concat(directory),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(central.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...chunks,central,end]);}

test('real ZIP extraction reconstructs only declared sealed blobs and rejects extra or changed members',t=>{
  const directory=temporary(t),archive=path.join(directory,'artifact.zip'),content=Buffer.from('exact compiled output'),name='blobs/'+sha(content),files=[{path:name,bytes:content.length,sha256:sha(content)}];fs.writeFileSync(archive,zip([{name,content}]));
  const out=extractDeclaredPackArchive({archive,out:path.join(directory,'good'),files});assert.deepEqual(fs.readFileSync(path.join(out,name)),content);
  fs.writeFileSync(archive,zip([{name,content},{name:'extra.txt',content:'bad'}]));assert.throws(()=>extractDeclaredPackArchive({archive,out:path.join(directory,'extra'),files}),/undeclared/);
  fs.writeFileSync(archive,zip([{name,content:'changed'}]));assert.throws(()=>extractDeclaredPackArchive({archive,out:path.join(directory,'changed'),files}),/exact manifest/);
  fs.writeFileSync(archive,zip([{name:'../outside',content}]));assert.throws(()=>extractDeclaredPackArchive({archive,out:path.join(directory,'escape'),files:[{path:'../outside'}]}),/sealed content/);
});

test('runtime evidence converts documented microseconds/bytes and leaves absent samples unavailable',()=>{
  const options={slug:'dealer-one',start:at,end,startupTimeMs:32},empty={status:200,success:true,result:{viewer:{accounts:[{workersInvocationsAdaptive:[]}]}}};
  const waiting=assessPackMetrics(empty,options);assert.equal(waiting.status,'awaiting-ingestion');assert.equal(waiting.maxP99CpuMs,null);assert.equal(waiting.maxP99MemoryMiB,null);
  const row={dimensions:{scriptName:'cars-dealer-one',status:'success'},sum:{requests:6,errors:0},quantiles:{cpuTimeP50:2500,cpuTimeP99:15000,memoryUsageBytesP50:1024**2,memoryUsageBytesP99:1.5*1024**2}},reply=structuredClone(empty);reply.result.viewer.accounts[0].workersInvocationsAdaptive=[row];
  const report=assessPackMetrics(reply,options);assert.equal(report.maxP99CpuMs,15);assert.equal(report.maxP99MemoryMiB,1.5);assert.equal(report.status,'observed-without-errors');assert.equal(report.startupTimeMs,32);
  row.sum.errors=1;assert.equal(assessPackMetrics(reply,options).status,'observed-errors');row.sum.errors=0;row.dimensions.scriptName='cars-another';assert.throws(()=>assessPackMetrics(reply,options),/another Worker/);
  assert.throws(()=>packMetricsRequest({...options,end:'2026-10-21T20:00:00.000Z'}),/24hours/);
});
