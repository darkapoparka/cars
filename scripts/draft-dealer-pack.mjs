#!/usr/bin/env node
/** Import only public expansion facts into a new, compact draft. No network or provider writes. */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,git,inside,json,sha256} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {PACK_KEYS,PACK_COUNTRIES,PACK_LOCK,validPackSlug,safePackPath,createPackManifest,encodePackJson,listDealerPacks,assertPublicPackFacts} from './lib/dealer-pack.mjs';
import {demoCatalogRecords} from './registered-dealer-adoption.mjs';
import {canonicalPackSlug, assertPackBatch, PACK_BATCH_FILE, expectedPackHosting} from './lib/dealer-pack-identity.mjs';
import {createStablePackQualification} from './lib/dealer-pack-release.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
const EXPANSION='leads/expansion-2026-10-18';
const PREVIEW_NOTICE='Independent website and logo proposal; not dealer approved. Forms do not send messages and do not reserve vehicles.';
export const DEMO_STOCK_DISCLOSURE='Illustrative demo vehicles from the retained Cars template; these are not this dealer’s stock. Availability has not been verified. Listing prices are omitted in this preview.';
const normalize=value=>String(value??'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]/g,'');
const text=value=>typeof value==='string'?value.trim():'';
const dated=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}(?:T.*Z)?$/.test(value)&&Number.isFinite(Date.parse(value));
const hasPrice=value=>/(?:[$£€]\s*[0-9]|\b(?:USD|GBP|AED|EUR)\s*[0-9]|\b[0-9][0-9,. ]*\s*(?:USD|GBP|AED|EUR)\b)/i.test(value);

function publicUrl(value){
  if(typeof value!=='string'||value.length>2048)return '';
  try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password&&url.hostname.includes('.')&&!/^(?:localhost|127\.|10\.|192\.168\.|169\.254\.)/.test(url.hostname)&&![...url.searchParams.keys()].some(key=>/token|secret|signature|api.?key|password|auth/i.test(key))?url.href:'';}catch{return '';}
}

export function publicBusinessPhone(value,country){
  const source=text(value);if(!/^[+0-9 ().-]{7,30}$/.test(source))return '';
  const number=source.replace(/\D/g,'');if(number.length<7||number.length>15)return '';
  if(source.startsWith('+'))return '+'+number;
  if(number.startsWith('00'))return '+'+number.slice(2);
  if(country==='US'&&number.length===10)return '+1'+number;
  if(country==='US'&&number.length===11&&number.startsWith('1'))return '+'+number;
  if(country==='GB'&&number.startsWith('0')&&number.length===11)return '+44'+number.slice(1);
  if(country==='AE'&&number.startsWith('0')&&[9,10].includes(number.length))return '+971'+number.slice(1);
  return source;
}

/** Heterogeneous research stays outside the pack; only this explicit allowlist crosses. */
export function publicFactsFromLead(lead,{slug,observedAt,document={}}={}){
  assert(lead&&typeof lead.id==='string'&&PACK_COUNTRIES[lead.country]&&validPackSlug(slug),'Supported exact expansion identity required');
  const contact=lead.public_business_contact??lead.publicBusinessContact??lead.businessContact??{};
  const website=publicUrl(typeof lead.website==='string'?lead.website:lead.website?.url);
  const stockUrl=publicUrl(lead.inventory?.source_url??lead.inventory?.sourceUrl??lead.website?.inventoryUrl);
  const rawSources=[...(lead.source_urls??[]),...(lead.evidenceUrls??[]),...(lead.sources??[]).map(row=>typeof row==='string'?row:row.url),website,stockUrl,contact.source_url,contact.sourceUrl];
  const urls=[...new Set(rawSources.map(publicUrl).filter(Boolean))];
  const date=[observedAt,lead.researchAsOf,lead.researchDate,lead.website?.checkedAt,document.researchAsOf,document.researchDate].find(dated)??'';
  const business={name:text(lead.name),city:text(lead.city),region:text(lead.region??lead.emirate),countryCode:lead.country,...PACK_COUNTRIES[lead.country],
    address:text(lead.address),phone:publicBusinessPhone(contact.phone,lead.country),phoneDisplay:publicBusinessPhone(contact.phone,lead.country)?text(contact.phone):'',
    email:/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(text(contact.email))?text(contact.email):'',website,stockUrl,hours:text(lead.openingHours??lead.hours),
    sourceUrl:website||urls[0]||'',observedAt:date,inventoryNotice:'',previewNotice:PREVIEW_NOTICE,
    logo:'/dealer-brand/logo-on-light.png',logoLight:'/dealer-brand/logo-on-light.png',logoDark:'/dealer-brand/logo-on-dark.png'};
  assert(Object.values(business).every(value=>typeof value!=='string'||value.length<=2048&&!hasPrice(value)),'Business fields contain a price or exceed their public input bound');
  return {schemaVersion:1,slug,dealerId:lead.id,business,sources:urls.map(url=>({url,observedAt:date,supports:['retained-public-business-research']}))};
}

