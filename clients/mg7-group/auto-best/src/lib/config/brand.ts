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
  "name": "MG7 Group",
  "shortName": "MG7 Group",
  "city": "Бургас",
  "addressLine": "Северна промишлена зона, ул. Атанас Буров 7",
  "address": "Северна промишлена зона, ул. Атанас Буров 7, Бургас",
  "phone": "0876 277 777",
  "phoneHref": "tel:+359876277777",
  "appointment": "Работно време: потвърдете по телефона",
  "logo": "/dealer/logo-light.png",
  "youtubeUrl": "",
  "instagramUrl": "",
  "facebookUrl": ""
};
