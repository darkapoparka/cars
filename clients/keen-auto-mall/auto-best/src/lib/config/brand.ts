import { dealerFacts } from '$data/dealer';
export const brand = {
 name: dealerFacts.name, shortName: dealerFacts.shortName, city: dealerFacts.city,
 addressLine: dealerFacts.address, address: dealerFacts.address,
 phone: dealerFacts.phoneDisplay, phoneHref: dealerFacts.phoneHref as `tel:${string}`,
 appointment: dealerFacts.hours, logo: '/dealer/logo-light.png' as const,
 logoDark: '/dealer/logo-dark.png' as const, youtubeUrl: null,
 instagramUrl: null, facebookUrl: null, mapsUrl: dealerFacts.mapsUrl,
 mapsEmbedUrl: dealerFacts.mapsEmbedUrl, locale: dealerFacts.locale,
 currency: dealerFacts.currency, distanceUnit: dealerFacts.distanceUnit,
 previewNotice: dealerFacts.previewNotice, locationNote: dealerFacts.locationNote,
 priceNotice: 'priceNotice' in dealerFacts ? String(dealerFacts.priceNotice) : 'Confirm the advertised price and final terms directly with the dealership.'
} as const;
export type BrandConfig = typeof brand;
