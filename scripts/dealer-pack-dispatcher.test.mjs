import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {gitPackQueueStore} from './lib/dealer-pack-queue-git.mjs';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,PACK_QUEUE_BRANCH,createPackDeploymentQueue,packDeploymentRequest,enqueuePackDeployments,claimPackDeployment} from './lib/dealer-pack-queue.mjs';
import {validatePackSourceRun,validatePackActionArtifact,validatePackContractsJobs,readPackContractsGate,validatePackProducerJob,readPackProducerGate,readPackActionJobLog,packArtifactResolver,runPackQueueDispatcher,downloadPackActionArtifact,extractDeclaredPackArchive} from './dispatch-dealer-pack-queue.mjs';
import {initializePackQueueFile} from './init-dealer-pack-queue.mjs';
import {packMetricsRequest,assessPackMetrics} from './read-dealer-pack-metrics.mjs';
import {canonicalPackJson} from './lib/dealer-pack-artifacts.mjs';

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

function producerFixture(lane=0){
  const run={...sourceRun,status:'in_progress',conclusion:null},prefix='dealer-pack-transport--123--lane-'+lane,contracts={jobId:5,runId:123,sourceCommit:run.head_sha,attempt:2,conclusion:'success'},time=second=>'2026-10-19T20:00:0'+second+'Z';
  const step=(name,number,start,end)=>({name,number,status:'completed',conclusion:'success',started_at:time(start),completed_at:time(end)}),job={id:66,name:'dealer-pack-producer-lane-'+lane,run_id:123,run_attempt:2,head_sha:run.head_sha,status:'completed',conclusion:'success',started_at:time(0),completed_at:time(6),steps:[step('Build and verify all lane packs independently',1,1,2),step('Seal deduplicated final bundle transport',2,2,3),step('Retain final bundle manifest',3,3,4),step('Retain deduplicated final blob shard 0',4,4,5)]};
  const artifacts=['manifest','shard-0'].map((suffix,index)=>({id:7+index,name:prefix+'--'+suffix,expired:false,digest:'sha256:'+sha(suffix),size_in_bytes:32+index,workflow_run:{id:123,head_sha:run.head_sha},created_at:time(3+index),updated_at:time(3+index)}));
  const block=(artifact,second)=>['100 ##[group]Run actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02','200 SHA256 digest of uploaded artifact zip is '+artifact.digest.slice(7),'300 Artifact '+artifact.name+' has been successfully uploaded! Final size is '+artifact.size_in_bytes+' bytes. Artifact ID is '+artifact.id].map(value=>'2026-10-19T20:00:0'+second+'.'+value.slice(0,3)+'Z '+value.slice(4)+'\n').join('');
  const log=artifacts.map((row,index)=>block(row,3+index)).join('');return {run,prefix,contracts,job,artifacts,log,block};
}

test('completed positive producing lane admits exact artifacts while another lane is still building',async()=>{
  const fixture=producerFixture(),calls=[];const proof=await readPackProducerGate({...fixture,readGithub:async operation=>{calls.push(operation.path);return {status:200,body:{total_count:2,jobs:[fixture.job,{...fixture.job,id:67,name:'dealer-pack-producer-lane-1',status:'in_progress',conclusion:null}]}};},readJobLog:async({jobId})=>{assert.equal(jobId,66);return fixture.log;}});
  assert.equal(proof.mode,'completed-producing-job');assert.equal(proof.attempt,2);assert.equal(proof.jobId,66);assert.deepEqual(proof.artifacts,fixture.artifacts.map(({id,digest})=>({id,digest})));assert.match(calls[0],/\/attempts\/2\/jobs$/);
  const workflow=fs.readFileSync(new URL('../.github/workflows/dealer-pack-pipeline.yml',import.meta.url),'utf8');assert.match(workflow,/name: dealer-pack-producer-lane-\$\{\{ matrix\.lane \}\}/);
  // Legacy failed source/lane survivors retain terminal behavior, with no new
  // requirement that a failed producer job or its old display name pass.
  assert.equal((await readPackProducerGate({run:sourceRun,readGithub:async()=>assert.fail('No producer gate for a terminal legacy run'),readJobLog:async()=>assert.fail('No legacy log requirement')})).mode,'completed-run');
});

