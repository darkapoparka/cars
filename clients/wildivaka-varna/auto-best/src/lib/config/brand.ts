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

const name = "Axe Cars";
const shortName = "Axe Cars";
const city = "Варна";
const addressLine = "Бул. Цар Освободител 302";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0898467497",
  phoneHref: "tel:+359898467497",
  addressLine,
  address: "Бул. Цар Освободител 302, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-6a32df4f42d9fcd5/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-6a32df4f42d9fcd5/logo-on-dark.webp"
} as const satisfies BrandConfig;
