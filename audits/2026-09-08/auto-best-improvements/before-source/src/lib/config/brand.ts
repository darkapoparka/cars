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
  phone: '087 982 4625',
  phoneHref: 'tel:+359879824625',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Посещения с предварителна уговорка',
  logo: '/assets/images/lead/day-night-logo.png'
} as const;
