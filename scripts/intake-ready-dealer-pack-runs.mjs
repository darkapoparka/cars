/** Retain independently qualified outputs from active, owner-selected main runs.
 * The existing dispatcher authenticates each completed producer and all inputs.
 * This scheduler never builds, retries failed requests or writes to a provider.
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,json} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {PACK_QUEUE_REPOSITORY,enqueuePackDeployments} from './lib/dealer-pack-queue.mjs';
import {gitPackQueueStore} from './lib/dealer-pack-queue-git.mjs';
import {githubPackTransport} from './deploy-dealer-packs.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
const api='/repos/'+PACK_QUEUE_REPOSITORY;

export function selectReadyPackRunCandidates(body,{now=Date.now(),maximumRuns=4}={}) {
  assert(Number.isSafeInteger(maximumRuns)&&maximumRuns>0&&maximumRuns<=8,'Choose at most eight source runs per scheduler invocation');
  assert(Number.isFinite(now),'Current observation time required');
  assert(Array.isArray(body?.workflow_runs)&&Number.isSafeInteger(body.total_count)&&body.total_count>=0&&body.total_count<=100&&body.workflow_runs.length===body.total_count,'Complete bounded authenticated active-run inventory required');
  const selected=[],skipped=[],ids=new Set();
  for(const run of body.workflow_runs){
    assert(Number.isSafeInteger(run?.id)&&run.id>0&&!ids.has(run.id),'Distinct exact active-run identities required');ids.add(run.id);
    const created=Date.parse(run.created_at),sameRepository=run.repository?.full_name===PACK_QUEUE_REPOSITORY&&run.head_repository?.full_name===PACK_QUEUE_REPOSITORY;
    if(!sameRepository||run.path!=='.github/workflows/dealer-pack-pipeline.yml'||run.event!=='workflow_dispatch'||run.head_branch!=='main'||run.status!=='in_progress'||run.conclusion!==null||!/^[a-f0-9]{40}$/.test(run.head_sha??'')||!Number.isSafeInteger(run.run_attempt)||run.run_attempt<1||run.run_attempt>100||!Number.isFinite(created)||created>now+300000||created<now-7*86400000){
      skipped.push({runId:run.id,reason:'Not a current same-repository manually selected main producer'});continue;
    }
    selected.push(run);
  }
  selected.sort((a,b)=>Date.parse(a.created_at)-Date.parse(b.created_at)||a.id-b.id);
  return {runs:selected.slice(0,maximumRuns),deferred:selected.slice(maximumRuns).map(row=>row.id),skipped};
}

export async function intakeReadyPackRuns({root=ROOT,readGithub=githubPackTransport(),store,registry,resolver,enqueue=enqueuePackDeployments,now=Date.now(),maximumRuns=4}={}) {
  const reply=await readGithub({method:'GET',path:api+'/actions/workflows/dealer-pack-pipeline.yml/runs',query:{status:'in_progress',branch:'main',event:'workflow_dispatch',per_page:100,page:1}});
  assert(reply.status===200,'Authenticated active producer listing is unavailable');
  const candidates=selectReadyPackRunCandidates(reply.body,{now,maximumRuns});
  const report={schemaVersion:1,type:'cars-ready-pack-scheduled-intake',observedAt:new Date(now).toISOString(),sourceRuns:candidates.runs.map(run=>run.id),deferred:candidates.deferred,skipped:candidates.skipped,results:[],providerWrites:0,queueRequestsAdded:0};
  if(!candidates.runs.length)return report;
  const cache=path.join(root,'runtime/dealer-pack-deploy-cache');
  store??=gitPackQueueStore({directory:path.join(cache,'queue.git')});
  registry??=json(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'));
  resolver??=(await import('./dispatch-dealer-pack-queue.mjs')).packArtifactResolver({root,cache,readGithub});
  for(const run of candidates.runs){
    try{
      const inspection=await resolver.discover(run.id,{queue:(await store.read()).state,registry,verifyBundles:false});
      assert(inspection.runId===run.id&&inspection.sourceCommit===run.head_sha&&Array.isArray(inspection.requests),'Exact authenticated source inspection required');
      // The maintained queue treats an identical retained request as existing,
      // including failed requests. Discovery cannot restart or replace them.
      const enqueued=inspection.requests.length?(await enqueue(store,inspection.requests,{collectRejections:true,automatic:true})).value:{added:[],existing:[],rejected:[]};
      report.queueRequestsAdded+=enqueued.added.length;
      report.results.push({runId:run.id,sourceCommit:run.head_sha,status:inspection.requests.length?(enqueued.added.length||enqueued.existing.length?'retained':'held-by-queue'):'awaiting-qualified-producers',producers:inspection.producers??[],pending:inspection.pending??[],failures:[...(inspection.failures??[]),...enqueued.rejected.map(row=>({...row,phase:'durable-queue-intake'}))],enqueued});
    }catch(error){report.results.push({runId:run.id,sourceCommit:run.head_sha,status:'held',reason:error.message});}
  }
  return report;
}

export async function runReadyPackIntakeCli(argv=process.argv.slice(2)) {
  if(argv.includes('--help')){console.log('Usage: intake-ready-dealer-pack-runs.mjs [--report runtime/PATH.json]\nRetains qualified completed producer outputs from up to four active same-repository manual main builds. Exact dispatcher, source, contracts, artifact and queue guards remain mandatory. No provider writes or failed-request retries.');return;}
  assert(argv.length===0||argv.length===2&&argv[0]==='--report','Use only an optional generated report path');
  const report=await intakeReadyPackRuns();
  if(argv.length){const file=path.resolve(ROOT,argv[1]);assert(file.startsWith(path.join(ROOT,'runtime')+path.sep),'Ready-intake report belongs in generated runtime output');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}
  console.log(JSON.stringify(report,null,2));return report;
}
if(isEntrypoint(import.meta.url))runReadyPackIntakeCli().catch(error=>{console.error(error.message);process.exitCode=1;});
