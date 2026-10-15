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

const name = "TECHNOCAR";
const shortName = "TECHNOCAR";
const city = "Варна";
const addressLine = "бул. Владислав Варненчик 310";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "00359888605466",
  phoneHref: "tel:+359888605466",
  addressLine,
  address: "бул. Владислав Варненчик 310, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-2d749c53e3c67348/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-2d749c53e3c67348/logo-on-dark.webp"
} as const satisfies BrandConfig;
