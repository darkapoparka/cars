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

const name = "Автосалон ПРЕСТИЖ";
const shortName = "ПРЕСТИЖ";
const city = "Варна";
const addressLine = "бул. Цар Освободител, 15–20 м преди последния светофар за Владиславово, вляво към Аксаково";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0897 298 385",
  phoneHref: "tel:+359897298385",
  addressLine,
  address: "бул. Цар Освободител, 15–20 м преди последния светофар за Владиславово, вляво към Аксаково",
  appointment: "Работното време не е публикувано. Потвърдете часа и точния вход по телефона.",
  logo: "/registered-branding/onLight.png",
  logoOnDark: "/registered-branding/onDark.png"
} as const satisfies BrandConfig;
