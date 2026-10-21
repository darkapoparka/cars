/** One-shot scheduler-native completion notice; qualified intake remains the receiver's job.
 * workflow_dispatch is an explicit GITHUB_TOKEN recursion-suppression exception:
 * https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow
 */
import fs from 'node:fs';
import path from 'node:path';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';

const ROOT=path.resolve(import.meta.dirname,'..');
const repository='darkapoparka/cars';
const nativeWorkflow='.github/workflows/dealer-pack-pipeline.yml';
const apiRoot='/repos/'+repository;
const dispatchPath=apiRoot+'/actions/workflows/dealer-pack-deploy.yml/dispatches';
const hex=(value,length)=>new RegExp('^[a-f0-9]{'+length+'}$').test(value??'');

function context(env) {
  if(env.GITHUB_REPOSITORY!==repository||env.GITHUB_REF!=='refs/heads/main'||env.GITHUB_EVENT_NAME!=='workflow_dispatch')return {reason:'Only the same-repository main scheduler dispatch may notify intake'};
  if(env.GITHUB_RUN_ATTEMPT!=='1'||env.PACK_CANCELLED==='true'||!['success','failure'].includes(env.LANE_RESULT))return {reason:'Rerun, cancelled or unfinished native outcomes cannot notify intake'};
  if(env.CONTRACTS_RESULT!=='success'||env.PLAN_RESULT!=='success'||env.HAS_WORK!=='true'||env.BENCHMARK!=='false')return {reason:'Successful contracts and a nonbenchmark source plan with work are required'};
  const sourceSha=env.ROLLOUT_SOURCE_SHA,nonce=env.ROLLOUT_REQUEST_ID,runId=Number(env.GITHUB_RUN_ID);
  if(!hex(nonce,64)||!hex(sourceSha,40)||sourceSha!==env.GITHUB_SHA||sourceSha!==env.GITHUB_WORKFLOW_SHA||env.GITHUB_WORKFLOW_REF!==repository+'/'+nativeWorkflow+'@refs/heads/main'||!/^[1-9][0-9]{0,14}$/.test(env.GITHUB_RUN_ID??'')||!Number.isSafeInteger(runId))return {reason:'Exact original scheduler nonce, source and native workflow identity are required'};
  return {runId,sourceSha,nonce};
}

