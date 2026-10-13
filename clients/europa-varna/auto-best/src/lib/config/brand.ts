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
  logo: "/registered-branding/onLight.png",
  logoOnDark: "/registered-branding/onDark.png"
} as const satisfies BrandConfig;
