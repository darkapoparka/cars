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
  logoLight: `/${string}`;
  logoDark: `/${string}`;
  sourceUrl: `https://${string}`;
  youtubeUrl: `https://${string}` | null;
  instagramUrl: `https://${string}` | null;
  facebookUrl: `https://${string}` | null;
};

export const brand = {
  name: 'FIVE AUTO',
  shortName: 'FIVE AUTO',
  city: 'Бургас',
  addressLine: 'ул. „Сребърна“ 6, Промишлена зона Север',
  address: 'ул. „Сребърна“ 6, Промишлена зона Север, Бургас',
  phone: '0887 555 255',
  phoneHref: 'tel:+359887555255',
  appointment: 'Понеделник–петък 08:30–17:00; събота и неделя — почивни дни.',
  logo: '/brand/logo.png',
  logoLight: '/brand/logo.png',
  logoDark: '/brand/logo.png',
  youtubeUrl: null,
  instagramUrl: null,
  facebookUrl: null,
  sourceUrl: 'https://fiveauto.mobile.bg/'
} as const satisfies BrandConfig;
