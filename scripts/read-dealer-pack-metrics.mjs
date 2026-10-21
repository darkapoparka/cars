/** Read-only metrics. CPU units were confirmed by authenticated GraphQL schema
 * introspection on2026-10-19; memory percentiles became available2026-06-30.
 * https://developers.cloudflare.com/analytics/graphql-api/tutorials/querying-workers-metrics/
 * https://developers.cloudflare.com/changelog/post/2026-06-30-memory-usage-metrics/
 * https://developers.cloudflare.com/analytics/graphql-api/getting-started/authentication/api-token-auth/
 * Successful invocation classes (including clientDisconnected):
 * https://developers.cloudflare.com/workers/observability/metrics-and-analytics/
 */
import fs from 'node:fs';
import path from 'node:path';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {PACK_DEPLOY_ACCOUNT} from './lib/dealer-pack-queue.mjs';
import {expectedPackHosting} from './lib/dealer-pack-identity.mjs';
import {PACK_RUNTIME_LIMITS} from './lib/dealer-pack-cloudflare.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
const successfulInvocationStatuses=['success','clientDisconnected'];
export const PACK_METRICS_QUERY=`query CarsPackMetrics($accountTag: string!, $scriptName: string!, $start: Time!, $end: Time!) {
  viewer {
    accounts(filter: {accountTag: $accountTag}) {
      workersInvocationsAdaptive(limit: 100, filter: {scriptName: $scriptName, datetime_geq: $start, datetime_leq: $end}) {
        dimensions {scriptName status}
        sum {requests errors}
        quantiles {cpuTimeP50 cpuTimeP90 cpuTimeP99 cpuTimeP999 memoryUsageBytesP50 memoryUsageBytesP90 memoryUsageBytesP99 memoryUsageBytesP999}
      }
    }
  }
}`;

