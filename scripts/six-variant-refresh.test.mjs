import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { planSixDesignSelection } from './lib/six-design-release.mjs';
import { selectPinnedRevisions, updateManifestPins, planDealerUpgrade, materializeUpgradeCandidate } from './dealer-updates/three-way-upgrade.mjs';
import { updateSelection } from './dealer-updates/update-dealer-template.mjs';
import { applyExtendedRefreshAdapter, extendedVariantSourceDigest, sealExtendedVariant, retainDealerVariantAssets } from './lib/client-refresh-six.mjs';
import { normalized, sha256, filesAt } from './lib/workflow.mjs';

const previous = '1'.repeat(40), next = '2'.repeat(40);
const source = (key,revision=next) => ({repository:'darkapoparka/cars',revision,path:`templates/${key}`,tree:'3'.repeat(40),digest:'4'.repeat(64)});
const lockFor = keys => ({templates:Object.fromEntries(keys.map(key=>[key,{status:'approved',commit:next,digest:'4'.repeat(64),snapshotPath:`templates/${key}`,source:source(key)}]))});
function manifestFor(middle='modern',six=false) {
  const variants = ['auto-best',middle,'carwow','app'].map((key,i)=>({key,base:i?`/variant-${i+1}`:'',entry:key==='modern'?'/variant-2/cars':i?`/variant-${i+1}/`:'/'}));
  const selected = six ? planSixDesignSelection(variants).variants : variants;
  return {schemaVersion:1,slug:'fixture',repository:'darkapoparka/cars-fixture',defaultBranch:'main',language:'en',packaging:{version:six?'5':'3'},
    localization:{schemaVersion:1,dealerId:'fixture',defaultLocale:'en',enabledLocales:['en','bg'],dealerCountry:'AE',inventoryCurrency:'AED'},
    variants:selected,templateRevisions:Object.fromEntries(selected.map(({key})=>[key,previous])),templateSources:Object.fromEntries(selected.map(({key})=>[key,source(key,previous)])),
    switcher:{accent:'#123456'}};
}

for (const middle of ['modern','import']) test(`six-design ${middle} migration pins new families and preserves the existing second mount`,()=>{
  const manifest = manifestFor(middle), selection = updateSelection(manifest,{designSet:'six'});
  const lock = lockFor(selection.targetVariants.map(({key})=>key));
  const pins = selectPinnedRevisions(manifest,lock,{targetVariants:selection.targetVariants});
  assert.equal(Object.keys(pins).length,6);
  assert.equal(selection.targetVariants[1].key,middle);
  assert.equal(selection.targetVariants[2].key,middle==='modern'?'import':'modern');
  assert.equal(pins.mobile.from,null);
  assert.equal(pins['karento-best'].fromSource,null);
  assert.ok(!pins.carwow);
  assert.equal(manifest.packaging.version,'3');
});

test('Signature-only selection preserves the other five exact source pins and refuses unknown or duplicate keys',()=>{
  const manifest=manifestFor('modern',true),lock=lockFor(manifest.variants.map(({key})=>key));
  const selection=updateSelection(manifest,{variants:'karento-best'});
  const pins=selectPinnedRevisions(manifest,lock,{keys:selection.selectedKeys});
  const updated=updateManifestPins(manifest,pins);
  assert.deepEqual(Object.keys(pins),['karento-best']);
  for (const {key} of manifest.variants.slice(0,5)) assert.deepEqual(updated.templateSources[key],manifest.templateSources[key]);
  assert.equal(updated.templateRevisions['karento-best'],next);
  assert.throws(()=>selectPinnedRevisions(manifest,lock,{keys:['carwow']}),/distinct published/);
  assert.throws(()=>selectPinnedRevisions(manifest,lock,{keys:['karento-best','karento-best']}),/distinct published/);
});

test('missing or draft Mobile/Signature releases and incomplete migration selection remain hard holds',()=>{
  const manifest=manifestFor(),variants=planSixDesignSelection(manifest.variants).variants;
  const lock=lockFor(variants.map(({key})=>key));
  lock.templates.mobile.status='draft';
  assert.throws(()=>selectPinnedRevisions(manifest,lock,{targetVariants:variants}),/No exact approved.*mobile/);
  delete lock.templates.mobile;
  assert.throws(()=>selectPinnedRevisions(manifest,lock,{targetVariants:variants}),/No exact approved.*mobile/);
  assert.throws(()=>selectPinnedRevisions(manifest,lock,{targetVariants:variants,keys:['karento-best']}),/every newly added/);
});

