import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const root=process.cwd(),env=process.env;
const branch='refs/heads/codex/vercel-batch-b-20261013';
const base='13152f136105e149129e81c227090955081b994d';
const release='b1f0f5609c7c249cfd0649c122849ff2cbb8dfde';
const envelopes='211353813091b80329d098a8115a271a6251a27a';
const coordinator='5a5280c2bda62708768850c50cff54ef2bfcdad5';
const prefix='docs/releases/cloudflare-existing25-20261011/vercel-existing-source/';
const owned=['al-basma-motors','al-hamoor-al-thahabi','asko-96','astracar','autolife','champion-auto-pro','eliqauto','elit-auto-import'];
const slug=env.DEALER_SLUG;
const hash=b=>createHash('sha256').update(b).digest('hex');
function git(args,{input,raw=false,local=false}={}){
 const p=spawnSync('git',args,{cwd:root,input,encoding:raw?null:'utf8',maxBuffer:64*1024**2,timeout:180000,env:{...env,GIT_TERMINAL_PROMPT:'0',...(local?{GIT_NO_LAZY_FETCH:'1'}:{})}});
 assert(!p.error,p.error?.message);assert.equal(p.status,0,'Git '+args[0]+' failed: '+String(p.stderr).slice(0,3000));
 return raw?p.stdout:p.stdout.trim();
}
function assertContext(){
 assert.equal(process.platform,'linux');assert.equal(process.version,'v26.10.0');
 assert.equal(env.GITHUB_ACTIONS,'true');assert.equal(env.GITHUB_EVENT_NAME,'push');
 assert.equal(env.GITHUB_REPOSITORY,'darkapoparka/cars');assert.equal(env.GITHUB_REF,branch);
 assert.equal(env.GITHUB_WORKFLOW,'Cars Vercel Batch B source integration');
 assert(owned.includes(slug));assert(/^[a-f0-9]{40}$/.test(env.GITHUB_SHA));
 assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID));assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT));
 assert.equal(git(['rev-parse','HEAD']),env.GITHUB_SHA);
 assert.equal(git(['remote','get-url','origin']).replace(/\.git$/,''),'https://github.com/darkapoparka/cars');
 git(['merge-base','--is-ancestor',base,env.GITHUB_SHA]);
 assert.equal(env.CARS_SOURCE_BATCH_PREFETCH,undefined,'Do not impersonate the canonical main prefetch context');
 assert(!Object.keys(env).some(k=>env[k]&&/^(?:VERCEL_TOKEN|CLOUDFLARE_API_TOKEN|CF_API_TOKEN|WRANGLER_API_TOKEN)$/.test(k)));
 return {commit:env.GITHUB_SHA,runId:env.GITHUB_RUN_ID,attempt:env.GITHUB_RUN_ATTEMPT};
}
const ci=assertContext();
const out=path.join(root,'runtime/vercel-batch-b',slug);fs.mkdirSync(out,{recursive:true});
const save=(name,value)=>fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2)+'\n');
let result;
try {
 for(const ref of [envelopes,coordinator])git(['-c','gc.auto=0','fetch','--no-tags','--filter=blob:none','origin',ref]);
 const accepted=JSON.parse(git(['show',coordinator+':docs/releases/vercel-existing-refresh/batch-a-20261013/accepted-template-release.json']));
 assert.equal(accepted.id,'cars-vercel-b1f0f560-20261013');assert.equal(accepted.sourceRevision,release);
 const originalPath=slug==='al-basma-motors'?prefix+slug+'/source-request.json':prefix+(owned.indexOf(slug)<=3?'ordinary-wave02-source-request.json':owned.indexOf(slug)<=5?'ordinary-wave03-source-request.json':'ordinary-wave04-source-request.json');
 const originRef=slug==='al-basma-motors'?base:envelopes;
 const requestBytes=git(['show',originRef+':'+originalPath],{raw:true});
 const original=JSON.parse(requestBytes.toString('utf8'));
 const request={...original,dealers:[slug],inputs:{[slug]:original.inputs[slug]}};
 assert(request.inputs[slug]);assert.equal(request.sourceRevision,release);
 assert.equal(request.approvedParentLockDigest,accepted.approvedParentLockSha256);
 assert.equal(hash(fs.readFileSync('templates.lock.json')),request.approvedParentLockDigest);
 const admitted=[];
 for(const [role,pin] of Object.entries(request.inputs[slug])){
  assert(pin.path.startsWith('docs/releases/cloudflare-existing25-20261011/'));assert(!pin.path.includes('..'));
  const target=path.join(root,pin.path);let bytes=fs.existsSync(target)?fs.readFileSync(target):null,provenance=env.GITHUB_SHA;
  if(!bytes||hash(bytes)!==pin.sha256){bytes=git(['show',originRef+':'+pin.path],{raw:true});provenance=originRef;assert.equal(hash(bytes),pin.sha256,'Reviewed '+role+' input changed');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
  assert.equal(hash(bytes),pin.sha256);admitted.push({role,...pin,provenance});
 }
 const originalClientTree=git(['rev-parse',env.GITHUB_SHA+':clients/'+slug]);
 assert.equal(originalClientTree,git(['rev-parse',base+':clients/'+slug]),'Batch source input changed from refreshed base');
 const manifest=JSON.parse(fs.readFileSync('clients/'+slug+'/dealer.json'));
 const lock=JSON.parse(fs.readFileSync(request.inputs[slug].candidateLock.path));
 const {gitFiles}=await import(pathToFileURL(path.join(root,'scripts/lib/workflow.mjs')));
 const sources=[...Object.values(manifest.templateSources??{}),...owned.slice(0,0)];
 for(const key of ['auto-best','modern','import','app','mobile','karento-best']){
  const r=lock.templates[key];assert(r);sources.push(r.source??{repository:'darkapoparka/cars',revision:r.commit,path:'templates/'+key,digest:r.digest});
 }
 const wanted=new Set();
 for(const s of sources){
  const revision=s.revision??s.commit,p=s.path??s.prefix;
  assert(/^[a-f0-9]{40}$/.test(revision));assert(/^templates\/(auto-best|modern|carwow|import|app|mobile|karento-best)$/.test(p));
  for(const row of gitFiles(root,revision,{prefix:p}))wanted.add(row.blob);
 }
 const ids=[...wanted].sort();assert(ids.length<=50000);
 const check=xs=>xs.length?git(['cat-file','--batch-check=%(objectname) %(objecttype) %(objectsize)'],{input:xs.join('\n')+'\n',local:true}).split('\n'):[];
 const inspected=check(ids);assert.equal(inspected.length,ids.length);
 const missing=ids.filter((id,i)=>inspected[i]===id+' missing');let totalBytes=0;
 for(let i=0;i<missing.length;i+=256){
  const part=missing.slice(i,i+256);
  git(['-c','gc.auto=0','-c','fetch.negotiationAlgorithm=noop','fetch','--no-tags','--no-write-fetch-head','--no-auto-maintenance','--no-recurse-submodules','--filter=blob:none','origin',...part],{local:true});
  const rows=check(part);assert.equal(rows.length,part.length);
  rows.forEach((line,j)=>{const [id,type,size]=line.split(' ');assert.equal(id,part[j]);assert.equal(type,'blob');assert(Number.isSafeInteger(Number(size))&&Number(size)>=0&&Number(size)<=150*1024**2);totalBytes+=Number(size);});
  assert(totalBytes<=8*1024**3);console.log(JSON.stringify({dealer:slug,stage:'exact-historical-source-read',fetched:Math.min(i+256,missing.length),total:missing.length}));
 }
 save('input-admission.json',{batch:'B',dealer:slug,ci,acceptedRelease:accepted.id,sourceRevision:release,coordinatorCommit:coordinator,sourceBase:base,originalClientTree,requestProvenance:{commit:originRef,path:originalPath,sha256:hash(requestBytes)},admitted,historicalBlobReads:{unique:ids.length,fetched:missing.length,bytes:totalBytes},noProviderWrites:true});
 const maintained=await import(pathToFileURL(path.join(root,'scripts/prepare-existing-fleet-source.mjs')));
 result=await maintained.prepareExistingFleetSource({slug,root,request,checkCi:assertContext});
 save('source-result.json',{...result,sourceOnly:true,productionVerified:false,templateRelease:accepted.id});
 console.log(JSON.stringify(result));
} catch(error){save('failure.json',{dealer:slug,stage:'maintained-source-preparation',message:error.message,stack:error.stack,productionVerified:false});console.error(error.stack);process.exitCode=1;}
