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

const name = "ДайнАуто";
const shortName = "ДайнАуто";
const city = "Варна";
const addressLine = "ул. Петър Дертлиев 34";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "+359899117330",
  phoneHref: "tel:+359899117330",
  addressLine,
  address: "ул. Петър Дертлиев 34, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-a7abec1b51196d86/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-a7abec1b51196d86/logo-on-dark.webp"
} as const satisfies BrandConfig;