test('Signature-only three-way candidate retains client customization, old Carwow source and other five bytes', t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-signature-selective-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const dealer=path.join(root,'dealer'),manifest=manifestFor('modern',true);
  const write=(relative,data)=>{const file=path.join(dealer,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);};
  write('dealer.json',JSON.stringify(manifest));
  for (const {key} of manifest.variants) write(`${key}/package.json`,'{"name":"fixture"}');
  const original='export const name = "template";\n\nexport const a = 1;\nexport const b = 2;\nexport const c = 3;\n\nexport const color = "old";\n';
  write('karento-best/src/feature.ts',original.replace('"template"','"dealer customization"'));
  write('app/lib/dealer.json','{"name":"Client data"}');write('carwow/preserved.txt','Historical source');
  const oldBase=new Map([['package.json',Buffer.from('{"name":"fixture"}')],['src/feature.ts',Buffer.from(original)]]);
  const newBase=new Map([['package.json',Buffer.from('{"name":"fixture"}')],['src/feature.ts',Buffer.from(original.replace('"old"','"new"'))]]);
  const lock=lockFor(manifest.variants.map(({key})=>key));
  const pins=selectPinnedRevisions(manifest,lock,{keys:['karento-best']});
  const plan=planDealerUpgrade({dealerRoot:dealer,lock,oldBases:{'karento-best':oldBase},newBases:{'karento-best':newBase},targetManifest:updateManifestPins(manifest,pins),selectedKeys:['karento-best']});
  assert.equal(plan.ready,true);
  assert.ok(plan.changes.every(change=>change.path==='dealer.json'||change.path.startsWith('karento-best/')));
  const candidate=materializeUpgradeCandidate({source:dealer,plan,destination:path.join(root,'candidate')});
  assert.equal(fs.readFileSync(path.join(candidate,'carwow/preserved.txt'),'utf8'),'Historical source');
  assert.equal(fs.readFileSync(path.join(candidate,'app/lib/dealer.json'),'utf8'),'{"name":"Client data"}');
  assert.match(fs.readFileSync(path.join(candidate,'karento-best/src/feature.ts'),'utf8'),/dealer customization/);
  assert.match(fs.readFileSync(path.join(candidate,'karento-best/src/feature.ts'),'utf8'),/"new"/);
});

function extendedFixture(t,key) {
  const client=fs.mkdtempSync(path.join(os.tmpdir(),'cars-extended-data-'));t.after(()=>fs.rmSync(client,{recursive:true,force:true}));
  for (const name of ['dealer-brand/light.webp','dealer-brand/dark.webp','dealer/vehicle.webp']) { const full=path.join(client,name);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,Buffer.from([82,73,70,70,0,1,2,3])); }
  const profile={slug:'fixture',business:{name:'Real Dealer',locale:'en-GB',countryCode:'AE',currency:'AED',country:'United Arab Emirates',phoneE164:'+971555123456',phoneHref:'tel:+971555123456',phoneDisplay:'+971 555 123456',email:'',address:'Verified Street',mapsUrl:'https://example.org/map',mapsEmbedUrl:'https://example.org/embed',socialLinks:{},hours:'Contact before visiting',logo:'/dealer-brand/light.webp',logoDark:'/dealer-brand/dark.webp',inventoryNotice:'Dated samples; confirm availability.',observedAt:'2026-09-09'},listings:[{id:'vehicle-1',title:'2020 Audi A3',make:'Audi',model:'A3',trim:'',year:2020,priceAmount:12500,currency:'AED',mileageValue:75000,mileageUnit:'km',powerHp:null,fuel:'Diesel',transmission:'Manual',body:'Hatchback',bodyType:'hatchback',color:'Blue',location:'Verified city',features:[],images:['/dealer/vehicle.webp'],image:'/dealer/vehicle.webp',description:'Dated source',availability:'Confirm availability',sourceUrl:'https://example.org/listing',observedAt:'2026-09-09',raw:{year:2020}}]};
  const files=new Map([[key+'/package.json',Buffer.from('{"name":"fixture"}')]]);
  return {client,profile,files};
}

