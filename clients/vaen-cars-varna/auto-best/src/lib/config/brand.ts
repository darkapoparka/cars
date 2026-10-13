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

const name = "VAEN CARS";
const shortName = "VAEN CARS";
const city = "Варна";
const addressLine = "ул. Мусала11";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0886039057",
  phoneHref: "tel:+359886039057",
  addressLine,
  address: "ул. Мусала11, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-a84102ff5de00699/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-a84102ff5de00699/logo-on-dark.webp"
} as const satisfies BrandConfig;
