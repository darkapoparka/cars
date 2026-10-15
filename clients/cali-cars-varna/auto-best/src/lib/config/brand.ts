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

const name = "Cali Cars";
const shortName = "Cali Cars";
const city = "Варна";
const addressLine = "Мест. Боровец Север 2029";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0877064339",
  phoneHref: "tel:+359877064339",
  addressLine,
  address: "Мест. Боровец Север 2029, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-2976f80649f63b9b/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-2976f80649f63b9b/logo-on-dark.webp"
} as const satisfies BrandConfig;
