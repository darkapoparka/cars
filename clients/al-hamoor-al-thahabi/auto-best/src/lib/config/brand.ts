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
  youtubeUrl: `https://${string}`;
  instagramUrl: `https://${string}`;
  facebookUrl: `https://${string}`;
};

const name = 'Al Hamoor Al Thahabi Used Cars';
const shortName = 'Al Hamoor Al Thahabi';
const city = 'Sharjah';
const addressLine = 'Souk Al Haraj, showroom 353';
const profile = 'https://www.dubicars.com/dealers/sharjah-al-hamoor-al-thahabi-used-cars-1414' as const;

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: profile,
  instagramUrl: profile,
  facebookUrl: profile,
  phone: '+971 54 555 5204',
  phoneHref: 'tel:+971545555204',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Confirm the selected vehicle location and viewing time before travelling',
  logo: '/dealer/logo.svg'
} as const satisfies BrandConfig;