export function packMetricsRequest({slug,start,end}) {
  const {workerName}=expectedPackHosting(slug),from=Date.parse(start),to=Date.parse(end);assert(Number.isFinite(from)&&Number.isFinite(to)&&to>from&&to-from<=24*3600*1000,'Choose the exact hosted check window, bounded to24hours');
  return {method:'POST',path:'/graphql',body:{query:PACK_METRICS_QUERY,variables:{accountTag:PACK_DEPLOY_ACCOUNT,scriptName:workerName,start:new Date(from).toISOString(),end:new Date(to).toISOString()}}};
}
export function assessPackMetrics(response,{slug,start,end,startupTimeMs=null,cpuLimitMs=null,cpuLimitSource}={}) {
  packMetricsRequest({slug,start,end});assert(startupTimeMs===null||Number.isFinite(startupTimeMs)&&startupTimeMs>=0,'Startup measurement must be a nonnegative number or unavailable');
  assert(cpuLimitMs===null||Number.isSafeInteger(cpuLimitMs)&&cpuLimitMs>0&&cpuLimitMs<=PACK_RUNTIME_LIMITS.maximumCpuMs,'CPU comparison requires an explicit valid Paid HTTP limit or unavailable');
  const limitSource=cpuLimitMs===null?null:cpuLimitSource??'caller-supplied';
  assert(limitSource===null||['provider-version-response','provider-active-version-readback','successful-explicit-upload-request','caller-supplied'].includes(limitSource),'Unknown CPU limit evidence source');
  assert(response?.success===true&&response.status===200&&!response.errors?.length,'Authenticated GraphQL metrics query failed');
  const root=response.result?.viewer??response.result?.data?.viewer,accounts=root?.accounts;assert(Array.isArray(accounts)&&accounts.length===1&&Array.isArray(accounts[0].workersInvocationsAdaptive),'Exact account metrics response required');
  const rows=accounts[0].workersInvocationsAdaptive,{workerName}=expectedPackHosting(slug);assert(rows.length<100&&rows.every(row=>row.dimensions?.scriptName===workerName&&Number.isFinite(row.sum?.requests)&&row.sum.requests>=0&&Number.isFinite(row.sum?.errors)&&row.sum.errors>=0),'Metrics are truncated or identify another Worker');
  const values=rows.map(row=>({status:row.dimensions.status,requests:row.sum.requests,errors:row.sum.errors,cpuMicroseconds:Object.fromEntries(Object.entries(row.quantiles??{}).filter(([key])=>key.startsWith('cpuTime'))),memoryBytes:Object.fromEntries(Object.entries(row.quantiles??{}).filter(([key])=>key.startsWith('memoryUsageBytes')))}));
  assert(values.every(row=>Object.values({...row.cpuMicroseconds,...row.memoryBytes}).every(value=>value===null||Number.isFinite(value)&&value>=0)),'Runtime metrics contain invalid or negative units');
  const requests=values.reduce((sum,row)=>sum+row.requests,0),errors=values.reduce((sum,row)=>sum+row.errors,0),observed=values.filter(row=>row.requests>0),cpuAvailable=observed.length>0&&observed.every(row=>['cpuTimeP50','cpuTimeP99'].every(key=>Number.isFinite(row.cpuMicroseconds[key]))),memoryAvailable=observed.length>0&&observed.every(row=>['memoryUsageBytesP50','memoryUsageBytesP99'].every(key=>Number.isFinite(row.memoryBytes[key])));
  const clientDisconnectedRequests=values.filter(row=>row.status==='clientDisconnected').reduce((sum,row)=>sum+row.requests,0),exceptional=values.filter(row=>row.requests>0&&!successfulInvocationStatuses.includes(row.status)),maxP99CpuMs=cpuAvailable?Math.max(...observed.map(row=>row.cpuMicroseconds.cpuTimeP99))/1000:null,maxP99MemoryMiB=memoryAvailable?Math.max(...observed.map(row=>row.memoryBytes.memoryUsageBytesP99))/(1024**2):null;
  const startupWithinLimit=startupTimeMs===null?null:startupTimeMs<=PACK_RUNTIME_LIMITS.startupMs,cpuWithinLimit=cpuAvailable&&cpuLimitMs!==null?maxP99CpuMs<=cpuLimitMs:null,memoryWithinLimit=memoryAvailable?maxP99MemoryMiB<=PACK_RUNTIME_LIMITS.memoryBytes/(1024**2):null;
  const checks=[startupWithinLimit,cpuWithinLimit,memoryWithinLimit,errors||exceptional.length?false:requests>0?true:null],withinLimits=checks.includes(false)?false:checks.every(value=>value===true)?true:null;
  const status=errors||exceptional.length?'observed-errors':requests===0?'awaiting-ingestion':[startupWithinLimit,cpuWithinLimit,memoryWithinLimit].includes(false)?'observed-limits-exceeded':withinLimits===null?'incomplete':'observed-without-errors';
  return {schemaVersion:1,type:'cars-dealer-pack-runtime-metrics',slug,workerName,accountId:PACK_DEPLOY_ACCOUNT,window:{start,end},observedAt:new Date().toISOString(),providerWrites:0,requests,errors,clientDisconnectedRequests,exceptionalStatuses:exceptional.map(row=>({status:row.status,requests:row.requests})),startupTimeMs,
    cpuAvailable,memoryAvailable,maxP99CpuMs,maxP99MemoryMiB,rows:values,status,cpuLimitMs,cpuLimitSource:limitSource,withinLimits,
    limitChecks:{startup:{withinLimit:startupWithinLimit,observedMs:startupTimeMs,limitMs:PACK_RUNTIME_LIMITS.startupMs},cpu:{withinLimit:cpuWithinLimit,observedMaxGroupP99Ms:maxP99CpuMs,limitMs:cpuLimitMs},memory:{withinLimit:memoryWithinLimit,observedMaxGroupP99MiB:maxP99MemoryMiB,limitMiB:PACK_RUNTIME_LIMITS.memoryBytes/(1024**2)}},
    limitsReference:{source:PACK_RUNTIME_LIMITS.source,verifiedAt:PACK_RUNTIME_LIMITS.verifiedAt},
    invocationStatusReference:'https://developers.cloudflare.com/workers/observability/metrics-and-analytics/',
    interpretation:'withinLimits compares measured upload startup and sampled maximum group P99 CPU/memory values against their stated limits, and requires observed invocations without errors. Client disconnect counts and raw statuses are retained separately and count as successful invocations per Cloudflare; reported errors or any other observed status still block acceptance. It is null when evidence is incomplete unless an observed failure already establishes false. These are not exact peaks, whole-window quantiles or a guarantee about every invocation. Memory is shared per V8 isolate; absent data is not zero usage. This pilot does not establish sustained production-load headroom.'};
}
export async function readPackMetrics({slug,start,end,startupTimeMs,cpuLimitMs,cpuLimitSource,api}={}) {
  if(!api){const token=process.env.CLOUDFLARE_API_TOKEN;assert(typeof token==='string'&&token.length>10,'CLOUDFLARE_API_TOKEN needs Account Analytics Read, or use the authorized connector');api=async operation=>{const response=await fetch('https://api.cloudflare.com/client/v4/graphql',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(operation.body),signal:AbortSignal.timeout(30000)}),body=await response.json();return {status:response.status,success:response.ok&&!body.errors?.length,errors:body.errors??[],result:body.data};};}
  return assessPackMetrics(await api(packMetricsRequest({slug,start,end})),{slug,start,end,startupTimeMs,cpuLimitMs,cpuLimitSource});
}
if(isEntrypoint(import.meta.url)){
  (async()=>{const args=process.argv.slice(2);if(args.includes('--help')){console.log('Usage: read-dealer-pack-metrics.mjs --slug SLUG --start ISO --end ISO --report FILE [--startup-ms N] [--cpu-limit-ms N] [--cpu-limit-source SOURCE]\nReads sampled CPU/memory/status metrics only. CPU/startup limits need explicit evidence; missing/lagged samples remain unmeasured and withinLimits cannot pass.');return;}
    const options={};for(let i=0;i<args.length;i+=2){assert(['--slug','--start','--end','--report','--startup-ms','--cpu-limit-ms','--cpu-limit-source'].includes(args[i])&&args[i+1]&&!options[args[i]],'Invalid metrics arguments');options[args[i]]=args[i+1];}assert(options['--report'],'Retain an exact metrics report');const report=await readPackMetrics({slug:options['--slug'],start:options['--start'],end:options['--end'],startupTimeMs:options['--startup-ms']===undefined?null:Number(options['--startup-ms']),cpuLimitMs:options['--cpu-limit-ms']===undefined?null:Number(options['--cpu-limit-ms']),cpuLimitSource:options['--cpu-limit-source']}),file=path.resolve(options['--report']);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(report.withinLimits===false)process.exitCode=1;
  })().catch(error=>{console.error(error.message);process.exitCode=1;});
}
