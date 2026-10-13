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

const name = "BORA CAR";
const shortName = "BORA CAR";
const city = "Варна";
const addressLine = "ж.к. Вл. Варненчик, ул. Янко Мустаков, срещу бл. 303, вх.15, спирка Вихрен";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "00359896699974",
  phoneHref: "tel:+359896699974",
  addressLine,
  address: "ж.к. Вл. Варненчик, ул. Янко Мустаков, срещу бл. 303, вх.15, спирка Вихрен, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-e98f380293081082/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-e98f380293081082/logo-on-dark.webp"
} as const satisfies BrandConfig;
