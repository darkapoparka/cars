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
  logoOnDark: `/${string}`;
  youtubeUrl: `https://${string}`;
  instagramUrl: `https://${string}`;
  facebookUrl: `https://${string}`;
};

const city = 'Варна';
const addressLine = 'Бизнес парк Варна, сграда B6';

export const brand = {
  name: 'IS AUTO Varna',
  shortName: 'IS AUTO',
  city,
  youtubeUrl: 'https://www.isauto.net/',
  instagramUrl: 'https://www.instagram.com/is__auto/?hl=bg',
  facebookUrl: 'https://www.facebook.com/isauto1',
  phone: '0899 266 666',
  phoneHref: 'tel:+359899266666',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Понеделник–петък 09:00–18:00 · събота 10:00–16:00',
  logo: '/dealer/logo-dark.png',
  logoOnDark: '/dealer/logo-light.png'
} as const satisfies BrandConfig;
