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

const name = "Eco Drive";
const shortName = "Eco Drive";
const city = "Варна";
const addressLine = "Варна, България";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0897838559",
  phoneHref: "tel:+359897838559",
  addressLine,
  address: "Варна, България",
  appointment: "Понеделник 11:00 - 18:00 ч. Вторник 11:00 - 18:00 ч. Сряда 11:00 - 18:00 ч. Четвъртък 11:00 - 18:00 ч. Петък 11:00 - 18:00 ч. Събота 11:00 - 18:00 ч. Неделя Почивен ден",
  logo: "/dealer-brand/v2-8192942a82565732/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-8192942a82565732/logo-on-dark.webp"
} as const satisfies BrandConfig;
