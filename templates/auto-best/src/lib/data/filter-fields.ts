import { parseListingFilters, type ListingFilters } from './listing';

export type ListingDraft = Partial<{ [K in keyof ListingFilters]: ListingFilters[K] extends number | null ? string | number | null : ListingFilters[K] }>;

/** Draft counts and submitted URLs use exactly the same parsing boundary. */
export function filtersFromDraft(draft: ListingDraft): ListingFilters {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(draft)) {
    const name = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    if (Array.isArray(value)) value.forEach(item => params.append(name, item));
    else if (value !== null && value !== undefined && value !== '' && value !== false) params.set(name, value === true ? '1' : String(value));
  }
  return parseListingFilters(params);
}

export const invalidRange = (minimum: string, maximum: string) =>
  minimum !== '' && maximum !== '' && Number.isFinite(Number(minimum)) && Number.isFinite(Number(maximum)) && Number(minimum) > Number(maximum);
