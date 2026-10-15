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

const name = "Европа";
const shortName = "ЕВРОПА";
const city = "Варна";
const addressLine = "бул. „Христо Смирненски“, до Вятърна мелница, Победа";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0887 600 565",
  phoneHref: "tel:+359887600565",
  addressLine,
  address: "Варна, Победа, бул. „Христо Смирненски“, до Вятърна мелница",
  appointment: "Потвърдете работното време и огледа по телефона",
  logo: "/dealer-brand/v2-157161b8b9b6ab30/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-157161b8b9b6ab30/logo-on-dark.webp"
} as const satisfies BrandConfig;