test('Mobile adapter uses real identity/media, isolates saved data and removes captured dealer stock from the active feed',t=>{
  const x=extendedFixture(t,'mobile');
  x.profile.business.currency='USD'; // Explicit stock remains AED; never relabel amounts from stale business defaults.
  x.files.set('mobile/src/lib/showroom-config.ts',Buffer.from('export const showroom = defineShowroom({\n  name: "Your showroom"\n});\n'));
  x.files.set('mobile/src/lib/catalog.ts',Buffer.from('import type { Vehicle } from "./types";\nexport const vehicles: Vehicle[] = [oldVehicle];\nexport const makes = ["Audi"];\n'));
  x.files.set('mobile/src/lib/dealers.ts',Buffer.from('export const capturedDealers: Record<string,CapturedDealer> = {};\n'));
  for(const name of ['NativeDealerCards.tsx','DealerScreens.tsx','VehicleCard.tsx','VehicleSections.tsx'])x.files.set('mobile/src/components/'+name,fs.readFileSync(path.join('templates/mobile/src/components',name)));
  for(const name of ['locale.ts','search.ts'])x.files.set('mobile/src/lib/'+name,fs.readFileSync(path.join('templates/mobile/src/lib',name)));
  const adaptation=applyExtendedRefreshAdapter({...x,key:'mobile'});
  assert.match(x.files.get('mobile/src/lib/showroom-config.ts').toString(),/"storageNamespace": "fixture"/);
  assert.match(x.files.get('mobile/src/lib/showroom-config.ts').toString(),/"contactPreview": false/);
  const vehicles=JSON.parse(x.files.get('mobile/src/lib/dealer-inventory.json'));
  assert.equal(vehicles[0].dealer,'Real Dealer');assert.equal(vehicles[0].reviews,0);assert.ok(!('financeMonthly' in vehicles[0]));
  assert.equal(adaptation.mediaPaths[0],'/dealer/vehicle.webp');
  assert.ok(x.files.has('mobile/public/dealer-brand/light.webp'));
  assert.match(x.files.get('mobile/src/lib/catalog.ts').toString(),/dealerInventory as Vehicle\[\]/);
  assert.match(x.files.get('mobile/src/lib/locale.ts').toString(),/currency: "AED"/);
  assert.match(x.files.get('mobile/src/components/NativeDealerCards.tsx').toString(),/v\.reviews > 0 &&/);
  assert.doesNotMatch(x.files.get('mobile/src/components/NativeDealerCards.tsx').toString(),/based exclusively on data from mobile\.de/);
  assert.match(x.files.get('mobile/src/components/VehicleSections.tsx').toString(),/v\.seats > 0 \? String\(v\.seats\) : 'Not published'/);
  x.profile.listings.push({...x.profile.listings[0],id:'different-currency',currency:'EUR'});
  assert.throws(()=>applyExtendedRefreshAdapter({...x,key:'mobile'}),/mixed currency amounts cannot be relabeled/);
});

test('new family media uses retained legacy mounted assets without depending on retired Carwow publication',t=>{
  const x=extendedFixture(t,'mobile');
  const image='/variant-3/assets/dealer/current/source-id.webp',original=path.join(x.client,'carwow/static/assets/dealer/current/source-id.webp');
  fs.writeFileSync(path.join(x.client,'dealer.json'),JSON.stringify({variants:[{key:'carwow',base:'/variant-3'}]}));
  fs.mkdirSync(path.dirname(original),{recursive:true});fs.writeFileSync(original,Buffer.from([82,73,70,70,0,8,7,6]));
  x.profile.listings[0].image=image;x.profile.listings[0].images=[image];
  const assets=retainDealerVariantAssets(x.files,'mobile',x.profile,x.client);
  assert.deepEqual(assets.mediaPaths,['/assets/dealer/current/source-id.webp']);
  assert.deepEqual(assets.mediaMappings,[{sourcePath:image,publicPath:'/assets/dealer/current/source-id.webp'}]);
  assert.deepEqual(x.files.get('mobile/public/assets/dealer/current/source-id.webp'),fs.readFileSync(original));
  assert.equal(x.profile.listings[0].image,image,'canonical dealer facts remain unchanged');
  assert.equal(x.files.has('mobile/public/variant-3/assets/dealer/current/source-id.webp'),false);
  const competing=path.join(x.client,'assets/dealer/current/source-id.webp');
  fs.mkdirSync(path.dirname(competing),{recursive:true});fs.writeFileSync(competing,Buffer.from([82,73,70,70,0,9]));
  x.profile.listings.push({...x.profile.listings[0],id:'different',image:'/assets/dealer/current/source-id.webp',images:['/assets/dealer/current/source-id.webp']});
  assert.throws(()=>retainDealerVariantAssets(x.files,'mobile',x.profile,x.client),/Ambiguous retained media/);
});

