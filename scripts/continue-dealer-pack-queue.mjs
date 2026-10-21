/** Hand off an authenticated bounded drain; never claim, enqueue or deploy here. */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {PACK_QUEUE_REPOSITORY,githubPackQueueStore,queueDigest,validatePackQueue} from './lib/dealer-pack-queue.mjs';
import {githubPackTransport} from './deploy-dealer-packs.mjs';

const api='/repos/'+PACK_QUEUE_REPOSITORY;
const workflow='.github/workflows/dealer-pack-deploy.yml';
const hex40=value=>/^[a-f0-9]{40}$/.test(value??'');
const normal=(event,action)=>['schedule','workflow_run'].includes(event)||event==='workflow_dispatch'&&['drain','enqueue-and-deploy'].includes(action);

export async function dispatchPackContinuation({sourceSha,token=process.env.GITHUB_TOKEN,fetchImpl=fetch}={}) {
  if(!hex40(sourceSha)||typeof token!=='string'||token.length<=10)throw Error('Authenticated exact-source continuation required');
  // A timeout may have accepted the dispatch. Never retry this POST here.
  const response=await fetchImpl('https://api.github.com'+api+'/actions/workflows/dealer-pack-deploy.yml/dispatches',{
    method:'POST',headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify({ref:'main',inputs:{action:'drain',batch:'auto',continuation_source_sha:sourceSha}}),signal:AbortSignal.timeout(30000),
  });
  // The pinned API traditionally returns an empty 204; newer GitHub responses
  // may positively identify the requested run with a 200 instead.
  if(response.status===204)return {httpStatus:204};
  if(response.status===200){
    const body=await response.json(),id=body?.workflow_run_id;
    if(Number.isSafeInteger(id)&&id>0&&body.run_url==='https://api.github.com'+api+'/actions/runs/'+id&&body.html_url==='https://github.com/'+PACK_QUEUE_REPOSITORY+'/actions/runs/'+id)return {httpStatus:200,runId:id};
  }
  throw Error('Continuation dispatch was not acknowledged (HTTP '+response.status+'); no retry attempted');
}

