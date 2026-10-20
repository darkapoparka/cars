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

const name = "Trade Car Sales";
const shortName = "Trade Car Sales";
const city = "Birmingham";
const addressLine = "";

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
  address: "",
  appointment: "Contact the dealership before visiting.",
  logo: "/dealer-brand/v2-7a49c5599de5a3d4/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-7a49c5599de5a3d4/logo-on-dark.webp"
} as const satisfies BrandConfig;
