import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {refreshNormalizeInternals} from './lib/client-refresh-normalize.mjs';
import {refreshAdapterInternals} from './lib/client-refresh-adapters.mjs';
import {buildModernDealerInventoryCopy} from './lib/modern-dealer-inventory-copy.mjs';
import {nativeInputDigest} from './lib/native-localization.mjs';
import {sha256,POLICY} from './lib/workflow.mjs';
import {gitObjectId,gitTreeId} from './prepare-existing-fleet-source.mjs';
import {preflightNewSourceModern,preflightNewSourceImport,assertNewSourceCreatorStagingAbsent,newSourceCreationReceiptPin,validateNewSourceCreationSummary,validateNewSourceResumeOptions,NEW_SOURCE_ORCHESTRATION_PATHS} from './prepare-new-dealer-source.mjs';
import {regenerateDealerCatalogs} from './dealer-updates/update-dealer-template.mjs';
import {NEW_SOURCE_INPUT_ROOT,NEW_SOURCE_REQUEST_KIND,NEW_SOURCE_FAMILIES,validateNewSourceCopyReview,newSourceReviewedCopy,validateNewSourceRequest,validateNewDealerFacts,readNewSourceInput,validateNewSourceRaster,assertNewSourceCiContext,validateNewSourceBranchAbsence,createNewSourceProposal,verifyNewSourceProposal,prepareNewDealerSource,assertCurrentNewSourceIdentity,newSourceCurrentLeasePaths,assertCurrentNewSourceInputs} from './prepare-new-dealer-source.mjs';

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
 const stock={schemaVersion:1,dealer:slug,kind:'dated-listing-snapshot',records:[{id:'dated-1',title:'2021 Example Car',make:'Example',model:'Car',year:2021,currency:'EUR',priceAmount:12000,mileageValue:45000,mileageUnit:'km',transmission:'manual',images:['/dealer-stock/car.png'],sourceUrl:'https://example.com/listing/1',observedAt:'2026-10-11',availability:'Dated sample; confirm availability.'}]};
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
test('accepted unknown stock facts hold Modern adaptation before writing invented offers',t=>{
 const file=path.join(temp(t),'mock-data.ts'),source='export const mockListings: VehicleListing[] = [\n  {\n    id: "native-id"\n  }\n];\n';
 for(const [country,currency,unit] of [['AE','AED','km'],['US','USD','mi'],['BG','EUR','km']])for(const field of ['price','mileage','transmission']){
  const f=fixture(),car=f.stock.records[0];Object.assign(f.facts.business,{countryCode:country,currency,distanceUnit:unit,locale:'en-'+country});Object.assign(f.locale,{dealerCountry:country,inventoryCurrency:currency,defaultLocale:'en'});Object.assign(car,{currency,mileageUnit:unit});
  if(field==='price'){delete car.priceAmount;car.priceOnRequest=true;}
  if(field==='mileage'){delete car.mileageValue;delete car.mileageUnit;car.mileageOnRequest=true;}
  if(field==='transmission')delete car.transmission;
  assert.equal(validateNewDealerFacts(factsInput(f)).records,1,'source retains the explicit unknown');
  const before=JSON.stringify(f.stock),business=refreshNormalizeInternals.normalizeBusiness('/unused',f.dealer.slug,f.facts),listing=refreshNormalizeInternals.normalizeListing(car,0,business),profile={slug:f.dealer.slug,business,listings:[listing]};
  fs.writeFileSync(file,source);
  assert.throws(()=>refreshAdapterInternals.replaceModernListings(file,profile),error=>error.code==='MODERN_FACTS_REQUIRE_REVIEW'&&error.fields.length===1&&error.fields[0]===field,country+' '+field);
  assert.equal(fs.readFileSync(file,'utf8'),source,'unsupported input must not partially rewrite the selected source');assert.equal(JSON.stringify(f.stock),before);
 }
});
test('known stock facts and an explicitly published zero mileage keep their Modern representation',()=>{
 for(const [country,currency,unit] of [['AE','AED','km'],['US','USD','mi'],['BG','EUR','km']])for(const value of [0,45000]){
  const f=fixture(),car=f.stock.records[0];Object.assign(f.facts.business,{countryCode:country,currency,distanceUnit:unit,locale:'en-'+country});Object.assign(f.locale,{dealerCountry:country,inventoryCurrency:currency,defaultLocale:'en'});Object.assign(car,{currency,mileageUnit:unit,mileageValue:value});assert.equal(validateNewDealerFacts(factsInput(f)).records,1);
  const business=refreshNormalizeInternals.normalizeBusiness('/unused',f.dealer.slug,f.facts),listing=refreshNormalizeInternals.normalizeListing(car,0,business),before=JSON.stringify(listing),row=refreshAdapterInternals.modernListing(listing,0,'native-id',{slug:f.dealer.slug,business});
  assert.equal(row.price.amount,car.priceAmount);assert.equal(row.price.currency,currency);assert.equal(row.priceType,'fixed');assert.equal(row.spec.mileageValue,unit==='mi'?Math.round(value*1.609344):value);assert.equal(row.spec.transmission,'manual');assert.equal(JSON.stringify(listing),before);
 }
});
test('illustrative source mode requires the exact visible not-dealer-stock disclosure',()=>{const f=fixture();f.stock.kind='illustrative-not-dealer-stock';assert.throws(()=>validateNewDealerFacts(factsInput(f)),/Illustrative/);f.stock.dealerStock=false;f.stock.disclosure='Illustrative samples, not dealer stock.';f.facts.business.inventoryNotice=f.stock.disclosure;assert.equal(validateNewDealerFacts(factsInput(f)).inventoryKind,f.stock.kind);});
test('physical input bytes/hash/size are checked and paths cannot escape through files or junctions',t=>{const directory=temp(t),prefix=NEW_SOURCE_INPUT_ROOT+'/new-sourced-cars',name=prefix+'/facts.json',file=path.join(directory,name),bytes=Buffer.from('{"actual":"reviewed"}\n');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);const pin={path:name,sha256:sha256(bytes)};assert(readNewSourceInput(directory,pin,{prefix}).bytes.equals(bytes));assert.throws(()=>readNewSourceInput(directory,{...pin,sha256:digest},{prefix}),/bytes differ/);assert.throws(()=>readNewSourceInput(directory,pin,{prefix,maxBytes:2}),/bounded/);assert.throws(()=>readNewSourceInput(directory,{...pin,path:prefix+'/../facts.json'},{prefix}),/Bounded/);const hidden=path.join(directory,'runtime');fs.mkdirSync(hidden);fs.writeFileSync(path.join(hidden,'facts.json'),bytes);fs.symlinkSync(hidden,path.join(directory,prefix,'linked'),process.platform==='win32'?'junction':'dir');assert.throws(()=>readNewSourceInput(directory,{path:prefix+'/linked/facts.json',sha256:sha256(bytes)},{prefix}),/physical link/);});
test('reviewed stock file names cannot disguise non-raster bytes',()=>{assert.throws(()=>validateNewSourceRaster(Buffer.from('{"fake":"photo"}'),'car.png'),/extension/);const png=Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),Buffer.alloc(8)]);assert.equal(validateNewSourceRaster(png,'car.png'),png);assert.throws(()=>validateNewSourceRaster(png,'car.webp'),/extension/);});
test('GitHub runner requires real synchronized main event lease; drift and provider credentials reject',()=>{const checkout={head:revision,remoteHead:revision},env={GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'push',GITHUB_REPOSITORY:'darkapoparka/cars',GITHUB_REF:'refs/heads/main',GITHUB_SHA:revision,GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'1'};assert.equal(assertNewSourceCiContext({env,checkout,platform:'linux'}).commit,revision);for(const override of [{GITHUB_REF:'refs/heads/codex/demo'},{GITHUB_SHA:'d'.repeat(40)},{GITHUB_REPOSITORY:'darkapoparka/other'},{GITHUB_EVENT_NAME:'workflow_dispatch'},{CF_API_TOKEN:'fixture-non-secret'}])assert.throws(()=>assertNewSourceCiContext({env:{...env,...override},checkout,platform:'linux'}));assert.throws(()=>assertNewSourceCiContext({env,checkout:{head:revision,remoteHead:'d'.repeat(40)},platform:'linux'}),/synchronized/);});
test('unregistered preserved branch identities reject and authoritative branch inventory is bounded',()=>{const input={dealer:'new-sourced-cars',mainCommit:revision,branches:[{ref:'refs/heads/main',commit:revision,clients:['existing']},{ref:'refs/heads/codex/preserved',commit:'d'.repeat(40),clients:['another']}]};assert.equal(validateNewSourceBranchAbsence(input).branches,2);const collision=clone(input);collision.branches[1].clients=['NewSourcedCars'];assert.throws(()=>validateNewSourceBranchAbsence(collision),/preserved branch/);const advanced=clone(input);advanced.branches[0].commit='e'.repeat(40);assert.throws(()=>validateNewSourceBranchAbsence(advanced),/lease/);assert.throws(()=>validateNewSourceBranchAbsence({...input,branches:Array.from({length:257},()=>input.branches[0])}),/Bounded/);const changed=clone(input);changed.branches[1].commit='e'.repeat(40);assert.notEqual(validateNewSourceBranchAbsence(changed).digest,validateNewSourceBranchAbsence(input).digest);assert.equal(validateNewSourceBranchAbsence(changed).leaseDigest,validateNewSourceBranchAbsence(input).leaseDigest);assert.notEqual(validateNewSourceBranchAbsence({...input,dealer:'different-new-dealer'}).leaseDigest,validateNewSourceBranchAbsence(input).leaseDigest);});
test('source proposal reuses canonical Git blobs, deduplicates new bytes and preserves executable modes/tree',()=>{const p=proposalFixture();assert.equal(p.patch.reusedGitBlobs.length,1);assert.equal(p.blobs.size,2);assert.equal(p.patch.uniqueBlobBytes,p.sameBytes.length+p.binary.length);assert.equal(p.patch.entries.find(r=>r.path.endsWith('retained.sh')).mode,'100755');assert.equal(p.patch.preparedTree,gitTreeId(p.patch.entries));assert.equal(verifyNewSourceProposal(p),p.patch);assert.equal(p.patch.published,false);assert.equal(p.patch.hostedApproval,false);});
test('source proposal rejects altered bytes/modes/tree, false acceptance and foreign or changed reusable refs',()=>{for(const alter of [p=>p.patch.published=true,p=>p.patch.preparedTree='e'.repeat(40),p=>p.patch.entries[0].mode='120000',p=>p.patch.entries[0].path='../escape',p=>p.patch.reusedGitBlobs[0].repository='darkapoparka/other',p=>p.patch.reusedGitBlobs[0].revision='e'.repeat(40),p=>p.patch.reusedGitBlobs[0].sha256='e'.repeat(64),p=>p.blobs.values().next().value.content='altered',p=>delete p.patch.sourceReleases.app]){const p=proposalFixture();alter(p);assert.throws(()=>verifyNewSourceProposal(p));}});
test('a correct tree hash cannot conceal an omitted application or mandatory source seal',()=>{for(const name of ['app/package.json','mobile/package.json','.cars-branding.json','localization/adoption.json']){const p=proposalFixture();p.patch.entries=p.patch.entries.filter(r=>r.path!==name);p.patch.preparedTree=gitTreeId(p.patch.entries);assert.throws(()=>verifyNewSourceProposal(p),/Six application/);}});
test('proposal case aliases and files excluded by the ordinary publisher reject',()=>{const f=fixture();for(const name of ['auto-best/node_modules/unsafe.js','.git/config','auto-best/.env'])assert.throws(()=>createNewSourceProposal({dealer:f.dealer.slug,baseCommit:revision,baseRootTree:tree,sourceReleases:f.sourceReleases,files:new Map([[name,Buffer.from('fixture')]])}));assert.throws(()=>createNewSourceProposal({dealer:f.dealer.slug,baseCommit:revision,baseRootTree:tree,sourceReleases:f.sourceReleases,files:new Map([['Branding/a.png',Buffer.from('a')],['branding/a.png',Buffer.from('b')]])}),/Case/);});
test('read-only request boundary rejects duplicate JSON keys before any client or runtime is created',async t=>{const directory=temp(t),requestFile=NEW_SOURCE_INPUT_ROOT+'/request.json',file=path.join(directory,requestFile);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,'{"mode":"new-approved","mode":"existing-qualified"}');await assert.rejects(()=>prepareNewDealerSource({root:directory,requestFile,dealer:'new-sourced-cars'}),/duplicate/i);assert.equal(fs.existsSync(path.join(directory,'clients')),false);assert.equal(fs.existsSync(path.join(directory,'runtime')),false);});
test('CLI help is read-only and the production wrapper exposes no checkout/copier override',()=>{const helper=fileURLToPath(new URL('./prepare-new-dealer-source.mjs',import.meta.url)),source=fs.readFileSync(helper,'utf8');assert(source.includes('const plan=planNewClient({root,client:row.slug'));assert(source.includes('creation=await createNewClient(plan,{mutationWriter})'));assert(!/prepareNewDealerSource\(\{[^}]*\b(?:readGit|platform|copy|config)\s*[=,}]/.test(source));const result=spawnSync(process.execPath,[helper,'--help'],{encoding:'utf8',windowsHide:true});assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/Default read-only/);});

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

