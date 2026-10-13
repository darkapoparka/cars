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

const name = "ELEXIS CARS";
const shortName = "ELEXIS CARS";
const city = "Варна";
const addressLine = "ул. Проф. Цани Калянджиев 6";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0899388989",
  phoneHref: "tel:+359899388989",
  addressLine,
  address: "ул. Проф. Цани Калянджиев 6, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-09aceb0e74a91828/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-09aceb0e74a91828/logo-on-dark.webp"
} as const satisfies BrandConfig;
