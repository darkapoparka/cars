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

const name = "Автосалон СТАДИОНА";
const shortName = "Автосалон СТАДИОНА";
const city = "Варна";
const addressLine = "бул.Цар Освободител-след Метро";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0898838353",
  phoneHref: "tel:+359898838353",
  addressLine,
  address: "бул.Цар Освободител-след Метро, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-a91f596f1b37c372/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-a91f596f1b37c372/logo-on-dark.webp"
} as const satisfies BrandConfig;
