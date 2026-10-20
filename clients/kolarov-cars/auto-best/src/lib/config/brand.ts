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

const name = "Kolarov Cars";
const shortName = "Kolarov Cars";
const city = "Варна";
const addressLine = "Бизнес Парк Варна, сграда В8";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0876999800",
  phoneHref: "tel:+359876999800",
  addressLine,
  address: "Бизнес Парк Варна, сграда В8, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-200fef89fed2fb80/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-200fef89fed2fb80/logo-on-dark.webp"
} as const satisfies BrandConfig;
