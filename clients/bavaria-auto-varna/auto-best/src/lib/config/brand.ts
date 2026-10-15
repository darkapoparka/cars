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

const name = "Бавария";
const shortName = "Бавария";
const city = "Варна";
const addressLine = "бул. Цар Освободител до светофара за Владиславово";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0879030161",
  phoneHref: "tel:+359879030161",
  addressLine,
  address: "бул. Цар Освободител до светофара за Владиславово, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-8a04605c71626655/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-8a04605c71626655/logo-on-dark.webp"
} as const satisfies BrandConfig;
