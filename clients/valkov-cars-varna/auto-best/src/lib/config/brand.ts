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

const name = "ВЪЛКОВ КАРС";
const shortName = "ВЪЛКОВ КАРС";
const city = "Варна";
const addressLine = "бул. Цар Освободител, Преди изхода от града 500 м в ляво";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0898685288",
  phoneHref: "tel:+359898685288",
  addressLine,
  address: "бул. Цар Освободител, Преди изхода от града 500 м в ляво, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-7977e8d706c5271b/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-7977e8d706c5271b/logo-on-dark.webp"
} as const satisfies BrandConfig;
