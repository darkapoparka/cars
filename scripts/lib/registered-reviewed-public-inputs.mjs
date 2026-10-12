import {createHash} from 'node:crypto';
import {parseCatalogJson} from './native-localization.mjs';
import {validateNewSourceRaster} from './source-input-raster.mjs';
export const REGISTERED_PUBLIC_ROOT='.client/registered-reviewed-public-inputs';
export const isRegisteredPublishedMaterializationPath=n=>typeof n==='string'&&n.startsWith(REGISTERED_PUBLIC_ROOT+'/')&&/^(?:(?:facts|stock|branding|input-manifest)\.json|branding\/(?:generated-master|on-light|on-dark|on-accent)\.png|media\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:png|webp|jpe?g))$/.test(n.slice(REGISTERED_PUBLIC_ROOT.length+1));
const fail=m=>{throw Error('Registered reviewed public inputs: '+m);};
const assert=(v,m)=>{if(!v)fail(m);},sha=b=>createHash('sha256').update(b).digest('hex'),hex=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const keys=(v,k)=>assert(v&&!Array.isArray(v)&&same(Object.keys(v).sort(),[...k].sort()),'exact input fields required');
const date=v=>typeof v==='string'&&Number.isFinite(Date.parse(v)),safe=n=>typeof n==='string'&&/^[a-zA-Z0-9._/-]+$/.test(n)&&!n.startsWith('/')&&n.split('/').every(p=>p&&p!=='.'&&p!=='..');
const url=n=>{try{const u=new URL(n);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
const json=b=>parseCatalogJson(new TextDecoder('utf-8',{fatal:true}).decode(b).replace(/^\uFEFF/,''));
/** One data-only join, reused at immutable Git admission and sealed local reading.
 * readBytes(pin,localPath,maxBytes) authenticates the source in its own boundary.
 * This never evaluates dealer code or changes retained source/stock/photo bytes. */
export function validateRegisteredPublishedInputs(input,{dealer,identity,originalFacts,readBytes}){
 const spec=input.publishedInputs,prefix='docs/releases/cloudflare-existing25-20261011/new-source/'+dealer;
 keys(spec,['schemaVersion','kind','sourceCommit','facts','stock','branding','media']);
 assert(spec.schemaVersion===1&&spec.kind==='cars-registered-reviewed-public-inputs'&&/^[a-f0-9]{40}$/.test(spec.sourceCommit??''),'real immutable input publication commit required');
 keys(input.stock,['kind','mode','previewOnly','actualDealerAvailability','disclosure','listings']);
 assert(input.stock?.mode==='reviewed-public-listing-snapshot'&&input.stock.previewOnly===true&&input.stock.actualDealerAvailability===false&&!input.publishedBranding,'distinct reviewed public snapshot provenance required');
 assert(input.sourceEvidence?.some(p=>p.path==='business-facts.json')&&originalFacts,'retained historical identity proof required');
 const materializedFiles=new Map(),sourcePins=new Map();let total=0;
 const read=(pin,relative,max=2*1024**2)=>{
  keys(pin,['path','sha256']);assert(safe(pin.path)&&pin.path.startsWith(prefix+'/')&&hex(pin.sha256)&&safe(relative),'bounded exact dealer input pin required');
  const local=REGISTERED_PUBLIC_ROOT+'/'+relative,bytes=readBytes(pin,local,max);assert(Buffer.isBuffer(bytes)&&bytes.length>0&&bytes.length<=max&&sha(bytes)===pin.sha256,'reviewed committed/materialized bytes differ: '+pin.path);
  if(sourcePins.has(pin.path))assert(sourcePins.get(pin.path)===pin.sha256,'input pin conflicts');sourcePins.set(pin.path,pin.sha256);
  assert(!materializedFiles.has(local)||materializedFiles.get(local).equals(bytes),'materialized destination conflict');materializedFiles.set(local,Buffer.from(bytes));total+=bytes.length;assert(total<=64*1024**2,'reviewed input budget exceeded');return bytes;
 };
 assert(spec.facts.path===prefix+'/facts.json'&&spec.stock.path===prefix+'/stock.json'&&spec.branding.path===prefix+'/branding.json','exact facts/stock/branding boundaries required');
 const facts=json(read(spec.facts,'facts.json')),stock=json(read(spec.stock,'stock.json')),branding=json(read(spec.branding,'branding.json')),b=facts.business;
 assert(facts.schemaVersion===1&&facts.slug===dealer&&facts.dealerId===identity.dealerId&&b&&same(input.facts,facts),'published dealer facts/identity differ');
 assert(typeof b.name==='string'&&b.name.trim()&&url(b.sourceUrl)&&date(b.observedAt)&&b.countryCode===input.locale.dealerCountry&&b.currency===input.locale.inventoryCurrency&&b.locale?.startsWith(input.locale.defaultLocale+'-'),'dated factual business/locale required');
 assert(originalFacts.profile===b.sourceUrl&&originalFacts.phoneE164===b.phoneE164,'historical primary profile/phone identity differs');
 assert(b.logo==='/dealer-brand/logo-on-light.png'&&b.logoLight===b.logo&&b.logoDark==='/dealer-brand/logo-on-dark.png','exact reviewed raster aliases required');
 assert(typeof b.inventoryNotice==='string'&&b.inventoryNotice.trim()&&typeof b.previewNotice==='string'&&b.previewNotice.trim()&&input.stock.disclosure===b.inventoryNotice,'truthful dated inventory/preview disclosures required');
 assert(stock.schemaVersion===1&&stock.dealer===dealer&&stock.kind==='dated-listing-snapshot'&&stock.availabilityConfirmed===false&&stock.completeInventory===false&&Array.isArray(stock.records)&&stock.records.length>0&&stock.records.length<=200,'bounded unconfirmed public stock snapshot required');
 assert(input.stock.kind===stock.kind,'stock kind differs');
 const projected=stock.records.map(r=>({...r,sourceRecord:{path:REGISTERED_PUBLIC_ROOT+'/stock.json',sha256:spec.stock.sha256,id:r.id}}));
 assert(same(input.stock.listings,projected),'original stock IDs/facts/photos/source URLs differ');
 assert(branding.schemaVersion===1&&branding.dealer===dealer&&branding.reviewed===true&&date(branding.reviewedAt)&&branding.generation?.tool==='image_gen'&&typeof branding.generation.generationId==='string'&&branding.generation.generationId.trim()&&hex(branding.generation.sourceFileSha256??branding.generation.sourceSha256),'reviewed ImageGen raster provenance required');
 assert(!['dealerApproval','nativeApproval','hostedApproval','globalReleaseApproval'].some(k=>branding[k]===true),'input branding cannot imply approval');
 keys(branding.surfaces,['onLight','onDark','onAccent']);const assetBytes=new Map(),expectedMedia=[];
 const brandingRaster=(pin,name)=>{assert(pin.path===prefix+'/branding/'+name+'.png','exact dealer PNG surface required');const selected={path:pin.path,sha256:pin.sha256},bytes=read(selected,'branding/'+name+'.png',8*1024**2);validateNewSourceRaster(bytes,name+'.png');return bytes;};
 brandingRaster(branding.master,'generated-master');
 for(const [surface,tone]of [['onLight','on-light'],['onDark','on-dark'],['onAccent','on-accent']]){const pin=branding.surfaces[surface],bytes=brandingRaster(pin,tone);if(surface!=='onAccent'){const publicPath='/dealer-brand/logo-'+tone+'.png';assetBytes.set(publicPath,bytes);expectedMedia.push({publicPath,sourceKind:'reviewed-published-input',inputPath:pin.path,sourcePath:REGISTERED_PUBLIC_ROOT+'/branding/'+tone+'.png',sha256:pin.sha256});}}
 assert(Array.isArray(spec.media)&&spec.media.length>0&&spec.media.length<=400,'bounded exact stock media required');const destinations=new Set(),inputPaths=new Set();
 for(const m of spec.media){keys(m,['path','sha256','bytes','destination']);assert(/^dealer-stock\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:png|webp|jpe?g)$/.test(m.destination??'')&&m.path===prefix+'/media/'+m.destination.split('/')[1]&&Number.isSafeInteger(m.bytes)&&m.bytes>0&&m.bytes<=8*1024**2&&!destinations.has(m.destination)&&!inputPaths.has(m.path),'exact distinct stock raster path/size required');destinations.add(m.destination);inputPaths.add(m.path);const relative='media/'+m.destination.split('/')[1],bytes=read({path:m.path,sha256:m.sha256},relative,8*1024**2);assert(bytes.length===m.bytes,'stock media byte count differs');validateNewSourceRaster(bytes,m.destination);assetBytes.set('/'+m.destination,bytes);expectedMedia.push({publicPath:'/'+m.destination,sourceKind:'reviewed-published-input',inputPath:m.path,sourcePath:REGISTERED_PUBLIC_ROOT+'/'+relative,sha256:m.sha256});}
 assert(same(input.media,expectedMedia),'exact reviewed media consumers differ');const used=new Set(),ids=new Set();
 for(const r of stock.records){assert(typeof r.id==='string'&&r.id.trim()&&!ids.has(r.id)&&typeof r.title==='string'&&r.title.trim()&&typeof r.make==='string'&&r.make.trim()&&typeof r.model==='string'&&r.model.trim()&&Number.isInteger(r.year)&&r.year>=1900&&r.year<=2100&&r.currency===b.currency,'stable original listing identity/year/currency required');ids.add(r.id);
  assert(!['production','date','priceEur','priceUsd','priceCurrency','amount','rawPriceText','sourcePrice','distanceUnit','thumbnail','photo','href','source','capturedAt','km'].some(k=>Object.hasOwn(r,k)),'ambiguous alternate source fact fields rejected');
  assert(url(r.sourceUrl)&&new URL(r.sourceUrl).hostname===new URL(b.sourceUrl).hostname&&date(r.observedAt)&&typeof r.availability==='string'&&r.availability.trim(),'same-profile dated source URL/availability required');
  assert(Array.isArray(r.images)&&r.images.length>0&&r.images.length<=20&&r.images.every(p=>destinations.has(p.slice(1))&&p==='/'+p.slice(1))&&!['image','gallery','photos'].some(k=>Object.hasOwn(r,k)),'exact original photo consumers required');for(const p of r.images)used.add(p.slice(1));
  assert((r.priceOnRequest===true&&(r.price===undefined||r.price===null)&&(r.priceAmount===undefined||r.priceAmount===null))||(r.priceOnRequest!==true&&Number.isFinite(r.priceAmount)&&r.priceAmount>0&&r.price===undefined),'explicit source price or unknown price required');
  assert((r.mileageOnRequest===true&&['mileage','mileageValue','mileageKm','mileageMiles','km'].every(k=>r[k]===undefined))||(r.mileageOnRequest!==true&&Number.isFinite(r.mileageValue)&&r.mileageValue>=0&&['km','mi'].includes(r.mileageUnit)&&!['mileage','mileageKm','mileageMiles','km'].some(k=>Object.hasOwn(r,k))),'explicit source mileage or unknown mileage required');
 }
 assert(used.size===destinations.size,'every exact photo must have an original stock consumer');
 materializedFiles.set(REGISTERED_PUBLIC_ROOT+'/input-manifest.json',Buffer.from(JSON.stringify(spec,null,2)+'\n'));
 return {media:new Map(expectedMedia.map(m=>[m.publicPath,m])),assetBytes,materializedFiles};
}
