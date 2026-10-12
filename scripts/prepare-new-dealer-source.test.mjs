import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {nativeInputDigest} from './lib/native-localization.mjs';
import {sha256,POLICY} from './lib/workflow.mjs';
import {gitObjectId,gitTreeId} from './prepare-existing-fleet-source.mjs';
import {NEW_SOURCE_INPUT_ROOT,NEW_SOURCE_REQUEST_KIND,NEW_SOURCE_FAMILIES,validateNewSourceCopyReview,newSourceReviewedCopy,validateNewSourceRequest,validateNewDealerFacts,readNewSourceInput,validateNewSourceRaster,assertNewSourceCiContext,validateNewSourceBranchAbsence,createNewSourceProposal,verifyNewSourceProposal,prepareNewDealerSource} from './prepare-new-dealer-source.mjs';

const revision='a'.repeat(40),digest='b'.repeat(64),tree='c'.repeat(40),clone=v=>structuredClone(v),enc=v=>Buffer.from(JSON.stringify(v)+'\n');
function fixture(){
 const sourceReleases=Object.fromEntries(NEW_SOURCE_FAMILIES.map(key=>[key,{repository:'darkapoparka/cars',revision,path:'templates/'+key,tree,digest}]));
 const lock={schemaVersion:1,exportPolicy:POLICY,templates:Object.fromEntries(NEW_SOURCE_FAMILIES.map(key=>[key,{status:'approved',repository:'darkapoparka/cars',commit:revision,snapshotPath:'templates/'+key,digest,exportPolicy:POLICY,source:clone(sourceReleases[key])}]))};
 const registry={schemaVersion:2,dealers:[],aliases:{}},clientIndex={schemaVersion:2,projects:[],campaignCandidatesWithoutFolders:[]},slug='new-sourced-cars',prefix=NEW_SOURCE_INPUT_ROOT+'/'+slug,pin=name=>({path:prefix+'/'+name+'.json',sha256:digest});
 const dealer={slug,dealerId:'bg-varna-new-sourced-cars',repository:'darkapoparka/new-sourced-cars',sourceOwnership:'cars-canonical',preset:'standard',workerName:'cars-new-sourced-cars',publicOrigin:'https://cars-new-sourced-cars.darkapoparka1.workers.dev',identityReview:pin('identity'),sourceReleases,inputs:Object.fromEntries(['facts','stock','locale','branding'].map(k=>[k,pin(k)])),media:[{path:prefix+'/car.png',sha256:digest,bytes:64,destination:'dealer-stock/car.png'}]};
 const inventories={registry,clientIndex,lock,lockSha256:sha256(enc(lock)),registrySha256:sha256(enc(registry)),clientIndexSha256:sha256(enc(clientIndex)),occupiedSlugs:[]};
 const request={schemaVersion:1,kind:NEW_SOURCE_REQUEST_KIND,mode:'new-approved',reviewed:true,reviewedAt:'2026-10-11T12:00:00Z',sourceRevision:revision,approvedLockSha256:inventories.lockSha256,registrySha256:inventories.registrySha256,clientIndexSha256:inventories.clientIndexSha256,dealers:[dealer]};
 const facts={schemaVersion:1,slug,dealerId:dealer.dealerId,business:{name:'New Sourced Cars',city:'Varna',address:'Reviewed showroom address',sourceUrl:'https://example.com/dealer',observedAt:'2026-10-11',inventoryNotice:'Dated listing snapshot; confirm availability.',previewNotice:'Independent preview. Forms do not send messages.',logo:'/dealer-brand/logo-on-light.png',logoLight:'/dealer-brand/logo-on-light.png',logoDark:'/dealer-brand/logo-on-dark.png',countryCode:'BG',currency:'EUR',distanceUnit:'km',locale:'bg-BG'}};
 const locale={schemaVersion:1,dealerId:dealer.dealerId,defaultLocale:'bg',enabledLocales:['bg','en'],dealerCountry:'BG',inventoryCurrency:'EUR'};
 const stock={schemaVersion:1,dealer:slug,kind:'dated-listing-snapshot',records:[{id:'dated-1',title:'2021 Example Car',make:'Example',model:'Car',year:2021,currency:'EUR',priceAmount:12000,mileageValue:45000,mileageUnit:'km',images:['/dealer-stock/car.png'],sourceUrl:'https://example.com/listing/1',observedAt:'2026-10-11',availability:'Dated sample; confirm availability.'}]};
 const identityReview={schemaVersion:1,kind:'cars-new-dealer-identity-review',dealer:slug,dealerId:dealer.dealerId,repository:dealer.repository,sourceOwnership:'cars-canonical',reviewed:true,reviewedAt:'2026-10-11T12:00:00Z',existingIdentityFound:false,sources:[{url:'https://example.com/dealer',observedAt:'2026-10-11'}]};
 return {request,inventories,dealer,facts,stock,locale,identityReview,sourceReleases};
}
const factsInput=f=>({dealer:f.dealer,facts:f.facts,stock:f.stock,locale:f.locale,identityReview:f.identityReview});
function temp(t){const base=fs.realpathSync(os.tmpdir()),directory=fs.mkdtempSync(path.join(base,'cars-new-source-test-'));t.after(()=>{const full=fs.realpathSync(directory),relative=path.relative(base,full);assert(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative));fs.rmSync(full,{recursive:true,force:true});});return directory;}
function proposalFixture(){const f=fixture(),original=Buffer.from('#!/bin/sh\necho reviewed\n'),sameBytes=Buffer.from('new personalized fact\n'),binary=Buffer.from([0,255,100,0]),blob=gitObjectId('blob',original);const reusableBlobs=new Map([[blob,{repository:'darkapoparka/cars',revision,path:'templates/auto-best/scripts/retained.sh',blob,sha256:sha256(original),bytes:original.length}]]);const required=['dealer.json','AGENTS.md','CLIENT.md','stock.json','localization/contract.json','localization/adoption.json','.cars-branding.json','.cars-app.json','.cars-mobile.json','.cars-signature.json',...NEW_SOURCE_FAMILIES.flatMap(k=>[k+'/package.json',k+'/AGENTS.md',k+'/.template/source-manifest.json',k+'/.client/project.json'])],files=new Map([['auto-best/scripts/retained.sh',original],['business-facts.json',sameBytes],['locale.json',sameBytes],['branding/logo.png',binary],...required.map(n=>[n,sameBytes])]),modes=new Map([['auto-best/scripts/retained.sh','100755']]);const proposal=createNewSourceProposal({dealer:f.dealer.slug,baseCommit:revision,baseRootTree:tree,sourceReleases:f.sourceReleases,files,modes,reusableBlobs});return {...proposal,reusableBlobs,original,sameBytes,binary};}

