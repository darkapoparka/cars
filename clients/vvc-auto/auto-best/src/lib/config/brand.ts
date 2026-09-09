export type BrandConfig = {
  name: string; shortName: string; city: string; addressLine: string; address: string;
  phone: string; phoneHref: `tel:${string}`; appointment: string; logo: `/${string}`;
  youtubeUrl: string | null; instagramUrl: string | null; facebookUrl: string | null;
};
const name = 'В.В.Ц – АУТО';
const shortName = 'В.В.Ц – АУТО';
const city = 'София';
const addressLine = 'Орландовци, ул. „Железопътна“ 24Б';
export const brand = {
  name, shortName, city,
  youtubeUrl: null, instagramUrl: null, facebookUrl: null,
  phone: '0888 629 959', phoneHref: 'tel:+359888629959',
  addressLine, address: `${addressLine}, ${city}`,
  appointment: 'Работно време не е потвърдено; обадете се преди посещение',
  logo: '/brand/logo.svg'
} as const satisfies BrandConfig;
