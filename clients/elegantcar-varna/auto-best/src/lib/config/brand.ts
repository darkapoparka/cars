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

const name = "Елегант кар";
const shortName = "Елегант кар";
const city = "Варна";
const addressLine = "бул. Цар Освободител разклона за Владиславово";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0877910051",
  phoneHref: "tel:+359877910051",
  addressLine,
  address: "бул. Цар Освободител разклона за Владиславово, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-a6752ddb75001700/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-a6752ddb75001700/logo-on-dark.webp"
} as const satisfies BrandConfig;
