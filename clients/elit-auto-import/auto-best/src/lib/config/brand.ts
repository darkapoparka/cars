const name = 'ELIT AUTO IMPORT EXPORT';
const shortName = 'ELIT AUTO';
const city = 'Варна';
const addressLine = 'ул. „Прилеп“ 74А, м-т Пчелина';

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: '',
  instagramUrl: '',
  facebookUrl: '',
  phone: '0887 777 887',
  phoneHref: 'tel:+359887777887',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Посещения с предварителна уговорка',
  logo: '/assets/elit/logo.png'
} as const;
