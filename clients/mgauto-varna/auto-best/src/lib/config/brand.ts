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

const name = "Автосалон М&G auto";
const shortName = "М&G auto";
const city = "Варна";
const addressLine = "бул. Цар Освободител";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0895478847",
  phoneHref: "tel:+359895478847",
  addressLine,
  address: "бул. Цар Освободител, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-b2591ef6dfd59110/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-b2591ef6dfd59110/logo-on-dark.webp"
} as const satisfies BrandConfig;
