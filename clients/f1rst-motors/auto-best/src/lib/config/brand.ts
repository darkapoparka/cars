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

const name = "F1rst Motors";
const shortName = "F1rst Motors";
const city = "Dubai";
const addressLine = "Danube Building - 409 Sheikh Zayed Rd - Al Quoz 1";

export const brand = {
  name,
  shortName,
  city,
  showroomCoordinates: {"latitude":0,"longitude":0},
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "+971 4 320 1030",
  phoneHref: "tel:+97143201030",
  addressLine,
  address: "Danube Building - 409 Sheikh Zayed Rd - Al Quoz - Al Quoz 1 - Dubai, UAE",
  appointment: "Mon-Thu 10:00-21:00; Friday 14:00-21:00; Saturday 10:00-21:00; Sunday Closed",
  logo: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
