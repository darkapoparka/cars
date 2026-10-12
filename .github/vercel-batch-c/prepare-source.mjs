/** Batch C transport adapter. Source generation, merge preservation, branding,
 * native source qualification and patch verification stay in maintained Cars tools.
 * No source installation, release promotion, private push or deployment occurs here.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
export const BRANCH='refs/heads/codex/vercel-batch-c-20261013';
export const ORDINARY=['excellent-cars','f1rst-motors','ivo-auto','kg-team-auto','texas-drive-auto','the-dealers-point'];
const digest=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const encode=x=>JSON.stringify(x,null,2)+'\n';
export function validateScope(request,slug,env){
 assert.equal(request.schemaVersion,1);assert.equal(request.batch,'C');
 assert.equal(request.acceptedRelease.id,'cars-vercel-b1f0f560-20261013');
 assert.equal(request.sourceRequest.sourceRevision,'b1f0f5609c7c249cfd0649c122849ff2cbb8dfde');
 assert(request.sourceRequest.dealers.length>0&&request.sourceRequest.dealers.length<=2);
 assert.equal(new Set(request.sourceRequest.dealers).size,request.sourceRequest.dealers.length);
 assert(request.sourceRequest.dealers.every(s=>ORDINARY.includes(s)));
 assert(request.sourceRequest.dealers.includes(slug));
 assert.equal(env.GITHUB_ACTIONS,'true');assert.equal(env.GITHUB_EVENT_NAME,'push');
 assert.equal(env.GITHUB_REPOSITORY,'darkapoparka/cars');assert.equal(env.GITHUB_REF,BRANCH);
 assert.equal(env.GITHUB_WORKFLOW,'Vercel Batch C source preparation');
 assert(/^[a-f0-9]{40}$/.test(env.GITHUB_SHA||''));
 assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID||''));assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT||''));
 assert.equal(env.CARS_SOURCE_BATCH_PREFETCH,undefined,'Do not impersonate canonical-main prefetch');
 for(const [k,v]of Object.entries(env))assert(!v||!/^(?:(?:CLOUDFLARE|CF)_(?:API_(?:TOKEN|KEY)|TOKEN)|WRANGLER_(?:API_TOKEN|TOKEN)|VERCEL_TOKEN)$/.test(k),'Provider credentials excluded');
}
export async function main(root,slug){
 const request=read(path.join(root,'.github/vercel-batch-c/source-request.json'));
 validateScope(request,slug,process.env);assert.equal(process.platform,'linux');assert.equal(process.version,'v26.10.0');
 const run=(args,options={})=>execFileSync('git',['-C',root,...args],{encoding:'utf8',maxBuffer:64*1024**2,timeout:120000,...options}).trim();
 assert.equal(run(['rev-parse','HEAD']),process.env.GITHUB_SHA);
 assert.equal(run(['rev-parse','--is-shallow-repository']),'false');
 assert.equal(run(['remote','get-url','origin']).replace(/\.git$/,''),'https://github.com/darkapoparka/cars');
 const release=read(path.join(root,request.acceptedRelease.path));
 assert.equal(release.id,request.acceptedRelease.id);assert.equal(release.sourceRevision,request.sourceRequest.sourceRevision);
 assert.equal(release.approvedParentLockSha256,request.sourceRequest.approvedParentLockDigest);
 assert.equal(run(['rev-parse',process.env.GITHUB_SHA+':clients/'+slug]),request.baselines[slug].tree,'Current dealer source changed: reconcile, never restore old source');
 assert.equal(run(['status','--porcelain','--untracked-files=no','--','clients/'+slug]),'');
 // Reproduce the existing deriveInputs metadata transformation. Every result
 // must equal the raw reviewed UTF-8 attachment hash; no approval is invented.
 const seed='docs/releases/cloudflare-existing25-20261011/signature-successor/';
 const candidate=read(path.join(root,seed+'qualification-lock.json'));
 const context=read(path.join(root,seed+'qualification-context.json'));
 context.id='vercel-'+slug+'-b1f-source-qualification';context.dealer=slug;
 context.sourceCommit=request.sourceRequest.sourceRevision;context.publishable=false;
 context.reviewedAt='2026-10-12T02:03:21.830Z';
 context.pending=['Exact immutable published template pins and original approved QA parent chain were reviewed. Own current factual consumer choices, preservation conflicts and prepared-source artifacts remain pending.','No native, hosted, global release or owner acceptance; source candidate only.'];
 context.sourceOnlyReview={baselineCommit:'bf6303bbde4268c649efb91df2b04ad3240b347b',baselineClientTree:request.baselines[slug].tree,scope:'Exact published b1f source tuples and original approved QA parent chain only; individual dealer preservation choices, candidate QA, native/hosted/global/owner acceptance remain pending.',preservationChoicesPending:true,canonicalSourcePublicationPending:true};
 candidate.qualification={"schemaVersion":1,"contextId":"fleet-promosale-varna-b1f-source-qualification","draft":false,"publishable":false,"reviewed":true,"reviewedAt":"2026-10-11T22:44:57.472Z","qualificationOnly":true,"approved":false,"nativeApproval":false,"hostedApproval":false,"globalReleaseApproval":false,"allSixFrozen":true,"sourceCommit":"b1f0f5609c7c249cfd0649c122849ff2cbb8dfde","approvedLockSha256":"ecdfaf9599fbcbeadebc24de3b9aa1c7615a9a49e29d338e5e9a23427d405e26","sourceReview":{"reference":"docs/releases/cloudflare-existing25-20261011/signature-successor/source-review.json","sha256":"888477e39e4dbc3dd15badbf09f66138e2b5ba624ef7b525bea6a7d9905e02f4"},"pending":["All twelve current native acceptance checks remain pending at the selected source.","Maintained source CI preservation plan, reviewed raster consumer checks, native qualification/App/extended reseals and provider compilation remain required.","Combined mounted/public browser pilot and owner visual acceptance of that hosted pilot remain pending. Global templates.lock.json is unchanged.","Own source-only tuple and factual identity review; actual preservation dispositions and final native/hosted gates remain pending."],"pendingNativeChecks":["catalog-completeness","hardcoded-ui","native-routing","standalone-journeys","mounted-journeys","public-journeys","preferences-no-js","preferences-storage-disabled","preferences-races","request-isolation","security-write-blocking","assets-preserved"]};
 for(const key of Object.keys(release.templates)){assert.equal(candidate.templates[key].status,'qualification');candidate.templates[key].qualification.contextId=context.id;}
 const lockBytes=Buffer.from(encode(candidate));context.candidateLockSha256=digest(lockBytes);
 for(const [role,bytes]of [['candidateLock',lockBytes],['qualification',Buffer.from(encode(context))]]){
  const pin=request.sourceRequest.inputs[slug][role];assert.equal(digest(bytes),pin.sha256,'Derived input differs from exact reviewed attachment');
  assert(pin.path.startsWith('docs/releases/cloudflare-existing25-20261011/vercel-existing-source/'+slug+'/'));
  const file=path.join(root,pin.path);fs.mkdirSync(path.dirname(file),{recursive:true});
  if(fs.existsSync(file))assert.equal(digest(fs.readFileSync(file)),pin.sha256,'Existing reviewed input changed');else fs.writeFileSync(file,bytes,{flag:'wx'});
 }
 const {gitFiles}=await import(pathToFileURL(path.join(root,'scripts/lib/workflow.mjs')).href);
 const {prepareExistingFleetSource}=await import(pathToFileURL(path.join(root,'scripts/prepare-existing-fleet-source.mjs')).href);
 const source=read(path.join(root,'clients',slug,'dealer.json'));
 assert.equal(source.repository,request.baselines[slug].repository);
 const lock=read(path.join(root,request.sourceRequest.inputs[slug].candidateLock.path));
 const entries=gitFiles(root,process.env.GITHUB_SHA,{prefix:'clients/'+slug,filter:()=>true});
 const locators=[];
 for(const [key,selected]of Object.entries(release.templates)){
  const target=lock.templates[key].source;
  assert.equal(target.repository,'darkapoparka/cars');assert.equal(target.revision,release.sourceRevision);
  assert.equal(target.path,selected.path);assert.equal(target.digest,selected.digest);
  locators.push(target);
  if(source.templateSources[key])locators.push(source.templateSources[key]);
 }
 const seen=new Set();
 for(const locator of locators){
  assert.equal(locator.repository,'darkapoparka/cars');assert(/^templates\/(auto-best|modern|import|app|mobile|karento-best)$/.test(locator.path));
  assert(/^[a-f0-9]{40}$/.test(locator.revision));
  const key=locator.revision+':'+locator.path;if(seen.has(key))continue;seen.add(key);
  if(locator.tree)assert.equal(run(['rev-parse',key]),locator.tree);
  entries.push(...gitFiles(root,locator.revision,{prefix:locator.path}));
 }
 // Same exact-object promisor transport as the maintained source controller,
 // with an explicit Batch C CI scope rather than forged main-event variables.
 const ids=[...new Set(entries.map(e=>e.blob))].sort();assert(ids.length>0&&ids.length<=50000);
 const inspect=values=>{
  if(!values.length)return [];
  const lines=run(['--no-lazy-fetch','cat-file','--batch-check=%(objectname) %(objecttype) %(objectsize)'],{input:values.join('\n')+'\n',env:{...process.env,GIT_NO_LAZY_FETCH:'1',GIT_TERMINAL_PROMPT:'0'}}).split(/\r?\n/);
  assert.equal(lines.length,values.length);
  return lines.map((line,i)=>{if(line===values[i]+' missing')return null;const [id,type,size]=line.split(' ');assert.equal(id,values[i]);assert.equal(type,'blob');assert(Number.isSafeInteger(Number(size))&&Number(size)>=0&&Number(size)<=150*1024**2);return Number(size);});
 };
 const sizes=inspect(ids),missing=ids.filter((_,i)=>sizes[i]===null);let bytes=sizes.reduce((n,s)=>n+(s||0),0);
 assert(bytes<=8*1024**3);console.log(JSON.stringify({stage:'bounded-source-hydration',slug,objects:ids.length,missing:missing.length}));
 for(let i=0;i<missing.length;i+=256){const chunk=missing.slice(i,i+256);
  run(['-c','gc.auto=0','-c','fetch.negotiationAlgorithm=noop','fetch','--no-tags','--no-write-fetch-head','--no-auto-maintenance','--no-recurse-submodules','--filter=blob:none','origin',...chunk],{timeout:600000,stdio:['pipe','pipe','pipe']});
  const fetched=inspect(chunk);assert(fetched.every(n=>n!==null));bytes+=fetched.reduce((n,s)=>n+s,0);assert(bytes<=8*1024**3);
  console.log(JSON.stringify({stage:'source-objects-read',slug,fetched:Math.min(i+256,missing.length),total:missing.length,bytes}));
 }
 const checkCi=()=>{validateScope(request,slug,process.env);assert.equal(run(['rev-parse','HEAD']),process.env.GITHUB_SHA);return {commit:process.env.GITHUB_SHA,runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT};};
 const result=await prepareExistingFleetSource({slug,root,request:request.sourceRequest,checkCi});
 const receipt={batch:'C',acceptedRelease:request.acceptedRelease,actualControlCommit:process.env.GITHUB_SHA,actualEvent:process.env.GITHUB_EVENT_NAME,actualRef:process.env.GITHUB_REF,sourcePreparation:result,sourceObjects:{count:ids.length,sha256:digest(JSON.stringify(ids)),bytes},privatePublication:false,productionVerified:false};
 fs.writeFileSync(path.join(result.output,'batch-c-controller-receipt.json'),encode(receipt),{flag:'wx'});
 console.log(encode(receipt));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const root=process.cwd(),slug=process.argv[2];
 main(root,slug).catch(error=>{const output=path.join(root,'runtime/batch-c-failures');fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,(ORDINARY.includes(slug)?slug:'invalid-scope')+'.json'),encode({error:error.message,stack:error.stack,controlCommit:process.env.GITHUB_SHA,sourceInstalled:false,privatePublished:false,productionVerified:false}));console.error(error.stack);process.exitCode=1;});
}
