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

const name = "Специал Кар";
const shortName = "Специал Кар";
const city = "Варна";
const addressLine = "бул. Цар Освободител 324";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0893557367",
  phoneHref: "tel:+359893557367",
  addressLine,
  address: "бул. Цар Освободител 324, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-25d04371b32911a3/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-25d04371b32911a3/logo-on-dark.webp"
} as const satisfies BrandConfig;
