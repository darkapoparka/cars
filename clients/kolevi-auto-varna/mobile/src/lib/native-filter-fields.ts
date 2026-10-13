import definitions from './native-data/filter-definitions.json';
import { nativeCategoryKey } from './native-taxonomy';
import { defaultFilters, type Filters } from './types';
import { nativeFilterOptions } from './native-filter-options';
export type FilterField = {
  id: string;
  nativeId?: string;
  label: string;
  kind?: 'toggle' | 'range' | 'text' | 'single' | 'location' | 'make';
  options?: string[];
  optionValues?: string[];
  unit?: string;
  max?: number;
  includeAny?: boolean;
  rangeChoices?: string[];
  powerKwChoices?: string[];
  constraint?: string;
};
export type NativeFilterSection = { title: string; constraint?: string; fields: FilterField[] };
const resources = definitions as unknown as Record<string, NativeFilterSection[]>;
function shown(constraint: string | undefined, filters: Filters): boolean {
  const isNew = filters.condition.length === 1 && filters.condition[0] === 'New';
  switch (constraint) {
    case 'LEASING':
      return filters.payment === 'lease';
    case 'PRICE':
      return filters.payment === 'buy';
    case 'ELECTRIC':
      return filters.fuel.includes('Electric');
    case 'AVAILABILITY':
      return isNew;
    case 'FIRST_REGISTRATION':
    case 'MILEAGE':
    case 'HISTORY':
      return !isNew;
    default:
      return true;
  }
}
export function getFilterSections(filters: Filters): NativeFilterSection[] {
  return resources[nativeCategoryKey(filters)]
    .filter((group) => shown(group.constraint, filters))
    .map((group) => ({
      ...group,
      fields: group.fields
        .filter(
          (field) =>
            !(filters.category === 'car' && field.kind === 'make') &&
            shown(field.constraint, filters),
        )
        .map((field) => {
          const captured = filters.category === 'car' ? nativeFilterOptions[field.id] : undefined;
          const options =
            captured && field.options
              ? [
                  ...captured.options.filter((value) => field.options!.includes(value)),
                  ...field.options.filter((value) => !captured.options.includes(value)),
                ]
              : field.options;
          return {
            ...field,
            options,
            includeAny: field.id === 'payment' ? false : field.includeAny,
            unit: field.id === 'gears' ? undefined : field.unit,
          };
        }),
    }));
}
export const filterSections = getFilterSections(defaultFilters);