export function readExpansionLead(root,id){
  assert(typeof id==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)&&id.length<=140,'Exact expansion lead ID required');
  const directory=inside(root,EXPANSION,{mustExist:true}),manifest=json(path.join(directory,'manifest.json'));
  const files=(manifest.files??[]).filter(row=>/^(?:uk|uae|usa)(?:-supplement(?:-2)?)?\.json$/.test(row.file));
  assert(files.length>0&&files.length<=10,'Bounded expansion file manifest required');
  const matches=[];
  for(const row of files){
    const file=inside(directory,row.file,{mustExist:true}),bytes=fs.readFileSync(file);assert(bytes.length<=4*1024**2,'Expansion source exceeds its input bound');
    if(row.sha256)assert(sha256(bytes)===row.sha256,'Expansion source differs from its retained manifest: '+row.file);
    const document=JSON.parse(bytes);assert(Array.isArray(document.leads)&&document.leads.length<=1000,'Bounded expansion leads required');
    for(const lead of document.leads)if(lead.id===id)matches.push({lead,document,source:{path:EXPANSION+'/'+row.file,sha256:sha256(bytes)}});
  }
  assert(matches.length===1,'Expansion ID must match exactly one retained research record');return matches[0];
}

function rasterExtension(bytes){
  if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return 'png';
  if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'jpg';
  if(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP')return 'webp';
  throw Error('Stock media must be actual public PNG, JPEG or WebP bytes');
}

export function importPublicStock(input,{slug,country,mediaRoot}={}){
  assert(PACK_COUNTRIES[country],'Supported stock country required');
  assert(input?.schemaVersion===1&&input.dealer===slug&&input.kind==='dated-listing-snapshot'&&dated(input.observedAt)&&Array.isArray(input.records)&&input.records.length>0&&input.records.length<=200,'Use the exact dealer’s dated stock.records snapshot');
  assert(mediaRoot,'Sourced stock imports need their retained local --media-root');
  const media=new Map(),ids=new Set(),records=[];
  for(const source of input.records){
    assert(validPackSlug(source.id)&&!ids.has(source.id)&&['title','make','model'].every(key=>text(source[key])&&source[key].length<=180&&!hasPrice(source[key]))&&Number.isInteger(source.year)&&source.year>=1900&&source.year<=2100,'Stock requires distinct bounded IDs and explicit price-free vehicle identity');ids.add(source.id);
    assert(publicUrl(source.sourceUrl)&&dated(source.observedAt)&&Array.isArray(source.images)&&source.images.length>0&&source.images.length<=20,'Every stock record needs dated public evidence and retained photos');
    const record={id:source.id,title:text(source.title),make:text(source.make),model:text(source.model),year:source.year,currency:PACK_COUNTRIES[country].currency,
      images:[],sourceUrl:publicUrl(source.sourceUrl),observedAt:source.observedAt,
      availability:'Advertised in the retained public listing; current availability has not been independently confirmed.',priceOnRequest:true,priceAmount:null};
    for(const key of ['bodyType','transmission','fuel','color'])if(text(source[key])){assert(!hasPrice(source[key])&&source[key].length<=160,'Invalid optional stock field');record[key]=text(source[key]);}
    if(Number.isFinite(source.mileageValue)&&source.mileageValue>=0&&['km','mi'].includes(source.mileageUnit)){record.mileageValue=source.mileageValue;record.mileageUnit=source.mileageUnit;}else record.mileageOnRequest=true;
    for(const relative of source.images){
      assert(typeof relative==='string'&&/^\/dealer-stock\/[A-Za-z0-9][A-Za-z0-9._-]*\.(?:png|webp|jpe?g)$/.test(relative)&&safePackPath(relative.slice(1)),'Stock media must use a flat /dealer-stock/ path');
      const bytes=fs.readFileSync(inside(mediaRoot,relative.slice(1),{mustExist:true}));assert(bytes.length>0&&bytes.length<=25*1024**2,'Stock image exceeds its public input budget');rasterExtension(bytes);
      media.set(relative.slice(1),bytes);record.images.push(relative);
    }
    records.push(record);
  }
  const disclosure='Dated public listing samples observed on '+input.observedAt.slice(0,10)+'. Availability has not been confirmed. Listing prices are omitted in this preview.';
  return {stock:{schemaVersion:1,dealer:slug,kind:'dated-listing-snapshot',observedAt:input.observedAt,disclosure,records},media};
}

/** Reuse the maintained, literal-only demo catalogue and immutable source images. */
export function retainedDemoStock({root,slug,country,lock,observedAt,readGit=git}={}){
  const source=lock.templates?.['auto-best']?.source;
  assert(source?.repository==='darkapoparka/cars'&&source.path==='templates/auto-best'&&/^[a-f0-9]{40}$/.test(source.revision??'')&&/^[a-f0-9]{40}$/.test(source.tree??''),'Exact retained Auto Best demo source required');
  assert(readGit(root,['rev-parse',source.revision+':'+source.path])===source.tree,'Retained demo subtree differs from the template lock');
  const read=name=>readGit(root,['show',source.revision+':'+source.path+'/'+name],{encoding:null});
  const catalog=read('src/lib/data/inventory.ts'),bindings=read('src/lib/config/lead-site.ts');
  assert(catalog.length<=256*1024&&bindings.length<=256*1024,'Retained demo source is unexpectedly large');
  const rows=demoCatalogRecords(catalog,bindings).slice(0,3),media=new Map();assert(rows.length>0,'Retained demo catalogue is empty');
  const records=rows.map(row=>{
    assert(typeof row.image==='string'&&row.image.startsWith('/')&&safePackPath(row.image.slice(1)),'Retained demo photo path is unsafe');
    const bytes=read('static'+row.image);assert(bytes.length>0&&bytes.length<=25*1024**2,'Retained demo photo is too large');
    const name='dealer-stock/template-demo-'+row.id+'.'+rasterExtension(bytes);media.set(name,bytes);
    return {id:'template-demo-auto-best-'+row.id,title:row.title,make:row.make,model:row.title.startsWith(row.make+' ')?row.title.slice(row.make.length+1):row.title,year:row.yearNumber,
      ...(row.body?{bodyType:row.body}:{}),currency:PACK_COUNTRIES[country].currency,mileageOnRequest:true,images:['/'+name],
      sourceUrl:'https://github.com/darkapoparka/cars/blob/'+source.revision+'/'+source.path+'/src/lib/data/inventory.ts',observedAt,
      availability:'Illustrative template example; not dealer stock.',priceOnRequest:true,priceAmount:null};
  });
  return {stock:{schemaVersion:1,dealer:slug,kind:'illustrative-not-dealer-stock',dealerStock:false,observedAt,disclosure:DEMO_STOCK_DISCLOSURE,
    templateDemo:{source,catalog:{path:'src/lib/data/inventory.ts',sha256:sha256(catalog)},bindings:{path:'src/lib/config/lead-site.ts',sha256:sha256(bindings)}},records},media};
}

/** These fixed disclosures are authored UI text, never a translation of unreviewed advert prose. */
export function draftInventoryCopy(stock,{slug}={}){
  const en=stock.disclosure;
  const bg=stock.kind==='illustrative-not-dealer-stock'
    ?'Илюстративни демонстрационни автомобили от запазения шаблон Cars; те не са наличности на тази автокъща. Наличността не е проверена. Цените са пропуснати в този преглед.'
    :'Примери от публични обяви, наблюдавани на '+stock.observedAt.slice(0,10)+'. Наличността не е потвърдена. Цените са пропуснати в този преглед.';
  for(const row of stock.records)row.description=en;
  return {schemaVersion:1,kind:'cars-new-source-reviewed-companion-copy',dealer:slug,reviewed:false,reviewedAt:null,stockSha256:sha256(encodePackJson(stock)),
    descriptions:stock.records.map(row=>({sourceId:row.id,sourceDescription:en,en,bg}))};
}

export function draftPackQualification(root,slug,lock){
  const release=lock.templates?.['auto-best'],value=release?.qualification;
  assert(value?.contextId&&value.sourceDeltaReview&&PACK_KEYS.every(key=>lock.templates[key]?.qualification?.contextId===value.contextId),'Qualify the shared candidate template lock before drafting packs');
  return createStablePackQualification(root,slug,lock);
}

export function draftDealerPack({root=ROOT,leadId,slug,batch,stockFile,mediaRoot,observedAt,now=new Date().toISOString(),readLead=readExpansionLead,readDemo=retainedDemoStock}={}){
  const {lead,document,source}=readLead(root,leadId);
  slug??=text(lead.name).normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const requestedSlug=slug;slug=canonicalPackSlug(slug,lead.id);
  assert(validPackSlug(slug)&&dated(now),'Choose a DNS-safe slug and a real execution date');
  const directory=inside(root,'dealers/'+slug),registryFile=path.join(root,'docs/DEPLOYMENT-INVENTORY.json');
  const fleet=fs.existsSync(registryFile)?json(registryFile).dealers??[]:[],packs=listDealerPacks(root);
  assert(!fs.existsSync(directory)&&![...fleet,...packs].some(row=>normalize(row.slug)===normalize(slug)||[row.id,row.dealerId,row.researchId].includes(lead.id)||row.name&&normalize(row.name)===normalize(lead.name)),'Dealer identity or draft directory already exists; existing packs and clients are preserved');
  const lock=json(path.join(root,PACK_LOCK)),facts=publicFactsFromLead(lead,{slug,observedAt,document});
  const inventory=stockFile?importPublicStock(json(stockFile),{slug,country:lead.country,mediaRoot}):readDemo({root,slug,country:lead.country,lock,observedAt:now});
  facts.business.inventoryNotice=inventory.stock.disclosure;
  const copyReview=draftInventoryCopy(inventory.stock,{slug,reviewedAt:now});
  const contactScreen=assertPublicPackFacts(facts,inventory.stock,{allowContactFlags:true});
  const manifest=createPackManifest({slug,dealerId:lead.id,country:lead.country,lock,observedAt:facts.business.observedAt});
  manifest.shareIdentity={name:facts.business.name,publicOrigin:expectedPackHosting(slug).publicOrigin,description:PREVIEW_NOTICE};
  manifest.pack.schemaVersion=2;manifest.pack.identity={requestedSlug,canonicalSlug:slug,dealerId:lead.id};
  if(fs.existsSync(path.join(root,PACK_BATCH_FILE)))manifest.pack.batch=assertPackBatch(root,manifest,{batch});
  else assert(batch===undefined,'Explicit batch checks require the committed assignment file');
  const missing=['name','city','address','sourceUrl','observedAt','phone','email','website','hours'].filter(key=>!facts.business[key]).map(key=>({field:'business.'+key,required:['name','city','sourceUrl','observedAt'].includes(key),reason:'No usable sourced value in the retained public business record.'}));
  missing.push({field:'prices',required:false,reason:'All listing prices are omitted under the public-repository scope.'});
  const blocking=missing.filter(row=>row.required).map(row=>row.field);
  const identity={schemaVersion:1,kind:'cars-new-dealer-identity-review',reviewed:false,reviewedAt:null,dealer:slug,dealerId:lead.id,repository:'darkapoparka/cars',existingIdentityFound:false,sourceOwnership:'cars-canonical',
    review:{kind:'pending',humanReview:false,dealerApproval:false},method:'Draft identity only; run automated pack input review before building.',sources:facts.sources.map(({url,observedAt})=>({url,observedAt}))};
  const report={schemaVersion:1,type:'cars-dealer-pack-draft',slug,dealerId:lead.id,status:'draft',buildReady:false,providerWrites:0,createdAt:now,
    inventoryKind:inventory.stock.kind,inventoryRecords:inventory.stock.records.length,logoReady:false,missingFacts:missing,contactScreen,blocking:[...blocking,...contactScreen.blocking,'branding.reviewed-assets','automated-input-review'],
    stockAcquisition:stockFile?'explicit-retained-public-snapshot':'maintained-disclosed-demo',liveListingFetchPerformed:false,
    next:'Retain public listing snapshots with --stock/--media-root when available; review source artwork, prepare the logo, then run dealer-pack review. Automated input review does not imply human, dealer or hosted approval.'};
  const files=new Map([
    ['dealer.json',manifest],['business-facts.json',facts],['stock.json',inventory.stock],['copy-review.json',copyReview],['locale.json',manifest.localization],['identity-review.json',identity],['qualification.json',draftPackQualification(root,slug,lock)],
    ['FACTS-AND-INVENTORY.json',{schemaVersion:1,dealer:slug,businessFacts:'business-facts.json',stock:'stock.json',inventoryKind:inventory.stock.kind,inventoryNotice:inventory.stock.disclosure,previewNotice:PREVIEW_NOTICE,sources:facts.sources}],
    ['missing-facts.json',{schemaVersion:1,dealer:slug,missing,blocking}],['source-evidence.json',{schemaVersion:1,dealer:slug,source,publicSources:facts.sources,liveFetchPerformed:false}],
    ['branding/source.json',{schemaVersion:1,dealer:slug,status:'research-required',realLogoFirst:true,publicSources:facts.sources.map(({url,observedAt})=>({url,observedAt})),originals:[],creationMethod:null,dealerApproved:false,generatedInputs:null}],
    ['draft-report.json',report],
  ].map(([name,value])=>[name,encodePackJson(value)]));
  for(const row of inventory.media)files.set(...row);
  assert(files.size<=512&&[...files.values()].reduce((sum,bytes)=>sum+bytes.length,0)<=256*1024**2,'Draft exceeds the compact pack budget');
  fs.mkdirSync(path.dirname(directory),{recursive:true});fs.mkdirSync(directory);
  for(const [name,bytes] of files){const file=inside(directory,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes,{flag:'wx'});}
  return {...report,directory,files:files.size,bytes:[...files.values()].reduce((sum,value)=>sum+value.length,0)};
}

export function parseDraftArgs(argv){
  const result={},names={'--lead':'leadId','--slug':'slug','--batch':'batch','--stock':'stockFile','--media-root':'mediaRoot','--observed-at':'observedAt'};
  for(let i=0;i<argv.length;i++){const key=argv[i];assert(names[key]&&!Object.hasOwn(result,names[key])&&argv[i+1]&&!argv[i+1].startsWith('--'),'Unknown, repeated or incomplete draft option: '+key);result[names[key]]=argv[++i];}
  assert(result.leadId&&(!result.batch||/^[1-4]$/.test(result.batch))&&(!result.mediaRoot||result.stockFile)&&(!result.observedAt||dated(result.observedAt)),'Use --lead EXPANSION_ID [--slug SLUG] [--batch 1|2|3|4] [--stock STOCK_JSON --media-root DIRECTORY]');return result;
}

if(isEntrypoint(import.meta.url))try{
  if(process.argv.includes('--help'))console.log('Usage: node scripts/draft-dealer-pack.mjs --lead EXPANSION_ID [--slug SLUG] [--stock STOCK_JSON --media-root DIRECTORY] [--observed-at DATE]\nCreates one new input-only draft from retained public business fields. Existing packs are preserved. Explicit dated stock is imported with prices omitted; otherwise the maintained disclosed demo is used. Real-logo research and reviewed generated artwork remain explicit prerequisites; no network or provider writes.');
  else console.log(JSON.stringify(draftDealerPack(parseDraftArgs(process.argv.slice(2))),null,2));
}catch(error){console.error(error.message);process.exitCode=1;}
