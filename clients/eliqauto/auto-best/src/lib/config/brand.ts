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

const name = "ELIQ AUTO";
const shortName = "ELIQ AUTO";
const city = "Пазарджик";
const addressLine = "ул. Свобода, на гърба на Гробищен парк";

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: "https://www.youtube.com/channel/UCGXhr1QYqALiBBQpBYZtpmw",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  phone: "0896 781 662",
  phoneHref: "tel:+359896781662",
  addressLine,
  address: "ул. Свобода, на гърба на Гробищен парк, Пазарджик",
  appointment: "Пон.–пет. 09:30–19:00 · Съб.–нед. 09:30–17:00 · Потвърдете огледа по телефона",
  logo: "/dealer-brand/logo-on-light-20260919.webp",
  logoOnDark: "/dealer-brand/logo-on-dark-20260919.webp"
} as const satisfies BrandConfig;
