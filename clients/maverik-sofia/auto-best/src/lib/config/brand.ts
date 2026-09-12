export type BrandConfig = {
  name: string; shortName: string; city: string; addressLine: string; address: string;
  phone: string; phoneHref: `tel:${string}`; appointment: string; logo: `/${string}`;
  youtubeUrl: string | null; instagramUrl: string | null; facebookUrl: string | null;
};
const name = 'МАВЕРИК';
const shortName = 'Маверик';
const city = 'София';
const addressLine = 'Дружба 1, бул. „Искърско шосе“ 13';
export const brand = {
  name, shortName, city,
  youtubeUrl: null, instagramUrl: null, facebookUrl: null,
  phone: '0878 754 914', phoneHref: 'tel:+359878754914',
  addressLine, address: `${addressLine}, ${city}`,
  appointment: 'Работно време не е потвърдено; потвърдете огледа по телефона',
  logo: '/brand/logo.svg'
} as const satisfies BrandConfig;
