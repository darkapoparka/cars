/** Cloudflare API adapter for the guarded pack executor.
 * Endpoint shapes were read from the Cloudflare OpenAPI on2026-10-19.
 * New Workers use POST /workers/workers (409 on conflict), never an upsert.
 * Modules upload to the returned immutable Worker ID. No DNS, billing, KV,
 * service bindings, existing-fleet deployment, or delete endpoint is exposed.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,queueDigest} from './dealer-pack-queue.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
const account='/accounts/'+PACK_DEPLOY_ACCOUNT;
const zone='/zones/'+PACK_DEPLOY_ZONE;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const exactRequest=request=>assert(request?.workerName==='cars-'+request.slug&&request.publicOrigin==='https://'+request.slug+'.webpreviews.site'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(request.slug)&&request.slug.length<=43,'Unsafe pack provider identity');
const successful=(response,label)=>{assert(response?.success===true&&response.status>=200&&response.status<300,'Cloudflare '+label+' failed ('+(response?.status??'no response')+'); reconcile any unknown write outcome');return response.result;};
// Confirmed against the current Paid HTTP limits and version-upload API on
// 2026-10-19. The explicit default preserves the platform's existing budget.
export const PACK_RUNTIME_LIMITS=Object.freeze({defaultCpuMs:30000,maximumCpuMs:300000,startupMs:1000,memoryBytes:128*1024**2,
  source:'https://developers.cloudflare.com/workers/platform/limits/',verifiedAt:'2026-10-19'});
export function packRuntimeLimits(config={}) {
  const configured=config.limits;
  assert(configured===undefined||configured&&typeof configured==='object'&&!Array.isArray(configured),'Worker runtime limits must be an object');
  assert(!configured||Object.keys(configured).every(key=>['cpu_ms','subrequests'].includes(key)),'Unsupported Worker runtime limit');
  const cpuMs=configured?.cpu_ms===undefined?PACK_RUNTIME_LIMITS.defaultCpuMs:configured.cpu_ms;
  assert(Number.isSafeInteger(cpuMs)&&cpuMs>0&&cpuMs<=PACK_RUNTIME_LIMITS.maximumCpuMs,'Worker CPU limit must be an explicit positive integer within the Paid HTTP ceiling');
  const limits={cpu_ms:cpuMs};
  if(configured?.subrequests!==undefined){assert(Number.isSafeInteger(configured.subrequests)&&configured.subrequests>0&&configured.subrequests<=10000,'Worker subrequest limit exceeds the Paid HTTP ceiling');limits.subrequests=configured.subrequests;}
  return limits;
}
const mimeTypes={'.html':'text/html','.css':'text/css','.js':'application/javascript','.mjs':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.gif':'image/gif','.avif':'image/avif','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.otf':'font/otf','.mp4':'video/mp4','.webm':'video/webm','.pdf':'application/pdf','.txt':'text/plain','.xml':'application/xml','.wasm':'application/wasm','.webmanifest':'application/manifest+json'};
export const packAssetMime=name=>mimeTypes[path.extname(name).toLowerCase()]??'application/octet-stream';
let blake3;
/** Exactly Wrangler4.149.0 deploy-helpers/hash.ts: sharing its hash prevents
 * needless re-uploads when the provider can reuse an existing asset. */
export function packAssetHash(bytes,name) {
  assert(Buffer.isBuffer(bytes)&&typeof name==='string','Asset bytes and exact original extension required');
  if(!blake3){
    const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
    const require=createRequire(path.resolve(process.env.CARS_DEALER_PACK_TOOL_PACKAGE??process.env.CARS_QA_RESOLVE_FROM??path.join(root,'runtime/dealer-pack-preview-tools/package.json')));
    assert(require('blake3-wasm/package.json').version==='2.1.5','Use the maintained blake3-wasm2.1.5 asset hasher');blake3=require('blake3-wasm').hash;
  }
  return blake3(bytes.toString('base64')+path.extname(name).substring(1)).toString('hex').slice(0,32);
}

/** Physical reads rehash every member at use time, after inspection. */
export function readPackUploadFile(candidate,row) {
  assert(typeof candidate.directory==='string'&&path.isAbsolute(candidate.directory)&&row&&/^(?:server|public)\/[A-Za-z0-9._@/()[\]$,+ -]+$/.test(row.path)&&!row.path.split('/').some(part=>part==='.'||part==='..'),'Unsafe upload member');
  const file=path.resolve(candidate.directory,row.path),relative=path.relative(candidate.directory,file);assert(relative&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative)&&fs.lstatSync(file).isFile()&&!fs.lstatSync(file).isSymbolicLink(),'Upload member escaped its sealed bundle');
  const realRelative=path.relative(fs.realpathSync(candidate.directory),fs.realpathSync(file));assert(realRelative&&!realRelative.startsWith('..'+path.sep)&&!path.isAbsolute(realRelative),'Upload member escaped through a symlinked ancestor');
  const bytes=fs.readFileSync(file);assert(bytes.length===row.bytes&&hash(bytes)===row.sha256,'Upload file differs from its sealed inventory: '+row.path);return bytes;
}

