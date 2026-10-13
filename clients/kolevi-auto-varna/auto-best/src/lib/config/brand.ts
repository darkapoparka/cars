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

const name = "Колеви Ауто";
const shortName = "Колеви Ауто";
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
  phone: "0878431141",
  phoneHref: "tel:+359878431141",
  addressLine,
  address: "бул. Цар Освободител, Варна, България",
  appointment: "Понеделник 00:00 - 00:00 ч. Вторник 00:00 - 00:00 ч. Сряда 00:00 - 00:00 ч. Четвъртък 00:00 - 00:00 ч. Петък 00:00 - 00:00 ч. Събота 00:00 - 00:00 ч. Неделя 00:00 - 00:00 ч.",
  logo: "/dealer-brand/v2-4942cbba173691f8/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-4942cbba173691f8/logo-on-dark.webp"
} as const satisfies BrandConfig;
