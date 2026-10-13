import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {tinyArea,writeFixture} from './test-fixtures/fleet-single-worker.mjs';
import {sha256} from './lib/workflow.mjs';
import {planRegisteredClientAdoption,assertRegisteredAdoptionPlan,registeredAdoptionTarget,readRegisteredDealerAdoption,validateRegisteredSourceRequest,REGISTERED_TRIO,REGISTERED_INPUT_ROOT,REGISTERED_ADOPTION_FILE,REGISTERED_PROFILE_FILE,originalListingIdRecorded,materializeRegisteredAssetView,assertRegisteredAssetView,assertRegisteredCandidateDirectory} from './registered-dealer-adoption.mjs';
import {gitObjectId,gitTreeId,assertPreparedMountOwnership,createSourcePatch,verifySourcePatch,sourceMatrix} from './prepare-existing-fleet-source.mjs';
import {planDealerUpgrade} from './dealer-updates/three-way-upgrade.mjs';
import {targetManifestForUpgrade,assertUpgradeSourceAdmission,adaptPinnedBases} from './dealer-updates/update-dealer-template.mjs';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {nativeFixture} from './test-fixtures/native-source.mjs';
import {refreshAdapterInternals} from './lib/client-refresh-adapters.mjs';
import {prepareAppDealer} from './lib/app-dealer-adapter.mjs';
import {applyDealerLogoContract} from './lib/client-logo-contract.mjs';

