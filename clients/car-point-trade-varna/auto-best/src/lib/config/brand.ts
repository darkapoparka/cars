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

const name = "CAR POINT TRADE LTD";
const shortName = "CAR POINT TRADE LTD";
const city = "Варна";
const addressLine = "бул. Цар Освободител 285";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0883530713",
  phoneHref: "tel:+359883530713",
  addressLine,
  address: "бул. Цар Освободител 285, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-de735d372fa7af4a/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-de735d372fa7af4a/logo-on-dark.webp"
} as const satisfies BrandConfig;
