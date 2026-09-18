import type { VehicleEquipment } from './inventory';
import {
  bodyLabel,
  listingFilterOptions,
  listingModelsForMake,
  parseListingFilters,
  type ListingFilters,
  type ListingSort
} from './listing';

export type ListingFacetField =
  | 'make'
  | 'model'
  | 'body'
  | 'price'
  | 'year'
  | 'fuel'
  | 'mileage_max'
  | 'transmission'
  | 'version'
  | 'condition'
  | 'equipment'
  | 'sort';

export type ListingDraft = {
  q: string;
  make: string;
  model: string;
  body: string;
  fuel: string;
  transmission: string;
  version: string;
  equipment: VehicleEquipment[];
  condition: ListingFilters['condition'];
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  mileageMax: string;
  sort: ListingSort;
};

const draftNumber = (value: number | null) => value === null ? '' : String(value);
const normalize = (value: string) => value.toLocaleLowerCase('bg-BG').trim();

export const emptyListingDraft = (sort: ListingSort = 'default'): ListingDraft => ({
  q: '',
  make: '',
  model: '',
  body: '',
  fuel: '',
  transmission: '',
  version: '',
  equipment: [],
  condition: '',
  yearMin: '',
  yearMax: '',
  priceMin: '',
  priceMax: '',
  mileageMax: '',
  sort
});

export const listingDraftFromFilters = (filters: ListingFilters): ListingDraft => ({
  q: filters.q,
  make: filters.make,
  model: filters.model,
  body: filters.body,
  fuel: filters.fuel,
  transmission: filters.transmission,
  version: filters.version,
  equipment: [...filters.equipment],
  condition: filters.condition,
  yearMin: draftNumber(filters.yearMin),
  yearMax: draftNumber(filters.yearMax),
  priceMin: draftNumber(filters.priceMin),
  priceMax: draftNumber(filters.priceMax),
  mileageMax: draftNumber(filters.mileageMax),
  sort: filters.sort
});

export const listingFiltersFromDraft = (draft: ListingDraft): ListingFilters => {
  const params = new URLSearchParams();
  const values: [string, string][] = [
    ['q', draft.q],
    ['make', draft.make],
    ['model', draft.model],
    ['body', draft.body],
    ['fuel', draft.fuel],
    ['transmission', draft.transmission],
    ['version', draft.version],
    ['condition', draft.condition],
    ['year_min', draft.yearMin],
    ['year_max', draft.yearMax],
    ['price_min', draft.priceMin],
    ['price_max', draft.priceMax],
    ['mileage_max', draft.mileageMax],
    ['sort', draft.sort === 'default' ? '' : draft.sort]
  ];
  for (const [key, value] of values) {
    const trimmed = value.trim();
    if (trimmed) params.set(key, trimmed);
  }
  for (const value of draft.equipment) params.append('equipment', value);
  return parseListingFilters(params);
};

export const listingFiltersFromFormData = (formData: FormData): ListingFilters => {
  const params = new URLSearchParams();
  for (const [key, value] of formData) {
    if (typeof value === 'string') params.append(key, value);
  }
  return parseListingFilters(params);
};

export function cleanListingFormData(formData: FormData): void {
  for (const key of new Set(formData.keys())) {
    const values = formData.getAll(key);
    if (values.every(value => typeof value === 'string' && !value.trim())) formData.delete(key);
  }
}

export function withListingMake(draft: ListingDraft, make: string): ListingDraft {
  return {
    ...draft,
    make,
    model: listingModelAfterMakeChange(draft.make, make, draft.model)
  };
}

export const listingDraftHasFilters = (draft: ListingDraft) => {
  const filters = listingFiltersFromDraft(draft);
  return Boolean(
    filters.q || filters.make || filters.model || filters.body || filters.fuel ||
    filters.transmission || filters.version || filters.equipment.length || filters.condition ||
    filters.yearMin !== null || filters.yearMax !== null || filters.priceMin !== null ||
    filters.priceMax !== null || filters.mileageMax !== null
  );
};

export const formatListingNumber = (value: string | number) =>
  new Intl.NumberFormat('bg-BG').format(Number(value));

