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

const name = "Champion Auto Pro";
const shortName = "Champion Auto Pro";
const city = "Варна";
const addressLine = "бул. „Цар Освободител“ 302 / Автомивка Izgi Europe Motor";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0885 072 555",
  phoneHref: "tel:+359885072555",
  addressLine,
  address: "бул. „Цар Освободител“ 302 / Автомивка Izgi Europe Motor",
  appointment: "Понеделник – петък: 09:30–18:00; Събота: 10:00–15:00; Неделя: почивен ден",
  logo: "/assets/brand/logo-on-light.webp",
  logoOnDark: "/assets/brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
