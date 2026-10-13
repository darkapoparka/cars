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

const name = "Монарх";
const shortName = "Монарх";
const city = "Варна";
const addressLine = "Бул. Цар Освободител";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0877277258\r\n0877796170",
  phoneHref: "tel:+359877277258",
  addressLine,
  address: "Бул. Цар Освободител, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-c58e3d9ad428ebfd/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-c58e3d9ad428ebfd/logo-on-dark.webp"
} as const satisfies BrandConfig;
