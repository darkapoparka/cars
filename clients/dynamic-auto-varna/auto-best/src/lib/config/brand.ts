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

const name = "Dynamic Auto Varna";
const shortName = "Dynamic Auto Varna";
const city = "Варна";
const addressLine = "бул. Цар Освободител 289";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0889616721",
  phoneHref: "tel:+359889616721",
  addressLine,
  address: "бул. Цар Освободител 289, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-0b6f5127f33a3666/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-0b6f5127f33a3666/logo-on-dark.webp"
} as const satisfies BrandConfig;
