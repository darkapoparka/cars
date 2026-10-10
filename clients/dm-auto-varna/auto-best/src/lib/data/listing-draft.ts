import { vehicleTypes, type VehicleEquipment } from './inventory';
import { catalogueModel } from './model-catalogue';
import { currencySymbol, formatPrice, type Locale } from '$lib/locale/core';
import { localeFormatters } from '$lib/locale/formatters';
import { message, templateText } from '$lib/locale/messages';
import { formatTemplate, specificationLabel } from '$lib/i18n/presentation';
import {
  bodyLabel,
  listingFilterOptions,
  listingModelsForMake,
  listingModelsAfterMakeChange,
  listingSelections,
  listingSelectionHas,
  toggleListingSelection,
  parseListingFilters,
  type ListingFilters,
  type ListingSort
} from './listing';

export type ListingFacetField =
  | 'type'
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
  type: ListingFilters['type'];
  make: string[];
  model: string[];
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

/** Styled selects share the URL field names; range drafts keep their typed keys. */
const listingChoiceKeys = {
  type: 'type', make: 'make', model: 'model', body: 'body', fuel: 'fuel',
  transmission: 'transmission', condition: 'condition', version: 'version', sort: 'sort',
  price_min: 'priceMin', price_max: 'priceMax', year_min: 'yearMin', year_max: 'yearMax', mileage_max: 'mileageMax'
} as const satisfies Record<string, keyof ListingDraft>;
export type ListingChoiceField = keyof typeof listingChoiceKeys;

export function listingChoiceValue(draft: ListingDraft, field: ListingChoiceField): string | string[] {
  const value = draft[listingChoiceKeys[field]];
  return field === 'sort' && value === 'default' ? '' : value;
}

export function withListingChoice(draft: ListingDraft, field: ListingChoiceField, value: string): ListingDraft {
  if (field === 'make' || field === 'model') return toggleListingIdentity(draft, field, value);
  return { ...draft, [listingChoiceKeys[field]]: field === 'sort' && !value ? 'default' : value };
}

export function listingChoiceTitle(field: ListingChoiceField, locale: Locale): string {
  switch (field) {
    case 'price_min': return message(locale, 'm_94470b41eead');
    case 'price_max': return message(locale, 'm_363c4f34635c');
    case 'year_min': return message(locale, 'm_349ee8568241');
    case 'year_max': return message(locale, 'm_07339ff9faf8');
    case 'mileage_max': return message(locale, 'm_5679c2543732');
    default: return listingFacetTitle(field, locale);
  }
}

export function listingChoiceOptions(field: ListingChoiceField, make: readonly string[]): readonly string[] {
  switch (field) {
    case 'price_min': case 'price_max': return listingFilterOptions.prices;
    case 'year_min': case 'year_max': return listingFilterOptions.years;
    case 'mileage_max': return listingFilterOptions.mileages;
    default: return listingFacetOptions(field, make);
  }
}

export function listingChoiceLabel(field: ListingChoiceField, value: string, locale: Locale): string {
  if (field === 'price_min' || field === 'price_max') return formatPrice(Number(value), locale);
  if (field === 'year_min' || field === 'year_max') return value;
  if (field === 'mileage_max') return formatTemplate(locale, 'To {p0} km', { p0: formatListingNumber(value, locale) });
  return listingFacetOptionLabel(field, value, locale);
}

/** The same category order is used by the desktop form and mobile overview. */
export const listingFilterGroups = [
  { id: 'vehicle', fields: ['make', 'model', 'price', 'year', 'fuel', 'transmission', 'mileage_max'] },
  { id: 'features', fields: ['type', 'body', 'condition', 'version'] },
  { id: 'equipment', fields: ['equipment'] }
] as const satisfies readonly { id: string; fields: readonly ListingFacetField[] }[];
export type ListingFilterGroup = typeof listingFilterGroups[number]['id'];

export const listingDraftFacetActive = (draft: ListingDraft, field: ListingFacetField): boolean => {
  if (field === 'price') return Boolean(draft.priceMin || draft.priceMax);
  if (field === 'year') return Boolean(draft.yearMin || draft.yearMax);
  if (field === 'mileage_max') return Boolean(draft.mileageMax);
  if (field === 'equipment' || field === 'make' || field === 'model') return draft[field].length > 0;
  if (field === 'sort') return draft.sort !== 'default';
  return Boolean(draft[field]);
};

