import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {filesAt,sha256,writeJson} from './lib/workflow.mjs';
import {SIX_DESIGN_KEYS} from './lib/six-design-release.mjs';
import {canonicalPackJson,createDealerPackComposition,dealerPackCompositionDigest,PACK_CONTENT_IDENTITY_FIELDS,PACK_TARGETS,DEALER_PACK_COMPILED_KIND} from './lib/dealer-pack-artifacts.mjs';
import {artifactInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {assessBundleLimits,inspectDealerPackBundle,loadFleetIdentities,findForeignIdentity,assessPageSnapshot,dealerPackIdentityRequirements,assessDealerPackDesignIdentity,completeDealerPackWelcome,prepareDealerPackScreenshot,readDealerPackDom,observeDealerPackImages,inspectLogoPixels,readFaviconPngs,verifyPackLogoAssets,stockIsDemo,verifyDealerPack,parseDealerPackVerificationArgs} from './verify-dealer-pack.mjs';
import {inspectDealerPackBatch,readDealerPackBatch,parseDeploymentArgs} from './deploy-dealer-single-worker.mjs';
import {dealerPackFabPolicy,fleetDesignFabHashes} from './lib/dealer-pack-switcher-logo.mjs';
import {assessHostedPackSnapshot} from './verify-hosted-dealer-pack.mjs';

const area=t=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-pack-qa-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root;};
const put=(root,name,content)=>{const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof content==='string'||Buffer.isBuffer(content)?content:JSON.stringify(content,null,2)+'\n');};
const variants=SIX_DESIGN_KEYS.map((key,index)=>({key,base:index?'/variant-'+(index+1):'',entry:key==='modern'?'/variant-'+(index+1)+'/cars':index?'/variant-'+(index+1)+'/':'/'}));
const facts={business:{name:'Honest Motors',shortName:'Honest Motors',phone:'+441234567890'}};
const manifest={schemaVersion:1,slug:'honest-motors',packaging:{version:'5'},variants};
const emptyFleet={records:[],coverage:{registryDealers:0,withName:0,withBusinessFacts:0,withPhone:0,missingBusinessFacts:[],missingPublicPhone:[]}};
const execution={kind:'local',id:'11111111-2222-4333-8444-555555555555'};
const sourceReleases=Object.fromEntries(SIX_DESIGN_KEYS.map(key=>[key,{repository:'darkapoparka/cars',path:'templates/'+key,revision:'a'.repeat(40),tree:'b'.repeat(40),digest:'c'.repeat(64)}]));

function bundle(t){
 const root=area(t),base=path.join(root,'runtime/dealer-packs'),directory=path.join(base,'honest-motors/bundle');
 const config={name:'cars-honest-motors',main:'server/worker.mjs',base_dir:'server',compatibility_date:'2026-10-10',compatibility_flags:['nodejs_compat'],workers_dev:true,preview_urls:false,no_bundle:true,find_additional_modules:true,assets:{directory:'./public',binding:'ASSETS',run_worker_first:false}};
 put(directory,'wrangler.json',config);put(directory,'server/worker.mjs','export default {fetch(){return new Response("fixture");}};');put(directory,'server/router.mjs','export default {};');
 for(const key of SIX_DESIGN_KEYS)put(directory,'server/'+key+'/'+(['modern','app','mobile'].includes(key)?'index.js':'index.mjs'),'export default {};');
 put(directory,'public/logo.png','fixture asset bytes');
 const receipt={schemaVersion:1,type:'cars-dealer-pack-single-worker-provider-package',dealer:'honest-motors',sourceCommit:'a'.repeat(40),sourceDigest:'b'.repeat(64),packDigest:'c'.repeat(64),sourceReleases,releaseDigest:sha256(canonicalPackJson(sourceReleases)),execution,
  workerName:config.name,publicOrigin:'https://honest-motors.webpreviews.site',applicationCount:6,workerCount:1,composition:{inProcess:SIX_DESIGN_KEYS,serviceBindings:[]},files:[]};
 const seal=()=>{receipt.files=filesAt(directory,{filter:()=>true}).filter(name=>!['single-worker-receipt.json','artifact-manifest.json'].includes(name)).map(name=>{const bytes=fs.readFileSync(path.join(directory,name));return {path:name,bytes:bytes.length,sha256:sha256(bytes)};});receipt.outputDigest=sha256(JSON.stringify(receipt.files));receipt.serverBytes=receipt.files.filter(row=>row.path.startsWith('server/')).reduce((sum,row)=>sum+row.bytes,0);receipt.assetFiles=receipt.files.filter(row=>row.path.startsWith('public/')).length;put(directory,'single-worker-receipt.json',receipt);artifactInventory(directory,{kind:receipt.type,dealer:receipt.dealer,status:'passed'});};
 seal();const pack={directory:path.join(root,'dealers/honest-motors'),manifest,facts,packDigest:receipt.packDigest,releaseDigest:receipt.releaseDigest};
 return {root,base,directory,receipt,config,seal,pack,options:{bundleRoot:directory,slug:'honest-motors',packDigest:receipt.packDigest,releaseDigest:receipt.releaseDigest,plan:'paid'}};
}

function addComposition(f){
 Object.assign(f.receipt,{toolDigest:'d'.repeat(64),providerOrigin:'https://cars-honest-motors.darkapoparka1.workers.dev',capacityPlan:'paid',qualification:{hostedVerified:false,providerWrites:false}});
 const identity=Object.fromEntries(PACK_CONTENT_IDENTITY_FIELDS.map(key=>[key,f.receipt[key]]));
 const inspected=Object.fromEntries(PACK_TARGETS.map((key,index)=>{
  const originalExecution={kind:'local',id:'original-native-build-'+index},digest=sha256('original-artifact-'+key),compiledDigest=sha256('original-compiled-'+key);
  return [key,{inventory:{kind:DEALER_PACK_COMPILED_KIND,status:'passed',dealer:f.receipt.dealer,key,digest},deploy:{...identity,kind:DEALER_PACK_COMPILED_KIND,dealer:f.receipt.dealer,key,execution:originalExecution,compiledDigest},build:{status:'passed',execution:originalExecution,node:key==='import'?'v24.21.0':key==='karento-best'?'v26.10.0':'v22.23.2'}}];
 }));
 f.receipt.artifacts=Object.fromEntries(Object.entries(inspected).map(([key,value])=>[key,{digest:value.inventory.digest,compiledDigest:value.deploy.compiledDigest}]));
 f.receipt.packComposition=createDealerPackComposition({dealer:f.receipt.dealer,execution:f.receipt.execution,inspected});
 f.receipt.packCompositionDigest=dealerPackCompositionDigest(f.receipt.packComposition);f.seal();return f;
}

function snapshot(){return {url:'http://127.0.0.1:8787/',status:200,contentType:'text/html; charset=utf-8',title:'Honest Motors',text:'Honest Motors offers a sourced selection of vehicles. Browse our public stock, inspect each listing and use the published business contact details.',metadata:'Honest Motors',phones:['tel:01234567890'],images:[{src:'/dealer-brand/logo.png',alt:'Honest Motors',visible:true,loaded:true,dealerLogo:true}],fabMarks:[{src:'data:image/webp;base64,[test fixture]',consumer:'fab',visible:true,loaded:true,dealerFabLogo:true}],designChoices:variants.map(variant=>({key:variant.key,href:variant.entry})),adminLinks:[{href:'https://cars-admin-blue.vercel.app/',target:'_blank',rel:'noopener noreferrer'}],errors:[],brokenImages:[],overflow:0};}
const assess=value=>assessPageSnapshot({snapshot:value,facts,manifest,variant:variants[0],fleet:emptyFleet});

test('platform budgets use uncompressed bytes, inclusive boundaries and explicit Free/Paid asset counts',()=>{
 const files=[{path:'server/worker.mjs',bytes:64*1024**2},{path:'public/large.bin',bytes:25*1024**2}];
 assert.equal(assessBundleLimits(files,'free').status,'passed');
 assert.deepEqual(assessBundleLimits([{...files[0],bytes:64*1024**2+1},files[1]],'paid').violations,['uncompressed-worker-size']);
 assert.deepEqual(assessBundleLimits([files[0],{...files[1],bytes:25*1024**2+1}],'paid').violations,['individual-static-asset-size']);
 const many=[{path:'server/worker.mjs',bytes:1},...Array.from({length:20001},(_,index)=>({path:'public/'+index,bytes:1}))];
 assert.equal(assessBundleLimits(many,'free').status,'failed');assert.equal(assessBundleLimits(many,'paid').status,'passed');
 assert.throws(()=>assessBundleLimits(many),/explicit target plan/);
 assert.equal(assessBundleLimits(files,'paid').planVerified,false);
});

test('a success label cannot replace compiled bytes, family modules, source and execution binding',t=>{
 const f=bundle(t),result=inspectDealerPackBundle(f.options);assert.equal(result.capacity.status,'passed');
 put(f.directory,'single-worker-receipt.json',{...f.receipt,success:true,execution:{kind:'local',id:'../invented'}});assert.throws(()=>inspectDealerPackBundle(f.options),/execution identity/);
 put(f.directory,'single-worker-receipt.json',{...f.receipt,sourceReleases:{}});assert.throws(()=>inspectDealerPackBundle(f.options),/six exact template releases/);
 assert.throws(()=>inspectDealerPackBundle({...f.options,sourceReleases:{}}),/six exact template releases/);
 put(f.directory,'single-worker-receipt.json',f.receipt);fs.unlinkSync(path.join(f.directory,'server/import/index.mjs'));f.seal();assert.throws(()=>inspectDealerPackBundle(f.options),/family or router/);
});

test('the actual composer artifact envelope is accepted and independently authenticates the singleton receipt',t=>{
 const f=bundle(t);assert.doesNotThrow(()=>inspectDealerPackBundle(f.options));
 const file=path.join(f.directory,'artifact-manifest.json'),envelope=JSON.parse(fs.readFileSync(file));
 assert(envelope.files.some(row=>row.path==='single-worker-receipt.json'));
 put(f.directory,'artifact-manifest.json',{...envelope,dealer:'foreign-motors'});assert.throws(()=>inspectDealerPackBundle(f.options),/artifact envelope/);
 put(f.directory,'artifact-manifest.json',envelope);put(f.directory,'single-worker-receipt.json',{...f.receipt,unsealedClaim:true});assert.throws(()=>inspectDealerPackBundle(f.options),/Artifact receipt bytes differ/);
 f.seal();fs.unlinkSync(file);assert.throws(()=>inspectDealerPackBundle(f.options),/artifact envelope/);
});

