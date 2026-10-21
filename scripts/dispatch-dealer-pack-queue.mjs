/** Reviewed-executor Actions bridge: authenticate immutable build artifacts,
 * enqueue every valid pack, then drain all batches from durable locators.
 * Source worktrees are detached/read-only inputs; no batch or fleet branch moves.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {ROOT,json,sha256} from './lib/workflow.mjs';
import {readZipReceipt} from './deploy-uk-cloudflare.mjs';
import {restoreDealerPackTransport,validateDealerPackTransportManifest} from './transport-dealer-pack-bundles.mjs';
import {PACK_QUEUE_REPOSITORY,packDeploymentRequest,enqueuePackDeployments} from './lib/dealer-pack-queue.mjs';
import {gitPackQueueStore} from './lib/dealer-pack-queue-git.mjs';
import {cloudflarePackProvider,tokenCloudflareTransport} from './lib/dealer-pack-cloudflare.mjs';
import {githubPackTransport,inspectPackDeploymentIntake,inspectExactPackDeployment,drainPackDeployments} from './deploy-dealer-packs.mjs';
import {validatePackDeploymentIdentity,validatePackProviderSnapshot,validatePackTargetForWrite} from './lib/dealer-pack-deployment.mjs';
import {runPackGithubRead} from './lib/dealer-pack-github-read.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
const hex40=value=>/^[a-f0-9]{40}$/.test(value??'');
const apiRoot='/repos/'+PACK_QUEUE_REPOSITORY;
const archiveLimit=512*1024**2;
const jobLogLimit=20*1024**2;
const uploadAction='actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02';
const safePrefix=(prefix,runId)=>new RegExp('^dealer-pack-transport--'+runId+'--lane-[0-9]+$').test(prefix);
const command=(root,args,{env,input}={})=>{const result=spawnSync('git',['-C',root,...args],{encoding:'utf8',maxBuffer:20*1024**2,timeout:120000,...(env?{env}:{}),...(input===undefined?{}:{input})});assert(result.status===0&&!result.signal,'Exact source Git operation failed; command output was suppressed');return result.stdout;};

function validatePackSourceIdentity(run,runId) {
  assert(run?.id===Number(runId)&&run.repository?.full_name===PACK_QUEUE_REPOSITORY&&run.head_repository?.full_name===PACK_QUEUE_REPOSITORY&&hex40(run.head_sha)&&run.path==='.github/workflows/dealer-pack-pipeline.yml'&&['workflow_dispatch','pull_request','push'].includes(run.event),'Use an exact same-repository dealer-pack-pipeline run');
  return run;
}
export function validatePackSourceRun(run,runId) {
  validatePackSourceIdentity(run,runId);
  assert(run.status==='completed'&&['success','failure'].includes(run.conclusion),'Use a completed same-repository dealer-pack-pipeline run; individual qualified artifacts may survive another pack failure');
  return run;
}
async function readPackAttemptJobs({run,attempt,readGithub}) {
  const jobs=[];let total;
  for(let page=1;page<=20;page++){
    const reply=await readGithub({method:'GET',path:apiRoot+'/actions/runs/'+run.id+'/attempts/'+attempt+'/jobs',query:{per_page:100,page}});
    assert(reply.status===200&&Array.isArray(reply.body?.jobs),'Authenticated source run job evidence is unavailable');total??=reply.body.total_count;assert(Number.isSafeInteger(total)&&total>=0&&reply.body.total_count===total,'Run job inventory changed');jobs.push(...reply.body.jobs);if(jobs.length>=total)break;
  }
  assert(jobs.length===total,'Complete source run job inventory required');return jobs;
}
export function validatePackContractsJobs(jobs,{run,attempt}) {
  assert(Array.isArray(jobs)&&Number.isSafeInteger(attempt)&&attempt>0,'Exact run attempt jobs required');
  const gates=jobs.filter(row=>row.name==='contracts');if(gates.length===0)return null;
  assert(gates.length===1&&gates[0].run_id===run.id&&gates[0].head_sha===run.head_sha&&gates[0].status==='completed'&&gates[0].conclusion==='success','The latest shared contracts job for this exact source must pass, even when individual pack lanes may fail');
  return {jobId:gates[0].id,runId:run.id,sourceCommit:run.head_sha,attempt,conclusion:'success'};
}
export async function readPackContractsGate({run,readGithub}) {
  const latest=run.run_attempt??1;assert(Number.isSafeInteger(latest)&&latest>0&&latest<=100,'Bounded workflow run attempt required');
  // A failed-jobs-only re-run can omit an already successful contracts job.
  // Examine attempts newest first and accept only the latest actual gate.
  for(let attempt=latest;attempt>=1;attempt--){
    const jobs=await readPackAttemptJobs({run,attempt,readGithub}),gate=validatePackContractsJobs(jobs,{run,attempt});if(gate)return gate;
  }
  throw Error('This source run has no successful shared contracts job');
}
export function validatePackActionArtifact(artifact,{run,expected,name}={}) {
  assert(Number.isSafeInteger(artifact?.id)&&artifact.id>0&&artifact.expired===false&&/^sha256:[a-f0-9]{64}$/.test(artifact.digest??'')&&Number.isSafeInteger(artifact.size_in_bytes)&&artifact.size_in_bytes>0&&artifact.size_in_bytes<=archiveLimit&&artifact.workflow_run?.id===run.id&&artifact.workflow_run?.head_sha===run.head_sha,'Immutable unexpired same-run artifact metadata required');
  if(name)assert(artifact.name===name,'Artifact name differs from its exact lane');
  if(expected)assert(artifact.id===expected.id&&artifact.name===expected.name&&artifact.digest===expected.digest&&artifact.size_in_bytes===expected.bytes,'Queued artifact identity changed');
  return artifact;
}

const objectLocation=location=>{
  const url=new URL(location);assert(url.protocol==='https:'&&!url.username&&!url.password&&['.blob.core.windows.net','.actions.githubusercontent.com','.githubusercontent.com','.amazonaws.com'].some(suffix=>url.hostname.endsWith(suffix)),'Artifact redirect is not a known HTTPS Actions object host');return url;
};
/** Completed job logs bind IDs/digests to the producing job; they are never
 * treated as source or retained in queue state. Signed hosts receive no token. */
