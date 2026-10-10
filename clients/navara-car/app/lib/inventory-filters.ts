import {inventoryBounds} from './inventory-settings';
import {inventoryNameKey, inventoryModelKey} from './inventory-identity';
import {currency} from './currency';
import type {Vehicle} from './vehicle';
import {hasPublishedMileage, hasPublishedMonthlyPayment, hasPublishedPrice, vehicleDiscount} from './vehicle-values';
export {vehicleDiscount} from './vehicle-values';

export const filterTabs = ['BRAND', 'MODEL', 'BUDGET', 'DISCOUNTS', 'EMI', 'DOWN PAYMENT', 'YEAR', 'BODY TYPE', 'MILEAGE', 'CAR TYPE', 'FUEL TYPE', 'CATEGORIES', 'FEATURES', 'ENGINE'] as const;
export type FilterTab = (typeof filterTabs)[number] | 'TRANSMISSION';
// Home's desktop refinements add gearbox without changing phone/tablet categories.
export const desktopFilterTabs: readonly FilterTab[] = filterTabs.flatMap<FilterTab>(tab => tab === 'FUEL TYPE' ? [tab, 'TRANSMISSION'] : [tab]);
export const quickFilterTabs = ['BRAND', 'MODEL', 'BUDGET', 'DISCOUNTS', 'YEAR', 'MILEAGE', 'BODY TYPE', 'FUEL TYPE'] as const satisfies readonly FilterTab[];
export const bodyTypes = ['SUV', 'SEDAN', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'SUV COUPE', 'DOUBLE CAB UTILITY', 'MPV', 'CREW CAB UTILITY', 'SPORTBACK', 'VAN', 'LIFTBACK', 'PICK-UP', 'ROADSTER'] as const;
export const categoryOptions = ['Adventure car', 'As good as new', 'Budget friendly', 'Daily commuter/ Economical car', 'Family car', 'Latest SUVs', 'Luxury in budget', 'Hot deals', 'Premium sedans'];
export const featureOptions = ['Fuel Efficient', 'Reverse Camera', 'Sunroof', 'Panoramic Sunroof', 'Moonroof'];
export const budgetOptions = [
  {value: `Less than ${currency.code} 40K`, relation: 'Less than', amount: `${currency.code} 40K`},
  {value: `Less than ${currency.code} 60K`, relation: 'Less than', amount: `${currency.code} 60K`},
  {value: `Less than ${currency.code} 100K`, relation: 'Less than', amount: `${currency.code} 100K`},
  {value: `Above ${currency.code} 100K`, relation: 'Above', amount: `${currency.code} 100K`},
] as const;
export const emiOptions = [
  {value: `Less than ${currency.code} 750`, relation: 'Less than', amount: `${currency.code} 750`},
  {value: `Less than ${currency.code} 1,500`, relation: 'Less than', amount: `${currency.code} 1,500`},
  {value: `Less than ${currency.code} 2,000`, relation: 'Less than', amount: `${currency.code} 2,000`},
  {value: `Above ${currency.code} 2,000`, relation: 'Above', amount: `${currency.code} 2,000`},
] as const;
export const yearOptions = ['2021 & above', '2019 & above', '2017 & above', '2015 & above', '2013 & above', '2011 & above'];
export const mileageOptions = ['Under 30,000 kms', 'Under 60,000 kms', 'Under 90,000 kms', 'Under 120,000 kms', 'Under 150,000 kms'];

export type Filters = {
  brands: string[];
  models: string[];
  budget: string[];
  bodies: string[];
  fuel: string[];
  year: string;
  mileage: string;
  minimum: number;
  maximum: number;
  yearMinimum: number;
  yearMaximum: number;
  mileageMinimum: number;
  mileageMaximum: number;
  engineMinimum: number;
  engineMaximum: number;
  cylinderMinimum: number;
  cylinderMaximum: number;
  emiLimit: number | null;
  extra: Record<string, string[]>;
};
export const emptyFilters = (): Filters => ({brands: [], models: [], budget: [], bodies: [], fuel: [], year: '', mileage: '', ...inventoryBounds, emiLimit: null, extra: {}});
export const toggleFilter = (items: string[], value: string) => items.includes(value) ? items.filter(item => item !== value) : [...items, value];

