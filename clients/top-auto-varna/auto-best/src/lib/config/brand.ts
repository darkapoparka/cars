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

const name = "topauto";
const shortName = "topauto";
const city = "Варна";
const addressLine = "Кайсиева градина, до бл. 222";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0893036419",
  phoneHref: "tel:+359893036419",
  addressLine,
  address: "Кайсиева градина, до бл. 222, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-0d9426ae4fe386fa/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-0d9426ae4fe386fa/logo-on-dark.webp"
} as const satisfies BrandConfig;
