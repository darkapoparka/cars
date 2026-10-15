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

const name = "WATT a Car";
const shortName = "WATT a Car";
const city = "Варна";
const addressLine = "ул. 1-ва 95";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0887489513",
  phoneHref: "tel:+359887489513",
  addressLine,
  address: "ул. 1-ва 95, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-0a40a8d9c0483ba2/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-0a40a8d9c0483ba2/logo-on-dark.webp"
} as const satisfies BrandConfig;
