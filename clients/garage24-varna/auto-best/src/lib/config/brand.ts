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

const name = "Garage24";
const shortName = "Garage24";
const city = "Варна";
const addressLine = "р-н Владислав Варненчик";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "+359885580070",
  phoneHref: "tel:+359885580070",
  addressLine,
  address: "р-н Владислав Варненчик, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-cdc0f7a4b0714d7c/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-cdc0f7a4b0714d7c/logo-on-dark.webp"
} as const satisfies BrandConfig;
