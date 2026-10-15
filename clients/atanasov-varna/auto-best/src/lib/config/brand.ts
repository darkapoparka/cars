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

const name = "Атанасов";
const shortName = "Атанасов";
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
  phone: "0988 864 133",
  phoneHref: "tel:+359988864133",
  addressLine,
  address: "Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-a25dcfac332aebce/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-a25dcfac332aebce/logo-on-dark.webp"
} as const satisfies BrandConfig;
