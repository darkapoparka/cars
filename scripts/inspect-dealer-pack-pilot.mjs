/** Read-only pre-merge pilot inspection. The committed request is data, never
 * executable instructions; this entrypoint cannot enqueue or deploy a Worker. */
import fs from 'node:fs';
import path from 'node:path';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {ROOT,json,writeJson} from './lib/workflow.mjs';
import {githubPackTransport} from './deploy-dealer-packs.mjs';
import {runPackQueueDispatcher,validatePackSourceRun} from './dispatch-dealer-pack-queue.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
export const PACK_PILOT_SLUGS=Object.freeze(['za-motors','wadishee-used-cars','granada-auto-sales']);
const sameSlugs=value=>Array.isArray(value)&&value.length===3&&new Set(value).size===3&&PACK_PILOT_SLUGS.every(slug=>value.includes(slug));

export function validatePackPilotInspectionRequest(value) {
  assert(value&&typeof value==='object'&&!Array.isArray(value),'Pilot inspection request must be an object');
  const keys=['schemaVersion','action','sourceRunId','sourceCommit','slugs'];
  assert(Object.keys(value).length===keys.length&&Object.keys(value).every(key=>keys.includes(key)),'Pilot request accepts only exact source identifiers and the three proof slugs');
  assert(value.schemaVersion===1&&value.action==='inspect','The branch pilot trigger only accepts inspect; queue/provider writes are unavailable');
  assert(Number.isSafeInteger(value.sourceRunId)&&value.sourceRunId>0&&/^[a-f0-9]{40}$/.test(value.sourceCommit??''),'Pilot request requires an immutable build run and full source commit');
  assert(sameSlugs(value.slugs),'Pilot inspection must select exactly the three authorized proof dealers');
  return {...value,slugs:[...PACK_PILOT_SLUGS]};
}

export async function inspectPackPilot({request,reportFile=path.join(ROOT,'runtime/dealer-pack-dispatch/pilot-summary.json'),readGithub=githubPackTransport(),dispatch=runPackQueueDispatcher,providerTokenPresent=Boolean(process.env.CLOUDFLARE_API_TOKEN)}={}) {
  const selected=validatePackPilotInspectionRequest(request),reply=await readGithub({method:'GET',path:'/repos/darkapoparka/cars/actions/runs/'+selected.sourceRunId});
  assert(reply.status===200,'The exact pilot source run is unavailable');
  const source=validatePackSourceRun(reply.body,selected.sourceRunId);
  assert(source.head_sha===selected.sourceCommit,'Pilot request source commit differs from the authenticated run');
  const directory=path.resolve(path.dirname(reportFile));
  assert(directory.startsWith(path.join(ROOT,'runtime')+path.sep),'Pilot reports must remain in this executor generated runtime');
  const slugsFile=path.join(directory,'pilot-slugs.json'),inspectionFile=path.join(directory,'pilot-inspection.json');
  writeJson(slugsFile,selected.slugs);
  const args=['inspect','--run',String(source.id),'--slugs',slugsFile,'--report',inspectionFile];
  if(providerTokenPresent)args.push('--live');
  const inspection=await dispatch(args);
  assert(inspection?.success===true&&inspection.providerWrites===0&&inspection.bundleVerified===true&&inspection.sourceCommit===selected.sourceCommit&&sameSlugs(inspection.requests?.map(row=>row.slug)),'All three exact pilot bundles must pass the ordinary sealed-bundle inspection');
  assert(inspection.liveProviderVerified===providerTokenPresent,'Pilot provider evidence does not match credential availability');
  const report={schemaVersion:1,type:'cars-pack-premerge-pilot-inspection',status:providerTokenPresent?'dry-run-passed':'blocked-missing-provider-token',request:selected,
    bundleInspection:'passed',liveProviderVerified:inspection.liveProviderVerified,providerObservations:inspection.providerObservations??[],
    providerWrites:0,queueWrites:0,deployments:0,readyToDeploy:false,requiredSecret:providerTokenPresent?null:'CLOUDFLARE_API_TOKEN',
    inspectedAt:new Date().toISOString(),inspectionReport:path.relative(ROOT,inspectionFile),
    nextStep:providerTokenPresent?'Use the guarded account queue for the separately recorded write execution.':'Add CLOUDFLARE_API_TOKEN with the documented minimum account/zone permissions, then repeat live inspection before the guarded queue write.'};
  writeJson(reportFile,report);
  return report;
}

if(isEntrypoint(import.meta.url)){
  (async()=>{const args=process.argv.slice(2),options={};for(let i=0;i<args.length;i+=2){assert(['--request','--report'].includes(args[i])&&args[i+1]&&!options[args[i]],'Use --request FILE [--report FILE]; this command has no write option');options[args[i]]=args[i+1];}
    assert(options['--request'],'An exact committed pilot request is required');
    const report=await inspectPackPilot({request:json(path.resolve(options['--request'])),...(options['--report']?{reportFile:path.resolve(options['--report'])}:{})});
    console.log(JSON.stringify(report,null,2));
    if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'### Three-proof deployment dry run\n\nAll three sealed bundles passed. Cloudflare live reads: '+report.liveProviderVerified+'. Provider writes: 0. Queue writes: 0. Deployments: 0.\n\n'+(report.requiredSecret?'Blocked: repository secret `CLOUDFLARE_API_TOKEN` is missing.':'Live preflight passed; no write was requested.')+'\n');
  })().catch(error=>{console.error(error.message);process.exitCode=1;});
}
