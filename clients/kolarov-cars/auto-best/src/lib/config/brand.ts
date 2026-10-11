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

const name = "Kolarov Cars";
const shortName = "Kolarov Cars";
const city = "Варна";
const addressLine = "Бизнес Парк Варна, сграда В8";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: {"latitude":0,"longitude":0},
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0876999800",
  phoneHref: "tel:+359876999800",
  addressLine,
  address: "Бизнес Парк Варна, сграда В8, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-f0a9cb9e0a0fb982/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-f0a9cb9e0a0fb982/logo-on-dark.webp"
} as const satisfies BrandConfig;
