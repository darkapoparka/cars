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

const name = "PRIME AUTO";
const shortName = "PRIME AUTO";
const city = "Варна";
const addressLine = "бул. Цар Освободител 228";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0878751561",
  phoneHref: "tel:+359878751561",
  addressLine,
  address: "бул. Цар Освободител 228, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-effc76bdf6860a0b/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-effc76bdf6860a0b/logo-on-dark.webp"
} as const satisfies BrandConfig;
