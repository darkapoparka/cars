import {emptyFilters, type Filters, type FilterTab} from './inventory-filters';

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

export const desktopFilterHelp: Partial<Record<FilterTab, string>> = {
  BRAND: 'Choose makes or expand for models.',
  DISCOUNTS: 'Show cars with a reduction from their previous listed price.',
  EMI: 'Estimated payments. Confirm finance terms.',
  'DOWN PAYMENT': 'Only cars explicitly listed with zero down payment.',
};

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
  if (tab === 'BODY TYPE') return filters.bodies.length;
  if (tab === 'FUEL TYPE') return filters.fuel.length;
  if (tab === 'ENGINE') return Number(filters.engineMinimum !== defaults.engineMinimum || filters.engineMaximum !== defaults.engineMaximum) + Number(filters.cylinderMinimum !== defaults.cylinderMinimum || filters.cylinderMaximum !== defaults.cylinderMaximum);
  return (filters.extra[tab]?.length ?? 0) + Number(tab === 'EMI' && filters.emiLimit !== null);
}
