import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { freezeVercelDealerNativeSeal } from './seal-vercel-dealer-native.mjs';
import { nativeFixture } from './test-fixtures/native-source.mjs';
import { fingerprint } from './lib/workflow.mjs';
import { assertNativeAdoption, validateNativeRelease, NATIVE_CHECKS } from './lib/native-localization.mjs';
import { adoptNativeQualification, adoptNativeSource, applyNativeMounts } from './publishing/native-mounts.mjs';
import { baseNativeManifest } from './publishing/app-variant.mjs';
const VERCEL_QUALIFICATION_PATHS={candidate:'.client/cloudflare-existing-source.json',context:'.client/native-qualification-context.json',lock:'.client/native-qualification-lock.json',adoption:'localization/adoption.json'};

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const encode = value => Buffer.from(JSON.stringify(value,null,2)+'\n');
const write = (root,name,bytes) => { const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes); };
const git = (root,args) => execFileSync('git',['-C',root,...args],{encoding:'utf8',env:{...process.env,GIT_AUTHOR_NAME:'Vercel fixture',GIT_AUTHOR_EMAIL:'fixture@example.invalid',GIT_COMMITTER_NAME:'Vercel fixture',GIT_COMMITTER_EMAIL:'fixture@example.invalid'}}).trim();

