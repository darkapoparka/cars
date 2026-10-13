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

const name = "Part Mag Cars";
const shortName = "Part Mag Cars";
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
  phone: "0899960605, 0897906712",
  phoneHref: "tel:+359899960605",
  addressLine,
  address: "гр. Варна, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-81b6e67e9ab3e82b/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-81b6e67e9ab3e82b/logo-on-dark.webp"
} as const satisfies BrandConfig;