test('composition proof retains original native events and binds members, runtime and current bundle identity',async t=>{
 const f=addComposition(bundle(t)),context=inspectDealerPackBundle(f.options);
 assert.equal(context.receipt.execution.id,execution.id);assert.equal(context.receipt.packComposition.members.app.execution.id,'original-native-build-3');
 const report=await verifyDealerPack({root:f.root,slug:'honest-motors',bundleRoot:f.directory,plan:'paid',pack:f.pack,fleet:emptyFleet,sharp:{}});
 assert.equal(report.packCompositionDigest,f.receipt.packCompositionDigest,JSON.stringify(report.checks));
 const baseline=structuredClone(f.receipt);
 for(const change of [r=>r.packCompositionDigest='0'.repeat(64),r=>delete r.packComposition,r=>delete r.packCompositionDigest,r=>delete r.artifacts,
  r=>{r.packComposition.members.app.artifactDigest='0'.repeat(64);r.packCompositionDigest=dealerPackCompositionDigest(r.packComposition);},
  r=>{r.packComposition.members.app.node='v99.0.0';},
  r=>{r.packComposition.identity.packDigest='0'.repeat(64);r.packCompositionDigest=dealerPackCompositionDigest(r.packComposition);},
  r=>{r.packComposition.execution={kind:'local',id:'relabeled-composition'};r.packCompositionDigest=dealerPackCompositionDigest(r.packComposition);}]){
  Object.keys(f.receipt).forEach(key=>delete f.receipt[key]);Object.assign(f.receipt,structuredClone(baseline));change(f.receipt);f.seal();
  assert.throws(()=>inspectDealerPackBundle(f.options),/composition/);
 }
});

test('tampered, omitted, undeclared and linked bundle files fail independently of receipt claims',t=>{
 const changed=bundle(t);fs.appendFileSync(path.join(changed.directory,'server/worker.mjs'),'changed');assert.throws(()=>inspectDealerPackBundle(changed.options),/bytes changed/);
 const extra=bundle(t);put(extra.directory,'public/unreviewed.png','extra');assert.throws(()=>inspectDealerPackBundle(extra.options),/undeclared/);
 const missing=bundle(t);fs.unlinkSync(path.join(missing.directory,'public/logo.png'));assert.throws(()=>inspectDealerPackBundle(missing.options),/missing|undeclared/);
 const linked=bundle(t);fs.symlinkSync(path.join(linked.directory,'server/worker.mjs'),path.join(linked.directory,'public/link.js'));assert.throws(()=>inspectDealerPackBundle(linked.options),/link/);
});

test('candidate configuration cannot introduce service bindings, route mutations or build hooks',t=>{
 for(const update of [config=>config.services=[{binding:'OTHER',service:'live-worker'}],config=>config.routes=['*.webpreviews.site/*'],config=>config.build={command:'deploy'},config=>config.assets.run_worker_first=true]){
  const f=bundle(t);update(f.config);put(f.directory,'wrangler.json',f.config);f.seal();assert.throws(()=>inspectDealerPackBundle(f.options),/resources|unexposed|asset-first/);
 }
});

test('local registry facts augment names with public phones and show metadata gaps',t=>{
 const root=area(t);put(root,'clients/foreign-motors/business-facts.json',{business:{name:'Foreign Motors',shortName:'Foreign',phone:'+359888123456'}});
 const result=loadFleetIdentities(root,{dealers:[{slug:'foreign-motors',name:'Foreign Motors',localPath:'clients/foreign-motors'},{slug:'unknown-motors',name:'Unknown Motors'}]},{readGit:false});
 assert.deepEqual(result.records[0].phones,['+359888123456']);assert.equal(result.coverage.withBusinessFacts,1);assert.deepEqual(result.coverage.missingBusinessFacts,['unknown-motors']);
 assert.throws(()=>loadFleetIdentities(root,{dealers:[{slug:'escape',name:'Escape',localPath:'../outside'}]},{readGit:false}),/escapes dealer/);
});

test('public lead metadata supplements only a unique fleet identity and never promotes contact candidates',t=>{
 const root=area(t);put(root,'leads/public.json',{leads:[{id:'gb-foreign',name:'Foreign Motors',publicBusinessContact:{phone:'+441111111111',contactName:'PRIVATE PERSON'},contactCandidates:{phone:'+442222222222'},notes:'PRIVATE'},{id:'gb-unknown',name:'Someone Else',publicBusinessContact:{phone:'+443333333333'}}]});
 const fleet=loadFleetIdentities(root,{dealers:[{id:'gb-foreign',slug:'foreign-motors',name:'Foreign Motors'},{slug:'missing',name:'Missing Motors'}]},{readGit:false});
 assert.equal(fleet.coverage.withName,2);assert.equal(fleet.coverage.withPhone,1);assert.equal(fleet.coverage.withBusinessFacts,0);assert.equal(fleet.coverage.withPublicIdentityEvidence,1);assert.deepEqual(fleet.records[0].phones,['+441111111111']);assert.doesNotMatch(JSON.stringify(fleet.records),/PRIVATE|2222222222|3333333333/);
});

test('unregistered packs participate in fleet leak checks and a malformed neighbor is reported independently',t=>{
 const root=area(t);
 put(root,'dealers/new-motors/business-facts.json',{business:{name:'New Motors',phone:'+441212223333'}});
 put(root,'dealers/broken-motors/business-facts.json','<<<<<<< merge conflict');
 const fleet=loadFleetIdentities(root,{dealers:[]},{readGit:false});
 assert.equal(fleet.coverage.registryDealers,0);assert.equal(fleet.coverage.packDealers,1);
 assert.equal(fleet.coverage.packFactsDiagnostics.length,1);
 const hits=findForeignIdentity({text:'New Motors. Call 0121 222 3333.',ownSlug:'honest-motors',ownFacts:facts,fleet});
 assert.deepEqual(hits.map(row=>row.type),['name','phone']);
});

test('v2 requires the exact active design mark used by the live fleet',()=>{
 const current={...manifest,sourceFormat:'dealer-pack',pack:{schemaVersion:2}},value=snapshot();
 assert.equal(dealerPackFabPolicy(current),'fleet-design-mark-v1');
 const hashes=fleetDesignFabHashes();assert.equal(Object.keys(hashes).length,6);
 value.fabMarks[0].dealerFabLogo=false;value.fabMarks[0].sha256=hashes[variants[0].key];
 const inspect=()=>assessPageSnapshot({snapshot:value,facts,manifest:current,variant:variants[0],fleet:emptyFleet});
 assert.equal(inspect().status,'passed');
 value.fabMarks[0].sha256=hashes[variants[1].key];assert(inspect().findings.includes('fleet-design-fab-logo'));
 value.fabMarks[0].sha256=hashes[variants[0].key];value.fabMarks[0].visible=false;assert(inspect().findings.includes('fleet-design-fab-logo'));
});

test('foreign dealer names and formatted plain-text or tel phones are caught, while the real dealer is allowed',()=>{
 const fleet={records:[{slug:'foreign',names:['Day & Night Auto Group'],phones:['+359877733110']},{slug:'own-alias',names:['Honest Motors'],phones:['+441234567890']}]};
 const hits=findForeignIdentity({text:'Contact Day and Night Auto Group on 0877 733 110.',ownSlug:'honest-motors',ownFacts:facts,fleet});assert.deepEqual(hits.map(row=>row.type),['name','phone']);
 assert.deepEqual(findForeignIdentity({text:'Honest Motors',phones:['tel:01234567890'],ownSlug:'honest-motors',ownFacts:facts,fleet}),[]);
 assert.equal(findForeignIdentity({text:'A public page',phones:['tel:+359877733110'],ownSlug:'honest-motors',ownFacts:facts,fleet})[0].type,'phone');
});

test('complete native fact segmentation preserves all stock text without joining distinct fields into a dealer name',()=>{
 const fleet={records:[{slug:'electricauto-varna',names:['Electric Auto'],phones:['+359877733110']}]},text='Honest Motors\nElectric\nAuto\nAutomatic';
 const segments=[{channel:'body',owner:'body',text:'Honest Motors'},{channel:'vehicle-fact',owner:'li[data-fact="fuel"]',text:'Electric'},{channel:'vehicle-fact',owner:'li[data-fact="transmission"]',text:'Auto\nAutomatic'}];
 const inspect=identityContext=>findForeignIdentity({text,identityContext,ownSlug:manifest.slug,ownFacts:facts,fleet});
 assert.equal(inspect().length,1,'Missing DOM context retains the strict whole-text scan');
 assert.deepEqual(inspect({schemaVersion:1,status:'complete',segments}),[]);
 for(const identityContext of [{schemaVersion:1,status:'incomplete',segments},{schemaVersion:1,status:'complete',segments:segments.slice(0,2)},{schemaVersion:1,status:'complete',segments:[...segments,{channel:'unknown',owner:'li',text:''}]}])assert.equal(inspect(identityContext).length,1);
 assert.equal(findForeignIdentity({text:text.replace('Motors','Motors!'),identityContext:{schemaVersion:1,status:'complete',segments},ownSlug:manifest.slug,ownFacts:facts,fleet}).length,1,'Coverage may normalize whitespace but cannot drop punctuation or other visible text');
 const value='Honest Motors\nElectric Auto',single={schemaVersion:1,status:'complete',segments:[segments[0],{channel:'vehicle-fact',owner:'li[data-fact="fuel"]',text:'Electric Auto'}]};
 const hit=findForeignIdentity({text:value,identityContext:single,ownSlug:manifest.slug,ownFacts:facts,fleet})[0];
 assert.equal(hit.type,'name');assert.equal(hit.context.channel,'vehicle-fact');assert.equal(hit.context.matchedText,'Electric Auto');assert.match(hit.context.owner,/fuel/);
 for(const update of [{phones:['tel:+359877733110']},{text:text+'\nCall +359 877 733 110'}])assert(findForeignIdentity({text,identityContext:{schemaVersion:1,status:'complete',segments},ownSlug:manifest.slug,ownFacts:facts,fleet,...update}).some(row=>row.type==='phone'));
});

