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

const name = "Square One Motors";
const shortName = "Square One Motors";
const city = "Birmingham";
const addressLine = "Tameside Way, Birmingham B42 2UB";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "",
  phoneHref: "tel:",
  addressLine,
  address: "Tameside Way, Birmingham B42 2UB",
  appointment: "Contact the dealership before visiting.",
  logo: "/dealer-brand/v2-430f237b2ede396d/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-430f237b2ede396d/logo-on-dark.webp"
} as const satisfies BrandConfig;
