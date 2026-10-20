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

const name = "i1 Auto ApS";
const shortName = "i1 Auto ApS";
const city = "Варна";
const addressLine = "срещу КАТ, бул. Ян Хуняди 518";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0899820525",
  phoneHref: "tel:+359899820525",
  addressLine,
  address: "срещу КАТ, бул. Ян Хуняди 518, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-fe76ed2bfdc4a157/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-fe76ed2bfdc4a157/logo-on-dark.webp"
} as const satisfies BrandConfig;
