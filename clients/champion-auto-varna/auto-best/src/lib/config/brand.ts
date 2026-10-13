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

const name = "Сhampion Auto";
const shortName = "Сhampion Auto";
const city = "Варна";
const addressLine = "бул. Цар Освободител 210, до изхода на КАТ";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0899736225",
  phoneHref: "tel:+359899736225",
  addressLine,
  address: "бул. Цар Освободител 210, до изхода на КАТ, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-3a0b44cd293342c3/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-3a0b44cd293342c3/logo-on-dark.webp"
} as const satisfies BrandConfig;