test('reviewed new-approved request binds all six exact Cars sources and inventory bytes',()=>{const f=fixture();assert.equal(validateNewSourceRequest(f.request,f.inventories),f.request);assert.equal(validateNewDealerFacts(factsInput(f)).records,1);const imported=clone(f.request);imported.dealers[0].preset='import';assert.equal(validateNewSourceRequest(imported,f.inventories).dealers[0].preset,'import');});
test('unknown mode, extra source, missing family, unapproved source and changed source/tree reject',()=>{for(const change of [f=>f.request.mode='existing-qualified',f=>f.request.fakeReady=true,f=>delete f.dealer.sourceReleases.mobile,f=>f.dealer.sourceReleases.carwow=f.dealer.sourceReleases.import,f=>f.inventories.lock.templates.app.status='qualification',f=>f.dealer.sourceReleases.import.tree='d'.repeat(40),f=>f.dealer.sourceReleases.modern.repository='darkapoparka/cars-template-modern']){const f=fixture();change(f);assert.throws(()=>validateNewSourceRequest(f.request,f.inventories));}});
test('exact inventory and lock pins cannot drift; a second dealer cannot collide by normalized identity/repository/Worker',()=>{for(const field of ['approvedLockSha256','registrySha256','clientIndexSha256']){const f=fixture();f.request[field]='e'.repeat(64);assert.throws(()=>validateNewSourceRequest(f.request,f.inventories),/bytes changed/);}const f=fixture();const other=clone(f.dealer);other.slug='new-sourcedcars';f.request.dealers.push(other);assert.throws(()=>validateNewSourceRequest(f.request,f.inventories),/Duplicate/);});
test('existing aliases, manifest-less folders, branch sources, research candidates and independent identities reject',()=>{for(const occupied of [f=>f.inventories.registry.aliases['new-sourcedcars']='old',f=>f.inventories.occupiedSlugs=['new-sourcedcars'],f=>f.inventories.registry.dealers=[{slug:f.dealer.slug,branchSources:[{branch:'codex/old'}]}],f=>f.inventories.clientIndex.campaignCandidatesWithoutFolders=[{slug:f.dealer.slug}],f=>f.inventories.registry.dealers=[{slug:'other',sourceOwnership:'independent-repository',repository:f.dealer.repository}],f=>f.dealer.sourceOwnership='independent-repository']){const f=fixture();occupied(f);assert.throws(()=>validateNewSourceRequest(f.request,f.inventories));}});
test('bounded media pins reject traversal, duplicate destinations, invalid byte counts and unreviewed fact/branding paths',()=>{for(const change of [f=>f.dealer.media[0].path=NEW_SOURCE_INPUT_ROOT+'/../secrets.png',f=>f.dealer.media[0].bytes=Infinity,f=>f.dealer.media[0].bytes=25*1024**2+1,f=>f.dealer.media.push({...f.dealer.media[0],path:f.dealer.media[0].path+'.copy'}),f=>f.dealer.inputs.branding.path='runtime/branding.json',f=>f.dealer.media[0].destination='auto-best/package.json']){const f=fixture();change(f);assert.throws(()=>validateNewSourceRequest(f.request,f.inventories));}});
test('country, currency, identity, locale and source date remain explicit factual inputs',()=>{for(const change of [f=>f.facts.dealerId='wrong',f=>f.identityReview.existingIdentityFound=true,f=>f.identityReview.reviewed=false,f=>f.facts.business.currency='USD',f=>f.locale.dealerId='wrong',f=>f.locale.enabledLocales=['bg'],f=>f.facts.business.observedAt='unknown',f=>f.stock.records[0].year=undefined,f=>f.stock.records[0].currency='USD',f=>f.stock.records[0].sourceUrl='https://u:p@example.com',f=>f.stock.records[0].images=['https://example.com/unretained.jpg'],f=>f.facts.vehicles=[]]){const f=fixture();change(f);assert.throws(()=>validateNewDealerFacts(factsInput(f)));}});
test('unknown prices/mileage stay unknown; alternate normalized facts never manufacture values',()=>{const f=fixture(),car=f.stock.records[0];delete car.priceAmount;car.priceOnRequest=true;delete car.mileageValue;delete car.mileageUnit;car.mileageOnRequest=true;assert.equal(validateNewDealerFacts(factsInput(f)).records,1);for(const field of ['priceUsd','sourcePrice','mileageKm','km','thumbnail']){const broken=clone(f);broken.stock.records[0][field]=1;assert.throws(()=>validateNewDealerFacts(factsInput(broken)));}});
test('illustrative source mode requires the exact visible not-dealer-stock disclosure',()=>{const f=fixture();f.stock.kind='illustrative-not-dealer-stock';assert.throws(()=>validateNewDealerFacts(factsInput(f)),/Illustrative/);f.stock.dealerStock=false;f.stock.disclosure='Illustrative samples, not dealer stock.';f.facts.business.inventoryNotice=f.stock.disclosure;assert.equal(validateNewDealerFacts(factsInput(f)).inventoryKind,f.stock.kind);});
test('physical input bytes/hash/size are checked and paths cannot escape through files or junctions',t=>{const directory=temp(t),prefix=NEW_SOURCE_INPUT_ROOT+'/new-sourced-cars',name=prefix+'/facts.json',file=path.join(directory,name),bytes=Buffer.from('{"actual":"reviewed"}\n');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);const pin={path:name,sha256:sha256(bytes)};assert(readNewSourceInput(directory,pin,{prefix}).bytes.equals(bytes));assert.throws(()=>readNewSourceInput(directory,{...pin,sha256:digest},{prefix}),/bytes differ/);assert.throws(()=>readNewSourceInput(directory,pin,{prefix,maxBytes:2}),/bounded/);assert.throws(()=>readNewSourceInput(directory,{...pin,path:prefix+'/../facts.json'},{prefix}),/Bounded/);const hidden=path.join(directory,'runtime');fs.mkdirSync(hidden);fs.writeFileSync(path.join(hidden,'facts.json'),bytes);fs.symlinkSync(hidden,path.join(directory,prefix,'linked'),process.platform==='win32'?'junction':'dir');assert.throws(()=>readNewSourceInput(directory,{path:prefix+'/linked/facts.json',sha256:sha256(bytes)},{prefix}),/physical link/);});
test('reviewed stock file names cannot disguise non-raster bytes',()=>{assert.throws(()=>validateNewSourceRaster(Buffer.from('{"fake":"photo"}'),'car.png'),/extension/);const png=Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),Buffer.alloc(8)]);assert.equal(validateNewSourceRaster(png,'car.png'),png);assert.throws(()=>validateNewSourceRaster(png,'car.webp'),/extension/);});
test('GitHub runner requires real synchronized main event lease; drift and provider credentials reject',()=>{const checkout={head:revision,remoteHead:revision},env={GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'push',GITHUB_REPOSITORY:'darkapoparka/cars',GITHUB_REF:'refs/heads/main',GITHUB_SHA:revision,GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'1'};assert.equal(assertNewSourceCiContext({env,checkout,platform:'linux'}).commit,revision);for(const override of [{GITHUB_REF:'refs/heads/codex/demo'},{GITHUB_SHA:'d'.repeat(40)},{GITHUB_REPOSITORY:'darkapoparka/other'},{GITHUB_EVENT_NAME:'workflow_dispatch'},{CF_API_TOKEN:'fixture-non-secret'}])assert.throws(()=>assertNewSourceCiContext({env:{...env,...override},checkout,platform:'linux'}));assert.throws(()=>assertNewSourceCiContext({env,checkout:{head:revision,remoteHead:'d'.repeat(40)},platform:'linux'}),/synchronized/);});
test('unregistered preserved branch identities reject and authoritative branch inventory is bounded',()=>{const input={dealer:'new-sourced-cars',mainCommit:revision,branches:[{ref:'refs/heads/main',commit:revision,clients:['existing']},{ref:'refs/heads/codex/preserved',commit:'d'.repeat(40),clients:['another']}]};assert.equal(validateNewSourceBranchAbsence(input).branches,2);const collision=clone(input);collision.branches[1].clients=['NewSourcedCars'];assert.throws(()=>validateNewSourceBranchAbsence(collision),/preserved branch/);const advanced=clone(input);advanced.branches[0].commit='e'.repeat(40);assert.throws(()=>validateNewSourceBranchAbsence(advanced),/lease/);assert.throws(()=>validateNewSourceBranchAbsence({...input,branches:Array.from({length:257},()=>input.branches[0])}),/Bounded/);const changed=clone(input);changed.branches[1].commit='e'.repeat(40);assert.notEqual(validateNewSourceBranchAbsence(changed).digest,validateNewSourceBranchAbsence(input).digest);});
test('source proposal reuses canonical Git blobs, deduplicates new bytes and preserves executable modes/tree',()=>{const p=proposalFixture();assert.equal(p.patch.reusedGitBlobs.length,1);assert.equal(p.blobs.size,2);assert.equal(p.patch.uniqueBlobBytes,p.sameBytes.length+p.binary.length);assert.equal(p.patch.entries.find(r=>r.path.endsWith('retained.sh')).mode,'100755');assert.equal(p.patch.preparedTree,gitTreeId(p.patch.entries));assert.equal(verifyNewSourceProposal(p),p.patch);assert.equal(p.patch.published,false);assert.equal(p.patch.hostedApproval,false);});
test('source proposal rejects altered bytes/modes/tree, false acceptance and foreign or changed reusable refs',()=>{for(const alter of [p=>p.patch.published=true,p=>p.patch.preparedTree='e'.repeat(40),p=>p.patch.entries[0].mode='120000',p=>p.patch.entries[0].path='../escape',p=>p.patch.reusedGitBlobs[0].repository='darkapoparka/other',p=>p.patch.reusedGitBlobs[0].revision='e'.repeat(40),p=>p.patch.reusedGitBlobs[0].sha256='e'.repeat(64),p=>p.blobs.values().next().value.content='altered',p=>delete p.patch.sourceReleases.app]){const p=proposalFixture();alter(p);assert.throws(()=>verifyNewSourceProposal(p));}});
test('a correct tree hash cannot conceal an omitted application or mandatory source seal',()=>{for(const name of ['app/package.json','mobile/package.json','.cars-branding.json','localization/adoption.json']){const p=proposalFixture();p.patch.entries=p.patch.entries.filter(r=>r.path!==name);p.patch.preparedTree=gitTreeId(p.patch.entries);assert.throws(()=>verifyNewSourceProposal(p),/Six application/);}});
test('proposal case aliases and files excluded by the ordinary publisher reject',()=>{const f=fixture();for(const name of ['auto-best/node_modules/unsafe.js','.git/config','auto-best/.env'])assert.throws(()=>createNewSourceProposal({dealer:f.dealer.slug,baseCommit:revision,baseRootTree:tree,sourceReleases:f.sourceReleases,files:new Map([[name,Buffer.from('fixture')]])}));assert.throws(()=>createNewSourceProposal({dealer:f.dealer.slug,baseCommit:revision,baseRootTree:tree,sourceReleases:f.sourceReleases,files:new Map([['Branding/a.png',Buffer.from('a')],['branding/a.png',Buffer.from('b')]])}),/Case/);});
test('read-only request boundary rejects duplicate JSON keys before any client or runtime is created',async t=>{const directory=temp(t),requestFile=NEW_SOURCE_INPUT_ROOT+'/request.json',file=path.join(directory,requestFile);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,'{"mode":"new-approved","mode":"existing-qualified"}');await assert.rejects(()=>prepareNewDealerSource({root:directory,requestFile,dealer:'new-sourced-cars'}),/duplicate/i);assert.equal(fs.existsSync(path.join(directory,'clients')),false);assert.equal(fs.existsSync(path.join(directory,'runtime')),false);});
test('CLI help is read-only and the production wrapper exposes no checkout/copier override',()=>{const helper=fileURLToPath(new URL('./prepare-new-dealer-source.mjs',import.meta.url)),source=fs.readFileSync(helper,'utf8');assert(source.includes('const plan=planNewClient({root,client:row.slug'));assert(source.includes('creation=await createNewClient(plan)'));assert(!/prepareNewDealerSource\(\{[^}]*\b(?:readGit|platform|copy|config)\s*[=,}]/.test(source));const result=spawnSync(process.execPath,[helper,'--help'],{encoding:'utf8',windowsHide:true});assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/Default read-only/);});

