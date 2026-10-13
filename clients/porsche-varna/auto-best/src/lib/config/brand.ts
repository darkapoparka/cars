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

const name = "Porsche Varna";
const shortName = "Porsche Varna";
const city = "Варна";
const addressLine = "ул. Ян Хуниади 2";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: null,
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  phone: "052 59 80 10",
  phoneHref: "tel:+35952598010",
  addressLine,
  address: "ул. Ян Хуниади 2, Варна, България",
  appointment: "Потвърдете работното време директно с автокъщата.",
  logo: "/dealer-brand/v2-a51523c9c6d92684/logo-on-light.webp",
  logoOnDark: "/dealer-brand/v2-a51523c9c6d92684/logo-on-dark.webp"
} as const satisfies BrandConfig;
