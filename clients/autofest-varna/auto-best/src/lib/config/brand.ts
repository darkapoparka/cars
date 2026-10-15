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

const name = "Аутофест";
const shortName = "Аутофест";
const city = "Варна";
const addressLine = "бул.'Цар Освободител' 1000 метра след Метро";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0897855097",
  phoneHref: "tel:+359897855097",
  addressLine,
  address: "бул.'Цар Освободител' 1000 метра след Метро, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-68b437f5785795db/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-68b437f5785795db/logo-on-dark.webp"
} as const satisfies BrandConfig;
