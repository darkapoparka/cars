import assert from 'node:assert/strict';
import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {createRequire, stripTypeScriptTypes} from 'node:module';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {refreshAdapterInternals as adapters} from './lib/client-refresh-adapters.mjs';
import {prepareAppDealer, sealAppDealerSource} from './lib/app-dealer-adapter.mjs';
import {assertAppVariant} from './publishing/app-variant.mjs';
import {UK_MODERN_PATHS, UK_MOBILE_PATHS, UK_APP_PATHS, personalizeModernUk, personalizeMobileUk, personalizeAppUk, ukSourceMileage} from './lib/client-refresh-uk-next.mjs';

const pins={
 modern:'827d75b9a53666c6feb09f04e3f8e7f255e95a30',
 app:'70c2b80671e217ab299549a938a537c0b9559611',
 mobile:'876590474d01178413feccf3153a0859230158a1'
};
const paths={modern:UK_MODERN_PATHS, app:UK_APP_PATHS, mobile:UK_MOBILE_PATHS};
const cache=new Map();
function pinned(key,name) {
 const id=key+'/'+name;
 if(!cache.has(id)) cache.set(id,execFileSync('git',['show',pins[key]+':templates/'+id],{encoding:'utf8',maxBuffer:2097152}).replace(/\r\n/g,'\n'));
 return cache.get(id);
}
const immutable=key=>new Map(paths[key].map(name=>[name,pinned(key,name)]));
const listing=(id,value,unit)=>({id,slug:id,title:'Synthetic '+id,make:'Audi',brand:'Audi',model:'A3',trim:'',year:2022,
 mileageValue:value,mileageUnit:unit,mileageOnRequest:false,priceAmount:12345,currency:'GBP',fuelType:'gasoline',
 transmissionType:'manual',bodyType:'hatchback',images:['/dealer/stock.png'],features:[],raw:{mileage:{value,unit},year:2022}});
const profile={slug:'uk-fixture',business:{slug:'uk-fixture',name:'UK Fixture',countryCode:'GB',country:'United Kingdom',
 distanceUnit:'mi',locale:'en-GB',currency:'GBP',city:'Test',address:'Test address',logo:'/dealer/logo.png',
 logoLight:'/dealer/logo.png',logoDark:'/dealer/logo.png',inventoryNotice:'Dated listing examples.',observedAt:'2026-10-10'},
 listings:[listing('mi',60000,'mi'),listing('km',90000,'km')]};
const mileageFacts=profile.listings.map(item=>({slug:item.slug,sourceValue:item.mileageValue,sourceUnit:item.mileageUnit,
 canonicalKm:item.mileageUnit==='mi'?Math.round(item.mileageValue*1.609344):item.mileageValue}));
const withoutImports=source=>source.replace(/(?:import|export)\s+(?:type\s+)?[^;]*?\sfrom\s*['"][^'"]+['"];\s*/g,'');
const jsUrl=source=>'data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(source)).toString('base64');
const tsImport=source=>import(jsUrl(source));
const helperPath=key=>key==='modern'?'packages/marketplace-domain/dealer-mileage.ts':key==='app'?'lib/dealer-mileage.ts':'src/lib/dealer-mileage.ts';
const helperUse=(key,files)=>'import {canonicalMileage,mileageLimitKm,dealerMileageValue,formatStockMileage} from '+JSON.stringify(jsUrl(files.get(helperPath(key))))+';\n';
const changed=new Map();
for(const key of Object.keys(pins)) {
 const files=immutable(key);
 if(key==='modern')personalizeModernUk(files,profile);
 if(key==='app')personalizeAppUk(files,profile,mileageFacts);
 if(key==='mobile'){
  // The existing Mobile adapter applies the recorded currency before the GB presentation overlay.
  files.set('src/lib/locale.ts',files.get('src/lib/locale.ts').replace("currency: 'EUR'","currency: 'GBP'"));
  files.set('src/lib/search.ts',files.get('src/lib/search.ts').replace("'€' + new Intl.NumberFormat","'GBP ' + new Intl.NumberFormat"));
  personalizeMobileUk(files,profile);
 }
 changed.set(key,files);
}

