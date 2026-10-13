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

const name = "Капитол";
const shortName = "Капитол";
const city = "Варна";
const addressLine = "бул. Цар Освободител 236";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0878720052",
  phoneHref: "tel:+359878720052",
  addressLine,
  address: "бул. Цар Освободител 236, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-83eda7a46f9497bd/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-83eda7a46f9497bd/logo-on-dark.webp"
} as const satisfies BrandConfig;
