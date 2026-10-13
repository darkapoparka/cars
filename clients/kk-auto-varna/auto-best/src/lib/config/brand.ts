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

const name = "К&K AUTO";
const shortName = "К&K AUTO";
const city = "Варна";
const addressLine = "ул. 3та 18";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0899818608",
  phoneHref: "tel:+359899818608",
  addressLine,
  address: "ул. 3та 18, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-c40f052551930a49/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-c40f052551930a49/logo-on-dark.webp"
} as const satisfies BrandConfig;
