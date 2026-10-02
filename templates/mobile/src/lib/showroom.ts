import { normalizeFilters, serializeFilters } from './search';
import type { Filters } from './types';

type ShowroomConfig = {
  name: string;
  logo: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  directionsUrl: string | null;
  hours: readonly string[];
};

// A neutral template placeholder. Add verified dealer details when personalizing.
export const showroom: ShowroomConfig = {
  name: 'Your showroom',
  logo: '/branding/showroom-placeholder-20261002.png',
  phone: null,
  email: null,
  address: null,
  directionsUrl: null,
  hours: [],
};

export const showroomSorts = [
  ['standard', 'Recommended'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['newest', 'Newest year first'],
  ['mileage', 'Lowest mileage first'],
] as const;

export const showroomCategories = [
  { value: 'car', label: 'Cars', singular: 'car', plural: 'cars', icon: 'car' },
  { value: 'bike', label: 'Motorbikes', singular: 'motorbike', plural: 'motorbikes', icon: 'bike' },
  {
    value: 'electric-bike',
    label: 'E-bikes',
    singular: 'e-bike',
    plural: 'e-bikes',
    icon: 'electric',
  },
  {
    value: 'motorhome',
    label: 'Motorhomes',
    singular: 'motorhome',
    plural: 'motorhomes',
    icon: 'motorhome',
  },
  {
    value: 'truck',
    label: 'Trucks & more',
    singular: 'vehicle',
    plural: 'vehicles',
    icon: 'truck',
  },
] as const;

export function showroomCategory(category: Filters['category']) {
  return showroomCategories.find(({ value }) => value === category) || showroomCategories[0];
}

export function showroomFilters(filters: Filters): Filters {
  return normalizeFilters({
    ...filters,
    payment: 'buy',
    seller: 'Any',
    location: '',
    country: '',
    minLease: '',
    maxLease: '',
  });
}

export function showroomInventoryHref(filters: Filters, sort = 'standard'): string {
  const params = new URLSearchParams(serializeFilters(showroomFilters(filters)));
  if (sort !== 'standard' && showroomSorts.some(([value]) => value === sort))
    params.set('sort', sort);
  return params.size ? '/?' + params.toString() : '/';
}

type InventoryContext = { href: string; scrollY: number; vehicleId: string; vehicleIds?: string[] };
const contextKey = 'cars-mobile-inventory-context';
const restoreKey = 'cars-mobile-restore-inventory';

export function rememberInventory(vehicleId: string): void {
  try {
    const href = window.location.pathname + window.location.search;
    const previous = inventoryContext();
    const fromInventory =
      window.location.pathname === '/' || window.location.pathname === '/car-park';
    if (!fromInventory && !previous) return;
    sessionStorage.setItem(
      contextKey,
      JSON.stringify({
        href: fromInventory ? href : previous?.href,
        scrollY: fromInventory ? window.scrollY : previous?.scrollY,
        vehicleId,
        vehicleIds: fromInventory
          ? [vehicleId]
          : [...new Set([previous?.vehicleId || '', ...(previous?.vehicleIds || []), vehicleId])]
              .filter(Boolean)
              .slice(-50),
      }),
    );
  } catch {
    // Browsing remains usable when session storage is unavailable.
  }
}

function inventoryContext(): InventoryContext | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(contextKey) || 'null');
    if (
      value &&
      typeof value.href === 'string' &&
      (value.href === '/' || value.href.startsWith('/?') || value.href === '/car-park') &&
      typeof value.vehicleId === 'string' &&
      (value.vehicleIds === undefined ||
        (Array.isArray(value.vehicleIds) &&
          value.vehicleIds.every((id: unknown) => typeof id === 'string'))) &&
      Number.isFinite(value.scrollY) &&
      value.scrollY >= 0
    )
      return value;
  } catch {
    // A missing or corrupt browsing record falls back to Cars.
  }
  return null;
}

export function inventoryReturnHref(vehicleId: string): string {
  const context = inventoryContext();
  if (!context || (context.vehicleId !== vehicleId && !context.vehicleIds?.includes(vehicleId)))
    return '/';
  try {
    sessionStorage.setItem(restoreKey, context.href);
  } catch {
    // URL-based filters still restore without a stored scroll position.
  }
  return context.href;
}

export function inventoryCanGoBack(vehicleId: string): boolean {
  const context = inventoryContext();
  return Boolean(
    context &&
    (context.vehicleId === vehicleId || context.vehicleIds?.includes(vehicleId)) &&
    window.history.length > 1,
  );
}

export function restoreInventoryPosition(): () => void {
  const context = inventoryContext();
  let frame = 0;
  try {
    const href = window.location.pathname + window.location.search;
    if (context && context.href === href && sessionStorage.getItem(restoreKey) === href) {
      sessionStorage.removeItem(restoreKey);
      frame = requestAnimationFrame(() => window.scrollTo(0, context.scrollY));
    }
  } catch {
    // Native browser Back also restores scroll without this optional record.
  }
  return () => cancelAnimationFrame(frame);
}
