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

const name = 'ХАСКОВО КАРС БГ';
const shortName = 'ХАСКОВО КАРС БГ';
const city = 'Хасково';
const addressLine = 'бул. Освобождение (Кърджалийско шосе), Индустриална зона Юг';
const sourceProfile = 'https://haskovocarsbg.mobile.bg/';

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: sourceProfile,
  instagramUrl: sourceProfile,
  facebookUrl: sourceProfile,
  phone: '0892 047 530',
  phoneHref: 'tel:+359892047530',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Потвърдете наличността и огледа по телефона',
  logo: '/assets/images/lead/haskovo-cars-bg-logo.webp'
} as const satisfies BrandConfig;
