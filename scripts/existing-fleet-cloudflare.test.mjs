import test from 'node:test';import assert from 'node:assert/strict';import path from 'node:path';import fs from 'node:fs';import {spawnSync} from 'node:child_process';import {buildMatrix,selectedDealer,outputBudget,existingFleetBranding,existingFleetNativeSource,QUALIFICATION_LOCK_PATH,fleetSourceMode,newApprovedFleetSource,readPinnedFleetInput} from './build-existing-fleet-cloudflare.mjs';
import {sha256,POLICY,fingerprint} from './lib/workflow.mjs';import {PUBLIC_ROOTS} from './publishing/lead-branding.mjs';
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
const jsonBytes=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
function fixtureGit(root,args,{binary=false,allowFailure=false}={}){
 const result=spawnSync('git',['-c','core.autocrlf=false','-c','commit.gpgsign=false','-C',root,...args],{encoding:binary?null:'utf8',windowsHide:true,env:{...process.env,GIT_CONFIG_NOSYSTEM:'1',GIT_NO_LAZY_FETCH:'1'}});
 if(result.status!==0){if(allowFailure)return null;throw Error(result.stderr?.toString()||'Fixture Git failed');}return binary?result.stdout:result.stdout.trimEnd();
}
function newApprovedFixture(t){
 const root=tinyArea(t),slug='new-sourced-cars',prefix='docs/releases/cloudflare-existing25-20261011/new-source/'+slug,write=(name,value)=>{const bytes=Buffer.isBuffer(value)?value:jsonBytes(value);fs.mkdirSync(path.dirname(path.join(root,name)),{recursive:true});fs.writeFileSync(path.join(root,name),bytes);return {path:name,sha256:sha256(bytes)};};
 fixtureGit(root,['init','-b','main']);fixtureGit(root,['config','user.email','fixture@example.invalid']);fixtureGit(root,['config','user.name','Fixture']);
 const commitAll=()=>{fixtureGit(root,['add','.']);fixtureGit(root,['commit','-m','Synthetic bounded source fixture']);return fixtureGit(root,['rev-parse','HEAD']);};
 const f=nativeFixture(path.join(root,'fixture-modern'),'modern',slug),other=nativeFixture(path.join(root,'fixture-import'),'import',slug);
 f.manifest.variants=planSixDesignSelection(f.manifest.variants).variants;f.manifest.packaging.version='5';f.manifest.dealerId='bg-varna-'+slug;f.manifest.localization={schemaVersion:1,dealerId:f.manifest.dealerId,defaultLocale:'bg',enabledLocales:['bg','en'],dealerCountry:'BG',inventoryCurrency:'EUR'};
 delete f.releases.carwow;for(const name of [...f.files.keys()])if(name.startsWith('carwow/'))f.files.delete(name);
 f.releases.import=other.releases.import;for(const [name,bytes]of other.files)if(name.startsWith('import/'))f.files.set(name,bytes);
 for(const key of ['app','mobile','karento-best']){f.releases[key]=structuredClone(f.releases['auto-best']);f.files.set(key+'/source.txt',Buffer.from('Synthetic native source '+key));for(const locale of ['en','bg'])f.files.set(key+'/localization/'+locale+'.json',jsonBytes({fixture:'Fixture {name}'}));}
 for(const [name,bytes]of f.files)write('templates/'+name,bytes);write('clients/index.json',{schemaVersion:2,projects:[],campaignCandidatesWithoutFolders:[]});const sourceRevision=commitAll();
 const sourceReleases={};for(const {key}of f.manifest.variants){const release=f.releases[key],source={repository:'darkapoparka/cars',revision:sourceRevision,path:'templates/'+key,tree:fixtureGit(root,['rev-parse',sourceRevision+':templates/'+key]),digest:fingerprint(path.join(root,'templates',key)).digest};sourceReleases[key]=source;Object.assign(release,{status:'approved',repository:source.repository,commit:sourceRevision,snapshotPath:source.path,digest:source.digest,exportPolicy:POLICY,source});Object.assign(release.qa.nativeLocalization,{repository:source.repository,commit:sourceRevision,sourcePath:source.path,sourceTree:source.tree,sourceDigest:source.digest});release.qa.nativeLocalization.deployment.sourceCommit=sourceRevision;}
 f.manifest.templateSources=sourceReleases;f.manifest.templateRevisions=Object.fromEntries(Object.keys(sourceReleases).map(k=>[k,sourceRevision]));delete f.manifest.templateRevisions.carwow;
 const workerName='friendly-cars',publicOrigin='https://'+workerName+'.darkapoparka1.workers.dev';f.manifest.cloudflare={workerPrefix:workerName};f.manifest.shareIdentity={publicOrigin};
 const originalRegistry={schemaVersion:2,dealers:[],aliases:{}},originalIndex={schemaVersion:2,projects:[],campaignCandidatesWithoutFolders:[]},lock={schemaVersion:1,exportPolicy:POLICY,templates:f.releases};
 const lockPin=write('templates.lock.json',lock),registryPin=write('docs/DEPLOYMENT-INVENTORY.json',originalRegistry),indexPin=write('clients/index.json',originalIndex);
 const facts={schemaVersion:1,slug,dealerId:f.manifest.dealerId,business:{name:'Synthetic Sourced Cars',city:'Varna',address:'Synthetic fixture address',sourceUrl:'https://example.invalid/dealer',observedAt:'2026-10-11',inventoryNotice:'Dated listing snapshot; confirm availability.',previewNotice:'Independent preview. Forms do not send messages.',logo:'/dealer-brand/logo-on-light.png',logoLight:'/dealer-brand/logo-on-light.png',logoDark:'/dealer-brand/logo-on-dark.png',countryCode:'BG',currency:'EUR',distanceUnit:'km',locale:'bg-BG'}};
 const stock={schemaVersion:1,dealer:slug,kind:'dated-listing-snapshot',records:[{id:'dated-1',title:'2021 Example Car',make:'Example',model:'Car',year:2021,currency:'EUR',priceAmount:12000,mileageOnRequest:true,images:['/dealer-stock/car.png'],sourceUrl:'https://example.invalid/listing/1',observedAt:'2026-10-11',availability:'Dated snapshot; confirm availability.'}]},branding={fixtureOnly:true};
 const inputs=Object.fromEntries(Object.entries({facts,stock,locale:f.manifest.localization,branding}).map(([key,value])=>[key,write(prefix+'/'+key+'.json',value)])),identityReview=write(prefix+'/identity.json',{schemaVersion:1,kind:'cars-new-dealer-identity-review',dealer:slug,dealerId:f.manifest.dealerId,repository:f.manifest.repository,sourceOwnership:'cars-canonical',reviewed:true,reviewedAt:'2026-10-11T12:00:00Z',existingIdentityFound:false,sources:[{url:'https://example.invalid/dealer',observedAt:'2026-10-11'}]});
 const photo=Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),Buffer.alloc(8)]),media=[{...write(prefix+'/car.png',photo),bytes:photo.length,destination:'dealer-stock/car.png'}];
 const original={slug,dealerId:f.manifest.dealerId,repository:f.manifest.repository,sourceOwnership:'cars-canonical',preset:'standard',workerName,publicOrigin,identityReview,sourceReleases,inputs,media},originalRequest={schemaVersion:1,kind:'cars-new-dealer-source-request',mode:'new-approved',reviewed:true,reviewedAt:'2026-10-11T12:00:00Z',sourceRevision,approvedLockSha256:lockPin.sha256,registrySha256:registryPin.sha256,clientIndexSha256:indexPin.sha256,dealers:[original]},originalPin=write(prefix+'/request.json',originalRequest),rawPin=write(prefix+'/original-stock.json',{sourceId:'dated-1',mileage:null,observedAt:'2026-10-11'}),mappingPin=write(prefix+'/input-mapping.json',{schemaVersion:1,kind:'cars-new-dealer-input-mapping',dealer:slug,inputs,sources:[rawPin],transformations:{stock:'Unknown source mileage preserved.'}}),baseCommit=commitAll(),baseRootTree=fixtureGit(root,['rev-parse','HEAD^{tree}']);
 f.files.set('business-facts.json',jsonBytes(facts));f.files.set('stock.json',jsonBytes(stock));f.files.set('locale.json',jsonBytes(f.manifest.localization));f.files.set('dealer-stock/car.png',photo);f.files.set('.cars-branding.json',jsonBytes(branding));f.files.set('dealer.json',jsonBytes(f.manifest));sealNativeAdoption(f.files,baseNativeManifest(f.manifest),f.releases);
 for(const [name,bytes]of f.files)write('clients/'+slug+'/'+name,bytes);const publicationCommit=commitAll(),preparedTree=fixtureGit(root,['rev-parse','HEAD:clients/'+slug]),entries=fixtureGit(root,['ls-tree','-rz','HEAD:clients/'+slug],{binary:true}).toString().split('\0').filter(Boolean).map(line=>{const at=line.indexOf('\t'),[mode,_type,blob]=line.slice(0,at).split(' '),name=line.slice(at+1),bytes=f.files.get(name);return {path:name,mode,blob,sha256:sha256(bytes),bytes:bytes.length};});
 const proposal={schemaVersion:1,kind:'cars-new-dealer-source-proposal',mode:'new-approved',dealer:slug,canonicalSourceRepository:'darkapoparka/cars',baseCommit,baseRootTree,absentPath:'clients/'+slug,preparedTree,sourceReleases,entries,reviewed:false,published:false,hostedApproval:false},proposalPin=write(prefix+'/source-patch.json',proposal);
 const prep={schemaVersion:1,kind:proposal.kind,mode:proposal.mode,dealer:slug,repository:f.manifest.repository,canonicalSourceRepository:'darkapoparka/cars',write:true,reviewed:false,published:false,buildApproval:false,hostedApproval:false,baseCommit,baseRootTree,preparedTree,sourceRevision,request:originalPin,approvedLockSha256:lockPin.sha256,inputs,identityReview,sourceReleases,sourcePaths:entries.length,patchSha256:proposalPin.sha256,branchAbsence:{digest:'d'.repeat(64),branches:1,absence:'normalized-dealer-folder-absent-on-current-origin-branches'},branding,nativeAdoptionSha256:sha256(f.files.get(ADOPTION_FILE))},preparationPin=write(prefix+'/source-preparation.json',prep),publication={schemaVersion:1,kind:'cars-new-dealer-source-publication',dealer:slug,dealerId:f.manifest.dealerId,repository:f.manifest.repository,sourceOwnership:'cars-canonical',reviewed:true,reviewedAt:'2026-10-11T12:01:00Z',request:originalPin,preparation:preparationPin,proposal:proposalPin,inputMapping:mappingPin,sourcePublication:{repository:'darkapoparka/cars',commit:publicationCommit,sourceTree:preparedTree,ref:'refs/heads/main',publishedAt:'2026-10-11T12:01:00Z',evidence:'Synthetic fixture publication; not fleet approval'}},publicationPin=write(prefix+'/source-publication.json',publication);
 const inventory={dealers:[{slug,id:f.manifest.dealerId,repository:f.manifest.repository,canonicalSourceRepository:'darkapoparka/cars',sourceOwnership:'cars-canonical',cloudflare:{workerName,publicOrigin},variants:f.manifest.variants}]},leads=[{slug,dealerId:f.manifest.dealerId,proposedRepository:f.manifest.repository,sourceMode:'new-approved',workerName,publicOrigin}],request={schemaVersion:1,mode:'new-approved',sourceRevision,dealers:[slug],newSources:[{slug,preparation:preparationPin,proposal:proposalPin,publication:publicationPin,inputMapping:mappingPin}]};
 write('docs/DEPLOYMENT-INVENTORY.json',inventory);write('clients/index.json',{schemaVersion:2,projects:[{slug,path:'clients/'+slug,leadId:f.manifest.dealerId,repository:f.manifest.repository}]});const commit=commitAll();
 return {...f,root,slug,commit,request,leads,inventory,workerName,publicOrigin,prep,publication,proposal,prefix,write,commitAll,options:{root,slug,commit,request,leads,inventory,manifest:f.manifest,files:f.files}};
}
test('legacy fleet mode preserves its seven-row matrix; unknown and adoption modes reject',()=>{
 const request={schemaVersion:1,dealers:['promosale-varna']};assert.equal(fleetSourceMode(request),'existing-migration');assert.deepEqual(buildMatrix(request,leads,registry),buildMatrix({...request,mode:'existing-migration'},leads,registry));
 for(const mode of ['new',null,'branch-adopt','research-adopt'])assert.throws(()=>buildMatrix({...request,mode},leads,registry),/Unsupported fleet source mode/);
});
test('new-approved requires explicit registered ownership, selection and complete source proof rows',t=>{
 const f=newApprovedFixture(t);assert.equal(buildMatrix(f.request,f.leads,f.inventory).include.length,7);
 for(const change of [x=>delete x.request.newSources,x=>x.request.sourceRevision='main',x=>x.request.newSources.push({...x.request.newSources[0]}),x=>x.request.newSources[0].publication.path='runtime/proof.json',x=>x.request.newSources[0].inputMapping.extra=true,x=>x.request.newSources[0].extra=true,x=>x.leads[0].sourceMode='research-adopt',x=>x.inventory.dealers[0].sourceOwnership='independent-repository',x=>x.leads[0].dealerId='wrong']){const x=structuredClone({request:f.request,leads:f.leads,inventory:f.inventory});change(x);assert.throws(()=>buildMatrix(x.request,x.leads,x.inventory),/New-approved source/);}
 const dealers=Array.from({length:25},(_,i)=>f.slug+'-'+i),request={...f.request,dealers,newSources:dealers.map(slug=>({...f.request.newSources[0],slug,...Object.fromEntries(['preparation','proposal','publication','inputMapping'].map(k=>[k,{...f.request.newSources[0][k],path:f.request.newSources[0][k].path.replace(f.slug,slug)}]))}))},selected=dealers.map(slug=>({...f.leads[0],slug})),inventory={dealers:dealers.map(slug=>({...f.inventory.dealers[0],slug}))};
 assert.equal(buildMatrix(request,selected,inventory).include.length,175);assert.throws(()=>buildMatrix({...request,dealers:[...dealers,'extra']},selected,inventory),/Invalid Cloudflare batch/);selected[24].sourceMode='existing-migration';assert.throws(()=>buildMatrix(request,selected,inventory),/explicit Cars-owned new selection/);
});
test('new-approved binds the exact published creator tree, original factual mapping and friendly Worker',async t=>{
 const f=newApprovedFixture(t),actual=await newApprovedFleetSource(f.options);assert.equal(actual.workerPrefix,'friendly-cars');assert.notEqual(actual.workerPrefix,f.manifest.repository.split('/')[1]);assert.equal(actual.sourceTree,f.prep.preparedTree);assert.equal(actual.creationBaseCommit,f.prep.baseCommit);assert.notEqual(f.commit,actual.sourcePublication.commit);assert.equal(actual.nativeSource.kind,'approved-native-adoption');assert.deepEqual(actual.inputMapping,f.request.newSources[0].inputMapping);assert.equal(JSON.parse(f.files.get('stock.json')).records[0].mileageOnRequest,true);
 for(const change of [x=>x.manifest.cloudflare.workerPrefix='renamed',x=>x.manifest.shareIdentity.publicOrigin='https://other.darkapoparka1.workers.dev',x=>x.leads[0].workerName='renamed',x=>x.inventory.dealers[0].cloudflare.publicOrigin='https://other.darkapoparka1.workers.dev',x=>x.manifest.templateSources.mobile.tree='e'.repeat(40),x=>x.inventory.dealers.push({slug:'same-source',aliases:[f.slug],repository:'darkapoparka/other'})]){const options={...f.options,manifest:structuredClone(f.manifest),leads:structuredClone(f.leads),inventory:structuredClone(f.inventory)};change(options);await assert.rejects(()=>newApprovedFleetSource(options));}
});
test('new-approved rejects changed facts/media/native bytes and qualification seals without fallback',async t=>{
 const f=newApprovedFixture(t);
 for(const [name,bytes]of [['stock.json',Buffer.from('{}')],['dealer-stock/car.png',Buffer.from('changed')],[ADOPTION_FILE,Buffer.from('{}')],['.cars-branding.json',Buffer.from('{}')],['scripts/unpublished.mjs',Buffer.from('extra source')],['.client/cloudflare-existing-source.json',Buffer.from('{}')]]){const files=new Map(f.files);files.set(name,bytes);await assert.rejects(()=>newApprovedFleetSource({...f.options,files}),/collected build bytes differ/);}
 await assert.rejects(()=>newApprovedFleetSource({...f.options,manifest:{...f.manifest,extraAssets:['unpublished-assets']}}),/build manifest differs/);
 const files=new Map(f.files),qualified={...JSON.parse(files.get(ADOPTION_FILE)),schemaVersion:2,kind:'cars-native-source-qualification'};files.set(ADOPTION_FILE,jsonBytes(qualified));const prep={...f.prep,nativeAdoptionSha256:sha256(files.get(ADOPTION_FILE))},preparation=f.write(f.prefix+'/source-preparation.json',prep);const row=f.request.newSources[0];row.preparation=preparation;row.publication=f.write(f.prefix+'/source-publication.json',{...f.publication,preparation});const commit=f.commitAll();await assert.rejects(()=>newApprovedFleetSource({...f.options,commit,files}),/collected build bytes differ/);
});
test('new-approved rejects stale publication trees, substituted receipt hashes and mapping evidence',async t=>{
 const f=newApprovedFixture(t),row=f.request.newSources[0];
 const request=structuredClone(f.request);request.newSources[0].preparation.sha256='f'.repeat(64);await assert.rejects(()=>newApprovedFleetSource({...f.options,request}),/physical input bytes differ/);
 f.write(f.prefix+'/original-stock.json',{sourceId:'altered'});await assert.rejects(()=>newApprovedFleetSource(f.options),/physical input bytes differ/);f.write(f.prefix+'/original-stock.json',{sourceId:'dated-1',mileage:null,observedAt:'2026-10-11'});
 f.write('clients/'+f.slug+'/stock.json',{changed:true});const commit=f.commitAll();await assert.rejects(()=>newApprovedFleetSource({...f.options,commit}),/published dealer tree changed/);
 assert.equal(row.proposal.sha256,f.prep.patchSha256);
});
test('committed fleet inputs reject physical aliases and uncommitted or duplicate-key proof bytes',async t=>{
 const f=newApprovedFixture(t),p=f.request.newSources[0].inputMapping;assert(readPinnedFleetInput(f.root,p,f.commit).length>0);const hidden=path.join(f.root,'runtime','linked');fs.mkdirSync(hidden);fs.writeFileSync(path.join(hidden,'proof.json'),jsonBytes({fixture:true}));fs.symlinkSync(hidden,path.join(f.root,f.prefix,'linked'),process.platform==='win32'?'junction':'dir');assert.throws(()=>readPinnedFleetInput(f.root,{path:f.prefix+'/linked/proof.json',sha256:sha256(jsonBytes({fixture:true}))},f.commit),/physical input link/);
 const duplicate=Buffer.from('{"reviewed":true,"reviewed":false}');f.request.newSources[0].publication=f.write(f.prefix+'/source-publication.json',duplicate);const commit=f.commitAll();await assert.rejects(()=>newApprovedFleetSource({...f.options,commit}),/duplicate/i);
});
