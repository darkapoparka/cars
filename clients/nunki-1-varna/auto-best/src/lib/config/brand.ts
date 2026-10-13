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

const name = "NUNKI - 1";
const shortName = "NUNKI - 1";
const city = "Варна";
const addressLine = "бул. Цар Освободител 227;9023 планова индустриална зона-Варна";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0890426113",
  phoneHref: "tel:+359890426113",
  addressLine,
  address: "бул. Цар Освободител 227;9023 планова индустриална зона-Варна, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-97b63d0ddaa0fa19/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-97b63d0ddaa0fa19/logo-on-dark.webp"
} as const satisfies BrandConfig;
