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

const name = "K-G Team Auto";
const shortName = "K-G Team Auto";
const city = "Пловдив";
const addressLine = "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "",
  phoneHref: "tel:",
  addressLine,
  address: "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
  appointment: "Работното време не е публикувано. Потвърдете по телефона преди посещение.",
  logo: "/dealer/logo.png",
  logoOnDark: "/dealer/logo-light.png"
} as const satisfies BrandConfig;