export function matchesMonthlyPayment(vehicle: Vehicle, maximum: number | undefined) {
  return maximum === undefined || (hasPublishedMonthlyPayment(vehicle) && vehicle.monthly <= maximum);
}

export function hasActiveFilters(filters: Filters) {
  const defaults = emptyFilters();
  return Object.entries(filters).some(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (key === 'extra') return Object.values(filters.extra).some(items => items.length > 0);
    return value !== defaults[key as keyof Filters];
  });
}
export function restoreFilters(value: unknown): Filters {
  const defaults = emptyFilters();
  if (!value || typeof value !== 'object') return defaults;
  const source = value as Record<string, unknown>;
  const strings = (item: unknown) => Array.isArray(item) ? item.filter((v): v is string => typeof v === 'string' && v.length < 100).slice(0, 100) : [];
  for (const key of ['brands', 'models', 'budget', 'bodies', 'fuel'] as const) defaults[key] = strings(source[key]);
  for (const key of ['year', 'mileage'] as const) if (typeof source[key] === 'string') defaults[key] = source[key].slice(0, 50);
  for (const [minimum, maximum, low, high] of [
    ['minimum', 'maximum', inventoryBounds.minimum, inventoryBounds.maximum], ['yearMinimum', 'yearMaximum', inventoryBounds.yearMinimum, inventoryBounds.yearMaximum], ['mileageMinimum', 'mileageMaximum', inventoryBounds.mileageMinimum, inventoryBounds.mileageMaximum], ['engineMinimum', 'engineMaximum', inventoryBounds.engineMinimum, inventoryBounds.engineMaximum], ['cylinderMinimum', 'cylinderMaximum', inventoryBounds.cylinderMinimum, inventoryBounds.cylinderMaximum],
  ] as const) {
    if (typeof source[minimum] === 'number' && Number.isFinite(source[minimum])) defaults[minimum] = Math.max(low, Math.min(high, source[minimum]));
    if (typeof source[maximum] === 'number' && Number.isFinite(source[maximum])) defaults[maximum] = Math.max(defaults[minimum], Math.min(high, source[maximum]));
  }
  if (typeof source.emiLimit === 'number' && Number.isFinite(source.emiLimit)) defaults.emiLimit = Math.max(0, Math.min(100000, source.emiLimit));
  if (source.extra && typeof source.extra === 'object') for (const [key, values] of Object.entries(source.extra)) if (desktopFilterTabs.includes(key as FilterTab)) defaults.extra[key] = strings(values);
  return defaults;
}

