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

const name = "BalkanCarVarna";
const shortName = "BalkanCarVarna";
const city = "Варна";
const addressLine = "бул. Цар Освободител 548 (на светофара под Джъмбо)";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0888513460, 0888706421",
  phoneHref: "tel:+359888513460",
  addressLine,
  address: "бул. Цар Освободител 548 (на светофара под Джъмбо), Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-cd481bfb8ed89f8c/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-cd481bfb8ed89f8c/logo-on-dark.webp"
} as const satisfies BrandConfig;