const enc=v=>Buffer.from(JSON.stringify(v,null,2)+'\n');
const families=['auto-best','modern','import','app','mobile','karento-best'];
function fixture(t){
 const root=tinyArea(t),dealer='registered-fixture',dealerRoot=path.join(root,'clients',dealer),prefix=REGISTERED_INPUT_ROOT+'/'+dealer,commit='1'.repeat(40),revision='2'.repeat(40),trees={};
 const files=new Map(),put=(n,b)=>files.set(n,Buffer.isBuffer(b)?b:Buffer.from(b));
 put('CLIENT.md','# Original registered research; preserve this history.\n');put('business-facts.json',enc({name:'Original legacy facts',unknownField:null,history:'retain'}));
 put('carwow/original-stock.json',enc({listings:[{id:'original-stock-123',sourceUrl:'https://example.com/advert/123'}]}));
 put('auto-best/static/dealer/logo.png',Buffer.from([137,80,78,71,0,255]));put('carwow/static/dealer/photo-123.webp',Buffer.from([82,73,70,70,1,255]));
 for(const [i,key]of ['auto-best','modern','carwow'].entries()){
  trees[key]=String(i+3).repeat(40);put(key+'/package.json',enc({name:key}));put(key+'/src/ui.ts','export const title="paid dealer wording";\n');
  put(key+'/.client/project.json',enc({schemaVersion:1,client:dealer,templateKey:key,sourceCommit:revision,sourceTree:trees[key],state:'implemented-unverified',qa:{desktop:false,mobile:false,identity:false,contactPath:false}}));
  put(key==='modern'?key+'/apps/web/next.config.ts':key+'/svelte.config.js','export default {};\n');
 }
 for(const [name,bytes]of files)writeFixture(path.join(dealerRoot,name),bytes);
 const entries=[...files].map(([name,bytes])=>({path:name,mode:'100644',blob:gitObjectId('blob',bytes)})).sort((a,b)=>a.path.localeCompare(b.path,'en'));
 const baseline={commit,tree:gitTreeId(entries),entries,files},proof=n=>({path:n,sha256:sha256(files.get(n))}),sourceEvidence=[proof('CLIENT.md'),proof('business-facts.json'),proof('carwow/original-stock.json')];
 const identity={dealerId:'bg-varna-'+dealer,repository:'darkapoparka/cars-'+dealer,workerName:'cars-'+dealer,publicOrigin:'https://cars-'+dealer+'.darkapoparka1.workers.dev',sources:[{url:'https://example.com/dealer',observedAt:'2026-10-11'}]};
 const personalization={schemaVersion:1,kind:'cars-registered-dealer-derived-inputs',dealer,reviewed:true,reviewedAt:'2026-10-11T12:00:00Z',facts:{business:{name:'Truthful registered dealer',countryCode:'BG',currency:'EUR',city:'Varna',logo:'/dealer/logo.png',logoDark:'/dealer/logo.png',inventoryNotice:'Dated listings; confirm availability.',previewNotice:'Independent proposal.',unknownFact:null}},stock:{kind:'dated-published-advertisements',listings:[{id:'original-stock-123',title:'Original sourced vehicle',sourceUrl:'https://example.com/advert/123',priceAmount:null,currency:'EUR',images:['/dealer/photo-123.webp'],sourceRecord:{...proof('carwow/original-stock.json'),id:'original-stock-123'}}]},locale:{schemaVersion:1,dealerId:identity.dealerId,defaultLocale:'bg',enabledLocales:['bg','en'],dealerCountry:'BG',inventoryCurrency:'EUR'},sourceEvidence,media:[{publicPath:'/dealer/logo.png',sourcePath:'auto-best/static/dealer/logo.png',sha256:sha256(files.get('auto-best/static/dealer/logo.png'))},{publicPath:'/dealer/photo-123.webp',sourcePath:'carwow/static/dealer/photo-123.webp',sha256:sha256(files.get('carwow/static/dealer/photo-123.webp'))}]};
 const personalizationBytes=enc(personalization),personalizationPin={path:prefix+'/personalization.json',sha256:sha256(personalizationBytes)};writeFixture(path.join(root,personalizationPin.path),personalizationBytes);
 const applications=Object.fromEntries(['auto-best','modern','carwow'].map((key,i)=>[key,String(i+6).repeat(40)])),actualApplications={...applications};
 const receipt={schemaVersion:1,kind:'cars-registered-dealer-source-adoption',dealer,reviewed:true,reviewedAt:'2026-10-11T12:00:00Z',canonicalSourceRepository:'darkapoparka/cars',baseline:{commit,tree:baseline.tree},identity,layout:{kind:'raw-unmounted-applications',reviewed:true,proofs:['auto-best/svelte.config.js','modern/apps/web/next.config.ts','carwow/svelte.config.js'].map(proof)},variants:structuredClone(REGISTERED_TRIO),applications,templateSources:Object.fromEntries(['auto-best','modern','carwow'].map(key=>[key,{repository:'darkapoparka/cars',revision,path:'templates/'+key,tree:trees[key]}])),provenance:Object.fromEntries(['auto-best','modern','carwow'].map(key=>[key,{metadata:proof(key+'/.client/project.json')}])),personalization:personalizationPin,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false};
 const receiptBytes=enc(receipt),pin={path:prefix+'/adoption.json',sha256:sha256(receiptBytes)};writeFixture(path.join(root,pin.path),receiptBytes);
 const registry={schemaVersion:2,aliases:{old:'other'},dealers:[{slug:dealer,canonicalSourceRef:'main',canonicalSourceRepository:'darkapoparka/cars',repository:null,id:null,variants:structuredClone(REGISTERED_TRIO).map(v=>({...v,entry:null})),delivery:{state:'unknown'},legacy:{retain:true}},{slug:'other',repository:'darkapoparka/cars-other',vercel:{id:'prj_retained'},variants:[],evidence:{ownerReview:{state:'unknown'}}}]};
 const readGit=(_root,args)=>{const command=args.join(' ');if(command==='rev-parse HEAD')return commit;if(command==='remote get-url origin')return 'https://github.com/darkapoparka/cars.git';if(args[0]==='merge-base')return '';if(args[0]==='ls-tree')return Buffer.from(entries.map(e=>e.mode+' blob '+e.blob+'\t'+e.path+'\0').join(''));if(command==='rev-parse '+commit+':clients/'+dealer)return baseline.tree;for(const key of ['auto-best','modern','carwow']){if(command==='rev-parse '+commit+':clients/'+dealer+'/'+key)return actualApplications[key];if(command==='rev-parse '+revision+':templates/'+key)return trees[key];}throw Error('Unexpected fixture Git read: '+command);};
 const options=()=>({receipt,receiptBytes:enc(receipt),personalization,personalizationBytes:enc(personalization),baseline,registry,dealerRoot,root,readGit}),plan=()=>planRegisteredClientAdoption(options());
 const sourceRevision='a'.repeat(40),lock={schemaVersion:1,templates:Object.fromEntries(families.map(key=>[key,{status:'approved',repository:'darkapoparka/cars',commit:sourceRevision,digest:'b'.repeat(64),snapshotPath:'templates/'+key,source:{repository:'darkapoparka/cars',revision:sourceRevision,path:'templates/'+key,tree:'c'.repeat(40),digest:'b'.repeat(64)}}]))};
 const context={schemaVersion:1,kind:'cars-native-source-qualification-context',id:'synthetic-registered-test',dealer,scope:'existing-dealer-pilot',sourceCommit:sourceRevision,reviewed:true,reviewedAt:'2026-10-11T12:00:00Z',nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,approvedLockSha256:'d'.repeat(64),candidateLockSha256:'e'.repeat(64),sourceDeltaReview:{reference:'docs/releases/synthetic-delta.json',sha256:'f'.repeat(64),reviewedAt:'2026-10-11T12:00:00Z'}};
 const pins=Object.fromEntries(families.map(key=>[key,{to:sourceRevision,targetSource:{repository:'darkapoparka/cars',revision:sourceRevision,path:'templates/'+key,digest:'b'.repeat(64),tree:'c'.repeat(40)}}]));
 const request={schemaVersion:1,mode:'registered-adoption',sourceRevision,approvedParentLockDigest:context.approvedLockSha256,dealers:[dealer],inputs:{[dealer]:{adoption:pin,...Object.fromEntries(['candidateLock','qualification','sourceDeltaReview','branding'].map(key=>[key,{path:'docs/releases/cloudflare-existing25-20261011/'+key+'.json',sha256:'f'.repeat(64)}]))}}};
 return {root,dealer,dealerRoot,receipt,receiptBytes,pin,personalization,personalizationBytes,baseline,registry,readGit,plan,options,lock,context,pins,request};
}

