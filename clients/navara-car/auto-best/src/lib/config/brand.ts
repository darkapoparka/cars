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

const name = "Навара кар";
const shortName = "Navara Car";
const city = "Варна";
const addressLine = "бул. „Цар Освободител“, Кайсиева градина";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0899 192 300",
  phoneHref: "tel:+359899192300",
  addressLine,
  address: "бул. „Цар Освободител“, Кайсиева градина, Варна",
  appointment: "Посещения с предварителна уговорка.",
  logo: "/dealer-brand/v2-24f1fab0fc40d49e/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-24f1fab0fc40d49e/logo-on-dark.webp"
} as const satisfies BrandConfig;
