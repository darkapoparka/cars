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

const name = "Аутомаркет Варна";
const shortName = "Аутомаркет";
const city = "Варна";
const addressLine = "бул. Цар Освободител — 300 м вдясно след Дом на Камиона, посока летището";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0886 424 400",
  phoneHref: "tel:+359886424400",
  addressLine,
  address: "бул. Цар Освободител — 300 м вдясно след Дом на Камиона, посока летището",
  appointment: "За работно време и оглед се обадете предварително.",
  logo: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