function matchesBody(vehicle: Vehicle, body: string) {
  if (body === 'LUXURY') return vehicle.tier === 'Luxe';
  if (body === 'DOUBLE CAB UTILITY' || body === 'CREW CAB UTILITY' || body === 'PICK-UP') return vehicle.body === 'Pickup';
  if (body === 'SPORTBACK' || body === 'LIFTBACK') return vehicle.body === 'Hatchback';
  if (body === 'SUV COUPE') return vehicle.body === 'SUV' && /coupe|h6 gt|x4|x6|gle.*coupe/i.test(vehicle.model);
  if (body === 'ROADSTER') return vehicle.body === 'Convertible';
  return vehicle.body.toUpperCase() === body;
}
/** Discovery categories use transparent local-fixture rules until a catalog API supplies category IDs. */
function matchesCategory(vehicle: Vehicle, category: string) {
  const capacity = Number.parseFloat(vehicle.engine);
  if (category === 'Adventure car') return vehicle.body === 'SUV' && capacity >= 2.5;
  if (category === 'As good as new') return vehicle.year >= 2024 && hasPublishedMileage(vehicle) && vehicle.mileage <= 30000;
  if (category === 'Budget friendly') return hasPublishedPrice(vehicle) && vehicle.price <= 40000;
  if (category === 'Daily commuter/ Economical car') return ['Sedan', 'Hatchback'].includes(vehicle.body) && capacity <= 2;
  if (category === 'Family car') return ['SUV', 'MPV'].includes(vehicle.body);
  if (category === 'Latest SUVs') return vehicle.body === 'SUV' && vehicle.year >= 2024;
  if (category === 'Luxury in budget') return vehicle.tier === 'Luxe' && hasPublishedPrice(vehicle) && vehicle.price <= 120000;
  if (category === 'Hot deals') return vehicleDiscount(vehicle) > 0;
  return category === 'Premium sedans' && vehicle.body === 'Sedan' && vehicle.tier === 'Luxe';
}
function matchesFeature(vehicle: Vehicle, feature: string) {
  const aliases: Record<string, string[]> = {'Fuel Efficient': ['fuel efficient', 'economical'], 'Reverse Camera': ['reverse camera', 'rear camera', '360° camera'], Sunroof: ['sunroof', 'panoramic roof'], 'Panoramic Sunroof': ['panoramic sunroof', 'panoramic roof'], Moonroof: ['moonroof']};
  return vehicle.highlights.some(value => (aliases[feature] ?? [feature.toLowerCase()]).some(alias => value.toLowerCase().includes(alias)));
}
export function matchesInventory(vehicle: Vehicle, filters: Filters, query: string) {
  const normalized = query.trim().toLowerCase();
  if (normalized && !`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`.toLowerCase().includes(normalized)) return false;
  if ((filters.brands.length || filters.models.length) && !filters.brands.some(make => inventoryNameKey(make) === inventoryNameKey(vehicle.make)) && !filters.models.some(model => inventoryModelKey(model) === inventoryModelKey(`${vehicle.make}::${vehicle.model}`))) return false;
  if (filters.bodies.length && !filters.bodies.some(body => matchesBody(vehicle, body))) return false;
  if (filters.fuel.length && !filters.fuel.includes(vehicle.fuel)) return false;
  const defaults = emptyFilters();
  if ((filters.minimum !== defaults.minimum || filters.maximum !== defaults.maximum) && (!hasPublishedPrice(vehicle) || vehicle.price < filters.minimum || vehicle.price > filters.maximum)) return false;
  if (filters.budget.length && (!hasPublishedPrice(vehicle) || !filters.budget.some(value => value.startsWith('Above') ? vehicle.price >= 100000 : vehicle.price < Number(value.replace(/\D/g, '')) * 1000))) return false;
  if ((filters.yearMinimum !== defaults.yearMinimum || filters.yearMaximum !== defaults.yearMaximum) && (vehicle.year < filters.yearMinimum || vehicle.year > filters.yearMaximum)) return false;
  if (filters.year && vehicle.year < Number.parseInt(filters.year)) return false;
  if ((filters.mileageMinimum !== defaults.mileageMinimum || filters.mileageMaximum !== defaults.mileageMaximum) && (!hasPublishedMileage(vehicle) || vehicle.mileage < filters.mileageMinimum || vehicle.mileage > filters.mileageMaximum)) return false;
  if (filters.mileage && (!hasPublishedMileage(vehicle) || vehicle.mileage >= Number(filters.mileage.replace(/\D/g, '')))) return false;
  if (!matchesMonthlyPayment(vehicle, filters.emiLimit ?? undefined)) return false;
  if (filters.engineMinimum !== inventoryBounds.engineMinimum || filters.engineMaximum !== inventoryBounds.engineMaximum) {
    const engine = Number.parseFloat(vehicle.engine);
    if (!Number.isFinite(engine) || engine < filters.engineMinimum || engine > filters.engineMaximum) return false;
  }
  if (filters.cylinderMinimum !== inventoryBounds.cylinderMinimum || filters.cylinderMaximum !== inventoryBounds.cylinderMaximum) {
    const cylinders = vehicle.cylinders;
    if (cylinders === undefined || cylinders < filters.cylinderMinimum || cylinders > filters.cylinderMaximum) return false;
  }
  return Object.entries(filters.extra).every(([type, choices]) => !choices.length || choices.some(value => {
    if (type === 'DISCOUNTS') return vehicleDiscount(vehicle) > 0;
    if (type === 'EMI') {if (!hasPublishedMonthlyPayment(vehicle)) return false; const amount = Number(value.replace(/\D/g, '')); return value.startsWith('Above') ? vehicle.monthly >= amount : vehicle.monthly < amount;}
    if (type === 'DOWN PAYMENT') return vehicle.zeroDownPayment === true;
    if (type === 'CAR TYPE') return vehicle.tier === value;
    if (type === 'CATEGORIES') return matchesCategory(vehicle, value);
    if (type === 'FEATURES') return matchesFeature(vehicle, value);
    if (type === 'TRANSMISSION') return vehicle.transmission === value;
    return true;
  }));
}
