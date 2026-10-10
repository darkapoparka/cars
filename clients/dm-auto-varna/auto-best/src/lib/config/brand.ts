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

const name = "D&M - Auto Varna";
const shortName = "D&M - Auto Varna";
const city = "Варна";
const addressLine = "бул. Цар Освободител 282";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: {"latitude":0,"longitude":0},
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0898286848",
  phoneHref: "tel:+359898286848",
  addressLine,
  address: "бул. Цар Освободител 282, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
