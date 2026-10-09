import {emptyFilters, restoreFilters, type Filters} from './inventory-filters';
import { filterMakes} from './inventory-options';

export type InventoryState = {query: string; filters: Filters; sort: string; emiMax?: number};
export {inventorySorts} from './inventory-sort';
import {isInventorySort} from './inventory-sort';
type Search = Pick<URLSearchParams, 'get' | 'getAll'>;
const ownedParameters = ['q', 'brand', 'body', 'maxPrice', 'emiMax', 'selection', 'order'];

function number(value: string | null) {
  if (!value?.trim()) return undefined;
  return Number.isFinite(Number(value)) ? Number(value) : undefined;
}

/** The URL is the portable form of a collection's selections; history also retains them for Back. */
export function readInventorySearch(params: Search): InventoryState {
  let filters = emptyFilters();
  const selection = params.get('selection');
  if (selection && selection.length <= 6000) {
    try {filters = restoreFilters(JSON.parse(selection));} catch { /* Ignore malformed optional refinements. */ }
  }
  const values = (key: string) => [...new Set(params.getAll(key).map(value => value.trim()).filter(value => value && value.length < 100))].slice(0, 100);
  const brands = values('brand');
  if (brands.length) filters.brands = [...new Set(brands.map(brand => filterMakes.find(make => make.toLowerCase() === brand.toLowerCase()) ?? brand))];
  const bodies = values('body');
  if (bodies.length) filters.bodies = bodies.map(body => body.toUpperCase());
  const maximum = number(params.get('maxPrice'));
  if (maximum !== undefined) filters.maximum = Math.max(filters.minimum, Math.min(emptyFilters().maximum, maximum));
  const monthly = number(params.get('emiMax'));
  const sort = params.get('order') ?? 'default';
  return {query: (params.get('q') ?? '').slice(0, 200), filters, sort: isInventorySort(sort) ? sort : 'default', emiMax: monthly === undefined ? undefined : Math.max(0, monthly)};
}

export function inventorySearch(search: string, state: InventoryState) {
  const params = new URLSearchParams(search);
  for (const key of ownedParameters) params.delete(key);
  if (state.query.trim()) params.set('q', state.query);
  for (const brand of state.filters.brands) params.append('brand', brand);
  for (const body of state.filters.bodies) params.append('body', body);
  const defaults = emptyFilters();
  if (state.filters.maximum !== defaults.maximum) params.set('maxPrice', String(state.filters.maximum));
  if (state.emiMax !== undefined && Number.isFinite(state.emiMax)) params.set('emiMax', String(Math.max(0, state.emiMax)));
  if (isInventorySort(state.sort) && state.sort !== 'default') params.set('order', state.sort);
  const refinements: Record<string, unknown> = {};
  for (const key of Object.keys(defaults) as (keyof Filters)[]) {
    if (['brands', 'bodies', 'maximum'].includes(key)) continue;
    const value = key === 'extra' ? Object.fromEntries(Object.entries(state.filters.extra).filter(([, choices]) => choices.length)) : state.filters[key];
    if (JSON.stringify(value) !== JSON.stringify(defaults[key])) refinements[key] = value;
  }
  if (Object.keys(refinements).length) params.set('selection', JSON.stringify(refinements));
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export function restoreInventoryState(value: unknown, entry: string): InventoryState | null {
  if (!value || typeof value !== 'object') return null;
  const stored = value as Record<string, unknown>;
  if (stored.version !== 1 || stored.entry !== entry) return null;
  return {query: typeof stored.query === 'string' ? stored.query.slice(0, 200) : '', filters: restoreFilters(stored.filters), sort: typeof stored.sort === 'string' && isInventorySort(stored.sort) ? stored.sort : 'default', emiMax: typeof stored.emiMax === 'number' && Number.isFinite(stored.emiMax) ? Math.max(0, stored.emiMax) : undefined};
}