export async function readPackActionJobLog({jobId,token=process.env.GITHUB_TOKEN,fetchImpl=fetch}={}) {
  assert(Number.isSafeInteger(jobId)&&jobId>0&&typeof token==='string'&&token.length>10,'Actions read token and exact producing job required');
  let response=await fetchImpl('https://api.github.com'+apiRoot+'/actions/jobs/'+jobId+'/logs',{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},redirect:'manual',signal:AbortSignal.timeout(30000)});
  if(response.status===302)response=await fetchImpl(objectLocation(response.headers.get('location')),{headers:{'Accept-Encoding':'identity'},redirect:'error',signal:AbortSignal.timeout(30000)});
  assert(response.status===200&&response.body,'Authenticated completed producing job log is unavailable');
  const chunks=[];let bytes=0;for await(const value of response.body){const chunk=Buffer.from(value);bytes+=chunk.length;assert(bytes<=jobLogLimit,'Producing job log exceeds its bounded evidence limit');chunks.push(chunk);}
  return new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks));
}

export function validatePackProducerJob(job,{run,prefix,artifacts,contracts,log}) {
  validatePackSourceIdentity(run,run.id);
  assert(run.status==='in_progress'&&run.conclusion===null&&Number.isSafeInteger(run.run_attempt)&&run.run_attempt>0&&run.run_attempt<=100&&safePrefix(prefix,run.id),'An active exact source attempt and lane are required');
  assert(contracts?.runId===run.id&&contracts.sourceCommit===run.head_sha&&contracts.conclusion==='success'&&Number.isSafeInteger(contracts.jobId)&&contracts.jobId>0&&Number.isSafeInteger(contracts.attempt)&&contracts.attempt>0&&contracts.attempt<=run.run_attempt,'Successful exact shared contracts are required before early lane intake');
  const lane=prefix.slice(prefix.lastIndexOf('-')+1),jobStart=Date.parse(job?.started_at),jobEnd=Date.parse(job?.completed_at);
  assert(Number.isSafeInteger(job?.id)&&job.id>0&&job.name==='dealer-pack-producer-lane-'+lane&&job.run_id===run.id&&job.head_sha===run.head_sha&&job.run_attempt===run.run_attempt&&job.status==='completed'&&job.conclusion==='success'&&Number.isFinite(jobStart)&&Number.isFinite(jobEnd)&&jobEnd>=jobStart,'Early lane intake requires its completed successful producing job in the latest exact attempt');
  assert(Array.isArray(artifacts)&&artifacts.length>=2&&artifacts.length<=9&&new Set(artifacts.map(row=>row.id)).size===artifacts.length&&new Set(artifacts.map(row=>row.name)).size===artifacts.length&&artifacts.filter(row=>row.name===prefix+'--manifest').length===1,'Exact manifest and declared shard artifacts required for early lane intake');
  assert(typeof log==='string'&&Buffer.byteLength(log,'utf8')<=jobLogLimit,'Bounded authenticated producing job log required');
  const steps=job.steps??[],step=name=>{const matches=steps.filter(row=>row.name===name),row=matches[0];assert(matches.length===1&&row.status==='completed'&&row.conclusion==='success'&&Number.isSafeInteger(row.number)&&row.number>0&&Number.isFinite(Date.parse(row.started_at))&&Number.isFinite(Date.parse(row.completed_at))&&Date.parse(row.completed_at)>=Date.parse(row.started_at),'Producing job needs a successful '+name+' step');return row;};
  const build=step('Build and verify all lane packs independently'),seal=step('Seal deduplicated final bundle transport');assert(build.number<seal.number,'Producing build must precede transport sealing');
  const sections=[];let section;
  for(const line of log.split(/\r?\n/)){const match=/^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d+Z) (.*)$/.exec(line);if(!match)continue;const row={time:Date.parse(match[1]),message:match[2]};if(row.message.startsWith('##[group]Run ')){section={marker:row,rows:[]};sections.push(section);}if(section)section.rows.push(row);}
  for(const artifact of artifacts){
    validatePackActionArtifact(artifact,{run});const suffix=artifact.name.slice(prefix.length),shard=/^--shard-([0-7])$/.exec(suffix);assert(artifact.name===prefix+'--manifest'||shard&&artifact.name===prefix+suffix,'Artifact is outside its exact producing lane');
    // Jobs API timestamps have whole-second precision; upload logs retain
    // fractions. Include that recorded final second without extending the step.
    const upload=step(shard?'Retain deduplicated final blob shard '+shard[1]:'Retain final bundle manifest'),start=Date.parse(upload.started_at),end=Date.parse(upload.completed_at)+1000;
    assert(seal.number<upload.number&&start>=jobStart&&end<=jobEnd+1000&&[artifact.created_at,artifact.updated_at].every(value=>Number.isFinite(Date.parse(value))&&Date.parse(value)>=start&&Date.parse(value)<end),'Artifact was not created within its successful producing upload step');
    const summary='Artifact '+artifact.name+' has been successfully uploaded! Final size is '+artifact.size_in_bytes+' bytes. Artifact ID is '+artifact.id,blocks=sections.filter(row=>row.marker.message==='##[group]Run '+uploadAction&&row.rows.some(entry=>entry.message===summary));
    assert(blocks.length===1,'Exact artifact ID/name/size is absent or repeated in its pinned producing upload log');
    const block=blocks[0],digests=block.rows.filter(row=>/^SHA256 digest of uploaded artifact zip is [a-f0-9]{64}$/.test(row.message)),summaries=block.rows.filter(row=>/^Artifact .* has been successfully uploaded! Final size is [0-9]+ bytes\. Artifact ID is [0-9]+$/.test(row.message));
    assert(digests.length===1&&digests[0].message==='SHA256 digest of uploaded artifact zip is '+artifact.digest.slice(7)&&summaries.length===1&&[block.marker,digests[0],summaries[0]].every(row=>row.time>=start&&row.time<end),'Artifact digest or upload timing differs from its authenticated producing job');
  }
  return {mode:'completed-producing-job',jobId:job.id,runId:run.id,sourceCommit:run.head_sha,attempt:run.run_attempt,prefix,completedAt:job.completed_at,artifacts:artifacts.map(row=>({id:row.id,digest:row.digest}))};
}

