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

const name = "AS Motor Group";
const shortName = "AS Motor Group";
const city = "Batley, West Yorkshire";
const addressLine = "Unit 2-3 Chopdat Industrial Estate, Soothill Lane, Batley WF17 5SS";

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
  address: "Unit 2-3 Chopdat Industrial Estate, Soothill Lane, Batley WF17 5SS",
  appointment: "Contact the dealership before visiting.",
  logo: "/dealer-brand/v2-f2490e1cd4aba515/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-f2490e1cd4aba515/logo-on-dark.webp"
} as const satisfies BrandConfig;
