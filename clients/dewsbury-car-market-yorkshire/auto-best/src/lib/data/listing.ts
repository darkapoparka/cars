import { canonicalMileage, mileageLimitKm, mileageSortValue } from '$lib/data/dealer-mileage';
import { featuredVehicles, vehicleTypes, type VehicleType, type Vehicle, type VehicleCondition, type VehicleEquipment } from './inventory';
import { catalogueModel, catalogueModelMatches } from './model-catalogue';
import type { Locale } from '$lib/locale/core';
import { specificationLabel } from '$lib/i18n/presentation';

export type ListingSort = 'default' | 'newest' | 'price-asc' | 'price-desc' | 'mileage-asc';

export type ListingFilters = {
  q: string;
  type: '' | VehicleType;
  make: string[];
  model: string[];
  body: string;
  fuel: string;
  transmission: string;
  version: string;
  equipment: VehicleEquipment[];
  condition: '' | VehicleCondition;
  yearMin: number | null;
  yearMax: number | null;
  priceMin: number | null;
  priceMax: number | null;
  mileageMax: number | null;
  sort: ListingSort;
};

const bodyLabels: Record<string, string> = { SUV: 'SUV', Coupe: 'Купе', Wagon: 'Комби', Sportback: 'Спортбек', Sedan: 'Седан', Crossover: 'Кросоувър', Hatchback: 'Хечбек', 'Pickup Truck': 'Пикап', Minivan: 'Миниван', Convertible: 'Кабриолет' };
export const bodyLabel = (body: string) => bodyLabels[body] ?? body;
const availableValues = (key: 'make' | 'body' | 'fuel' | 'transmission') => ['', ...new Set(featuredVehicles.map(vehicle => vehicle[key]))];

/** URL keys are the shared contract for forms, chips, return links and dialogs. */
export const listingParams = (filters: ListingFilters): URLSearchParams => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    const name = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    if (Array.isArray(value)) listingSelections(value).forEach(item => params.append(name, item));
    else if (value !== null && value !== '' && !(key === 'sort' && value === 'default')) params.set(name, String(value));
  }
  return params;
};

export const listingHiddenFields = (filters: ListingFilters, exclude: readonly string[] = []) =>
  [...listingParams(filters)].filter(([key]) => !exclude.includes(key));

export const activeFilterCount = (filters: ListingFilters) => listingHiddenFields(filters, ['q', 'sort']).length;

export function removeListingFilter(filters: ListingFilters, key: string, value: string) {
  const params = listingParams(filters);
  params.delete(key, value);
  if (key === 'make') {
    const models = listingModelsAfterMakeChange(filters.make, params.getAll('make'), filters.model);
    params.delete('model');
    models.forEach(model => params.append('model', model));
  }
  return params;
}

export const listingFilterOptions = {
  types: ['', ...vehicleTypes],
  makes: availableValues('make'),
  bodies: availableValues('body'),
  fuels: availableValues('fuel'),
  transmissions: availableValues('transmission'),
  versions: ['', 'RS', 'AMG', 'M Sport', 'xDrive'],
  equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'] satisfies readonly VehicleEquipment[],
  years: ['', '2019', '2020', '2021', '2022', '2023', '2024'],
  prices: ['', '5000', '10000', '15000', '20000', '30000', '40000', '50000', '55000', '60000', '70000', '80000', '90000', '100000'],
  mileages: ['', '50000', '75000', '100000'],
  sorts: [
    ['default', 'Препоръчани'],
    ['newest', 'Най-нови'],
    ['price-asc', 'Цена: ниска към висока'],
    ['price-desc', 'Цена: висока към ниска'],
    ['mileage-asc', 'Най-нисък пробег']
  ] as const
} as const;

const equipmentGroups = [
  { id: 'comfort', titleKey: 'inventory.equipment.comfort', values: ['Панорамен покрив', 'Подгряване на седалки', 'Безключов достъп'] },
  { id: 'assistance', titleKey: 'inventory.equipment.assistance', values: ['360° камера', 'Парктроник', 'Адаптивен круиз контрол'] },
  { id: 'multimedia', titleKey: 'inventory.equipment.multimedia', values: ['Навигация'] },
  { id: 'drivetrain', titleKey: 'inventory.equipment.drivetrain', values: ['4x4'] }
] as const;

