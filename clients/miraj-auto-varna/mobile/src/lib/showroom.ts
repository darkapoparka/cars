import { normalizeFilters, serializeFilters } from './search';
import type { Filters } from './types';
import { showroom } from './showroom-config';
export { showroom } from './showroom-config';

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
    image: '/categories/car-realistic-20261003-v1.webp',
  },
  {
    value: 'bike',
    label: 'Motorbikes',
    singular: 'motorbike',
    plural: 'motorbikes',
    icon: 'bike',
    image: '/categories/motorbike-realistic-20261003-v1.webp',
  },
  {
    value: 'electric-bike',
    label: 'E-bikes',
    singular: 'e-bike',
    plural: 'e-bikes',
    icon: 'electric',
    image: '/categories/ebike-realistic-20261003-v1.webp',
  },
  {
    value: 'motorhome',
    label: 'Motorhomes',
    singular: 'motorhome',
    plural: 'motorhomes',
    icon: 'motorhome',
    image: '/categories/motorhome-realistic-20261003-v1.webp',
  },
  {
    value: 'truck',
    label: 'Trucks & more',
    singular: 'vehicle',
    plural: 'vehicles',
    icon: 'truck',
    image: '/categories/truck-realistic-20261003-v1.webp',
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
