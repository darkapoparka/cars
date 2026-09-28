import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root='reference/2026-09-26-final-pass',out='public/reference-assets/final-pass';
await mkdir(out,{recursive:true});
const state=JSON.parse(await readFile('reference/2026-09-26-continuation/fortuner-detail-state.json','utf8'));
const title=value=>String(value).toLowerCase().replace(/(^|\s)\S/g,c=>c.toUpperCase());
const related=state.carDetails.similarCars.map(car=>({referenceId:car.appointmentId,tier:'Luxe',optionsType:car.optionsType,originalMileage:car.odometerReading,cylinders:Number(car.noOfCylinders),zeroDownPayment:true,slug:`${car.year}-${car.make}-${car.model}-${car.variant}-${car.appointmentId}`.toLowerCase().replace(/\s+/g,'-'),year:Number(car.year),make:title(car.make),model:title(car.model),trim:`${car.variant} • GCC Specs`,price:car.price,previousPrice:car.targetPrice,monthly:car.emiDetails.emi,mileage:car.odometerReading,fuel:car.fuelType||'Petrol',transmission:car.transmissionType,body:'SUV',location:'Millennium Place Hotel Barsha, Dubai',image:`/reference-assets/final-pass/similar-${car.appointmentId}.jpg`,color:car.color||'Not recorded',badges:['1.99% interest rate*'],highlights:['Great condition','Cruise control'],power:'Not recorded',engine:`${car.engineSize}L`,warranty:'Confirm with seller',condition:'Great condition'}));
const file='lib/captured-related.ts';
try{await access(file);throw Error('Related fixture file already exists; inspect before overwriting');}catch(error){if(error.code!=='ENOENT')throw error;}
await writeFile(file,"import type {Vehicle} from './data';\n// Captured from the same Fortuner detail response used by the native comparison.\nexport const capturedRelatedVehicles: Vehicle[] = "+JSON.stringify(related,null,2)+';\n');
const names=['Shuaib','Sushant','Suraj','Sameer','Bilal'];const manifest=[];
for(let i=0;i<names.length;i++){
 const name=names[i];
 for(const [local,remote] of [[`customer-${i}.jpg`,`thumb_${name.toLowerCase()}.jpg`],...(i>1?[[`customer-${i}.mp4`,`${name}.mp4`]]:[])]){
  const url=`https://media-ae.cars24.com/ae/testimonial/${remote}`;
  const r=await fetch(url,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error(`Media ${remote} HTTP ${r.status}`);
  const bytes=Buffer.from(await r.arrayBuffer());if(bytes.length>60000000)throw Error('Media size exceeds limit');
  await writeFile(out+'/'+local,bytes);manifest.push({file:out+'/'+local,source:url,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length});console.log('SAVED',local,bytes.length);
 }
}
await writeFile(root+'/additional-media-manifest.json',JSON.stringify(manifest,null,2));
const original=await readFile('reference/2026-09-26-continuation/final-customers.png');
console.log('Native customer capture',await sharp(original).metadata().then(m=>({width:m.width,height:m.height})));
console.log('Related vehicles and five customer videos prepared.');