/** Group the available catalog, retaining new dealer features until they are categorized. */
export function listingEquipmentGroups(values: readonly string[] = listingFilterOptions.equipment) {
  const unique = [...new Set(values.filter(Boolean))];
  const groups = equipmentGroups.map(group => ({ id: group.id as string, titleKey: group.titleKey,
    values: unique.filter(value => (group.values as readonly string[]).includes(value)) }));
  const assigned = new Set(groups.flatMap(group => group.values));
  return [...groups, { id: 'other', titleKey: 'inventory.equipment.other' as const,
    values: unique.filter(value => !assigned.has(value)) }].filter(group => group.values.length);
}

const integerParam = (params: URLSearchParams, key: string) => {
  const raw = params.get(key) ?? '';
  const value = Number(raw);
  return /^\d+$/.test(raw) && Number.isSafeInteger(value) ? value : null;
};

const sortValues = new Set<ListingSort>(listingFilterOptions.sorts.map(([value]) => value));
const equipmentValues = new Set<VehicleEquipment>(listingFilterOptions.equipment);

export const parseListingFilters = (params: URLSearchParams): ListingFilters => {
  const requestedSort = params.get('sort') as ListingSort | null;
  const requestedCondition = params.get('condition');

  return {
    q: params.get('q')?.trim() ?? '',
    type: vehicleTypes.includes(params.get('type') as VehicleType) ? params.get('type') as VehicleType : '',
    make: listingSelections(params.getAll('make')),
    model: listingSelections(params.getAll('model')),
    body: params.get('body')?.trim() ?? '',
    fuel: params.get('fuel')?.trim() ?? '',
    transmission: params.get('transmission')?.trim() ?? '',
    version: params.get('version')?.trim() ?? '',
    equipment: [...new Set(params.getAll('equipment'))].filter((value): value is VehicleEquipment => equipmentValues.has(value as VehicleEquipment)),
    condition: requestedCondition === 'new' || requestedCondition === 'used' ? requestedCondition : '',
    yearMin: integerParam(params, 'year_min'),
    yearMax: integerParam(params, 'year_max'),
    priceMin: integerParam(params, 'price_min'),
    priceMax: integerParam(params, 'price_max'),
    mileageMax: integerParam(params, 'mileage_max'),
    sort: requestedSort && sortValues.has(requestedSort) ? requestedSort : 'default'
  };
};

const normalize = (value: string) => value.toLocaleLowerCase('bg-BG').trim();

/** Repeated URL values are the selection contract; preserve their readable labels. */
export function listingSelections(values: string | readonly string[]): string[] {
  const unique = new Map<string, string>();
  for (const value of typeof values === 'string' ? [values] : values) {
    const trimmed = value.trim();
    if (trimmed && !unique.has(normalize(trimmed))) unique.set(normalize(trimmed), trimmed);
  }
  return [...unique.values()];
}

export function toggleListingSelection(values: readonly string[], value: string): string[] {
  if (!value) return [];
  const exists = listingSelectionHas(values, value);
  return exists ? values.filter(selected => normalize(selected) !== normalize(value)) : listingSelections([...values, value]);
}

/** Menus use the same equality as URL filtering and selection toggles. */
export function listingSelectionHas(values: readonly string[], value: string): boolean {
  return values.some(selected => normalize(selected) === normalize(value));
}

export const listingModelsForMake = (make: string | readonly string[]) => {
  const makes = listingSelections(make).map(normalize);
  const models = featuredVehicles
    .filter((vehicle) => !makes.length || makes.includes(normalize(vehicle.make)))
    .map((vehicle) => vehicle.title.replace(`${vehicle.make} `, ''));

  return ['', ...new Set(models)];
};

/** Keep models belonging to a remaining brand, including legacy partial model URLs. */
export function listingModelsAfterMakeChange(current: readonly string[], next: readonly string[], models: readonly string[]): string[] {
  const currentMakes = listingSelections(current).map(normalize);
  const nextMakes = listingSelections(next).map(normalize);
  if (currentMakes.length === nextMakes.length && currentMakes.every(make => nextMakes.includes(make))) return [...models];
  if (!nextMakes.length) return [];
  return models.filter(model => {
    const catalogueOwner = catalogueModel(model)?.make;
    if (catalogueOwner) return nextMakes.includes(normalize(catalogueOwner));
    const owners = featuredVehicles.filter(vehicle => normalize(vehicle.title).includes(normalize(model)));
    // An applied value outside current stock has no known incompatible owner.
    return !owners.length || owners.some(vehicle => nextMakes.includes(normalize(vehicle.make)));
  });
}

