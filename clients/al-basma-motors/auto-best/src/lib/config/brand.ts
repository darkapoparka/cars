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

const name = "Al Basma Motors";
const shortName = "Al Basma";
const city = "Sharjah";
const addressLine = "Showroom 61, Souq Al Haraj";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/albasmamotors",
  facebookUrl: "https://www.facebook.com/albasmamotors",
  phone: "+971 54 342 2222",
  phoneHref: "tel:+971543422222",
  addressLine,
  address: "Showroom 61, Souq Al Haraj, Sharjah, UAE",
  appointment: "Contact the showroom before travelling",
  logo: "/assets/brand/logo-on-light.webp",
  logoOnDark: "/assets/brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
