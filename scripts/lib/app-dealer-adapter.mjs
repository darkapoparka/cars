import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const text = value => typeof value === 'string' ? value.trim() : '';
const url = (value, protocols = ['https:']) => {try {const u = new URL(value);return protocols.includes(u.protocol) && !u.username && !u.password ? u.href : '';} catch {return '';}};
const label = (value, options, fallback) => options.find(option => option.toLowerCase() === text(value).toLowerCase()) || fallback;
const number = (...values) => values.find(value => typeof value === 'number' && Number.isFinite(value));
/** Existing dealer source is authoritative. readFile permits exact, hash-verified deployment inputs. */
export async function prepareAppDealer(sourceRoot, manifest, {readFile} = {}) {
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
 const names=new Set(),inventory=[];
 for(const listing of profile.listings){
  const slug=text(listing.slug);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||names.has(slug))throw new Error('Invalid or repeated vehicle slug: '+slug);names.add(slug);
  if(listing.currency && listing.currency!==currency)throw new Error('Mixed listing currencies require explicit per-listing treatment: '+slug);
  if(!Array.isArray(listing.images)||!listing.images.length)throw new Error('Vehicle has no retained photos: '+slug);
  const rasterSources=listing.images.filter(image=>typeof image==='string'&&!/\.svg(?:[?#]|$)/i.test(image)&&!/(?:placeholder|no[-_]?photo)/i.test(image));
  const images=await Promise.all(rasterSources.map(image=>retain(image,'vehicle')));
  const imagePlaceholder=images.length===0;
  if(imagePlaceholder)images.push('/cutouts/buy-sedan-v1.png');
  const price=number(listing.priceAmount),mileage=number(listing.mileageKm,listing.mileageUnit==='km'?listing.mileageValue:undefined,listing.raw?.mileageKm);
  const fuelKey=text(listing.fuelType).toLowerCase(),transmissionKey=text(listing.transmissionType||listing.transmission).toLowerCase();
  const make=text(listing.brand||listing.make), originalModel=text(listing.model)||text(listing.title);
  const model=make && originalModel.toLowerCase().startsWith(make.toLowerCase()+' ')?originalModel.slice(make.length+1):originalModel;
  inventory.push({slug,make,model,trim:text(listing.trim),year:number(listing.year)||0,
   price:price>0?price:0,priceOnRequest:!(price>0),monthly:0,image:images[0],images,
   mileage:mileage??0,mileageOnRequest:mileage===undefined,
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
  inventoryNotice:'Dated listing samples. Confirm price, availability and vehicle information with the dealer.',
  previewNotice:'Independent design preview. No purchase, reservation or message is submitted by this website.'};
 files.set('lib/dealer.json',Buffer.from(JSON.stringify(config,null,2)+'\n'));
 files.set('lib/dealer-inventory.json',Buffer.from(JSON.stringify(inventory,null,2)+'\n'));
 const provenance={schemaVersion:1,dealer:manifest.slug,profile:'auto-best/src/lib/data/dealer-profile.json',profileSha256:hash(profileBytes),
  logoPolicy:'Preserve existing raster identities; no replacement logo was generated.',vehicles:inventory.length,currency,observedAt,assets};
 return {config,inventory,files,provenance};
}
