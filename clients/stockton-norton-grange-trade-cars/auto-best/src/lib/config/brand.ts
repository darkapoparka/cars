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

const name = "Norton Grange Trade Cars";
const shortName = "Norton Grange Trade Cars";
const city = "Stockton-on-Tees";
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
  logo: "/dealer-brand/logo.webp",
  logoOnDark: "/dealer-brand/logo.webp"
} as const satisfies BrandConfig;
