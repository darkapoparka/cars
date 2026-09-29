import {readFile,mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/2026-09-26-continuation';
const {cards}=JSON.parse(await readFile(`${root}/data-mobile.json`,'utf8'));
const target='public/reference-assets/catalog';
await mkdir(target,{recursive:true});
const title=value=>String(value??'').toLowerCase().replace(/(^|[ -])\w/g,m=>m.toUpperCase());
const slug=value=>String(value??'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const names={BMW:'BMW',MG:'MG',JAC:'JAC','MERCEDES BENZ':'Mercedes-Benz','MERCEDES-BENZ':'Mercedes-Benz'};
const known={'9714841126':'2024-toyota-fortuner-exr','9718425910':'2024-toyota-land-cruiser-exr','9718403147':'2025-toyota-veloz-gx'};
const sources=[],records=[];
for(let i=0;i<cards.length;i+=4){
 await Promise.all(cards.slice(i,i+4).map(async card=>{
  const c=card.carItem;if(!c?.appointmentId||!card.listingImage?.url)return;
  const id=c.appointmentId,url=card.listingImage.url;
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(`Image ${id}: HTTP ${response.status}`);
  const image=await sharp(Buffer.from(await response.arrayBuffer())).resize({width:1000,withoutEnlargement:true}).jpeg({quality:92}).toBuffer();
  await writeFile(`${target}/${id}.jpg`,image);sources.push({path:`${target}/${id}.jpg`,url,referenceId:id});
  const record={slug:known[id]??`${c.year}-${slug(c.make)}-${slug(c.model)}-${slug(c.variant)}-${id.slice(-4)}`,referenceId:id,year:Number(c.year),make:names[c.make]??title(c.make),model:c.model,trim:`${c.variant} • ${c.specs} Specs`,price:c.price,...(c.targetPrice>c.price?{previousPrice:c.targetPrice}:{}),monthly:c.emiDetails?.emi??0,mileage:Math.floor(c.odometerReading/1000)*1000,originalMileage:c.odometerReading,fuel:c.fuelType,transmission:c.transmissionType,body:({SUV:'SUV',SEDAN:'Sedan',HATCHBACK:'Hatchback',COUPE:'Coupe',MPV:'MPV',CONVERTIBLE:'Convertible','DOUBLE CAB':'Pickup'})[c.bodyType]??title(c.bodyType),location:card.location?.hubName??c.parentHubLocation?.locationName??'UAE',image:`/reference-assets/catalog/${id}.jpg`,color:c.carExteriorColor??'Not captured',badges:[c.carCardTag??card.carTag?.displayText??''],highlights:[c.salesLever?.label??'GCC Specs'],power:c.power??'Not captured',engine:c.engineSize?`${c.engineSize}L`:'Not captured',warranty:'See vehicle report',condition:c.salesLever?.label??'See vehicle report',tier:c.assortmentSubCategory==='LUXE'?'Luxe':c.assortmentCategory==='LITE'?'Lite':'Prime',optionsType:c.optionsType??'Basic'};
  records.push(record);
 }));
}
const ordered=cards.map(c=>records.find(r=>r.referenceId===c.carItem?.appointmentId)).filter(Boolean);
await writeFile('lib/captured-inventory.ts',`import type {Vehicle} from './data';\n\n// Captured public reference data; not a live inventory feed. Sources are recorded in reference/.\nexport const capturedVehicles: Vehicle[] = ${JSON.stringify(ordered,null,2)};\n`);
await writeFile(`${root}/catalog-sources.json`,JSON.stringify({capturedAt:new Date().toISOString(),source:'reference/2026-09-26-parity/public-mobile.html',assets:sources},null,2));
for(const kind of ['sell','finance','service']){
 const data=JSON.parse(await readFile(`${root}/data-${kind}.json`,'utf8'));
 console.log(kind,JSON.stringify(data.images.filter(image=>!/(selected|Flag|logo|Logo|msite\.png|Car\.png|care\.png|loan\.png|icons|org-logo)/.test(image.url))));
}
console.log('CATALOG',JSON.stringify(ordered.map(c=>({id:c.referenceId,slug:c.slug,price:c.price,body:c.body,fuel:c.fuel,tier:c.tier}))));
