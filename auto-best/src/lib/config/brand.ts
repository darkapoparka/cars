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

const name = "Trade Car Sales";
const shortName = "Trade Car Sales";
const city = "Birmingham";
const addressLine = "";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: {"latitude":0,"longitude":0},
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "",
  phoneHref: "tel:",
  addressLine,
  address: "",
  appointment: "Contact the dealership before visiting.",
  logo: "/dealer-brand/logo-on-light-20261011.webp",
  logoOnDark: "/dealer-brand/logo-on-dark-20261011.webp"
} as const satisfies BrandConfig;
