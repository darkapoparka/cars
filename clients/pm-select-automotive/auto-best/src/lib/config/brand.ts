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

const name = "PM SELECT AUTOMOTIVE";
const shortName = "PM SELECT AUTOMOTIVE";
const city = "Варна";
const addressLine = "бул. Цар Освободител 122";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0887083275",
  phoneHref: "tel:+359887083275",
  addressLine,
  address: "бул. Цар Освободител 122, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-1737eb7ee75bdd48/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-1737eb7ee75bdd48/logo-on-dark.webp"
} as const satisfies BrandConfig;