export async function readPackProducerGate({run,prefix,artifacts,contracts,readGithub,readJobLog}) {
  if(run.status==='completed'){validatePackSourceRun(run,run.id);return {mode:'completed-run',runId:run.id,sourceCommit:run.head_sha};}
  assert(Number.isSafeInteger(run.run_attempt)&&run.run_attempt>0&&run.run_attempt<=100&&safePrefix(prefix,run.id),'Exact active run attempt/lane required');
  const jobs=await readPackAttemptJobs({run,attempt:run.run_attempt,readGithub}),name='dealer-pack-producer-lane-'+prefix.slice(prefix.lastIndexOf('-')+1),matches=jobs.filter(row=>row.name===name);
  if(matches.length===1)assert(Number.isSafeInteger(matches[0].id)&&matches[0].id>0&&matches[0].run_id===run.id&&matches[0].head_sha===run.head_sha&&matches[0].run_attempt===run.run_attempt,'Producing job identity differs from the latest exact source attempt');
  if(matches.length===0||matches.length===1&&['queued','in_progress','waiting','pending'].includes(matches[0].status)&&matches[0].conclusion===null)throw Object.assign(Error('This lane is awaiting a completed producing job; legacy producer jobs require the source run to finish'),{code:'PACK_PRODUCER_PENDING'});
  assert(matches.length===1&&matches[0].status==='completed'&&matches[0].conclusion==='success','The selected lane has no completed successful producing job in this attempt');
  const job=matches[0],log=await readJobLog({jobId:job.id});return validatePackProducerJob(job,{run,prefix,artifacts,contracts,log});
}

