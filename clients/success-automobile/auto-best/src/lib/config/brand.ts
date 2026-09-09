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
  "name": "Success Automobile",
  "shortName": "Success",
  "city": "Пловдив",
  "addressLine": "Цариградско шосе, Индустриална зона — Тракия",
  "address": "Цариградско шосе, Индустриална зона — Тракия, Пловдив",
  "phone": "0877 333 433",
  "phoneHref": "tel:+359877333433",
  "appointment": "Работно време: потвърдете по телефона",
  "logo": "/dealer/logo-light.png",
  "youtubeUrl": "",
  "instagramUrl": "",
  "facebookUrl": ""
};
