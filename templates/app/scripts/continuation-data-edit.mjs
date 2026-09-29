import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const file='lib/data.ts';
let source=await readFile(file,'utf8');
if(createHash('sha256').update(source).digest('hex')!=='c685c8325460f2af20a6b781264b741452ba926c98fe317a4a119a2612421183')throw Error('data.ts changed; inspect before editing');
function replace(before,after){if(source.split(before).length!==2)throw Error(`Expected one match: ${before}`);source=source.replace(before,after);}
replace('export type Vehicle = {',"import {capturedVehicles} from './captured-inventory';\n\nexport type Vehicle = {\n  referenceId?: string;\n  tier?: 'Luxe' | 'Prime' | 'Lite';\n  optionsType?: string;\n  originalMileage?: number;");
replace("body: 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'MPV';","body: 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'MPV' | 'Convertible' | 'Pickup';");
replace('export const vehicles: Vehicle[] = [','const existingVehicles: Vehicle[] = [');
replace('export const formatPrice =',`const capturedBySlug = new Map(capturedVehicles.map(vehicle => [vehicle.slug, vehicle]));
const mergedVehicles: Vehicle[] = [
  ...existingVehicles.map(vehicle => ({...vehicle, ...capturedBySlug.get(vehicle.slug)})),
  ...capturedVehicles.filter(vehicle => !existingVehicles.some(existing => existing.slug === vehicle.slug)),
];
const nativeFirst = ['2024-toyota-fortuner-exr', '2023-suzuki-ciaz-glx', '2025-toyota-veloz-gx',
  '9718423696', '9718425910', '9718424077', '9714841440', '9714842271'];
const rank = (vehicle: Vehicle) => {
  const position = nativeFirst.findIndex(key => key === vehicle.slug || key === vehicle.referenceId);
  return position < 0 ? nativeFirst.length : position;
};
export const vehicles: Vehicle[] = mergedVehicles.sort((a, b) => rank(a) - rank(b));
export const homeFeed = [
  ...vehicles.filter(vehicle => rank(vehicle) < nativeFirst.length),
  ...capturedVehicles.filter(vehicle => rank(vehicle) === nativeFirst.length),
];
export const hotDeals = capturedVehicles.filter(vehicle =>
  ['9718349728', '9714839863', '9714841097'].includes(vehicle.referenceId ?? ''));

export const formatPrice =`);
await writeFile(file,source);
console.log('Preserved all existing fixtures and merged the captured reference catalog.');
