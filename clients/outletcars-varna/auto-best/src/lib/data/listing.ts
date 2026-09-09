import { featuredVehicles, type Vehicle, type VehicleCondition, type VehicleEquipment } from './inventory';

export type ListingSort = 'default' | 'newest' | 'price-asc' | 'price-desc' | 'mileage-asc';

export type ListingFilters = {
  q: string;
  make: string;
  model: string;
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
    if (Array.isArray(value)) [...new Set(value)].forEach(item => params.append(name, item));
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
  if (key === 'make') params.delete('model');
  return params;
}

export const listingFilterOptions = {
  makes: availableValues('make'),
  bodies: availableValues('body'),
  fuels: availableValues('fuel'),
  transmissions: availableValues('transmission'),
  versions: ['', 'RS', 'AMG', 'M Sport', 'xDrive'],
  equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'] satisfies readonly VehicleEquipment[],
  years: ['', '2019', '2020', '2021', '2022', '2023', '2024'],
  prices: ['', '50000', '55000', '60000', '70000', '80000', '90000', '100000'],
  mileages: ['', '50000', '75000', '100000'],
  sorts: [
    ['default', 'Препоръчани'],
    ['newest', 'Най-нови'],
    ['price-asc', 'Цена: ниска към висока'],
    ['price-desc', 'Цена: висока към ниска'],
    ['mileage-asc', 'Най-нисък пробег']
  ] as const
} as const;

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
    make: params.get('make')?.trim() ?? '',
    model: params.get('model')?.trim() ?? '',
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

export const listingModelsForMake = (make: string) => {
  const normalizedMake = normalize(make);
  const models = featuredVehicles
    .filter((vehicle) => !normalizedMake || normalize(vehicle.make) === normalizedMake)
    .map((vehicle) => vehicle.title.replace(`${vehicle.make} `, ''));

  return ['', ...new Set(models)];
};

export const vehicleMatchesQuery = (vehicle: Vehicle, query: string) => {
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
    ...vehicle.equipment
  ].join(' ')).includes(normalizedQuery);
};

export const filterListingVehicles = (vehicles: readonly Vehicle[], filters: ListingFilters) => {
  const query = normalize(filters.q);
  const model = normalize(filters.model);
  const make = normalize(filters.make);
  const body = normalize(filters.body);
  const fuel = normalize(filters.fuel);
  const transmission = normalize(filters.transmission);
  const version = normalize(filters.version);

  const filtered = vehicles.filter((vehicle) => {
    if (query && !vehicleMatchesQuery(vehicle, query)) return false;
    if (make && normalize(vehicle.make) !== make) return false;
    if (model && !normalize(vehicle.title).includes(model)) return false;
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
    if (filters.mileageMax !== null && vehicle.mileageKm > filters.mileageMax) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === 'newest') return b.yearNumber - a.yearNumber;
    if (filters.sort === 'price-asc') return a.priceEur - b.priceEur;
    if (filters.sort === 'price-desc') return b.priceEur - a.priceEur;
    if (filters.sort === 'mileage-asc') return a.mileageKm - b.mileageKm;
    return a.id - b.id;
  });
};

export const listingVehicles = featuredVehicles;
