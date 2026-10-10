export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  showroomCoordinates: { latitude: number; longitude: number };
  addressLine: string;
  address: string;
  phone: string;
  phoneHref: `tel:${string}`;
  appointment: string;
  logo: `/${string}`;
  logoOnDark: `/${string}`;
  youtubeUrl: `https://${string}` | '';
  instagramUrl: `https://${string}`;
  facebookUrl: `https://${string}`;
};

const name = "Аутофест";
const shortName = "Аутофест";
const city = "Варна";
const addressLine = "бул.'Цар Освободител' 1000 метра след Метро";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: {"latitude":0,"longitude":0},
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0897855097",
  phoneHref: "tel:+359897855097",
  addressLine,
  address: "бул.'Цар Освободител' 1000 метра след Метро, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
