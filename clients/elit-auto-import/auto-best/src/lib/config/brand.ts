export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  showroomCoordinates: { latitude: number; longitude: number };
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

const name = "ELIT AUTO IMPORT EXPORT";
const shortName = "ELIT AUTO";
const city = "Варна";
const addressLine = "ул. „Прилеп“ 74А, м-т Пчелина";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: {"latitude":0,"longitude":0},
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0887 777 887",
  phoneHref: "tel:+359887777887",
  addressLine,
  address: "ул. „Прилеп“ 74А, м-т Пчелина",
  appointment: "Работното време се уточнява по телефона.",
  logo: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
