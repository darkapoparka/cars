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

export const listingFilterOptions = {
  makes: ['', ...new Set(featuredVehicles.map(v => v.make))],
  bodies: ['', ...new Set(featuredVehicles.map(v => v.body))],
  fuels: ['', ...new Set(featuredVehicles.map(v => v.fuel))],
  transmissions: ['', 'Автоматик', 'Ръчна'],
  versions: ['', 'RS', 'AMG', 'M Sport', 'xDrive'],
  equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'] satisfies readonly VehicleEquipment[],
  years: ['', '2010', '2013', '2014', '2015', '2016', '2017', '2021'],
  prices: ['', '10000', '15000', '20000', '25000', '30000'],
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
  const value = Number.parseInt(params.get(key) ?? '', 10);
  return Number.isFinite(value) ? value : null;
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
    equipment: params.getAll('equipment').filter((value): value is VehicleEquipment => equipmentValues.has(value as VehicleEquipment)),
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
    if (filters.yearMin && vehicle.yearNumber < filters.yearMin) return false;
    if (filters.yearMax && vehicle.yearNumber > filters.yearMax) return false;
    if (filters.priceMin && vehicle.priceEur < filters.priceMin) return false;
    if (filters.priceMax && vehicle.priceEur > filters.priceMax) return false;
    if (filters.mileageMax && vehicle.mileageKm > filters.mileageMax) return false;
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
