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

const name = "DREAM DRIVE";
const shortName = "DREAM DRIVE";
const city = "Варна";
const addressLine = "бул. Цар Освободител 289";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: {"latitude":0,"longitude":0},
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0895395980",
  phoneHref: "tel:+359895395980",
  addressLine,
  address: "бул. Цар Освободител 289, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-bd2059e137647692/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-bd2059e137647692/logo-on-dark.webp"
} as const satisfies BrandConfig;