/** GET the authenticated archive location, then send no account credential to
 * the signed object URL. Verify full compressed bytes before reading any entry.
 */
export async function downloadPackActionArtifact({artifact,out,token=process.env.GITHUB_TOKEN,fetchImpl=fetch,retryWait,transportClock,transportDiagnostic}={}) {
  assert(typeof token==='string'&&token.length>10&&Number.isSafeInteger(artifact?.id)&&artifact.id>0&&Number.isSafeInteger(artifact.size_in_bytes)&&artifact.size_in_bytes>0&&artifact.size_in_bytes<=archiveLimit&&/^sha256:[a-f0-9]{64}$/.test(artifact.digest??''),'Actions read token and bounded artifact required');
  const expected={id:artifact.id,bytes:artifact.size_in_bytes,digest:artifact.digest};
  if(fs.existsSync(out)){assert(fs.statSync(out).size===expected.bytes&&'sha256:'+sha256(fs.readFileSync(out))===expected.digest,'Cached artifact changed');return out;}
  fs.mkdirSync(path.dirname(out),{recursive:true});
  return runPackGithubRead({operation:'artifact-download',resource:'artifact',artifactId:expected.id,expectedBytes:expected.bytes,fetchImpl,retryWait,transportClock,transportDiagnostic,execute:async read=>{
    let response=await read.get('https://api.github.com'+apiRoot+'/actions/artifacts/'+expected.id+'/zip',{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});
    if(response.status===302)response=await read.get(objectLocation(response.headers.get('location')),{headers:{'Accept-Encoding':'identity'},redirect:'error',object:true});
    assert(response.status===200&&response.body,'Actions archive download failed');
    const partial=out+'.partial',file=fs.openSync(partial,'wx',0o600),digest=createHash('sha256');let bytes=0,iterator;
    try{
      iterator=response.body[Symbol.asyncIterator]();
      for(;;){const {done,value}=await read.body(()=>iterator.next());if(done)break;const chunk=Buffer.from(value);bytes+=chunk.length;read.received(bytes);assert(bytes<=expected.bytes&&bytes<=archiveLimit,'Archive download exceeded its authenticated size');digest.update(chunk);fs.writeSync(file,chunk);}
      assert(bytes===expected.bytes&&'sha256:'+digest.digest('hex')===expected.digest,'Downloaded artifact bytes differ from their authenticated digest');
    }catch(error){fs.closeSync(file);fs.rmSync(partial,{force:true});try{await iterator?.return?.();}catch{}throw error;}
    fs.closeSync(file);fs.renameSync(partial,out);return out;
  }});
}

export function extractDeclaredPackArchive({archive,out,files}) {
  const listing=spawnSync('unzip',['-Z1',archive],{encoding:'utf8',maxBuffer:16*1024**2,timeout:30000});assert(listing.status===0&&!listing.signal,'Artifact ZIP directory could not be read');
  const names=listing.stdout.split(/\r?\n/).filter(Boolean),members=names.filter(name=>!name.endsWith('/')),expected=files.map(row=>row.path).sort();
  assert(new Set(names).size===names.length&&JSON.stringify(members.slice().sort())===JSON.stringify(expected),'Artifact ZIP contains missing, repeated or undeclared files');
  assert(names.every(name=>name==='manifest.json'||name==='blobs/'||/^blobs\/[a-f0-9]{64}$/.test(name)),'Only a manifest or sealed content blobs may be extracted');
  assert(!fs.existsSync(out),'Artifact extraction needs a fresh generated destination');fs.mkdirSync(out,{recursive:true});
  for(const row of files){const bytes=readZipReceipt(archive,row.path);assert((row.bytes===undefined||bytes.length===row.bytes)&&(row.sha256===undefined||sha256(bytes)===row.sha256),'Extracted blob differs from its exact manifest');const file=path.join(out,row.path);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes,{flag:'wx'});}
  return out;
}

