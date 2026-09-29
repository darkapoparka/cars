export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  showroomCoordinates: { latitude: number; longitude: number };
  addressLine: string;
  address: string;
  phone: string;
  phoneHref: `tel:${string}`;
  appointment: string;
  logo: `/${string}`;
  logoOnDark: `/${string}`;
  youtubeUrl: `https://${string}` | '';
  instagramUrl: `https://${string}` | '';
  facebookUrl: `https://${string}` | '';
};

const name = 'Auto Best';
const shortName = 'Auto Best';
const city = 'София';
const addressLine = 'ул. „Атанас Манчев“ 18, Студентски град';

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: { latitude: 42.648551, longitude: 23.341905 },
  youtubeUrl: '',
  instagramUrl: '',
  facebookUrl: '',
  phone: '087 982 4625',
  phoneHref: 'tel:+359879824625',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Посещения с предварителна уговорка',
  logo: '/assets/images/template/auto-best-logo-v2.svg',
  logoOnDark: '/assets/images/template/auto-best-logo-v2-light.svg'
} as const satisfies BrandConfig;
