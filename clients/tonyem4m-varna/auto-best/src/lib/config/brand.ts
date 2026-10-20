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

const name = "Тони Ем";
const shortName = "Тони Ем";
const city = "Варна";
const addressLine = "бул. Янош Хуняди 95 ( до Пароцентралата)";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0889515000",
  phoneHref: "tel:+359889515000",
  addressLine,
  address: "бул. Янош Хуняди 95 ( до Пароцентралата), Варна, България",
  appointment: "Понеделник 09:00 - 18:00 ч. Вторник 09:00 - 18:00 ч. Сряда 09:00 - 18:00 ч. Четвъртък 09:00 - 18:00 ч. Петък 09:00 - 18:00 ч. Събота 10:00 - 16:00 ч. Неделя Почивен ден",
  logo: "/dealer-brand/v2-e1d0db5b041182f0/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-e1d0db5b041182f0/logo-on-dark.webp"
} as const satisfies BrandConfig;