test('dated companion copy survives actual normalization and Modern adapter without changing stock facts',t=>{
 const f=fixture(),stock={records:[{...f.stock.records[0],id:'source-1',sourceId:'source-1',
   description:'Датирана извадка от публикувана обява.',images:['/dealer-stock/one.png','/dealer-stock/two.png']}]};
 const review={schemaVersion:1,kind:'cars-new-source-reviewed-companion-copy',dealer:f.dealer.slug,reviewed:true,
   reviewedAt:'2026-10-12T00:00:00Z',stockSha256:f.dealer.inputs.stock.sha256,
   descriptions:[{sourceId:'source-1',sourceDescription:stock.records[0].description,en:'Dated sample; confirm availability directly.',bg:stock.records[0].description}]};
 const before=JSON.stringify(stock);validateNewSourceCopyReview(review,f.dealer,stock);
 const profile={slug:f.dealer.slug,business:f.facts.business,
   listings:stock.records.map((row,index)=>refreshNormalizeInternals.normalizeListing(row,index,f.facts.business))};
 assert.deepEqual(profile.listings[0].images,stock.records[0].images,'actual normalized images are URL strings');
 const mock=path.join(temp(t),'mock-data.ts');
 fs.writeFileSync(mock,'export const mockListings: VehicleListing[] = [\n  {\n    id: "retained-modern-id"\n  }\n];\n');
 const personalized=refreshAdapterInternals.replaceModernListings(mock,profile),copy=newSourceReviewedCopy(profile,review);
 assert.equal(copy[profile.listings[0].slug].en.description,review.descriptions[0].en);
 const admitted=buildModernDealerInventoryCopy(personalized,{reviewedCopy:copy});
 for(const locale of ['en','bg'])assert.deepEqual(admitted[profile.listings[0].slug][locale].imageAlts,
   personalized[0].images.map(image=>image.alt),'reviewed captions match actual Modern image consumers');
 assert.deepEqual(personalized[0].images.map(image=>image.url),stock.records[0].images);
 assert.equal(JSON.stringify(stock),before);
 for(const changed of [{...review,stockSha256:'9'.repeat(64)},{...review,descriptions:[{...review.descriptions[0],sourceId:'other'}]},{...review,unknown:true}])
   assert.throws(()=>validateNewSourceCopyReview(changed,f.dealer,stock));
 assert.throws(()=>newSourceReviewedCopy({listings:[{...profile.listings[0],sourceId:'other'}]},review),/identity changed/);
 const missingAlt=clone(copy);missingAlt[profile.listings[0].slug].en.imageAlts[0]=undefined;
 assert.throws(()=>buildModernDealerInventoryCopy(personalized,{reviewedCopy:missingAlt}),/Invalid reviewed bilingual/);
 assert.equal(newSourceReviewedCopy(profile,null),undefined);
});

