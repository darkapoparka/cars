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

const name = "РИЧИ КАР";
const shortName = "РИЧИ КАР";
const city = "Варна";
const addressLine = "Варна, България";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0895636226",
  phoneHref: "tel:+359895636226",
  addressLine,
  address: "Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-07ef9cbabd10f2d4/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-07ef9cbabd10f2d4/logo-on-dark.webp"
} as const satisfies BrandConfig;
