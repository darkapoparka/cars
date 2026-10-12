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

const name = "Day & Night Auto Group";
const shortName = "Day & Night";
const city = "София";
const addressLine = "ул. „Атанас Манчев“ 18, Студентски град, София";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0877 733 110",
  phoneHref: "tel:+359877733110",
  addressLine,
  address: "ул. „Атанас Манчев“ 18, Студентски град, София",
  appointment: "Посещения с предварителна уговорка.",
  logo: "/dealer-brand/v2-5451a2d8ee3a85cd/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-5451a2d8ee3a85cd/logo-on-dark.webp"
} as const satisfies BrandConfig;
