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

const name = "КАЛО КАРС";
const shortName = "КАЛО КАРС";
const city = "Варна";
const addressLine = "до кръстовището на бул. Цар Освободител и бул. Константин и Фружин, под Джъмбо";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0876055588",
  phoneHref: "tel:+359876055588",
  addressLine,
  address: "до кръстовището на бул. Цар Освободител и бул. Константин и Фружин, под Джъмбо, Варна, България",
  appointment: "Понеделник–събота 09:00–17:30; неделя почивен ден.",
  logo: "/dealer-brand/v2-6e825dd569a75b95/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-6e825dd569a75b95/logo-on-dark.webp"
} as const satisfies BrandConfig;
