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

const name = "АВТОМОТОР ВАРНА АД";
const shortName = "АВТОМОТОР ВАРНА АД";
const city = "Варна";
const addressLine = "Бул. Цар Освободител 277";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0885735255",
  phoneHref: "tel:+359885735255",
  addressLine,
  address: "Бул. Цар Освободител 277, Варна, България",
  appointment: "Понеделник 08:30 - 17:00 ч. Вторник 08:30 - 17:00 ч. Сряда 08:30 - 17:00 ч. Четвъртък 08:30 - 17:00 ч. Петък 08:30 - 17:00 ч. Събота Почивен ден Неделя Почивен ден",
  logo: "/dealer-brand/v2-d858e68d227bc130/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-d858e68d227bc130/logo-on-dark.webp"
} as const satisfies BrandConfig;
