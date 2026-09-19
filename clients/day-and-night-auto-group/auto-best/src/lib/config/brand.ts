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
  youtubeUrl: `https://${string}` | '';
  instagramUrl: `https://${string}`;
  facebookUrl: `https://${string}`;
};

const name = 'Day & Night Auto Group';
const shortName = 'Day & Night';
const city = 'София';
const addressLine = 'ул. „Атанас Манчев“ 18, Студентски град';

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: 'https://www.youtube.com/@kristiankirilov1355/videos',
  instagramUrl: 'https://www.instagram.com/dayandnight_autogroup/',
  facebookUrl: 'https://www.facebook.com/deninoshtautogroup/',
  phone: '0877 733 110',
  phoneHref: 'tel:+359877733110',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Посещения с предварително уговорен час',
  logo: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
