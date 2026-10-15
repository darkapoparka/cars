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

const name = "Auto Insurance Import";
const shortName = "Auto Insurance Import";
const city = "Варна";
const addressLine = "гр. Варна";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0878601371",
  phoneHref: "tel:+359878601371",
  addressLine,
  address: "гр. Варна, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-6c5e4220c5c7c260/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-6c5e4220c5c7c260/logo-on-dark.webp"
} as const satisfies BrandConfig;
