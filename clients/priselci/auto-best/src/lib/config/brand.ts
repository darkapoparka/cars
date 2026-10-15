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

const name = "Автокъща Приселци";
const shortName = "Приселци";
const city = "Варна";
const addressLine = "бул. „Цар Освободител“ 285";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0886 251 705",
  phoneHref: "tel:+359886251705",
  addressLine,
  address: "бул. „Цар Освободител“ 285",
  appointment: "Работното време се уточнява по телефона.",
  logo: "/dealer-brand/v2-7b937c05859b3290/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-7b937c05859b3290/logo-on-dark.webp"
} as const satisfies BrandConfig;
