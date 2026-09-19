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

const name = "Навара кар";
const shortName = "Navara Car";
const city = "Варна";
const addressLine = "бул. „Цар Освободител“, Кайсиева градина";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0899 192 300",
  phoneHref: "tel:+359899192300",
  addressLine,
  address: "бул. „Цар Освободител“, Кайсиева градина, Варна",
  appointment: "Посещения с предварителна уговорка.",
  logo: "/dealer-brand/logo-on-light-20260919.webp",
  logoOnDark: "/dealer-brand/logo-on-dark-20260919.webp"
} as const satisfies BrandConfig;