test('multi-digit lane fourteen requires its own completed job and exact artifact upload proof',async()=>{
  const fixture=producerFixture(14),other={...fixture.job,id:67,name:'dealer-pack-producer-lane-4'};
  const proof=await readPackProducerGate({...fixture,readGithub:async()=>({status:200,body:{total_count:2,jobs:[other,fixture.job]}}),
    readJobLog:async({jobId})=>{assert.equal(jobId,fixture.job.id);return fixture.log;}});
  assert.equal(proof.prefix,'dealer-pack-transport--123--lane-14');assert.equal(proof.jobId,fixture.job.id);
  await assert.rejects(readPackProducerGate({...fixture,readGithub:async()=>({status:200,body:{total_count:1,jobs:[other]}}),
    readJobLog:async()=>assert.fail('A different numeric lane cannot supply producing proof')}),error=>error.code==='PACK_PRODUCER_PENDING');
  assert.throws(()=>validatePackProducerJob(fixture.job,{...fixture,log:fixture.log.replaceAll('--lane-14--','--lane-4--')}),/upload log/);
});

test('early intake refuses foreign, stale, running, failed or incompletely verified producing jobs',()=>{
  const fixture=producerFixture();assert.equal(validatePackProducerJob(fixture.job,fixture).jobId,66);
  for(const change of [{run_id:124},{head_sha:'b'.repeat(40)},{run_attempt:1},{name:'lane (0, dealer)'},{status:'in_progress',conclusion:null},{conclusion:'failure'},{completed_at:null}])assert.throws(()=>validatePackProducerJob({...fixture.job,...change},fixture),/completed successful producing job/);
  for(const name of ['Build and verify all lane packs independently','Seal deduplicated final bundle transport','Retain final bundle manifest','Retain deduplicated final blob shard 0']){
    const job=structuredClone(fixture.job);job.steps.find(row=>row.name===name).conclusion='skipped';assert.throws(()=>validatePackProducerJob(job,fixture),/successful .* step/);
  }
  for(const contracts of [undefined,{...fixture.contracts,conclusion:'failure'},{...fixture.contracts,sourceCommit:'b'.repeat(40)},{...fixture.contracts,attempt:3}])assert.throws(()=>validatePackProducerJob(fixture.job,{...fixture,contracts}),/shared contracts/);
});

test('early artifacts need exact immutable upload IDs, digests, bytes and step times, not matching filenames',()=>{
  const fixture=producerFixture();
  for(const log of [fixture.log.replace('Artifact ID is 7','Artifact ID is 99'),fixture.log.replace(fixture.artifacts[0].digest.slice(7),sha('changed')),fixture.log.replace('Final size is 32','Final size is 33'),fixture.log.replace('actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02','unreviewed-upload@main'),fixture.log+fixture.block(fixture.artifacts[0],3),fixture.log.replace('20:00:03.200','20:00:01.200')])assert.throws(()=>validatePackProducerJob(fixture.job,{...fixture,log}),/upload log|digest or upload timing/);
  for(const change of [{expired:true},{created_at:'2026-10-18T20:00:03Z'},{updated_at:'2026-10-19T20:00:06Z'}]){
    const artifacts=structuredClone(fixture.artifacts);Object.assign(artifacts[0],change);assert.throws(()=>validatePackProducerJob(fixture.job,{...fixture,artifacts}),/unexpired|producing upload step/);
  }
  const duplicate=[fixture.artifacts[0],fixture.artifacts[0]];assert.throws(()=>validatePackProducerJob(fixture.job,{...fixture,artifacts:duplicate}),/Exact manifest/);
});

