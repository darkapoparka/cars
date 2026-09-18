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

const name = "IS AUTO Varna";
const shortName = "IS AUTO";
const city = "Варна";
const addressLine = "Бизнес парк Варна, сграда B6";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/is__auto/?hl=bg",
  facebookUrl: "https://www.facebook.com/isauto1",
  phone: "0899 266 666",
  phoneHref: "tel:+359899266666",
  addressLine,
  address: "Бизнес парк Варна, сграда B6, Варна, България",
  appointment: "Понеделник–петък 09:00–18:00; събота 10:00–16:00; неделя почивен ден",
  logo: "/assets/brand/logo-on-light.webp",
  logoOnDark: "/assets/brand/logo-on-dark.webp"
} as const satisfies BrandConfig;
