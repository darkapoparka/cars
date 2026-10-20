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

const name = "Multi ZaZa";
const shortName = "Multi ZaZa";
const city = "Варна";
const addressLine = "ул. Райко Жинзифов";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0887236046",
  phoneHref: "tel:+359887236046",
  addressLine,
  address: "ул. Райко Жинзифов, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-f55c0eea45d015df/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-f55c0eea45d015df/logo-on-dark.webp"
} as const satisfies BrandConfig;
