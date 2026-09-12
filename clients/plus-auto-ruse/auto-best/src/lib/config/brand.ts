import dealer from '$data/dealer-records.json';
export const brand = {
 name: dealer.name, shortName: dealer.shortName, city: dealer.city,
 addressLine: dealer.address, address: dealer.address, phone: dealer.phone,
 phoneHref: dealer.phoneHref as `tel:${string}`, appointment: dealer.hours,
 logo: '/dealer/logo-light.png' as const, sourceInventory: dealer.sourceUrl,
 youtubeUrl: '', instagramUrl: '', facebookUrl: '',
 mapQuery: dealer.mapQuery, addressNote: dealer.addressNote
} as const;
export type BrandConfig = typeof brand;
