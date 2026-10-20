/** File RPC adapter for the same guarded executor when credentials remain in
 * the connected GitHub/Cloudflare applications. The coordinator executes each
 * request through those connectors and writes its normalized response.
 * Ephemeral asset JWTs are mode0600 RPC data, never stdout, queue or receipts.
 */
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {ROOT,json} from './lib/workflow.mjs';
import {githubPackQueueStore,enqueuePackDeployments,packDeploymentRequest} from './lib/dealer-pack-queue.mjs';
import {cloudflarePackProvider,packModuleUploadPlan} from './lib/dealer-pack-cloudflare.mjs';
import {inspectPackDeploymentBatch,drainPackDeployments} from './deploy-dealer-packs.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const redact=message=>String(message).replace(/[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}/g,'[redacted ephemeral token]');

export function createPackConnectorRpc({directory,timeoutMs=30*60*1000,pollMs=200,notify=()=>{}}={}) {
  assert(typeof directory==='string'&&path.isAbsolute(directory)&&Number.isSafeInteger(timeoutMs)&&timeoutMs>0,'Absolute temporary RPC directory required');
  const requests=path.join(directory,'requests'),responses=path.join(directory,'responses');fs.mkdirSync(requests,{recursive:true,mode:0o700});fs.mkdirSync(responses,{recursive:true,mode:0o700});
  return async(channel,operation)=>{
    assert(['github','cloudflare','cloudflare-assets','cloudflare-modules'].includes(channel),'Unknown connector RPC channel');
    const id=randomUUID(),requestFile=path.join(requests,id+'.json'),responseFile=path.join(responses,id+'.json'),started=Date.now();
    fs.writeFileSync(requestFile,JSON.stringify({schemaVersion:1,kind:'cars-pack-connector-rpc',id,channel,operation,createdAt:new Date().toISOString()}),{flag:'wx',mode:0o600});
    notify({id,channel,method:operation.method??null,path:operation.path??operation.endpoint??null,slug:operation.request?.slug??null});
    try{
      while(!fs.existsSync(responseFile)){assert(Date.now()-started<timeoutMs,'Connector RPC timed out; any unacknowledged write retains its durable claim');await delay(pollMs);}
      const response=JSON.parse(fs.readFileSync(responseFile,'utf8'));assert(response.id===id&&response.channel===channel,'Connector RPC response identity differs');
      if(response.error)throw Error(redact(response.error));return response.result;
    }finally{for(const file of [requestFile,responseFile])try{fs.unlinkSync(file);}catch(error){if(error.code!=='ENOENT')throw error;}}
  };
}

export function listPackConnectorRequests(directory) {
  const requests=path.join(directory,'requests');if(!fs.existsSync(requests))return [];
  return fs.readdirSync(requests).filter(name=>/^[a-f0-9-]+\.json$/.test(name)).map(name=>{
    const file=path.join(requests,name),value=json(file),op=value.operation;
    return {id:value.id,channel:value.channel,file,method:op.method??null,path:op.path??op.endpoint??null,slug:op.request?.slug??null,bytes:fs.statSync(file).size,createdAt:value.createdAt};
  });
}

export function connectorPackAdapters({directory,transportArtifact,notify}={}) {
  const exchange=createPackConnectorRpc({directory,notify});
  const readGithub=operation=>exchange('github',operation),api=operation=>exchange('cloudflare',operation);
  const provider=cloudflarePackProvider({api,
    uploadAssets:async({candidate,request,session,manifest,byHash,beforeWrite})=>{
      await beforeWrite();
      return exchange('cloudflare-assets',{request,session,manifest,candidate:{directory:candidate.directory,outputDigest:candidate.outputDigest,files:candidate.files},transportArtifact:transportArtifact??null,
        uploadFiles:[...new Set(session.buckets.flat())].map(key=>({hash:key,mime:byHash.get(key).mime,file:byHash.get(key).row})),
        endpoint:'/accounts/cb0007f242077bd759331f096eb75531/workers/assets/upload',authentication:'use-only-the-ephemeral-session-jwt-in-this-request',requiredChecks:'Verify artifact and each requested asset against the sealed files inventory before upload. Return only completionToken; never log tokens.'});
    },
    uploadModules:async({candidate,request,workerId,assets,endpoint,query})=>exchange('cloudflare-modules',{request,workerId,assets:{completionToken:assets.completionToken},endpoint,query,
      candidate:{directory:candidate.directory,outputDigest:candidate.outputDigest,files:candidate.files,config:candidate.config},transportArtifact:transportArtifact??null,
      uploadPlan:packModuleUploadPlan(candidate,{request,assets}),
      requiredChecks:'Use the exact packModuleUpload metadata and sealed server JS/MJS/WASM bytes. Hash-check every module. POST to the immutable Worker-ID endpoint; never PUT an arbitrary Worker name. Return the normalized Cloudflare response.'}),
  });
  return {store:githubPackQueueStore({request:readGithub}),provider,readGithub};
}

