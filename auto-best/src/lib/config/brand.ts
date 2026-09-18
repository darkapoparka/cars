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
  logoOnDark: `/${string}`;
  youtubeUrl: `https://${string}`;
  instagramUrl: `https://${string}`;
  facebookUrl: `https://${string}`;
};

const name = "АСКО 96";
const shortName = "АСКО 96";
const city = "София";
const addressLine = "бул. „Ботевградско шосе“ 300";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/@asko96bulgaria",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/p/Asko96-100050328800477/",
  phone: "0899 76 96 96",
  phoneHref: "tel:+359899769696",
  addressLine,
  address: "бул. „Ботевградско шосе“ 300",
  appointment: "Понеделник – петък: 09:00–18:30; Събота: 10:00–16:00; Неделя: почивен ден",
  logo: '/assets/brand/logo-on-light.webp',
  logoOnDark: '/assets/brand/logo-on-dark.webp'
} as const satisfies BrandConfig;