test('all three exact reviewed sources retain original mileage and compare without km rounding error',async()=>{
 for(const [key,files] of changed) {
  const helper=await tsImport(files.get(helperPath(key)));
  const mi={id:'mi',slug:'mi',mileage:96561,mileageSourceValue:60000,mileageSourceUnit:'mi'};
  const km={id:'km',slug:'km',mileage:90000,mileageSourceValue:90000,mileageSourceUnit:'km'};
  assert.equal(helper.formatStockMileage(mi),'60,000 mi',key);
  assert.equal(helper.formatStockMileage(km),'90,000 km',key);
  assert.equal(helper.dealerMileageValue(mi),60000,key);
  assert.equal(helper.canonicalMileage(mi),96560.64,key);
  assert.equal(helper.canonicalMileage(mi),helper.mileageLimitKm(60000),key);
  assert.equal(helper.formatStockMileage({...mi,mileageOnRequest:true}),'Mileage on request',key);
  assert.ok(Number.isNaN(helper.dealerMileageValue({...mi,mileageOnRequest:true})));
 }
 assert.equal(ukSourceMileage({...profile.listings[0],mileageValue:0,raw:{},mileageOnRequest:undefined}),null);
 assert.deepEqual(ukSourceMileage({...profile.listings[0],mileageValue:0,raw:{mileageMiles:0}}),{value:0,unit:'mi'});
});

test('Modern actual stock and leasing filters honor an inclusive miles boundary and original display',async()=>{
 const files=changed.get('modern');
 const inventory=profile.listings.map((item,index)=>adapters.modernListing(item,index,item.id,profile));
 const data=files.get('packages/marketplace-domain/testing/mock-data.ts');
 const start=data.indexOf('const matchesText'),end=data.indexOf('const legacyListingSlugAliases');
 assert.ok(start>=0&&end>start);
 const module=await tsImport(helperUse('modern',files)+'const mockListings='+JSON.stringify(inventory)+';\n'+data.slice(start,end));
 const filters={category:'car',sort:'mileage_asc',currency:'GBP',mileageMax:60000};
 assert.deepEqual(module.getMockListings(filters).map(item=>item.id),['km','mi']);
 assert.deepEqual(module.getMockListings({...filters,mileageMax:59999}).map(item=>item.id),['km']);
 assert.equal(inventory[0].spec.mileageValue,96561);
 assert.equal(inventory[0].spec.mileageSourceValue,60000);
 const display=await tsImport(helperUse('modern',files)+'const leadSite={locale:"en-GB"};\n'+withoutImports(files.get('packages/marketplace/format.ts')));
 assert.equal(display.formatMileage(inventory[0].spec.mileageValue,'en',inventory[0].spec),'60,000 mi');
 assert.equal(display.formatMoney({amount:12345,currency:'GBP'},'en'),'£12,345');
 const lease=await tsImport(helperUse('modern',files)+'const leadSite={country:"United Kingdom",countryCode:"GB"}; const getIsoCountryName=()=>"United Kingdom";\n'+withoutImports(files.get('apps/web/app/[locale]/lease/lease-finance-policy.ts')));
 const option={filterData:inventory[0],priceAmount:12345,year:2022};
 assert.equal(lease.matchesLeaseVehicleFilters(option,{mileageMax:60000}),true);
 assert.equal(lease.matchesLeaseVehicleFilters(option,{mileageMax:59999}),false);
 assert.throws(()=>adapters.modernListing({...profile.listings[0],mileageOnRequest:true},0,'unknown',profile),/requires a published mileage and price/);
 assert.throws(()=>adapters.modernListing({...profile.listings[0],priceAmount:0},0,'unknown',profile),/requires a published mileage and price/);
});

