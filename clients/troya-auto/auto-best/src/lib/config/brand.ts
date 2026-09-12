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
  youtubeUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
};

const name = 'TROYA AUTO';
const shortName = 'Troya Auto';
const city = 'София';
const addressLine = 'в.з. Врана – Лозен, ул. „Стар Лозенски път“ 45';

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: null,
  instagramUrl: null,
  facebookUrl: null,
  phone: '0886 067 006',
  phoneHref: 'tel:+359886067006',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Пон–Пет 09:30–18:00 · Съб 10:00–17:00 · Неделя почивен ден; оглед извън работно време с уговорка',
  logo: '/brand/logo.svg'
} as const satisfies BrandConfig;
