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

const name = "Broadbent Car and Servicing";
const shortName = "Broadbent Car and Servicing";
const city = "Bredbury, Stockport";
const addressLine = "Oldmoor Road, Bredbury, Stockport SK6 2QE";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "07398 540293",
  phoneHref: "tel:+447398540293",
  addressLine,
  address: "Oldmoor Road, Bredbury, Stockport SK6 2QE",
  appointment: "Contact the dealership before visiting.",
  logo: "/dealer-brand/v2-cf2c5199092708bd/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-cf2c5199092708bd/logo-on-dark.webp"
} as const satisfies BrandConfig;
