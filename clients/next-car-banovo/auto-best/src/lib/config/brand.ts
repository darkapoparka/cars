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
  youtubeUrl: string;
  instagramUrl: string;
  facebookUrl: string;
};


export const brand = {
 name: 'NEXT CAR', shortName: 'NEXT CAR', city: 'Баново, обл. Варна', addressLine: 'ул. 1-ва, с. Баново',
 address: 'ул. 1-ва, с. Баново, обл. Варна', phone: '0898 770 707', phoneHref: 'tel:+359898770707',
 appointment: 'Оглед с предварителна уговорка. Пон.–пет. 09:00–18:00; съб.–нед. 10:00–14:00.',
 logo: '/brand/logo.png', youtubeUrl: '', instagramUrl: '', facebookUrl: ''
} as const satisfies BrandConfig;
