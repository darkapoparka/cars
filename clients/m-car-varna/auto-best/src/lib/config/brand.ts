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

const name = "M Car Varna";
const shortName = "M Car Varna";
const city = "Варна";
const addressLine = "бул. Владислав Варненчик 320";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "+359887246669",
  phoneHref: "tel:+359887246669",
  addressLine,
  address: "бул. Владислав Варненчик 320, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-fb593bfc691819f0/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-fb593bfc691819f0/logo-on-dark.webp"
} as const satisfies BrandConfig;