test('segmented stock cannot hide a foreign name in page copy, metadata, links or a visible logo alt',()=>{
 const fleet={records:[{slug:'electricauto-varna',names:['Electric Auto'],phones:[]}]};
 for(const [channel,change]of [['body',page=>{page.text+='\nElectric Auto';}],['metadata',page=>{page.metadata='Electric Auto';}],['link-aria-label',page=>{page.identityLinks=[{channel:'link-aria-label',owner:'a.foreign-business',text:'Visit Electric Auto'}];}],['image-alt',page=>{page.images.push({src:'/foreign-logo.png',alt:'Electric Auto',visible:true,loaded:true});}]]){
  const page=snapshot();change(page);page.identityContext={schemaVersion:1,status:'complete',segments:[{channel:'body',owner:'body',text:page.text}]};
  const result=assessPageSnapshot({snapshot:page,facts,manifest,variant:variants[0],fleet});
  assert(result.findings.includes('foreign-dealer-identity'),channel);assert.equal(result.leaks[0].context.channel,channel);assert.match(result.leaks[0].context.text,/Electric Auto/);
 }
});

test('real Modern desktop showroom fact ownership separates Electric and Auto without hiding foreign identity',()=>{
 const native=fs.readFileSync(new URL('../templates/modern/packages/marketplace-ui/components/vehicle-card-content.tsx',import.meta.url),'utf8');
 assert.match(native,/<ul\s+aria-label=\{getVehicleCardCopy\(locale\)\.specs\}\s+data-slot="showroom-vehicle-facts"/);assert.match(native,/<li\s+aria-label=\{fact\.displayValue \? fact\.value : undefined\}\s+data-fact=\{fact\.id\}/);
 const text=value=>({nodeType:3,nodeValue:value}),make=(tag,attributes={},children=[])=>{const element={nodeType:1,tagName:tag.toUpperCase(),attributes,childNodes:children,parentElement:null,style:{display:tag==='span'?'inline':tag==='li'?'list-item':'block',visibility:'visible',opacity:'1'},getAttribute:name=>attributes[name]??null,getClientRects:()=>[{}],getBoundingClientRect:()=>({width:100,height:25}),getRootNode:()=>document};for(const child of children)child.parentElement=element;Object.defineProperty(element,'innerText',{get:()=>children.map(child=>child.nodeType===3?child.nodeValue:child.innerText).join(tag==='ul'||tag==='body'?'\n':'')});element.matches=selector=>selector.split(',').some(part=>{part=part.trim();if(part==='[data-slot="showroom-vehicle-facts"] > li[data-fact]')return tag==='li'&&attributes['data-fact']&&element.parentElement?.attributes['data-slot']==='showroom-vehicle-facts';return part.toUpperCase()===element.tagName;});element.querySelector=selector=>{for(const child of children)if(child.nodeType===1){if(child.matches(selector))return child;const nested=child.querySelector(selector);if(nested)return nested;}return null;};return element;};
 const fuel=make('li',{'data-fact':'fuel'},[make('span',{},[text('Electric')])]),transmission=make('li',{'data-fact':'transmission'},[make('span',{},[text('Auto')])]),factsList=make('ul',{'data-slot':'showroom-vehicle-facts','aria-label':'Vehicle specifications'},[fuel,transmission]),heading=make('h1',{},[text('Honest Motors')]),body=make('body',{},[heading,factsList]);
 const elements=()=>{const result=[];const visit=node=>{if(node.nodeType!==1)return;result.push(node);node.childNodes.forEach(visit);};visit(body);return result;};
 const document={body,title:'Honest Motors',documentElement:{scrollWidth:1280},querySelectorAll:selector=>selector==='*'?elements():[]};
 const read=()=>vm.runInNewContext('('+readDealerPackDom.toString()+')()',{document,location:{href:'http://127.0.0.1:8787/variant-2/en/cars'},innerWidth:1280,getComputedStyle:node=>node.style}),fleet={records:[{slug:'electricauto-varna',names:['Electric Auto'],phones:[]}]};
 const leaks=value=>findForeignIdentity({...value,ownSlug:manifest.slug,ownFacts:facts,fleet});
 const result=read();assert.equal(leaks({...result,identityContext:undefined}).length,1,'The old whole-body/native-selector gap reproduces the actual desktop failure');assert.equal(result.identityContext.status,'complete');assert.deepEqual(Array.from(result.identityContext.segments.filter(row=>row.channel==='vehicle-fact'),row=>row.text),['Electric','Auto']);assert.deepEqual(leaks(result),[]);assert.match(result.text,/Electric\s+Auto/,'All original vehicle text remains present');
 heading.childNodes[0].nodeValue='Honest Motors and Electric Auto';assert.equal(leaks(read())[0].context.channel,'body');heading.childNodes[0].nodeValue='Honest Motors';
 fuel.childNodes[0].childNodes[0].nodeValue='Electric Auto';assert.equal(leaks(read())[0].context.channel,'vehicle-fact');fuel.childNodes[0].childNodes[0].nodeValue='Electric';
 fuel.childNodes.push(make('a',{},[text(' Electric Auto')]));assert.equal(read().identityContext.status,'unavailable');assert.equal(leaks(read()).length,1,'A foreign link inside a fact keeps the strict fallback');
});

test('exact retained vehicle titles in native owners are distinct from dealer identity without dropping other text',()=>{
 const stock=JSON.parse(fs.readFileSync(new URL('../dealers/millions-auto-cars/stock.json',import.meta.url),'utf8')),record=stock.records.find(row=>row.id==='public-listing-2'),before=JSON.stringify(stock);
 assert.equal(record.title,'2019 MG ZS 44.5kWh Exclusive Auto');assert.equal(record.sourceUrl,'https://www.autotrader.co.uk/car-details/202607124111384');assert.equal(record.observedAt,'2026-10-19T17:53:14.128521Z');
 const fleet={records:[{slug:'exclusive-auto-varna',names:['Exclusive Auto'],phones:['+359877733110']}]},vehicle={vehicleOwner:'modern',vehicleHref:'http://127.0.0.1:8787/variant-2/en/listing/mg-zs-2019-public-listing-2',vehicleOrigin:'http://127.0.0.1:8787'};
 const title=text=>({channel:'vehicle-title',owner:'h2[data-slot="vehicle-card-title"]',text,...vehicle}),context=segments=>({schemaVersion:1,status:'complete',segments}),body={channel:'body',owner:'body',text:'Honest Motors'};
 const read=(segments,extra={})=>findForeignIdentity({text:segments.map(row=>row.text).join('\n'),identityContext:context(segments),ownSlug:manifest.slug,ownFacts:facts,ownStock:stock,fleet,...extra});
 for(const text of [record.title,'MG ZS 44.5kWh Exclusive Auto','ZS 44.5kWh Exclusive Auto'])assert.deepEqual(read([body,title(text)]),[],'Complete selected Modern native display form');
 for(const [vehicleOwner,route]of [['auto-best','/en/listing-detail-v1/2'],['modern','/variant-2/en/listing/mg-zs-2019-public-listing-2'],['import','/variant-3/inventory/public-listing-2'],['import-site','/variant-3/inventory/public-listing-2?lang=en'],['signature','/variant-6/vehicle?id=public-listing-2'],['signature-mobile','/variant-6/vehicle?id=public-listing-2&lang=en']]){
  const binding={...vehicle,vehicleOwner,vehicleHref:vehicle.vehicleOrigin+route};assert.deepEqual(read([body,{...title(record.title),...binding}],{additionalText:[{channel:'image-alt',owner:'native stock photograph',text:record.title,vehiclePhoto:vehicle.vehicleOrigin+record.images[0],...binding}]}),[],vehicleOwner+' actual maintained route identity');
  assert(read([body,{...title(record.title),...binding,vehicleHref:binding.vehicleHref.replace(/(?:public-listing-2|\/2)(?=[?&]|$)/,'other')}]).some(row=>row.type==='name'),vehicleOwner+' refuses a different source record');
 }
 assert.deepEqual(read([body,title(record.title)],{additionalText:[{channel:'link-aria-label',owner:'a native image link',text:'View '+record.title,...vehicle},{channel:'image-alt',owner:'img native vehicle photo',text:record.title,vehiclePhoto:'http://127.0.0.1:8787/variant-2/dealer-stock/public-2.jpg',...vehicle}]}),[]);
 for(const update of [{ownStock:undefined},{identityContext:undefined},{identityContext:{schemaVersion:1,status:'incomplete',segments:[body,title(record.title)]}}])assert(read([body,title(record.title)],update).some(row=>row.type==='name'));
 for(const segment of [{...title(record.title),channel:'body'},{...title(record.title),vehicleOwner:'unowned'},title(record.title+' — Exclusive Auto'),title('2019 MG ZS Exclusive Auto'),title('Exclusive Auto'),{...title(record.title),vehicleHref:'https://foreign.example/listing/mg-zs-2019-public-listing-2'},{...title(record.title),vehicleHref:'http://127.0.0.1:8787/variant-2/en/listing/another-car'}])assert(read([body,segment]).some(row=>row.type==='name'));
 for(const channel of ['body','metadata','link-aria-label','image-alt'])assert(read([body,title(record.title)],{additionalText:[{channel,owner:'ordinary page branding',text:record.title}]}).some(row=>row.type==='name'),channel+' cannot borrow source ownership');
 for(const additionalText of [[{channel:'link-aria-label',owner:'a native',text:'View '+record.title+' / Exclusive Auto',...vehicle}],[{channel:'image-alt',owner:'img native',text:record.title,vehiclePhoto:'http://127.0.0.1:8787/dealer-stock/public-1.jpg',...vehicle}],[{channel:'image-alt',owner:'img native',text:record.title,vehiclePhoto:'https://foreign.example/dealer-stock/public-2.jpg',...vehicle}],[{channel:'metadata',owner:'title',text:record.title,...vehicle}]])assert(read([body,title(record.title)],{additionalText}).some(row=>row.type==='name'));
 assert(read([body,title(record.title)],{phones:['tel:+359877733110']}).some(row=>row.type==='phone'));
 assert(read([body,title(record.title),{channel:'body',owner:'footer',text:'Exclusive Auto'}]).some(row=>row.context?.owner==='footer'));
 assert.equal(JSON.stringify(stock),before,'Retained dated stock and title stay unchanged');
});

