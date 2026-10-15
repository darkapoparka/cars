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

const name = "Лион Ауто";
const shortName = "Лион Ауто";
const city = "Варна";
const addressLine = "бул.Цар Освободител третата автокъща в ляво след Италмодо";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0895753001",
  phoneHref: "tel:+359895753001",
  addressLine,
  address: "бул.Цар Освободител третата автокъща в ляво след Италмодо, Варна, България",
  appointment: "Понеделник 08:30 - 00:00 ч. Вторник 08:30 - 00:00 ч. Сряда 08:30 - 00:00 ч. Четвъртък 08:30 - 00:00 ч. Петък 08:30 - 00:00 ч. Събота 09:00 - 14:00 ч. Неделя Почивен ден",
  logo: "/dealer-brand/v2-7ec7821ff2c17bfd/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-7ec7821ff2c17bfd/logo-on-dark.webp"
} as const satisfies BrandConfig;
