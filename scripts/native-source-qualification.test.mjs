import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {nativeFixture} from './test-fixtures/native-source.mjs';
import {fingerprint} from './lib/workflow.mjs';
import {assertNativeAdoption,assertNativeQualification,NATIVE_CHECKS,validateNativeRelease} from './lib/native-localization.mjs';
import {adoptNativeSource,adoptNativeQualification} from './publishing/native-mounts.mjs';
import {fixtureReleases,writeTinySingleton} from './test-fixtures/fleet-single-worker.mjs';
import {selectPinnedRevisions} from './dealer-updates/three-way-upgrade.mjs';
import {finalizeDealerTemplateCandidate,validateDealerSourceQualification} from './dealer-updates/update-dealer-template.mjs';
import {planDealerPackage} from './package-dealer.mjs';
import {existingFleetNativeSource,existingFleetQualifiedSources} from './build-existing-fleet-cloudflare.mjs';
import {sourceQualificationFiles} from './prepare-existing-fleet-source.mjs';

const sha=value=>createHash('sha256').update(value).digest('hex');
const wrapper=path.resolve(import.meta.dirname,'dealer-updates/update-dealer-template.mjs');
const git=(root,args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',env:{...process.env,GIT_AUTHOR_NAME:'Qualification test',GIT_AUTHOR_EMAIL:'test@example.invalid',GIT_COMMITTER_NAME:'Qualification test',GIT_COMMITTER_EMAIL:'test@example.invalid'}}).trim();
const write=(root,name,bytes)=>{const target=path.join(root,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);};
const writeJson=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');};
function filesAt(root){const result=new Map();function walk(current,relative=''){for(const entry of fs.readdirSync(current,{withFileTypes:true})){if(entry.name==='.git')continue;const name=relative?relative+'/'+entry.name:entry.name;if(entry.isDirectory())walk(path.join(current,entry.name),name);else if(entry.isFile())result.set(name,fs.readFileSync(path.join(current,entry.name)));}}walk(root);return result;}
function init(root,origin){fs.mkdirSync(root,{recursive:true});execFileSync('git',['init','--initial-branch=main',root],{stdio:'ignore'});git(root,['config','core.autocrlf','false']);git(root,['remote','add','origin',origin]);}
async function fixture(t,{cloudflareParent=false}={}){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-native-qualification-'));
 t.after(()=>{const exact=fs.realpathSync(root),relative=path.relative(fs.realpathSync(os.tmpdir()),exact);assert(relative.startsWith('cars-native-qualification-')&&!relative.includes(path.sep)&&!path.isAbsolute(relative));fs.rmSync(exact,{recursive:true,force:true});});
 const carsRoot=path.join(root,'cars'),dealerRoot=path.join(root,'dealer'),templateRoot=path.join(root,'template-repos');
 init(carsRoot,'https://github.com/darkapoparka/cars.git');fs.mkdirSync(path.join(carsRoot,'runtime'),{recursive:true});
 const f=nativeFixture(dealerRoot),oldRepo=path.join(templateRoot,'cars-template-modern'),configName='modern/packages/marketplace/lead-site.ts';
 f.files.set(configName,Buffer.from(f.files.get(configName).toString().replace('name: "Fixture Dealer"','accent: "#30343b", name: "Fixture Dealer"')));
 init(oldRepo,'https://github.com/darkapoparka/cars-template-modern.git');
 for(const [name,bytes]of f.files)if(name.startsWith('modern/'))write(oldRepo,name.slice(7),bytes);
 git(oldRepo,['add','.']);git(oldRepo,['commit','-m','Original accepted source fixture']);
 const oldCommit=git(oldRepo,['rev-parse','HEAD']),oldDigest=fingerprint(oldRepo).digest;
 Object.assign(f.releases.modern,{commit:oldCommit,digest:oldDigest});Object.assign(f.releases.modern.qa.nativeLocalization,{commit:oldCommit,sourceDigest:oldDigest});f.releases.modern.qa.nativeLocalization.deployment.sourceCommit=oldCommit;
 f.manifest.templateRevisions.modern=oldCommit;
 f.manifest.templateSources=Object.fromEntries(f.manifest.variants.map(({key})=>[key,{repository:`darkapoparka/cars-template-${key}`,revision:f.manifest.templateRevisions[key],path:'',digest:f.releases[key].digest}]));
 for(const [key,release]of Object.entries(f.releases)){
  release.qa.evidence='docs/releases/fixture-parent/'+key+'.json';release.qa.verifiedAt='2026-10-10T00:00:00.000Z';writeJson(path.join(carsRoot,release.qa.evidence),{schemaVersion:1,kind:'synthetic-original-QA',sourceCommit:release.commit,note:'Fixture only; not rollout acceptance'});
 }
 const approvedLock={schemaVersion:1,templates:f.releases},globalLock=path.join(carsRoot,'templates.lock.json');writeJson(globalLock,approvedLock);
 f.files.set(configName,Buffer.from(f.files.get(configName).toString().replace('#30343b','#176b43').replace('Fixture Dealer','Truthful Fixture')));
 const adopted=adoptNativeSource(f.files,f.manifest,f.releases);adopted.set('dealer.json',Buffer.from(JSON.stringify(f.manifest,null,2)+'\n'));adopted.set('business-facts.json',Buffer.from('{"business":{"name":"Truthful Fixture","phone":"+359888123456","countryCode":"AE","currency":"AED"}}\n'));
 for(const [name,bytes]of adopted)write(dealerRoot,name,bytes);
 for(const [name,bytes]of filesAt(oldRepo))write(carsRoot,'templates/modern/'+name,bytes);
 git(carsRoot,['add','.']);git(carsRoot,['commit','-m','Preserved approved integration baseline fixture']);
 if(cloudflareParent){
  // Real tiny Git identities and original composer bytes; synthetic acceptance is test-only.
  const revision=git(carsRoot,['rev-parse','HEAD']),parent=f.releases.modern;
  const source={repository:'darkapoparka/cars',revision,path:'templates/modern',tree:git(carsRoot,['rev-parse',revision+':templates/modern']),digest:fingerprint(path.join(carsRoot,'templates/modern')).digest};
  Object.assign(parent,{repository:source.repository,commit:revision,source,snapshotPath:source.path,digest:source.digest});
  write(carsRoot,'clients/'+f.manifest.slug+'/source.json','{"syntheticFixture":true}\n');
  git(carsRoot,['add','clients']);git(carsRoot,['commit','-m','Synthetic compiled dealer source fixture']);
  const compiledCommit=git(carsRoot,['rev-parse','HEAD']),sourceReleases={...fixtureReleases(),modern:source};
  const bundle=writeTinySingleton(path.join(carsRoot,'runtime/tiny-cloudflare-proof'),{client:f.manifest.slug,sourceCommit:compiledCommit,sourceTree:git(carsRoot,['rev-parse',compiledCommit+':clients/'+f.manifest.slug]),sourceReleases});
  const prefix='docs/releases/qualification-cloudflare-parent/';
  const pin=(name,value)=>{const bytes=Buffer.isBuffer(value)?value:Buffer.from(JSON.stringify(value,null,2)+'\n');write(carsRoot,prefix+name,bytes);return {reference:prefix+name,sha256:sha(bytes)};};
  const refs={artifactManifest:pin('artifact-manifest.json',fs.readFileSync(path.join(bundle.directory,'artifact-manifest.json'))),singleWorkerReceipt:pin('single-worker-receipt.json',fs.readFileSync(path.join(bundle.directory,'single-worker-receipt.json')))};
  const common={...Object.fromEntries(['accountId','workerName','publicOrigin','sourceCommit','sourceTree','inputDigest','sourceReleases','outputDigest','workerCount','applicationCount'].map(name=>[name,bundle.receipt[name]])),artifactDigest:bundle.inventory.digest,serviceBindings:[],deploymentId:'11111111-1111-4111-8111-111111111111',versionId:'22222222-2222-4222-8222-222222222222',versionTraffic:[{version_id:'22222222-2222-4222-8222-222222222222',percentage:100}],liveBindings:[{type:'assets',name:'ASSETS'}],sourcePublication:{repository:'darkapoparka/cars',commit:compiledCommit,sourceTree:bundle.receipt.sourceTree,ref:'refs/heads/main',publishedAt:'2026-10-11T09:00:00Z',evidence:'Synthetic tiny Git main proof; never rollout acceptance',verifiedMainCommit:compiledCommit}};
  const deployed={...structuredClone(common),schemaVersion:1,type:'cars-existing-fleet-single-worker-deployment',status:'deployed',client:f.manifest.slug,runId:bundle.receipt.runId,attempt:bundle.receipt.attempt,deployments:1,hostedVerified:false,ownerAccepted:false,finishedAt:'2026-10-11T10:00:00Z'};
  refs.deploymentReceipt=pin('deployment.json',deployed);
  const acceptance={...structuredClone(parent.qa.nativeLocalization),repository:source.repository,commit:source.revision,sourcePath:source.path,sourceTree:source.tree,sourceDigest:source.digest,verifiedAt:'2026-10-11T10:02:00Z'};delete acceptance.deployment;
  const hosted={...structuredClone(common),schemaVersion:1,type:'cars-existing-fleet-single-worker-hosted-acceptance',status:'passed',client:f.manifest.slug,unauthenticated:true,verifiedAt:'2026-10-11T10:03:00Z',...refs,applications:Object.fromEntries(Object.entries(sourceReleases).map(([key,selected])=>[key,{status:'passed',source:selected,checks:['mounted-journeys','public-journeys','assets-preserved'].map(name=>({name,status:'passed',evidenceSha256:'d'.repeat(64)}))}])),nativeLocalization:Object.fromEntries(['auto-best','modern','import'].map(key=>{const selected=sourceReleases[key];return [key,{...structuredClone(acceptance),repository:selected.repository,commit:selected.revision,sourcePath:selected.path,sourceTree:selected.tree,sourceDigest:selected.digest}];}))};
  refs.hostedReceipt=pin('hosted.json',hosted);
  const deployment={...structuredClone(common),provider:'cloudflare',publicAlias:common.publicOrigin,...refs};delete deployment.publicOrigin;
  parent.qa.nativeLocalization={...acceptance,deployment};parent.qa.verifiedAt=acceptance.verifiedAt;
  writeJson(path.join(carsRoot,parent.qa.evidence),{schemaVersion:1,kind:'synthetic-original-QA',nativeLocalization:parent.qa.nativeLocalization,note:'Fixture only; not rollout acceptance'});
  writeJson(globalLock,approvedLock);
 }
 write(carsRoot,'templates/modern/packages/marketplace/fix.ts','export const fixed = true;\n');git(carsRoot,['add','.']);git(carsRoot,['commit','-m','Published fixed source fixture']);
 const sourceCommit=git(carsRoot,['rev-parse','HEAD']);git(carsRoot,['update-ref','refs/remotes/origin/main',sourceCommit]);
 const source={repository:'darkapoparka/cars',revision:sourceCommit,path:'templates/modern',tree:git(carsRoot,['rev-parse',sourceCommit+':templates/modern']),digest:fingerprint(path.join(carsRoot,'templates/modern')).digest};
 const directory=path.join(carsRoot,'docs/releases/qualification-fixture'),deltaFile=path.join(directory,'source-delta-review.json');
 const delta={schemaVersion:1,kind:'cars-source-delta-review',sourceCommit,reviewed:true,reviewedAt:'2026-10-11T09:00:00.000Z',nativeApproval:false,checks:[{name:'synthetic-focused-source-check',status:'passed',evidenceSha256:'a'.repeat(64)}],pendingNativeChecks:[...NATIVE_CHECKS]};writeJson(deltaFile,delta);
 const sourceDeltaReview={reference:'docs/releases/qualification-fixture/source-delta-review.json',sha256:sha(fs.readFileSync(deltaFile)),reviewedAt:delta.reviewedAt};
 const id='fixture-fixed-pilot',parent=f.releases.modern,candidateLock=structuredClone(approvedLock);
 candidateLock.templates.modern={status:'qualification',repository:source.repository,commit:sourceCommit,source,snapshotPath:source.path,digest:source.digest,
  qualification:{contextId:id,sourceQA:{approvedRelease:structuredClone(parent),releaseSha256:sha(JSON.stringify(parent)),reference:parent.qa.evidence,sha256:sha(fs.readFileSync(path.join(carsRoot,parent.qa.evidence))),verifiedAt:parent.qa.verifiedAt},sourceDeltaReview,catalogs:parent.qa.nativeLocalization.catalogs}};
 const lockFile=path.join(directory,'candidate-lock.json');writeJson(lockFile,candidateLock);
 const context={schemaVersion:1,kind:'cars-native-source-qualification-context',id,dealer:f.manifest.slug,scope:'existing-dealer-pilot',sourceCommit,reviewed:true,reviewedAt:delta.reviewedAt,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,approvedLockSha256:sha(fs.readFileSync(globalLock)),candidateLockSha256:sha(fs.readFileSync(lockFile)),sourceDeltaReview};
 const contextFile=path.join(directory,'context.json');writeJson(contextFile,context);
 return {root,carsRoot,dealerRoot,templateRoot,globalLock,lockFile,contextFile,deltaFile,context,candidateLock,manifest:f.manifest,configName,releases:f.releases};
}
const cli=args=>JSON.parse(execFileSync(process.execPath,[wrapper,...args],{encoding:'utf8'}));
function planArgs(f,name='plan'){return ['plan','--dealer-root',f.dealerRoot,'--cars-root',f.carsRoot,'--template-root',f.templateRoot,'--lock-file',f.lockFile,'--qualification',f.contextFile,'--variants','modern','--template-palette','--run-dir',path.join(f.carsRoot,'runtime',name)];}

test('alternate Cars root reaches original Cloudflare proofs through adoption, pin selection and CLI plan/install',async t=>{
 const f=await fixture(t,{cloudflareParent:true}),parent=f.releases.modern,originalLock=fs.readFileSync(f.globalLock);
 assert.notEqual(parent.commit,parent.qa.nativeLocalization.deployment.sourceCommit);
 const approvedManifest=structuredClone(f.manifest);approvedManifest.templateRevisions.modern=parent.commit;approvedManifest.templateSources.modern=parent.source;
 const adopted=adoptNativeSource(filesAt(f.dealerRoot),approvedManifest,f.releases,{root:f.carsRoot});
 assertNativeAdoption(adopted,approvedManifest,{root:f.carsRoot});
 assert.equal(existingFleetNativeSource(adopted,approvedManifest,{root:f.carsRoot}).kind,'approved-native-adoption');
 assert.throws(()=>existingFleetNativeSource(adopted,approvedManifest,{root:f.root}),/Missing path/);
 assert.throws(()=>adoptNativeSource(filesAt(f.dealerRoot),approvedManifest,f.releases,{root:f.root}),/Missing path/);
 const pins=selectPinnedRevisions(f.manifest,f.candidateLock,{keys:['modern'],qualification:f.context,root:f.carsRoot});assert.equal(pins.modern.to,f.context.sourceCommit);
 assert.throws(()=>selectPinnedRevisions(f.manifest,f.candidateLock,{keys:['modern'],qualification:f.context,root:f.root}),/Missing path/);
 const sixSources={...fixtureReleases(),modern:f.candidateLock.templates.modern.source};
 const sixManifest={...structuredClone(f.manifest),packaging:{version:'5'},variants:['auto-best','modern','import','app','mobile','karento-best'].map((key,index)=>({key,base:index?'/variant-'+(index+1):'',entry:key==='modern'?'/variant-2/cars':index?'/variant-'+(index+1)+'/':'/'})),templateSources:sixSources,templateRevisions:Object.fromEntries(Object.entries(sixSources).map(([key,source])=>[key,source.revision]))};
 const sixLock={schemaVersion:1,templates:Object.fromEntries(Object.entries(sixSources).map(([key,source])=>[key,key==='modern'?f.candidateLock.templates.modern:{status:'approved',repository:source.repository,commit:source.revision,source,snapshotPath:source.path,digest:source.digest}]))};
 const qualificationLockBytes=Buffer.from(JSON.stringify(sixLock,null,2)+'\n'),sixContext={...f.context,candidateLockSha256:sha(qualificationLockBytes)},qualificationBytes=Buffer.from(JSON.stringify(sixContext,null,2)+'\n');
 assert.equal(existingFleetQualifiedSources(sixManifest,sixContext,qualificationLockBytes,{root:f.carsRoot}).modern.revision,f.context.sourceCommit);
 assert.throws(()=>existingFleetQualifiedSources(sixManifest,sixContext,qualificationLockBytes,{root:f.root}),/Missing path/);
 const preparationOptions={manifest:sixManifest,qualificationBytes,qualificationLockBytes,sourceRevision:f.context.sourceCommit,candidateSourceDigest:sha('synthetic candidate'),root:f.carsRoot};
 assert.deepEqual(sourceQualificationFiles(preparationOptions).get('.client/native-qualification-lock.json'),qualificationLockBytes);
 assert.throws(()=>sourceQualificationFiles({...preparationOptions,root:f.root}),/Missing path/);
 const qualifiedManifest=structuredClone(f.manifest);qualifiedManifest.templateRevisions.modern=f.context.sourceCommit;qualifiedManifest.templateSources.modern=f.candidateLock.templates.modern.source;
 const qualified=adoptNativeQualification(filesAt(f.dealerRoot),qualifiedManifest,f.candidateLock.templates,f.context,{root:f.carsRoot});
 assertNativeQualification(qualified,qualifiedManifest,f.context,{root:f.carsRoot});
 const packageOptions={root:f.carsRoot,source:f.dealerRoot,destination:path.join(f.carsRoot,'runtime/package-plan'),manifest:approvedManifest,canonicalFiles:adopted,sourceCommit:f.context.sourceCommit};
 await planDealerPackage(packageOptions);await assert.rejects(planDealerPackage({...packageOptions,root:f.root}),/Missing path/);
 const planned=cli(planArgs(f,'alternate-root-plan'));assert.equal(planned.ready,true);
 const manifest=JSON.parse(fs.readFileSync(path.join(planned.candidateDirectory,'dealer.json')));
 assertNativeQualification(filesAt(planned.candidateDirectory),manifest,f.context,{root:f.carsRoot});
 const installed=cli(['install','--run-dir',planned.runDirectory]);assert.equal(installed.noOp,false);
 assertNativeQualification(filesAt(f.dealerRoot),manifest,f.context,{root:f.carsRoot});assert.deepEqual(fs.readFileSync(f.globalLock),originalLock);
 fs.appendFileSync(path.join(f.carsRoot,parent.qa.nativeLocalization.deployment.hostedReceipt.reference),' ');
 assert.throws(()=>selectPinnedRevisions(manifest,f.candidateLock,{keys:['modern'],qualification:f.context,root:f.carsRoot}),/original proof bytes differ/);
});

test('explicit qualification uses actual merge/adapt/palette/seal and install recomputation without changing global approval',async t=>{
 const f=await fixture(t),originalLock=fs.readFileSync(f.globalLock),sourceBefore=fingerprint(f.dealerRoot).digest,planned=cli(planArgs(f));
 assert.equal(planned.ready,true);assert.equal(fingerprint(f.dealerRoot).digest,sourceBefore);assert.deepEqual(fs.readFileSync(f.globalLock),originalLock);
 const files=filesAt(planned.candidateDirectory),manifest=JSON.parse(files.get('dealer.json')),receipt=assertNativeQualification(files,manifest,f.context);
 assert.equal(receipt.schemaVersion,2);assert.equal(receipt.nativeApproval,false);assert.equal(receipt.globalReleaseApproval,false);assert.deepEqual(receipt.pendingNativeChecks,NATIVE_CHECKS);
 assert.equal(receipt.releases.modern.status,'qualification');assert.equal(receipt.releases.modern.qualification.sourceQA.approvedRelease.commit,f.manifest.templateRevisions.modern);
 assert.equal(receipt.releases.modern.qa?.nativeLocalization,undefined);assert.throws(()=>validateNativeRelease('modern',receipt.releases.modern),/invalid selected release/);
 assert.throws(()=>assertNativeAdoption(files,manifest),/ordinary publication is refused/);
 await assert.rejects(planDealerPackage({source:planned.candidateDirectory,destination:path.join(f.carsRoot,'runtime/ordinary-package'),manifest,sourceCommit:f.context.sourceCommit}),/ordinary publication is refused/);
 assert.equal(fs.existsSync(path.join(f.carsRoot,'runtime/ordinary-package')),false);
 assert.match(files.get(f.configName).toString(),/accent: "#30343b", name: "Truthful Fixture"/);
 assert.equal(files.get('business-facts.json').toString(),fs.readFileSync(path.join(f.dealerRoot,'business-facts.json'),'utf8'));
 const metadata=JSON.parse(fs.readFileSync(path.join(planned.runDirectory,'run.json'))),review=JSON.parse(fs.readFileSync(path.join(planned.runDirectory,'review.json')));
 assert.deepEqual(review.nativeQualification,metadata.nativeQualification);assert.equal(metadata.qualification.sha256,sha(fs.readFileSync(f.contextFile)));
 const installed=cli(['install','--run-dir',planned.runDirectory]);assert.equal(installed.noOp,false);assertNativeQualification(filesAt(f.dealerRoot),manifest,f.context);assert.deepEqual(fs.readFileSync(f.globalLock),originalLock);
});

test('ordinary pin selection and updater refuse provisional locks without explicit qualification',async t=>{
 const f=await fixture(t);assert.throws(()=>selectPinnedRevisions(f.manifest,f.candidateLock,{keys:['modern']}),/No exact approved target/);
 const args=planArgs(f);args.splice(args.indexOf('--qualification'),2);const result=spawnSync(process.execPath,[wrapper,...args],{encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/No exact approved target/);assert.equal(fs.existsSync(path.join(f.carsRoot,'runtime/plan')),false);
});

test('published source qualification does not require advancing a preserved local integration baseline',async t=>{
 const f=await fixture(t);git(f.carsRoot,['update-ref','refs/heads/main',f.context.sourceCommit+'^']);
 const checked=validateDealerSourceQualification({carsRoot:f.carsRoot,dealer:f.manifest.slug,lockFile:f.lockFile,contextFile:f.contextFile});
 assert.equal(checked.sha256,sha(fs.readFileSync(f.contextFile)));assert.equal(cli(planArgs(f)).ready,true);
 git(f.carsRoot,['remote','set-url','origin','https://github.com/another-owner/cars.git']);
 assert.throws(()=>validateDealerSourceQualification({carsRoot:f.carsRoot,dealer:f.manifest.slug,lockFile:f.lockFile,contextFile:f.contextFile}),/registered Cars source repository/);
});

test('qualification rejects false approval, wrong parent review, source hash/tree and unpublished source before a candidate exists',async t=>{
 const f=await fixture(t),originalContext=structuredClone(f.context),originalLock=structuredClone(f.candidateLock),originalDelta=JSON.parse(fs.readFileSync(f.deltaFile));
 for(const [index,mutate]of [
  (context,lock)=>{context.nativeApproval=true;},
  (context,lock)=>{context.reviewed=false;},
  (context,lock)=>{context.dealer='another-dealer';},
  (context,lock)=>{delete lock.templates.carwow;},
  (context,lock)=>{lock.templates.modern.qa={nativeLocalization:lock.templates.modern.qualification.sourceQA.approvedRelease.qa.nativeLocalization};},
  (context,lock)=>{lock.templates.modern.source.tree='0'.repeat(40);},
  (context,lock)=>{lock.templates.modern.source.digest='0'.repeat(64);lock.templates.modern.digest='0'.repeat(64);},
  (context,lock)=>{lock.templates.modern.qualification.sourceQA.sha256='0'.repeat(64);},
  (context,lock)=>{lock.templates.modern.qualification.sourceQA.approvedRelease.qa.verifiedAt='2026-10-11T00:00:00Z';},
  (context,lock,delta)=>{delta.nativeApproval=true;},
  (context,lock,delta)=>{delta.checks[0].status='failed';}
 ].entries()){
  const context=structuredClone(originalContext),lock=structuredClone(originalLock),delta=structuredClone(originalDelta);mutate(context,lock,delta);
  writeJson(f.deltaFile,delta);context.sourceDeltaReview.sha256=sha(fs.readFileSync(f.deltaFile));lock.templates.modern.qualification.sourceDeltaReview=context.sourceDeltaReview;
  writeJson(f.lockFile,lock);context.candidateLockSha256=sha(fs.readFileSync(f.lockFile));writeJson(f.contextFile,context);
  const name='rejected-'+index,result=spawnSync(process.execPath,[wrapper,...planArgs(f,name)],{encoding:'utf8'});assert.notEqual(result.status,0,result.stdout);assert.equal(fs.existsSync(path.join(f.carsRoot,'runtime',name,'candidate')),false);
 }
 writeJson(f.deltaFile,originalDelta);writeJson(f.lockFile,originalLock);writeJson(f.contextFile,originalContext);
 git(f.carsRoot,['update-ref','-d','refs/remotes/origin/main']);const absent=spawnSync(process.execPath,[wrapper,...planArgs(f,'unpublished')],{encoding:'utf8'});assert.notEqual(absent.status,0);assert.match(absent.stderr,/not published/);
});

test('current catalogs, sealed bytes, exact context and changed review artifacts stay guarded',async t=>{
 const f=await fixture(t),planned=cli(planArgs(f)),files=filesAt(planned.candidateDirectory),manifest=JSON.parse(files.get('dealer.json'));
 const changed=new Map(files);changed.set(f.configName,Buffer.from('altered source'));assert.throws(()=>assertNativeQualification(changed,manifest,f.context),/source changed/);
 const catalogs=new Map(files);catalogs.set('modern/localization/bg.json',Buffer.from('{"title":"Only one key"}'));assert.throws(()=>assertNativeQualification(catalogs,manifest,f.context),/catalog keys differ/);
 assert.throws(()=>assertNativeQualification(files,manifest,{...f.context,id:'another-context'}),/identity\/context changed/);
 const receipt=JSON.parse(files.get('localization/adoption.json'));receipt.nativeApproval=true;const falseClaim=new Map(files);falseClaim.set('localization/adoption.json',Buffer.from(JSON.stringify(receipt)));assert.throws(()=>assertNativeQualification(falseClaim,manifest,f.context),/falsely claims/);
 fs.appendFileSync(f.contextFile,'\n');const result=spawnSync(process.execPath,[wrapper,'install','--run-dir',planned.runDirectory],{encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/qualification context changed/);assert.equal(fs.existsSync(path.join(planned.runDirectory,'rollback.json')),false);
});

test('explicit candidate finalizer reseals reviewed derived source while ordinary acceptance remains refused',async t=>{
 const f=await fixture(t),planned=cli(planArgs(f)),metadata=JSON.parse(fs.readFileSync(path.join(planned.runDirectory,'run.json'))),review=JSON.parse(fs.readFileSync(path.join(planned.runDirectory,'review.json')));
 const originalReview=fs.readFileSync(path.join(planned.runDirectory,'review.json')),candidate=planned.candidateDirectory;
 fs.appendFileSync(path.join(candidate,f.configName),'\n// Reviewed source overlay fixture, not rollout evidence.\n');
 const before=filesAt(candidate),manifest=JSON.parse(before.get('dealer.json'));assert.throws(()=>assertNativeQualification(before,manifest,f.context),/source changed/);
 const finalized=await finalizeDealerTemplateCandidate({plan:{...review,pins:metadata.pins,manifest},candidateDirectory:candidate,dealerRoot:f.dealerRoot,lock:f.candidateLock,carsRoot:f.carsRoot,qualification:f.context,refreshedAt:metadata.createdAt});
 assertNativeQualification(filesAt(candidate),manifest,f.context);assert.throws(()=>assertNativeAdoption(filesAt(candidate),manifest),/ordinary publication/);
 assert.notEqual(finalized.candidateDigest,metadata.candidateDigest);assert.deepEqual(fs.readFileSync(path.join(planned.runDirectory,'review.json')),originalReview);
});
