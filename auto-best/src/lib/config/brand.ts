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

const name = "The Dealers Point";
const shortName = "Dealers Point";
const city = "Dubai";
const addressLine = "Plot No. 364-0442, Al Quoz Industrial Area 1";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "+971 55 187 5094",
  phoneHref: "tel:+971551875094",
  addressLine,
  address: "Plot No. 364-0442, Al Quoz Industrial Area 1, Dubai, UAE",
  appointment: "Contact the dealership before visiting.",
  logo: '/assets/brand/logo-on-light.webp',
  logoOnDark: '/assets/brand/logo-on-dark.webp'
} as const satisfies BrandConfig;