function fixture(t) {
  const area=fs.mkdtempSync(path.join(os.tmpdir(),'cars-vercel-qualification-'));
  t.after(() => { const exact=fs.realpathSync(area),relative=path.relative(fs.realpathSync(os.tmpdir()),exact);assert(relative.startsWith('cars-vercel-qualification-')&&!relative.includes(path.sep)&&!path.isAbsolute(relative));fs.rmSync(exact,{recursive:true,force:true}); });
  const root=path.join(area,'cars');fs.mkdirSync(root);git(root,['init','--initial-branch=main']);git(root,['config','core.autocrlf','false']);
  const modern=nativeFixture(path.join(area,'modern-fixture')),importer=nativeFixture(path.join(area,'import-fixture'),'import');
  let files=new Map(modern.files);for(const [name,bytes]of importer.files)if(name.startsWith('import/'))files.set(name,bytes);
  for(const [key,index]of [['app',4],['mobile',5],['karento-best',6]])files.set(key+'/package.json',encode({name:'synthetic-'+key,type:'module',syntheticFixture:true}));
  const keys=['auto-best','import','modern','app','mobile','karento-best'];
  const manifest={...modern.manifest,packaging:{version:'5'},variants:keys.map((key,index)=>({key,base:index?'/variant-'+(index+1):'',entry:index?(key==='modern'?'/variant-'+(index+1)+'/cars':'/variant-'+(index+1)+'/'):'/'})),shareIdentity:{publicOrigin:'https://fixture-dealer.vercel.app'},templateSources:{},templateRevisions:{}};
  const parents={...modern.releases,import:importer.releases.import};delete parents.carwow;
  for(const [index,key]of keys.entries()){
    if(!parents[key])parents[key]={status:'approved',repository:'darkapoparka/cars-template-'+key,commit:String(index+1).repeat(40),digest:'d'.repeat(64),qa:{}};
    parents[key].qa.evidence='docs/releases/synthetic-parent/'+key+'.json';parents[key].qa.verifiedAt='2026-10-10T00:00:00Z';
    write(root,parents[key].qa.evidence,encode({syntheticFixture:true,key}));
    const prefix=key+'/';for(const [name,bytes]of files)if(name.startsWith(prefix))write(root,'templates/'+name,bytes);
  }
  const approvedBytes=encode({schemaVersion:1,templates:parents});write(root,'templates.lock.json',approvedBytes);
  git(root,['add','.']);git(root,['commit','-m','Synthetic immutable templates and original approved lock']);
  const sourceRevision=git(root,['rev-parse','HEAD']);
  for(const key of keys){const source={repository:'darkapoparka/cars',revision:sourceRevision,path:'templates/'+key,tree:git(root,['rev-parse',sourceRevision+':templates/'+key]),digest:fingerprint(path.join(root,'templates',key)).digest};manifest.templateSources[key]=source;manifest.templateRevisions[key]=sourceRevision;}
  const deltaBytes=encode({syntheticFixture:true,sourceRevision,nativeApproval:false}),delta={reference:'docs/releases/synthetic-delta.json',sha256:hash(deltaBytes),reviewedAt:'2026-10-12T00:00:00Z'};write(root,delta.reference,deltaBytes);
  const context={schemaVersion:1,kind:'cars-native-source-qualification-context',id:'vercel-fixture-source',dealer:manifest.slug,scope:'existing-dealer-pilot',sourceCommit:sourceRevision,reviewed:true,reviewedAt:delta.reviewedAt,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,approvedLockSha256:hash(approvedBytes),candidateLockSha256:'a'.repeat(64),sourceDeltaReview:delta};
  const lock={schemaVersion:1,templates:Object.fromEntries(keys.map(key=>[key,{status:'qualification',repository:'darkapoparka/cars',commit:sourceRevision,source:manifest.templateSources[key],snapshotPath:'templates/'+key,digest:manifest.templateSources[key].digest,qualification:{contextId:context.id,sourceQA:{approvedRelease:parents[key],releaseSha256:hash(JSON.stringify(parents[key])),reference:parents[key].qa.evidence,sha256:hash(fs.readFileSync(path.join(root,parents[key].qa.evidence))),verifiedAt:parents[key].qa.verifiedAt},sourceDeltaReview:delta,catalogs:parents[key].qa.nativeLocalization?.catalogs||[]}}]))};
  const lockBytes=encode(lock);context.candidateLockSha256=hash(lockBytes);const contextBytes=encode(context);
  files=adoptNativeQualification(files,baseNativeManifest(manifest),lock.templates,context,{root});
  files.set('dealer.json',encode(manifest));files.set(VERCEL_QUALIFICATION_PATHS.context,contextBytes);files.set(VERCEL_QUALIFICATION_PATHS.lock,lockBytes);
  files.set(VERCEL_QUALIFICATION_PATHS.candidate,encode({schemaVersion:1,kind:'personalized-source-candidate-not-an-approved-release',dealer:manifest.slug,sourceRevision,candidateSourceDigest:hash('synthetic reviewed candidate'),qualificationContextPath:VERCEL_QUALIFICATION_PATHS.context,qualificationContextSha256:hash(contextBytes),qualificationLockPath:VERCEL_QUALIFICATION_PATHS.lock,qualificationLockSha256:hash(lockBytes),sourceDeltaReview:delta,nativeApproval:false,hostedApproval:false}));
  for(const [name,bytes]of files)write(root,'clients/'+manifest.slug+'/'+name,bytes);
  git(root,['add','.']);git(root,['commit','-m','Synthetic sealed six-family dealer candidate']);const sourceCommit=git(root,['rev-parse','HEAD']);
  const request={schemaVersion:1,kind:'cars-vercel-native-source-qualification-request',provider:'vercel',scope:'existing-dealer-pilot',dealer:manifest.slug,repository:manifest.repository,publicOrigin:manifest.shareIdentity.publicOrigin,projectId:'prj_fixtureDealer',reviewed:true,reviewedAt:delta.reviewedAt,reviewedSourceCommit:sourceCommit,sourceTree:git(root,['rev-parse',sourceCommit+':clients/'+manifest.slug]),sourceRevision,approvedLockSha256:context.approvedLockSha256,inputSha256:Object.fromEntries(Object.entries(VERCEL_QUALIFICATION_PATHS).map(([name,file])=>[name,hash(files.get(file))])),targetBranch:'codex/vercel-native-fixture',production:false,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false};
  return {root,files,manifest,request,sourceCommit};
}

