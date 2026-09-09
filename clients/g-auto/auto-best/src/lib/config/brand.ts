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

const name = 'G Auto';
const shortName = 'G Auto';
const city = 'Благоевград';
const addressLine = 'Струмско';

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: '',
  instagramUrl: '',
  facebookUrl: '',
  phone: '0896 645 757',
  phoneHref: 'tel:+359896645757',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Посещения с предварителна уговорка',
  logo: '/dealer/brand/logo-light.png'
} as const satisfies BrandConfig;
