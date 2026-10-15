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

const name = "Автоцентър Баваро";
const shortName = "Автоцентър Баваро";
const city = "Варна";
const addressLine = "бул. Цар Освободител 176, срещу бл. 107";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0883590090",
  phoneHref: "tel:+359883590090",
  addressLine,
  address: "бул. Цар Освободител 176, срещу бл. 107, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-d43004f80ce3d580/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-d43004f80ce3d580/logo-on-dark.webp"
} as const satisfies BrandConfig;