test('registered adoption is read-only and retains identity/research/stock unknowns and registry history',async t=>{
 const f=fixture(t),before=JSON.stringify(f.registry),p=f.plan();assert.equal(p.write,false);assert.equal(p.published,false);assert.equal(fs.existsSync(path.join(f.dealerRoot,'dealer.json')),false);assert.equal(p.profile.listings[0].id,'original-stock-123');assert.equal(p.profile.listings[0].priceAmount,null);assert.equal(p.profile.rawFacts.business.unknownFact,null);assert.equal(JSON.stringify(f.registry),before);assert.equal(assertRegisteredAdoptionPlan(p,{dealerRoot:f.dealerRoot}),p);
 const r=await readRegisteredDealerAdoption({root:f.root,pin:f.pin,dealer:f.dealer,baseline:f.baseline,registry:f.registry,readGit:f.readGit});assert.equal(r.receiptSha256,f.pin.sha256);for(const [name,bytes]of f.baseline.files)assert(fs.readFileSync(path.join(f.dealerRoot,name)).equals(bytes));
});
function demoFixture(t){
 const f=fixture(t),revision='d'.repeat(40),tree='e'.repeat(40),source={repository:'darkapoparka/cars',revision,path:'templates/auto-best',tree,digest:'f'.repeat(64)},gitFiles=new Map();
 const catalog=Buffer.from("const inventoryRecords: Example[] = [{ id: 1, make: 'Audi', title: 'Audi example', image: leadSite.artwork.inventoryDemo.stock01, yearNumber: 2020, mileageKm: 12000, fuel: 'Petrol', transmission: 'Automatic', equipment: [], condition: 'used', priceEur: 12000 }];\n"),bindings=Buffer.from("export const leadSite = {stock01: '/demo/car.webp'};\n"),photo=Buffer.from([82,73,70,70,3,255]);
 gitFiles.set(revision+':templates/auto-best/src/lib/data/inventory.ts',catalog);gitFiles.set(revision+':templates/auto-best/src/lib/config/lead-site.ts',bindings);gitFiles.set(revision+':templates/auto-best/static/demo/car.webp',photo);
 const filePin=(name,bytes)=>({path:name,bytes:bytes.length,sha256:sha256(bytes),gitBlob:gitObjectId('blob',bytes)}),proof={source,catalog:filePin('src/lib/data/inventory.ts',catalog),bindings:filePin('src/lib/config/lead-site.ts',bindings)};
 writeFixture(path.join(f.root,'templates.lock.json'),enc({templates:{'auto-best':{status:'approved',source}}}));
 const p=f.personalization;p.stock={kind:'illustrative-not-dealer-stock',mode:'template-demo',previewOnly:true,actualDealerAvailability:false,disclosure:'Demo examples; none are this dealer’s actual stock.',templateDemo:proof,listings:[{id:'template-demo-auto-best-1',make:'Audi',title:'Audi example',image:'/demo/car.webp',yearNumber:2020,mileageKm:12000,fuel:'Petrol',transmission:'Automatic',equipment:[],condition:'used',priceEur:12000,sourceUrl:'',year:2020,currency:'EUR',priceAmount:12000,images:['/demo/car.webp'],availability:'illustrative-not-dealer-stock',verification:'sample',sourceRecord:{sourceId:'1',catalogPath:proof.catalog.path,catalogSha256:proof.catalog.sha256}}]};
 p.facts.business.inventoryNotice=p.stock.disclosure;p.facts.retainedSourceInventory={records:[{id:'original-stock-123',sourceUrl:'https://example.com/advert/123'}],renderAsDealerStock:false};
 p.media=p.media.slice(0,1);p.media.push({publicPath:'/demo/car.webp',sourceKind:'immutable-template-demo',templatePath:'static/demo/car.webp',sha256:sha256(photo),gitBlob:gitObjectId('blob',photo),bytes:photo.length});
 const readGit=(root,args,options)=>{if(args[0]==='merge-base')return '';if(args[0]==='rev-parse'&&args[1]===revision+':templates/auto-best')return tree;
  const key=args[0]==='show'?args[1]:args[0]==='ls-tree'?args[1]+':'+args[3]:null,bytes=gitFiles.get(key);if(bytes)return args[0]==='show'?bytes:'100644 blob '+gitObjectId('blob',bytes)+'\t'+args[3];return f.readGit(root,args,options);};
 const plan=()=>{f.receipt.personalization.sha256=sha256(enc(p));return planRegisteredClientAdoption({...f.options(),readGit});};
 return {...f,readGit,gitFiles,plan};
}

function addPublishedBranding(f){
 const prefix='docs/releases/cloudflare-existing25-20261011/branding-inputs52/'+f.dealer,commit=f.baseline.commit,bytes=Buffer.from([137,80,78,71,4,255]);
 const document={schemaVersion:1,dealer:f.dealer,reviewed:true,reviewedAt:'2026-10-11',dealerApproval:false,nativeApproval:false,hostedApproval:false,surfaces:Object.fromEntries(['onLight','onDark','onAccent'].map(surface=>[surface,{path:prefix+'/branding/'+surface+'.png',sha256:sha256(bytes)}]))};
 f.gitFiles.set(commit+':'+prefix+'/branding.json',enc(document));for(const pin of Object.values(document.surfaces))f.gitFiles.set(commit+':'+pin.path,bytes);
 f.personalization.publishedBranding={path:prefix+'/branding.json',sha256:sha256(enc(document)),sourceCommit:commit};f.personalization.media=f.personalization.media.filter(p=>p.publicPath!=='/dealer/logo.png');
 for(const surface of ['onLight','onDark'])f.personalization.media.push({publicPath:'/registered-branding/'+surface+'.png',sourceKind:'published-branding-input',inputPath:document.surfaces[surface].path,sha256:sha256(bytes),surface});
 f.personalization.facts.business.logo='/registered-branding/onLight.png';f.personalization.facts.business.logoDark='/registered-branding/onDark.png';return document;
}

test('explicit template demo is catalog-derived, disclosed, and keeps dealer evidence and source URLs separate',t=>{
 const f=demoFixture(t);addPublishedBranding(f);const p=f.plan();assert.equal(p.profile.stockKind,'illustrative-not-dealer-stock');assert.equal(p.profile.listings[0].sourceUrl,'');assert.equal(p.profile.listings[0].observedAt,'');assert.equal(p.profile.listings[0].availability,'illustrative-not-dealer-stock');assert.equal(p.profile.rawFacts.retainedSourceInventory.records[0].id,'original-stock-123');
 const target=registeredAdoptionTarget(p,f.pins);for(const [name,bytes]of p.files)writeFixture(path.join(f.dealerRoot,name),bytes);writeFixture(path.join(f.dealerRoot,'dealer.json'),enc(target));const profile=loadDealerProfile(f.dealerRoot,f.dealer);assert.equal(profile.listings[0].sourceUrl,'');assert.equal(profile.listings[0].priceAmount,12000);assert.equal(profile.stockKind,'illustrative-not-dealer-stock');assert(fs.readFileSync(path.join(f.dealerRoot,'carwow/original-stock.json')).equals(f.baseline.files.get('carwow/original-stock.json')));
});

