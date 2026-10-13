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

const name = "BIEMAAUТO";
const shortName = "BIEMAAUТO";
const city = "Варна";
const addressLine = "Бул.Цар Освободите 202 до изхода на КАТ";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0878258953",
  phoneHref: "tel:+359878258953",
  addressLine,
  address: "Бул.Цар Освободите 202 до изхода на КАТ, Варна, България",
  appointment: "Понеделник 09:00 - 19:00 ч. Вторник 09:00 - 19:00 ч. Сряда 09:00 - 19:00 ч. Четвъртък 09:00 - 19:00 ч. Петък 09:00 - 19:00 ч. Събота 09:00 - 19:00 ч. Неделя Почивен ден",
  logo: "/dealer-brand/v2-3e890b2aa575f82d/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-3e890b2aa575f82d/logo-on-dark.webp"
} as const satisfies BrandConfig;
