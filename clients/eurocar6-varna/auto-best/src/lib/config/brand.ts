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

const name = "ЕВРОКАР";
const shortName = "ЕВРОКАР";
const city = "Варна";
const addressLine = "бул. Цар Освободител /до Дом на Камиона/";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0879430777",
  phoneHref: "tel:+359879430777",
  addressLine,
  address: "бул. Цар Освободител /до Дом на Камиона/, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-dd155c8c1c05263b/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-dd155c8c1c05263b/logo-on-dark.webp"
} as const satisfies BrandConfig;
