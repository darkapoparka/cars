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

const name = "Promosale Varna";
const shortName = "Promosale Varna";
const city = "Варна";
const addressLine = "Морска гара Варна";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0892 020 208",
  phoneHref: "tel:+359892020208",
  addressLine,
  address: "Морска гара Варна, Варна, България",
  appointment: "Пон.–пет. 09:30–18:30; съб. 10:00–14:00; нед. почивен ден",
  logo: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
