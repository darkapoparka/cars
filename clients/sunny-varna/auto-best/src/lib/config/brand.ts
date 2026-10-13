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

const name = "СЪНИ";
const shortName = "СЪНИ";
const city = "Варна";
const addressLine = "бул. „Цар Освободител“ 256, Кайсиева градина";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0898 644 464",
  phoneHref: "tel:+359898644464",
  addressLine,
  address: "бул. „Цар Освободител“ 256, Кайсиева градина, Варна",
  appointment: "Всеки ден 08:00–19:00 — потвърдете преди посещение",
  logo: "/registered-branding/onLight.png",
  logoOnDark: "/registered-branding/onDark.png"
} as const satisfies BrandConfig;
