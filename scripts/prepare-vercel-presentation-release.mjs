/** Extend the existing Vercel presentation lane: committed source, maintained
 * package/export, exact private leases. No local fleet copy or new provider ID.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {packageDealer,committedDealerInputs} from './package-dealer.mjs';
import {packageFiles,verifyPackage,verifyPackageTree,exportDealer,pushExport,publicationEnvelope,validateReview,assertVercelQualificationExport} from './export-dealer.mjs';
import {resolveDealerPresentationVersion} from './publishing/dealer-presentation.mjs';
import {writePackageObjectPack,installPackageObjectPack} from './lib/git-object-transport.mjs';

export const VERCEL_REQUEST='docs/releases/vercel-presentation-20261011/request.json';
export const VERCEL_KEYS=['auto-best','modern','import','app','mobile','karento-best'];
const hash=b=>createHash('sha256').update(b).digest('hex');
const oid=v=>/^[a-f0-9]{40}$/.test(v||'');
const digest=v=>/^[a-f0-9]{64}$/.test(v||'');
const encode=v=>JSON.stringify(v,null,2)+'\n';
const safe=p=>typeof p==='string'&&p.length<256&&/^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*$/.test(p)&&!p.split('/').some(x=>x==='.'||x==='..');
const git=(root,args,options={})=>execFileSync('git',['-c','core.sparseCheckout=false',...args],{cwd:root,encoding:'utf8',maxBuffer:32*1024**2,timeout:15*60*1000,...options}).trimEnd();
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
function pin(root,p){assert(p&&safe(p.path)&&p.path.startsWith('docs/releases/')&&digest(p.sha256),'Exact reviewed release input pin required');const bytes=fs.readFileSync(path.join(root,p.path));assert.equal(hash(bytes),p.sha256,'Reviewed release input changed');return {bytes,value:JSON.parse(bytes)};}

export function validateVercelRefreshRequest(request,{cohort,registry}={}){
 assert(request?.schemaVersion===2&&request.kind==='cars-existing-vercel-refresh','Explicit existing Vercel refresh request required');
 assert(['proposal','publish'].includes(request.action)&&['qualification-preview','approved-production'].includes(request.stage),'Unknown Vercel action or stage');
 if(request.publicationTransport!==undefined)assert(request.publicationTransport==='existing-local-publisher'&&request.action==='proposal','Local publication transport emits a proposal only; use the maintained local publisher for the reviewed private push');
 assert(oid(request.toolingSourceCommit)&&digest(request.templateLock?.sha256),'Exact frozen tooling and template lock pins required');
 assert(Array.isArray(cohort?.rows)&&cohort.rows.length===25&&new Set(cohort.rows.map(r=>r.slug)).size===25,'Exact prior 25-dealer delivery roster required');
 assert(Array.isArray(request.dealers)&&request.dealers.length>0&&request.dealers.length<=25&&new Set(request.dealers.map(r=>r.slug)).size===request.dealers.length,'Invalid bounded Vercel wave');
 assert(JSON.stringify(Object.keys(request.templateSources||{}).sort())===JSON.stringify([...VERCEL_KEYS].sort()),'Exactly six selected template sources required');
 for(const [key,s]of Object.entries(request.templateSources))assert(s.repository==='darkapoparka/cars'&&oid(s.revision)&&s.path==='templates/'+key&&oid(s.tree)&&digest(s.digest),'Invalid immutable template source '+key);
 if(request.stage==='qualification-preview')assert(request.dealers.length===1&&request.dealers[0].slug==='f1rst-motors','The first combined Vercel qualification pilot is the existing F1rst project');
 for(const row of request.dealers){
  const prior=cohort.rows.find(r=>r.slug===row.slug),registered=registry?.dealers?.find(r=>r.slug===row.slug);
  assert(prior&&registered,'Dealer outside exact existing cohort or registry');
  assert(row.repository===prior.repository&&row.projectId===prior.projectId&&row.publicOrigin===prior.origin,'Existing Vercel identity changed');
  assert(registered.repository===row.repository&&registered.delivery?.projectId===row.projectId,'Registry identity differs from prior delivery');
  assert(oid(row.sourceCommit)&&oid(row.sourceTree)&&oid(row.privateMain),'Exact raw-source tree and fresh private main lease required');
  assert(row.privateTarget===null||oid(row.privateTarget),'Exact target branch lease required');
  assert(row.sourceReview&&safe(row.sourceReview.path)&&digest(row.sourceReview.sha256),'Exact prepared source review required');
  const independent=registered.sourceOwnership==='independent-repository';
  assert(row.sourceOwnership===(independent?'independent-repository':'cars-owned'),'Source ownership differs from registry');
  assert(row.sourceRepository===(independent?registered.canonicalSourceRepository:'darkapoparka/cars'),'Canonical source repository changed');
  if(independent)assert(row.slug==='al-reef-used-cars'&&row.sourceRepository===row.repository&&registered.localPath===null,'Only the registered independent Al Reef boundary is allowed');
  if(request.stage==='qualification-preview')assert(/^codex\/[a-z0-9][a-z0-9/-]*$/.test(row.targetBranch||'')&&!row.targetBranch.includes('..')&&row.qualification,'Exact reviewed Vercel preview branch and native context required');
  else assert(row.targetBranch==='main'&&row.privateTarget===row.privateMain&&row.qualification===undefined,'Production requires the existing main and ordinary approved-native source');
  if(request.action==='publish')assert(row.approval?.remoteCommit===(row.privateTarget??row.privateMain)&&digest(row.approval?.candidateDigest)&&oid(row.approval?.packageTree),'Publish requires the exact reviewed proposal digest/tree and private parent');
 }
 return request;
}
export function vercelRefreshMatrix(request,inputs){
 if(request.schemaVersion!==2){assert(request.dealers.length===10&&new Set(request.dealers.map(d=>d.slug)).size===10,'Invalid historical ten-dealer scope');return {include:request.dealers.map(d=>({slug:d.slug,independent:false}))};}
 validateVercelRefreshRequest(request,inputs);
 return {include:request.dealers.map(row=>({slug:row.slug,independent:row.sourceOwnership==='independent-repository',sourceRepository:row.sourceRepository,sourceCommit:row.sourceCommit}))};
}
export function assertVercelSourceBinding(manifest,row,request){
 assert.equal(manifest.slug,row.slug);assert.equal(manifest.repository,row.repository);assert.equal(manifest.packaging.version,'5');
 assert.equal(new URL(manifest.shareIdentity.publicOrigin).origin,row.publicOrigin);
 assert.equal(manifest.variants.length,6);assert.deepEqual(manifest.variants.map(v=>v.key).sort(),[...VERCEL_KEYS].sort());
 for(const key of VERCEL_KEYS)assert.deepEqual(manifest.templateSources[key],request.templateSources[key],'Prepared source template drift: '+key);
}
function configurePrivateGit(){
 const token=process.env.CARS_PUBLISH_TOKEN;assert(token,'Existing private-repository publication credential is required');
 const encoded=Buffer.from('x-access-token:'+token).toString('base64');console.log('::add-mask::'+encoded);
 const count=Number(process.env.GIT_CONFIG_COUNT||0);assert(Number.isSafeInteger(count)&&count>=0&&count<4095,'Invalid Git process configuration');
 process.env['GIT_CONFIG_KEY_'+count]='http.https://github.com/.extraheader';process.env['GIT_CONFIG_VALUE_'+count]='AUTHORIZATION: basic '+encoded;process.env.GIT_CONFIG_COUNT=String(count+1);
 process.env.GIT_TERMINAL_PROMPT='0';process.env.GIT_NO_LAZY_FETCH='1';
}
function remoteHead(root,repository,branch){const value=git(root,['ls-remote','https://github.com/'+repository+'.git','refs/heads/'+branch]);return value?value.split(/\s/)[0]:null;}
function treeFiles(root,tree){return new Map(git(root,['ls-tree','-r','-z',tree]).split('\0').filter(Boolean).map(line=>{const [header,p]=line.split('\t');return[p,header.split(' ')[2]];}));}
function compactExport(proposal){const {packageDirectory,proposalDirectory,gitObjectAlternates,gitProcessConfig,...proof}=proposal;return proof;}
let diagnosticScope;

/** Independent source uses its own Git root and exact registered identity. The
 * Cars exporter continues rejecting independent dealers. Only its maintained
 * verifier, envelope and reviewed-disposition rules are reused here.
 */
