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

const name = "Крис";
const shortName = "Крис";
const city = "Варна";
const addressLine = "гр. Варна, бул. ,,Цар Освободител Номер#355А";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0899927244",
  phoneHref: "tel:+359899927244",
  addressLine,
  address: "гр. Варна, бул. ,,Цар Освободител Номер#355А, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-88310c2f48c97d04/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-88310c2f48c97d04/logo-on-dark.webp"
} as const satisfies BrandConfig;
