import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {sha256,filesAt} from './lib/workflow.mjs';
import {PACK_KEYS} from './lib/dealer-pack.mjs';
import {validateNewSourceCopyReview} from './prepare-new-dealer-source.mjs';
import {publicFactsFromLead,publicBusinessPhone,readExpansionLead,importPublicStock,retainedDemoStock,draftDealerPack,parseDraftArgs,DEMO_STOCK_DISCLOSURE} from './draft-dealer-pack.mjs';

const now='2026-10-19T12:00:00Z',date='2026-10-18';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j0fkAAAAASUVORK5CYII=','base64');
const area=t=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-pack-draft-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root;};
const put=(root,name,value)=>{const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,Buffer.isBuffer(value)||typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');return file;};
const lead=()=>({id:'gb-test-honest-motors',name:'Honest Motors',country:'GB',city:'Test Town',region:'Test Region',address:'12 Public Road, Test Town',researchAsOf:date,website:'https://honest.example/',
  public_business_contact:{phone:'0121 555 0123',email:'business@honest.example',source_url:'https://honest.example/contact',personalPhone:'+441111111111',contactName:'PRIVATE PERSON'},
  inventory:{source_url:'https://honest.example/stock',examples:['Vehicle £9999']},source_urls:['https://honest.example/'],contactHistory:'PRIVATE CRM TEXT',qualification_notes:'PRIVATE RESEARCH',fit_reason:'PRIVATE PITCH',fit_score:99});
const source={repository:'darkapoparka/cars',revision:'a'.repeat(40),tree:'b'.repeat(40),path:'templates/auto-best',digest:'c'.repeat(64)};
const demoCatalog=Buffer.from("const inventoryRecords: DemoVehicle[] = [{id:1,make:'Audi',title:'Audi example',yearNumber:2020,body:'Wagon',image:leadSite.artwork.inventoryDemo.stock01,priceEur:12000,mileageKm:5000}];");
const demoBindings=Buffer.from("export const leadSite={artwork:{inventoryDemo:{stock01:'/demo/car.png'}}};");
const readGit=(_root,args)=>args[0]==='rev-parse'?source.tree:args[1].endsWith('/src/lib/data/inventory.ts')?demoCatalog:args[1].endsWith('/src/lib/config/lead-site.ts')?demoBindings:args[1].endsWith('/static/demo/car.png')?png:(()=>{throw Error('Unexpected read');})();

function setup(t){
  const root=area(t),review=Buffer.from('{"candidate":true}\n'),delta={reference:'docs/releases/pack-review.json',sha256:sha256(review),reviewedAt:now};
  const lock={schemaVersion:1,exportPolicy:'cars-source-v1',templates:Object.fromEntries(PACK_KEYS.map(key=>[key,{commit:source.revision,source:{...source,path:'templates/'+key},qualification:{contextId:'pack-test-context',sourceDeltaReview:delta}}]))};
  put(root,delta.reference,review);put(root,'dealers/templates.lock.json',lock);put(root,'templates.lock.json',{schemaVersion:1,exportPolicy:'cars-source-v1',templates:{}});put(root,'docs/DEPLOYMENT-INVENTORY.json',{dealers:[]});
  const row=lead(),options={root,leadId:row.id,slug:'honest-motors',now,readLead:()=>({lead:row,document:{},source:{path:'leads/expansion-2026-10-18/uk.json',sha256:'e'.repeat(64)}}),readDemo:value=>retainedDemoStock({...value,readGit})};
  return {root,lock,row,options};
}

test('only public business fields cross the heterogeneous lead boundary',()=>{
  const facts=publicFactsFromLead(lead(),{slug:'honest-motors'}),serialized=JSON.stringify(facts);
  assert.equal(facts.business.phone,'+441215550123');assert.equal(facts.business.phoneDisplay,'0121 555 0123');assert.equal(facts.business.currency,'GBP');assert.equal(facts.business.observedAt,date);
  assert.doesNotMatch(serialized,/PRIVATE|price|9999|fit_score|contactName|personalPhone|qualification_notes/i);
  const us={id:'us-test-public',name:'Public Motors',country:'US',city:'Test City',address:'5 Public Avenue',website:{url:'https://public.example/',checkedAt:date},businessContact:{phone:'(502) 555-0123',email:'info@public.example',publicContactPerson:'PRIVATE PERSON',sourceUrl:'https://public.example/contact'},sources:[{url:'https://public.example/',readOn:date,role:'public-business',notes:'PRIVATE'}]};
  const american=publicFactsFromLead(us,{slug:'public-motors'});assert.equal(american.business.phone,'+15025550123');assert.equal(american.business.currency,'USD');assert.equal(american.business.distanceUnit,'mi');assert.doesNotMatch(JSON.stringify(american),/PRIVATE|publicContactPerson|notes/);
  const ae=publicFactsFromLead({id:'ae-test-public',name:'Public Cars',country:'AE',city:'Sharjah',researchDate:date,publicBusinessContact:{phone:'050 555 0123'},sources:[{url:'https://public.example/'}]},{slug:'public-cars'});assert.equal(ae.business.phone,'+971505550123');assert.equal(ae.business.currency,'AED');assert.equal(ae.business.address,'');assert.equal(ae.business.email,'');
});

test('missing facts remain empty and authentication-bearing URLs are not public evidence',()=>{
  const row=lead();delete row.researchAsOf;delete row.address;delete row.public_business_contact.phone;row.website='https://username:password@honest.example/';row.source_urls=['https://honest.example/?api_key=private'];delete row.inventory;row.public_business_contact.source_url='';
  const facts=publicFactsFromLead(row,{slug:'honest-motors'});for(const key of ['address','phone','phoneDisplay','website','sourceUrl','observedAt'])assert.equal(facts.business[key],'');assert.deepEqual(facts.sources,[]);
  assert.equal(publicBusinessPhone('Call PRIVATE PERSON','US'),'');assert.equal(publicBusinessPhone('+1 (502) 555-0123','US'),'+15025550123');
});

test('expansion input requires one exact ID and retained source hashes',t=>{
  const root=area(t),base='leads/expansion-2026-10-18/';put(root,base+'uk.json',{leads:[lead()]});const bytes=fs.readFileSync(path.join(root,base+'uk.json'));
  put(root,base+'manifest.json',{files:[{file:'uk.json',sha256:sha256(bytes)}]});assert.equal(readExpansionLead(root,lead().id).lead.name,'Honest Motors');assert.throws(()=>readExpansionLead(root,'gb-absent'),/exactly one/);
  fs.appendFileSync(path.join(root,base+'uk.json'),' ');assert.throws(()=>readExpansionLead(root,lead().id),/retained manifest/);
  put(root,base+'uae.json',{leads:[lead()]});put(root,base+'manifest.json',{files:[{file:'uk.json'},{file:'uae.json'}]});assert.throws(()=>readExpansionLead(root,lead().id),/exactly one/);
});

function stock(){return {schemaVersion:1,dealer:'honest-motors',kind:'dated-listing-snapshot',observedAt:now,records:[{id:'public-car-2020',title:'2020 Public Car',make:'Public',model:'Car',year:2020,currency:'GBP',priceAmount:12345,price:'£12,345',priceOnRequest:false,ownerName:'PRIVATE PERSON',notes:'PRIVATE CRM TEXT',description:'PRIVATE FREE TEXT',sourceUrl:'https://honest.example/stock/public-car',observedAt:now,images:['/dealer-stock/car.png']}]};}

test('dated stock import drops prices and free-form private fields while preserving explicit vehicle evidence',t=>{
  const root=area(t);put(root,'dealer-stock/car.png',png);const value=importPublicStock(stock(),{slug:'honest-motors',country:'GB',mediaRoot:root});
  assert.equal(value.stock.records[0].priceAmount,null);assert.equal(value.stock.records[0].priceOnRequest,true);assert.equal(value.stock.records[0].mileageOnRequest,true);assert.equal(value.media.size,1);
  assert.doesNotMatch(JSON.stringify(value.stock),/12345|12,345|PRIVATE|ownerName|notes|description/);assert.match(value.stock.records[0].availability,/not been independently confirmed/);
});

test('stock imports reject duplicate identity, source omissions, unsupported bytes and escaping media',t=>{
  const root=area(t);put(root,'dealer-stock/car.png',png);const options={slug:'honest-motors',country:'GB',mediaRoot:root};
  const duplicate=stock();duplicate.records.push(duplicate.records[0]);assert.throws(()=>importPublicStock(duplicate,options),/distinct/);
  const absent=stock();delete absent.records[0].sourceUrl;assert.throws(()=>importPublicStock(absent,options),/dated public evidence/);
  const priced=stock();priced.records[0].title+=' £12,345';assert.throws(()=>importPublicStock(priced,options),/price-free/);
  const escaped=stock();escaped.records[0].images=['/dealer-stock/../outside.png'];assert.throws(()=>importPublicStock(escaped,options),/flat/);
  put(root,'dealer-stock/car.png','PRIVATE TEXT IS NOT AN IMAGE');assert.throws(()=>importPublicStock(stock(),options),/actual public PNG/);
});

test('the maintained demo set retains its exact source and becomes clearly disclosed price-free sample records',()=>{
  const value=retainedDemoStock({root:'/unused',slug:'honest-motors',country:'GB',lock:{templates:{'auto-best':{source}}},observedAt:now,readGit});
  assert.equal(value.stock.kind,'illustrative-not-dealer-stock');assert.equal(value.stock.dealerStock,false);assert.equal(value.stock.disclosure,DEMO_STOCK_DISCLOSURE);assert.equal(value.stock.records[0].title,'Audi example');assert.equal(value.stock.records[0].priceAmount,null);assert.equal(value.stock.records[0].currency,'GBP');assert.equal(value.media.size,1);assert.doesNotMatch(JSON.stringify(value.stock),/12000|priceEur/);
  assert.throws(()=>retainedDemoStock({root:'/unused',slug:'honest-motors',country:'GB',lock:{templates:{'auto-best':{source}}},observedAt:now,readGit:()=> 'wrong-tree'}),/subtree differs/);
});

test('a new draft reuses maintained files and demo disclosure without claiming logo/build/owner approval',t=>{
  const f=setup(t);delete f.row.public_business_contact.phone;delete f.row.public_business_contact.email;
  const result=draftDealerPack(f.options);assert.equal(result.status,'draft');assert.equal(result.buildReady,false);assert.equal(result.logoReady,false);assert.equal(result.providerWrites,0);assert.equal(result.files,13);assert.equal(result.liveListingFetchPerformed,false);
  const files=filesAt(result.directory,{filter:()=>true});for(const name of ['dealer.json','business-facts.json','stock.json','FACTS-AND-INVENTORY.json','locale.json','qualification.json','branding/source.json'])assert(files.includes(name));assert(!files.some(name=>PACK_KEYS.some(key=>name.startsWith(key+'/'))));
  const facts=JSON.parse(fs.readFileSync(path.join(result.directory,'business-facts.json')));assert.equal(facts.business.inventoryNotice,DEMO_STOCK_DISCLOSURE);assert.equal(facts.business.phone,'');
  const missing=JSON.parse(fs.readFileSync(path.join(result.directory,'missing-facts.json')));assert.deepEqual(missing.blocking,[]);assert(missing.missing.some(row=>row.field==='business.phone'&&!row.required));
  const qualification=JSON.parse(fs.readFileSync(path.join(result.directory,'qualification.json')));assert.equal(qualification.nativeApproval,false);assert.equal(qualification.hostedApproval,false);assert.equal(qualification.globalReleaseApproval,false);
  const stockBytes=fs.readFileSync(path.join(result.directory,'stock.json')),copy=JSON.parse(fs.readFileSync(path.join(result.directory,'copy-review.json')));
  validateNewSourceCopyReview(copy,{slug:'honest-motors',inputs:{stock:{sha256:sha256(stockBytes)}}},JSON.parse(stockBytes));assert.match(copy.descriptions[0].bg,/демонстрационни/);
  for(const name of files.filter(name=>name.endsWith('.json')))assert.doesNotMatch(fs.readFileSync(path.join(result.directory,name),'utf8'),/PRIVATE|12345|fit_score|contactHistory/);
});

test('existing draft or fleet identity is rejected before any existing file can change',t=>{
  const f=setup(t),result=draftDealerPack(f.options),before=fs.readFileSync(path.join(result.directory,'business-facts.json'));
  assert.throws(()=>draftDealerPack(f.options),/already exists/);assert(before.equals(fs.readFileSync(path.join(result.directory,'business-facts.json'))));
  const other=setup(t);put(other.root,'clients/live/business-facts.json','retained existing client');put(other.root,'docs/DEPLOYMENT-INVENTORY.json',{dealers:[{slug:'another',researchId:other.row.id}]});assert.throws(()=>draftDealerPack(other.options),/already exists/);assert.equal(fs.readFileSync(path.join(other.root,'clients/live/business-facts.json'),'utf8'),'retained existing client');assert(!fs.existsSync(path.join(other.root,'dealers/honest-motors')));
});

test('missing required facts stay reported and a sourced stock file is never silently replaced with demo',t=>{
  const f=setup(t);delete f.row.name;const result=draftDealerPack(f.options);assert(result.blocking.includes('business.name'));
  const explicit=setup(t),stockFile=put(explicit.root,'stock-input.json',stock());put(explicit.root,'media/dealer-stock/car.png',png);
  const imported=draftDealerPack({...explicit.options,stockFile,mediaRoot:path.join(explicit.root,'media'),readDemo:()=>{throw Error('must not use demo');}});assert.equal(imported.inventoryKind,'dated-listing-snapshot');assert.equal(imported.stockAcquisition,'explicit-retained-public-snapshot');
});

test('an unpublished street address and telephone remain optional empty facts in a new draft',t=>{
  const f=setup(t);delete f.row.address;delete f.row.public_business_contact.phone;
  const result=draftDealerPack(f.options),facts=JSON.parse(fs.readFileSync(path.join(result.directory,'business-facts.json'))),missing=JSON.parse(fs.readFileSync(path.join(result.directory,'missing-facts.json')));
  assert.equal(facts.business.address,'');assert.equal(facts.business.city,f.row.city);assert.equal(facts.business.phone,'');
  assert.deepEqual(missing.blocking,[]);
  for(const field of ['business.address','business.phone'])assert(missing.missing.some(row=>row.field===field&&row.required===false));
  assert.deepEqual(result.blocking,['branding.reviewed-assets']);
});

test('draft CLI accepts exact inputs and rejects repeats and unsupported automatic fetch claims',()=>{
  assert.equal(parseDraftArgs(['--lead','gb-test-honest-motors','--slug','honest-motors']).slug,'honest-motors');
  for(const args of [[],['--lead','x','--lead','y'],['--lead','x','--fetch-stock'],['--lead','x','--media-root','outside'],['--lead','x','--observed-at','unknown']])assert.throws(()=>parseDraftArgs(args));
});
