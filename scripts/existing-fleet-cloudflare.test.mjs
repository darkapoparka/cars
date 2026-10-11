import test from 'node:test';import assert from 'node:assert/strict';import path from 'node:path';import {buildMatrix,selectedDealer,outputBudget,existingFleetBranding,existingFleetNativeSource} from './build-existing-fleet-cloudflare.mjs';
import {sha256} from './lib/workflow.mjs';import {PUBLIC_ROOTS} from './publishing/lead-branding.mjs';
import {nativeFixture} from './test-fixtures/native-source.mjs';import {tinyArea} from './test-fixtures/fleet-single-worker.mjs';import {sealNativeQualification,sealNativeAdoption,ADOPTION_FILE} from './lib/native-localization.mjs';
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
test('conservative Free output budget',()=>{assert.throws(()=>outputBudget([{path:'big',bytes:26*1024**2}],[]));assert.throws(()=>outputBudget([],[{path:'main',compressedBytes:4*1024**2}]));});
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
test('compilation validates a qualified pilot context and current native seal, while ordinary sources need approved adoption',t=>{
 const f=nativeFixture(path.join(tinyArea(t),'native')),parent=structuredClone(f.releases.modern),context={schemaVersion:1,kind:'cars-native-source-qualification-context',id:'fixture-pilot',dealer:f.manifest.slug,scope:'existing-dealer-pilot',sourceCommit:'9'.repeat(40),reviewed:true,reviewedAt:'2026-10-11T10:00:00Z',nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,approvedLockSha256:'a'.repeat(64),candidateLockSha256:'b'.repeat(64),sourceDeltaReview:{reference:'docs/releases/synthetic-delta.json',sha256:'c'.repeat(64),reviewedAt:'2026-10-11T10:00:00Z'}};
 const approved=sealNativeAdoption(f.files,f.manifest,f.releases);assert.equal(existingFleetNativeSource(f.files,f.manifest).kind,'approved-native-adoption');assert.equal(approved.schemaVersion,1);
 parent.qa.evidence='docs/releases/synthetic-parent.json';parent.qa.verifiedAt='2026-10-10T00:00:00Z';
 f.manifest.templateSources=Object.fromEntries(f.manifest.variants.map(({key})=>[key,{repository:f.releases[key].repository,revision:f.releases[key].commit,path:'',digest:f.releases[key].digest}]));
 const source={repository:'darkapoparka/cars',revision:context.sourceCommit,path:'templates/modern',tree:'8'.repeat(40),digest:'7'.repeat(64)};f.manifest.templateRevisions.modern=context.sourceCommit;f.manifest.templateSources.modern=source;
 f.releases.modern={status:'qualification',repository:source.repository,commit:source.revision,digest:source.digest,source,snapshotPath:source.path,qualification:{contextId:context.id,sourceQA:{approvedRelease:parent,releaseSha256:sha256(JSON.stringify(parent)),reference:parent.qa.evidence,sha256:'d'.repeat(64),verifiedAt:parent.qa.verifiedAt},sourceDeltaReview:context.sourceDeltaReview,catalogs:parent.qa.nativeLocalization.catalogs}};
 sealNativeQualification(f.files,f.manifest,f.releases,context);
 const bytes=Buffer.from(JSON.stringify(context)),candidate={schemaVersion:1,dealer:f.manifest.slug,kind:'personalized-source-candidate-not-an-approved-release',sourceRevision:context.sourceCommit,sourceDeltaReview:context.sourceDeltaReview,qualificationContextPath:'.client/native-qualification-context.json',qualificationContextSha256:sha256(bytes),nativeApproval:false,hostedApproval:false};
 assert.equal(existingFleetNativeSource(f.files,f.manifest,{candidate,qualificationBytes:bytes}).kind,'native-source-qualification');
 assert.throws(()=>existingFleetNativeSource(f.files,f.manifest),/explicit pinned/i);assert.throws(()=>existingFleetNativeSource(f.files,f.manifest,{candidate:{...candidate,nativeApproval:true},qualificationBytes:bytes}),/explicit pinned/i);
 assert.throws(()=>existingFleetNativeSource(f.files,f.manifest,{candidate,qualificationBytes:Buffer.from(JSON.stringify({...context,reviewed:false}))}),/explicit pinned/i);
 const changed=new Map(f.files);changed.set('modern/apps/web/proxy.ts',Buffer.from('changed source'));assert.throws(()=>existingFleetNativeSource(changed,f.manifest,{candidate,qualificationBytes:bytes}),/source changed/);
 const forged=new Map(f.files),receipt=JSON.parse(forged.get(ADOPTION_FILE));receipt.nativeApproval=true;forged.set(ADOPTION_FILE,Buffer.from(JSON.stringify(receipt)));assert.throws(()=>existingFleetNativeSource(forged,f.manifest,{candidate,qualificationBytes:bytes}),/falsely claims/);
});
