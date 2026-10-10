import fs from 'node:fs/promises';
import { UK_APP_PATHS, personalizeAppUk } from './client-refresh-uk-next.mjs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {appSourceDigest, assertAppVariant} from '../publishing/app-variant.mjs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const text = value => typeof value === 'string' ? value.trim() : '';
const url = (value, protocols = ['https:']) => {try {const u = new URL(value);return protocols.includes(u.protocol) && !u.username && !u.password ? u.href : '';} catch {return '';}};
const label = (value, options, fallback) => options.find(option => option.toLowerCase() === text(value).toLowerCase()) || fallback;
const number = (...values) => values.find(value => typeof value === 'number' && Number.isFinite(value));
const mileageNumber = value => {
 if(typeof value === 'string' && /^(?:\d+(?:\.\d+)?|\d{1,3}(?:,\d{3})+(?:\.\d+)?)$/.test(value.trim())) value=Number(value.trim().replaceAll(',',''));
 return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined;
};
const mileageUnit = value => {
 const unit=text(value).toLowerCase();
 if(/^(?:mi|mile|miles)$/.test(unit))return 'mi';
 if(/^(?:km|kilometres?|kilometers?)$/.test(unit))return 'km';
 throw new Error('Unsupported App source mileage unit: '+unit);
};
/** Keep the selected value paired with its source unit; App inventory remains canonical km. */
function dealerMileage(listing,business) {
 const unknown={sourceValue:null,sourceUnit:null,canonicalKm:null};
 if(listing.mileageOnRequest === true)return unknown;
 const raw=listing.raw && typeof listing.raw === 'object' ? listing.raw : null;
 const candidates=source=>[
  [source.mileageKm,'km'],[source.km,'km'],[source.mileageMiles,'mi'],
  [source.mileageValue,source.mileageUnit||source.distanceUnit||business.distanceUnit||'km',source===listing],
  [source.mileage?.value,source.mileage?.unit||source.mileageUnit||source.distanceUnit||business.distanceUnit||'km'],
  [source.mileage,source.mileageUnit||source.distanceUnit||business.distanceUnit||'km']
 ];
 const rawHasMileage=raw && candidates(raw).some(([value])=>mileageNumber(value)!==undefined);
 for(const [value,unit,normalizedValue] of [...candidates(listing),...(raw?candidates(raw):[])]) {
  const parsed=mileageNumber(value);
  if(parsed===undefined)continue;
  // Older normalized profiles used zero when no source mileage was published.
  if(raw && !rawHasMileage && normalizedValue && parsed===0 && listing.mileageOnRequest !== false)continue;
  const sourceUnit=mileageUnit(unit);
  const canonicalKm=sourceUnit==='mi'?Math.round(parsed*1.609344):parsed;
  if(!Number.isFinite(canonicalKm)||canonicalKm>Number.MAX_SAFE_INTEGER)throw new Error('App source mileage exceeds the supported numeric range');
  return {sourceValue:parsed,sourceUnit,canonicalKm};
 }
 return unknown;
}
/** Existing dealer source is authoritative. readFile permits exact, hash-verified deployment inputs. */
export async function prepareAppDealer(sourceRoot, manifest, {readFile, appFiles} = {}) {
 const read = readFile || (name => fs.readFile(path.join(sourceRoot, name)));
 const profileBytes = await read('auto-best/src/lib/data/dealer-profile.json');
 const profile = JSON.parse(profileBytes.toString('utf8'));
 if(profile.slug !== manifest.slug || !profile.business?.name || !Array.isArray(profile.listings)) throw new Error('Dealer profile identity mismatch');
 const business = profile.business, files = new Map(), assets = [];
 async function retain(value, role) {
  if(typeof value !== 'string' || !/^\/(?!\/)/.test(value) || value.includes('\\') || value.includes('\0') || value.split('/').includes('..')) throw new Error('App requires a safe retained local asset: '+value);
  const name=value.slice(1), candidates=['auto-best/static/'+name];
  if(name.startsWith('variant-3/')) candidates.push('carwow/static/'+name.slice(10));
  if(name.startsWith('variant-2/')) candidates.push((manifest.variants[1].key==='import'?'import/static/':'modern/apps/web/public/')+name.slice(10));
  let bytes,original;
  for(const candidate of candidates){try{bytes=await read(candidate);original=candidate;break;}catch(error){if(error.code!=='ENOENT')throw error;}}
  if(!bytes)throw new Error('Missing retained asset: '+value);
  const extension=path.extname(original).toLowerCase();
  if(extension === '.svg' && role === 'vehicle' && /<script|<foreignObject|<!ENTITY|\son[a-z]+\s*=|(?:href|src)=["'](?!#)/i.test(bytes.toString('utf8'))) throw new Error('Unsafe vehicle placeholder SVG');
  if(!['.png','.webp','.jpg','.jpeg','.avif', ...(role === 'vehicle' ? ['.svg'] : [])].includes(extension)) throw new Error('App '+role+' requires a raster image: '+value);
  const digest=hash(bytes), output='public/dealer-app/'+role+'-'+digest.slice(0,20)+extension;
  files.set(output,bytes);assets.push({source:original,output,sha256:digest,role});return '/'+output.slice(7);
 }
 const light=await retain(business.logoLight || business.logo,'logo-light');
 const dark=await retain(business.logoDark || business.logoLight || business.logo,'logo-dark');
 const currencies=[...new Set(profile.listings.map(l=>text(l.currency)).filter(c=>/^[A-Z]{3}$/.test(c)))];
 const currency=currencies.length===1?currencies[0]:text(business.currency)||manifest.localization?.inventoryCurrency;
 if(!/^[A-Z]{3}$/.test(currency||''))throw new Error('Missing recorded inventory currency');
 const names=new Set(),inventory=[],mileageFacts=[];
 for(const listing of profile.listings){
  const slug=text(listing.slug);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||names.has(slug))throw new Error('Invalid or repeated vehicle slug: '+slug);names.add(slug);
  if(listing.currency && listing.currency!==currency)throw new Error('Mixed listing currencies require explicit per-listing treatment: '+slug);
  if(!Array.isArray(listing.images)||!listing.images.length)throw new Error('Vehicle has no retained photos: '+slug);
  const rasterSources=listing.images.filter(image=>typeof image==='string'&&!/\.svg(?:[?#]|$)/i.test(image)&&!/(?:placeholder|no[-_]?photo)/i.test(image));
  const images=await Promise.all(rasterSources.map(image=>retain(image,'vehicle')));
  const generatedIllustration=(listing.mediaKind || listing.raw?.mediaKind) === 'generated_category_illustration';
  const imagePlaceholder=images.length===0 || generatedIllustration;
  if(!images.length)images.push('/cutouts/buy-sedan-v1.png');
  const price=number(listing.priceAmount),mileage=dealerMileage(listing,business);
  mileageFacts.push({slug,...mileage});
  const fuelKey=text(listing.fuelType).toLowerCase(),transmissionKey=text(listing.transmissionType||listing.transmission).toLowerCase();
  const make=text(listing.brand||listing.make), originalModel=text(listing.model)||text(listing.title);
  const model=make && originalModel.toLowerCase().startsWith(make.toLowerCase()+' ')?originalModel.slice(make.length+1):originalModel;
  inventory.push({slug,make,model,trim:text(listing.trim),year:number(listing.year)||0,
   price:price>0?price:0,priceOnRequest:!(price>0),monthly:0,image:images[0],images,
   mileage:mileage.canonicalKm??0,mileageOnRequest:mileage.canonicalKm===null,
   fuel:({gasoline:'Petrol',petrol:'Petrol',diesel:'Diesel',hybrid:'Hybrid',electric:'Electric'})[fuelKey]||'Not published',
   transmission:({automatic:'Automatic',manual:'Manual'})[transmissionKey]||'Not published',
   body:label(listing.bodyType,['SUV','Sedan','Hatchback','Coupe','MPV','Convertible','Pickup'],'Other'),
   specifications:text(listing.regionalSpecs),sourceUrl:url(listing.sourceUrl),observedAt:text(listing.observedAt),
   optionsType:'',engineType:text(listing.engineSize||listing.engine),location:text(business.city),badges:[],imagePlaceholder,
   proposalBenefits:['Warranty option','Finance option'],
   power:number(listing.powerHp)?listing.powerHp+' hp':'Not published',engine:text(listing.engineSize||listing.engine)||'Not published',
   warranty:'Confirm with seller',condition:'Confirm with seller',highlights:(listing.features||[]).filter(v=>typeof v==='string'),
   color:text(listing.exteriorColor||listing.color),featureLabels:(listing.features||[]).filter(v=>typeof v==='string')});
 }
 const observedAt=[...new Set(profile.listings.map(l=>text(l.observedAt)).filter(Boolean))].sort().join(', ');
 const config={mode:'dealer',id:manifest.slug,name:text(business.name),shortName:text(business.name).slice(0,40),
  logo:{light,dark,icon:'/dealer-app/icon.png'},defaultLocale:manifest.localization?.defaultLocale==='bg'?'bg':'en',enabledLocales:['en','bg'],
  country:manifest.localization?.dealerCountry||text(business.country),currency,city:text(business.city),address:text(business.address),
  phoneDisplay:text(business.phoneDisplay),phoneE164:/^\+[1-9]\d{6,14}$/.test(text(business.phoneE164))?text(business.phoneE164):'',
  email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(business.email))?text(business.email):'',
  mapsUrl:url(business.mapsUrl),website:url(business.website),whatsappUrl:url(business.whatsappUrl||business.socialLinks?.whatsapp),
  services:(business.services||[]).map(s=>typeof s==='string'?s:text(s.title)).filter(Boolean),observedAt,
  inventoryNotice:text(business.inventoryNotice) || 'Dated listing samples. Confirm price, availability and vehicle information with the dealer.',
  previewNotice:'Independent design preview. No purchase, reservation or message is submitted by this website.'};
 files.set('lib/dealer.json',Buffer.from(JSON.stringify(config,null,2)+'\n'));
 files.set('lib/dealer-inventory.json',Buffer.from(JSON.stringify(inventory,null,2)+'\n'));
 const provenance={schemaVersion:1,dealer:manifest.slug,profile:'auto-best/src/lib/data/dealer-profile.json',profileSha256:hash(profileBytes),
  logoPolicy:'Preserve existing raster identities; no replacement logo was generated.',vehicles:inventory.length,currency,observedAt,assets,mileageFacts};
 if (business.countryCode === 'GB' && business.distanceUnit === 'mi') {
  const candidate = appFiles ? new Map(appFiles) : new Map(await Promise.all(UK_APP_PATHS.map(async name => [name, await read('app/' + name)])));
  const contentPaths = personalizeAppUk(candidate, profile, mileageFacts);
  for (const name of contentPaths) files.set(name, Buffer.from(candidate.get(name)));
  provenance.ukPresentation = {distanceUnit:'mi', canonicalDistanceUnit:'km', originalMileageRetained:true, contentPaths};
 }
 return {config,inventory,files,provenance};
}

/** Seal final canonical inputs, including retained metadata; this records no QA or hosted pass. */
export function sealAppDealerSource({files, manifest, provenance}) {
 if (!['3','5'].includes(manifest.packaging?.version)) throw new Error('App source seal requires an App-enabled dealer manifest');
 const template=manifest.templateSources?.app;
 if (!template || template.repository !== 'darkapoparka/cars' || template.path !== 'templates/app' ||
     !/^[a-f0-9]{40}$/.test(template.revision || '') || template.revision !== manifest.templateRevisions?.app ||
     !/^[a-f0-9]{40}$/.test(template.tree || '') || !/^[a-f0-9]{64}$/.test(template.digest || '')) throw new Error('App: exact reviewed Cars source is required');
 const profilePath='auto-best/src/lib/data/dealer-profile.json', profileBytes=files.get(profilePath);
 if (!profileBytes || provenance?.dealer !== manifest.slug || provenance.profile !== profilePath ||
     provenance.profileSha256 !== hash(profileBytes)) throw new Error('App dealer facts changed after personalization; regenerate the adapted inputs before sealing');
 const appFiles=new Map([...files].filter(([name])=>name.startsWith('app/')).map(([name,bytes])=>[name.slice(4),bytes]));
 const receipt={schemaVersion:1,dealer:manifest.slug,template,appDigest:appSourceDigest(appFiles),provenance,
  needsDealerQA:true,readyToPublish:false};
 const pending=new Map(files);
 pending.set('.cars-app.json',Buffer.from(JSON.stringify(receipt,null,2)+'\n'));
 assertAppVariant(pending,manifest);
 files.set('.cars-app.json',pending.get('.cars-app.json'));
 return receipt;
}
