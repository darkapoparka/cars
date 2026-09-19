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

const name = "OUTLETCARS.BG — Варна";
const shortName = "OUTLETCARS.BG";
const city = "Варна";
const addressLine = "бул. Янош Хуняди 518, срещу КАТ Варна";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0898 921 010",
  phoneHref: "tel:+359898921010",
  addressLine,
  address: "бул. Янош Хуняди 518, срещу КАТ Варна, Варна, България",
  appointment: "Пон.–пет. 08:30–17:30; съб.–нед. почивни дни",
  logo: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
