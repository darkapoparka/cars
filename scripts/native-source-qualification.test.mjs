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
import {adoptNativeSource} from './publishing/native-mounts.mjs';
import {selectPinnedRevisions} from './dealer-updates/three-way-upgrade.mjs';
import {finalizeDealerTemplateCandidate,validateDealerSourceQualification} from './dealer-updates/update-dealer-template.mjs';
import {planDealerPackage} from './package-dealer.mjs';

const sha=value=>createHash('sha256').update(value).digest('hex');
const wrapper=path.resolve(import.meta.dirname,'dealer-updates/update-dealer-template.mjs');
const git=(root,args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',env:{...process.env,GIT_AUTHOR_NAME:'Qualification test',GIT_AUTHOR_EMAIL:'test@example.invalid',GIT_COMMITTER_NAME:'Qualification test',GIT_COMMITTER_EMAIL:'test@example.invalid'}}).trim();
const write=(root,name,bytes)=>{const target=path.join(root,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);};
const writeJson=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');};
function filesAt(root){const result=new Map();function walk(current,relative=''){for(const entry of fs.readdirSync(current,{withFileTypes:true})){if(entry.name==='.git')continue;const name=relative?relative+'/'+entry.name:entry.name;if(entry.isDirectory())walk(path.join(current,entry.name),name);else if(entry.isFile())result.set(name,fs.readFileSync(path.join(current,entry.name)));}}walk(root);return result;}
function init(root,origin){fs.mkdirSync(root,{recursive:true});execFileSync('git',['init','--initial-branch=main',root],{stdio:'ignore'});git(root,['config','core.autocrlf','false']);git(root,['remote','add','origin',origin]);}
async function fixture(t){
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
 return {root,carsRoot,dealerRoot,templateRoot,globalLock,lockFile,contextFile,deltaFile,context,candidateLock,manifest:f.manifest,configName};
}
const cli=args=>JSON.parse(execFileSync(process.execPath,[wrapper,...args],{encoding:'utf8'}));
function planArgs(f,name='plan'){return ['plan','--dealer-root',f.dealerRoot,'--cars-root',f.carsRoot,'--template-root',f.templateRoot,'--lock-file',f.lockFile,'--qualification',f.contextFile,'--variants','modern','--template-palette','--run-dir',path.join(f.carsRoot,'runtime',name)];}

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