function mobileBody(files) {
 return 'const bgMessages: Record<string,string>={};const modelGroupsFor: (make:string)=>{name:string;children:string[]}[]=()=>[];\n'+
 pinned('mobile','src/lib/types.ts')+'\n'+withoutImports(pinned('mobile','src/lib/filters.ts'))+'\n'+
 withoutImports(files.get('src/lib/locale.ts'))+'\n'+withoutImports(files.get('src/lib/search.ts'));
}
test('Mobile actual normalized filters and URL roundtrip use miles with English GBP defaults',async()=>{
 const files=changed.get('mobile'),module=await tsImport(helperUse('mobile',files)+mobileBody(files));
 const vehicles=profile.listings.map(item=>({id:item.id,make:'Audi',model:'A3',variant:'',mileage:item.mileageUnit==='mi'?Math.round(item.mileageValue*1.609344):item.mileageValue,
  price:12345,year:2022,fuel:'Petrol',body:'Hatchback',transmission:'Manual',category:'car',features:[],location:'Test'}));
 const filters=module.normalizeFilters({maxMileage:'60000'});
 assert.deepEqual(module.filterVehicles(vehicles,filters).map(item=>item.id),['mi','km']);
 assert.deepEqual(module.filterVehicles(vehicles,{...filters,maxMileage:'59999'}).map(item=>item.id),['km']);
 assert.deepEqual(module.filterVehicles(vehicles,{...filters,minMileage:'60000'}).map(item=>item.id),['mi']);
 const query=module.serializeFilters({...filters,minMileage:'60000'});
 assert.equal(new URLSearchParams(query).get('maxMileage'),'60000');
 assert.deepEqual(module.parseFilters(query),{...filters,minMileage:'60000'});
 assert.equal(module.defaultLocale,'en');
 assert.equal(module.localeMoney(12345,'en'),'£12,345');
 assert.equal(module.money(12345),'GBP 12,345');
});

function appBody(files,vehicles=[]) {
 return 'const dealer={currency:"GBP",defaultLocale:"en"};const isDealer=true;const dealerInventory='+JSON.stringify(vehicles)+';\n'+
 withoutImports(pinned('app','lib/vehicle-values.ts'))+'\n'+pinned('app','lib/inventory-identity.ts')+'\n'+
 withoutImports(files.get('lib/currency.ts'))+'\n'+withoutImports(files.get('lib/inventory-settings.ts'))+'\n'+
 withoutImports(files.get('lib/inventory-filters.ts'));
}
test('App actual range/preset filters preserve missing facts and use miles consistently',async()=>{
 const files=changed.get('app'),module=await tsImport(helperUse('app',files)+appBody(files));
 const vehicles=[
  {slug:'mi',mileage:96561,year:2022,price:12345,monthly:0,make:'Audi',model:'A3',trim:'',body:'Hatchback',engine:'2',highlights:[]},
  {slug:'km',mileage:90000,year:2022,price:12345,monthly:0,make:'Audi',model:'A3',trim:'',body:'Hatchback',engine:'2',highlights:[]},
  {slug:'unknown',mileage:0,mileageOnRequest:true,year:2022,price:0,priceOnRequest:true,monthly:0,make:'Audi',model:'A3',trim:'',body:'Hatchback',engine:'',highlights:[]}
 ];
 const filter=module.restoreFilters({...module.emptyFilters(),mileageMaximum:60000});
 assert.deepEqual(vehicles.filter(item=>module.matchesInventory(item,filter,'')).map(item=>item.slug),['mi','km']);
 assert.deepEqual(vehicles.filter(item=>module.matchesInventory(item,{...filter,mileageMinimum:60000},'')).map(item=>item.slug),['mi']);
 assert.deepEqual(vehicles.filter(item=>module.matchesInventory(item,{...module.emptyFilters(),mileage:'Under 60,000 mi'},'')).map(item=>item.slug),['km']);
 assert.deepEqual(vehicles.filter(item=>module.matchesInventory(item,module.emptyFilters(),'')).map(item=>item.slug),['mi','km','unknown']);
 assert.deepEqual(module.mileageOptions,['Under 30,000 mi','Under 60,000 mi','Under 90,000 mi','Under 120,000 mi','Under 150,000 mi']);
 assert.equal(module.currency.symbol,'£');
 assert.equal(module.deriveInventoryBounds([{...vehicles[0],slug:'high-mileage',mileage:1000000}]).mileageMaximum,622000);
});

