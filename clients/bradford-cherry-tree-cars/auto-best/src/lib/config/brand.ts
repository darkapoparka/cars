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

const name = "Cherry Tree Cars Ltd";
const shortName = "Cherry Tree Cars Ltd";
const city = "Bradford, West Yorkshire";
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
  logo: "/dealer-brand/v2-c4d01a5862dcc9e1/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-c4d01a5862dcc9e1/logo-on-light.webp"
} as const satisfies BrandConfig;
