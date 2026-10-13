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

const name = "Триумф";
const shortName = "Триумф";
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
  phone: "0898547765",
  phoneHref: "tel:+359898547765",
  addressLine,
  address: "бул. Цар Освободител, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-113ceeaf81b1bde1/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-113ceeaf81b1bde1/logo-on-dark.webp"
} as const satisfies BrandConfig;
