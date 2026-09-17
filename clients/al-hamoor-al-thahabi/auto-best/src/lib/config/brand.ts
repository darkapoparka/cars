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

const name = "Al Hamoor Al Thahabi Used Cars";
const shortName = "Al Hamoor Al Thahabi";
const city = "Sharjah";
const addressLine = "Souk Al Haraj, showroom 353, Sharjah";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "+971 54 555 5204",
  phoneHref: "tel:+971545555204",
  addressLine,
  address: "Souk Al Haraj, showroom 353, Sharjah",
  appointment: "Please confirm opening hours and arrange your visit with the dealership.",
  logo: "/assets/brand/logo-on-light.webp",
  logoOnDark: "/assets/brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
