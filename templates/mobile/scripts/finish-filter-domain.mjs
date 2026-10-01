import fs from 'node:fs';
function patch(file,oldText,newText){let text=fs.readFileSync(file,'utf8');if(!text.includes(oldText))throw Error('Missing '+file+' '+oldText);fs.writeFileSync(file,text.replace(oldText,newText));}
patch('src/lib/types.ts','  seats: string;','  seats: string;\n  maxSeats: string;');
patch('src/lib/types.ts',"  seats: '',","  seats: '',\n  maxSeats: '',");
const f='src/lib/filters.ts';let filters=fs.readFileSync(f,'utf8').replace("  'doors',","  'maxSeats',");filters=filters.replace('  return result;',"  if (!/^(?:[2-9]|2\\/3|4\\/5|6\\/7)?$/.test(result.doors)) result.doors = '';\n  return result;");fs.writeFileSync(f,filters);
const p='src/lib/search.ts';let text=fs.readFileSync(p,'utf8');
const a=text.indexOf('function matchesDetails');const b=text.indexOf('export function filterVehicles',a);if(a<0||b<0)throw Error('Details filter missing');
const helpers=`function canonical(value:string):string {
 const key=value.toLowerCase().trim();
 const aliases:Record<string,string>={'manual gearbox':'manual','estate car':'estate','off-road vehicle/pickup truck/suv':'suv','convertible/roadster':'convertible','sports car/coupe':'coupe','van/minibus':'van','camera':'rear view camera','automatic climatisation, 4 zones':'automatic air conditioning, 4 zones','automatic climatisation, 3 zones':'automatic air conditioning, 3 zones','automatic climatisation, 2 zones':'automatic air conditioning, 2 zones'};
 return aliases[key]||key;
}
function hasFeature(vehicle:Vehicle,feature:string):boolean {return vehicle.features.some(value=>canonical(value)===canonical(feature));}
function matchesDetails(v:Vehicle, selections:string[]):boolean {
 const groups=new Map<string,string[]>();
 for(const token of selections){const cut=token.indexOf('=');if(cut<0)continue;const key=token.slice(0,cut);groups.set(key,[...(groups.get(key)||[]),token.slice(cut+1)]);}
 const featureGroups=new Set(['interior','security','other','controls','extras','headlightExtras','wheels','parking','seatFeatures','maintenance']);
 return [...groups].every(([key,values])=>{
  const base=key.replace(/(?:From|To)$/,'');const attr=v.attributes?.[base];
  if(key==='description')return values.every(x=>(v.make+' '+v.model+' '+v.variant+' '+v.features.join(' ')).toLowerCase().includes(x.toLowerCase()));
  if(key.endsWith('From'))return attr!==undefined && Number(attr)>=Number(values[0]);
  if(key.endsWith('To'))return attr!==undefined && Number(attr)<=Number(values[0]);
  const match=(value:string)=>(attr||'').split('|').some(x=>canonical(x)===canonical(value))||hasFeature(v,value);
  return featureGroups.has(key)?values.every(match):values.some(match);
 });
}
`;
text=text.slice(0,a)+helpers+text.slice(b);
text=text.replace('(!f.minPrice || v.price >= Number(f.minPrice))','(f.payment === \'lease\' || !f.minPrice || v.price >= Number(f.minPrice))').replace('(!f.maxPrice || v.price <= Number(f.maxPrice))','(f.payment === \'lease\' || !f.maxPrice || v.price <= Number(f.maxPrice))');
text=text.replace('(!f.minLease || Boolean(v.monthly && v.monthly >= Number(f.minLease)))',"(f.payment !== 'lease' || !f.minLease || Boolean(v.monthly && v.monthly >= Number(f.minLease)))").replace('(!f.maxLease || Boolean(v.monthly && v.monthly <= Number(f.maxLease)))',"(f.payment !== 'lease' || !f.maxLease || Boolean(v.monthly && v.monthly <= Number(f.maxLease)))");
for(const key of ['fuel','transmission','body','color']) text=text.replace(`f.${key}.includes(v.${key})`,`f.${key}.some(value=>canonical(value)===canonical(v.${key}))`);
text=text.replace('(!f.doors || v.doors === Number(f.doors))',"(!f.doors || f.doors.split('/').includes(String(v.doors)))");
text=text.replace('(!f.seats || v.seats >= Number(f.seats)) &&','(!f.seats || v.seats >= Number(f.seats)) &&\n      (!f.maxSeats || v.seats <= Number(f.maxSeats)) &&');
text=text.replace('f.features.every((feature) => v.features.includes(feature))','f.features.every((feature) => hasFeature(v,feature))');fs.writeFileSync(p,text);
console.log('Corrected range suffixes, seat/door groups, feature casing and independent purchase/leasing constraints.');
