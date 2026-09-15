export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  addressLine: string;
  address: string;
  phone: string;
  phoneHref: `tel:${string}`;
  appointment: string;
  logo: `/${string}`;
  logoOnDark: `/${string}`;
  youtubeUrl: `https://${string}`;
  instagramUrl: `https://${string}`;
  facebookUrl: `https://${string}`;
};

const name = "Аутолайф";
const shortName = "Аутолайф";
const city = "Варна";
const addressLine = "ГП4, разклон за с. Тополи";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0895 766 736",
  phoneHref: "tel:+359895766736",
  addressLine,
  address: "ГП4, разклон за с. Тополи",
  appointment: "За работно време се обадете предварително.",
  logo: "/assets/autolife/wordmark.svg",
  logoOnDark: "/assets/autolife/wordmark.svg"
} as const satisfies BrandConfig;
