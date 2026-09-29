import type { VehicleEquipment } from './inventory';
import { localeContract, intlLocale, type Locale } from '$lib/locale/core';
import { message, templateText } from '$lib/locale/messages';
import { formatTemplate, specificationLabel } from '$lib/i18n/presentation';
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

/** Field labels are contextual; the body filter is not the Coupe option. */
export const listingFacetTitle = (field: ListingFacetField, locale: Locale): string =>
  message(locale, `inventory.facet.${field}`);

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

export const formatListingNumber = (value: string | number, locale: Locale = 'en') =>
  new Intl.NumberFormat(intlLocale(locale)).format(Number(value));

export function listingOptionsWithCurrent(options: readonly string[], current: string): readonly string[] {
  return current && !options.includes(current) ? [...options, current] : options;
}

const listingRangeSummary = (minimum: string, maximum: string, suffix: string, locale: Locale) =>
  minimum || maximum ? `${minimum ? (suffix ? formatListingNumber(minimum, locale) : minimum) : '—'} – ${maximum ? (suffix ? formatListingNumber(maximum, locale) : maximum) : '—'}${suffix}` : message(locale, 'inventory.range.unlimited');

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

export function listingFacetOptionLabel(field: ListingFacetField, option: string, locale: Locale = 'en'): string {
  if (field === 'body') return specificationLabel(bodyLabel(option), locale) || templateText(locale, 'All');
  if (field === 'sort') {
    const label = listingFilterOptions.sorts.find(([value]) => value === (option || 'default'))?.[1];
    return label ? templateText(locale, label) : option;
  }
  if (option === 'new') return templateText(locale, 'New');
  if (option === 'used') return message(locale, 'inventory.condition.used');
  return specificationLabel(option, locale) || templateText(locale, 'All');
}

export function listingFacetSummary(field: ListingFacetField, draft: ListingDraft, locale: Locale = 'en'): string {
  switch (field) {
    case 'make': return draft.make || templateText(locale, 'All brands');
    case 'model': return draft.model || templateText(locale, 'All модели');
    case 'body': return specificationLabel(bodyLabel(draft.body), locale) || templateText(locale, 'All купета');
    case 'price': return listingRangeSummary(draft.priceMin, draft.priceMax, ' ' + localeContract.inventoryCurrency, locale);
    case 'year': return listingRangeSummary(draft.yearMin, draft.yearMax, '', locale);
    case 'fuel': return specificationLabel(draft.fuel, locale) || templateText(locale, 'Всяко fuel');
    case 'mileage_max': return draft.mileageMax ? formatTemplate(locale, 'To {p0} km', { p0: formatListingNumber(draft.mileageMax, locale) }) : message(locale, 'inventory.range.unlimited');
    case 'transmission': return specificationLabel(draft.transmission, locale) || templateText(locale, 'All');
    case 'version': return draft.version || templateText(locale, 'All');
    case 'condition': return draft.condition ? message(locale, draft.condition === 'new' ? 'inventory.condition.new' : 'inventory.condition.used') : templateText(locale, 'All');
    case 'equipment': return draft.equipment.length ? formatTemplate(locale, '{p0} selected features', { p0: draft.equipment.length }) : templateText(locale, 'Без предпочитания');
    case 'sort': return listingFacetOptionLabel('sort', draft.sort === 'default' ? '' : draft.sort, locale);
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

export function listingAppliedFilterLabel(filters: ListingFilters, key: string, value: string, locale: Locale = 'en'): string {
  switch (key) {
    case 'body': return specificationLabel(bodyLabel(filters.body), locale);
    case 'condition': return message(locale, filters.condition === 'new' ? 'inventory.condition.new' : 'inventory.condition.used');
    case 'fuel': case 'transmission': case 'equipment': return specificationLabel(value, locale);
    case 'price_min': return formatTemplate(locale, 'From {p0} {inventoryCurrency}', { p0: formatListingNumber(filters.priceMin ?? 0, locale) });
    case 'price_max': return formatTemplate(locale, 'To {p0} {inventoryCurrency}', { p0: formatListingNumber(filters.priceMax ?? 0, locale) });
    case 'year_min': return message(locale, 'inventory.year.from', { p0: filters.yearMin ?? '' });
    case 'year_max': return message(locale, 'inventory.year.to', { p0: filters.yearMax ?? '' });
    case 'mileage_max': return formatTemplate(locale, 'To {p0} km', { p0: formatListingNumber(filters.mileageMax ?? 0, locale) });
    default: return value;
  }
}

export function normalizeListingMakeTransition(current: ListingFilters, next: ListingFilters): ListingFilters {
  const model = listingModelAfterMakeChange(current.make, next.make, next.model);
  return model === next.model ? next : { ...next, model };
}