test('personalized creator metadata is finalized before native receipt sealing',()=>{
 const manifest={variants:[{key:'app'}]},before=new Map([['app/.client/project.json',Buffer.from('{"state":"needs-personalization"}')]]);
 const oldDigest=nativeInputDigest(before,manifest).digest;
 before.set('app/.client/project.json',Buffer.from('{"state":"personalized-needs-build","readyToPublish":false}'));
 assert.notEqual(nativeInputDigest(before,manifest).digest,oldDigest,'native receipt binds creator metadata too');
 const source=fs.readFileSync(fileURLToPath(new URL('./prepare-new-dealer-source.mjs',import.meta.url)),'utf8');
 const finalized=source.indexOf("state:'personalized-needs-build'"),collect=source.indexOf('await regenerateDealerCatalogs(directory,root,manifest.variants.map(v=>v.key),{mutationWriter})'),seal=source.indexOf('files=qualified?adoptNativeQualification');
 assert(finalized>=0&&finalized<collect&&collect<seal,'actual source producer collects final metadata before either native seal');
 assert.equal(source.lastIndexOf("state:'personalized-needs-build'"),finalized,'no later metadata rewrite invalidates the seal');
});

test('current identity lease permits unrelated registry admissions but rejects the selected dealer aliases and Worker',()=>{
 const row={slug:'new-sourced-cars',dealerId:'dealer-new',repository:'darkapoparka/cars-new-sourced-cars',workerName:'cars-new-sourced-cars',publicOrigin:'https://cars-new-sourced-cars.darkapoparka1.workers.dev'};
 const registry={dealers:[{slug:'unrelated',repository:'darkapoparka/other'}]},index={projects:[],campaignCandidatesWithoutFolders:[]};
 assert.equal(assertCurrentNewSourceIdentity(row,registry,index).dealer,row.slug);
 for(const collision of [{slug:'NewSourcedCars'},{aliases:['new-sourced-cars']},{id:row.dealerId},{dealerId:row.dealerId},{researchId:row.dealerId},{leadId:row.dealerId},{repository:row.repository.toUpperCase()},{workerName:row.workerName},{cloudflare:{workerName:row.workerName}},{cloudflare:{workerPrefix:row.workerName}},{cloudflare:{publicOrigin:row.publicOrigin}},{hostingIdentity:{cloudflare:{workerName:row.workerName}}},{delivery:{configuredPublicOrigin:row.publicOrigin}},{publicOrigin:row.publicOrigin+'/'}]){
  assert.throws(()=>assertCurrentNewSourceIdentity(row,{dealers:[...registry.dealers,collision]},index),/collision/);
  assert.throws(()=>assertCurrentNewSourceIdentity(row,registry,{projects:[collision]}),/collision/);
 }
 assert.throws(()=>assertCurrentNewSourceIdentity(row,{...registry,aliases:{NewSourcedCars:'other'}},index),/collision/);
 assert.throws(()=>assertCurrentNewSourceIdentity(row,registry,{projects:[],campaignCandidatesWithoutFolders:[{slug:row.slug}]}),/collision/);
});
test('current source lease compares exact selected inputs while unrelated registry/index blobs may advance',()=>{
 const eventCommit='a'.repeat(40),mainCommit='b'.repeat(40),blob='c'.repeat(40),row={slug:'new-sourced-cars',dealerId:'new-id',repository:'darkapoparka/cars-new',workerName:'cars-new',publicOrigin:'https://cars-new.darkapoparka1.workers.dev'},paths=['templates.lock.json','docs/releases/row/facts.json'];
 let registry={dealers:[]},index={projects:[]};const readGit=(_r,args)=>args[0]==='rev-parse'?blob:Buffer.from(JSON.stringify(args.at(-1).endsWith('clients/index.json')?index:registry));
 const args={eventCommit,mainCommit,row,paths,readGit},first=assertCurrentNewSourceInputs(args);
 registry={dealers:[{slug:'other',repository:'darkapoparka/other'}]};index={projects:[{slug:'second-other'}]};const next=assertCurrentNewSourceInputs(args);
 assert.equal(first.inputDigest,next.inputDigest);assert.notEqual(first.registrySha256,next.registrySha256);assert.notEqual(first.clientIndexSha256,next.clientIndexSha256);
 assert.equal(next.eventCommit,eventCommit);assert.equal(next.mainCommit,mainCommit);
 assert.throws(()=>assertCurrentNewSourceInputs({...args,readGit:(r,a)=>a[0]==='rev-parse'&&a[1]===mainCommit+':'+paths[1]?'d'.repeat(40):readGit(r,a)}),/input changed/);
 assert.throws(()=>assertCurrentNewSourceInputs({...args,paths:['../escape']}),/Exact immutable/);
 registry={dealers:[{slug:row.slug}]};assert.throws(()=>assertCurrentNewSourceInputs(args),/collision/);
});
test('current row input lease preserves qualification, stock, logo and copy pins without scanning other dealer pins',()=>{
 const row={slug:'a',inputs:{facts:{path:'facts.json'},stock:{path:'stock.json'},locale:{path:'locale.json'},branding:{path:'branding.json'}},identityReview:{path:'identity.json'},copyReview:{path:'copy.json'},media:[{path:'image.png'}]},request={qualification:{candidateLock:{path:'candidate.json'},contexts:{a:{path:'a-context.json'},other:{path:'other-context.json'}}}},qualified={context:{sourceDeltaReview:{reference:'delta.json'}}};
 const paths=newSourceCurrentLeasePaths(request,'request.json',row,[{path:'light.png'},{path:'dark.png'}],qualified);
 for(const name of ['request.json','templates.lock.json','catalog.json','workspace.json','facts.json','stock.json','locale.json','branding.json','identity.json','copy.json','image.png','light.png','dark.png','candidate.json','a-context.json','delta.json'])assert(paths.includes(name));
 assert(!paths.includes('other-context.json'));assert.equal(paths.length,16);
});

