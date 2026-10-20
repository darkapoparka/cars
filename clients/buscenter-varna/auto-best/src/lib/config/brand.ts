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

const name = "BUS Center Bulgaria";
const shortName = "BUS Center Bulgaria";
const city = "Тополи";
const addressLine = "изход към крайезерен път";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "0888244000",
  phoneHref: "tel:+359888244000",
  addressLine,
  address: "с. Тополи, изход към крайезерен път, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-251d74845ffeba13/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-251d74845ffeba13/logo-on-dark.webp"
} as const satisfies BrandConfig;
