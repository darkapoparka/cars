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

const name = "The Dealers Point";
const shortName = "Dealers Point";
const city = "Dubai";
const addressLine = "Plot No. 364-0442, Al Quoz Industrial Area 1";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "+971 55 187 5094",
  phoneHref: "tel:+971551875094",
  addressLine,
  address: "Plot No. 364-0442, Al Quoz Industrial Area 1, Dubai, UAE",
  appointment: "Contact the dealership before visiting.",
  logo: "/dealer-brand/v2-2e9ab7c9bd6ca568/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-2e9ab7c9bd6ca568/logo-on-dark.webp"
} as const satisfies BrandConfig;
