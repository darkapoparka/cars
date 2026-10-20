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

const name = "МЛАДОСТ 2 - Внос на автомобили от западна Европа";
const shortName = "МЛАДОСТ 2";
const city = "Варна";
const addressLine = "бул. Цар Освободител 290";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0897873671",
  phoneHref: "tel:+359897873671",
  addressLine,
  address: "бул. Цар Освободител 290, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-ee2087ac6686e553/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-ee2087ac6686e553/logo-on-dark.webp"
} as const satisfies BrandConfig;
