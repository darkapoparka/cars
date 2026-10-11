import test from 'node:test';import assert from 'node:assert/strict';import path from 'node:path';import {buildMatrix,selectedDealer,outputBudget,existingFleetBranding,existingFleetNativeSource,QUALIFICATION_LOCK_PATH} from './build-existing-fleet-cloudflare.mjs';
import {sha256} from './lib/workflow.mjs';import {PUBLIC_ROOTS} from './publishing/lead-branding.mjs';
import {nativeFixture} from './test-fixtures/native-source.mjs';import {tinyArea} from './test-fixtures/fleet-single-worker.mjs';import {sealNativeQualification,sealNativeAdoption,ADOPTION_FILE} from './lib/native-localization.mjs';
import {baseNativeManifest} from './publishing/app-variant.mjs';import {planSixDesignSelection} from './lib/six-design-release.mjs';
const leads=[{slug:'promosale-varna',proposedRepository:'darkapoparka/cars-promosalevarna'}];
const registry={dealers:[{slug:'promosale-varna',repository:'darkapoparka/cars-promosalevarna'}]};
test('six applications and one router',()=>{const m=buildMatrix({schemaVersion:1,dealers:['promosale-varna']},leads,registry);assert.equal(m.include.length,7);assert.equal(new Set(m.include.map(x=>x.key)).size,7);});
test('unknown and duplicate dealers fail closed',()=>{for(const dealers of [['unknown'],['promosale-varna','promosale-varna']])assert.throws(()=>buildMatrix({schemaVersion:1,dealers},leads,registry));});
test('Excellent Cars and Day and Night use exact registered repositories',()=>{
 for(const [slug,repository]of [['excellent-cars','darkapoparka/excellent-cars'],['day-and-night-auto-group','darkapoparka/day-and-night-autodeal']]){
  assert.equal(selectedDealer(slug,[{slug,proposedRepository:repository}],{dealers:[{slug,repository}]}).proposedRepository,repository);
  assert.throws(()=>selectedDealer(slug,[{slug,proposedRepository:'darkapoparka/cars-invented'}],{dealers:[{slug,repository}]}),/registry/);
 }
});
test('selected allowlist, registry uniqueness and all seven targets are mandatory',()=>{
 assert.throws(()=>buildMatrix({schemaVersion:1,dealers:['promosale-varna'],targets:['modern']},leads,registry),/seven/);
 assert.throws(()=>selectedDealer('promosale-varna',[],registry),/Unregistered/);
 assert.throws(()=>selectedDealer('promosale-varna',leads,{dealers:[...registry.dealers,...registry.dealers]}),/Unregistered/);
});
test('Worker budget uses measured uncompressed bytes and retains gzip only as a metric',()=>{
 const limit=64*1024**2,output=outputBudget([],[{path:'main',bytes:limit-1,compressedBytes:4*1024**2},{path:'auxiliary',bytes:1,compressedBytes:20}]);
 assert.equal(output.workerBytes,limit);assert.equal(output.workerCompressedBytes,4*1024**2+20);assert.equal(output.workerModules,2);
 assert.throws(()=>outputBudget([],[{path:'main',bytes:limit,compressedBytes:1},{path:'auxiliary',bytes:1,compressedBytes:1}]),/uncompressed Worker size exceeded/);
});
test('Free asset count and per-file boundaries remain enforced',()=>{
 const modules=[{path:'main',bytes:1,compressedBytes:20}],assets=Array.from({length:20000},()=>({path:'tiny',bytes:1}));
 assert.equal(outputBudget(assets,modules).assetFiles,20000);
 assert.equal(outputBudget([{path:'largest',bytes:25*1024**2}],modules).assetBytes,25*1024**2);
 assert.throws(()=>outputBudget([...assets,{path:'extra',bytes:1}],modules),/asset limit exceeded/);
 assert.throws(()=>outputBudget([{path:'oversize',bytes:25*1024**2+1}],modules),/asset limit exceeded/);
});
test('missing, nonfinite and invalid byte measurements fail closed',()=>{
 const valid={path:'main',bytes:1,compressedBytes:20};
 for(const value of [undefined,null,NaN,Infinity,-Infinity,-1,0.5,'1',Number.MAX_SAFE_INTEGER+1]){
  assert.throws(()=>outputBudget([],[{...valid,bytes:value}]),/Invalid measured/);
  assert.throws(()=>outputBudget([],[{...valid,compressedBytes:value}]),/Invalid measured/);
  assert.throws(()=>outputBudget([{path:'asset',bytes:value}],[valid]),/Invalid measured/);
 }
 for(const modules of [undefined,null,{},[],[null],new Array(1),[{path:'main',compressedBytes:20}]])assert.throws(()=>outputBudget([],modules),/Invalid measured/);
 for(const assets of [undefined,null,{},[null],new Array(1),[{path:'asset'}]])assert.throws(()=>outputBudget(assets,[valid]),/Invalid measured/);
 assert.throws(()=>outputBudget([],[{...valid,bytes:Number.MAX_SAFE_INTEGER},{...valid,bytes:1}]),/Invalid measured.*totals/);
});
test('mandatory branding validates the source-bound derived pack, not optional staging originals',()=>{
 const manifest={slug:'fixture-dealer',branding:{required:true},templateSources:{modern:{revision:'a'.repeat(40)}},variants:[{key:'app',base:'/variant-4'}]},files=new Map(),publicBase='/dealer-brand/v2-fixture';
 const names=['logo-on-light.png','logo-on-light.webp','mark-on-light.webp','logo-on-dark.png','logo-on-dark.webp','mark-on-dark.webp','logo-on-accent.webp','app-icon.png','apple-touch-icon.png','favicon.ico'];
 const assets=Object.entries(PUBLIC_ROOTS).flatMap(([key,root])=>names.map(name=>{const path=root+publicBase.slice(1)+'/'+name,bytes=Buffer.from('derived-'+key+'-'+name);files.set(path,bytes);return {key,path,sha256:sha256(bytes)};}));
 files.set('app/lib/dealer.json',Buffer.from(JSON.stringify({logo:{light:publicBase+'/logo-on-light.webp',dark:publicBase+'/logo-on-dark.webp',icon:publicBase+'/app-icon.png'}})));
 files.set('modern/packages/marketplace/lead-site.ts',Buffer.from('// LEAD_SITE_CONFIG_START\naccent: "#123456"'));
 files.set('business-facts.json',Buffer.from('{"fixture":true}'));
 const contract={schemaVersion:1,dealer:manifest.slug,policy:'template-default',packId:'fixture',publicBase,monochromePairFromOneMaster:true,creationMethod:'image-generation-derived-raster',assets,
  consumerReferences:[{path:'app/lib/dealer.json',urls:[publicBase+'/logo-on-light.webp']}],palette:{checks:[{path:'modern/packages/marketplace/lead-site.ts',field:'accent',value:'#123456',sourceRevision:manifest.templateSources.modern.revision}]},facts:{'business-facts.json':sha256(files.get('business-facts.json'))}};
 files.set('.cars-branding.json',Buffer.from(JSON.stringify(contract)));
 // Staging originals may intentionally differ from resized production aliases.
 files.set('branding/logo-contract.json',Buffer.from('{"originalSha256":"staging-only"}'));
 assert.equal(existingFleetBranding(files,manifest).packId,'fixture');
 assert.throws(()=>existingFleetBranding(files,{...manifest,branding:{required:false}}),/mandatory/);
 files.set(assets[0].path,Buffer.from('changed public bytes'));assert.throws(()=>existingFleetBranding(files,manifest),/asset missing or changed/);
 files.set(assets[0].path,Buffer.from('derived-auto-best-logo-on-light.png'));
 files.set('modern/packages/marketplace/lead-site.ts',Buffer.from('// LEAD_SITE_CONFIG_START\naccent: "#654321"'));assert.throws(()=>existingFleetBranding(files,manifest),/palette override/);
});
function qualifiedFixture(t){
 const area=tinyArea(t),f=nativeFixture(path.join(area,'native')),other=nativeFixture(path.join(area,'opposite'),'import'),context={schemaVersion:1,kind:'cars-native-source-qualification-context',id:'fixture-pilot',dealer:f.manifest.slug,scope:'existing-dealer-pilot',sourceCommit:'9'.repeat(40),reviewed:true,reviewedAt:'2026-10-11T10:00:00Z',nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,approvedLockSha256:'a'.repeat(64),candidateLockSha256:'b'.repeat(64),sourceDeltaReview:{reference:'docs/releases/synthetic-delta.json',sha256:'c'.repeat(64),reviewedAt:'2026-10-11T10:00:00Z'}};
 f.manifest.variants=planSixDesignSelection(f.manifest.variants).variants;f.manifest.packaging.version='5';
 delete f.releases.carwow;delete f.manifest.templateRevisions.carwow;f.releases.import=other.releases.import;f.manifest.templateRevisions.import=other.manifest.templateRevisions.import;
 for(const [name,bytes]of other.files)if(name.startsWith('import/'))f.files.set(name,bytes);
 for(const [i,key]of ['app','mobile','karento-best'].entries()){
  f.releases[key]={status:'approved',repository:'darkapoparka/cars-template-'+key,commit:String(i+4).repeat(40),digest:String(i+4).repeat(64),qa:{evidence:'docs/releases/synthetic-'+key+'.json',verifiedAt:'2026-10-10T00:00:00Z'}};
  f.manifest.templateRevisions[key]=f.releases[key].commit;f.files.set(key+'/source.txt',Buffer.from('synthetic '+key));
 }
 f.manifest.templateSources=Object.fromEntries(f.manifest.variants.map(({key})=>[key,{repository:f.releases[key].repository,revision:f.releases[key].commit,path:'',digest:f.releases[key].digest}]));
 for(const key of ['modern','app','mobile','karento-best']){
  const parent=structuredClone(f.releases[key]);parent.qa.evidence??='docs/releases/synthetic-parent.json';parent.qa.verifiedAt??='2026-10-10T00:00:00Z';
  const source={repository:'darkapoparka/cars',revision:context.sourceCommit,path:'templates/'+key,tree:'8'.repeat(40),digest:'7'.repeat(64)};f.manifest.templateRevisions[key]=source.revision;f.manifest.templateSources[key]=source;
  f.releases[key]={status:'qualification',repository:source.repository,commit:source.revision,digest:source.digest,source,snapshotPath:source.path,qualification:{contextId:context.id,sourceQA:{approvedRelease:parent,releaseSha256:sha256(JSON.stringify(parent)),reference:parent.qa.evidence,sha256:'d'.repeat(64),verifiedAt:parent.qa.verifiedAt},sourceDeltaReview:context.sourceDeltaReview,catalogs:parent.qa.nativeLocalization?.catalogs||[]}};
 }
 const bind=()=>{const qualificationLockBytes=Buffer.from(JSON.stringify({schemaVersion:1,templates:f.releases},null,2)+'\r\n');context.candidateLockSha256=sha256(qualificationLockBytes);sealNativeQualification(f.files,baseNativeManifest(f.manifest),f.releases,context);const qualificationBytes=Buffer.from(JSON.stringify(context)),candidate={schemaVersion:1,dealer:f.manifest.slug,kind:'personalized-source-candidate-not-an-approved-release',sourceRevision:context.sourceCommit,sourceDeltaReview:context.sourceDeltaReview,qualificationContextPath:'.client/native-qualification-context.json',qualificationContextSha256:sha256(qualificationBytes),qualificationLockPath:QUALIFICATION_LOCK_PATH,qualificationLockSha256:sha256(qualificationLockBytes),nativeApproval:false,hostedApproval:false};return {candidate,qualificationBytes,qualificationLockBytes};};
 return {...f,context,bind,options:bind()};
}
test('ordinary approved adoption remains independent of qualification-only files',t=>{
 const f=nativeFixture(path.join(tinyArea(t),'native')),receipt=sealNativeAdoption(f.files,f.manifest,f.releases);
 assert.equal(receipt.schemaVersion,1);assert.equal(existingFleetNativeSource(f.files,f.manifest).kind,'approved-native-adoption');
});
test('compilation validates the full reviewed six-source lock and current native seal',t=>{
 const f=qualifiedFixture(t),actual=existingFleetNativeSource(f.files,f.manifest,f.options);
 assert.equal(actual.kind,'native-source-qualification');assert.equal(Object.keys(actual.sourceReleases).length,6);assert.equal(actual.qualificationLockSha256,f.context.candidateLockSha256);
 assert.throws(()=>existingFleetNativeSource(f.files,f.manifest),/explicit pinned/i);
 assert.throws(()=>existingFleetNativeSource(f.files,f.manifest,{...f.options,candidate:{...f.options.candidate,nativeApproval:true}}),/explicit pinned/i);
 assert.throws(()=>existingFleetNativeSource(f.files,f.manifest,{...f.options,qualificationBytes:Buffer.from(JSON.stringify({...f.context,reviewed:false}))}),/explicit pinned/i);
 const falseApprovalBytes=Buffer.from(JSON.stringify({...f.context,nativeApproval:true}));
 assert.throws(()=>existingFleetNativeSource(f.files,f.manifest,{...f.options,qualificationBytes:falseApprovalBytes,candidate:{...f.options.candidate,qualificationContextSha256:sha256(falseApprovalBytes)}}),/explicit reviewed.*qualification context/i);
 const changed=new Map(f.files);changed.set('modern/apps/web/proxy.ts',Buffer.from('changed source'));assert.throws(()=>existingFleetNativeSource(changed,f.manifest,f.options),/source changed/);
 const forged=new Map(f.files),receipt=JSON.parse(forged.get(ADOPTION_FILE));receipt.nativeApproval=true;forged.set(ADOPTION_FILE,Buffer.from(JSON.stringify(receipt)));assert.throws(()=>existingFleetNativeSource(forged,f.manifest,f.options),/falsely claims/);
});
test('App, Mobile and Signature source tuples cannot drift outside the reviewed lock',t=>{
 const f=qualifiedFixture(t);
 for(const key of ['app','mobile','karento-best'])for(const field of ['repository','revision','path','tree','digest']){
  const manifest=structuredClone(f.manifest);manifest.templateSources[key][field]=field==='revision'||field==='tree'?'6'.repeat(40):field==='digest'?'6'.repeat(64):'different';
  if(field==='revision')manifest.templateRevisions[key]=manifest.templateSources[key].revision;
  assert.throws(()=>existingFleetNativeSource(f.files,manifest,f.options),new RegExp(key+': selected source differs|Invalid recorded old template source for '+key));
 }
});
test('extended families require genuine qualification proofs even when their bytes and selected tuples are sealed',t=>{
 const f=qualifiedFixture(t);
 for(const key of ['app','mobile','karento-best']){
  const prior=f.releases[key].qualification.sourceQA.releaseSha256;f.releases[key].qualification.sourceQA.releaseSha256='f'.repeat(64);
  assert.throws(()=>existingFleetNativeSource(f.files,f.manifest,f.bind()),new RegExp(key+':.*approved source QA parent'));
  f.releases[key].qualification.sourceQA.releaseSha256=prior;
 }
});
test('raw reviewed qualification lock substitution, omission and alternate marker paths fail closed',t=>{
 const f=qualifiedFixture(t);
 for(const options of [{...f.options,qualificationLockBytes:undefined},{...f.options,qualificationLockBytes:Buffer.concat([f.options.qualificationLockBytes,Buffer.from(' ' )])},{...f.options,candidate:{...f.options.candidate,qualificationLockSha256:'f'.repeat(64)}},{...f.options,candidate:{...f.options.candidate,qualificationLockPath:'.client/unreviewed-lock.json'}}])assert.throws(()=>existingFleetNativeSource(f.files,f.manifest,options),/reviewed qualification lock/);
});
