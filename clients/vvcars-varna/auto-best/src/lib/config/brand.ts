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

const name = "VV Cars";
const shortName = "VV Cars";
const city = "Варна";
const addressLine = "Бул. Цар Освободител - 200 метра след светофара на Дом на камиона - отдясно";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0898 554 198",
  phoneHref: "tel:+359898554198",
  addressLine,
  address: "Бул. Цар Освободител - 200 метра след светофара на Дом на камиона - отдясно, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-7799f0a33cba3a3e/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-7799f0a33cba3a3e/logo-on-dark.webp"
} as const satisfies BrandConfig;
