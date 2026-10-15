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

const name = "автосалон Фокус";
const shortName = "автосалон Фокус";
const city = "Варна";
const addressLine = "бул. Цар Освободител 329";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0899811258",
  phoneHref: "tel:+359899811258",
  addressLine,
  address: "бул. Цар Освободител 329, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-5efb500cfba4287a/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-5efb500cfba4287a/logo-on-dark.webp"
} as const satisfies BrandConfig;