test('pending producers wait without requests while failed or malformed producers are rejected',async()=>{
  const fixture=producerFixture(),readJobLog=async()=>assert.fail('Pending/failed jobs must not read logs');
  for(const jobs of [[],[{...fixture.job,status:'in_progress',conclusion:null}],[{...fixture.job,name:'lane (0, legacy)'}]])await assert.rejects(()=>readPackProducerGate({...fixture,readGithub:async()=>({status:200,body:{total_count:jobs.length,jobs}}),readJobLog}),error=>error.code==='PACK_PRODUCER_PENDING');
  for(const job of [{...fixture.job,conclusion:'failure'},{...fixture.job,run_attempt:1}])await assert.rejects(()=>readPackProducerGate({...fixture,readGithub:async()=>({status:200,body:{total_count:1,jobs:[job]}}),readJobLog}),error=>error.code!=='PACK_PRODUCER_PENDING');
});

test('active discovery with no transport is pending, and unfinished or failed own contracts remain blocked',async t=>{
  const fixture=producerFixture(),root=temporary(t),gate={id:5,name:'contracts',run_id:123,head_sha:fixture.run.head_sha,status:'completed',conclusion:'success'};let conclusion='success';
  const readGithub=async operation=>operation.path.endsWith('/artifacts')?{status:200,body:{total_count:0,artifacts:[]}}:operation.path.endsWith('/jobs')?{status:200,body:{total_count:1,jobs:[{...gate,conclusion}]}}:{status:200,body:fixture.run};
  const resolver=packArtifactResolver({root,readGithub,readJobLog:async()=>assert.fail('No manifest means no producing log'),download:async()=>assert.fail('No artifact should be downloaded')});
  const report=await resolver.discover(123,{slugs:['dealer-one'],verifyBundles:false});assert.equal(report.success,true);assert.equal(report.requests.length,0);assert.equal(report.failures.length,0);assert.equal(report.pending.length,1);assert.deepEqual(report.pending[0].slugs,['dealer-one']);
  for(conclusion of ['failure',null])await assert.rejects(()=>resolver.discover(123,{verifyBundles:false}),/contracts/);
});

test('automatic mode is enqueue-only and routes the semantic duplicate guard without changing manual intake',async t=>{
  const root=temporary(t),candidate=request('dealer-one'),calls=[],store={read:async()=>({state:queueFixture()})},resolver={discover:async(run,options)=>{assert.equal(run,123);assert.equal(options.verifyBundles,false);return {runId:run,sourceCommit:sourceRun.head_sha,requests:[candidate],failures:[],success:true};}},enqueue=async(actualStore,requests,options)=>{assert.equal(actualStore,store);assert.deepEqual(requests,[candidate]);calls.push(options);return {value:{added:[candidate.id],existing:[],rejected:[]}};},dependencies={root,store,resolver,registry:{},enqueue};
  await runPackQueueDispatcher(['enqueue','--run','123'],dependencies);await runPackQueueDispatcher(['enqueue','--automatic','--run','123'],dependencies);
  assert.deepEqual(calls,[{collectRejections:true},{collectRejections:true,automatic:true}]);
  for(const action of ['inspect','drain'])await assert.rejects(()=>runPackQueueDispatcher([action,'--automatic'],dependencies),/automatic is enqueue-only/);
  await assert.rejects(()=>runPackQueueDispatcher(['enqueue','--automatic','--automatic','--run','123'],dependencies),/Repeated --automatic/);assert.equal(calls.length,2);
  const originalId='e'.repeat(64),duplicate=await runPackQueueDispatcher(['enqueue','--automatic','--run','123'],{...dependencies,enqueue:async(_store,_requests,options)=>{assert.equal(options.automatic,true);return {value:{added:[],existing:[originalId],rejected:[]}};}});
  assert.deepEqual(duplicate.requests,[],'A semantic duplicate must retain its original queued locator instead of rebinding its ID to new artifacts');assert.deepEqual(duplicate.enqueued.existing,[originalId]);assert.equal(duplicate.success,true);
});

