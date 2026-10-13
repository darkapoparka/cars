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

const name = "АБЦ БЪЛГАРИЯ ЕООД";
const shortName = "АБЦ БЪЛГАРИЯ ЕООД";
const city = "Варна";
const addressLine = "ул. Орех 1";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0893324178",
  phoneHref: "tel:+359893324178",
  addressLine,
  address: "ул. Орех 1, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-3fde0f5c25977792/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-3fde0f5c25977792/logo-on-dark.webp"
} as const satisfies BrandConfig;
