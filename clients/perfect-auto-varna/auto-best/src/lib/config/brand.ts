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

const name = "Перфект Ауто";
const shortName = "Перфект Ауто";
const city = "Варна";
const addressLine = "бул. Цар Освободител 110, кв. Победа";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0888 802 226",
  phoneHref: "tel:+359888802226",
  addressLine,
  address: "бул. Цар Освободител 110, кв. Победа",
  appointment: "За работно време и оглед се обадете предварително.",
  logo: "/assets/perfect-auto/cover.png",
  logoOnDark: "/assets/perfect-auto/cover.png"
} as const satisfies BrandConfig;
