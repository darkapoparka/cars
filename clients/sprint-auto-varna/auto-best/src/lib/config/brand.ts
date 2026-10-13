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

const name = "Спринт ауто";
const shortName = "СПРИНТ";
const city = "Варна";
const addressLine = "бул. „Цар Освободител“, втората автокъща след Тилком и Италмодалуче към Аксаково";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0888 006 224",
  phoneHref: "tel:+359888006224",
  addressLine,
  address: "Варна, Владислав Варненчик, бул. „Цар Освободител“, втората автокъща след Тилком и Италмодалуче посока Аксаково",
  appointment: "Потвърдете работното време и огледа по телефона",
  logo: "/registered-branding/onLight.png",
  logoOnDark: "/registered-branding/onDark.png"
} as const satisfies BrandConfig;
