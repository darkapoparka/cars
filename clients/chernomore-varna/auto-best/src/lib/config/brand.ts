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

const name = "Черно море";
const shortName = "Черно море";
const city = "Варна";
const addressLine = "Кръстовището на бул. Цар Освободител и бул. Константин и Фружин";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0888596963, 052/560733",
  phoneHref: "tel:+359888596963",
  addressLine,
  address: "Кръстовището на бул. Цар Освободител и бул. Константин и Фружин, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-f6b69418c0cdebde/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-f6b69418c0cdebde/logo-on-dark.webp"
} as const satisfies BrandConfig;