export function packArtifactResolver({root=ROOT,cache=path.join(root,'runtime/dealer-pack-deploy-cache'),token=process.env.GITHUB_TOKEN,readGithub=githubPackTransport({token}),download=downloadPackActionArtifact,readJobLog=options=>readPackActionJobLog({...options,token})}={}) {
  cache=path.resolve(cache);assert(cache.startsWith(path.join(path.resolve(root),'runtime')+path.sep),'Deployment cache must stay in this checkout generated runtime directory');fs.mkdirSync(cache,{recursive:true});
  const responses=new Map(),sources=new Map();let lane=null;
  const read=async operation=>{const key=JSON.stringify(operation);if(!responses.has(key))responses.set(key,Promise.resolve(readGithub(operation)));return responses.get(key);};
  const gates=new Map();
  // Run attempts, job conclusions and expiry are mutable. Re-read them for
  // every intake/restoration instead of letting immutable source caching hide a rerun.
  const getRun=async runId=>{const reply=await readGithub({method:'GET',path:apiRoot+'/actions/runs/'+runId});assert(reply.status===200,'Build source run is unavailable');const run=validatePackSourceIdentity(reply.body,runId);if(run.status==='completed')validatePackSourceRun(run,runId);else assert(run.status==='in_progress'&&run.conclusion===null,'The source run must be active or completed with an admissible result');gates.set(run.id,await readPackContractsGate({run,readGithub}));return run;};
  const admitLane=async(run,prefix,artifacts)=>{
    const proof=await readPackProducerGate({run,prefix,artifacts,contracts:gates.get(run.id),readGithub,readJobLog});
    if(run.status==='in_progress'){const latest=await readGithub({method:'GET',path:apiRoot+'/actions/runs/'+run.id});assert(latest.status===200,'Source attempt could not be rechecked');const current=validatePackSourceIdentity(latest.body,run.id);assert(current.head_sha===run.head_sha&&current.run_attempt===run.run_attempt&&(current.status==='in_progress'&&current.conclusion===null||current.status==='completed'&&['success','failure'].includes(current.conclusion)),'Source run attempt or admissible state changed during producer verification');}
    return proof;
  };
  const source=async commit=>{
    assert(hex40(commit),'Exact source commit required');if(sources.has(commit))return sources.get(commit);
    const directory=path.join(cache,'source-'+commit),env={...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never'};
    if(token){env.GIT_CONFIG_COUNT='1';env.GIT_CONFIG_KEY_0='http.https://github.com/.extraheader';env.GIT_CONFIG_VALUE_0='AUTHORIZATION: basic '+Buffer.from('x-access-token:'+token).toString('base64');}
    command(root,['fetch','--quiet','--no-tags','--filter=blob:none','origin',commit],{env});
    if(!fs.existsSync(directory)){command(root,['worktree','add','--quiet','--detach','--no-checkout',directory,commit]);
      command(directory,['sparse-checkout','set','--no-cone','/dealers/','/docs/**/*.json','/docs/**/*.md','/leads/expansion-2026-10-18/','/templates.lock.json','/workspace.json','/catalog.json','/clients/index.json'],{env});
      command(directory,['checkout','--quiet','--detach',commit],{env});}
    assert(command(directory,['rev-parse','HEAD']).trim()===commit&&command(directory,['status','--porcelain','--untracked-files=no']).trim()==='','Source worktree is dirty or differs from its authenticated commit');sources.set(commit,directory);return directory;
  };
  const metadata=async(id,run,expected)=>{const reply=await readGithub({method:'GET',path:apiRoot+'/actions/artifacts/'+id});assert(reply.status===200,'Queued build artifact is unavailable or expired');return validatePackActionArtifact(reply.body,{run,expected,name:expected?.name});};
  const loadLane=async locator=>{
    const key=locator.artifactId+':'+locator.digest;
    const run=await getRun(locator.runId),primary=await metadata(locator.artifactId,run,{id:locator.artifactId,name:locator.name,digest:locator.digest,bytes:locator.bytes});
    assert(run.head_sha===locator.sourceCommit&&safePrefix(locator.prefix,run.id),'Queued source commit/lane differs');
    const shards=[];for(const shard of locator.shards)shards.push(await metadata(shard.id,run,shard));
    const producer=await admitLane(run,locator.prefix,[primary,...shards]);
    if(lane?.key===key){lane.run=run;lane.producer=producer;return lane;}
    if(lane){fs.rmSync(lane.directory,{recursive:true,force:true});lane=null;}
    const directory=path.join(cache,'lane-'+primary.id),transport=path.join(directory,'transport');if(fs.existsSync(directory))fs.rmSync(directory,{recursive:true,force:true});fs.mkdirSync(directory,{recursive:true});
    const archive=await download({artifact:primary,out:path.join(directory,'manifest.zip'),token});extractDeclaredPackArchive({archive,out:transport,files:[{path:'manifest.json',sha256:locator.manifestSha256}]});
    const manifest=validateDealerPackTransportManifest(json(path.join(transport,'manifest.json')));assert(manifest.shards.length===locator.shards.length&&manifest.dealers.every(row=>row.sourceCommit===run.head_sha),'Transport source or shard coverage differs');
    for(const shard of locator.shards){const artifact=shards.find(row=>row.id===shard.id),zip=await download({artifact,out:path.join(directory,'shard-'+shard.index+'.zip'),token});extractDeclaredPackArchive({archive:zip,out:path.join(transport,'shard-'+shard.index),files:manifest.blobs.filter(row=>row.shard===shard.index).map(row=>({path:'blobs/'+row.sha256,bytes:row.bytes,sha256:row.sha256}))});fs.rmSync(zip);}
    fs.rmSync(archive);lane={key,directory,transport,manifest,run,producer};return lane;
  };
  const materialize=async(request,queue,registry)=>{
    assert(request.buildArtifact?.shards,'Queued request needs immutable manifest/shard artifact locators for cross-run draining');
    const loaded=await loadLane(request.buildArtifact),out=path.join(loaded.directory,'current');if(fs.existsSync(out))fs.rmSync(out,{recursive:true,force:true});
    const row=loaded.manifest.dealers.find(row=>row.slug===request.slug);assert(row&&row.packDigest===request.packDigest&&row.outputDigest===request.outputDigest&&row.releaseDigest===request.releaseDigest&&row.sourceCommit===request.sourceCommit,'Queued pack differs from the authenticated transport envelope');
    restoreDealerPackTransport({input:loaded.transport,out,manifestSha256:request.buildArtifact.manifestSha256,slugs:[request.slug]});
    return inspectExactPackDeployment({root:await source(request.sourceCommit),slug:request.slug,bundleRoot:out,batch:request.batch,queue,registry,readGithub:read,request});
  };
  const discover=async(runId,{prefix,slugs,batch,queue,registry,verifyBundles=true,provider})=>{
    const run=await getRun(runId),artifacts=[];let total;
    for(let page=1;page<=100;page++){const reply=await readGithub({method:'GET',path:apiRoot+'/actions/runs/'+run.id+'/artifacts',query:{per_page:100,page}});assert(reply.status===200&&Array.isArray(reply.body?.artifacts),'Build artifact listing failed');total??=reply.body.total_count;assert(total===reply.body.total_count,'Build artifact listing changed');artifacts.push(...reply.body.artifacts);if(artifacts.length>=total)break;}
    assert(Number.isSafeInteger(total)&&artifacts.length===total,'Complete run artifact inventory required');
    const manifests=artifacts.filter(row=>row.name.endsWith('--manifest')&&safePrefix(row.name.slice(0,-10),run.id)&&(!prefix||row.name===prefix+'--manifest'));
    assert(manifests.length<=32&&(manifests.length>0||run.status==='in_progress'),'No bounded exact transport manifests found');
    const selected=slugs?new Set(slugs):null,requests=[],failures=[],pending=[],producers=[],seen=new Set(),providerObservations=[];let plannedCreates=0;
    if(manifests.length===0)pending.push({runId:run.id,slugs:slugs??[],reason:'Active source has no finished lane transport yet'});
    assert(!provider||verifyBundles,'Live dry-run requires full sealed bundle verification');
    for(const artifact of manifests)try{
      validatePackActionArtifact(artifact,{run});const lanePrefix=artifact.name.slice(0,-10),temporary=path.join(cache,'discovery-'+artifact.id);if(fs.existsSync(temporary))fs.rmSync(temporary,{recursive:true,force:true});fs.mkdirSync(temporary);
      const zip=await download({artifact,out:path.join(temporary,'manifest.zip'),token}),bytes=readZipReceipt(zip,'manifest.json'),manifest=validateDealerPackTransportManifest(JSON.parse(bytes.toString('utf8')));
      assert(manifest.dealers.every(row=>row.sourceCommit===run.head_sha),'Transport source does not match its authenticated run');
      const locator={runId:run.id,artifactId:artifact.id,name:artifact.name,digest:artifact.digest,bytes:artifact.size_in_bytes,sourceCommit:run.head_sha,prefix:lanePrefix,manifestSha256:sha256(bytes),shards:manifest.shards.map(row=>{const matches=artifacts.filter(item=>item.name===lanePrefix+'--shard-'+row.index);assert(matches.length===1,'Missing or duplicated shard artifact');const shard=validatePackActionArtifact(matches[0],{run});return {index:row.index,id:shard.id,name:shard.name,digest:shard.digest,bytes:shard.size_in_bytes};})};
      fs.rmSync(temporary,{recursive:true,force:true});
      let producer;try{producer=await admitLane(run,lanePrefix,[artifact,...locator.shards.map(row=>artifacts.find(item=>item.id===row.id))]);}catch(error){if(error.code!=='PACK_PRODUCER_PENDING')throw error;pending.push({artifact:artifact.name,slugs:manifest.dealers.map(row=>row.slug),reason:error.message});continue;}
      producers.push(producer);const loaded=verifyBundles?await loadLane(locator):null,sourceRoot=await source(run.head_sha);
      for(const rejected of manifest.rejected)if(!selected||selected.has(rejected.slug))failures.push(rejected);
      for(const row of manifest.dealers){if(selected&&!selected.has(row.slug))continue;
        try{assert(!seen.has(row.slug),'A slug occurs in more than one lane artifact');seen.add(row.slug);let request;
          if(verifyBundles){
            const out=path.join(loaded.directory,'current');if(fs.existsSync(out))fs.rmSync(out,{recursive:true,force:true});restoreDealerPackTransport({input:loaded.transport,out,manifestSha256:locator.manifestSha256,slugs:[row.slug]});
            const candidate=await inspectExactPackDeployment({root:sourceRoot,slug:row.slug,bundleRoot:out,batch,queue,registry,readGithub:read});request=packDeploymentRequest({...candidate.request,buildArtifact:locator});
          }else request=(await inspectPackDeploymentIntake({root:sourceRoot,slug:row.slug,row,batch,queue,registry,readGithub:read,buildArtifact:locator})).request;
          if(provider){const {own,mode}=validatePackDeploymentIdentity({request,queue,registry}),challenge={requestId:randomUUID(),stage:'actions-deployment-dry-run',notBefore:new Date().toISOString()};
            const observed=validatePackProviderSnapshot(await provider.snapshot({request,challenge}),{challenge,request,queue});validatePackTargetForWrite(observed,{request,queue,own,creating:mode==='create-new'});
            if(mode==='create-new'){assert(plannedCreates<observed.available,'This dry-run has selected all '+observed.available+' available live Worker slots');plannedCreates++;}
            providerObservations.push({slug:request.slug,mode,scriptCount:observed.snapshot.scriptCount,available:observed.available,observedAt:observed.snapshot.observedAt});
          }
          requests.push(request);
        }catch(error){failures.push({slug:row.slug,reason:error.message});}
      }
    }catch(error){failures.push({artifact:artifact.name,reason:error.message});}
    if(selected)for(const slug of selected)if(!requests.some(row=>row.slug===slug)&&!failures.some(row=>row.slug===slug)&&!pending.some(row=>row.slugs.includes(slug)))failures.push({slug,reason:'Requested slug has no qualified artifact in this source run'});
    return {schemaVersion:1,type:'cars-pack-actions-enqueue-inspection',runId:run.id,sourceCommit:run.head_sha,contracts:gates.get(run.id),producers,pending,requests,failures,success:failures.length===0,providerWrites:0,bundleVerified:verifyBundles,liveProviderVerified:Boolean(provider),providerObservations,
      intake:verifyBundles?'exact sealed bundles and source verified':'authenticated manifest and exact source only; every compiled bundle, QA and screenshot remains mandatory in the executor before provider writes'};
  };
  return {readGithub:read,materialize,discover,source};
}

export async function runPackQueueDispatcher(argv=process.argv.slice(2),{root=ROOT,store:providedStore,resolver:providedResolver,registry:providedRegistry,enqueue=enqueuePackDeployments}={}) {
  if(argv.includes('--help')){console.log('Usage: dispatch-dealer-pack-queue.mjs inspect|enqueue --run ID [--prefix EXACT_LANE_PREFIX] [--slugs FILE] [--batch N] [--live] [--report FILE]\n       dispatch-dealer-pack-queue.mjs enqueue --automatic --run ID [--report FILE]\n       dispatch-dealer-pack-queue.mjs drain --owner github:RUN_ID --write [--max 400] [--report FILE]\nInspect verifies full sealed bundles; --live also checks fresh provider identity/capacity without writes. Enqueue persists authenticated manifest/source requests first; --automatic also prevents semantic re-enqueue of retained requests. Drain authenticates all compiled bytes and QA, then services all batches using the single durable Git CAS account claim.');return;}
  const [action,...args]=argv;assert(['inspect','enqueue','drain'].includes(action),'Use inspect, enqueue or drain');const options={};for(let i=0;i<args.length;i++){if(['--write','--live','--automatic'].includes(args[i])){const flag=args[i].slice(2);assert(!options[flag],'Repeated '+args[i]);options[flag]=true;continue;}assert(['--run','--prefix','--slugs','--batch','--report','--owner','--max'].includes(args[i])&&args[i+1]&&!options[args[i]],'Invalid queue dispatch argument');options[args[i]]=args[++i];}
  assert(!options.live||action==='inspect','--live is an inspect-only dry-run; enqueue never downloads large shards twice');
  assert(!options.automatic||action==='enqueue','--automatic is enqueue-only');
  assert(!options.write||action==='drain','Only drain accepts --write');const cache=path.join(root,'runtime/dealer-pack-deploy-cache'),store=providedStore??gitPackQueueStore({directory:path.join(cache,'queue.git')}),resolver=providedResolver??packArtifactResolver({root,cache}),registry=providedRegistry??json(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'));let report;
  if(action==='drain'){assert(options.write&&options['--owner'],'Drain requires --write and an identifiable owner');report=await drainPackDeployments({store,provider:cloudflarePackProvider({api:tokenCloudflareTransport()}),root,owner:options['--owner'],maximum:Number(options['--max']??400),write:true,registry,readGithub:resolver.readGithub,inspectCandidate:async request=>resolver.materialize(request,(await store.read()).state,registry)});}
  else{assert(/^[1-9][0-9]{0,14}$/.test(options['--run']??''),'Choose an exact source run ID');const slugs=options['--slugs']?json(options['--slugs']):undefined;if(slugs)assert(Array.isArray(slugs)&&slugs.length>0&&slugs.length<=400&&new Set(slugs).size===slugs.length,'Use a distinct exact slug JSON array');report=await resolver.discover(Number(options['--run']),{prefix:options['--prefix'],slugs,batch:options['--batch'],queue:(await store.read()).state,registry,verifyBundles:action==='inspect',provider:options.live?cloudflarePackProvider({api:tokenCloudflareTransport()}):undefined});
    if(action==='enqueue'&&report.requests.length){report.enqueued=(await enqueue(store,report.requests,{collectRejections:true,...(options.automatic?{automatic:true}:{})})).value;
      const retained=new Set([...report.enqueued.added,...report.enqueued.existing]);report.requests=report.requests.filter(row=>retained.has(row.id));
      report.failures.push(...report.enqueued.rejected.map(row=>({...row,phase:'durable-queue-intake'})));report.success=report.failures.length===0;report.status=report.success?'enqueued':'enqueued-with-rejections';
    }
  }
  if(options['--report']){const file=path.resolve(options['--report']);assert(file.startsWith(path.join(root,'runtime')+path.sep),'Dispatcher reports belong in generated runtime output');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}
  console.log(JSON.stringify({type:report.type??'cars-pack-queue-drain',status:report.status,ready:report.requests?.length,pending:report.pending,failures:report.failures,results:report.results?.map(row=>({status:row.status,slug:row.receipt?.slug,error:row.error})),report:options['--report']??null},null,2));if(report.status==='completed-with-failures'||report.success===false&&!report.requests?.length)process.exitCode=1;return report;
}
if(isEntrypoint(import.meta.url))runPackQueueDispatcher().catch(error=>{console.error(error.message);process.exitCode=1;});
