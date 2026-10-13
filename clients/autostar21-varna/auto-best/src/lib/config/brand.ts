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

const name = "AutoStar";
const shortName = "AutoStar";
const city = "Варна";
const addressLine = "Ул. Тодор Радев Пенев 5Д, 9009";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0887700052",
  phoneHref: "tel:+359887700052",
  addressLine,
  address: "Ул. Тодор Радев Пенев 5Д, 9009, Варна, България",
  appointment: "Понеделник 09:00 - 17:00 ч. Вторник 09:00 - 17:00 ч. Сряда 09:00 - 17:00 ч. Четвъртък 09:00 - 17:00 ч. Петък 09:00 - 17:00 ч. Събота 00:00 - 00:00 ч. Неделя 00:00 - 00:00 ч.",
  logo: "/dealer-brand/v2-26972c6239c76e5f/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-26972c6239c76e5f/logo-on-dark.webp"
} as const satisfies BrandConfig;
