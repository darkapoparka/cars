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

const name = "AUTOROAD";
const shortName = "AUTOROAD";
const city = "Варна";
const addressLine = "бул. Трети Март 22 Б";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "+359899230001",
  phoneHref: "tel:+359899230001",
  addressLine,
  address: "бул. Трети Март 22 Б, Варна, България",
  appointment: "Понеделник–петък 09:00–17:00; събота 10:00–14:00; неделя почивен ден. Извън работно време — с предварителна уговорка.",
  logo: "/dealer-brand/v2-d83e7e609c001f98/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-d83e7e609c001f98/logo-on-dark.webp"
} as const satisfies BrandConfig;
