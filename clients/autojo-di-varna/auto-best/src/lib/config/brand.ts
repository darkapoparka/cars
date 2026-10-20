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

const name = "АУТО ЖО-ДИ";
const shortName = "АУТО ЖО-ДИ";
const city = "Варна";
const addressLine = "бул. Цар Освободител, 300 м. след светофара за Владиславово";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0898545465",
  phoneHref: "tel:+359898545465",
  addressLine,
  address: "бул. Цар Освободител, 300 м. след светофара за Владиславово, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-69d9aed0bbd1b0bf/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-69d9aed0bbd1b0bf/logo-on-dark.webp"
} as const satisfies BrandConfig;
