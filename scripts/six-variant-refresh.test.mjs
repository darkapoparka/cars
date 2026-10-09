import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { planSixDesignSelection } from './lib/six-design-release.mjs';
import { selectPinnedRevisions, updateManifestPins, planDealerUpgrade, materializeUpgradeCandidate } from './dealer-updates/three-way-upgrade.mjs';
import { updateSelection, addLegacyDetailUpgrade } from './dealer-updates/update-dealer-template.mjs';
import { LEGACY_DETAIL_FILE, legacyDetailArtifact } from './publishing/legacy-detail-routes.mjs';
import { applyExtendedRefreshAdapter, extendedVariantSourceDigest, sealExtendedVariant, retainDealerVariantAssets } from './lib/client-refresh-six.mjs';
import { signatureBusinessPreview, signaturePriceFacts, signatureMileageFacts } from './lib/client-refresh-signature.mjs';
import { loadDealerProfile } from './lib/client-refresh-normalize.mjs';
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
  const profile={slug:'fixture',business:{name:'Real Dealer',locale:'en-GB',countryCode:'AE',currency:'AED',country:'United Arab Emirates',phoneE164:'+971555123456',phoneHref:'tel:+971555123456',phoneDisplay:'+971 555 123456',email:'',address:'Verified Street',mapsUrl:'https://example.org/map',mapsEmbedUrl:'https://example.org/embed',socialLinks:{},hours:'Contact before visiting',logo:'/dealer-brand/light.webp',logoDark:'/dealer-brand/dark.webp',inventoryNotice:'Dated samples; confirm availability.',observedAt:'2026-09-09'},listings:[{id:'vehicle-1',title:'2020 Audi A3',make:'Audi',model:'A3',trim:'',year:2020,priceAmount:12500,currency:'AED',mileageValue:75000,mileageUnit:'km',powerHp:null,fuel:'Diesel',fuelType:'diesel',transmission:'Manual',transmissionType:'manual',body:'Hatchback',bodyType:'hatchback',color:'Blue',location:'Verified city',features:[],images:['/dealer/vehicle.webp'],image:'/dealer/vehicle.webp',description:'Dated source',availability:'Confirm availability',sourceUrl:'https://example.org/listing',observedAt:'2026-09-09',raw:{year:2020}}]};
  const files=new Map([[key+'/package.json',Buffer.from('{"name":"fixture"}')]]);
  return {client,profile,files};
}

