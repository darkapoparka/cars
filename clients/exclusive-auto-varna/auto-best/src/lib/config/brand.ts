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
  logoLight: `/${string}`;
  logoDark: `/${string}`;
  sourceUrl: `https://${string}`;
  youtubeUrl: `https://${string}` | null;
  instagramUrl: `https://${string}` | null;
  facebookUrl: `https://${string}` | null;
};

export const brand = {
  "name": "Exclusive Auto",
  "shortName": "Exclusive Auto",
  "city": "Варна",
  "addressLine": "бул. „Цар Освободител“ 176, Възраждане 1",
  "address": "бул. „Цар Освободител“ 176, Възраждане 1, Варна",
  "phone": "0895 303 009",
  "phoneHref": "tel:+359895303009",
  "appointment": "Работното време не е публикувано. Уточнете посещението по телефона.",
  "logo": "/brand/logo-dark.png",
  "logoLight": "/brand/logo-light.png",
  "logoDark": "/brand/logo-dark.png",
  "youtubeUrl": null,
  "instagramUrl": null,
  "facebookUrl": null,
  "sourceUrl": "https://exclusiveauto.mobile.bg/"
} as const satisfies BrandConfig;
