export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  showroomCoordinates: { latitude: number; longitude: number };
  addressLine: string;
  address: string;
  phone: string;
  phoneHref: `tel:${string}`;
  appointment: string;
  logo: `/${string}`;
  logoOnDark: `/${string}`;
  youtubeUrl: `https://${string}` | '';
  instagramUrl: `https://${string}`;
  facebookUrl: `https://${string}`;
};

const name = "Motors Castle";
const shortName = "Motors Castle";
const city = "Cleland / Motherwell, Scotland";
const addressLine = "23a Biggar Road, Cleland Industrial Estate, Motherwell ML1 5PB";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: {"latitude":0,"longitude":0},
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "07850 472427",
  phoneHref: "tel:+447850472427",
  addressLine,
  address: "23a Biggar Road, Cleland Industrial Estate, Motherwell ML1 5PB",
  appointment: "Contact the dealership before visiting.",
  logo: "/dealer-brand/logo.webp",
  logoOnDark: "/dealer-brand/logo.webp"
} as const satisfies BrandConfig;