test('cheap Modern preflight preserves unknown facts and writes no client before rejecting unsupported stock',t=>{
 const root=temp(t);for(const [country,currency,unit]of [['AE','AED','km'],['US','USD','mi'],['BG','EUR','km']])for(const field of ['price','mileage','transmission']){const f=fixture(),car=f.stock.records[0];Object.assign(f.facts.business,{countryCode:country,currency,distanceUnit:unit});Object.assign(car,{currency,mileageUnit:unit});if(field==='price'){delete car.priceAmount;car.priceOnRequest=true;}if(field==='mileage'){delete car.mileageValue;delete car.mileageUnit;car.mileageOnRequest=true;}if(field==='transmission')delete car.transmission;const before=JSON.stringify({facts:f.facts,stock:f.stock});assert.throws(()=>preflightNewSourceModern({root,dealer:f.dealer.slug,facts:f.facts,stock:f.stock}),error=>error.code==='MODERN_FACTS_REQUIRE_REVIEW'&&error.fields.includes(field));assert.equal(JSON.stringify({facts:f.facts,stock:f.stock}),before);assert.equal(fs.existsSync(path.join(root,'clients')),false);}
 const f=fixture();f.stock.records[0].mileageValue=0;const before=JSON.stringify(f.stock);assert.equal(preflightNewSourceModern({root,dealer:f.dealer.slug,facts:f.facts,stock:f.stock}).listings,1);assert.equal(JSON.stringify(f.stock),before);
});

