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

const name = "Ауто-бора";
const shortName = "Ауто-бора";
const city = "Варна";
const addressLine = "бул. Цар Освободител";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0897447696",
  phoneHref: "tel:+359897447696",
  addressLine,
  address: "бул. Цар Освободител, Варна, България",
  appointment: "Понеделник 09:00 - 17:00 ч. Вторник 09:00 - 17:00 ч. Сряда 09:00 - 17:00 ч. Четвъртък 09:00 - 17:00 ч. Петък 09:00 - 17:00 ч. Събота 09:30 - 15:00 ч. Неделя Почивен ден",
  logo: "/dealer-brand/v2-8b6fe1b03fb10f7c/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-8b6fe1b03fb10f7c/logo-on-dark.webp"
} as const satisfies BrandConfig;
