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

const name = "North Norfolk Car Sales";
const shortName = "North Norfolk Car Sales";
const city = "North Walsham, Norfolk";
const addressLine = "Unit 3 Midland Road, North Walsham NR28 9JR";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "01263 653055",
  phoneHref: "tel:+441263653055",
  addressLine,
  address: "Unit 3 Midland Road, North Walsham NR28 9JR",
  appointment: "Contact the dealership before visiting.",
  logo: "/dealer-brand/v2-1cd3fb6dc67c1653/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-1cd3fb6dc67c1653/logo-on-dark.webp"
} as const satisfies BrandConfig;
