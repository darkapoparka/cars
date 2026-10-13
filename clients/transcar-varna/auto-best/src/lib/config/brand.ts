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

const name = "АВТОСАЛОН ТРАНС КАР";
const shortName = "АВТОСАЛОН ТРАНС КАР";
const city = "Варна";
const addressLine = "бул.Цар Освободител 900 метра след Метро";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0898504908",
  phoneHref: "tel:+359898504908",
  addressLine,
  address: "бул.Цар Освободител 900 метра след Метро, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-461cd271108a17d3/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-461cd271108a17d3/logo-on-dark.webp"
} as const satisfies BrandConfig;
