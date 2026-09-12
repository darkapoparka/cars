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

const name = 'КЪНЧЕВ';
const shortName = 'КЪНЧЕВ';
const city = 'Плевен';
const addressLine = 'Индустриална зона, срещу КАТ Плевен';
const sourceProfile = 'https://kunchev-auto.mobile.bg/';

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: sourceProfile,
  instagramUrl: sourceProfile,
  facebookUrl: sourceProfile,
  phone: '0878 932 725',
  phoneHref: 'tel:+359878932725',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Свържете се предварително за оглед',
  logo: '/assets/images/lead/kunchev-logo.png'
} as const satisfies BrandConfig;
