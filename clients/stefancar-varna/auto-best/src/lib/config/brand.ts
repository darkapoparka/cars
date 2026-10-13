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

const name = "СТЕФАН КАР -внос и продажба на автомобили";
const shortName = "СТЕФАН КАР";
const city = "Варна";
const addressLine = "бул. Цар Освободител 500 метра след метро";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0888229977",
  phoneHref: "tel:+359888229977",
  addressLine,
  address: "бул. Цар Освободител 500 метра след метро, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-791a821f49548998/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-791a821f49548998/logo-on-dark.webp"
} as const satisfies BrandConfig;