export const listingDraftGroupCount = (draft: ListingDraft, group: ListingFilterGroup): number =>
  group === 'equipment' ? draft.equipment.length
    : listingFilterGroups.find(item => item.id === group)!.fields.filter(field => listingDraftFacetActive(draft, field)).length;

const draftNumber = (value: number | null) => value === null ? '' : String(value);
const numberFields = new Set(['price_min', 'price_max', 'year_min', 'year_max', 'mileage_max']);

/** Native number inputs accept exponent notation; submit its exact safe integer. */
const listingInputValue = (key: string, raw: string): string => {
  const value = raw.trim();
  const number = Number(value);
  return numberFields.has(key) && /^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)
    && Number.isSafeInteger(number) && number >= 0 ? String(number) : value;
};

export const emptyListingDraft = (sort: ListingSort = 'default'): ListingDraft => ({
  q: '',
  type: '',
  make: [],
  model: [],
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
  type: filters.type,
  make: [...filters.make],
  model: [...filters.model],
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
    ['type', draft.type],
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
    const trimmed = listingInputValue(key, value);
    if (trimmed) params.set(key, trimmed);
  }
  for (const field of ['make', 'model', 'equipment'] as const) {
    for (const value of listingSelections(draft[field])) params.append(field, value);
  }
  return parseListingFilters(params);
};

export const listingFiltersFromFormData = (formData: FormData): ListingFilters => {
  const params = new URLSearchParams();
  for (const [key, value] of formData) {
    if (typeof value === 'string') params.append(key, listingInputValue(key, value));
  }
  return parseListingFilters(params);
};

export function cleanListingFormData(formData: FormData): void {
  for (const key of new Set(formData.keys())) {
    const values = formData.getAll(key);
    if (values.every(value => typeof value === 'string' && !value.trim())) {
      formData.delete(key);
    } else if (numberFields.has(key)) {
      formData.delete(key);
      for (const value of values) formData.append(key, typeof value === 'string' ? listingInputValue(key, value) : value);
    }
  }
}

export function withListingMake(draft: ListingDraft, value: string | readonly string[]): ListingDraft {
  const make = listingSelections(value);
  return {
    ...draft,
    make,
    model: listingModelsAfterMakeChange(draft.make, make, draft.model)
  };
}

export function listingMakeForModel(model: string): string {
  if (!model) return '';
  const catalogueOwner = catalogueModel(model)?.make;
  if (catalogueOwner) return catalogueOwner;
  const makes = listingFilterOptions.makes.filter(make => make && listingSelectionHas(listingModelsForMake(make), model));
  return makes.length === 1 ? makes[0] : '';
}

export function withListingModel(draft: ListingDraft, value: string | readonly string[]): ListingDraft {
  const model = listingSelections(value);
  const owners = model.map(listingMakeForModel).filter(Boolean);
  // Choosing across brands widens an existing brand selection without dropping its models.
  const make = draft.make.length && owners.length ? listingSelections([...draft.make, ...owners]) : [...draft.make];
  return { ...draft, make, model };
}

export function toggleListingIdentity(draft: ListingDraft, field: 'make' | 'model', value: string): ListingDraft {
  const selection = toggleListingSelection(draft[field], value);
  return field === 'make' ? withListingMake(draft, selection) : withListingModel(draft, selection);
}

/** Suggestion matching is separate from the applied vehicle keyword. */
export function listingSuggestionMatcher(query: string, locale: Locale): (value: string) => boolean {
  const normalizeSuggestion = (value: string) => value.normalize('NFKD')
    .replace(/\p{M}/gu, '').toLocaleLowerCase(locale).replace(/[\s\p{P}]+/gu, '');
  const terms = query.trim().split(/\s+/).map(normalizeSuggestion).filter(Boolean);
  return value => {
    const normalized = normalizeSuggestion(value);
    return terms.every(term => normalized.includes(term));
  };
}

