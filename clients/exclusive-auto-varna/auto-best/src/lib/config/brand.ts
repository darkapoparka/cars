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

const name = "Exclusive Auto";
const shortName = "Exclusive Auto";
const city = "Варна";
const addressLine = "бул. „Цар Освободител“ 176, Възраждане 1";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0895 303 009",
  phoneHref: "tel:+359895303009",
  addressLine,
  address: "бул. „Цар Освободител“ 176, Възраждане 1, Варна",
  appointment: "Работното време не е публикувано. Уточнете посещението по телефона.",
  logo: "/registered-branding/onLight.png",
  logoOnDark: "/registered-branding/onDark.png"
} as const satisfies BrandConfig;
