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
  youtubeUrl: string;
  instagramUrl: string;
  facebookUrl: string;
};

const name = 'FRESH MOTORS';
const shortName = 'FRESH MOTORS';
const city = 'Шереметя';
const addressLine = 'с. Шереметя';

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: '',
  instagramUrl: '',
  facebookUrl: '',
  phone: '0879 975 969',
  phoneHref: 'tel:+359879975969',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Посещения с предварителна уговорка',
  logo: '/dealer/brand/logo-light.png'
} as const satisfies BrandConfig;