export const listingDraftHasFilters = (draft: ListingDraft) => {
  const filters = listingFiltersFromDraft(draft);
  return Boolean(
    filters.q || filters.type || filters.make.length || filters.model.length || filters.body || filters.fuel ||
    filters.transmission || filters.version || filters.equipment.length || filters.condition ||
    filters.yearMin !== null || filters.yearMax !== null || filters.priceMin !== null ||
    filters.priceMax !== null || filters.mileageMax !== null
  );
};

export const formatListingNumber = (value: string | number, locale: Locale = 'en') =>
  localeFormatters(locale).number.format(Number(value));

export function listingOptionsWithCurrent(options: readonly string[], current: string | readonly string[]): readonly string[] {
  if (typeof current === 'string') return [...new Set([...options, ...listingSelections(current)])];
  const values = listingSelections([...options, ...current]);
  return options.includes('') ? ['', ...values] : values;
}

const listingRangeSummary = (minimum: string, maximum: string, suffix: string, locale: Locale) =>
  minimum || maximum ? `${minimum ? (suffix ? formatListingNumber(minimum, locale) : minimum) : '—'} – ${maximum ? (suffix ? formatListingNumber(maximum, locale) : maximum) : '—'}${suffix}` : message(locale, 'inventory.range.unlimited');

export function listingFacetOptions(field: ListingFacetField, make: string | readonly string[] = []): readonly string[] {
  switch (field) {
    case 'sort': return listingFilterOptions.sorts.map(([value]) => value === 'default' ? '' : value);
    case 'type': return listingFilterOptions.types;
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
  if (field === 'type') {
    const type = vehicleTypes.find(type => type === option);
    return message(locale, type ? `inventory.type.${type}` : 'inventory.type.all');
  }
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
    case 'type': return listingFacetOptionLabel('type', draft.type, locale);
    case 'make': return draft.make.join(', ') || templateText(locale, 'All brands');
    case 'model': return draft.model.join(', ') || templateText(locale, 'All модели');
    case 'body': return specificationLabel(bodyLabel(draft.body), locale) || templateText(locale, 'All купета');
    case 'price': return listingRangeSummary(draft.priceMin, draft.priceMax, ' ' + currencySymbol(locale), locale);
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

export function preservedListingFacetEntries(params: URLSearchParams, field: ListingFacetField, selected: string | readonly string[]): [string, string][] {
  const range = field === 'price' || field === 'year';
  const models = field === 'make' ? listingModelsAfterMakeChange(params.getAll('make'), listingSelections(selected), params.getAll('model')) : undefined;
  return [...params.entries()].filter(([key, value]) => {
    if (range) return key !== `${field}_min` && key !== `${field}_max`;
    if (key === 'model' && models && !models.includes(value)) return false;
    return key !== field;
  });
}

export function listingAppliedFilterLabel(filters: ListingFilters, key: string, value: string, locale: Locale = 'en'): string {
  switch (key) {
    case 'type': return listingFacetOptionLabel('type', filters.type, locale);
    case 'body': return specificationLabel(bodyLabel(filters.body), locale);
    case 'condition': return message(locale, filters.condition === 'new' ? 'inventory.condition.new' : 'inventory.condition.used');
    case 'fuel': case 'transmission': case 'equipment': return specificationLabel(value, locale);
    case 'price_min': return formatTemplate(locale, 'From {p0} {inventoryCurrency}', { p0: formatListingNumber(filters.priceMin ?? 0, locale), inventoryCurrency: currencySymbol(locale) });
    case 'price_max': return formatTemplate(locale, 'To {p0} {inventoryCurrency}', { p0: formatListingNumber(filters.priceMax ?? 0, locale), inventoryCurrency: currencySymbol(locale) });
    case 'year_min': return message(locale, 'inventory.year.from', { p0: filters.yearMin ?? '' });
    case 'year_max': return message(locale, 'inventory.year.to', { p0: filters.yearMax ?? '' });
    case 'mileage_max': return formatTemplate(locale, 'To {p0} km', { p0: formatListingNumber(filters.mileageMax ?? 0, locale) });
    default: return value;
  }
}

export function normalizeListingMakeTransition(current: ListingFilters, next: ListingFilters): ListingFilters {
  const model = listingModelsAfterMakeChange(current.make, next.make, next.model);
  return model.length === next.model.length && model.every((value, index) => value === next.model[index]) ? next : { ...next, model };
}