function branchCapacityFixture(count) {
 const mainCommit='a'.repeat(40);
 return {dealer:'new-sourced-cars',mainCommit,branches:Array.from({length:count},(_,i)=>({
  ref:i===0?'refs/heads/main':'refs/heads/preserved-'+i,commit:mainCommit,clients:['unrelated-'+i]
 }))};
}
test('complete unique origin inventories at 128, 139 and 256 preserve every branch in the absence proof',()=>{
 for(const count of [128,139,256]) {
  const input=branchCapacityFixture(count),before=JSON.stringify(input);
  const proof=validateNewSourceBranchAbsence(input);
  assert.equal(proof.branches,count);assert.equal(JSON.stringify(input),before);
  assert.equal(proof.digest,validateNewSourceBranchAbsence({...input,branches:[...input.branches].reverse()}).digest);
  const changed=clone(input);changed.branches[count-1].commit='b'.repeat(40);
  assert.notEqual(proof.digest,validateNewSourceBranchAbsence(changed).digest);
 }
});
test('257 unique heads reject without shortening the inventory',()=>{
 const input=branchCapacityFixture(257),before=JSON.stringify(input);
 assert.throws(()=>validateNewSourceBranchAbsence(input),/Bounded/);assert.equal(JSON.stringify(input),before);
});
test('duplicate, missing-main and malformed head proofs reject within the enlarged limit',()=>{
 const duplicate=branchCapacityFixture(139);duplicate.branches[138].ref=duplicate.branches[137].ref;
 assert.throws(()=>validateNewSourceBranchAbsence(duplicate),/duplicate/);
 const truncated=branchCapacityFixture(139);truncated.branches.shift();
 assert.throws(()=>validateNewSourceBranchAbsence(truncated),/lease/);
 const malformed=branchCapacityFixture(139);malformed.branches[138].ref='refs/heads/preserved bad';
 assert.throws(()=>validateNewSourceBranchAbsence(malformed),/Invalid/);
});
test('target in the final preserved branch and unchanged folder bounds still reject',()=>{
 const target=branchCapacityFixture(256);target.branches[255].clients=['NewSourcedCars'];
 assert.throws(()=>validateNewSourceBranchAbsence(target),/preserved branch/);
 const many=branchCapacityFixture(256);for(const row of many.branches)row.clients=Array.from({length:129},(_,i)=>'unrelated-'+i);
 assert.throws(()=>validateNewSourceBranchAbsence(many),/lease/);
 const perBranch=branchCapacityFixture(139);perBranch.branches[138].clients=Array.from({length:4097},(_,i)=>'unrelated-'+i);
 assert.throws(()=>validateNewSourceBranchAbsence(perBranch),/Invalid/);
});