export const vehicleMatchesQuery = (vehicle: Vehicle, query: string, locale: Locale = 'en') => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;

  return normalize([
    vehicle.title,
    vehicle.make,
    vehicle.category,
    vehicle.body,
    vehicle.year,
    vehicle.mileage,
    vehicle.fuel,
    vehicle.transmission,
    ...vehicle.equipment,
    ...[vehicle.body, vehicle.category, vehicle.fuel, vehicle.transmission, ...vehicle.equipment].map(value => specificationLabel(value, locale))
  ].join(' ')).includes(normalizedQuery);
};

export const filterListingVehicles = (vehicles: readonly Vehicle[], filters: ListingFilters, locale: Locale = 'en') => {
  const query = normalize(filters.q);
  const models = filters.model.map(normalize);
  const makes = filters.make.map(normalize);
  const body = normalize(filters.body);
  const fuel = normalize(filters.fuel);
  const transmission = normalize(filters.transmission);
  const version = normalize(filters.version);

  const filtered = vehicles.filter((vehicle) => {
    if (query && !vehicleMatchesQuery(vehicle, query, locale)) return false;
    if (filters.type && vehicle.type !== filters.type) return false;
    if (makes.length && !makes.includes(normalize(vehicle.make))) return false;
    if (models.length && !models.some(model => catalogueModelMatches(vehicle, model) ?? normalize(vehicle.title).includes(model))) return false;
    if (body && normalize(vehicle.body) !== body && !normalize(vehicle.category).includes(body)) return false;
    if (fuel && normalize(vehicle.fuel) !== fuel) return false;
    if (transmission && normalize(vehicle.transmission) !== transmission) return false;
    if (version && !normalize(vehicle.title).includes(version)) return false;
    if (filters.equipment.length > 0 && !filters.equipment.every((item) => vehicle.equipment.includes(item))) return false;
    if (filters.condition && vehicle.condition !== filters.condition) return false;
    if (filters.yearMin !== null && vehicle.yearNumber < filters.yearMin) return false;
    if (filters.yearMax !== null && vehicle.yearNumber > filters.yearMax) return false;
    if (filters.priceMin !== null && vehicle.priceEur < filters.priceMin) return false;
    if (filters.priceMax !== null && vehicle.priceEur > filters.priceMax) return false;
    if (filters.mileageMax !== null && !(canonicalMileage(vehicle) <= mileageLimitKm(filters.mileageMax))) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === 'newest') return b.yearNumber - a.yearNumber;
    if (filters.sort === 'price-asc') return a.priceEur - b.priceEur;
    if (filters.sort === 'price-desc') return b.priceEur - a.priceEur;
    if (filters.sort === 'mileage-asc') return mileageSortValue(a) - mileageSortValue(b);
    return a.id - b.id;
  });
};

export const listingVehicles = featuredVehicles;

/** Category counts describe stocked vehicle types, independently of the current facets. */
export const listingTypeCount = (type: string) => featuredVehicles.filter(vehicle => !type || vehicle.type === type).length;

/** Short, useful budget caps adapt to a dealer's stock; avoid duplicate or empty shortcuts. */
export function listingBudgetCaps(vehicles: readonly Vehicle[] = featuredVehicles): number[] {
  const caps = [10000, 20000, 30000, 40000, 60000, 80000, 100000, 150000, 200000];
  const result: number[] = [];
  let previousCount = 0;
  for (const cap of caps) {
    const count = vehicles.filter(vehicle => vehicle.priceEur > 0 && vehicle.priceEur <= cap).length;
    if (count > previousCount) { result.push(cap); previousCount = count; }
    if (result.length === 3) break;
  }
  return result;
}

/** A slider still needs a finite browsing range when a dealer has no stock. */
export function listingBudgetLimit(vehicles: readonly Vehicle[] = featuredVehicles): number {
  const maximum = vehicles.reduce((limit, vehicle) => Number.isFinite(vehicle.priceEur) ? Math.max(limit, vehicle.priceEur) : limit, 0);
  return Math.max(10000, Math.ceil(maximum / 10000) * 10000);
}