test('preserved creator staging holds a retry before a second maintained source copy',t=>{
 const root=temp(t),dealer='new-sourced-cars';assert.equal(assertNewSourceCreatorStagingAbsent(root,dealer),true);const unrelated=path.join(root,'runtime/new-clients/another-dealer-retained');fs.mkdirSync(unrelated,{recursive:true});assert.equal(assertNewSourceCreatorStagingAbsent(root,dealer),true);const own=path.join(root,'runtime/new-clients/'+dealer+'-partial');fs.mkdirSync(own);const retained=path.join(own,'work.txt');fs.writeFileSync(retained,'unique partial source');assert.throws(()=>assertNewSourceCreatorStagingAbsent(root,dealer),/manual reconciliation|second source copy/);assert.equal(fs.readFileSync(retained,'utf8'),'unique partial source');
});

test('creator receipt reconstruction binds exact physical bytes, identity, source pins and file state',t=>{
 const root=temp(t),f=fixture();f.dealer.repository='darkapoparka/cars-new-sourced-cars';const baseline={commit:revision,rootTree:tree},relative='runtime/new-clients/'+f.dealer.slug+'-owned/creation.json',file=path.join(root,relative);fs.mkdirSync(path.dirname(file),{recursive:true});const receipt={clientRoot:path.join(root,'clients',f.dealer.slug),workflowCommit:revision,templates:NEW_SOURCE_FAMILIES.map(key=>({key,source:f.sourceReleases[key]}))};fs.writeFileSync(file,JSON.stringify(receipt));
 const candidate=path.join(root,'clients',f.dealer.slug);fs.mkdirSync(candidate,{recursive:true});const manifest={schemaVersion:1,slug:f.dealer.slug,dealerId:f.dealer.dealerId,repository:f.dealer.repository,packaging:{version:'5'},localization:f.locale,variants:NEW_SOURCE_FAMILIES.map((key,index)=>({key,base:index?'/variant-'+(index+1):'',entry:index?(key==='modern'?'/variant-2/cars':'/variant-'+(index+1)+'/'):'/'})),templateSources:f.sourceReleases,templateRevisions:Object.fromEntries(NEW_SOURCE_FAMILIES.map(key=>[key,revision]))};fs.writeFileSync(path.join(candidate,'dealer.json'),JSON.stringify(manifest));
 const summary={clientRoot:'clients/'+f.dealer.slug,applications:6,receipt:newSourceCreationReceiptPin(root,relative),readOnly:{dealer:f.dealer.slug,repository:f.dealer.repository,baseCommit:revision,sourceReleases:f.sourceReleases}};assert.equal(validateNewSourceCreationSummary(root,f.dealer,baseline,summary),summary);for(const mutate of [x=>x.clientRoot='clients/foreign',x=>x.receipt.sha256='f'.repeat(64),x=>x.receipt.fileState.mode=0,x=>x.readOnly.baseCommit='f'.repeat(40),x=>x.readOnly.sourceReleases.mobile.revision='f'.repeat(40)]){const changed=clone(summary);mutate(changed);assert.throws(()=>validateNewSourceCreationSummary(root,f.dealer,baseline,changed));}
 fs.writeFileSync(path.join(candidate,'dealer.json'),JSON.stringify({...manifest,slug:'foreign-dealer'}));assert.throws(()=>validateNewSourceCreationSummary(root,f.dealer,baseline,summary),/identity differs/);fs.writeFileSync(path.join(candidate,'dealer.json'),JSON.stringify(manifest));
 fs.appendFileSync(file,' ');assert.throws(()=>validateNewSourceCreationSummary(root,f.dealer,baseline,summary),/changed/);fs.linkSync(file,path.join(path.dirname(file),'hard-link.json'));assert.throws(()=>newSourceCreationReceiptPin(root,relative),/unlinked/);
});

