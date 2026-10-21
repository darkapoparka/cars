/** Thin CI orchestration; all pack/build validation lives in callable commands. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {planDealerPackCi,bootstrapDealerPackCiLane} from './plan-dealer-pack-ci.mjs';
import {checkDealerPackInputs} from './check-dealer-pack-inputs.mjs';

const root=process.cwd(),json=file=>JSON.parse(fs.readFileSync(file));
const output=values=>{if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,Object.entries(values).map(([key,value])=>key+'='+(typeof value==='string'?value:JSON.stringify(value))).join('\n')+'\n');};
const save=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');};

/** Workflow head SHA is always present; it selects PR changes only when no explicit mode was requested. */
export async function planDealerPackCiEnvironment({env=process.env,root=process.cwd(),validatePack=checkDealerPackInputs,readGit}={}) {
  const benchmark25=env.PACK_BENCHMARK==='true',slugs=env.PACK_SLUGS?.trim()||undefined,batch=env.PACK_BATCH?.trim()||undefined;
  if(benchmark25&&(slugs||batch))throw Error('Benchmark planning cannot also select business slugs or an assigned batch');
  if(batch&&!/^[1-4]$/.test(batch))throw Error('Use an assigned batch from1 to4');
  const common={root,toolPackage:root+'/runtime/dealer-pack-tools/package.json',...(readGit?{readGit}: {})};
  if(benchmark25)return planDealerPackCi({...common,benchmark25:true,validatePack});
  if(slugs)return planDealerPackCi({...common,slugs,validatePack:options=>validatePack({...options,...(batch?{batch}: {})})});
  if(batch)return planDealerPackCi({...common,batch,validatePack});
  return planDealerPackCi({...common,base:env.PACK_BASE||undefined,head:env.PACK_HEAD||undefined,validatePack});
}

export async function runDealerPackCi(command) {
  if(command==='record-node'){
    const file=path.join(root,'runtime/dealer-pack-node-paths.json'),values=fs.existsSync(file)?json(file):{};
    values[process.versions.node]=process.execPath;save(file,values);return;
  }
  if(command==='plan'){
    const plan=await planDealerPackCiEnvironment({root}),benchmark25=plan.benchmarkOnly;
    save(path.join(root,'runtime/dealer-pack-plan/plan.json'),plan);
    const matrix=Array.isArray(plan.lanes)?{include:plan.lanes}:plan.lanes;
    output({matrix,has_work:matrix.include.length>0,rejected:plan.rejected.length,benchmark:benchmark25,
      release_key:createHash('sha256').update(JSON.stringify(plan.releaseIds)).digest('hex')});
    if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      'Requested '+plan.requested.length+'; accepted '+plan.valid.length+'; rejected '+plan.rejected.length+'\n\n'+plan.rejected.map(row=>'- '+row.slug+': '+row.reason).join('\n')+'\n');
    return plan;
  }
  if(command==='lane'){
    const {buildFastDealerBatch}=await import('./build-dealer-pack-fast.mjs');
    const {verifyDealerPack}=await import('./verify-dealer-pack.mjs');
    const plan=json(path.join(root,'runtime/dealer-pack-plan/plan.json')),lane=Number(process.env.PACK_LANE);
    const selected=(Array.isArray(plan.lanes)?plan.lanes:plan.lanes.include).find(row=>Number(row.lane)===lane);
    if(!selected)throw Error('Lane is absent from authenticated plan');
    const benchmarkOnly=process.env.PACK_BENCHMARK==='true';
    if(benchmarkOnly!==plan.benchmarkOnly)throw Error('Lane benchmark scope differs from the retained plan');
    let slugs=selected.slugs,bootstrap;
    if(benchmarkOnly){
      bootstrap=await bootstrapDealerPackCiLane({root,plan,lane});
      save(path.join(root,'runtime/dealer-pack-fast/lane-'+lane+'/bootstrap-report.json'),bootstrap);
      slugs=bootstrap.slugs;
    }
    const report=slugs.length?await buildFastDealerBatch({root,slugs,out:path.join(root,'runtime/dealer-pack-fast/lane-'+lane),
      nodePaths:json(path.join(root,'runtime/dealer-pack-node-paths.json')),familyConcurrency:1,benchmarkOnly,
      batch:process.env.PACK_BATCH||undefined,verify:verifyDealerPack,toolPackage:root+'/runtime/dealer-pack-tools/package.json'}):{status:'partial-failure',results:[]};
    if(report.status!=='passed'||bootstrap?.rejected?.length)process.exitCode=1;
    return {status:report.status,results:report.results?.map(row=>({slug:row.slug,status:row.status,milliseconds:row.milliseconds,reason:row.reason}))};
  }
  throw Error('Use plan, record-node or lane');
}

if(isEntrypoint(import.meta.url))runDealerPackCi(process.argv[2]).then(value=>{if(value)console.log(JSON.stringify(value,null,2));}).catch(error=>{console.error(error.stack);process.exitCode=1;});
