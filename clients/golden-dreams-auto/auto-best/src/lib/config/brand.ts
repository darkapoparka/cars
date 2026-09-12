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

const name = 'GoldenDreams AUTO';
const shortName = 'GoldenDreams';
const city = 'Пловдив';
const addressLine = 'Пловдив · точен адрес при потвърждение';

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: '',
  instagramUrl: 'https://www.instagram.com/goldendreamsauto/',
  facebookUrl: 'https://www.facebook.com/people/GoldenDreams-AUTO/61592803643776/',
  phone: '0878 979 712',
  phoneHref: 'tel:+359878979712',
  addressLine,
  address: addressLine,
  appointment: 'Оглед след потвърждение по телефона',
  logo: '/dealer/brand/logo-light.svg'
} as const satisfies BrandConfig;