function writeExclusive(file,report) {
  fs.mkdirSync(path.dirname(file),{recursive:true});
  const fd=fs.openSync(file,'wx',0o600);
  try{fs.writeFileSync(fd,JSON.stringify(report,null,2)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
}

function writeResult(file,report) {
  // Preserve the fsynced intent if a crash or storage failure interrupts the ack.
  const next=file+'.next';writeExclusive(next,report);fs.renameSync(next,file);
}

function existingIntent(reportFile) {
  return {schemaVersion:1,type:'cars-pack-source-completion',status:'needs-reconciliation',reason:'A retained report or dispatch intent already exists; no second POST is permitted',reportFile,providerWrites:0,queueWrites:0,dispatches:0};
}

function validRun(run,source) {
  return run?.id===source.runId&&run.repository?.full_name===repository&&run.head_repository?.full_name===repository&&run.head_branch==='main'&&run.head_sha===source.sourceSha&&run.path===nativeWorkflow&&run.event==='workflow_dispatch'&&run.run_attempt===1&&run.display_title==='Cars rollout '+source.nonce&&run.status==='in_progress'&&run.conclusion===null;
}

export async function notifyPackSourceComplete({env=process.env,reportFile,fetchImpl=fetch,now=()=>new Date().toISOString()}={}) {
  if(typeof reportFile!=='string'||!path.isAbsolute(reportFile))throw Error('An absolute generated notification report path is required');
  if(fs.existsSync(reportFile))return existingIntent(reportFile);
  const source=context(env),base={schemaVersion:1,type:'cars-pack-source-completion',recordedAt:now(),providerWrites:0,queueWrites:0,dispatches:0};
  const finishBeforePost=(status,reason)=>{
    const report={...base,status,reason};
    try{writeExclusive(reportFile,report);}catch(error){if(error.code==='EEXIST'&&fs.existsSync(reportFile))return existingIntent(reportFile);throw error;}
    return report;
  };
  if(source.reason)return finishBeforePost('skipped',source.reason);
  const token=env.GITHUB_TOKEN;
  if(typeof token!=='string'||token.length<=10)return finishBeforePost('blocked','An authenticated Actions write token is required');
  const headers={Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:'Bearer '+token};
  let run,proofUnavailable=false;
  try{
    const reply=await fetchImpl('https://api.github.com'+apiRoot+'/actions/runs/'+source.runId,{method:'GET',headers,redirect:'error',signal:AbortSignal.timeout(30000)});
    if(reply.status!==200)proofUnavailable=true;
    else run=await reply.json();
  }catch{proofUnavailable=true;}
  if(proofUnavailable)return finishBeforePost('blocked','Authenticated original native run proof is unavailable');
  if(!validRun(run,source))return finishBeforePost('blocked','Authenticated native run differs from the exact original scheduler source and nonce');
  const body={ref:'main',inputs:{action:'enqueue-and-deploy',source_run_id:String(source.runId),automatic_intake:'true',batch:'auto'}};
  const intent={...base,status:'dispatch-intent',sourceRunId:source.runId,sourceSha:source.sourceSha,reservationId:source.nonce,laneResult:env.LANE_RESULT,
    sourceRun:{id:run.id,path:run.path,repository:run.repository.full_name,headRepository:run.head_repository.full_name,headBranch:run.head_branch,headSha:run.head_sha,event:run.event,attempt:run.run_attempt,displayTitle:run.display_title,status:run.status,conclusion:run.conclusion},
    dispatchIntent:{recordedAt:now(),method:'POST',path:dispatchPath,body,maximumAttempts:1},
    qualification:'Only requests a receiver inspection. Exact contracts, producer, source, artifact and automatic queue admission guards remain mandatory.'};
  try{writeExclusive(reportFile,intent);}catch(error){if(error.code==='EEXIST'&&fs.existsSync(reportFile))return existingIntent(reportFile);throw error;}
  let outcome={...intent,status:'needs-reconciliation',dispatches:null,reason:'Dispatch outcome is unknown; intent retained and no retry attempted'};
  try{
    const reply=await fetchImpl('https://api.github.com'+dispatchPath,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body),redirect:'error',signal:AbortSignal.timeout(30000)});
    outcome.httpStatus=reply.status;
    if(reply.status===204)outcome={...outcome,status:'dispatched',dispatches:1,acknowledgedAt:now(),reason:'One completion dispatch acknowledged; receiver qualification remains mandatory'};
    else if(reply.status===200){
      const ack=await reply.json(),id=ack?.workflow_run_id;
      if(Number.isSafeInteger(id)&&id>0&&ack.run_url==='https://api.github.com'+apiRoot+'/actions/runs/'+id&&ack.html_url==='https://github.com/'+repository+'/actions/runs/'+id)outcome={...outcome,status:'dispatched',dispatches:1,childRunId:id,acknowledgedAt:now(),reason:'One completion dispatch positively identified; receiver qualification remains mandatory'};
    }
  }catch{/* Even a timeout may have accepted the POST; never repeat it. */}
  try{writeResult(reportFile,outcome);}catch{return {...outcome,status:'needs-reconciliation',dispatches:null,reason:'Dispatch acknowledgement could not be retained; original intent preserved and no retry permitted'};}
  return outcome;
}

export async function runPackSourceCompletionCli(argv=process.argv.slice(2),{root=ROOT,env=process.env,...dependencies}={}) {
  if(argv.length!==2||argv[0]!=='--report')throw Error('Use --report runtime/dealer-pack-source/notify-complete.json');
  const reportFile=path.resolve(root,argv[1]);
  if(!reportFile.startsWith(path.join(path.resolve(root),'runtime')+path.sep))throw Error('Notification reports belong in generated runtime output');
  const report=await notifyPackSourceComplete({env,reportFile,...dependencies});
  console.log(JSON.stringify(report,null,2));
  if(['blocked','needs-reconciliation'].includes(report.status))process.exitCode=1;
  return report;
}

if(isEntrypoint(import.meta.url))runPackSourceCompletionCli().catch(()=>{console.error('Source completion notification failed; no dispatch retry attempted');process.exitCode=1;});
