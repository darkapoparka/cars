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

const name = "CARNOVA";
const shortName = "CARNOVA";
const city = "Варна";
const addressLine = "ул. Тодор Р. Пенев срещу бл.5 вх.Д";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0888865065",
  phoneHref: "tel:+359888865065",
  addressLine,
  address: "ул. Тодор Р. Пенев срещу бл.5 вх.Д, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-f842e0e14d723526/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-f842e0e14d723526/logo-on-dark.webp"
} as const satisfies BrandConfig;
