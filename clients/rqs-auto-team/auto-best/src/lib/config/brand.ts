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

const name = "R.Q.S. Auto – Team";
const shortName = "R.Q.S.";
const city = "Варна";
const addressLine = "бул. „Цар Освободител“, Владислав Варненчик — уточнете точния вход";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0876 997 791",
  phoneHref: "tel:+359876997791",
  addressLine,
  address: "бул. „Цар Освободител“, Владислав Варненчик, Варна — точният номер не е потвърден",
  appointment: "Потвърдете работното време и огледа по телефона",
  logo: "/registered-branding/onLight.png",
  logoOnDark: "/registered-branding/onDark.png"
} as const satisfies BrandConfig;
