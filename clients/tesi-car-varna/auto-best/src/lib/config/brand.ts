export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  showroomCoordinates: { latitude: number; longitude: number } | null;
  addressLine: string;
  address: string;
  phone: string;
  phoneHref: `tel:${string}`;
  appointment: string;
  logo: `/${string}`;
  logoOnDark: `/${string}`;
  youtubeUrl: `https://${string}` | '';
  instagramUrl: `https://${string}` | '';
  facebookUrl: `https://${string}` | '';
};

const name = "Теси Кар";
const shortName = "Теси Кар";
const city = "Варна";
const addressLine = "бул. „Цар Освободител“, посока Аксаково, последен вляво";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0898 694 330",
  phoneHref: "tel:+359898694330",
  addressLine,
  address: "бул. „Цар Освободител“, посока Аксаково, последен вляво",
  appointment: "Понеделник–събота: 09:00–18:00 (по текущите обяви) • Неделя: позвънете; контактната страница не публикува часове",
  logo: "/dealer-brand/v2-95e36265aeab55aa/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-95e36265aeab55aa/logo-on-dark.webp"
} as const satisfies BrandConfig;
