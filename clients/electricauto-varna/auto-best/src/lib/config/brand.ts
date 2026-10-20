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

const name = "Electric Auto";
const shortName = "Electric Auto";
const city = "Варна";
const addressLine = "ул. Лале 1";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0879904724",
  phoneHref: "tel:+359879904724",
  addressLine,
  address: "ул. Лале 1, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-c236f8ee3f61b51b/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-c236f8ee3f61b51b/logo-on-dark.webp"
} as const satisfies BrandConfig;