test('UK boundaries refuse changed source atomically and leave other markets byte-identical',()=>{
 const nonUk={business:{countryCode:'BG',distanceUnit:'km'}};
 for(const key of Object.keys(pins)) {
  const files=immutable(key),snapshot=[...files];
  const apply=(input,who)=>key==='modern'?personalizeModernUk(input,who):key==='mobile'?personalizeMobileUk(input,who):personalizeAppUk(input,who,mileageFacts);
  assert.deepEqual(apply(files,nonUk),[]);
  assert.deepEqual([...files],snapshot);
  const bad=structuredClone(profile);bad.listings[0].currency='EUR';
  assert.throws(()=>apply(files,bad),/mixed currencies/);
  assert.deepEqual([...files],snapshot);
  const name=key==='modern'?'packages/marketplace-domain/types.ts':key==='mobile'?'src/lib/locale.ts':'lib/currency.ts';
  files.set(name,'changed source boundary');
  const drifted=[...files];
  assert.throws(()=>apply(files,profile),/boundary changed/);
  assert.deepEqual([...files],drifted);
 }
});

const installed=(base,name)=>{try{return createRequire(path.resolve(base,'package.json')).resolve(name);}catch{return null;}};
const tsPath=installed('templates/mobile','typescript');
const ts=tsPath?createRequire(import.meta.url)(tsPath):null;
const zodPath=installed('templates/modern/packages/marketplace-domain','zod');
test('Modern real GBP schemas accept GBP without weakening unknown-currency rejection',{skip:!zodPath},async()=>{
 const files=changed.get('modern');
 const useZod='import {z} from '+JSON.stringify(pathToFileURL(zodPath).href)+';\n';
 const taxonomy=await tsImport(useZod+withoutImports(files.get('packages/marketplace-domain/taxonomy.ts')));
 assert.equal(taxonomy.priceCurrencySchema.parse('GBP'),'GBP');
 assert.equal(taxonomy.priceCurrencySchema.safeParse('XYZ').success,false);
 const site=await tsImport(useZod+withoutImports(files.get('packages/marketplace-domain/site-config.ts')));
 assert.equal(site.publicSiteSchema.shape.market.shape.currency.parse('GBP'),'GBP');
 assert.equal(site.publicSiteSchema.shape.market.shape.currency.safeParse('XYZ').success,false);
});

test('installed TypeScript compiles all transformed boundaries and checks native mileage consumer types in memory',{skip:!ts},()=>{
 for(const [key,files] of changed) for(const [name,source] of files) if(/\.tsx?$/.test(name)){
  const result=ts.transpileModule(source,{fileName:name,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.Preserve}});
  assert.deepEqual((result.diagnostics||[]).filter(item=>item.category===ts.DiagnosticCategory.Error).map(item=>ts.flattenDiagnosticMessageText(item.messageText,'\n')),[],key+'/'+name);
 }
 const root=path.resolve('runtime/uk-next-memory');
 const helperName=path.join(root,'dealer-mileage.ts');
 const modules=new Map([
  [helperName,changed.get('modern').get(helperPath('modern'))],
  [path.join(root,'mobile.ts'),'import {dealerMileageValue} from "./dealer-mileage";\n'+mobileBody(changed.get('mobile'))],
  [path.join(root,'modern.ts'),'import {formatStockMileage,type MileageStock} from "./dealer-mileage";\n'+changed.get('modern').get('packages/marketplace-domain/types.ts')+'\nconst leadSite={locale:"en-GB"};\n'+withoutImports(changed.get('modern').get('packages/marketplace/format.ts'))+'\nconst gbp: PriceCurrency="GBP";']
 ]);
 const options={strict:true,noEmit:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,skipLibCheck:true};
 const host=ts.createCompilerHost(options),originalGet=host.getSourceFile.bind(host),originalExists=host.fileExists.bind(host);
 host.fileExists=name=>modules.has(path.resolve(name))||originalExists(name);
 host.getSourceFile=(name,version,...rest)=>modules.has(path.resolve(name))?ts.createSourceFile(name,modules.get(path.resolve(name)),version,true):originalGet(name,version,...rest);
 host.resolveModuleNames=(names,containing)=>names.map(name=>name==='./dealer-mileage'?{resolvedFileName:helperName,extension:ts.Extension.Ts}:ts.resolveModuleName(name,containing,options,host).resolvedModule);
 const program=ts.createProgram([...modules.keys()],options,host);
 assert.deepEqual(ts.getPreEmitDiagnostics(program).filter(item=>item.category===ts.DiagnosticCategory.Error).map(item=>ts.flattenDiagnosticMessageText(item.messageText,'\n')),[]);
});

