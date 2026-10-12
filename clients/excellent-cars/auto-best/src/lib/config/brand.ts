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

const name = "Excellent Cars";
const shortName = "Excellent Cars";
const city = "Варна";
const addressLine = "бул. „Ян Хунияди“, ъгъла с бул. „Цар Освободител“";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0895 996 559",
  phoneHref: "tel:+359895996559",
  addressLine,
  address: "бул. „Ян Хунияди“, ъгъла с бул. „Цар Освободител“",
  appointment: "Понеделник – петък: 08:30–19:00; Събота: 09:00–18:00; Неделя: почивен ден",
  logo: "/dealer-brand/v2-23abd64e1e990a72/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-23abd64e1e990a72/logo-on-dark.webp"
} as const satisfies BrandConfig;