function mappedFixture(t) {
 const f=fixture(t),nativeKeys=['auto-best','modern','import'],services={'auto-best':'autobest',modern:'modern',import:'importer',app:'app',mobile:'mobile','karento-best':'signature'},nodes={autobest:'22.23.2',modern:'22.23.2',importer:'24.21.0',app:'22.23.2',mobile:'22.23.2',signature:'24.21.0'},privateCommit='f'.repeat(40);
 const proof={schemaVersion:1,kind:'cars-vercel-dealer-native-acceptance',scope:'existing-dealer',dealer:f.manifest.slug,repository:f.manifest.repository,projectId:f.request.projectId,sourceCommit:f.sourceCommit,sourceTree:f.request.sourceTree,nativeInput:JSON.parse(f.files.get('localization/adoption.json')).input,packageTree:'e'.repeat(40),packageDigest:'e'.repeat(64),publishingCommit:privateCommit,deploymentId:'dpl_actualFixture',publicOrigin:'https://fixture-preview.vercel.app/',sourceReleases:f.manifest.templateSources,verifiedAt:'2026-10-12T02:00:00Z',nativeApproval:true,hostedApproval:true,globalReleaseApproval:false};
 const dir='docs/releases/vercel-existing-refresh/',pin=(name,value)=>{const bytes=encode(value),reference=dir+name+'.json';write(f.root,reference,bytes);return {reference,sha256:hash(bytes)};};
 const p={schemaVersion:1,kind:'private-vercel-pilot-prepared-package',dealer:proof.dealer,repository:proof.repository,sourceCommit:proof.sourceCommit,packageTree:proof.packageTree,packageDigest:proof.packageDigest,runId:42,compilationInputProofSha256:'c'.repeat(64),compilationInputProof:{schemaVersion:1,kind:'immutable-package-compilation-input-proof',passed:true,packageDigest:proof.packageDigest,actualRetainedDigest:'d'.repeat(64),expectedRetainedDigest:'d'.repeat(64),unexpected:[],nativeApproval:false,hostedApproval:false,globalReleaseApproval:false},nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,transport:{packageTree:proof.packageTree,sourceCommit:proof.sourceCommit},tooling:{nativeClientBytesChanged:false,canonicalMainChanged:false,patchSha256:'a'.repeat(64),qualificationRequestSha256:'b'.repeat(64)},compiled:Object.values(services).map(service=>({service,node:nodes[service],result:'PASS',startedAt:'2026-10-12T00:01:00Z',finishedAt:'2026-10-12T00:02:00Z'}))};
 const x={commit:privateCommit,sourceCommit:proof.sourceCommit,packageTree:proof.packageTree,packageDigest:proof.packageDigest,projectId:proof.projectId,productionMainChanged:false,publicationEnvelope:{parent:'d'.repeat(40),packageTree:proof.packageTree}};
 const [githubOrg,githubRepo]=proof.repository.split('/');
 const v={id:proof.deploymentId,projectId:proof.projectId,source:'git',readyState:'READY',gitSource:{type:'github',sha:privateCommit},meta:{githubCommitSha:privateCommit,githubOrg,githubRepo,githubCommitRef:'codex/vercel-refresh-pilot'},url:'fixture-preview.vercel.app/'};
 const hosted={schemaVersion:1,kind:'cars-vercel-dealer-hosted-acceptance',dealer:proof.dealer,executed:true,status:'passed',unauthenticated:true,sourceCommit:proof.sourceCommit,sourceTree:proof.sourceTree,packageTree:proof.packageTree,packageDigest:proof.packageDigest,exportCommit:privateCommit,deploymentId:proof.deploymentId,projectId:proof.projectId,publicOrigin:proof.publicOrigin,verifiedAt:proof.verifiedAt,applications:{},nativeLocalization:{}};
 const check=(key,name)=>{const identity={dealer:proof.dealer,key,deploymentId:proof.deploymentId,projectId:proof.projectId,exportCommit:privateCommit,packageDigest:proof.packageDigest,source:proof.sourceReleases[key]};
  const observations=pin('observations-'+key+'-'+name,{schemaVersion:1,syntheticFixture:true,...identity,name,executed:true,status:'passed',verifiedAt:proof.verifiedAt,cases:['en','bg'].flatMap(locale=>[320,390,1440].map(width=>({locale,width,status:'passed',actual:true,syntheticFixture:true})))});
  const evidence=pin('checked-'+key+'-'+name,{schemaVersion:1,kind:'cars-vercel-actual-check',syntheticFixture:true,...identity,name,executed:true,status:'passed',verifiedAt:proof.verifiedAt,observations,observationsSha256:observations.sha256});
  return {name,status:'passed',evidenceSha256:evidence.sha256,evidence};};
 for(const key of Object.keys(services))hosted.applications[key]={status:'passed',source:proof.sourceReleases[key],checks:['mounted-journeys','public-journeys','assets-preserved','family-contract'].map(name=>check(key,name))};
 const old=JSON.parse(f.files.get('localization/adoption.json')).releases;
 for(const key of nativeKeys){const source=proof.sourceReleases[key];hosted.nativeLocalization[key]={schemaVersion:1,adapter:'native-v1',repository:source.repository,commit:source.revision,sourcePath:source.path,sourceTree:source.tree,sourceDigest:source.digest,locales:['en','bg'],widths:[320,390,1440],verifiedAt:proof.verifiedAt,evidenceSha256:'c'.repeat(64),catalogs:old[key].qualification.catalogs,checks:NATIVE_CHECKS.map(name=>check(key,name))};}
 proof.evidence={package:pin('prepared',p),export:pin('exported',x),provider:pin('provider',v),hosted:pin('hosted',hosted)};
 const mapping=pin('mapping',proof),lease={schemaVersion:1,kind:'cars-vercel-native-acceptance-lease',scope:'existing-dealer',reviewed:true,reviewedAt:proof.verifiedAt,mappingSha256:mapping.sha256,...Object.fromEntries(['dealer','repository','projectId','sourceCommit','sourceTree','nativeInput','packageTree','packageDigest','publishingCommit','publicOrigin','sourceReleases','evidence'].map(k=>[k,proof[k]])),exportParent:x.publicationEnvelope.parent,compilationInputProofSha256:p.compilationInputProofSha256,approvedLockSha256:f.request.approvedLockSha256,nativeApproval:true,hostedApproval:true,globalReleaseApproval:false};
 const mappedSource={...mapping,lease:pin('lease',lease)},deployment={provider:'vercel',id:proof.deploymentId,projectId:proof.projectId,state:'READY',sourceCommit:privateCommit,publicAlias:proof.publicOrigin,mappedSource};
 const releases=Object.fromEntries(nativeKeys.map(key=>[key,{status:'approved',repository:'darkapoparka/cars',commit:proof.sourceReleases[key].revision,source:proof.sourceReleases[key],snapshotPath:proof.sourceReleases[key].path,digest:proof.sourceReleases[key].digest,qa:{nativeLocalization:{...hosted.nativeLocalization[key],deployment}}}]));
 return {...f,proof,lease,p,x,v,hosted,pin,releases,mappedSource,nativeKeys};
}
function repin(f,{proof=f.proof,lease=f.lease,p=f.p,x=f.x,v=f.v,hosted=f.hosted}={}) {
 proof=structuredClone(proof);proof.evidence={package:f.pin('prepared',p),export:f.pin('exported',x),provider:f.pin('provider',v),hosted:f.pin('hosted',hosted)};
 const mapping=f.pin('mapping',proof);lease={...structuredClone(lease),mappingSha256:mapping.sha256,evidence:proof.evidence};
 const mappedSource={...mapping,lease:f.pin('lease',lease)},releases=structuredClone(f.releases);
 for(const key of f.nativeKeys)releases[key].qa.nativeLocalization.deployment.mappedSource=mappedSource;
 return {...f,proof,lease,p,x,v,hosted,mappedSource,releases};
}
test('mapped private Git SHA round trips through maintained native adoption without promoting global lock',t=>{
 const f=mappedFixture(t),global=fs.readFileSync(path.join(f.root,'templates.lock.json'));
 for(const key of f.nativeKeys)assert.doesNotThrow(()=>validateNativeRelease(key,f.releases[key],{root:f.root}));
 const adopted=adoptNativeSource(f.files,baseNativeManifest(f.manifest),f.releases,{root:f.root});assertNativeAdoption(adopted,baseNativeManifest(f.manifest),{root:f.root});
 const receipt=JSON.parse(adopted.get('localization/adoption.json'));assert.equal(receipt.schemaVersion,1);
 for(const key of f.nativeKeys){assert.equal(receipt.releases[key].qa.nativeLocalization.deployment.sourceCommit,f.proof.publishingCommit);assert.notEqual(f.proof.publishingCommit,f.manifest.templateRevisions[key]);assert.deepEqual(receipt.releases[key].qa.nativeLocalization.deployment.mappedSource,f.mappedSource);}
 assert.deepEqual(fs.readFileSync(path.join(f.root,'templates.lock.json')),global);
 const original=JSON.parse(f.files.get('localization/adoption.json'));assert.equal(original.nativeApproval,false);assert.equal(original.hostedApproval,false);
});
test('acceptance rejects incomplete native compile, wrong authenticated provider identity and unexecuted hosted evidence',t=>{
 const f=mappedFixture(t),compile=structuredClone(f.p);compile.compiled.pop();const a=repin(f,{p:compile});assert.throws(()=>validateNativeRelease('modern',a.releases.modern,{root:f.root}),/six actual native/);
 for(const change of [p=>p.compilationInputProof.passed=false,p=>p.compilationInputProof.unexpected.push({path:'changed-input'}),p=>p.compilationInputProofSha256='0'.repeat(64)]){const p=structuredClone(f.p);change(p);const failed=repin(f,{p});assert.throws(()=>validateNativeRelease('modern',failed.releases.modern,{root:f.root}),/compilation input proof\/helper lease/);}
 const provider=structuredClone(f.v);provider.gitSource.sha=f.manifest.templateRevisions.modern;const b=repin(f,{v:provider});assert.throws(()=>validateNativeRelease('modern',b.releases.modern,{root:f.root}),/authenticated raw provider Git source/);
 const hosted=structuredClone(f.hosted);hosted.executed=false;const c=repin(f,{hosted});assert.throws(()=>validateNativeRelease('modern',c.releases.modern,{root:f.root}),/current six-family/);
});
test('hashed evidence leases reject tampering, incorrect donor mapping, fake actual observations and global lock drift',t=>{
 const f=mappedFixture(t);fs.appendFileSync(path.join(f.root,f.proof.evidence.provider.reference),'\n');assert.throws(()=>validateNativeRelease('modern',f.releases.modern,{root:f.root}),/proof bytes differ/);
 repin(f);const donor=structuredClone(f.proof);donor.sourceReleases.modern.digest='0'.repeat(64);const a=repin(f,{proof:donor,lease:{...f.lease,sourceReleases:donor.sourceReleases}});assert.throws(()=>validateNativeRelease('modern',a.releases.modern,{root:f.root}),/selected template tuple/);
 const clean=repin(f),row=clean.hosted.nativeLocalization.modern.checks.find(x=>x.name==='preferences-races'),checked=JSON.parse(fs.readFileSync(path.join(f.root,row.evidence.reference))),observed=JSON.parse(fs.readFileSync(path.join(f.root,checked.observations.reference)));observed.cases[0].actual=false;checked.observations=f.pin('broken-observations',observed);checked.observationsSha256=checked.observations.sha256;row.evidence=f.pin('broken-checked',checked);row.evidenceSha256=row.evidence.sha256;
 const b=repin(f,{hosted:clean.hosted});assert.throws(()=>validateNativeRelease('modern',b.releases.modern,{root:f.root}),/actual check observations missing or failed/);
 fs.appendFileSync(path.join(f.root,'templates.lock.json'),'\n');assert.throws(()=>validateNativeRelease('modern',b.releases.modern,{root:f.root}),/global lock changed/);
});

