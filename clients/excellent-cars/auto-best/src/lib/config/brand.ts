export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  addressLine: string;
  address: string;
  phone: string;
  phoneHref: `tel:${string}`;
  appointment: string;
  logo: `/${string}`;
  logoOnDark: `/${string}`;
  youtubeUrl: `https://${string}`;
  instagramUrl: `https://${string}`;
  facebookUrl: `https://${string}`;
};

const name = "Excellent Cars";
const shortName = "Excellent Cars";
const city = "Варна";
const addressLine = "бул. „Ян Хунияди“, ъгъла с бул. „Цар Освободител“";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0895 996 559",
  phoneHref: "tel:+359895996559",
  addressLine,
  address: "бул. „Ян Хунияди“, ъгъла с бул. „Цар Освободител“",
  appointment: "Понеделник – петък: 08:30–19:00; Събота: 09:00–18:00; Неделя: почивен ден",
  logo: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
