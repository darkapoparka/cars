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

const name = "АВТОКЪЩА СЕВИ КАР";
const shortName = "СЕВИ КАР";
const city = "Варна";
const addressLine = "Главен път Е2 ВАРНА-СОФИЯ, 400м. след кръговото под Метро! GPS";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0888205072",
  phoneHref: "tel:+359888205072",
  addressLine,
  address: "Главен път Е2 ВАРНА-СОФИЯ, 400м. след кръговото под Метро! GPS, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-cec811a67b8c5e20/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-cec811a67b8c5e20/logo-on-dark.webp"
} as const satisfies BrandConfig;
