export type BrandConfig = {
  name: string; shortName: string; city: string; addressLine: string; address: string;
  phone: string; phoneHref: `tel:${string}`; appointment: string; logo: `/${string}`;
  youtubeUrl: string | null; instagramUrl: string | null; facebookUrl: string | null;
};
const name = 'ФАДИ КАРС';
const shortName = 'Фади Карс';
const city = 'София';
const addressLine = 'Суходол, ул. „Околовръстен път Суходол“ 899';
export const brand = {
  name, shortName, city,
  youtubeUrl: null, instagramUrl: null, facebookUrl: null,
  phone: '0897 985 999', phoneHref: 'tel:+359897985999',
  addressLine, address: `${addressLine}, ${city}`,
  appointment: 'Работно време не е публикувано; потвърдете посещението по телефона',
  logo: '/brand/logo.svg'
} as const satisfies BrandConfig;
