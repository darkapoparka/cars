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

const name = "CAR POINT TRADE LTD";
const shortName = "CAR POINT TRADE LTD";
const city = "Варна";
const addressLine = "бул. Цар Освободител 285";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: {"latitude":0,"longitude":0},
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0883530713",
  phoneHref: "tel:+359883530713",
  addressLine,
  address: "бул. Цар Освободител 285, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
