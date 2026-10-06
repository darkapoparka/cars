import { normalizeFilters, serializeFilters } from './search';
import type { Filters } from './types';

type ShowroomConfig = {
  name: string;
  logo: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  directionsUrl: string | null;
  mapEmbedUrl: string | null;
  socialLinks: readonly { label: string; href: string }[];
  contactPreview: boolean;
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
  mapEmbedUrl: null,
  socialLinks: [],
  contactPreview: true,
  hours: [],
};

// Example requested for the template preview; a configured dealer address takes precedence.
export const showroomPreviewLocation = {
  bg: 'Варна · ул. Райко Жинзифов 41',
  en: 'Varna · 41 Rayko Zhinzifov St.',
};

// Display-only example: never create a tel: link for this placeholder.
export const showroomPreviewPhone = '+359 000 000 000';

// Google Maps Share > Embed for the owner's existing example address.
// Personalization replaces this with a verified mapEmbedUrl and disables contactPreview.
const previewMapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.3074689030154!2d27.90437507615317!3d43.20303997112714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a4538cafcd1c7b%3A0xdb5a0d4da87b01d7!2sVarna%20CenterOdesos%2C%20ul.%20%22Rayko%20Zhinzifov%22%2041%2C%209000%20Varna!5e0!3m2!1sen!2sbg!4v1791261558768!5m2!1sen!2sbg';

export function showroomContactLocation(locale: 'bg' | 'en') {
  const preview =
    showroom.contactPreview &&
    !showroom.address &&
    !showroom.directionsUrl &&
    !showroom.mapEmbedUrl;
  return {
    address: preview ? showroomPreviewLocation[locale] : showroom.address,
    embedUrl: preview ? previewMapEmbedUrl : showroom.mapEmbedUrl,
    directionsUrl: preview
      ? 'https://www.google.com/maps/search/?api=1&query=43.20304%2C27.90695'
      : showroom.directionsUrl,
    preview,
  };
}

export const showroomPageContent = {
  services: { title: 'Services', description: 'Import, sell or look after your car.' },
  contact: { title: 'Contact', description: 'Ask about a car, a viewing or a service.' },
} as const;

export const showroomSorts = [
  ['standard', 'Recommended'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['newest', 'Newest year first'],
  ['mileage', 'Lowest mileage first'],
] as const;

export const showroomCategories = [
  {
    value: 'car',
    label: 'Cars',
    singular: 'car',
    plural: 'cars',
    icon: 'car',
    image: '/categories/car-realistic-20261003-v1.png',
  },
  {
    value: 'bike',
    label: 'Motorbikes',
    singular: 'motorbike',
    plural: 'motorbikes',
    icon: 'bike',
    image: '/categories/motorbike-realistic-20261003-v1.png',
  },
  {
    value: 'electric-bike',
    label: 'E-bikes',
    singular: 'e-bike',
    plural: 'e-bikes',
    icon: 'electric',
    image: '/categories/ebike-realistic-20261003-v1.png',
  },
  {
    value: 'motorhome',
    label: 'Motorhomes',
    singular: 'motorhome',
    plural: 'motorhomes',
    icon: 'motorhome',
    image: '/categories/motorhome-realistic-20261003-v1.png',
  },
  {
    value: 'truck',
    label: 'Trucks & more',
    singular: 'vehicle',
    plural: 'vehicles',
    icon: 'truck',
    image: '/categories/truck-realistic-20261003-v1.png',
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
