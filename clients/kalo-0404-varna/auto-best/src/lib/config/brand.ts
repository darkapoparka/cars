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

const name = "Кало 0404";
const shortName = "Кало 0404";
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
  phone: "0878483604",
  phoneHref: "tel:+359878483604",
  addressLine,
  address: "бул. Цар Освободител, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-1e207107b7559017/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-1e207107b7559017/logo-on-dark.webp"
} as const satisfies BrandConfig;