test('the maintained adoption API freezes only the exact receipt and proof closure, with no source/index/global mutation',async t=>{
 const f=mappedFixture(t),file='docs/releases/vercel-existing-refresh/fixture-scoped.json';
 const scoped={schemaVersion:1,kind:'cars-vercel-dealer-scoped-native-releases',scope:'existing-dealer',dealer:f.manifest.slug,repository:f.manifest.repository,sourceCommit:f.sourceCommit,sourceTree:f.request.sourceTree,projectId:f.request.projectId,templates:f.releases,nativeApproval:true,hostedApproval:true,globalReleaseApproval:false};
 const bytes=encode(scoped);write(f.root,file,bytes);
 const request={schemaVersion:1,kind:'cars-vercel-dealer-native-seal-request',reviewed:true,reviewedAt:f.proof.verifiedAt,dealer:f.manifest.slug,repository:f.manifest.repository,sourceCommit:f.sourceCommit,sourceTree:f.request.sourceTree,canonicalPublicOrigin:f.manifest.shareIdentity.publicOrigin,publicOrigin:f.proof.publicOrigin,projectId:f.request.projectId,approvedLockSha256:f.request.approvedLockSha256,scopedReleases:{reference:file,sha256:hash(bytes)},nativeApproval:true,hostedApproval:true,globalReleaseApproval:false};
 const original=fs.readFileSync(path.join(f.root,'clients',f.manifest.slug,'localization/adoption.json')),index=fs.readFileSync(path.join(f.root,'.git/index')),global=fs.readFileSync(path.join(f.root,'templates.lock.json'));
 const out=path.join(f.root,'runtime','seal');
 const wrongScoped=encode({...scoped,publicOrigin:'https://unrelated.vercel.app'});write(f.root,file,wrongScoped);
 await assert.rejects(()=>freezeVercelDealerNativeSeal({...request,scopedReleases:{reference:file,sha256:hash(wrongScoped)}},{root:f.root,outDirectory:out,readInputs:async()=>f.files}),/dealer-scoped source acceptance differs/);write(f.root,file,bytes);
 await assert.rejects(()=>freezeVercelDealerNativeSeal({...request,canonicalPublicOrigin:'https://unrelated.vercel.app'},{root:f.root,outDirectory:out,readInputs:async()=>f.files}),/canonical manifest/);
 await assert.rejects(()=>freezeVercelDealerNativeSeal({...request,publicOrigin:f.manifest.shareIdentity.publicOrigin},{root:f.root,outDirectory:out,readInputs:async()=>f.files}),/actual acceptance/);
 const result=await freezeVercelDealerNativeSeal(request,{root:f.root,outDirectory:out,readInputs:async()=>f.files});
 assert.equal(result.canonicalSourceEdited,false);assert.equal(result.globalLockChanged,false);assert.equal(result.published,false);assert.equal(result.files.filter(r=>r.path.startsWith('clients/')).length,1);
 assert.deepEqual(fs.readFileSync(path.join(f.root,'clients',f.manifest.slug,'localization/adoption.json')),original);assert.deepEqual(fs.readFileSync(path.join(f.root,'.git/index')),index);assert.deepEqual(fs.readFileSync(path.join(f.root,'templates.lock.json')),global);
 assert.equal(JSON.parse(fs.readFileSync(path.join(out,'payload','clients',f.manifest.slug,'localization/adoption.json'))).schemaVersion,1);
});

