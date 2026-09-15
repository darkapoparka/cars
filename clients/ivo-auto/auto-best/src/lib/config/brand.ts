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

const name = "Иво Ауто";
const shortName = "Иво Ауто";
const city = "Варна";
const addressLine = "бул. „Цар Освободител“ 256";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0878 720 035",
  phoneHref: "tel:+359878720035",
  addressLine,
  address: "бул. „Цар Освободител“ 256",
  appointment: "Свържете се за работно време и оглед.",
  logo: "/assets/ivo-auto/wordmark.svg",
  logoOnDark: "/assets/ivo-auto/wordmark-light.svg"
} as const satisfies BrandConfig;