export function packAssetManifest(candidate) {
  const manifest={},byHash=new Map();
  for(const row of candidate.files.filter(row=>row.path.startsWith('public/'))){
    const name='/'+row.path.slice(7);if(name==='/_headers'||name==='/_redirects')continue;
    const bytes=readPackUploadFile(candidate,row),mime=packAssetMime(name);
    const key=packAssetHash(bytes,name);
    manifest[name]={hash:key,size:bytes.length};if(!byHash.has(key))byHash.set(key,{row,mime});
  }
  assert(Object.keys(manifest).length>0&&Object.keys(manifest).length<=100000,'Invalid static asset count');
  return {manifest,byHash,manifestDigest:queueDigest(manifest)};
}

/** Small deterministic upload plan shared with the connector adapter. The
 * remote transport adds only bytes authenticated by these exact descriptors. */
export function packModuleUploadPlan(candidate,{request,assets}) {
  exactRequest(request);const config=candidate.config;
  assert(config?.name===request.workerName&&config.main==='server/worker.mjs'&&config.assets?.binding==='ASSETS'&&config.assets.run_worker_first===false&&config.compatibility_flags?.includes('nodejs_compat'),'Candidate is not the maintained ASSETS-only native Worker');
  const modules=candidate.files.filter(row=>row.path.startsWith('server/')&&/\.(?:m?js|wasm)$/.test(row.path)).map(row=>({name:row.path,content_type:row.path.endsWith('.wasm')?'application/wasm':'application/javascript+module',file:{path:row.path,bytes:row.bytes,sha256:row.sha256}}));
  for(const name of ['_headers','_redirects']){const row=candidate.files.find(row=>row.path==='public/'+name);if(row)modules.push({name,content_type:'text/plain',file:{path:row.path,bytes:row.bytes,sha256:row.sha256}});}
  assert(modules.some(row=>row.name===config.main)&&typeof assets.completionToken==='string'&&assets.completionToken.length>20,'Module entry and completed asset session required');
  const assetConfig={run_worker_first:false};for(const key of ['html_handling','not_found_handling','base_path'])if(config.assets[key]!==undefined)assetConfig[key]=config.assets[key];
  return {main_module:config.main,modules,compatibility_date:config.compatibility_date,compatibility_flags:config.compatibility_flags,
    limits:packRuntimeLimits(config),
    bindings:[{type:'assets',name:'ASSETS'}],assets:{jwt:assets.completionToken,config:assetConfig},
    annotations:{'workers/tag':'cars-pack-'+request.id.slice(0,64),'workers/message':'Cars preview '+request.slug+'; output '+request.outputDigest}};
}

export function packModuleUpload(candidate,options) {
  const plan=packModuleUploadPlan(candidate,options);
  return {...plan,modules:plan.modules.map(({file,...module})=>({...module,content_base64:readPackUploadFile(candidate,file).toString('base64')}))};
}

async function fullWorkerInventory(api) {
  const rows=[];let expected=null;
  for(let page=1;page<=100;page++){
    const response=await api({method:'GET',path:account+'/workers/workers',query:{page,per_page:100,order_by:'name',order:'asc'}});
    const result=successful(response,'Worker inventory');assert(Array.isArray(result),'Worker inventory is not a list');rows.push(...result);
    const info=response.result_info;if(info?.total_count!=null){assert(Number.isSafeInteger(info.total_count)&&info.total_count>=0,'Invalid provider total count');expected??=info.total_count;assert(expected===info.total_count,'Worker inventory changed while paginating');}
    if(info?.total_pages!=null&&page>=info.total_pages||result.length<100){if(expected!==null)assert(rows.length===expected,'Incomplete account inventory');return rows;}
  }
  throw Error('Worker inventory exceeded bounded pagination');
}