test('resume CLI is explicit, production keeps maintained phases and code inventory includes its executable closure',async t=>{
 const source=fs.readFileSync(fileURLToPath(new URL('./prepare-new-dealer-source.mjs',import.meta.url)),'utf8');assert(source.indexOf('preflightNewSourceModern({root,dealer:row.slug')<source.indexOf('creation=await createNewClient(plan,{mutationWriter})'));assert(source.indexOf('ownedNewSourceCandidate(run,')<source.indexOf('occupiedSlugs.filter(name=>name!==row.slug)'));assert(source.includes('await continueNewSourceResume(run,{'));assert(source.includes("mutationWriter.writeFile(path.join(output,'source-patch.json')"));assert(!source.includes("path.join(area,'output')"));assert(source.includes('failure-\'+randomUUID()'));assert(source.includes('finally{run.close();}'));
 for(const name of ['scripts/new-client.mjs','scripts/lib/new-source-resume.mjs','scripts/lib/client-refresh-safe-content.mjs','scripts/lib/modern-dealer-inventory-copy.mjs','scripts/lib/import-dealer-inventory-copy.mjs','scripts/lib/source-input-raster.mjs','scripts/lib/cli-entrypoint.mjs','scripts/publishing/proposal-introduction.js','scripts/publishing/switcher-messages.json','scripts/publishing/assets/feature-vehicle.webp'])assert(NEW_SOURCE_ORCHESTRATION_PATHS.includes(name),name);assert(NEW_SOURCE_ORCHESTRATION_PATHS.length>40&&NEW_SOURCE_ORCHESTRATION_PATHS.length<=128);assert.equal(new Set(NEW_SOURCE_ORCHESTRATION_PATHS).size,NEW_SOURCE_ORCHESTRATION_PATHS.length);
 for(const options of [{resumeArea:'runtime/new-dealer-source/run/new-sourced-cars',write:true},{resumeOwner:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',write:true},{resumeArea:'runtime/new-dealer-source/run/new-sourced-cars',resumeOwner:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'}])await assert.rejects(prepareNewDealerSource({root:temp(t),dealer:'new-sourced-cars',...options}),/both --resume|--write/);
 const cli=fileURLToPath(new URL('./prepare-new-dealer-source.mjs',import.meta.url)),result=spawnSync(process.execPath,[cli,'--resume-area','one','--resume-area','two'],{encoding:'utf8',windowsHide:true});assert.notEqual(result.status,0);assert.match(result.stderr,/duplicate argument/);
});