test('maintained Auto Best, Modern and App consumers keep the registered demo disclosure and empty advert source',async t=>{
 const f=demoFixture(t);addPublishedBranding(f);const p=f.plan(),run=path.join(f.root,'runtime','consumer-run');fs.mkdirSync(run,{recursive:true});const view=materializeRegisteredAssetView(p,{runDirectory:run});
 assert.equal(p.profile.business.inventoryUrl,'');assert.equal(p.profile.business.observedAt,'');assert.match(refreshAdapterInternals.autoBestInventory(p.profile),/evidenceUrl: ""|"evidenceUrl": ""/);
 const modern=refreshAdapterInternals.modernListing(p.profile.listings[0],0,'demo-id',p.profile);assert.equal(modern.seller.verificationStatus,'unverified');assert.match(modern.description,/Demo examples/);
 const readFile=name=>name==='auto-best/src/lib/data/dealer-profile.json'?enc(p.profile):fs.readFileSync(path.join(view,name.replace(/^auto-best\/static\//,'')));
 const app=await prepareAppDealer(view,registeredAdoptionTarget(p,f.pins),{readFile});assert.equal(app.inventory[0].sourceUrl,'');assert.equal(app.inventory[0].observedAt,'');assert.match(app.config.inventoryNotice,/none are this dealer/);
});

test('demo and published raster inputs reject fabricated facts, source swaps, acceptance claims and catalog drift',t=>{
 for(const change of [f=>f.personalization.stock.previewOnly=false,f=>f.personalization.stock.actualDealerAvailability=true,f=>f.personalization.stock.listings[0].sourceUrl='https://example.com/advert/123',f=>f.personalization.stock.listings[0].priceAmount=1,f=>f.personalization.stock.listings[0].title='Invented car',f=>f.personalization.stock.listings[0].verification='verified',f=>f.personalization.stock.listings[0].sourceRecord.sourceId='2',f=>f.personalization.stock.templateDemo.catalog.sha256='0'.repeat(64),f=>f.personalization.media[0].sha256='0'.repeat(64),f=>f.personalization.media.find(p=>p.surface).inputPath='docs/other/logo.png',f=>f.personalization.publishedBranding.path=f.personalization.publishedBranding.path.replace(f.dealer,'other'),f=>f.personalization.publishedBranding.sha256='0'.repeat(64),f=>f.personalization.facts.retainedSourceInventory.renderAsDealerStock=true,f=>writeFixture(path.join(f.root,'templates.lock.json'),enc({templates:{'auto-best':{status:'draft',source:f.personalization.stock.templateDemo.source}}}))]){
  const f=demoFixture(t);addPublishedBranding(f);change(f);assert.throws(f.plan);
 }
 const f=demoFixture(t),p=f.plan();fs.appendFileSync(path.join(f.root,'templates.lock.json'),' ');assert.throws(()=>assertRegisteredAdoptionPlan(p),/catalog lease changed/);
});

test('registered asset view contains only pinned physical assets and rejects tampering or candidate/source overlap',t=>{
 const f=demoFixture(t);addPublishedBranding(f);const p=f.plan(),run=path.join(f.root,'runtime','owned-run');fs.mkdirSync(run,{recursive:true});const view=materializeRegisteredAssetView(p,{runDirectory:run,candidateDirectory:path.join(run,'candidate')});assertRegisteredAssetView(p,view);
 assert.equal(fs.existsSync(path.join(view,'dealer.json')),false);assert.equal(fs.existsSync(path.join(view,'auto-best','package.json')),false);assert.equal(fs.readFileSync(path.join(view,'demo','car.webp')).length,6);assert.equal(fs.existsSync(path.join(f.dealerRoot,'dealer.json')),false);assert.throws(()=>materializeRegisteredAssetView(p,{runDirectory:run}),/occupied/);
 const candidate=path.join(run,'candidate');fs.mkdirSync(candidate);assertRegisteredCandidateDirectory(p,candidate);assert.throws(()=>assertRegisteredCandidateDirectory(p,f.dealerRoot),/distinct runtime/);assert.throws(()=>assertRegisteredCandidateDirectory(p,view),/distinct runtime/);
 fs.appendFileSync(path.join(view,'demo','car.webp'),'x');assert.throws(()=>assertRegisteredAssetView(p,view),/bytes changed/);
});

test('registered asset view refuses escaped runtime aliases and invented public media',t=>{
 const f=demoFixture(t),p=f.plan(),runtime=path.join(f.root,'runtime'),outside=path.join(f.root,'outside');fs.mkdirSync(runtime,{recursive:true});fs.mkdirSync(outside);fs.symlinkSync(outside,path.join(runtime,'redirect'),'junction');assert.throws(()=>materializeRegisteredAssetView(p,{runDirectory:path.join(runtime,'redirect')}),/distinct Cars runtime/);
 const g=demoFixture(t);g.personalization.media.push({publicPath:'/demo/arbitrary.webp',sourceKind:'immutable-template-demo',templatePath:'static/demo/car.webp',sha256:g.personalization.media[1].sha256,gitBlob:g.personalization.media[1].gitBlob,bytes:6});assert.throws(g.plan,/catalog-bound/);
});

test('registered source request is an explicit separate bounded envelope',async t=>{
 const f=fixture(t);assert.equal(validateRegisteredSourceRequest(f.request,f.registry),f.request);const matrix=await sourceMatrix(f.request,{root:f.root,registry:f.registry});assert.equal(matrix.include[0].mode,'registered-adoption');assert(matrix.include[0].sourceInputs.includes('/'+f.pin.path));assert(matrix.include[0].sourceInputs.includes('/'+f.receipt.personalization.path));
 for(const change of [r=>r.mode='new-approved',r=>r.mode='existing-migration',r=>r.extraApproval=true,r=>r.dealers.push(r.dealers[0]),r=>r.inputs[f.dealer].adoption.path='clients/'+f.dealer+'/dealer.json']){const copy=structuredClone(f.request);change(copy);assert.throws(()=>validateRegisteredSourceRequest(copy,f.registry));}
});
test('adoption rejects independence, aliases, competing identities and unreviewed/false approval claims',t=>{
 for(const change of [f=>f.registry.dealers[0].sourceOwnership='independent-repository',f=>f.registry.aliases[f.dealer]='other',f=>f.registry.dealers[1].repository=f.receipt.identity.repository,f=>f.registry.dealers[1].id=f.receipt.identity.dealerId,f=>f.registry.dealers[1].cloudflare={workerName:f.receipt.identity.workerName},f=>f.receipt.reviewed=false,f=>f.receipt.nativeApproval=true,f=>f.receipt.globalReleaseApproval=true,f=>f.receipt.identity.publicOrigin='https://invented.example',f=>f.receipt.identity.extra=true]){const f=fixture(t);change(f);assert.throws(f.plan);}
});
test('canonical destination and original provenance leases reject missing/added/changed/source symlink work',t=>{
 for(const change of [f=>f.receipt.baseline.tree='0'.repeat(40),f=>f.receipt.applications.modern='0'.repeat(40),f=>f.receipt.templateSources.modern.revision='0'.repeat(40),f=>f.receipt.provenance.modern.metadata.sha256='0'.repeat(64),f=>writeFixture(path.join(f.dealerRoot,'dealer.json'),'{}'),f=>writeFixture(path.join(f.dealerRoot,'extra.txt'),'preserve concurrent work'),f=>writeFixture(path.join(f.dealerRoot,'CLIENT.md'),'concurrent research'),f=>fs.mkdirSync(path.join(f.dealerRoot,'.git'))]){const f=fixture(t);change(f);assert.throws(f.plan);}
 const f=fixture(t),old=path.join(f.dealerRoot,'CLIENT.md');fs.unlinkSync(old);writeFixture(path.join(f.root,'outside.md'),'linked work');fs.symlinkSync(path.join(f.root,'outside.md'),old);assert.throws(f.plan,/physical|inventory|Unsupported|file|link/i);
});
test('dirty-copy Tesi-style receipts and incomplete/unproved source bases remain rejected',t=>{
 const f=fixture(t),name='modern/.template/source-manifest.json',bytes=enc({git:{head:'2'.repeat(40),status:' M templates/modern/config.ts'},sourceCommit:'2'.repeat(40),sourceTree:f.receipt.templateSources.modern.tree});writeFixture(path.join(f.dealerRoot,name),bytes);f.baseline.files.set(name,bytes);f.baseline.entries.push({path:name,mode:'100644',blob:gitObjectId('blob',bytes)});f.baseline.entries.sort((a,b)=>a.path.localeCompare(b.path,'en'));f.baseline.tree=gitTreeId(f.baseline.entries);f.receipt.baseline.tree=f.baseline.tree;assert.throws(f.plan,/copy receipt cannot be omitted/);f.receipt.provenance.modern.copyReceipt={path:name,sha256:sha256(bytes)};assert.throws(f.plan,/dirty copied template base/);
 const g=fixture(t),meta='modern/.client/project.json';g.baseline.files.set(meta,enc({client:g.dealer,templateKey:'modern'}));writeFixture(path.join(g.dealerRoot,meta),g.baseline.files.get(meta));g.baseline.entries.find(e=>e.path===meta).blob=gitObjectId('blob',g.baseline.files.get(meta));g.baseline.tree=gitTreeId(g.baseline.entries);g.receipt.baseline.tree=g.baseline.tree;g.receipt.provenance.modern.metadata.sha256=sha256(g.baseline.files.get(meta));assert.throws(g.plan,/provenance does not prove/);
});
test('derived inputs preserve original listing/photo identities and cannot use invented IDs, mutable proofs or bytes',t=>{
 for(const change of [f=>f.personalization.stock.listings[0].id='invented',f=>f.personalization.stock.listings[0].sourceRecord.id='wrong',f=>f.personalization.media[1].sha256='0'.repeat(64),f=>f.personalization.stock.listings[0].images=['/invented.webp'],f=>f.personalization.sourceEvidence[0].path='../escape',f=>f.personalization.facts.business.currency='USD',f=>f.personalization.locale.dealerId='other',f=>f.personalization.reviewed=false]){const f=fixture(t);change(f);f.receipt.personalization.sha256=sha256(enc(f.personalization));assert.throws(f.plan);}
 assert.equal(originalListingIdRecorded(enc({id:'91234'}),'123'),false);assert.equal(originalListingIdRecorded(enc({id:'123'}),'123'),true);
});
test('only an unmodified authenticated plan can admit legacy source qualification',t=>{
 const f=fixture(t),p=f.plan();assert.throws(()=>assertUpgradeSourceAdmission({manifest:p.manifest,qualification:f.context,dealerRoot:f.dealerRoot}),/existing native dealer/);assert.throws(()=>assertUpgradeSourceAdmission({manifest:p.manifest,registeredAdoption:p,dealerRoot:f.dealerRoot}),/reviewed native qualification/);assertUpgradeSourceAdmission({manifest:p.manifest,qualification:f.context,registeredAdoption:p,dealerRoot:f.dealerRoot});assert.throws(()=>assertRegisteredAdoptionPlan({...p},{dealerRoot:f.dealerRoot}),/validated unmodified/);p.profile.business.name='invented';assert.throws(()=>assertRegisteredAdoptionPlan(p,{dealerRoot:f.dealerRoot}),/validated unmodified/);
});
test('first manifest exists only in a six-family candidate produced by the maintained preservation merge',t=>{
 const f=fixture(t),p=f.plan(),target=targetManifestForUpgrade({dealerRoot:f.dealerRoot,manifest:p.manifest,pins:f.pins,targetVariants:registeredAdoptionTarget(p,f.pins).variants,registeredAdoption:p});
 const oldBases=Object.fromEntries(['auto-best','modern'].map(key=>[key,new Map([['package.json',f.baseline.files.get(key+'/package.json')],['src/ui.ts',Buffer.from('export const title="old template wording";\n')]])])),newBases=Object.fromEntries(families.map(key=>[key,new Map([['package.json',f.baseline.files.get(key+'/package.json')??enc({name:key})],['src/ui.ts',Buffer.from('export const title="old template wording";\n')]])]));
 const planned=planDealerUpgrade({dealerRoot:f.dealerRoot,lock:f.lock,oldBases,newBases,targetManifest:target,qualification:f.context,root:f.root,registeredAdoption:p});assert.equal(planned.ready,true);assert.equal(planned.changes.find(r=>r.path==='dealer.json').beforeSha256,null);const manifest=JSON.parse(planned.candidate.get('dealer.json'));assert.deepEqual(manifest.variants.map(v=>v.key),families);assert.equal(manifest.packaging.version,'5');assert.equal(manifest.variants[1].key,'modern');assert.equal(manifest.variants[2].key,'import');assert(planned.candidate.get('modern/src/ui.ts').toString().includes('paid dealer wording'));assert.equal(fs.existsSync(path.join(f.dealerRoot,'dealer.json')),false);
 assert.throws(()=>planDealerUpgrade({dealerRoot:f.dealerRoot,lock:f.lock,oldBases,newBases,targetManifest:p.manifest,qualification:f.context,registeredAdoption:p}),/qualified six-family/);assert.throws(()=>planDealerUpgrade({dealerRoot:f.dealerRoot,lock:f.lock,oldBases,newBases,targetManifest:target,registeredAdoption:p}),/qualified six-family/);
 const candidate=new Map([...f.baseline.files,...planned.candidate,...p.files]);const proposal=createSourcePatch({baseline:f.baseline,candidateFiles:candidate,dealer:f.dealer,sourceRevision:f.context.sourceCommit,contextFileSha256:sha256(enc(f.context))});const restored=verifySourcePatch({baseline:f.baseline,...proposal});assert(restored.files.get('business-facts.json').equals(f.baseline.files.get('business-facts.json')));assert(restored.files.get('carwow/original-stock.json').equals(f.baseline.files.get('carwow/original-stock.json')));assert(restored.files.has(REGISTERED_PROFILE_FILE));assert.equal(assertPreparedMountOwnership(manifest,f.baseline,p).previousPublicRoutes,false);
});
test('raw old bases remain unmounted while the existing native adapter mounts the reviewed new Modern base',async t=>{
 const f=fixture(t),p=f.plan(),temp=path.join(f.root,'native-synthetic'),n=nativeFixture(temp),modern=new Map([...n.files].filter(([name])=>name.startsWith('modern/')).map(([name,b])=>[name.slice(7),b]));
 const old=new Map([['package.json',enc({name:'modern'})],['apps/web/next.config.ts',Buffer.from('export default {basePath:""};')]]),target=registeredAdoptionTarget(p,f.pins);
 const adapted=await adaptPinnedBases({keys:['modern'],oldBases:{modern:old},newBases:{modern},manifest:p.manifest,targetManifest:target,registeredAdoption:p});assert.equal(adapted.adapter,'registered-raw-unmounted-applications->cars-package-v2-native-mounts');assert(adapted.oldBases.modern.get('apps/web/next.config.ts').equals(old.get('apps/web/next.config.ts')));assert.match(adapted.newBases.modern.get('apps/web/lib/locale-configuration.ts').toString(),/carsLocale/);assert.match(adapted.newBases.modern.get('apps/web/lib/cars-locale.ts').toString(),/bg-varna-registered-fixture/);assert.equal(fs.existsSync(path.join(f.dealerRoot,'dealer.json')),false);
});
test('sealed optional derived inputs remain readable by the ordinary maintained profile loader',t=>{
 const f=fixture(t),p=f.plan(),target=registeredAdoptionTarget(p,f.pins);for(const [name,bytes]of p.files)writeFixture(path.join(f.dealerRoot,name),bytes);writeFixture(path.join(f.dealerRoot,'dealer.json'),enc(target));const profile=loadDealerProfile(f.dealerRoot,f.dealer);assert.equal(profile.business.name,'Truthful registered dealer');assert.equal(profile.listings[0].id,'original-stock-123');assert.equal(profile.listings[0].priceAmount,null);assert.equal(profile.rawFacts.business.unknownFact,null);assert(fs.readFileSync(path.join(f.dealerRoot,'business-facts.json')).equals(f.baseline.files.get('business-facts.json')));assert.equal(profile.stockKind,'dated-published-advertisements');
 writeFixture(path.join(f.dealerRoot,REGISTERED_PROFILE_FILE),Buffer.concat([p.files.get(REGISTERED_PROFILE_FILE),Buffer.from(' ')]));assert.throws(()=>loadDealerProfile(f.dealerRoot,f.dealer),/reviewed input bytes changed/);
});
test('a forged mount proof, normalized input binding or post-plan destination change stays rejected',t=>{
 const f=fixture(t),p=f.plan(),target=registeredAdoptionTarget(p,f.pins);assert.throws(()=>assertPreparedMountOwnership(target,f.baseline,{...p}),/validated unmodified/);const swapped=structuredClone(target);[swapped.variants[1],swapped.variants[2]]=[swapped.variants[2],swapped.variants[1]];assert.throws(()=>assertPreparedMountOwnership(swapped,f.baseline,p),/prepared mounts/);writeFixture(path.join(f.dealerRoot,'concurrent.txt'),'keep this new work');assert.throws(()=>assertRegisteredAdoptionPlan(p,{dealerRoot:f.dealerRoot}),/inventory changed/);
});

test('private destination proof cannot be rewritten through mutable caller inputs',t=>{
 const f=fixture(t),p=f.plan();p.baseline.tree='0'.repeat(40);assert.throws(()=>assertRegisteredAdoptionPlan(p,{dealerRoot:f.dealerRoot}),/validated unmodified/);
 const g=fixture(t),q=g.plan();const replacement=Buffer.from('concurrent factual work');g.baseline.files.set('CLIENT.md',replacement);writeFixture(path.join(g.dealerRoot,'CLIENT.md'),replacement);assert.throws(()=>assertRegisteredAdoptionPlan(q,{dealerRoot:g.dealerRoot}),/lease changed/);
 const h=fixture(t),r=h.plan(),target=registeredAdoptionTarget(r,h.pins);assert.throws(()=>assertPreparedMountOwnership(target,{...h.baseline,commit:'0'.repeat(40)},r),/prepared mounts/);r.globalReleaseApproval=true;assert.throws(()=>assertRegisteredAdoptionPlan(r,{dealerRoot:h.dealerRoot}),/validated unmodified/);
});

test('retained clean Git-tree copy receipts prove the same exact old base and cannot hide behind metadata',t=>{
 const f=fixture(t),name='modern/.template/source-manifest.json',value={sourceRepository:'darkapoparka/cars',sourcePath:'templates/modern',sourceCommit:f.receipt.templateSources.modern.revision,sourceTree:f.receipt.templateSources.modern.tree};
 const update=()=>{const bytes=enc(value);writeFixture(path.join(f.dealerRoot,name),bytes);f.baseline.files.set(name,bytes);const existing=f.baseline.entries.findIndex(e=>e.path===name);if(existing>=0)f.baseline.entries.splice(existing,1);f.baseline.entries.push({path:name,mode:'100644',blob:gitObjectId('blob',bytes)});f.baseline.entries.sort((a,b)=>a.path.localeCompare(b.path,'en'));f.baseline.tree=gitTreeId(f.baseline.entries);f.receipt.baseline.tree=f.baseline.tree;f.receipt.provenance.modern.copyReceipt={path:name,sha256:sha256(bytes)};};
 update();assert.equal(f.plan().published,false);value.sourceTree='0'.repeat(40);update();assert.throws(f.plan,/copy receipt does not prove/);value.sourceTree=f.receipt.templateSources.modern.tree;value.git={dirtyStatusRecorded:true};update();assert.throws(f.plan,/dirty copied template base/);
});

test('registered legacy logo alias uses only the exact sealed onLight PNG and satisfies the maintained alias consumer',t=>{
    const f=demoFixture(t);addPublishedBranding(f);const p=f.plan(),run=path.join(f.root,'runtime','logo-alias-run');fs.mkdirSync(run,{recursive:true});const view=materializeRegisteredAssetView(p,{runDirectory:run});
    const light=p.profile.logoContract.assets.onLight,source=path.join(view,light.publicPath.slice(1)),alias=path.join(view,'branding/logo-on-light.png');assert(fs.lstatSync(alias).isFile());assert.equal(sha256(fs.readFileSync(alias)),light.sha256);assert(fs.readFileSync(alias).equals(fs.readFileSync(source)));assertRegisteredAssetView(p,view);
    const candidate=path.join(run,'logo-consumer');writeFixture(path.join(candidate,'src/lib/config/brand.ts'),'export const brand = {logo: "/old.png",logoOnDark: "/old-dark.png"};\n');writeFixture(path.join(candidate,'src/lib/components/Footer.svelte'),'<img src={brand.logo} />\n');
    applyDealerLogoContract({key:'auto-best',oldVariant:path.join(view,'auto-best'),candidate,profile:p.profile});assert(fs.readFileSync(path.join(candidate,'static/assets/images/lead/day-night-logo.png')).equals(fs.readFileSync(source)));assert.match(fs.readFileSync(path.join(candidate,'src/lib/components/Footer.svelte'),'utf8'),/brand.logoOnDark/);assertRegisteredAssetView(p,view);assert.equal(fs.existsSync(path.join(f.dealerRoot,'branding/logo-on-light.png')),false);
  });
  test('registered legacy logo alias refuses missing or changed exact bytes without adopting source',t=>{
    for(const mode of ['missing','changed']){const f=demoFixture(t),p=f.plan(),run=path.join(f.root,'runtime',mode+'-alias-run');fs.mkdirSync(run,{recursive:true});const view=materializeRegisteredAssetView(p,{runDirectory:run}),alias=path.join(view,'branding/logo-on-light.png');if(mode==='missing')fs.unlinkSync(alias);else fs.writeFileSync(alias,Buffer.from('changed PNG bytes'));assert.throws(()=>assertRegisteredAssetView(p,view),/inventory changed|bytes changed/);assert.equal(fs.existsSync(path.join(f.dealerRoot,'dealer.json')),false);assertRegisteredAdoptionPlan(p);}
  });


test('registered WebP asset view retains authenticated originals and never relabels them as a PNG alias',t=>{
 const f=fixture(t),original=f.baseline.files.get('carwow/static/dealer/photo-123.webp');f.personalization.facts.business.logo='/dealer/logo.webp';f.personalization.facts.business.logoDark='/dealer/logo.webp';f.personalization.media[0]={publicPath:'/dealer/logo.webp',sourcePath:'carwow/static/dealer/photo-123.webp',sha256:sha256(original)};f.receipt.personalization.sha256=sha256(enc(f.personalization));
 const p=f.plan(),run=path.join(f.root,'runtime','webp-view-run');fs.mkdirSync(run,{recursive:true});const view=materializeRegisteredAssetView(p,{runDirectory:run});assertRegisteredAssetView(p,view);const actual=fs.readFileSync(path.join(view,'dealer/logo.webp'));assert(actual.equals(original));assert.equal(sha256(actual),p.profile.logoContract.assets.onLight.sha256);assert.equal(fs.existsSync(path.join(view,'branding/logo-on-light.png')),false);assert(f.baseline.files.get('auto-best/static/dealer/logo.png').equals(fs.readFileSync(path.join(f.dealerRoot,'auto-best/static/dealer/logo.png'))));assertRegisteredAdoptionPlan(p);
 fs.appendFileSync(path.join(view,'dealer/logo.webp'),'changed');assert.throws(()=>assertRegisteredAssetView(p,view),/bytes changed/);
});


test('registered WebP asset view preserves an independently authenticated original PNG at the legacy path',t=>{
 const f=fixture(t),webp=f.baseline.files.get('carwow/static/dealer/photo-123.webp'),png=f.baseline.files.get('auto-best/static/dealer/logo.png');f.personalization.facts.business.logo='/dealer/logo.webp';f.personalization.facts.business.logoDark='/dealer/logo.webp';f.personalization.media[0]={publicPath:'/dealer/logo.webp',sourcePath:'carwow/static/dealer/photo-123.webp',sha256:sha256(webp)};f.personalization.media.push({publicPath:'/branding/logo-on-light.png',sourcePath:'auto-best/static/dealer/logo.png',sha256:sha256(png)});f.receipt.personalization.sha256=sha256(enc(f.personalization));const p=f.plan(),run=path.join(f.root,'runtime','webp-original-png-view');fs.mkdirSync(run,{recursive:true});const view=materializeRegisteredAssetView(p,{runDirectory:run});assertRegisteredAssetView(p,view);const retained=fs.readFileSync(path.join(view,'branding/logo-on-light.png'));assert(retained.equals(png));assert(!retained.equals(webp));assert(fs.readFileSync(path.join(view,'dealer/logo.webp')).equals(webp));assertRegisteredAdoptionPlan(p);fs.appendFileSync(path.join(view,'branding/logo-on-light.png'),'changed');assert.throws(()=>assertRegisteredAssetView(p,view),/bytes changed/);
});


test('registered source declares only materialized share-identity roots and preserves the PNG alias view',t=>{
 const f=fixture(t),p=f.plan(),target=registeredAdoptionTarget(p,f.pins);
 assert.deepEqual(target.extraAssets,['dealer']);
 assert.equal(target.shareIdentity.logo.sourcePath,'dealer/logo.png');
 const run=path.join(f.root,'runtime','asset-container-pilot');fs.mkdirSync(run);
 const view=materializeRegisteredAssetView(p,{runDirectory:run});
 for(const root of target.extraAssets)assert(fs.statSync(path.join(view,root)).isDirectory());
 assert(fs.readFileSync(path.join(view,target.shareIdentity.logo.sourcePath)).equals(f.baseline.files.get('auto-best/static/dealer/logo.png')));
});

test('registered WebP source declares its real container without inventing PNG or dealer-brand folders',t=>{
 const f=fixture(t);f.personalization.facts.business.logo='/dealer/logo.webp';f.personalization.facts.business.logoDark='/dealer/logo.webp';f.personalization.media[0].publicPath='/dealer/logo.webp';f.receipt.personalization.sha256=sha256(enc(f.personalization));
 const p=f.plan(),target=registeredAdoptionTarget(p,f.pins);
 assert.deepEqual(target.extraAssets,['dealer']);assert.equal(target.shareIdentity.logo.sourcePath,'dealer/logo.webp');
 const run=path.join(f.root,'runtime','webp-asset-container-pilot');fs.mkdirSync(run);
 const view=materializeRegisteredAssetView(p,{runDirectory:run});
 for(const root of target.extraAssets)assert(fs.statSync(path.join(view,root)).isDirectory());
 assert.equal(fs.existsSync(path.join(view,'branding')),false);assert.equal(fs.existsSync(path.join(view,'dealer-brand')),false);
});


test('per-variant stock media does not become a nonexistent shared source directory',t=>{
 const f=fixture(t);const media=f.personalization.media.find(x=>x.publicPath!==f.personalization.facts.business.logo);assert(media);
 const previous=media.publicPath;media.publicPath='/inventory/photo.webp';for(const item of f.personalization.stock.listings)item.images=item.images.map(x=>x===previous?media.publicPath:x);
 f.receipt.personalization.sha256=sha256(enc(f.personalization));const plan=f.plan(),target=registeredAdoptionTarget(plan,f.pins);
 assert.deepEqual(target.extraAssets,['dealer']);assert.equal(target.extraAssets.includes('inventory'),false);
 const run=path.join(f.root,'runtime','variant-stock-view');fs.mkdirSync(run);const view=materializeRegisteredAssetView(plan,{runDirectory:run});
 assert(fs.readFileSync(path.join(view,'inventory/photo.webp')).equals(f.baseline.files.get(media.sourcePath)));
 assert.equal(target.shareIdentity.logo.sourcePath,'dealer/logo.png');assertRegisteredAdoptionPlan(plan);
});