function independentProposal({root,manifest,row,packageTree,reviewFile,write=false,area}){
 assert.equal(git(root,['rev-parse','--show-toplevel']),fs.realpathSync(root));
 assert.equal(git(root,['remote','get-url','origin']).replace(/\.git$/,''),'https://github.com/'+row.repository);
 const checked=verifyPackageTree({root,packageTree});assert.equal(checked.manifest.repository,row.repository);assert.equal(checked.meta.sourceCommit,row.sourceCommit);
 assertVercelQualificationExport(checked.meta,{branch:row.targetBranch,manifest:checked.manifest});
 const baseHead=remoteHead(root,row.repository,'main'),targetHead=remoteHead(root,row.repository,row.targetBranch);assert.equal(baseHead,row.privateMain);assert.equal(targetHead,row.privateTarget);
 const parent=targetHead??baseHead;assert(oid(parent),'Existing independent private parent required');git(root,['fetch','--no-tags','https://github.com/'+row.repository+'.git',parent]);
 const index=path.join(area,'independent-export.index'),env={...process.env,GIT_INDEX_FILE:index};git(root,['read-tree','--no-sparse-checkout',packageTree],{env});
 const envelope=publicationEnvelope({root,parent,prefixes:['.github'],packageTree});if(envelope.files.length)git(root,['update-index','-z','--index-info'],{env,input:envelope.files.map(f=>f.mode+' '+f.blob+'\t'+f.path+'\0').join('')});
 const tree=git(root,['write-tree'],{env}),remote=treeFiles(root,parent),candidate=treeFiles(root,tree),changes=[...new Set([...remote.keys(),...candidate.keys()])].filter(p=>p!=='.cars-publish.json'&&remote.get(p)!==candidate.get(p)).sort();
 let prior=null;try{prior=JSON.parse(git(root,['show',parent+':.cars-publish.json'],{stdio:['pipe','pipe','ignore']}));}catch{}
 if(prior)assert.equal(prior.repository,row.repository);const managed=new Map(prior?.files?.map(f=>[f.path,f.blob])||[]);
 const unexpected=[...new Set([...remote.keys(),...managed.keys()])].filter(p=>p!=='.cars-publish.json'&&!p.startsWith('.github/')&&p!=='.github'&&remote.get(p)!==managed.get(p));
 const proposal={schemaVersion:1,slug:row.slug,repository:row.repository,branch:row.targetBranch,defaultBranch:'main',baseHead,targetHead,parent,sourceCommit:row.sourceCommit,candidateDigest:checked.digest,packageTree,tree,changes,unexpectedRemoteChanges:unexpected,publicationEnvelope:envelope};
 if(!write)return proposal;
 if(!prior||unexpected.length)validateReview({review:reviewFile?readJson(reviewFile):null,remoteCommit:parent,candidateDigest:checked.digest,changes:prior?unexpected:changes});
 const publish={schemaVersion:1,repository:row.repository,sourceCommit:row.sourceCommit,packagingVersion:checked.meta.packagingVersion,candidateDigest:checked.digest,publicationEnvelope:envelope,files:[...candidate].map(([p,blob])=>({path:p,blob})).sort((a,b)=>a.path.localeCompare(b.path))};
 const blob=git(root,['hash-object','-w','--stdin'],{input:encode(publish)});git(root,['update-index','--add','--cacheinfo','100644',blob,'.cars-publish.json'],{env});
 const finalTree=git(root,['write-tree'],{env}),commit=git(root,['-c','user.name=Cars release','-c','user.email=41898282+github-actions[bot]@users.noreply.github.com','commit-tree',finalTree,'-p',parent],{input:'Publish independent '+row.slug+' from its exact reviewed source '+row.sourceCommit+'\n'});
 assert.equal(remoteHead(root,row.repository,'main'),baseHead);assert.equal(remoteHead(root,row.repository,row.targetBranch),targetHead);assert.equal(git(root,['rev-parse',commit+'^']),parent);
 git(root,['push','https://github.com/'+row.repository+'.git',commit+':refs/heads/'+row.targetBranch]);assert.equal(remoteHead(root,row.repository,row.targetBranch),commit);
 return {...proposal,tree:finalTree,commit,published:true,trigger:'Git-to-Vercel for the existing independent project; hosted checks pending'};
}
async function prepareRefresh(root,request,row,area){
 const cohort=pin(root,request.previousDelivery).value,registry=readJson(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'));validateVercelRefreshRequest(request,{cohort,registry});
 assert.equal(git(root,['rev-parse','HEAD']),process.env.GITHUB_SHA);git(root,['merge-base','--is-ancestor',request.toolingSourceCommit,process.env.GITHUB_SHA]);
 const toolingTree=git(root,['rev-parse',request.toolingSourceCommit+':scripts']);assert.equal(git(root,['rev-parse',process.env.GITHUB_SHA+':scripts']),toolingTree,'Tooling changed after frozen checkpoint');
 const lock=pin(root,request.templateLock).value;for(const key of VERCEL_KEYS){assert.deepEqual(lock.templates[key].source,request.templateSources[key]);assert.equal(lock.templates[key].commit,request.templateSources[key].revision);}
 const independent=row.sourceOwnership==='independent-repository',sourceRoot=independent?path.join(root,'runtime/independent-source',row.slug):root,source=independent?sourceRoot:path.join(root,'clients',row.slug),prefix=independent?'':'clients/'+row.slug;
 if(!independent)git(root,['merge-base','--is-ancestor',row.sourceCommit,process.env.GITHUB_SHA]);else assert.equal(git(sourceRoot,['rev-parse','HEAD']),row.sourceCommit);
 const sourceTree=git(sourceRoot,['rev-parse',row.sourceCommit+(prefix?':'+prefix:'^{tree}')]);assert.equal(sourceTree,row.sourceTree,'Prepared raw source tree changed');
 const review=pin(root,row.sourceReview).value;assert.equal(review.dealer,row.slug);assert.equal(review.preparedTree,row.sourceTree);assert.equal(review.canonicalSourceRepository,row.sourceRepository);
 const manifest=readJson(path.join(source,'dealer.json'));assertVercelSourceBinding(manifest,row,request);
 const {canonicalFiles}=await committedDealerInputs({root:sourceRoot,source,manifest,sourceCommit:row.sourceCommit,prefix});
 let nativeQualification;
 if(request.stage==='qualification-preview'){const context=pin(root,row.qualification).value;assert.equal(context.candidateLockSha256,request.templateLock.sha256);nativeQualification={context,targetBranch:row.targetBranch};}
 const pack=path.join(area,'package');await packageDealer({root,source,destination:pack,manifest,sourceCommit:row.sourceCommit,canonicalFiles,provider:'vercel',...(nativeQualification?{nativeQualification}: {})});
 const verified=verifyPackage(pack),meta=readJson(pack+'/.cars-package.json'),config=readJson(pack+'/vercel.json');assert.equal(Object.keys(config.services).length,6);assert.equal(meta.assetDelivery.provider,'vercel');assert.equal(meta.manifest.repository,row.repository);assert.equal(meta.sourceCommit,row.sourceCommit);
 const presentation=readJson(pack+'/.cars-dealer-presentation.json');assert.equal(presentation.logoPixelsChanged,false);assert.equal(presentation.version,resolveDealerPresentationVersion(manifest.presentation.version));
 const env={...process.env,GIT_INDEX_FILE:path.join(area,'package.index')};git(sourceRoot,['read-tree','--empty'],{env});git(sourceRoot,['--work-tree',pack,'--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul'],{env,input:packageFiles(pack).join('\0')+'\0'});const packageTree=git(sourceRoot,['write-tree'],{env});assert.equal(verifyPackageTree({root:sourceRoot,packageTree}).digest,verified.digest);
 if(request.publicationTransport==='existing-local-publisher'){
  // Reuse the existing bounded object pack. The local publisher already owns
  // exact private-repository authentication and rechecks the actual private head.
  const output=path.join(area,'artifact');fs.mkdirSync(output);const packageCommit=git(sourceRoot,['-c','user.name=Cars release','-c','user.email=41898282+github-actions[bot]@users.noreply.github.com','commit-tree',packageTree,'-p',row.sourceCommit],{input:'Transport exact reviewed Vercel package for '+row.slug+'\n'});
  const sourcePaths=independent?[...VERCEL_KEYS,'branding','localization']:['clients/'+row.slug,'scripts'];
  const objectTransport=writePackageObjectPack({root:sourceRoot,sourceCommit:row.sourceCommit,sourcePaths,packageTree,packageCommit,destination:output+'/package.objects.pack'});
  const receipt={schemaVersion:1,kind:'existing-dealer-vercel-refresh-package',slug:row.slug,repository:row.repository,projectId:row.projectId,publicOrigin:row.publicOrigin,stage:request.stage,publicationTransport:request.publicationTransport,sourceOwnership:row.sourceOwnership,sourceCommit:row.sourceCommit,sourceTree,toolingSourceCommit:request.toolingSourceCommit,templateSources:request.templateSources,packageTree,packageCommit,packageDigest:verified.digest,objectTransport,serviceCount:6,presentation,qualification:meta.qualification??null,privateMain:row.privateMain,privateTarget:row.privateTarget,targetBranch:row.targetBranch,privateLeaseVerification:'Required in the maintained local publisher before its reviewed export/push',compiled:false,published:false,hostedApproval:false};
  fs.writeFileSync(output+'/package.json',encode(receipt));console.log(JSON.stringify({slug:row.slug,action:'proposal',stage:request.stage,publicationTransport:request.publicationTransport,packageTree,packageDigest:verified.digest,packBytes:objectTransport.packBytes,published:false,providerIdentityChanged:false}));return;
 }
 configurePrivateGit();assert.equal(remoteHead(sourceRoot,row.repository,'main'),row.privateMain);assert.equal(remoteHead(sourceRoot,row.repository,row.targetBranch),row.privateTarget);
 const reviewFile=row.mirrorReview?(pin(root,row.mirrorReview),path.join(root,row.mirrorReview.path)):undefined;
 const options={root:sourceRoot,manifest,row,packageTree,reviewFile,area};
 const proposal=independent?independentProposal(options):exportDealer({root,slug:row.slug,packageTree,targetBranch:row.targetBranch,preservePrefixes:['.github']});
 assert.equal(proposal.baseHead,row.privateMain);assert.equal(proposal.targetHead,row.privateTarget);assert.equal(proposal.candidateDigest,verified.digest);
 const output=path.join(area,'artifact');fs.mkdirSync(output);const receipt={schemaVersion:1,kind:'existing-dealer-vercel-refresh-proposal',slug:row.slug,repository:row.repository,projectId:row.projectId,publicOrigin:row.publicOrigin,stage:request.stage,sourceOwnership:row.sourceOwnership,sourceCommit:row.sourceCommit,sourceTree,toolingSourceCommit:request.toolingSourceCommit,templateSources:request.templateSources,packageTree,packageDigest:verified.digest,serviceCount:6,presentation,qualification:meta.qualification??null,proposal:compactExport(proposal),compiled:false,published:false,hostedApproval:false};
 fs.writeFileSync(output+'/proposal.json',encode(receipt));
 if(request.action==='publish'){
  assert.equal(verified.digest,row.approval.candidateDigest);assert.equal(packageTree,row.approval.packageTree);assert.equal(proposal.parent,row.approval.remoteCommit);
  let result;if(independent)result=independentProposal({...options,write:true});else{const written=exportDealer({root,slug:row.slug,packageTree,targetBranch:row.targetBranch,preservePrefixes:['.github'],reviewFile,write:true});assert.equal(written.parent,row.approval.remoteCommit);result=pushExport({root,receiptFile:path.join(written.proposalDirectory,'export.json')});}
  fs.writeFileSync(output+'/publication.json',encode({...receipt,published:true,publication:compactExport(result),checkedAt:new Date().toISOString()}));
 }
 console.log(JSON.stringify({slug:row.slug,action:request.action,stage:request.stage,packageTree,packageDigest:verified.digest,unexpectedRemoteChanges:proposal.unexpectedRemoteChanges,published:request.action==='publish',providerIdentityChanged:false}));
}

async function historicalPrepare(root,request,slug,area){
 const sha=process.env.GITHUB_SHA,record=request.dealers.find(d=>d.slug===slug),manifest=readJson('clients/'+slug+'/dealer.json');assert.equal(manifest.repository,record.repository);assert.equal(new URL(manifest.shareIdentity.publicOrigin).origin,new URL(record.publicOrigin).origin);
 const packRelative='runtime/dealer-packages/vercel-presentation-'+slug,pack=path.join(root,packRelative);const result=spawnSync(process.execPath,['scripts/package-dealer.mjs','--client',slug,'--out',packRelative,'--provider','vercel','--source-commit',sha,'--write'],{cwd:root,env:process.env,stdio:'inherit',timeout:40*60*1000});assert.equal(result.status,0);
 const verified=verifyPackage(pack),presentation=readJson(pack+'/.cars-dealer-presentation.json');assert.equal(presentation.logoPixelsChanged,false);assert.equal(presentation.version,resolveDealerPresentationVersion(manifest.presentation.version));
 const env={...process.env,GIT_INDEX_FILE:path.join(area,'package.index')};git(root,['read-tree','--empty'],{env});git(root,['--work-tree',pack,'--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul'],{env,input:packageFiles(pack).join('\0')+'\0'});const tree=git(root,['write-tree'],{env});assert.equal(verifyPackageTree({root,packageTree:tree}).digest,verified.digest);
 const commit=git(root,['-c','user.name=Cars release','-c','user.email=41898282+github-actions[bot]@users.noreply.github.com','commit-tree',tree,'-p',sha],{input:'Transport exact Vercel package for '+slug+'\n'}),artifact=path.join(area,'artifact');fs.mkdirSync(artifact);const objectTransport=writePackageObjectPack({root,sourceCommit:sha,sourcePaths:['clients/'+slug,'scripts'],packageTree:tree,packageCommit:commit,destination:artifact+'/package.objects.pack'});
 fs.writeFileSync(artifact+'/package.json',encode({schemaVersion:1,kind:'existing-dealer-vercel-presentation-package',slug,...record,sourceCommit:sha,sourceTree:git(root,['rev-parse',sha+':clients/'+slug]),packageCommit:commit,packageTree:tree,packageDigest:verified.digest,objectTransport,presentation,templateRevisions:manifest.templateRevisions,runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT,compiled:false,published:false}));
}
async function main(){
 const root=process.cwd(),[mode,slug,key]=process.argv.slice(2),request=readJson(path.join(root,VERCEL_REQUEST));
 assert(process.env.GITHUB_ACTIONS==='true'&&process.env.GITHUB_REPOSITORY==='darkapoparka/cars'&&process.env.GITHUB_REF==='refs/heads/main','Only the committed existing Cars main CI request is allowed');
 assert.equal(git(root,['rev-parse','HEAD']),process.env.GITHUB_SHA);
 if(mode==='matrix'){const inputs=request.schemaVersion===2?{cohort:pin(root,request.previousDelivery).value,registry:readJson(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'))}:undefined;console.log('dealers='+JSON.stringify(vercelRefreshMatrix(request,inputs)));console.log('legacy_native='+(request.schemaVersion===2?'false':'true'));console.log('pilots='+JSON.stringify({include:request.schemaVersion===2?[]:['promosale-varna','navara-car'].flatMap(slug=>Object.entries({'auto-best':'22.23.2',modern:'22.23.2',import:'24.21.0',app:'22.23.2',mobile:'22.23.2','karento-best':'24.21.0'}).map(([key,node])=>({slug,key,node})))}));return;}
 const row=request.dealers.find(d=>d.slug===slug);assert(row,'Dealer outside committed request');const area=path.join(root,'runtime/vercel-presentation',slug);fs.mkdirSync(area,{recursive:true});
 diagnosticScope={area,slug,mode};
 if(mode==='prepare'){assert.equal(process.version,'v22.23.2');if(request.schemaVersion===2)await prepareRefresh(root,request,row,area);else await historicalPrepare(root,request,slug,area);}
 else if(mode==='native'){
  assert(request.schemaVersion!==2&&['promosale-varna','navara-car'].includes(slug)&&VERCEL_KEYS.includes(key),'Unknown historical native qualification target');
  const input=path.join(root,'input/package'),receipt=readJson(input+'/package.json');assert.equal(receipt.slug,slug);assert.equal(receipt.sourceCommit,process.env.GITHUB_SHA);installPackageObjectPack({root,receipt:receipt.objectTransport,file:input+'/package.objects.pack'});
  const pack=path.join(area,'native-'+key);fs.mkdirSync(pack);const archive=spawnSync('bash',['-euo','pipefail','-c','git archive "$PACKAGE_TREE" | tar -xf - -C "$PACKAGE_DIR"'],{cwd:root,env:{...process.env,PACKAGE_TREE:receipt.packageTree,PACKAGE_DIR:pack},stdio:'inherit'});assert.equal(archive.status,0);verifyPackage(pack);
  const service=readJson(pack+'/vercel.json').services[{'auto-best':'autobest',import:'importer',modern:'modern',app:'app',mobile:'mobile','karento-best':'signature'}[key]];assert(service&&safe(service.root));for(const step of ['installCommand','buildCommand']){const r=spawnSync('bash',['-euo','pipefail','-c',service[step]],{cwd:path.join(pack,service.root),env:process.env,stdio:'inherit',timeout:40*60*1000});assert.equal(r.status,0);}
  fs.writeFileSync(area+'/native-'+key+'.json',encode({schemaVersion:1,slug,key,sourceCommit:receipt.sourceCommit,packageTree:receipt.packageTree,packageDigest:receipt.packageDigest,result:'PASS',scope:'Generated Vercel service compilation; not hosted approval'}));
 }else throw Error('Use matrix | prepare SLUG | native SLUG FAMILY');
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename)main().catch(error=>{let message=String(error.message).slice(0,4000);const token=process.env.CARS_PUBLISH_TOKEN;if(token)for(const secret of [token,Buffer.from('x-access-token:'+token).toString('base64')])message=message.split(secret).join('[redacted]');if(diagnosticScope){const {area,slug,mode}=diagnosticScope;fs.writeFileSync(area+'/diagnostic.json',encode({schemaVersion:1,kind:'failure-not-a-release',slug,mode,error:message,published:false}));}console.error(message);process.exitCode=1;});