test('cheap Import preflight rejects original missing facts before any candidate is created',t=>{
 const root=temp(t);for(const field of ['year','mileage','currency']){const f=fixture(),row=f.stock.records[0];if(field==='year')row.year=0;if(field==='mileage'){delete row.mileageValue;row.mileageOnRequest=true;}if(field==='currency')row.currency='USD';const before=JSON.stringify(f.stock);assert.throws(()=>preflightNewSourceImport({root,dealer:f.dealer.slug,facts:f.facts,stock:f.stock}),/Import adaptation requires/);assert.equal(JSON.stringify(f.stock),before);assert.equal(fs.existsSync(path.join(root,'clients',f.dealer.slug)),false);}
 const f=fixture();assert.equal(preflightNewSourceImport({root,dealer:f.dealer.slug,facts:f.facts,stock:f.stock}).listings,1);
});

test('catalog optional writer uses the maintained generator seam without changing ordinary consumers',async t=>{
 const root=temp(t),directory=path.join(root,'auto-best'),script=path.join(directory,'scripts/build-locales.mjs');fs.mkdirSync(path.dirname(script),{recursive:true});
 fs.writeFileSync(script,"import fs from 'node:fs';\nimport path from 'node:path';\nconst root = path.resolve(import.meta.dirname, '..');\nfs.writeFileSync(path.join(root,'catalog-result.json'),'planned generator output');\n");
 await regenerateDealerCatalogs(root,path.resolve('.'),['auto-best']);assert.equal(fs.readFileSync(path.join(directory,'catalog-result.json'),'utf8'),'planned generator output');
 const writes=[];await regenerateDealerCatalogs(root,path.resolve('.'),['auto-best'],{mutationWriter:{writeFile:(name,bytes)=>writes.push([name,bytes.toString()])}});assert.deepEqual(writes,[[path.join(directory,'catalog-result.json'),'planned generator output']]);
 fs.appendFileSync(script,"fs.unlinkSync(path.join(root,'catalog-result.json'));\n");await assert.rejects(regenerateDealerCatalogs(root,path.resolve('.'),['auto-best'],{mutationWriter:{writeFile:()=>assert.fail('unreviewed generator ran')}}),/unreviewed catalog mutation/);assert.equal(fs.readFileSync(path.join(directory,'catalog-result.json'),'utf8'),'planned generator output');
});

test('resume path, selected dealer and owner syntax reject before any source or Git work',async t=>{
 const root=temp(t),base={dealer:'new-sourced-cars',write:true,resumeArea:'runtime/new-dealer-source/run-1/new-sourced-cars',resumeOwner:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'};assert.equal(validateNewSourceResumeOptions(base),true);assert.equal(validateNewSourceResumeOptions({dealer:base.dealer,write:false}),false);for(const change of [{resumeArea:'/outside'},{resumeArea:'runtime/new-dealer-source/../new-sourced-cars'},{resumeArea:'runtime/new-dealer-source/run-1/foreign'},{resumeArea:'runtime/new-dealer-source/run-1/nested/new-sourced-cars'},{resumeOwner:'guessed-owner'}]){const input={...base,...change};assert.throws(()=>validateNewSourceResumeOptions(input),/Exact owned/);await assert.rejects(prepareNewDealerSource({root,...input}),/Exact owned/);assert.equal(fs.existsSync(path.join(root,'runtime')),false);}
});