export async function runPackConnectorPilot({root=ROOT,directory,slugs,bundleRoot,owner='connector:m2-pilot',write=false,transportArtifact,reportFile,notify}={}) {
  const adapters=connectorPackAdapters({directory,transportArtifact,notify}),queue=(await adapters.store.read()).state;
  const inspection=await inspectPackDeploymentBatch({root,slugs,bundleRoot,queue,provider:adapters.provider,readGithub:adapters.readGithub});
  const report={schemaVersion:1,type:'cars-pack-connector-pilot',inspection,writeRequested:write,results:[]};
  if(write&&inspection.requests.length){await enqueuePackDeployments(adapters.store,inspection.requests);const drain=await drainPackDeployments({...adapters,root,bundleRoot,owner,requestIds:inspection.requests.map(row=>row.id),write:true});report.drain=drain;report.results=drain.results;}
  report.success=inspection.success&&(!write||report.results.length===inspection.requests.length&&report.results.every(row=>row.status==='deployed'));
  if(reportFile){fs.mkdirSync(path.dirname(reportFile),{recursive:true});fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');}
  return report;
}

export async function runPackConnectorRollbackDrill({root=ROOT,directory,slug,bundleRoot,owner='connector:m2-rollback-drill',transportArtifact,notify,reportFile}={}) {
  const adapters=connectorPackAdapters({directory,transportArtifact,notify}),initial=(await adapters.store.read()).state;
  const original=[...(initial.receipts[slug]??[])].reverse().find(row=>row.receipt.hostedVerified===true);assert(original,'Rollback drill requires an already hosted-qualified owned pilot');
  const previous=initial.requests[original.receipt.requestId].request;
  const replay=packDeploymentRequest({...previous,action:'redeploy-owned',rollbackTo:undefined});await enqueuePackDeployments(adapters.store,[replay]);
  const redeploy=await drainPackDeployments({...adapters,root,bundleRoot,owner,requestIds:[replay.id],write:true});
  assert(redeploy.results.length===1&&redeploy.results[0].status==='deployed','Owned rollback-drill redeployment did not complete');
  const rollback=packDeploymentRequest({...previous,action:'rollback',rollbackTo:original.sha256});await enqueuePackDeployments(adapters.store,[rollback]);
  const restored=await drainPackDeployments({...adapters,root,bundleRoot,owner,requestIds:[rollback.id],write:true});
  const report={schemaVersion:1,type:'cars-pack-live-rollback-drill',slug,originalVersionId:original.receipt.versionId,replayedVersionId:redeploy.results[0].receipt.versionId,restored,success:restored.results[0]?.status==='rolled-back'&&restored.results[0].receipt.versionId===original.receipt.versionId};
  if(reportFile){fs.mkdirSync(path.dirname(reportFile),{recursive:true});fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');}return report;
}

if(isEntrypoint(import.meta.url)){
  (async()=>{const [command,...args]=process.argv.slice(2);if(command==='--help'){console.log('Usage: dealer-pack-connector-bridge.mjs pending --rpc-dir DIR\n       dealer-pack-connector-bridge.mjs pilot --rpc-dir DIR --slugs FILE --bundle-root DIR [--write] [--report FILE] [--transport-artifact JSON]\n       dealer-pack-connector-bridge.mjs rollback-drill --rpc-dir DIR --slug SLUG --bundle-root DIR --write [--report FILE]');return;}
    const options={};for(let i=0;i<args.length;i++){if(args[i]==='--write'){options.write=true;continue;}assert(['--rpc-dir','--slugs','--slug','--bundle-root','--report','--owner','--transport-artifact'].includes(args[i])&&args[i+1]&&!options[args[i]],'Invalid connector bridge arguments');options[args[i]]=args[++i];}
    assert(options['--rpc-dir'],'Use an isolated --rpc-dir');const directory=path.resolve(options['--rpc-dir']);
    if(command==='pending'){console.log(JSON.stringify(listPackConnectorRequests(directory),null,2));return;}
    assert(['pilot','rollback-drill'].includes(command)&&options['--bundle-root'],'Use pilot or rollback-drill with the built bundle root');
    const common={directory,bundleRoot:options['--bundle-root'],owner:options['--owner'],write:options.write,transportArtifact:options['--transport-artifact']?json(options['--transport-artifact']):undefined,reportFile:options['--report']?path.resolve(options['--report']):undefined,notify:value=>console.log('PACK_RPC '+JSON.stringify(value))};
    let result;if(command==='pilot'){assert(options['--slugs'],'Pilot requires an exact slug file');result=await runPackConnectorPilot({...common,slugs:json(options['--slugs'])});}else{assert(options.write&&options['--slug'],'Rollback drill requires explicit --write and one owned slug');result=await runPackConnectorRollbackDrill({...common,slug:options['--slug']});}
    console.log(JSON.stringify({type:result.type,success:result.success,results:result.results?.map(row=>({status:row.status,slug:row.receipt?.slug??row.slug,error:row.error})),report:common.reportFile??null},null,2));if(result.success!==true)process.exitCode=1;
  })().catch(error=>{console.error(redact(error.message));process.exitCode=1;});
}
