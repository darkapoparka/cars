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

const name = "МИРАЖ АУТО";
const shortName = "МИРАЖ АУТО";
const city = "Варна";
const addressLine = "бул. Цар Освободител 230, срещу МЕТРО до автогуми Жижо";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0893777706",
  phoneHref: "tel:+359893777706",
  addressLine,
  address: "бул. Цар Освободител 230, срещу МЕТРО до автогуми Жижо, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-c3b62a7d03bc18e1/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-c3b62a7d03bc18e1/logo-on-dark.webp"
} as const satisfies BrandConfig;
