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

const name = "ФЮЖЪН АУТО";
const shortName = "ФЮЖЪН АУТО";
const city = "Варна";
const addressLine = "Пътя за село Тополи, 200 м след Темпо Бетони в ляво, зад Автосервиз и ГТП Тандем";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0879888461\r\n0883374712",
  phoneHref: "tel:+359879888461",
  addressLine,
  address: "Пътя за село Тополи, 200 м след Темпо Бетони в ляво, зад Автосервиз и ГТП Тандем, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-d598a334d4a2a896/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-d598a334d4a2a896/logo-on-dark.webp"
} as const satisfies BrandConfig;
