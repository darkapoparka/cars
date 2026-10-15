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

const name = "ЕКСПРЕС АУТО";
const shortName = "ЕКСПРЕС АУТО";
const city = "Варна";
const addressLine = "бул.Цар Освободител 311";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0888885453",
  phoneHref: "tel:+359888885453",
  addressLine,
  address: "бул.Цар Освободител 311, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-f4ec2652e550cb3d/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-f4ec2652e550cb3d/logo-on-dark.webp"
} as const satisfies BrandConfig;