test('discovery refreshes active artifact inventory and never materializes pending or failed producers',async t=>{
  const fixture=producerFixture(),root=temporary(t),slug='dealer-one',blob=sha('x'),digest=value=>sha(canonicalPackJson(value));
  const manifest={schemaVersion:1,kind:'cars-dealer-pack-bundle-transport',createdAt:at,requested:[slug],valid:[slug],rejected:[],status:'passed',dealers:[{slug,sourceCommit:fixture.run.head_sha,packDigest:sha('pack'),releaseDigest:sha('release'),outputDigest:sha('output'),artifactDigest:sha('envelope'),fileCount:1,bytes:1}],files:[{path:slug+'/build-report.json',bytes:1,sha256:blob,shard:0}],blobs:[{sha256:blob,bytes:1,shard:0}],shards:[{index:0,path:'shard-0',bytes:1,blobCount:1,digest:digest([{sha256:blob,bytes:1}])}],shardBytesLimit:350*1024**2,logicalBytes:1,uniqueBytes:1,providerWrites:0,sourceIncluded:false,nativeIntermediatesIncluded:false,benchmarkOnly:false,deduplicatedBytes:0};manifest.contentDigest=digest(manifest);
  const archive=zip([{name:'manifest.json',content:JSON.stringify(manifest)}]),primary={...fixture.artifacts[0],size_in_bytes:archive.length,digest:'sha256:'+sha(archive)};let inventory=[],conclusion=null,downloads=0;
  const gate={id:5,name:'contracts',run_id:123,head_sha:fixture.run.head_sha,status:'completed',conclusion:'success'},readGithub=async operation=>operation.path.endsWith('/artifacts')?{status:200,body:{total_count:inventory.length,artifacts:inventory}}:operation.path.endsWith('/jobs')?{status:200,body:{total_count:2,jobs:[gate,{...fixture.job,status:conclusion?'completed':'in_progress',conclusion}]}}:{status:200,body:fixture.run};
  const resolver=packArtifactResolver({root,readGithub,readJobLog:async()=>assert.fail('Pending/failed producer must not read logs'),download:async({artifact,out})=>{assert.equal(artifact.id,primary.id,'Compiled shards must not be downloaded');downloads++;fs.writeFileSync(out,archive);return out;}});
  assert.equal((await resolver.discover(123,{slugs:[slug],verifyBundles:false})).pending.length,1);inventory=[primary,fixture.artifacts[1]];
  const pending=await resolver.discover(123,{slugs:[slug],verifyBundles:false});assert.equal(pending.success,true);assert.equal(pending.requests.length,0);assert.equal(pending.failures.length,0);assert.equal(pending.pending[0].artifact,primary.name);assert.deepEqual(pending.pending[0].slugs,[slug]);assert.equal(downloads,1);
  conclusion='failure';const failed=await resolver.discover(123,{verifyBundles:false});assert.equal(failed.requests.length,0);assert.equal(failed.success,false);assert.equal(failed.pending.length,0);assert.match(failed.failures[0].reason,/completed successful producing job/);
});

