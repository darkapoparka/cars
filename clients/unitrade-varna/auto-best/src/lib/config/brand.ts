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

const name = "УНИТРЕЙД";
const shortName = "УНИТРЕЙД";
const city = "Варна";
const addressLine = "бул. Цар Освободител-след последния светофар за Владиславово 200 метра вляво";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0887479224",
  phoneHref: "tel:+359887479224",
  addressLine,
  address: "бул. Цар Освободител-след последния светофар за Владиславово 200 метра вляво, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-0be7408b076da7db/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-0be7408b076da7db/logo-on-dark.webp"
} as const satisfies BrandConfig;
