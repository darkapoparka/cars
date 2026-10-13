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

const name = "CrazyFoxMotors";
const shortName = "CrazyFoxMotors";
const city = "Варна";
const addressLine = "ул. Прилеп 87";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0888205488",
  phoneHref: "tel:+359888205488",
  addressLine,
  address: "ул. Прилеп 87, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-a5ae7b53dd49fe7e/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-a5ae7b53dd49fe7e/logo-on-dark.webp"
} as const satisfies BrandConfig;
