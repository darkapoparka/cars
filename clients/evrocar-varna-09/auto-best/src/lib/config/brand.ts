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

const name = "ЕВРОКАР ВАРНА 09";
const shortName = "ЕВРОКАР 09";
const city = "Варна";
const addressLine = "бул. „Цар Освободител“, след Метро, преди светофара за JUMBO";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0897 002 225",
  phoneHref: "tel:+359897002225",
  addressLine,
  address: "Варна, Кайсиева градина, бул. „Цар Освободител“, след Метро, преди светофара за JUMBO",
  appointment: "Потвърдете работното време и точния вход по телефона",
  logo: "/registered-branding/onLight.png",
  logoOnDark: "/registered-branding/onDark.png"
} as const satisfies BrandConfig;
