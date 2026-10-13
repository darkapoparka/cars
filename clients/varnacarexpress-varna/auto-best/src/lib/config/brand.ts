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

const name = "Варна Кар Експрес";
const shortName = "Варна Кар Експрес";
const city = "Варна";
const addressLine = "бул.'Цар Освободител' 200м. след Дом на Камиона посока Аксаково.";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0899155902",
  phoneHref: "tel:+359899155902",
  addressLine,
  address: "бул.'Цар Освободител' 200м. след Дом на Камиона посока Аксаково., Варна, България",
  appointment: "Понеделник 09:00 - 17:30 ч. Вторник 00:00 - 00:00 ч. Сряда 00:00 - 00:00 ч. Четвъртък 00:00 - 00:00 ч. Петък 00:00 - 00:00 ч. Събота 00:00 - 00:00 ч. Неделя Почивен ден",
  logo: "/dealer-brand/v2-06758e3f2a974714/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-06758e3f2a974714/logo-on-dark.webp"
} as const satisfies BrandConfig;
