import { defaultFilters, type Filters } from './types';
const numericKeys = new Set([
  'minPrice',
  'maxPrice',
  'minYear',
  'maxYear',
  'maxMileage',
  'minPower',
  'maxPower',
  'minMileage',
  'minLease',
  'maxLease',
  'seats',
  'maxSeats',
  'radius',
]);
/** Validate URL and browser-storage values before they reach rendering or filtering. */
export function normalizeFilters(input: unknown): Filters {
  const result = structuredClone(defaultFilters);
  if (!input || typeof input !== 'object' || Array.isArray(input)) return result;
  const record = input as Record<string, unknown>;
  for (const key of Object.keys(defaultFilters) as (keyof Filters)[]) {
    const value = record[key];
    const fallback = defaultFilters[key];
    if (Array.isArray(fallback)) {
      if (Array.isArray(value))
        Object.assign(result, {
          [key]: [
            ...new Set(
              value
                .filter((item): item is string => typeof item === 'string')
                .map((item) => item.trim().slice(0, 100))
                .filter(Boolean),
            ),
          ].slice(0, 100),
        });
    } else if (key === 'modelVariants' || key === 'excludedModelVariants') {
      Object.assign(result, { [key]: normalizeModelVariantMap(value) });
    } else if (typeof fallback === 'object') {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const listMap = key === 'makeModels' || key === 'excludedModels';
        const entries = Object.entries(value as Record<string, unknown>)
          .filter(
            ([name]) => name.trim() && !['__proto__', 'constructor', 'prototype'].includes(name),
          )
          .slice(0, 100);
        Object.assign(result, {
          [key]: Object.fromEntries(
            entries.flatMap<[string, string | string[]]>(([name, choice]) => {
              if (listMap && Array.isArray(choice))
                return [
                  [
                    name.slice(0, 100),
                    [
                      ...new Set(
                        choice
                          .filter((item): item is string => typeof item === 'string')
                          .map((item) => item.trim().slice(0, 100))
                          .filter(Boolean),
                      ),
                    ].slice(0, 100),
                  ],
                ];
              if (!listMap && typeof choice === 'string')
                return [[name.slice(0, 100), choice.trim().slice(0, 200)]];
              return [];
            }),
          ),
        });
      }
    } else if (typeof fallback === 'boolean') {
      if (typeof value === 'boolean') Object.assign(result, { [key]: value });
    } else if (typeof value === 'string') {
      const text = value.trim().slice(0, 200);
      if (
        numericKeys.has(key) &&
        text &&
        (!/^\d+(\.\d+)?$/.test(text) || !Number.isFinite(Number(text)) || Number(text) > 100000000)
      )
        continue;
      Object.assign(result, { [key]: text });
    }
  }
  if (!['car', 'bike', 'electric-bike', 'motorhome', 'truck'].includes(result.category))
    result.category = 'car';
  if (!['buy', 'lease'].includes(result.payment)) result.payment = 'buy';
  if (!['Any', 'Dealer', 'Private seller', 'Company vehicles'].includes(result.seller))
    result.seller = 'Any';
  if (!/^(?:[2-9]|2\/3|4\/5|6\/7)?$/.test(result.doors)) result.doors = '';
  return result;
}

/** Bounded, prototype-safe nested maps from persisted state or URL parameters. */
function normalizeModelVariantMap(value: unknown): Record<string, Record<string, string>> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const safe = (name: string) =>
    Boolean(name.trim()) && !['__proto__', 'prototype', 'constructor'].includes(name.trim());
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([make, models]) =>
          safe(make) && models && typeof models === 'object' && !Array.isArray(models),
      )
      .slice(0, 100)
      .map(([make, models]) => [
        make.trim().slice(0, 100),
        Object.fromEntries(
          Object.entries(models as Record<string, unknown>)
            .filter(([model, variant]) => safe(model) && typeof variant === 'string')
            .slice(0, 100)
            .map(([model, variant]) => [
              model.trim().slice(0, 100),
              (variant as string).trim().slice(0, 200),
            ]),
        ),
      ]),
  );
}