test('producing job log download strips credentials on signed redirects and fails closed on host, size and UTF8',async()=>{
  const token='test-github-token-never-forward',calls=[],log=Buffer.from('exact authenticated completed job log');
  const text=await readPackActionJobLog({jobId:66,token,fetchImpl:async(url,options)=>{calls.push({url:String(url),options});return calls.length===1?new Response(null,{status:302,headers:{location:'https://logs.actions.githubusercontent.com/job.log?sig=test'}}):new Response(log);}});
  assert.equal(text,log.toString());assert.equal(calls[0].options.headers.Authorization,'Bearer '+token);assert.equal(calls[1].options.headers.Authorization,undefined);assert.equal(calls[1].options.redirect,'error');
  await assert.rejects(()=>readPackActionJobLog({jobId:66,token,fetchImpl:async()=>new Response(null,{status:302,headers:{location:'https://attacker.example/job.log'}})}),/known HTTPS Actions/);
  await assert.rejects(()=>readPackActionJobLog({jobId:66,token,fetchImpl:async()=>new Response(Buffer.alloc(20*1024**2+1))}),/bounded evidence/);
  await assert.rejects(()=>readPackActionJobLog({jobId:66,token,fetchImpl:async()=>new Response(Buffer.from([0xff]))}),/encoded data/);
  await assert.rejects(()=>readPackActionJobLog({jobId:66,token,fetchImpl:async()=>new Response(null,{status:404})}),/log is unavailable/);
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
  const options={slug:'dealer-one',start:at,end,startupTimeMs:32,cpuLimitMs:30000,cpuLimitSource:'provider-version-response'},empty={status:200,success:true,result:{viewer:{accounts:[{workersInvocationsAdaptive:[]}]}}};
  const waiting=assessPackMetrics(empty,options);assert.equal(waiting.status,'awaiting-ingestion');assert.equal(waiting.maxP99CpuMs,null);assert.equal(waiting.maxP99MemoryMiB,null);
  assert.equal(waiting.withinLimits,null);assert.equal(waiting.limitChecks.cpu.withinLimit,null);
  const row={dimensions:{scriptName:'cars-dealer-one',status:'success'},sum:{requests:6,errors:0},quantiles:{cpuTimeP50:2500,cpuTimeP99:15000,memoryUsageBytesP50:1024**2,memoryUsageBytesP99:1.5*1024**2}},reply=structuredClone(empty);reply.result.viewer.accounts[0].workersInvocationsAdaptive=[row];
  const report=assessPackMetrics(reply,options);assert.equal(report.maxP99CpuMs,15);assert.equal(report.maxP99MemoryMiB,1.5);assert.equal(report.status,'observed-without-errors');assert.equal(report.startupTimeMs,32);
  assert.equal(report.withinLimits,true);assert.equal(report.cpuLimitMs,30000);assert.equal(report.limitChecks.startup.limitMs,1000);assert.equal(report.limitChecks.memory.limitMiB,128);
  row.sum.errors=1;assert.equal(assessPackMetrics(reply,options).status,'observed-errors');row.sum.errors=0;row.dimensions.scriptName='cars-another';assert.throws(()=>assessPackMetrics(reply,options),/another Worker/);
  assert.throws(()=>packMetricsRequest({...options,end:'2026-10-21T20:00:00.000Z'}),/24hours/);
});
test('runtime acceptance needs an explicit CPU cap and startup and compares observed quantiles with each ceiling',()=>{
  const options={slug:'dealer-one',start:at,end,startupTimeMs:1000,cpuLimitMs:30000,cpuLimitSource:'successful-explicit-upload-request'},row={dimensions:{scriptName:'cars-dealer-one',status:'success'},sum:{requests:6,errors:0},quantiles:{cpuTimeP50:2500,cpuTimeP99:15000,memoryUsageBytesP50:1024**2,memoryUsageBytesP99:1.5*1024**2}},reply={status:200,success:true,result:{viewer:{accounts:[{workersInvocationsAdaptive:[row]}]}}};
  assert.equal(assessPackMetrics(reply,options).withinLimits,true);
  for(const missing of [{startupTimeMs:null},{cpuLimitMs:null}]){const report=assessPackMetrics(reply,{...options,...missing});assert.equal(report.withinLimits,null);assert.equal(report.status,'incomplete');}
  for(const exceeded of [{startupTimeMs:1001},{cpuLimitMs:10}]){const report=assessPackMetrics(reply,{...options,...exceeded});assert.equal(report.withinLimits,false);assert.equal(report.status,'observed-limits-exceeded');}
  row.quantiles.cpuTimeP99=30000000;assert.equal(assessPackMetrics(reply,options).withinLimits,true);row.quantiles.cpuTimeP99=30001000;assert.equal(assessPackMetrics(reply,options).limitChecks.cpu.withinLimit,false);
  row.quantiles.cpuTimeP99=15000;row.quantiles.memoryUsageBytesP99=129*1024**2;assert.equal(assessPackMetrics(reply,options).limitChecks.memory.withinLimit,false);
  delete row.quantiles.memoryUsageBytesP99;assert.equal(assessPackMetrics(reply,options).withinLimits,null);
  row.sum.errors=1;const errors=assessPackMetrics(reply,options);assert.equal(errors.withinLimits,false);assert.equal(errors.status,'observed-errors');
});
