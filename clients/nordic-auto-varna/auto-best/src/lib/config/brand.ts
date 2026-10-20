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

const name = "Nordic Auto";
const shortName = "Nordic Auto";
const city = "Варна";
const addressLine = "гр. Варна, Център";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0892453350",
  phoneHref: "tel:+359892453350",
  addressLine,
  address: "гр. Варна, Център, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-f8aac6926b022641/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-f8aac6926b022641/logo-on-dark.webp"
} as const satisfies BrandConfig;