test('hosted identity uses source-bound real vehicle trims and still rejects foreign dealership copy',()=>{
  const stock=JSON.parse(fs.readFileSync(new URL('../dealers/millions-auto-cars/stock.json',import.meta.url),'utf8'));
  const listing=stock.records.find(row=>row.id==='public-listing-2');
  assert.equal(listing.title,'2019 MG ZS 44.5kWh Exclusive Auto');
  const page=snapshot(),origin='http://127.0.0.1:8787',body=page.text;
  page.text+='\n'+listing.title;
  page.identityContext={schemaVersion:1,status:'complete',segments:[
    {channel:'body',owner:'body',text:body},
    {channel:'vehicle-title',owner:'h3.dn-vehicle-card__name',text:listing.title,
      vehicleOwner:'auto-best',vehicleHref:origin+'/en/listing-detail-v1/2',vehicleOrigin:origin},
  ]};
  const pack={facts,stock,manifest},fleet={records:[{slug:'exclusive-auto-varna',names:['Exclusive Auto'],phones:[]}]};
  const inspect=()=>assessHostedPackSnapshot({snapshot:page,pack,variant:variants[0],fleet,label:'home'});
  assert.equal(inspect().status,'passed','Authenticated source listing is not another dealership');
  page.metadata='Exclusive Auto dealership';
  assert(inspect().findings.includes('foreign-dealer-identity'),'Page branding is still strictly scanned');
  page.metadata='Honest Motors';
  page.identityContext.segments[1].vehicleHref=origin+'/en/listing-detail-v1/1';
  assert(inspect().findings.includes('foreign-dealer-identity'),'Another listing cannot borrow the source exception');
});

test('route assessment keeps native stock photos separate from ordinary images and dealer logos',()=>{
 const stock={records:[{title:'2019 MG ZS 44.5kWh Exclusive Auto',make:'MG',model:'ZS',year:2019,images:['/dealer-stock/public-2.jpg']}]},title=stock.records[0].title,fleet={records:[{slug:'exclusive-auto-varna',names:['Exclusive Auto'],phones:[]}]};
 const vehicle={vehicleOwner:'auto-best',vehicleHref:'http://127.0.0.1:8787/en/listing-detail-v1/1',vehicleOrigin:'http://127.0.0.1:8787'},page=snapshot();page.text+='\n'+title;page.identityContext={schemaVersion:1,status:'complete',segments:[{channel:'body',owner:'body',text:snapshot().text},{channel:'vehicle-title',owner:'h3.dn-vehicle-card__name',text:title,...vehicle}]};page.images.push({src:'http://127.0.0.1:8787/dealer-stock/public-2.jpg',alt:title,visible:true,loaded:true,...vehicle});
 const read=()=>assessPageSnapshot({snapshot:page,facts,stock,manifest,variant:variants[0],fleet});assert.equal(read().status,'passed');
 page.images.at(-1).dealerLogo=true;assert(read().findings.includes('foreign-dealer-identity'),'A logo cannot use a stock-photo exception');page.images.at(-1).dealerLogo=false;
 delete page.images.at(-1).vehicleOwner;assert(read().findings.includes('foreign-dealer-identity'),'An ordinary image cannot use a stock-photo exception');
});

test('HTTP 200, an unrendered logo or a five-design FAB cannot masquerade as successful dealer QA',()=>{
 assert.equal(assess(snapshot()).status,'passed');
 for(const [update,failure] of [[page=>page.status=500,'route-response'],[page=>page.text='OK','route-response'],[page=>page.images[0].loaded=false,'dealer-logo'],[page=>page.images[0].dealerLogo=false,'dealer-logo'],[page=>page.phones=['tel:+359888123456'],'dealer-phone'],[page=>page.designChoices.pop(),'six-design-fab'],[page=>page.designChoices.push(page.designChoices[0]),'six-design-fab'],[page=>page.designChoices[1].href='https://foreign.example/','fab-destination'],[page=>page.adminLinks=[],'shared-admin-link']]){
  const value=snapshot();update(value);assert(assess(value).findings.includes(failure),failure);
 }
});

test('missing optional own phone stays unknown; inherited dealer phone still fails independently',()=>{
 const value=snapshot();value.phones=[];
 const result=assessPageSnapshot({snapshot:value,facts:{business:{name:'Honest Motors'}},manifest,variant:variants[0],fleet:emptyFleet});assert.equal(result.phone,'not-provided');assert(!result.findings.includes('dealer-phone'));
 value.phones=['tel:+359888123456'];const fleet={records:[{slug:'foreign',names:['Foreign Motors'],phones:['+359888123456']}]};
 assert(assessPageSnapshot({snapshot:value,facts:{business:{name:'Honest Motors'}},manifest,variant:variants[0],fleet}).findings.includes('foreign-dealer-identity'));
 const unknown=snapshot();unknown.phones.push('tel:+447777777777');assert(assess(unknown).findings.includes('unexpected-business-phone'));
 const visible=snapshot();visible.phones=[];visible.text+=' Call 0121 555 0123.';assert.equal(assessPageSnapshot({snapshot:visible,facts:{business:{name:'Honest Motors',phone:'+441215550123'}},manifest,variant:variants[0],fleet:emptyFleet}).status,'passed');
});

const assessJourney=(value,label,extra={})=>assessPageSnapshot({snapshot:value,facts,manifest,variant:variants[0],fleet:emptyFleet,identityRequirements:dealerPackIdentityRequirements(label),...extra});
const withoutPageIdentity=()=>{const value=snapshot();value.text='Browse the public vehicle catalogue, inspect each listing, and follow the contact navigation to find the sourced dealership details.';value.images=[];value.phones=[];return value;};

test('home policy requires sourced page name and loaded reviewed page logo while recording an unobserved phone honestly',()=>{
 const home=snapshot();home.phones=[];const result=assessJourney(home,'home');assert.equal(result.status,'passed');
 assert.deepEqual(result.identity.required,{name:true,phone:false,logo:true});assert.deepEqual(result.identity.observed,{name:true,phone:false,logo:true});assert.equal(result.phone,'not-observed');
 for(const [change,failure] of [[row=>{row.text=withoutPageIdentity().text;row.images[0].alt='Another dealership';},'dealer-name'],[row=>row.images[0].dealerLogo=false,'dealer-logo'],[row=>row.images[0].loaded=false,'dealer-logo'],[row=>row.images[0].consumer='fab','dealer-logo']]){
  const value=structuredClone(home);change(value);assert(assessJourney(value,'home').findings.includes(failure),failure);
 }
 assert(assess(home).findings.includes('dealer-phone'),'Direct callers must retain the strict default');
});

test('contact and inner-route policies preserve own-phone and foreign-identity enforcement without inventing page chrome',()=>{
 const contact=withoutPageIdentity();contact.phones=['tel:01234567890'];const result=assessJourney(contact,'contact');assert.equal(result.status,'passed');
 assert.deepEqual(result.identity.required,{name:false,phone:true,logo:false});assert.deepEqual(result.identity.observed,{name:false,phone:true,logo:false});assert.equal(result.phone,'observed');
 for(const phone of [null,'tel:+359888123456']){const value=structuredClone(contact);value.phones=phone?[phone]:[];assert(assessJourney(value,'contact').findings.includes('dealer-phone'));}
 for(const label of ['inventory','detail']){
  const value=withoutPageIdentity();assert.equal(assessJourney(value,label).status,'passed');
  assert.deepEqual(assessJourney(value,label).identity.required,{name:false,phone:false,logo:false});
  value.phones=['tel:+447777777777'];assert(assessJourney(value,label).findings.includes('unexpected-business-phone'));
  value.phones=[];value.text+=' Foreign Motors.';
  assert(assessJourney(value,label,{fleet:{records:[{slug:'foreign',names:['Foreign Motors'],phones:[]}]}}).findings.includes('foreign-dealer-identity'));
  value.text+=' Lorem ipsum.';assert(assessJourney(value,label).findings.includes('placeholder-copy'));
  value.status=500;value.errors=['Real hydration failure'];value.brokenImages=['/broken.png'];value.designChoices=[];value.adminLinks=[];
  const findings=assessJourney(value,label).findings;for(const finding of ['route-response','browser-runtime-error','broken-image','six-design-fab','shared-admin-link'])assert(findings.includes(finding),finding);
 }
 assert.deepEqual(assess(withoutPageIdentity()).findings,['dealer-name','dealer-phone','dealer-logo']);
 assert.throws(()=>dealerPackIdentityRequirements('unreviewed-route'),/Unknown dealer identity/);
 assert.throws(()=>assessPageSnapshot({snapshot:contact,facts,manifest,variant:variants[0],fleet:emptyFleet,identityRequirements:{phone:false}}),/explicitly name/);
});

test('a hidden own phone cannot satisfy contact identity but every hidden foreign tel still fails the leak boundary',()=>{
 const value=withoutPageIdentity();value.phones=['tel:01234567890'];value.visiblePhones=[];
 const result=assessJourney(value,'contact');assert(result.findings.includes('dealer-phone'));assert.equal(result.identity.observed.phone,false);assert.equal(result.phone,'not-observed');
 value.visiblePhones=['tel:01234567890'];assert.equal(assessJourney(value,'contact').status,'passed');
 value.visiblePhones=[];value.phones.push('tel:+359888123456');
 const hidden=assessJourney(value,'inventory',{fleet:{records:[{slug:'foreign',names:['Foreign Motors'],phones:['+359888123456']}]}});
 assert(hidden.findings.includes('unexpected-business-phone'));assert(hidden.findings.includes('foreign-dealer-identity'));
 const compatibility=withoutPageIdentity();compatibility.phones=['tel:01234567890'];assert.equal(assessJourney(compatibility,'contact').identity.observed.phone,true);
});

