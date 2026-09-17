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

const name = "AVANGARD AUTO";
const shortName = "AVANGARD AUTO";
const city = "Варна";
const addressLine = "бул. Цар Освободител 289";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/avangard_auto_varna/",
  facebookUrl: "https://www.facebook.com/avangardautovarna/",
  phone: "0877 800 921",
  phoneHref: "tel:+359877800921",
  addressLine,
  address: "бул. Цар Освободител 289",
  appointment: "Обадете се преди посещение",
  logo: "/assets/brand/logo-on-light.webp",
  logoOnDark: "/assets/brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
