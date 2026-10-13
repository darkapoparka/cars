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

const name = "ГРАНД АУТО ВАРНА";
const shortName = "ГРАНД АУТО ВАРНА";
const city = "Варна";
const addressLine = "бул. Цар Освободител 289, до Макао посока Аксаково";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0889811120",
  phoneHref: "tel:+359889811120",
  addressLine,
  address: "бул. Цар Освободител 289, до Макао посока Аксаково, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-1f38653bdc492066/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-1f38653bdc492066/logo-on-dark.webp"
} as const satisfies BrandConfig;
