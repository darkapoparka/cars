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
  phone: "+359877346262",
  phoneHref: "tel:+359877346262",
  addressLine,
  address: "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
  appointment: "Работното време не е публикувано. Потвърдете по телефона преди посещение.",
  logo: "/assets/brand/logo-on-light.webp",
  logoOnDark: "/assets/brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
