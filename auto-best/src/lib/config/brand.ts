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

const name = "Texas Drive Auto";
const shortName = "Texas Drive Auto";
const city = "Dallas";
const addressLine = "10511 Olympic Drive, Dallas, TX 75220";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "(214) 972-3233",
  phoneHref: "tel:+12149723233",
  addressLine,
  address: "10511 Olympic Drive, Dallas, TX 75220",
  appointment: "Monday–Saturday 10 AM–6 PM; Sunday closed",
  logo: '/assets/brand/logo-on-light.webp',
  logoOnDark: '/assets/brand/logo-on-dark.webp'
} as const satisfies BrandConfig;
