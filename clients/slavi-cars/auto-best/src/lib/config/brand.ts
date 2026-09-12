export type BrandConfig = {
  name: string;
  email?: string;
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

const name = 'Slavi Cars';
const shortName = 'Slavi Cars';
const city = 'Дупница';
const addressLine = 'път E79, след отбивката за Блатино';

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: '',
  instagramUrl: '',
  facebookUrl: '',
  email: 'slavicars@abv.bg',
  phone: '0895 714 484',
  phoneHref: 'tel:+359895714484',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Посещения с предварителна уговорка',
  logo: '/dealer/brand/logo-light.png'
} as const satisfies BrandConfig;
