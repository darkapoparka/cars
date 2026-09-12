import { dealerFacts } from '$data/dealer';
export type BrandConfig = {
  name: string; shortName: string; city: string; addressLine: string; address: string;
  phone: string; phoneHref: `tel:${string}`; appointment: string; logo: `/${string}`;
  logoDark: `/${string}`; mapsUrl: string; mapsEmbedUrl: string; currency: string;
  locale: string; distanceUnit: string; previewNotice: string; locationNote: string;
  youtubeUrl: string | null; instagramUrl: string | null; facebookUrl: string | null;
};
export const brand: BrandConfig = {
  name: dealerFacts.name, shortName: dealerFacts.shortName, city: dealerFacts.city,
  addressLine: dealerFacts.address, address: dealerFacts.address,
  phone: dealerFacts.phoneDisplay, phoneHref: dealerFacts.phoneHref as `tel:${string}`,
  appointment: dealerFacts.hours, logo: '/dealer/logo-light.png', logoDark: '/dealer/logo-dark.png',
  youtubeUrl: null, instagramUrl: null, facebookUrl: null,
  mapsUrl: dealerFacts.mapsUrl, mapsEmbedUrl: dealerFacts.mapsEmbedUrl,
  currency: dealerFacts.currency, locale: dealerFacts.locale, distanceUnit: dealerFacts.distanceUnit,
  previewNotice: dealerFacts.previewNotice, locationNote: dealerFacts.locationNote
};