async function activeVersion(api,workerName,worker) {
  if(worker.deployed_on===null)return {versionId:null,versionTraffic:[],bindings:[],limits:null,undeployed:true};
  const result=successful(await api({method:'GET',path:account+'/workers/scripts/'+workerName+'/deployments'}),'deployment read');
  const values=Array.isArray(result)?result:result?.deployments;
  assert(Array.isArray(values)&&values.length>0,'No active deployment evidence');const current=[...values].sort((a,b)=>Date.parse(b.created_on)-Date.parse(a.created_on))[0];
  assert(current.versions?.length===1&&current.versions[0].percentage===100,'Exactly one active Worker version required');
  const versionId=current.versions[0].version_id;
  const version=successful(await api({method:'GET',path:account+'/workers/workers/'+worker.id+'/versions/'+versionId}),'version read');
  assert(version.id===versionId&&Array.isArray(version.bindings),'Active version binding evidence missing');
  return {versionId,versionTraffic:current.versions,bindings:version.bindings,limits:version.limits??null,undeployed:false,deploymentId:current.id,startupTimeMs:version.startup_time_ms??null,annotations:version.annotations??{}};
}

export function cloudflarePackProvider({api,assetFetch=fetch,uploadAssets,uploadModules,now=()=>new Date().toISOString()}={}) {
  assert(typeof api==='function','Authenticated Cloudflare API callback required');
  return {
    async snapshot({request,challenge}){
      exactRequest(request);const startedAt=now();
      const [workers,routesReply,domainsReply]=await Promise.all([fullWorkerInventory(api),api({method:'GET',path:zone+'/workers/routes'}),api({method:'GET',path:account+'/workers/domains'})]);
      const routes=successful(routesReply,'routes inventory'),domains=successful(domainsReply,'domains inventory');assert(Array.isArray(routes)&&Array.isArray(domains),'Complete route/domain arrays required');
      if(domainsReply.result_info?.total_count!=null)assert(domainsReply.result_info.total_count===domains.length,'Domain inventory was truncated');
      const own=workers.find(row=>row.name===request.workerName);let target={exists:false};
      if(own){const worker=successful(await api({method:'GET',path:account+'/workers/workers/'+own.id}),'exact Worker read');assert(worker.id===own.id&&worker.name===request.workerName,'Immutable Worker ID/name changed');target={exists:true,workerId:worker.id,workerName:worker.name,tags:worker.tags,subdomain:worker.subdomain,...await activeVersion(api,request.workerName,worker)};}
      return {kind:'cars-live-pack-provider-snapshot',evidence:'authenticated-cloudflare-api',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,requestId:challenge.requestId,stage:challenge.stage,startedAt,observedAt:now(),complete:true,
        scripts:workers.map(row=>({id:row.id,name:row.name,tags:row.tags??[],createdOn:row.created_on??null})),scriptCount:workers.length,routes:routes.map(row=>({id:row.id,pattern:row.pattern,script:row.script??null})),domains:domains.map(row=>({id:row.id,hostname:row.hostname,service:row.service,zone_id:row.zone_id})),target};
    },
    async createWorker({request,ownershipTags}){
      exactRequest(request);const response=await api({method:'POST',path:account+'/workers/workers',body:{name:request.workerName,tags:ownershipTags,subdomain:{enabled:false,previews_enabled:false},observability:{enabled:true,head_sampling_rate:1},logpush:false,tail_consumers:[]}});
      if(response.status===409){const error=Error('Create-only Worker name conflict: no existing Worker was updated');error.providerOutcomeKnown=true;throw error;}
      return successful(response,'create-only Worker');
    },
    async prepareAssets({candidate,request,beforeWrite}){
      exactRequest(request);const {manifest,byHash,manifestDigest}=packAssetManifest(candidate);
      await beforeWrite();const session=successful(await api({method:'POST',path:account+'/workers/scripts/'+request.workerName+'/assets-upload-session',body:{manifest}}),'asset upload session');
      assert(typeof session.jwt==='string'&&Array.isArray(session.buckets),'Invalid asset upload session');
      const seen=new Set();for(const bucket of session.buckets){assert(Array.isArray(bucket)&&bucket.every(key=>byHash.has(key)&&!seen.has(key)),'Provider requested an unknown or duplicate asset hash');bucket.forEach(key=>seen.add(key));}
      if(uploadAssets)return {...await uploadAssets({candidate,request,session,manifest,byHash,beforeWrite}),manifestDigest,assetFiles:Object.keys(manifest).length,uploadedFiles:seen.size};
      let completionToken=session.buckets.length===0?session.jwt:null;
      for(const bucket of session.buckets){
        const form=new FormData();for(const key of bucket){const asset=byHash.get(key),content=readPackUploadFile(candidate,asset.row).toString('base64');form.append(key,new Blob([content],{type:asset.mime}),key);}
        await beforeWrite();
        const response=await assetFetch('https://api.cloudflare.com/client/v4'+account+'/workers/assets/upload?base64=true',{method:'POST',headers:{Authorization:'Bearer '+session.jwt},body:form,signal:AbortSignal.timeout(120000)});
        const body=await response.json();assert([201,202].includes(response.status)&&body.success===true,'Static asset upload failed; the session token was not persisted');if(body.result?.jwt)completionToken=body.result.jwt;
      }
      assert(typeof completionToken==='string','Provider did not return an asset completion token');return {completionToken,manifestDigest,assetFiles:Object.keys(manifest).length,uploadedFiles:seen.size};
    },
    async upload({candidate,request,workerId,assets,ownershipTags}){
      exactRequest(request);assert(/^[a-f0-9]{32}$/.test(workerId),'Exact immutable Worker ID required');
      const requestedCpuLimitMs=packRuntimeLimits(candidate.config).cpu_ms;
      const endpoint=account+'/workers/workers/'+workerId+'/versions';
      const query={deploy:false};
      const response=uploadModules?await uploadModules({candidate,request,workerId,assets,ownershipTags,endpoint,query}):await api({method:'POST',path:endpoint,query,body:packModuleUpload(candidate,{request,assets})});
      const value=successful(response,'immutable Worker version upload'),returnedCpuLimitMs=value.limits?.cpu_ms;
      assert(returnedCpuLimitMs===undefined||Number.isSafeInteger(returnedCpuLimitMs)&&returnedCpuLimitMs>0,'Provider returned an invalid Worker CPU limit');
      return {workerId,workerName:request.workerName,versionId:value.id,startupTimeMs:value.startup_time_ms??null,requestedCpuLimitMs,
        cpuLimitMs:returnedCpuLimitMs??requestedCpuLimitMs,cpuLimitSource:returnedCpuLimitMs===undefined?'successful-explicit-upload-request':'provider-version-response'};
    },
    async activateVersion({request,workerId,versionId}){
      exactRequest(request);const worker=successful(await api({method:'GET',path:account+'/workers/workers/'+workerId}),'activation identity read');assert(worker.name===request.workerName&&worker.id===workerId,'Worker name changed before version activation');
      const result=successful(await api({method:'POST',path:account+'/workers/scripts/'+request.workerName+'/deployments',body:{strategy:'percentage',versions:[{version_id:versionId,percentage:100}],annotations:{'workers/message':'Guarded Cars pack deployment '+request.id}}}),'version activation');return result;
    },
    async disableSubdomain({request}){exactRequest(request);return successful(await api({method:'POST',path:account+'/workers/scripts/'+request.workerName+'/subdomain',body:{enabled:false,previews_enabled:false}}),'disable secondary exposure');},
    async createRoute({request}){exactRequest(request);return successful(await api({method:'POST',path:zone+'/workers/routes',body:{pattern:new URL(request.publicOrigin).hostname+'/*',script:request.workerName}}),'canonical route create');},
    async rollbackVersion({request,workerId,versionId}){exactRequest(request);assert(/^[a-f0-9]{32}$/.test(workerId),'Exact rollback Worker ID required');const worker=successful(await api({method:'GET',path:account+'/workers/workers/'+workerId}),'rollback identity read');assert(worker.name===request.workerName&&worker.id===workerId,'Worker name changed before rollback');return successful(await api({method:'POST',path:account+'/workers/scripts/'+request.workerName+'/deployments',body:{strategy:'percentage',versions:[{version_id:versionId,percentage:100}],annotations:{'workers/message':'Guarded own-pack rollback '+request.id}}}),'owned version rollback');},
  };
}

/** Tokens stay in this closure. Errors/logs never interpolate headers or bodies. */
export function tokenCloudflareTransport({token=process.env.CLOUDFLARE_API_TOKEN,fetchImpl=fetch}={}) {
  assert(typeof token==='string'&&token.length>10,'CLOUDFLARE_API_TOKEN is required for CI; the connector adapter uses the same guarded core without exporting its token');
  return async({method,path:requestPath,query,body})=>{
    assert(requestPath.startsWith(account+'/workers/')||requestPath.startsWith(zone+'/workers/'),'Provider path exceeds authorized Workers and route scope');
    const url=new URL('https://api.cloudflare.com/client/v4'+requestPath);for(const [key,value] of Object.entries(query??{}))url.searchParams.set(key,String(value));
    const response=await fetchImpl(url,{method,headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(method==='GET'?30000:180000)});
    const result=await response.json();return {...result,status:response.status};
  };
}