export function listingOptionsWithCurrent(options: readonly string[], current: string): readonly string[] {
  return current && !options.includes(current) ? [...options, current] : options;
}

const listingRangeSummary = (minimum: string, maximum: string, suffix: string) =>
  minimum || maximum ? `${minimum || '—'} – ${maximum || '—'}${suffix}` : 'Без ограничение';

export function listingFacetOptions(field: ListingFacetField, make = ''): readonly string[] {
  switch (field) {
    case 'sort': return listingFilterOptions.sorts.map(([value]) => value === 'default' ? '' : value);
    case 'make': return listingFilterOptions.makes;
    case 'model': return listingModelsForMake(make);
    case 'body': return listingFilterOptions.bodies;
    case 'fuel': return listingFilterOptions.fuels;
    case 'transmission': return listingFilterOptions.transmissions;
    case 'version': return listingFilterOptions.versions;
    case 'condition': return ['', 'used', 'new'];
    case 'equipment': return listingFilterOptions.equipment;
    default: return [];
  }
}

export function listingFacetOptionLabel(field: ListingFacetField, option: string): string {
  if (field === 'body') return bodyLabel(option) || 'Всички';
  if (field === 'sort') {
    return listingFilterOptions.sorts.find(([value]) => value === (option || 'default'))?.[1] ?? option;
  }
  if (option === 'new') return 'Нови';
  if (option === 'used') return 'Употребявани';
  return option || 'Всички';
}

export function listingFacetSummary(field: ListingFacetField, draft: ListingDraft): string {
  switch (field) {
    case 'make': return draft.make || 'Всички марки';
    case 'model': return draft.model || 'Всички модели';
    case 'body': return bodyLabel(draft.body) || 'Всички купета';
    case 'price': return listingRangeSummary(draft.priceMin, draft.priceMax, ' €');
    case 'year': return listingRangeSummary(draft.yearMin, draft.yearMax, '');
    case 'fuel': return draft.fuel || 'Всяко гориво';
    case 'mileage_max': return draft.mileageMax ? `До ${draft.mileageMax} км` : 'Без ограничение';
    case 'transmission': return draft.transmission || 'Всички';
    case 'version': return draft.version || 'Всички';
    case 'condition': return draft.condition === 'new' ? 'Нови' : draft.condition === 'used' ? 'Употребявани' : 'Всички';
    case 'equipment': return draft.equipment.length ? `${draft.equipment.length} избрани` : 'Без предпочитания';
    case 'sort': return listingFacetOptionLabel('sort', draft.sort === 'default' ? '' : draft.sort);
  }
}

export function preservedListingFacetEntries(params: URLSearchParams, field: ListingFacetField, selected: string): [string, string][] {
  const range = field === 'price' || field === 'year';
  return [...params.entries()].filter(([key]) => {
    if (range) return key !== `${field}_min` && key !== `${field}_max`;
    if (field === 'make' && key === 'model' && normalize(selected) !== normalize(params.get('make') ?? '')) return false;
    return key !== field;
  });
}

export function listingModelAfterMakeChange(currentMake: string, nextMake: string, currentModel: string): string {
  return normalize(currentMake) === normalize(nextMake) ? currentModel : '';
}

export function listingAppliedFilterLabel(filters: ListingFilters, key: string, value: string): string {
  switch (key) {
    case 'body': return bodyLabel(filters.body);
    case 'condition': return filters.condition === 'new' ? 'Нови' : 'Употребявани';
    case 'price_min': return `От ${filters.priceMin?.toLocaleString('bg-BG')} €`;
    case 'price_max': return `До ${filters.priceMax?.toLocaleString('bg-BG')} €`;
    case 'year_min': return `От ${filters.yearMin} г.`;
    case 'year_max': return `До ${filters.yearMax} г.`;
    case 'mileage_max': return `До ${filters.mileageMax?.toLocaleString('bg-BG')} км`;
    default: return value;
  }
}

export function normalizeListingMakeTransition(current: ListingFilters, next: ListingFilters): ListingFilters {
  const model = listingModelAfterMakeChange(current.make, next.make, next.model);
  return model === next.model ? next : { ...next, model };
}
