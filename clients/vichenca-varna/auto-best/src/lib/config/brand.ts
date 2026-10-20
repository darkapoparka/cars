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

const name = "VICHENCA";
const shortName = "VICHENCA";
const city = "Варна";
const addressLine = "бул. Цал Освободител, третият автосалон откъм летището в ляво";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0877 778 669",
  phoneHref: "tel:+359877778669",
  addressLine,
  address: "бул. Цал Освободител, третият автосалон откъм летището в ляво, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-c4b6ad087c72721d/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-c4b6ad087c72721d/logo-on-dark.webp"
} as const satisfies BrandConfig;
