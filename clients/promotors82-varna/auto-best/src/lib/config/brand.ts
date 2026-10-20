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

const name = "PRO MOTORS";
const shortName = "PRO MOTORS";
const city = "Варна";
const addressLine = "бул. Христо Смирненски";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0899519164",
  phoneHref: "tel:+359899519164",
  addressLine,
  address: "бул. Христо Смирненски, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-ba59c9c087af41bf/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-ba59c9c087af41bf/logo-on-dark.webp"
} as const satisfies BrandConfig;