test('App initial personalization and exact source seal include metadata and never assert QA acceptance',async()=>{
 const template={repository:'darkapoparka/cars',path:'templates/app',revision:pins.app,tree:'b'.repeat(40),digest:'c'.repeat(64)};
 const manifest={slug:profile.slug,packaging:{version:'3'},localization:{defaultLocale:'en',dealerCountry:'GB',inventoryCurrency:'GBP'},
  templateRevisions:{app:pins.app},templateSources:{app:template},
  variants:[{key:'auto-best'},{key:'modern'},{key:'import'},{key:'app',base:'/variant-4',entry:'/variant-4/'}]};
 const input=structuredClone(profile);
 input.business.inventoryNotice='All images are illustrations, not the advertised vehicles. Confirm dated prices and availability.';
 input.listings[0].raw.mediaKind='generated_category_illustration';
 input.listings[0].description='Illustration — not the advertised vehicle. Dated source facts.';
 const source=new Map([
  ['auto-best/src/lib/data/dealer-profile.json',Buffer.from(JSON.stringify(input))],
  ['auto-best/static/dealer/logo.png',Buffer.from('test-logo')],
  ['auto-best/static/dealer/stock.png',Buffer.from('test-stock')]
 ]);
 const prepared=await prepareAppDealer('',manifest,{appFiles:immutable('app'),readFile:async name=>{
  if(source.has(name))return source.get(name);const e=new Error('Missing fixture');e.code='ENOENT';throw e;
 }});
 assert.equal(prepared.config.defaultLocale,'en');
 assert.equal(prepared.config.currency,'GBP');
 assert.equal(prepared.inventory[0].mileage,96561);
 assert.equal(prepared.inventory[0].imagePlaceholder,true);
 assert.match(prepared.inventory[0].image,/^\/dealer-app\/vehicle-/);
 assert.equal(prepared.config.inventoryNotice,input.business.inventoryNotice);
 assert.match(prepared.files.get('components/VehicleCard.tsx').toString(),/Illustration — not the advertised vehicle/);
 assert.match(prepared.files.get('components/VehicleDetailClient.tsx').toString(),/Illustration — not the advertised vehicle/);
 assert.equal(prepared.provenance.ukPresentation.distanceUnit,'mi');
 for(const [name,bytes] of prepared.files)source.set('app/'+name,bytes);
 source.set('app/.client/project.json',Buffer.from('{"dealer":"uk-fixture"}'));
 const before=[...source];
 assert.throws(()=>sealAppDealerSource({files:source,manifest,provenance:prepared.provenance}),/Missing App logo bytes/);
 assert.deepEqual([...source],before);
 source.set('app/public/dealer-app/icon.png',Buffer.from('test-icon'));
 const receipt=sealAppDealerSource({files:source,manifest,provenance:prepared.provenance});
 assert.equal(receipt.needsDealerQA,true);assert.equal(receipt.readyToPublish,false);
 assert.doesNotThrow(()=>assertAppVariant(source,manifest));
 source.set('app/.client/project.json',Buffer.from('{"dealer":"changed"}'));
 assert.throws(()=>assertAppVariant(source,manifest),/source changed/);
 source.set('auto-best/src/lib/data/dealer-profile.json',Buffer.from('{}'));
 assert.throws(()=>sealAppDealerSource({files:source,manifest,provenance:prepared.provenance}),/facts changed/);
});
