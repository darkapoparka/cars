import { normalizeFilters } from './filters';
import { defaultFilters, type Filters } from './types';
import { clearMakeSelections } from './make-selection';

export const showroomFilterTabs = [
  { value: 'search', label: 'Search' },
  { value: 'make', label: 'Make & model' },
  { value: 'price', label: 'Price' },
  { value: 'year', label: 'Year' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'condition', label: 'Condition' },
  { value: 'more', label: 'More' },
] as const;
export type ShowroomFilterTab = (typeof showroomFilterTabs)[number]['value'];
export type ShowroomMoreSection = 'mileage' | 'transmission' | 'body';
export type ShowroomQuickFilter =
  Exclude<ShowroomFilterTab, 'more'> | 'mileage' | 'gearbox' | 'body';

export function clearShowroomQuickFilter(filters: Filters, key: ShowroomQuickFilter): Filters {
  const patches: Record<ShowroomQuickFilter, Partial<Filters>> = {
    make: clearMakeSelections(),
    price: { minPrice: '', maxPrice: '' },
    year: { minYear: '', maxYear: '' },
    mileage: { minMileage: '', maxMileage: '' },
    fuel: { fuel: [] },
    gearbox: { transmission: [] },
    body: { body: [] },
    condition: { condition: [] },
    search: { query: '' },
  };
  return normalizeFilters({ ...filters, ...patches[key] });
}

export function showroomMoreSection(value: string | null): ShowroomMoreSection | null {
  return value === 'mileage' || value === 'transmission' || value === 'body' ? value : null;
}

export function showroomFilterTab(value: string | null) {
  return showroomFilterTabs.find((tab) => tab.value === value)?.value || null;
}
export function updateShowroomFilterDraft(draft: Filters, patch: Partial<Filters>): Filters {
  return normalizeFilters({ ...draft, ...patch, category: draft.category });
}
export function resetShowroomFilterDraft(draft: Filters): Filters {
  return { ...structuredClone(defaultFilters), category: draft.category };
}
