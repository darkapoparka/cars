import {bodyTypes, emptyFilters, type Filters, type FilterTab} from './inventory-filters';
import {inventoryNameKey} from './inventory-identity';

export const desktopFilterGroups: {label: string; tabs: FilterTab[]}[] = [
  {label: 'Vehicle', tabs: ['BRAND', 'MODEL', 'BODY TYPE', 'YEAR', 'MILEAGE']},
  {label: 'Price & finance', tabs: ['BUDGET', 'EMI', 'DISCOUNTS', 'DOWN PAYMENT']},
  {label: 'Details', tabs: ['FUEL TYPE', 'TRANSMISSION', 'CAR TYPE', 'CATEGORIES', 'FEATURES', 'ENGINE']},
];

export const desktopFilterTitles: Record<FilterTab, string> = {
  BRAND: 'Make', MODEL: 'Model', BUDGET: 'Price', DISCOUNTS: 'Discounts', EMI: 'Monthly payment',
  'DOWN PAYMENT': 'Down payment', YEAR: 'Year', 'BODY TYPE': 'Body type', MILEAGE: 'Mileage',
  'CAR TYPE': 'Collection', 'FUEL TYPE': 'Fuel type', TRANSMISSION: 'Gearbox',
  CATEGORIES: 'Categories', FEATURES: 'Features', ENGINE: 'Engine',
};

export const desktopCollectionTitles: Record<string, string> = {
  Prime: 'Collection: Everyday', Luxe: 'Collection: Select', Lite: 'Collection: Value',
};

const bodyAliases: Record<string, readonly string[]> = {
  HATCHBACK: ['HATCHBACK', 'SPORTBACK', 'LIFTBACK'],
  CONVERTIBLE: ['CONVERTIBLE', 'ROADSTER'],
  'PICK-UP': ['PICK-UP', 'DOUBLE CAB UTILITY', 'CREW CAB UTILITY'],
};

/** These legacy names use the same inventory predicate, so desktop shows one choice. */
export function desktopBodyValue(value: string): string {
  return Object.keys(bodyAliases).find(body => bodyAliases[body].includes(value)) ?? value;
}

export const desktopBodyTypes = bodyTypes.filter(body => desktopBodyValue(body) === body);

export function toggleDesktopBody(filters: Filters, body: string): Filters {
  const canonical = desktopBodyValue(body);
  const selected = filters.bodies.some(value => desktopBodyValue(value) === canonical);
  const remaining = filters.bodies.filter(value => desktopBodyValue(value) !== canonical);
  return {...filters, bodies: selected ? remaining : [...remaining, canonical]};
}

/** Remove a make and its model refinements without changing other selections. */
export function clearDesktopMake(filters: Filters, make: string): Filters {
  const key = inventoryNameKey(make);
  return {
    ...filters,
    brands: filters.brands.filter(brand => inventoryNameKey(brand) !== key),
    models: filters.models.filter(model => inventoryNameKey(model.split('::')[0]) !== key),
  };
}

/** Clear only this facet; all independent criteria stay selected. */
export function clearDesktopFilter(filters: Filters, tab: FilterTab): Filters {
  const defaults = emptyFilters();
  if (tab === 'BRAND') return {...filters, brands: [], models: []};
  if (tab === 'MODEL') return {...filters, brands: [...new Set([...filters.brands, ...filters.models.map(model => model.split('::')[0])])], models: []};
  if (tab === 'BUDGET') return {...filters, budget: [], minimum: defaults.minimum, maximum: defaults.maximum};
  if (tab === 'YEAR') return {...filters, year: '', yearMinimum: defaults.yearMinimum, yearMaximum: defaults.yearMaximum};
  if (tab === 'MILEAGE') return {...filters, mileage: '', mileageMinimum: defaults.mileageMinimum, mileageMaximum: defaults.mileageMaximum};
  if (tab === 'BODY TYPE') return {...filters, bodies: []};
  if (tab === 'FUEL TYPE') return {...filters, fuel: []};
  if (tab === 'ENGINE') return {...filters, engineMinimum: defaults.engineMinimum, engineMaximum: defaults.engineMaximum, cylinderMinimum: defaults.cylinderMinimum, cylinderMaximum: defaults.cylinderMaximum};
  if (tab === 'EMI') return {...filters, emiLimit: null, extra: {...filters.extra, EMI: []}};
  return {...filters, extra: {...filters.extra, [tab]: []}};
}

export function desktopFilterCount(filters: Filters, tab: FilterTab): number {
  const defaults = emptyFilters();
  if (tab === 'BRAND') return new Set([...filters.brands, ...filters.models.map(model => model.split('::')[0])]).size;
  if (tab === 'MODEL') return filters.models.length;
  if (tab === 'BUDGET') return filters.budget.length || Number(filters.minimum !== defaults.minimum || filters.maximum !== defaults.maximum);
  if (tab === 'YEAR') return Number(Boolean(filters.year) || filters.yearMinimum !== defaults.yearMinimum || filters.yearMaximum !== defaults.yearMaximum);
  if (tab === 'MILEAGE') return Number(Boolean(filters.mileage) || filters.mileageMinimum !== defaults.mileageMinimum || filters.mileageMaximum !== defaults.mileageMaximum);
  if (tab === 'BODY TYPE') return new Set(filters.bodies.map(desktopBodyValue)).size;
  if (tab === 'FUEL TYPE') return filters.fuel.length;
  if (tab === 'ENGINE') return Number(filters.engineMinimum !== defaults.engineMinimum || filters.engineMaximum !== defaults.engineMaximum) + Number(filters.cylinderMinimum !== defaults.cylinderMinimum || filters.cylinderMaximum !== defaults.cylinderMaximum);
  return (filters.extra[tab]?.length ?? 0) + Number(tab === 'EMI' && filters.emiLimit !== null);
}
