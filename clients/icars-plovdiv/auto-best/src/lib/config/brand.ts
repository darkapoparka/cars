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
  youtubeUrl: string;
  instagramUrl: string;
  facebookUrl: string;
};


export const brand: BrandConfig = {
  "name": "icars",
  "shortName": "icars",
  "city": "Пловдив",
  "addressLine": "ул. Напредък 1, Индустриална зона — Север",
  "address": "ул. Напредък 1, Индустриална зона — Север, Пловдив",
  "phone": "0885 595 555",
  "phoneHref": "tel:+359885595555",
  "appointment": "Оглед с предварителна уговорка. Работно време: потвърдете по телефона.",
  "logo": "/dealer/logo-light.png",
  "youtubeUrl": "",
  "instagramUrl": "",
  "facebookUrl": ""
};
