import fs from 'node:fs';
const patch=(file,oldText,next)=>{let s=fs.readFileSync(file,'utf8');if(!s.includes(oldText))throw Error('Patch not found '+file+' '+oldText);s=s.replace(oldText,next);fs.writeFileSync(file,s);};
patch('src/lib/types.ts','  previousPrice?: number;','  previousPrice?: number;\n  attributes?: Record<string,string>;\n  damaged?: boolean;\n  country?: string;');
patch('src/lib/types.ts','  maxMileage: string;','  minMileage: string;\n  maxMileage: string;\n  maxPower: string;\n  minLease: string;\n  maxLease: string;\n  country: string;\n  condition: string[];\n  details: string[];');
patch('src/lib/types.ts',"  maxMileage: '',","  minMileage: '',\n  maxMileage: '',\n  maxPower: '',\n  minLease: '',\n  maxLease: '',\n  country: '',\n  condition: [],\n  details: [],");
patch('src/lib/filters.ts',"  'minPower',","  'minPower',\n  'maxPower',\n  'minMileage',\n  'minLease',\n  'maxLease',");
patch('src/lib/search.ts','      (!f.maxMileage || v.mileage <= Number(f.maxMileage)) &&',`      (!f.minMileage || v.mileage >= Number(f.minMileage)) &&
      (!f.maxMileage || v.mileage <= Number(f.maxMileage)) &&
      (!f.maxPower || v.power <= Number(f.maxPower)) &&
      (!f.minLease || Boolean(v.monthly && v.monthly >= Number(f.minLease))) &&
      (!f.maxLease || Boolean(v.monthly && v.monthly <= Number(f.maxLease))) &&
      (!f.country || (v.country || 'Germany') === f.country) &&
      (!f.condition.length || f.condition.includes(v.mileage ? 'Used' : 'New') || (v.mileage > 0 && f.condition.includes("Employee's Car"))) &&
      (!f.excludeDamaged || !v.damaged) &&
      matchesDetails(v, f.details) &&`);
patch('src/lib/search.ts','export function filterVehicles',`function matchesDetails(v:Vehicle, selections:string[]):boolean {
  const groups=new Map<string,string[]>();
  for(const token of selections){const cut=token.indexOf('=');if(cut<0)continue;const key=token.slice(0,cut);groups.set(key,[...(groups.get(key)||[]),token.slice(cut+1)]);}
  return [...groups].every(([key,values])=>{
    const attr=v.attributes?.[key];
    if(key==='description')return values.every(x=>(v.make+' '+v.model+' '+v.variant+' '+v.features.join(' ')).toLowerCase().includes(x.toLowerCase()));
    if(key.endsWith('From'))return attr!==undefined && Number(attr)>=Number(values[0]);
    if(key.endsWith('To'))return attr!==undefined && Number(attr)<=Number(values[0]);
    return values.some(value=>attr===value || v.features.includes(value));
  });
}
export function filterVehicles`);
console.log('Extended validated filter/domain contract.');