function signatureFixture(t) {
  const x=extendedFixture(t,'karento-best'),template=path.resolve('templates/karento-best');
  for(const name of filesAt(template).filter(name=>name.startsWith('src/lib/')))x.files.set('karento-best/'+name,fs.readFileSync(path.join(template,name)));
  return x;
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

test('Signature dealer facts preserve explicit offer currencies and distinguish unknown mileage from real zero',t=>{
  const x=extendedFixture(t,'karento-best'),stock=x.profile.listings[0];
  x.profile.business.currency='BGN';stock.currency='EUR';stock.raw={year:2020};
  assert.equal(signatureBusinessPreview(x.profile).currency,'EUR','stale business defaults cannot relabel dated stock');
  assert.deepEqual(signaturePriceFacts(stock),{priceAmount:12500,currency:'EUR'});
  assert.deepEqual(signatureMileageFacts({...stock,mileageValue:0}),{},'normalizer zero is not proof of a zero-mileage car');
  assert.deepEqual(signatureMileageFacts({...stock,mileageValue:0,raw:{mileageKm:0}}),{mileageValue:0,mileageUnit:'km'});
  x.profile.listings.push({...stock,id:'different-currency',currency:'AED'});
  assert.equal(signatureBusinessPreview(x.profile).currency,'','mixed feeds cannot invent one common currency');
  assert.equal(signatureBusinessPreview(x.profile).inventoryCount,2);
  assert.equal(signatureBusinessPreview({...x.profile,business:{...x.profile.business,observedAt:''},listings:[{...stock,observedAt:''}]}).observedAt,'','unknown source dates remain unknown');
  assert.throws(()=>signatureBusinessPreview({...x.profile,business:{...x.profile.business,observedAt:'invented-date'}}),/observation date is invalid/);
  assert.throws(()=>signatureBusinessPreview({...x.profile,listings:[stock,{...stock}]}),/unique/);
  assert.throws(()=>signaturePriceFacts({...stock,priceAmount:-1}),/invalid stock price/);
  assert.throws(()=>signaturePriceFacts({...stock,currency:'EUR 12500'}),/invalid stock price/);
  assert.deepEqual(signaturePriceFacts({...stock,priceAmount:null}),{});
  assert.throws(()=>signatureMileageFacts({...stock,mileageValue:-1,raw:{mileageKm:5}}),/invalid stock mileage/);
});

test('Signature dealer cards and PDP share exact dated source IDs/media without donor staff, reviews or rental quotes',t=>{
  const x=signatureFixture(t);
  const originalHost=Buffer.from(x.files.get('karento-best/src/lib/sections/VehicleEnquiryDetail.svelte'));
  const originalMobile=Buffer.from(x.files.get('karento-best/src/lib/components/vehicle-detail/MobileVehicleDetail.svelte'));
  x.profile.listings.push({...x.profile.listings[0],id:'vehicle-2',priceAmount:15000,fuel:'Not published',fuelType:'other',transmission:'Not published',transmissionType:'other'});
  const adaptation=applyExtendedRefreshAdapter({...x,key:'karento-best'});
  const details=x.files.get('karento-best/src/lib/data/dealer-detail.ts').toString();
  assert.match(details,/dealerDetails\.find\(item => item\.id === id\) \?\? null/);
  assert.match(details,/"title": "2020 Audi A3"/);
  assert.match(details,/"src": "\/dealer\/vehicle\.webp"/);
  assert.doesNotMatch(details,/672 reviews|Emily Rose|1-222|Rent This Vehicle/);
  const host=x.files.get('karento-best/src/lib/sections/VehicleEnquiryDetail.svelte').toString();
  const nativeDetail=/specifications\?\s*:\s*readonly DetailSpecification\[\]/.test(originalHost.toString());
  if(nativeDetail){
    assert.deepEqual(x.files.get('karento-best/src/lib/sections/VehicleEnquiryDetail.svelte'),originalHost,'native host composition is retained byte for byte');
    assert.deepEqual(x.files.get('karento-best/src/lib/components/vehicle-detail/MobileVehicleDetail.svelte'),originalMobile,'native mobile composition is retained byte for byte');
    const page=x.files.get('karento-best/src/lib/pages/cars-details-3.svelte').toString();
    for(const [prop,field]of [['heading','heading'],['gallery','gallery'],['specifications','specifications'],['details','content'],['reservation','reservation'],['seller','seller']])assert.ok(page.includes(`${prop}={dealerBreadcrumbDetail.${field}}`));
    assert.match(page,/\{#if dealerBreadcrumbDetail\}<VehicleEnquiryDetail/);
    assert.match(page,/\{:else\}<DealerVehicleNotFound \/>\{\/if\}/);
    assert.equal(adaptation.contentPaths.includes('karento-best/src/lib/sections/VehicleEnquiryDetail.svelte'),false);
  }else{
    assert.match(host,/page\.url\.searchParams\.get\("id"\)/);
    assert.match(host,/gallery=\{selected\.gallery\}/);
    assert.match(host,/<MobileVehicleDetail heading=\{selected\.heading\} gallery=\{selected\.gallery\}/);
  }
  assert.match(x.files.get('karento-best/src/lib/components/vehicle-detail/MobileVehicleDetail.svelte').toString(),/VehicleReservationCard \{reservation\}/);
  const panels=x.files.get('karento-best/src/lib/components/vehicle-detail/VehicleDetailPanels.svelte').toString();
  if(panels.includes('!dealer.businessPreview')) {
    assert.match(panels,/\{#if !dealer\.businessPreview && !product && mobile\.current\}/);
    assert.match(panels,/\{#if !dealer\.businessPreview && !product && !mobile\.current\}/);
  } else assert.match(panels,/content\.loanFields\.length > 0/);
  if(adaptation.nativeFacts){
    if(!nativeDetail)assert.match(host,/\{:else\}<DealerVehicleNotFound \/>/);
    assert.match(x.files.get('karento-best/src/lib/components/vehicle-detail/DealerVehicleNotFound.svelte').toString(),/locale\.t\("dealer\.vehicle\.missing"\)/);
    assert.match(x.files.get('karento-best/src/lib/pages/cars-details-3.svelte').toString(),/VehicleBreadcrumb centered vehicleTitle=\{dealerBreadcrumbDetail\?\.heading\.title\}/);
    assert.match(x.files.get('karento-best/src/lib/pages/cars-details-3.svelte').toString(),/dealerDetailFor\(dealerPage\.url\.searchParams\.get\("id"\)\)/);
  }else assert.match(host,/Vehicle not found in this dated preview/);
  const home=x.files.get('karento-best/src/lib/data/vehicles.ts').toString();
  assert.match(home,/\/vehicle\?id=vehicle-1/);
  assert.doesNotMatch(home,/672 reviews|Book Now|Hyundai Sonata/);
  assert.match(home,/\/vehicle\?id=vehicle-2/);
  const cards=JSON.parse(x.files.get('karento-best/src/lib/data/dealer-vehicles.json'));
  assert.equal(cards[1].card.fuel,'');assert.equal(cards[1].card.transmission,'');
  assert.equal(Object.hasOwn(cards[1].card,'fuelType'),false,'absent fuel cannot become a published Other fact');
  assert.equal(Object.hasOwn(cards[1].card,'transmissionType'),false,'absent transmission cannot become a published Other fact');
  assert.match(x.files.get('karento-best/src/lib/content.ts').toString(),/"inventory": \{\}/);
  assert.ok(adaptation.contentPaths.some(name=>name.endsWith(nativeDetail?'/cars-details-3.svelte':'/VehicleEnquiryDetail.svelte')));
  if(adaptation.nativeFacts){
    const generated=JSON.parse(details.split('export const dealerDetails: readonly DealerDetail[] = ')[1].split(';\nexport function')[0]);
    assert.equal(generated[0].specifications.find(item=>item.id==='diesel').labelKey,'vehicle.field.fuel');
    assert.equal(generated[0].specifications.find(item=>item.id==='auto').labelKey,'vehicle.field.transmission');
  }
  assert.match(x.files.get('karento-best/src/lib/sections/FeaturedVehicleCarousel.svelte').toString(),/\{#if referenceVehicles\.featuredVehicleSlides\[7\]\}/);
  assert.doesNotMatch(x.files.get('karento-best/src/lib/data/home-stories.ts').toString(),/Sophia Moore|Sara Mohamed/);
  assert.doesNotMatch(x.files.get('karento-best/src/lib/data/editorial.ts').toString().split('export const teamMembers')[1],/Emily Rose/);
});

test('Signature native binding refuses disconnected typed consumers and retains the guarded older host adaptation',t=>{
  const x=signatureFixture(t),hostPath='karento-best/src/lib/sections/VehicleEnquiryDetail.svelte';
  const original=x.files.get(hostPath);
  x.files.set(hostPath,Buffer.from(original.toString().replace('<MobileVehicleDetail {heading} {gallery} {specifications} {details} {reservation} {seller} />','<MobileVehicleDetail {heading} {gallery} {specifications} {details} {reservation} />')));
  assert.throws(()=>applyExtendedRefreshAdapter({...x,key:'karento-best'}),/must forward all six mobile props exactly once/);
  const older=signatureFixture(t);
  older.files.set(hostPath,Buffer.from('<svelte:options runes={true} />\n<script lang="ts">\n</script>\n<MobileVehicleDetail /><VehicleHeading /><VehicleSliderGallery /><VehicleSpecifications alignStart /><VehicleDetailPanels /><VehicleReservationCard /><DetailSellerCard />\n'));
  applyExtendedRefreshAdapter({...older,key:'karento-best'});
  const adapted=older.files.get(hostPath).toString();
  assert.match(adapted,/dealerDetailFor\(page\.url\.searchParams\.get\("id"\)\)/);
  assert.match(adapted,/MobileVehicleDetail heading=\{selected\.heading\} gallery=\{selected\.gallery\}/);
  assert.match(adapted,/\{:else\}<DealerVehicleNotFound \/>\{\/if\}/);
});

test('Al Reef authoritative illustrative pack remains illustrative in the native English and Bulgarian preview',async()=>{
  const client=path.resolve('clients/al-reef-used-cars'),stockPath=path.join(client,'stock.json'),before=fs.readFileSync(stockPath);
  const stock=JSON.parse(before),profile=loadDealerProfile(client,'al-reef-used-cars');
  assert.equal(stock.kind,'illustrative-not-dealer-stock');
  assert.equal(profile.stockKind,stock.kind);
  assert.ok(profile.business.observedAt,'a business observation date cannot verify illustrative stock');
  const preview=signatureBusinessPreview(profile);
  assert.equal(preview.mode,'illustrative-not-dealer-stock');
  assert.equal(preview.inventoryCount,stock.listings.length);
  for(const listing of profile.listings){
    const retained=stock.listings.find(item=>item.id===listing.id);
    assert.ok(retained);assert.equal(listing.priceAmount,retained.priceAmount);assert.equal(listing.currency,retained.currency);
    assert.deepEqual(listing.images,retained.images);
  }
  const [{stockSummary,stockNotice,stockFaqAnswer},{en},{bg}]=await Promise.all([
    import('../templates/karento-best/src/lib/i18n/dealer.ts'),
    import('../templates/karento-best/src/lib/i18n/catalogs/en.ts'),
    import('../templates/karento-best/src/lib/i18n/catalogs/bg.ts')
  ]);
  for(const catalog of [en,bg]){
    const keys=[],locale={number:String,date:()=>{throw new Error('An illustrative summary must not label examples with a stock observation date');},t:(key,params={})=>{
      keys.push(key);assert.ok(catalog[key]);return catalog[key].replace(/\{(\w+)\}/g,(_,name)=>params[name]??'');
    }};
    assert.equal(stockSummary(preview,locale),catalog['dealer.stock.illustrativeCount'].replace('{count}',String(stock.listings.length)));
    assert.equal(stockNotice(preview,locale),catalog['dealer.stock.illustrativeNotice']);
    assert.equal(stockFaqAnswer('availability',preview,locale),catalog['dealer.faq.illustrativeAvailability']);
    assert.equal(keys.some(key=>key==='dealer.stock.snapshotCount'),false);
  }
  const files=new Map([['karento-best/package.json',Buffer.from('{"name":"fixture"}')]]),manifest=manifestFor('modern',true);
  const receipt=sealExtendedVariant({files,key:'karento-best',manifest,profile,adaptation:{nativeFacts:true,logoPaths:['/dealer-brand/logo-on-light.webp'],mediaPaths:[],contentPaths:[]}});
  assert.equal(receipt.inventory.mode,'illustrative-not-dealer-stock','the install/publishing receipt cannot relabel sample inventory');
  assert.deepEqual(fs.readFileSync(stockPath),before,'the independent dealer is never regenerated or edited');
});

test('six migration records exact preserved Carwow links and a Signature-only refresh preserves that artifact',t=>{
  const x=extendedFixture(t,'karento-best'),old=manifestFor('modern'),nextManifest=manifestFor('modern',true);
  fs.writeFileSync(path.join(x.client,'dealer.json'),JSON.stringify(old));
  for(const relative of ['business-facts.json','stock.json','carwow/src/lib/data/daynight-current-inventory.ts','carwow/src/lib/data/daynight-vehicles.ts']){
    const destination=path.join(x.client,relative);fs.mkdirSync(path.dirname(destination),{recursive:true});
    fs.copyFileSync(path.join('clients/promosale-varna',relative),destination);
  }
  const files=new Map([['dealer.json',Buffer.from(JSON.stringify(nextManifest))]]);
  const result=addLegacyDetailUpgrade({files,dealerRoot:x.client,manifest:nextManifest,pins:{import:{}}});
  assert.equal(result.entries,6);assert.equal(result.retired,0);
  const artifact=legacyDetailArtifact(files,nextManifest);
  assert.equal(artifact.family,'import');
  assert.ok(artifact.entries.every(entry=>entry.targetId===entry.sourceId));
  const reviewed=Buffer.from(files.get(LEGACY_DETAIL_FILE)),reference=structuredClone(nextManifest.legacyDetailRoutes);
  fs.writeFileSync(path.join(x.client,'dealer.json'),JSON.stringify(nextManifest));
  assert.equal(addLegacyDetailUpgrade({files,dealerRoot:x.client,manifest:nextManifest,pins:{'karento-best':{}}}),null);
  assert.deepEqual(nextManifest.legacyDetailRoutes,reference);
  assert.deepEqual(files.get(LEGACY_DETAIL_FILE),reviewed);
  files.set(LEGACY_DETAIL_FILE,Buffer.from('{}'));
  assert.throws(()=>addLegacyDetailUpgrade({files,dealerRoot:x.client,manifest:nextManifest,pins:{'karento-best':{}}}),/artifact differs/);
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
  const receipt=sealExtendedVariant({...x,key:'karento-best',manifest,adaptation:{nativeFacts:true,logoPaths:['/dealer-brand/light.webp'],mediaPaths:[],contentPaths:['karento-best/src/config.ts']}});
  assert.equal(receipt.needsDealerQA,true);assert.equal(receipt.readyToPublish,false);
  assert.equal(receipt.sourceDigest,extendedVariantSourceDigest(x.files,'karento-best'));
  assert.equal(receipt.personalization.profileSha256,sha256(JSON.stringify(x.profile)));
  const again=sealExtendedVariant({...x,key:'karento-best',manifest,adaptation:receipt.personalization});
  assert.equal(again.personalization.nativeDealerFacts,true,'selective resealing retains the native factual contract');
  x.profile.listings[0].priceAmount=1;
  assert.throws(()=>sealExtendedVariant({...x,key:'karento-best',manifest,adaptation:receipt.personalization}),/facts changed after personalization/);
});