test('dated companion copy binds exact stock bytes, source identity and native image alts without changing stock facts',()=>{
 const f=fixture(),stock={records:[{id:'source-1',sourceId:'source-1',description:'Датирана извадка от публикувана обява.'}]};
 const review={schemaVersion:1,kind:'cars-new-source-reviewed-companion-copy',dealer:f.dealer.slug,reviewed:true,
   reviewedAt:'2026-10-12T00:00:00Z',stockSha256:f.dealer.inputs.stock.sha256,
   descriptions:[{sourceId:'source-1',sourceDescription:stock.records[0].description,en:'Dated sample; confirm availability directly.',bg:stock.records[0].description}]};
 const before=JSON.stringify(stock);validateNewSourceCopyReview(review,f.dealer,stock);
 const profile={listings:[{slug:'native-slug',sourceId:'source-1',description:stock.records[0].description,images:[{alt:'Original vehicle image'}]}]};
 const copy=newSourceReviewedCopy(profile,review);assert.equal(copy['native-slug'].en.description,review.descriptions[0].en);
 assert.deepEqual(copy['native-slug'].bg.imageAlts,['Original vehicle image']);assert.equal(JSON.stringify(stock),before);
 for(const changed of [{...review,stockSha256:'9'.repeat(64)},{...review,descriptions:[{...review.descriptions[0],sourceId:'other'}]},{...review,unknown:true}])
   assert.throws(()=>validateNewSourceCopyReview(changed,f.dealer,stock));
 assert.throws(()=>newSourceReviewedCopy({listings:[{...profile.listings[0],sourceId:'other'}]},review),/identity changed/);
 assert.equal(newSourceReviewedCopy(profile,null),undefined);
});

test('personalized creator metadata is finalized before native receipt sealing',()=>{
 const manifest={variants:[{key:'app'}]},before=new Map([['app/.client/project.json',Buffer.from('{"state":"needs-personalization"}')]]);
 const oldDigest=nativeInputDigest(before,manifest).digest;
 before.set('app/.client/project.json',Buffer.from('{"state":"personalized-needs-build","readyToPublish":false}'));
 assert.notEqual(nativeInputDigest(before,manifest).digest,oldDigest,'native receipt binds creator metadata too');
 const source=fs.readFileSync(fileURLToPath(new URL('./prepare-new-dealer-source.mjs',import.meta.url)),'utf8');
 const finalized=source.indexOf("state:'personalized-needs-build'"),collect=source.indexOf('await regenerateDealerCatalogs(directory,root,manifest.variants.map(v=>v.key))'),seal=source.indexOf('files=qualified?adoptNativeQualification');
 assert(finalized>=0&&finalized<collect&&collect<seal,'actual source producer collects final metadata before either native seal');
 assert.equal(source.lastIndexOf("state:'personalized-needs-build'"),finalized,'no later metadata rewrite invalidates the seal');
});
