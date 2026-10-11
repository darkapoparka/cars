/** Read-only transport of an already sealed GitHub artifact ZIP. Never extract or rebuild it. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {ROOT,git,inside} from './lib/workflow.mjs';
import {parseCatalogJson} from './lib/native-localization.mjs';

export const REQUEST_PATH='docs/releases/cloudflare-existing25-20261011/artifact-transport-request.json';
export const WORKFLOW_PATH='.github/workflows/fleet-artifact-transport.yml';
export const MAX_BYTES=2*1024**3,MAX_CHUNKS=10,MAX_CHUNK_BYTES=200*1024**2;
export const ORIGINAL_SOURCE=Object.freeze({"repository":"darkapoparka/cars","workflowPath":".github/workflows/existing-fleet-cloudflare.yml","runId":38169149692,"runAttempt":1,"headSha":"b6eb5f8e209f83d273101a3e26d8d4a8659026de","event":"push","ref":"refs/heads/main"});
export const ORIGINAL_ARTIFACT=Object.freeze({"id":11713191454,"name":"existing-cf-single-worker-priselci-38169149692-1","sizeInBytes":605660944,"sha256":"77473494d463084fefbf8b98f2178139eb429162d29b1f2f696f7b9119b0dfb8"});
const hash=b=>createHash('sha256').update(b).digest('hex');
const requireValue=(ok,message)=>{if(!ok)throw Error('Artifact transport: '+message);};
const exactKeys=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join('\0')===[...keys].sort().join('\0');
const same=(value,expected)=>exactKeys(value,Object.keys(expected))&&Object.entries(expected).every(([k,v])=>value[k]===v);
const sha=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const positive=v=>Number.isSafeInteger(v)&&v>0;
const dated=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(v)&&Number.isFinite(Date.parse(v));

export function parseTransportRequest(bytes){
 requireValue(Buffer.isBuffer(bytes)&&bytes.length>0&&bytes.length<=16384,'request must be bounded UTF-8 JSON');
 let request;try{request=parseCatalogJson(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw Error('Artifact transport: invalid request JSON (including duplicate keys)');}
 return validateTransportRequest(request);
}
export function validateTransportRequest(request){
 requireValue(exactKeys(request,['schemaVersion','kind','reviewed','reviewedAt','source','artifact','chunkSizeBytes']),'exact request keys required');
 requireValue(request.schemaVersion===1&&request.kind==='cars-fleet-artifact-transport-request'&&request.reviewed===true&&dated(request.reviewedAt),'dated reviewed transport request required');
 requireValue(same(request.source,ORIGINAL_SOURCE),'only the original successful main push source is allowed');
 requireValue(same(request.artifact,ORIGINAL_ARTIFACT),'only the exact original sealed singleton ZIP is allowed');
 requireValue(request.artifact.sizeInBytes<=MAX_BYTES&&positive(request.chunkSizeBytes)&&request.chunkSizeBytes<=MAX_CHUNK_BYTES&&Math.ceil(request.artifact.sizeInBytes/request.chunkSizeBytes)<=MAX_CHUNKS,'bounded ZIP/chunk count and <=200 MiB chunk bytes required');
 return request;
}
export function assertTransportContext(env,{platform=process.platform,nodeVersion=process.versions.node}={}){
 requireValue(platform==='linux'&&nodeVersion==='26.10.0','pinned Linux Node 26.10.0 required');
 requireValue(env.GITHUB_REPOSITORY===ORIGINAL_SOURCE.repository&&env.GITHUB_EVENT_NAME==='push'&&env.GITHUB_REF==='refs/heads/main'&&/^[a-f0-9]{40}$/.test(env.GITHUB_SHA??''),'canonical main push context required');
 requireValue(env.GITHUB_WORKFLOW_REF===ORIGINAL_SOURCE.repository+'/'+WORKFLOW_PATH+'@refs/heads/main'&&/^\d+$/.test(env.GITHUB_RUN_ID??'')&&Number(env.GITHUB_RUN_ID)>0&&/^\d+$/.test(env.GITHUB_RUN_ATTEMPT??'')&&Number(env.GITHUB_RUN_ATTEMPT)>0,'exact maintained transport workflow context required');
 requireValue(typeof env.GITHUB_TOKEN==='string'&&env.GITHUB_TOKEN.length>0,'ephemeral GitHub read token required');
 requireValue(!Object.keys(env).some(k=>/^(CLOUDFLARE_|CF_API_|VERCEL_)/.test(k)&&env[k]),'provider credentials forbidden');
 return {runId:Number(env.GITHUB_RUN_ID),runAttempt:Number(env.GITHUB_RUN_ATTEMPT),headSha:env.GITHUB_SHA,workflowPath:WORKFLOW_PATH};
}
export function validateOriginalMetadata(request,run,artifacts){
 validateTransportRequest(request);
 const s=request.source,a=request.artifact;
 requireValue(run&&run.id===s.runId&&run.run_attempt===s.runAttempt&&run.status==='completed'&&run.conclusion==='success'&&run.event===s.event&&run.head_branch==='main'&&run.head_sha===s.headSha&&run.path===s.workflowPath&&run.repository?.full_name===s.repository&&run.head_repository?.full_name===s.repository,'original run must still be the exact successful main push and workflow');
 requireValue(artifacts&&Number.isSafeInteger(artifacts.total_count)&&artifacts.total_count>0&&artifacts.total_count<=100&&Array.isArray(artifacts.artifacts)&&artifacts.artifacts.length===artifacts.total_count,'complete bounded artifact metadata required');
 const matching=artifacts.artifacts.filter(x=>x.id===a.id);requireValue(matching.length===1,'original artifact membership required');
 const row=matching[0];
 requireValue(row.name===a.name&&row.size_in_bytes===a.sizeInBytes&&row.digest==='sha256:'+a.sha256&&row.expired===false&&row.workflow_run?.id===s.runId&&row.workflow_run?.head_sha===s.headSha&&row.workflow_run?.head_branch==='main','original artifact ID/name/digest/bytes/source identity differs or expired');
 return {source:{...s,status:run.status,conclusion:run.conclusion,workflowId:run.workflow_id,runNumber:run.run_number,createdAt:run.created_at,updatedAt:run.updated_at},artifact:{...a,digest:row.digest,createdAt:row.created_at,expiresAt:row.expires_at}};
}
export function validateDownloadLocation(value){
 let url;try{url=new URL(value);}catch{throw Error('Artifact transport: invalid GitHub artifact redirect');}
 requireValue(url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&!url.hash&&(/^[a-z0-9-]+\.blob\.core\.windows\.net$/.test(url.hostname)||/^[a-z0-9-]+\.actions\.githubusercontent\.com$/.test(url.hostname)),'GitHub artifact redirect must use approved HTTPS artifact storage');
 return url;
}
async function apiJson(fetchImpl,url,token){
 let response;try{response=await fetchImpl(url,{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},redirect:'error',signal:AbortSignal.timeout(60000)});}catch{throw Error('Artifact transport: GitHub metadata request failed');}
 requireValue(response.status===200,'GitHub metadata request was refused');
 const declared=response.headers.get('content-length');requireValue(declared===null||Number(declared)<=1024*1024,'metadata response exceeds limit');
 let bytes;try{const reader=response.body.getReader(),parts=[];let count=0;for(;;){const {done,value}=await reader.read();if(done)break;count+=value.byteLength;if(count>1024*1024){await reader.cancel();throw Error();}parts.push(Buffer.from(value));}bytes=Buffer.concat(parts);}catch{throw Error('Artifact transport: bounded metadata response failed');}
 try{return parseCatalogJson(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw Error('Artifact transport: metadata JSON invalid');}
}
export async function originalZipStream(fetchImpl,request,token){
 const api='https://api.github.com/repos/'+ORIGINAL_SOURCE.repository+'/actions/artifacts/'+request.artifact.id+'/zip';
 let redirect;try{redirect=await fetchImpl(api,{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},redirect:'manual',signal:AbortSignal.timeout(60000)});}catch{throw Error('Artifact transport: original ZIP redirect request failed');}
 requireValue(redirect.status===302,'original ZIP requires the GitHub artifact redirect');
 const location=validateDownloadLocation(redirect.headers.get('location'));
 let zip;try{zip=await fetchImpl(location.href,{headers:{Accept:'application/zip','Accept-Encoding':'identity'},redirect:'error',signal:AbortSignal.timeout(15*60000)});}catch{throw Error('Artifact transport: original ZIP storage download failed');}
 requireValue(zip.status===200&&zip.body,'original ZIP storage download was refused');
 const encoded=zip.headers.get('content-encoding');requireValue(!encoded||encoded==='identity','raw ZIP content encoding required');
 const length=zip.headers.get('content-length');requireValue(length!==null&&/^\d+$/.test(length)&&Number(length)===request.artifact.sizeInBytes,'raw original ZIP content length differs');
 return zip.body;
}
function createOutputDirectory(directory){
 requireValue(path.isAbsolute(directory),'absolute output directory required');
 const parent=fs.realpathSync(path.dirname(directory));requireValue(parent===path.resolve(path.dirname(directory)),'output parent must be physical');
 fs.mkdirSync(directory);requireValue(fs.lstatSync(directory).isDirectory()&&!fs.lstatSync(directory).isSymbolicLink(),'physical fresh output required');
 fs.mkdirSync(path.join(directory,'chunks'));return directory;
}
/** Split a raw byte stream; caller has already validated immutable metadata. Small sizes are useful in tests. */
export async function splitOriginalZip(stream,{sizeInBytes,sha256,chunkSizeBytes,artifactNamePrefix},directory){
 requireValue(positive(sizeInBytes)&&sizeInBytes<=MAX_BYTES&&sha(sha256)&&positive(chunkSizeBytes)&&chunkSizeBytes<=MAX_CHUNK_BYTES&&Math.ceil(sizeInBytes/chunkSizeBytes)<=MAX_CHUNKS,'invalid split bounds');
 requireValue(typeof artifactNamePrefix==='string'&&/^[a-z0-9-]{1,160}$/.test(artifactNamePrefix),'bounded transport artifact name required');
 createOutputDirectory(directory);
 const reader=stream.getReader(),zipHash=createHash('sha256'),chunks=[];let bytes=0,fd=null,chunkHash,chunkBytes=0,offset=0,index=0;
 const start=()=>{index++;requireValue(index<=MAX_CHUNKS,'too many chunks');const file='part-'+String(index).padStart(3,'0')+'.bin';fd=fs.openSync(path.join(directory,'chunks',file),'wx');chunkHash=createHash('sha256');chunkBytes=0;return file;};
 let file;
 const finish=()=>{fs.closeSync(fd);fd=null;chunks.push({index,file:'chunks/'+file,offset,sizeInBytes:chunkBytes,sha256:chunkHash.digest('hex'),artifactName:artifactNamePrefix+'-part-'+String(index).padStart(3,'0')});offset+=chunkBytes;};
 try{
  for(;;){const {done,value}=await reader.read();if(done)break;requireValue(value instanceof Uint8Array,'raw ZIP bytes required');const buffer=Buffer.from(value.buffer,value.byteOffset,value.byteLength);requireValue(bytes+buffer.length<=sizeInBytes,'original ZIP exceeds sealed size');zipHash.update(buffer);bytes+=buffer.length;
   for(let at=0;at<buffer.length;){if(fd===null)file=start();const count=Math.min(buffer.length-at,chunkSizeBytes-chunkBytes),part=buffer.subarray(at,at+count);let written=0;while(written<count){const n=fs.writeSync(fd,part,written,count-written);requireValue(n>0,'chunk write stopped');written+=n;}chunkHash.update(part);chunkBytes+=count;at+=count;if(chunkBytes===chunkSizeBytes)finish();}
  }
  if(fd!==null)finish();requireValue(bytes===sizeInBytes,'original ZIP is truncated');const actual=zipHash.digest('hex');requireValue(actual===sha256,'original ZIP SHA-256 differs');
  requireValue(chunks.length===Math.ceil(sizeInBytes/chunkSizeBytes)&&offset===bytes,'chunk coverage differs');return {sizeInBytes:bytes,sha256:actual,chunkSizeBytes,chunks};
 }catch(error){if(fd!==null)fs.closeSync(fd);try{await reader.cancel();}catch{}throw error?.message?.startsWith('Artifact transport: ')?error:Error('Artifact transport: raw ZIP stream or chunk write failed');}finally{reader.releaseLock();}
}
export async function transportFleetArtifact({root=ROOT,env=process.env,fetchImpl=fetch}={}){
 const context=assertTransportContext(env),requestFile=inside(root,REQUEST_PATH,{mustExist:true});
 for(let relative=REQUEST_PATH;relative&&relative!=='.';relative=path.posix.dirname(relative)){requireValue(!fs.lstatSync(path.join(root,relative)).isSymbolicLink(),'request path must not contain links');}
 requireValue(fs.lstatSync(requestFile).isFile()&&fs.statSync(requestFile).size<=16384,'regular bounded request required');
 const bytes=fs.readFileSync(requestFile),request=parseTransportRequest(bytes);
 requireValue(git(root,['rev-parse','HEAD'])===context.headSha&&git(root,['show','HEAD:'+REQUEST_PATH],{encoding:null}).equals(bytes),'request and tools must come from exact push checkout');
 const api='https://api.github.com/repos/'+ORIGINAL_SOURCE.repository;
 const run=await apiJson(fetchImpl,api+'/actions/runs/'+request.source.runId,env.GITHUB_TOKEN);
 const artifacts=await apiJson(fetchImpl,api+'/actions/runs/'+request.source.runId+'/artifacts?per_page=100',env.GITHUB_TOKEN);
 const original=validateOriginalMetadata(request,run,artifacts),stream=await originalZipStream(fetchImpl,request,env.GITHUB_TOKEN);
 const runnerTemp=fs.realpathSync(env.RUNNER_TEMP),parent=path.join(runnerTemp,'cars-fleet-artifact-transport');
 if(!fs.existsSync(parent))fs.mkdirSync(parent);requireValue(fs.lstatSync(parent).isDirectory()&&!fs.lstatSync(parent).isSymbolicLink(),'physical runner transport directory required');
 const output=path.join(parent,context.runId+'-'+context.runAttempt),prefix='fleet-artifact-transport-'+context.runId+'-'+context.runAttempt;
 const split=await splitOriginalZip(stream,{...request.artifact,chunkSizeBytes:request.chunkSizeBytes,artifactNamePrefix:prefix},output);
 const manifest={schemaVersion:1,kind:'cars-fleet-artifact-transport-manifest',original,transport:{repository:ORIGINAL_SOURCE.repository,...context,requestPath:REQUEST_PATH,requestSha256:hash(bytes),reviewedAt:request.reviewedAt},zip:{sizeInBytes:split.sizeInBytes,sha256:split.sha256,chunkSizeBytes:split.chunkSizeBytes,chunkCount:split.chunks.length},chunks:split.chunks,reassembly:{format:'concatenate-raw-chunk-files-in-index-order',extractOriginalOnlyAfterSizeAndSha256Verification:true},dataTransportOnly:true,rebuild:false,providerWrite:false};
 fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
 requireValue(typeof env.GITHUB_OUTPUT==='string'&&env.GITHUB_OUTPUT.length>0,'GitHub output channel required');
 fs.appendFileSync(env.GITHUB_OUTPUT,'chunk_count='+split.chunks.length+'\noutput_dir='+output+'\nartifact_prefix='+prefix+'\n');
 return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.length!==2){console.error('Artifact transport: no arguments accepted');process.exitCode=1;}
 else transportFleetArtifact().then(m=>console.log(JSON.stringify({originalArtifactId:m.original.artifact.id,bytes:m.zip.sizeInBytes,sha256:m.zip.sha256,chunks:m.zip.chunkCount}))).catch(error=>{console.error(error.message);process.exitCode=1;});
}
