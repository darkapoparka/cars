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

const name = "АВТОБОРСА МАНИЯ";
const shortName = "Мания";
const city = "Варна";
const addressLine = "бул. Цар Освободител, район Владислав Варненчик";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0899 874 488",
  phoneHref: "tel:+359899874488",
  addressLine,
  address: "бул. Цар Освободител, район Владислав Варненчик",
  appointment: "Не е публикувано работно време. Потвърдете удобния час и точния вход по телефона.",
  logo: "/dealer-brand/v2-a83417b07db78ad1/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-a83417b07db78ad1/logo-on-dark.webp"
} as const satisfies BrandConfig;
