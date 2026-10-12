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

const name = "Kalchev Correct";
const shortName = "Kalchev Correct";
const city = "Варна";
const addressLine = "пътя за Побитите камъни, на 200 метра от разклона за с.Тополи, отляво";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0879699644",
  phoneHref: "tel:+359879699644",
  addressLine,
  address: "пътя за Побитите камъни, на 200 метра от разклона за с.Тополи, отляво, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-f39ea5a561358052/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-f39ea5a561358052/logo-on-dark.webp"
} as const satisfies BrandConfig;