test('each design identity proof requires all three real homes and its actual sourced contact observation',()=>{
 for(const variant of variants){
  const make=(label,width)=>{const value=snapshot();value.url=new URL(variant.entry,'http://127.0.0.1:8787').href;return {...assessPageSnapshot({snapshot:value,facts,manifest,variant,fleet:emptyFleet,identityRequirements:dealerPackIdentityRequirements(label)}),label,width};};
  const routes=[...[320,390,1280].map(width=>make('home',width)),make('contact',390)],options={routes,variant,facts};
  assert.equal(assessDealerPackDesignIdentity(options).status,'passed');
  for(const mutate of [rows=>rows.splice(0,1),rows=>rows.push(structuredClone(rows[0])),rows=>rows[0].identity.observed.name=false,rows=>rows[1].identity.observed.logo=false,rows=>rows[3].identity.observed.phone=false,rows=>rows[3].identity.required.phone=false,rows=>rows[3].status='failed']){
   const changed=structuredClone(routes);mutate(changed);assert.equal(assessDealerPackDesignIdentity({...options,routes:changed}).status,'failed');
  }
  const other=variants.find(row=>row.key!==variant.key),redirected=snapshot();redirected.url=new URL(other.entry,'http://127.0.0.1:8787').href;
  assert(assessPageSnapshot({snapshot:redirected,facts,manifest,variant,fleet:emptyFleet,identityRequirements:dealerPackIdentityRequirements('home')}).findings.includes('design-route'));
  const noPhone={business:{name:facts.business.name}},unknown=structuredClone(routes);unknown.forEach(row=>row.identity.phoneProvided=false);unknown[3].identity.required.phone=false;unknown[3].identity.observed.phone=false;
  assert.equal(assessDealerPackDesignIdentity({routes:unknown,variant,facts:noPhone}).phone,'not-provided');assert.equal(assessDealerPackDesignIdentity({routes:unknown,variant,facts:noPhone}).status,'passed');
 }
});

test('a reviewed page logo cannot substitute for the loaded dealer FAB mark on any route',()=>{
 for(const label of ['home','home-controls','inventory','detail','contact'])for(const mutate of [row=>row.fabMarks=[],row=>row.fabMarks[0].dealerFabLogo=false,row=>row.fabMarks[0].loaded=false,row=>row.fabMarks[0].visible=false,row=>row.fabMarks.push({...row.fabMarks[0]})]){
  const value=snapshot();mutate(value);assert(assessJourney(value,label).findings.includes('dealer-fab-logo'),label);
 }
 const value=withoutPageIdentity();value.images=[{consumer:'fab',alt:'Honest Motors',visible:true,loaded:true,dealerLogo:true}];
 const result=assessJourney(value,'home');assert(result.findings.includes('dealer-name'));assert(result.findings.includes('dealer-logo'));
});

test('rendered image bytes admit retained aliases and inline reviewed marks but reject generic template and wrong-surface FABs',async()=>{
 const bytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jB58AAAAASUVORK5CYII=','base64'),digest=sha256(bytes),wrongSurface=Buffer.concat([bytes,Buffer.from('different reviewed role')]),wrongDigest=sha256(wrongSurface);
 const source=fs.readFileSync(new URL('./publishing/preview-switcher.js',import.meta.url),'utf8'),generic=JSON.parse(source.match(/const templateLogos = (\{[^\n]+\});/)[1]).app;
 const requests=[],options={origin:'http://127.0.0.1:8787',logoHashes:new Set([digest,wrongDigest]),fabLogoHashes:new Set([digest]),logoPaths:new Set(['/native-assets/reviewed-identity.png']),fetchImage:async url=>{requests.push(String(url));return {ok:true,arrayBuffer:async()=>bytes};}};
 const image=(src,consumer='fab')=>({src,consumer,visible:true,loaded:true});
 const images=[image('data:image/png;base64,'+bytes.toString('base64')),image(generic),image('data:image/png;base64,'+wrongSurface.toString('base64')),image('/native-assets/reviewed-identity.png','page'),image('/_next/image?url=%2Fnative-assets%2Freviewed-identity.png&w=64','page'),image('https://foreign.example/native-assets/reviewed-identity.png'),image('/stock/vehicle.jpg','page'),{...image('data:image/png;base64,'+bytes.toString('base64')),loaded:false}];
 await observeDealerPackImages(images,options);
 assert.equal(images[0].dealerFabLogo,true);assert.equal(images[0].sha256,digest);
 assert.equal(images[1].dealerFabLogo,false);assert.notEqual(images[1].sha256,digest);
 assert.equal(images[2].dealerLogo,true);assert.equal(images[2].dealerFabLogo,false,'A white-on-dark role cannot satisfy the white FAB surface');
 assert.equal(images[3].dealerLogo,true);assert.equal(images[4].dealerLogo,true);assert.equal(requests.length,1,'Normalized native image aliases share the exact fetched bytes');
 for(const index of [5,6,7])assert.equal(images[index].dealerLogo,false);
 const forged=[image('data:image/svg+xml;base64,'+bytes.toString('base64')),image('data:image/png;base64,not-valid@@')];await observeDealerPackImages(forged,options);assert(forged.every(row=>row.sha256===null&&!row.dealerFabLogo));
});

function welcomeFixture(key,locale,{present=true,blocked=false,changeLocale=false}={}) {
 const calls=[];let dialogOpen=present&&['auto-best','modern','import'].includes(key),welcomeOpen=present&&key==='app',documentLocale=locale;
 const page={locator(selector){
  if(selector==='html')return {getAttribute:async name=>{assert.equal(name,'lang');calls.push('read-locale');return documentLocale;}};
  if(selector==='dialog[data-locale-dialog][data-locale-ready="true"]')return {waitFor:async options=>{assert.deepEqual(options,{state:'attached',timeout:15000});calls.push('native-ready');}};
  if(selector==='dialog[data-locale-dialog][open]')return {isVisible:async()=>dialogOpen,getByRole(role,options){assert.equal(role,'button');assert.deepEqual(options,{name:locale.startsWith('bg')?'Не сега':'Not now',exact:true});return {click:async options=>{assert.deepEqual(options,{timeout:10000});calls.push('native-not-now');if(blocked)throw Error('Native button remains blocked');dialogOpen=false;if(changeLocale)documentLocale='bg';}};},waitFor:async options=>{assert.deepEqual(options,{state:'hidden',timeout:10000});assert.equal(dialogOpen,false);calls.push('native-hidden');}};
  if(selector==='[data-welcome-sheet][role="dialog"]')return {isVisible:async()=>welcomeOpen,getByRole(role,options){assert.equal(role,'button');assert.deepEqual(options,{name:locale.startsWith('bg')?'Затвори приветствието':'Close welcome',exact:true});return {click:async(...args)=>{assert.deepEqual(args,[]);calls.push('maintained-close-welcome');if(blocked)throw Error('Native button remains blocked');welcomeOpen=false;}};}};
  if(selector==='[data-welcome-overlay]')return {waitFor:async options=>{assert.deepEqual(options,{state:'hidden'});assert.equal(welcomeOpen,false);calls.push('welcome-hidden');}};
  throw Error('Unexpected selector '+selector);
 }};
 return {page,calls};
}

test('all native welcome families use real localized controls and preserve the current document language',async()=>{
 for(const locale of ['en','bg','en-GB'])for(const key of SIX_DESIGN_KEYS){
  const f=welcomeFixture(key,locale),result=await completeDealerPackWelcome(f.page,{key});
  assert.equal(result.status,'passed');assert.equal(result.documentLocale,locale);assert.equal(result.localeChanged,false);
  if(['auto-best','modern','import'].includes(key)){assert(f.calls.indexOf('native-ready')<f.calls.indexOf('native-not-now'));assert(f.calls.includes('native-hidden'));assert.equal(result.actions[0].action,'dismiss');}
  else if(key==='app'){assert(f.calls.includes('maintained-close-welcome'));assert(f.calls.includes('welcome-hidden'));}
  else assert.deepEqual(result.actions,[]);
 }
 const absent=welcomeFixture('modern','en',{present:false});assert.deepEqual((await completeDealerPackWelcome(absent.page,{key:'modern'})).actions,[]);assert(!absent.calls.includes('native-not-now'));
 const unsupported=welcomeFixture('modern','de');await assert.rejects(completeDealerPackWelcome(unsupported.page,{key:'modern'}),/Unsupported native document locale/);assert.deepEqual(unsupported.calls,['read-locale']);
 for(const key of ['auto-best','modern','import','app'])await assert.rejects(completeDealerPackWelcome(welcomeFixture(key,'en',{blocked:true}).page,{key}),/remains blocked/);
 await assert.rejects(completeDealerPackWelcome(welcomeFixture('modern','en',{changeLocale:true}).page,{key:'modern'}),/changed the document locale/);
});

test('closed hydrated native locale dialogs pass without reopening or changing language',async()=>{
 for(const key of ['auto-best','modern','import']){
  const f=welcomeFixture(key,'bg',{present:false}),result=await completeDealerPackWelcome(f.page,{key});
  assert.equal(result.status,'passed');assert.equal(result.documentLocale,'bg');assert.deepEqual(result.actions,[]);
  assert(f.calls.includes('native-ready'));assert(!f.calls.includes('native-not-now'));
 }
});

test('missing or unhydrated native locale dialogs retain failure-time state and never pass as closed',async()=>{
 for(const dialogs of [[],[{ready:'false',open:false,visible:false}],[{ready:'false',open:true,visible:true}]]){
  const f=welcomeFixture('auto-best','en',{present:false}),locator=f.page.locator,timeout=new Error('locator.waitFor: Timeout 15000ms exceeded');
  f.page.locator=selector=>selector==='dialog[data-locale-dialog][data-locale-ready="true"]'?{waitFor:async options=>{
   assert.deepEqual(options,{state:'attached',timeout:15000});throw timeout;
  }}:locator(selector);
  f.page.evaluate=async fn=>vm.runInNewContext('('+fn.toString()+')()',{
   location:{href:'https://honest-motors.webpreviews.site/bg'},document:{documentElement:{lang:'bg'},readyState:'complete',
    querySelectorAll:selector=>{assert.equal(selector,'dialog[data-locale-dialog]');return dialogs.map(row=>({open:row.open,getAttribute:name=>{assert.equal(name,'data-locale-ready');return row.ready},checkVisibility:()=>row.visible}));}}
  });
  await assert.rejects(completeDealerPackWelcome(f.page,{key:'auto-best'}),error=>{
   assert.equal(error.cause,timeout);assert.match(error.message,/Native locale readiness failed: locator\.waitFor: Timeout 15000ms exceeded/);
   assert.deepEqual(JSON.parse(JSON.stringify(error.nativeWelcome)),{design:'auto-best',url:'https://honest-motors.webpreviews.site/bg',documentLocale:'bg',readyState:'complete',dialogCount:dialogs.length,dialogs});
   assert(!f.calls.includes('native-not-now'));assert(!f.calls.includes('native-hidden'));return true;
  });
 }
});