test('recorded six-build recovery leases retain distinct original proof JSON and helper hashes',t=>{const f=mappedFixture(t),p=structuredClone(f.p),jsonHash='1'.repeat(64),helperHash='2'.repeat(64),moduleHash='3'.repeat(64),sourceRunId=38195093078;p.nativeCompilationSourceRunId=sourceRunId;p.compilationProofRecovery={kind:'recorded-native-compilation-proof-recovery',buildsRepeated:0,originalProofPassed:false,originalProofSha256:jsonHash,actualRetainedDigest:p.compilationInputProof.actualRetainedDigest,moduleSha256:moduleHash,lease:{sourceRunId,packageTree:p.packageTree,packageDigest:p.packageDigest,originalCompilationInputProofSha256:helperHash,files:{proof:{sha256:jsonHash}}}};const lease={...f.lease,nativeCompilationSourceRunId:sourceRunId,originalCompilationInputProofHelperSha256:helperHash,compilationProofRecoverySha256:moduleHash},actual=repin(f,{p,lease});assert.doesNotThrow(()=>validateNativeRelease('modern',actual.releases.modern,{root:f.root}));p.compilationProofRecovery.originalProofSha256=helperHash;const bad=repin(f,{p,lease});assert.throws(()=>validateNativeRelease('modern',bad.releases.modern,{root:f.root}),/recovery lease differs/);});
