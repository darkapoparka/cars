import modelData from './native-data/car-models.json';
import makeData from './native-data/makes.json';
import type { Filters, VehicleCategory } from './types';
export type NativeModelGroup = { name: string; children: string[] };
export const carModelGroups: Record<string, NativeModelGroup[]> = modelData;
const bmwCatalog = carModelGroups.BMW;
const bmwElectricModels = bmwCatalog.filter(
  (group) => !group.children.length && /^i(?:\d|X)/.test(group.name),
);
// Keep recognizable families first while preserving every captured leaf model and its key.
const bmwModelGroups: NativeModelGroup[] = [
  ...bmwCatalog.filter((group) => group.children.length && group.name !== 'Z Series'),
  { name: 'i Models', children: bmwElectricModels.map((group) => group.name) },
  ...bmwCatalog.filter((group) => group.name === 'Z Series'),
  ...bmwCatalog.filter((group) => !group.children.length && !bmwElectricModels.includes(group)),
];
export const nativeCarMakes = makeData.car
  .map((make) => make.name)
  .filter((name) => name !== 'Other');
export const truckResourceKeys: Record<string, keyof typeof makeData> = {
  'Over 7.5 t': 'truck_over_7500',
  'Up to 7.5 t': 'van_up_to_7500',
  Trailer: 'trailer',
  'Semi-trailer': 'semi_trailer',
  'Semi-Trailer Truck': 'semi_trailer_truck',
  Buses: 'bus',
  Agriculture: 'agricultural',
  Construction: 'construction_machine',
  Forklift: 'forklift_truck',
};
export function nativeCategoryKey(
  filters: Pick<Filters, 'category' | 'details'>,
): keyof typeof makeData {
  if (filters.category === 'truck')
    return (
      truckResourceKeys[
        filters.details.find((value) => value.startsWith('truckCategory='))?.slice(14) ||
          'Over 7.5 t'
      ] || 'truck_over_7500'
    );
  const keys: Record<Exclude<VehicleCategory, 'truck'>, keyof typeof makeData> = {
    car: 'car',
    bike: 'motorbike',
    'electric-bike': 'ebike',
    motorhome: 'motorhome',
  };
  return keys[filters.category];
}
export function nativeMakesFor(filters: Pick<Filters, 'category' | 'details'>): string[] {
  return makeData[nativeCategoryKey(filters)].map((make) => make.name);
}
export function modelGroupsFor(make: string): NativeModelGroup[] {
  return make === 'BMW' ? bmwModelGroups : carModelGroups[make] || [];
}

/** Some native families contain a leaf with exactly the same name (for example Continental). */
export function modelLeafKey(name: string, parent?: NativeModelGroup): string {
  return parent?.name === name ? '@model:' + name : name;
}
export function modelLabel(key: string): string {
  return key.startsWith('@model:') ? key.slice(7) : key;
}

/** A root model can share its label with a family (MINI Aceman). */
export function modelNodeKey(node: NativeModelGroup, groups: NativeModelGroup[]): string {
  return !node.children.length &&
    groups.some((group) => group.name === node.name && group.children.length)
    ? '@model:' + node.name
    : node.name;
}