test('a failed native locale state observation preserves the original readiness failure',async()=>{
 const f=welcomeFixture('auto-best','en'),locator=f.page.locator,timeout=new Error('readiness deadline exceeded');
 f.page.locator=selector=>selector==='dialog[data-locale-dialog][data-locale-ready="true"]'?{waitFor:async()=>{throw timeout}}:locator(selector);
 f.page.evaluate=async()=>{throw Error('Execution context was destroyed')};
 await assert.rejects(completeDealerPackWelcome(f.page,{key:'auto-best'}),error=>{
  assert.equal(error.cause,timeout);assert.deepEqual(error.nativeWelcome,{design:'auto-best',observationError:'Execution context was destroyed'});
  assert.match(error.message,/readiness deadline exceeded/);assert(!f.calls.includes('native-not-now'));return true;
 });
});

test('preference dismissal selectors remain bound to the retained native English and Bulgarian catalogues',()=>{
 for(const relative of ['templates/auto-best/src/lib/locale/catalog.ts','templates/modern/packages/internationalization/preferences-messages.ts']){
  const text=fs.readFileSync(new URL('../'+relative,import.meta.url),'utf8');assert.match(text,/"locale\.dismiss": "Not now"/);assert.match(text,/"locale\.dismiss": "Не сега"/);
 }
 const text=fs.readFileSync(new URL('../templates/import/src/lib/locale/messages.ts',import.meta.url),'utf8');assert.match(text,/dismiss: 'Not now'/);assert.match(text,/dismiss: 'Не сега'/);
});

test('the real DOM observer distinguishes the active shadow FAB from hidden template cards and native page logos',()=>{
 const make=(tagName,values={})=>({tagName,style:{display:'block',visibility:'visible',opacity:'1'},parentElement:null,getClientRects:()=>[{}],getBoundingClientRect:()=>({width:44,height:25}),getRootNode:()=>document,...values});
 const body=make('BODY',{innerText:'Honest Motors public website'}),host=make('DEALER-DESIGN-SWITCHER',{parentElement:body}),native=make('IMG',{parentElement:body,src:'/native-logo.png',currentSrc:'',alt:'Honest Motors',complete:true,naturalWidth:44,width:44,height:25});
 const shadow={host,children:[]},button=make('BUTTON',{innerText:'Designs and features 1/6',getRootNode:()=>shadow}),panel=make('SECTION',{innerText:'Hidden foreign template card',style:{display:'none',visibility:'visible',opacity:'1'},getRootNode:()=>shadow});
 const fab=make('IMG',{parentElement:button,getRootNode:()=>shadow,closest:selector=>selector==='button.fab'?button:null,src:'data:image/webp;base64,reviewed',currentSrc:'',alt:'',complete:true,naturalWidth:44,width:44,height:25});
 const template=make('IMG',{...fab,parentElement:panel,closest:()=>null,src:'data:image/webp;base64,generic'});
 const visibleTel=make('A',{parentElement:body,getAttribute:()=> 'tel:01234567890'}),hiddenTel=make('A',{parentElement:body,style:{display:'none',visibility:'visible',opacity:'1'},getAttribute:()=> 'tel:+359888123456'});
 shadow.children=[button,panel];shadow.querySelectorAll=selector=>selector==='*'?[button,panel,fab,template]:selector==='img'?[fab,template]:[];host.shadowRoot=shadow;
 const document={body,title:'Honest Motors',documentElement:{scrollWidth:390},querySelectorAll:selector=>selector==='*'?[body,host,native,visibleTel,hiddenTel]:selector==='img'?[native]:selector==='a[href^="tel:"]'?[visibleTel,hiddenTel]:[]};
 const read=()=>vm.runInNewContext('('+readDealerPackDom.toString()+')()',{document,location:{href:'http://127.0.0.1:8787/'},innerWidth:390,getComputedStyle:node=>node.style});
 const result=read();assert.match(result.text,/Designs and features/);assert.doesNotMatch(result.text,/Hidden foreign/);
 assert.deepEqual(Array.from(result.phones),['tel:01234567890','tel:+359888123456']);assert.deepEqual(Array.from(result.visiblePhones),['tel:01234567890']);
 assert.deepEqual(Array.from(result.images,row=>row.consumer),['page','fab','switcher']);assert.equal(result.images[1].visible,true);assert.equal(result.images[2].visible,false);
 host.style.opacity='0';assert.equal(read().images[1].visible,false,'A hidden composed ancestor cannot supply painted FAB evidence');
});

function scrollingFixture({height=2600,pending=false,broken=false}={}) {
 const state={top:0,height,viewport:900},calls=[],images=[],handles=[];
 const image=(src,y,complete,naturalWidth,{x=20,parentElement=null,style={}}={})=>{const row={src,currentSrc:src,complete,naturalWidth,y,x,parentElement,style,getBoundingClientRect:()=>({left:row.x,right:row.x+200,top:row.y-state.top,bottom:row.y-state.top+160,width:200,height:160})};return row;};
 images.push(image('/first.png',50,true,200),image('/lazy-stock.png',1700,false,0),image('/unrequested.png',height+2000,false,0));
 const document={fonts:{status:'loaded'},images,documentElement:{scrollHeight:height},body:{scrollHeight:height}},context={document,innerHeight:state.viewport,innerWidth:390,getComputedStyle:node=>({display:'block',visibility:'visible',opacity:'1',overflowX:'visible',overflowY:'visible',...node.style}),requestAnimationFrame:callback=>callback()};
 Object.defineProperty(context,'scrollY',{get:()=>state.top});const runtime=vm.createContext(context);
 const unwrap=arg=>arg?.fixtureHandle?arg.value:arg?.visited?{...arg,visited:arg.visited.value}:arg;
 const run=(fn,arg)=>{context.__arg=unwrap(arg);return vm.runInContext('('+fn.toString()+')(__arg)',runtime);};
 const page={evaluate:async(fn,arg)=>run(fn,arg),evaluateHandle:async fn=>{const handle={fixtureHandle:true,value:run(fn),disposed:false,async dispose(){this.disposed=true;}};handles.push(handle);return handle;},waitForFunction:async(fn,arg)=>{if(!await run(fn,arg))throw Error('Bounded wait timed out');},mouse:{move:async(x,y)=>{assert.equal(x,195);assert.equal(y,450);calls.push('move');},wheel:async(_x,delta)=>{calls.push(delta);state.top=Math.max(0,Math.min(height-state.viewport,state.top+delta));for(const row of images)if(row.y>=state.top&&row.y<state.top+state.viewport&&row.src==='/lazy-stock.png'&&!pending){row.complete=true;row.naturalWidth=broken?0:200;}}}};
 return {page,state,calls,images,image,handles};
}

test('visitor screenshot preparation loads encountered lazy images, leaves unrequested images alone and returns to the top',async()=>{
 const f=scrollingFixture(),result=await prepareDealerPackScreenshot(f.page);assert.equal(result.status,'passed');assert.equal(f.state.top,0);assert(result.scrollSteps>1);assert(f.calls.some(value=>typeof value==='number'&&value>0));assert(f.calls.some(value=>typeof value==='number'&&value<0));
 assert.equal(f.images[1].complete,true);assert.equal(f.images[2].complete,false);assert.equal(result.encounteredImages,2);assert.equal(result.loadedImages,2);assert.deepEqual(Array.from(result.pendingImages),[]);assert.deepEqual(Array.from(result.failedImages),[]);
 const pending=await prepareDealerPackScreenshot(scrollingFixture({pending:true}).page);assert.equal(pending.status,'failed');assert.deepEqual(Array.from(pending.pendingImages),['/lazy-stock.png']);assert.deepEqual(Array.from(pending.failedImages),[]);
 const broken=await prepareDealerPackScreenshot(scrollingFixture({broken:true}).page);assert.deepEqual(Array.from(broken.failedImages),['/lazy-stock.png']);assert.deepEqual(Array.from(broken.pendingImages),[]);
 const oversized=scrollingFixture({height:9000});await assert.rejects(prepareDealerPackScreenshot(oversized.page,{maxSteps:2}),/bounded visitor scroll/);assert(oversized.handles.every(handle=>handle.disposed));
 assert(f.handles.every(handle=>handle.disposed));
 await assert.rejects(prepareDealerPackScreenshot(scrollingFixture().page,{maxSteps:1000}),/Invalid screenshot preparation bound/);
});

test('screenshot visitation excludes horizontal and ancestor-clipped carousel images until they enter the visible rail',async()=>{
 const f=scrollingFixture(),rail={style:{overflowX:'auto',overflowY:'hidden'},getBoundingClientRect:()=>({left:20,right:200,top:40-f.state.top,bottom:230-f.state.top,width:180,height:190})};
 const outside=f.image('/horizontal-offscreen.png',50,false,0,{x:500}),clipped=f.image('/clipped-carousel.png',50,false,0,{x:220,parentElement:rail});
 const hidden=f.image('/hidden-slide.png',50,false,0,{parentElement:{style:{opacity:'0'}}}),partial=f.image('/partially-visible.png',50,true,200,{x:180,parentElement:rail});
 f.images.push(outside,clipped,hidden,partial);
 const first=await prepareDealerPackScreenshot(f.page);assert.equal(first.status,'passed');assert.equal(first.imageWaitTimeouts,0);assert.equal(first.encounteredImages,3);assert.equal(first.loadedImages,3);
 assert.equal(outside.complete,false);assert.equal(clipped.complete,false);assert.equal(hidden.complete,false);
 // Actual element geometry changes represent horizontal visitor movement: the
 // same previously unrequested nodes must now enter the bounded completion gate.
 outside.x=30;clipped.x=40;
 const encountered=await prepareDealerPackScreenshot(f.page);assert.equal(encountered.status,'failed');assert(encountered.imageWaitTimeouts>0);
 assert.deepEqual(Array.from(encountered.pendingImages).sort(),['/clipped-carousel.png','/horizontal-offscreen.png']);
});

