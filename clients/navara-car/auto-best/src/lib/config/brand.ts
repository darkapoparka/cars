import source from '$data/navara-data.json';

export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  addressLine: string;
  address: string;
  phone: string;
  phoneHref: `tel:${string}`;
  appointment: string;
  logo: `/${string}`;
  youtubeUrl?: `https://${string}`;
  instagramUrl?: `https://${string}`;
  facebookUrl?: `https://${string}`;
};

const business = source.business;
export const brand: BrandConfig = {
  name: business.name,
  shortName: business.name,
  city: business.city,
  addressLine: business.addressLine,
  address: business.address,
  phone: business.phoneDisplay,
  phoneHref: `tel:${business.phoneE164}`,
  appointment: 'Работно време не е публикувано. Уточнете посещението по телефона.',
  logo: '/navara/wordmark.svg'
};

export const dealerSource = source;
export const dealerMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name}, ${business.address}`)}`;
export const dealerMapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${business.name}, ${business.address}`)}&z=14&hl=bg&output=embed`;
