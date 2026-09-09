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
  youtubeUrl: `https://${string}`;
  instagramUrl: `https://${string}`;
  facebookUrl: `https://${string}`;
};

const name = 'Al Basma Motors';
const shortName = 'Al Basma';
const city = 'Sharjah';
const addressLine = 'Showroom 61, Souq Al Haraj';

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: 'https://albasmamotors.com/',
  instagramUrl: 'https://www.instagram.com/albasmamotors',
  facebookUrl: 'https://www.facebook.com/albasmamotors',
  phone: '+971 54 342 2222',
  phoneHref: 'tel:+971543422222',
  addressLine,
  address: `${addressLine}, ${city}, UAE`,
  appointment: 'Contact the showroom before travelling',
  logo: '/dealer/brand/logo-on-light.png'
} as const satisfies BrandConfig;