test('screenshot readiness tracks exact visited elements when responsive duplicates share the same image URL',async()=>{
 const f=scrollingFixture(),hidden=f.image('/first.png',50,false,0,{parentElement:{style:{display:'none'}}}),offscreen=f.image('/first.png',50,false,0,{x:500});
 f.images.push(hidden,offscreen);
 const ready=await prepareDealerPackScreenshot(f.page);assert.equal(ready.status,'passed');assert.equal(ready.imageWaitTimeouts,0);assert.equal(ready.encounteredImages,2);assert.equal(hidden.complete,false);assert.equal(offscreen.complete,false);
 // A second, actually encountered element with identical bytes/source is an
 // independent loading obligation; the first loaded copy cannot satisfy it.
 const visibleDuplicate=f.image('/first.png',50,false,0);f.images.push(visibleDuplicate);
 const pending=await prepareDealerPackScreenshot(f.page);assert.equal(pending.status,'failed');assert.equal(pending.encounteredImages,3);assert.deepEqual(Array.from(pending.pendingImages),['/first.png']);assert(pending.imageWaitTimeouts>0);
 visibleDuplicate.complete=true;
 const broken=await prepareDealerPackScreenshot(f.page);assert.deepEqual(Array.from(broken.failedImages),['/first.png']);assert.deepEqual(Array.from(broken.pendingImages),[]);
 assert(f.handles.every(handle=>handle.disposed));
});

test('a visited element stays tracked if currentSrc changes after it leaves the viewport',async()=>{
 const f=scrollingFixture(),wheel=f.page.mouse.wheel;let changed=false;
 f.page.mouse.wheel=async(x,delta)=>{await wheel(x,delta);if(delta>0&&!changed){changed=true;f.images[0].currentSrc='/new-responsive-source.png';f.images[0].complete=false;f.images[0].naturalWidth=0;}};
 const result=await prepareDealerPackScreenshot(f.page);assert.equal(result.status,'failed');assert.deepEqual(Array.from(result.pendingImages),['/new-responsive-source.png']);assert.equal(result.encounteredImages,2);assert(f.handles.every(handle=>handle.disposed));
});

test('placeholder text and undisclosed demo listings are failures; honest demo disclosure passes',()=>{
 const placeholder=snapshot();placeholder.text+=' Lorem ipsum dolor sit amet.';assert(assess(placeholder).findings.includes('placeholder-copy'));
 const value=snapshot(),options={snapshot:value,facts,manifest,variant:variants[0],fleet:emptyFleet,demoStock:true};assert(assessPageSnapshot(options).findings.includes('demo-stock-disclosure'));
 value.text+=' These are illustrative demo listings, not dealer stock.';assert.equal(assessPageSnapshot(options).status,'passed');
 assert.equal(stockIsDemo({stock:{kind:'dated-listing-snapshot',records:[]},manifest}),false);
 assert.equal(stockIsDemo({stock:{kind:'demo-stock',records:[]},manifest}),true);
 assert.equal(stockIsDemo({stock:{records:[{demo:true}]},manifest}),true);
});

test('visible NaN or Infinity mileage fails every journey without rejecting a legitimate Infinity dealer name',()=>{
 for(const value of ['NaN km','NaN\u00a0mi','Infinity км','-Infinity km','+Infinity mi','NaNkm'])for(const label of ['home','inventory','detail','contact']){
  const page=snapshot();page.text+=' '+value;
  const result=assessPageSnapshot({snapshot:page,facts,manifest,variant:variants[0],fleet:emptyFleet,identityRequirements:dealerPackIdentityRequirements(label)});
  assert(result.findings.includes('invalid-mileage-value'),value+' on '+label);
 }
 for(const value of ['Infinity Motors','Infinity model range','Mileage unknown','103,000 mi','165,762 km']){const page=snapshot();page.text+=' '+value;assert(!assess(page).findings.includes('invalid-mileage-value'),value);}
 const hidden=snapshot();hidden.metadata+=' NaN km';assert(!assess(hidden).findings.includes('invalid-mileage-value'));
});

test('verification emits a failed JSON report if a build does not exist and never starts an uploader',async t=>{
 const root=area(t),reportPath=path.join(root,'qa.json');let starts=0;
 const result=await verifyDealerPack({root,slug:'honest-motors',plan:'paid',bundleRoot:path.join(root,'absent'),reportPath,pack:{manifest,facts},startPreview:async()=>{starts++;throw Error('must not start');}});
 assert.equal(result.success,false);assert.equal(result.providerWrites,0);assert.equal(starts,0);assert.equal(JSON.parse(fs.readFileSync(reportPath)).success,false);assert.equal(result.checks.at(-1).status,'failed');
});

test('QA CLI rejects ambiguous plans, remote URLs, repeats and path-like slugs',()=>{
 assert.equal(parseDealerPackVerificationArgs(['--slug','honest-motors','--plan','paid']).plan,'paid');
 for(const args of [['--slug','honest-motors'],['--slug','../existing','--plan','paid'],['--slug','honest-motors','--plan','paid','--plan','free'],['--slug','honest-motors','--plan','paid','--preview-url','https://existing.webpreviews.site']])assert.throws(()=>parseDealerPackVerificationArgs(args));
});

test('batch is a bounded exact JSON slug list and never accepts write or mixed legacy arguments',t=>{
 const root=area(t),file=path.join(root,'batch.json');put(root,'batch.json',['honest-motors']);assert.deepEqual(readDealerPackBatch(file),['honest-motors']);
 for(const value of [{slugs:['honest-motors']},[],['honest-motors','honest-motors'],['../live'],Array.from({length:401},(_,index)=>'dealer-'+index)]){put(root,'batch.json',value);assert.throws(()=>readDealerPackBatch(file),/JSON array/);}
 assert.equal(parseDeploymentArgs(['--batch','batch.json','--bundle-root','runtime/dealer-packs','--plan','paid']).write,false);
 assert.throws(()=>parseDeploymentArgs(['--batch','batch.json','--bundle-root','runtime/dealer-packs','--plan','paid','--write']),/unavailable/);
 assert.throws(()=>parseDeploymentArgs(['--input','review.json','--batch','batch.json','--bundle-root','runtime/dealer-packs','--plan','paid']),/cannot mix/);
});

test('batch inspection rejects missing/forged QA and cannot resolve any provider uploader',async t=>{
 const f=bundle(t),batchFile=path.join(f.root,'batch.json');put(f.root,'batch.json',['honest-motors']);
 const result=await inspectDealerPackBatch({root:f.root,batchFile,bundleRoot:f.base,plan:'paid',loadPack:()=>f.pack});assert.equal(result.success,false);assert.equal(result.deployments,0);assert.equal(result.providerWrites,0);assert.equal(result.readyToDeploy,false);
 const parent=path.dirname(f.directory),binding={slug:'honest-motors',packDigest:f.receipt.packDigest,releaseDigest:f.receipt.releaseDigest,outputDigest:f.receipt.outputDigest,execution};
 put(parent,'build-report.json',{...binding,status:'passed'});put(parent,'qa-report.json',{...binding,type:'cars-dealer-pack-qa',success:true,checks:[]});
 const forged=await inspectDealerPackBatch({root:f.root,batchFile,bundleRoot:f.base,plan:'paid',loadPack:()=>f.pack});assert.equal(forged.success,false);assert.match(forged.results[0].reason,/QA report/);
 await assert.rejects(inspectDealerPackBatch({write:true}),/unavailable/);
});

test('inspection of a byte-bound candidate remains explicitly not ready to deploy',async t=>{
 const f=addComposition(bundle(t)),batchFile=path.join(f.root,'batch.json');put(f.root,'batch.json',['honest-motors']);
 const parent=path.dirname(f.directory),binding={slug:'honest-motors',packDigest:f.receipt.packDigest,releaseDigest:f.receipt.releaseDigest,outputDigest:f.receipt.outputDigest,execution,packCompositionDigest:f.receipt.packCompositionDigest};
 const screenshots=[];for(const key of SIX_DESIGN_KEYS)for(const width of [320,390,1280]){const name='screenshots/'+key+'-'+width+'.png',bytes=Buffer.from('synthetic-test-evidence-'+key+width);put(parent,name,bytes);screenshots.push({key,width,path:name,sha256:sha256(bytes)});}
 put(parent,'build-report.json',{...binding,status:'passed',packComposition:f.receipt.packComposition});
 put(parent,'qa-report.json',{...binding,type:'cars-dealer-pack-qa',success:true,capacity:{targetPlan:'paid'},checks:['bundle-integrity','cloudflare-limits','fleet-contact-coverage','logo-assets','rendered-routes','screenshots','bundle-unchanged'].map(id=>({id,status:'passed'})),proof:{screenshots}});
 const options={root:f.root,batchFile,bundleRoot:f.base,plan:'paid',loadPack:()=>f.pack};
 const result=await inspectDealerPackBatch(options);assert.equal(result.success,true);assert.equal(result.readyToDeploy,false);assert.equal(result.qualification.sourcePublication,'not-verified-by-candidate-inspection');assert.equal(result.qualification.workersPlan,'not-verified');assert.equal(result.hostedVerified,false);
 assert.equal(result.results[0].packCompositionDigest,f.receipt.packCompositionDigest);
 const originalQa=JSON.parse(fs.readFileSync(path.join(parent,'qa-report.json')));put(parent,'qa-report.json',{...originalQa,packCompositionDigest:'0'.repeat(64)});
 assert.equal((await inspectDealerPackBatch(options)).success,false);put(parent,'qa-report.json',originalQa);
 const originalBuild=JSON.parse(fs.readFileSync(path.join(parent,'build-report.json'))),changedBuild=structuredClone(originalBuild);changedBuild.packComposition.members.app.execution={kind:'local',id:'rewritten-original-event'};
 put(parent,'build-report.json',changedBuild);assert.equal((await inspectDealerPackBatch(options)).success,false);put(parent,'build-report.json',originalBuild);
 fs.appendFileSync(path.join(parent,screenshots[0].path),'altered');assert.equal((await inspectDealerPackBatch(options)).success,false);
});

let sharp;
for(const file of [process.env.CARS_QA_RESOLVE_FROM,process.env.CARS_SHARP_ROOT&&path.join(process.env.CARS_SHARP_ROOT,'package.json'),path.resolve('runtime/dealer-pack-tools/package.json'),path.resolve('templates/karento-best/package.json')].filter(Boolean))try{sharp=createRequire(file)('sharp');break;}catch{}