test('Signature dealer cards and PDP share exact dated source IDs/media without donor staff, reviews or rental quotes',t=>{
  const x=extendedFixture(t,'karento-best');
  const template=path.resolve('templates/karento-best');
  for (const name of filesAt(template).filter(name=>name.startsWith('src/lib/'))) x.files.set('karento-best/'+name,fs.readFileSync(path.join(template,name)));
  x.profile.listings.push({...x.profile.listings[0],id:'vehicle-2',priceAmount:15000});
  const adaptation=applyExtendedRefreshAdapter({...x,key:'karento-best'});
  const details=x.files.get('karento-best/src/lib/data/dealer-detail.ts').toString();
  assert.match(details,/dealerDetails\.find\(item => item\.id === id\) \?\? null/);
  assert.match(details,/"title": "2020 Audi A3"/);
  assert.match(details,/"src": "\/dealer\/vehicle\.webp"/);
  assert.doesNotMatch(details,/672 reviews|Emily Rose|1-222|Rent This Vehicle/);
  const host=x.files.get('karento-best/src/lib/sections/VehicleEnquiryDetail.svelte').toString();
  assert.match(host,/page\.url\.searchParams\.get\("id"\)/);
  assert.match(host,/gallery=\{selected\.gallery\}/);
  assert.match(host,/<MobileVehicleDetail heading=\{selected\.heading\} gallery=\{selected\.gallery\}/);
  assert.match(x.files.get('karento-best/src/lib/components/vehicle-detail/MobileVehicleDetail.svelte').toString(),/VehicleReservationCard \{reservation\}/);
  assert.match(x.files.get('karento-best/src/lib/components/vehicle-detail/VehicleDetailPanels.svelte').toString(),/content\.loanFields\.length > 0/);
  assert.match(host,/Vehicle not found in this dated preview/);
  const home=x.files.get('karento-best/src/lib/data/vehicles.ts').toString();
  assert.match(home,/\/vehicle\?id=vehicle-1/);
  assert.doesNotMatch(home,/672 reviews|Book Now|Hyundai Sonata/);
  assert.match(home,/\/vehicle\?id=vehicle-2/);
  assert.match(x.files.get('karento-best/src/lib/content.ts').toString(),/"inventory": \{\}/);
  assert.ok(adaptation.contentPaths.some(name=>name.endsWith('/VehicleEnquiryDetail.svelte')));
  assert.match(x.files.get('karento-best/src/lib/sections/FeaturedVehicleCarousel.svelte').toString(),/\{#if referenceVehicles\.featuredVehicleSlides\[7\]\}/);
  assert.doesNotMatch(x.files.get('karento-best/src/lib/data/home-stories.ts').toString(),/Sophia Moore|Sara Mohamed/);
  assert.doesNotMatch(x.files.get('karento-best/src/lib/data/editorial.ts').toString().split('export const teamMembers')[1],/Emily Rose/);
});

test('extended input digest is stable across Windows newlines, excludes build/instructions and changes for any source/media edit',t=>{
  const x=extendedFixture(t,'karento-best');
  x.files.set('karento-best/src/config.ts',Buffer.from('name = "Real Dealer";\r\n'));
  const before=extendedVariantSourceDigest(x.files,'karento-best');
  x.files.set('karento-best/src/config.ts',normalized(x.files.get('karento-best/src/config.ts')));
  x.files.set('karento-best/AGENTS.md',Buffer.from('Derived instructions'));x.files.set('karento-best/build/output.js',Buffer.from('Generated'));
  assert.equal(extendedVariantSourceDigest(x.files,'karento-best'),before);
  x.files.set('karento-best/static/dealer.webp',Buffer.from([82,73,70,70,0,9]));
  assert.notEqual(extendedVariantSourceDigest(x.files,'karento-best'),before);
  const manifest=manifestFor('modern',true);manifest.templateRevisions['karento-best']=next;manifest.templateSources['karento-best']=source('karento-best');
  const receipt=sealExtendedVariant({...x,key:'karento-best',manifest,adaptation:{logoPaths:['/dealer-brand/light.webp'],mediaPaths:[],contentPaths:['karento-best/src/config.ts']}});
  assert.equal(receipt.needsDealerQA,true);assert.equal(receipt.readyToPublish,false);
  assert.equal(receipt.sourceDigest,extendedVariantSourceDigest(x.files,'karento-best'));
  assert.equal(receipt.personalization.profileSha256,sha256(JSON.stringify(x.profile)));
});