export async function continuePackQueue({drain,env=process.env,readGithub=githubPackTransport(),store,dispatch=dispatchPackContinuation}={}) {
  const report={schemaVersion:1,type:'cars-pack-queue-continuation',status:'skipped',providerWrites:0,queueWrites:0,dispatches:0};
  const skip=reason=>({...report,reason});
  const runId=Number(env.GITHUB_RUN_ID),attempt=Number(env.GITHUB_RUN_ATTEMPT),sourceSha=env.PACK_EXECUTOR_SHA;
  if(!normal(env.GITHUB_EVENT_NAME,env.PACK_ACTION))return skip('Only normal drains may continue; inspection and recovery cannot self-dispatch');
  if(env.GITHUB_REPOSITORY!==PACK_QUEUE_REPOSITORY||env.GITHUB_REF!=='refs/heads/main'||env.GITHUB_WORKFLOW_REF!==PACK_QUEUE_REPOSITORY+'/'+workflow+'@refs/heads/main'||!hex40(sourceSha)||sourceSha!==env.GITHUB_SHA||sourceSha!==env.GITHUB_WORKFLOW_SHA||!Number.isSafeInteger(runId)||runId<1||attempt!==1)return skip('Not the original execution of the exact published main workflow source');
  if(!['completed','completed-with-failures'].includes(drain?.status)||!Array.isArray(drain.results)||drain.results.length<1||drain.results.length>10||drain.results.some(row=>!['deployed','failed'].includes(row.status)||row.claimRetained||row.status==='deployed'&&(row.error||!row.receipt)||row.status==='failed'&&(!/^[a-f0-9]{64}$/.test(row.requestId??'')||typeof row.error!=='string'||!row.error)))return skip('Drain did not complete one to ten bounded deployment results');
  const deployed=drain.results.filter(row=>row.status==='deployed').length,failed=drain.results.length-deployed;
  // A completely failed batch needs diagnosis rather than automatic fan-out.
  if(!deployed||drain.status!==(failed?'completed-with-failures':'completed'))return skip('Drain made no verified progress or its terminal status differs from its results');
  report.parentRunId=runId;report.sourceSha=sourceSha;report.completed=drain.results.length;report.deployed=deployed;report.failed=failed;
  const current=await readGithub({method:'GET',path:api+'/actions/runs/'+runId});
  const run=current.body;
  if(current.status!==200||run?.id!==runId||run.run_attempt!==attempt||run.repository?.full_name!==PACK_QUEUE_REPOSITORY||run.head_repository?.full_name!==PACK_QUEUE_REPOSITORY||run.path!==workflow||run.head_branch!=='main'||run.head_sha!==sourceSha||run.event!==env.GITHUB_EVENT_NAME||run.status!=='in_progress'||run.conclusion!==null)return skip('Current authenticated executor identity is unavailable or differs');
  const main=await readGithub({method:'GET',path:api+'/git/ref/heads/main'});
  if(main.status!==200||main.body?.ref!=='refs/heads/main'||main.body.object?.type!=='commit'||!hex40(main.body.object.sha))return skip('Current published main could not be bound to an authenticated commit');
  // Accepted main may advance while a ten-site batch is publishing. The child
  // binds to that exact current commit, then runs its own executor contracts.
  // Its pre-step SHA gate still rejects a second advance during dispatch.
  const continuationSourceSha=main.body.object.sha;
  report.continuationSourceSha=continuationSourceSha;
  // Read after the source check, rather than trusting the drain's old snapshot.
  // A claim acquired after this read is still protected by the child's usual CAS.
  const snapshot=await (store??githubPackQueueStore({request:readGithub})).read(),state=validatePackQueue(snapshot.state);
  report.queueGeneration=state.generation;
  if(state.active||Object.values(state.requests).some(row=>['active','needs-reconciliation'].includes(row.status)))return skip('An active or uncertain account publication claim remains held');
  const ids=new Set();
  for(const result of drain.results){
    const receipt=result.receipt,id=result.status==='deployed'?receipt.requestId:result.requestId,row=state.requests[id];
    if(ids.has(id)||!row||row.status!==result.status||row.events.findLast(event=>event.kind==='claimed')?.owner!=='github:'+runId)return skip('Drain results are not distinct terminal requests owned by this exact executor');
    if(receipt){
      const digest=queueDigest(receipt);
      if(receipt.requestId!==id||receipt.queueId!==state.queueId||receipt.status!=='deployed'||row.request.slug!==receipt.slug||row.receiptSha256!==digest||!state.receipts[receipt.slug]?.some(item=>item.sha256===digest&&queueDigest(item.receipt)===digest))return skip('Drain receipt is not retained by this exact queue and executor');
    }
    if(result.status==='deployed'){
      if(receipt.hostedVerified!==true)return skip('Successful drain receipt lacks passing hosted evidence');
    }else{
      const last=row.events.at(-1),claimIndex=row.events.findLastIndex(event=>event.kind==='claimed'),afterClaim=row.events.slice(claimIndex+1);
      const expectedError=(receipt?'Hosted verification failed: '+result.error:result.error).slice(0,2000);
      const finishedAt=Date.parse(row.finishedAt),terminalAt=Date.parse(last?.at),claimedAt=Date.parse(row.events[claimIndex]?.at);
      if(last?.kind!=='failed'||last.error!==expectedError||row.error!==expectedError||![finishedAt,terminalAt,claimedAt].every(Number.isFinite)||finishedAt<claimedAt||terminalAt<finishedAt)return skip('Failed result lacks its exact durable terminal failure');
      if(receipt){
        if(receipt.hostedVerified!==false||receipt.hostedFailure!==result.error||!afterClaim.some(event=>event.kind==='deployment-established'&&event.receipt?.requestId===id&&event.receipt?.versionId===receipt.versionId))return skip('Hosted failure lacks its retained established deployment');
      }else if(result.claimRetained!==false||result.slug!==row.request.slug||row.receiptSha256||afterClaim.some(event=>event.kind!=='failed'))return skip('Receipt-free failure did not stop before provider intents');
    }
    ids.add(id);
  }
  // Failed and rolled-back rows stay terminal; only the existing queued rows count.
  report.pending=state.order.filter(id=>state.requests[id].status==='queued').length;
  if(!report.pending)return skip('No eligible queued work remains');
  const acknowledgement=await dispatch({sourceSha:continuationSourceSha});
  return {...report,status:'dispatched',dispatches:1,...(acknowledgement?.runId?{childRunId:acknowledgement.runId}:{}),reason:'One drain requested at exact current accepted main; child executor contracts and account CAS remain mandatory'};
}

export async function runPackContinuationCli(argv=process.argv.slice(2),{root=ROOT,env=process.env,...dependencies}={}) {
  if(argv.length!==4||argv[0]!=='--drain'||argv[2]!=='--report')throw Error('Use --drain runtime/PATH.json --report runtime/PATH.json');
  const generated=file=>{const resolved=path.resolve(root,file);if(!resolved.startsWith(path.join(root,'runtime')+path.sep))throw Error('Continuation inputs and reports belong in generated runtime output');return resolved;};
  const input=generated(argv[1]),out=generated(argv[3]);let report;
  try{report=await continuePackQueue({drain:JSON.parse(fs.readFileSync(input,'utf8')),env,...dependencies});}
  catch(error){report={schemaVersion:1,type:'cars-pack-queue-continuation',status:'blocked',providerWrites:0,queueWrites:0,dispatches:null,reason:error.message};process.exitCode=1;}
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));return report;
}
if(isEntrypoint(import.meta.url))runPackContinuationCli().catch(error=>{console.error(error.message);process.exitCode=1;});