test('raster checks reject opaque, padded, blank and low-contrast images at actual small sizes',{skip:!sharp&&'Existing sharp installation unavailable'},async()=>{
 const width=256,height=96,rgba=Buffer.alloc(width*height*4);
 for(let y=8;y<88;y++)for(let x=12;x<244;x++)if((x%24)<16){const offset=(y*width+x)*4;rgba[offset]=17;rgba[offset+1]=17;rgba[offset+2]=19;rgba[offset+3]=255;}
 const bytes=await sharp(rgba,{raw:{width,height,channels:4}}).png().toBuffer();
 const good=await inspectLogoPixels(bytes,{sharp,backgrounds:['#ffffff']});assert.equal(good.status,'passed');assert.equal(good.spellingVerified,false);assert.deepEqual(good.smallSizes.map(row=>row.height),[32,48,64]);
 const dark=await inspectLogoPixels(bytes,{sharp,backgrounds:['#111113']});assert(dark.findings.some(value=>value.startsWith('weak-contrast:')));
 const padded=await sharp(bytes).extend({top:200,bottom:200,left:200,right:200,background:'#00000000'}).png().toBuffer();assert((await inspectLogoPixels(padded,{sharp,backgrounds:['#ffffff']})).findings.includes('excessive-transparent-padding'));
 const opaque=await sharp({create:{width,height,channels:4,background:'#ffffff'}}).png().toBuffer();assert((await inspectLogoPixels(opaque,{sharp,backgrounds:['#111113']})).findings.includes('opaque-or-empty'));
 const blank=await sharp({create:{width,height,channels:4,background:'#00000000'}}).png().toBuffer();assert((await inspectLogoPixels(blank,{sharp,backgrounds:['#ffffff']})).findings.includes('opaque-or-empty'));
 const square=Buffer.alloc(256*256*4);
 for(let y=107;y<148;y++)for(let x=20;x<236;x++){const at=(y*256+x)*4;square[at]=square[at+1]=square[at+2]=10;square[at+3]=255;}
 const pseudoMark=await sharp(square,{raw:{width:256,height:256,channels:4}}).png().toBuffer();
 assert((await inspectLogoPixels(pseudoMark,{sharp,backgrounds:['#ffffff'],role:'mark'})).findings.includes('compact-mark-wordmark-aspect'));
});

test('logo QA binds distinct source PNG and lossless public WebP bytes and real 32/64 favicon images',{skip:!sharp&&'Existing sharp installation unavailable'},async t=>{
 const root=area(t),directory=path.join(root,'pack'),bundleRoot=path.join(root,'bundle');
 const render=async(color)=>{const rgba=Buffer.alloc(128*128*4);for(let y=8;y<120;y++)for(let x=8;x<120;x++){const at=(y*128+x)*4;rgba[at]=rgba[at+1]=rgba[at+2]=color;rgba[at+3]=255;}return sharp(rgba,{raw:{width:128,height:128,channels:4}}).png().toBuffer();};
 const dark=await render(17),light=await render(255),contract={schemaVersion:1,dealer:'honest-motors',assets:{},surfaceBackgrounds:{onLight:['#ffffff'],onDark:['#111113'],onAccent:['#c40101']}};
 for(const [role,png] of [['onLight',dark],['onDark',light],['onAccent',light]]){
  const sourcePath='branding/'+role+'.png',publicPath='/dealer-brand/'+role+'.webp',webp=await sharp(png).webp({lossless:true,effort:6}).toBuffer();
  put(directory,sourcePath,png);put(directory,publicPath.slice(1),webp);put(bundleRoot,'public'+publicPath,webp);
  contract.assets[role]={sourcePath,sourceSha256:sha256(png),publicPath,sha256:sha256(webp)};
 }
 for(const [role,png] of [['master',dark],['mark',dark],['markOnDark',light]]){const sourcePath='branding/logo-'+role+'.png';put(directory,sourcePath,png);contract[role]={path:sourcePath,sha256:sha256(png)};}
 put(bundleRoot,'public/dealer-brand/app-icon.png',dark);put(bundleRoot,'public/dealer-brand/mark-on-dark.webp',await sharp(light).webp({lossless:true,effort:6}).toBuffer());
 const images=await Promise.all([16,32,48,64].map(async size=>({size,png:await sharp(dark).resize(size,size).png().toBuffer()})));
 const header=Buffer.alloc(6+16*images.length);header.writeUInt16LE(1,2);header.writeUInt16LE(images.length,4);let offset=header.length;
 images.forEach(({size,png},index)=>{const at=6+index*16;header[at]=header[at+1]=size;header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(png.length,at+8);header.writeUInt32LE(offset,at+12);offset+=png.length;});
 const favicon=Buffer.concat([header,...images.map(row=>row.png)]);contract.favicon={path:'dealer-brand/favicon.ico',sha256:sha256(favicon)};put(directory,contract.favicon.path,favicon);put(bundleRoot,'public/'+contract.favicon.path,favicon);
 assert.deepEqual(readFaviconPngs(favicon).map(row=>row.size),[16,32,48,64]);
 const corrupted=Buffer.from(favicon);corrupted.writeUInt32LE(0,18);assert.throws(()=>readFaviconPngs(corrupted),/overlapping favicon/);
 const pack={directory,manifest,facts,branding:contract},result=await verifyPackLogoAssets({pack,sharp,bundleRoot});
 assert.equal(result.technicalStatus,'passed',JSON.stringify(result.roles.map(row=>({role:row.role,findings:row.findings}))));
 assert.equal(result.status,'failed');assert(result.qualityDecision.findings.includes('logo-quality-review-missing'));
 assert.equal(result.visualReview.status,'not-recorded');
 contract.creationMethod='retained-reviewed-raster';contract.visualReview={spelling:'agent-visual-review',dealerApproval:false};
 contract.surfaces=Object.fromEntries(Object.entries(contract.assets).map(([role,asset])=>[role,{...asset,retainedSource:{kind:'retained-reviewed-raster',reference:asset.sourcePath,sha256:asset.sourceSha256,sourceUrl:'https://dealer.example/logo.png',observedAt:'2026-10-19T00:00:00Z'}}]));
 // A legacy spelling-review contract flag alone is not quality evidence.
 assert.equal((await verifyPackLogoAssets({pack,sharp,bundleRoot})).status,'failed');
 const source=Buffer.from('{"reviewedInputs":{}}\n');put(directory,'branding/source.json',source);
 put(directory,'branding/logo-contract.json',contract);
 const sheet=await sharp({create:{width:800,height:560,channels:3,background:'#eeeeee'}}).png().toBuffer();
 put(directory,'branding/qa/logo-contact-sheet.png',sheet);
 const qualityChecks=Object.fromEntries(['correctDealerName','legibleLettering','wordmarkProportions','transparentSurfaces','compactMarkIndependentlyLegible','contrast','safePadding','noBackgroundBox','noStretch','noClipping','noAwkwardTypography'].map(name=>[name,true]));
 const review={schemaVersion:1,dealer:manifest.slug,displayName:facts.business.name,decision:'pass',
  reviewer:{kind:'agent-visual-review',reviewedAt:'2026-10-22T10:00:00Z'},dealerApproved:false,
  identity:{kind:'retained-dealer-identity',exactDealerNameVerified:true,dealerAdoptionClaimed:false},
  sourceSha256:sha256(source),contractSha256:sha256(fs.readFileSync(path.join(directory,'branding/logo-contract.json'))),
  contactSheet:{path:'branding/qa/logo-contact-sheet.png',sha256:sha256(sheet)},
  surfacesReviewed:['onLight','onDark','onAccent'],smallSizesReviewed:[32,48,64],checks:qualityChecks,
  sixDesignScreens:SIX_DESIGN_KEYS.flatMap(key=>[320,390,1280].map(width=>({key,width,sha256:sha256(Buffer.from('reviewed-reference-'+key+'-'+width)),decision:'pass',reviewedAt:'2026-10-22T10:00:00Z'}))),
  notes:['Reviewed native favicon scale and transparent light/dark/accent surfaces with the exact retained identity.']};
 put(directory,'branding/logo-quality-review.json',review);
 const original=await verifyPackLogoAssets({pack,sharp,bundleRoot});assert.equal(original.status,'passed',JSON.stringify(original.qualityDecision));
 assert.deepEqual(original.generationReferences,{onLight:null,onDark:null,onAccent:null});assert.deepEqual(original.visualReview,{spelling:'agent-visual-review',dealerApproval:false});assert(original.roles.every(row=>row.spellingVerified===false));
 // Real assembly content-addresses the public branding directory; the path
 // rewrite must still require the exact reviewed public asset bytes.
 for(const asset of Object.values(contract.assets)){
  const flat=path.join(bundleRoot,'public'+asset.publicPath),mounted='public/variant-2/dealer-brand/v2-8388ddd06ce49792/'+path.posix.basename(asset.publicPath);
  put(bundleRoot,mounted,fs.readFileSync(flat));fs.unlinkSync(flat);
 }
 const addressed=await verifyPackLogoAssets({pack,sharp,bundleRoot});assert.equal(addressed.status,'passed');
 assert(addressed.roles.find(row=>row.role==='onLight').integratedCopies.every(name=>name.includes('/v2-8388ddd06ce49792/')));
 const addressedLight=path.join(bundleRoot,'public',addressed.roles.find(row=>row.role==='onLight').integratedCopies[0]);
 fs.appendFileSync(addressedLight,'different-identity');
 assert((await verifyPackLogoAssets({pack,sharp,bundleRoot})).roles.find(row=>row.role==='onLight').findings.includes('missing-bundle-logo'));
 fs.appendFileSync(path.join(directory,contract.assets.onLight.sourcePath),'changed');await assert.rejects(verifyPackLogoAssets({pack,sharp,bundleRoot}),/Logo bytes changed/);
});

test('CLI help has no module-import side effects',()=>{
 const result=spawnSync(process.execPath,['scripts/verify-dealer-pack.mjs','--help'],{encoding:'utf8',timeout:20000});assert.ifError(result.error);assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/no provider writes/i);assert.equal(result.stderr,'');
});

test('CI failure summary retains the concrete verification error without needing a full bundle download',t=>{
 const root=area(t),report=path.join(root,'qa-report.json');
 const result=spawnSync(process.execPath,['scripts/verify-dealer-pack.mjs','--slug','absent-dealer-qa-fixture','--plan','paid','--report',report],{encoding:'utf8',timeout:20000});
 assert.ifError(result.error);assert.equal(result.status,1,result.stderr);
 const summary=JSON.parse(result.stdout),full=JSON.parse(fs.readFileSync(report));
 assert.equal(summary.success,false);assert.equal(summary.checks[0].status,'failed');
 assert.equal(summary.checks[0].failure,full.checks[0].details.slice(0,1600));assert(summary.checks[0].failure.length>15);
 assert.equal(full.providerWrites,0);
});
